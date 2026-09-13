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

  const attemptedKey = useRef("");

  useEffect(() => {
    if (
      !profileReady ||
      !user ||
      !profile ||
      profile.role !== "student" ||
      !profile.qualification ||
      !profile.examBoard
    ) {
      return;
    }

    const uid = user.uid;
    const qualification = profile.qualification;
    const examBoard = profile.examBoard;

    const expectedCurrentCourse =
      buildCourseLabel(
        qualification,
        examBoard,
      );

    const existingCurrentCourse =
      profile.currentCourse?.trim() || "";

    if (
      existingCurrentCourse ===
      expectedCurrentCourse
    ) {
      return;
    }

    const repairKey =
      `${uid}|${qualification}|${examBoard}|${existingCurrentCourse}`;

    if (
      attemptedKey.current ===
      repairKey
    ) {
      return;
    }

    attemptedKey.current =
      repairKey;

    async function repairLegacyCourseKey() {
      try {
        await updateUserCourseSelection(
          uid,
          {
            qualification,
            examBoard,
            currentCourse:
              expectedCurrentCourse,
          },
        );

        await refreshProfile();
      } catch (error) {
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
