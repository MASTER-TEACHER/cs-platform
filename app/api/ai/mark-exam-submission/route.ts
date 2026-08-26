import OpenAI from "openai";
import { NextResponse } from "next/server";

import type {
  AIExamMarkingResult,
  AIQuestionMarkingSuggestion,
  AIMarkingConfidence,
} from "@/types/aiExamMarking";

type RequestQuestion = {
  id: string;
  questionNumber: number;
  question: string;
  context?: string;
  marks: number;
  assessmentObjective?: string;
  questionType?: string;
  commandWord?: string;
  markScheme?: unknown;
  modelAnswer?: string;
  examinerGuidance?: unknown;
};

type RequestAnswer = {
  questionId: string;
  response: string;
};

type RequestBody = {
  assignmentTitle: string;
  topic: string;
  questions: RequestQuestion[];
  answers: RequestAnswer[];
};

type DemoFallbackReason =
  "selected" | "missing_api_key" | "quota" | "rate_limit" | "live_error";

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function normaliseString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normaliseStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (item && typeof item === "object") {
        const candidate = item as Record<string, unknown>;

        return (
          normaliseString(candidate.description) ||
          normaliseString(candidate.text) ||
          normaliseString(candidate.point)
        );
      }

      return normaliseString(item);
    })
    .filter(Boolean);
}

function getMarkSchemePoints(value: unknown): string[] {
  return normaliseStringArray(value);
}

function getExaminerGuidance(value: unknown): string[] {
  if (typeof value === "string") {
    return value.trim() ? [value.trim()] : [];
  }

  return normaliseStringArray(value);
}

function normaliseAnswerText(value: string): string {
  return value.trim().toLowerCase().replace(/[Ã¢â‚¬â„¢Ã¢â‚¬Ëœ]/g, "'").replace(/\s+/g, " ");
}

/**
 * Answers such as "n/a", "idk" and "-" must always be treated as
 * non-responses. They must never receive credit from answer length or
 * generic keyword matching.
 */
function isNonAnswer(value: string): boolean {
  const answer = normaliseAnswerText(value);

  if (!answer) {
    return true;
  }

  const compact = answer.replace(/[^a-z0-9]/g, "");

  const placeholders = new Set([
    "na",
    "none",
    "noanswer",
    "notanswered",
    "notapplicable",
    "idk",
    "dontknow",
    "idon'tknow",
    "notsure",
    "unsure",
    "skip",
    "skipped",
    "blank",
    "nil",
    "unknown",
    "noidea",
  ]);

  if (placeholders.has(compact)) {
    return true;
  }

  return (
    answer === "-" || answer === "--" || answer === "?" || answer === "..."
  );
}

function extractKeywords(values: string[]): string[] {
  const stopWords = new Set([
    "about",
    "after",
    "again",
    "also",
    "answer",
    "because",
    "being",
    "computer",
    "could",
    "correct",
    "data",
    "describe",
    "each",
    "explain",
    "from",
    "give",
    "into",
    "marks",
    "must",
    "question",
    "relevant",
    "should",
    "states",
    "that",
    "their",
    "there",
    "these",
    "this",
    "using",
    "with",
    "would",
  ]);

  return Array.from(
    new Set(
      values
        .join(" ")
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length >= 4 && !stopWords.has(word)),
    ),
  );
}

function inferCorrectOption(question: RequestQuestion): string | null {
  const source = [
    ...getMarkSchemePoints(question.markScheme),
    question.modelAnswer || "",
  ].join(" ");

  const patterns = [
    /(?:correct\s+answer|correct\s+option|answer|option|selecting|select)\s*(?:is|:|-)?\s*([a-d])\b/i,
    /\b([a-d])\s+is\s+(?:the\s+)?correct\b/i,
    /^\s*([a-d])[\).\s:-]/i,
  ];

  for (const pattern of patterns) {
    const match = source.match(pattern);

    if (match?.[1]) {
      return match[1].toUpperCase();
    }
  }

  return null;
}

function extractSelectedOption(response: string): string | null {
  const cleaned = response.trim().toUpperCase();

  const match = cleaned.match(/^(?:OPTION\s*)?([A-D])(?:[\).\s:-]|$)/);

  return match?.[1] || null;
}

function looksLikeMultipleChoice(question: RequestQuestion): boolean {
  const questionType = normaliseString(question.questionType).toLowerCase();

  const prompt = question.question.toLowerCase();

  return (
    questionType.includes("multiple") ||
    questionType.includes("mcq") ||
    /which option|select one answer|choose one answer/.test(prompt)
  );
}

function createNonAnswerSuggestion(
  question: RequestQuestion,
): AIQuestionMarkingSuggestion {
  const markPoints = getMarkSchemePoints(question.markScheme);

  return {
    questionId: question.id,
    questionNumber: question.questionNumber,
    suggestedMarks: 0,
    maximumMarks: question.marks,
    confidence: "high",
    matchedMarkPoints: [],
    missedMarkPoints:
      markPoints.length > 0
        ? markPoints
        : ["No assessable response was provided."],
    evidenceFromResponse: [],
    feedback:
      "No assessable answer was provided. Attempt the question and use the command word and mark allocation to structure the response.",
    teacherReviewRequired: false,
  };
}

function createMultipleChoiceSuggestion(
  question: RequestQuestion,
  response: string,
): AIQuestionMarkingSuggestion | null {
  const correctOption = inferCorrectOption(question);

  const selectedOption = extractSelectedOption(response);

  if (!correctOption || !selectedOption) {
    return null;
  }

  const isCorrect = selectedOption === correctOption;

  return {
    questionId: question.id,
    questionNumber: question.questionNumber,
    suggestedMarks: isCorrect ? question.marks : 0,
    maximumMarks: question.marks,
    confidence: "high",
    matchedMarkPoints: isCorrect ? [`Selected option ${correctOption}.`] : [],
    missedMarkPoints: isCorrect
      ? []
      : [
          `The correct option is ${correctOption}; the response selected ${selectedOption}.`,
        ],
    evidenceFromResponse: [`The student selected option ${selectedOption}.`],
    feedback: isCorrect
      ? "Correct. The selected option matches the answer identified by the mark scheme."
      : `The selected option is incorrect. Review why option ${correctOption} best answers the question.`,
    teacherReviewRequired: false,
  };
}

function demoSuggestion(
  question: RequestQuestion,
  answer: RequestAnswer | undefined,
): AIQuestionMarkingSuggestion {
  const response = normaliseString(answer?.response);

  if (isNonAnswer(response)) {
    return createNonAnswerSuggestion(question);
  }

  if (looksLikeMultipleChoice(question)) {
    const mcqSuggestion = createMultipleChoiceSuggestion(question, response);

    if (mcqSuggestion) {
      return mcqSuggestion;
    }
  }

  const markPoints = getMarkSchemePoints(question.markScheme);

  const lowerResponse = response.toLowerCase();

  const matchedMarkPoints = markPoints.filter((point) => {
    const pointKeywords = extractKeywords([point]);

    if (pointKeywords.length === 0) {
      return false;
    }

    const matchedCount = pointKeywords.filter((keyword) =>
      lowerResponse.includes(keyword),
    ).length;

    return matchedCount >= Math.min(2, pointKeywords.length);
  });

  const missedMarkPoints = markPoints.filter(
    (point) => !matchedMarkPoints.includes(point),
  );

  const modelKeywords = extractKeywords([question.modelAnswer || ""]);

  const matchedModelKeywords = modelKeywords.filter((keyword) =>
    lowerResponse.includes(keyword),
  );

  const wordCount = response.split(/\s+/).filter(Boolean).length;

  /*
   * Demo marking is intentionally conservative:
   * - no marks are awarded purely for writing a longer answer;
   * - at least one question-specific marking point or several model-answer
   *   keywords must be matched before any credit is suggested.
   */
  const hasRelevantEvidence =
    matchedMarkPoints.length > 0 || matchedModelKeywords.length >= 2;

  let suggestedMarks = 0;

  if (hasRelevantEvidence) {
    if (markPoints.length > 0) {
      suggestedMarks = clamp(matchedMarkPoints.length, 0, question.marks);

      /*
       * A developed response may receive one additional provisional mark
       * only when it already matches a marking point and contains enough
       * relevant model-answer vocabulary.
       */
      if (
        suggestedMarks < question.marks &&
        matchedMarkPoints.length > 0 &&
        matchedModelKeywords.length >= 3 &&
        wordCount >= question.marks * 5
      ) {
        suggestedMarks += 1;
      }
    } else {
      const relevanceRatio =
        matchedModelKeywords.length / Math.max(modelKeywords.length, 1);

      suggestedMarks =
        relevanceRatio >= 0.5
          ? Math.max(1, Math.round(relevanceRatio * question.marks))
          : 0;
    }
  }

  suggestedMarks = clamp(suggestedMarks, 0, question.marks);

  const confidence: AIMarkingConfidence =
    suggestedMarks === 0 && !hasRelevantEvidence
      ? "medium"
      : question.marks <= 2
        ? "medium"
        : "low";

  return {
    questionId: question.id,
    questionNumber: question.questionNumber,
    suggestedMarks,
    maximumMarks: question.marks,
    confidence,
    matchedMarkPoints,
    missedMarkPoints,
    evidenceFromResponse: matchedModelKeywords
      .slice(0, 4)
      .map((keyword) => `The response uses the relevant term Ã¢â‚¬Å“${keyword}Ã¢â‚¬Â.`),
    feedback:
      suggestedMarks === question.marks
        ? "The response appears to address the available marking points. Confirm the accuracy and development before accepting full marks."
        : suggestedMarks === 0
          ? "The response does not yet match a clear question-specific marking point. Use the model answer and mark scheme to add precise, relevant content."
          : "The response addresses some relevant content, but it needs more precise development and clearer links to the remaining mark-scheme points.",
    teacherReviewRequired: true,
  };
}

function getFallbackMessage(
  reason: DemoFallbackReason,
  totalSuggested: number,
  totalAvailable: number,
): string {
  const score = `${totalSuggested}/${totalAvailable}`;

  switch (reason) {
    case "selected":
      return `Demo marking was selected. The provisional demo score is ${score}. Demo marking is heuristic, so review every suggestion against the question-specific mark scheme before finalising.`;

    case "missing_api_key":
      return `No live AI key was available, so demo marking was used. The provisional demo score is ${score}. Review every suggestion before finalising.`;

    case "quota":
      return `Live AI marking was unavailable because the API quota was exhausted, so demo marking was used automatically. The provisional demo score is ${score}. Review every suggestion before finalising.`;

    case "rate_limit":
      return `Live AI marking was temporarily rate-limited, so demo marking was used automatically. The provisional demo score is ${score}. Review every suggestion before finalising.`;

    default:
      return `Live AI marking was unavailable, so demo marking was used automatically. The provisional demo score is ${score}. Review every suggestion before finalising.`;
  }
}

function createDemoResult(
  body: RequestBody,
  reason: DemoFallbackReason,
): AIExamMarkingResult {
  const answersByQuestion = new Map(
    body.answers.map((answer) => [answer.questionId, answer]),
  );

  const suggestions = body.questions.map((question) =>
    demoSuggestion(question, answersByQuestion.get(question.id)),
  );

  const totalSuggested = suggestions.reduce(
    (sum, suggestion) => sum + suggestion.suggestedMarks,
    0,
  );

  const totalAvailable = suggestions.reduce(
    (sum, suggestion) => sum + suggestion.maximumMarks,
    0,
  );

  return {
    mode: "demo",
    suggestions,
    overallFeedback: getFallbackMessage(reason, totalSuggested, totalAvailable),
    strengths: suggestions
      .filter(
        (suggestion) => suggestion.suggestedMarks > suggestion.maximumMarks / 2,
      )
      .slice(0, 3)
      .map(
        (suggestion) =>
          `Question ${suggestion.questionNumber}: relevant knowledge was demonstrated.`,
      ),
    priorities: suggestions
      .filter(
        (suggestion) => suggestion.suggestedMarks < suggestion.maximumMarks,
      )
      .slice(0, 3)
      .map(
        (suggestion) =>
          `Question ${suggestion.questionNumber}: address the missed marking points and use more precise evidence.`,
      ),
  };
}

function buildPrompt(body: RequestBody): string {
  const payload = body.questions.map((question) => {
    const answer = body.answers.find((item) => item.questionId === question.id);

    return {
      id: question.id,
      questionNumber: question.questionNumber,
      question: question.question,
      context: question.context || "",
      maximumMarks: question.marks,
      assessmentObjective: question.assessmentObjective || "",
      questionType: question.questionType || "",
      commandWord: question.commandWord || "",
      markScheme: getMarkSchemePoints(question.markScheme),
      modelAnswer: question.modelAnswer || "",
      examinerGuidance: getExaminerGuidance(question.examinerGuidance),
      studentResponse: answer?.response || "",
    };
  });

  return `
You are an experienced UK Computer Science examiner assisting a teacher.

Mark each response only against the supplied question, maximum marks, mark scheme, model answer and examiner guidance.

Requirements:
- Treat blank answers and placeholders such as "n/a", "na", "idk", "not sure", "-", "none" and "no answer" as non-responses worth 0 marks.
- Never award more than the maximum marks.
- Do not invent content that is not present in the student's answer.
- Give credit for valid equivalent wording.
- For multiple-choice questions, credit only the correct selected option.
- For calculations, code and objective questions, check accuracy carefully.
- For extended responses, consider development, application, balance and conclusion where the supplied mark scheme requires them.
- Use low confidence for borderline, ambiguous or highly subjective decisions.
- teacherReviewRequired must be true for low-confidence decisions, all responses worth 6 or more marks, and any answer where the mark scheme cannot be applied reliably.
- Feedback must be addressed to the student and must explain how to improve.
- Return JSON only.

Assignment: ${body.assignmentTitle}
Topic: ${body.topic}

Questions and responses:
${JSON.stringify(payload, null, 2)}

Return this exact JSON structure:
{
  "suggestions": [
    {
      "questionId": "string",
      "questionNumber": 1,
      "suggestedMarks": 0,
      "maximumMarks": 1,
      "confidence": "high | medium | low",
      "matchedMarkPoints": ["string"],
      "missedMarkPoints": ["string"],
      "evidenceFromResponse": ["string"],
      "feedback": "string",
      "teacherReviewRequired": true
    }
  ],
  "overallFeedback": "string",
  "strengths": ["string"],
  "priorities": ["string"]
}
`.trim();
}

function parseLiveResult(text: string, body: RequestBody): AIExamMarkingResult {
  const parsed = JSON.parse(text) as {
    suggestions?: unknown;
    overallFeedback?: unknown;
    strengths?: unknown;
    priorities?: unknown;
  };

  if (!Array.isArray(parsed.suggestions)) {
    throw new Error("The AI response did not contain marking suggestions.");
  }

  const questionById = new Map(
    body.questions.map((question) => [question.id, question]),
  );

  const answerByQuestion = new Map(
    body.answers.map((answer) => [answer.questionId, answer]),
  );

  const suggestions = parsed.suggestions
    .map((item): AIQuestionMarkingSuggestion | null => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const candidate = item as Record<string, unknown>;

      const questionId = normaliseString(candidate.questionId);

      const question = questionById.get(questionId);

      if (!question) {
        return null;
      }

      const answer = answerByQuestion.get(questionId);

      /*
       * The server enforces zero for placeholders even if a live model
       * mistakenly awards credit.
       */
      if (isNonAnswer(answer?.response || "")) {
        return createNonAnswerSuggestion(question);
      }

      const confidenceValue = normaliseString(candidate.confidence);

      const confidence: AIMarkingConfidence =
        confidenceValue === "high" ||
        confidenceValue === "medium" ||
        confidenceValue === "low"
          ? confidenceValue
          : "low";

      return {
        questionId,
        questionNumber: question.questionNumber,
        suggestedMarks: clamp(
          Number(candidate.suggestedMarks) || 0,
          0,
          question.marks,
        ),
        maximumMarks: question.marks,
        confidence,
        matchedMarkPoints: normaliseStringArray(candidate.matchedMarkPoints),
        missedMarkPoints: normaliseStringArray(candidate.missedMarkPoints),
        evidenceFromResponse: normaliseStringArray(
          candidate.evidenceFromResponse,
        ),
        feedback:
          normaliseString(candidate.feedback) ||
          "Review this response against the mark scheme.",
        teacherReviewRequired:
          candidate.teacherReviewRequired === true ||
          confidence === "low" ||
          question.marks >= 6,
      };
    })
    .filter((item): item is AIQuestionMarkingSuggestion => item !== null);

  return {
    mode: "live",
    suggestions,
    overallFeedback: normaliseString(parsed.overallFeedback),
    strengths: normaliseStringArray(parsed.strengths),
    priorities: normaliseStringArray(parsed.priorities),
  };
}

function isQuotaError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const candidate = error as {
    status?: unknown;
    code?: unknown;
    type?: unknown;
    error?: {
      code?: unknown;
      type?: unknown;
    };
  };

  return (
    candidate.status === 429 &&
    (candidate.code === "insufficient_quota" ||
      candidate.type === "insufficient_quota" ||
      candidate.error?.code === "insufficient_quota" ||
      candidate.error?.type === "insufficient_quota")
  );
}

function isRateLimitError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const candidate = error as {
    status?: unknown;
  };

  return candidate.status === 429;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;

    if (
      !body ||
      !Array.isArray(body.questions) ||
      !Array.isArray(body.answers)
    ) {
      return NextResponse.json(
        {
          error: "A valid exam submission is required.",
        },
        {
          status: 400,
        },
      );
    }

    const forceDemo = process.env.AI_MARKING_DEMO_MODE === "true";

    if (forceDemo) {
      return NextResponse.json(createDemoResult(body, "selected"));
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Live AI marking is not configured. Demo marking is available only when AI_MARKING_DEMO_MODE=true.",
        },
        { status: 503 },
      );
    }

    try {
      const client = new OpenAI({
        apiKey,
      });

      const completion = await client.chat.completions.create({
        model: process.env.OPENAI_MARKING_MODEL || "gpt-4.1-mini",
        temperature: 0.1,
        response_format: {
          type: "json_object",
        },
        messages: [
          {
            role: "system",
            content:
              "You are a careful UK Computer Science examiner. Return valid JSON only.",
          },
          {
            role: "user",
            content: buildPrompt(body),
          },
        ],
      });

      const output = completion.choices[0]?.message.content;

      if (!output) {
        throw new Error("The AI marking service returned no content.");
      }

      return NextResponse.json(parseLiveResult(output, body));
    } catch (liveError) {
      console.error(
        "Live AI marking unavailable; using demo fallback:",
        liveError,
      );

      const reason: DemoFallbackReason = isQuotaError(liveError)
        ? "quota"
        : isRateLimitError(liveError)
          ? "rate_limit"
          : "live_error";

      return NextResponse.json(createDemoResult(body, reason));
    }
  } catch (error) {
    console.error("AI exam marking route error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The submission could not be marked.",
      },
      {
        status: 500,
      },
    );
  }
}
