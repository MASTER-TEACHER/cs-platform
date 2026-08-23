"use client";

import { useEffect, useRef } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { updateUserCourseSelection } from "@/services/userService";
import type { ExamBoard, Qualification } from "@/types/user";

function buildCourseLabel(
  qualification: Qualification,
  examBoard: ExamBoard,
): string {
  const level =
    qualification === "A_LEVEL"
      ? "A Level"
      : "GCSE";

  return `${examBoard} ${level} Computer Science`;
}

export default function ProfileCourseRepair() {
  const {
    user,
    profile,
    profileReady,
    refreshProfile,
  } = useAuth();

  const attempted = useRef(false);

  useEffect(() => {
    if (
      attempted.current ||
      !profileReady ||
      !user ||
      !profile ||
      profile.role !== "student" ||
      Boolean(profile.currentCourse?.trim()) ||
      !profile.qualification ||
      !profile.examBoard
    ) {
      return;
    }

    /*
     * Capture the already-validated values before entering
     * the asynchronous function.
     *
     * This preserves TypeScript narrowing:
     * - uid is definitely a string
     * - qualification is definitely Qualification
     * - examBoard is definitely ExamBoard
     */
    const uid = user.uid;
    const qualification = profile.qualification;
    const examBoard = profile.examBoard;

    const currentCourse = buildCourseLabel(
      qualification,
      examBoard,
    );

    attempted.current = true;

    async function repairLegacyCourseKey() {
      try {
        await updateUserCourseSelection(
          uid,
          {
            qualification,
            examBoard,
            currentCourse,
          },
        );

        await refreshProfile();
      } catch (error) {
        /*
         * This is only a profile compatibility repair.
         * The profile page should remain usable even if
         * the repair write cannot be completed.
         */
        console.warn(
          "Unable to repair legacy currentCourse:",
          error,
        );
      }
    }

    void repairLegacyCourseKey();
  }, [
    profileReady,
    user,
    profile,
    refreshProfile,
  ]);

  return null;
}