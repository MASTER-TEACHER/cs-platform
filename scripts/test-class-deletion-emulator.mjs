import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const DEMO='demo-cs-master';
const BASE='http://127.0.0.1:3107';
const FIRESTORE='127.0.0.1:8080';
const AUTH='127.0.0.1:9099';
const required={FIRESTORE_EMULATOR_HOST:FIRESTORE,FIREBASE_AUTH_EMULATOR_HOST:AUTH,GCLOUD_PROJECT:DEMO};
for(const [k,v] of Object.entries(required)) assert.equal(process.env[k],v,`Unsafe/missing ${k}`);
assert.equal(process.env.CSMASTER_CLASS_DELETE_TEST_APPROVED,'YES', 'Explicit test approval required');
const env={...process.env,NEXT_PUBLIC_FIREBASE_USE_EMULATORS:'true',NEXT_PUBLIC_FIREBASE_PROJECT_ID:DEMO,FIREBASE_ADMIN_PROJECT_ID:DEMO,FIRESTORE_EMULATOR_HOST:FIRESTORE,FIREBASE_AUTH_EMULATOR_HOST:AUTH,CSMASTER_ENABLE_EMULATOR_CLASS_DELETE:'true'};
const app=initializeApp({projectId:DEMO});
const db=getFirestore(app);
const runId=`delete-test-${Date.now()}`;
const classA=`${runId}-a`,classB=`${runId}-b`,schoolId=`${runId}-school`;
let server;
let passed=0;
function pass(s){passed++;console.log(`PASS ${passed}: ${s}`)}
async function signup(label){
 const email=`${label}-${runId}@example.test`,password='EmulatorOnly!12345';
 const res=await fetch(`http://${AUTH}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=emulator-key`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,password,returnSecureToken:true})});
 const data=await res.json();assert.equal(res.status,200,`Auth emulator signup failed: ${JSON.stringify(data)}`);
 return {uid:data.localId,token:data.idToken,email};
}
async function write(collection,id,data){await db.collection(collection).doc(id).set(data)}
async function exists(collection,id){return (await db.collection(collection).doc(id).get()).exists}
async function request(method,classId,token,body){const res=await fetch(`${BASE}/api/classes/${classId}/delete`,{method,headers:{...(token?{authorization:`Bearer ${token}`}:{}) ,...(body?{'content-type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});let json;try{json=await res.json()}catch{json={}}return {status:res.status,body:json}}
async function waitForServer(){for(let i=0;i<100;i++){if(server.exitCode!==null)throw new Error(`Next.js exited early: ${server.exitCode}`);try{const r=await fetch(`${BASE}/api/classes/${classA}/delete`);if(r.status!==404 || r.status===503)return;}catch{}await sleep(1000)}throw new Error('Next.js did not start on port 3107')}
async function main(){
 const teacher=await signup('owner'),outsider=await signup('outsider'),student=await signup('student');
 await write('users',teacher.uid,{role:'teacher',schoolId,email:teacher.email});
 await write('users',outsider.uid,{role:'teacher',schoolId,email:outsider.email});
 await write('users',student.uid,{role:'student',schoolId,email:student.email,classIds:[classA,classB],xp:777,streak:12});
 await write('classes',classA,{name:'Deletion Test Class A',teacherId:teacher.uid,schoolId,status:'archived',studentIds:[student.uid],assignmentIds:[`${runId}-assignment-a`]});
 await write('classes',classB,{name:'Preserved Test Class B',teacherId:teacher.uid,schoolId,status:'active',studentIds:[student.uid]});
 const assignmentA=`${runId}-assignment-a`,assignmentB=`${runId}-assignment-b`;
 for(const name of ['assignments','classAssignments','examAssignments']){
  await write(name,`${runId}-${name}-a`,{classId:classA,studentId:student.uid});
  await write(name,`${runId}-${name}-b`,{classId:classB,studentId:student.uid});
 }
 await write('assignments',assignmentA,{classId:classA});
 await write('assignments',assignmentB,{classId:classB});
 for(const name of ['assignmentProgress','assignmentResults','examSubmissions','examSubmissionAttemptHistory']){
  await write(name,`${runId}-${name}-a`,{assignmentId:assignmentA,studentId:student.uid});
  await write(name,`${runId}-${name}-b`,{assignmentId:assignmentB,studentId:student.uid});
 }
 await write('interventions',`${runId}-intervention-a`,{classId:classA});
 await write('interventions',`${runId}-intervention-b`,{classId:classB});
 await write('studentTargets',`${runId}-target-a`,{classId:classA,studentId:student.uid});
 await write('studentTargets',`${runId}-target-b`,{classId:classB,studentId:student.uid});
 await write('studentTargets',student.uid,{target:90,studentId:student.uid});
 await write('quizAttempts',`${runId}-independent`,{studentId:student.uid,score:100});
 await write('quizAttempts',`${runId}-class-attempt`,{classId:classA,assignmentId:assignmentA,uid:student.uid,status:'completed'});
 await write('quizAttempts',`${runId}-other-class-attempt`,{classId:classB,assignmentId:assignmentB,uid:student.uid,status:'completed'});
 await write('quizAttempts',`${runId}-legacy-attempt`,{assignmentId:assignmentA,uid:student.uid,status:'completed'});
 await write('quizAttempts',`${runId}-independent-other`,{uid:student.uid,score:98});
 server=spawn('npm.cmd',['run','dev','--','-p','3107'],{env,stdio:'inherit',shell:true});
 await waitForServer();
 let r=await request('DELETE',classA,null,{confirmation:'Deletion Test Class A'});assert.equal(r.status,401,JSON.stringify(r));pass('Authentication required');
 r=await request('DELETE',classA,outsider.token,{confirmation:'Deletion Test Class A'});assert.equal(r.status,403,JSON.stringify(r));pass('Non-owner denied');
 r=await request('DELETE',classA,teacher.token,{confirmation:'WRONG'});assert.equal(r.status,400,JSON.stringify(r));pass('Typed class-name confirmation required');
 r=await request('DELETE',classB,teacher.token,{confirmation:'Preserved Test Class B'});assert.equal(r.status,409,JSON.stringify(r));pass('Active class cannot be deleted');
 r=await request('GET',classA,teacher.token);assert.equal(r.status,200,JSON.stringify(r));pass('Authenticated preview works');
 r=await request('DELETE',classA,teacher.token,{confirmation:'Deletion Test Class A'});assert.equal(r.status,200,JSON.stringify(r));assert.equal(r.body.ok,true);pass('Archived class deleted');
 assert.equal(await exists('classes',classA),false);assert.equal(await exists('classes',classB),true);pass('Target class removed, other class preserved');
 for(const name of ['assignments','classAssignments','examAssignments','assignmentProgress','assignmentResults','examSubmissions','examSubmissionAttemptHistory','interventions','studentTargets']){
  assert.equal(await exists(name,`${runId}-${name === "interventions" ? "intervention" : name === "studentTargets" ? "target" : name}-a`),false,`${name} class A remained`);
  assert.equal(await exists(name,`${runId}-${name === "interventions" ? "intervention" : name === "studentTargets" ? "target" : name}-b`),true,`${name} class B removed`);
 }
 assert.equal(await exists('assignments',assignmentA),false);assert.equal(await exists('assignments',assignmentB),true);pass('All owned collections and linked legacy records cleaned, other class preserved');
 assert.equal(await exists('studentTargets',student.uid),true);assert.equal(await exists('quizAttempts',`${runId}-independent`),true);pass('Shared student target and independent quiz preserved');
 assert.equal(await exists('quizAttempts',`${runId}-class-attempt`),false);assert.equal(await exists('quizAttempts',`${runId}-legacy-attempt`),false);assert.equal(await exists('quizAttempts',`${runId}-other-class-attempt`),true);assert.equal(await exists('quizAttempts',`${runId}-independent-other`),true);pass('Class-linked quiz attempts removed; other-class and independent attempts preserved');
 const user=(await db.collection('users').doc(student.uid).get()).data();assert.deepEqual(user.classIds,[classB]);assert.equal(user.xp,777);assert.equal(user.streak,12);pass('Student account, other membership, XP and streak preserved');
 const audit=(await db.collection('classDeletionAudit').doc(classA).get()).data();assert.equal(audit?.state,'completed');assert.equal(audit?.emulatorOnly,true);pass('Persistent completed audit retained');
 // Simulate an interrupted deletion with an expired lease; the class is already in deleting state.
 const retryId=`${runId}-retry`;
 await write('classes',retryId,{name:'Interrupted Class',teacherId:teacher.uid,schoolId,status:'deleting',studentIds:[student.uid]});
 await write('classDeletionAudit',retryId,{state:'running',leaseUntil:Date.now()-1000,emulatorOnly:true});
 await write('interventions',`${runId}-retry-record`,{classId:retryId});
 r=await request('DELETE',retryId,teacher.token,{confirmation:'Interrupted Class'});assert.equal(r.status,200,JSON.stringify(r));assert.equal(await exists('interventions',`${runId}-retry-record`),false);assert.equal(await exists('classes',retryId),false);pass('Expired-lease interrupted deletion resumes');
 console.log(`\nALL ${passed} TESTS PASSED (EMULATOR ONLY).`);
}
try{await main()}catch(error){console.error('\nFAILED:',error);process.exitCode=1}finally{if(server){server.kill();await sleep(800)} }
