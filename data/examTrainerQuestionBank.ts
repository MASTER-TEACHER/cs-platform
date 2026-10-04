import type { ExamTrainerQuestion } from "@/types/examTrainer";
import {
  gcseExamTrainerQuestionBank,
  gcseExamTrainerTopics,
} from "@/data/questions/gcse/examTrainerAdapter";

/**
 * Canonical GCSE Exam Trainer bank.
 *
 * The original ten-question prototype has been superseded by the
 * specification-mapped GCSE practice bank. Keeping these exports stable
 * means the existing Exam Trainer UI, autosave, marking and history
 * workflows do not need to know how the source content is organised.
 */
export const examTrainerQuestionBank: ExamTrainerQuestion[] =
  gcseExamTrainerQuestionBank;

export const examTrainerTopics = gcseExamTrainerTopics;
