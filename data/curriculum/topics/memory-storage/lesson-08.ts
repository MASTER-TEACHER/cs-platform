import type { Lesson } from "@/types/curriculum";

export const memoryStorageLesson08: Lesson = {
  id: "storage-units-capacity",
  title: "Storage Units and Capacity",
  description:
    "Use bits, bytes and larger storage units to reason about file and device capacities.",
  estimatedTime: "22 mins",
  xpReward: 105,
  simulator: "storage-capacity",

  objectives: [
    "Distinguish a bit from a byte.",
    "Recall common storage units.",
    "Convert between storage units.",
    "Calculate approximate storage requirements.",
  ],

  explanation:
    "A bit is a single binary digit, either 0 or 1. A byte contains 8 bits. Larger units include kilobytes, megabytes, gigabytes and terabytes. GCSE questions may use decimal conversions such as 1 KB = 1000 bytes, or provide the conversion values required in the question. Always use the convention stated by the examination question.",

  workedExample:
    "If a photograph requires 5 MB, then 200 photographs require approximately 1000 MB, which is approximately 1 GB using decimal units.",

  practiceQuestions: [
    {
      question: "How many bits are in one byte?",
      answer: "8",
      acceptedAnswers: ["Eight"],
    },
    {
      question: "Which is larger: a gigabyte or a megabyte?",
      answer: "Gigabyte",
      acceptedAnswers: ["GB"],
    },
    {
      question:
        "Using 1000 MB = 1 GB, how much storage is required for 500 files of 2 MB each?",
      answer: "1 GB",
      acceptedAnswers: ["1000 MB"],
    },
  ],

  checkpointQuestions: [
    {
      question: "Put these units in increasing order: TB, KB, GB, MB.",
      answer: "KB, MB, GB, TB",
      acceptedAnswers: [
        "KB MB GB TB",
        "Kilobyte, megabyte, gigabyte, terabyte",
      ],
    },
  ],

  examQuestion: {
    question:
      "A video file has a size of 750 MB. A storage device has 6 GB free. Using 1 GB = 1000 MB, calculate the maximum number of complete video files that can be stored.",
    marks: 4,
    answer:
      "6 GB = 6000 MB. 6000 ÷ 750 = 8, so 8 complete files can be stored.",
    markScheme: [
      "Converts 6 GB to 6000 MB.",
      "Uses 6000 ÷ 750.",
      "Obtains 8.",
      "States 8 complete video files.",
    ],
    guidance: ["Credit a correct calculation using the conversion supplied."],
  },

  reflectionPrompt:
    "Explain why manufacturers and operating systems may sometimes display storage capacities differently.",
};
