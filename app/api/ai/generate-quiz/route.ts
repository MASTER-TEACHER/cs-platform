import OpenAI from "openai";
import { NextResponse } from "next/server";

type GenerateQuizRequest = {
  topic: string;
  qualification: string;
  examBoard: string;
  difficulty: "foundation" | "standard" | "higher";
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

function isValidRequest(
  value: unknown
): value is GenerateQuizRequest {
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

function createTopicId(topic: string) {
  return topic
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "OPENAI_API_KEY is missing. Add it to .env.local and restart the server.",
        },
        { status: 500 }
      );
    }

    // Create the client only when the route is called.
    // This prevents Next.js from requiring the key during build collection.
    const openai = new OpenAI({
      apiKey,
    });

    const body: unknown = await request.json();

    if (!isValidRequest(body)) {
      return NextResponse.json(
        {
          error:
            "Invalid request. Check the topic, qualification, exam board, difficulty and question count.",
        },
        { status: 400 }
      );
    }

    const {
      topic,
      qualification,
      examBoard,
      difficulty,
      questionCount,
    } = body;

    const topicId = createTopicId(topic);

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
            required: [
              "title",
              "description",
              "estimatedTime",
              "questions",
            ],
          },
        },
      },
    });

    if (!response.output_text) {
      return NextResponse.json(
        {
          error: "The AI did not return quiz content.",
        },
        { status: 502 }
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

    const quiz: GeneratedQuiz = {
      title: parsed.title,
      description: parsed.description,
      topicId,
      estimatedTime: parsed.estimatedTime,
      questions: parsed.questions.map((question, index) => ({
        id: `${topicId}-ai-${index + 1}`,
        type: "multipleChoice",
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        xpReward: 10,
      })),
    };

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error("AI quiz generation error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The quiz could not be generated.",
      },
      { status: 500 }
    );
  }
}