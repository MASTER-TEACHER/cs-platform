import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  type Firestore,
} from "firebase/firestore";

import type {
  QuestionLibraryItem,
} from "./types";

import {
  questionFingerprint,
  validateLibraryQuestion,
} from "./validation";

const COLLECTION = "questionLibrary";

export async function getTeacherLibraryQuestions(
  db: Firestore,
  teacherId: string,
): Promise<QuestionLibraryItem[]> {
  if (!teacherId.trim()) {
    throw new Error("Teacher ID is required.");
  }

  const snapshot = await getDocs(
    query(
      collection(db, COLLECTION),
      where("teacherId", "==", teacherId),
    ),
  );

  return snapshot.docs.map((item) => ({
    ...item.data(),
    id: item.id,
  })) as QuestionLibraryItem[];
}

export async function saveLibraryQuestion(
  db: Firestore,
  item: QuestionLibraryItem,
): Promise<void> {
  const validation = validateLibraryQuestion(item);

  if (!validation.valid) {
    throw new Error(validation.errors.join(" "));
  }

  if (!item.id.trim()) {
    throw new Error("Question ID is required.");
  }

  // This checks existing questions owned by the teacher.
  // It is not a cross-teacher uniqueness guarantee.
  const existing = await getTeacherLibraryQuestions(
    db,
    item.teacherId,
  );

  const fingerprint = questionFingerprint(item);

  const duplicate = existing.some(
    (question) =>
      question.id !== item.id &&
      questionFingerprint(question) === fingerprint,
  );

  if (duplicate) {
    throw new Error(
      "A matching question already exists in your library.",
    );
  }

  // Client validation is advisory; teacher ownership
  // is enforced independently by Firestore rules.
  await setDoc(
    doc(db, COLLECTION, item.id),
    item,
  );
}