import { redirect } from "next/navigation";

// The original question set list is now part of the Question Bank hub.
export default function QuestionBankRedirect() {
  redirect("/teacher/question-bank/enhanced");
}
