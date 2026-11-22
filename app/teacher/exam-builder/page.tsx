import { redirect } from "next/navigation";

// Exam Builder is now part of the Question Bank (Papers & questions).
export default function ExamBuilderRedirect() {
  redirect("/teacher/question-bank/enhanced");
}
