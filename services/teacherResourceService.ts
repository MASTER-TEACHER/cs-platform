import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export type ResourceSection = {
  title: string;
  duration: string;
  teacherInstructions: string;
  studentTask: string;
  assessment: string;
  resources: string[];
};

export type ResourceDifferentiation = {
  support: string[];
  core: string[];
  stretch: string[];
};

export type ResourceMisconception = {
  misconception: string;
  correction: string;
};

export type ResourceAssessmentQuestion = {
  question: string;
  answer: string;
  marks: number;
};

export type GeneratedTeachingResource = {
  id: string;
  title: string;
  resourceType: string;
  topic: string;
  yearGroup: string;
  examBoard: string;
  duration: string;
  difficulty: string;
  overview: string;
  learningObjectives: string[];
  successCriteria: string[];
  keywords: string[];
  priorKnowledge: string[];
  sections: ResourceSection[];
  differentiation: ResourceDifferentiation;
  misconceptions: ResourceMisconception[];
  assessmentQuestions: ResourceAssessmentQuestion[];
  homework: string;
  teacherNotes: string;
  createdAt: string;
};

export type SavedTeacherResource = {
  id: string;
  teacherId: string;
  sourceResourceId: string;
  title: string;
  topic: string;
  resourceType: string;
  yearGroup: string;
  examBoard: string;
  duration: string;
  difficulty: string;
  content: GeneratedTeachingResource;
  status: "draft" | "published";
  createdAt: Date | null;
  updatedAt: Date | null;
};

type FirestoreTeacherResource = Omit<
  SavedTeacherResource,
  "id" | "createdAt" | "updatedAt"
> & {
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

const COLLECTION_NAME = "teacherResources";

function timestampToDate(value: unknown): Date | null {
  if (value instanceof Timestamp) {
    return value.toDate();
  }

  return null;
}

export async function saveTeacherResource(
  teacherId: string,
  resource: GeneratedTeachingResource,
): Promise<string> {
  if (!teacherId.trim()) {
    throw new Error("A signed-in teacher is required to save this resource.");
  }

  const existingQuery = query(
    collection(db, COLLECTION_NAME),
    where("teacherId", "==", teacherId),
    where("sourceResourceId", "==", resource.id),
  );

  const existingSnapshot = await getDocs(existingQuery);

  if (!existingSnapshot.empty) {
    throw new Error("This resource has already been saved to your library.");
  }

  const documentReference = await addDoc(collection(db, COLLECTION_NAME), {
    teacherId,
    sourceResourceId: resource.id,
    title: resource.title,
    topic: resource.topic,
    resourceType: resource.resourceType,
    yearGroup: resource.yearGroup,
    examBoard: resource.examBoard,
    duration: resource.duration,
    difficulty: resource.difficulty,
    content: resource,
    status: "draft",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return documentReference.id;
}

export async function getTeacherResources(
  teacherId: string,
): Promise<SavedTeacherResource[]> {
  if (!teacherId.trim()) {
    return [];
  }

  const resourcesQuery = query(
    collection(db, COLLECTION_NAME),
    where("teacherId", "==", teacherId),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(resourcesQuery);

  return snapshot.docs.map((resourceDocument) => {
    const data = resourceDocument.data() as FirestoreTeacherResource;

    return {
      id: resourceDocument.id,
      teacherId: data.teacherId,
      sourceResourceId: data.sourceResourceId,
      title: data.title,
      topic: data.topic,
      resourceType: data.resourceType,
      yearGroup: data.yearGroup,
      examBoard: data.examBoard,
      duration: data.duration,
      difficulty: data.difficulty,
      content: data.content,
      status: data.status,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    };
  });
}

export async function updateTeacherResourceStatus(
  resourceId: string,
  status: "draft" | "published",
): Promise<void> {
  const resourceReference = doc(db, "teacherResources", resourceId);

  await updateDoc(resourceReference, {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function updateTeacherResourceContent(
  resourceDocumentId: string,
  resource: GeneratedTeachingResource,
): Promise<void> {
  await updateDoc(doc(db, COLLECTION_NAME, resourceDocumentId), {
    title: resource.title,
    topic: resource.topic,
    resourceType: resource.resourceType,
    yearGroup: resource.yearGroup,
    examBoard: resource.examBoard,
    duration: resource.duration,
    difficulty: resource.difficulty,
    content: resource,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTeacherResource(
  resourceDocumentId: string,
): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, resourceDocumentId));
}
