import OpenAI from "openai";
import { NextResponse } from "next/server";

import type {
  LessonExamMarkingConfidence,
  LessonExamMarkingResult,
} from "@/types/interactiveLesson";

type RequestBody = {
  topic: string;
  lessonTitle: string;
  question: string;
  maximumMarks: number;
  modelAnswer: string;
  markScheme?: string[];
  guidance?: string[];
  studentResponse: string;
};

type FallbackReason =
  "selected" | "missing_api_key" | "quota" | "rate_limit" | "live_error";

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function cleanArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(clean).filter(Boolean) : [];
}

function normalise(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ");
}

function isNonAnswer(value: string): boolean {
  const answer = normalise(value);
  const compact = answer.replace(/\s+/g, "");

  return (
    !answer ||
    [
      "na",
      "none",
      "noanswer",
      "idk",
      "dontknow",
      "notsure",
      "skip",
      "blank",
      "unknown",
      "noidea",
    ].includes(compact)
  );
}

function extractKeywords(values: string[]): string[] {
  const stopWords = new Set([
    "about",
    "after",
    "again",
    "answer",
    "because",
    "computer",
    "correct",
    "describe",
    "explain",
    "from",
    "into",
    "question",
    "should",
    "that",
    "their",
    "these",
    "this",
    "using",
    "with",
  ]);

  return Array.from(
    new Set(
      values
        .join(" ")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length >= 4 && !stopWords.has(word)),
    ),
  );
}

function demoResult(
  body: RequestBody,
  reason: FallbackReason,
): LessonExamMarkingResult {
  const maximumMarks = Math.max(1, body.maximumMarks);

  if (isNonAnswer(body.studentResponse)) {
    return {
      mode: "demo",
      awardedMarks: 0,
      maximumMarks,
      percentage: 0,
      confidence: "high",
      matchedPoints: [],
      missingPoints: body.markScheme?.length
        ? body.markScheme
        : ["No assessable response was provided."],
      feedback:
        "No assessable response was provided. Attempt the question and use the mark allocation to decide how much detail is required.",
      improvedAnswer: body.modelAnswer,
      teacherReviewRequired: false,
      markedAt: new Date(),
    };
  }

  const points = body.markScheme?.length
    ? body.markScheme
    : body.modelAnswer
        .split(/[.;]\s*/)
        .map((point) => point.trim())
        .filter(Boolean);

  const response = normalise(body.studentResponse);
  const matchedPoints = points.filter((point) => {
    const pointKeywords = extractKeywords([point]);
    if (pointKeywords.length === 0) return false;

    const matchedCount = pointKeywords.filter((keyword) =>
      response.includes(keyword),
    ).length;

    return matchedCount >= Math.min(2, pointKeywords.length);
  });

  const missingPoints = points.filter(
    (point) => !matchedPoints.includes(point),
  );

  const modelKeywords = extractKeywords([body.modelAnswer]);
  const matchedModelKeywords = modelKeywords.filter((keyword) =>
    response.includes(keyword),
  );

  const relevant = matchedPoints.length > 0 || matchedModelKeywords.length >= 2;

  let awardedMarks = 0;

  if (relevant) {
    awardedMarks = clamp(matchedPoints.length, 0, maximumMarks);

    if (
      awardedMarks < maximumMarks &&
      matchedPoints.length > 0 &&
      matchedModelKeywords.length >= 3 &&
      body.studentResponse.trim().split(/\s+/).length >= maximumMarks * 5
    ) {
      awardedMarks += 1;
    }
  }

  awardedMarks = clamp(awardedMarks, 0, maximumMarks);
  const percentage = Math.round((awardedMarks / maximumMarks) * 100);

  const fallbackMessage =
    reason === "quota"
      ? "Live AI marking quota was unavailable, so conservative demo marking was used."
      : reason === "rate_limit"
        ? "Live AI marking was rate-limited, so conservative demo marking was used."
        : reason === "missing_api_key"
          ? "No live AI key was available, so conservative demo marking was used."
          : reason === "selected"
            ? "Demo marking mode is enabled."
            : "Live AI marking was unavailable, so conservative demo marking was used.";

  return {
    mode: "demo",
    awardedMarks,
    maximumMarks,
    percentage,
    confidence: maximumMarks <= 2 ? "medium" : "low",
    matchedPoints,
    missingPoints,
    feedback: `${fallbackMessage} ${
      awardedMarks === maximumMarks
        ? "The response appears to cover the available marking points."
        : awardedMarks === 0
          ? "The response does not yet match a clear question-specific marking point."
          : "The response includes some relevant knowledge but needs greater precision and development."
    }`,
    improvedAnswer: body.modelAnswer,
    teacherReviewRequired: true,
    markedAt: new Date(),
  };
}

function buildPrompt(body: RequestBody): string {
  return `
You are an experienced UK GCSE Computer Science examiner.

Mark the response only against the supplied question, maximum marks, mark scheme,
model answer and guidance.

Rules:
- Blank answers and placeholders such as n/a, idk, not sure, none and no answer receive 0.
- Never award marks for answer length alone.
- Never invent content not present in the student's response.
- Accept technically valid equivalent wording.
- Never award more than the maximum marks.
- Return JSON only.

Topic: ${body.topic}
Lesson: ${body.lessonTitle}
Question: ${body.question}
Maximum marks: ${body.maximumMarks}
Mark scheme: ${JSON.stringify(body.markScheme ?? [])}
Model answer: ${body.modelAnswer}
Guidance: ${JSON.stringify(body.guidance ?? [])}
Student response: ${body.studentResponse}

Return:
{
  "awardedMarks": 0,
  "confidence": "high | medium | low",
  "matchedPoints": ["string"],
  "missingPoints": ["string"],
  "feedback": "string",
  "improvedAnswer": "string",
  "teacherReviewRequired": true
}
`.trim();
}

function parseLiveResult(
  text: string,
  body: RequestBody,
): LessonExamMarkingResult {
  if (isNonAnswer(body.studentResponse)) {
    return demoResult(body, "selected");
  }

  const parsed = JSON.parse(text) as Record<string, unknown>;
  const maximumMarks = Math.max(1, body.maximumMarks);
  const awardedMarks = clamp(Number(parsed.awardedMarks) || 0, 0, maximumMarks);

  const confidenceValue = clean(parsed.confidence);
  const confidence: LessonExamMarkingConfidence =
    confidenceValue === "high" ||
    confidenceValue === "medium" ||
    confidenceValue === "low"
      ? confidenceValue
      : "low";

  return {
    mode: "live",
    awardedMarks,
    maximumMarks,
    percentage: Math.round((awardedMarks / maximumMarks) * 100),
    confidence,
    matchedPoints: cleanArray(parsed.matchedPoints),
    missingPoints: cleanArray(parsed.missingPoints),
    feedback:
      clean(parsed.feedback) || "Review the response against the mark scheme.",
    improvedAnswer: clean(parsed.improvedAnswer) || body.modelAnswer,
    teacherReviewRequired:
      parsed.teacherReviewRequired === true ||
      confidence === "low" ||
      maximumMarks >= 6,
    markedAt: new Date(),
  };
}

function isQuotaError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const candidate = error as {
    status?: unknown;
    code?: unknown;
    type?: unknown;
    error?: { code?: unknown; type?: unknown };
  };

  return (
    candidate.status === 429 &&
    (candidate.code === "insufficient_quota" ||
      candidate.type === "insufficient_quota" ||
      candidate.error?.code === "insufficient_quota" ||
      candidate.error?.type === "insufficient_quota")
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;

    if (
      !body ||
      !clean(body.question) ||
      !clean(body.studentResponse) ||
      !Number.isFinite(body.maximumMarks)
    ) {
      return NextResponse.json(
        { error: "A valid lesson exam response is required." },
        { status: 400 },
      );
    }

    if (process.env.AI_MARKING_DEMO_MODE === "true") {
      return NextResponse.json(demoResult(body, "selected"));
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(demoResult(body, "missing_api_key"));
    }

    try {
      const client = new OpenAI({ apiKey });
      const completion = await client.chat.completions.create({
        model: process.env.OPENAI_MARKING_MODEL || "gpt-4.1-mini",
        temperature: 0.1,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are a careful UK GCSE Computer Science examiner. Return valid JSON only.",
          },
          { role: "user", content: buildPrompt(body) },
        ],
      });

      const output = completion.choices[0]?.message.content;

      if (!output) {
        throw new Error("The marking service returned no content.");
      }

      return NextResponse.json(parseLiveResult(output, body));
    } catch (liveError) {
      console.error(
        "Live lesson marking unavailable; using demo fallback:",
        liveError,
      );

      const reason: FallbackReason = isQuotaError(liveError)
        ? "quota"
        : (liveError as { status?: unknown })?.status === 429
          ? "rate_limit"
          : "live_error";

      return NextResponse.json(demoResult(body, reason));
    }
  } catch (error) {
    console.error("Lesson marking route error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The lesson answer could not be marked.",
      },
      { status: 500 },
    );
  }
}
