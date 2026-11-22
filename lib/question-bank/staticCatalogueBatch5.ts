import type { BankQuestion } from "./bankUtilities";

/**
 * CS Master Batch 5: 195 original GCSE and A-level questions with varied
 * mark allocations (1-9), difficulty levels and question types. Checked
 * against batches 1-4 for repeats. Exam-board classifications are
 * provisional pending specification-level review.
 */
export const batch5Questions: BankQuestion[] = [
  {
    "key": "catalogue-batch5-0001",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0001",
      "questionNumber": 1,
      "topic": "Binary representation and arithmetic",
      "questionType": "conversion",
      "commandWord": "calculate",
      "question": "Convert the 8-bit binary number 10110110 into denary. Show your working.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0001-point-1",
          "description": "Correct place values used (128, 32, 16, 4, 2)",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0001-point-2",
          "description": "Correct answer: 182",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "128 + 32 + 16 + 4 + 2 = 182",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0002",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0002",
      "questionNumber": 2,
      "topic": "Binary representation and arithmetic",
      "questionType": "conversion",
      "commandWord": "calculate",
      "question": "Convert the denary number 200 into an 8-bit binary number.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0002-point-1",
          "description": "Correct method shown (e.g. 128 + 64 + 8)",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0002-point-2",
          "description": "Correct answer: 11001000",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "11001000",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0003",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0003",
      "questionNumber": 3,
      "topic": "Binary representation and arithmetic",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "Add the binary numbers 01101011 and 00110110. Give your answer as an 8-bit binary number.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0003-point-1",
          "description": "Correct carries shown",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0003-point-2",
          "description": "Correct answer: 10100001",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "01101011 + 00110110 = 10100001 (107 + 54 = 161)",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0004",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0004",
      "questionNumber": 4,
      "topic": "Binary representation and arithmetic",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "Perform a left binary shift of 2 places on 00010110. State the result and the effect on the denary value.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0004-point-1",
          "description": "Result: 01011000",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0004-point-2",
          "description": "Value is multiplied by 4 (22 becomes 88)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "01011000; the value is multiplied by 4 (22 → 88).",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0005",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0005",
      "questionNumber": 5,
      "topic": "Binary representation and arithmetic",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Perform a right binary shift of 3 places on 01100100. Explain why the result is not exactly the original value divided by 8.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0005-point-1",
          "description": "Result: 00001100",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0005-point-2",
          "description": "Original value is 100; 100 ÷ 8 = 12.5",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0005-point-3",
          "description": "The result is 12 because bits shifted off the right are lost / precision is lost",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "00001100 = 12. 100 ÷ 8 = 12.5, but the bits shifted out on the right are discarded, so the fractional part is lost.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0006",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0006",
      "questionNumber": 6,
      "topic": "Hexadecimal",
      "questionType": "conversion",
      "commandWord": "calculate",
      "question": "Convert the hexadecimal number 3C into denary.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0006-point-1",
          "description": "3 × 16 = 48 and C = 12",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0006-point-2",
          "description": "Correct answer: 60",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "3 × 16 + 12 = 60",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0007",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0007",
      "questionNumber": 7,
      "topic": "Hexadecimal",
      "questionType": "conversion",
      "commandWord": "calculate",
      "question": "Convert the denary number 171 into hexadecimal. Show your working.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0007-point-1",
          "description": "171 ÷ 16 = 10 remainder 11 (or via binary 1010 1011)",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0007-point-2",
          "description": "Correct answer: AB",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "AB",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0008",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0008",
      "questionNumber": 8,
      "topic": "Hexadecimal",
      "questionType": "conversion",
      "commandWord": "calculate",
      "question": "Convert the hexadecimal number 9F into 8-bit binary.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0008-point-1",
          "description": "9 = 1001",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0008-point-2",
          "description": "F = 1111 (answer 10011111)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "10011111",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0009",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0009",
      "questionNumber": 9,
      "topic": "Data representation",
      "questionType": "calculation",
      "commandWord": "calculate",
      "question": "A file is 2 MB in size. Using 1 MB = 1,000,000 bytes, calculate the size of the file in bits.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0009-point-1",
          "description": "2 × 1,000,000 = 2,000,000 bytes",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0009-point-2",
          "description": "× 8 = 16,000,000 bits",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "16,000,000 bits",
      "examinerGuidance": [
        "Accept 16,777,216 bits if 1 MB = 1,048,576 bytes is used consistently."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0010",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0010",
      "questionNumber": 10,
      "topic": "Data representation",
      "questionType": "explain",
      "commandWord": "state",
      "question": "Put these units in order from smallest to largest: gigabyte, bit, kilobyte, nibble, terabyte, byte, megabyte.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0010-point-1",
          "description": "bit, nibble, byte",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0010-point-2",
          "description": "kilobyte, megabyte, gigabyte, terabyte",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "bit, nibble, byte, kilobyte, megabyte, gigabyte, terabyte",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0011",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0011",
      "questionNumber": 11,
      "topic": "Character representation",
      "questionType": "calculation",
      "commandWord": "calculate",
      "question": "In ASCII the character 'C' has the denary code 67. State the denary code for 'F' and explain how you worked it out.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0011-point-1",
          "description": "70",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0011-point-2",
          "description": "Letters are stored in sequence, so F is three codes after C",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "70, because character codes are consecutive: C=67, D=68, E=69, F=70.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0012",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0012",
      "questionNumber": 12,
      "topic": "Character representation",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "A character set uses 7 bits per character. Explain why this limits the number of characters it can represent.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0012-point-1",
          "description": "7 bits give 2^7 combinations",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0012-point-2",
          "description": "Maximum of 128 different characters",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0012-point-3",
          "description": "Not enough for all languages / symbols",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "With 7 bits there are 2^7 = 128 bit patterns, so only 128 characters can be represented.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0013",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0013",
      "questionNumber": 13,
      "topic": "Image representation",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "An image is 800 pixels wide and 600 pixels high, with a colour depth of 24 bits. Calculate the file size in megabytes, ignoring metadata. Show your working. (1 MB = 1,000,000 bytes)",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0013-point-1",
          "description": "800 × 600 = 480,000 pixels",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0013-point-2",
          "description": "× 24 = 11,520,000 bits",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0013-point-3",
          "description": "÷ 8 = 1,440,000 bytes",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0013-point-4",
          "description": "= 1.44 MB",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "800 × 600 × 24 = 11,520,000 bits = 1,440,000 bytes = 1.44 MB",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0014",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0014",
      "questionNumber": 14,
      "topic": "Image representation",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "State what is meant by metadata and give two examples stored with an image file.",
      "context": "",
      "marks": 3,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0014-point-1",
          "description": "Data about the data / extra information stored with the file",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0014-point-2",
          "description": "Example: width",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0014-point-3",
          "description": "Example: height / colour depth / date created / camera settings",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Metadata is data about the file, such as its width, height and colour depth.",
      "examinerGuidance": [
        "1 mark for definition; 1 mark each for two examples."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0015",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0015",
      "questionNumber": 15,
      "topic": "Sound representation",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "A 10-second mono sound clip is recorded at 44,100 Hz with a bit depth of 16. Calculate the file size in kilobytes. (1 kB = 1,000 bytes)",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0015-point-1",
          "description": "44,100 × 16 × 10 = 7,056,000 bits",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0015-point-2",
          "description": "÷ 8 = 882,000 bytes",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0015-point-3",
          "description": "= 882 kB",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "882 kB",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0016",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0016",
      "questionNumber": 16,
      "topic": "Sound representation",
      "questionType": "explain",
      "commandWord": "define",
      "question": "Define the terms sample rate and bit depth.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0016-point-1",
          "description": "Sample rate: number of samples taken per second",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0016-point-2",
          "description": "Bit depth: number of bits used to store each sample",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Sample rate is how many samples are taken each second; bit depth is how many bits store each sample.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0017",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0017",
      "questionNumber": 17,
      "topic": "Data compression",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "Use run length encoding (RLE) to compress the string AAAAABBBCCCCCCCC. State how many characters are saved.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0017-point-1",
          "description": "5A 3B 8C (or equivalent pairs)",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0017-point-2",
          "description": "Original 16 characters, compressed 6 characters",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0017-point-3",
          "description": "10 characters saved",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "5A3B8C — 6 characters instead of 16, saving 10.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0018",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0018",
      "questionNumber": 18,
      "topic": "Data compression",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "A Huffman tree gives the codes A = 0, B = 10 and C = 11. Encode ABAC and compare its size with 7-bit ASCII.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0018-point-1",
          "description": "Encoding: 010011",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0018-point-2",
          "description": "6 bits with Huffman",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0018-point-3",
          "description": "4 × 7 = 28 bits in ASCII, so 22 bits saved",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "010011: 6 bits compared with 28 bits in ASCII.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0019",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0019",
      "questionNumber": 19,
      "topic": "Data compression",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain why run length encoding is not effective for compressing a photograph.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0019-point-1",
          "description": "RLE works by replacing runs of repeated data",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0019-point-2",
          "description": "Photographs have few long runs of identical pixels",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0019-point-3",
          "description": "The encoded file may be similar in size or even larger",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Photos have lots of colour variation, so there are few repeated runs; RLE may make the file larger.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0020",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0020",
      "questionNumber": 20,
      "topic": "Boolean logic",
      "questionType": "truth-table",
      "commandWord": "complete",
      "question": "Complete a truth table for P = NOT (A AND B).",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0020-point-1",
          "description": "A=0,B=0 → 1 and A=0,B=1 → 1",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0020-point-2",
          "description": "A=1,B=0 → 1 and A=1,B=1 → 0",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Outputs: 1, 1, 1, 0 (this is a NAND gate).",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0021",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0021",
      "questionNumber": 21,
      "topic": "Boolean logic",
      "questionType": "truth-table",
      "commandWord": "complete",
      "question": "Complete a truth table for Q = (A OR B) AND NOT C for all eight combinations of A, B and C.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0021-point-1",
          "description": "Rows where C = 1 all output 0",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0021-point-2",
          "description": "A=0,B=0,C=0 outputs 0",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0021-point-3",
          "description": "Rows with A or B = 1 and C = 0 output 1",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Q = 1 only for (A,B,C) = (0,1,0), (1,0,0) and (1,1,0); all other rows give 0.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0022",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0022",
      "questionNumber": 22,
      "topic": "Boolean logic",
      "questionType": "calculation",
      "commandWord": "calculate",
      "question": "Given Q = (A OR B) AND NOT C, state the value of Q when A = 1, B = 0 and C = 1. Show your working.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0022-point-1",
          "description": "A OR B = 1 and NOT C = 0",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0022-point-2",
          "description": "Q = 1 AND 0 = 0",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Q = 0",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0023",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0023",
      "questionNumber": 23,
      "topic": "Boolean logic",
      "questionType": "scenario-application",
      "commandWord": "write",
      "question": "A car alarm (S) sounds if the alarm is armed (A) and either a door is opened (D) or movement is detected (M). Write a Boolean expression for S.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch5-0023-point-1",
          "description": "Uses A AND …",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0023-point-2",
          "description": "(D OR M) bracketed correctly: S = A AND (D OR M)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "S = A AND (D OR M)",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0024",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0024",
      "questionNumber": 24,
      "topic": "Boolean logic",
      "questionType": "scenario-application",
      "commandWord": "write",
      "question": "A heating system (H) turns on when it is cold (C) and the window is not open (W), or when the manual override (M) is pressed. Write the Boolean expression and state how many rows its truth table needs.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch5-0024-point-1",
          "description": "H = (C AND NOT W) OR M",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0024-point-2",
          "description": "Correct use of NOT W",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0024-point-3",
          "description": "8 rows (2^3)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "H = (C AND NOT W) OR M; 8 rows.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0025",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0025",
      "questionNumber": 25,
      "topic": "CPU architecture",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe the purpose of the Arithmetic Logic Unit (ALU) and the Control Unit (CU).",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0025-point-1",
          "description": "ALU performs arithmetic calculations",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0025-point-2",
          "description": "ALU performs logical operations / comparisons",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0025-point-3",
          "description": "CU decodes instructions",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0025-point-4",
          "description": "CU sends control signals to coordinate components / manages the fetch-execute cycle",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "The ALU carries out arithmetic and logic operations; the CU decodes instructions and sends control signals that coordinate the rest of the CPU.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0026",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0026",
      "questionNumber": 26,
      "topic": "CPU architecture",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "State what is meant by an embedded system and give two examples.",
      "context": "",
      "marks": 3,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0026-point-1",
          "description": "A computer system built into a larger device to perform a dedicated function",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0026-point-2",
          "description": "Valid example, e.g. washing machine",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0026-point-3",
          "description": "Second valid example, e.g. microwave / car engine management / smart thermostat",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A computer inside a larger device that performs one dedicated task, e.g. a washing machine controller or a microwave.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0027",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0027",
      "questionNumber": 27,
      "topic": "Memory and storage",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Give two differences between RAM and ROM.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0027-point-1",
          "description": "Any 2 from: RAM is volatile; ROM is non-volatile; RAM can be written to/changed; ROM is read-only; RAM holds programs/data in use; ROM holds the boot-up instructions (BIOS).",
          "marks": 2
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "RAM is volatile and read/write, holding running programs; ROM is non-volatile, read-only and stores start-up instructions.",
      "examinerGuidance": [
        "One mark per valid difference, maximum 2. Both sides of each difference needed."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0028",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0028",
      "questionNumber": 28,
      "topic": "Memory and storage",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain what virtual memory is and why using it can slow a computer down.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0028-point-1",
          "description": "Used when RAM is full",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0028-point-2",
          "description": "Part of secondary storage is used as if it were RAM",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0028-point-3",
          "description": "Data is swapped between RAM and secondary storage",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0028-point-4",
          "description": "Secondary storage is much slower than RAM, so performance drops",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "When RAM is full, part of the disk acts as extra memory. Pages are swapped in and out, and because secondary storage is slower than RAM, the computer slows down.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0029",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0029",
      "questionNumber": 29,
      "topic": "Memory and storage",
      "questionType": "scenario-application",
      "commandWord": "explain",
      "question": "A wildlife photographer needs storage for a camera used outdoors. Recommend a type of storage and justify your choice with two reasons.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0029-point-1",
          "description": "Any 3 from: Solid state / flash memory (e.g. SD card); Durable / no moving parts so it withstands knocks; Small and lightweight / portable; Low power use / fast write speed.",
          "marks": 3
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Flash memory such as an SD card: it has no moving parts so it is robust, and it is small, light and fast.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0030",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0030",
      "questionNumber": 30,
      "topic": "Memory and storage",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "A 64 GB memory card stores photographs that are 4 MB each. How many photographs can it hold? (1 GB = 1,000 MB)",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0030-point-1",
          "description": "64 × 1,000 = 64,000 MB",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0030-point-2",
          "description": "64,000 ÷ 4 = 16,000 photographs",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "16,000",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0031",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0031",
      "questionNumber": 31,
      "topic": "Computer networks",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "State two differences between a LAN and a WAN.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0031-point-1",
          "description": "LAN covers a small geographical area; WAN a large area",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0031-point-2",
          "description": "LAN infrastructure usually owned by the organisation; WAN uses third-party / leased infrastructure",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A LAN covers a small area such as one building and is owned by the organisation; a WAN covers a large area using infrastructure owned by others.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0032",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0032",
      "questionNumber": 32,
      "topic": "Computer networks",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Describe one advantage and one disadvantage of a star topology compared with a mesh topology.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0032-point-1",
          "description": "Advantage: fewer cables / cheaper / easier to set up and add devices",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0032-point-2",
          "description": "Disadvantage: if the central switch fails the whole network fails / single point of failure",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Star is cheaper and easier to install, but depends on the central switch; in a mesh there are multiple routes.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0033",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0033",
      "questionNumber": 33,
      "topic": "Computer networks",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe how data is sent across the internet using packet switching.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0033-point-1",
          "description": "Any 4 from: Data is split into packets; Each packet has a header with destination/source address and sequence number; Packets may take different routes; Packets are reassembled in order at the destination; Missing packets are requested again.",
          "marks": 4
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Data is broken into numbered packets with addresses; routers send each by the best route, and the receiver reorders them and requests any lost ones.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0034",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0034",
      "questionNumber": 34,
      "topic": "Computer networks",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "State the purpose of each protocol: HTTPS, SMTP, IMAP.",
      "context": "",
      "marks": 3,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0034-point-1",
          "description": "HTTPS: securely transfers web pages (encrypted)",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0034-point-2",
          "description": "SMTP: sends email",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0034-point-3",
          "description": "IMAP: retrieves/accesses email kept on the server",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "HTTPS transfers web pages securely; SMTP sends email; IMAP accesses email stored on a mail server.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0035",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0035",
      "questionNumber": 35,
      "topic": "Computer networks",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain why protocols are organised into layers.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0035-point-1",
          "description": "Any 3 from: Each layer has a specific function; A layer can be changed without affecting the others; Different manufacturers/developers can work on separate layers / supports interoperability; Simplifies design and troubleshooting.",
          "marks": 3
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Layers break networking into separate jobs, so each can be developed or changed independently and devices from different makers can work together.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0036",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0036",
      "questionNumber": 36,
      "topic": "Computer networks",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe the role of the Domain Name System (DNS) when a user types a web address.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0036-point-1",
          "description": "Any 3 from: The browser sends the domain name to a DNS server; The DNS server looks up the matching IP address; If not found it queries another DNS server; The IP address is returned so the browser can connect to the web server.",
          "marks": 3
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "DNS translates the domain name into an IP address so the browser can contact the correct web server.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0037",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0037",
      "questionNumber": 37,
      "topic": "Cybersecurity",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe what is meant by an SQL injection attack and one way to prevent it.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0037-point-1",
          "description": "Malicious SQL code is entered into an input box",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0037-point-2",
          "description": "The database runs the code, e.g. revealing or deleting data",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0037-point-3",
          "description": "Prevention: input validation / sanitisation / parameterised queries",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "An attacker types SQL into a form so the database executes it; validating inputs and using parameterised queries prevents it.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0038",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0038",
      "questionNumber": 38,
      "topic": "Cybersecurity",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe what is meant by a denial of service (DoS) attack.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0038-point-1",
          "description": "A server/network is flooded with requests",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0038-point-2",
          "description": "It cannot respond to genuine users / service becomes unavailable",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "The attacker floods a server with traffic so legitimate users cannot access it.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0039",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0039",
      "questionNumber": 39,
      "topic": "Cybersecurity",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain the purpose of penetration testing.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0039-point-1",
          "description": "Authorised simulated attack on a system",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0039-point-2",
          "description": "To find vulnerabilities before criminals do",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0039-point-3",
          "description": "So weaknesses can be fixed",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Testers are employed to attack the system legally to find weaknesses so they can be fixed.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0040",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0040",
      "questionNumber": 40,
      "topic": "Cybersecurity",
      "questionType": "compare",
      "commandWord": "describe",
      "question": "Describe the difference between a virus and a worm.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0040-point-1",
          "description": "A virus attaches itself to a file/program",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0040-point-2",
          "description": "A virus needs a user to run the infected file to spread",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0040-point-3",
          "description": "A worm replicates itself and spreads across networks without user action",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A virus spreads by attaching to files that users run; a worm copies itself across networks on its own.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0041",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0041",
      "questionNumber": 41,
      "topic": "Cybersecurity",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe what is meant by 'shouldering' and one way to prevent it.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0041-point-1",
          "description": "Watching someone enter a password/PIN",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0041-point-2",
          "description": "Prevention: shield the keypad / use biometrics / be aware of surroundings",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Shouldering is watching someone type a PIN or password; covering the keypad prevents it.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0042",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0042",
      "questionNumber": 42,
      "topic": "Systems software",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain how defragmentation improves the performance of a hard disk drive.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0042-point-1",
          "description": "Any 3 from: Files become split into fragments in different places over time; Defragmentation moves fragments so each file is stored contiguously; Free space is grouped together; Read/write head moves less, so files load faster.",
          "marks": 3
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "It reorganises split files so each is stored in one continuous block; the read head moves less, so access is faster.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0043",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0043",
      "questionNumber": 43,
      "topic": "Systems software",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Compare full backups and incremental backups.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0043-point-1",
          "description": "Full backup copies all data each time",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0043-point-2",
          "description": "Incremental copies only data changed since the last backup",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0043-point-3",
          "description": "Incremental is quicker and uses less storage",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0043-point-4",
          "description": "Restoring from incremental is slower / needs the full backup plus every increment",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Full backups copy everything; incremental backups copy only changes, which is faster and smaller but slower to restore.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0044",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0044",
      "questionNumber": 44,
      "topic": "Systems software",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain why defragmenting a solid state drive is unnecessary.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0044-point-1",
          "description": "Any 2 from: SSDs have no moving read/write head; Access time is the same wherever data is stored; Defragmenting causes extra writes that reduce SSD lifespan.",
          "marks": 2
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "SSDs access all locations equally fast, so fragmentation does not slow them, and extra writes wear them out.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0045",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0045",
      "questionNumber": 45,
      "topic": "Programming languages and IDEs",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Compare a compiler and an interpreter.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0045-point-1",
          "description": "Compiler translates the whole program in one go; interpreter translates line by line",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0045-point-2",
          "description": "Compiler produces an executable file; interpreter does not",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0045-point-3",
          "description": "Compiled programs run faster",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0045-point-4",
          "description": "Interpreter stops at the first error so debugging is easier; compiler reports errors after translating",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A compiler translates the whole program into an executable that runs quickly; an interpreter translates and runs one line at a time, which helps debugging.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0046",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0046",
      "questionNumber": 46,
      "topic": "Programming languages and IDEs",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Give two features of an IDE and explain how each helps a programmer.",
      "context": "",
      "marks": 4,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0046-point-1",
          "description": "Editor with syntax highlighting / auto-indent makes code easier to read",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0046-point-2",
          "description": "Error diagnostics highlight mistakes",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0046-point-3",
          "description": "Breakpoints / stepping help find logic errors",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0046-point-4",
          "description": "Run-time environment / translator lets code be tested quickly",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Syntax highlighting makes code easier to read, and breakpoints let the programmer pause code to find errors.",
      "examinerGuidance": [
        "1 mark per feature, 1 mark per matching explanation."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0047",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0047",
      "questionNumber": 47,
      "topic": "Programming languages and IDEs",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain why a programmer might choose to write part of a program in a low-level language.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0047-point-1",
          "description": "Direct control of hardware / memory / registers",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0047-point-2",
          "description": "Code can be more efficient / run faster",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0047-point-3",
          "description": "Uses less memory, useful for embedded systems",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Low-level code gives direct hardware control and can be faster and smaller, which suits embedded or time-critical systems.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0048",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0048",
      "questionNumber": 48,
      "topic": "Programming languages and IDEs",
      "questionType": "explain",
      "commandWord": "state",
      "question": "State why a program written in a high-level language must be translated before it runs.",
      "context": "",
      "marks": 1,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0048-point-1",
          "description": "The CPU only understands machine code / binary",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "The processor can only execute machine code.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0049",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0049",
      "questionNumber": 49,
      "topic": "Ethical, legal and environmental impacts",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe two principles of the Data Protection Act 2018 (UK GDPR) that a company must follow.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0049-point-1",
          "description": "Any 2 from: Data must be used fairly, lawfully and transparently; Used only for specified purposes; Adequate, relevant and limited to what is necessary; Accurate and kept up to date; Kept no longer than necessary; Kept secure.",
          "marks": 2
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Personal data must be used lawfully for stated purposes and kept secure and accurate.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0050",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0050",
      "questionNumber": 50,
      "topic": "Ethical, legal and environmental impacts",
      "questionType": "explain",
      "commandWord": "state",
      "question": "State the three offences under the Computer Misuse Act 1990.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0050-point-1",
          "description": "Unauthorised access to computer material",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0050-point-2",
          "description": "Unauthorised access with intent to commit or facilitate further offences",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0050-point-3",
          "description": "Unauthorised acts with intent to impair operation of a computer (e.g. modifying data, spreading malware)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Unauthorised access; unauthorised access with intent to commit further offences; unauthorised acts intended to impair a computer.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0051",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0051",
      "questionNumber": 51,
      "topic": "Ethical, legal and environmental impacts",
      "questionType": "scenario-application",
      "commandWord": "explain",
      "question": "A student copies music from a website and shares it with friends. Identify the law broken and explain why.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0051-point-1",
          "description": "Copyright, Designs and Patents Act 1988",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0051-point-2",
          "description": "The music is the creator's intellectual property",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0051-point-3",
          "description": "Copying/distributing without permission is illegal",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "This breaks the Copyright, Designs and Patents Act: the music belongs to its creator and sharing it without permission is illegal.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0052",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0052",
      "questionNumber": 52,
      "topic": "Ethical, legal and environmental impacts",
      "questionType": "discuss",
      "commandWord": "discuss",
      "question": "A city council plans to install facial-recognition cameras in its town centre. Discuss the ethical, legal and privacy issues.",
      "context": "",
      "marks": 6,
      "difficulty": "higher",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch5-0052-point-1",
          "description": "Marked using the levels of response. Indicative content: Could help detect crime / find missing people; Privacy concerns: people tracked without consent; Data protection: images are personal data and must be stored securely and lawfully; Risk of misidentification / bias against some groups; Who has access to the data and for how long it is kept; Possible chilling effect on public behaviour / freedom.",
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
      "modelAnswer": "A good answer weighs crime prevention against privacy, consent, data protection duties, accuracy and bias, and reaches a justified conclusion.",
      "examinerGuidance": [
        "Mark using the levels of response. Indicative content is not exhaustive."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0053",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0053",
      "questionNumber": 53,
      "topic": "Ethical, legal and environmental impacts",
      "questionType": "discuss",
      "commandWord": "discuss",
      "question": "Discuss the impact of self-driving delivery vehicles on society.",
      "context": "",
      "marks": 6,
      "difficulty": "higher",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch5-0053-point-1",
          "description": "Marked using the levels of response. Indicative content: Fewer accidents caused by human error; Job losses for delivery drivers; Who is legally responsible if an accident happens; Cost savings / 24-hour deliveries; Risk of hacking / software faults; Environmental effects, e.g. efficient routes, electric vehicles.",
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
      "modelAnswer": "Balanced discussion of safety, employment, liability, security and environment with a reasoned conclusion.",
      "examinerGuidance": [
        "Mark using the levels of response."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0054",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0054",
      "questionNumber": 54,
      "topic": "Algorithms",
      "questionType": "code-tracing",
      "commandWord": "trace",
      "question": "A binary search looks for 23 in the sorted list [2, 5, 8, 12, 16, 23, 38, 45, 56, 72] (indexes 0–9), using mid = (low + high) DIV 2. List the items compared, in order.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0054-point-1",
          "description": "First comparison: 16 (index 4)",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0054-point-2",
          "description": "Second comparison: 45 (index 7)",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0054-point-3",
          "description": "Third comparison: 23 found (index 5)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "16, 45, 23",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0055",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0055",
      "questionNumber": 55,
      "topic": "Algorithms",
      "questionType": "code-tracing",
      "commandWord": "trace",
      "question": "Show the list [5, 1, 4, 2, 8] after the first pass of a bubble sort into ascending order.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0055-point-1",
          "description": "At least one correct swap shown (5 and 1, 5 and 4, 5 and 2)",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0055-point-2",
          "description": "Correct result: [1, 4, 2, 5, 8]",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "[1, 4, 2, 5, 8]",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0056",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0056",
      "questionNumber": 56,
      "topic": "Algorithms",
      "questionType": "code-tracing",
      "commandWord": "trace",
      "question": "Show the stages of a merge sort on the list [6, 3, 8, 1].",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0056-point-1",
          "description": "List split into single items: [6] [3] [8] [1]",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0056-point-2",
          "description": "Merged into pairs: [3, 6] [1, 8]",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0056-point-3",
          "description": "Final merge: [1, 3, 6, 8]",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "[6,3][8,1] → [6][3][8][1] → [3,6][1,8] → [1,3,6,8]",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0057",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0057",
      "questionNumber": 57,
      "topic": "Algorithms",
      "questionType": "code-tracing",
      "commandWord": "trace",
      "question": "Show the list [4, 3, 2, 10, 12, 1] after each of the first two passes of an insertion sort.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0057-point-1",
          "description": "After pass 1: [3, 4, 2, 10, 12, 1]",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0057-point-2",
          "description": "After pass 2: [2, 3, 4, 10, 12, 1]",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "[3,4,2,10,12,1] then [2,3,4,10,12,1]",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0058",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0058",
      "questionNumber": 58,
      "topic": "Algorithms",
      "questionType": "explain",
      "commandWord": "define",
      "question": "Define the terms abstraction and decomposition.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0058-point-1",
          "description": "Abstraction: removing unnecessary detail to focus on what is important",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0058-point-2",
          "description": "Decomposition: breaking a problem into smaller sub-problems",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Abstraction removes unnecessary detail; decomposition breaks a problem into smaller parts.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0059",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0059",
      "questionNumber": 59,
      "topic": "Algorithms",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "A maths app shows a map of the London Underground that ignores real distances and street layout. Explain how this is an example of abstraction.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0059-point-1",
          "description": "Unnecessary details (true distances, streets) are removed",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0059-point-2",
          "description": "Only the important information is kept: stations, lines and connections",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0059-point-3",
          "description": "Makes the map easier to understand and use",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Irrelevant details are removed, keeping only stations and connections, so the problem of planning a journey is easier.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0060",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0060",
      "questionNumber": 60,
      "topic": "Algorithms",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "A list contains 1,000,000 sorted names. What is the maximum number of comparisons a binary search needs? Explain your answer.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0060-point-1",
          "description": "20 comparisons",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0060-point-2",
          "description": "Each comparison halves the list",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0060-point-3",
          "description": "2^20 = 1,048,576 which is at least 1,000,000",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "20, because 2^20 > 1,000,000 and each comparison halves the remaining list.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0061",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0061",
      "questionNumber": 61,
      "topic": "Programming",
      "questionType": "code-tracing",
      "commandWord": "trace",
      "question": "State the output of this code:\ntotal = 0\nfor i in range(1, 5):\n    if i % 2 == 0:\n        total = total + i\nprint(total)",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0061-point-1",
          "description": "Identifies that only 2 and 4 are added",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0061-point-2",
          "description": "Output: 6",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "6",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0062",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0062",
      "questionNumber": 62,
      "topic": "Programming",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "A phone number such as 07700900123 is to be stored. Explain why it should be stored as a string and not an integer.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0062-point-1",
          "description": "The leading zero would be lost as an integer",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0062-point-2",
          "description": "No arithmetic is performed on phone numbers",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0062-point-3",
          "description": "May contain spaces or + symbols",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Storing as an integer would remove the leading 0, and the number is never used in calculations.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0063",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0063",
      "questionNumber": 63,
      "topic": "Programming",
      "questionType": "code-tracing",
      "commandWord": "trace",
      "question": "scores = [[12, 15, 9], [18, 7, 14], [10, 20, 16]]. Using zero-based indexing as scores[row][column], state the value of scores[1][2] and of scores[2][0].",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0063-point-1",
          "description": "scores[1][2] = 14",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0063-point-2",
          "description": "scores[2][0] = 10",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "14 and 10",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0064",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0064",
      "questionNumber": 64,
      "topic": "Programming",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Explain the difference between a function and a procedure.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0064-point-1",
          "description": "Any 2 from: A function returns a value; A procedure does not return a value / performs a task; Both are named blocks of code that can take parameters.",
          "marks": 2
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Both are sub-programs, but a function returns a value to where it was called and a procedure does not.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0065",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0065",
      "questionNumber": 65,
      "topic": "Programming",
      "questionType": "code-completion",
      "commandWord": "write",
      "question": "Write a Python function is_valid_password(pw) that returns True if the password is at least 8 characters long and contains at least one digit, and False otherwise.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch5-0065-point-1",
          "description": "Function defined with a parameter",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0065-point-2",
          "description": "Checks len(pw) >= 8",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0065-point-3",
          "description": "Checks for at least one digit (e.g. loop with isdigit or any())",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0065-point-4",
          "description": "Returns True/False correctly in all cases",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "def is_valid_password(pw):\n    has_digit = False\n    for ch in pw:\n        if ch.isdigit():\n            has_digit = True\n    return len(pw) >= 8 and has_digit",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0066",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0066",
      "questionNumber": 66,
      "topic": "Programming",
      "questionType": "code-completion",
      "commandWord": "write",
      "question": "Write a line of Python that generates a random whole number between 1 and 6 inclusive and stores it in a variable called roll. Assume random has been imported.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch5-0066-point-1",
          "description": "Uses random.randint",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0066-point-2",
          "description": "Correct range (1, 6) assigned to roll",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "roll = random.randint(1, 6)",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0067",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0067",
      "questionNumber": 67,
      "topic": "Programming",
      "questionType": "code-tracing",
      "commandWord": "trace",
      "question": "State the output of this code:\ndef mystery(a, b):\n    while b != 0:\n        a, b = b, a % b\n    return a\nprint(mystery(48, 18))",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0067-point-1",
          "description": "Values: (48,18) → (18,12) → (12,6) → (6,0)",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0067-point-2",
          "description": "Output: 6",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0067-point-3",
          "description": "Identifies it finds the highest common factor",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "6 — the function calculates the greatest common divisor.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0068",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0068",
      "questionNumber": 68,
      "topic": "Programming",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain why programmers use subroutines.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0068-point-1",
          "description": "Any 3 from: Code can be reused without rewriting; Programs are easier to read and maintain; Problems can be decomposed / different programmers can work on different parts; Each subroutine can be tested separately.",
          "marks": 3
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Subroutines avoid repeating code, make programs easier to read, test and maintain, and let a team split the work.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0069",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0069",
      "questionNumber": 69,
      "topic": "Programming",
      "questionType": "algorithm-design",
      "commandWord": "write",
      "question": "Write a program that reads a test score (0–100) and outputs 'Distinction' for 70 or more, 'Merit' for 50–69, 'Pass' for 40–49 and 'Fail' below 40.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch5-0069-point-1",
          "description": "Input converted to an integer",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0069-point-2",
          "description": "Correct boundary for Distinction (>= 70)",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0069-point-3",
          "description": "Correct boundaries for Merit and Pass",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0069-point-4",
          "description": "Uses if/elif/else so only one grade is output",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "score = int(input())\nif score >= 70: print('Distinction')\nelif score >= 50: print('Merit')\nelif score >= 40: print('Pass')\nelse: print('Fail')",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0070",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0070",
      "questionNumber": 70,
      "topic": "Programming",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain what casting is and give an example of when it is needed.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0070-point-1",
          "description": "Changing a value from one data type to another",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0070-point-2",
          "description": "Example: converting input (a string) to an integer before arithmetic",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Casting converts data between types, e.g. int(input()) so a typed number can be used in a calculation.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0071",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0071",
      "questionNumber": 71,
      "topic": "Programming",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe how a program can write data to a text file and why this is useful.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0071-point-1",
          "description": "Any 3 from: Open the file in write/append mode; Write the data / lines to the file; Close the file; Data is kept after the program ends / persistent storage.",
          "marks": 3
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Open the file for writing or appending, write the data, then close it; the data is saved permanently for later use.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0072",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0072",
      "questionNumber": 72,
      "topic": "Databases and SQL",
      "questionType": "code-completion",
      "commandWord": "write",
      "question": "A table Pets has fields PetID, Name, Species and Age. Write an SQL query to show the names of all dogs older than 5, oldest first.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch5-0072-point-1",
          "description": "SELECT Name FROM Pets",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0072-point-2",
          "description": "WHERE Species = 'Dog' AND Age > 5",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0072-point-3",
          "description": "ORDER BY Age DESC",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "SELECT Name FROM Pets WHERE Species = 'Dog' AND Age > 5 ORDER BY Age DESC;",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0073",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0073",
      "questionNumber": 73,
      "topic": "Databases and SQL",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain why storing customer details in a separate table from orders reduces data redundancy.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0073-point-1",
          "description": "Customer details are stored once, not repeated with every order",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0073-point-2",
          "description": "Orders refer to the customer using a foreign key",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0073-point-3",
          "description": "Fewer inconsistencies when details change / less storage used",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Each customer is stored once and linked by ID, so data isn't repeated and updates only happen in one place.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0074",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0074",
      "questionNumber": 74,
      "topic": "Databases and SQL",
      "questionType": "code-completion",
      "commandWord": "write",
      "question": "A table Students has fields StudentID, FirstName, Surname and Form. Write SQL to display every field for students in form 10B.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch5-0074-point-1",
          "description": "SELECT * FROM Students",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0074-point-2",
          "description": "WHERE Form = '10B'",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "SELECT * FROM Students WHERE Form = '10B';",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0075",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0075",
      "questionNumber": 75,
      "topic": "Databases and SQL",
      "questionType": "code-completion",
      "commandWord": "write",
      "question": "Write SQL to change the Form of the student with StudentID 1042 to '11A' in the Students table.",
      "context": "",
      "marks": 2,
      "difficulty": "higher",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch5-0075-point-1",
          "description": "UPDATE Students SET Form = '11A'",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0075-point-2",
          "description": "WHERE StudentID = 1042",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "UPDATE Students SET Form = '11A' WHERE StudentID = 1042;",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0076",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0076",
      "questionNumber": 76,
      "topic": "Defensive design",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe three different validation checks, giving an example of each.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0076-point-1",
          "description": "Any 3 from: Range check, e.g. age between 11 and 18; Presence check, e.g. surname not left blank; Length check, e.g. password at least 8 characters; Format check, e.g. postcode pattern; Type check, e.g. quantity is an integer.",
          "marks": 3
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Range (age 11–18), presence (name not blank) and length (password at least 8 characters).",
      "examinerGuidance": [
        "One mark per check with matching example, maximum 3."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0077",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0077",
      "questionNumber": 77,
      "topic": "Defensive design",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Explain the difference between validation and verification.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0077-point-1",
          "description": "Validation checks data is sensible/reasonable/follows rules",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0077-point-2",
          "description": "Verification checks data has been entered/copied correctly",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0077-point-3",
          "description": "Example of verification: double entry of a password / proofreading",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Validation checks data is reasonable (e.g. in range); verification checks it was entered accurately (e.g. typing an email twice).",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0078",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0078",
      "questionNumber": 78,
      "topic": "Software development and testing",
      "questionType": "complete-table",
      "commandWord": "complete",
      "question": "A program accepts ages from 11 to 16 inclusive. Give one example of normal, boundary and invalid (erroneous) test data, and the expected outcome of each.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch5-0078-point-1",
          "description": "Normal: e.g. 13 – accepted",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0078-point-2",
          "description": "Boundary: 11 or 16 (accepted) or 10/17 (rejected) with correct outcome",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0078-point-3",
          "description": "Invalid/erroneous: e.g. 25 or 'abc' – rejected",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Normal 13 accepted; boundary 16 accepted; erroneous 'ten' rejected.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0079",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0079",
      "questionNumber": 79,
      "topic": "Software development and testing",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Explain the difference between iterative testing and final (terminal) testing.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0079-point-1",
          "description": "Iterative testing happens during development, after each module/change",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0079-point-2",
          "description": "Final testing happens when the program is complete",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0079-point-3",
          "description": "Final testing checks the whole program meets the requirements",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Iterative testing is repeated as each part is written; final testing checks the finished program against its requirements.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0080",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0080",
      "questionNumber": 80,
      "topic": "Data representation",
      "questionType": "conversion",
      "commandWord": "calculate",
      "question": "Represent −45 as an 8-bit two's complement binary number. Show your working.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0080-point-1",
          "description": "+45 = 00101101",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0080-point-2",
          "description": "Invert bits: 11010010 and add 1",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0080-point-3",
          "description": "Answer: 11010011",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "11010011",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0081",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0081",
      "questionNumber": 81,
      "topic": "Data representation",
      "questionType": "conversion",
      "commandWord": "calculate",
      "question": "Convert the 8-bit two's complement number 11101100 into denary.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0081-point-1",
          "description": "Most significant bit has value −128",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0081-point-2",
          "description": "−128 + 64 + 32 + 8 + 4",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0081-point-3",
          "description": "= −20",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "−20",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0082",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0082",
      "questionNumber": 82,
      "topic": "Data representation",
      "questionType": "explain",
      "commandWord": "state",
      "question": "State the range of integers that can be represented in 8-bit two's complement.",
      "context": "",
      "marks": 1,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0082-point-1",
          "description": "−128 to +127",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "−128 to 127",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0083",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0083",
      "questionNumber": 83,
      "topic": "Data representation",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "A floating-point number uses an 8-bit two's complement mantissa (0.1100000) and a 4-bit two's complement exponent (0011). Calculate its denary value.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0083-point-1",
          "description": "Exponent = 3",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0083-point-2",
          "description": "Binary point moved 3 places right: 0110.0000",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0083-point-3",
          "description": "Value = 6",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "0.11 × 2^3 = 110 = 6",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0084",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0084",
      "questionNumber": 84,
      "topic": "Data representation",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Explain the trade-off between the number of bits allocated to the mantissa and to the exponent in a fixed-size floating-point format.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0084-point-1",
          "description": "More mantissa bits give greater precision",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0084-point-2",
          "description": "More exponent bits give a greater range",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0084-point-3",
          "description": "With a fixed total, increasing one reduces the other",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Extra mantissa bits improve precision, extra exponent bits increase range; in a fixed size you gain one only by losing the other.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0085",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0085",
      "questionNumber": 85,
      "topic": "Data representation",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "Using unsigned fixed-point binary with 4 bits before and 4 bits after the binary point, convert 0110.1010 into denary.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0085-point-1",
          "description": "Integer part: 0110 = 6",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0085-point-2",
          "description": "Fractional part: 0.5 + 0.125 = 0.625",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0085-point-3",
          "description": "Answer: 6.625",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "6.625",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0086",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0086",
      "questionNumber": 86,
      "topic": "Boolean algebra",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "Simplify (A + B)·(A + C).",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0086-point-1",
          "description": "Expand: A·A + A·C + A·B + B·C",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0086-point-2",
          "description": "A·A = A, and A + A·C + A·B = A (absorption)",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0086-point-3",
          "description": "Result: A + B·C",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A + B·C",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0087",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0087",
      "questionNumber": 87,
      "topic": "Boolean algebra",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe the purpose of a half adder and give its outputs in Boolean form.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0087-point-1",
          "description": "Adds two single bits",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0087-point-2",
          "description": "Sum = A XOR B",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0087-point-3",
          "description": "Carry = A AND B",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A half adder adds two bits: Sum = A ⊕ B, Carry = A·B.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0088",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0088",
      "questionNumber": 88,
      "topic": "Boolean algebra",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain how a full adder differs from a half adder and how full adders can be combined.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0088-point-1",
          "description": "Any 3 from: A full adder has three inputs including a carry-in; Outputs sum and carry-out; Carry-out of one full adder feeds the carry-in of the next; Chained to add multi-bit numbers.",
          "marks": 3
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A full adder also accepts a carry-in; chaining carry-out to carry-in lets several full adders add multi-bit binary numbers.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0089",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0089",
      "questionNumber": 89,
      "topic": "Boolean algebra",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe the purpose of a D-type flip-flop.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0089-point-1",
          "description": "Stores one bit of data",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0089-point-2",
          "description": "Output takes the value of input D on the clock edge",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0089-point-3",
          "description": "Holds the value until the next clock pulse / used in registers and memory",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "It stores a single bit: on each clock edge the output copies D and holds it until the next edge.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0090",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0090",
      "questionNumber": 90,
      "topic": "Computer organisation",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Compare RISC and CISC processors.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0090-point-1",
          "description": "RISC has a small set of simple instructions; CISC has many complex instructions",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0090-point-2",
          "description": "RISC instructions usually take one clock cycle",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0090-point-3",
          "description": "RISC needs more instructions/RAM for a program; CISC shorter programs",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0090-point-4",
          "description": "RISC easier to pipeline / lower power; CISC more complex hardware",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "RISC uses few simple single-cycle instructions that pipeline well and use little power; CISC has many complex instructions, making programs shorter but hardware more complex.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0091",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0091",
      "questionNumber": 91,
      "topic": "Computer organisation",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe what happens when a processor receives an interrupt.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0091-point-1",
          "description": "Interrupt is checked at the end of the current fetch-execute cycle",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0091-point-2",
          "description": "If higher priority, current register contents are saved (pushed onto the stack)",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0091-point-3",
          "description": "The interrupt service routine (ISR) is loaded/run",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0091-point-4",
          "description": "Registers are restored and the original task resumes",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "At the end of the cycle the CPU checks priority, saves its registers on the stack, runs the ISR and then restores the registers to continue.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0092",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0092",
      "questionNumber": 92,
      "topic": "Computer organisation",
      "questionType": "code-tracing",
      "commandWord": "trace",
      "question": "State the output of this Little Man Computer program when the inputs are 5 then 7:\nINP\nSTA 99\nINP\nADD 99\nOUT\nHLT",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0092-point-1",
          "description": "First input stored in address 99",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0092-point-2",
          "description": "Second input added to it",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0092-point-3",
          "description": "Output: 12",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "12",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0093",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0093",
      "questionNumber": 93,
      "topic": "Computer organisation",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain the difference between immediate and direct addressing.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0093-point-1",
          "description": "Immediate: the operand is the actual value to be used",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0093-point-2",
          "description": "Direct: the operand is the memory address where the value is stored",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "In immediate addressing the operand is the data; in direct addressing it is the address of the data.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0094",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0094",
      "questionNumber": 94,
      "topic": "Computer organisation",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain how a GPU differs from a CPU and why it suits machine learning.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0094-point-1",
          "description": "GPU has many more, simpler cores",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0094-point-2",
          "description": "Designed for parallel processing of the same operation on lots of data (SIMD)",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0094-point-3",
          "description": "Machine learning involves large numbers of independent matrix calculations",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A GPU has thousands of simple cores that perform the same operation on many data items in parallel, ideal for the matrix maths in machine learning.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0095",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0095",
      "questionNumber": 95,
      "topic": "Operating systems",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Compare paging and segmentation.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0095-point-1",
          "description": "Any 3 from: Paging divides memory into fixed-size blocks; Segmentation uses variable-size blocks based on logical divisions of a program; Pages are physical divisions; segments are logical (e.g. a module or function); Both allow programs to be stored non-contiguously.",
          "marks": 3
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Paging splits memory into equal fixed-size pages; segmentation splits programs into variable-sized logical segments.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0096",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0096",
      "questionNumber": 96,
      "topic": "Operating systems",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe the round-robin scheduling algorithm and one disadvantage.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0096-point-1",
          "description": "Each process is given a fixed time slice",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0096-point-2",
          "description": "Processes are taken from a queue in turn",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0096-point-3",
          "description": "Unfinished processes go to the back of the queue",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0096-point-4",
          "description": "Disadvantage: does not consider priority / long jobs take a long time to finish / context-switching overhead",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Each process gets a time slice in turn and returns to the back of the queue if unfinished; it ignores priority.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0097",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0097",
      "questionNumber": 97,
      "topic": "Operating systems",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain why shortest-job-first scheduling can lead to starvation.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0097-point-1",
          "description": "The shortest jobs are always chosen next",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0097-point-2",
          "description": "If short jobs keep arriving, long jobs are repeatedly postponed",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0097-point-3",
          "description": "A long job may never be processed",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Newly arriving short jobs always jump ahead, so a long job can wait indefinitely.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0098",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0098",
      "questionNumber": 98,
      "topic": "Operating systems",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain what a virtual machine is and give two uses.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0098-point-1",
          "description": "Software that emulates a computer / runs one OS inside another",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0098-point-2",
          "description": "Use: running software designed for a different OS or platform",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0098-point-3",
          "description": "Use: testing programs safely in isolation / running intermediate code such as Java bytecode",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A virtual machine is software that behaves like a separate computer; used to run other operating systems or to execute intermediate code.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0099",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0099",
      "questionNumber": 99,
      "topic": "Networking",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Name the four layers of the TCP/IP stack and state the role of the transport layer.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0099-point-1",
          "description": "Application, Transport, Internet (Network), Link",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0099-point-2",
          "description": "Transport layer splits data into packets/segments with port numbers and sequence numbers",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0099-point-3",
          "description": "Transport layer ensures reliable delivery / requests retransmission (TCP)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Application, Transport, Internet, Link; the transport layer splits data into numbered segments, adds ports and manages reliable delivery.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0100",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0100",
      "questionNumber": 100,
      "topic": "Networking",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "A network uses the address 192.168.10.0 with subnet mask 255.255.255.0 (/24). How many usable host addresses are there? Explain.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0100-point-1",
          "description": "8 bits for hosts so 2^8 = 256 addresses",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0100-point-2",
          "description": "Subtract network address and broadcast address",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0100-point-3",
          "description": "254 usable hosts",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "254",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0101",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0101",
      "questionNumber": 101,
      "topic": "Networking",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain why IPv6 was introduced.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0101-point-1",
          "description": "IPv4 uses 32-bit addresses so only about 4.3 billion addresses",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0101-point-2",
          "description": "Number of internet-connected devices exceeded this",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0101-point-3",
          "description": "IPv6 uses 128-bit addresses giving far more",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "IPv4's 32-bit addresses were running out; IPv6's 128-bit addresses provide vastly more.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0102",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0102",
      "questionNumber": 102,
      "topic": "Networking",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe how CSMA/CA is used on a wireless network.",
      "context": "",
      "marks": 4,
      "difficulty": "higher",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0102-point-1",
          "description": "Device listens to check if the channel is idle",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0102-point-2",
          "description": "If busy, waits a random back-off time",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0102-point-3",
          "description": "May send Request to Send / receive Clear to Send",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0102-point-4",
          "description": "Waits for acknowledgement; retransmits if none",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A node senses the channel and transmits only when idle, waiting a random time if busy; RTS/CTS and acknowledgements reduce collisions.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0103",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0103",
      "questionNumber": 103,
      "topic": "Networking",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain the purpose of a firewall and one technique it uses.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0103-point-1",
          "description": "Any 3 from: Monitors and controls incoming/outgoing traffic; Blocks unauthorised access according to rules; Packet filtering on IP addresses / ports / protocols; Proxy / stateful inspection.",
          "marks": 3
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A firewall inspects traffic and blocks anything that breaks its rules, e.g. packet filtering by port and IP address.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0104",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0104",
      "questionNumber": 104,
      "topic": "Cybersecurity",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Compare symmetric and asymmetric encryption.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0104-point-1",
          "description": "Symmetric uses the same key to encrypt and decrypt",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0104-point-2",
          "description": "Asymmetric uses a public key to encrypt and a private key to decrypt",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0104-point-3",
          "description": "Symmetric key must be shared securely (key distribution problem)",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0104-point-4",
          "description": "Asymmetric is slower / often used to exchange a symmetric key",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Symmetric uses one shared key and is fast but the key must be exchanged safely; asymmetric uses a public/private pair, solving key exchange but slower.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0105",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0105",
      "questionNumber": 105,
      "topic": "Cybersecurity",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe how a digital signature is created and verified.",
      "context": "",
      "marks": 4,
      "difficulty": "higher",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0105-point-1",
          "description": "A hash of the message is calculated",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0105-point-2",
          "description": "The hash is encrypted with the sender's private key",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0105-point-3",
          "description": "Receiver decrypts the signature with the sender's public key",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0105-point-4",
          "description": "Receiver hashes the message and compares the two hashes; a match proves authenticity and integrity",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "The sender hashes the message and encrypts the hash with their private key; the receiver decrypts it with the public key and compares it with their own hash.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0106",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0106",
      "questionNumber": 106,
      "topic": "Cybersecurity",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain why websites should store passwords as salted hashes.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0106-point-1",
          "description": "Any 3 from: Hashing is one-way so stolen hashes cannot simply be reversed; A salt is a random value added to each password before hashing; Identical passwords produce different hashes; Defeats pre-computed (rainbow table) attacks.",
          "marks": 3
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Hashes can't be reversed, and a unique salt means identical passwords have different hashes, stopping rainbow-table attacks.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0107",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0107",
      "questionNumber": 107,
      "topic": "Cybersecurity",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain the role of a digital certificate.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0107-point-1",
          "description": "Issued by a trusted certificate authority",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0107-point-2",
          "description": "Links a public key to the identity of its owner",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0107-point-3",
          "description": "Allows users/browsers to trust that a website is genuine",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A certificate authority vouches that a public key belongs to a particular organisation, so users can trust the site.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0108",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0108",
      "questionNumber": 108,
      "topic": "Data structures",
      "questionType": "code-tracing",
      "commandWord": "trace",
      "question": "An empty stack has these operations applied: push(5), push(8), pop(), push(3), push(1), pop(). State the contents of the stack and the two values popped.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0108-point-1",
          "description": "Popped values: 8 then 1",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0108-point-2",
          "description": "Stack contains 5 (bottom) and 3 (top)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Popped 8 and 1; stack is [5, 3] with 3 on top.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0109",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0109",
      "questionNumber": 109,
      "topic": "Data structures",
      "questionType": "code-tracing",
      "commandWord": "trace",
      "question": "The values 50, 30, 70, 20, 40, 60, 80 are inserted in that order into an empty binary search tree. Give the pre-order, in-order and post-order traversals.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0109-point-1",
          "description": "Pre-order: 50, 30, 20, 40, 70, 60, 80",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0109-point-2",
          "description": "In-order: 20, 30, 40, 50, 60, 70, 80",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0109-point-3",
          "description": "Post-order: 20, 40, 30, 60, 80, 70, 50",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "As in the mark scheme.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0110",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0110",
      "questionNumber": 110,
      "topic": "Data structures",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "A hash table has 11 slots (0–10) and uses hash(key) = key MOD 11 with linear probing. Show where the keys 25, 36 and 14 are stored.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0110-point-1",
          "description": "25 MOD 11 = 3 → slot 3",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0110-point-2",
          "description": "36 MOD 11 = 3 → collision, stored in slot 4",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0110-point-3",
          "description": "14 MOD 11 = 3 → slots 3 and 4 full, stored in slot 5",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "25 in 3, 36 in 4, 14 in 5",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0111",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0111",
      "questionNumber": 111,
      "topic": "Data structures",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe how an item is added to the front of a linked list.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0111-point-1",
          "description": "Create a new node and store the data",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0111-point-2",
          "description": "Set the new node's pointer to the current head node",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0111-point-3",
          "description": "Update the head/start pointer to point to the new node",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Create a node, point it at the current first node, then make the head pointer point to the new node.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0112",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0112",
      "questionNumber": 112,
      "topic": "Data structures",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain the difference between static and dynamic data structures.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0112-point-1",
          "description": "Static has a fixed size set at compile time",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0112-point-2",
          "description": "Dynamic can grow and shrink at run time",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0112-point-3",
          "description": "Static may waste memory or run out of space; dynamic uses memory efficiently but needs pointers/overhead",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Static structures have a fixed size; dynamic ones change size as needed, using memory efficiently at the cost of extra overhead.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0113",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0113",
      "questionNumber": 113,
      "topic": "Algorithms",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "A graph has edges A–B (4), A–C (2), C–B (1), B–D (5) and C–D (8). Use Dijkstra's algorithm to find the shortest path from A to D and its length.",
      "context": "",
      "marks": 4,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0113-point-1",
          "description": "C given distance 2 first",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0113-point-2",
          "description": "B updated to 3 via C",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0113-point-3",
          "description": "D reached with distance 8",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0113-point-4",
          "description": "Path: A → C → B → D",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A, C, B, D with length 8.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0114",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0114",
      "questionNumber": 114,
      "topic": "Algorithms",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Compare breadth-first and depth-first traversal of a graph.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0114-point-1",
          "description": "Breadth-first visits all neighbours of a node before moving further away",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0114-point-2",
          "description": "Depth-first follows one path as far as possible before backtracking",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0114-point-3",
          "description": "Breadth-first uses a queue; depth-first uses a stack / recursion",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0114-point-4",
          "description": "Breadth-first finds the shortest path in an unweighted graph",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "BFS explores level by level using a queue; DFS goes deep first using a stack; BFS finds shortest unweighted paths.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0115",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0115",
      "questionNumber": 115,
      "topic": "Computational complexity",
      "questionType": "explain",
      "commandWord": "state",
      "question": "State the time complexity, in Big-O notation, of: (a) linear search (b) binary search (c) bubble sort (d) merge sort.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0115-point-1",
          "description": "O(n)",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0115-point-2",
          "description": "O(log n)",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0115-point-3",
          "description": "O(n²)",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0115-point-4",
          "description": "O(n log n)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "O(n), O(log n), O(n²), O(n log n)",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0116",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0116",
      "questionNumber": 116,
      "topic": "Computational complexity",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain what is meant by an intractable problem and give an example.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0116-point-1",
          "description": "Any 3 from: Can be solved in theory but no polynomial-time algorithm is known; Takes an unreasonable time for large inputs; Example: travelling salesman problem (optimal solution); Heuristics are used to find good-enough solutions.",
          "marks": 3
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "An intractable problem has no known polynomial-time solution, e.g. the travelling salesman problem, so heuristics are used.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0117",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0117",
      "questionNumber": 117,
      "topic": "Recursion",
      "questionType": "code-tracing",
      "commandWord": "trace",
      "question": "State the value returned by f(4) and show the calls made:\nfunction f(n)\n  if n == 0 then return 0\n  else return n + f(n - 1)\nendfunction",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0117-point-1",
          "description": "Calls: f(4) → f(3) → f(2) → f(1) → f(0)",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0117-point-2",
          "description": "f(0) returns 0 (base case)",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0117-point-3",
          "description": "Returns 10",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "4 + 3 + 2 + 1 + 0 = 10",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0118",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0118",
      "questionNumber": 118,
      "topic": "Object-oriented programming",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "A class Vehicle has subclasses Car and Lorry. Explain how inheritance is being used and one benefit.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0118-point-1",
          "description": "Car and Lorry inherit Vehicle's attributes and methods",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0118-point-2",
          "description": "They can add their own attributes/methods",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0118-point-3",
          "description": "Benefit: reuse of code / less duplication / easier maintenance",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Car and Lorry gain everything in Vehicle and add their own features, so shared code is written only once.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0119",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0119",
      "questionNumber": 119,
      "topic": "Object-oriented programming",
      "questionType": "code-completion",
      "commandWord": "write",
      "question": "Write a class BankAccount with a private balance attribute set to 0 by the constructor, a deposit(amount) method that rejects non-positive amounts, and a getBalance() method.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch5-0119-point-1",
          "description": "Class with constructor initialising a private balance to 0",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0119-point-2",
          "description": "deposit adds amount to balance",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0119-point-3",
          "description": "deposit rejects amounts ≤ 0",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0119-point-4",
          "description": "getBalance returns the balance",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "class BankAccount:\n    def __init__(self):\n        self.__balance = 0\n    def deposit(self, amount):\n        if amount > 0:\n            self.__balance += amount\n    def getBalance(self):\n        return self.__balance",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0120",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0120",
      "questionNumber": 120,
      "topic": "Object-oriented programming",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Explain the difference between a class and an object.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0120-point-1",
          "description": "A class is a template/blueprint defining attributes and methods",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0120-point-2",
          "description": "An object is an instance of a class with its own attribute values",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A class is the blueprint; an object is a specific instance created from it.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0121",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0121",
      "questionNumber": 121,
      "topic": "Object-oriented programming",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain the difference between aggregation and composition.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0121-point-1",
          "description": "Both describe a 'has-a' relationship",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0121-point-2",
          "description": "Composition: contained object cannot exist without the container / destroyed with it",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0121-point-3",
          "description": "Aggregation: contained object can exist independently",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "In composition parts are destroyed with the whole (a room in a house); in aggregation parts exist independently (players in a team).",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0122",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0122",
      "questionNumber": 122,
      "topic": "Functional programming",
      "questionType": "code-tracing",
      "commandWord": "trace",
      "question": "State the result of each: (a) map (×2) [1, 2, 3] (b) filter (>2) [1, 2, 3, 4] (c) fold (+) 0 [1, 2, 3, 4]",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0122-point-1",
          "description": "[2, 4, 6]",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0122-point-2",
          "description": "[3, 4]",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0122-point-3",
          "description": "10",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "[2,4,6], [3,4], 10",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0123",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0123",
      "questionNumber": 123,
      "topic": "Functional programming",
      "questionType": "code-tracing",
      "commandWord": "trace",
      "question": "For the list [4, 7, 9], state the head and the tail.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0123-point-1",
          "description": "Head: 4",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0123-point-2",
          "description": "Tail: [7, 9]",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Head 4, tail [7, 9]",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0124",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0124",
      "questionNumber": 124,
      "topic": "Functional programming",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "Given f(x) = x + 3 and g(x) = 2x, calculate (f ∘ g)(5) and (g ∘ f)(5).",
      "context": "",
      "marks": 2,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0124-point-1",
          "description": "(f ∘ g)(5) = f(10) = 13",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0124-point-2",
          "description": "(g ∘ f)(5) = g(8) = 16",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "13 and 16",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0125",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0125",
      "questionNumber": 125,
      "topic": "Theory of computation",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "State which of these strings match the regular expression a(b|c)*: 'a', 'abcb', 'ba', 'acc'.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0125-point-1",
          "description": "'a' matches and 'abcb' matches",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0125-point-2",
          "description": "'acc' matches and 'ba' does not match",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "a, abcb and acc match; ba does not.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0126",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0126",
      "questionNumber": 126,
      "topic": "Theory of computation",
      "questionType": "code-completion",
      "commandWord": "write",
      "question": "Write a regular expression for all binary strings that end in 1.",
      "context": "",
      "marks": 2,
      "difficulty": "higher",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch5-0126-point-1",
          "description": "(0|1)* for any prefix",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0126-point-2",
          "description": "followed by 1: (0|1)*1",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "(0|1)*1",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0127",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0127",
      "questionNumber": 127,
      "topic": "Theory of computation",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe the components of a Turing machine.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0127-point-1",
          "description": "An infinite tape divided into cells",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0127-point-2",
          "description": "A read/write head that moves one cell left or right",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0127-point-3",
          "description": "A finite set of states including a start and halting state",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0127-point-4",
          "description": "A transition function/rules determining the next state, symbol written and move",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "An infinite tape, a read/write head, a finite set of states and transition rules.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0128",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0128",
      "questionNumber": 128,
      "topic": "Theory of computation",
      "questionType": "code-completion",
      "commandWord": "write",
      "question": "Write BNF rules defining an integer as one or more digits.",
      "context": "",
      "marks": 2,
      "difficulty": "higher",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch5-0128-point-1",
          "description": "<digit> ::= 0|1|2|3|4|5|6|7|8|9",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0128-point-2",
          "description": "<integer> ::= <digit> | <digit><integer> (recursive)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "<digit> ::= 0|1|…|9; <integer> ::= <digit> | <digit><integer>",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0129",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0129",
      "questionNumber": 129,
      "topic": "Theory of computation",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain the difference between a finite state machine with outputs (Mealy machine) and one without outputs.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0129-point-1",
          "description": "An FSM without outputs accepts or rejects input / has accepting states",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0129-point-2",
          "description": "A Mealy machine produces an output on each transition",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0129-point-3",
          "description": "Mealy machines have no accepting states",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A basic FSM only accepts or rejects; a Mealy machine outputs a value on each transition.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0130",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0130",
      "questionNumber": 130,
      "topic": "Databases",
      "questionType": "code-completion",
      "commandWord": "write",
      "question": "Tables: Customer(CustomerID, Name, Town) and Order(OrderID, CustomerID, Total). Write SQL to list the name of each customer from Leeds with the totals of their orders.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch5-0130-point-1",
          "description": "SELECT Customer.Name, Order.Total",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0130-point-2",
          "description": "FROM Customer JOIN Order ON Customer.CustomerID = Order.CustomerID (or equivalent WHERE join)",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0130-point-3",
          "description": "WHERE Customer.Town = 'Leeds'",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "SELECT Customer.Name, Order.Total FROM Customer INNER JOIN Order ON Customer.CustomerID = Order.CustomerID WHERE Customer.Town = 'Leeds';",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0131",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0131",
      "questionNumber": 131,
      "topic": "Databases",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain the meaning of ACID in database transactions.",
      "context": "",
      "marks": 4,
      "difficulty": "higher",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0131-point-1",
          "description": "Atomicity: a transaction is completed fully or not at all",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0131-point-2",
          "description": "Consistency: a transaction keeps the database valid according to its rules",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0131-point-3",
          "description": "Isolation: concurrent transactions do not interfere / appear sequential",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0131-point-4",
          "description": "Durability: committed changes are permanent even after failure",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Atomicity, Consistency, Isolation and Durability ensure transactions are processed reliably.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0132",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0132",
      "questionNumber": 132,
      "topic": "Databases",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain how record locking prevents lost updates when two users edit the same record.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0132-point-1",
          "description": "When one user accesses a record it is locked",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0132-point-2",
          "description": "Other users cannot edit it until it is released",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0132-point-3",
          "description": "Prevents one update overwriting another",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "The first user locks the record so the second must wait, preventing one change silently overwriting another.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0133",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0133",
      "questionNumber": 133,
      "topic": "Software development",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Compare the waterfall model with agile development.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0133-point-1",
          "description": "Waterfall completes each stage in sequence before the next",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0133-point-2",
          "description": "Agile develops in short iterations / sprints",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0133-point-3",
          "description": "Agile involves the client regularly and adapts to changing requirements",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0133-point-4",
          "description": "Waterfall suits projects with fixed, clear requirements; changes late on are costly",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Waterfall is linear and suits fixed requirements; agile works in short iterations with frequent client feedback, adapting to change.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0134",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0134",
      "questionNumber": 134,
      "topic": "Software development",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe alpha testing, beta testing and acceptance testing.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0134-point-1",
          "description": "Alpha: done in-house by the developers' team",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0134-point-2",
          "description": "Beta: done by a selected group of real users outside the company",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0134-point-3",
          "description": "Acceptance: client checks the software meets the requirements before sign-off",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Alpha is internal; beta is by real users; acceptance is by the client against the requirements.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0135",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0135",
      "questionNumber": 135,
      "topic": "Ethical, legal and environmental impacts",
      "questionType": "discuss",
      "commandWord": "discuss",
      "question": "A bank uses a machine-learning system to decide whether to approve loan applications. Discuss the ethical, legal and social issues this raises.",
      "context": "",
      "marks": 9,
      "difficulty": "higher",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch5-0135-point-1",
          "description": "Marked using the levels of response. Indicative content: Faster, consistent decisions and reduced costs; Bias in training data could discriminate against groups; Lack of transparency: hard to explain decisions ('black box'); Legal duties under data protection law, including rights about automated decisions; Accountability: who is responsible for wrong decisions; Privacy concerns about the data used to train the model; Possible job losses for staff.",
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
      "modelAnswer": "Weighs efficiency against bias, transparency, accountability, privacy and legal obligations, with a justified conclusion.",
      "examinerGuidance": [
        "Mark using the levels of response. Indicative content is not exhaustive."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0136",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0136",
      "questionNumber": 136,
      "topic": "Ethical, legal and environmental impacts",
      "questionType": "discuss",
      "commandWord": "discuss",
      "question": "Discuss the benefits and risks of a supermarket analysing big data collected from loyalty cards.",
      "context": "",
      "marks": 9,
      "difficulty": "higher",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch5-0136-point-1",
          "description": "Marked using the levels of response. Indicative content: Personalised offers and better stock planning / less waste; Spotting trends quickly; Privacy concerns: customers may not realise how much is inferred; Data must be stored securely and used lawfully under data protection law; Risk of data breaches; Ethical concerns about targeting vulnerable customers.",
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
      "modelAnswer": "Balances commercial and customer benefits against privacy, security, legal and ethical risks, reaching a conclusion.",
      "examinerGuidance": [
        "Mark using the levels of response."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0137",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0137",
      "questionNumber": 137,
      "topic": "Big data",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe the characteristics of big data.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0137-point-1",
          "description": "Volume: too much data for a single server / traditional database",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0137-point-2",
          "description": "Velocity: data is generated and must be processed quickly",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0137-point-3",
          "description": "Variety: data comes in many forms, structured and unstructured",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Big data has huge volume, arrives at high velocity and has great variety.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0138",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0138",
      "questionNumber": 138,
      "topic": "Big data",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain why functional programming is often used to process big data.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0138-point-1",
          "description": "Any 3 from: Data is processed across many servers in parallel; Functions with no side effects can safely run in parallel; Immutable data avoids conflicts between processes; Higher-order functions such as map and reduce suit distributed processing.",
          "marks": 3
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Pure functions and immutable data can run safely in parallel across many machines, and map-reduce style operations fit distributed data.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0139",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0139",
      "questionNumber": 139,
      "topic": "Data compression",
      "questionType": "scenario-application",
      "commandWord": "explain",
      "question": "An online shop wants its product photos to load quickly. Recommend a type of compression for the photos and justify your choice, giving one drawback.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0139-point-1",
          "description": "Lossy compression",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0139-point-2",
          "description": "Gives a much smaller file so pages load faster",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0139-point-3",
          "description": "Small loss of detail is not noticeable to customers",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0139-point-4",
          "description": "Drawback: data is permanently removed / quality cannot be restored",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Lossy: it greatly reduces file size so pages load quickly and the quality loss is hardly visible, but the removed data cannot be recovered.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0140",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0140",
      "questionNumber": 140,
      "topic": "Programming",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain what a runtime error is and give an example.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0140-point-1",
          "description": "An error that occurs while the program is running (it crashes)",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0140-point-2",
          "description": "Code is syntactically correct",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0140-point-3",
          "description": "Example: dividing by zero / accessing an index outside a list / converting 'abc' to an integer",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A runtime error happens while the program runs, even though the syntax is valid, e.g. dividing by zero.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0141",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0141",
      "questionNumber": 141,
      "topic": "Programming",
      "questionType": "code-tracing",
      "commandWord": "trace",
      "question": "word = \"Programming\". State the result of: (a) len(word) (b) word[3:7] (c) word[-1]",
      "context": "",
      "marks": 3,
      "difficulty": "foundation",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0141-point-1",
          "description": "11",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0141-point-2",
          "description": "\"gram\"",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0141-point-3",
          "description": "\"g\"",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "(a) 11 (b) gram (c) g",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0142",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0142",
      "questionNumber": 142,
      "topic": "Programming",
      "questionType": "code-tracing",
      "commandWord": "trace",
      "question": "State the output and explain it:\nx = 10\ndef change():\n    x = 5\n    print(x)\nchange()\nprint(x)",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0142-point-1",
          "description": "Output: 5 then 10",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0142-point-2",
          "description": "x inside change() is a separate local variable",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0142-point-3",
          "description": "The global x is not changed",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "5 then 10: the x inside the function is local, so the global x keeps the value 10.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0143",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0143",
      "questionNumber": 143,
      "topic": "Boolean logic",
      "questionType": "scenario-application",
      "commandWord": "write",
      "question": "Inputs A and B go into an AND gate. Its output and input C go into an OR gate, and that output passes through a NOT gate to give Q. Write the Boolean expression for Q and state Q when A = 1, B = 1 and C = 0.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0143-point-1",
          "description": "Q = NOT ((A AND B) OR C)",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0143-point-2",
          "description": "(1 AND 1) OR 0 = 1",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0143-point-3",
          "description": "Q = 0",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Q = NOT((A AND B) OR C); Q = 0.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0144",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0144",
      "questionNumber": 144,
      "topic": "Databases and SQL",
      "questionType": "complete-table",
      "commandWord": "complete",
      "question": "State the most suitable data type for each field: StudentID (e.g. 1042), DateOfBirth, HasPaidTrip (yes/no), TripCost (e.g. 12.50).",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0144-point-1",
          "description": "StudentID: integer",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0144-point-2",
          "description": "DateOfBirth: date",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0144-point-3",
          "description": "HasPaidTrip: Boolean",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0144-point-4",
          "description": "TripCost: real / float / currency",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Integer, Date, Boolean, Real.",
      "examinerGuidance": [
        "Accept string for StudentID if justified that no calculations are done."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0145",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0145",
      "questionNumber": 145,
      "topic": "Databases and SQL",
      "questionType": "scenario-application",
      "commandWord": "explain",
      "question": "A library uses the tables Books(BookID, Title, Author) and Loans(LoanID, BookID, StudentID, DateOut). Identify the primary key of Loans and one foreign key, and explain how they link the tables.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0145-point-1",
          "description": "Primary key of Loans: LoanID",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0145-point-2",
          "description": "Foreign key: BookID (or StudentID)",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0145-point-3",
          "description": "BookID in Loans matches the BookID primary key in Books, so each loan can be linked to its book",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "LoanID is the primary key; BookID is a foreign key linking each loan to a record in Books.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0146",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0146",
      "questionNumber": 146,
      "topic": "CPU architecture",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "A processor has a clock speed of 3.2 GHz. Explain what this means.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0146-point-1",
          "description": "3.2 billion clock cycles per second",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0146-point-2",
          "description": "Instructions are fetched/executed in time with the clock / higher speed means more instructions processed per second",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "The clock ticks 3.2 billion times a second, and the CPU can carry out an instruction step each tick.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0147",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0147",
      "questionNumber": 147,
      "topic": "CPU architecture",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe the main features of the Von Neumann architecture.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0147-point-1",
          "description": "Stored program concept: instructions and data stored together in main memory",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0147-point-2",
          "description": "The CPU fetches instructions from memory and executes them one at a time",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0147-point-3",
          "description": "Data and instructions share the same memory/buses",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Programs and data are stored in the same memory; the CPU fetches and executes instructions in sequence over shared buses.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0148",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0148",
      "questionNumber": 148,
      "topic": "Computer networks",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Define bandwidth and describe two factors that can reduce the performance of a network.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0148-point-1",
          "description": "Bandwidth: the maximum amount of data that can be transmitted per second",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0148-point-2",
          "description": "Many users/devices sharing the network",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0148-point-3",
          "description": "Transmission media / interference / distance / errors causing retransmission",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Bandwidth is the maximum data rate; performance falls with many users, interference or distance.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0149",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0149",
      "questionNumber": 149,
      "topic": "Computer networks",
      "questionType": "explain",
      "commandWord": "define",
      "question": "State what is meant by a network protocol and give one example.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0149-point-1",
          "description": "A set of rules for how devices communicate / transmit data",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0149-point-2",
          "description": "Example: TCP, IP, HTTP, HTTPS, FTP, SMTP, IMAP, POP",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A set of agreed rules for communication, e.g. HTTP.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0150",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0150",
      "questionNumber": 150,
      "topic": "Computer networks",
      "questionType": "scenario-application",
      "commandWord": "explain",
      "question": "A factory connects sensors using a mesh topology. Explain why this topology is suitable.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0150-point-1",
          "description": "Each node connects to several others",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0150-point-2",
          "description": "If one node or connection fails, data can be rerouted",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0150-point-3",
          "description": "Reliable / no single point of failure, important for monitoring",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "In a mesh, data can take another route if a sensor or link fails, so the network keeps working.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0151",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0151",
      "questionNumber": 151,
      "topic": "Cybersecurity",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe what ransomware does and two ways an organisation can protect itself.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0151-point-1",
          "description": "Any 3 from: Encrypts the victim's files and demands payment for the key; Regular offline/off-site backups; Anti-malware software / keeping software patched; Staff training not to open suspicious attachments.",
          "marks": 3
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Ransomware encrypts files and demands a ransom; offline backups, patching and anti-malware reduce the risk.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0152",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0152",
      "questionNumber": 152,
      "topic": "Cybersecurity",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Explain what social engineering is and describe blagging.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0152-point-1",
          "description": "Manipulating people into revealing information or giving access",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0152-point-2",
          "description": "Blagging: inventing a scenario/pretending to be someone to obtain information",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0152-point-3",
          "description": "Example: phoning pretending to be IT support to get a password",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Social engineering tricks people rather than systems; blagging invents a believable story, e.g. pretending to be IT support.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0153",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0153",
      "questionNumber": 153,
      "topic": "Cybersecurity",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe how a firewall helps protect a network.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0153-point-1",
          "description": "Monitors incoming and outgoing traffic",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0153-point-2",
          "description": "Blocks traffic that does not meet set rules / unauthorised access",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A firewall checks traffic in and out of the network and blocks anything that breaks its rules.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0154",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0154",
      "questionNumber": 154,
      "topic": "Systems software",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "State what utility software is and describe two examples.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0154-point-1",
          "description": "Any 3 from: Software that helps maintain/configure the computer; Encryption software scrambles data so it cannot be understood without a key; Compression software reduces file size; Defragmentation / backup software described.",
          "marks": 3
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Utilities maintain the system, e.g. encryption software protects data and compression software reduces file size.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0155",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0155",
      "questionNumber": 155,
      "topic": "Software development and testing",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain why a programmer might use a trace table.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0155-point-1",
          "description": "Any 2 from: To follow the values of variables as code runs; To find logic errors / check an algorithm works; Without needing to run the program.",
          "marks": 2
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A trace table records variable values step by step, helping to find logic errors.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0156",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0156",
      "questionNumber": 156,
      "topic": "Algorithms",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Compare merge sort with bubble sort.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0156-point-1",
          "description": "Merge sort is much faster on large lists",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0156-point-2",
          "description": "Merge sort needs extra memory for the sub-lists",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0156-point-3",
          "description": "Bubble sort is simpler to code",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0156-point-4",
          "description": "Bubble sort sorts in place / efficient for nearly sorted small lists",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Merge sort is faster for large lists but uses more memory; bubble sort is simple and in place but slow.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0157",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0157",
      "questionNumber": 157,
      "topic": "Programming",
      "questionType": "code-tracing",
      "commandWord": "trace",
      "question": "State the output:\nword = \"banana\"\ncount = 0\nfor ch in word:\n    if ch == \"a\":\n        count = count + 1\nprint(count)",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0157-point-1",
          "description": "Counts the letter a",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0157-point-2",
          "description": "Output: 3",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "3",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0158",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0158",
      "questionNumber": 158,
      "topic": "Programming",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Explain the difference between a WHILE loop and a REPEAT…UNTIL loop.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0158-point-1",
          "description": "WHILE checks the condition at the start",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0158-point-2",
          "description": "REPEAT…UNTIL checks the condition at the end",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0158-point-3",
          "description": "REPEAT…UNTIL always runs at least once; a WHILE loop may not run at all",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A WHILE loop tests first so may never run; REPEAT…UNTIL tests at the end so always runs at least once.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0159",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0159",
      "questionNumber": 159,
      "topic": "Binary representation and arithmetic",
      "questionType": "calculation",
      "commandWord": "calculate",
      "question": "A system must give a unique binary code to 300 different products. What is the minimum number of bits needed? Explain your answer.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0159-point-1",
          "description": "9 bits",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0159-point-2",
          "description": "8 bits give only 256 codes",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0159-point-3",
          "description": "9 bits give 512 codes, which is at least 300",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "9 bits, because 2^8 = 256 is too few and 2^9 = 512 is enough.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0160",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0160",
      "questionNumber": 160,
      "topic": "Hexadecimal",
      "questionType": "conversion",
      "commandWord": "calculate",
      "question": "A web colour is written as #FF8000 (red, green, blue). State the denary value of each component.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0160-point-1",
          "description": "Red FF = 255",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0160-point-2",
          "description": "Green 80 = 128",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0160-point-3",
          "description": "Blue 00 = 0",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "255, 128, 0 (orange)",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0161",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0161",
      "questionNumber": 161,
      "topic": "Character representation",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "A message has 500 characters. Calculate its size in bytes using 8-bit ASCII and using a 16-bit Unicode encoding.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0161-point-1",
          "description": "ASCII: 500 × 8 = 4,000 bits = 500 bytes",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0161-point-2",
          "description": "Unicode: 500 × 16 = 8,000 bits = 1,000 bytes",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "500 bytes and 1,000 bytes",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0162",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0162",
      "questionNumber": 162,
      "topic": "Image representation",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe how a bitmap image is represented in binary.",
      "context": "",
      "marks": 3,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0162-point-1",
          "description": "The image is made of a grid of pixels",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0162-point-2",
          "description": "Each pixel's colour is stored as a binary code",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0162-point-3",
          "description": "The number of bits per pixel is the colour depth",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A grid of pixels, each stored as a binary number for its colour; bits per pixel is the colour depth.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0163",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0163",
      "questionNumber": 163,
      "topic": "Image representation",
      "questionType": "calculation",
      "commandWord": "calculate",
      "question": "An image must be able to show 200 different colours. What is the minimum colour depth? Explain.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0163-point-1",
          "description": "8 bits",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0163-point-2",
          "description": "7 bits give only 128 colours; 8 bits give 256",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "8 bits",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0164",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0164",
      "questionNumber": 164,
      "topic": "Sound representation",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain why a digital sound recording is only an approximation of the original sound.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0164-point-1",
          "description": "Original sound is analogue / continuous",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0164-point-2",
          "description": "Samples are only taken at intervals so changes between samples are lost",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0164-point-3",
          "description": "Each sample is rounded to the nearest value the bit depth allows",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Sound is continuous, but only discrete samples are taken and each is rounded to a limited number of levels.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0165",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0165",
      "questionNumber": 165,
      "topic": "Defensive design",
      "questionType": "debugging",
      "commandWord": "debug",
      "question": "def f(a, b):\n    return a * b * 0.2\nThis calculates VAT (20%) on an item price × quantity. Suggest three changes to make the code more maintainable.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch5-0165-point-1",
          "description": "Any 3 from: Meaningful function name, e.g. calculate_vat; Meaningful parameter names, e.g. price, quantity; Use a named constant for 0.2, e.g. VAT_RATE; Add a comment/docstring explaining the purpose.",
          "marks": 3
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "VAT_RATE = 0.2\ndef calculate_vat(price, quantity):\n    # returns VAT due on the order\n    return price * quantity * VAT_RATE",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0166",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0166",
      "questionNumber": 166,
      "topic": "Memory and storage",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe how data is stored on magnetic, optical and solid state media.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0166-point-1",
          "description": "Magnetic: tiny areas of the disk are magnetised to represent 0 and 1",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0166-point-2",
          "description": "Optical: a laser reads pits and lands on the disc surface",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0166-point-3",
          "description": "Solid state: electrons are trapped in transistors / NAND flash cells",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Magnetic disks magnetise regions; optical discs use pits and lands read by a laser; SSDs trap charge in flash memory cells.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0167",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0167",
      "questionNumber": 167,
      "topic": "Computer networks",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe the role of a network interface controller (NIC).",
      "context": "",
      "marks": 3,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0167-point-1",
          "description": "Hardware that allows a device to connect to a network",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0167-point-2",
          "description": "Has a unique MAC address",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0167-point-3",
          "description": "Converts data into signals for transmission (and back)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A NIC lets a device connect to a network, has a unique MAC address and converts data into signals.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0168",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0168",
      "questionNumber": 168,
      "topic": "Ethical, legal and environmental impacts",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain two ways that digital technology can have a positive impact on the environment.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0168-point-1",
          "description": "Video conferencing/remote working reduces travel and emissions",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0168-point-2",
          "description": "Smart heating/lighting reduces energy use",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0168-point-3",
          "description": "Sensors and data analysis monitor pollution / optimise routes",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0168-point-4",
          "description": "Digital documents reduce paper use",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Video calls cut travel emissions and smart thermostats reduce energy waste.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0169",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0169",
      "questionNumber": 169,
      "topic": "Ethical, legal and environmental impacts",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Explain the difference between open-source and proprietary software, giving one advantage of each.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0169-point-1",
          "description": "Open source: source code is available and can be modified/shared",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0169-point-2",
          "description": "Proprietary: source code is hidden; licence must be bought/obeyed",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0169-point-3",
          "description": "Open-source advantage: free / can be adapted / community support",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0169-point-4",
          "description": "Proprietary advantage: professional support / tested / regular updates",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Open-source code can be viewed and changed, often free; proprietary code is closed but usually comes with support.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0170",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0170",
      "questionNumber": 170,
      "topic": "Algorithms",
      "questionType": "algorithm-design",
      "commandWord": "design",
      "question": "Write an algorithm that asks a user for a password until they enter 'Secret1', allowing at most 3 attempts. Output 'Welcome' if correct or 'Locked' after 3 wrong attempts.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch5-0170-point-1",
          "description": "Attempt counter initialised and incremented",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0170-point-2",
          "description": "Loop ends when the password is correct or 3 attempts are used",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0170-point-3",
          "description": "Compares input with 'Secret1'",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0170-point-4",
          "description": "Outputs 'Welcome' or 'Locked' correctly",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "attempts ← 0; correct ← False; WHILE attempts < 3 AND NOT correct: pw ← INPUT; attempts ← attempts + 1; IF pw = 'Secret1' THEN correct ← True; IF correct THEN OUTPUT 'Welcome' ELSE OUTPUT 'Locked'",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0171",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0171",
      "questionNumber": 171,
      "topic": "Programming",
      "questionType": "code-tracing",
      "commandWord": "trace",
      "question": "State the output:\nfor i in range(1, 3):\n    for j in range(1, 3):\n        print(i * j)",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0171-point-1",
          "description": "Inner loop runs twice for each outer value",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0171-point-2",
          "description": "Output: 1, 2, 2, 4 (on separate lines)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "1 2 2 4",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0172",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0172",
      "questionNumber": 172,
      "topic": "Programming",
      "questionType": "debugging",
      "commandWord": "debug",
      "question": "age = input(\"Enter age: \")\nif age >= 18:\n    print(\"Adult\")\nExplain why this code causes an error and correct it.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch5-0172-point-1",
          "description": "input() returns a string",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0172-point-2",
          "description": "A string cannot be compared with an integer",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0172-point-3",
          "description": "Correction: age = int(input(\"Enter age: \"))",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Cast the input: age = int(input(\"Enter age: \")).",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0173",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0173",
      "questionNumber": 173,
      "topic": "Data structures",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe how a stack can be implemented using an array.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0173-point-1",
          "description": "A pointer stores the index of the top item",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0173-point-2",
          "description": "Push: check the stack is not full, increment the pointer, store the item",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0173-point-3",
          "description": "Pop: check the stack is not empty, return the item at the pointer, decrement the pointer",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Use an array and a top pointer; push checks for full then increments and stores; pop checks for empty then returns and decrements.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0174",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0174",
      "questionNumber": 174,
      "topic": "Data structures",
      "questionType": "code-tracing",
      "commandWord": "trace",
      "question": "A circular queue is stored in an array with indexes 0–4. Front = 3 and rear = 4 (two items). Two more items are added. State the new value of rear after each addition.",
      "context": "",
      "marks": 2,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0174-point-1",
          "description": "First addition: rear = (4 + 1) MOD 5 = 0",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0174-point-2",
          "description": "Second addition: rear = 1",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "0 then 1",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0175",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0175",
      "questionNumber": 175,
      "topic": "Data structures",
      "questionType": "complete-table",
      "commandWord": "complete",
      "question": "Give the adjacency list for an undirected graph with edges A–B, A–C, B–C and C–D.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0175-point-1",
          "description": "A: B, C and B: A, C",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0175-point-2",
          "description": "C: A, B, D and D: C",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A: B, C; B: A, C; C: A, B, D; D: C",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0176",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0176",
      "questionNumber": 176,
      "topic": "Recursion",
      "questionType": "code-completion",
      "commandWord": "write",
      "question": "Write a recursive function power(base, exp) that returns base raised to a non-negative integer exp.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch5-0176-point-1",
          "description": "Base case: if exp == 0 return 1",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0176-point-2",
          "description": "Recursive case: return base * power(base, exp - 1)",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0176-point-3",
          "description": "Correct function header and return values",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "def power(base, exp):\n    if exp == 0:\n        return 1\n    return base * power(base, exp - 1)",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0177",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0177",
      "questionNumber": 177,
      "topic": "Recursion",
      "questionType": "code-tracing",
      "commandWord": "trace",
      "question": "fib(n) returns n if n < 2, otherwise fib(n − 1) + fib(n − 2). State the value of fib(4) and the total number of calls made, including the first.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0177-point-1",
          "description": "fib(4) = 3",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0177-point-2",
          "description": "9 calls in total",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0177-point-3",
          "description": "Shows repeated calls, e.g. fib(2) calculated twice",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "fib(4) = 3 using 9 calls.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0178",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0178",
      "questionNumber": 178,
      "topic": "Computer organisation",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "A processor uses a 3-stage pipeline (fetch, decode, execute), each taking one clock cycle. How many cycles are needed to complete 3 instructions with and without pipelining?",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0178-point-1",
          "description": "Without pipelining: 3 × 3 = 9 cycles",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0178-point-2",
          "description": "With pipelining: 5 cycles",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0178-point-3",
          "description": "Stages overlap after the first instruction",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "9 without, 5 with pipelining.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0179",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0179",
      "questionNumber": 179,
      "topic": "Computer organisation",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain how the width of the address bus affects a computer system.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0179-point-1",
          "description": "Determines how many memory locations can be addressed",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0179-point-2",
          "description": "n lines can address 2^n locations",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0179-point-3",
          "description": "Wider bus allows more memory to be used",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "With n address lines the CPU can address 2^n locations, so a wider bus allows more memory.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0180",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0180",
      "questionNumber": 180,
      "topic": "Object-oriented programming",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain the purpose of a constructor in a class.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0180-point-1",
          "description": "A method called automatically when an object is created",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0180-point-2",
          "description": "Initialises the object's attributes",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "It runs when an object is instantiated and sets up its initial attribute values.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0181",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0181",
      "questionNumber": 181,
      "topic": "Object-oriented programming",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Explain the difference between method overloading and method overriding.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0181-point-1",
          "description": "Overloading: several methods with the same name but different parameters in the same class",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0181-point-2",
          "description": "Overriding: a subclass provides its own version of an inherited method with the same signature",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0181-point-3",
          "description": "Overriding is resolved at run time / supports polymorphism",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Overloading uses different parameter lists for one name; overriding replaces an inherited method in a subclass.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0182",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0182",
      "questionNumber": 182,
      "topic": "Functional programming",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "add x y = x + y. Explain what add 3 returns and state the value of (add 3) 4.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0182-point-1",
          "description": "add 3 is partial application",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0182-point-2",
          "description": "It returns a new function that adds 3 to its argument",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0182-point-3",
          "description": "(add 3) 4 = 7",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "add 3 is a function that adds 3; applied to 4 it gives 7.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0183",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0183",
      "questionNumber": 183,
      "topic": "Functional programming",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain what is meant by functions being first-class objects.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0183-point-1",
          "description": "Functions can be assigned to variables",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0183-point-2",
          "description": "Functions can be passed as arguments",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0183-point-3",
          "description": "Functions can be returned from other functions",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "They can be stored in variables, passed as arguments and returned like any other value.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0184",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0184",
      "questionNumber": 184,
      "topic": "Computational complexity",
      "questionType": "explain",
      "commandWord": "state",
      "question": "Put these complexities in order from slowest-growing to fastest-growing: O(2^n), O(1), O(n log n), O(n), O(log n), O(n²).",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0184-point-1",
          "description": "O(1), O(log n), O(n)",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0184-point-2",
          "description": "O(n log n), O(n²), O(2^n)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "O(1), O(log n), O(n), O(n log n), O(n²), O(2^n)",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0185",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0185",
      "questionNumber": 185,
      "topic": "Computational complexity",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Explain what is meant by space complexity and compare merge sort and bubble sort in terms of space.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0185-point-1",
          "description": "Space complexity: how the memory needed grows with input size",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0185-point-2",
          "description": "Merge sort needs O(n) extra memory for the sub-lists",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0185-point-3",
          "description": "Bubble sort sorts in place, O(1) extra memory",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Space complexity measures memory growth; merge sort needs O(n) extra space while bubble sort needs O(1).",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0186",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0186",
      "questionNumber": 186,
      "topic": "Algorithms",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe how a binary search tree is searched for a value and state the time complexity for a balanced tree.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0186-point-1",
          "description": "Start at the root and compare the value",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0186-point-2",
          "description": "Go left if smaller, right if larger",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0186-point-3",
          "description": "Repeat until found or a null pointer is reached",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0186-point-4",
          "description": "O(log n) for a balanced tree",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Compare at each node, moving left or right until found or a leaf is passed; O(log n) when balanced.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0187",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0187",
      "questionNumber": 187,
      "topic": "Boolean algebra",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "Simplify A·(¬A + B). Show your working.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0187-point-1",
          "description": "Expand: A·¬A + A·B",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0187-point-2",
          "description": "A·¬A = 0",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0187-point-3",
          "description": "Result: A·B",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A·B",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0188",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0188",
      "questionNumber": 188,
      "topic": "Boolean algebra",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "Use De Morgan's law to simplify ¬(¬A + B).",
      "context": "",
      "marks": 2,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0188-point-1",
          "description": "¬(¬A + B) = ¬¬A · ¬B",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0188-point-2",
          "description": "= A·¬B",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A·¬B",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0189",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0189",
      "questionNumber": 189,
      "topic": "Databases",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Order(OrderID, ProductID, CustomerID, CustomerName, ProductName, Quantity) has the composite key (OrderID, ProductID). Identify one partial dependency and one transitive dependency.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0189-point-1",
          "description": "Partial: ProductName depends only on ProductID (or CustomerID depends only on OrderID)",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0189-point-2",
          "description": "Transitive: CustomerName depends on CustomerID, which depends on OrderID",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0189-point-3",
          "description": "Explains that these break 2NF and 3NF respectively",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "ProductName depends on part of the key (ProductID); CustomerName depends on CustomerID, a non-key attribute.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0190",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0190",
      "questionNumber": 190,
      "topic": "Databases",
      "questionType": "code-completion",
      "commandWord": "write",
      "question": "Write SQL to create a table Course with CourseID (integer primary key), Title (text up to 50 characters, required) and Credits (integer).",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch5-0190-point-1",
          "description": "CREATE TABLE Course ( … )",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0190-point-2",
          "description": "CourseID INT PRIMARY KEY",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0190-point-3",
          "description": "Title VARCHAR(50) NOT NULL and Credits INT",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "CREATE TABLE Course (CourseID INT PRIMARY KEY, Title VARCHAR(50) NOT NULL, Credits INT);",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0191",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch5-0191",
      "questionNumber": 191,
      "topic": "Software development",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe rapid application development (RAD) and one situation where it is suitable.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0191-point-1",
          "description": "Prototypes are built quickly and refined through user feedback",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0191-point-2",
          "description": "Development is timeboxed / iterative",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0191-point-3",
          "description": "Suitable when requirements are unclear or the user interface is important",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "RAD builds and refines prototypes with users in short timeboxes; good when requirements are unclear.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0192",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0192",
      "questionNumber": 192,
      "topic": "Networking",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain the role of port numbers and sockets.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0192-point-1",
          "description": "A port number identifies the application/service on a host (e.g. 443 for HTTPS)",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0192-point-2",
          "description": "A socket combines an IP address and a port number",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0192-point-3",
          "description": "Allows data to reach the correct application on the correct device",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Ports identify applications; a socket (IP + port) identifies one end of a connection.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0193",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0193",
      "questionNumber": 193,
      "topic": "Operating systems",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe the role of the BIOS when a computer starts.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch5-0193-point-1",
          "description": "Stored in non-volatile memory (ROM/flash)",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0193-point-2",
          "description": "Runs a power-on self-test (POST) of hardware",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0193-point-3",
          "description": "Loads the bootstrap loader / operating system into RAM",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "The BIOS runs a POST, then loads the bootloader so the OS can start.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0194",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "AQA",
    "question": {
      "id": "catalogue-batch5-0194",
      "questionNumber": 194,
      "topic": "Data representation",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "Normalise the floating-point number with 8-bit mantissa 0.0011000 and 4-bit exponent 0101. Give the new mantissa and exponent.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0194-point-1",
          "description": "Mantissa shifted left 2 places: 0.1100000",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0194-point-2",
          "description": "Exponent reduced by 2: 5 − 2 = 3",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0194-point-3",
          "description": "New exponent: 0011",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Mantissa 0.1100000, exponent 0011",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch5-0195",
    "sourceId": "cs-master-batch5",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch5-0195",
      "questionNumber": 195,
      "topic": "Data representation",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "The value 6.4 is stored as 6.375. Calculate the absolute error and the relative error.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch5-0195-point-1",
          "description": "Absolute error = 6.4 − 6.375 = 0.025",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0195-point-2",
          "description": "Relative error = 0.025 ÷ 6.4",
          "marks": 1
        },
        {
          "id": "catalogue-batch5-0195-point-3",
          "description": "≈ 0.0039 (0.39%)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Absolute 0.025; relative ≈ 0.39%.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  }
];
