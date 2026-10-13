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



function tokeniseForFallback(value: string): string[] {

  const stopWords = new Set(["about", "after", "also", "because", "being", "both", "could", "does", "from", "have", "into", "only", "other", "should", "than", "that", "their", "then", "there", "these", "they", "this", "those", "through", "using", "valid", "with", "would", "mark", "point", "answer", "example", "examples", "such"]);

  return normalise(value).replace(/[^a-z0-9%<>=!+_.*\/-]+/g, " ").split(/\s+/).filter((word) => word.length >= 3 && !stopWords.has(word));

}



function genericPointMatch(response: string, point: string): boolean {

  const r = normalise(response);

  const p = normalise(point);

  if (!r || !p) return false;

  if (r.includes(p)) return true;



  const alternatives = p.split(/[/,]|\bor\b/).map((part) => part.trim()).filter((part) => part.length >= 3);

  if (alternatives.length > 1 && alternatives.some((alternative) => {

    const words = tokeniseForFallback(alternative);

    return words.length > 0 && words.every((word) => r.includes(word));

  })) return true;



  const pointTokens = Array.from(new Set(tokeniseForFallback(point)));

  if (pointTokens.length === 0) return false;

  const responseTokens = new Set(tokeniseForFallback(response));

  const matchedCount = pointTokens.filter((token) => responseTokens.has(token)).length;

  const required = pointTokens.length <= 2 ? pointTokens.length : Math.max(2, Math.ceil(pointTokens.length * 0.6));

  return matchedCount >= required;

}



function fallbackQuestionSpecificMatches(body: RequestBody, points: string[]): Set<number> {

  const matches = new Set<number>();

  const response = normalise(body.studentResponse);

  const question = normalise(body.question);



  if (question.includes("malware")) {

    const malwareTypes = ["virus", "worm", "trojan", "ransomware", "spyware", "adware", "rootkit", "keylogger"].filter((term) => response.includes(term));

    const definitionEvidence = ["malicious", "harm", "damage", "disrupt", "unauthorised", "unauthorized"].some((term) => response.includes(term));

    let typePointNumber = 0;

    points.forEach((point, index) => {

      const p = normalise(point);

      if (definitionEvidence && (p.includes("malicious") || p.includes("harm") || p.includes("disrupt"))) matches.add(index);

      if (p.includes("type") || ["virus", "worm", "trojan", "ransomware", "spyware"].some((term) => p.includes(term))) {

        typePointNumber += 1;

        if (malwareTypes.length >= typePointNumber) matches.add(index);

      }

    });

  }



  if (question.includes("validation")) {

    const checks = ["presence", "range", "length", "type", "format", "list", "lookup", "check digit"].filter((term) => response.includes(term));

    points.forEach((point, index) => {

      const p = normalise(point);

      if (checks.some((check) => p.includes(check) && response.includes(check))) matches.add(index);

      if ((p.includes("any valid") || p.includes("valid fourth") || p.includes("presence/format/list")) && checks.length >= 1) matches.add(index);

    });

  }



  if (question.includes("iseven") || question.includes("is even")) {

    points.forEach((point, index) => {

      const p = normalise(point);

      if (p.includes("parameter") && /is\s*even\s*\(*[^)]*number[^)]*\)*/i.test(body.studentResponse)) matches.add(index);

      if ((p.includes("mod 2") || p.includes("modulo")) && /(%\s*2|mod\s*2)/i.test(body.studentResponse)) matches.add(index);

      if ((p.includes("equality") || p.includes("zero")) && /(==|=)\s*0/i.test(body.studentResponse)) matches.add(index);

      if (p.includes("true") && /\btrue\b/i.test(body.studentResponse)) matches.add(index);

      if (p.includes("false") && /\bfalse\b/i.test(body.studentResponse)) matches.add(index);

      if (p.includes("return") && !p.includes("true") && !p.includes("false") && /\breturn\b/i.test(body.studentResponse)) matches.add(index);

      if (p.includes("function") && /\b(function|def)\b/i.test(body.studentResponse)) matches.add(index);

    });

  }

  return matches;

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



  const questionSpecificMatches =

    fallbackQuestionSpecificMatches(body, points);



  for (

    const [pointIndex, point] of points.entries()

  ) {

    const semantic =

      conceptEvidence(

        body.studentResponse,

        point,

      );



    const matched =

      questionSpecificMatches.has(pointIndex) ||

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



  let confidence: LessonExamMarkingConfidence =

    "medium";



  // Never turn a non-blank semantic mismatch into a high-confidence zero.

  if (awardedMarks === maximumMarks && matchedPoints.length > 0) {

    confidence = "high";

  } else if (awardedMarks === 0) {

    confidence = "low";

  } else {

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

      confidence === "low" ||

      awardedMarks < maximumMarks,

    markedAt: new Date(),

  };

}



function buildPrompt(
  body: RequestBody,
): string {
  return `
You are an experienced UK secondary Computer Science examiner.

Mark the response against the supplied question, maximum marks, mark scheme,
model answer and guidance. Use professional examiner judgement rather than
keyword matching.

CORE MARKING PRINCIPLES
- Blank answers and placeholders such as n/a, idk, not sure, none and no answer receive 0.
- Never award marks for answer length alone.
- Never invent knowledge, reasoning, working or conclusions not present in the student's response.
- Never award more than the maximum marks.
- Award each distinct creditworthy idea only once.
- Ignore spelling, grammar and formatting unless technical meaning becomes ambiguous.

MARK-SCHEME INTERPRETATION
- The supplied mark scheme is authoritative guidance, but its bullet points may be indicative rather than exhaustive.
- Do not treat mark-scheme bullets as mandatory keywords unless the question genuinely requires an exact fact, value, identifier, syntax or output.
- Accept technically correct equivalent wording, synonyms, paraphrases and alternative valid Computer Science examples that answer the question.
- Credit a correct concept even when the student's terminology differs from the model answer.
- Do not require the student to copy the model answer.
- Do not list a point as missing when equivalent evidence is clearly present elsewhere in the response.
- A valid point not literally listed may receive credit when it clearly answers the question and is technically correct. Explain that judgement in feedback.
- Shared keywords alone are not enough: the technical meaning must be correct.

COMMAND-WORD DISCIPLINE
- State / Name / Identify / Give: credit a correct concise fact, term, item, value or example. Do not require explanation unless asked.
- Define: require the essential meaning, not textbook wording.
- Describe: require relevant characteristics, stages or what happens.
- Explain: require a valid point plus an appropriate reason, mechanism, consequence or link. A bare term should not receive a development mark.
- Compare: credit explicit relevant similarities/differences; do not infer comparisons not made.
- Calculate: credit correct method/working and final answer according to the scheme; accept equivalent working and sensible notation.
- Trace: credit correct intermediate states/values and outputs where allowed.
- Design / Write / Program: judge whether the algorithm, pseudocode, SQL or code performs the required behaviour; do not require the model solution's exact structure.
- Evaluate / Discuss / Assess: reward accurate developed points, scenario application, relevant trade-offs and a supported judgement where appropriate; do not give high marks for undeveloped lists.

QUESTION-TYPE RULES
- For list/name/state questions, credit each distinct technically valid item separately up to the maximum.
- For programming/pseudocode, judge semantics and intended behaviour; tolerate harmless syntax/presentation differences unless language-specific syntax is assessed.
- For SQL, accept semantically equivalent valid queries.
- For calculations, do not penalise a correct value solely for comma placement or equivalent notation. Require units only when the question or scheme requires them.
- For trace/algorithm questions, credit valid intermediate working where allowed even if a later error changes the final result.
- For extended responses, judge the whole response rather than using keyword counting.

CONFIDENCE AND REVIEW
- Use high confidence only when evidence for the mark is clear.
- Use medium when the mark is defensible but involves interpretation.
- Use low when wording, an alternative interpretation, an incomplete or indicative scheme, an unusual solution or borderline development makes the mark uncertain.
- A non-blank zero should normally be low confidence when semantic interpretation is involved.
- Set teacherReviewRequired true for low-confidence decisions, genuinely borderline responses, unusual but potentially valid alternatives, or cases an examiner should verify.
- Do not deliberately under-mark an unusual answer: award defensible credit and flag review when appropriate.
- Do not over-mark general topic knowledge that does not answer this question.

FEEDBACK
- Feedback must be question-specific and consistent with the awarded mark.
- State what was credited before explaining what is missing or needs development.
- Do not claim a technically valid credited idea is absent.
- improvedAnswer should be a concise example showing how the response could secure the available marks; it need not copy the model answer.
- matchedPoints must describe credit actually awarded.
- missingPoints must contain only material genuinely needed for additional marks, not everything absent from the model answer.

Return JSON only.

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

                  "You are a careful UK secondary Computer Science examiner. Apply the supplied command word and mark allocation, credit technically valid equivalent answers, use examiner judgement rather than keyword matching, and return valid JSON only.",

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
