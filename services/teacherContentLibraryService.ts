import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import {
  deleteExamQuestionSet,
  duplicateExamQuestionSet,
  getTeacherExamQuestionSets,
  updateExamQuestionSetStatus,
} from "@/services/examQuestionService";
import {
  deleteTeacherResource,
  duplicateTeacherResource,
  getTeacherResources,
  updateTeacherResourceStatus,
} from "@/services/teacherResourceService";
import type {
  TeacherContentItem,
  TeacherContentKind,
  TeacherContentLifecycle,
} from "@/types/teacherContent";

function timestampToDate(value: unknown): Date | null {
  return value instanceof Timestamp ? value.toDate() : null;
}

function normaliseLifecycle(value: unknown): TeacherContentLifecycle {
  return value === "published" || value === "archived" ? value : "draft";
}

export function teacherContentKindLabel(kind: TeacherContentKind): string {
  if (kind === "teaching-resource") return "Teaching Resource";
  if (kind === "ai-quiz") return "AI Quiz";
  return "Exam Question Set";
}

export async function getTeacherContentLibrary(
  teacherId: string,
): Promise<TeacherContentItem[]> {
  const id = teacherId.trim();
  if (!id) return [];

  const [resources, examSets, quizSnapshot] = await Promise.all([
    getTeacherResources(id),
    getTeacherExamQuestionSets(id),
    getDocs(query(collection(db, "generatedQuizzes"), where("teacherId", "==", id))),
  ]);

  const resourceItems: TeacherContentItem[] = resources.map((resource) => ({
    key: `teaching-resource:${resource.id}`,
    id: resource.id,
    teacherId: resource.teacherId,
    kind: "teaching-resource",
    title: resource.title,
    description: resource.content.overview || "",
    topic: resource.topic,
    qualification:
      resource.yearGroup === "A Level" ||
      resource.yearGroup === "Year 12" ||
      resource.yearGroup === "Year 13"
        ? "A_LEVEL"
        : "GCSE",
    examBoard: resource.examBoard,
    yearGroup: resource.yearGroup,
    difficulty: resource.difficulty,
    lifecycle: normaliseLifecycle(resource.status),
    questionCount: resource.content.assessmentQuestions.length,
    totalMarks: resource.content.assessmentQuestions.reduce(
      (total, question) => total + (Number(question.marks) || 0),
      0,
    ),
    createdAt: resource.createdAt,
    updatedAt: resource.updatedAt,
    openHref: `/teacher/resources/${resource.id}`,
    assignHref:
      resource.status === "published"
        ? `/teacher/assignment-wizard?contentType=teaching-resource&contentId=${encodeURIComponent(resource.id)}`
        : null,
  }));

  const examItems: TeacherContentItem[] = examSets.map((set) => ({
    key: `exam-paper:${set.id}`,
    id: set.id,
    teacherId: set.teacherId,
    kind: "exam-paper",
    title: set.title,
    description: `${set.questionCount} original exam-style questions worth ${set.totalMarks} marks.`,
    topic: set.topic,
    qualification: set.qualification,
    examBoard: set.examBoard,
    yearGroup: "",
    difficulty: set.difficulty,
    lifecycle: normaliseLifecycle(set.status),
    questionCount: set.questionCount,
    totalMarks: set.totalMarks,
    createdAt: set.createdAt,
    updatedAt: set.updatedAt,
    openHref: `/teacher/question-bank/${set.id}`,
    assignHref:
      set.status === "published"
        ? `/teacher/assignment-wizard?contentType=exam-paper&contentId=${encodeURIComponent(set.id)}`
        : null,
  }));

  const quizItems: TeacherContentItem[] = quizSnapshot.docs.map((quizDocument) => {
    const data = quizDocument.data();
    const questions = Array.isArray(data.questions) ? data.questions : [];
    const lifecycle = normaliseLifecycle(data.status);

    return {
      key: `ai-quiz:${quizDocument.id}`,
      id: quizDocument.id,
      teacherId: typeof data.teacherId === "string" ? data.teacherId : id,
      kind: "ai-quiz",
      title: typeof data.title === "string" ? data.title : "Untitled Quiz",
      description: typeof data.description === "string" ? data.description : "",
      topic: typeof data.topicId === "string" ? data.topicId : "",
      qualification: typeof data.qualification === "string" ? data.qualification : "GCSE",
      examBoard: typeof data.examBoard === "string" ? data.examBoard : "",
      yearGroup: "",
      difficulty: typeof data.difficulty === "string" ? data.difficulty : "standard",
      lifecycle,
      questionCount:
        typeof data.questionCount === "number" ? data.questionCount : questions.length,
      totalMarks: null,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
      openHref: `/teacher/quiz-library/${quizDocument.id}`,
      assignHref:
        lifecycle === "published"
          ? `/teacher/assignment-wizard?quizId=${encodeURIComponent(quizDocument.id)}`
          : null,
    };
  });

  return [...resourceItems, ...quizItems, ...examItems].sort(
    (a, b) =>
      (b.updatedAt ?? b.createdAt ?? new Date(0)).getTime() -
      (a.updatedAt ?? a.createdAt ?? new Date(0)).getTime(),
  );
}

export async function updateTeacherContentLifecycle(
  item: TeacherContentItem,
  lifecycle: TeacherContentLifecycle,
): Promise<void> {
  if (item.kind === "teaching-resource") {
    await updateTeacherResourceStatus(item.id, lifecycle);
    return;
  }

  if (item.kind === "exam-paper") {
    await updateExamQuestionSetStatus(item.id, lifecycle);
    return;
  }

  await updateDoc(doc(db, "generatedQuizzes", item.id), {
    status: lifecycle,
    updatedAt: serverTimestamp(),
  });
}

export async function duplicateTeacherContent(
  item: TeacherContentItem,
  teacherId: string,
): Promise<string> {
  const id = teacherId.trim();
  if (!id) throw new Error("A teacher account is required.");

  if (item.kind === "teaching-resource") {
    return duplicateTeacherResource(item.id, id);
  }

  if (item.kind === "exam-paper") {
    return duplicateExamQuestionSet(item.id, id);
  }

  const snapshot = await getDocs(
    query(collection(db, "generatedQuizzes"), where("teacherId", "==", id)),
  );
  const source = snapshot.docs.find((docItem) => docItem.id === item.id);
  if (!source) throw new Error("The quiz could not be found in your library.");

  const data = source.data();
  const reference = await addDoc(collection(db, "generatedQuizzes"), {
    ...data,
    title: `${item.title} (Copy)`,
    status: "draft",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return reference.id;
}

export async function deleteTeacherContent(item: TeacherContentItem): Promise<void> {
  if (item.lifecycle !== "archived") {
    throw new Error("Archive content before deleting it permanently.");
  }

  if (item.kind === "teaching-resource") {
    await deleteTeacherResource(item.id);
    return;
  }

  if (item.kind === "exam-paper") {
    await deleteExamQuestionSet(item.id);
    return;
  }

  await deleteDoc(doc(db, "generatedQuizzes", item.id));
}
