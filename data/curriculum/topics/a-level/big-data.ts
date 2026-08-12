import type { Topic } from "@/types/curriculum";

export const bigDataTopic: Topic = {
  "id": "big-data",
  "title": "Big Data",
  "description": "Understand scale, distributed processing, privacy and bias in very large datasets.",
  "difficulty": "⭐⭐⭐",
  "estimatedTime": "50 mins",
  "status": "published",
  "unit": "A-level Data and Society",
  "specificationReferences": [
    "AQA 4.11"
  ],
  "lessons": [
    {
      "id": "al-big-data-characteristics",
      "title": "Characteristics of Big Data",
      "description": "Explain volume, velocity and variety.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Describe volume, velocity and variety.",
        "Give examples.",
        "Explain why traditional processing may struggle."
      ],
      "explanation": "Big data involves datasets whose amount, arrival rate or diversity makes conventional processing difficult.",
      "workedExample": "A social platform can process billions of events arriving continuously in structured and unstructured formats.",
      "practiceQuestions": [
        {
          "question": "What does volume describe?",
          "answer": "The amount of data"
        },
        {
          "question": "What does velocity describe?",
          "answer": "The rate at which data is generated or processed"
        }
      ],
      "checkpointQuestions": [
        {
          "question": "What does variety describe?",
          "answer": "Different forms and structures of data"
        }
      ],
      "examQuestion": {
        "question": "Explain why a nationwide sensor network may be a big-data problem.",
        "marks": 5,
        "answer": "It generates large volumes continuously from many sources and may need scalable/distributed processing.",
        "markScheme": [
          "Large volume.",
          "High velocity.",
          "Varied sources.",
          "Processing challenge.",
          "Scalable response."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Identify a big-data application and its main challenge."
    },
    {
      "id": "al-big-data-ethics",
      "title": "Big Data, Privacy and Bias",
      "description": "Evaluate consequences of large-scale data analysis.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Explain profiling.",
        "Identify privacy and bias risks.",
        "Evaluate safeguards."
      ],
      "explanation": "Large datasets can reveal useful patterns but also enable intrusive profiling, re-identification and biased decisions.",
      "workedExample": "A hiring model trained on historical decisions can reproduce past unequal patterns.",
      "practiceQuestions": [
        {
          "question": "What is data minimisation?",
          "answer": "Collecting only data necessary for the purpose"
        },
        {
          "question": "Can removing a sensitive field guarantee fairness?",
          "answer": "No"
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Why can historical data cause bias?",
          "answer": "It can contain past unequal patterns or decisions"
        }
      ],
      "examQuestion": {
        "question": "Evaluate one benefit and two risks of big-data decision systems.",
        "marks": 6,
        "answer": "Benefits include pattern detection; risks include privacy, bias, opacity and security exposure, requiring controls and oversight.",
        "markScheme": [
          "Benefit.",
          "Developed benefit.",
          "Risk 1.",
          "Risk 2.",
          "Mitigation.",
          "Supported judgement."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Propose safeguards for a high-stakes data system."
    }
  ]
};
