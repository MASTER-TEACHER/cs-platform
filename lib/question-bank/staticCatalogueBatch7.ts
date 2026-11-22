import type { BankQuestion } from "./bankUtilities";

/**
 * CS Master Batch 7: 142 original OCR questions (J277 GCSE and H446 A Level),
 * bringing each OCR pool to 150. Checked against batches 1-6 for repeats.
 */
export const batch7Questions: BankQuestion[] = [
  {
    "key": "catalogue-batch7-0001",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0001",
      "questionNumber": 1,
      "topic": "CPU architecture",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "State the purpose of the Memory Data Register (MDR).",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0001-point-1",
          "description": "Holds the data or instruction that has been fetched from memory",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0001-point-2",
          "description": "or that is about to be written to memory",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "The MDR temporarily holds data or instructions being read from or written to memory.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0002",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0002",
      "questionNumber": 2,
      "topic": "CPU architecture",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Put these fetch–execute steps in the correct order: (A) the instruction is decoded by the CU; (B) the address in the PC is copied to the MAR; (C) the instruction is executed; (D) the instruction at that address is copied into the MDR and the PC is incremented.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0002-point-1",
          "description": "B then D",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0002-point-2",
          "description": "A then C",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "B, D, A, C",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0003",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0003",
      "questionNumber": 3,
      "topic": "CPU architecture",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain one disadvantage of increasing a processor's clock speed.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0003-point-1",
          "description": "The CPU produces more heat / uses more power",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0003-point-2",
          "description": "Needs better cooling / can reduce battery life / risk of instability",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A faster clock generates more heat and uses more power, so extra cooling is needed.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0004",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0004",
      "questionNumber": 4,
      "topic": "Data representation",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "A text file contains 2,000 characters stored using 8-bit ASCII. Calculate its size in kilobytes. (1 kB = 1,000 bytes)",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0004-point-1",
          "description": "2,000 characters × 1 byte = 2,000 bytes",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0004-point-2",
          "description": "= 2 kB",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "2 kB",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0005",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0005",
      "questionNumber": 5,
      "topic": "Data representation",
      "questionType": "conversion",
      "commandWord": "calculate",
      "question": "Convert 3,500,000 bytes into megabytes, and 0.5 GB into megabytes. (Use multiples of 1,000.)",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0005-point-1",
          "description": "3.5 MB",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0005-point-2",
          "description": "500 MB",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "3.5 MB and 500 MB",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0006",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0006",
      "questionNumber": 6,
      "topic": "Memory and storage",
      "questionType": "scenario-application",
      "commandWord": "explain",
      "question": "A school needs to back up 10 TB of data every week and keep the backups on site. Recommend a type of storage and justify your choice.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0006-point-1",
          "description": "Magnetic storage (hard disk drives or tape)",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0006-point-2",
          "description": "High capacity",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0006-point-3",
          "description": "Low cost per gigabyte",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Magnetic hard drives or tape: very high capacity at a low cost per gigabyte.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0007",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0007",
      "questionNumber": 7,
      "topic": "Binary representation and arithmetic",
      "questionType": "conversion",
      "commandWord": "calculate",
      "question": "Convert the binary number 01011100 into denary and into hexadecimal.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0007-point-1",
          "description": "Denary: 92",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0007-point-2",
          "description": "Hexadecimal: 5C",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "92 and 5C",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0008",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0008",
      "questionNumber": 8,
      "topic": "Binary representation and arithmetic",
      "questionType": "calculation",
      "commandWord": "calculate",
      "question": "State the largest denary number that can be stored in 12 bits.",
      "context": "",
      "marks": 1,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0008-point-1",
          "description": "2^12 − 1 = 4095",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "4095",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0009",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0009",
      "questionNumber": 9,
      "topic": "Image representation",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain why an image with a colour depth of 1 bit can only be black and white.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0009-point-1",
          "description": "1 bit has only two possible values (0 and 1)",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0009-point-2",
          "description": "So each pixel can only be one of two colours",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "One bit gives two values, so each pixel can only be one of two colours.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0010",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0010",
      "questionNumber": 10,
      "topic": "Sound representation",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "Sound is recorded in mono at 8,000 Hz with a bit depth of 8. How many seconds of sound fit in 1 MB? (1 MB = 1,000,000 bytes)",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0010-point-1",
          "description": "8,000 × 8 = 64,000 bits = 8,000 bytes per second",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0010-point-2",
          "description": "1,000,000 ÷ 8,000",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0010-point-3",
          "description": "= 125 seconds",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "125 seconds",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0011",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0011",
      "questionNumber": 11,
      "topic": "Data compression",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Give two reasons why files are compressed.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0011-point-1",
          "description": "Any 2 from: Take up less storage space; Faster to transmit / download / upload / stream; Use less bandwidth / data allowance; Email attachment size limits.",
          "marks": 2
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Smaller files use less storage and transfer faster.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0012",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0012",
      "questionNumber": 12,
      "topic": "Computer networks",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Compare copper cable and fibre-optic cable as transmission media.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0012-point-1",
          "description": "Fibre transmits data faster / higher bandwidth",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0012-point-2",
          "description": "Fibre works over longer distances without signal loss",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0012-point-3",
          "description": "Fibre is not affected by electromagnetic interference",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0012-point-4",
          "description": "Copper is cheaper and easier to install",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Fibre is faster, works over longer distances and avoids interference; copper is cheaper and easier to install.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0013",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0013",
      "questionNumber": 13,
      "topic": "Computer networks",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain what is meant by web hosting.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0013-point-1",
          "description": "Storing a website's files on a web server",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0013-point-2",
          "description": "that is permanently connected to the internet so users can access it",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Web hosting stores a site on a server that is always connected to the internet.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0014",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0014",
      "questionNumber": 14,
      "topic": "Computer networks",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe the format of an IPv4 address and give an example.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0014-point-1",
          "description": "Four numbers (each 0–255) separated by full stops / 32 bits",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0014-point-2",
          "description": "Valid example, e.g. 192.168.0.12",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Four numbers from 0 to 255 separated by dots, e.g. 192.168.0.12.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0015",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0015",
      "questionNumber": 15,
      "topic": "Computer networks",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe the format of a MAC address.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0015-point-1",
          "description": "48 bits long",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0015-point-2",
          "description": "Written as 12 hexadecimal digits in pairs, e.g. 3C:22:FB:7A:10:9E",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A 48-bit address written as 12 hex digits, e.g. 3C:22:FB:7A:10:9E.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0016",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0016",
      "questionNumber": 16,
      "topic": "Computer networks",
      "questionType": "explain",
      "commandWord": "state",
      "question": "Ethernet and Wi-Fi are both network protocols. State what each is used for.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0016-point-1",
          "description": "Ethernet: communication over wired local area networks",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0016-point-2",
          "description": "Wi-Fi: communication over wireless local area networks",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Ethernet is for wired LANs; Wi-Fi is for wireless LANs.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0017",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0017",
      "questionNumber": 17,
      "topic": "Computer networks",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain why wireless network traffic should be encrypted.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0017-point-1",
          "description": "Radio signals can be picked up by anyone in range",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0017-point-2",
          "description": "Encryption means intercepted data cannot be understood without the key",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Anyone in range can intercept wireless signals, so encryption keeps the data unreadable.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0018",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0018",
      "questionNumber": 18,
      "topic": "Computer networks",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Two neighbouring Wi-Fi networks use the same channel. Explain why this can reduce performance.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0018-point-1",
          "description": "Channels are ranges of frequency used to transmit",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0018-point-2",
          "description": "Signals on the same channel interfere with each other",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0018-point-3",
          "description": "Data must be resent / devices wait to transmit, so speed falls",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Both networks transmit on the same frequencies, so signals interfere and data has to be resent, slowing the networks.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0019",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0019",
      "questionNumber": 19,
      "topic": "Computer networks",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe how data is sent from one computer to another on a star network.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0019-point-1",
          "description": "The sending computer sends data to the central switch",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0019-point-2",
          "description": "The switch reads the destination MAC address",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0019-point-3",
          "description": "The switch forwards the data only to the destination computer",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Data goes to the switch, which checks the destination MAC address and forwards it only to that computer.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0020",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0020",
      "questionNumber": 20,
      "topic": "Computer networks",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Explain the difference between FTP and HTTP.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0020-point-1",
          "description": "FTP is used to transfer files between computers / upload files to a server",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0020-point-2",
          "description": "HTTP is used to request and transfer web pages",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "FTP transfers files; HTTP transfers web pages.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0021",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0021",
      "questionNumber": 21,
      "topic": "Computer networks",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain one advantage of IMAP compared with POP for someone who checks email on a phone and a laptop.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0021-point-1",
          "description": "IMAP keeps emails on the server (POP usually downloads and removes them)",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0021-point-2",
          "description": "So emails are synchronised and available on both devices",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "IMAP keeps messages on the server, so both devices show the same emails.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0022",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0022",
      "questionNumber": 22,
      "topic": "Cybersecurity",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain what data interception is and how encryption reduces its impact.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0022-point-1",
          "description": "Data is captured while being transmitted (e.g. packet sniffing)",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0022-point-2",
          "description": "Attacker can read sensitive information such as passwords",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0022-point-3",
          "description": "Encrypted data cannot be understood without the key",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Attackers capture packets in transit; encryption means captured data is unreadable.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0023",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0023",
      "questionNumber": 23,
      "topic": "Cybersecurity",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe two physical security measures that could protect a school's server room.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0023-point-1",
          "description": "Any 2 from: Locked doors / key cards / biometric locks; CCTV / alarms / security staff; Restricting access to authorised staff only.",
          "marks": 2
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Key-card locks and CCTV.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0024",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0024",
      "questionNumber": 24,
      "topic": "Cybersecurity",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Describe three rules a strong password policy should include.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0024-point-1",
          "description": "Any 3 from: Minimum length, e.g. at least 8–12 characters; Mix of upper case, lower case, numbers and symbols; Not based on personal information / dictionary words; Changed if compromised / not reused across sites; Locked out after several failed attempts.",
          "marks": 3
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Minimum length, a mix of character types and no personal or dictionary words.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0025",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0025",
      "questionNumber": 25,
      "topic": "Cybersecurity",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe what spyware does.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0025-point-1",
          "description": "Secretly monitors the user's activity, e.g. records keystrokes",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0025-point-2",
          "description": "Sends the information to a third party / attacker",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Spyware secretly records activity such as keystrokes and sends it to an attacker.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0026",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0026",
      "questionNumber": 26,
      "topic": "Cybersecurity",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Explain how a trojan differs from a virus.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0026-point-1",
          "description": "A trojan pretends to be useful/legitimate software to trick the user into installing it",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0026-point-2",
          "description": "A trojan does not replicate itself, whereas a virus copies itself into other files",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A trojan is disguised as legitimate software and doesn't self-replicate; a virus spreads by copying itself.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0027",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0027",
      "questionNumber": 27,
      "topic": "Cybersecurity",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain why anti-malware software cannot protect against all threats.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0027-point-1",
          "description": "It often relies on a database of known malware signatures",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0027-point-2",
          "description": "New (zero-day) malware may not yet be in the database",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0027-point-3",
          "description": "Social engineering attacks rely on human error rather than malware",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Signature databases don't include brand-new malware, and attacks like phishing trick people rather than software.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0028",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0028",
      "questionNumber": 28,
      "topic": "Cybersecurity",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain what a CAPTCHA is and why websites use it.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0028-point-1",
          "description": "A test that is easy for humans but hard for computers (e.g. identifying images)",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0028-point-2",
          "description": "Prevents automated bots, e.g. brute-force attacks / spam / fake accounts",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A human-verification test that stops automated bots.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0029",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0029",
      "questionNumber": 29,
      "topic": "Systems software",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Compare a graphical user interface (GUI) with a command-line interface.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0029-point-1",
          "description": "GUI uses windows, icons, menus and pointers",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0029-point-2",
          "description": "GUI is easier for beginners / intuitive",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0029-point-3",
          "description": "Command line needs commands to be typed and remembered",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0029-point-4",
          "description": "Command line uses fewer resources / faster for experts / can automate tasks",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A GUI is intuitive with icons and menus; a command line needs typed commands but is efficient and powerful for experts.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0030",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0030",
      "questionNumber": 30,
      "topic": "Systems software",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain the purpose of user management in an operating system.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0030-point-1",
          "description": "Creates user accounts with usernames and passwords",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0030-point-2",
          "description": "Controls access rights / permissions for each user",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "It manages accounts and controls what each user can access.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0031",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0031",
      "questionNumber": 31,
      "topic": "Systems software",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain why encryption software is useful on a laptop used to store student records.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0031-point-1",
          "description": "Scrambles the data so it cannot be understood without the key",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0031-point-2",
          "description": "If the laptop is lost or stolen, the data stays protected / meets data protection duties",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "If the laptop is lost or stolen, encrypted records can't be read without the key.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0032",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0032",
      "questionNumber": 32,
      "topic": "Systems software",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain why an operating system needs to manage memory.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0032-point-1",
          "description": "Allocates RAM to each running program",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0032-point-2",
          "description": "Prevents programs from overwriting each other's memory",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0032-point-3",
          "description": "Moves data between RAM and virtual memory when needed",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "The OS allocates memory to programs, keeps them separate and uses virtual memory when RAM is full.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0033",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0033",
      "questionNumber": 33,
      "topic": "Ethical, legal and environmental impacts",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain two rights that the Data Protection Act 2018 gives individuals about their personal data.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0033-point-1",
          "description": "Any 2 from: Right to see the data held about them (subject access request); Right to have incorrect data corrected; Right to have data deleted (erasure) in some circumstances; Right to object to processing / to be informed how data is used.",
          "marks": 2
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "People can request a copy of their data and have incorrect data corrected.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0034",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0034",
      "questionNumber": 34,
      "topic": "Ethical, legal and environmental impacts",
      "questionType": "discuss",
      "commandWord": "discuss",
      "question": "Discuss the impact of smartphones on society.",
      "context": "",
      "marks": 6,
      "difficulty": "higher",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch7-0034-point-1",
          "description": "Marked using the levels of response. Indicative content: Instant communication and access to information; Mobile banking, navigation and online services; Health concerns: screen time, addiction, sleep; Cyberbullying and privacy risks; Digital divide: not everyone can afford one; Environmental impact of manufacture and e-waste.",
          "marks": 6
        }
      ],
      "levelDescriptors": [
        {
          "level": 3,
          "markRange": "5-6",
          "description": "Thorough, well-developed points applied to the context; balanced and reaches a justified conclusion; accurate technical terms."
        },
        {
          "level": 2,
          "markRange": "3-4",
          "description": "Some developed points with some application to the context; partially balanced; mostly accurate terminology."
        },
        {
          "level": 1,
          "markRange": "1-2",
          "description": "Basic, mostly undeveloped points with little application to the context; limited terminology."
        }
      ],
      "modelAnswer": "Balanced discussion of benefits and drawbacks across social, ethical and environmental areas with a reasoned conclusion.",
      "examinerGuidance": [
        "Mark using the levels of response."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0035",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0035",
      "questionNumber": 35,
      "topic": "Ethical, legal and environmental impacts",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain two privacy concerns about smart speakers in the home.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0035-point-1",
          "description": "Any 2 from: Always listening for a wake word, so private conversations could be recorded; Recordings are stored on company servers / could be accessed by staff or hackers; Data may be used for targeted advertising / shared with third parties.",
          "marks": 2
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "They may record private conversations and store them on servers where they could be accessed or used for advertising.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0036",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0036",
      "questionNumber": 36,
      "topic": "Ethical, legal and environmental impacts",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "A student writes and spreads a virus that deletes files on other computers. Explain which law has been broken and why.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0036-point-1",
          "description": "Computer Misuse Act 1990",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0036-point-2",
          "description": "Unauthorised acts with intent to impair the operation of a computer / modifying data without permission",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "The Computer Misuse Act: spreading malware is an unauthorised act intended to impair computers.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0037",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0037",
      "questionNumber": 37,
      "topic": "Ethical, legal and environmental impacts",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain what a software licence is.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0037-point-1",
          "description": "A legal agreement setting out how software can be used",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0037-point-2",
          "description": "e.g. how many users/devices, whether it can be copied, modified or shared",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A legal agreement stating how software may be used, copied or shared.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0038",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0038",
      "questionNumber": 38,
      "topic": "Algorithms",
      "questionType": "algorithm-design",
      "commandWord": "write",
      "question": "Write an algorithm using OCR Exam Reference Language that performs a linear search for a value target in an array names and outputs whether it is found.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch7-0038-point-1",
          "description": "Loop through every index of the array (e.g. for i = 0 to names.length - 1)",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0038-point-2",
          "description": "Compare names[i] with target",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0038-point-3",
          "description": "Record/flag when found (and may stop early)",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0038-point-4",
          "description": "Output found / not found correctly",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "found = false\nfor i = 0 to names.length - 1\n  if names[i] == target then\n    found = true\n  endif\nnext i\nif found then print(\"Found\") else print(\"Not found\") endif",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0039",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0039",
      "questionNumber": 39,
      "topic": "Algorithms",
      "questionType": "explain",
      "commandWord": "state",
      "question": "State the flowchart symbol used for each: a process, a decision, an input/output, and the start/end.",
      "context": "",
      "marks": 4,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0039-point-1",
          "description": "Process: rectangle",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0039-point-2",
          "description": "Decision: diamond",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0039-point-3",
          "description": "Input/output: parallelogram",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0039-point-4",
          "description": "Start/end: rounded rectangle (terminator)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Rectangle, diamond, parallelogram, rounded rectangle.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0040",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0040",
      "questionNumber": 40,
      "topic": "Algorithms",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "What is the maximum number of passes a bubble sort needs to sort 6 items? Explain your answer.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0040-point-1",
          "description": "5 passes (n − 1)",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0040-point-2",
          "description": "Each pass moves the largest unsorted item into its final position, so after 5 passes the last item must also be in place",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "5, because each pass fixes one more item in place and the final item is then automatically sorted.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0041",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0041",
      "questionNumber": 41,
      "topic": "Algorithms",
      "questionType": "explain",
      "commandWord": "define",
      "question": "Explain what is meant by an efficient algorithm.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0041-point-1",
          "description": "Solves the problem using fewer steps / less time",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0041-point-2",
          "description": "and/or less memory than alternative algorithms",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "It solves the problem in less time or using less memory.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0042",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0042",
      "questionNumber": 42,
      "topic": "Algorithms",
      "questionType": "complete-table",
      "commandWord": "complete",
      "question": "A program calculates the area of a rectangle from its width and height and displays it. Identify the inputs, process and output.",
      "context": "",
      "marks": 3,
      "difficulty": "foundation",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0042-point-1",
          "description": "Inputs: width and height",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0042-point-2",
          "description": "Process: area = width × height",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0042-point-3",
          "description": "Output: the area",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Inputs width and height; process width × height; output area.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0043",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0043",
      "questionNumber": 43,
      "topic": "Programming",
      "questionType": "code-tracing",
      "commandWord": "trace",
      "question": "State the value of s after this code runs:\ns = \"\"\nfor i = 1 to 3\n  s = s + str(i * i)\nnext i",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0043-point-1",
          "description": "Values added: \"1\", \"4\", \"9\" (concatenated as strings)",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0043-point-2",
          "description": "s = \"149\"",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "\"149\"",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0044",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0044",
      "questionNumber": 44,
      "topic": "Programming",
      "questionType": "calculation",
      "commandWord": "calculate",
      "question": "State the results of 17 MOD 5 and 17 DIV 5.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0044-point-1",
          "description": "17 MOD 5 = 2",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0044-point-2",
          "description": "17 DIV 5 = 3",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "2 and 3",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0045",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0045",
      "questionNumber": 45,
      "topic": "Programming",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Explain the difference between = and == in OCR Exam Reference Language.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0045-point-1",
          "description": "= assigns a value to a variable",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0045-point-2",
          "description": "== compares two values for equality",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "= is assignment; == tests whether two values are equal.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0046",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0046",
      "questionNumber": 46,
      "topic": "Programming",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain what a record is and when it would be used.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0046-point-1",
          "description": "A data structure that groups related fields of different data types",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0046-point-2",
          "description": "Example: a student record with name (string), age (integer), enrolled (Boolean)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A record groups related fields of different types, such as a student's name, age and form.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0047",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0047",
      "questionNumber": 47,
      "topic": "Databases and SQL",
      "questionType": "code-completion",
      "commandWord": "write",
      "question": "A table Books has fields BookID, Title, Author and Price. Write an SQL query to show the title and price of every book costing more than £10.",
      "context": "",
      "marks": 3,
      "difficulty": "foundation",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch7-0047-point-1",
          "description": "SELECT Title, Price",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0047-point-2",
          "description": "FROM Books",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0047-point-3",
          "description": "WHERE Price > 10",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "SELECT Title, Price FROM Books WHERE Price > 10;",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0048",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0048",
      "questionNumber": 48,
      "topic": "Programming",
      "questionType": "code-completion",
      "commandWord": "write",
      "question": "Write a procedure greet that takes a name as a parameter and prints \"Hello\" followed by the name.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch7-0048-point-1",
          "description": "procedure greet(name) … endprocedure (or def greet(name):)",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0048-point-2",
          "description": "print(\"Hello \" + name)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "procedure greet(name)\n  print(\"Hello \" + name)\nendprocedure",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0049",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0049",
      "questionNumber": 49,
      "topic": "Programming",
      "questionType": "explain",
      "commandWord": "define",
      "question": "Explain what concatenation is and give an example.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0049-point-1",
          "description": "Joining strings together",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0049-point-2",
          "description": "Example, e.g. \"Year\" + \"11\" gives \"Year11\"",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Joining strings, e.g. \"Year\" + \"11\" = \"Year11\".",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0050",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0050",
      "questionNumber": 50,
      "topic": "Programming",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain how a 2D array could store the state of a noughts-and-crosses board.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0050-point-1",
          "description": "A 3 × 3 array (rows and columns)",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0050-point-2",
          "description": "Each element stores \"X\", \"O\" or empty for that square",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0050-point-3",
          "description": "Accessed using board[row][column]",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A 3 × 3 array where board[row][column] holds X, O or empty.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0051",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0051",
      "questionNumber": 51,
      "topic": "Boolean logic",
      "questionType": "scenario-application",
      "commandWord": "write",
      "question": "A door opens (D) if a valid card is presented (C) and either the correct PIN is entered (P) or the master override is used (M). Write a Boolean expression for D.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch7-0051-point-1",
          "description": "C AND …",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0051-point-2",
          "description": "(P OR M) correctly bracketed: D = C AND (P OR M)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "D = C AND (P OR M)",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0052",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0052",
      "questionNumber": 52,
      "topic": "Defensive design",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain why a program might require authentication, and give one method.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0052-point-1",
          "description": "Confirms the identity of the user so only authorised people gain access",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0052-point-2",
          "description": "Method: username and password / PIN / biometrics / two-factor code",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "To confirm only authorised users can access it, e.g. a username and password.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0053",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0053",
      "questionNumber": 53,
      "topic": "Software development and testing",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Explain the difference between a syntax error found by a translator and an error found during testing with test data.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0053-point-1",
          "description": "Syntax errors break the rules of the language and are reported by the translator before the program runs",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0053-point-2",
          "description": "Logic errors are found by testing: the program runs but gives wrong results compared with the expected outcome",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "The translator reports syntax errors; testing against expected results reveals logic errors.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0054",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0054",
      "questionNumber": 54,
      "topic": "Software development and testing",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain why expected results should be recorded in a test plan before testing takes place.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0054-point-1",
          "description": "Gives something to compare the actual results against",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0054-point-2",
          "description": "Prevents the tester assuming whatever happens is correct",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Writing expected results first gives an objective standard so wrong outputs are spotted.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0055",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0055",
      "questionNumber": 55,
      "topic": "Programming languages and IDEs",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain how a run-time environment in an IDE helps a programmer.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0055-point-1",
          "description": "Lets the program be run and tested within the IDE",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0055-point-2",
          "description": "Shows outputs / errors as the program runs, so problems are found quickly",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "It lets code be run inside the IDE so output and errors appear immediately.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0056",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0056",
      "questionNumber": 56,
      "topic": "Memory and storage",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain why flash memory is used in smartphones rather than magnetic storage.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0056-point-1",
          "description": "No moving parts so it is durable if dropped",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0056-point-2",
          "description": "Small and lightweight / compact",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0056-point-3",
          "description": "Low power use / fast access",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Flash has no moving parts, is compact and uses little power.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0057",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0057",
      "questionNumber": 57,
      "topic": "Data representation",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain why a programmer might choose a Boolean data type for a variable called gameOver.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0057-point-1",
          "description": "gameOver only needs two values: True or False",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0057-point-2",
          "description": "Uses minimal memory / makes the code clear",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "It only ever needs to be True or False.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0058",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0058",
      "questionNumber": 58,
      "topic": "Computer organisation",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe the purpose of the address bus, data bus and control bus.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0058-point-1",
          "description": "Address bus carries the memory address to be accessed",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0058-point-2",
          "description": "Data bus carries data/instructions between the CPU, memory and I/O",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0058-point-3",
          "description": "Control bus carries control signals, e.g. read/write, clock, interrupt",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Address bus: addresses; data bus: data; control bus: control signals.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0059",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0059",
      "questionNumber": 59,
      "topic": "Computer organisation",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain why the address bus is unidirectional but the data bus is bidirectional.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0059-point-1",
          "description": "Addresses are only sent from the CPU to memory",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0059-point-2",
          "description": "Data travels both ways: read from and written to memory",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "The CPU only sends addresses, but data moves in both directions.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0060",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0060",
      "questionNumber": 60,
      "topic": "Computer organisation",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe the Harvard architecture and give one situation where it is used.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0060-point-1",
          "description": "Instructions and data are stored in separate memories",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0060-point-2",
          "description": "Separate buses allow an instruction and data to be accessed at the same time",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0060-point-3",
          "description": "Used in embedded systems / microcontrollers / digital signal processors",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Separate instruction and data memories with separate buses allow simultaneous access; common in embedded systems.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0061",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0061",
      "questionNumber": 61,
      "topic": "Computer organisation",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain how modern processors combine features of Von Neumann and Harvard architectures.",
      "context": "",
      "marks": 2,
      "difficulty": "higher",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0061-point-1",
          "description": "Main memory is shared by instructions and data (Von Neumann)",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0061-point-2",
          "description": "Separate instruction and data caches inside the CPU (Harvard) allow simultaneous access",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "They use shared main memory but split L1 caches for instructions and data.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0062",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0062",
      "questionNumber": 62,
      "topic": "Computer organisation",
      "questionType": "scenario-application",
      "commandWord": "describe",
      "question": "A supermarket installs self-service checkouts. Identify three input devices they need and the purpose of each.",
      "context": "",
      "marks": 3,
      "difficulty": "foundation",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0062-point-1",
          "description": "Barcode scanner to read product codes",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0062-point-2",
          "description": "Touchscreen to select options / items",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0062-point-3",
          "description": "Card reader / NFC reader for payment (or weighing scale to check items)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Barcode scanner, touchscreen and contactless card reader.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0063",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0063",
      "questionNumber": 63,
      "topic": "Computer organisation",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain what is meant by cloud (virtual) storage and one drawback.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0063-point-1",
          "description": "Data is stored on remote servers accessed over the internet",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0063-point-2",
          "description": "Drawback: needs an internet connection / security and privacy concerns / ongoing cost",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Data is held on remote servers; it depends on internet access.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0064",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0064",
      "questionNumber": 64,
      "topic": "Programming",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe what happens during the lexical analysis stage of compilation.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0064-point-1",
          "description": "Whitespace and comments are removed",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0064-point-2",
          "description": "Code is split into tokens (keywords, identifiers, operators)",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0064-point-3",
          "description": "Identifiers are added to a symbol table",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Comments and whitespace are removed, code is converted into tokens and identifiers go into the symbol table.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0065",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0065",
      "questionNumber": 65,
      "topic": "Programming",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe what happens during the syntax analysis stage of compilation.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0065-point-1",
          "description": "Tokens are checked against the rules (grammar) of the language",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0065-point-2",
          "description": "An abstract syntax tree is built",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0065-point-3",
          "description": "Syntax errors are reported",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Tokens are checked against grammar rules, an abstract syntax tree is built and errors are reported.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0066",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0066",
      "questionNumber": 66,
      "topic": "Programming",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe the code generation and optimisation stages of compilation.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0066-point-1",
          "description": "Code generation produces object/machine code from the syntax tree",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0066-point-2",
          "description": "Optimisation removes redundant code / makes code run faster or use less memory",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0066-point-3",
          "description": "Optimisation may make compilation take longer",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Machine code is generated from the syntax tree, then optimised to run faster or use less memory.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0067",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0067",
      "questionNumber": 67,
      "topic": "Programming",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain what a software library is and two benefits of using one.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0067-point-1",
          "description": "Pre-written, tested code (subroutines) that can be used in programs",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0067-point-2",
          "description": "Saves development time",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0067-point-3",
          "description": "Code is already tested so fewer errors / written by experts",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Libraries provide pre-written, tested routines that save time and reduce errors.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0068",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0068",
      "questionNumber": 68,
      "topic": "Operating systems",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe the multi-level feedback queue scheduling algorithm.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0068-point-1",
          "description": "Several queues with different priorities",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0068-point-2",
          "description": "Processes can move between queues depending on their behaviour",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0068-point-3",
          "description": "e.g. processes using a lot of CPU time move to lower priority; waiting processes move up to prevent starvation",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Multiple priority queues; processes move between them based on CPU use and waiting time.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0069",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0069",
      "questionNumber": 69,
      "topic": "Operating systems",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe first come first served scheduling and one disadvantage.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0069-point-1",
          "description": "Processes are run in the order they arrive, each to completion",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0069-point-2",
          "description": "Disadvantage: a long process makes short ones wait / no priority",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Jobs run in arrival order; long jobs hold up short ones.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0070",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0070",
      "questionNumber": 70,
      "topic": "Operating systems",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain what a distributed operating system is.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0070-point-1",
          "description": "Runs across multiple computers",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0070-point-2",
          "description": "Makes them appear to the user as a single system / shares processing between them",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "An OS spread across several machines that appear as one system.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0071",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0071",
      "questionNumber": 71,
      "topic": "Operating systems",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Describe two characteristics of an embedded operating system.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0071-point-1",
          "description": "Any 2 from: Designed for a specific task / limited functions; Runs on limited hardware: small memory, low power; Often real-time / very reliable.",
          "marks": 2
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "It is built for one task and runs reliably on hardware with little memory and power.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0072",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0072",
      "questionNumber": 72,
      "topic": "Software development",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe the spiral model of software development.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0072-point-1",
          "description": "Development passes repeatedly through phases (planning, risk analysis, engineering, evaluation)",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0072-point-2",
          "description": "Risk analysis takes place in every cycle",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0072-point-3",
          "description": "Suited to large, high-risk projects",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Repeated cycles of planning, risk analysis, building and evaluation, suited to large risky projects.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0073",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0073",
      "questionNumber": 73,
      "topic": "Software development",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain how extreme programming (XP) copes with changing customer requirements.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0073-point-1",
          "description": "Short iterations / frequent small releases",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0073-point-2",
          "description": "The customer is involved throughout and writes user stories",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0073-point-3",
          "description": "Requirements can be changed at the start of each iteration",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "XP releases small increments often with the customer involved, so requirements can change each iteration.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0074",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0074",
      "questionNumber": 74,
      "topic": "Computer organisation",
      "questionType": "code-completion",
      "commandWord": "write",
      "question": "Write a Little Man Computer program that inputs two numbers and outputs the larger one.",
      "context": "",
      "marks": 4,
      "difficulty": "higher",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch7-0074-point-1",
          "description": "Inputs and stores both numbers (INP, STA)",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0074-point-2",
          "description": "Subtracts one from the other (SUB)",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0074-point-3",
          "description": "Uses BRP/BRZ to branch on the result",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0074-point-4",
          "description": "Outputs the correct larger value and halts, with DAT locations declared",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "      INP\n      STA A\n      INP\n      STA B\n      SUB A\n      BRP BIG\n      LDA A\n      OUT\n      HLT\nBIG   LDA B\n      OUT\n      HLT\nA     DAT\nB     DAT",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0075",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0075",
      "questionNumber": 75,
      "topic": "Computer organisation",
      "questionType": "explain",
      "commandWord": "state",
      "question": "State what the LMC instructions BRA, BRZ and BRP do.",
      "context": "",
      "marks": 3,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0075-point-1",
          "description": "BRA: branch always (unconditional jump)",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0075-point-2",
          "description": "BRZ: branch if the accumulator is zero",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0075-point-3",
          "description": "BRP: branch if the accumulator is zero or positive",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "BRA always; BRZ if zero; BRP if zero or positive.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0076",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0076",
      "questionNumber": 76,
      "topic": "Computer organisation",
      "questionType": "code-tracing",
      "commandWord": "trace",
      "question": "State all the outputs of this LMC program when the input is 3:\n      INP\nLOOP  OUT\n      SUB ONE\n      BRP LOOP\n      HLT\nONE   DAT 1",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0076-point-1",
          "description": "Outputs 3, 2, 1",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0076-point-2",
          "description": "then 0 (BRP branches when the accumulator is 0), then halts",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "3, 2, 1, 0",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0077",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0077",
      "questionNumber": 77,
      "topic": "Computer organisation",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain indirect addressing.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0077-point-1",
          "description": "The operand holds the address of a memory location",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0077-point-2",
          "description": "That location contains the address of the data to be used",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "The operand points to a location that holds the address of the data.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0078",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0078",
      "questionNumber": 78,
      "topic": "Computer organisation",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain indexed addressing and why it is useful for arrays.",
      "context": "",
      "marks": 2,
      "difficulty": "higher",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0078-point-1",
          "description": "Address of data = operand + value in the index register",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0078-point-2",
          "description": "Incrementing the index register steps through consecutive array elements",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "The effective address is the operand plus the index register, so incrementing the register moves through an array.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0079",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0079",
      "questionNumber": 79,
      "topic": "Computer organisation",
      "questionType": "explain",
      "commandWord": "define",
      "question": "Explain the terms opcode and operand.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0079-point-1",
          "description": "Opcode: the part of the instruction that specifies the operation",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0079-point-2",
          "description": "Operand: the data or address the operation uses",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "The opcode is the operation; the operand is the data or address it uses.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0080",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0080",
      "questionNumber": 80,
      "topic": "Data representation",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe how dictionary encoding compresses data.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0080-point-1",
          "description": "Repeated words/patterns are stored once in a dictionary",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0080-point-2",
          "description": "Each is given a short code/index",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0080-point-3",
          "description": "The data is replaced with the codes, so the file is smaller and can be reconstructed exactly",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Repeated patterns are listed once in a dictionary and replaced by short codes.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0081",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0081",
      "questionNumber": 81,
      "topic": "Data representation",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "Compress WWWWBBBWW using run length encoding.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0081-point-1",
          "description": "Runs identified: 4 W, 3 B, 2 W",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0081-point-2",
          "description": "Encoded: 4W3B2W (or W4B3W2)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "4W 3B 2W",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0082",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0082",
      "questionNumber": 82,
      "topic": "Cybersecurity",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Give two uses of hashing other than storing passwords.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0082-point-1",
          "description": "Any 2 from: Hash tables for fast data lookup; Checking file/data integrity (comparing checksums); Digital signatures.",
          "marks": 2
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Hash tables and checking that downloaded files haven't been altered.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0083",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0083",
      "questionNumber": 83,
      "topic": "Databases",
      "questionType": "explain",
      "commandWord": "define",
      "question": "Explain the difference between a primary key, a secondary key and a foreign key.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0083-point-1",
          "description": "Primary key uniquely identifies each record",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0083-point-2",
          "description": "Secondary key is an indexed field used to search/sort records (not necessarily unique)",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0083-point-3",
          "description": "Foreign key is a field that links to the primary key of another table",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Primary key identifies records; a secondary key is indexed for searching; a foreign key links to another table.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0084",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0084",
      "questionNumber": 84,
      "topic": "Databases",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain what an entity relationship diagram shows.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0084-point-1",
          "description": "The entities (tables) in a database",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0084-point-2",
          "description": "The relationships between them and their degree (one-to-one, one-to-many, many-to-many)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Entities and the type of relationship between them.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0085",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0085",
      "questionNumber": 85,
      "topic": "Databases",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain why data is often exchanged between systems in formats such as CSV or JSON.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0085-point-1",
          "description": "Standard, platform-independent text formats",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0085-point-2",
          "description": "Can be read/imported by many different programs",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0085-point-3",
          "description": "Structure (fields/keys) is preserved",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "They are standard text formats that different systems can read while keeping the data's structure.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0086",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0086",
      "questionNumber": 86,
      "topic": "Databases",
      "questionType": "code-completion",
      "commandWord": "write",
      "question": "Write SQL to add a student with StudentID 2001 and Name 'Amy' to the Students table.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch7-0086-point-1",
          "description": "INSERT INTO Students (StudentID, Name)",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0086-point-2",
          "description": "VALUES (2001, 'Amy')",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "INSERT INTO Students (StudentID, Name) VALUES (2001, 'Amy');",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0087",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0087",
      "questionNumber": 87,
      "topic": "Databases",
      "questionType": "code-completion",
      "commandWord": "write",
      "question": "Write SQL to show all students whose surname begins with S.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch7-0087-point-1",
          "description": "SELECT * FROM Students WHERE Surname",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0087-point-2",
          "description": "LIKE 'S%'",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "SELECT * FROM Students WHERE Surname LIKE 'S%';",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0088",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0088",
      "questionNumber": 88,
      "topic": "Databases",
      "questionType": "code-completion",
      "commandWord": "write",
      "question": "Write SQL to permanently remove the table Archive from the database.",
      "context": "",
      "marks": 1,
      "difficulty": "foundation",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch7-0088-point-1",
          "description": "DROP TABLE Archive",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "DROP TABLE Archive;",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0089",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0089",
      "questionNumber": 89,
      "topic": "Networking",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe the contents of a data packet.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0089-point-1",
          "description": "Header: source and destination addresses, packet number, protocol",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0089-point-2",
          "description": "Payload: the actual data being sent",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0089-point-3",
          "description": "Trailer: error-checking data (e.g. checksum) / end-of-packet marker",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A header with addresses and sequence number, the payload and a trailer with a checksum.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0090",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0090",
      "questionNumber": 90,
      "topic": "Networking",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain the role of the link layer in the TCP/IP stack.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0090-point-1",
          "description": "Handles transmission across the physical network / between devices on the same network",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0090-point-2",
          "description": "Adds MAC addresses / converts data into signals",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "It moves data across the physical network using MAC addresses.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0091",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0091",
      "questionNumber": 91,
      "topic": "Networking",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe the roles of HTML, CSS and JavaScript in a web page.",
      "context": "",
      "marks": 3,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0091-point-1",
          "description": "HTML defines the structure and content",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0091-point-2",
          "description": "CSS controls the presentation / style / layout",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0091-point-3",
          "description": "JavaScript adds interactivity / runs code in the browser",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "HTML structures content, CSS styles it and JavaScript makes it interactive.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0092",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0092",
      "questionNumber": 92,
      "topic": "Networking",
      "questionType": "code-completion",
      "commandWord": "write",
      "question": "Write the HTML to create a hyperlink with the text 'Visit' that links to https://www.example.com.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch7-0092-point-1",
          "description": "<a href=\"https://www.example.com\">",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0092-point-2",
          "description": "Visit</a>",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "<a href=\"https://www.example.com\">Visit</a>",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0093",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0093",
      "questionNumber": 93,
      "topic": "Networking",
      "questionType": "code-completion",
      "commandWord": "write",
      "question": "Write CSS to make every h1 heading blue and centred.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch7-0093-point-1",
          "description": "Selector h1 { }",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0093-point-2",
          "description": "color: blue;",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0093-point-3",
          "description": "text-align: center;",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "h1 { color: blue; text-align: center; }",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0094",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0094",
      "questionNumber": 94,
      "topic": "Networking",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Compare using an external CSS style sheet with inline styles.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0094-point-1",
          "description": "External sheet applies the same style to many pages / consistent design",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0094-point-2",
          "description": "Changes made in one place update the whole site",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0094-point-3",
          "description": "Inline styles apply to a single element only and are repeated / harder to maintain",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "An external sheet styles every page from one file; inline styles must be changed element by element.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0095",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0095",
      "questionNumber": 95,
      "topic": "Networking",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Explain the difference between client-side and server-side processing, giving an example of each.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0095-point-1",
          "description": "Client-side code runs in the user's browser",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0095-point-2",
          "description": "Example: JavaScript checking a form field is filled in / animations",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0095-point-3",
          "description": "Server-side code runs on the web server",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0095-point-4",
          "description": "Example: querying a database / processing a login or payment",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Client-side runs in the browser (e.g. instant form checks); server-side runs on the server (e.g. database queries).",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0096",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0096",
      "questionNumber": 96,
      "topic": "Networking",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain why a website should validate form data on the server even if it is already validated by JavaScript in the browser.",
      "context": "",
      "marks": 2,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0096-point-1",
          "description": "Client-side code can be disabled or bypassed / modified by the user",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0096-point-2",
          "description": "Server-side validation protects the database from invalid or malicious input (e.g. SQL injection)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Client-side checks can be bypassed, so the server must validate to protect its data.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0097",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0097",
      "questionNumber": 97,
      "topic": "Networking",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe how search engine indexing works.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0097-point-1",
          "description": "Crawlers/spiders visit web pages by following links",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0097-point-2",
          "description": "Keywords and page information are stored in an index",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0097-point-3",
          "description": "Searches look up the index rather than the live web",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Crawlers follow links and record keywords in an index, which is searched when a user enters a query.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0098",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0098",
      "questionNumber": 98,
      "topic": "Networking",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain how the PageRank algorithm decides the importance of a web page.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0098-point-1",
          "description": "Based on the number of other pages that link to it",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0098-point-2",
          "description": "Links from pages with a high PageRank count for more",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0098-point-3",
          "description": "A page's contribution is divided by its number of outbound links (with a damping factor)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "PageRank counts incoming links, giving more weight to links from important pages with few outbound links.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0099",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0099",
      "questionNumber": 99,
      "topic": "Networking",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "Using PR(A) = (1 − d) + d × (PR(T)/C(T)) with d = 0.85, calculate PR(A) when the only page linking to A has PageRank 1 and 2 outbound links.",
      "context": "",
      "marks": 2,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0099-point-1",
          "description": "PR(T)/C(T) = 1/2 = 0.5",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0099-point-2",
          "description": "PR(A) = 0.15 + 0.85 × 0.5 = 0.575",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "0.575",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0100",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0100",
      "questionNumber": 100,
      "topic": "Data representation",
      "questionType": "conversion",
      "commandWord": "calculate",
      "question": "Represent −19 in 8-bit sign and magnitude.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0100-point-1",
          "description": "+19 = 0010011 in the 7 magnitude bits",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0100-point-2",
          "description": "Sign bit 1: 10010011",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "10010011",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0101",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0101",
      "questionNumber": 101,
      "topic": "Data representation",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Give two disadvantages of sign and magnitude compared with two's complement.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0101-point-1",
          "description": "Any 2 from: There are two representations of zero (+0 and −0); Arithmetic is more complex / adding positive and negative numbers doesn't work directly; Range is one smaller (−127 to +127).",
          "marks": 2
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "It has two zeros and binary addition doesn't work directly with negative numbers.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0102",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0102",
      "questionNumber": 102,
      "topic": "Data representation",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "Calculate 00101100 − 00010011 using two's complement addition. Show your working.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0102-point-1",
          "description": "Two's complement of 00010011 is 11101101",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0102-point-2",
          "description": "00101100 + 11101101 = (1)00011001",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0102-point-3",
          "description": "Discard the carry: answer 00011001 (= 25)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "00011001",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0103",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0103",
      "questionNumber": 103,
      "topic": "Data representation",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "Apply the mask 00001111 to 10110110 using AND, OR and XOR. Give each result.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0103-point-1",
          "description": "AND: 00000110",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0103-point-2",
          "description": "OR: 10111111",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0103-point-3",
          "description": "XOR: 10111001",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "AND 00000110, OR 10111111, XOR 10111001",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0104",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0104",
      "questionNumber": 104,
      "topic": "Data representation",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain how an AND mask can be used to check whether bit 3 of a byte is set.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0104-point-1",
          "description": "AND the byte with a mask that has only bit 3 set (00001000)",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0104-point-2",
          "description": "If the result is non-zero the bit is set; if zero it is not",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "AND with 00001000: a non-zero result means bit 3 is 1.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0105",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0105",
      "questionNumber": 105,
      "topic": "Data representation",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "Represent 3.5 as a normalised floating-point number with an 8-bit two's complement mantissa and a 4-bit two's complement exponent.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0105-point-1",
          "description": "3.5 = 11.1 in binary",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0105-point-2",
          "description": "Normalised mantissa: 0.1110000",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0105-point-3",
          "description": "Exponent: 2 = 0010",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Mantissa 0.1110000, exponent 0010",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0106",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0106",
      "questionNumber": 106,
      "topic": "Data representation",
      "questionType": "conversion",
      "commandWord": "calculate",
      "question": "Convert the hexadecimal number 2F4 into denary.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0106-point-1",
          "description": "2 × 256 + 15 × 16 + 4",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0106-point-2",
          "description": "= 756",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "756",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0107",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0107",
      "questionNumber": 107,
      "topic": "Data structures",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Explain the difference between a record and an array.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0107-point-1",
          "description": "A record groups fields of different data types about one item",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0107-point-2",
          "description": "An array stores many items of the same data type accessed by index",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Records hold mixed-type fields; arrays hold same-type items by index.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0108",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0108",
      "questionNumber": 108,
      "topic": "Data structures",
      "questionType": "explain",
      "commandWord": "define",
      "question": "Explain what is meant by a tuple.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0108-point-1",
          "description": "An ordered collection of elements",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0108-point-2",
          "description": "Immutable: cannot be changed once created",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "An ordered, immutable set of values.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0109",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0109",
      "questionNumber": 109,
      "topic": "Data structures",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "A binary tree is stored in an array starting at index 0. State the indexes of the left and right children of the node at index i.",
      "context": "",
      "marks": 2,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0109-point-1",
          "description": "Left child: 2i + 1",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0109-point-2",
          "description": "Right child: 2i + 2",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "2i + 1 and 2i + 2",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0110",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0110",
      "questionNumber": 110,
      "topic": "Data structures",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe how an item is added (enqueued) to a circular queue stored in an array.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0110-point-1",
          "description": "Check the queue is not full",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0110-point-2",
          "description": "Move the rear pointer on by one, wrapping to 0 at the end (MOD array size)",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0110-point-3",
          "description": "Store the item at the rear pointer and update the item count",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Check for space, advance rear (wrapping round) and store the item.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0111",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0111",
      "questionNumber": 111,
      "topic": "Data structures",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain the terms directed graph, undirected graph and weighted graph.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0111-point-1",
          "description": "Directed: edges have a direction (one-way)",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0111-point-2",
          "description": "Undirected: edges can be travelled both ways",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0111-point-3",
          "description": "Weighted: each edge has a value/cost, e.g. distance",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Directed edges are one-way, undirected are two-way, weighted edges have costs.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0112",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0112",
      "questionNumber": 112,
      "topic": "Data structures",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe how a record is found in a hash table.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0112-point-1",
          "description": "The hash function is applied to the key to calculate an index",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0112-point-2",
          "description": "The record is retrieved directly from that index (checking subsequent locations if a collision occurred)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Hash the key to get the index and look there, following the collision method if needed.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0113",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0113",
      "questionNumber": 113,
      "topic": "Data structures",
      "questionType": "conversion",
      "commandWord": "calculate",
      "question": "Convert the infix expression (3 + 4) × 2 into Reverse Polish notation.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0113-point-1",
          "description": "3 4 +",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0113-point-2",
          "description": "then 2 × : 3 4 + 2 ×",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "3 4 + 2 ×",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0114",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0114",
      "questionNumber": 114,
      "topic": "Data structures",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "Evaluate the Reverse Polish expression 5 1 2 + 4 × + 3 −.",
      "context": "",
      "marks": 2,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0114-point-1",
          "description": "1 2 + = 3, then 3 4 × = 12",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0114-point-2",
          "description": "5 + 12 = 17, then 17 − 3 = 14",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "14",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0115",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0115",
      "questionNumber": 115,
      "topic": "Boolean algebra",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "Use a Karnaugh map (or Boolean algebra) to simplify A·B + A·¬B + ¬A·B.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0115-point-1",
          "description": "Groups identified: A (A·B, A·¬B) and B (A·B, ¬A·B)",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0115-point-2",
          "description": "Result: A + B",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A + B",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0116",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0116",
      "questionNumber": 116,
      "topic": "Boolean algebra",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "Simplify ¬A·¬B + ¬A·B.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0116-point-1",
          "description": "Factorise: ¬A·(¬B + B)",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0116-point-2",
          "description": "= ¬A",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "¬A",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0117",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0117",
      "questionNumber": 117,
      "topic": "Boolean algebra",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "Simplify A + ¬A·B.",
      "context": "",
      "marks": 2,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0117-point-1",
          "description": "Using the distributive law: (A + ¬A)·(A + B)",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0117-point-2",
          "description": "= A + B",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A + B",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0118",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0118",
      "questionNumber": 118,
      "topic": "Boolean algebra",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain the purpose of a Karnaugh map and one rule for grouping.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0118-point-1",
          "description": "A visual method for simplifying Boolean expressions",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0118-point-2",
          "description": "Rule: groups must contain 1s in powers of two (1, 2, 4, 8) / be rectangular / can wrap around edges / be as large as possible",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "It simplifies Boolean expressions visually; groups must be powers of two and as large as possible.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0119",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0119",
      "questionNumber": 119,
      "topic": "Boolean algebra",
      "questionType": "explain",
      "commandWord": "state",
      "question": "Write Boolean expressions for the sum and carry-out of a full adder with inputs A, B and carry-in C.",
      "context": "",
      "marks": 2,
      "difficulty": "higher",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0119-point-1",
          "description": "Sum = A ⊕ B ⊕ C",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0119-point-2",
          "description": "Carry-out = A·B + C·(A ⊕ B)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Sum = A ⊕ B ⊕ C; Cout = A·B + C·(A ⊕ B)",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0120",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0120",
      "questionNumber": 120,
      "topic": "Boolean algebra",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "Show that ¬(A·B) + A = 1.",
      "context": "",
      "marks": 2,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0120-point-1",
          "description": "De Morgan: ¬(A·B) = ¬A + ¬B",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0120-point-2",
          "description": "¬A + ¬B + A = (A + ¬A) + ¬B = 1 + ¬B = 1",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "1",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0121",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0121",
      "questionNumber": 121,
      "topic": "Ethical, legal and environmental impacts",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain how the Copyright, Designs and Patents Act 1988 applies to software.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0121-point-1",
          "description": "Software code is protected as the creator's intellectual property",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0121-point-2",
          "description": "Copying, distributing or using it without a licence/permission is illegal",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Software is protected by copyright, so it can't be copied or shared without a licence.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0122",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0122",
      "questionNumber": 122,
      "topic": "Ethical, legal and environmental impacts",
      "questionType": "discuss",
      "commandWord": "discuss",
      "question": "Discuss the impact of automation and artificial intelligence on employment.",
      "context": "",
      "marks": 9,
      "difficulty": "higher",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch7-0122-point-1",
          "description": "Marked using the levels of response. Indicative content: Routine/manual jobs replaced, e.g. factory work, checkout staff; New jobs created in technology, maintenance and data; Productivity and cost savings for businesses; Need for retraining and lifelong learning; Inequality between those with and without digital skills; Ethical responsibility of companies and governments.",
          "marks": 9
        }
      ],
      "levelDescriptors": [
        {
          "level": 3,
          "markRange": "7-9",
          "description": "Comprehensive, well-structured discussion applied to the scenario; considers several perspectives and reaches a supported conclusion; precise terminology."
        },
        {
          "level": 2,
          "markRange": "4-6",
          "description": "Reasonable discussion with some application and some balance; conclusion may be partly supported; generally accurate terminology."
        },
        {
          "level": 1,
          "markRange": "1-3",
          "description": "Limited discussion, mostly descriptive with little application or balance; some inaccuracies."
        }
      ],
      "modelAnswer": "Weighs job losses against new roles and productivity, considers retraining and inequality, and reaches a supported conclusion.",
      "examinerGuidance": [
        "Mark using the levels of response."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0123",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0123",
      "questionNumber": 123,
      "topic": "Ethical, legal and environmental impacts",
      "questionType": "discuss",
      "commandWord": "discuss",
      "question": "Discuss the arguments for and against governments censoring internet content.",
      "context": "",
      "marks": 6,
      "difficulty": "higher",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch7-0123-point-1",
          "description": "Marked using the levels of response. Indicative content: For: protecting children from harmful content; For: preventing illegal content / terrorism / crime; Against: freedom of speech and access to information; Against: risk of political misuse / suppressing dissent; Who decides what is harmful; cultural differences between countries; Practical issues: VPNs bypass censorship.",
          "marks": 6
        }
      ],
      "levelDescriptors": [
        {
          "level": 3,
          "markRange": "5-6",
          "description": "Thorough, well-developed points applied to the context; balanced and reaches a justified conclusion; accurate technical terms."
        },
        {
          "level": 2,
          "markRange": "3-4",
          "description": "Some developed points with some application to the context; partially balanced; mostly accurate terminology."
        },
        {
          "level": 1,
          "markRange": "1-2",
          "description": "Basic, mostly undeveloped points with little application to the context; limited terminology."
        }
      ],
      "modelAnswer": "Balanced discussion of protection against freedom of expression, with a reasoned conclusion.",
      "examinerGuidance": [
        "Mark using the levels of response."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0124",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0124",
      "questionNumber": 124,
      "topic": "Ethical, legal and environmental impacts",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain why penetration testing does not break the Computer Misuse Act.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0124-point-1",
          "description": "The Act makes unauthorised access an offence",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0124-point-2",
          "description": "Penetration testers have the owner's permission/authorisation",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Testers are authorised by the system owner, so their access isn't unauthorised.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0125",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0125",
      "questionNumber": 125,
      "topic": "Ethical, legal and environmental impacts",
      "questionType": "discuss",
      "commandWord": "discuss",
      "question": "Discuss the moral and legal issues raised by AI tools that generate images.",
      "context": "",
      "marks": 6,
      "difficulty": "higher",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch7-0125-point-1",
          "description": "Marked using the levels of response. Indicative content: Copyright: models trained on artists' work without permission; Ownership of generated images is unclear; Deepfakes / misinformation / reputational harm; Impact on artists' jobs and income; Benefits: accessibility, creativity, speed; Bias in generated content; need for labelling/regulation.",
          "marks": 6
        }
      ],
      "levelDescriptors": [
        {
          "level": 3,
          "markRange": "5-6",
          "description": "Thorough, well-developed points applied to the context; balanced and reaches a justified conclusion; accurate technical terms."
        },
        {
          "level": 2,
          "markRange": "3-4",
          "description": "Some developed points with some application to the context; partially balanced; mostly accurate terminology."
        },
        {
          "level": 1,
          "markRange": "1-2",
          "description": "Basic, mostly undeveloped points with little application to the context; limited terminology."
        }
      ],
      "modelAnswer": "Balances creative benefits against copyright, ownership, misinformation and employment concerns, reaching a conclusion.",
      "examinerGuidance": [
        "Mark using the levels of response."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0126",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0126",
      "questionNumber": 126,
      "topic": "Algorithms",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain how backtracking can be used to find a route through a maze.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0126-point-1",
          "description": "Follow a path, making a choice at each junction",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0126-point-2",
          "description": "When a dead end is reached, go back to the last decision point",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0126-point-3",
          "description": "Try a different untried option until the exit is found",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Follow a path and, at each dead end, return to the last junction to try another option.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0127",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0127",
      "questionNumber": 127,
      "topic": "Algorithms",
      "questionType": "explain",
      "commandWord": "define",
      "question": "Explain what is meant by data mining.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0127-point-1",
          "description": "Analysing large amounts of data",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0127-point-2",
          "description": "to find patterns, trends or relationships that are not obvious",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Searching large data sets to discover hidden patterns.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0128",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0128",
      "questionNumber": 128,
      "topic": "Algorithms",
      "questionType": "explain",
      "commandWord": "define",
      "question": "Explain what is meant by performance modelling.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0128-point-1",
          "description": "Using mathematical/simulation models to predict how a system will behave",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0128-point-2",
          "description": "e.g. testing load on a server without building or risking the real system",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Simulating or modelling a system to predict its performance before it is built or stressed.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0129",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0129",
      "questionNumber": 129,
      "topic": "Algorithms",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain the divide-and-conquer approach and give an example algorithm that uses it.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0129-point-1",
          "description": "The problem is repeatedly split into smaller sub-problems, solved and combined",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0129-point-2",
          "description": "Example: binary search / merge sort / quicksort",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Split the problem into smaller parts, e.g. merge sort.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0130",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0130",
      "questionNumber": 130,
      "topic": "Algorithms",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain how visualisation helps solve problems.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0130-point-1",
          "description": "Presenting data or processes as diagrams/graphs/charts",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0130-point-2",
          "description": "Makes patterns and relationships easier to understand",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Turning data into diagrams or graphs makes patterns easier to see.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0131",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0131",
      "questionNumber": 131,
      "topic": "Algorithms",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain what is meant by thinking procedurally.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0131-point-1",
          "description": "Breaking a problem into sub-procedures/modules (decomposition)",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0131-point-2",
          "description": "Identifying the order in which the steps must be carried out",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Decomposing the problem into sub-procedures and ordering them.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0132",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0132",
      "questionNumber": 132,
      "topic": "Algorithms",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain what is meant by thinking logically when designing a solution.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0132-point-1",
          "description": "Identifying the points where decisions must be made",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0132-point-2",
          "description": "Determining the conditions that affect the outcome / the flow of the program",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Identifying decision points and the conditions that control the program's flow.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0133",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0133",
      "questionNumber": 133,
      "topic": "Programming",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain what is meant by modular programming and two benefits.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0133-point-1",
          "description": "Program is split into separate self-contained modules/subroutines",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0133-point-2",
          "description": "Modules can be developed and tested independently / by different people",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0133-point-3",
          "description": "Modules can be reused in other programs / easier maintenance",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Splitting code into independent modules that can be tested separately and reused.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0134",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0134",
      "questionNumber": 134,
      "topic": "Programming",
      "questionType": "code-completion",
      "commandWord": "write",
      "question": "Write a function countVowels(text) that returns the number of vowels (a, e, i, o, u) in a string, ignoring case.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch7-0134-point-1",
          "description": "Function with parameter and a counter initialised to 0",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0134-point-2",
          "description": "Loops through each character",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0134-point-3",
          "description": "Checks case-insensitively whether it is a vowel",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0134-point-4",
          "description": "Returns the count",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "def countVowels(text):\n    count = 0\n    for ch in text.lower():\n        if ch in \"aeiou\":\n            count += 1\n    return count",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0135",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0135",
      "questionNumber": 135,
      "topic": "Object-oriented programming",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Explain the difference between public and private attributes.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0135-point-1",
          "description": "Public attributes can be accessed from outside the class",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0135-point-2",
          "description": "Private attributes can only be accessed by the class's own methods",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Public attributes are accessible anywhere; private ones only within the class.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0136",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0136",
      "questionNumber": 136,
      "topic": "Object-oriented programming",
      "questionType": "code-completion",
      "commandWord": "write",
      "question": "A class Rectangle has private attributes width and height. Write a method getArea that returns the area.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch7-0136-point-1",
          "description": "Method header inside the class (e.g. public function getArea())",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0136-point-2",
          "description": "Returns width × height",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "public function getArea()\n  return width * height\nendfunction",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0137",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0137",
      "questionNumber": 137,
      "topic": "Object-oriented programming",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain what getter and setter methods are and why a setter might include validation.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0137-point-1",
          "description": "A getter returns the value of a private attribute",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0137-point-2",
          "description": "A setter changes the value of a private attribute",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0137-point-3",
          "description": "Validation in the setter stops invalid values being stored, e.g. a negative age",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Getters return and setters change private attributes; a setter can reject invalid values.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0138",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0138",
      "questionNumber": 138,
      "topic": "Computational complexity",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain why merge sort has a time complexity of O(n log n).",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0138-point-1",
          "description": "The list is halved repeatedly, giving log n levels",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0138-point-2",
          "description": "At each level, a total of n items are merged",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0138-point-3",
          "description": "n items × log n levels = O(n log n)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "There are log n levels of splitting, and merging at each level touches all n items.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0139",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0139",
      "questionNumber": 139,
      "topic": "Algorithms",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "A list of 10 items is almost sorted. Explain whether insertion sort or merge sort would be more suitable.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch7-0139-point-1",
          "description": "Insertion sort is close to O(n) for nearly sorted data",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0139-point-2",
          "description": "Merge sort is always O(n log n) and needs extra memory",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0139-point-3",
          "description": "For a small nearly sorted list, insertion sort is more suitable",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Insertion sort, because it runs in nearly linear time on almost-sorted data and needs no extra memory.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0140",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0140",
      "questionNumber": 140,
      "topic": "Programming",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Explain the difference between a variable and a constant, and give one reason to use a constant.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0140-point-1",
          "description": "A variable's value can change while the program runs; a constant's value cannot",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0140-point-2",
          "description": "Reason: the value only needs changing in one place / prevents accidental changes / makes code clearer",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A constant's value is fixed while the program runs, so it can't be changed by mistake and only needs editing in one place.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0141",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0141",
      "questionNumber": 141,
      "topic": "Computer organisation",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe how the call stack is used when a subroutine is called and when it returns.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0141-point-1",
          "description": "A stack frame is pushed containing the return address",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0141-point-2",
          "description": "The frame also holds parameters and local variables",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0141-point-3",
          "description": "When the subroutine ends, the frame is popped and execution continues at the return address",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Calling pushes a frame with the return address, parameters and locals; returning pops it and jumps back.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch7-0142",
    "sourceId": "cs-master-batch7",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch7-0142",
      "questionNumber": 142,
      "topic": "Networking",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain what is meant by a dynamic web page.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch7-0142-point-1",
          "description": "Content is generated when the page is requested (e.g. by server-side code)",
          "marks": 1
        },
        {
          "id": "catalogue-batch7-0142-point-2",
          "description": "Often uses data from a database, so the page can differ for each user/visit",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Its content is built at request time, often from a database, so it can change per user.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  }
];
