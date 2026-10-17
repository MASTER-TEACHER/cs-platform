import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getUserProfile, updateUserCourseSelection } from "@/services/userService";
import type { Subject } from "@/types/user";

export async function switchStudentSubject(uid: string, subject: Subject): Promise<void> {
  const profile = await getUserProfile(uid);
  if (!profile || profile.role !== "student") throw new Error("Student profile unavailable.");
  const enrolled = profile.enrolledSubjects || [profile.subject || "COMPUTER_SCIENCE"];
  if (!enrolled.includes(subject)) throw new Error("You are not enrolled in that subject.");
  const previous = profile.subject || "COMPUTER_SCIENCE";
  const preferences: Partial<Record<Subject, { qualification: string; examBoard: string; currentCourse: string }>> = {
    ...(profile.subjectPreferences || {}),
    [previous]: { qualification: profile.qualification, examBoard: profile.examBoard, currentCourse: profile.currentCourse },
  };
  const selected = preferences[subject];
  if (!selected?.qualification || !selected?.examBoard) {
    throw new Error("Please configure this subject in Curriculum Settings first.");
  }
  await updateDoc(doc(db, "users", uid), {
    subject, activeSubject: subject, enrolledSubjects: enrolled, subjectPreferences: preferences,
    qualification: selected.qualification, examBoard: selected.examBoard,
    currentCourse: selected.currentCourse || "", updatedAt: serverTimestamp(),
  });
}

export async function enrolStudentSubject(uid: string, subject: Subject): Promise<void> {
  const profile = await getUserProfile(uid);
  if (!profile || profile.role !== "student") throw new Error("Student profile unavailable.");
  if ((profile.enrolledSubjects || [profile.subject || "COMPUTER_SCIENCE"]).includes(subject)) return;
  const qualification = subject === "CREATIVE_IMEDIA" ? "GCSE" : "GCSE";
  const examBoard = "OCR";
  await updateUserCourseSelection(uid, { subject, qualification, examBoard });
}
