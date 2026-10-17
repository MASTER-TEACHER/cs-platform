import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const DEMO='demo-cs-master', PORT=3131, BASE=`http://127.0.0.1:${PORT}`;
for(const [key,value] of Object.entries({FIRESTORE_EMULATOR_HOST:'127.0.0.1:8080',FIREBASE_AUTH_EMULATOR_HOST:'127.0.0.1:9099',GCLOUD_PROJECT:DEMO})) assert.equal(process.env[key],value,`Unsafe test environment: ${key}`);
assert.equal(process.env.CSMASTER_STRICT_BILLING_TEST_APPROVED,'YES','Set CSMASTER_STRICT_BILLING_TEST_APPROVED=YES');
const db=getFirestore(initializeApp({projectId:DEMO}));
const runId=`join-${Date.now()}`;
let passed=0, server;
function pass(message){console.log(`PASS ${++passed}: ${message}`)}
async function signup(label){const email=`${label}-${runId}@example.test`;const r=await fetch('http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=emulator-key',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,password:'EmulatorOnly!12345',returnSecureToken:true})});const j=await r.json();assert.equal(r.status,200,JSON.stringify(j));return {uid:j.localId,token:j.idToken,email}}
async function call(path,actor,code){const r=await fetch(`${BASE}${path}`,{method:'POST',headers:{'content-type':'application/json',...(actor?{authorization:`Bearer ${actor.token}`}:{})},body:JSON.stringify({code})});return {status:r.status,body:await r.json()}}
function expectStatus(r,status,label){assert.equal(r.status,status,`${label}: ${JSON.stringify(r.body)}`);pass(label)}
async function ready(){for(let i=0;i<60;i++){if(server.exitCode!==null)throw new Error(`Next server exited: ${server.exitCode}`);try{const r=await fetch(`${BASE}/api/classes/join`,{method:'POST',headers:{'content-type':'application/json'},body:'{}'});if(r.status===401)return}catch{}await sleep(1000)}throw new Error('Next server not ready')}
async function start(mode){try{await fetch(`${BASE}/api/classes/join`);throw new Error(`Port ${PORT} already in use; stop its server before testing`)}catch(e){if(String(e.message).includes('already in use'))throw e}
 const env={...process.env,NEXT_PUBLIC_FIREBASE_USE_EMULATORS:'true',NEXT_PUBLIC_FIREBASE_PROJECT_ID:DEMO,FIREBASE_ADMIN_PROJECT_ID:DEMO,BILLING_ENFORCEMENT_MODE:mode,CSMASTER_ENABLE_EMULATOR_CLASS_DELETE:'false'};
 server=process.platform==='win32'?spawn('cmd.exe',['/d','/s','/c',`npm run dev -- -p ${PORT}`],{env,stdio:'inherit',windowsHide:true}):spawn('npm',['run','dev','--','-p',String(PORT)],{env,stdio:'inherit'});await ready();}
async function main(){
 const schoolId=`${runId}-school`, classId=`${runId}-class`, classCode='STRICT1234';
 const noSub=await signup('nosub'), full=await signup('full'), allowed=await signup('allowed'), inviteStudent=await signup('invite');
 const teacher=await signup('teacher');
 await db.collection('schools').doc(schoolId).set({name:'Strict Billing Test School',status:'active'});
 for(const [u,role] of [[noSub,'student'],[full,'student'],[allowed,'student'],[inviteStudent,'student'],[teacher,'teacher']]){
   await db.collection('users').doc(u.uid).set({email:u.email,name:u.email,role,schoolId:role==='teacher'?schoolId:'',classIds:[],accountType:'individual'});
 }
 await db.collection('classes').doc(classId).set({name:'Strict Test Class',schoolId,teacherId:teacher.uid,status:'active',joinCode:classCode,joinCodeEnabled:true,studentIds:[],students:[]});
 await db.collection('schoolInvites').doc('STRICTSCHOOL1').set({schoolId,role:'student',status:'active'});
 await start('strict');
 expectStatus(await call('/api/classes/join',noSub,classCode),402,'Class join denied without active school subscription');
 expectStatus(await call('/api/schools/join',inviteStudent,'STRICTSCHOOL1'),402,'School invite denied without active subscription');
 await db.collection('schoolSubscriptions').doc(schoolId).set({status:'active',planKey:'starter',seatLimit:0,billingAccessBlocked:false});
 expectStatus(await call('/api/classes/join',full,classCode),409,'Class join denied when seat limit is zero');
 expectStatus(await call('/api/schools/join',inviteStudent,'STRICTSCHOOL1'),409,'School invite denied when seat limit is zero');
 await db.collection('schoolSubscriptions').doc(schoolId).update({seatLimit:3});
 expectStatus(await call('/api/classes/join',allowed,classCode),200,'Class join succeeds with active subscription and spare seat');
 const member=await db.collection('schools').doc(schoolId).collection('members').doc(allowed.uid).get();
 assert.equal(member.data()?.status,'active');pass('Successful strict-mode join persists school membership');
 expectStatus(await call('/api/schools/join',inviteStudent,'STRICTSCHOOL1'),200,'School invite succeeds with active subscription and spare seat');
 const student=await db.collection('users').doc(inviteStudent.uid).get();assert.equal(student.data()?.schoolId,schoolId);pass('Successful strict-mode invite persists student school');
 await db.collection('schoolSubscriptions').doc(schoolId).update({billingAccessBlocked:true});
 const blocked=await signup('blocked');await db.collection('users').doc(blocked.uid).set({email:blocked.email,name:blocked.email,role:'student',schoolId:'',classIds:[]});
 expectStatus(await call('/api/classes/join',blocked,classCode),402,'Class join denied for billing-blocked subscription');
 console.log(`\nALL ${passed} STRICT BILLING TESTS PASSED (DEMO EMULATOR ONLY).`);
 console.log('NOT COVERED: concurrent seat-limit races, school leaving, browser acceptance.');
}
try{await main()}catch(e){console.error('\nSTRICT BILLING TEST FAILED:',e);process.exitCode=1}finally{if(server){if(process.platform==='win32'){spawn('taskkill',['/pid',String(server.pid),'/t','/f'],{stdio:'ignore'}).on('error',()=>{})}else server.kill('SIGTERM');await sleep(1200)}}
