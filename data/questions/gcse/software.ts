import type { GCSEPracticeQuestion } from "./types";

export const gcseSoftwareQuestions: GCSEPracticeQuestion[] = [
  {
    "id": "gcse-software-001",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "software",
    "topicTitle": "Systems & Software",
    "subtopic": "Operating system",
    "specificationReferences": [
      "AQA 3.4 Computer systems / software",
      "OCR J277 1.5 Systems software",
      "Pearson GCSE Computer Science - Software"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 4,
    "question": "State four functions of an operating system.",
    "markPoints": [
      "Memory management",
      "Processor/task management",
      "File management",
      "Peripheral/device/user-interface/security management; any valid fourth"
    ],
    "modelAnswer": "Operating systems manage resources such as memory and processor time, organise files, manage devices and provide interfaces/security for users and applications.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "operating system"
    ],
    "curriculumAreaIds": [
      "software"
    ]
  },
  {
    "id": "gcse-software-002",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "software",
    "topicTitle": "Systems & Software",
    "subtopic": "Memory management",
    "specificationReferences": [
      "AQA 3.4 Computer systems / software",
      "OCR J277 1.5 Systems software",
      "Pearson GCSE Computer Science - Software"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 4,
    "question": "Explain why an operating system must manage memory when several programs run at the same time.",
    "markPoints": [
      "Allocates memory to processes",
      "Tracks used/free memory",
      "Prevents inappropriate overlap/access",
      "Reclaims/reallocates memory"
    ],
    "modelAnswer": "The OS allocates memory to running processes, tracks free and used areas and prevents processes from overwriting memory belonging to others. It can reclaim memory when programs finish.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "memory management"
    ],
    "curriculumAreaIds": [
      "software"
    ]
  },
  {
    "id": "gcse-software-003",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "software",
    "topicTitle": "Systems & Software",
    "subtopic": "Processor scheduling",
    "specificationReferences": [
      "AQA 3.4 Computer systems / software",
      "OCR J277 1.5 Systems software",
      "Pearson GCSE Computer Science - Software"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 4,
    "question": "Explain how an operating system allows several applications to appear to run at the same time on a single CPU core.",
    "markPoints": [
      "Schedules processes/tasks",
      "Allocates CPU time slices",
      "Switches between processes",
      "Rapid switching creates apparent concurrency"
    ],
    "modelAnswer": "The OS scheduler allocates short periods of CPU time to different processes and switches between them rapidly, creating the appearance that applications are running simultaneously.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "scheduling",
      "processor"
    ],
    "curriculumAreaIds": [
      "software"
    ]
  },
  {
    "id": "gcse-software-004",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "software",
    "topicTitle": "Systems & Software",
    "subtopic": "File management",
    "specificationReferences": [
      "AQA 3.4 Computer systems / software",
      "OCR J277 1.5 Systems software",
      "Pearson GCSE Computer Science - Software"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 4,
    "question": "Explain two file-management functions an operating system provides.",
    "markPoints": [
      "Creates/deletes/renames files or folders",
      "Organises directory structure",
      "Tracks storage locations/metadata",
      "Permissions/access; any two developed"
    ],
    "modelAnswer": "The OS maintains folders/directories so files can be organised and named, and it manages operations such as creating, deleting and locating files. It can also enforce file permissions.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "file management"
    ],
    "curriculumAreaIds": [
      "software"
    ]
  },
  {
    "id": "gcse-software-005",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "software",
    "topicTitle": "Systems & Software",
    "subtopic": "Device drivers",
    "specificationReferences": [
      "AQA 3.4 Computer systems / software",
      "OCR J277 1.5 Systems software",
      "Pearson GCSE Computer Science - Software"
    ],
    "questionType": "explain",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Explain the purpose of a device driver.",
    "markPoints": [
      "Software interface between OS/application and hardware",
      "Translates/handles device-specific communication",
      "Allows operating system to control/use device"
    ],
    "modelAnswer": "A device driver lets the operating system communicate with and control a particular hardware device by handling device-specific instructions.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "driver",
      "device"
    ],
    "curriculumAreaIds": [
      "software"
    ]
  },
  {
    "id": "gcse-software-006",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "software",
    "topicTitle": "Systems & Software",
    "subtopic": "Utility software",
    "specificationReferences": [
      "AQA 3.4 Computer systems / software",
      "OCR J277 1.5 Systems software",
      "Pearson GCSE Computer Science - Software"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 4,
    "question": "Give four examples of utility software and state a purpose for each.",
    "markPoints": [
      "Antivirus/security utility + purpose",
      "Backup utility + purpose",
      "Compression utility + purpose",
      "Disk/storage/encryption utility + purpose"
    ],
    "modelAnswer": "Examples include antivirus for detecting malware, backup software for recovery copies, compression software for reducing file size and encryption utilities for protecting data.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "utility"
    ],
    "curriculumAreaIds": [
      "software"
    ]
  },
  {
    "id": "gcse-software-007",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "software",
    "topicTitle": "Systems & Software",
    "subtopic": "Backup utility",
    "specificationReferences": [
      "AQA 3.4 Computer systems / software",
      "OCR J277 1.5 Systems software",
      "Pearson GCSE Computer Science - Software"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 4,
    "question": "A user accidentally deletes an important folder. Explain how backup software can reduce the impact.",
    "markPoints": [
      "Creates separate copies",
      "Backups taken before loss",
      "Deleted data can be restored",
      "Regular/versioned backups reduce amount lost"
    ],
    "modelAnswer": "Backup software creates separate recovery copies. If a suitable backup was made before deletion, the folder can be restored; frequent or versioned backups reduce how much recent work is lost.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "backup",
      "utility"
    ],
    "curriculumAreaIds": [
      "software"
    ]
  },
  {
    "id": "gcse-software-008",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "software",
    "topicTitle": "Systems & Software",
    "subtopic": "Compression utility",
    "specificationReferences": [
      "AQA 3.4 Computer systems / software",
      "OCR J277 1.5 Systems software",
      "Pearson GCSE Computer Science - Software"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 4,
    "question": "Explain why a user might compress a folder before sending it and why lossless compression is appropriate for program source files.",
    "markPoints": [
      "Reduces file size",
      "Can reduce transmission/storage requirement",
      "Source code must be recovered exactly",
      "Lossless preserves all original data"
    ],
    "modelAnswer": "Compression can reduce the amount of data sent. Source code should use lossless compression because every character must be reconstructed exactly.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "compression",
      "utility"
    ],
    "curriculumAreaIds": [
      "software"
    ]
  },
  {
    "id": "gcse-software-009",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "software",
    "topicTitle": "Systems & Software",
    "subtopic": "Encryption utility",
    "specificationReferences": [
      "AQA 3.4 Computer systems / software",
      "OCR J277 1.5 Systems software",
      "Pearson GCSE Computer Science - Software"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 4,
    "question": "Explain how an encryption utility can protect files stored on a stolen laptop.",
    "markPoints": [
      "Transforms readable data to ciphertext",
      "Uses key/credential",
      "Stolen storage alone does not reveal plaintext",
      "Protection depends on secure key/credentials"
    ],
    "modelAnswer": "Encryption stores the protected data as ciphertext. Without the appropriate key or credential, someone who steals the laptop should not be able to read the original files directly.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "encryption",
      "utility"
    ],
    "curriculumAreaIds": [
      "software"
    ]
  },
  {
    "id": "gcse-software-010",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "software",
    "topicTitle": "Systems & Software",
    "subtopic": "System software",
    "specificationReferences": [
      "AQA 3.4 Computer systems / software",
      "OCR J277 1.5 Systems software",
      "Pearson GCSE Computer Science - Software"
    ],
    "questionType": "compare",
    "difficulty": "standard",
    "marks": 5,
    "question": "Compare system software with application software, giving one example of each.",
    "markPoints": [
      "System software manages/supports computer operation",
      "OS/driver/utility example",
      "Application software performs user task",
      "Word processor/browser/editor example",
      "Clear distinction"
    ],
    "modelAnswer": "System software operates or supports the computer, such as an operating system or device driver. Application software performs tasks for the user, such as a word processor.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "system software",
      "application"
    ],
    "curriculumAreaIds": [
      "software"
    ]
  },
  {
    "id": "gcse-software-011",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "software",
    "topicTitle": "Systems & Software",
    "subtopic": "Operating system",
    "specificationReferences": [
      "AQA 3.4 Computer systems / software",
      "OCR J277 1.5 Systems software",
      "Pearson GCSE Computer Science - Software"
    ],
    "questionType": "scenario",
    "difficulty": "advanced",
    "marks": 6,
    "question": "A computer becomes slow when many programs are opened. Explain how memory management, virtual memory and processor scheduling may all be involved.",
    "markPoints": [
      "OS allocates RAM among processes",
      "RAM pressure may cause virtual memory",
      "Secondary storage is slower than RAM",
      "Scheduler shares CPU time",
      "Many runnable processes increase contention/context switching",
      "Coherent explanation"
    ],
    "modelAnswer": "The OS divides RAM among active processes. If RAM becomes insufficient it may use slower virtual memory on secondary storage. At the same time, the scheduler must share CPU time among more runnable processes, so both memory pressure and processor contention can reduce responsiveness.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "operating system",
      "virtual memory",
      "scheduling"
    ],
    "curriculumAreaIds": [
      "software"
    ]
  },
  {
    "id": "gcse-software-012",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "software",
    "topicTitle": "Systems & Software",
    "subtopic": "Device drivers",
    "specificationReferences": [
      "AQA 3.4 Computer systems / software",
      "OCR J277 1.5 Systems software",
      "Pearson GCSE Computer Science - Software"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 4,
    "question": "A new printer is physically connected but the operating system cannot use all its features. Explain why installing the correct driver may solve the problem.",
    "markPoints": [
      "OS needs device-specific communication",
      "Driver provides commands/interface",
      "Generic/missing driver may lack features",
      "Correct driver enables supported hardware functions"
    ],
    "modelAnswer": "The correct driver provides the device-specific instructions the OS needs. A missing or generic driver may not expose all printer features, while the manufacturer's compatible driver can enable them.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "driver",
      "printer"
    ],
    "curriculumAreaIds": [
      "software"
    ]
  },
  {
    "id": "gcse-software-013",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "software",
    "topicTitle": "Systems & Software",
    "subtopic": "Utilities",
    "specificationReferences": [
      "AQA 3.4 Computer systems / software",
      "OCR J277 1.5 Systems software",
      "Pearson GCSE Computer Science - Software"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 6,
    "question": "A user claims that backup software and antivirus software do the same job because both 'protect files'. Evaluate this claim.",
    "markPoints": [
      "Antivirus aims to detect/prevent/remove malware",
      "Backup creates recovery copies",
      "Backup does not stop malware infection",
      "Antivirus does not guarantee recovery from deletion/failure",
      "They address different risks",
      "Complementary conclusion"
    ],
    "modelAnswer": "The claim is incorrect. Antivirus attempts to detect or block malware, whereas backup software creates copies from which data can be restored. Neither replaces the other: malware may bypass antivirus, and backups do not prevent infection.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "antivirus",
      "backup",
      "utility"
    ],
    "curriculumAreaIds": [
      "software"
    ]
  },
  {
    "id": "gcse-software-014",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "software",
    "topicTitle": "Systems & Software",
    "subtopic": "Operating systems",
    "specificationReferences": [
      "AQA 3.4 Computer systems / software",
      "OCR J277 1.5 Systems software",
      "Pearson GCSE Computer Science - Software"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 6,
    "question": "Explain why an operating system is essential for a general-purpose computer but a simple embedded device may use a much smaller specialised software environment.",
    "markPoints": [
      "General-purpose system manages many applications/resources",
      "Needs files/devices/users/processes",
      "OS provides common services",
      "Embedded device has narrow fixed purpose",
      "May have limited hardware/resources",
      "Specialised environment can be simpler"
    ],
    "modelAnswer": "A general-purpose computer must manage many applications, devices, files and users, so an OS provides shared resource-management services. A simple embedded controller performs a narrow task and may have limited resources, allowing a smaller specialised environment.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "operating system",
      "embedded"
    ],
    "curriculumAreaIds": [
      "software"
    ]
  },
  {
    "id": "gcse-software-015",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "software",
    "topicTitle": "Systems & Software",
    "subtopic": "System software",
    "specificationReferences": [
      "AQA 3.4 Computer systems / software",
      "OCR J277 1.5 Systems software",
      "Pearson GCSE Computer Science - Software"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 7,
    "question": "A school is preparing computers for examinations. Evaluate the system-software controls that could improve reliability and security.",
    "markPoints": [
      "OS user/account permissions",
      "Restrict software/settings",
      "Patch/update system appropriately before exam",
      "Firewall/security utilities",
      "Backup/recovery or restore images",
      "Device/driver stability",
      "Balanced testing/change-control conclusion"
    ],
    "modelAnswer": "The school can use restricted OS accounts, appropriate firewall/security controls and tested system updates, while keeping recovery images or backups. Drivers and required software should be tested in advance. Last-minute untested changes could reduce reliability, so security controls should be combined with change management and testing.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "system software",
      "security",
      "reliability"
    ],
    "curriculumAreaIds": [
      "software"
    ]
  }
];
