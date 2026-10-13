import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const DEMO = 'demo-cs-master';
const PORT = 3119;
const BASE = `http://127.0.0.1:${PORT}`;
const REQUIRED = { FIRESTORE_EMULATOR_HOST:'127.0.0.1:8080', FIREBASE_AUTH_EMULATOR_HOST:'127.0.0.1:9099', GCLOUD_PROJECT:DEMO };
for (const [key,value] of Object.entries(REQUIRED)) assert.equal(process.env[key],value,`Refusing unsafe environment: ${key}`);
assert.equal(process.env.CSMASTER_SECURE_QUIZ_TEST_APPROVED,'YES','Explicit emulator test approval required');
const env={...process.env,NEXT_PUBLIC_FIREBASE_USE_EMULATORS:'true',NEXT_PUBLIC_FIREBASE_PROJECT_ID:DEMO,FIREBASE_ADMIN_PROJECT_ID:DEMO,FIRESTORE_EMULATOR_HOST:REQUIRED.FIRESTORE_EMULATOR_HOST,FIREBASE_AUTH_EMULATOR_HOST:REQUIRED.FIREBASE_AUTH_EMULATOR_HOST,CSMASTER_ENABLE_EMULATOR_CLASS_DELETE:'false'};
const app=initializeApp({projectId:DEMO});
const db=getFirestore(app);
const id=`secure-quiz-${Date.now()}`;
let server,passed=0;
const pass=(label)=>{console.log(`PASS ${++passed}: ${label}`)};
async function signup(label){
 const email=`${label}-${id}@example.test`;
 const res=await fetch('http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=emulator-key',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,password:'EmulatorOnly!12345',returnSecureToken:true})});
 const data=await res.json();assert.equal(res.status,200,JSON.stringify(data));return {uid:data.localId,token:data.idToken,email};
}
const put=(collection,key,data)=>db.collection(collection).doc(key).set(data);
async function call(method,student,topic,assignmentId,attemptId){
 const url=new URL(`${BASE}/api/quiz/secure`);
 if(method==='GET'){url.searchParams.set('topic',topic);if(assignmentId)url.searchParams.set('assignment',assignmentId)}
 const res=await fetch(url,{method,headers:{authorization:`Bearer ${student.token}`,...(method==='POST'?{'content-type':'application/json'}:{})},...(method==='POST'?{body:JSON.stringify({topic,attemptId,assignmentId:assignmentId||'',answers:{q1:'A'}})}:{})});
 let body;try{body=await res.json()}catch{body={}}return {status:res.status,body};
}
function assertAllowed(result,label){assert.equal(result.status,200,`${label}: ${JSON.stringify(result)}`);assert.ok(result.body.quiz?.attemptId || result.body.result,`${label}: missing quiz/result`)}
function assertBlocked(result,label){assert.equal(result.status,409,`${label}: ${JSON.stringify(result)}`);assert.match(String(result.body.error||''),/class/i,`${label}: unexpected error`)}
async function ready(){for(let i=0;i<100;i++){if(server.exitCode!==null)throw new Error(`Next.js server exited (${server.exitCode})`);try{const r=await fetch(`${BASE}/api/quiz/secure`);if(r.status===401)return;}catch{}await sleep(1000)}throw new Error('Next.js did not become ready')}
async function main(){
 const student=await signup('student'),teacher=await signup('teacher');
 await put('users',student.uid,{role:'student',schoolId:id,subject:'COMPUTER_SCIENCE',qualification:'GCSE',examBoard:'OCR',xp:0,streak:0});
 await put('users',teacher.uid,{role:'teacher',schoolId:id,subject:'COMPUTER_SCIENCE',qualification:'GCSE',examBoard:'OCR'});
 const classId=`${id}-class`, csQuiz=`${id}-cs`,imediaQuiz=`${id}-imedia`,csAssignment=`${id}-cs-assignment`,imediaAssignment=`${id}-imedia-assignment`;
 await put('classes',classId,{name:'Secure Quiz Test Class',teacherId:teacher.uid,schoolId:id,status:'active',studentIds:[student.uid]});
 const questions=[{id:'q1',type:'multipleChoice',question:'Which option is correct?',options:['A','B','C'],correctAnswer:'A',explanation:'A is correct',xpReward:10}];
 await put('generatedQuizzes',csQuiz,{teacherId:student.uid,topicId:csQuiz,title:'CS Regression Quiz',questions});
 await put('generatedQuizzes',imediaQuiz,{teacherId:teacher.uid,topicId:imediaQuiz,title:'Creative iMedia Regression Quiz',questions});
 const assignment=(resourceId,subject)=>({type:'quiz',status:'active',classId,teacherId:teacher.uid,studentIds:[student.uid],resourceId,quizSource:'ai-generated',subject,qualification:'GCSE',examBoard:'OCR',deliveryMode:'practice'});
 await put('assignments',csAssignment,assignment(csQuiz,'COMPUTER_SCIENCE'));
 await put('assignments',imediaAssignment,assignment(imediaQuiz,'CREATIVE_IMEDIA'));
 // Explicitly reject pre-existing servers so the test never hits a different process.
 try{await fetch(`${BASE}/api/quiz/secure`);throw new Error(`Port ${PORT} is already in use. Stop the existing process and rerun.`)}catch(e){if(e.message.includes('already in use'))throw e}
 if(process.platform==='win32') server=spawn('cmd.exe',['/d','/s','/c',`npm run dev -- -p ${PORT}`],{env,stdio:'inherit',windowsHide:true});
 else server=spawn('npm',['run','dev','--','-p',String(PORT)],{env,stdio:'inherit'});
 await ready();
 const activeStart=await call('GET',student,csQuiz,csAssignment);assertAllowed(activeStart,'active start');pass('Active class: assigned quiz starts');
 const activeSubmit=await call('POST',student,csQuiz,csAssignment,activeStart.body.quiz.attemptId);assertAllowed(activeSubmit,'active submit');pass('Active class: assigned quiz submits');
 const pending=await call('GET',student,csQuiz,csAssignment);assertAllowed(pending,'pending attempt');
 await db.collection('classes').doc(classId).update({status:'archived'});
 assertBlocked(await call('GET',student,csQuiz,csAssignment),'archived start');pass('Archived class: new attempt blocked');
 assertBlocked(await call('POST',student,csQuiz,csAssignment,pending.body.quiz.attemptId),'archived submit');pass('Archived class: existing attempt submission blocked');
 await db.collection('classes').doc(classId).update({status:'deleting'});
 assertBlocked(await call('GET',student,csQuiz,csAssignment),'deleting start');
 assertBlocked(await call('POST',student,csQuiz,csAssignment,pending.body.quiz.attemptId),'deleting submit');pass('Deleting class: start and submit blocked');
 const independent=await call('GET',student,csQuiz);assertAllowed(independent,'independent start');
 const independentSubmit=await call('POST',student,csQuiz,null,independent.body.quiz.attemptId);assertAllowed(independentSubmit,'independent submit');pass('Independent quiz remains functional');
 await db.collection('classes').doc(classId).update({status:'active'});
 const imedia=await call('GET',student,imediaQuiz,imediaAssignment);assertAllowed(imedia,'iMedia start');
 const imediaSubmit=await call('POST',student,imediaQuiz,imediaAssignment,imedia.body.quiz.attemptId);assertAllowed(imediaSubmit,'iMedia submit');pass('Creative iMedia active assignment starts and submits');
 console.log(`\nALL ${passed} SECURE QUIZ REGRESSION TESTS PASSED (EMULATOR ONLY).`);
}
try{await main()}catch(e){console.error('\nSECURE QUIZ REGRESSION FAILED:',e);process.exitCode=1}finally{if(server){if(process.platform==='win32'){spawn('taskkill',['/pid',String(server.pid),'/t','/f'],{stdio:'ignore'}).on('error',()=>{});}else server.kill('SIGTERM');await sleep(1200)}}
