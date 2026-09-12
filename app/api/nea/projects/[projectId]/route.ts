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
  DEFAULT_NEA_MILESTONES,
  determineCurrentNeaStage,
  NEA_STAGE_ORDER,
  nextNeaStage,
  normaliseMilestoneStatus,
} from "@/lib/nea/constants";
import type {
  NeaEvidenceReferenceType,
  NeaMilestone,
  NeaMilestoneStatus,
  NeaProjectStatus,
  NeaStageId,
  NeaStageProgress,
} from "@/types/nea";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clean(value: unknown, max = 500): string {
  return typeof value === "string"
    ? value.trim().slice(0, max)
    : "";
}

function isStage(value: unknown): value is NeaStageId {
  return (
    typeof value === "string" &&
    NEA_STAGE_ORDER.includes(value as NeaStageId)
  );
}

function isMilestoneStatus(
  value: unknown,
): value is NeaMilestoneStatus {
  return (
    value === "not_started" ||
    value === "in_progress" ||
    value === "complete"
  );
}

function isEvidenceReferenceType(
  value: unknown,
): value is NeaEvidenceReferenceType {
  return (
    value === "none" ||
    value === "link" ||
    value === "file-reference" ||
    value === "other"
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
    return (value as { toDate: () => Date })
      .toDate()
      .toISOString();
  }

  return typeof value === "string" ? value : null;
}

function normaliseMilestones(value: unknown): NeaMilestone[] {
  const records = Array.isArray(value)
    ? (value.filter(
        (item) => item && typeof item === "object",
      ) as Array<Record<string, unknown>>)
    : [];

  const byId = new Map(
    records.map((item) => [clean(item.id, 120), item]),
  );

  return DEFAULT_NEA_MILESTONES.map((template) => {
    const item = byId.get(template.id);

    if (!item) {
      return { ...template };
    }

    const completed =
      item.completed === true ||
      item.status === "complete";

    return {
      ...template,
      title:
        clean(item.title, 240) ||
        template.title,
      status: normaliseMilestoneStatus(
        item.status,
        completed,
      ),
      completed,
      dueDate:
        clean(item.dueDate, 20) ||
        null,
      completedAt:
        serialiseTimestamp(
          item.completedAt,
        ),
    };
  });
}

function serialiseDoc(
  id: string,
  data: Record<string, unknown>,
) {
  return {
    ...data,
    id,
    createdAt: serialiseTimestamp(data.createdAt),
    updatedAt: serialiseTimestamp(data.updatedAt),
    submittedAt: serialiseTimestamp(data.submittedAt),
    completedAt: serialiseTimestamp(data.completedAt),
    archivedAt: serialiseTimestamp(data.archivedAt),
  };
}

function serialiseProject(
  id: string,
  data: Record<string, unknown>,
) {
  return {
    ...serialiseDoc(id, data),
    milestones: normaliseMilestones(data.milestones),
    teacherNoteCount:
      Number(data.teacherNoteCount) || 0,
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
        {
          error:
            "You do not have access to this NEA project.",
        },
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
    const access = await requireProjectAccess(
      request,
      projectId,
    );

    if (access.denied || !access.project) {
      return access.denied;
    }

    const [
      evidenceSnapshot,
      feedbackSnapshot,
      notesSnapshot,
    ] = await Promise.all([
      access.ref
        .collection("evidence")
        .orderBy("createdAt", "desc")
        .limit(150)
        .get(),
      access.ref
        .collection("feedback")
        .orderBy("createdAt", "desc")
        .limit(150)
        .get(),
      access.canTeacherReview
        ? access.ref
            .collection("teacherNotes")
            .orderBy("createdAt", "desc")
            .limit(150)
            .get()
        : Promise.resolve(null),
    ]);

    return NextResponse.json({
      project: serialiseProject(
        projectId,
        access.project,
      ),
      evidence: evidenceSnapshot.docs.map((doc) =>
        serialiseDoc(doc.id, doc.data()),
      ),
      feedback: feedbackSnapshot.docs.map((doc) =>
        serialiseDoc(doc.id, doc.data()),
      ),
      teacherNotes: notesSnapshot
        ? notesSnapshot.docs.map((doc) =>
            serialiseDoc(doc.id, doc.data()),
          )
        : [],
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
    const access = await requireProjectAccess(
      request,
      projectId,
    );

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
    const projectStatus = clean(
      project.status,
      30,
    ) as NeaProjectStatus;

    if (
      projectStatus === "archived" &&
      action !== "restore-project"
    ) {
      return NextResponse.json(
        {
          error:
            "This project is archived. Restore it before making changes.",
        },
        { status: 409 },
      );
    }

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

      if (projectStatus !== "active") {
        return NextResponse.json(
          {
            error:
              "Return the project to active work before changing stage progress.",
          },
          { status: 409 },
        );
      }

      const stage = record.stage;

      if (!isStage(stage)) {
        return NextResponse.json(
          { error: "Choose a valid NEA stage." },
          { status: 400 },
        );
      }

      const stageProgress = safeProgress(project.stageProgress);

      stageProgress[stage] = Math.max(
        0,
        Math.min(
          100,
          Math.round(Number(record.progress) || 0),
        ),
      );

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

    if (action === "complete-stage") {
      if (!isOwner) {
        return NextResponse.json(
          {
            error:
              "Only the student can complete their own project stage.",
          },
          { status: 403 },
        );
      }

      if (projectStatus !== "active") {
        return NextResponse.json(
          {
            error:
              "Only an active project can move through stages.",
          },
          { status: 409 },
        );
      }

      const stage = record.stage;

      if (!isStage(stage)) {
        return NextResponse.json(
          { error: "Choose a valid NEA stage." },
          { status: 400 },
        );
      }

      const milestones = normaliseMilestones(
        project.milestones,
      );

      const incomplete = milestones.filter(
        (item) =>
          item.stage === stage &&
          item.status !== "complete",
      );

      if (incomplete.length > 0) {
        return NextResponse.json(
          {
            error:
              "Complete the stage milestones before marking the stage complete.",
          },
          { status: 409 },
        );
      }

      const stageProgress = safeProgress(project.stageProgress);
      stageProgress[stage] = 100;
      const nextStage = nextNeaStage(stage);

      await ref.update({
        stageProgress,
        overallProgress:
          calculateNeaOverallProgress(stageProgress),
        currentStage: nextStage || "evaluation",
        latestReflection: clean(record.reflection, 2500),
        updatedAt: FieldValue.serverTimestamp(),
      });

      return NextResponse.json({
        success: true,
        nextStage,
      });
    }

    if (action === "update-milestone") {
      const milestoneId = clean(record.milestoneId, 120);
      const milestones = normaliseMilestones(project.milestones);

      if (
        !milestones.some((item) => item.id === milestoneId)
      ) {
        return NextResponse.json(
          { error: "Milestone not found." },
          { status: 404 },
        );
      }

      if (!isOwner && !canTeacherReview) {
        return NextResponse.json(
          {
            error:
              "You cannot update this milestone.",
          },
          { status: 403 },
        );
      }

      const requestedStatus = record.status;

      if (
        requestedStatus !== undefined &&
        !isOwner
      ) {
        return NextResponse.json(
          {
            error:
              "Teachers can set milestone due dates, but milestone progress remains the student's record.",
          },
          { status: 403 },
        );
      }

      if (
        requestedStatus !== undefined &&
        !isMilestoneStatus(requestedStatus)
      ) {
        return NextResponse.json(
          {
            error:
              "Choose a valid milestone status.",
          },
          { status: 400 },
        );
      }

      const dueDate = clean(record.dueDate, 20) || null;

      const nextMilestones = milestones.map((item) => {
        if (item.id !== milestoneId) {
          return item;
        }

        const status =
          requestedStatus !== undefined
            ? requestedStatus
            : item.status;

        return {
          ...item,
          status,
          completed: status === "complete",
          dueDate,
          completedAt:
            status === "complete"
              ? item.completedAt || new Date().toISOString()
              : null,
        };
      });

      await ref.update({
        milestones: nextMilestones,
        updatedAt: FieldValue.serverTimestamp(),
      });

      return NextResponse.json({ success: true });
    }

    if (action === "add-evidence") {
      if (!isOwner || projectStatus !== "active") {
        return NextResponse.json(
          {
            error:
              "Evidence can only be added by the student while the project is active.",
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

      const referenceType = isEvidenceReferenceType(
        record.referenceType,
      )
        ? record.referenceType
        : "none";

      await ref.collection("evidence").add({
        projectId,
        studentId: actor.uid,
        stage,
        title,
        description,
        referenceType,
        referenceLabel: clean(record.referenceLabel, 180),
        referenceValue: clean(record.referenceValue, 1000),
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      await ref.update({
        evidenceCount: FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp(),
      });

      return NextResponse.json({ success: true });
    }

    if (action === "update-evidence") {
      if (!isOwner || projectStatus !== "active") {
        return NextResponse.json(
          {
            error:
              "Evidence can only be edited by the student while the project is active.",
          },
          { status: 403 },
        );
      }

      const evidenceId = clean(record.evidenceId, 200);
      const evidenceRef = ref
        .collection("evidence")
        .doc(evidenceId);

      const evidenceSnapshot = await evidenceRef.get();

      if (
        !evidenceSnapshot.exists ||
        evidenceSnapshot.data()?.studentId !== actor.uid
      ) {
        return NextResponse.json(
          {
            error:
              "Evidence record not found.",
          },
          { status: 404 },
        );
      }

      const stage = record.stage;
      const title = clean(record.title, 180);
      const description = clean(record.description, 2500);

      if (!isStage(stage)) {
        return NextResponse.json(
          { error: "Choose a valid NEA stage." },
          { status: 400 },
        );
      }

      if (title.length < 3 || description.length < 10) {
        return NextResponse.json(
          {
            error:
              "Evidence title and description are required.",
          },
          { status: 400 },
        );
      }

      const referenceType = isEvidenceReferenceType(
        record.referenceType,
      )
        ? record.referenceType
        : "none";

      await evidenceRef.update({
        stage,
        title,
        description,
        referenceType,
        referenceLabel: clean(record.referenceLabel, 180),
        referenceValue: clean(record.referenceValue, 1000),
        updatedAt: FieldValue.serverTimestamp(),
      });

      await ref.update({
        updatedAt: FieldValue.serverTimestamp(),
      });

      return NextResponse.json({ success: true });
    }

    if (action === "delete-evidence") {
      if (!isOwner || projectStatus !== "active") {
        return NextResponse.json(
          {
            error:
              "Evidence can only be deleted by the student while the project is active.",
          },
          { status: 403 },
        );
      }

      const evidenceId = clean(record.evidenceId, 200);
      const evidenceRef = ref
        .collection("evidence")
        .doc(evidenceId);

      const evidenceSnapshot = await evidenceRef.get();

      if (
        !evidenceSnapshot.exists ||
        evidenceSnapshot.data()?.studentId !== actor.uid
      ) {
        return NextResponse.json(
          {
            error:
              "Evidence record not found.",
          },
          { status: 404 },
        );
      }

      await evidenceRef.delete();

      await ref.update({
        evidenceCount: FieldValue.increment(-1),
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
          {
            error:
              "Enter a useful feedback comment.",
          },
          { status: 400 },
        );
      }

      await ref.collection("feedback").add({
        projectId,
        teacherId: actor.uid,
        teacherName: actor.name || "Teacher",
        message,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      await ref.update({
        teacherFeedbackCount: FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp(),
      });

      return NextResponse.json({ success: true });
    }

    if (action === "add-teacher-note") {
      if (!canTeacherReview) {
        return NextResponse.json(
          {
            error:
              "Only an authorised teacher can add private teacher notes.",
          },
          { status: 403 },
        );
      }

      const message = clean(record.message, 2500);

      if (message.length < 5) {
        return NextResponse.json(
          {
            error:
              "Enter a useful teacher note.",
          },
          { status: 400 },
        );
      }

      await ref.collection("teacherNotes").add({
        projectId,
        teacherId: actor.uid,
        teacherName: actor.name || "Teacher",
        message,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      await ref.update({
        teacherNoteCount: FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp(),
      });

      return NextResponse.json({ success: true });
    }

    if (action === "submit-project") {
      if (!isOwner || projectStatus !== "active") {
        return NextResponse.json(
          {
            error:
              "Only the student can submit an active project.",
          },
          { status: 403 },
        );
      }

      const progress = safeProgress(project.stageProgress);
      const complete = NEA_STAGE_ORDER.every(
        (stage) => progress[stage] === 100,
      );

      if (!complete) {
        return NextResponse.json(
          {
            error:
              "Complete all five NEA stages before submitting the project for review.",
          },
          { status: 409 },
        );
      }

      await ref.update({
        status: "submitted",
        submittedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      return NextResponse.json({ success: true });
    }

    if (action === "return-to-active") {
      if (
        !isOwner &&
        !canTeacherReview
      ) {
        return NextResponse.json(
          {
            error:
              "You cannot return this project to active work.",
          },
          { status: 403 },
        );
      }

      if (projectStatus !== "submitted") {
        return NextResponse.json(
          {
            error:
              "Only a submitted project can be returned to active work.",
          },
          { status: 409 },
        );
      }

      await ref.update({
        status: "active",
        submittedAt: null,
        updatedAt: FieldValue.serverTimestamp(),
      });

      return NextResponse.json({ success: true });
    }

    if (action === "complete-project") {
      if (!canTeacherReview) {
        return NextResponse.json(
          {
            error:
              "Only an authorised teacher can mark the project complete.",
          },
          { status: 403 },
        );
      }

      if (projectStatus !== "submitted") {
        return NextResponse.json(
          {
            error:
              "The student must submit the project before it can be marked complete.",
          },
          { status: 409 },
        );
      }

      await ref.update({
        status: "completed",
        completedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      return NextResponse.json({ success: true });
    }

    if (action === "archive-project") {
      const allowed =
        canTeacherReview ||
        (isOwner && projectStatus === "completed");

      if (!allowed) {
        return NextResponse.json(
          {
            error:
              "Only a completed project can be archived by the student.",
          },
          { status: 403 },
        );
      }

      await ref.update({
        status: "archived",
        archivedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      return NextResponse.json({ success: true });
    }

    if (action === "restore-project") {
      if (!canTeacherReview) {
        return NextResponse.json(
          {
            error:
              "Only an authorised teacher can restore an archived project.",
          },
          { status: 403 },
        );
      }

      if (projectStatus !== "archived") {
        return NextResponse.json(
          {
            error:
              "Only an archived project can be restored.",
          },
          { status: 409 },
        );
      }

      await ref.update({
        status: "completed",
        archivedAt: null,
        updatedAt: FieldValue.serverTimestamp(),
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      {
        error:
          "Unsupported NEA project action.",
      },
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
