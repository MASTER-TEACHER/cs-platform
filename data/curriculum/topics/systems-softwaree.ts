import type { Topic } from "@/types/curriculum";

export const systemsSoftwareTopic: Topic = {
  id: "systems-software",
  title: "Systems Software",
  description:
    "Learn how operating systems and utility programs manage computer systems.",
  difficulty: "⭐⭐☆",
  estimatedTime: "70 mins",
  simulator: "operating-system",
  status: "published",
  unit: "Computer Systems",
  specificationReferences: ["AQA 3.5.4"],
  lessons: [
    {
      id: "operating-system-purpose",
      title: "Purpose of an Operating System",
      description:
        "Understand why general-purpose computers require operating-system software.",
      estimatedTime: "16 mins",
      xpReward: 70,
      objectives: [
        "Define an operating system.",
        "Explain how it manages hardware.",
        "Explain how it provides a platform for applications.",
      ],
      explanation:
        "An operating system is systems software that manages hardware resources and provides services for users and application software. It acts as an interface between applications, users and the computer hardware.",
      workedExample:
        "A word processor asks the operating system to save a file rather than controlling the storage hardware directly.",
      practiceQuestions: [
        {
          question: "What type of software is an operating system?",
          answer: "Systems software",
          acceptedAnswers: ["System software"],
        },
        {
          question:
            "What does an operating system provide for application software?",
          answer: "A platform and services to run",
          acceptedAnswers: [
            "An environment in which applications can run",
            "Access to managed hardware resources",
          ],
        },
      ],
      checkpointQuestions: [
        {
          question: "Name one operating system.",
          answer: "Windows",
          acceptedAnswers: ["Linux", "macOS", "Android", "iOS", "ChromeOS"],
        },
      ],
      examQuestion: {
        question:
          "Explain why a general-purpose computer requires an operating system.",
        marks: 3,
        answer:
          "The operating system manages hardware resources, provides a user interface and supplies services that allow applications to run.",
        markScheme: [
          "Manages hardware resources.",
          "Provides a user interface.",
          "Provides a platform or services for applications.",
        ],
        guidance: ["Award one mark per valid function."],
      },
      reflectionPrompt:
        "Explain what would be difficult for application developers if no operating system existed.",
    },
    {
      id: "process-memory-management",
      title: "Process and Memory Management",
      description: "Explore how the operating system supports multitasking.",
      estimatedTime: "18 mins",
      xpReward: 85,
      simulator: "operating-system",
      objectives: [
        "Explain memory allocation.",
        "Explain process scheduling.",
        "Explain how multitasking is supported.",
      ],
      explanation:
        "The operating system allocates memory to active processes and prevents them from overwriting one another. It schedules processor time between processes, switching rapidly so several applications appear to run at once.",
      workedExample:
        "While music plays and a browser downloads a file, the operating system repeatedly allocates CPU time to both processes.",
      practiceQuestions: [
        {
          question:
            "What two resources does the operating system allocate to active programs?",
          answer: "Memory and processor time",
          acceptedAnswers: ["RAM and CPU time"],
        },
        {
          question: "What is multitasking?",
          answer: "Running more than one process apparently at the same time",
          acceptedAnswers: [
            "The OS switches between several active processes",
            "Several programs appear to run at once",
          ],
        },
      ],
      checkpointQuestions: [
        {
          question: "Why must process memory be kept separate?",
          answer: "To stop processes overwriting each other's data",
          acceptedAnswers: ["To prevent memory conflicts"],
        },
      ],
      examQuestion: {
        question: "Explain how an operating system supports multitasking.",
        marks: 4,
        answer:
          "The operating system keeps several processes active, allocates memory to them and schedules CPU time. It switches rapidly between processes so they appear to run at once.",
        markScheme: [
          "Keeps multiple processes active.",
          "Allocates memory.",
          "Schedules processor time.",
          "Switches rapidly between processes.",
        ],
        guidance: ["Credit accurate use of scheduling terminology."],
      },
      reflectionPrompt:
        "Explain why too many active applications can reduce performance.",
    },
    {
      id: "files-devices-security",
      title: "Files, Devices and Security",
      description:
        "Understand device drivers, file management, interfaces and permissions.",
      estimatedTime: "19 mins",
      xpReward: 85,
      objectives: [
        "Explain the role of device drivers.",
        "Describe file management.",
        "Explain authentication and permissions.",
      ],
      explanation:
        "Device drivers allow the operating system to communicate with particular hardware. File management includes naming, saving, organising, locating and controlling access to files. User accounts, authentication and permissions help restrict unauthorised access.",
      workedExample:
        "A printer driver translates a general print request into commands understood by a particular printer model.",
      practiceQuestions: [
        {
          question: "What is the purpose of a device driver?",
          answer: "To allow the operating system to communicate with hardware",
          acceptedAnswers: [
            "It translates commands for a device",
            "It controls communication with a peripheral",
          ],
        },
        {
          question: "Why are account permissions used?",
          answer: "To control which resources and actions a user can access",
          acceptedAnswers: [
            "To prevent unauthorised access",
            "To restrict protected settings",
          ],
        },
      ],
      checkpointQuestions: [
        {
          question: "Give one file-management task.",
          answer: "Organising files into folders",
          acceptedAnswers: [
            "Naming files",
            "Saving files",
            "Deleting files",
            "Managing permissions",
          ],
        },
      ],
      examQuestion: {
        question:
          "Explain the role of device drivers and file management in an operating system.",
        marks: 4,
        answer:
          "Device drivers allow the operating system to communicate with specific hardware. File management allows files to be named, saved, organised, located and protected using permissions.",
        markScheme: [
          "Drivers support communication with hardware.",
          "Drivers are device-specific or translate commands.",
          "File management organises or locates files.",
          "File management controls names, storage or permissions.",
        ],
        guidance: ["Award developed points for both areas."],
      },
      reflectionPrompt:
        "Explain why device drivers are often updated after release.",
    },
    {
      id: "utility-software",
      title: "Utility Software",
      description:
        "Understand maintenance, backup, compression, encryption and security utilities.",
      estimatedTime: "17 mins",
      xpReward: 85,
      objectives: [
        "Define utility software.",
        "Describe common utility programs.",
        "Explain how utilities maintain and protect data.",
      ],
      explanation:
        "Utility software performs maintenance, protection or optimisation tasks. Examples include backup tools, encryption software, compression utilities, antivirus scanners and disk-cleaning tools.",
      workedExample:
        "A backup utility creates copies that can be restored after accidental deletion, hardware failure or malware damage.",
      practiceQuestions: [
        {
          question: "What is utility software?",
          answer:
            "Software that maintains, protects or manages a computer system",
          acceptedAnswers: [
            "Software that performs system maintenance",
            "Tools used to manage or optimise a system",
          ],
        },
        {
          question: "What is the purpose of backup software?",
          answer: "To create copies of data that can be restored",
          acceptedAnswers: ["To recover files after data loss"],
        },
      ],
      checkpointQuestions: [
        {
          question: "Which utility reduces file size?",
          answer: "Compression utility",
          acceptedAnswers: ["File compression software"],
        },
      ],
      examQuestion: {
        question: "Explain how two utility programs can help protect data.",
        marks: 4,
        answer:
          "Backup software creates copies that can be restored after loss. Encryption software makes data unreadable to unauthorised users without the key.",
        markScheme: [
          "Identifies a valid utility.",
          "Explains how the first utility protects data.",
          "Identifies a second valid utility.",
          "Explains how the second utility protects data.",
        ],
        guidance: ["Valid utilities include backup, encryption and antivirus."],
      },
      reflectionPrompt:
        "Design a weekly utility-software maintenance plan for a school laptop.",
    },
  ],
};
