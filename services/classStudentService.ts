import {
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function addStudentToClass(
  classId: string,
  studentId: string
) {
  const classRef = doc(db, "classes", classId);
  const studentRef = doc(db, "users", studentId);

  const [classSnapshot, studentSnapshot] = await Promise.all([
    getDoc(classRef),
    getDoc(studentRef),
  ]);

  if (!classSnapshot.exists()) {
    throw new Error("Class not found.");
  }

  if (!studentSnapshot.exists()) {
    throw new Error("Student not found.");
  }

  const studentData = studentSnapshot.data();

  if (studentData.role !== "student") {
    throw new Error("Only student accounts can be added to a class.");
  }

  await Promise.all([
    updateDoc(classRef, {
      studentIds: arrayUnion(studentId),
    }),

    updateDoc(studentRef, {
      classIds: arrayUnion(classId),
    }),
  ]);
}