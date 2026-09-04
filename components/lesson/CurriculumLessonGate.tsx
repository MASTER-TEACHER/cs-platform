"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "@/contexts/AuthContext";
import {
  createLessonAssignmentResourceId,
} from "@/services/lessonAssignmentService";
import {
  getAssignmentById,
} from "@/services/resourceAssignmentService";
import { getCurriculumCoverage } from "@/services/curriculumCoverageService";

type Props = {
  topicId: string;
  lessonId: string;
  assignmentId?: string;
  children: ReactNode;
};

type AssignmentAccessState =
  | "not-needed"
  | "checking"
  | "allowed"
  | "denied";

export default function CurriculumLessonGate({
  topicId,
  lessonId,
  assignmentId,
  children,
}: Props) {
  const {
    user,
    profile,
    loading,
    profileReady,
    profileError,
  } = useAuth();

  const [
    assignmentAccess,
    setAssignmentAccess,
  ] =
    useState<AssignmentAccessState>(
      assignmentId
        ? "checking"
        : "not-needed",
    );

  useEffect(() => {
    let cancelled = false;

    async function validateAssignmentAccess() {
      if (!assignmentId) {
        setAssignmentAccess(
          "not-needed",
        );
        return;
      }

      if (
        !user ||
        profile?.role !== "student"
      ) {
        setAssignmentAccess(
          "denied",
        );
        return;
      }

      setAssignmentAccess("checking");

      try {
        const assignment =
          await getAssignmentById(
            assignmentId,
          );

        if (cancelled) {
          return;
        }

        if (!assignment) {
          setAssignmentAccess(
            "denied",
          );
          return;
        }

        const studentIsRecipient =
          assignment.studentIds.includes(
            user.uid,
          );

        const isLessonAssignment =
          assignment.resourceType ===
          "lesson";

        const expectedResourceId =
          createLessonAssignmentResourceId(
            topicId,
            lessonId,
          );

        const exactLessonMatches =
          assignment.resourceId ===
          expectedResourceId;

        if (
          studentIsRecipient &&
          isLessonAssignment &&
          exactLessonMatches
        ) {
          setAssignmentAccess(
            "allowed",
          );
          return;
        }

        setAssignmentAccess(
          "denied",
        );
      } catch (error) {
        console.error(
          "Lesson assignment access validation failed:",
          error,
        );

        if (!cancelled) {
          setAssignmentAccess(
            "denied",
          );
        }
      }
    }

    void validateAssignmentAccess();

    return () => {
      cancelled = true;
    };
  }, [
    assignmentId,
    lessonId,
    profile?.role,
    topicId,
    user,
  ]);

  const curriculumAllowed =
    useMemo(() => {
      if (
        profile?.role !== "student"
      ) {
        return true;
      }

      if (
        !profile.qualification ||
        !profile.examBoard
      ) {
        return false;
      }

      const coverage =
        getCurriculumCoverage(
          profile.qualification,
          profile.examBoard,
        );

      return Boolean(
        coverage?.units.some(
          (unit) =>
            unit.topics.some(
              (topic) =>
                topic.id ===
                topicId,
            ),
        ),
      );
    }, [
      profile?.examBoard,
      profile?.qualification,
      profile?.role,
      topicId,
    ]);

  if (
    loading ||
    (!profileReady &&
      !profileError)
  ) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="font-bold text-slate-600">
          Checking your curriculum...
        </p>
      </div>
    );
  }

  if (profileError) {
    return (
      <section className="rounded-3xl border border-red-200 bg-red-50 p-8">
        <h1 className="text-2xl font-black text-red-950">
          Curriculum check unavailable
        </h1>

        <p className="mt-3 text-red-800">
          {profileError}
        </p>
      </section>
    );
  }

  /*
   * Teacher/admin users may preview
   * curriculum content normally.
   */
  if (
    profile?.role !== "student"
  ) {
    return <>{children}</>;
  }

  /*
   * A teacher-assigned lesson can override
   * the student's normal curriculum gate,
   * but only after validating:
   *
   * 1. the assignment exists;
   * 2. this student is a recipient;
   * 3. the assignment resource type is lesson;
   * 4. the resource matches this exact
   *    topic + lesson combination.
   */
  if (
    assignmentId &&
    assignmentAccess ===
      "checking"
  ) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="rounded-2xl border border-blue-200 bg-blue-50 px-8 py-6 text-center">
          <p className="font-black text-blue-950">
            Checking assigned lesson...
          </p>

          <p className="mt-2 text-sm text-blue-700">
            Confirming that this lesson
            was assigned to you.
          </p>
        </div>
      </div>
    );
  }

  if (
    assignmentAccess ===
    "allowed"
  ) {
    return <>{children}</>;
  }

  /*
   * Invalid assignment parameters do NOT
   * unlock content. We simply fall back to
   * the student's normal curriculum access.
   */

  if (
    !profile.qualification ||
    !profile.examBoard
  ) {
    return (
      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
        <h1 className="text-2xl font-black text-amber-950">
          Curriculum selection required
        </h1>

        <p className="mt-3 text-amber-800">
          Select your qualification and
          exam board before opening lessons.
        </p>

        <Link
          href="/profile/curriculum"
          className="mt-6 inline-flex rounded-xl bg-amber-600 px-5 py-3 font-black text-white"
        >
          Choose curriculum
        </Link>
      </section>
    );
  }

  if (!curriculumAllowed) {
    return (
      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
        <p className="text-sm font-black uppercase tracking-wide text-amber-700">
          Curriculum restricted
        </p>

        <h1 className="mt-2 text-2xl font-black text-amber-950">
          This topic is not mapped
          to your selected curriculum
        </h1>

        {assignmentId &&
          assignmentAccess ===
            "denied" && (
            <div className="mt-4 rounded-2xl border border-amber-300 bg-white/70 p-4">
              <p className="font-bold text-amber-950">
                The assignment link
                could not unlock this
                lesson.
              </p>

              <p className="mt-1 text-sm text-amber-800">
                The assignment may not
                belong to this account,
                may have been changed,
                or may point to a
                different lesson.
              </p>

              <Link
                href={`/assignments/${encodeURIComponent(
                  assignmentId,
                )}`}
                className="mt-3 inline-flex font-bold text-blue-700 hover:text-blue-800"
              >
                ← Back to assignment
              </Link>
            </div>
          )}

        <p className="mt-3 text-amber-800">
          Your current selection is{" "}
          {profile.examBoard}{" "}
          {profile.qualification ===
          "A_LEVEL"
            ? "A-level"
            : "GCSE"}
          .
        </p>

        <Link
          href="/learn"
          className="mt-6 inline-flex rounded-xl bg-amber-700 px-5 py-3 font-black text-white"
        >
          Back to my curriculum
        </Link>
      </section>
    );
  }

  return <>{children}</>;
}