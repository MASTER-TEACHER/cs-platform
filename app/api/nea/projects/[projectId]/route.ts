import "server-only";

import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

import {
  authenticatedUserError,
  requireAuthenticatedUser,
} from "@/lib/auth/requireUser";
import { adminDb } from "@/lib/firebaseAdmin";
import {
  calculateNeaOverallProgress,
  determineCurrentNeaStage,
  NEA_STAGE_ORDER,
} from "@/lib/nea/constants";
import type {
  NeaMilestone,
  NeaStageId,
  NeaStageProgress,
} from "@/types/nea";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clean(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function isStage(value: unknown): value is NeaStageId {
  return (
    typeof value === "string" &&
    NEA_STAGE_ORDER.includes(value as NeaStageId)
  );
}

function safeProgress(value: unknown): NeaStageProgress {
  const source =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};

  return {
    analysis: Number(source.analysis) || 0,
    design: Number(source.design) || 0,
    development: Number(source.development) || 0,
    testing: Number(source.testing) || 0,
    evaluation: Number(source.evaluation) || 0,
  };
}

function serialiseTimestamp(value: unknown): string | null {
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }

  return null;
}

function serialiseDoc(id: string, data: Record<string, unknown>) {
  return {
    ...data,
    id,
    createdAt: serialiseTimestamp(data.createdAt),
    updatedAt: serialiseTimestamp(data.updatedAt),
  };
}

async function requireProjectAccess(
  request: Request,
  projectId: string,
) {
  const actor = await requireAuthenticatedUser(request);

  const ref = adminDb
    .collection("neaProjects")
    .doc(projectId);

  const snapshot = await ref.get();

  if (!snapshot.exists) {
    return {
      actor,
      ref,
      project: null,
      denied: NextResponse.json(
        { error: "NEA project not found." },
        { status: 404 },
      ),
    };
  }

  const project = snapshot.data() || {};
  const isOwner = project.studentId === actor.uid;
  const canTeacherReview =
    (actor.role === "teacher" &&
      actor.schoolId &&
      actor.schoolId === project.schoolId) ||
    actor.role === "admin";

  if (!isOwner && !canTeacherReview) {
    return {
      actor,
      ref,
      project,
      denied: NextResponse.json(
        { error: "You do not have access to this NEA project." },
        { status: 403 },
      ),
    };
  }

  return {
    actor,
    ref,
    project,
    isOwner,
    canTeacherReview,
    denied: null,
  };
}

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      projectId: string;
    }>;
  },
) {
  try {
    const { projectId } = await params;
    const access = await requireProjectAccess(request, projectId);

    if (access.denied || !access.project) {
      return access.denied;
    }

    const [evidenceSnapshot, feedbackSnapshot] =
      await Promise.all([
        access.ref
          .collection("evidence")
          .orderBy("createdAt", "desc")
          .limit(100)
          .get(),
        access.ref
          .collection("feedback")
          .orderBy("createdAt", "desc")
          .limit(100)
          .get(),
      ]);

    return NextResponse.json({
      project: serialiseDoc(
        projectId,
        access.project,
      ),
      evidence: evidenceSnapshot.docs.map((doc) =>
        serialiseDoc(doc.id, doc.data()),
      ),
      feedback: feedbackSnapshot.docs.map((doc) =>
        serialiseDoc(doc.id, doc.data()),
      ),
    });
  } catch (error) {
    const failure = authenticatedUserError(error);

    return NextResponse.json(
      { error: failure.message },
      { status: failure.status },
    );
  }
}

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      projectId: string;
    }>;
  },
) {
  try {
    const { projectId } = await params;
    const access = await requireProjectAccess(request, projectId);

    if (access.denied || !access.project) {
      return access.denied;
    }

    const {
      actor,
      ref,
      project,
      isOwner,
      canTeacherReview,
    } = access;

    const body: unknown = await request.json();
    const record =
      body && typeof body === "object"
        ? (body as Record<string, unknown>)
        : {};

    const action = clean(record.action, 60);

    if (action === "update-progress") {
      if (!isOwner) {
        return NextResponse.json(
          {
            error:
              "Only the student can update their own project progress.",
          },
          { status: 403 },
        );
      }

      const stage = record.stage;

      if (!isStage(stage)) {
        return NextResponse.json(
          { error: "Choose a valid NEA stage." },
          { status: 400 },
        );
      }

      const requestedProgress = Math.max(
        0,
        Math.min(
          100,
          Math.round(Number(record.progress) || 0),
        ),
      );

      const stageProgress = safeProgress(project.stageProgress);
      stageProgress[stage] = requestedProgress;

      await ref.update({
        stageProgress,
        overallProgress:
          calculateNeaOverallProgress(stageProgress),
        currentStage:
          determineCurrentNeaStage(stageProgress),
        latestReflection: clean(record.reflection, 2500),
        updatedAt: FieldValue.serverTimestamp(),
      });

      return NextResponse.json({ success: true });
    }

    if (action === "toggle-milestone") {
      if (!isOwner) {
        return NextResponse.json(
          {
            error:
              "Only the student can update their own milestones.",
          },
          { status: 403 },
        );
      }

      const milestoneId = clean(record.milestoneId, 120);
      const completed = record.completed === true;

      const milestones = Array.isArray(project.milestones)
        ? (project.milestones as NeaMilestone[])
        : [];

      if (!milestones.some((item) => item.id === milestoneId)) {
        return NextResponse.json(
          { error: "Milestone not found." },
          { status: 404 },
        );
      }

      await ref.update({
        milestones: milestones.map((item) =>
          item.id === milestoneId
            ? { ...item, completed }
            : item,
        ),
        updatedAt: FieldValue.serverTimestamp(),
      });

      return NextResponse.json({ success: true });
    }

    if (action === "add-evidence") {
      if (!isOwner) {
        return NextResponse.json(
          {
            error:
              "Only the student can add evidence to their own project.",
          },
          { status: 403 },
        );
      }

      const stage = record.stage;

      if (!isStage(stage)) {
        return NextResponse.json(
          { error: "Choose a valid NEA stage." },
          { status: 400 },
        );
      }

      const title = clean(record.title, 180);
      const description = clean(record.description, 2500);

      if (title.length < 3 || description.length < 10) {
        return NextResponse.json(
          {
            error:
              "Add a clear evidence title and a short description of what the evidence shows.",
          },
          { status: 400 },
        );
      }

      await ref.collection("evidence").add({
        projectId,
        studentId: actor.uid,
        stage,
        title,
        description,
        createdAt: FieldValue.serverTimestamp(),
      });

      await ref.update({
        evidenceCount: FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp(),
      });

      return NextResponse.json({ success: true });
    }

    if (action === "add-feedback") {
      if (!canTeacherReview) {
        return NextResponse.json(
          {
            error:
              "Only an authorised teacher can add NEA feedback.",
          },
          { status: 403 },
        );
      }

      const message = clean(record.message, 2500);

      if (message.length < 5) {
        return NextResponse.json(
          { error: "Enter a useful feedback comment." },
          { status: 400 },
        );
      }

      await ref.collection("feedback").add({
        projectId,
        teacherId: actor.uid,
        teacherName: actor.name || "Teacher",
        message,
        createdAt: FieldValue.serverTimestamp(),
      });

      await ref.update({
        teacherFeedbackCount: FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp(),
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Unsupported NEA project action." },
      { status: 400 },
    );
  } catch (error) {
    const failure = authenticatedUserError(error);

    return NextResponse.json(
      { error: failure.message },
      { status: failure.status },
    );
  }
}
