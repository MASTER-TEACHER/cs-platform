import type { BankQuestion } from "./bankUtilities";

/**
 * CS Master Batch 8: original practice questions written in the STYLE of OCR
 * J277/H446 past papers (binary working, address tables, SQL, trace tables,
 * logic circuits, LMC, Dijkstra, levels-of-response). No OCR question text
 * is reproduced. Guidance reflects the marking conventions in
 * lib/marking/markingRules.ts.
 */
export const batch8Questions: BankQuestion[] = [
  {
    "key": "catalogue-batch8-0001",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0001",
      "questionNumber": 1,
      "topic": "Binary arithmetic",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "Add the 8-bit binary numbers 01011011 and 00110110. Show your working.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0001-point-1",
          "description": "Working: correct carries shown in the correct columns",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0001-point-2",
          "description": "Answer: 10010001",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Carries are produced in several columns; the sum is 10010001.",
      "examinerGuidance": [
        "Carries may be written above, below or beside the digits, in any size, as long as they are in the correct columns.",
        "Converting to denary and back is not valid working (the answer mark is still available).",
        "If carries and a denary check are both shown, award the working mark."
      ],
      "commonMisconceptions": [
        "Adding each column without carrying the 1 into the next column."
      ]
    }
  },
  {
    "key": "catalogue-batch8-0002",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0002",
      "questionNumber": 2,
      "topic": "Binary arithmetic",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "Add 11010010 and 01100101 as 8-bit binary numbers. Show your working and state the problem this addition causes.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0002-point-1",
          "description": "Working: carries shown in the correct columns",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0002-point-2",
          "description": "8-bit result 00110111 (accept with an extra leading 1 shown)",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0002-point-3",
          "description": "Overflow (error): the result needs 9 bits / is greater than 255",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "The true total needs 9 bits (1 00110111). Only 00110111 fits in 8 bits, so an overflow error occurs.",
      "examinerGuidance": [
        "Accept the answer with the overflow bit shown or clearly removed.",
        "'Overflow' must be linked to the result being too large for 8 bits."
      ],
      "commonMisconceptions": [
        "Thinking overflow means the answer is wrong rather than that a bit is lost."
      ]
    }
  },
  {
    "key": "catalogue-batch8-0003",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0003",
      "questionNumber": 3,
      "topic": "Number systems",
      "questionType": "conversion",
      "commandWord": "calculate",
      "question": "Convert the hexadecimal number 9C into denary. Show your working.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0003-point-1",
          "description": "Working, e.g. 9 x 16 + 12, or via binary 1001 1100",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0003-point-2",
          "description": "Answer: 156",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "9 x 16 = 144 and C = 12, so 144 + 12 = 156.",
      "examinerGuidance": [
        "Any valid method of working is accepted.",
        "Do not award the answer mark by follow-through from incorrect working."
      ],
      "commonMisconceptions": [
        "Treating C as 13 or forgetting to multiply the first digit by 16."
      ]
    }
  },
  {
    "key": "catalogue-batch8-0004",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0004",
      "questionNumber": 4,
      "topic": "Number systems",
      "questionType": "conversion",
      "commandWord": "calculate",
      "question": "Convert the denary number 77 into an 8-bit binary number. Show your working.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0004-point-1",
          "description": "Working, e.g. place values 64 + 8 + 4 + 1 or repeated division",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0004-point-2",
          "description": "Answer: 01001101 (must be 8 bits)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "64 + 8 + 4 + 1 = 77, giving 01001101.",
      "examinerGuidance": [
        "The answer must have 8 bits, including the leading zero."
      ],
      "commonMisconceptions": [
        "Writing 1001101 without the leading zero."
      ]
    }
  },
  {
    "key": "catalogue-batch8-0005",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0005",
      "questionNumber": 5,
      "topic": "Number systems",
      "questionType": "short-response",
      "commandWord": "describe",
      "question": "The binary number 00101100 has a left shift of 2 places applied. Give the result and describe the effect on its value.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0005-point-1",
          "description": "Result: 10110000",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0005-point-2",
          "description": "The value is multiplied by 4",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Shifting left by 2 gives 10110000, which is 4 times the original value (44 becomes 176).",
      "examinerGuidance": [
        "Accept 'multiplied by 2 squared'."
      ],
      "commonMisconceptions": [
        "Confusing left shifts (multiply) with right shifts (divide)."
      ]
    }
  },
  {
    "key": "catalogue-batch8-0006",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0006",
      "questionNumber": 6,
      "topic": "Number systems",
      "questionType": "short-response",
      "commandWord": "describe",
      "question": "Perform a right shift of 3 places on the binary number 11001000. Give the result and state the effect on the denary value.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0006-point-1",
          "description": "Result: 00011001",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0006-point-2",
          "description": "The value is divided by 8 (200 becomes 25)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "11001000 shifted right 3 places is 00011001: the value is divided by 8.",
      "examinerGuidance": [
        "The description must give both the direction and the effect."
      ],
      "commonMisconceptions": [
        "Adding zeros on the wrong side."
      ]
    }
  },
  {
    "key": "catalogue-batch8-0007",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0007",
      "questionNumber": 7,
      "topic": "Data representation",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "A photograph is 1200 pixels wide and 800 pixels high with a colour depth of 24 bits. Calculate its file size in megabytes. Show your working.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0007-point-1",
          "description": "Working stage: 1200 x 800 (= 960 000 pixels)",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0007-point-2",
          "description": "Working stage: x 24 then / 8 (= 2 880 000 bytes)",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0007-point-3",
          "description": "Answer: 2.88 MB (accept 2.75 MB using 1024)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "960 000 pixels x 24 bits = 23 040 000 bits; / 8 = 2 880 000 bytes; / 1 000 000 = 2.88 MB.",
      "examinerGuidance": [
        "Award each working mark for any correct stage even if the final answer is wrong.",
        "Accept division by 1000 or 1024."
      ],
      "commonMisconceptions": [
        "Forgetting to divide by 8 to convert bits to bytes."
      ]
    }
  },
  {
    "key": "catalogue-batch8-0008",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0008",
      "questionNumber": 8,
      "topic": "Data representation",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "A mono sound clip lasts 30 seconds. It is recorded with a sample rate of 40 000 Hz and a bit depth of 16 bits. Calculate the file size in kilobytes. Show your working.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0008-point-1",
          "description": "Working: 30 x 40 000 x 16 (= 19 200 000 bits) or equivalent stage",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0008-point-2",
          "description": "Answer: 2400 KB (accept about 2344 KB using 1024)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "30 x 40 000 x 16 = 19 200 000 bits; / 8 = 2 400 000 bytes; / 1000 = 2400 KB.",
      "examinerGuidance": [
        "Any correct stage earns the working mark.",
        "Accept division by 1000 or 1024."
      ],
      "commonMisconceptions": [
        "Multiplying by the bit depth twice."
      ]
    }
  },
  {
    "key": "catalogue-batch8-0009",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0009",
      "questionNumber": 9,
      "topic": "Data representation",
      "questionType": "state-identify",
      "commandWord": "state",
      "question": "State how many different colours can be represented using a colour depth of 5 bits.",
      "context": "",
      "marks": 1,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch8-0009-point-1",
          "description": "32 (accept 2 to the power 5)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "2^5 = 32 colours.",
      "examinerGuidance": [
        "Accept any expression that equals 32."
      ],
      "commonMisconceptions": [
        "Answering 5 or 10 instead of 2^5."
      ]
    }
  },
  {
    "key": "catalogue-batch8-0010",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0010",
      "questionNumber": 10,
      "topic": "Data representation",
      "questionType": "conversion",
      "commandWord": "complete",
      "question": "In ASCII the character 'A' is 65. Give the denary ASCII codes for the characters C, A and B, in that order.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0010-point-1",
          "description": "Any one code correct (C = 67, A = 65, B = 66)",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0010-point-2",
          "description": "All three correct, in order, with no extra values",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "67, 65, 66",
      "examinerGuidance": [
        "The codes must not be added together.",
        "Upper and lower case letters have different codes."
      ],
      "commonMisconceptions": [
        "Adding the codes into a single total."
      ]
    }
  },
  {
    "key": "catalogue-batch8-0011",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0011",
      "questionNumber": 11,
      "topic": "Networks",
      "questionType": "complete-table",
      "commandWord": "complete",
      "question": "Tick whether each IPv4 address is valid or invalid: (a) 172.16.300.1 (b) 10.0.0.255 (c) 192.168.1 (d) 8.8.8.8",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0011-point-1",
          "description": "(a) invalid: 300 is greater than 255",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0011-point-2",
          "description": "(b) valid",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0011-point-3",
          "description": "(c) invalid: only three groups",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0011-point-4",
          "description": "(d) valid",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "(a) invalid, (b) valid, (c) invalid, (d) valid.",
      "examinerGuidance": [
        "Accept a cross or other clear mark instead of a tick.",
        "A row with both boxes marked scores 0."
      ],
      "commonMisconceptions": [
        "Thinking a group of 0 is not allowed."
      ]
    }
  },
  {
    "key": "catalogue-batch8-0012",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0012",
      "questionNumber": 12,
      "topic": "Networks",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Give two differences between an IPv4 address and an IPv6 address.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch8-0012-point-1",
          "description": "IPv4 is 32 bits / 4 groups whereas IPv6 is 128 bits / 8 groups",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0012-point-2",
          "description": "IPv4 uses denary separated by full stops whereas IPv6 uses hexadecimal separated by colons",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0012-point-3",
          "description": "IPv6 provides far more unique addresses than IPv4",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "IPv4 uses 4 denary numbers separated by full stops (32 bits); IPv6 uses 8 groups of hexadecimal separated by colons (128 bits), so it gives many more addresses.",
      "examinerGuidance": [
        "Each difference must state both sides.",
        "Maximum 2 marks."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0013",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0013",
      "questionNumber": 13,
      "topic": "Network security",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "A coffee shop offers free Wi-Fi. Explain how encryption protects customers' data sent over this network.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0013-point-1",
          "description": "Data is scrambled using an algorithm / key",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0013-point-2",
          "description": "If the data is intercepted it cannot be understood",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0013-point-3",
          "description": "Only a device with the correct key can decrypt it",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Encryption scrambles the data with a key. Intercepted data is meaningless without the key, and only the intended receiver can decrypt it.",
      "examinerGuidance": [
        "Encryption does not stop interception: do not credit 'stops hackers getting the data'.",
        "'Cannot be read' alone is not enough."
      ],
      "commonMisconceptions": [
        "Believing encryption prevents data being intercepted."
      ]
    }
  },
  {
    "key": "catalogue-batch8-0014",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0014",
      "questionNumber": 14,
      "topic": "Networks",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "A café is setting up a star network. Give one benefit and one drawback of a star topology for the café.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0014-point-1",
          "description": "Benefit, e.g. if one cable/device fails the others still work // easy to add devices",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0014-point-2",
          "description": "Drawback, e.g. if the switch fails the whole network fails // extra cost of the switch",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "One faulty cable only affects one device, but the whole network depends on the switch.",
      "examinerGuidance": [
        "'Faster' or 'cheaper' alone is not enough."
      ],
      "commonMisconceptions": [
        "Thinking the switch stores data like a server."
      ]
    }
  },
  {
    "key": "catalogue-batch8-0015",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0015",
      "questionNumber": 15,
      "topic": "Networks",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain why a school network may become slow when many students stream videos at the same time.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0015-point-1",
          "description": "More data is being transmitted at the same time",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0015-point-2",
          "description": "The available bandwidth is shared between more devices // less bandwidth per device",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0015-point-3",
          "description": "Devices wait longer / more collisions or retransmissions",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Streaming sends large amounts of data, so the bandwidth is shared between many devices and each gets less; devices wait longer and data may need resending.",
      "examinerGuidance": [
        "More devices do not reduce the network's total bandwidth, only each device's share.",
        "'The network is slower' alone is not enough."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0016",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0016",
      "questionNumber": 16,
      "topic": "Storage",
      "questionType": "scenario-application",
      "commandWord": "explain",
      "question": "A delivery drone stores video while it flies. Identify the most suitable type of secondary storage for the drone and justify your choice.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0016-point-1",
          "description": "Type: solid state (flash)",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0016-point-2",
          "description": "Durable/robust: no moving parts, so not damaged by vibration in flight",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0016-point-3",
          "description": "Small and light, so it suits a drone",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0016-point-4",
          "description": "Fast write speed to record the video",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0016-point-5",
          "description": "Low power use, so the battery lasts longer",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Solid state: it is robust against vibration, light, fast to write video and uses little power.",
      "examinerGuidance": [
        "No justification marks if the type is not solid state; if no type is named, credit a justification that makes it clear.",
        "A device or brand alone is not a type.",
        "'Portable' or 'no moving parts' alone are not enough without the effect."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0017",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0017",
      "questionNumber": 17,
      "topic": "Memory",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "A games console stores the instructions it needs to start up in ROM. Explain why ROM is used for these instructions rather than RAM.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch8-0017-point-1",
          "description": "ROM is non-volatile, so the instructions are kept when the console is switched off",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0017-point-2",
          "description": "ROM cannot (easily) be changed, so the start-up instructions cannot be accidentally overwritten",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0017-point-3",
          "description": "RAM is volatile, so it would be empty at start-up",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "ROM keeps its contents without power and cannot be overwritten, so the start-up instructions are always there.",
      "examinerGuidance": [
        "A point about RAM must contrast with ROM to score.",
        "Maximum 2 marks."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0018",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0018",
      "questionNumber": 18,
      "topic": "CPU architecture",
      "questionType": "complete-table",
      "commandWord": "complete",
      "question": "Describe the purpose of the Program Counter (PC) and the Memory Address Register (MAR).",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch8-0018-point-1",
          "description": "PC: holds the address of the next instruction to be fetched",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0018-point-2",
          "description": "MAR: holds the address of the data/instruction being fetched or stored",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "The PC holds the address of the next instruction; the MAR holds the address currently being read from or written to.",
      "examinerGuidance": [
        "The PC does not count how many programs have run."
      ],
      "commonMisconceptions": [
        "Saying the PC holds the instruction itself."
      ]
    }
  },
  {
    "key": "catalogue-batch8-0019",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0019",
      "questionNumber": 19,
      "topic": "Compression",
      "questionType": "scenario-application",
      "commandWord": "explain",
      "question": "A museum is archiving scanned photographs of historic documents. Identify the type of compression it should use and justify your choice.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0019-point-1",
          "description": "Lossless",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0019-point-2",
          "description": "No data is permanently removed / the original can be restored exactly",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0019-point-3",
          "description": "Fine detail of the documents is kept for the archive",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Lossless, because the original images can be restored exactly, so no detail of the historic documents is lost.",
      "examinerGuidance": [
        "No justification marks if lossy is chosen.",
        "'It compresses the file more' is not enough."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0020",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0020",
      "questionNumber": 20,
      "topic": "Data representation",
      "questionType": "state-identify",
      "commandWord": "identify",
      "question": "Identify two items of metadata that could be stored with a digital photograph.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch8-0020-point-1",
          "description": "Width/height in pixels",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0020-point-2",
          "description": "Colour depth",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0020-point-3",
          "description": "Date/time taken",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0020-point-4",
          "description": "Geolocation",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0020-point-5",
          "description": "File type / camera model",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "For example the image's width and height, and the date it was taken.",
      "examinerGuidance": [
        "Metadata is data about the file, not its contents.",
        "'Size' or 'colour' alone is not enough.",
        "Maximum 2 marks."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0021",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0021",
      "questionNumber": 21,
      "topic": "Systems software",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe how defragmentation software can improve the performance of a computer with a magnetic hard disk.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch8-0021-point-1",
          "description": "Moves the parts of each file so they are stored together/contiguously",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0021-point-2",
          "description": "Groups free space together",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0021-point-3",
          "description": "Fewer head movements, so files are read faster",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "It rearranges file fragments so each file is stored together and free space is grouped, so the read head moves less and files load faster.",
      "examinerGuidance": [
        "Defragmentation does not create more storage space."
      ],
      "commonMisconceptions": [
        "Believing defragmentation frees up storage space."
      ]
    }
  },
  {
    "key": "catalogue-batch8-0022",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0022",
      "questionNumber": 22,
      "topic": "Legal and ethical",
      "questionType": "complete-table",
      "commandWord": "identify",
      "question": "Identify the legislation most likely to be broken in each case: (a) a student copies a game and sells copies; (b) an employee guesses a colleague's password to read their emails; (c) a company keeps customers' details longer than necessary.",
      "context": "",
      "marks": 3,
      "difficulty": "foundation",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0022-point-1",
          "description": "(a) Copyright, Designs and Patents Act",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0022-point-2",
          "description": "(b) Computer Misuse Act",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0022-point-3",
          "description": "(c) Data Protection Act / GDPR",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "(a) Copyright, Designs and Patents Act; (b) Computer Misuse Act; (c) Data Protection Act.",
      "examinerGuidance": [
        "Minor errors in the name of the Act are allowed.",
        "DPA and GDPR are both accepted."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0023",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0023",
      "questionNumber": 23,
      "topic": "Ethical, legal and environmental",
      "questionType": "discuss",
      "commandWord": "discuss",
      "question": "A town council plans to install video doorbells with facial recognition on every council house. Discuss the legal, ethical and privacy issues of this plan.",
      "context": "",
      "marks": 8,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0023-point-1",
          "description": "Marked using the levels of response. Indicative content (not exhaustive): data protection—images are personal data and must be stored securely and not kept longer than needed; consent—visitors and passers-by have not agreed to be recorded; benefits—deters crime, helps identify burglars, gives residents reassurance; risks—misidentification/bias, hacking of footage, mission creep; who owns and can access the footage (council, police, residents)",
          "marks": 8
        }
      ],
      "levelDescriptors": [
        {
          "level": 3,
          "markRange": "6-8",
          "description": "Thorough knowledge applied consistently to the plan; weighs benefits and drawbacks across legal, ethical and privacy issues; clear, well-structured reasoning."
        },
        {
          "level": 2,
          "markRange": "3-5",
          "description": "Reasonable knowledge applied to the plan, but some opportunities missed or one side underdeveloped; some structure."
        },
        {
          "level": 1,
          "markRange": "1-2",
          "description": "Basic points, mostly generic, with little application; limited structure."
        }
      ],
      "modelAnswer": "A strong answer weighs crime-prevention benefits against privacy, consent and data protection concerns, applies each to the council's plan and reaches a balanced view.",
      "examinerGuidance": [
        "Mark by levels: decide the band, then the mark within it.",
        "Bullet points or headings are acceptable; an essay is not required.",
        "Credit other valid points: the indicative content is not exhaustive."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0024",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0024",
      "questionNumber": 24,
      "topic": "Databases and SQL",
      "questionType": "code-completion",
      "commandWord": "write",
      "question": "A table called tblBooks has the fields BookID, Title, Author and Year. Write an SQL statement to display the Title and Author of every book published before 1990.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch8-0024-point-1",
          "description": "SELECT Title, Author",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0024-point-2",
          "description": "FROM tblBooks",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0024-point-3",
          "description": "WHERE Year < 1990",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "SELECT Title, Author FROM tblBooks WHERE Year < 1990",
      "examinerGuidance": [
        "Field and table names must be spelled exactly, with no spaces.",
        "Fields are separated by commas, not AND.",
        "Maximum 2 if the clauses are in the wrong order."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0025",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0025",
      "questionNumber": 25,
      "topic": "Programming fundamentals",
      "questionType": "trace-table",
      "commandWord": "trace",
      "question": "Complete a trace table for this algorithm: x = 1; total = 0; while x < 10: total = total + x; x = x * 3; endwhile; print(total)",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch8-0025-point-1",
          "description": "total takes the values 1, 4, 13",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0025-point-2",
          "description": "x takes the values 3, 9, 27",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0025-point-3",
          "description": "The loop stops when x is 27",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0025-point-4",
          "description": "Output: 13 (and nothing else)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "total 0→1→4→13; x 1→3→9→27; the loop ends and 13 is output.",
      "examinerGuidance": [
        "Unchanged values may be repeated.",
        "Output must be the value 13, not print(total).",
        "Penalise a repeated error once, then follow through."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0026",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0026",
      "questionNumber": 26,
      "topic": "Boolean logic",
      "questionType": "algorithm-design",
      "commandWord": "design",
      "question": "Draw a logic circuit for Q = (A AND NOT B) OR C.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch8-0026-point-1",
          "description": "NOT gate on input B",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0026-point-2",
          "description": "AND gate with inputs A and NOT B",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0026-point-3",
          "description": "OR gate combining the AND output with C to give Q",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "B goes through a NOT gate; its output and A enter an AND gate; the AND output and C enter an OR gate giving Q.",
      "examinerGuidance": [
        "Mark the shape of each gate, not labels.",
        "The NOT gate must have its circle; AND/OR must not.",
        "Maximum 2 if extra gates are added or the circuit is not logically correct."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0027",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0027",
      "questionNumber": 27,
      "topic": "Boolean logic",
      "questionType": "truth-table",
      "commandWord": "complete",
      "question": "Complete the truth table for Q = NOT (A OR B) for all four combinations of A and B.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0027-point-1",
          "description": "Rows A=0,B=0 → 1 and A=0,B=1 → 0 correct",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0027-point-2",
          "description": "Rows A=1,B=0 → 0 and A=1,B=1 → 0 correct",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Q is 1 only when A and B are both 0.",
      "examinerGuidance": [
        "Accept True/False for 1/0."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0028",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0028",
      "questionNumber": 28,
      "topic": "Programming fundamentals",
      "questionType": "code-completion",
      "commandWord": "write",
      "question": "Write a function called triangleArea that takes the base and height of a triangle as parameters and returns its area (half of base multiplied by height).",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch8-0028-point-1",
          "description": "Function header with two parameters",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0028-point-2",
          "description": "Calculates 0.5 x base x height using the parameters",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0028-point-3",
          "description": "Returns the result (not printed)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "function triangleArea(base, height)\n  return 0.5 * base * height\nendfunction",
      "examinerGuidance": [
        "The value must be returned, not output.",
        "Parameters must not be overwritten by input inside the function.",
        "Minor syntax errors: penalise once then follow through."
      ],
      "commonMisconceptions": [
        "Printing the area instead of returning it."
      ]
    }
  },
  {
    "key": "catalogue-batch8-0029",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0029",
      "questionNumber": 29,
      "topic": "Defensive design",
      "questionType": "algorithm-design",
      "commandWord": "write",
      "question": "Write an algorithm that asks the user for their age and keeps asking until a whole number from 11 to 18 inclusive is entered.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch8-0029-point-1",
          "description": "Input the age",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0029-point-2",
          "description": "Use a loop that repeats while the age is invalid",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0029-point-3",
          "description": "Correct condition with both limits inclusive, e.g. age < 11 OR age > 18",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0029-point-4",
          "description": "Input repeated inside the loop",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "age = int(input(\"Age\"))\nwhile age < 11 or age > 18\n  age = int(input(\"Age 11-18\"))\nendwhile",
      "examinerGuidance": [
        "Each side of AND/OR must be a full comparison (age < 11 OR age > 18).",
        "Both 11 and 18 must be accepted.",
        "Follow through later marks if the loop condition is wrong."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0030",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0030",
      "questionNumber": 30,
      "topic": "Testing",
      "questionType": "complete-table",
      "commandWord": "complete",
      "question": "The age check accepts whole numbers from 11 to 18 inclusive. Give one example each of normal, boundary and erroneous test data.",
      "context": "",
      "marks": 3,
      "difficulty": "foundation",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch8-0030-point-1",
          "description": "Normal: any whole number from 12 to 17, e.g. 14",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0030-point-2",
          "description": "Boundary: 11 or 18 (accept 10 or 19 as invalid boundary)",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0030-point-3",
          "description": "Erroneous: e.g. 25, -3 or \"twelve\"",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Normal 14; boundary 18; erroneous \"twelve\".",
      "examinerGuidance": [
        "Test data must be actual values, not descriptions."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0031",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0031",
      "questionNumber": 31,
      "topic": "Searching algorithms",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe how a binary search would find 31 in the list 3, 8, 12, 19, 24, 31, 40.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0031-point-1",
          "description": "Compare with the middle value, 19",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0031-point-2",
          "description": "31 is greater, so discard 3 to 19 and keep 24, 31, 40",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0031-point-3",
          "description": "Compare with the new middle value, 31: found",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Check 19; 31 is larger so keep the right half; the middle of 24, 31, 40 is 31, so it is found.",
      "examinerGuidance": [
        "The steps must use the values in this list.",
        "'Split the list in half' alone is not enough."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0032",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0032",
      "questionNumber": 32,
      "topic": "Sorting algorithms",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Show the first pass of a bubble sort to put 9, 4, 7, 1 into ascending order.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0032-point-1",
          "description": "Compare 9 and 4: swap → 4, 9, 7, 1",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0032-point-2",
          "description": "Compare 9 and 7: swap → 4, 7, 9, 1",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0032-point-3",
          "description": "Compare 9 and 1: swap → 4, 7, 1, 9",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "4 9 7 1 → 4 7 9 1 → 4 7 1 9.",
      "examinerGuidance": [
        "Each comparison must use the data given.",
        "Penalise descending order once."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0033",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0033",
      "questionNumber": 33,
      "topic": "Sorting algorithms",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Show how a merge sort would sort 6, 2, 9, 1, 5, 3, 8, 4 into ascending order.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0033-point-1",
          "description": "Split into single items",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0033-point-2",
          "description": "Merge into ordered pairs then fours: 2 6 | 1 9 | 3 5 | 4 8 → 1 2 6 9 | 3 4 5 8",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0033-point-3",
          "description": "Final merge: 1 2 3 4 5 6 8 9",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Split to single items, merge to sorted pairs, then sorted fours, then the final sorted list.",
      "examinerGuidance": [
        "Lists must be merged in order at each stage; appending then sorting is not a merge."
      ],
      "commonMisconceptions": [
        "Merging lists out of order and then sorting them."
      ]
    }
  },
  {
    "key": "catalogue-batch8-0034",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0034",
      "questionNumber": 34,
      "topic": "Computational thinking",
      "questionType": "scenario-application",
      "commandWord": "explain",
      "question": "A bus company is creating an app that shows the next departures. Give two examples of how abstraction could be used in the app.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0034-point-1",
          "description": "Show only stops and times relevant to the user, e.g. ignore other routes",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0034-point-2",
          "description": "Simplify the map to a line of stops rather than real roads",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0034-point-3",
          "description": "Ignore details such as the driver's name or bus colour",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Only show the user's route and the next times; draw the route as a simple line of stops.",
      "examinerGuidance": [
        "Examples must be about this app and say what is removed or focused on.",
        "Maximum 2 marks."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0035",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0035",
      "questionNumber": 35,
      "topic": "Programming fundamentals",
      "questionType": "definition",
      "commandWord": "define",
      "question": "Define the terms 'syntax error' and 'logic error'.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch8-0035-point-1",
          "description": "Syntax error: breaks the rules/grammar of the language so the program will not run/translate",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0035-point-2",
          "description": "Logic error: the program runs but produces an incorrect/unexpected result",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A syntax error breaks the language rules so the code won't run; a logic error runs but gives the wrong result.",
      "examinerGuidance": [
        "An example is not a definition.",
        "'An error in the code' is not enough."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0036",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0036",
      "questionNumber": 36,
      "topic": "Programming fundamentals",
      "questionType": "code-completion",
      "commandWord": "write",
      "question": "The integer variable score holds a player's score. Write one line of code that outputs, for example, Score: 42 using the variable.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch8-0036-point-1",
          "description": "Casts score to a string (or uses string interpolation)",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0036-point-2",
          "description": "Concatenates \"Score: \" and the score and outputs it",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "print(\"Score: \" + str(score))",
      "examinerGuidance": [
        "Accept +, &, . or interpolation for concatenation.",
        "Allow a comma inside print only if the language's print accepts multiple values."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0037",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0037",
      "questionNumber": 37,
      "topic": "Data types",
      "questionType": "conversion",
      "commandWord": "calculate",
      "question": "Represent the denary number -37 as an 8-bit two's complement binary integer. Show your working.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0037-point-1",
          "description": "Working in binary, e.g. 00100101 inverted to 11011010 then add 1",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0037-point-2",
          "description": "Answer: 11011011",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "37 = 00100101; invert to 11011010; add 1 to get 11011011.",
      "examinerGuidance": [
        "Working must be in binary; denary-only working earns no working mark.",
        "The answer must be 8 bits."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0038",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0038",
      "questionNumber": 38,
      "topic": "Data types",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "Calculate 01101001 - 00011100 using binary. Show your working.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0038-point-1",
          "description": "Correct left-hand nibble 0100",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0038-point-2",
          "description": "Correct right-hand nibble 1101",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0038-point-3",
          "description": "Working in binary (borrows, or two's complement addition)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "01101001 - 00011100 = 01001101 (105 - 28 = 77).",
      "examinerGuidance": [
        "Denary-only working earns no working mark.",
        "Accept two's complement addition of the negated second number as working."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0039",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0039",
      "questionNumber": 39,
      "topic": "Data types",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "A floating point number uses an 8-bit two's complement mantissa 01101000 and a 4-bit two's complement exponent 0011. Calculate its denary value. Show your working.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0039-point-1",
          "description": "Exponent is +3",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0039-point-2",
          "description": "Binary point moved 3 places right: 0110.1000",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0039-point-3",
          "description": "Answer: 6.5",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Exponent 3, so 0.1101000 becomes 110.1 = 6.5.",
      "examinerGuidance": [
        "A correct answer with valid binary working earns full marks.",
        "Accept mantissa x 2^exponent as the method."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0040",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0040",
      "questionNumber": 40,
      "topic": "Data types",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "Normalise the floating point number with 8-bit mantissa 00011010 and 4-bit exponent 0010.",
      "context": "",
      "marks": 2,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0040-point-1",
          "description": "Mantissa 01101000",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0040-point-2",
          "description": "Exponent 0000",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Shift the mantissa left 2 places to 01101000 and reduce the exponent by 2 to 0000.",
      "examinerGuidance": [
        "Both mantissa and exponent must use the bit lengths given."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0041",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0041",
      "questionNumber": 41,
      "topic": "Data types",
      "questionType": "conversion",
      "commandWord": "calculate",
      "question": "Convert the hexadecimal number 3FA into denary. Show your working.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0041-point-1",
          "description": "Working: 3 x 256 + 15 x 16 + 10",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0041-point-2",
          "description": "Answer: 1018",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "768 + 240 + 10 = 1018.",
      "examinerGuidance": [
        "Any valid method is accepted."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0042",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0042",
      "questionNumber": 42,
      "topic": "Boolean algebra",
      "questionType": "short-response",
      "commandWord": "calculate",
      "question": "Simplify the expression ¬(¬A ∨ ¬B). Show the rule you use.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0042-point-1",
          "description": "Apply De Morgan's law: ¬¬A ∧ ¬¬B",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0042-point-2",
          "description": "Simplified: A ∧ B",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "By De Morgan, ¬(¬A ∨ ¬B) = A ∧ B.",
      "examinerGuidance": [
        "Accept alternative notation (. and +, overbar)."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0043",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0043",
      "questionNumber": 43,
      "topic": "Boolean algebra",
      "questionType": "truth-table",
      "commandWord": "complete",
      "question": "Complete the truth table for a half adder with inputs A and B and outputs S (sum) and C (carry).",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch8-0043-point-1",
          "description": "S column correct: 0, 1, 1, 0",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0043-point-2",
          "description": "C column correct: 0, 0, 0, 1",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "S = A XOR B; C = A AND B.",
      "examinerGuidance": [
        "Inputs may be listed in any order if rows are consistent."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0044",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0044",
      "questionNumber": 44,
      "topic": "Assembly language",
      "questionType": "algorithm-design",
      "commandWord": "write",
      "question": "Write a Little Man Computer program that keeps inputting numbers until 0 is entered, then outputs the total of the numbers entered.",
      "context": "",
      "marks": 5,
      "difficulty": "higher",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch8-0044-point-1",
          "description": "Input inside a loop (INP with a label to branch back to)",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0044-point-2",
          "description": "Exits the loop when the input is 0 (BRZ)",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0044-point-3",
          "description": "Adds the input to a running total and stores it (ADD, STA)",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0044-point-4",
          "description": "Branches back to the start of the loop (BRA)",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0044-point-5",
          "description": "Outputs the total, halts, and declares the total with DAT 0",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "loop INP\nBRZ end\nADD total\nSTA total\nBRA loop\nend LDA total\nOUT\nHLT\ntotal DAT 0",
      "examinerGuidance": [
        "Every label needs a matching DAT.",
        "Penalise the first error, then follow through.",
        "Mnemonic case is ignored."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0045",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0045",
      "questionNumber": 45,
      "topic": "Processor",
      "questionType": "compare",
      "commandWord": "describe",
      "question": "Describe immediate addressing and indirect addressing.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch8-0045-point-1",
          "description": "Immediate: the operand is the actual value to use",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0045-point-2",
          "description": "e.g. ADD #5 adds 5",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0045-point-3",
          "description": "Indirect: the operand is an address that holds the address of the data",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0045-point-4",
          "description": "so memory is accessed twice to reach the data",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Immediate uses the operand as the data; indirect treats it as a pointer to the address of the data.",
      "examinerGuidance": [
        "Two marks per mode."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0046",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0046",
      "questionNumber": 46,
      "topic": "Processor",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain how pipelining improves processor performance.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch8-0046-point-1",
          "description": "Fetch, decode and execute stages overlap",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0046-point-2",
          "description": "The next instruction is fetched while the current one is decoded/executed",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0046-point-3",
          "description": "More instructions are completed in the same time / less idle time",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Stages of different instructions overlap, so more instructions finish per unit time.",
      "examinerGuidance": [
        "Do not credit multiple cores working in parallel."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0047",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0047",
      "questionNumber": 47,
      "topic": "Processor",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Compare the Von Neumann and Harvard architectures.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch8-0047-point-1",
          "description": "Von Neumann shares one memory for data and instructions; Harvard has separate memories",
          "marks": 2
        },
        {
          "id": "catalogue-batch8-0047-point-2",
          "description": "Von Neumann has a single bus for both; Harvard has separate buses so data and instructions can be fetched at once",
          "marks": 2
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Von Neumann uses one memory and bus for data and instructions; Harvard keeps them separate so both can be accessed simultaneously.",
      "examinerGuidance": [
        "Two marks per comparison, which must compare the same feature."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0048",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0048",
      "questionNumber": 48,
      "topic": "Operating systems",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Give one difference between paging and segmentation.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch8-0048-point-1",
          "description": "Paging splits memory into fixed-size blocks whereas segmentation uses variable-size logical blocks",
          "marks": 2
        },
        {
          "id": "catalogue-batch8-0048-point-2",
          "description": "Paging is physical division whereas segmentation divides by logical units such as modules",
          "marks": 2
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Pages are fixed size; segments vary in size and follow the program's logical structure.",
      "examinerGuidance": [
        "Both sides are needed for 2 marks.",
        "Maximum 2 marks."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0049",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0049",
      "questionNumber": 49,
      "topic": "Data structures",
      "questionType": "algorithm-design",
      "commandWord": "describe",
      "question": "A stack is stored in an array with a pointer topPointer to the top item. Describe the steps to pop an item.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0049-point-1",
          "description": "Check whether the stack is empty (e.g. topPointer is -1)",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0049-point-2",
          "description": "If not, take/return the item at topPointer",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0049-point-3",
          "description": "Decrement topPointer",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "If the stack is not empty, return stack[topPointer] and decrement topPointer.",
      "examinerGuidance": [
        "The sequence must work (allow decrement then return stack[topPointer + 1])."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0050",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0050",
      "questionNumber": 50,
      "topic": "Data structures",
      "questionType": "algorithm-design",
      "commandWord": "describe",
      "question": "A linked list is stored in an array, with each node holding data and a pointer to the next node. Describe how a node is removed from the middle of the list.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0050-point-1",
          "description": "Traverse from the head pointer to find the node (keeping track of the previous node)",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0050-point-2",
          "description": "Set the previous node's pointer to the removed node's next pointer",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0050-point-3",
          "description": "Add the removed node to the free list / mark its space as free",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Find the node, make the previous node point past it, and return its space to the free list.",
      "examinerGuidance": [
        "Answers must refer to the pointers being changed.",
        "Data is not shifted along the array."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0051",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0051",
      "questionNumber": 51,
      "topic": "Data structures",
      "questionType": "complete-table",
      "commandWord": "complete",
      "question": "The values 45, 22, 67, 31, 10, 80, 58 are inserted in that order into an empty binary search tree. Draw the tree and give the breadth-first traversal.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0051-point-1",
          "description": "45 root with 22 left and 67 right",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0051-point-2",
          "description": "10 and 31 as left and right children of 22",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0051-point-3",
          "description": "58 and 80 as left and right children of 67",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0051-point-4",
          "description": "Breadth-first: 45, 22, 67, 10, 31, 58, 80",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "45 at the root; 22 (10, 31) on the left; 67 (58, 80) on the right; breadth-first 45 22 67 10 31 58 80.",
      "examinerGuidance": [
        "Left and right placement must be clear."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0052",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0052",
      "questionNumber": 52,
      "topic": "Algorithms",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "A delivery network has weighted edges S-P 3, S-Q 6, P-Q 2, P-R 7, Q-R 3, Q-T 9, R-T 2. Use Dijkstra's algorithm to find the shortest route from S to T.",
      "context": "",
      "marks": 4,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0052-point-1",
          "description": "Working: Q becomes 5 via P, replacing 6",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0052-point-2",
          "description": "Working: R becomes 8 via Q (not 10 via P); T becomes 10 via R, replacing 14",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0052-point-3",
          "description": "Route: S → P → Q → R → T",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0052-point-4",
          "description": "Distance: 10",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Shortest route S, P, Q, R, T with total distance 10.",
      "examinerGuidance": [
        "Replaced distances must be shown as overwritten.",
        "Accept N/A or blank for A's previous node."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0053",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0053",
      "questionNumber": 53,
      "topic": "Algorithms",
      "questionType": "compare",
      "commandWord": "explain",
      "question": "State the time complexity of a linear search and of a binary search, and explain what each means.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch8-0053-point-1",
          "description": "Linear search: O(n)",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0053-point-2",
          "description": "time grows in direct proportion to the number of items",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0053-point-3",
          "description": "Binary search: O(log n)",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0053-point-4",
          "description": "time grows slowly / the list is halved each step",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Linear O(n): proportional; binary O(log n): halves each time so grows logarithmically.",
      "examinerGuidance": [
        "Name and meaning are both needed for each search."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0054",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0054",
      "questionNumber": 54,
      "topic": "Object-oriented programming",
      "questionType": "code-completion",
      "commandWord": "write",
      "question": "Write the class Book with private attributes title, author and loans, a constructor that sets title and author from parameters and loans to 0, and a public method borrow that adds 1 to loans.",
      "context": "",
      "marks": 5,
      "difficulty": "higher",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch8-0054-point-1",
          "description": "Class declaration with private attributes title, author, loans",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0054-point-2",
          "description": "Public constructor taking two parameters",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0054-point-3",
          "description": "Sets title and author from the parameters",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0054-point-4",
          "description": "Sets loans to 0",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0054-point-5",
          "description": "Public procedure borrow incrementing loans",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "class Book\n  private title\n  private author\n  private loans\n  public procedure new(t, a)\n    title = t\n    author = a\n    loans = 0\n  endprocedure\n  public procedure borrow()\n    loans = loans + 1\n  endprocedure\nendclass",
      "examinerGuidance": [
        "Allow 'self' as an extra first parameter in Python.",
        "Penalise a repeated naming error once."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0055",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0055",
      "questionNumber": 55,
      "topic": "Object-oriented programming",
      "questionType": "scenario-application",
      "commandWord": "explain",
      "question": "A library system has a class Item. Explain how inheritance could be used for Book and DVD.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0055-point-1",
          "description": "Book and DVD inherit the attributes/methods of Item, e.g. title",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0055-point-2",
          "description": "and add their own, e.g. author for Book, runtime for DVD",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Book and DVD are subclasses that reuse Item's attributes and methods and add their own.",
      "examinerGuidance": [
        "Inheritance is not instantiation."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0056",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0056",
      "questionNumber": 56,
      "topic": "Algorithms",
      "questionType": "code-tracing",
      "commandWord": "trace",
      "question": "A recursive function is defined as: f(n) returns 1 if n <= 1, otherwise returns n + f(n - 2). Show how f(7) is evaluated and give the result.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0056-point-1",
          "description": "Calls f(7), f(5), f(3), f(1)",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0056-point-2",
          "description": "f(1) returns 1 and the calls unwind adding 3, 5, 7",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0056-point-3",
          "description": "Result: 16",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "7 + 5 + 3 + 1 = 16.",
      "examinerGuidance": [
        "Credit the return value in the working or the answer space."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0057",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0057",
      "questionNumber": 57,
      "topic": "Databases",
      "questionType": "code-completion",
      "commandWord": "write",
      "question": "Tables Student(StudentID, Name) and Result(StudentID, Subject, Mark) are linked by StudentID. Write SQL to list the Name and Mark of every student with a Mark over 80 in Physics.",
      "context": "",
      "marks": 4,
      "difficulty": "higher",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch8-0057-point-1",
          "description": "SELECT Student.Name, Result.Mark",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0057-point-2",
          "description": "FROM Student, Result (or JOIN)",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0057-point-3",
          "description": "Joins on Student.StudentID = Result.StudentID",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0057-point-4",
          "description": "WHERE Subject = 'Physics' AND Mark > 80",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "SELECT Student.Name, Result.Mark FROM Student JOIN Result ON Student.StudentID = Result.StudentID WHERE Result.Subject = 'Physics' AND Result.Mark > 80",
      "examinerGuidance": [
        "Field and table names must match those given.",
        "A join through WHERE needs AND with the other condition."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0058",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0058",
      "questionNumber": 58,
      "topic": "Databases",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain why a database designer would normalise a database to third normal form.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch8-0058-point-1",
          "description": "Removes redundant/repeated data",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0058-point-2",
          "description": "Prevents inconsistencies when data is updated",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0058-point-3",
          "description": "Each non-key field depends only on the key / reduces storage",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Normalising removes duplicated data so updates stay consistent and storage is reduced.",
      "examinerGuidance": [
        "Points must be qualified."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0059",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0059",
      "questionNumber": 59,
      "topic": "Networks",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe the role of the transport layer in the TCP/IP stack.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch8-0059-point-1",
          "description": "Splits data into packets/segments",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0059-point-2",
          "description": "Adds port numbers / sequence numbers",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0059-point-3",
          "description": "Manages reliable delivery, e.g. reassembly and requesting lost packets",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "It splits data into numbered segments with port numbers and ensures they arrive and are reassembled.",
      "examinerGuidance": [
        "Do not credit routing (network layer)."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0060",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0060",
      "questionNumber": 60,
      "topic": "Web technologies",
      "questionType": "code-completion",
      "commandWord": "write",
      "question": "A web form has a text box with id 'surname'. Write a JavaScript function checkSurname that shows an alert if the box is empty.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch8-0060-point-1",
          "description": "Function definition",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0060-point-2",
          "description": "Uses document.getElementById('surname').value",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0060-point-3",
          "description": "Checks if the value is empty",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0060-point-4",
          "description": "Calls alert with a message",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "function checkSurname() {\n  if (document.getElementById('surname').value == '') {\n    alert('Please enter a surname');\n  }\n}",
      "examinerGuidance": [
        "Answers must be JavaScript.",
        "Penalise a repeated syntax slip once."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0061",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0061",
      "questionNumber": 61,
      "topic": "Network security",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain why a website should store users' passwords as hashes rather than in an encrypted form.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0061-point-1",
          "description": "Hashing is one-way: the original password cannot be worked out from the hash",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0061-point-2",
          "description": "At log-in the entered password is hashed and compared with the stored hash",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0061-point-3",
          "description": "If the database is stolen the passwords are not revealed, whereas encrypted passwords could be decrypted if the key is also stolen",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Hashes cannot be reversed; log-ins compare hashes, so a stolen database does not reveal passwords, unlike encryption whose key could be stolen.",
      "examinerGuidance": [
        "Points must be qualified, not just 'more secure'."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0062",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0062",
      "questionNumber": 62,
      "topic": "Legal, moral and ethical",
      "questionType": "evaluate",
      "commandWord": "evaluate",
      "question": "A police force plans to use live facial recognition cameras in a city centre. Evaluate the legal, moral and ethical issues of this plan.",
      "context": "",
      "marks": 12,
      "difficulty": "higher",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch8-0062-point-1",
          "description": "Marked using the levels of response. Indicative content (not exhaustive): AO1: relevant legislation, e.g. Data Protection Act, RIPA, human rights to privacy; AO2: applied to the city centre—scale of capture, storage, who can access data; AO3: benefits (finding suspects, deterrence) weighed against bias, false matches, consent and mission creep, with a justified conclusion",
          "marks": 12
        }
      ],
      "levelDescriptors": [
        {
          "level": 3,
          "markRange": "9-12",
          "description": "Thorough, accurate knowledge applied consistently to the plan; balanced evaluation leading to a well-supported conclusion."
        },
        {
          "level": 2,
          "markRange": "5-8",
          "description": "Reasonable knowledge applied with some missed opportunities; a conclusion with some support; may be unbalanced."
        },
        {
          "level": 1,
          "markRange": "1-4",
          "description": "Basic knowledge with little application or evaluation."
        }
      ],
      "modelAnswer": "A top answer applies the law and ethics to this plan, weighs benefits against risks and reaches a justified, balanced conclusion.",
      "examinerGuidance": [
        "Mark by levels: AO1 knowledge, AO2 application, AO3 evaluation.",
        "Either conclusion is acceptable if justified.",
        "Generic answers without the context cannot reach the top band."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0063",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0063",
      "questionNumber": 63,
      "topic": "Software development",
      "questionType": "discuss",
      "commandWord": "discuss",
      "question": "A charity wants a volunteer-booking app and is unsure what it needs. Discuss whether an agile or a waterfall methodology would be more suitable.",
      "context": "",
      "marks": 9,
      "difficulty": "higher",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch8-0063-point-1",
          "description": "Marked using the levels of response. Indicative content (not exhaustive): agile—iterative prototypes, frequent client feedback, copes with changing requirements; waterfall—fixed sequential stages, clear documentation, requirements fixed early; application—charity unsure of needs, limited budget/time, volunteers' feedback; justified recommendation",
          "marks": 9
        }
      ],
      "levelDescriptors": [
        {
          "level": 3,
          "markRange": "7-9",
          "description": "Thorough knowledge of both methodologies applied to the charity, with a clear, justified conclusion."
        },
        {
          "level": 2,
          "markRange": "4-6",
          "description": "Reasonable knowledge with some application; conclusion partly supported."
        },
        {
          "level": 1,
          "markRange": "1-3",
          "description": "Basic, mostly generic points."
        }
      ],
      "modelAnswer": "A strong answer applies both methodologies to the charity's uncertain requirements and justifies a recommendation, usually agile.",
      "examinerGuidance": [
        "Mark by levels.",
        "Either recommendation is acceptable if justified."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0064",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0064",
      "questionNumber": 64,
      "topic": "Algorithms",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Show the stages of an insertion sort to put 17, 4, 12, 9 into ascending order.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0064-point-1",
          "description": "4 inserted before 17: 4, 17, 12, 9",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0064-point-2",
          "description": "12 inserted: 4, 12, 17, 9",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0064-point-3",
          "description": "9 inserted: 4, 9, 12, 17",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0064-point-4",
          "description": "Shows the sorted and unsorted parts / the comparisons made",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "4 17 | 12 9 → 4 12 17 | 9 → 4 9 12 17.",
      "examinerGuidance": [
        "Responses must use the data given.",
        "No marks for a bubble sort."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0065",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0065",
      "questionNumber": 65,
      "topic": "Computational thinking",
      "questionType": "scenario-application",
      "commandWord": "explain",
      "question": "Give one example of how thinking concurrently could be used when developing a multiplayer online game, and one benefit.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch8-0065-point-1",
          "description": "Example: processing several players' moves / loading assets while the menu runs",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0065-point-2",
          "description": "Benefit: faster response / better use of processor time",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Handling each player's input at the same time so the game responds quickly.",
      "examinerGuidance": [
        "The example must fit the game."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch8-0066",
    "sourceId": "cs-master-batch8",
    "sourceTitle": "CS Master past-paper style practice",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch8-0066",
      "questionNumber": 66,
      "topic": "Data structures",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain what a collision is in a hash table and describe one way to handle it.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch8-0066-point-1",
          "description": "Two keys hash to the same location",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0066-point-2",
          "description": "Linear probing: store in the next free location",
          "marks": 1
        },
        {
          "id": "catalogue-batch8-0066-point-3",
          "description": "or chaining: store a linked list at that location",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A collision is when two keys give the same index; it can be handled by probing to the next free slot or by chaining.",
      "examinerGuidance": [
        "Maximum 2 for the handling method."
      ],
      "commonMisconceptions": []
    }
  }
];
