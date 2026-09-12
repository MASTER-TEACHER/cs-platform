import "server-only";

import OpenAI from "openai";
import { NextResponse } from "next/server";

import {
  authenticatedUserError,
  requireAuthenticatedUser,
} from "@/lib/auth/requireUser";
import { adminDb } from "@/lib/firebaseAdmin";
import { NEA_STAGE_GUIDANCE } from "@/lib/nea/guidance";
import type { NeaStageId } from "@/types/nea";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stages = new Set<NeaStageId>([
  "analysis",
  "design",
  "development",
  "testing",
  "evaluation",
]);

function clean(value: unknown, max: number): string {
  return typeof value === "string"
    ? value.trim().slice(0, max)
    : "";
}

function isStage(value: unknown): value is NeaStageId {
  return (
    typeof value === "string" &&
    stages.has(value as NeaStageId)
  );
}

function demoCoachResponse(
  stage: NeaStageId,
  message: string,
): string {
  const guide = NEA_STAGE_GUIDANCE[stage];
  const prompt =
    guide.studentQuestions[
      message.length % guide.studentQuestions.length
    ];

  return [
    "I can help you think through this without writing assessed work for you.",
    "",
    prompt,
    "",
    "Use evidence from your own project when you answer. Then explain why your decision is appropriate for your users, requirements or test evidence.",
  ].join("\n");
}

export async function POST(request: Request) {
  try {
    const actor = await requireAuthenticatedUser(request);

    if (actor.role !== "student") {
      return NextResponse.json(
        {
          error:
            "The NEA Coach is available to the student who owns the project.",
        },
        { status: 403 },
      );
    }

    const body: unknown = await request.json();
    const record =
      body && typeof body === "object"
        ? (body as Record<string, unknown>)
        : {};

    const projectId = clean(record.projectId, 200);
    const message = clean(record.message, 2000);
    const stage = record.stage;

    if (!projectId || !message || !isStage(stage)) {
      return NextResponse.json(
        {
          error:
            "Project, stage and message are required.",
        },
        { status: 400 },
      );
    }

    const projectSnapshot = await adminDb
      .collection("neaProjects")
      .doc(projectId)
      .get();

    if (
      !projectSnapshot.exists ||
      projectSnapshot.data()?.studentId !== actor.uid
    ) {
      return NextResponse.json(
        { error: "NEA project not found." },
        { status: 404 },
      );
    }

    const project = projectSnapshot.data() || {};
    const apiKey = process.env.OPENAI_API_KEY;

    if (
      !apiKey ||
      process.env.AI_NEA_COACH_DEMO_MODE === "true"
    ) {
      return NextResponse.json({
        success: true,
        reply: demoCoachResponse(stage, message),
        demo: true,
      });
    }

    const guide = NEA_STAGE_GUIDANCE[stage];
    const openai = new OpenAI({ apiKey });

    const response = await openai.responses.create({
      model:
        process.env.OPENAI_NEA_COACH_MODEL ||
        "gpt-5.6",
      instructions: [
        "You are the CS Master Socratic NEA Coach for UK A-level Computer Science.",
        "The student's NEA is assessed work. Protect academic integrity.",
        "You may explain general Computer Science concepts, ask Socratic questions, identify missing evidence, challenge reasoning, suggest planning steps and help the student review work they have already created.",
        "You MUST NOT write, rewrite or complete an assessed NEA section for submission.",
        "You MUST NOT generate a complete project solution, substantial assessed program code, fabricated test evidence, fabricated user feedback, fabricated research, or a ready-to-submit evaluation.",
        "If the student asks for assessed content, decline that part briefly and redirect to questions, concepts, pseudocode-level reasoning, debugging strategies or a checklist they can act on themselves.",
        "Do not invent facts about the student's project.",
        "Use British English.",
        `Current stage: ${guide.title}.`,
        `Stage purpose: ${guide.purpose}`,
        `Integrity boundary: ${guide.integrityBoundary}`,
      ].join("\n"),
      input: [
        {
          role: "user",
          content: [
            `Project title: ${clean(project.title, 160)}`,
            `Project brief: ${clean(project.projectBrief, 1200)}`,
            `Student reflection: ${clean(project.latestReflection, 1200)}`,
            "",
            `Student message: ${message}`,
          ].join("\n"),
        },
      ],
    });

    const reply = response.output_text.trim();

    if (!reply) {
      throw new Error(
        "The NEA Coach returned no guidance.",
      );
    }

    return NextResponse.json({
      success: true,
      reply,
      demo: false,
    });
  } catch (error) {
    const failure = authenticatedUserError(error);

    return NextResponse.json(
      { error: failure.message },
      { status: failure.status },
    );
  }
}
