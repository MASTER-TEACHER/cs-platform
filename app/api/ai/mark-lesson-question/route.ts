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
  | "selected"
  | "missing_api_key"
  | "quota"
  | "rate_limit"
  | "live_error";

type ConceptEvidence = {
  matched: boolean;
  evidence: string[];
};

function clamp(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.min(
    maximum,
    Math.max(minimum, value),
  );
}

function clean(
  value: unknown,
): string {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function cleanArray(
  value: unknown,
): string[] {
  return Array.isArray(value)
    ? value
        .map(clean)
        .filter(Boolean)
    : [];
}

function normalise(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9'\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isNonAnswer(
  value: string,
): boolean {
  const answer =
    normalise(value);

  const compact =
    answer.replace(
      /\s+/g,
      "",
    );

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

function includesAny(
  response: string,
  phrases: string[],
): boolean {
  return phrases.some(
    (phrase) =>
      response.includes(
        normalise(phrase),
      ),
  );
}

function countMatchedGroups(
  response: string,
  groups: string[][],
): number {
  return groups.filter(
    (group) =>
      includesAny(
        response,
        group,
      ),
  ).length;
}

function conceptEvidence(
  response: string,
  concept: string,
): ConceptEvidence {
  const text =
    normalise(response);

  const conceptText =
    normalise(concept);

  /*
   * ---------------------------------------------------------
   * OOP CONCEPTS
   * ---------------------------------------------------------
   */

  if (
    conceptText.includes(
      "encapsulation",
    ) ||
    conceptText.includes(
      "modularity",
    )
  ) {
    const evidence: string[] =
      [];

    const hasEncapsulation =
      includesAny(
        text,
        [
          "encapsulation",
          "encapsulate",
          "encapsulated",
        ],
      );

    const hasDataControl =
      includesAny(
        text,
        [
          "control access",
          "controlled access",
          "restrict access",
          "restricted access",
          "protect data",
          "protects data",
          "hide data",
          "hides data",
          "internal data",
          "internal state",
          "private data",
        ],
      );

    const hasModularity =
      includesAny(
        text,
        [
          "modular",
          "modularity",
          "separate classes",
          "separated",
          "independent parts",
          "grouped together",
          "group data and methods",
          "data and methods",
        ],
      );

    if (hasEncapsulation) {
      evidence.push(
        "Identifies encapsulation.",
      );
    }

    if (hasDataControl) {
      evidence.push(
        "Explains controlled access to internal data/state.",
      );
    }

    if (hasModularity) {
      evidence.push(
        "Links OOP to modular/separated program structure.",
      );
    }

    return {
      matched:
        hasEncapsulation ||
        hasDataControl ||
        hasModularity,
      evidence,
    };
  }

  if (
    conceptText.includes(
      "maintainability",
    ) ||
    conceptText.includes(
      "maintainability benefit",
    )
  ) {
    const evidence: string[] =
      [];

    const hasMaintenance =
      includesAny(
        text,
        [
          "maintain",
          "maintainable",
          "maintenance",
          "easier to maintain",
          "easier to update",
          "easier to modify",
          "easier to change",
        ],
      );

    const hasImpact =
      includesAny(
        text,
        [
          "less likely to affect",
          "without affecting",
          "unrelated parts",
          "isolated",
          "separate",
          "separated",
          "independent",
          "reduce bugs",
          "easier to test",
          "easier to debug",
        ],
      );

    if (hasMaintenance) {
      evidence.push(
        "Explains a maintainability benefit.",
      );
    }

    if (hasImpact) {
      evidence.push(
        "Develops the benefit by explaining reduced impact on other parts of the program.",
      );
    }

    return {
      matched:
        hasMaintenance ||
        hasImpact,
      evidence,
    };
  }

  if (
    conceptText.includes(
      "reuse",
    ) ||
    conceptText.includes(
      "inheritance",
    ) ||
    conceptText.includes(
      "polymorphism",
    )
  ) {
    const evidence: string[] =
      [];

    const hasInheritance =
      includesAny(
        text,
        [
          "inheritance",
          "inherit",
          "inherits",
          "inherited",
          "parent class",
          "base class",
          "subclass",
          "subclasses",
          "superclass",
        ],
      );

    const hasReuse =
      includesAny(
        text,
        [
          "reuse",
          "reused",
          "reusable",
          "code reuse",
          "common attributes",
          "common methods",
          "common functionality",
        ],
      );

    const hasDuplication =
      includesAny(
        text,
        [
          "reduce duplication",
          "reduces duplication",
          "reduced duplication",
          "avoid duplication",
          "avoids duplication",
          "duplicated code",
          "duplicate code",
          "repeated code",
        ],
      );

    const hasPolymorphism =
      includesAny(
        text,
        [
          "polymorphism",
          "override",
          "overriding",
          "common interface",
          "different implementations",
        ],
      );

    if (hasInheritance) {
      evidence.push(
        "Identifies inheritance.",
      );
    }

    if (hasReuse) {
      evidence.push(
        "Explains code reuse.",
      );
    }

    if (hasDuplication) {
      evidence.push(
        "Explains reduced code duplication.",
      );
    }

    if (hasPolymorphism) {
      evidence.push(
        "Identifies polymorphism/overriding.",
      );
    }

    return {
      matched:
        hasInheritance ||
        hasReuse ||
        hasDuplication ||
        hasPolymorphism,
      evidence,
    };
  }

  if (
    conceptText.includes(
      "second benefit",
    )
  ) {
    const groups = [
      [
        "reuse",
        "reusable",
        "code reuse",
        "reduce duplication",
        "duplicated code",
      ],
      [
        "maintain",
        "easier to maintain",
        "maintenance",
      ],
      [
        "easier to test",
        "testing",
        "test",
      ],
      [
        "faster development",
        "development faster",
        "quicker development",
        "develop faster",
      ],
      [
        "extensible",
        "extension",
        "extend",
        "scalable",
        "scale",
      ],
    ];

    const matchedCount =
      countMatchedGroups(
        text,
        groups,
      );

    return {
      matched:
        matchedCount >= 2,
      evidence:
        matchedCount >= 2
          ? [
              "Explains a second distinct OOP benefit.",
            ]
          : [],
    };
  }

  if (
    conceptText.includes(
      "large projects",
    ) ||
    conceptText.includes(
      "large project",
    )
  ) {
    const matched =
      includesAny(
        text,
        [
          "large project",
          "large projects",
          "large program",
          "large programs",
          "large system",
          "large systems",
          "different parts",
          "unrelated parts",
          "across a project",
          "across the project",
          "development faster",
          "easier to maintain",
          "easier to test",
        ],
      );

    return {
      matched,
      evidence: matched
        ? [
            "Links the explanation to the needs of a large project.",
          ]
        : [],
    };
  }

  if (
    conceptText.includes(
      "oop terminology",
    ) ||
    conceptText.includes(
      "appropriate oop terminology",
    )
  ) {
    const terminology =
      [
        "class",
        "classes",
        "object",
        "objects",
        "encapsulation",
        "inheritance",
        "parent class",
        "base class",
        "subclass",
        "subclasses",
        "polymorphism",
        "method",
        "methods",
        "attributes",
      ];

    const count =
      terminology.filter(
        (term) =>
          text.includes(
            normalise(term),
          ),
      ).length;

    return {
      matched: count >= 2,
      evidence:
        count >= 2
          ? [
              "Uses appropriate object-oriented programming terminology.",
            ]
          : [],
    };
  }

  /*
   * ---------------------------------------------------------
   * RECURSION CONCEPTS
   * ---------------------------------------------------------
   */

  if (
    conceptText.includes(
      "termination",
    )
  ) {
    const matched =
      includesAny(
        text,
        [
          "base case",
          "terminating condition",
          "termination",
          "stops recursion",
          "stops the recursion",
          "ends recursion",
          "ends the recursion",
        ],
      );

    return {
      matched,
      evidence: matched
        ? [
            "Explains termination/base case.",
          ]
        : [],
    };
  }

  if (
    conceptText.includes(
      "smaller recursive calls",
    )
  ) {
    const matched =
      includesAny(
        text,
        [
          "smaller problem",
          "smaller input",
          "smaller value",
          "recursive call",
          "recursive calls",
          "calls itself",
        ],
      );

    return {
      matched,
      evidence: matched
        ? [
            "Explains recursive calls on a smaller problem/input.",
          ]
        : [],
    };
  }

  if (
    conceptText.includes(
      "failure without base case",
    )
  ) {
    const matched =
      includesAny(
        text,
        [
          "infinite recursion",
          "continue indefinitely",
          "continues indefinitely",
          "never stop",
          "never stops",
          "does not terminate",
          "doesn't terminate",
        ],
      );

    return {
      matched,
      evidence: matched
        ? [
            "Explains what happens without a base case.",
          ]
        : [],
    };
  }

  if (
    conceptText.includes(
      "stack/resource exhaustion",
    ) ||
    conceptText.includes(
      "resource exhaustion",
    )
  ) {
    const matched =
      includesAny(
        text,
        [
          "stack overflow",
          "call stack",
          "stack",
          "memory",
          "resource exhaustion",
          "resources exhausted",
          "resources",
        ],
      );

    return {
      matched,
      evidence: matched
        ? [
            "Links excessive recursion to stack/resource exhaustion.",
          ]
        : [],
    };
  }

  /*
   * ---------------------------------------------------------
   * DEFENSIVE PROGRAMMING CONCEPTS
   * ---------------------------------------------------------
   */

  if (
    conceptText ===
      "validation" ||
    conceptText.includes(
      "validation",
    )
  ) {
    const matched =
      includesAny(
        text,
        [
          "validation",
          "validate",
          "validates",
          "range check",
          "range checking",
          "type check",
          "length check",
          "presence check",
          "reject invalid",
          "rejects invalid",
          "unsuitable data",
        ],
      );

    return {
      matched,
      evidence: matched
        ? [
            "Identifies validation.",
          ]
        : [],
    };
  }

  if (
    conceptText.includes(
      "relevant example",
    )
  ) {
    const matched =
      includesAny(
        text,
        [
          "range check",
          "range checking",
          "type check",
          "length check",
          "presence check",
          "file not found",
          "invalid input",
          "invalid data",
          "try",
          "catch",
          "except",
        ],
      );

    return {
      matched,
      evidence: matched
        ? [
            "Provides a relevant defensive-programming example.",
          ]
        : [],
    };
  }

  if (
    conceptText.includes(
      "exception handling",
    )
  ) {
    const matched =
      includesAny(
        text,
        [
          "exception handling",
          "exception",
          "try",
          "catch",
          "except",
          "runtime error",
          "runtime errors",
        ],
      );

    return {
      matched,
      evidence: matched
        ? [
            "Identifies exception handling.",
          ]
        : [],
    };
  }

  if (
    conceptText.includes(
      "controlled recovery",
    )
  ) {
    const matched =
      includesAny(
        text,
        [
          "controlled recovery",
          "recover",
          "recovery",
          "does not crash",
          "doesn't crash",
          "prevent crash",
          "prevents crash",
          "continue running",
          "continues running",
          "alternative action",
          "ask again",
          "retry",
        ],
      );

    return {
      matched,
      evidence: matched
        ? [
            "Explains controlled recovery.",
          ]
        : [],
    };
  }

  if (
    conceptText.includes(
      "reliability",
    )
  ) {
    const matched =
      includesAny(
        text,
        [
          "reliable",
          "reliability",
          "robust",
          "robustness",
          "prevent crash",
          "prevents crash",
          "controlled",
          "valid data",
          "system state",
        ],
      );

    return {
      matched,
      evidence: matched
        ? [
            "Links defensive-programming techniques to improved reliability.",
          ]
        : [],
    };
  }

  return {
    matched: false,
    evidence: [],
  };
}

function genericPointMatch(
  response: string,
  point: string,
): boolean {
  const normalisedResponse =
    normalise(response);

  const keywords =
    normalise(point)
      .split(" ")
      .filter(
        (word) =>
          word.length >= 4,
      );

  if (
    keywords.length === 0
  ) {
    return false;
  }

  const matched =
    keywords.filter(
      (keyword) =>
        normalisedResponse.includes(
          keyword,
        ),
    );

  const required =
    keywords.length <= 2
      ? keywords.length
      : Math.ceil(
          keywords.length * 0.5,
        );

  return (
    matched.length >= required
  );
}

function demoResult(
  body: RequestBody,
  reason: FallbackReason,
): LessonExamMarkingResult {
  const maximumMarks =
    Math.max(
      1,
      body.maximumMarks,
    );

  if (
    isNonAnswer(
      body.studentResponse,
    )
  ) {
    return {
      mode: "demo",
      awardedMarks: 0,
      maximumMarks,
      percentage: 0,
      confidence: "high",
      matchedPoints: [],
      missingPoints:
        body.markScheme?.length
          ? body.markScheme
          : [
              "No assessable response was provided.",
            ],
      feedback:
        "No assessable response was provided. Attempt the question and use the mark allocation to decide how much detail is required.",
      improvedAnswer:
        body.modelAnswer,
      teacherReviewRequired:
        false,
      markedAt: new Date(),
    };
  }

  const points =
    body.markScheme?.length
      ? body.markScheme
      : body.modelAnswer
          .split(
            /[.;]\s*/,
          )
          .map(
            (point) =>
              point.trim(),
          )
          .filter(Boolean);

  const matchedPoints: string[] =
    [];

  const missingPoints: string[] =
    [];

  const evidenceLines: string[] =
    [];

  for (
    const point of points
  ) {
    const semantic =
      conceptEvidence(
        body.studentResponse,
        point,
      );

    const matched =
      semantic.matched ||
      genericPointMatch(
        body.studentResponse,
        point,
      );

    if (matched) {
      matchedPoints.push(
        point,
      );

      evidenceLines.push(
        ...semantic.evidence,
      );
    } else {
      missingPoints.push(
        point,
      );
    }
  }

  /*
   * One mark per explicit mark-scheme point.
   * This keeps the deterministic marker conservative
   * and avoids inventing marks outside the supplied scheme.
   */
  const awardedMarks =
    clamp(
      matchedPoints.length,
      0,
      maximumMarks,
    );

  const percentage =
    Math.round(
      (awardedMarks /
        maximumMarks) *
        100,
    );

  const wordCount =
    body.studentResponse
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .length;

  let confidence: LessonExamMarkingConfidence =
    "medium";

  if (
    awardedMarks === 0 ||
    awardedMarks === maximumMarks
  ) {
    confidence = "high";
  } else if (
    wordCount <
      Math.max(
        8,
        maximumMarks * 3,
      )
  ) {
    confidence = "medium";
  } else if (
    maximumMarks >= 6 &&
    awardedMarks > 0 &&
    awardedMarks < maximumMarks
  ) {
    confidence = "medium";
  }

  const fallbackMessage =
    reason === "quota"
      ? "Live AI marking quota was unavailable, so deterministic fallback marking was used."
      : reason ===
          "rate_limit"
        ? "Live AI marking was rate-limited, so deterministic fallback marking was used."
        : reason ===
            "missing_api_key"
          ? "No live AI key was available, so deterministic fallback marking was used."
          : reason ===
              "selected"
            ? "Demo marking mode is enabled."
            : "Live AI marking was unavailable, so deterministic fallback marking was used.";

  let performanceMessage =
    "";

  if (
    awardedMarks ===
    maximumMarks
  ) {
    performanceMessage =
      "The response covers the supplied marking points with clear relevant development.";
  } else if (
    awardedMarks === 0
  ) {
    performanceMessage =
      "The response does not yet demonstrate a clear question-specific marking point.";
  } else if (
    percentage >= 70
  ) {
    performanceMessage =
      "The response demonstrates strong subject knowledge and developed reasoning, with only limited additional detail needed.";
  } else if (
    percentage >= 50
  ) {
    performanceMessage =
      "The response includes several relevant marking points but needs further development or precision for full marks.";
  } else {
    performanceMessage =
      "The response shows some relevant understanding but needs clearer explanation and more complete coverage of the mark scheme.";
  }

  const uniqueEvidence =
    Array.from(
      new Set(
        evidenceLines,
      ),
    );

  const feedback =
    uniqueEvidence.length > 0
      ? `${fallbackMessage} ${performanceMessage} Recognised evidence includes: ${uniqueEvidence.join(
          " ",
        )}`
      : `${fallbackMessage} ${performanceMessage}`;

  return {
    mode: "demo",
    awardedMarks,
    maximumMarks,
    percentage,
    confidence,
    matchedPoints,
    missingPoints,
    feedback,
    improvedAnswer:
      body.modelAnswer,
    teacherReviewRequired:
      maximumMarks >= 6 &&
      awardedMarks <
        maximumMarks,
    markedAt: new Date(),
  };
}

function buildPrompt(
  body: RequestBody,
): string {
  return `
You are an experienced UK secondary Computer Science examiner.

Mark the response only against the supplied question, maximum marks, mark scheme,
model answer and guidance.

Rules:
- Blank answers and placeholders such as n/a, idk, not sure, none and no answer receive 0.
- Never award marks for answer length alone.
- Never invent content not present in the student's response.
- Accept technically valid equivalent wording.
- Credit developed explanation, not only exact terminology.
- Do not require the student to copy the model answer.
- Do not list a mark-scheme point as missing when equivalent evidence is clearly present.
- Award each distinct mark-scheme point only once.
- Never award more than the maximum marks.
- Return JSON only.

Topic: ${body.topic}
Lesson: ${body.lessonTitle}
Question: ${body.question}
Maximum marks: ${body.maximumMarks}
Mark scheme: ${JSON.stringify(
    body.markScheme ?? [],
  )}
Model answer: ${body.modelAnswer}
Guidance: ${JSON.stringify(
    body.guidance ?? [],
  )}
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
  if (
    isNonAnswer(
      body.studentResponse,
    )
  ) {
    return demoResult(
      body,
      "selected",
    );
  }

  const parsed =
    JSON.parse(
      text,
    ) as Record<
      string,
      unknown
    >;

  const maximumMarks =
    Math.max(
      1,
      body.maximumMarks,
    );

  const awardedMarks =
    clamp(
      Number(
        parsed.awardedMarks,
      ) || 0,
      0,
      maximumMarks,
    );

  const confidenceValue =
    clean(
      parsed.confidence,
    );

  const confidence: LessonExamMarkingConfidence =
    confidenceValue ===
      "high" ||
    confidenceValue ===
      "medium" ||
    confidenceValue ===
      "low"
      ? confidenceValue
      : "low";

  return {
    mode: "live",
    awardedMarks,
    maximumMarks,
    percentage:
      Math.round(
        (awardedMarks /
          maximumMarks) *
          100,
      ),
    confidence,
    matchedPoints:
      cleanArray(
        parsed.matchedPoints,
      ),
    missingPoints:
      cleanArray(
        parsed.missingPoints,
      ),
    feedback:
      clean(
        parsed.feedback,
      ) ||
      "Review the response against the mark scheme.",
    improvedAnswer:
      clean(
        parsed.improvedAnswer,
      ) ||
      body.modelAnswer,
    teacherReviewRequired:
      parsed.teacherReviewRequired ===
        true ||
      confidence === "low" ||
      maximumMarks >= 6,
    markedAt: new Date(),
  };
}

function isQuotaError(
  error: unknown,
): boolean {
  if (
    !error ||
    typeof error !==
      "object"
  ) {
    return false;
  }

  const candidate =
    error as {
      status?: unknown;
      code?: unknown;
      type?: unknown;
      error?: {
        code?: unknown;
        type?: unknown;
      };
    };

  return (
    candidate.status ===
      429 &&
    (
      candidate.code ===
        "insufficient_quota" ||
      candidate.type ===
        "insufficient_quota" ||
      candidate.error?.code ===
        "insufficient_quota" ||
      candidate.error?.type ===
        "insufficient_quota"
    )
  );
}

export async function POST(
  request: Request,
) {
  try {
    const body =
      (await request.json()) as RequestBody;

    if (
      !body ||
      !clean(
        body.question,
      ) ||
      !clean(
        body.studentResponse,
      ) ||
      !Number.isFinite(
        body.maximumMarks,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "A valid lesson exam response is required.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Explicit demo mode.
     */
    if (
      process.env
        .AI_MARKING_DEMO_MODE ===
      "true"
    ) {
      return NextResponse.json(
        demoResult(
          body,
          "selected",
        ),
      );
    }

    const apiKey =
      process.env.OPENAI_API_KEY;

    /*
     * Production resilience:
     * if live AI is not configured, return deterministic
     * marking rather than breaking the lesson.
     */
    if (!apiKey) {
      return NextResponse.json(
        demoResult(
          body,
          "missing_api_key",
        ),
      );
    }

    try {
      const client =
        new OpenAI({
          apiKey,
        });

      const completion =
        await client.chat.completions.create(
          {
            model:
              process.env
                .OPENAI_MARKING_MODEL ||
              "gpt-4.1-mini",

            temperature: 0.1,

            response_format: {
              type: "json_object",
            },

            messages: [
              {
                role: "system",
                content:
                  "You are a careful UK secondary Computer Science examiner. Credit accurate equivalent terminology and developed reasoning. Return valid JSON only.",
              },
              {
                role: "user",
                content:
                  buildPrompt(
                    body,
                  ),
              },
            ],
          },
        );

      const output =
        completion
          .choices[0]
          ?.message
          .content;

      if (!output) {
        throw new Error(
          "The marking service returned no content.",
        );
      }

      return NextResponse.json(
        parseLiveResult(
          output,
          body,
        ),
      );
    } catch (
      liveError
    ) {
      console.error(
        "Live lesson marking unavailable:",
        liveError,
      );

      const reason: FallbackReason =
        isQuotaError(
          liveError,
        )
          ? "quota"
          : (
                liveError as {
                  status?: unknown;
                }
              )?.status ===
              429
            ? "rate_limit"
            : "live_error";

      /*
       * Important:
       * do NOT break the student's lesson because the live
       * marking provider is unavailable.
       *
       * Fall back to deterministic examiner logic.
       */
      return NextResponse.json(
        demoResult(
          body,
          reason,
        ),
      );
    }
  } catch (error) {
    console.error(
      "Lesson marking route error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof
          Error
            ? error.message
            : "The lesson answer could not be marked.",
      },
      {
        status: 500,
      },
    );
  }
}
