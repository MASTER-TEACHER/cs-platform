import type { GCSEPracticeQuestion } from "./types";

export const gcseDataRepresentationQuestions: GCSEPracticeQuestion[] = [
  {
    "id": "gcse-data-representation-001",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "data-representation",
    "topicTitle": "Data Representation",
    "subtopic": "Binary conversion",
    "specificationReferences": [
      "AQA 3.3 Fundamentals of data representation",
      "OCR J277 1.2 Memory and storage",
      "Pearson GCSE Computer Science - Data"
    ],
    "questionType": "calculation",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Convert denary 173 to 8-bit binary. Show your working.",
    "markPoints": [
      "Uses correct place values",
      "128+32+8+4+1=173",
      "Answer 10101101"
    ],
    "modelAnswer": "173 = 128+32+8+4+1, so the 8-bit binary value is 10101101.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "binary",
      "denary"
    ],
    "curriculumAreaIds": [
      "data-representation"
    ]
  },
  {
    "id": "gcse-data-representation-002",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "data-representation",
    "topicTitle": "Data Representation",
    "subtopic": "Binary conversion",
    "specificationReferences": [
      "AQA 3.3 Fundamentals of data representation",
      "OCR J277 1.2 Memory and storage",
      "Pearson GCSE Computer Science - Data"
    ],
    "questionType": "calculation",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Convert 01110110 from binary to denary.",
    "markPoints": [
      "64+32+16+4+2",
      "Correct place values",
      "Answer 118"
    ],
    "modelAnswer": "01110110 = 64+32+16+4+2 = 118.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "binary",
      "denary"
    ],
    "curriculumAreaIds": [
      "data-representation"
    ]
  },
  {
    "id": "gcse-data-representation-003",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "data-representation",
    "topicTitle": "Data Representation",
    "subtopic": "Hexadecimal",
    "specificationReferences": [
      "AQA 3.3 Fundamentals of data representation",
      "OCR J277 1.2 Memory and storage",
      "Pearson GCSE Computer Science - Data"
    ],
    "questionType": "calculation",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Convert hexadecimal B7 to 8-bit binary.",
    "markPoints": [
      "B = 1011",
      "7 = 0111",
      "Answer 10110111"
    ],
    "modelAnswer": "B7 = 1011 0111, so the binary value is 10110111.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "hexadecimal",
      "binary"
    ],
    "curriculumAreaIds": [
      "data-representation"
    ]
  },
  {
    "id": "gcse-data-representation-004",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "data-representation",
    "topicTitle": "Data Representation",
    "subtopic": "Hexadecimal",
    "specificationReferences": [
      "AQA 3.3 Fundamentals of data representation",
      "OCR J277 1.2 Memory and storage",
      "Pearson GCSE Computer Science - Data"
    ],
    "questionType": "calculation",
    "difficulty": "standard",
    "marks": 4,
    "question": "Convert binary 11010110 to hexadecimal and denary.",
    "markPoints": [
      "Split 1101 0110",
      "D6 hexadecimal",
      "128+64+16+4+2",
      "214 denary"
    ],
    "modelAnswer": "1101 is D and 0110 is 6, giving D6. In denary the value is 214.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "hexadecimal",
      "binary",
      "denary"
    ],
    "curriculumAreaIds": [
      "data-representation"
    ]
  },
  {
    "id": "gcse-data-representation-005",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "data-representation",
    "topicTitle": "Data Representation",
    "subtopic": "Binary addition",
    "specificationReferences": [
      "AQA 3.3 Fundamentals of data representation",
      "OCR J277 1.2 Memory and storage",
      "Pearson GCSE Computer Science - Data"
    ],
    "questionType": "calculation",
    "difficulty": "standard",
    "marks": 4,
    "question": "Add 01101101 and 00110111. Give the 8-bit result and state whether unsigned overflow occurs.",
    "markPoints": [
      "Correct addition",
      "10100100",
      "Result fits 8 bits",
      "No unsigned overflow"
    ],
    "modelAnswer": "01101101 + 00110111 = 10100100. It fits in 8 bits, so there is no unsigned overflow.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "binary",
      "addition",
      "overflow"
    ],
    "curriculumAreaIds": [
      "data-representation"
    ]
  },
  {
    "id": "gcse-data-representation-006",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "data-representation",
    "topicTitle": "Data Representation",
    "subtopic": "Binary addition",
    "specificationReferences": [
      "AQA 3.3 Fundamentals of data representation",
      "OCR J277 1.2 Memory and storage",
      "Pearson GCSE Computer Science - Data"
    ],
    "questionType": "calculation",
    "difficulty": "standard",
    "marks": 4,
    "question": "Add 11100110 and 01011101 as unsigned 8-bit values. State whether overflow occurs.",
    "markPoints": [
      "Correct full result 1 01000011",
      "8-bit stored result 01000011",
      "Carry beyond 8 bits",
      "Overflow occurs"
    ],
    "modelAnswer": "The full sum is 1 01000011. An 8-bit register can store only 01000011, so unsigned overflow occurs.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "binary",
      "overflow"
    ],
    "curriculumAreaIds": [
      "data-representation"
    ]
  },
  {
    "id": "gcse-data-representation-007",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "data-representation",
    "topicTitle": "Data Representation",
    "subtopic": "Binary shifts",
    "specificationReferences": [
      "AQA 3.3 Fundamentals of data representation",
      "OCR J277 1.2 Memory and storage",
      "Pearson GCSE Computer Science - Data"
    ],
    "questionType": "calculation",
    "difficulty": "standard",
    "marks": 4,
    "question": "Apply a logical left shift of two places to 00110101 in an 8-bit register. Give the result and explain the effect on the unsigned value.",
    "markPoints": [
      "Shift left twice",
      "Result 11010100",
      "Original value 53",
      "New value 212 / multiplied by 4 where no significant bits lost"
    ],
    "modelAnswer": "00110101 shifted left twice becomes 11010100. The unsigned value changes from 53 to 212, multiplying it by four.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "shift",
      "binary"
    ],
    "curriculumAreaIds": [
      "data-representation"
    ]
  },
  {
    "id": "gcse-data-representation-008",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "data-representation",
    "topicTitle": "Data Representation",
    "subtopic": "Character encoding",
    "specificationReferences": [
      "AQA 3.3 Fundamentals of data representation",
      "OCR J277 1.2 Memory and storage",
      "Pearson GCSE Computer Science - Data"
    ],
    "questionType": "explain",
    "difficulty": "foundation",
    "marks": 4,
    "question": "Explain why Unicode is more suitable than a small ASCII character set for a worldwide messaging application.",
    "markPoints": [
      "Unicode represents many more characters",
      "Supports many writing systems/languages",
      "Can represent additional symbols",
      "Small ASCII set cannot represent many required characters"
    ],
    "modelAnswer": "Unicode can represent characters from many languages and a much wider range of symbols. A small ASCII set cannot represent many characters required by worldwide users.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "unicode",
      "ascii"
    ],
    "curriculumAreaIds": [
      "data-representation"
    ]
  },
  {
    "id": "gcse-data-representation-009",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "data-representation",
    "topicTitle": "Data Representation",
    "subtopic": "Character encoding",
    "specificationReferences": [
      "AQA 3.3 Fundamentals of data representation",
      "OCR J277 1.2 Memory and storage",
      "Pearson GCSE Computer Science - Data"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 4,
    "question": "Two computers exchange the bit pattern 01000001 using the same character encoding. Explain why agreeing on the encoding is necessary.",
    "markPoints": [
      "Bits alone do not define intended character",
      "Encoding maps characters to numeric codes",
      "Same mapping lets receiver interpret data correctly",
      "Different encodings can produce wrong characters"
    ],
    "modelAnswer": "The encoding defines how numeric codes map to characters. Both systems need the same mapping so that the received bit pattern is interpreted as the intended character.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "encoding",
      "character"
    ],
    "curriculumAreaIds": [
      "data-representation"
    ]
  },
  {
    "id": "gcse-data-representation-010",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "data-representation",
    "topicTitle": "Data Representation",
    "subtopic": "Bitmap images",
    "specificationReferences": [
      "AQA 3.3 Fundamentals of data representation",
      "OCR J277 1.2 Memory and storage",
      "Pearson GCSE Computer Science - Data"
    ],
    "questionType": "calculation",
    "difficulty": "standard",
    "marks": 5,
    "question": "An uncompressed bitmap is 800 pixels wide, 600 pixels high and has a colour depth of 24 bits. Calculate its size in bytes, ignoring metadata.",
    "markPoints": [
      "800×600 pixels",
      "×24 bits",
      "11,520,000 bits",
      "÷8",
      "1,440,000 bytes"
    ],
    "modelAnswer": "800 × 600 × 24 = 11,520,000 bits. Dividing by 8 gives 1,440,000 bytes.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "bitmap",
      "colour depth"
    ],
    "curriculumAreaIds": [
      "data-representation"
    ]
  },
  {
    "id": "gcse-data-representation-011",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "data-representation",
    "topicTitle": "Data Representation",
    "subtopic": "Bitmap images",
    "specificationReferences": [
      "AQA 3.3 Fundamentals of data representation",
      "OCR J277 1.2 Memory and storage",
      "Pearson GCSE Computer Science - Data"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 4,
    "question": "Explain how increasing the colour depth of a bitmap affects image quality and file size.",
    "markPoints": [
      "More bits per pixel",
      "More possible colours",
      "Can improve colour accuracy/quality",
      "Increases file size"
    ],
    "modelAnswer": "A greater colour depth uses more bits for each pixel, allowing more colours to be represented. This can improve colour quality but increases the uncompressed file size.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "bitmap",
      "colour depth"
    ],
    "curriculumAreaIds": [
      "data-representation"
    ]
  },
  {
    "id": "gcse-data-representation-012",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "data-representation",
    "topicTitle": "Data Representation",
    "subtopic": "Bitmap images",
    "specificationReferences": [
      "AQA 3.3 Fundamentals of data representation",
      "OCR J277 1.2 Memory and storage",
      "Pearson GCSE Computer Science - Data"
    ],
    "questionType": "calculation",
    "difficulty": "advanced",
    "marks": 6,
    "question": "A 1920 × 1080 bitmap uses 32 bits per pixel. Calculate the uncompressed size in MiB. Use 1 MiB = 1,048,576 bytes.",
    "markPoints": [
      "1920×1080 pixels",
      "×32 bits",
      "66,355,200 bits",
      "÷8 = 8,294,400 bytes",
      "÷1,048,576",
      "Approximately 7.91 MiB"
    ],
    "modelAnswer": "1920 × 1080 × 32 = 66,355,200 bits = 8,294,400 bytes. 8,294,400 ÷ 1,048,576 ≈ 7.91 MiB.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "bitmap",
      "file size",
      "mib"
    ],
    "curriculumAreaIds": [
      "data-representation"
    ]
  },
  {
    "id": "gcse-data-representation-013",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "data-representation",
    "topicTitle": "Data Representation",
    "subtopic": "Digital sound",
    "specificationReferences": [
      "AQA 3.3 Fundamentals of data representation",
      "OCR J277 1.2 Memory and storage",
      "Pearson GCSE Computer Science - Data"
    ],
    "questionType": "calculation",
    "difficulty": "standard",
    "marks": 5,
    "question": "A mono recording uses 44,100 samples per second and 16 bits per sample. Calculate the uncompressed size in bytes of a 10-second recording.",
    "markPoints": [
      "44100×10 samples",
      "×16 bits",
      "7,056,000 bits",
      "÷8",
      "882,000 bytes"
    ],
    "modelAnswer": "44,100 × 10 × 16 = 7,056,000 bits. Dividing by 8 gives 882,000 bytes.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "sound",
      "sample rate",
      "sample resolution"
    ],
    "curriculumAreaIds": [
      "data-representation"
    ]
  },
  {
    "id": "gcse-data-representation-014",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "data-representation",
    "topicTitle": "Data Representation",
    "subtopic": "Digital sound",
    "specificationReferences": [
      "AQA 3.3 Fundamentals of data representation",
      "OCR J277 1.2 Memory and storage",
      "Pearson GCSE Computer Science - Data"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 4,
    "question": "Explain the effect of increasing sample rate on the quality and file size of digital audio.",
    "markPoints": [
      "More samples taken each second",
      "Waveform represented more closely",
      "Potentially improves fidelity",
      "More data increases file size"
    ],
    "modelAnswer": "A higher sample rate records more measurements each second, allowing the digital representation to follow the original waveform more closely. It also stores more data, increasing file size.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "sample rate",
      "sound"
    ],
    "curriculumAreaIds": [
      "data-representation"
    ]
  },
  {
    "id": "gcse-data-representation-015",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "data-representation",
    "topicTitle": "Data Representation",
    "subtopic": "Digital sound",
    "specificationReferences": [
      "AQA 3.3 Fundamentals of data representation",
      "OCR J277 1.2 Memory and storage",
      "Pearson GCSE Computer Science - Data"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 4,
    "question": "Explain the effect of increasing sample resolution on digital audio.",
    "markPoints": [
      "More bits per sample",
      "More possible amplitude values",
      "Can represent amplitude more precisely / improve quality",
      "Increases file size"
    ],
    "modelAnswer": "Increasing sample resolution provides more possible amplitude values, so each sample can represent the signal more precisely. Because more bits are stored per sample, file size increases.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "sample resolution",
      "sound"
    ],
    "curriculumAreaIds": [
      "data-representation"
    ]
  },
  {
    "id": "gcse-data-representation-016",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "data-representation",
    "topicTitle": "Data Representation",
    "subtopic": "Compression",
    "specificationReferences": [
      "AQA 3.3 Fundamentals of data representation",
      "OCR J277 1.2 Memory and storage",
      "Pearson GCSE Computer Science - Data"
    ],
    "questionType": "compare",
    "difficulty": "standard",
    "marks": 5,
    "question": "Compare lossy and lossless compression for storing photographs.",
    "markPoints": [
      "Lossless preserves all original data",
      "Lossy permanently removes some data",
      "Lossy can achieve smaller files",
      "Lossless suitable where exact recovery/editing matters",
      "Choice justified for a stated use"
    ],
    "modelAnswer": "Lossless compression allows the original image data to be recovered exactly, while lossy compression discards some data to reduce size further. Lossless is preferable for master copies used for editing; lossy may suit web previews where smaller files matter more.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "lossy",
      "lossless",
      "compression"
    ],
    "curriculumAreaIds": [
      "data-representation"
    ]
  },
  {
    "id": "gcse-data-representation-017",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "data-representation",
    "topicTitle": "Data Representation",
    "subtopic": "Compression",
    "specificationReferences": [
      "AQA 3.3 Fundamentals of data representation",
      "OCR J277 1.2 Memory and storage",
      "Pearson GCSE Computer Science - Data"
    ],
    "questionType": "scenario",
    "difficulty": "advanced",
    "marks": 6,
    "question": "A music service stores a master recording and also streams it to mobile users. Recommend suitable compression approaches for the master and stream, with justification.",
    "markPoints": [
      "Lossless for master",
      "Preserves original information",
      "Lossy can be used for stream",
      "Smaller stream reduces bandwidth",
      "Acknowledges possible quality loss",
      "Justified trade-off"
    ],
    "modelAnswer": "The master should use lossless compression so the original data can be reconstructed exactly. The streamed copy can use lossy compression to reduce bandwidth and download time, accepting controlled quality loss.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "compression",
      "streaming"
    ],
    "curriculumAreaIds": [
      "data-representation"
    ]
  },
  {
    "id": "gcse-data-representation-018",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "data-representation",
    "topicTitle": "Data Representation",
    "subtopic": "Storage units",
    "specificationReferences": [
      "AQA 3.3 Fundamentals of data representation",
      "OCR J277 1.2 Memory and storage",
      "Pearson GCSE Computer Science - Data"
    ],
    "questionType": "calculation",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Convert 6 MiB to bytes using 1 MiB = 1,048,576 bytes.",
    "markPoints": [
      "Uses 6×1,048,576",
      "Correct arithmetic",
      "6,291,456 bytes"
    ],
    "modelAnswer": "6 × 1,048,576 = 6,291,456 bytes.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "storage",
      "mib"
    ],
    "curriculumAreaIds": [
      "data-representation"
    ]
  },
  {
    "id": "gcse-data-representation-019",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "data-representation",
    "topicTitle": "Data Representation",
    "subtopic": "Storage units",
    "specificationReferences": [
      "AQA 3.3 Fundamentals of data representation",
      "OCR J277 1.2 Memory and storage",
      "Pearson GCSE Computer Science - Data"
    ],
    "questionType": "calculation",
    "difficulty": "standard",
    "marks": 4,
    "question": "A file is 25,600 bits. Calculate its size in bytes and KiB. Use 1 KiB = 1024 bytes.",
    "markPoints": [
      "÷8 = 3200 bytes",
      "Correct bytes",
      "3200÷1024",
      "3.125 KiB"
    ],
    "modelAnswer": "25,600 ÷ 8 = 3,200 bytes. 3,200 ÷ 1,024 = 3.125 KiB.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "bits",
      "bytes",
      "kib"
    ],
    "curriculumAreaIds": [
      "data-representation"
    ]
  },
  {
    "id": "gcse-data-representation-020",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "data-representation",
    "topicTitle": "Data Representation",
    "subtopic": "Number representation",
    "specificationReferences": [
      "AQA 3.3 Fundamentals of data representation",
      "OCR J277 1.2 Memory and storage",
      "Pearson GCSE Computer Science - Data"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 4,
    "question": "An unsigned 8-bit register stores 255. Explain why adding 1 causes overflow and state the mathematical result before truncation.",
    "markPoints": [
      "Maximum unsigned 8-bit value is 255",
      "255 represented as 11111111",
      "Adding 1 requires ninth bit",
      "Mathematical binary result 1 00000000 / denary 256"
    ],
    "modelAnswer": "Eight unsigned bits can represent at most 255. Adding one to 11111111 gives 1 00000000, which needs nine bits, so it cannot be represented in the 8-bit register.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "overflow",
      "unsigned"
    ],
    "curriculumAreaIds": [
      "data-representation"
    ]
  },
  {
    "id": "gcse-data-representation-021",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "data-representation",
    "topicTitle": "Data Representation",
    "subtopic": "Binary conversion",
    "specificationReferences": [
      "AQA 3.3 Fundamentals of data representation",
      "OCR J277 1.2 Memory and storage",
      "Pearson GCSE Computer Science - Data"
    ],
    "questionType": "calculation",
    "difficulty": "standard",
    "marks": 4,
    "question": "Convert denary 201 to hexadecimal using binary as an intermediate step.",
    "markPoints": [
      "201 = 11001001",
      "Split 1100 1001",
      "1100=C and 1001=9",
      "Answer C9"
    ],
    "modelAnswer": "201 is 11001001 in binary. Splitting into nibbles gives 1100 1001, which is C9 in hexadecimal.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "binary",
      "hexadecimal"
    ],
    "curriculumAreaIds": [
      "data-representation"
    ]
  },
  {
    "id": "gcse-data-representation-022",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "data-representation",
    "topicTitle": "Data Representation",
    "subtopic": "Hexadecimal",
    "specificationReferences": [
      "AQA 3.3 Fundamentals of data representation",
      "OCR J277 1.2 Memory and storage",
      "Pearson GCSE Computer Science - Data"
    ],
    "questionType": "explain",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Give one reason hexadecimal is often used to display binary values and explain the relationship between one hexadecimal digit and binary.",
    "markPoints": [
      "Hex is shorter/easier for humans than long binary strings",
      "One hex digit represents four bits",
      "Mapping is exact / values 0–15"
    ],
    "modelAnswer": "Hexadecimal is more compact and easier to read than long binary strings. Each hexadecimal digit maps exactly to four binary bits.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "hexadecimal",
      "binary"
    ],
    "curriculumAreaIds": [
      "data-representation"
    ]
  },
  {
    "id": "gcse-data-representation-023",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "data-representation",
    "topicTitle": "Data Representation",
    "subtopic": "Bitmap images",
    "specificationReferences": [
      "AQA 3.3 Fundamentals of data representation",
      "OCR J277 1.2 Memory and storage",
      "Pearson GCSE Computer Science - Data"
    ],
    "questionType": "scenario",
    "difficulty": "advanced",
    "marks": 6,
    "question": "A game developer doubles both the width and height of an uncompressed bitmap while keeping colour depth unchanged. Explain the effect on pixel count and approximate file size.",
    "markPoints": [
      "Width doubles",
      "Height doubles",
      "Pixel count becomes four times larger",
      "Colour depth unchanged",
      "Uncompressed data per pixel unchanged",
      "File size becomes about four times larger"
    ],
    "modelAnswer": "Doubling both dimensions multiplies the number of pixels by 2 × 2 = 4. With the same bits per pixel, the uncompressed image data is therefore about four times as large.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "bitmap",
      "resolution",
      "file size"
    ],
    "curriculumAreaIds": [
      "data-representation"
    ]
  },
  {
    "id": "gcse-data-representation-024",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "data-representation",
    "topicTitle": "Data Representation",
    "subtopic": "Digital sound",
    "specificationReferences": [
      "AQA 3.3 Fundamentals of data representation",
      "OCR J277 1.2 Memory and storage",
      "Pearson GCSE Computer Science - Data"
    ],
    "questionType": "calculation",
    "difficulty": "advanced",
    "marks": 6,
    "question": "A stereo recording uses 48,000 Hz, 24 bits per sample, two channels and lasts 60 seconds. Calculate its uncompressed size in bytes.",
    "markPoints": [
      "48000 samples/s",
      "×24 bits",
      "×2 channels",
      "×60 seconds",
      "138,240,000 bits",
      "17,280,000 bytes"
    ],
    "modelAnswer": "48,000 × 24 × 2 × 60 = 138,240,000 bits. Dividing by 8 gives 17,280,000 bytes.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "sound",
      "stereo",
      "file size"
    ],
    "curriculumAreaIds": [
      "data-representation"
    ]
  },
  {
    "id": "gcse-data-representation-025",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "data-representation",
    "topicTitle": "Data Representation",
    "subtopic": "Compression",
    "specificationReferences": [
      "AQA 3.3 Fundamentals of data representation",
      "OCR J277 1.2 Memory and storage",
      "Pearson GCSE Computer Science - Data"
    ],
    "questionType": "explain",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Explain why compressing a file can reduce transmission time over a network.",
    "markPoints": [
      "Compression reduces number of bits/bytes",
      "Less data must be transmitted",
      "At same transfer rate this takes less time"
    ],
    "modelAnswer": "Compression reduces the amount of data that must be sent. At the same network transfer rate, fewer bits take less time to transmit.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "compression",
      "network"
    ],
    "curriculumAreaIds": [
      "data-representation"
    ]
  },
  {
    "id": "gcse-data-representation-026",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "data-representation",
    "topicTitle": "Data Representation",
    "subtopic": "Character encoding",
    "specificationReferences": [
      "AQA 3.3 Fundamentals of data representation",
      "OCR J277 1.2 Memory and storage",
      "Pearson GCSE Computer Science - Data"
    ],
    "questionType": "compare",
    "difficulty": "advanced",
    "marks": 6,
    "question": "A legacy system uses a small character set while a new system uses Unicode. Evaluate the change for a school that stores names in many languages.",
    "markPoints": [
      "Unicode supports wider character range",
      "Can represent names from many scripts",
      "Legacy set may fail/substitute characters",
      "Unicode may use more storage for some representations",
      "Compatibility/conversion needs consideration",
      "Justified conclusion"
    ],
    "modelAnswer": "Unicode is preferable because it can represent names from many writing systems accurately. Migration may require conversion and some encodings can use more bytes, but correct representation of users' names makes the change worthwhile.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "unicode",
      "character set"
    ],
    "curriculumAreaIds": [
      "data-representation"
    ]
  },
  {
    "id": "gcse-data-representation-027",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "data-representation",
    "topicTitle": "Data Representation",
    "subtopic": "Binary shifts",
    "specificationReferences": [
      "AQA 3.3 Fundamentals of data representation",
      "OCR J277 1.2 Memory and storage",
      "Pearson GCSE Computer Science - Data"
    ],
    "questionType": "calculation",
    "difficulty": "standard",
    "marks": 4,
    "question": "Apply a logical right shift of three places to 11010000. Give the result and the unsigned denary value.",
    "markPoints": [
      "Shift right three",
      "00011010",
      "Binary result correct",
      "Denary 26"
    ],
    "modelAnswer": "11010000 shifted right three places is 00011010, which is 26 in denary.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "shift",
      "binary"
    ],
    "curriculumAreaIds": [
      "data-representation"
    ]
  },
  {
    "id": "gcse-data-representation-028",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "data-representation",
    "topicTitle": "Data Representation",
    "subtopic": "Binary addition",
    "specificationReferences": [
      "AQA 3.3 Fundamentals of data representation",
      "OCR J277 1.2 Memory and storage",
      "Pearson GCSE Computer Science - Data"
    ],
    "questionType": "scenario",
    "difficulty": "advanced",
    "marks": 5,
    "question": "An 8-bit unsigned sensor counter contains 250 and 10 is added. Explain what overflow means in this situation.",
    "markPoints": [
      "Mathematical result 260",
      "8-bit unsigned maximum 255",
      "260 cannot be represented in 8 bits",
      "Extra carry/significant bit is lost or requires wider storage",
      "Stored result would not represent intended 260"
    ],
    "modelAnswer": "The intended result is 260, but an unsigned 8-bit value can store only 0–255. The result needs more than eight bits, so overflow occurs and the stored 8-bit pattern cannot represent 260 correctly.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "overflow",
      "binary"
    ],
    "curriculumAreaIds": [
      "data-representation"
    ]
  },
  {
    "id": "gcse-data-representation-029",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "data-representation",
    "topicTitle": "Data Representation",
    "subtopic": "Storage units",
    "specificationReferences": [
      "AQA 3.3 Fundamentals of data representation",
      "OCR J277 1.2 Memory and storage",
      "Pearson GCSE Computer Science - Data"
    ],
    "questionType": "calculation",
    "difficulty": "advanced",
    "marks": 5,
    "question": "A 12 MiB file is transferred at 3 MiB per second. Ignoring overhead, calculate the transfer time and explain why real transfer time may be longer.",
    "markPoints": [
      "12÷3",
      "4 seconds theoretical",
      "Protocol/header overhead",
      "Network congestion/variation or retransmission",
      "Explains overhead reduces useful data rate"
    ],
    "modelAnswer": "The theoretical time is 12 ÷ 3 = 4 seconds. Real transfer can take longer because some capacity is used by protocol overhead and conditions such as congestion or retransmission.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "storage",
      "transfer rate"
    ],
    "curriculumAreaIds": [
      "data-representation"
    ]
  },
  {
    "id": "gcse-data-representation-030",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "data-representation",
    "topicTitle": "Data Representation",
    "subtopic": "Data representation",
    "specificationReferences": [
      "AQA 3.3 Fundamentals of data representation",
      "OCR J277 1.2 Memory and storage",
      "Pearson GCSE Computer Science - Data"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 6,
    "question": "A designer can reduce an image's resolution, reduce its colour depth, or use compression to make a web image smaller. Evaluate these approaches.",
    "markPoints": [
      "Lower resolution means fewer pixels",
      "Can reduce spatial detail",
      "Lower colour depth means fewer colours",
      "Can cause colour banding/loss",
      "Compression reduces stored/transmitted data",
      "Justified balance based on required quality and size"
    ],
    "modelAnswer": "Reducing resolution cuts pixel count but may remove detail. Reducing colour depth lowers bits per pixel but may reduce colour quality. Compression can reduce storage without necessarily changing dimensions. The best choice balances acceptable visual quality against file size and download speed.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "image",
      "compression",
      "resolution"
    ],
    "curriculumAreaIds": [
      "data-representation"
    ]
  }
];
