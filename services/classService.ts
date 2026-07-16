import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type CreateClassInput = {
  teacherId: string;
  name: string;
  yearGroup: string;
  subject: string;
};

export async function createClass({
  teacherId,
  name,
  yearGroup,
  subject,
}: CreateClassInput) {
  const classRef = await addDoc(collection(db, "classes"), {
    teacherId,
    name,
    yearGroup,
    subject,
    studentIds: [],
    assignmentIds: [],
    createdAt: serverTimestamp(),
  });

  return classRef.id;
}