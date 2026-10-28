"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { curriculumDefinitions } from "@/data/curriculum/curriculumMap";
import { curriculumTopicById } from "@/data/curriculum/curriculumRegistry";
import { builtInExamQuestions } from "@/data/curriculum/builtInExamQuestions";
import { getTeacherExamQuestionSets, saveExamQuestionSet, updateExamQuestionSetStatus, type SavedExamQuestionSet } from "@/services/examQuestionService";
import type { GeneratedExamQuestion, GeneratedExamQuestionSet } from "@/types/examQuestion";

type LibraryQuestion = { key: string; source: SavedExamQuestionSet; question: GeneratedExamQuestion };

export default function ExamBuilderPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [sets, setSets] = useState<SavedExamQuestionSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("Custom Computer Science assessment");
  const [curriculumIndex, setCurriculumIndex] = useState(0);
  const [unitId, setUnitId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user?.uid) return;
    let active = true;
    void getTeacherExamQuestionSets(user.uid).then(data => {
      if (active) setSets(data.filter(item => item.teacherId === user.uid && item.status !== "archived"));
    }).catch(() => toast.error("Could not load your saved questions.")).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [user?.uid]);

  const curricula = useMemo(() => curriculumDefinitions.filter(c => c.subject === "COMPUTER_SCIENCE"), []);
  const curriculum = curricula[curriculumIndex];
  const units = curriculum?.units ?? [];
  const unit = units.find(item => item.id === unitId);
  const allQuestions = useMemo<LibraryQuestion[]>(() => {
    const library = sets.flatMap(source => source.content.questions.map((question, index) => ({ key: `${source.id}:${index}`, source, question })));
    const builtIn = builtInExamQuestions.map((question, index) => ({
      key: `built-in:${index}`,
      question,
      source: {
        id: "cs-master-built-in", teacherId: user?.uid ?? "", title: "CS Master original starter questions",
        topic: question.topic, qualification: "GCSE", examBoard: curriculum?.examBoard ?? "AQA",
        difficulty: "standard", questionCount: 1, totalMarks: question.marks,
        content: { id: "built-in", title: "CS Master original starter questions", description: "Original practice questions", qualification: "GCSE", examBoard: curriculum?.examBoard ?? "AQA", topic: question.topic, difficulty: "standard" as const, generationMode: "manual" as const, questionCount: 1, totalMarks: question.marks, estimatedTime: "5 minutes", copyrightNotice: "Original CS Master practice question", blueprint: [], questions: [question], createdAt: "" },
        status: "published" as const, createdAt: null, updatedAt: null,
      },
    }));
    return [...builtIn, ...library];
  }, [sets, user?.uid, curriculum]);
  const filtered = useMemo(() => allQuestions.filter(item => {
    const q = item.question;
    if (curriculum && ((item.source.id !== "cs-master-built-in" && !item.source.examBoard.toUpperCase().includes(curriculum.examBoard.toUpperCase().replace("EDEXCEL", "EDEXCEL"))) || (item.source.qualification.toUpperCase().replace(/[^A-Z]/g, "") !== curriculum.qualification.toUpperCase().replace(/[^A-Z]/g, "") && !(curriculum.qualification === "A_LEVEL" && item.source.qualification === "A Level")))) return false;
    const text = `${q.topic} ${q.question} ${item.source.title}`.toLowerCase();
    if (unit && !unit.topicIds.some(id => {
      const topic = curriculumTopicById.get(id);
      return topic && [topic.title, ...topic.aliases].some(alias => text.includes(alias.toLowerCase()));
    })) return false;
    if (topicId) {
      const topic = curriculumTopicById.get(topicId);
      if (topic && ![topic.title, ...topic.aliases].some(alias => text.includes(alias.toLowerCase()))) return false;
    }
    return !search.trim() || text.includes(search.trim().toLowerCase());
  }), [allQuestions, curriculum, unit, topicId, search]);
  const selectedQuestions = selected.map(key => allQuestions.find(item => item.key === key)).filter((item): item is LibraryQuestion => Boolean(item));
  const totalMarks = selectedQuestions.reduce((sum, item) => sum + item.question.marks, 0);

  async function savePaper(composedId: string) {
    if (!user?.uid || !curriculum || !selectedQuestions.length || saving) return;
    if (!title.trim()) { toast.error("Enter an assessment title."); return; }
    setSaving(true);
    try {
      const questions = selectedQuestions.map((item, index) => ({ ...item.question, id: `q-${index + 1}`, questionNumber: index + 1 }));
      const first = selectedQuestions[0].source.content;
      const paper: GeneratedExamQuestionSet = {
        ...first,
        id: composedId,
        title: title.trim(),
        description: "Teacher-composed assessment from saved CS Master questions.",
        qualification: curriculum.qualification === "A_LEVEL" ? "A Level" : "GCSE",
        examBoard: curriculum.examBoard,
        topic: [...new Set(questions.map(q => q.topic))].join(", "),
        generationMode: "manual",
        questionCount: questions.length,
        totalMarks,
        questions,
        blueprint: questions.map(q => ({ id: q.id, questionNumber: q.questionNumber, assessmentObjective: q.assessmentObjective, questionType: q.questionType, commandWord: q.commandWord, marks: q.marks, difficulty: q.difficulty, topicFocus: q.topic })),
        createdAt: new Date().toISOString(),
        copyrightNotice: "Original questions from this teacher's CS Master question bank.",
      };
      if (paper.questionCount !== paper.questions.length ||
          paper.totalMarks !== paper.questions.reduce((sum, q) => sum + q.marks, 0)) {
        throw new Error("Selected question count or total marks did not match the composed paper.");
      }
      const id = await saveExamQuestionSet(user.uid, paper);
      await updateExamQuestionSetStatus(id, "published");
      toast.success("Assessment saved to your Question Bank.");
      router.push(`/teacher/assignment-wizard?contentType=exam-paper&contentId=${encodeURIComponent(id)}`);
    } catch (error) {
      console.error(error);
      toast.error("Could not save the assessment. Please try again.");
    } finally { setSaving(false); }
  }

  return <main className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
    <div className="rounded-2xl bg-indigo-950 p-6 text-white">
      <h1 className="text-3xl font-bold">CS Master Exam Builder</h1>
      <p className="mt-2 text-indigo-100">Choose a specification, unit and topic. Combine questions from your saved question bank into one assignment or exam.</p>
    </div>
    <div className="grid gap-4 rounded-xl border bg-white p-5 md:grid-cols-2">
      <label className="text-sm font-semibold">Assessment title<input className="mt-2 w-full rounded-lg border p-3" value={title} onChange={e => setTitle(e.target.value)}/></label>
      <label className="text-sm font-semibold">Curriculum<select className="mt-2 w-full rounded-lg border p-3" value={curriculumIndex} onChange={e => { setCurriculumIndex(Number(e.target.value)); setUnitId(""); setTopicId(""); setSelected([]); }}>
        {curricula.map((c,i) => <option key={`${c.examBoard}-${c.qualification}-${i}`} value={i}>{c.title}</option>)}
      </select></label>
      <label className="text-sm font-semibold">Unit<select className="mt-2 w-full rounded-lg border p-3" value={unitId} onChange={e => { setUnitId(e.target.value); setTopicId(""); }}><option value="">All units</option>{units.map(u => <option key={u.id} value={u.id}>{u.title}</option>)}</select></label>
      <label className="text-sm font-semibold">Topic<select className="mt-2 w-full rounded-lg border p-3" value={topicId} onChange={e => setTopicId(e.target.value)}><option value="">All topics</option>{(unit ? unit.topicIds : [...new Set(units.flatMap(u => u.topicIds))]).map(id => <option key={id} value={id}>{curriculumTopicById.get(id)?.title ?? id}</option>)}</select></label>
      <label className="text-sm font-semibold md:col-span-2">Search saved questions<input className="mt-2 w-full rounded-lg border p-3" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search question text, topic or set title"/></label>
    </div>
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <section className="space-y-3"><h2 className="text-xl font-bold">Available questions ({filtered.length})</h2>
        {loading && user?.uid ? <p>Loading saved questions…</p> : filtered.length === 0 ? <div className="rounded-xl border bg-white p-5">No matching saved questions. <Link className="font-bold text-indigo-700 underline" href="/teacher/exam-question-generator">Generate and save questions</Link> first, or adjust your filters.</div> : filtered.map(item => <label key={item.key} className="flex cursor-pointer gap-3 rounded-xl border bg-white p-4"><input type="checkbox" className="mt-1" checked={selected.includes(item.key)} onChange={e => setSelected(current => e.target.checked ? [...current,item.key] : current.filter(key => key !== item.key))}/><span className="space-y-2"><span className="block text-xs font-bold text-indigo-700">{item.question.topic} · {item.question.marks} marks · {item.source.title}</span><span className="block whitespace-pre-wrap text-sm text-slate-900">{item.question.question}</span></span></label>)}
      </section>
      <aside className="h-fit space-y-4 rounded-xl border bg-white p-5 lg:sticky lg:top-6"><h2 className="text-xl font-bold">Your paper</h2><p className="font-semibold">{selectedQuestions.length} questions · {totalMarks} marks</p>
        <ol className="space-y-2 text-sm">{selectedQuestions.map((item,i) => <li key={item.key} className="flex items-start justify-between gap-2 border-b pb-2"><span>{i+1}. {item.question.topic} ({item.question.marks} marks)</span><button type="button" className="font-bold text-red-700" onClick={() => setSelected(current => current.filter(key => key !== item.key))}>Remove</button></li>)}</ol>
        <button type="button" onClick={() => void savePaper(`composed-${crypto.randomUUID()}`)} disabled={!selectedQuestions.length || saving || !user} className="w-full rounded-lg bg-indigo-700 px-4 py-3 font-bold text-white disabled:opacity-50">{saving ? "Saving…" : "Save and assign paper"}</button>
        <p className="text-xs text-slate-600">Questions come from your own saved sets. This does not import copyrighted OCR ExamBuilder questions.</p>
      </aside>
    </div>
  </main>;
}
