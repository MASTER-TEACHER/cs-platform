import type { Topic } from "@/types/curriculum";

export const cpuTopic: Topic = {
  id: "cpu",
  title: "CPU Architecture",
  description:
    "Explore processor components, registers, the fetch–decode–execute cycle, performance and embedded systems.",
  difficulty:
  "\u2B50\u2B50\u2606",
  estimatedTime: "75 mins",
  simulator: "cpu",

  lessons: [
    {
      id: "cpu-fundamentals",
      title: "CPU Fundamentals",
      description:
        "Understand the purpose of the CPU and its role in a computer system.",
      estimatedTime: "12 mins",
      xpReward: 50,

      objectives: [
        "Describe the purpose of the CPU.",
        "Explain the role of the control unit and ALU.",
        "Identify the main activities performed by a processor.",
      ],

      explanation:
        "The central processing unit is the part of a computer that processes instructions. It performs calculations, makes logical decisions and coordinates other hardware components. The control unit manages the execution of instructions, while the arithmetic logic unit performs arithmetic and logical operations.",

      workedExample:
        "When a program calculates a total, the control unit coordinates the instruction and the ALU performs the addition.",

      practiceQuestions: [
        {
          question: "What does CPU stand for?",
          answer: "Central processing unit",
          acceptedAnswers: ["The central processing unit"],
          feedback: "CPU stands for central processing unit.",
        },
        {
          question:
            "Which CPU component performs arithmetic and logical operations?",
          answer: "ALU",
          acceptedAnswers: [
            "Arithmetic logic unit",
            "The arithmetic logic unit",
          ],
          feedback:
            "The arithmetic logic unit performs calculations and logical comparisons.",
        },
      ],

      checkpointQuestions: [
        {
          question:
            "Which CPU component coordinates the execution of instructions?",
          answer: "Control unit",
          acceptedAnswers: ["The control unit", "CU"],
        },
      ],

      examQuestion: {
        question: "Explain the role of the CPU in a computer system.",
        marks: 2,
        answer:
          "The CPU executes program instructions and processes data. It also coordinates the operation of other computer components.",
        markScheme: [
          "Executes program instructions or processes data.",
          "Coordinates or controls other computer components.",
        ],
        guidance: ["Award one mark for each distinct valid role."],
      },

      reflectionPrompt:
        "Explain the difference between the role of the control unit and the ALU.",
    },

    {
      id: "cpu-registers",
      title: "CPU Components and Registers",
      description:
        "Learn how processor registers store instructions, addresses and working values.",
      estimatedTime: "15 mins",
      xpReward: 75,

      objectives: [
        "Describe the purpose of CPU registers.",
        "Explain the roles of the PC, MAR, MDR, CIR and ACC.",
        "Relate registers to instruction processing.",
      ],

      explanation:
        "Registers are small, fast storage locations inside the CPU. The program counter stores the address of the next instruction. The MAR stores a memory address. The MDR stores data or instructions transferred to or from memory. The CIR stores the current instruction. The accumulator stores intermediate arithmetic and logic results.",

      workedExample:
        "If the PC contains address 12, the value 12 is copied to the MAR before the instruction at address 12 is fetched from memory.",

      practiceQuestions: [
        {
          question:
            "Which register stores the address of the next instruction?",
          answer: "PC",
          acceptedAnswers: ["Program counter", "The program counter"],
        },
        {
          question: "Which register stores the current instruction?",
          answer: "CIR",
          acceptedAnswers: [
            "Current instruction register",
            "The current instruction register",
          ],
        },
      ],

      checkpointQuestions: [
        {
          question: "Which register stores data transferred to or from memory?",
          answer: "MDR",
          acceptedAnswers: ["Memory data register", "The memory data register"],
        },
      ],

      examQuestion: {
        question:
          "Explain the roles of the program counter and memory address register during instruction processing.",
        marks: 4,
        answer:
          "The program counter stores the address of the next instruction. That address is copied into the memory address register, which stores the address currently being accessed in memory.",
        markScheme: [
          "The program counter stores the address of the next instruction.",
          "The address is copied from the PC to the MAR.",
          "The MAR stores the address currently being accessed.",
          "The address is used to fetch the instruction from memory.",
        ],
        guidance: [
          "Award marks for accurate register roles and movement of the address.",
        ],
      },

      reflectionPrompt:
        "Describe how the PC, MAR, MDR and CIR work together to fetch an instruction.",
    },

    {
      id: "fetch-decode-execute",
      title: "Fetch–Decode–Execute Cycle",
      description:
        "Follow each stage used by the CPU to process program instructions.",
      estimatedTime: "18 mins",
      xpReward: 100,
      simulator: "cpu",

      objectives: [
        "Describe the fetch stage.",
        "Describe the decode stage.",
        "Describe the execute stage.",
        "Explain how CPU registers are used during the cycle.",
      ],

      explanation:
        "During the fetch stage, the address in the PC is copied to the MAR. The instruction at that address is fetched into the MDR and copied to the CIR. The PC is incremented. During decode, the control unit interprets the instruction. During execute, the processor carries out the instruction.",

      workedExample:
        "If the PC stores 4, the value 4 is copied to the MAR. The instruction at memory address 4 is transferred to the MDR and then the CIR. The PC is increased before the instruction is decoded and executed.",

      practiceQuestions: [
        {
          question: "Which register is incremented during the fetch stage?",
          answer: "PC",
          acceptedAnswers: ["Program counter", "The program counter"],
        },
        {
          question: "Which CPU component decodes the current instruction?",
          answer: "Control unit",
          acceptedAnswers: ["The control unit", "CU"],
        },
      ],

      checkpointQuestions: [
        {
          question: "Put these in order: execute, fetch, decode.",
          answer: "Fetch, decode, execute",
          acceptedAnswers: [
            "Fetch decode execute",
            "Fetch -> decode -> execute",
            "Fetch then decode then execute",
          ],
        },
      ],

      examQuestion: {
        question: "Describe the fetch–decode–execute cycle.",
        marks: 6,
        answer:
          "The address of the next instruction is copied from the PC to the MAR. The instruction is fetched from memory into the MDR and copied to the CIR. The PC is incremented. The control unit decodes the instruction and the CPU executes it.",
        markScheme: [
          "The PC stores the address of the next instruction.",
          "The address is copied from the PC to the MAR.",
          "The instruction is fetched from memory into the MDR.",
          "The instruction is copied to the CIR.",
          "The control unit decodes the instruction.",
          "The instruction is executed.",
        ],
        guidance: [
          "Credit accurate register movement and correct sequencing.",
          "A complete answer should cover fetch, decode and execute.",
        ],
      },

      reflectionPrompt:
        "Explain why the PC must be incremented during the instruction cycle.",
    },

    {
      id: "cpu-performance",
      title: "CPU Performance",
      description:
        "Explore clock speed, cache size and the number of processor cores.",
      estimatedTime: "15 mins",
      xpReward: 75,

      objectives: [
        "Explain how clock speed affects performance.",
        "Explain how cache size affects performance.",
        "Explain how processor cores affect performance.",
        "Recognise limitations of comparing CPUs using one factor.",
      ],

      explanation:
        "Clock speed measures the number of cycles a processor performs each second. Cache is fast memory located close to the CPU and stores frequently used instructions and data. Multiple processor cores can process more than one instruction stream, but software must support parallel processing for the full benefit to be achieved.",

      workedExample:
        "A larger cache may reduce the time spent retrieving frequently used instructions from slower main memory.",

      practiceQuestions: [
        {
          question: "What does CPU clock speed measure?",
          answer: "The number of processing cycles performed per second",
          acceptedAnswers: [
            "Cycles per second",
            "The number of cycles per second",
          ],
        },
        {
          question: "Why can a larger cache improve processor performance?",
          answer:
            "Frequently used data and instructions can be accessed more quickly",
          acceptedAnswers: [
            "It stores frequently used instructions close to the CPU",
            "It reduces access to slower main memory",
          ],
        },
      ],

      checkpointQuestions: [
        {
          question:
            "Does doubling the number of processor cores always double performance?",
          answer: "No",
          acceptedAnswers: ["No, it depends on the software", "Not always"],
        },
      ],

      examQuestion: {
        question: "Explain two factors that can affect CPU performance.",
        marks: 4,
        answer:
          "A higher clock speed allows the CPU to complete more cycles per second. A larger cache allows frequently used instructions and data to be accessed more quickly than from main memory.",
        markScheme: [
          "Identifies a valid performance factor.",
          "Explains how the first factor affects performance.",
          "Identifies a second valid performance factor.",
          "Explains how the second factor affects performance.",
        ],
        guidance: [
          "Valid factors include clock speed, cache size and number of cores.",
        ],
      },

      reflectionPrompt:
        "Explain why the CPU with the highest clock speed is not always the fastest.",
    },

    {
      id: "embedded-systems",
      title: "Embedded Systems",
      description:
        "Understand computers designed to perform dedicated functions.",
      estimatedTime: "15 mins",
      xpReward: 75,

      objectives: [
        "Define an embedded system.",
        "Identify examples of embedded systems.",
        "Explain why embedded systems use specialised hardware and software.",
      ],

      explanation:
        "An embedded system is a computer built into a larger device to perform a specific function. Examples include washing machines, traffic lights, cars and medical devices. Embedded systems are often designed to be reliable, efficient and inexpensive because they perform a limited set of tasks.",

      workedExample:
        "A washing machine contains an embedded processor that controls the selected programme, water temperature, drum movement and timing.",

      practiceQuestions: [
        {
          question: "What is an embedded system?",
          answer:
            "A computer built into another device to perform a specific function",
          acceptedAnswers: [
            "A computer designed for a dedicated task",
            "A computer inside a larger device",
          ],
        },
        {
          question: "Give one example of an embedded system.",
          answer: "Washing machine",
          acceptedAnswers: [
            "Traffic lights",
            "Car engine management system",
            "Microwave",
            "Smart thermostat",
            "Medical device",
          ],
        },
      ],

      checkpointQuestions: [
        {
          question:
            "Why are embedded systems often designed for a limited number of tasks?",
          answer: "They are designed to perform a specific function",
          acceptedAnswers: [
            "They perform dedicated tasks",
            "They have a specific purpose",
          ],
        },
      ],

      examQuestion: {
        question: "Explain why a washing machine uses an embedded system.",
        marks: 3,
        answer:
          "The embedded system is built into the washing machine and performs a dedicated function. It controls operations such as the programme, temperature and drum movement.",
        markScheme: [
          "It is built into the washing machine.",
          "It performs a dedicated or specific function.",
          "It controls a relevant washing-machine operation.",
        ],
        guidance: [
          "Credit suitable examples such as temperature, timing, water level or drum movement.",
        ],
      },

      reflectionPrompt:
        "Explain how an embedded system differs from a general-purpose computer.",
    },
  ],
};

