import type { Topic } from "@/types/curriculum";

export const compressionTopic: Topic = {
  id: "compression",
  title: "Data Compression",
  description:
    "Compare lossy and lossless compression and apply run-length encoding.",
  difficulty: "⭐⭐☆",
  estimatedTime: "50 mins",
  status: "published",
  unit: "Data Representation",
  specificationReferences: ["AQA 3.3.7"],

  lessons: [
    {
      id: "why-compress",
      title: "Why Data Is Compressed",
      description: "Understand why reducing file size is useful.",
      estimatedTime: "14 mins",
      xpReward: 60,

      objectives: [
        "Define data compression.",
        "Explain the benefits of reducing file size.",
        "Identify situations where compression is useful.",
      ],

      explanation:
        "Data compression reduces the number of bits required to store a file. Smaller files use less storage space and can be transferred more quickly because less data must travel across a network.",

      workedExample:
        "A website may compress an image before uploading it. The smaller image requires less storage and takes less time to download.",

      practiceQuestions: [
        {
          question: "What is data compression?",
          answer: "Reducing the number of bits required for a file",
          acceptedAnswers: [
            "Reducing file size",
            "Reducing the amount of data needed to store a file",
          ],
          hint: "Think about what happens to the number of bits used to store the file.",
          feedback:
            "Compression reduces the amount of data required to represent a file.",
        },
        {
          question: "Give one network benefit of compression.",
          answer: "The file can be transferred more quickly",
          acceptedAnswers: [
            "It uses less bandwidth",
            "Faster transfer",
            "Faster download",
            "Less data needs to be transmitted",
          ],
          hint: "Think about how much data has to travel across the network.",
          feedback:
            "Smaller files require less data transfer, which can reduce transfer time and bandwidth use.",
        },
        {
          question: "Give one storage benefit of compression.",
          answer: "Compressed files require less storage space",
          acceptedAnswers: [
            "Uses less storage",
            "Takes up less disk space",
            "More files can be stored",
          ],
          hint: "Think about the space required on a storage device.",
          feedback:
            "Reducing file size means more files can fit on the same storage device.",
        },
      ],

      checkpointQuestions: [
        {
          question: "Does compression normally increase or decrease file size?",
          answer: "Decrease",
          acceptedAnswers: ["Decreases", "It decreases file size"],
        },
        {
          question: "Why can compressed files download faster?",
          answer: "Less data needs to be transferred",
          acceptedAnswers: [
            "They contain fewer bits",
            "Less data is transmitted",
            "They are smaller",
          ],
        },
      ],

      examQuestion: {
        question: "Explain two benefits of compressing files.",
        marks: 4,
        answer:
          "Compressed files require less storage space and can be transferred more quickly because fewer bits need to be transmitted.",
        markScheme: [
          "Identifies reduced storage requirement.",
          "Develops the storage benefit.",
          "Identifies faster transfer or reduced bandwidth requirement.",
          "Develops the network benefit.",
        ],
        guidance: [
          "Award one mark for each valid benefit and one additional mark for each developed explanation.",
        ],
      },

      reflectionPrompt:
        "Explain why websites commonly compress images and video before delivering them to users.",
    },

    {
      id: "lossy-lossless",
      title: "Lossy and Lossless Compression",
      description: "Compare compression methods that preserve or discard data.",
      estimatedTime: "18 mins",
      xpReward: 80,

      objectives: [
        "Define lossless compression.",
        "Define lossy compression.",
        "Compare lossy and lossless methods.",
        "Choose an appropriate compression method for a given situation.",
      ],

      explanation:
        "Lossless compression reduces file size without permanently removing information. The original data can be reconstructed exactly. Lossy compression permanently removes some data, which can produce a smaller file but may reduce quality.",

      workedExample:
        "Program files must normally use lossless compression because every instruction must be preserved. A photograph may use lossy compression because a small reduction in image quality may be acceptable.",

      practiceQuestions: [
        {
          question: "Which compression method preserves all original data?",
          answer: "Lossless compression",
          acceptedAnswers: ["Lossless"],
          hint: "Which method allows the original file to be reconstructed exactly?",
          feedback:
            "Lossless compression preserves all of the original information.",
        },
        {
          question:
            "Why is lossy compression unsuitable for executable program files?",
          answer: "Removing data could stop the program from working correctly",
          acceptedAnswers: [
            "The original cannot be reconstructed exactly",
            "Program instructions could be lost",
            "Data loss could corrupt the program",
          ],
          hint: "Think about whether a program can tolerate missing instructions.",
          feedback:
            "Executable files require exact reconstruction, so permanent data loss is unacceptable.",
        },
        {
          question:
            "Give one type of file for which lossy compression may be suitable.",
          answer: "Image",
          acceptedAnswers: ["Photograph", "Audio", "Music", "Video"],
          hint: "Think about media where a small loss of quality may be acceptable.",
          feedback:
            "Images, audio and video can often tolerate some quality loss in exchange for a smaller file.",
        },
      ],

      checkpointQuestions: [
        {
          question:
            "Which compression method usually produces the smaller file?",
          answer: "Lossy",
          acceptedAnswers: ["Lossy compression"],
        },
        {
          question: "Which compression method allows exact reconstruction?",
          answer: "Lossless",
          acceptedAnswers: ["Lossless compression"],
        },
      ],

      examQuestion: {
        question: "Compare lossy and lossless compression.",
        marks: 6,
        answer:
          "Both methods reduce file size. Lossless compression preserves all original data and allows the original file to be reconstructed exactly. Lossy compression permanently removes some data, may reduce quality and can often achieve a smaller file size.",
        markScheme: [
          "Both methods reduce file size.",
          "Lossless preserves all original data.",
          "Lossless allows exact reconstruction.",
          "Lossy permanently removes data.",
          "Lossy can produce a smaller file.",
          "Lossy may reduce quality.",
        ],
        guidance: [
          "Credit clearly linked comparisons between the two methods.",
        ],
      },

      reflectionPrompt:
        "Choose suitable compression methods for a photograph, source code file and medical image, and explain each choice.",
    },

    {
      id: "run-length-encoding",
      title: "Run-Length Encoding",
      description:
        "Apply run-length encoding as a simple lossless compression technique.",
      estimatedTime: "18 mins",
      xpReward: 90,

      // IMPORTANT:
      // Only this lesson receives the RLE simulator.
      simulator: "compression",

      objectives: [
        "Describe how run-length encoding works.",
        "Apply RLE to repeated sequences.",
        "Explain why RLE is lossless.",
        "Recognise situations where RLE is effective or ineffective.",
      ],

      explanation:
        "Run-length encoding, or RLE, replaces consecutive repeated values with a count followed by the repeated value. It is lossless because the original data can be reconstructed exactly. RLE works well when data contains long runs of repeated values, but it can increase file size when values change frequently.",

      workedExample:
        "AAAAABBCCC becomes 5A2B3C because there are five As, two Bs and three Cs.",

      practiceQuestions: [
        {
          question: "Compress AAAABBBCC using RLE.",
          answer: "4A3B2C",
          acceptedAnswers: ["4A 3B 2C"],
          hint: "Count each consecutive run, then write the count followed by the character.",
          feedback:
            "There are four As, three Bs and two Cs, so the RLE form is 4A3B2C.",
        },
        {
          question: "Compress XXXXXYYZZZ using RLE.",
          answer: "5X2Y3Z",
          acceptedAnswers: ["5X 2Y 3Z"],
          hint: "Count each group from left to right.",
          feedback: "The sequence contains five Xs, two Ys and three Zs.",
        },
        {
          question: "Why is RLE ineffective for ABCDEFG?",
          answer: "There are no repeated consecutive values",
          acceptedAnswers: [
            "There are no runs",
            "The values do not repeat consecutively",
            "Each character occurs only once in sequence",
          ],
          hint: "RLE is most useful when the same value appears several times in a row.",
          feedback:
            "Without repeated runs, RLE has to store a count for almost every value and can make the representation larger.",
        },
        {
          question: "Why is RLE described as lossless compression?",
          answer: "The original data can be reconstructed exactly",
          acceptedAnswers: [
            "No data is permanently removed",
            "All original information is preserved",
          ],
          hint: "Think about whether any original information is thrown away.",
          feedback:
            "RLE stores enough information to recreate the exact original sequence.",
        },
      ],

      checkpointQuestions: [
        {
          question: "Is RLE lossy or lossless?",
          answer: "Lossless",
        },
        {
          question: "What type of data is most suitable for RLE?",
          answer: "Data containing long runs of repeated values",
          acceptedAnswers: [
            "Repeated data",
            "Long sequences of the same value",
          ],
        },
      ],

      examQuestion: {
        question:
          "Compress RRRRRRGGGB using run-length encoding and explain one limitation of RLE.",
        marks: 4,
        answer:
          "6R3G1B. RLE is ineffective when data contains few repeated consecutive values because the encoded form may be as large as or larger than the original.",
        markScheme: [
          "Gives 6R.",
          "Gives 3G.",
          "Gives 1B.",
          "Explains that RLE is ineffective where there are few or no repeated consecutive values.",
        ],
        guidance: [
          "Accept equivalent notation if the run counts and values are unambiguous.",
        ],
      },

      audioTranscript:
        "Run-length encoding is a lossless compression method. Instead of storing every repeated value separately, it stores how many times a value occurs consecutively followed by that value. For example, five As can be represented as 5A. RLE is most effective when the data contains long runs of repeated values.",

      reflectionPrompt:
        "Explain why run-length encoding may work well for a simple icon but poorly for a detailed photograph.",
    },
  ],
};
