import type { Topic } from "@/types/curriculum";

export const advancedSystemsTopic: Topic = {
  "id": "advanced-systems",
  "title": "Advanced Computer Systems",
  "description": "Study processor architecture, low-level execution, operating systems, translators and Boolean algebra.",
  "difficulty": "⭐⭐⭐",
  "estimatedTime": "75 mins",
  "status": "published",
  "unit": "A-level Computer Systems",
  "specificationReferences": [
    "AQA 4.6-4.7",
    "OCR H446 1.1-1.2"
  ],
  "lessons": [
    {
      "id": "al-processor",
      "title": "Processor Architecture and Performance",
      "description": "Analyse buses, registers, cache, pipelining and performance.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "simulator": "cpu",
      "objectives": [
        "Trace register transfers.",
        "Explain buses and control signals.",
        "Evaluate performance factors."
      ],
      "explanation": "Performance depends on architecture as well as clock speed. Cache reduces memory waits and pipelining overlaps instruction stages.",
      "workedExample": "A pipeline can fetch one instruction while decoding another and executing a third.",
      "practiceQuestions": [
        {
          "question": "What does the address bus carry?",
          "answer": "Memory addresses"
        },
        {
          "question": "What is cache for?",
          "answer": "Reducing access time for frequently used data or instructions"
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Does doubling clock speed always double performance?",
          "answer": "No"
        }
      ],
      "examQuestion": {
        "question": "Evaluate two factors that affect CPU performance.",
        "marks": 6,
        "answer": "Clock speed, cache, cores and pipelining can improve performance, but gains depend on workload and bottlenecks.",
        "markScheme": [
          "Factor 1.",
          "Developed effect.",
          "Factor 2.",
          "Developed effect.",
          "Recognises limitation.",
          "Reasoned judgement."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Explain why benchmarks are more useful than clock speed alone."
    },
    {
      "id": "al-assembly",
      "title": "Assembly Language",
      "description": "Use mnemonics, operands and branching to reason about low-level execution.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Explain opcodes and operands.",
        "Trace simple assembly code.",
        "Compare assembly and machine code."
      ],
      "explanation": "Assembly represents machine instructions using mnemonics and symbolic operands. An assembler translates it to machine code.",
      "workedExample": "A loop can load a counter, decrement it, store it and branch while non-zero.",
      "practiceQuestions": [
        {
          "question": "What translates assembly?",
          "answer": "An assembler"
        },
        {
          "question": "What is an opcode?",
          "answer": "The part of an instruction specifying the operation"
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Why is assembly hardware-specific?",
          "answer": "It corresponds to a processor instruction set"
        }
      ],
      "examQuestion": {
        "question": "Explain the role of the program counter in a branching assembly program.",
        "marks": 5,
        "answer": "The PC stores the address of the next instruction; a branch replaces the normal sequential next address.",
        "markScheme": [
          "PC stores next address.",
          "Sequential execution.",
          "Branch changes PC.",
          "Links to control flow.",
          "Uses correct terminology."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Give one situation where low-level programming is appropriate."
    },
    {
      "id": "al-os-translators",
      "title": "Operating Systems and Translators",
      "description": "Explain resource management and translation at A-level depth.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "simulator": "operating-system",
      "objectives": [
        "Explain scheduling and memory management.",
        "Compare compiler/interpreter/assembler.",
        "Explain virtual machines."
      ],
      "explanation": "Operating systems manage processes, memory, devices, files and security. Translators convert source code into executable or intermediate forms.",
      "workedExample": "Source code can compile to bytecode that executes on a virtual machine for portability.",
      "practiceQuestions": [
        {
          "question": "What does a scheduler allocate?",
          "answer": "Processor time",
          "acceptedAnswers": [
            "CPU time"
          ]
        },
        {
          "question": "What translates assembly?",
          "answer": "An assembler"
        }
      ],
      "checkpointQuestions": [
        {
          "question": "What benefit can a virtual machine provide?",
          "answer": "Portability",
          "acceptedAnswers": [
            "Platform independence"
          ]
        }
      ],
      "examQuestion": {
        "question": "Compare compilation and interpretation.",
        "marks": 6,
        "answer": "A compiler translates before execution and may optimise code; an interpreter translates/executes incrementally and often gives immediate diagnostics.",
        "markScheme": [
          "Compiler before execution.",
          "Optimisation/performance.",
          "Interpreter incremental.",
          "Immediate diagnostics.",
          "Runtime overhead.",
          "Balanced comparison."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Recommend a translation approach for a development environment."
    }
  ]
};
