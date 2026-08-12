import OpenAI from "openai";
import { NextResponse } from "next/server";

import type {
  AssistantAction,
  AssistantDifficulty,
  AssistantMode,
  AssistantRequestMessage,
  AssistantResourceType,
  QuizGeneratorAction,
  ResourceBuilderAction,
} from "@/types/assistant";

const ASSISTANT_MODES: AssistantMode[] = [
  "general",
  "lesson-planner",
  "resource-creator",
  "subject-expert",
  "intervention-coach",
  "examiner",
  "parent-report",
];

type AssistantChatRequest = {
  message: string;
  mode: AssistantMode;
  conversation: AssistantRequestMessage[];
  useDemo?: boolean;
};

type OpenAIErrorLike = {
  status?: number;
  code?: string;
  type?: string;
  message?: string;
  error?: {
    code?: string;
    type?: string;
    message?: string;
  };
};

type ParsedTeachingRequest = {
  topic: string;
  yearGroup: string;
  qualification: string;
  examBoard: string;
  duration: number;
  difficulty: AssistantDifficulty;
  questionCount: number;
  resourceType: AssistantResourceType | null;
  quizRequested: boolean;
};

function isAssistantMode(value: unknown): value is AssistantMode {
  return (
    typeof value === "string" &&
    ASSISTANT_MODES.includes(value as AssistantMode)
  );
}

function isConversation(value: unknown): value is AssistantRequestMessage[] {
  if (!Array.isArray(value) || value.length > 20) {
    return false;
  }

  return value.every((message) => {
    if (!message || typeof message !== "object") {
      return false;
    }

    const candidate = message as Partial<AssistantRequestMessage>;

    return (
      (candidate.role === "user" || candidate.role === "assistant") &&
      typeof candidate.content === "string" &&
      candidate.content.trim().length > 0 &&
      candidate.content.length <= 8000
    );
  });
}

function isValidRequest(value: unknown): value is AssistantChatRequest {
  if (!value || typeof value !== "object") {
    return false;
  }

  const request = value as Partial<AssistantChatRequest>;

  return (
    typeof request.message === "string" &&
    request.message.trim().length > 0 &&
    request.message.length <= 8000 &&
    isAssistantMode(request.mode) &&
    isConversation(request.conversation) &&
    (request.useDemo === undefined || typeof request.useDemo === "boolean")
  );
}

function getModeInstructions(mode: AssistantMode): string {
  const instructions: Record<AssistantMode, string> = {
    general:
      "Act as a practical teaching assistant. Help with planning, explanations, assessment, differentiation and classroom decisions.",
    "lesson-planner":
      "Create coherent lesson plans with measurable objectives, retrieval, explicit instruction, guided practice, independent practice, assessment and plenary.",
    "resource-creator":
      "Create classroom-ready worksheets, homework, starters, retrieval activities, exit tickets and teaching resources.",
    "subject-expert":
      "Explain Computer Science accurately using age-appropriate language, worked examples, misconceptions and checks for understanding.",
    "intervention-coach":
      "Recommend targeted interventions, scaffolding, retrieval practice, reassessment and manageable next steps for struggling learners.",
    examiner:
      "Act as a careful UK Computer Science examiner. Apply marks fairly, explain awarded marks, identify improvements and provide a model response.",
    "parent-report":
      "Write clear, professional and parent-friendly progress comments. Be evidence-led, constructive and free from unnecessary jargon.",
  };

  return instructions[mode];
}

function titleCase(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function extractDuration(message: string): number {
  const match = message.match(
    /\b(\d{1,3})\s*(?:-|–)?\s*(?:minute|minutes|min|mins)\b/i,
  );

  const duration = match ? Number(match[1]) : 50;

  return Number.isInteger(duration) && duration >= 5 && duration <= 180
    ? duration
    : 50;
}

function extractYearGroup(message: string): string {
  const yearMatch = message.match(/\byear\s*(7|8|9|10|11|12|13)\b/i);

  if (yearMatch) {
    return `Year ${yearMatch[1]}`;
  }

  if (/\ba[\s-]?level\b/i.test(message)) {
    return "A Level";
  }

  if (/\bgcse\b/i.test(message)) {
    return "GCSE";
  }

  return "Year 10";
}

function extractQualification(message: string): string {
  return /\ba[\s-]?level\b/i.test(message) ? "A Level" : "GCSE";
}

function extractExamBoard(message: string): string {
  if (/\baqa\b/i.test(message)) return "AQA";
  if (/\bocr\b/i.test(message)) return "OCR";
  if (/\b(?:pearson\s+)?edexcel\b/i.test(message)) return "Pearson Edexcel";
  if (/\bwjec\b/i.test(message)) return "WJEC";
  if (/\beduqas\b/i.test(message)) return "Eduqas";
  if (/\bcambridge(?:\s+international)?\b/i.test(message)) {
    return "Cambridge International";
  }

  return "AQA";
}

function extractDifficulty(message: string): AssistantDifficulty {
  if (/\b(?:higher|advanced|challenging|stretch)\b/i.test(message)) {
    return "higher";
  }

  if (/\b(?:foundation|accessible|basic|support)\b/i.test(message)) {
    return "foundation";
  }

  return "standard";
}

function extractQuestionCount(message: string): number {
  const match = message.match(
    /\b(\d{1,2})\s*(?:-|–)?\s*(?:question|questions)\b/i,
  );

  const count = match ? Number(match[1]) : 10;

  return Number.isInteger(count) && count >= 3 && count <= 20 ? count : 10;
}

function isQuizRequest(message: string): boolean {
  return /\bquiz\b/i.test(message) && !/\bretrieval\s+quiz\b/i.test(message);
}

function detectResourceType(
  message: string,
  mode: AssistantMode,
): AssistantResourceType | null {
  const normalised = message.toLowerCase();

  if (
    normalised.includes("retrieval quiz") ||
    normalised.includes("retrieval questions")
  ) {
    return "retrieval-quiz";
  }

  if (
    normalised.includes("exit ticket") ||
    normalised.includes("exit question")
  ) {
    return "exit-ticket";
  }

  if (normalised.includes("worksheet")) return "worksheet";
  if (normalised.includes("homework")) return "homework";
  if (normalised.includes("starter") || normalised.includes("bell task")) {
    return "starter";
  }

  if (normalised.includes("lesson") || mode === "lesson-planner") {
    return "lesson-plan";
  }

  return null;
}

function removePlanningWords(message: string): string {
  return message
    .replace(
      /^(please\s+)?(can\s+you\s+)?(create|generate|write|plan|make|produce|design|build)\s+/i,
      "",
    )
    .replace(/^(a|an|the)\s+/i, "")
    .replace(/\b\d{1,3}\s*(?:-|–)?\s*(?:minute|minutes|min|mins)\b/gi, "")
    .replace(/\b\d{1,2}\s*(?:-|–)?\s*(?:question|questions)\b/gi, "")
    .replace(/\b(?:year\s*(?:7|8|9|10|11|12|13)|gcse|a[\s-]?level)\b/gi, "")
    .replace(
      /\b(?:aqa|ocr|pearson\s+edexcel|edexcel|wjec|eduqas|cambridge\s+international)\b/gi,
      "",
    )
    .replace(
      /\b(?:foundation|standard|higher|advanced|challenging|stretch|accessible|basic)\b/gi,
      "",
    )
    .replace(
      /\b(?:complete\s+)?(?:lesson\s+plan|lesson|worksheet|homework|starter\s+activity|starter|retrieval\s+quiz|retrieval\s+questions|exit\s+ticket|quiz)\b/gi,
      "",
    )
    .replace(/\b(?:for|on|about|covering|focused\s+on)\b/gi, " ")
    .replace(/[.?!]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTopic(message: string): string {
  return titleCase(removePlanningWords(message) || "Computer Science");
}

function parseTeachingRequest(
  message: string,
  mode: AssistantMode,
): ParsedTeachingRequest {
  return {
    topic: extractTopic(message),
    yearGroup: extractYearGroup(message),
    qualification: extractQualification(message),
    examBoard: extractExamBoard(message),
    duration: extractDuration(message),
    difficulty: extractDifficulty(message),
    questionCount: extractQuestionCount(message),
    resourceType: detectResourceType(message, mode),
    quizRequested: isQuizRequest(message),
  };
}

function createResourceBuilderAction(
  parsed: ParsedTeachingRequest,
): ResourceBuilderAction | undefined {
  if (!parsed.resourceType || parsed.quizRequested) {
    return undefined;
  }

  const names: Record<AssistantResourceType, string> = {
    "lesson-plan": "lesson plan",
    starter: "starter activity",
    "retrieval-quiz": "retrieval quiz",
    worksheet: "worksheet",
    homework: "homework task",
    "exit-ticket": "exit ticket",
  };

  return {
    type: "open-resource-builder",
    resourceType: parsed.resourceType,
    topic: parsed.topic,
    yearGroup: parsed.yearGroup,
    examBoard: parsed.examBoard,
    duration: parsed.duration,
    difficulty: parsed.difficulty,
    objectives: "",
    additionalNotes: `Create a ${names[parsed.resourceType]} based on the Copilot request. Review and adapt all generated content before publishing.`,
    buttonLabel: `Open ${titleCase(names[parsed.resourceType])} in Builder`,
  };
}

function createQuizGeneratorAction(
  parsed: ParsedTeachingRequest,
): QuizGeneratorAction | undefined {
  if (!parsed.quizRequested) {
    return undefined;
  }

  return {
    type: "open-quiz-generator",
    topic: parsed.topic,
    qualification: parsed.qualification,
    examBoard: parsed.examBoard,
    difficulty: parsed.difficulty,
    questionCount: parsed.questionCount,
    buttonLabel: "Open Quiz Generator",
  };
}

function createAction(
  parsed: ParsedTeachingRequest,
): AssistantAction | undefined {
  return (
    createQuizGeneratorAction(parsed) || createResourceBuilderAction(parsed)
  );
}

function createDemoResponse(parsed: ParsedTeachingRequest): string {
  if (parsed.quizRequested) {
    return [
      `## ${parsed.questionCount}-question quiz: ${parsed.topic}`,
      "",
      `The settings are ready for a ${parsed.qualification} ${parsed.examBoard} quiz at ${parsed.difficulty} difficulty.`,
      "",
      "**Next step**",
      "Open the Quiz Generator, review the prefilled settings and choose live AI generation or the no-cost demo generator.",
    ].join("\n");
  }

  if (parsed.resourceType === "lesson-plan") {
    return [
      `## ${parsed.duration}-minute lesson: ${parsed.topic}`,
      "",
      "**Learning objectives**",
      `1. Explain the key principles of ${parsed.topic}.`,
      `2. Apply knowledge of ${parsed.topic} to worked examples.`,
      `3. Evaluate common mistakes involving ${parsed.topic}.`,
      "",
      "**Next step**",
      "Open the Resource Builder to review the prefilled settings and generate the complete lesson.",
    ].join("\n");
  }

  return [
    `## ${parsed.topic}`,
    "",
    `${parsed.topic} is an important Computer Science concept.`,
    "",
    "Use accurate terminology, a worked example and a short check for understanding.",
  ].join("\n");
}

function getErrorDetails(error: unknown): OpenAIErrorLike {
  return error && typeof error === "object" ? (error as OpenAIErrorLike) : {};
}

function isQuotaError(error: unknown): boolean {
  const details = getErrorDetails(error);
  const text = [
    details.code,
    details.type,
    details.message,
    details.error?.code,
    details.error?.type,
    details.error?.message,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    details.status === 429 ||
    text.includes("insufficient_quota") ||
    text.includes("exceeded your current quota") ||
    text.includes("billing")
  );
}

function successfulResponse({
  message,
  source,
  action,
  warning,
}: {
  message: string;
  source: "ai" | "demo";
  action?: AssistantAction;
  warning?: string;
}) {
  return NextResponse.json({ message, source, action, warning });
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!isValidRequest(body)) {
      return NextResponse.json(
        {
          error: "Invalid assistant request.",
          errorCode: "invalid_request",
        },
        { status: 400 },
      );
    }

    const { message, mode, conversation, useDemo } = body;
    const parsed = parseTeachingRequest(message, mode);
    const action = createAction(parsed);
    const apiKey = process.env.OPENAI_API_KEY;

    if (useDemo || !apiKey) {
      return successfulResponse({
        message: createDemoResponse(parsed),
        source: "demo",
        action,
        warning: !apiKey
          ? "Live AI is not configured, so a demo response was generated."
          : undefined,
      });
    }

    try {
      const openai = new OpenAI({ apiKey });
      const model = process.env.OPENAI_ASSISTANT_MODEL || "gpt-5.6";

      const response = await openai.responses.create({
        model,
        instructions: [
          "You are CS Master Copilot, an expert UK secondary Computer Science teaching assistant.",
          "Use British English.",
          "Give accurate, practical and classroom-ready support.",
          "Use clear headings and concise sections.",
          "Use correct Computer Science terminology.",
          "Do not invent exam-board requirements.",
          `The interpreted topic is: ${parsed.topic}.`,
          `The interpreted qualification is: ${parsed.qualification}.`,
          `The interpreted exam board is: ${parsed.examBoard}.`,
          `The interpreted difficulty is: ${parsed.difficulty}.`,
          getModeInstructions(mode),
        ].join(" "),
        input: [
          ...conversation.map((item) => ({
            role: item.role,
            content: item.content,
          })),
          {
            role: "user" as const,
            content: message.trim(),
          },
        ],
      });

      if (!response.output_text) {
        return successfulResponse({
          message: createDemoResponse(parsed),
          source: "demo",
          action,
          warning:
            "The live assistant returned no text, so a demo response was used.",
        });
      }

      return successfulResponse({
        message: response.output_text,
        source: "ai",
        action,
      });
    } catch (aiError) {
      console.error("Live assistant error:", aiError);

      const details = getErrorDetails(aiError);
      let warning =
        "The live assistant was unavailable. A demo response was generated instead.";

      if (isQuotaError(aiError)) {
        warning =
          "The OpenAI account currently has no available quota. A demo response was generated instead.";
      } else if (details.status === 401) {
        warning =
          "The configured API key was rejected. A demo response was generated instead.";
      }

      return successfulResponse({
        message: createDemoResponse(parsed),
        source: "demo",
        action,
        warning,
      });
    }
  } catch (error) {
    console.error("Assistant route error:", error);

    return NextResponse.json(
      {
        error: "The assistant request could not be processed.",
        errorCode: "assistant_failed",
      },
      { status: 500 },
    );
  }
}
