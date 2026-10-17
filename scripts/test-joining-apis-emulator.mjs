import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const DEMO='demo-cs-master', PORT=3127, BASE=`http://127.0.0.1:${PORT}`;
for(const [key,value] of Object.entries({FIRESTORE_EMULATOR_HOST:'127.0.0.1:8080',FIREBASE_AUTH_EMULATOR_HOST:'127.0.0.1:9099',GCLOUD_PROJECT:DEMO})) assert.equal(process.env[key],value,`Unsafe test environment: ${key}`);
assert.equal(process.env.CSMASTER_JOIN_TEST_APPROVED,'YES','Set CSMASTER_JOIN_TEST_APPROVED=YES');
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
 const schoolId=`${runId}-school`, otherId=`${runId}-other`,classId=`${runId}-class`,classCode='JOIN123456',schoolCode='SCHOOL123456';
 const s1=await signup('classstudent'),s2=await signup('schoolstudent'),s3=await signup('otherstudent'),teacher=await signup('teacher'),s4=await signup('strictstudent');
 await db.collection('schools').doc(schoolId).set({name:'Emulator Test School',status:'active'});
 await db.collection('schools').doc(otherId).set({name:'Other School',status:'active'});
 for(const [u,role,school] of [[s1,'student',''],[s2,'student',''],[s3,'student',otherId],[teacher,'teacher',schoolId],[s4,'student','']])await db.collection('users').doc(u.uid).set({email:u.email,name:u.email,role,schoolId:school,classIds:[],accountType:'individual'});
 await db.collection('classes').doc(classId).set({name:'Test Class',schoolId,teacherId:teacher.uid,status:'active',joinCode:classCode,joinCodeEnabled:true,studentIds:[],students:[]});
 await db.collection('schoolInvites').doc(schoolCode).set({schoolId,role:'student',status:'active'});
 await start('off');
 expectStatus(await call('/api/classes/join',null,classCode),401,'Class join requires authentication');
 expectStatus(await call('/api/classes/join',s1,'bad'),400,'Invalid class code format rejected');
 expectStatus(await call('/api/classes/join',s1,'UNKNOWN123'),404,'Unknown class code rejected');
 expectStatus(await call('/api/classes/join',teacher,classCode),403,'Teacher cannot join class as student');
 expectStatus(await call('/api/classes/join',s3,classCode),409,'Cross-school class join rejected');
 expectStatus(await call('/api/classes/join',s1,classCode),200,'Valid class code joins class and school');
 const c=await db.collection('classes').doc(classId).get(),u=await db.collection('users').doc(s1.uid).get(),m=await db.collection('schools').doc(schoolId).collection('members').doc(s1.uid).get();
 assert.ok(c.data().studentIds.includes(s1.uid));assert.ok(u.data().classIds.includes(classId));assert.equal(u.data().schoolId,schoolId);assert.equal(m.data().status,'active');pass('Class, user and school membership records consistent');
 expectStatus(await call('/api/classes/join',s1,classCode),200,'Repeated class join is idempotent');
 expectStatus(await call('/api/schools/join',null,schoolCode),401,'School join requires authentication');
 expectStatus(await call('/api/schools/join',s2,'UNKNOWN123'),404,'Unknown school invite rejected');
 expectStatus(await call('/api/schools/join',s3,schoolCode),409,'Cross-school school join rejected');
 expectStatus(await call('/api/schools/join',s2,schoolCode),200,'Valid school invite accepted');
 const u2=await db.collection('users').doc(s2.uid).get(),m2=await db.collection('schools').doc(schoolId).collection('members').doc(s2.uid).get();assert.equal(u2.data().schoolId,schoolId);assert.equal(m2.data().status,'active');pass('School membership records consistent');
 expectStatus(await call('/api/schools/join',s4,schoolCode),409,'Used school invite cannot be reused');
 // Strict mode needs a fresh server process and clean dev lock. Run as a separate invocation.
 console.log(`\nALL ${passed} JOINING API TESTS PASSED (EMULATOR ONLY, BILLING OFF).`);
 console.log('NOT COVERED: strict billing enforcement, seat limits, school leaving, browser markbook visibility.');
}
try{await main()}catch(e){console.error('\nJOINING API TEST FAILED:',e);process.exitCode=1}finally{if(server){if(process.platform==='win32'){spawn('taskkill',['/pid',String(server.pid),'/t','/f'],{stdio:'ignore'}).on('error',()=>{})}else server.kill('SIGTERM');await sleep(1200)}}
