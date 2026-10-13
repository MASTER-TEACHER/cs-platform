/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');
const { initializeTestEnvironment, assertSucceeds, assertFails } = require('@firebase/rules-unit-testing');
const { doc, collection, query, where, getDoc, getDocs, setDoc, updateDoc, deleteDoc } = require('firebase/firestore');

async function main() {
  const env = await initializeTestEnvironment({
    projectId: 'cs-master-security-final',
    firestore: { host: '127.0.0.1', port: 8080, rules: fs.readFileSync('firestore.rules', 'utf8') },
  });
  let passed = 0, failed = 0;
  async function test(name, action, expected) {
    try {
      if (expected === 'allow') await assertSucceeds(action());
      else await assertFails(action());
      console.log('PASS:', name); passed++;
    } catch (err) {
      console.error('FAIL:', name, '\n ', err.message); failed++;
    }
  }
  const a='test-teacher-a', b='test-teacher-b', sa='test-student-a', sb='test-student-b';
  try {
    await env.clearFirestore();
    await env.withSecurityRulesDisabled(async ctx => {
      const db=ctx.firestore();
      const rows=[
        ['users',a,{uid:a,role:'teacher',schoolId:'school-a'}],
        ['users',b,{uid:b,role:'teacher',schoolId:'school-b'}],
        ['users',sa,{uid:sa,role:'student',schoolId:'school-a'}],
        ['users',sb,{uid:sb,role:'student',schoolId:'school-b'}],
        ['classes','class-a',{teacherId:a,schoolId:'school-a',studentIds:[sa]}],
        ['classes','class-b',{teacherId:b,schoolId:'school-b',studentIds:[sb]}],
        ['assignmentResults','quiz-a_test-student-a',{teacherId:a,studentId:sa,classId:'class-a',assignmentId:'quiz-a',resourceId:'resource-a',assignmentType:'quiz',status:'completed'}],
        ['assignmentResults','quiz-b_test-student-b',{teacherId:b,studentId:sb,classId:'class-b',assignmentId:'quiz-b',resourceId:'resource-b',assignmentType:'quiz',status:'completed'}],
        ['examSubmissions','exam-a_test-student-a',{teacherId:a,studentId:sa,classId:'class-a',assignmentId:'exam-a',status:'submitted'}],
        ['examSubmissions','exam-b_test-student-b',{teacherId:b,studentId:sb,classId:'class-b',assignmentId:'exam-b',status:'submitted'}],
      ];
      for (const [path,id,data] of rows) await setDoc(doc(db,path,id),data);
    });
    const ta=env.authenticatedContext(a).firestore();
    const tb=env.authenticatedContext(b).firestore();
    const st=env.authenticatedContext(sa).firestore();
    const guest=env.unauthenticatedContext().firestore();
    for (const [title,path,ownId,otherId] of [
      ['Assignment results','assignmentResults','quiz-a_test-student-a','quiz-b_test-student-b'],
      ['Exam submissions','examSubmissions','exam-a_test-student-a','exam-b_test-student-b'],
    ]) {
      await test(`${title}: teacher A own list`,()=>getDocs(query(collection(ta,path),where('teacherId','==',a))),'allow');
      await test(`${title}: teacher A cannot list teacher B`,()=>getDocs(query(collection(ta,path),where('teacherId','==',b))),'deny');
      await test(`${title}: teacher B own list`,()=>getDocs(query(collection(tb,path),where('teacherId','==',b))),'allow');
      await test(`${title}: student own list`,()=>getDocs(query(collection(st,path),where('studentId','==',sa))),'allow');
      await test(`${title}: student cannot list another`,()=>getDocs(query(collection(st,path),where('studentId','==',sb))),'deny');
      await test(`${title}: guest cannot list`,()=>getDocs(query(collection(guest,path),where('teacherId','==',a))),'deny');
      await test(`${title}: student reads own document`,()=>getDoc(doc(st,path,ownId)),'allow');
      await test(`${title}: student cannot read another student's document`,()=>getDoc(doc(st,path,otherId)),'deny');
      await test(`${title}: teacher A cannot read teacher B document`,()=>getDoc(doc(ta,path,otherId)),'deny');
      await test(`${title}: student cannot forge teacher ownership`,()=>updateDoc(doc(st,path,ownId),{teacherId:b}),'deny');
      await test(`${title}: student cannot change class ownership`,()=>updateDoc(doc(st,path,ownId),{classId:'class-b'}),'deny');
      await test(`${title}: guest cannot create result`,()=>setDoc(doc(guest,path,'guest-forgery'),{teacherId:a,studentId:sa,classId:'class-a'}),'deny');
      await test(`${title}: teacher B cannot delete teacher A result`,()=>deleteDoc(doc(tb,path,ownId)),'deny');
    }
    await test('Cross-school: teacher A cannot read class B',()=>getDoc(doc(ta,'classes','class-b')),'deny');
    await test('Cross-school: teacher A cannot read student B user profile',()=>getDoc(doc(ta,'users',sb)),'deny');
    await test('Cross-school: student A cannot read student B user profile',()=>getDoc(doc(st,'users',sb)),'deny');
    await test('Unauthenticated: cannot read teacher A user profile',()=>getDoc(doc(guest,'users',a)),'deny');
    console.log(`\nRESULT: ${passed} passed, ${failed} failed`);
    if(failed) process.exitCode=1;
    console.log('\nNOTE: Dashboard quizResults and assignmentProgress access require representative real schema and dedicated tests.');
  } finally { await env.cleanup(); }
}
main().catch(e=>{console.error(e);process.exitCode=1;});
