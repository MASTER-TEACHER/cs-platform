"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type StudentSummary = {
  id: string;
  name: string;
  email: string;
  xp: number;
  streak: number;
  badges: number;
  completedLessons: number;
};

export function useStudents() {
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudents() {
      try {
        const snapshot = await getDocs(collection(db, "users"));

        const studentList: StudentSummary[] = snapshot.docs
          .map((studentDoc) => {
            const data = studentDoc.data();

            return {
              id: studentDoc.id,
              name: data.name || "Student",
              email: data.email || "No email available",
              xp: data.xp || 0,
              streak: data.streak || 0,
              badges: Array.isArray(data.badges) ? data.badges.length : 0,
              completedLessons: Array.isArray(data.completedLessons)
                ? data.completedLessons.length
                : 0,
              role: data.role,
            };
          })
          .filter((student) => student.role === "student")
          .map(({ role, ...student }) => student);

        studentList.sort((a, b) => b.xp - a.xp);

        setStudents(studentList);
      } catch (error) {
        console.error("Failed to load students:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStudents();
  }, []);

  return { students, loading };
}