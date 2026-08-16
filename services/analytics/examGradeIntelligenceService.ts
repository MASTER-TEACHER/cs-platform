import {
  getDefaultBoundarySet,
  getGradeOrder,
} from "@/data/analytics/gradeBoundaries";
import type {
  ExamAssignment,
  ExamSubmission,
} from "@/types/examAssignment";
import type {
  AnalyticsBoundarySource,
  AnalyticsQualification,
  GradeBoundary,
  GradeBoundarySet,
  GradeLabel,
} from "@/types/analytics";
import type {
  ExamGradeBoundaryRow,
  ExamGradeDistributionItem,
  ExamGradeIntelligence,
  ExamStudentGradeOutcome,
} from "@/types/examIntelligence";

type ResolvedBoundarySet = GradeBoundarySet & {
  sourceNote?: string;
  verifiedAt?: string;
};

function round(value: number): number {
  return Math.round(value * 10) / 10;
}

function normaliseQualification(
  value: unknown,
): AnalyticsQualification {
  const text =
    typeof value === "string"
      ? value.trim().toUpperCase()
      : "";

  return text === "A_LEVEL" ||
    text === "A LEVEL" ||
    text === "A-LEVEL"
    ? "A_LEVEL"
    : "GCSE";
}

function validBoundarySource(
  value: unknown,
): AnalyticsBoundarySource | null {
  return value === "official" ||
    value === "teacher" ||
    value === "indicative"
    ? value
    : null;
}

function validGrade(
  value: unknown,
  qualification: AnalyticsQualification,
): GradeLabel | null {
  if (typeof value !== "string") {
    return null;
  }

  const grade = value.trim().toUpperCase();

  const valid =
    qualification === "A_LEVEL"
      ? ["A*", "A", "B", "C", "D", "E", "U"]
      : ["9", "8", "7", "6", "5", "4", "3", "2", "1", "U"];

  return valid.includes(grade)
    ? (grade as GradeLabel)
    : null;
}

function boundarySetFromSnapshot(
  assignment: ExamAssignment,
  qualification: AnalyticsQualification,
): ResolvedBoundarySet | null {
  const snapshot =
    assignment.questionSetSnapshot as unknown as
      Record<string, unknown>;

  const candidate =
    snapshot.gradeBoundarySet;

  if (
    !candidate ||
    typeof candidate !== "object"
  ) {
    return null;
  }

  const data =
    candidate as Record<string, unknown>;

  if (!Array.isArray(data.boundaries)) {
    return null;
  }

  const totalMarks =
    assignment.totalMarks > 0
      ? assignment.totalMarks
      : assignment.questionSetSnapshot.totalMarks;

  const boundaries: GradeBoundary[] =
    data.boundaries
      .map((item) => {
        if (
          !item ||
          typeof item !== "object"
        ) {
          return null;
        }

        const row =
          item as Record<string, unknown>;

        const grade =
          validGrade(
            row.grade,
            qualification,
          );

        let minimumPercentage =
          typeof row.minimumPercentage === "number" &&
          Number.isFinite(row.minimumPercentage)
            ? row.minimumPercentage
            : null;

        if (
          minimumPercentage === null &&
          typeof row.minimumMark === "number" &&
          Number.isFinite(row.minimumMark) &&
          totalMarks > 0
        ) {
          minimumPercentage =
            (row.minimumMark / totalMarks) * 100;
        }

        if (
          !grade ||
          minimumPercentage === null ||
          minimumPercentage < 0 ||
          minimumPercentage > 100
        ) {
          return null;
        }

        return {
          grade,
          minimumPercentage,
        };
      })
      .filter(
        (
          item,
        ): item is GradeBoundary =>
          Boolean(item),
      );

  if (!boundaries.length) {
    return null;
  }

  return {
    id:
      typeof data.id === "string" &&
      data.id.trim()
        ? data.id.trim()
        : "embedded-exam-boundaries",
    title:
      typeof data.title === "string" &&
      data.title.trim()
        ? data.title.trim()
        : "Embedded exam grade boundaries",
    qualification,
    examBoard:
      typeof data.examBoard === "string"
        ? data.examBoard
        : undefined,
    academicYear:
      typeof data.academicYear === "string"
        ? data.academicYear
        : undefined,
    assessmentTitle:
      typeof data.assessmentTitle === "string"
        ? data.assessmentTitle
        : undefined,
    source:
      validBoundarySource(
        data.source,
      ) || "teacher",
    boundaries,
    sourceNote:
      typeof data.sourceNote === "string"
        ? data.sourceNote
        : undefined,
    verifiedAt:
      typeof data.verifiedAt === "string"
        ? data.verifiedAt
        : undefined,
  };
}

function resolveBoundarySet(
  assignment: ExamAssignment,
  qualification: AnalyticsQualification,
): ResolvedBoundarySet {
  return (
    boundarySetFromSnapshot(
      assignment,
      qualification,
    ) ||
    getDefaultBoundarySet(
      qualification,
    )
  );
}

function orderedBoundaries(
  boundarySet: GradeBoundarySet,
  qualification: AnalyticsQualification,
): GradeBoundary[] {
  const order =
    getGradeOrder(qualification);

  return [...boundarySet.boundaries].sort(
    (first, second) =>
      order.indexOf(second.grade) -
      order.indexOf(first.grade),
  );
}

function gradeFromPercentage(
  percentage: number,
  boundarySet: GradeBoundarySet,
  qualification: AnalyticsQualification,
): GradeLabel {
  const boundaries =
    orderedBoundaries(
      boundarySet,
      qualification,
    );

  return (
    boundaries.find(
      (boundary) =>
        percentage >=
        boundary.minimumPercentage,
    )?.grade || "U"
  );
}

function nextGradeInformation({
  grade,
  awardedMarks,
  totalMarks,
  boundarySet,
  qualification,
}: {
  grade: GradeLabel;
  awardedMarks: number;
  totalMarks: number;
  boundarySet: GradeBoundarySet;
  qualification: AnalyticsQualification;
}): {
  nextGrade: GradeLabel | null;
  nextGradeMinimumMark: number | null;
  marksToNextGrade: number | null;
  percentagePointsToNextGrade: number | null;
} {
  const order =
    getGradeOrder(qualification);

  const gradeIndex =
    order.indexOf(grade);

  if (
    gradeIndex < 0 ||
    gradeIndex >=
      order.length - 1
  ) {
    return {
      nextGrade: null,
      nextGradeMinimumMark: null,
      marksToNextGrade: null,
      percentagePointsToNextGrade: null,
    };
  }

  const nextGrade =
    order[gradeIndex + 1];

  const nextBoundary =
    boundarySet.boundaries.find(
      (boundary) =>
        boundary.grade === nextGrade,
    );

  if (!nextBoundary) {
    return {
      nextGrade,
      nextGradeMinimumMark: null,
      marksToNextGrade: null,
      percentagePointsToNextGrade: null,
    };
  }

  const nextGradeMinimumMark =
    Math.ceil(
      (nextBoundary.minimumPercentage /
        100) *
        totalMarks -
        1e-9,
    );

  const currentPercentage =
    totalMarks > 0
      ? (awardedMarks / totalMarks) * 100
      : 0;

  return {
    nextGrade,
    nextGradeMinimumMark,
    marksToNextGrade:
      Math.max(
        0,
        nextGradeMinimumMark -
          awardedMarks,
      ),
    percentagePointsToNextGrade:
      round(
        Math.max(
          0,
          nextBoundary.minimumPercentage -
            currentPercentage,
        ),
      ),
  };
}

function scoreForSubmission(
  submission: ExamSubmission,
  assignment: ExamAssignment,
): {
  awardedMarks: number;
  availableMarks: number;
  percentage: number;
} {
  const availableMarks =
    submission.totalAvailableMarks > 0
      ? submission.totalAvailableMarks
      : assignment.totalMarks;

  const awardedMarks =
    submission.totalAwardedMarks;

  return {
    awardedMarks,
    availableMarks,
    percentage:
      availableMarks > 0
        ? round(
            (awardedMarks /
              availableMarks) *
              100,
          )
        : submission.percentage,
  };
}

export function buildExamGradeIntelligence(
  assignment: ExamAssignment,
  submissions: ExamSubmission[],
): ExamGradeIntelligence {
  const qualification =
    normaliseQualification(
      assignment.questionSetSnapshot
        .qualification,
    );

  const boundarySet =
    resolveBoundarySet(
      assignment,
      qualification,
    );

  const totalMarks =
    assignment.totalMarks > 0
      ? assignment.totalMarks
      : assignment.questionSetSnapshot
          .totalMarks;

  const marked =
    submissions.filter(
      (submission) =>
        submission.status === "marked",
    );

  const provisionalOutcomes =
    marked.map((submission) => {
      const score =
        scoreForSubmission(
          submission,
          assignment,
        );

      const grade =
        gradeFromPercentage(
          score.percentage,
          boundarySet,
          qualification,
        );

      const next =
        nextGradeInformation({
          grade,
          awardedMarks:
            score.awardedMarks,
          totalMarks:
            score.availableMarks,
          boundarySet,
          qualification,
        });

      return {
        submission,
        score,
        grade,
        next,
      };
    });

  const classAveragePercentage =
    provisionalOutcomes.length
      ? round(
          provisionalOutcomes.reduce(
            (sum, item) =>
              sum +
              item.score.percentage,
            0,
          ) /
            provisionalOutcomes.length,
        )
      : null;

  const classAverageMark =
    provisionalOutcomes.length
      ? round(
          provisionalOutcomes.reduce(
            (sum, item) =>
              sum +
              item.score.awardedMarks,
            0,
          ) /
            provisionalOutcomes.length,
        )
      : null;

  const studentOutcomes: ExamStudentGradeOutcome[] =
    provisionalOutcomes.map(
      ({
        submission,
        score,
        grade,
        next,
      }) => ({
        studentId:
          submission.studentId,
        studentName:
          submission.studentName,
        studentEmail:
          submission.studentEmail,
        awardedMarks:
          score.awardedMarks,
        availableMarks:
          score.availableMarks,
        percentage:
          score.percentage,
        grade,
        nextGrade:
          next.nextGrade,
        nextGradeMinimumMark:
          next.nextGradeMinimumMark,
        marksToNextGrade:
          next.marksToNextGrade,
        percentagePointsToNextGrade:
          next.percentagePointsToNextGrade,
        differenceFromClassAverage:
          classAveragePercentage === null
            ? null
            : round(
                score.percentage -
                  classAveragePercentage,
              ),
        nearNextGradeBoundary:
          next.marksToNextGrade !== null &&
          next.marksToNextGrade > 0 &&
          next.marksToNextGrade <= 2,
      }),
    );

  const classAverageGrade =
    classAveragePercentage === null
      ? null
      : gradeFromPercentage(
          classAveragePercentage,
          boundarySet,
          qualification,
        );

  const classNext =
    classAverageGrade === null ||
    classAverageMark === null
      ? {
          nextGrade: null,
          nextGradeMinimumMark: null,
          marksToNextGrade: null,
          percentagePointsToNextGrade: null,
        }
      : nextGradeInformation({
          grade: classAverageGrade,
          awardedMarks:
            Math.round(
              classAverageMark,
            ),
          totalMarks,
          boundarySet,
          qualification,
        });

  const gradeOrder =
    getGradeOrder(
      qualification,
    ).reverse();

  const gradeDistribution: ExamGradeDistributionItem[] =
    gradeOrder
      .map((grade) => {
        const count =
          studentOutcomes.filter(
            (student) =>
              student.grade === grade,
          ).length;

        return {
          grade,
          count,
          percentage:
            studentOutcomes.length > 0
              ? round(
                  (count /
                    studentOutcomes.length) *
                    100,
                )
              : 0,
        };
      })
      .filter(
        (item) =>
          item.count > 0,
      );

  const boundaries: ExamGradeBoundaryRow[] =
    orderedBoundaries(
      boundarySet,
      qualification,
    ).map((boundary) => ({
      grade: boundary.grade,
      minimumPercentage:
        round(boundary.minimumPercentage),
      minimumMark:
        Math.ceil(
          (boundary.minimumPercentage /
            100) *
            totalMarks -
            1e-9,
        ),
    }));

  return {
    qualification,
    examBoard:
      assignment.questionSetSnapshot
        .examBoard || null,

    boundarySetId:
      boundarySet.id,
    boundarySetTitle:
      boundarySet.title,
    boundarySource:
      boundarySet.source,
    boundarySourceNote:
      boundarySet.sourceNote || null,
    boundaryVerifiedAt:
      boundarySet.verifiedAt || null,
    boundaryAcademicYear:
      boundarySet.academicYear ||
      null,
    boundaryAssessmentTitle:
      boundarySet.assessmentTitle ||
      null,
    isOfficialBoundarySet:
      boundarySet.source === "official",

    totalMarks,
    boundaries,

    classAverageMark,
    classAveragePercentage,
    classAverageGrade,
    classNextGrade:
      classNext.nextGrade,
    classNextGradeMinimumMark:
      classNext.nextGradeMinimumMark,
    classMarksToNextGrade:
      classNext.marksToNextGrade,
    classPercentagePointsToNextGrade:
      classNext.percentagePointsToNextGrade,

    studentOutcomes,
    nearBoundaryStudents:
      studentOutcomes.filter(
        (student) =>
          student.nearNextGradeBoundary,
      ),
    gradeDistribution,
  };
}
