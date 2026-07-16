"use client";

import { useEffect, useState } from "react";
import {
  collection,
  collectionGroup,
  getDocs,
  orderBy,
  query,
  where,
  type Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

export type RecentTeacherActivity = {
  id: string;
  studentName: string;
  activity: string;
  result: string;
  time: string;
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

type TeacherDashboardData = {
  studentCount: number;
  classCount: number;
  assignmentCount: number;
  activeAssignmentCount: number;
  averageScore: number;
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

type AssignmentResultRecord = {
  id: string;
  studentId: string;
  assignmentId: string;
  percentage: number;
  status: string;
  completedAt?: Timestamp;
};

const initialData: TeacherDashboardData = {
  studentCount: 0,
  classCount: 0,
  assignmentCount: 0,
  activeAssignmentCount: 0,
  averageScore: 0,
  completionRate: 0,
  lessonsCompleted: 0,
  completedToday: 0,
  recentActivities: [],
  atRiskStudents: [],
  topStudents: [],
  classPerformance: [],
};

function formatActivityTime(timestamp?: Timestamp): string {
  if (!timestamp) {
    return "Recently";
  }

  const activityDate = timestamp.toDate();
  const difference = Date.now() - activityDate.getTime();
  const minutes = Math.floor(difference / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

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

export function useTeacherDashboard() {
  const { user, loading: authLoading } = useAuth();

  const [data, setData] = useState<TeacherDashboardData>(initialData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setData(initialData);
      setLoading(false);
      return;
    }

    const teacherId = user.uid;
    let cancelled = false;

    async function loadDashboard() {
      try {
        setLoading(true);

        const [
          usersSnapshot,
          classesSnapshot,
          assignmentsSnapshot,
          assignmentResultsSnapshot,
          quizResultsSnapshot,
        ] = await Promise.all([
          getDocs(collection(db, "users")),

          getDocs(
            query(
              collection(db, "classes"),
              where("teacherId", "==", teacherId)
            )
          ),

          getDocs(
            query(
              collection(db, "assignments"),
              where("teacherId", "==", teacherId)
            )
          ),

          getDocs(
            query(
              collection(db, "assignmentResults"),
              where("teacherId", "==", teacherId)
            )
          ),

          getDocs(
            query(
              collectionGroup(db, "quizResults"),
              orderBy("createdAt", "desc")
            )
          ),
        ]);

        if (cancelled) {
          return;
        }

        const students: UserRecord[] = usersSnapshot.docs
          .map((userDocument) => {
            const userData = userDocument.data();

            return {
              id: userDocument.id,
              name: userData.name || "Student",
              role: userData.role || "student",
              xp: userData.xp || 0,
              streak: userData.streak || 0,
              badges: Array.isArray(userData.badges)
                ? userData.badges
                : [],
              completedLessons: Array.isArray(userData.completedLessons)
                ? userData.completedLessons
                : [],
            };
          })
          .filter((student) => student.role === "student");

        const assignments = assignmentsSnapshot.docs.map(
          (assignmentDocument) => {
            const assignmentData = assignmentDocument.data();

            return {
              id: assignmentDocument.id,
              status: assignmentData.status || "active",
            };
          }
        );

        const assignmentResults: AssignmentResultRecord[] =
          assignmentResultsSnapshot.docs.map((resultDocument) => {
            const resultData = resultDocument.data();

            return {
              id: resultDocument.id,
              studentId: resultData.studentId || "",
              assignmentId: resultData.assignmentId || "",
              percentage: resultData.percentage || 0,
              status: resultData.status || "completed",
              completedAt: resultData.completedAt,
            };
          });

        const quizResults: QuizResultRecord[] = quizResultsSnapshot.docs.map(
          (resultDocument) => {
            const resultData = resultDocument.data();

            return {
              id: resultDocument.id,
              uid: resultData.uid || resultDocument.ref.parent.parent?.id || "",
              studentName: resultData.studentName || "",
              title: resultData.title || "Quiz",
              topicId: resultData.topicId || "Other",
              scorePercent: resultData.scorePercent || 0,
              createdAt: resultData.createdAt,
            };
          }
        );

        const totalQuizScore = quizResults.reduce(
          (total, result) => total + result.scorePercent,
          0
        );

        const averageScore =
          quizResults.length > 0
            ? Math.round(totalQuizScore / quizResults.length)
            : 0;

        const lessonsCompleted = students.reduce(
          (total, student) => total + student.completedLessons.length,
          0
        );

        const expectedSubmissions =
          assignments.length * students.length;

        const completionRate =
          expectedSubmissions > 0
            ? Math.round(
                (assignmentResults.length / expectedSubmissions) * 100
              )
            : 0;

        const completedToday = assignmentResults.filter((result) =>
          isToday(result.completedAt)
        ).length;

        const topStudents: TopStudent[] = [...students]
          .sort((a, b) => b.xp - a.xp)
          .slice(0, 5)
          .map((student) => ({
            id: student.id,
            name: student.name,
            xp: student.xp,
            streak: student.streak,
            badges: student.badges.length,
          }));

        const recentActivities: RecentTeacherActivity[] = quizResults
          .slice(0, 6)
          .map((result) => {
            const matchedStudent = students.find(
              (student) => student.id === result.uid
            );

            return {
              id: result.id,
              studentName:
                result.studentName ||
                matchedStudent?.name ||
                "Student",
              activity: `Completed ${result.title}`,
              result: `${result.scorePercent}%`,
              time: formatActivityTime(result.createdAt),
            };
          });

        const resultsByStudent = new Map<string, number[]>();

        quizResults.forEach((result) => {
          if (!result.uid) {
            return;
          }

          const scores = resultsByStudent.get(result.uid) || [];
          scores.push(result.scorePercent);
          resultsByStudent.set(result.uid, scores);
        });

        const atRiskStudents: AtRiskStudent[] = students
          .map((student) => {
            const scores = resultsByStudent.get(student.id) || [];

            const studentAverage =
              scores.length > 0
                ? Math.round(
                    scores.reduce((total, score) => total + score, 0) /
                      scores.length
                  )
                : 0;

            return {
              id: student.id,
              name: student.name,
              weakTopic: "Recent Quiz Performance",
              averageScore: studentAverage,
              recommendedAction:
                "Review recent quiz results and assign targeted revision.",
              hasResults: scores.length > 0,
            };
          })
          .filter(
            (student) =>
              student.hasResults && student.averageScore < 50
          )
          .slice(0, 5)
          .map(({ hasResults: _hasResults, ...student }) => student);

        const topicGroups = new Map<string, number[]>();

        quizResults.forEach((result) => {
          const topic = result.title || result.topicId || "Other";
          const scores = topicGroups.get(topic) || [];

          scores.push(result.scorePercent);
          topicGroups.set(topic, scores);
        });

        const classPerformance: TopicPerformance[] = Array.from(
          topicGroups.entries()
        )
          .map(([topic, scores], index) => ({
            id: `topic-${index}`,
            topic,
            averageScore: Math.round(
              scores.reduce((total, score) => total + score, 0) /
                scores.length
            ),
          }))
          .sort((a, b) => b.averageScore - a.averageScore);

        setData({
          studentCount: students.length,
          classCount: classesSnapshot.size,
          assignmentCount: assignments.length,
          activeAssignmentCount: assignments.filter(
            (assignment) => assignment.status === "active"
          ).length,
          averageScore,
          completionRate,
          lessonsCompleted,
          completedToday,
          recentActivities,
          atRiskStudents,
          topStudents,
          classPerformance,
        });
      } catch (error) {
        console.error("Teacher dashboard load error:", error);

        if (!cancelled) {
          setData(initialData);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  return {
    ...data,
    loading: authLoading || loading,
  };
}