import type { Topic } from "@/types/curriculum";

export const memoryStorageTopic: Topic = {
  id: "memory-storage",
  title: "Memory and Storage",
  description:
    "Explore RAM, ROM, cache, virtual memory, secondary storage and storage capacity.",
  difficulty: "⭐⭐☆",
  estimatedTime: "95 mins",
  simulator: "memory",
  status: "published",
  unit: "Computer Systems",
  specificationReferences: ["AQA 3.5.2", "AQA 3.5.3"],
  lessons: [
    {
      id: "ram-rom",
      title: "RAM and ROM",
      description: "Compare volatile RAM with non-volatile ROM.",
      estimatedTime: "18 mins",
      xpReward: 80,
      simulator: "memory",
      objectives: [
        "Describe the purpose of RAM.",
        "Describe the purpose of ROM.",
        "Compare volatile and non-volatile memory.",
      ],
      explanation:
        "RAM is volatile primary storage used for active programs and data. Its contents are lost when power is removed. ROM is non-volatile and stores instructions that must remain available, such as firmware and boot instructions.",
      workedExample:
        "An unsaved document may be lost after a power failure because it was held in RAM, while firmware remains available in ROM.",
      practiceQuestions: [
        {
          question: "Which type of memory loses its contents without power?",
          answer: "RAM",
          acceptedAnswers: ["Random access memory"],
        },
        {
          question: "Which memory commonly stores boot instructions?",
          answer: "ROM",
          acceptedAnswers: ["Read-only memory"],
        },
      ],
      checkpointQuestions: [
        {
          question: "Is ROM volatile or non-volatile?",
          answer: "Non-volatile",
          acceptedAnswers: ["Non volatile"],
        },
      ],
      examQuestion: {
        question: "Compare RAM and ROM.",
        marks: 6,
        answer:
          "Both are primary storage. RAM is volatile, changeable and stores programs and data currently in use. ROM is non-volatile and stores fixed instructions such as firmware.",
        markScheme: [
          "Both are forms of primary storage.",
          "RAM is volatile.",
          "RAM stores active programs or data.",
          "RAM contents can change.",
          "ROM is non-volatile.",
          "ROM stores fixed instructions or firmware.",
        ],
        guidance: ["Credit clear comparative statements."],
      },
      reflectionPrompt: "Explain why a computer needs both RAM and ROM.",
    },
    {
      id: "cache-virtual-memory",
      title: "Cache and Virtual Memory",
      description: "Understand fast cache and slower virtual memory.",
      estimatedTime: "20 mins",
      xpReward: 90,
      simulator: "memory",
      objectives: [
        "Explain how cache improves performance.",
        "Explain when virtual memory is used.",
        "Explain why excessive virtual-memory use is slow.",
      ],
      explanation:
        "Cache is very fast memory in or near the CPU that stores frequently used instructions and data. Virtual memory uses part of secondary storage when RAM is insufficient. Because secondary storage is slower than RAM, heavy virtual-memory use reduces performance.",
      workedExample:
        "A repeated loop instruction may be held in cache, while an inactive application may be moved from RAM to virtual memory.",
      practiceQuestions: [
        {
          question: "Why can cache improve processor performance?",
          answer: "Frequently used data can be accessed more quickly",
          acceptedAnswers: [
            "It reduces access to slower RAM",
            "The CPU waits less time for data",
          ],
        },
        {
          question: "When is virtual memory used?",
          answer: "When RAM is full or insufficient",
          acceptedAnswers: ["When there is not enough RAM"],
        },
      ],
      checkpointQuestions: [
        {
          question: "Why is virtual memory slower than RAM?",
          answer: "It uses slower secondary storage",
          acceptedAnswers: ["It is stored on an HDD or SSD"],
        },
      ],
      examQuestion: {
        question:
          "Explain how cache and virtual memory affect computer performance.",
        marks: 4,
        answer:
          "Cache stores frequently used data close to the CPU and is faster than RAM, improving access time. Virtual memory uses slower secondary storage when RAM is full, so frequent swapping can reduce performance.",
        markScheme: [
          "Cache stores frequently used data or instructions.",
          "Cache is fast or close to the CPU.",
          "Virtual memory uses secondary storage when RAM is insufficient.",
          "Secondary storage is slower, reducing performance.",
        ],
        guidance: ["Credit developed links to performance."],
      },
      reflectionPrompt:
        "Explain why installing more RAM can reduce virtual-memory use.",
    },
    {
      id: "secondary-storage",
      title: "Secondary Storage",
      description: "Compare magnetic, optical and solid-state storage.",
      estimatedTime: "22 mins",
      xpReward: 95,
      simulator: "storage-comparison",
      objectives: [
        "Explain why secondary storage is required.",
        "Compare HDD, SSD, optical media and magnetic tape.",
        "Select suitable storage for a scenario.",
      ],
      explanation:
        "Secondary storage is non-volatile and stores programs and files long term. HDDs often provide high capacity at low cost. SSDs are fast and durable because they have no moving parts. Optical media uses lasers, while magnetic tape is commonly used for large sequential backups.",
      workedExample:
        "An SSD suits a portable laptop because it is fast and resistant to movement, while magnetic tape may suit a large backup archive.",
      practiceQuestions: [
        {
          question: "Give one example of magnetic secondary storage.",
          answer: "Hard disk drive",
          acceptedAnswers: ["HDD", "Magnetic tape"],
        },
        {
          question: "Why are SSDs resistant to physical shock?",
          answer: "They have no moving parts",
          acceptedAnswers: ["They use solid-state memory"],
        },
      ],
      checkpointQuestions: [
        {
          question: "Which storage type uses a laser?",
          answer: "Optical",
          acceptedAnswers: ["Optical storage"],
        },
      ],
      examQuestion: {
        question:
          "Recommend an HDD or SSD for a student laptop and justify your choice.",
        marks: 4,
        answer:
          "An SSD is suitable because it is fast, light and resistant to physical shock. It has no moving parts, although it may cost more per gigabyte.",
        markScheme: [
          "Makes a clear recommendation.",
          "Provides one relevant characteristic.",
          "Explains why it suits the scenario.",
          "Provides another developed comparison.",
        ],
        guidance: ["Accept either device with convincing justification."],
      },
      reflectionPrompt:
        "Choose suitable storage for a laptop, an archive and a camera.",
    },
    {
      id: "capacity-cloud",
      title: "Storage Capacity and Cloud Storage",
      description: "Convert storage units and evaluate cloud storage.",
      estimatedTime: "20 mins",
      xpReward: 100,
      simulator: "storage-capacity",
      objectives: [
        "Convert between bits, bytes, KB, MB, GB and TB.",
        "Define cloud storage.",
        "Evaluate benefits and risks of cloud storage.",
      ],
      explanation:
        "Eight bits make one byte. Decimal questions often use 1 KB = 1000 bytes, 1 MB = 1000 KB and so on. Cloud storage keeps files on remote servers accessed through a network, supporting remote access and backup but introducing dependency, privacy and security concerns.",
      workedExample:
        "Using decimal units, 5 GB equals 5000 MB. A cloud-stored document can be accessed on several devices.",
      practiceQuestions: [
        {
          question: "How many bits are in one byte?",
          answer: "8",
          acceptedAnswers: ["Eight", "8 bits"],
        },
        {
          question: "Using decimal units, convert 3 GB into MB.",
          answer: "3000 MB",
          acceptedAnswers: ["3000", "3,000 MB"],
        },
      ],
      checkpointQuestions: [
        {
          question: "Give one benefit of cloud storage.",
          answer: "Files can be accessed from different devices",
          acceptedAnswers: [
            "It supports collaboration",
            "It provides off-site backup",
          ],
        },
      ],
      examQuestion: {
        question: "Evaluate the use of cloud storage by a small business.",
        marks: 6,
        answer:
          "Cloud storage supports remote access, collaboration, backup and scalable capacity. However, the business depends on internet and provider availability, may pay ongoing costs and must protect sensitive data.",
        markScheme: [
          "Explains remote access or collaboration.",
          "Explains backup or scalability.",
          "Identifies dependency on internet or provider.",
          "Identifies security or privacy concerns.",
          "Identifies ongoing cost.",
          "Provides a supported judgement.",
        ],
        guidance: ["Credit balanced evaluation."],
      },
      reflectionPrompt:
        "Explain when local storage may be preferable to cloud storage.",
    },
  ],
};
