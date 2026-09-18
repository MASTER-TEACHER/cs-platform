import { curriculumDefinitions, getCurriculumDefinition } from "@/data/curriculum/curriculumMap";
import type { ExamBoard, Qualification, Subject } from "@/types/user";

export function getSupportedSubjects(): Subject[] {
  return Array.from(new Set(curriculumDefinitions.map((curriculum) => curriculum.subject)));
}

export function getSupportedQualifications(subject: Subject = "COMPUTER_SCIENCE"): Qualification[] {
  return Array.from(new Set(curriculumDefinitions.filter((curriculum) => curriculum.subject === subject).map((curriculum) => curriculum.qualification)));
}

export function getSupportedExamBoards(qualification: Qualification): ExamBoard[];
export function getSupportedExamBoards(subject: Subject, qualification: Qualification): ExamBoard[];
export function getSupportedExamBoards(subjectOrQualification: Subject | Qualification, maybeQualification?: Qualification): ExamBoard[] {
  const subject: Subject = maybeQualification === undefined ? "COMPUTER_SCIENCE" : subjectOrQualification as Subject;
  const qualification: Qualification = maybeQualification === undefined ? subjectOrQualification as Qualification : maybeQualification;
  return Array.from(new Set(curriculumDefinitions.filter((curriculum) => curriculum.subject === subject && curriculum.qualification === qualification).map((curriculum) => curriculum.examBoard)));
}

export function isSupportedCurriculumSelection(qualification: Qualification, examBoard: ExamBoard): boolean;
export function isSupportedCurriculumSelection(subject: Subject, qualification: Qualification, examBoard: ExamBoard): boolean;
export function isSupportedCurriculumSelection(subjectOrQualification: Subject | Qualification, qualificationOrExamBoard: Qualification | ExamBoard, maybeExamBoard?: ExamBoard): boolean {
  return maybeExamBoard === undefined
    ? Boolean(getCurriculumDefinition(subjectOrQualification as Qualification, qualificationOrExamBoard as ExamBoard))
    : Boolean(getCurriculumDefinition(subjectOrQualification as Subject, qualificationOrExamBoard as Qualification, maybeExamBoard));
}