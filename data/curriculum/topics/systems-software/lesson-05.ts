import type { Lesson } from "@/types/curriculum";

export const systemsSoftwareLesson05: Lesson = {
  id: "peripherals-drivers",
  title: "Peripheral Management and Device Drivers",
  description:
    "Understand how operating systems communicate with input, output and storage devices.",
  estimatedTime: "20 mins",
  xpReward: 95,
  simulator: "operating-system",

  objectives: [
    "Define a peripheral device.",
    "Explain the purpose of device drivers.",
    "Describe how the operating system manages peripherals.",
  ],

  explanation:
    "Peripheral devices are hardware devices connected to or used by a computer system, such as printers, keyboards, monitors and storage devices. A device driver is software that allows the operating system to communicate with a particular hardware device. Different devices may require different drivers because their commands and capabilities differ.",

  workedExample:
    "When a user prints a document, the application sends a print request to the operating system. The operating system uses the printer driver to convert this request into instructions understood by the specific printer.",

  practiceQuestions: [
    {
      question: "What is the purpose of a device driver?",
      answer: "It allows the operating system to communicate with hardware",
      acceptedAnswers: [
        "It allows software to control a device",
        "It translates between the operating system and hardware",
      ],
    },
    {
      question: "Give one example of a peripheral device.",
      answer: "Printer",
      acceptedAnswers: ["Keyboard", "Mouse", "Monitor", "Scanner"],
    },
  ],

  checkpointQuestions: [
    {
      question: "Why may two different printers require different drivers?",
      answer: "They may use different commands or hardware interfaces",
      acceptedAnswers: ["Different hardware requires different instructions"],
    },
  ],

  examQuestion: {
    question:
      "Explain why a computer may need a device driver when a new printer is connected.",
    marks: 4,
    answer:
      "The operating system needs to communicate with the printer. The driver provides software that translates or provides the correct commands for the particular printer hardware, allowing applications to use it.",
    markScheme: [
      "Operating system must communicate with the printer.",
      "Driver is specific to the hardware or device.",
      "Driver provides or translates device commands.",
      "Allows applications or the operating system to control the printer.",
    ],
    guidance: ["Credit equivalent explanations of hardware abstraction."],
  },

  reflectionPrompt:
    "Explain why operating systems often install device drivers automatically.",
};
