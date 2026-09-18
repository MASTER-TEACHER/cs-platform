"use client";

import { useEffect, useRef } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { updateUserCourseSelection } from "@/services/userService";

import type {
  ExamBoard,
  Qualification,
  Subject,
} from "@/types/user";

function getCanonicalSubject(
  subject: Subject | undefined,
): Subject {
  return subject === "CREATIVE_IMEDIA"
    ? "CREATIVE_IMEDIA"
    : "COMPUTER_SCIENCE";
}

function buildCourseLabel(
  subject: Subject,
  qualification: Qualification,
  examBoard: ExamBoard,
): string {
  if (subject === "CREATIVE_IMEDIA") {
    return "OCR Cambridge National Creative iMedia J834";
  }

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

    const subject =
      getCanonicalSubject(
        profile.subject,
      );

    const qualification =
      profile.qualification;

    const examBoard =
      profile.examBoard;

    const expectedCurrentCourse =
      buildCourseLabel(
        subject,
        qualification,
        examBoard,
      );

    const existingCurrentCourse =
      profile.currentCourse?.trim() ||
      "";

          const subjectNeedsRepair =
      profile.subject !== subject;

    const courseIsCurrent =
      existingCurrentCourse ===
      expectedCurrentCourse;

    const courseNeedsRepair =
      !courseIsCurrent;

    if (
      !subjectNeedsRepair &&
      !courseNeedsRepair
    ) {
      return;
    }
    const repairKey = [
      uid,
      subject,
      qualification,
      examBoard,
      profile.subject || "NO_SUBJECT",
      existingCurrentCourse,
    ].join("|");

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
            subject,
            qualification,
            examBoard,
            currentCourse:
              expectedCurrentCourse,
          },
        );

        await refreshProfile();
      } catch (error) {
        console.warn(
          "Unable to repair legacy curriculum profile:",
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