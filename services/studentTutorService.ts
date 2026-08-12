import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {
  TutorConversation,
  TutorMessage,
  TutorResponse,
  TutorStudentContext,
} from "@/types/studentTutor";

type FMsg = Omit<TutorMessage, "createdAt"> & { createdAt?: Timestamp };
type FConv = {
  studentId: string;
  title: string;
  messages?: FMsg[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};
const toDate = (v?: Timestamp | null) => (v?.toDate ? v.toDate() : null);
const convert = (id: string, d: FConv): TutorConversation => ({
  id,
  studentId: d.studentId,
  title: d.title || "Tutor conversation",
  messages: (d.messages || []).map((m) => ({
    ...m,
    createdAt: toDate(m.createdAt),
  })),
  createdAt: toDate(d.createdAt),
  updatedAt: toDate(d.updatedAt),
});
const mid = () =>
  `message-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
export async function createTutorConversation(studentId: string) {
  const r = await addDoc(collection(db, "studentTutorConversations"), {
    studentId: studentId.trim(),
    title: "New tutor conversation",
    messages: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return r.id;
}
export async function getTutorConversation(id: string) {
  const s = await getDoc(doc(db, "studentTutorConversations", id));
  return s.exists() ? convert(s.id, s.data() as FConv) : null;
}
export async function saveTutorExchange(input: {
  conversationId: string;
  studentId: string;
  studentMessage: string;
  tutorResponse: TutorResponse;
}) {
  const c = await getTutorConversation(input.conversationId);
  if (!c || c.studentId !== input.studentId)
    throw new Error("Tutor conversation unavailable.");
  const now = new Date();
  const messages = [
    ...c.messages,
    {
      id: mid(),
      role: "student" as const,
      content: input.studentMessage.trim(),
      createdAt: now,
    },
    {
      id: mid(),
      role: "assistant" as const,
      content: input.tutorResponse.reply,
      createdAt: now,
      mode: input.tutorResponse.mode,
    },
  ];
  await updateDoc(doc(db, "studentTutorConversations", input.conversationId), {
    title: c.messages.length
      ? c.title
      : input.studentMessage.trim().slice(0, 60),
    messages: messages.map((m) => ({
      ...m,
      createdAt: Timestamp.fromDate(m.createdAt || now),
    })),
    updatedAt: serverTimestamp(),
  });
}
export async function clearTutorConversation(id: string, studentId: string) {
  const c = await getTutorConversation(id);
  if (!c || c.studentId !== studentId)
    throw new Error("Tutor conversation unavailable.");
  await updateDoc(doc(db, "studentTutorConversations", id), {
    title: "New tutor conversation",
    messages: [],
    updatedAt: serverTimestamp(),
  });
}
export async function requestTutorResponse(input: {
  studentId: string;
  conversationId: string;
  message: string;
  history: { role: "student" | "assistant"; content: string }[];
  context: TutorStudentContext;
}): Promise<TutorResponse> {
  const r = await fetch("/api/ai/student-tutor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "The tutor could not respond.");
  return j as TutorResponse;
}
