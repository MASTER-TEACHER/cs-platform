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

export type RecentTeacherActivity = {
  id: string;
  studentName: string;
  activity: string;
  result: string;
  time: string;
  type: "quiz" | "exam";
};

export type AtRiskStudent = {
  id: string;
  name: string;
  weakTopic: string;
  averageScore: number;
  recommendedAction: string;
};

export type TopStudent = {
  id: string;
  name: string;
  xp: number;
  streak: number;
  badges: number;
};

export type TopicPerformance = {
  id: string;
  topic: string;
  averageScore: number;
};

export type TeacherDashboardData = {
  studentCount: number;
  classCount: number;
  assignmentCount: number;
  activeAssignmentCount: number;
  examAssignmentCount: number;
  awaitingMarkingCount: number;
  averageScore: number;
  quizAverage: number;
  examAverage: number;
  completionRate: number;
  lessonsCompleted: number;
  completedToday: number;
  recentActivities: RecentTeacherActivity[];
  atRiskStudents: AtRiskStudent[];
  topStudents: TopStudent[];
  classPerformance: TopicPerformance[];
};

type UserRecord = {
  id: string;
  name: string;
  role: string;
  xp: number;
  streak: number;
  badges: string[];
  completedLessons: string[];
};

type QuizResultRecord = {
  id: string;
  uid: string;
  studentName: string;
  title: string;
  topicId: string;
  scorePercent: number;
  createdAt?: Timestamp;
};

type AssignmentRecord = {
  id: string;
  status: string;
};

type ResourceAssignmentRecord = {
  id: string;
  status: string;
  studentIds: string[];
  studentCount: number;
  completedCount: number;
};

type AssignmentResultRecord = {
  id: string;
  studentId: string;
  assignmentId: string;
  percentage: number;
  status: string;
  completedAt?: Timestamp;
};

type ResourceAssignmentProgressRecord = {
  id: string;
  assignmentId: string;
  studentId: string;
  status: string;
  completedAt?: Timestamp;
};

type ExamAssignmentRecord = {
  id: string;
  status: string;
  studentIds: string[];
};

type ExamSubmissionRecord = {
  id: string;
  studentId: string;
  studentName: string;
  assignmentId: string;
  status: string;
  percentage: number;
  topic: string;
  markedAt?: Timestamp;
  submittedAt?: Timestamp;
};

export const emptyTeacherDashboardData: TeacherDashboardData = {
  studentCount: 0,
  classCount: 0,
  assignmentCount: 0,
  activeAssignmentCount: 0,
  examAssignmentCount: 0,
  awaitingMarkingCount: 0,
  averageScore: 0,
  quizAverage: 0,
  examAverage: 0,
  completionRate: 0,
  lessonsCompleted: 0,
  completedToday: 0,
  recentActivities: [],
  atRiskStudents: [],
  topStudents: [],
  classPerformance: [],
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

function formatActivityTime(timestamp?: Timestamp): string {
  if (!timestamp) {
    return "Recently";
  }

  const activityDate = timestamp.toDate();

  const difference = Date.now() - activityDate.getTime();

  const minutes = Math.floor(difference / 60000);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);

  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function isToday(timestamp?: Timestamp): boolean {
  if (!timestamp) {
    return false;
  }

  const date = timestamp.toDate();

  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function calculateAverage(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return Math.round(
    values.reduce((sum, value) => sum + value, 0) / values.length,
  );
}

export async function getTeacherDashboardData(
  teacherId: string,
): Promise<TeacherDashboardData> {
  const cleanedTeacherId = teacherId.trim();

  if (!cleanedTeacherId) {
    return emptyTeacherDashboardData;
  }

  const [
    classesSnapshot,
    assignmentsSnapshot,
    assignmentResultsSnapshot,
    resourceAssignmentsSnapshot,
    examAssignmentsSnapshot,
    examSubmissionsSnapshot,
  ] = await Promise.all([
    getDocs(
      query(
        collection(db, "classes"),
        where("teacherId", "==", cleanedTeacherId),
      ),
    ),

    getDocs(
      query(
        collection(db, "assignments"),
        where("teacherId", "==", cleanedTeacherId),
      ),
    ),

    getDocs(
      query(
        collection(db, "assignmentResults"),
        where("teacherId", "==", cleanedTeacherId),
      ),
    ),

    getDocs(
      query(
        collection(db, "classAssignments"),
        where("teacherId", "==", cleanedTeacherId),
      ),
    ),

    getDocs(
      query(
        collection(db, "examAssignments"),
        where("teacherId", "==", cleanedTeacherId),
      ),
    ),

    getDocs(
      query(
        collection(db, "examSubmissions"),
        where("teacherId", "==", cleanedTeacherId),
      ),
    ),
  ]);

  /*
   * DATA ISOLATION:
   *
   * A teacher's dashboard must be built only from students explicitly
   * enrolled in classes owned by that teacher.
   *
   * Never fall back to every platform student when a teacher has no classes.
   * That would expose another teacher's learners and evidence.
   */
  const teacherStudentIds = new Set<string>();

  classesSnapshot.docs.forEach((classDocument) => {
    const data = classDocument.data();

    safeStringArray(data.studentIds).forEach((studentId) => {
      teacherStudentIds.add(studentId);
    });
  });

  /*
   * Some classes can contain legacy/demo learner IDs that no longer map to
   * a readable user profile. A single denied/missing profile must not make
   * the entire teacher dashboard fail.
   *
   * Firestore continues to enforce tenant isolation. We deliberately do not
   * broaden the security rule here; instead we retain only profile reads that
   * the signed-in teacher is actually authorised to resolve.
   */
  const studentSnapshotResults = await Promise.allSettled(
    Array.from(teacherStudentIds).map((studentId) =>
      getDoc(doc(db, "users", studentId)),
    ),
  );

  const studentSnapshots = studentSnapshotResults.flatMap(
    (result) =>
      result.status === "fulfilled"
        ? [result.value]
        : [],
  );

  const relevantStudents: UserRecord[] = studentSnapshots
    .filter((studentSnapshot) => studentSnapshot.exists())
    .map((studentSnapshot) => {
      const data = studentSnapshot.data();

      return {
        id: studentSnapshot.id,
        name: safeString(data.name, "Student"),
        role: safeString(data.role, "student"),
        xp: safeNumber(data.xp),
        streak: safeNumber(data.streak),
        badges: safeStringArray(data.badges),
        completedLessons: safeStringArray(data.completedLessons),
      };
    })
    .filter((student) => student.role === "student");

  const relevantStudentIds = new Set(
    relevantStudents.map((student) => student.id),
  );

  /*
   * Fetch quiz evidence only from students who belong to this teacher's
   * classes. This avoids downloading platform-wide quiz results and then
   * filtering them in the browser.
   */
  const quizResultSnapshots = await Promise.all(
    Array.from(relevantStudentIds).map((studentId) =>
      getDocs(collection(db, "users", studentId, "quizResults")),
    ),
  );

  const quizResultDocuments = quizResultSnapshots.flatMap(
    (snapshot) => snapshot.docs,
  );

  const assignments: AssignmentRecord[] = assignmentsSnapshot.docs.map(
    (assignmentDocument) => {
      const data = assignmentDocument.data();

      return {
        id: assignmentDocument.id,
        status: safeString(data.status, "active"),
      };
    },
  );

  const resourceAssignments: ResourceAssignmentRecord[] =
    resourceAssignmentsSnapshot.docs.map((assignmentDocument) => {
      const data = assignmentDocument.data();
      const studentIds = safeStringArray(data.studentIds).filter((studentId) =>
        relevantStudentIds.has(studentId),
      );

      const storedStudentCount = safeNumber(data.studentCount);
      const storedCompletedCount = safeNumber(data.completedCount);

      return {
        id: assignmentDocument.id,
        status: safeString(data.status, "active"),
        studentIds,
        studentCount:
          storedStudentCount > 0 ? storedStudentCount : studentIds.length,
        completedCount: Math.min(
          storedCompletedCount,
          storedStudentCount > 0 ? storedStudentCount : studentIds.length,
        ),
      };
    });

  /*
   * Resource/lesson assignments store per-student completion in
   * assignmentProgress/{assignmentId}_{studentId}.
   *
   * Read only the expected progress documents for this teacher's own
   * assignments and currently enrolled learners. This keeps the dashboard
   * isolated and lets Completed Today include lesson/resource completions.
   */
  const resourceProgressSnapshots = await Promise.all(
    resourceAssignments.flatMap((assignment) =>
      assignment.studentIds.map((studentId) =>
        getDoc(
          doc(
            db,
            "assignmentProgress",
            `${assignment.id}_${studentId}`,
          ),
        ),
      ),
    ),
  );

  const resourceAssignmentProgress: ResourceAssignmentProgressRecord[] =
    resourceProgressSnapshots
      .filter((progressSnapshot) => progressSnapshot.exists())
      .map((progressSnapshot) => {
        const data = progressSnapshot.data();

        return {
          id: progressSnapshot.id,
          assignmentId: safeString(data.assignmentId),
          studentId: safeString(data.studentId),
          status: safeString(data.status, "not_started"),
          completedAt:
            data.completedAt instanceof Timestamp
              ? data.completedAt
              : undefined,
        };
      })
      .filter(
        (progress) =>
          relevantStudentIds.has(progress.studentId) &&
          resourceAssignments.some(
            (assignment) => assignment.id === progress.assignmentId,
          ),
      );

  const assignmentResults: AssignmentResultRecord[] =
    assignmentResultsSnapshot.docs
      .map((resultDocument) => {
        const data = resultDocument.data();

        return {
          id: resultDocument.id,
          studentId: safeString(data.studentId),
          assignmentId: safeString(data.assignmentId),
          percentage: safeNumber(data.percentage),
          status: safeString(data.status, "completed"),
          completedAt:
            data.completedAt instanceof Timestamp
              ? data.completedAt
              : undefined,
        };
      })
      .filter((result) => relevantStudentIds.has(result.studentId));

  const quizResults: QuizResultRecord[] = quizResultDocuments
    .map((resultDocument) => {
      const data = resultDocument.data();

      return {
        id: resultDocument.id,
        uid: safeString(data.uid) || resultDocument.ref.parent.parent?.id || "",
        studentName: safeString(data.studentName),
        title: safeString(data.title, "Quiz"),
        topicId: safeString(data.topicId, "Other"),
        scorePercent: safeNumber(data.scorePercent),
        createdAt:
          data.createdAt instanceof Timestamp ? data.createdAt : undefined,
      };
    })
    .filter(
      (result) =>
        Boolean(result.uid) &&
        relevantStudentIds.has(result.uid),
    );

  const examAssignments: ExamAssignmentRecord[] =
    examAssignmentsSnapshot.docs.map((assignmentDocument) => {
      const data = assignmentDocument.data();

      return {
        id: assignmentDocument.id,
        status: safeString(data.status, "active"),
        studentIds: safeStringArray(data.studentIds),
      };
    });

  const examAssignmentIdSet = new Set(
    examAssignments.map((assignment) => assignment.id),
  );

  const examSubmissions: ExamSubmissionRecord[] = examSubmissionsSnapshot.docs
    .map((submissionDocument) => {
      const data = submissionDocument.data();

      return {
        id: submissionDocument.id,
        studentId: safeString(data.studentId),
        studentName: safeString(data.studentName),
        assignmentId: safeString(data.assignmentId),
        status: safeString(data.status, "not_started"),
        percentage: safeNumber(data.percentage),
        topic: safeString(data.topic, "Written assessment"),
        markedAt:
          data.markedAt instanceof Timestamp ? data.markedAt : undefined,
        submittedAt:
          data.submittedAt instanceof Timestamp ? data.submittedAt : undefined,
      };
    })
    .filter(
      (submission) =>
        relevantStudentIds.has(submission.studentId) &&
        examAssignmentIdSet.has(submission.assignmentId),
    );

  const markedExamSubmissions = examSubmissions.filter(
    (submission) => submission.status === "marked",
  );

  const awaitingMarkingCount = examSubmissions.filter(
    (submission) =>
      submission.status === "submitted" || submission.status === "marking",
  ).length;

  const quizScores = quizResults.map((result) => result.scorePercent);

  const examScores = markedExamSubmissions.map(
    (submission) => submission.percentage,
  );

  const quizAverage = calculateAverage(quizScores);

  const examAverage = calculateAverage(examScores);

  const averageScore = calculateAverage([...quizScores, ...examScores]);

  const lessonsCompleted = relevantStudents.reduce(
    (total, student) => total + student.completedLessons.length,
    0,
  );

  const expectedQuizSubmissions = assignments.length * relevantStudents.length;

  const expectedResourceCompletions = resourceAssignments.reduce(
    (total, assignment) => total + assignment.studentCount,
    0,
  );

  const completedResourceCompletions = resourceAssignments.reduce(
    (total, assignment) => total + assignment.completedCount,
    0,
  );

  const expectedExamSubmissions = examAssignments.reduce(
    (total, assignment) =>
      total +
      assignment.studentIds.filter((studentId) =>
        relevantStudentIds.has(studentId),
      ).length,
    0,
  );

  const completedAssignmentResults = assignmentResults.filter(
    (result) => result.status === "completed",
  );

  const completedExamSubmissions = examSubmissions.filter(
    (submission) => submission.status === "marked",
  );

  const expectedSubmissions =
    expectedQuizSubmissions +
    expectedResourceCompletions +
    expectedExamSubmissions;

  const completedSubmissions =
    completedAssignmentResults.length +
    completedResourceCompletions +
    completedExamSubmissions.length;

  const completionRate =
    expectedSubmissions > 0
      ? Math.min(
          100,
          Math.round((completedSubmissions / expectedSubmissions) * 100),
        )
      : 0;

  const completedResourceProgressToday = resourceAssignmentProgress.filter(
    (progress) =>
      progress.status === "completed" &&
      isToday(progress.completedAt),
  ).length;

  const completedToday =
    completedAssignmentResults.filter((result) => isToday(result.completedAt))
      .length +
    completedResourceProgressToday +
    completedExamSubmissions.filter((submission) =>
      isToday(submission.markedAt),
    ).length;

  const topStudents: TopStudent[] = [...relevantStudents]
    .sort((first, second) => second.xp - first.xp)
    .slice(0, 5)
    .map((student) => ({
      id: student.id,
      name: student.name,
      xp: student.xp,
      streak: student.streak,
      badges: student.badges.length,
    }));

  const quizActivities: RecentTeacherActivity[] = quizResults
    .slice(0, 8)
    .map((result) => {
      const matchedStudent = relevantStudents.find(
        (student) => student.id === result.uid,
      );

      return {
        id: `quiz-${result.id}`,
        studentName: result.studentName || matchedStudent?.name || "Student",
        activity: `Completed ${result.title}`,
        result: `${result.scorePercent}%`,
        time: formatActivityTime(result.createdAt),
        type: "quiz" as const,
      };
    });

  const examActivities: RecentTeacherActivity[] = markedExamSubmissions.map(
    (submission) => {
      const matchedStudent = relevantStudents.find(
        (student) => student.id === submission.studentId,
      );

      return {
        id: `exam-${submission.id}`,
        studentName:
          submission.studentName || matchedStudent?.name || "Student",
        activity: "Completed written assessment",
        result: `${submission.percentage}%`,
        time: formatActivityTime(submission.markedAt || submission.submittedAt),
        type: "exam" as const,
      };
    },
  );

  const recentActivities = [...quizActivities, ...examActivities].slice(0, 8);

  const scoresByStudent = new Map<string, number[]>();

  quizResults.forEach((result) => {
    if (!result.uid) {
      return;
    }

    const scores = scoresByStudent.get(result.uid) || [];

    scores.push(result.scorePercent);

    scoresByStudent.set(result.uid, scores);
  });

  markedExamSubmissions.forEach((submission) => {
    const scores = scoresByStudent.get(submission.studentId) || [];

    scores.push(submission.percentage);

    scoresByStudent.set(submission.studentId, scores);
  });

  const atRiskStudents: AtRiskStudent[] = relevantStudents
    .map((student) => {
      const scores = scoresByStudent.get(student.id) || [];

      return {
        id: student.id,
        name: student.name,
        weakTopic: "Combined Assessment Performance",
        averageScore: calculateAverage(scores),
        recommendedAction:
          "Review quiz and written exam evidence, then assign targeted revision.",
        hasResults: scores.length > 0,
      };
    })
    .filter((student) => student.hasResults && student.averageScore < 50)
    .sort((first, second) => first.averageScore - second.averageScore)
    .slice(0, 5)
    .map((student) => ({
      id: student.id,
      name: student.name,
      weakTopic: student.weakTopic,
      averageScore: student.averageScore,
      recommendedAction: student.recommendedAction,
    }));

  const topicGroups = new Map<string, number[]>();

  quizResults.forEach((result) => {
    const topic = result.title || result.topicId || "Other";

    const scores = topicGroups.get(topic) || [];

    scores.push(result.scorePercent);

    topicGroups.set(topic, scores);
  });

  markedExamSubmissions.forEach((submission) => {
    const topic = submission.topic || "Written assessment";

    const scores = topicGroups.get(topic) || [];

    scores.push(submission.percentage);

    topicGroups.set(topic, scores);
  });

  const classPerformance: TopicPerformance[] = Array.from(topicGroups.entries())
    .map(([topic, scores], index) => ({
      id: `topic-${index}`,
      topic,
      averageScore: calculateAverage(scores),
    }))
    .sort((first, second) => second.averageScore - first.averageScore);

  return {
    studentCount: relevantStudents.length,
    classCount: classesSnapshot.size,
    assignmentCount:
      assignments.length + resourceAssignments.length + examAssignments.length,
    activeAssignmentCount:
      assignments.filter((assignment) => assignment.status === "active")
        .length +
      resourceAssignments.filter((assignment) => assignment.status === "active")
        .length +
      examAssignments.filter((assignment) => assignment.status === "active")
        .length,
    examAssignmentCount: examAssignments.length,
    awaitingMarkingCount,
    averageScore,
    quizAverage,
    examAverage,
    completionRate,
    lessonsCompleted,
    completedToday,
    recentActivities,
    atRiskStudents,
    topStudents,
    classPerformance,
  };
}