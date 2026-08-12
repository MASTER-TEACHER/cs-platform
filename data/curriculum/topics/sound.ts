import type { Topic } from "@/types/curriculum";

export const soundTopic: Topic = {
  id: "sound",
  title: "Digital Sound",
  description: "Learn how analogue sound is sampled and stored digitally.",
  difficulty: "⭐⭐☆",
  estimatedTime: "55 mins",
  simulator: "sound-sampling",
  status: "published",
  unit: "Data Representation",
  specificationReferences: ["AQA 3.3.6"],
  lessons: [
    {
      id: "sound-sampling",
      title: "Sampling Sound",
      description: "Convert analogue sound into digital data.",
      estimatedTime: "17 mins",
      xpReward: 70,
      objectives: [
        "Describe sampling.",
        "Define sample rate.",
        "Explain analogue-to-digital conversion.",
      ],
      explanation:
        "A microphone detects an analogue wave. Its amplitude is measured at regular intervals. Each measurement is a sample and is converted into binary.",
      workedExample: "44,100 Hz means 44,100 samples are taken each second.",
      practiceQuestions: [
        {
          question: "What is a sample?",
          answer: "A measurement of sound wave amplitude at a particular time",
          acceptedAnswers: ["A measurement of amplitude"],
        },
        {
          question: "What does 8000 Hz mean?",
          answer: "8000 samples are taken each second",
          acceptedAnswers: ["The wave is measured 8000 times per second"],
        },
      ],
      checkpointQuestions: [
        {
          question:
            "What device converts analogue measurements into digital data?",
          answer: "Analogue-to-digital converter",
          acceptedAnswers: ["ADC"],
        },
      ],
      examQuestion: {
        question: "Describe how analogue sound is converted into digital data.",
        marks: 4,
        answer:
          "A microphone detects the wave. Its amplitude is measured at regular intervals. Each sample is converted to binary and stored.",
        markScheme: [
          "Microphone detects sound.",
          "Amplitude is measured.",
          "Measurements occur regularly.",
          "Samples are converted to binary and stored.",
        ],
      },
      reflectionPrompt:
        "Explain why digital sound is an approximation of the original.",
    },
    {
      id: "sample-rate-bit-depth",
      title: "Sample Rate and Bit Depth",
      description: "Explore how recording settings affect quality and size.",
      estimatedTime: "18 mins",
      xpReward: 80,
      objectives: [
        "Explain sample rate.",
        "Explain bit depth.",
        "Relate both to quality and size.",
      ],
      explanation:
        "Higher sample rate means more measurements per second. Greater bit depth means more possible amplitude levels. Both can improve quality but increase file size.",
      workedExample: "16-bit samples provide 65,536 amplitude levels.",
      practiceQuestions: [
        {
          question:
            "What normally happens to quality when sample rate increases?",
          answer: "It improves",
          acceptedAnswers: ["The waveform is represented more accurately"],
        },
        {
          question: "How many levels can 8-bit samples represent?",
          answer: "256",
          acceptedAnswers: ["2^8"],
        },
      ],
      checkpointQuestions: [
        {
          question:
            "What normally happens to file size when bit depth increases?",
          answer: "It increases",
        },
      ],
      examQuestion: {
        question:
          "Explain how increasing sample rate and bit depth affects digital sound.",
        marks: 6,
        answer:
          "More samples are taken each second and more amplitude levels are available, improving accuracy and quality, but increasing file size.",
        markScheme: [
          "More samples per second.",
          "Waveform represented more accurately.",
          "More bits per sample.",
          "More amplitude levels.",
          "Quality may improve.",
          "File size increases.",
        ],
      },
      reflectionPrompt:
        "Explain why maximum recording settings are not always appropriate.",
    },
    {
      id: "sound-file-size",
      title: "Sound File Size",
      description: "Calculate uncompressed sound file sizes.",
      estimatedTime: "20 mins",
      xpReward: 100,
      objectives: [
        "Use sample rate × bit depth × duration.",
        "Convert bits to bytes.",
        "Include channels where needed.",
      ],
      explanation:
        "Mono sound size in bits is sample rate × bit depth × duration. Multiply by channels for stereo and divide by 8 for bytes.",
      workedExample: "8000 × 8 × 10 = 640,000 bits = 80,000 bytes.",
      practiceQuestions: [
        {
          question: "Calculate 5 seconds at 4000 Hz and 8 bits in bits.",
          answer: "160000 bits",
          acceptedAnswers: ["160,000 bits"],
        },
        {
          question: "Convert 160,000 bits to bytes.",
          answer: "20000 bytes",
          acceptedAnswers: ["20,000 bytes"],
        },
      ],
      checkpointQuestions: [
        {
          question: "State the mono sound-size formula in bits.",
          answer: "Sample rate × sample resolution × duration",
          acceptedAnswers: ["Sample rate times bit depth times duration"],
        },
      ],
      examQuestion: {
        question:
          "A 30-second mono recording uses 44,100 Hz and 16 bits. Calculate its size in bytes.",
        marks: 4,
        answer: "44,100 × 16 × 30 = 21,168,000 bits. ÷ 8 = 2,646,000 bytes.",
        markScheme: [
          "Multiplies 44,100 by 16.",
          "Multiplies by 30.",
          "Gets 21,168,000 bits.",
          "Divides by 8 to get 2,646,000 bytes.",
        ],
      },
      reflectionPrompt: "Explain how stereo affects file size.",
    },
  ],
};
