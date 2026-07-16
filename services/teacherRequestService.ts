import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export type CreateTeacherRequestInput = {
  userId: string;
  name: string;
  email: string;
  schoolName: string;
  jobTitle: string;
  message: string;
};

export async function createTeacherRequest({
  userId,
  name,
  email,
  schoolName,
  jobTitle,
  message,
}: CreateTeacherRequestInput) {
  const requestReference = await addDoc(
    collection(db, "teacherRequests"),
    {
      userId,
      name,
      email,
      schoolName,
      jobTitle,
      message,
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );

  return requestReference.id;
}