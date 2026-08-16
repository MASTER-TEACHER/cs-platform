import {
  deleteField,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import type {
  ExamBoundaryConfigurationInput,
} from "@/types/examBoundaryConfiguration";

function roundPercentage(
  value: number,
): number {
  return Math.round(value * 1000000) / 1000000;
}

function validateInput(
  input: ExamBoundaryConfigurationInput,
): void {
  if (!input.assignmentId.trim()) {
    throw new Error("A valid exam assignment is required.");
  }

  if (!input.teacherId.trim()) {
    throw new Error("A signed-in teacher is required.");
  }

  if (!input.title.trim()) {
    throw new Error("Enter a boundary-set title.");
  }

  if (
    !Number.isFinite(input.totalMarks) ||
    input.totalMarks <= 0
  ) {
    throw new Error("The assessment must have a valid total mark.");
  }

  if (!input.boundaries.length) {
    throw new Error("Enter at least one grade boundary.");
  }

  const seenGrades = new Set<string>();

  for (const boundary of input.boundaries) {
    if (seenGrades.has(boundary.grade)) {
      throw new Error(`Duplicate boundary for grade ${boundary.grade}.`);
    }

    seenGrades.add(boundary.grade);

    if (
      !Number.isFinite(boundary.minimumMark) ||
      boundary.minimumMark < 0 ||
      boundary.minimumMark > input.totalMarks
    ) {
      throw new Error(
        `The minimum mark for grade ${boundary.grade} must be between 0 and ${input.totalMarks}.`,
      );
    }
  }

  if (
    input.source === "official" &&
    (!input.examBoard.trim() ||
      !input.academicYear.trim() ||
      !input.assessmentTitle.trim())
  ) {
    throw new Error(
      "Official boundaries require an exam board, academic year/series and assessment title.",
    );
  }
}

async function assertTeacherOwnsAssignment({
  assignmentId,
  teacherId,
}: {
  assignmentId: string;
  teacherId: string;
}): Promise<void> {
  const reference = doc(
    db,
    "examAssignments",
    assignmentId,
  );

  const snapshot = await getDoc(reference);

  if (!snapshot.exists()) {
    throw new Error("Exam assignment not found.");
  }

  if (
    snapshot.data().teacherId !==
    teacherId.trim()
  ) {
    throw new Error(
      "You do not have permission to change this assessment.",
    );
  }
}

export async function saveExamBoundaryConfiguration(
  input: ExamBoundaryConfigurationInput,
): Promise<void> {
  validateInput(input);

  await assertTeacherOwnsAssignment({
    assignmentId: input.assignmentId,
    teacherId: input.teacherId,
  });

  const embeddedBoundarySet = {
    id: `assignment-${input.assignmentId}-boundaries`,
    title: input.title.trim(),
    qualification: input.qualification,
    examBoard: input.examBoard.trim(),
    academicYear: input.academicYear.trim(),
    assessmentTitle: input.assessmentTitle.trim(),
    source: input.source,
    sourceNote: input.sourceNote.trim(),
    verifiedAt: new Date().toISOString(),
    boundaries: input.boundaries.map((boundary) => ({
      grade: boundary.grade,
      minimumMark: boundary.minimumMark,
      minimumPercentage: roundPercentage(
        (boundary.minimumMark / input.totalMarks) * 100,
      ),
    })),
  };

  await updateDoc(
    doc(
      db,
      "examAssignments",
      input.assignmentId,
    ),
    {
      "questionSetSnapshot.gradeBoundarySet":
        embeddedBoundarySet,
      updatedAt: serverTimestamp(),
    },
  );
}

export async function clearExamBoundaryConfiguration({
  assignmentId,
  teacherId,
}: {
  assignmentId: string;
  teacherId: string;
}): Promise<void> {
  await assertTeacherOwnsAssignment({
    assignmentId,
    teacherId,
  });

  await updateDoc(
    doc(
      db,
      "examAssignments",
      assignmentId,
    ),
    {
      "questionSetSnapshot.gradeBoundarySet":
        deleteField(),
      updatedAt: serverTimestamp(),
    },
  );
}
