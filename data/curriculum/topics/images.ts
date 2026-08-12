import type { Topic } from "@/types/curriculum";

export const imagesTopic: Topic = {
  id: "images",
  title: "Digital Images",
  description: "Explore pixels, resolution, colour depth and image file sizes.",
  difficulty: "⭐⭐☆",
  estimatedTime: "55 mins",
  simulator: "image-representation",
  status: "published",
  unit: "Data Representation",
  specificationReferences: ["AQA 3.3.5"],
  lessons: [
    {
      id: "pixels-resolution",
      title: "Pixels and Resolution",
      description: "Understand how bitmap images are formed.",
      estimatedTime: "16 mins",
      xpReward: 70,
      objectives: [
        "Define a pixel.",
        "Explain resolution.",
        "Relate resolution to quality and size.",
      ],
      explanation:
        "A bitmap is a grid of pixels. Resolution is the number of pixels, usually width by height. Higher resolution can show more detail but normally increases file size.",
      workedExample: "800 × 600 gives 480,000 pixels.",
      practiceQuestions: [
        {
          question: "What is a pixel?",
          answer: "The smallest element of a digital image",
          acceptedAnswers: ["A picture element", "A coloured dot in an image"],
        },
        {
          question: "How many pixels are in a 640 × 480 image?",
          answer: "307200",
          acceptedAnswers: ["307,200 pixels"],
        },
      ],
      checkpointQuestions: [
        {
          question:
            "What normally happens to file size when resolution increases?",
          answer: "It increases",
          acceptedAnswers: ["The file becomes larger"],
        },
      ],
      examQuestion: {
        question:
          "Explain how increasing resolution affects image quality and file size.",
        marks: 4,
        answer:
          "More pixels can represent more detail and improve quality, but more pixel data must be stored, increasing file size.",
        markScheme: [
          "More pixels are used.",
          "More detail can be represented.",
          "Quality may improve.",
          "File size increases.",
        ],
      },
      reflectionPrompt:
        "Explain why higher resolution is not always necessary.",
    },
    {
      id: "colour-depth",
      title: "Colour Depth",
      description: "Understand bits per pixel and available colours.",
      estimatedTime: "17 mins",
      xpReward: 75,
      objectives: [
        "Define colour depth.",
        "Calculate available colours.",
        "Relate colour depth to quality and size.",
      ],
      explanation:
        "Colour depth is the number of bits used per pixel. With n bits, 2^n colours can be represented. Greater colour depth can improve realism but increases file size.",
      workedExample: "8-bit colour gives 2^8 = 256 colours.",
      practiceQuestions: [
        {
          question: "How many colours can 4-bit colour represent?",
          answer: "16",
          acceptedAnswers: ["2^4"],
        },
        {
          question:
            "What normally happens to file size when colour depth increases?",
          answer: "It increases",
        },
      ],
      checkpointQuestions: [
        {
          question: "What is colour depth?",
          answer: "The number of bits used per pixel",
          acceptedAnswers: ["Bits per pixel"],
        },
      ],
      examQuestion: {
        question:
          "Explain one benefit and one drawback of greater colour depth.",
        marks: 4,
        answer:
          "It can represent more colours and improve realism, but more bits are stored per pixel, increasing file size.",
        markScheme: [
          "More colours.",
          "Quality or realism may improve.",
          "More bits per pixel.",
          "File size increases.",
        ],
      },
      reflectionPrompt:
        "Explain why a simple icon may not need high colour depth.",
    },
    {
      id: "image-file-size",
      title: "Image File Size",
      description: "Calculate uncompressed bitmap file sizes.",
      estimatedTime: "22 mins",
      xpReward: 100,
      objectives: [
        "Use width × height × colour depth.",
        "Convert bits to bytes.",
        "Show working.",
      ],
      explanation:
        "Image size in bits is width × height × colour depth. Divide by 8 to convert bits to bytes.",
      workedExample: "100 × 50 × 8 = 40,000 bits = 5,000 bytes.",
      practiceQuestions: [
        {
          question: "Calculate 200 × 100 pixels at 4-bit colour in bits.",
          answer: "80000 bits",
          acceptedAnswers: ["80,000 bits"],
        },
        {
          question: "Convert 80,000 bits to bytes.",
          answer: "10000 bytes",
          acceptedAnswers: ["10,000 bytes"],
        },
      ],
      checkpointQuestions: [
        {
          question: "State the bitmap file-size formula in bits.",
          answer: "Width × height × colour depth",
          acceptedAnswers: ["Pixels multiplied by colour depth"],
        },
      ],
      examQuestion: {
        question:
          "A 1024 × 768 image uses 24-bit colour. Calculate its uncompressed size in bytes.",
        marks: 4,
        answer: "1024 × 768 × 24 = 18,874,368 bits. ÷ 8 = 2,359,296 bytes.",
        markScheme: [
          "Multiplies width by height.",
          "Multiplies by 24.",
          "Gets 18,874,368 bits.",
          "Divides by 8 to get 2,359,296 bytes.",
        ],
      },
      reflectionPrompt: "Explain how doubling one dimension affects file size.",
    },
  ],
};
