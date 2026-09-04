import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { indicativeGradeFromPercentage } from "@/services/qualificationGradeService";
import {
  getStudentById,
  type StudentDirectoryRecord,
} from "@/services/studentProfileService";

export type AnalyticsActivityType = "resource" | "quiz" | "exam";

export type AnalyticsAssignmentStatus =
  "not_started" | "in_progress" | "completed" | "overdue";

export type StudentClassSummary = {
  id: string;
  name: string;
};

export type StudentAnalyticsActivity = {
  id: string;
  assignmentId: string;
  type: AnalyticsActivityType;
  title: string;
  topic: string;
  className: string;
  status: AnalyticsAssignmentStatus;
  dueDate: Date | null;
  completedAt: Date | null;
  score: number | null;
  totalQuestions: number | null;
  totalMarks: number | null;
  percentage: number | null;
  earnedXP: number;
  timeTakenSeconds: number;
};

export type StudentTopicPerformance = {
  id: string;
  topic: string;
  attempts: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  classification: "strength" | "developing" | "support";
  sources: AnalyticsActivityType[];
};

export type StudentAnalyticsMetrics = {
  totalAssignments: number;
  completedAssignments: number;
  outstandingAssignments: number;
  overdueAssignments: number;
  completionRate: number;

  totalResourceAssignments: number;
  completedResourceAssignments: number;

  totalQuizAssignments: number;
  completedQuizAssignments: number;
  quizAverage: number;
  highestQuizScore: number;
  lowestQuizScore: number;

  totalExamAssignments: number;
  completedExamAssignments: number;
  submittedExamAssignments: number;
  awaitingMarkingExamAssignments: number;
  examAverage: number;
  highestExamScore: number;
  lowestExamScore: number;

  combinedAssessmentAverage: number;
  currentGrade: string;
  predictedGrade: string;

  totalXP: number;
  assignmentXP: number;
  streak: number;
  completedLessons: number;
  completedTopics: number;
  completedUnits: number;
  averageTimeTakenSeconds: number;
  improvementTrend: number;
};

export type StudentAnalyticsRecommendation = {
  id: string;
  priority: "high" | "medium" | "positive";
  title: string;
  description: string;
  actionType?: "lesson" | "quiz" | "exam" | "completion";
  topic?: string;
};

export type StudentAnalyticsData = {
  student: StudentDirectoryRecord;
  classes: StudentClassSummary[];
  metrics: StudentAnalyticsMetrics;
  activities: StudentAnalyticsActivity[];
  recentActivities: StudentAnalyticsActivity[];
  outstandingActivities: StudentAnalyticsActivity[];
  topicPerformance: StudentTopicPerformance[];
  strongestTopics: StudentTopicPerformance[];
  weakestTopics: StudentTopicPerformance[];
  recommendations: StudentAnalyticsRecommendation[];
};

type FirestoreDate = Timestamp | Date | string | null | undefined;

type ExamAssignmentRecord = {
  id: string;
  teacherId: string;
  classId: string;
  className: string;
  title: string;
  topic: string;
  studentIds: string[];
  dueDate: Date | null;
  totalMarks: number;
  questionCount: number;
  status: string;
};

type ExamSubmissionRecord = {
  id: string;
  assignmentId: string;
  studentId: string;
  status: string;
  totalAwardedMarks: number;
  totalAvailableMarks: number;
  percentage: number;
  submittedAt: Date | null;
  markedAt: Date | null;
  updatedAt: Date | null;
};

function safeNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function safeString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function safeStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function toDate(value: FirestoreDate): Date | null {
  if (!value) return null;
  if (value instanceof Date) {
    return value;
  }
  if (value instanceof Timestamp) {
    return value.toDate();
  }

  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return Math.round(
    values.reduce((total, value) => total + value, 0) / values.length,
  );
}

function isOverdue(dueDate: Date | null, completed: boolean): boolean {
  if (!dueDate || completed) {
    return false;
  }

  const endOfDueDate = new Date(dueDate);

  endOfDueDate.setHours(23, 59, 59, 999);

  return endOfDueDate.getTime() < Date.now();
}

function buildRecommendations(
  metrics: StudentAnalyticsMetrics,
  weakestTopics: StudentTopicPerformance[],
): StudentAnalyticsRecommendation[] {
  const recommendations: StudentAnalyticsRecommendation[] = [];

  if (metrics.overdueAssignments > 0) {
    recommendations.push({
      id: "overdue",
      priority: "high",
      title: "Address overdue work",
      description: `${metrics.overdueAssignments} assignment${
        metrics.overdueAssignments === 1 ? " is" : "s are"
      } overdue. Agree a completion plan with the student.`,
      actionType: "completion",
    });
  }

  if (metrics.awaitingMarkingExamAssignments > 0) {
    recommendations.push({
      id: "awaiting-marking",
      priority: "medium",
      title: "Release written feedback",
      description: `${metrics.awaitingMarkingExamAssignments} written assessment${
        metrics.awaitingMarkingExamAssignments === 1 ? " is" : "s are"
      } submitted and awaiting marking.`,
      actionType: "exam",
    });
  }

  if (metrics.completedQuizAssignments > 0 && metrics.quizAverage < 50) {
    recommendations.push({
      id: "quiz-support",
      priority: "high",
      title: "Provide targeted quiz support",
      description: `The quiz average is ${metrics.quizAverage}%. Revisit misconceptions before reassessment.`,
      actionType: "quiz",
    });
  }

  if (metrics.completedExamAssignments > 0 && metrics.examAverage < 50) {
    recommendations.push({
      id: "exam-support",
      priority: "high",
      title: "Model written exam responses",
      description: `The written exam average is ${metrics.examAverage}%. Use model answers and guided practice to improve exam technique.`,
      actionType: "exam",
    });
  }

  if (weakestTopics.length > 0) {
    recommendations.push({
      id: "weakest-topic",
      priority: "medium",
      title: `Revisit ${weakestTopics[0].topic}`,
      description: `This is currently the weakest assessed area at ${weakestTopics[0].averageScore}%. Recommend a lesson review, retrieval quiz and one exam-style question.`,
      actionType: "lesson",
      topic: weakestTopics[0].topic,
    });
  }

  if (metrics.totalAssignments > 0 && metrics.completionRate < 75) {
    recommendations.push({
      id: "completion",
      priority: "medium",
      title: "Improve assignment completion",
      description: `Completion is currently ${metrics.completionRate}%. Review deadlines and barriers to completion.`,
      actionType: "completion",
    });
  }

  if (metrics.improvementTrend >= 10) {
    recommendations.push({
      id: "improvement",
      priority: "positive",
      title: "Recognise recent improvement",
      description: `Recent assessment performance has improved by approximately ${metrics.improvementTrend} percentage points.`,
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      id: "maintain",
      priority: "positive",
      title: "Maintain current progress",
      description:
        "Continue regular retrieval practice, written exam practice and appropriately challenging work.",
    });
  }

  return recommendations;
}

export async function getStudentAnalytics(
  studentId: string,
  teacherId: string,
): Promise<StudentAnalyticsData | null> {
  const cleanedStudentId = studentId.trim();

  const cleanedTeacherId = teacherId.trim();

  if (!cleanedStudentId || !cleanedTeacherId) {
    return null;
  }

  const student = await getStudentById(cleanedStudentId);

  if (!student) {
    return null;
  }

  const [
    classesSnapshot,
    resourceAssignmentsSnapshot,
    quizAssignmentsSnapshot,
    quizResultsSnapshot,
    examAssignmentsSnapshot,
    examSubmissionsSnapshot,
  ] = await Promise.all([
    getDocs(
      query(
        collection(db, "classes"),
        where("studentIds", "array-contains", cleanedStudentId),
      ),
    ),

    getDocs(
      query(
        collection(db, "classAssignments"),
        where("studentIds", "array-contains", cleanedStudentId),
      ),
    ),

    Promise.all(
      student.classIds.map((classId) =>
        getDocs(
          query(
            collection(db, "assignments"),
            where("classId", "==", classId),
          ),
        ),
      ),
    ),

    getDocs(
      query(
        collection(db, "assignmentResults"),
        where("studentId", "==", cleanedStudentId),
      ),
    ),

    getDocs(
      query(
        collection(db, "examAssignments"),
        where("studentIds", "array-contains", cleanedStudentId),
      ),
    ),

    getDocs(
      query(
        collection(db, "examSubmissions"),
        where("studentId", "==", cleanedStudentId),
      ),
    ),
  ]);

  const studentClassIdSet = new Set(student.classIds);

  const classes: StudentClassSummary[] = classesSnapshot.docs
    .filter((classDocument) => studentClassIdSet.has(classDocument.id))
    .map((classDocument) => {
      const data = classDocument.data();

      return {
        id: classDocument.id,
        name: safeString(data.name, "Untitled class"),
      };
    });

  if (student.classIds.length > 0 && classes.length === 0) {
    return null;
  }

  const classNameById = new Map(
    classes.map((studentClass) => [studentClass.id, studentClass.name]),
  );

  const resourceAssignments = resourceAssignmentsSnapshot.docs.filter(
    (assignmentDocument) => {
      const data = assignmentDocument.data();

      return (
        safeStringArray(data.studentIds).includes(cleanedStudentId) &&
        data.status !== "cancelled"
      );
    },
  );

  const resourceActivities = await Promise.all(
    resourceAssignments.map(async (assignmentDocument) => {
      const data = assignmentDocument.data();

      const dueDate = toDate(data.dueDate);

      const progressId = `${assignmentDocument.id}_${cleanedStudentId}`;

      const progressSnapshot = await getDoc(
        doc(db, "assignmentProgress", progressId),
      );

      const progress = progressSnapshot.exists()
        ? progressSnapshot.data()
        : null;

      const completed = progress?.status === "completed";

      const status: AnalyticsAssignmentStatus = completed
        ? "completed"
        : isOverdue(dueDate, false)
          ? "overdue"
          : progress?.status === "in_progress"
            ? "in_progress"
            : "not_started";

      return {
        id: `resource-${assignmentDocument.id}`,
        assignmentId: assignmentDocument.id,
        type: "resource" as const,
        title:
          safeString(data.resourceTitle) ||
          safeString(data.title, "Assigned resource"),
        topic: safeString(data.resourceTopic, "Resource"),
        className:
          safeString(data.className) ||
          classNameById.get(safeString(data.classId)) ||
          "Assigned class",
        status,
        dueDate,
        completedAt: toDate(progress?.completedAt),
        score: null,
        totalQuestions: null,
        totalMarks: null,
        percentage: null,
        earnedXP: 0,
        timeTakenSeconds: 0,
      } satisfies StudentAnalyticsActivity;
    }),
  );

  const quizAssignmentDocuments = quizAssignmentsSnapshot.flatMap(
    (snapshot) => snapshot.docs,
  );

  const quizAssignments = quizAssignmentDocuments.filter(
    (assignmentDocument) => {
      const data = assignmentDocument.data();

      return (
        data.type === "quiz" &&
        studentClassIdSet.has(safeString(data.classId)) &&
        data.status !== "cancelled"
      );
    },
  );

  const quizResultByAssignmentId = new Map(
    quizResultsSnapshot.docs
      .map((resultDocument) => {
        const data = resultDocument.data();

        return {
          assignmentId: safeString(data.assignmentId),
          studentId: safeString(data.studentId),
          assignmentType: safeString(data.assignmentType),
          score: safeNumber(data.score),
          totalQuestions: safeNumber(data.totalQuestions),
          percentage: safeNumber(data.percentage),
          earnedXP: safeNumber(data.earnedXP),
          timeTakenSeconds: safeNumber(data.timeTakenSeconds),
          status: safeString(data.status, "completed"),
          completedAt: toDate(data.completedAt),
        };
      })
      .filter(
        (result) =>
          result.studentId === cleanedStudentId &&
          result.assignmentType === "quiz",
      )
      .map((result) => [result.assignmentId, result] as const),
  );

  const quizActivities: StudentAnalyticsActivity[] = quizAssignments.map(
    (assignmentDocument) => {
      const data = assignmentDocument.data();

      const result = quizResultByAssignmentId.get(assignmentDocument.id);

      const dueDate = toDate(data.dueDate);

      const completed = result?.status === "completed";

      const status: AnalyticsAssignmentStatus = completed
        ? "completed"
        : isOverdue(dueDate, false)
          ? "overdue"
          : "not_started";

      return {
        id: `quiz-${assignmentDocument.id}`,
        assignmentId: assignmentDocument.id,
        type: "quiz",
        title: safeString(data.title, "Assigned quiz"),
        topic: safeString(data.topic) || safeString(data.title, "Quiz"),
        className:
          classNameById.get(safeString(data.classId)) || "Assigned class",
        status,
        dueDate,
        completedAt: result?.completedAt || null,
        score: result?.score ?? null,
        totalQuestions: result?.totalQuestions ?? null,
        totalMarks: null,
        percentage: result?.percentage ?? null,
        earnedXP: result?.earnedXP ?? 0,
        timeTakenSeconds: result?.timeTakenSeconds ?? 0,
      };
    },
  );

  const examAssignments: ExamAssignmentRecord[] = examAssignmentsSnapshot.docs
    .map((assignmentDocument) => {
      const data = assignmentDocument.data();

      const snapshot =
        data.questionSetSnapshot && typeof data.questionSetSnapshot === "object"
          ? (data.questionSetSnapshot as Record<string, unknown>)
          : {};

      return {
        id: assignmentDocument.id,
        teacherId: safeString(data.teacherId),
        classId: safeString(data.classId),
        className:
          safeString(data.className) ||
          classNameById.get(safeString(data.classId)) ||
          "Assigned class",
        title: safeString(data.title, "Written assessment"),
        topic:
          safeString(snapshot.topic) ||
          safeString(data.questionSetTitle, "Written assessment"),
        studentIds: safeStringArray(data.studentIds),
        dueDate: toDate(data.dueDate),
        totalMarks: safeNumber(data.totalMarks),
        questionCount: safeNumber(data.questionCount),
        status: safeString(data.status, "active"),
      };
    })
    .filter(
      (assignment) =>
        assignment.studentIds.includes(cleanedStudentId) &&
        assignment.status !== "cancelled",
    );

  const examSubmissionByAssignmentId = new Map<string, ExamSubmissionRecord>(
    examSubmissionsSnapshot.docs
      .map((submissionDocument) => {
        const data = submissionDocument.data();

        return {
          id: submissionDocument.id,
          assignmentId: safeString(data.assignmentId),
          studentId: safeString(data.studentId),
          status: safeString(data.status, "not_started"),
          totalAwardedMarks: safeNumber(data.totalAwardedMarks),
          totalAvailableMarks: safeNumber(data.totalAvailableMarks),
          percentage: safeNumber(data.percentage),
          submittedAt: toDate(data.submittedAt),
          markedAt: toDate(data.markedAt),
          updatedAt: toDate(data.updatedAt),
        };
      })
      .filter((submission) => submission.studentId === cleanedStudentId)
      .map((submission) => [submission.assignmentId, submission]),
  );

  const examActivities: StudentAnalyticsActivity[] = examAssignments.map(
    (assignment) => {
      const submission = examSubmissionByAssignmentId.get(assignment.id);

      const marked = submission?.status === "marked";

      const submitted =
        submission?.status === "submitted" || submission?.status === "marking";

      const inProgress = submission?.status === "in_progress";

      const status: AnalyticsAssignmentStatus = marked
        ? "completed"
        : isOverdue(assignment.dueDate, false)
          ? "overdue"
          : submitted || inProgress
            ? "in_progress"
            : "not_started";

      return {
        id: `exam-${assignment.id}`,
        assignmentId: assignment.id,
        type: "exam",
        title: assignment.title,
        topic: assignment.topic,
        className: assignment.className,
        status,
        dueDate: assignment.dueDate,
        completedAt: submission?.markedAt || submission?.submittedAt || null,
        score: marked ? submission.totalAwardedMarks : null,
        totalQuestions: assignment.questionCount,
        totalMarks: assignment.totalMarks,
        percentage: marked ? submission.percentage : null,
        earnedXP: 0,
        timeTakenSeconds: 0,
      };
    },
  );

  const activities = [
    ...resourceActivities,
    ...quizActivities,
    ...examActivities,
  ].sort((first, second) => {
    const firstDate =
      first.completedAt?.getTime() || first.dueDate?.getTime() || 0;

    const secondDate =
      second.completedAt?.getTime() || second.dueDate?.getTime() || 0;

    return secondDate - firstDate;
  });

  const completedActivities = activities.filter(
    (activity) => activity.status === "completed",
  );

  const outstandingActivities = activities.filter(
    (activity) => activity.status !== "completed",
  );

  const completedQuizActivities = quizActivities.filter(
    (activity) =>
      activity.status === "completed" && activity.percentage !== null,
  );

  const completedExamActivities = examActivities.filter(
    (activity) =>
      activity.status === "completed" && activity.percentage !== null,
  );

  const quizScores = completedQuizActivities.map(
    (activity) => activity.percentage || 0,
  );

  const examScores = completedExamActivities.map(
    (activity) => activity.percentage || 0,
  );

  const assessedActivities = [
    ...completedQuizActivities,
    ...completedExamActivities,
  ];

  const topicGroups = new Map<
    string,
    {
      scores: number[];
      sources: Set<AnalyticsActivityType>;
    }
  >();

  assessedActivities.forEach((activity) => {
    const topic = activity.topic || activity.title || "Other";

    const group = topicGroups.get(topic) || {
      scores: [],
      sources: new Set<AnalyticsActivityType>(),
    };

    group.scores.push(activity.percentage || 0);

    group.sources.add(activity.type);

    topicGroups.set(topic, group);
  });

  const topicPerformance: StudentTopicPerformance[] = Array.from(
    topicGroups.entries(),
  )
    .map(([topic, group], index): StudentTopicPerformance => {
      const averageScore = average(group.scores);

      const classification: StudentTopicPerformance["classification"] =
        averageScore >= 70
          ? "strength"
          : averageScore < 50
            ? "support"
            : "developing";

      return {
        id: `topic-${index}`,
        topic,
        attempts: group.scores.length,
        averageScore,
        highestScore: Math.max(...group.scores),
        lowestScore: Math.min(...group.scores),
        classification,
        sources: Array.from(group.sources),
      };
    })
    .sort((first, second) => second.averageScore - first.averageScore);

  const chronologicalScores = assessedActivities
    .filter((activity) => activity.completedAt)
    .sort(
      (first, second) =>
        (first.completedAt?.getTime() || 0) -
        (second.completedAt?.getTime() || 0),
    )
    .map((activity) => activity.percentage || 0);

  let improvementTrend = 0;

  if (chronologicalScores.length >= 2) {
    const midpoint = Math.ceil(chronologicalScores.length / 2);

    improvementTrend =
      average(chronologicalScores.slice(midpoint)) -
      average(chronologicalScores.slice(0, midpoint));
  }

  const totalAssignments = activities.length;

  const completedAssignments = completedActivities.length;

  const quizAverage = average(quizScores);

  const examAverage = average(examScores);

  const combinedAssessmentAverage = average([...quizScores, ...examScores]);

  const metrics: StudentAnalyticsMetrics = {
    totalAssignments,
    completedAssignments,
    outstandingAssignments: outstandingActivities.length,
    overdueAssignments: activities.filter(
      (activity) => activity.status === "overdue",
    ).length,
    completionRate:
      totalAssignments > 0
        ? Math.round((completedAssignments / totalAssignments) * 100)
        : 0,

    totalResourceAssignments: resourceActivities.length,
    completedResourceAssignments: resourceActivities.filter(
      (activity) => activity.status === "completed",
    ).length,

    totalQuizAssignments: quizActivities.length,
    completedQuizAssignments: completedQuizActivities.length,
    quizAverage,
    highestQuizScore: quizScores.length > 0 ? Math.max(...quizScores) : 0,
    lowestQuizScore: quizScores.length > 0 ? Math.min(...quizScores) : 0,

    totalExamAssignments: examActivities.length,
    completedExamAssignments: completedExamActivities.length,
    submittedExamAssignments: examAssignments.filter((assignment) => {
      const submission = examSubmissionByAssignmentId.get(assignment.id);

      return ["submitted", "marking", "marked"].includes(
        submission?.status || "",
      );
    }).length,
    awaitingMarkingExamAssignments: examAssignments.filter((assignment) => {
      const submission = examSubmissionByAssignmentId.get(assignment.id);

      return (
        submission?.status === "submitted" || submission?.status === "marking"
      );
    }).length,
    examAverage,
    highestExamScore: examScores.length > 0 ? Math.max(...examScores) : 0,
    lowestExamScore: examScores.length > 0 ? Math.min(...examScores) : 0,

    combinedAssessmentAverage,
    currentGrade: indicativeGradeFromPercentage(
      combinedAssessmentAverage,
      student.qualification === "A_LEVEL" ? "A_LEVEL" : "GCSE",
    ),
    predictedGrade: indicativeGradeFromPercentage(
      Math.max(
        0,
        Math.min(
          100,
          combinedAssessmentAverage + Math.round(improvementTrend * 0.4),
        ),
      ),
      student.qualification === "A_LEVEL" ? "A_LEVEL" : "GCSE",
    ),

    totalXP: student.xp,
    assignmentXP: completedQuizActivities.reduce(
      (total, activity) => total + activity.earnedXP,
      0,
    ),
    streak: student.streak,
    completedLessons: student.completedLessons.length,
    completedTopics: student.completedTopics.length,
    completedUnits: student.completedUnits.length,
    averageTimeTakenSeconds: average(
      completedQuizActivities
        .map((activity) => activity.timeTakenSeconds)
        .filter((time) => time > 0),
    ),
    improvementTrend,
  };

  const strongestTopics = topicPerformance
    .filter((topic) => topic.classification === "strength")
    .slice(0, 3);

  const weakestTopics = [...topicPerformance]
    .filter((topic) => topic.classification === "support")
    .sort((first, second) => first.averageScore - second.averageScore)
    .slice(0, 3);

  const recentActivities = completedActivities
    .filter((activity) => activity.completedAt)
    .sort(
      (first, second) =>
        (second.completedAt?.getTime() || 0) -
        (first.completedAt?.getTime() || 0),
    )
    .slice(0, 8);

  return {
    student,
    classes,
    metrics,
    activities,
    recentActivities,
    outstandingActivities,
    topicPerformance,
    strongestTopics,
    weakestTopics,
    recommendations: buildRecommendations(metrics, weakestTopics),
  };
}

