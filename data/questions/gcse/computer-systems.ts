import type { GCSEPracticeQuestion } from "./types";

export const gcseComputerSystemsQuestions: GCSEPracticeQuestion[] = [
  {
    "id": "gcse-computer-systems-001",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "computer-systems",
    "topicTitle": "Computer Systems",
    "subtopic": "CPU components",
    "specificationReferences": [
      "AQA 3.4 Computer systems",
      "OCR J277 1.1 Systems architecture",
      "Pearson GCSE Computer Science - Computers"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 4,
    "question": "State the purpose of the ALU, control unit, registers and cache.",
    "markPoints": [
      "ALU performs arithmetic/logic",
      "Control unit coordinates/decodes",
      "Registers hold small immediate data/instructions/addresses",
      "Cache stores frequently/recently used data/instructions close to CPU"
    ],
    "modelAnswer": "The ALU performs arithmetic and logical operations; the control unit coordinates instruction processing; registers hold values needed immediately; cache holds frequently needed data/instructions for faster access.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "cpu",
      "alu",
      "control unit",
      "cache"
    ],
    "curriculumAreaIds": [
      "computer-systems"
    ]
  },
  {
    "id": "gcse-computer-systems-002",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "computer-systems",
    "topicTitle": "Computer Systems",
    "subtopic": "Fetch-decode-execute",
    "specificationReferences": [
      "AQA 3.4 Computer systems",
      "OCR J277 1.1 Systems architecture",
      "Pearson GCSE Computer Science - Computers"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 5,
    "question": "Describe the fetch-decode-execute cycle, including the program counter and current instruction register.",
    "markPoints": [
      "PC holds address of next instruction",
      "Instruction fetched from memory",
      "Instruction placed in CIR",
      "Control unit decodes instruction",
      "Instruction executes / PC updated appropriately"
    ],
    "modelAnswer": "The PC contains the address of the next instruction. That instruction is fetched from memory into the CIR, decoded by the control unit and then executed. The PC is updated so processing can continue.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "fde",
      "pc",
      "cir"
    ],
    "curriculumAreaIds": [
      "computer-systems"
    ]
  },
  {
    "id": "gcse-computer-systems-003",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "computer-systems",
    "topicTitle": "Computer Systems",
    "subtopic": "Registers",
    "specificationReferences": [
      "AQA 3.4 Computer systems",
      "OCR J277 1.1 Systems architecture",
      "Pearson GCSE Computer Science - Computers"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 4,
    "question": "Explain the roles of the MAR and MDR during a memory read.",
    "markPoints": [
      "MAR stores address being accessed",
      "Address identifies memory location",
      "MDR stores data transferred from memory",
      "Distinguishes address from data"
    ],
    "modelAnswer": "The MAR holds the address of the memory location to read. The MDR then holds the data transferred from that location.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "mar",
      "mdr",
      "register"
    ],
    "curriculumAreaIds": [
      "computer-systems"
    ]
  },
  {
    "id": "gcse-computer-systems-004",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "computer-systems",
    "topicTitle": "Computer Systems",
    "subtopic": "Registers",
    "specificationReferences": [
      "AQA 3.4 Computer systems",
      "OCR J277 1.1 Systems architecture",
      "Pearson GCSE Computer Science - Computers"
    ],
    "questionType": "trace",
    "difficulty": "advanced",
    "marks": 6,
    "question": "During a fetch, the PC contains 240 and memory location 240 contains instruction `ADD 18`. Describe changes involving PC, MAR, MDR and CIR.",
    "markPoints": [
      "MAR receives 240",
      "Memory at 240 is accessed",
      "MDR receives ADD 18",
      "CIR receives ADD 18",
      "PC advances to next instruction address",
      "Roles/order logically correct"
    ],
    "modelAnswer": "The address 240 is copied from the PC to the MAR. The instruction at that address is read into the MDR and copied to the CIR. The PC is advanced to the address of the next instruction.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "pc",
      "mar",
      "mdr",
      "cir"
    ],
    "curriculumAreaIds": [
      "computer-systems"
    ]
  },
  {
    "id": "gcse-computer-systems-005",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "computer-systems",
    "topicTitle": "Computer Systems",
    "subtopic": "Cache",
    "specificationReferences": [
      "AQA 3.4 Computer systems",
      "OCR J277 1.1 Systems architecture",
      "Pearson GCSE Computer Science - Computers"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 4,
    "question": "Explain how CPU cache can improve processor performance.",
    "markPoints": [
      "Cache is small/high-speed memory near/in CPU",
      "Stores frequently/recently used data/instructions",
      "Faster to access than RAM",
      "Reduces time CPU waits for memory"
    ],
    "modelAnswer": "Cache keeps frequently or recently needed data and instructions in faster memory close to the processor, reducing slower accesses to RAM and therefore reducing waiting time.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "cache",
      "performance"
    ],
    "curriculumAreaIds": [
      "computer-systems"
    ]
  },
  {
    "id": "gcse-computer-systems-006",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "computer-systems",
    "topicTitle": "Computer Systems",
    "subtopic": "Processor performance",
    "specificationReferences": [
      "AQA 3.4 Computer systems",
      "OCR J277 1.1 Systems architecture",
      "Pearson GCSE Computer Science - Computers"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 5,
    "question": "Explain how clock speed, number of cores and cache size can each affect processor performance.",
    "markPoints": [
      "Clock speed relates to cycles per second",
      "More cores can execute work in parallel",
      "Benefit of cores depends on software/workload",
      "Larger/effective cache can reduce RAM access",
      "Overall performance depends on several factors"
    ],
    "modelAnswer": "Higher clock speed can allow more processing cycles per second. Multiple cores can perform work in parallel when software supports it. Cache can reduce slower RAM accesses. Actual performance depends on the workload and architecture.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "clock speed",
      "cores",
      "cache"
    ],
    "curriculumAreaIds": [
      "computer-systems"
    ]
  },
  {
    "id": "gcse-computer-systems-007",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "computer-systems",
    "topicTitle": "Computer Systems",
    "subtopic": "Processor performance",
    "specificationReferences": [
      "AQA 3.4 Computer systems",
      "OCR J277 1.1 Systems architecture",
      "Pearson GCSE Computer Science - Computers"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 6,
    "question": "Laptop A has a higher clock speed. Laptop B has more cores and a larger cache. Explain why the clock speed alone cannot prove that A will run every program faster.",
    "markPoints": [
      "Clock speed is only one factor",
      "Core count matters for parallel workloads",
      "Cache affects memory access delays",
      "Programs use resources differently",
      "Architecture/other bottlenecks matter",
      "Reasoned conclusion"
    ],
    "modelAnswer": "A higher clock speed may help, but programs that use multiple cores may favour B and a larger cache can reduce memory delays. Workloads and architecture differ, so clock speed alone cannot guarantee better performance.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "performance",
      "clock",
      "cores"
    ],
    "curriculumAreaIds": [
      "computer-systems"
    ]
  },
  {
    "id": "gcse-computer-systems-008",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "computer-systems",
    "topicTitle": "Computer Systems",
    "subtopic": "RAM and ROM",
    "specificationReferences": [
      "AQA 3.4 Computer systems",
      "OCR J277 1.1 Systems architecture",
      "Pearson GCSE Computer Science - Computers"
    ],
    "questionType": "compare",
    "difficulty": "foundation",
    "marks": 4,
    "question": "Compare RAM and ROM.",
    "markPoints": [
      "RAM is volatile",
      "RAM stores active programs/data",
      "ROM is non-volatile",
      "ROM commonly stores firmware/start-up instructions"
    ],
    "modelAnswer": "RAM is volatile working memory for programs and data currently in use. ROM is non-volatile and commonly stores firmware or start-up instructions.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "ram",
      "rom"
    ],
    "curriculumAreaIds": [
      "computer-systems"
    ]
  },
  {
    "id": "gcse-computer-systems-009",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "computer-systems",
    "topicTitle": "Computer Systems",
    "subtopic": "Virtual memory",
    "specificationReferences": [
      "AQA 3.4 Computer systems",
      "OCR J277 1.1 Systems architecture",
      "Pearson GCSE Computer Science - Computers"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 4,
    "question": "Explain why an operating system may use virtual memory and why it is normally slower than using RAM.",
    "markPoints": [
      "Used when insufficient RAM",
      "Uses secondary storage as temporary extension",
      "Allows more/larger programs to continue",
      "Secondary storage is slower than RAM"
    ],
    "modelAnswer": "When RAM is insufficient, part of secondary storage can be used as virtual memory. This allows execution to continue but is slower because secondary storage has slower access than RAM.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "virtual memory",
      "ram"
    ],
    "curriculumAreaIds": [
      "computer-systems"
    ]
  },
  {
    "id": "gcse-computer-systems-010",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "computer-systems",
    "topicTitle": "Computer Systems",
    "subtopic": "Secondary storage",
    "specificationReferences": [
      "AQA 3.4 Computer systems",
      "OCR J277 1.1 Systems architecture",
      "Pearson GCSE Computer Science - Computers"
    ],
    "questionType": "compare",
    "difficulty": "standard",
    "marks": 5,
    "question": "Compare magnetic hard-disk storage and solid-state storage for a laptop.",
    "markPoints": [
      "HDD uses moving/mechanical parts",
      "SSD has no moving parts",
      "SSD generally faster/more resistant to movement",
      "HDD often cheaper per unit capacity",
      "Justified laptop choice"
    ],
    "modelAnswer": "An SSD has no moving parts, is generally faster and is better suited to movement in a laptop. A hard disk can offer more capacity for the price. For a portable laptop, SSD is usually preferable if budget allows.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "ssd",
      "hdd",
      "storage"
    ],
    "curriculumAreaIds": [
      "computer-systems"
    ]
  },
  {
    "id": "gcse-computer-systems-011",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "computer-systems",
    "topicTitle": "Computer Systems",
    "subtopic": "Secondary storage",
    "specificationReferences": [
      "AQA 3.4 Computer systems",
      "OCR J277 1.1 Systems architecture",
      "Pearson GCSE Computer Science - Computers"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 5,
    "question": "A school needs long-term backups that are kept offline and rarely accessed. Discuss two factors it should consider when choosing storage.",
    "markPoints": [
      "Capacity",
      "Cost",
      "Durability/longevity",
      "Transfer/access speed",
      "Suitable justified choice/factor application"
    ],
    "modelAnswer": "The school should consider enough capacity for its backups and the cost per unit of storage. Durability and expected archival life are also important because the backups may be stored for long periods, while very high access speed may be less important.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "backup",
      "storage"
    ],
    "curriculumAreaIds": [
      "computer-systems"
    ]
  },
  {
    "id": "gcse-computer-systems-012",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "computer-systems",
    "topicTitle": "Computer Systems",
    "subtopic": "Embedded systems",
    "specificationReferences": [
      "AQA 3.4 Computer systems",
      "OCR J277 1.1 Systems architecture",
      "Pearson GCSE Computer Science - Computers"
    ],
    "questionType": "explain",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Explain what is meant by an embedded system and give one example.",
    "markPoints": [
      "Computer system built into larger device",
      "Performs dedicated/specific function",
      "Valid example"
    ],
    "modelAnswer": "An embedded system is a computer built into a larger device to perform a specific function, for example the controller in a washing machine.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "embedded"
    ],
    "curriculumAreaIds": [
      "computer-systems"
    ]
  },
  {
    "id": "gcse-computer-systems-013",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "computer-systems",
    "topicTitle": "Computer Systems",
    "subtopic": "Embedded systems",
    "specificationReferences": [
      "AQA 3.4 Computer systems",
      "OCR J277 1.1 Systems architecture",
      "Pearson GCSE Computer Science - Computers"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 4,
    "question": "Explain why a washing-machine controller is better described as an embedded system than a general-purpose computer.",
    "markPoints": [
      "Part of larger product",
      "Designed for dedicated control tasks",
      "Runs limited/specific software",
      "Not intended for arbitrary user applications"
    ],
    "modelAnswer": "The controller is built into the washing machine and performs a defined set of monitoring and control tasks. It is not designed to run a wide range of user-selected applications.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "embedded",
      "controller"
    ],
    "curriculumAreaIds": [
      "computer-systems"
    ]
  },
  {
    "id": "gcse-computer-systems-014",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "computer-systems",
    "topicTitle": "Computer Systems",
    "subtopic": "CPU components",
    "specificationReferences": [
      "AQA 3.4 Computer systems",
      "OCR J277 1.1 Systems architecture",
      "Pearson GCSE Computer Science - Computers"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 5,
    "question": "A processor repeatedly performs calculations on values already being used by a program. Explain how the ALU, registers and cache contribute.",
    "markPoints": [
      "ALU performs calculation",
      "Registers hold operands/results immediately",
      "Cache may hold frequently used data/instructions",
      "Faster access than RAM",
      "Links components to execution"
    ],
    "modelAnswer": "The ALU performs the arithmetic or logical operation. Registers hold values needed immediately, while cache can hold frequently used data or instructions so the CPU does not need to access slower RAM as often.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "alu",
      "register",
      "cache"
    ],
    "curriculumAreaIds": [
      "computer-systems"
    ]
  },
  {
    "id": "gcse-computer-systems-015",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "computer-systems",
    "topicTitle": "Computer Systems",
    "subtopic": "Fetch-decode-execute",
    "specificationReferences": [
      "AQA 3.4 Computer systems",
      "OCR J277 1.1 Systems architecture",
      "Pearson GCSE Computer Science - Computers"
    ],
    "questionType": "trace",
    "difficulty": "advanced",
    "marks": 6,
    "question": "An instruction stored at address 500 is fetched. Describe the data/address movement up to the point where the instruction is ready to be decoded.",
    "markPoints": [
      "PC contains 500",
      "500 copied to MAR",
      "Memory location 500 accessed",
      "Instruction copied to MDR",
      "Instruction copied to CIR",
      "PC advances"
    ],
    "modelAnswer": "The PC's address 500 is copied to the MAR. Memory location 500 is read and the instruction is placed in the MDR, then copied to the CIR. The PC advances to the next instruction address.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "fde",
      "registers"
    ],
    "curriculumAreaIds": [
      "computer-systems"
    ]
  },
  {
    "id": "gcse-computer-systems-016",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "computer-systems",
    "topicTitle": "Computer Systems",
    "subtopic": "Registers",
    "specificationReferences": [
      "AQA 3.4 Computer systems",
      "OCR J277 1.1 Systems architecture",
      "Pearson GCSE Computer Science - Computers"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 4,
    "question": "Match each register to its role: PC, MAR, MDR, CIR.",
    "markPoints": [
      "PC next-instruction address",
      "MAR memory address being accessed",
      "MDR data/instruction transferred to/from memory",
      "CIR current instruction being decoded/executed"
    ],
    "modelAnswer": "PC: next instruction address; MAR: address currently accessed; MDR: data/instruction being transferred; CIR: current instruction.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "registers"
    ],
    "curriculumAreaIds": [
      "computer-systems"
    ]
  },
  {
    "id": "gcse-computer-systems-017",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "computer-systems",
    "topicTitle": "Computer Systems",
    "subtopic": "Cache",
    "specificationReferences": [
      "AQA 3.4 Computer systems",
      "OCR J277 1.1 Systems architecture",
      "Pearson GCSE Computer Science - Computers"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 6,
    "question": "A manufacturer increases a processor's cache size but leaves clock speed and core count unchanged. Evaluate whether every program will become noticeably faster.",
    "markPoints": [
      "Larger cache may hold more useful data/instructions",
      "Can reduce RAM accesses",
      "Cache is faster than RAM",
      "Benefit depends on access patterns/workload",
      "Other bottlenecks may dominate",
      "Conclusion: not guaranteed for every program"
    ],
    "modelAnswer": "A larger cache can reduce slow RAM accesses when a program repeatedly uses data that fits in cache. Some programs will benefit little because of their access patterns or other bottlenecks, so a noticeable speed-up is not guaranteed.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "cache",
      "performance"
    ],
    "curriculumAreaIds": [
      "computer-systems"
    ]
  },
  {
    "id": "gcse-computer-systems-018",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "computer-systems",
    "topicTitle": "Computer Systems",
    "subtopic": "RAM and ROM",
    "specificationReferences": [
      "AQA 3.4 Computer systems",
      "OCR J277 1.1 Systems architecture",
      "Pearson GCSE Computer Science - Computers"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 4,
    "question": "Explain what happens to data in RAM when a desktop computer loses power and why firmware in ROM is still available after restart.",
    "markPoints": [
      "RAM is volatile",
      "RAM contents lost without power",
      "ROM is non-volatile",
      "ROM retains firmware without power"
    ],
    "modelAnswer": "RAM loses its contents when power is removed because it is volatile. ROM is non-volatile, so the stored firmware remains available when the computer starts again.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "ram",
      "rom",
      "volatile"
    ],
    "curriculumAreaIds": [
      "computer-systems"
    ]
  },
  {
    "id": "gcse-computer-systems-019",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "computer-systems",
    "topicTitle": "Computer Systems",
    "subtopic": "Virtual memory",
    "specificationReferences": [
      "AQA 3.4 Computer systems",
      "OCR J277 1.1 Systems architecture",
      "Pearson GCSE Computer Science - Computers"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 6,
    "question": "A computer has too little RAM for several large applications. Evaluate adding more RAM compared with relying heavily on virtual memory.",
    "markPoints": [
      "Virtual memory uses secondary storage",
      "Allows programs to run despite RAM shortage",
      "Secondary storage slower than RAM",
      "Heavy paging/swapping reduces performance",
      "Adding RAM reduces need for virtual memory",
      "Justified recommendation"
    ],
    "modelAnswer": "Virtual memory can prevent programs failing when RAM is full, but it uses slower secondary storage and heavy use can reduce performance. Adding RAM is usually the better long-term solution for this workload because more active data can remain in fast main memory.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "virtual memory",
      "ram"
    ],
    "curriculumAreaIds": [
      "computer-systems"
    ]
  },
  {
    "id": "gcse-computer-systems-020",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "computer-systems",
    "topicTitle": "Computer Systems",
    "subtopic": "Secondary storage",
    "specificationReferences": [
      "AQA 3.4 Computer systems",
      "OCR J277 1.1 Systems architecture",
      "Pearson GCSE Computer Science - Computers"
    ],
    "questionType": "compare",
    "difficulty": "advanced",
    "marks": 6,
    "question": "Compare optical, magnetic and solid-state storage for distributing 500 MB of read-only learning materials to students.",
    "markPoints": [
      "Optical can be cheap/read-only distribution",
      "Magnetic offers capacity but is less convenient for small distribution media",
      "Solid-state is portable/reusable/fast",
      "Cost differences",
      "Durability/compatibility consideration",
      "Justified recommendation"
    ],
    "modelAnswer": "Optical media can provide inexpensive read-only distribution but requires compatible drives. Magnetic storage offers high capacity but is unnecessary for only 500 MB. Solid-state media is portable and fast but may cost more. The choice depends on device compatibility and whether reuse is required.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "optical",
      "magnetic",
      "solid state"
    ],
    "curriculumAreaIds": [
      "computer-systems"
    ]
  },
  {
    "id": "gcse-computer-systems-021",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "computer-systems",
    "topicTitle": "Computer Systems",
    "subtopic": "Embedded systems",
    "specificationReferences": [
      "AQA 3.4 Computer systems",
      "OCR J277 1.1 Systems architecture",
      "Pearson GCSE Computer Science - Computers"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 6,
    "question": "A smart thermostat connects to the internet and controls home heating. Explain benefits and risks arising from it being an embedded networked system.",
    "markPoints": [
      "Dedicated automatic control",
      "Can respond to sensors",
      "Remote monitoring/control benefit",
      "Network connection creates security risk",
      "Failure/attack can affect physical heating",
      "Balanced conclusion/safeguard"
    ],
    "modelAnswer": "As an embedded controller it can automatically respond to temperature sensors, and networking enables remote control. However, network access creates a security risk because compromise could expose data or alter heating. Authentication, updates and secure communication are therefore important.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "embedded",
      "iot",
      "security"
    ],
    "curriculumAreaIds": [
      "computer-systems"
    ]
  },
  {
    "id": "gcse-computer-systems-022",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "computer-systems",
    "topicTitle": "Computer Systems",
    "subtopic": "Processor performance",
    "specificationReferences": [
      "AQA 3.4 Computer systems",
      "OCR J277 1.1 Systems architecture",
      "Pearson GCSE Computer Science - Computers"
    ],
    "questionType": "calculation",
    "difficulty": "standard",
    "marks": 4,
    "question": "Processor X has a 3.2 GHz clock. State what GHz measures and calculate the nominal number of clock cycles in 0.5 seconds.",
    "markPoints": [
      "GHz means billions of cycles per second",
      "3.2 billion cycles/s",
      "×0.5",
      "1.6 billion cycles"
    ],
    "modelAnswer": "3.2 GHz means 3.2 billion clock cycles per second. In 0.5 seconds that is 1.6 billion cycles.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "clock speed",
      "ghz"
    ],
    "curriculumAreaIds": [
      "computer-systems"
    ]
  },
  {
    "id": "gcse-computer-systems-023",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "computer-systems",
    "topicTitle": "Computer Systems",
    "subtopic": "CPU components",
    "specificationReferences": [
      "AQA 3.4 Computer systems",
      "OCR J277 1.1 Systems architecture",
      "Pearson GCSE Computer Science - Computers"
    ],
    "questionType": "explain",
    "difficulty": "advanced",
    "marks": 6,
    "question": "Explain how the control unit, ALU, registers and buses cooperate while an instruction is processed.",
    "markPoints": [
      "Control unit coordinates processing",
      "Registers hold immediate addresses/data/instruction",
      "Buses transfer addresses/data/control signals",
      "ALU performs arithmetic/logic where required",
      "Components operate as part of FDE",
      "Coherent linked explanation"
    ],
    "modelAnswer": "The control unit coordinates the fetch and execution of instructions. Registers hold addresses, instructions and working values, while buses carry data, addresses and control signals between components. When required, the ALU performs arithmetic or logical operations.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "cpu",
      "bus",
      "alu",
      "control unit"
    ],
    "curriculumAreaIds": [
      "computer-systems"
    ]
  },
  {
    "id": "gcse-computer-systems-024",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "computer-systems",
    "topicTitle": "Computer Systems",
    "subtopic": "Secondary storage",
    "specificationReferences": [
      "AQA 3.4 Computer systems",
      "OCR J277 1.1 Systems architecture",
      "Pearson GCSE Computer Science - Computers"
    ],
    "questionType": "scenario",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Give three characteristics that could be used to compare secondary-storage devices.",
    "markPoints": [
      "Capacity",
      "Speed",
      "Cost / durability / portability / reliability; any valid third"
    ],
    "modelAnswer": "Suitable characteristics include capacity, access/transfer speed and cost. Durability, portability and reliability are also valid.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "storage",
      "capacity",
      "speed"
    ],
    "curriculumAreaIds": [
      "computer-systems"
    ]
  },
  {
    "id": "gcse-computer-systems-025",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "computer-systems",
    "topicTitle": "Computer Systems",
    "subtopic": "Computer systems",
    "specificationReferences": [
      "AQA 3.4 Computer systems",
      "OCR J277 1.1 Systems architecture",
      "Pearson GCSE Computer Science - Computers"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 7,
    "question": "A school is buying computers for video editing. Evaluate the importance of processor, RAM and secondary storage when selecting the machines.",
    "markPoints": [
      "Processor performance affects computation/rendering",
      "Multiple cores may help suitable workloads",
      "RAM holds active large projects/data",
      "Insufficient RAM can cause virtual-memory use",
      "Fast storage affects loading/saving large files",
      "Capacity needed for video assets",
      "Balanced recommendation"
    ],
    "modelAnswer": "Video editing needs substantial processing power, enough RAM to keep large active data in memory, and fast high-capacity storage for large media files. No single specification should be considered alone; the school should balance CPU capability, sufficient RAM and SSD capacity against budget.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "cpu",
      "ram",
      "storage",
      "video"
    ],
    "curriculumAreaIds": [
      "computer-systems"
    ]
  }
];
