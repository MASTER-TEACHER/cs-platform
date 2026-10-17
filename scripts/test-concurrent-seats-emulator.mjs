import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { initializeApp, deleteApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const project = 'demo-cs-master', port = 3135, base = `http://127.0.0.1:${port}`;
for (const [key,value] of Object.entries({FIRESTORE_EMULATOR_HOST:'127.0.0.1:8080',FIREBASE_AUTH_EMULATOR_HOST:'127.0.0.1:9099',GCLOUD_PROJECT:project})) assert.equal(process.env[key],value,`Unsafe environment: ${key}`);
assert.equal(process.env.CSMASTER_CONCURRENCY_TEST_APPROVED,'YES');
const app = initializeApp({projectId:project},`seat-${Date.now()}`), db = getFirestore(app);
const runId = `seat-${Date.now()}`;
let server;
async function signup(label) {
 const email=`${runId}-${label}@example.test`;
 const r=await fetch('http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=emulator-key',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,password:'EmulatorOnly!12345',returnSecureToken:true})});
 const j=await r.json(); assert.equal(r.status,200,JSON.stringify(j));return {uid:j.localId,token:j.idToken,email};
}
async function join(actor,code){const r=await fetch(`${base}/api/classes/join`,{method:'POST',headers:{authorization:`Bearer ${actor.token}`,'content-type':'application/json'},body:JSON.stringify({code})});return {status:r.status,body:await r.json()};}
async function main(){
 const schoolId=`${runId}-school`,classId=`${runId}-class`,code='RACE123456';
 const [a,b,teacher]=await Promise.all([signup('a'),signup('b'),signup('teacher')]);
 await db.doc(`schools/${schoolId}`).set({name:'Race Test School',status:'active'});
 await db.doc(`schoolSubscriptions/${schoolId}`).set({status:'active',planKey:'starter',seatLimit:1,billingAccessBlocked:false});
 for(const [user,role] of [[a,'student'],[b,'student'],[teacher,'teacher']]) await db.doc(`users/${user.uid}`).set({name:user.email,email:user.email,role,schoolId:role==='teacher'?schoolId:'',classIds:[],accountType:'individual'});
 await db.doc(`classes/${classId}`).set({name:'Race Test',schoolId,status:'active',teacherId:teacher.uid,joinCode:code,joinCodeEnabled:true,studentIds:[],students:[]});
 const env={...process.env,NEXT_PUBLIC_FIREBASE_USE_EMULATORS:'true',NEXT_PUBLIC_FIREBASE_PROJECT_ID:project,FIREBASE_ADMIN_PROJECT_ID:project,BILLING_ENFORCEMENT_MODE:'strict'};
 server=process.platform==='win32'?spawn('cmd.exe',['/d','/s','/c',`npm run dev -- -p ${port}`],{env,stdio:'inherit',windowsHide:true}):spawn('npm',['run','dev','--','-p',String(port)],{env,stdio:'inherit'});
 let ready=false;for(let i=0;i<90;i++){if(server.exitCode!==null)throw new Error('Next dev server exited');try{const r=await fetch(`${base}/api/classes/join`,{method:'POST',headers:{'content-type':'application/json'},body:'{}'});if(r.status===401){ready=true;break}}catch{}await sleep(1000)}assert.ok(ready,'Server not ready');
 const responses=await Promise.all([join(a,code),join(b,code)]);
 console.log('Concurrent responses:',responses);
 assert.equal(responses.filter(x=>x.status===200).length,1,'Exactly one student should join');
 assert.equal(responses.filter(x=>x.status===409).length,1,'Second student must be denied due to seat limit');
 const users=await db.collection('users').where('schoolId','==',schoolId).where('role','==','student').get();
 assert.equal(users.size,1,'Seat count must never exceed one');
 console.log('PASS: Concurrent joining respects one available seat (demo emulator only).');
}
try{await main()}catch(e){console.error('CONCURRENT SEAT TEST FAILED',e);process.exitCode=1}finally{if(server){if(process.platform==='win32')spawn('taskkill',['/pid',String(server.pid),'/t','/f'],{stdio:'ignore'}).on('error',()=>{});else server.kill('SIGTERM');await sleep(1200)}await deleteApp(app)}
