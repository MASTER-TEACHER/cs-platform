import type { Topic } from "@/types/curriculum";

export const legalEthicalALevelTopic: Topic = {
  "id": "legal-ethical-a-level",
  "title": "Legal, Moral, Cultural and Ethical Issues",
  "description": "Evaluate responsibilities and consequences of computing beyond GCSE depth.",
  "difficulty": "⭐⭐⭐",
  "estimatedTime": "50 mins",
  "status": "published",
  "unit": "A-level Issues and Impact",
  "specificationReferences": [
    "AQA 4.8",
    "OCR H446 1.5"
  ],
  "lessons": [
    {
      "id": "al-law",
      "title": "Computer Law and Professional Responsibility",
      "description": "Apply legal principles to computing scenarios.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Explain data-protection responsibilities.",
        "Apply computer-misuse/copyright principles.",
        "Relate law to practice."
      ],
      "explanation": "Computing professionals must handle personal data lawfully, respect access controls and intellectual property, and understand that technical ability is not legal permission.",
      "workedExample": "Testing a system without authorisation may breach computer-misuse law even with good intentions.",
      "practiceQuestions": [
        {
          "question": "Does technical access imply legal permission?",
          "answer": "No"
        },
        {
          "question": "What protects original software and creative work?",
          "answer": "Copyright"
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Give one principle for personal data.",
          "answer": "Use it lawfully and for an appropriate purpose",
          "acceptedAnswers": [
            "Data minimisation",
            "Security",
            "Accuracy"
          ]
        }
      ],
      "examQuestion": {
        "question": "Explain how law affects a developer handling personal information.",
        "marks": 5,
        "answer": "The developer must process data lawfully, limit collection/use, protect security, respect rights and avoid unauthorised disclosure.",
        "markScheme": [
          "Lawful processing.",
          "Purpose/minimisation.",
          "Security.",
          "Rights/accuracy.",
          "Applies responsibility."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Identify two legal checks before deploying a data feature."
    },
    {
      "id": "al-ethics",
      "title": "Ethical Decision-Making",
      "description": "Evaluate stakeholder impacts where legal compliance is not enough.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Distinguish legal and ethical questions.",
        "Identify stakeholders.",
        "Construct balanced ethical arguments."
      ],
      "explanation": "An action can be legal yet ethically questionable. Ethical evaluation considers harms, benefits, fairness, autonomy, transparency and power.",
      "workedExample": "A recommendation system may be lawful but still manipulate attention or amplify harmful content.",
      "practiceQuestions": [
        {
          "question": "Can a legal action still be unethical?",
          "answer": "Yes"
        },
        {
          "question": "Who is a stakeholder?",
          "answer": "A person or group affected by a system or decision"
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Name one ethical issue in automated decisions.",
          "answer": "Fairness",
          "acceptedAnswers": [
            "Transparency",
            "Privacy",
            "Autonomy",
            "Accountability"
          ]
        }
      ],
      "examQuestion": {
        "question": "Evaluate whether a school should use automated behaviour-risk predictions.",
        "marks": 6,
        "answer": "Consider safeguarding benefits, privacy, bias, false positives, transparency, student rights and human oversight.",
        "markScheme": [
          "Benefit.",
          "Developed benefit.",
          "Risk 1.",
          "Risk 2.",
          "Mitigation/oversight.",
          "Supported judgement."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Choose a technology and identify stakeholders with conflicting interests."
    }
  ]
};
