import OpenAI from "openai";
import { NextResponse } from "next/server";

const RESOURCE_TYPES = [
  "lesson-plan",
  "starter",
  "retrieval-quiz",
  "worksheet",
  "homework",
  "exit-ticket",
] as const;

const DIFFICULTY_LEVELS = ["foundation", "standard", "higher"] as const;

type ResourceType = (typeof RESOURCE_TYPES)[number];
type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

type GenerateResourceRequest = {
  resourceType: ResourceType;
  topic: string;
  yearGroup: string;
  examBoard: string;
  duration: number;
  difficulty: DifficultyLevel;
  objectives: string;
  additionalNotes: string;
};

type ResourceSection = {
  title: string;
  duration: string;
  teacherInstructions: string;
  studentTask: string;
  assessment: string;
  resources: string[];
};

type Differentiation = {
  support: string[];
  core: string[];
  stretch: string[];
};

type Misconception = {
  misconception: string;
  correction: string;
};

type AssessmentQuestion = {
  question: string;
  answer: string;
  marks: number;
};

export type GeneratedTeachingResource = {
  id: string;
  title: string;
  resourceType: string;
  topic: string;
  yearGroup: string;
  examBoard: string;
  duration: string;
  difficulty: string;
  overview: string;
  learningObjectives: string[];
  successCriteria: string[];
  keywords: string[];
  priorKnowledge: string[];
  sections: ResourceSection[];
  differentiation: Differentiation;
  misconceptions: Misconception[];
  assessmentQuestions: AssessmentQuestion[];
  homework: string;
  teacherNotes: string;
  createdAt: string;
};

function isResourceType(value: unknown): value is ResourceType {
  return (
    typeof value === "string" && RESOURCE_TYPES.includes(value as ResourceType)
  );
}

function isDifficultyLevel(value: unknown): value is DifficultyLevel {
  return (
    typeof value === "string" &&
    DIFFICULTY_LEVELS.includes(value as DifficultyLevel)
  );
}

function isValidRequest(value: unknown): value is GenerateResourceRequest {
  if (!value || typeof value !== "object") {
    return false;
  }

  const request = value as Partial<GenerateResourceRequest>;

  return (
    isResourceType(request.resourceType) &&
    typeof request.topic === "string" &&
    request.topic.trim().length >= 2 &&
    request.topic.trim().length <= 150 &&
    typeof request.yearGroup === "string" &&
    request.yearGroup.trim().length > 0 &&
    request.yearGroup.trim().length <= 50 &&
    typeof request.examBoard === "string" &&
    request.examBoard.trim().length > 0 &&
    request.examBoard.trim().length <= 50 &&
    typeof request.duration === "number" &&
    Number.isInteger(request.duration) &&
    request.duration >= 5 &&
    request.duration <= 180 &&
    isDifficultyLevel(request.difficulty) &&
    typeof request.objectives === "string" &&
    request.objectives.length <= 1500 &&
    typeof request.additionalNotes === "string" &&
    request.additionalNotes.length <= 2000
  );
}

function createResourceId(topic: string): string {
  const slug = topic
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return `${slug || "resource"}-${Date.now()}`;
}

function getResourceLabel(resourceType: ResourceType): string {
  const labels: Record<ResourceType, string> = {
    "lesson-plan": "lesson plan",
    starter: "starter activity",
    "retrieval-quiz": "retrieval quiz",
    worksheet: "student worksheet",
    homework: "homework activity",
    "exit-ticket": "exit ticket",
  };

  return labels[resourceType];
}

function getResourceSpecificInstructions(resourceType: ResourceType): string {
  const instructions: Record<ResourceType, string> = {
    "lesson-plan": [
      "Create a complete lesson sequence.",
      "Include an engaging starter, explicit teacher instruction,",
      "guided practice, independent practice, assessment and plenary.",
      "Ensure the combined section durations are appropriate for",
      "the requested lesson duration.",
    ].join(" "),

    starter: [
      "Create a focused opening activity that can be completed",
      "at the beginning of a lesson.",
      "Activate prior knowledge and include clear answers.",
      "Keep the number of lesson sections appropriate for a starter.",
    ].join(" "),

    "retrieval-quiz": [
      "Create a retrieval-practice resource containing varied",
      "knowledge questions and complete answers.",
      "Include a mixture of recall, explanation and application.",
      "The resource must be usable without additional preparation.",
    ].join(" "),

    worksheet: [
      "Create a classroom-ready worksheet with clear instructions,",
      "scaffolded tasks, independent questions and full answers.",
      "Include suitable progression from accessible to challenging.",
    ].join(" "),

    homework: [
      "Create a self-contained homework activity that students can",
      "complete independently.",
      "Include clear submission expectations and model answers.",
    ].join(" "),

    "exit-ticket": [
      "Create a concise end-of-lesson assessment.",
      "Include questions that check the stated learning objectives,",
      "along with complete answers and marking guidance.",
    ].join(" "),
  };

  return instructions[resourceType];
}

function parseGeneratedResource(
  outputText: string,
  request: GenerateResourceRequest,
): GeneratedTeachingResource {
  const parsed = JSON.parse(outputText) as Omit<
    GeneratedTeachingResource,
    "id" | "createdAt"
  >;

  return {
    id: createResourceId(request.topic),
    title: parsed.title,
    resourceType: parsed.resourceType,
    topic: parsed.topic,
    yearGroup: parsed.yearGroup,
    examBoard: parsed.examBoard,
    duration: parsed.duration,
    difficulty: parsed.difficulty,
    overview: parsed.overview,
    learningObjectives: parsed.learningObjectives,
    successCriteria: parsed.successCriteria,
    keywords: parsed.keywords,
    priorKnowledge: parsed.priorKnowledge,
    sections: parsed.sections,
    differentiation: parsed.differentiation,
    misconceptions: parsed.misconceptions,
    assessmentQuestions: parsed.assessmentQuestions,
    homework: parsed.homework,
    teacherNotes: parsed.teacherNotes,
    createdAt: new Date().toISOString(),
  };
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
        { status: 500 },
      );
    }

    // Create the client only when the route is called.
    // This avoids requiring the key during Next.js build collection.
    const openai = new OpenAI({
      apiKey,
    });

    const body: unknown = await request.json();

    if (!isValidRequest(body)) {
      return NextResponse.json(
        {
          error:
            "Invalid request. Check the resource type, topic, year group, exam board, duration and difficulty.",
        },
        { status: 400 },
      );
    }

    const {
      resourceType,
      topic,
      yearGroup,
      examBoard,
      duration,
      difficulty,
      objectives,
      additionalNotes,
    } = body;

    const resourceLabel = getResourceLabel(resourceType);
    const resourceInstructions = getResourceSpecificInstructions(resourceType);

    const response = await openai.responses.create({
      model: "gpt-5.6",

      instructions: [
        "You are an expert UK secondary Computer Science teacher,",
        "curriculum designer and assessment writer.",

        "Create accurate, practical and classroom-ready teaching resources.",
        "Use British English throughout.",
        "Use correct Computer Science terminology.",
        "Match the requested year group, qualification context and exam board.",
        "Make explanations age-appropriate and technically accurate.",
        "Use measurable learning objectives.",
        "Ensure activities have clear teacher instructions and student tasks.",
        "Include answers, assessment guidance and model responses.",
        "Do not invent exam-board requirements.",
        "Do not refer to yourself as an AI.",
        "Do not include markdown formatting.",
        "Return only data matching the supplied JSON schema.",
      ].join(" "),

      input: [
        `Create a ${resourceLabel} for a UK Computer Science teacher.`,
        "",
        `Resource type: ${resourceType}`,
        `Topic: ${topic.trim()}`,
        `Year group or qualification: ${yearGroup.trim()}`,
        `Exam board: ${examBoard.trim()}`,
        `Duration: ${duration} minutes`,
        `Difficulty: ${difficulty}`,
        "",
        "Teacher-provided learning objectives:",
        objectives.trim() ||
          "No objectives were provided. Generate suitable measurable objectives.",
        "",
        "Additional teacher instructions:",
        additionalNotes.trim() || "No additional instructions were provided.",
        "",
        "Resource-specific requirements:",
        resourceInstructions,
        "",
        "The resource must be ready for a teacher to review and use.",
      ].join("\n"),

      text: {
        format: {
          type: "json_schema",
          name: "generated_teaching_resource",
          strict: true,

          schema: {
            type: "object",
            additionalProperties: false,

            properties: {
              title: {
                type: "string",
              },

              resourceType: {
                type: "string",
              },

              topic: {
                type: "string",
              },

              yearGroup: {
                type: "string",
              },

              examBoard: {
                type: "string",
              },

              duration: {
                type: "string",
              },

              difficulty: {
                type: "string",
              },

              overview: {
                type: "string",
              },

              learningObjectives: {
                type: "array",
                minItems: 1,
                items: {
                  type: "string",
                },
              },

              successCriteria: {
                type: "array",
                minItems: 1,
                items: {
                  type: "string",
                },
              },

              keywords: {
                type: "array",
                items: {
                  type: "string",
                },
              },

              priorKnowledge: {
                type: "array",
                items: {
                  type: "string",
                },
              },

              sections: {
                type: "array",
                minItems: 1,

                items: {
                  type: "object",
                  additionalProperties: false,

                  properties: {
                    title: {
                      type: "string",
                    },

                    duration: {
                      type: "string",
                    },

                    teacherInstructions: {
                      type: "string",
                    },

                    studentTask: {
                      type: "string",
                    },

                    assessment: {
                      type: "string",
                    },

                    resources: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                    },
                  },

                  required: [
                    "title",
                    "duration",
                    "teacherInstructions",
                    "studentTask",
                    "assessment",
                    "resources",
                  ],
                },
              },

              differentiation: {
                type: "object",
                additionalProperties: false,

                properties: {
                  support: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },

                  core: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },

                  stretch: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                },

                required: ["support", "core", "stretch"],
              },

              misconceptions: {
                type: "array",

                items: {
                  type: "object",
                  additionalProperties: false,

                  properties: {
                    misconception: {
                      type: "string",
                    },

                    correction: {
                      type: "string",
                    },
                  },

                  required: ["misconception", "correction"],
                },
              },

              assessmentQuestions: {
                type: "array",
                minItems: 1,

                items: {
                  type: "object",
                  additionalProperties: false,

                  properties: {
                    question: {
                      type: "string",
                    },

                    answer: {
                      type: "string",
                    },

                    marks: {
                      type: "integer",
                      minimum: 1,
                      maximum: 20,
                    },
                  },

                  required: ["question", "answer", "marks"],
                },
              },

              homework: {
                type: "string",
              },

              teacherNotes: {
                type: "string",
              },
            },

            required: [
              "title",
              "resourceType",
              "topic",
              "yearGroup",
              "examBoard",
              "duration",
              "difficulty",
              "overview",
              "learningObjectives",
              "successCriteria",
              "keywords",
              "priorKnowledge",
              "sections",
              "differentiation",
              "misconceptions",
              "assessmentQuestions",
              "homework",
              "teacherNotes",
            ],
          },
        },
      },
    });

    if (!response.output_text) {
      return NextResponse.json(
        {
          error: "The AI did not return teaching resource content.",
        },
        { status: 502 },
      );
    }

    const resource = parseGeneratedResource(response.output_text, body);

    return NextResponse.json({ resource });
  } catch (error) {
    console.error("AI teaching resource generation error:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error:
            "The generated resource could not be processed. Please try again.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The teaching resource could not be generated.",
      },
      { status: 500 },
    );
  }
}
