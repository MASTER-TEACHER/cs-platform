import type { Topic } from "@/types/curriculum";

export const advancedDataRepresentationTopic: Topic = {
  "id": "advanced-data-representation",
  "title": "Advanced Data Representation",
  "description": "Extend binary knowledge to signed values, floating point, precision, range and advanced encoding.",
  "difficulty": "⭐⭐⭐",
  "estimatedTime": "75 mins",
  "status": "published",
  "unit": "A-level Data Representation",
  "specificationReferences": [
    "AQA 4.5",
    "OCR H446 1.4"
  ],
  "lessons": [
    {
      "id": "al-signed-binary",
      "title": "Signed Binary and Two's Complement",
      "description": "Represent and calculate with signed binary integers.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "simulator": "binary",
      "objectives": [
        "Interpret two's-complement values.",
        "Convert positive and negative integers.",
        "Detect signed overflow."
      ],
      "explanation": "Two's complement uses the most significant bit with negative weighting and supports signed arithmetic using ordinary binary addition.",
      "workedExample": "In 8 bits, 11111101 represents -3.",
      "practiceQuestions": [
        {
          "question": "What range does 8-bit two's complement represent?",
          "answer": "-128 to 127"
        },
        {
          "question": "What does the MSB contribute in 8-bit two's complement?",
          "answer": "-128"
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Can adding two positive values legitimately produce a negative signed result?",
          "answer": "No"
        }
      ],
      "examQuestion": {
        "question": "Explain how two's complement represents negative integers and how overflow can be detected.",
        "marks": 5,
        "answer": "The MSB has negative weighting; values outside the representable range overflow, often producing an inconsistent sign after same-sign addition.",
        "markScheme": [
          "Negative weighting.",
          "Correct range idea.",
          "Addition compatibility.",
          "Overflow range.",
          "Sign/range reasoning."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Compare sign-and-magnitude with two's complement."
    },
    {
      "id": "al-floating-point",
      "title": "Floating-Point Representation",
      "description": "Understand mantissa/significand, exponent, normalisation and rounding.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Explain mantissa/significand and exponent.",
        "Explain normalisation.",
        "Analyse precision and range."
      ],
      "explanation": "Floating point stores a significand and exponent. Normalisation gives a standard form; finite significand bits cause rounding.",
      "workedExample": "Shifting the significand changes the exponent while preserving the represented magnitude until rounding is required.",
      "practiceQuestions": [
        {
          "question": "Which field strongly determines range?",
          "answer": "The exponent"
        },
        {
          "question": "Which field strongly determines precision?",
          "answer": "The mantissa or significand"
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Why are some decimal fractions inexact in binary?",
          "answer": "They require an infinite binary expansion",
          "acceptedAnswers": [
            "Finite bits require rounding"
          ]
        }
      ],
      "examQuestion": {
        "question": "Explain the trade-off between range and precision in a fixed-size floating-point format.",
        "marks": 6,
        "answer": "More exponent bits increase range but leave fewer bits for precision; more significand bits improve precision but reduce exponent range.",
        "markScheme": [
          "Exponent/range link.",
          "Significand/precision link.",
          "Finite total bits.",
          "Trade-off.",
          "Rounding.",
          "Developed conclusion."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Explain why equality tests on calculated floats can be unreliable."
    },
    {
      "id": "al-errors",
      "title": "Representation Error",
      "description": "Analyse rounding, truncation, overflow and underflow.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Distinguish rounding and truncation.",
        "Explain overflow and underflow.",
        "Assess representation error."
      ],
      "explanation": "Finite representations cannot encode every real value. Rounding chooses a nearby value, truncation discards detail and overflow exceeds range.",
      "workedExample": "Repeated rounding of financial values can accumulate error.",
      "practiceQuestions": [
        {
          "question": "What is truncation?",
          "answer": "Discarding digits or bits beyond a chosen precision"
        },
        {
          "question": "What causes overflow?",
          "answer": "A value exceeds the representable range"
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Can rounding errors accumulate?",
          "answer": "Yes"
        }
      ],
      "examQuestion": {
        "question": "Explain two causes of numeric error and one mitigation.",
        "marks": 5,
        "answer": "Finite precision causes rounding/truncation and limited range causes overflow; suitable data types or scaled-integer representations can reduce impact.",
        "markScheme": [
          "Finite precision.",
          "Rounding/truncation.",
          "Range/overflow.",
          "Valid mitigation.",
          "Explains mitigation."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Choose a numeric representation for money and justify it."
    }
  ]
};
