import OpenAI from "openai";
import { NextResponse } from "next/server";

type QuizDifficulty = "foundation" | "standard" | "higher";

type GenerateQuizRequest = {
  topic: string;
  qualification: string;
  examBoard: string;
  difficulty: QuizDifficulty;
  questionCount: number;
};

type GeneratedQuestion = {
  id: string;
  type: "multipleChoice";
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  xpReward: number;
};

type GeneratedQuiz = {
  title: string;
  description: string;
  topicId: string;
  estimatedTime: string;
  questions: GeneratedQuestion[];
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

function isValidRequest(value: unknown): value is GenerateQuizRequest {
  if (!value || typeof value !== "object") {
    return false;
  }

  const request = value as Partial<GenerateQuizRequest>;

  return (
    typeof request.topic === "string" &&
    request.topic.trim().length > 0 &&
    typeof request.qualification === "string" &&
    request.qualification.trim().length > 0 &&
    typeof request.examBoard === "string" &&
    request.examBoard.trim().length > 0 &&
    (request.difficulty === "foundation" ||
      request.difficulty === "standard" ||
      request.difficulty === "higher") &&
    typeof request.questionCount === "number" &&
    Number.isInteger(request.questionCount) &&
    request.questionCount >= 3 &&
    request.questionCount <= 20
  );
}

function createTopicId(topic: string): string {
  const topicId = topic
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return topicId || "computer-science";
}

function getErrorDetails(error: unknown): OpenAIErrorLike {
  if (!error || typeof error !== "object") {
    return {};
  }

  return error as OpenAIErrorLike;
}

function isQuotaError(error: unknown): boolean {
  const details = getErrorDetails(error);

  const status = details.status;

  const code = details.code ?? details.error?.code ?? "";

  const type = details.type ?? details.error?.type ?? "";

  const message = details.message ?? details.error?.message ?? "";

  const searchableText = `${code} ${type} ${message}`.toLowerCase();

  return (
    status === 429 ||
    searchableText.includes("insufficient_quota") ||
    searchableText.includes("exceeded your current quota") ||
    searchableText.includes("billing")
  );
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!isValidRequest(body)) {
      return NextResponse.json(
        {
          error:
            "Invalid request. Check the topic, qualification, exam board, difficulty and question count.",
          errorCode: "invalid_request",
          demoAvailable: true,
        },
        {
          status: 400,
        },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Live AI generation is not configured. Use Generate Demo Quiz or add OPENAI_API_KEY to .env.local.",
          errorCode: "api_key_missing",
          demoAvailable: true,
        },
        {
          status: 503,
        },
      );
    }

    const { topic, qualification, examBoard, difficulty, questionCount } = body;

    const topicId = createTopicId(topic);

    const openai = new OpenAI({
      apiKey,
    });

    const response = await openai.responses.create({
      model: "gpt-5.6",

      instructions: [
        "You are an expert UK Computer Science teacher and assessment writer.",
        "Create accurate and age-appropriate assessment questions.",
        "Use British English.",
        "Avoid ambiguous questions.",
        "Each question must have exactly four options.",
        "Only one option may be correct.",
        "The correctAnswer must exactly match one of the options.",
        "Explanations must teach the concept clearly.",
        "Return only data matching the supplied JSON schema.",
      ].join(" "),

      input: [
        `Create a ${questionCount}-question Computer Science quiz.`,
        `Qualification: ${qualification}.`,
        `Exam board: ${examBoard}.`,
        `Topic: ${topic}.`,
        `Difficulty: ${difficulty}.`,
        "Cover a sensible range of knowledge, understanding and application.",
      ].join("\n"),

      text: {
        format: {
          type: "json_schema",
          name: "generated_quiz",
          strict: true,

          schema: {
            type: "object",
            additionalProperties: false,

            properties: {
              title: {
                type: "string",
              },

              description: {
                type: "string",
              },

              estimatedTime: {
                type: "string",
              },

              questions: {
                type: "array",
                minItems: questionCount,
                maxItems: questionCount,

                items: {
                  type: "object",
                  additionalProperties: false,

                  properties: {
                    question: {
                      type: "string",
                    },

                    options: {
                      type: "array",
                      minItems: 4,
                      maxItems: 4,

                      items: {
                        type: "string",
                      },
                    },

                    correctAnswer: {
                      type: "string",
                    },

                    explanation: {
                      type: "string",
                    },
                  },

                  required: [
                    "question",
                    "options",
                    "correctAnswer",
                    "explanation",
                  ],
                },
              },
            },

            required: ["title", "description", "estimatedTime", "questions"],
          },
        },
      },
    });

    if (!response.output_text) {
      return NextResponse.json(
        {
          error:
            "The AI did not return quiz content. You can use Generate Demo Quiz while testing.",
          errorCode: "empty_ai_response",
          demoAvailable: true,
        },
        {
          status: 502,
        },
      );
    }

    const parsed = JSON.parse(response.output_text) as {
      title: string;
      description: string;
      estimatedTime: string;

      questions: Array<{
        question: string;
        options: string[];
        correctAnswer: string;
        explanation: string;
      }>;
    };

    const questions = parsed.questions.map((question, index) => ({
      id: `${topicId}-ai-${index + 1}`,

      type: "multipleChoice" as const,

      question: question.question,

      options: question.options,

      correctAnswer: question.correctAnswer,

      explanation: question.explanation,

      xpReward: 10,
    }));

    const invalidQuestion = questions.find(
      (question) =>
        question.options.length !== 4 ||
        !question.options.includes(question.correctAnswer),
    );

    if (invalidQuestion) {
      return NextResponse.json(
        {
          error:
            "The AI returned an invalid question structure. Please try again or use Generate Demo Quiz.",
          errorCode: "invalid_ai_response",
          demoAvailable: true,
        },
        {
          status: 502,
        },
      );
    }

    const quiz: GeneratedQuiz = {
      title: parsed.title,
      description: parsed.description,
      topicId,
      estimatedTime: parsed.estimatedTime,
      questions,
    };

    return NextResponse.json({
      quiz,
      source: "ai",
    });
  } catch (error) {
    console.error("AI quiz generation error:", error);

    if (isQuotaError(error)) {
      return NextResponse.json(
        {
          error:
            "The OpenAI API account currently has no available quota. Use Generate Demo Quiz to continue testing without API credits.",
          errorCode: "quota_exceeded",
          demoAvailable: true,
        },
        {
          status: 429,
        },
      );
    }

    const details = getErrorDetails(error);

    if (details.status === 401) {
      return NextResponse.json(
        {
          error:
            "The OpenAI API key was rejected. Check OPENAI_API_KEY and restart the server.",
          errorCode: "invalid_api_key",
          demoAvailable: true,
        },
        {
          status: 401,
        },
      );
    }

    if (details.status === 429) {
      return NextResponse.json(
        {
          error:
            "The AI service is temporarily rate limited. Please try again later or use Generate Demo Quiz.",
          errorCode: "rate_limited",
          demoAvailable: true,
        },
        {
          status: 429,
        },
      );
    }

    return NextResponse.json(
      {
        error:
          "The live quiz could not be generated. Use Generate Demo Quiz to continue testing.",
        errorCode: "generation_failed",
        demoAvailable: true,
      },
      {
        status: 500,
      },
    );
  }
}
