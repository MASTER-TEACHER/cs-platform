import type { GCSEPracticeQuestion } from "./types";

export const gcseAlgorithmQuestions: GCSEPracticeQuestion[] = [
  {
    "id": "gcse-algorithms-001",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "algorithms",
    "topicTitle": "Algorithms",
    "subtopic": "Decomposition",
    "specificationReferences": [
      "AQA 3.1 Fundamentals of algorithms",
      "OCR J277 2.1 Algorithms",
      "Pearson GCSE Computer Science - Algorithms"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 2,
    "question": "State what is meant by decomposition and give one reason why programmers use it.",
    "markPoints": [
      "Breaking a complex problem into smaller sub-problems",
      "Makes the problem easier to design, implement, test or manage"
    ],
    "modelAnswer": "Decomposition means breaking a complex problem into smaller sub-problems. This makes each part easier to design, implement and test.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "decomposition"
    ],
    "curriculumAreaIds": [
      "algorithms"
    ]
  },
  {
    "id": "gcse-algorithms-002",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "algorithms",
    "topicTitle": "Algorithms",
    "subtopic": "Abstraction",
    "specificationReferences": [
      "AQA 3.1 Fundamentals of algorithms",
      "OCR J277 2.1 Algorithms",
      "Pearson GCSE Computer Science - Algorithms"
    ],
    "questionType": "explain",
    "difficulty": "foundation",
    "marks": 3,
    "question": "A navigation app models roads between towns. Explain how abstraction can be used when creating the model.",
    "markPoints": [
      "Remove details that are not needed",
      "Keep relevant details such as roads, junctions, distances or travel times",
      "Reduces complexity / makes the model easier to process"
    ],
    "modelAnswer": "The model keeps information needed for route finding, such as roads, junctions and distances, while ignoring irrelevant detail such as building colours. This reduces unnecessary complexity.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "abstraction",
      "model"
    ],
    "curriculumAreaIds": [
      "algorithms"
    ]
  },
  {
    "id": "gcse-algorithms-003",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "algorithms",
    "topicTitle": "Algorithms",
    "subtopic": "Inputs processes outputs",
    "specificationReferences": [
      "AQA 3.1 Fundamentals of algorithms",
      "OCR J277 2.1 Algorithms",
      "Pearson GCSE Computer Science - Algorithms"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 4,
    "question": "A program calculates the cost of cinema tickets. Identify one suitable input, describe one process and identify one output.",
    "markPoints": [
      "Suitable input such as number/type of tickets",
      "Process uses input to calculate price",
      "Suitable output such as total cost",
      "Input, process and output are logically linked"
    ],
    "modelAnswer": "An input could be the number and type of tickets. The program multiplies each quantity by its ticket price and adds the results. The output is the total cost.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "input",
      "process",
      "output"
    ],
    "curriculumAreaIds": [
      "algorithms"
    ]
  },
  {
    "id": "gcse-algorithms-004",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "algorithms",
    "topicTitle": "Algorithms",
    "subtopic": "Linear search",
    "specificationReferences": [
      "AQA 3.1 Fundamentals of algorithms",
      "OCR J277 2.1 Algorithms",
      "Pearson GCSE Computer Science - Algorithms"
    ],
    "questionType": "trace",
    "difficulty": "foundation",
    "marks": 4,
    "question": "A linear search looks for 31 in [14, 7, 22, 31, 9, 18]. State the values examined in order and the number of comparisons made.",
    "markPoints": [
      "14 examined first",
      "Then 7 and 22",
      "31 is then found",
      "4 comparisons are made"
    ],
    "modelAnswer": "The search examines 14, 7, 22 and 31, then stops. It makes 4 comparisons.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "linear",
      "search",
      "comparison"
    ],
    "curriculumAreaIds": [
      "algorithms"
    ]
  },
  {
    "id": "gcse-algorithms-005",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "algorithms",
    "topicTitle": "Algorithms",
    "subtopic": "Binary search",
    "specificationReferences": [
      "AQA 3.1 Fundamentals of algorithms",
      "OCR J277 2.1 Algorithms",
      "Pearson GCSE Computer Science - Algorithms"
    ],
    "questionType": "trace",
    "difficulty": "standard",
    "marks": 5,
    "question": "Binary search is used to find 57 in [4, 9, 15, 21, 28, 34, 42, 57, 63]. Describe the search steps and explain why binary search can be used.",
    "markPoints": [
      "First middle value is 28",
      "57 is greater so lower part is discarded",
      "Search continues in upper half",
      "57 is found after further halving/comparison",
      "The list is sorted"
    ],
    "modelAnswer": "The first middle value is 28. Because 57 is larger, the lower part is discarded. The search continues in the upper half until 57 is found. Binary search is valid because the list is sorted.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "binary",
      "search",
      "sorted"
    ],
    "curriculumAreaIds": [
      "algorithms"
    ]
  },
  {
    "id": "gcse-algorithms-006",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "algorithms",
    "topicTitle": "Algorithms",
    "subtopic": "Bubble sort",
    "specificationReferences": [
      "AQA 3.1 Fundamentals of algorithms",
      "OCR J277 2.1 Algorithms",
      "Pearson GCSE Computer Science - Algorithms"
    ],
    "questionType": "trace",
    "difficulty": "standard",
    "marks": 5,
    "question": "Perform the first complete pass of a bubble sort in ascending order on [7, 3, 9, 2, 5]. Show the list after each swap.",
    "markPoints": [
      "[3, 7, 9, 2, 5]",
      "[3, 7, 2, 9, 5]",
      "[3, 7, 2, 5, 9]",
      "Adjacent items are compared",
      "Larger out-of-order values move right"
    ],
    "modelAnswer": "The swaps are [3,7,9,2,5], then [3,7,2,9,5], then [3,7,2,5,9]. After the pass, the largest value is at the end.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "bubble",
      "sort",
      "swap"
    ],
    "curriculumAreaIds": [
      "algorithms"
    ]
  },
  {
    "id": "gcse-algorithms-007",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "algorithms",
    "topicTitle": "Algorithms",
    "subtopic": "Merge sort",
    "specificationReferences": [
      "AQA 3.1 Fundamentals of algorithms",
      "OCR J277 2.1 Algorithms",
      "Pearson GCSE Computer Science - Algorithms"
    ],
    "questionType": "trace",
    "difficulty": "standard",
    "marks": 5,
    "question": "Show how merge sort sorts [8, 3, 6, 1]. Include the splitting and merging stages.",
    "markPoints": [
      "Split into [8,3] and [6,1]",
      "Split to individual values",
      "Merge to [3,8]",
      "Merge to [1,6]",
      "Final merge [1,3,6,8]"
    ],
    "modelAnswer": "The list splits into [8,3] and [6,1], then into individual values. The ordered pairs become [3,8] and [1,6], which merge to [1,3,6,8].",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "merge",
      "sort",
      "divide"
    ],
    "curriculumAreaIds": [
      "algorithms"
    ]
  },
  {
    "id": "gcse-algorithms-008",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "algorithms",
    "topicTitle": "Algorithms",
    "subtopic": "Insertion sort",
    "specificationReferences": [
      "AQA 3.1 Fundamentals of algorithms",
      "OCR J277 2.1 Algorithms",
      "Pearson GCSE Computer Science - Algorithms"
    ],
    "questionType": "trace",
    "difficulty": "standard",
    "marks": 5,
    "question": "Use insertion sort to sort [6, 2, 5, 3] in ascending order. Show the list after each value is inserted into the sorted section.",
    "markPoints": [
      "After inserting 2: [2,6,5,3]",
      "After inserting 5: [2,5,6,3]",
      "After inserting 3: [2,3,5,6]",
      "Correctly treats left section as sorted",
      "Final order is ascending"
    ],
    "modelAnswer": "Starting with 6 as the sorted section: insert 2 to get [2,6,5,3], insert 5 to get [2,5,6,3], then insert 3 to get [2,3,5,6].",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "insertion",
      "sort"
    ],
    "curriculumAreaIds": [
      "algorithms"
    ]
  },
  {
    "id": "gcse-algorithms-009",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "algorithms",
    "topicTitle": "Algorithms",
    "subtopic": "Trace tables",
    "specificationReferences": [
      "AQA 3.1 Fundamentals of algorithms",
      "OCR J277 2.1 Algorithms",
      "Pearson GCSE Computer Science - Algorithms"
    ],
    "questionType": "trace",
    "difficulty": "standard",
    "marks": 6,
    "question": "Trace the algorithm for values [4, 7, 2, 9]. Show total and count after each iteration.\n\nSET total TO 0\nSET count TO 0\nFOR EACH value IN values\n  IF value > 5 THEN\n    SET total TO total + value\n    SET count TO count + 1\n  ENDIF\nENDFOR\nOUTPUT total, count",
    "markPoints": [
      "After 4: total 0, count 0",
      "After 7: total 7, count 1",
      "After 2: total 7, count 1",
      "After 9: total 16, count 2",
      "Final total 16",
      "Final count 2"
    ],
    "modelAnswer": "The states are (0,0), (7,1), (7,1), (16,2). The final output is 16, 2.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "trace",
      "iteration",
      "selection"
    ],
    "curriculumAreaIds": [
      "algorithms"
    ]
  },
  {
    "id": "gcse-algorithms-010",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "algorithms",
    "topicTitle": "Algorithms",
    "subtopic": "Algorithm design",
    "specificationReferences": [
      "AQA 3.1 Fundamentals of algorithms",
      "OCR J277 2.1 Algorithms",
      "Pearson GCSE Computer Science - Algorithms"
    ],
    "questionType": "algorithm",
    "difficulty": "standard",
    "marks": 6,
    "question": "Design pseudocode that inputs five test scores and outputs the highest score.",
    "markPoints": [
      "Inputs five scores",
      "Initialises highest from a valid score",
      "Uses repetition",
      "Compares each score with highest",
      "Updates highest when appropriate",
      "Outputs highest after the loop"
    ],
    "modelAnswer": "INPUT score\nSET highest TO score\nFOR i <- 2 TO 5\n  INPUT score\n  IF score > highest THEN\n    SET highest TO score\n  ENDIF\nENDFOR\nOUTPUT highest",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "algorithm",
      "maximum",
      "iteration"
    ],
    "curriculumAreaIds": [
      "algorithms"
    ]
  },
  {
    "id": "gcse-algorithms-011",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "algorithms",
    "topicTitle": "Algorithms",
    "subtopic": "Decomposition",
    "specificationReferences": [
      "AQA 3.1 Fundamentals of algorithms",
      "OCR J277 2.1 Algorithms",
      "Pearson GCSE Computer Science - Algorithms"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 4,
    "question": "A school is developing an online parents' evening booking system. Describe how decomposition could be used.",
    "markPoints": [
      "Split the whole system into smaller sub-problems",
      "Relevant sub-problem such as authentication",
      "Relevant sub-problem such as appointment selection/validation/confirmation",
      "Parts can be developed or tested separately then combined"
    ],
    "modelAnswer": "The system can be split into modules such as login, selecting a teacher and time, validating the booking and sending confirmation. Each module can be developed and tested separately before being combined.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "decomposition",
      "module"
    ],
    "curriculumAreaIds": [
      "algorithms"
    ]
  },
  {
    "id": "gcse-algorithms-012",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "algorithms",
    "topicTitle": "Algorithms",
    "subtopic": "Abstraction",
    "specificationReferences": [
      "AQA 3.1 Fundamentals of algorithms",
      "OCR J277 2.1 Algorithms",
      "Pearson GCSE Computer Science - Algorithms"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 4,
    "question": "A weather program predicts temperature using readings from sensors. Give two details the programmer might keep and two details that could be ignored through abstraction.",
    "markPoints": [
      "Relevant kept detail 1, e.g. temperature",
      "Relevant kept detail 2, e.g. time/location/humidity",
      "Irrelevant ignored detail 1",
      "Irrelevant ignored detail 2"
    ],
    "modelAnswer": "The model could keep temperature and the time/location of each reading. It could ignore details such as the sensor casing colour and the name of the technician who installed it.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "abstraction",
      "relevant",
      "irrelevant"
    ],
    "curriculumAreaIds": [
      "algorithms"
    ]
  },
  {
    "id": "gcse-algorithms-013",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "algorithms",
    "topicTitle": "Algorithms",
    "subtopic": "Inputs processes outputs",
    "specificationReferences": [
      "AQA 3.1 Fundamentals of algorithms",
      "OCR J277 2.1 Algorithms",
      "Pearson GCSE Computer Science - Algorithms"
    ],
    "questionType": "algorithm",
    "difficulty": "standard",
    "marks": 5,
    "question": "A program converts a temperature from Celsius to Fahrenheit using F = (C × 9 / 5) + 32. Write an IPO description for the program.",
    "markPoints": [
      "Input is Celsius temperature",
      "Process multiplies C by 9",
      "Divides by 5",
      "Adds 32",
      "Output is Fahrenheit temperature"
    ],
    "modelAnswer": "Input: Celsius temperature C. Process: calculate (C × 9 / 5) + 32. Output: the Fahrenheit temperature.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "ipo",
      "input",
      "process",
      "output"
    ],
    "curriculumAreaIds": [
      "algorithms"
    ]
  },
  {
    "id": "gcse-algorithms-014",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "algorithms",
    "topicTitle": "Algorithms",
    "subtopic": "Linear search",
    "specificationReferences": [
      "AQA 3.1 Fundamentals of algorithms",
      "OCR J277 2.1 Algorithms",
      "Pearson GCSE Computer Science - Algorithms"
    ],
    "questionType": "algorithm",
    "difficulty": "standard",
    "marks": 6,
    "question": "Write pseudocode for a linear search that finds target in an array names containing 20 items. Output the index if found, otherwise output -1.",
    "markPoints": [
      "Initialises index/search position",
      "Checks array elements sequentially",
      "Compares element with target",
      "Stops/records when found",
      "Handles not-found case",
      "Outputs index or -1 correctly"
    ],
    "modelAnswer": "SET result TO -1\nFOR i <- 0 TO 19\n  IF names[i] = target AND result = -1 THEN\n    SET result TO i\n  ENDIF\nENDFOR\nOUTPUT result",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "linear",
      "search",
      "array"
    ],
    "curriculumAreaIds": [
      "algorithms"
    ]
  },
  {
    "id": "gcse-algorithms-015",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "algorithms",
    "topicTitle": "Algorithms",
    "subtopic": "Binary search",
    "specificationReferences": [
      "AQA 3.1 Fundamentals of algorithms",
      "OCR J277 2.1 Algorithms",
      "Pearson GCSE Computer Science - Algorithms"
    ],
    "questionType": "compare",
    "difficulty": "standard",
    "marks": 5,
    "question": "A sorted list contains 10,000 usernames. Compare linear search and binary search for finding one username.",
    "markPoints": [
      "Linear search checks items sequentially",
      "Linear search may inspect many/all items",
      "Binary search repeatedly halves the search space",
      "Binary search requires sorted data",
      "Binary search is more suitable here with justification"
    ],
    "modelAnswer": "Linear search may examine thousands of names one by one. Binary search repeatedly halves the remaining sorted list, so it will normally use far fewer comparisons. Because the usernames are sorted, binary search is more suitable.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "linear",
      "binary",
      "search"
    ],
    "curriculumAreaIds": [
      "algorithms"
    ]
  },
  {
    "id": "gcse-algorithms-016",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "algorithms",
    "topicTitle": "Algorithms",
    "subtopic": "Bubble sort",
    "specificationReferences": [
      "AQA 3.1 Fundamentals of algorithms",
      "OCR J277 2.1 Algorithms",
      "Pearson GCSE Computer Science - Algorithms"
    ],
    "questionType": "trace",
    "difficulty": "foundation",
    "marks": 4,
    "question": "After one complete ascending bubble-sort pass on [5, 1, 4, 2], what is the list? Show each swap.",
    "markPoints": [
      "[1,5,4,2]",
      "[1,4,5,2]",
      "[1,4,2,5]",
      "Correct final list"
    ],
    "modelAnswer": "The swaps give [1,5,4,2], [1,4,5,2], then [1,4,2,5].",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "bubble",
      "sort"
    ],
    "curriculumAreaIds": [
      "algorithms"
    ]
  },
  {
    "id": "gcse-algorithms-017",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "algorithms",
    "topicTitle": "Algorithms",
    "subtopic": "Merge sort",
    "specificationReferences": [
      "AQA 3.1 Fundamentals of algorithms",
      "OCR J277 2.1 Algorithms",
      "Pearson GCSE Computer Science - Algorithms"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 4,
    "question": "Explain two features of merge sort.",
    "markPoints": [
      "Divides the data into smaller parts",
      "Continues until very small/single-item lists",
      "Merges sub-lists in order",
      "Uses divide-and-conquer / systematic merging"
    ],
    "modelAnswer": "Merge sort repeatedly divides the data into smaller lists and then merges those lists back together in sorted order. It is a divide-and-conquer algorithm.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "merge",
      "sort"
    ],
    "curriculumAreaIds": [
      "algorithms"
    ]
  },
  {
    "id": "gcse-algorithms-018",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "algorithms",
    "topicTitle": "Algorithms",
    "subtopic": "Insertion sort",
    "specificationReferences": [
      "AQA 3.1 Fundamentals of algorithms",
      "OCR J277 2.1 Algorithms",
      "Pearson GCSE Computer Science - Algorithms"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 4,
    "question": "Explain how insertion sort builds a sorted list.",
    "markPoints": [
      "Treats an initial section as sorted",
      "Takes the next item",
      "Compares/moves it into correct position",
      "Sorted section grows until all items inserted"
    ],
    "modelAnswer": "Insertion sort treats the first item as a sorted section, then takes each next item and inserts it into the correct position in that section. The sorted section grows until all values have been inserted.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "insertion",
      "sort"
    ],
    "curriculumAreaIds": [
      "algorithms"
    ]
  },
  {
    "id": "gcse-algorithms-019",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "algorithms",
    "topicTitle": "Algorithms",
    "subtopic": "Trace tables",
    "specificationReferences": [
      "AQA 3.1 Fundamentals of algorithms",
      "OCR J277 2.1 Algorithms",
      "Pearson GCSE Computer Science - Algorithms"
    ],
    "questionType": "debugging",
    "difficulty": "standard",
    "marks": 5,
    "question": "A program should total 1 to 5 but outputs 5.\n\nSET total TO 0\nFOR i <- 1 TO 5\n  SET total TO i\nENDFOR\nOUTPUT total\n\nUse tracing to identify the logic error and give the corrected assignment.",
    "markPoints": [
      "total becomes 1,2,3,4,5",
      "Value is overwritten each iteration",
      "Identifies accumulation is required",
      "Correct assignment total <- total + i",
      "Correct final total is 15"
    ],
    "modelAnswer": "The trace shows total being replaced by i on every iteration. The assignment should be SET total TO total + i, producing a final total of 15.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "trace",
      "logic error",
      "accumulator"
    ],
    "curriculumAreaIds": [
      "algorithms"
    ]
  },
  {
    "id": "gcse-algorithms-020",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "algorithms",
    "topicTitle": "Algorithms",
    "subtopic": "Algorithm design",
    "specificationReferences": [
      "AQA 3.1 Fundamentals of algorithms",
      "OCR J277 2.1 Algorithms",
      "Pearson GCSE Computer Science - Algorithms"
    ],
    "questionType": "algorithm",
    "difficulty": "advanced",
    "marks": 8,
    "question": "Design pseudocode that inputs six test scores. Reject scores outside 0 to 100. For valid scores, output the mean and the highest score.",
    "markPoints": [
      "Repeats until six valid scores have been accepted",
      "Inputs a score",
      "Validates range 0 to 100",
      "Invalid score does not contribute",
      "Maintains total",
      "Maintains highest",
      "Calculates mean from six valid scores",
      "Outputs mean and highest"
    ],
    "modelAnswer": "SET count TO 0\nSET total TO 0\nWHILE count < 6\n  INPUT score\n  IF score >= 0 AND score <= 100 THEN\n    SET total TO total + score\n    IF count = 0 OR score > highest THEN SET highest TO score ENDIF\n    SET count TO count + 1\n  ENDIF\nENDWHILE\nOUTPUT total / 6\nOUTPUT highest",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "algorithm",
      "validation",
      "average",
      "maximum"
    ],
    "curriculumAreaIds": [
      "algorithms"
    ]
  },
  {
    "id": "gcse-algorithms-021",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "algorithms",
    "topicTitle": "Algorithms",
    "subtopic": "Decomposition",
    "specificationReferences": [
      "AQA 3.1 Fundamentals of algorithms",
      "OCR J277 2.1 Algorithms",
      "Pearson GCSE Computer Science - Algorithms"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 6,
    "question": "A team is creating a large school-management application. Evaluate how decomposition could improve development and identify one limitation of relying on decomposition alone.",
    "markPoints": [
      "Smaller modules are easier to understand",
      "Modules can be assigned/developed separately",
      "Modules can be tested independently",
      "Interfaces between modules still need careful design",
      "Integration can introduce faults / decomposition alone does not guarantee correctness",
      "Reasoned conclusion"
    ],
    "modelAnswer": "Decomposition makes a large system manageable by splitting it into modules that can be designed, assigned and tested separately. However, the modules still need well-defined interfaces and integration testing, so decomposition alone does not guarantee a reliable system.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "decomposition",
      "integration",
      "modules"
    ],
    "curriculumAreaIds": [
      "algorithms"
    ]
  },
  {
    "id": "gcse-algorithms-022",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "algorithms",
    "topicTitle": "Algorithms",
    "subtopic": "Abstraction",
    "specificationReferences": [
      "AQA 3.1 Fundamentals of algorithms",
      "OCR J277 2.1 Algorithms",
      "Pearson GCSE Computer Science - Algorithms"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 6,
    "question": "A simulation of traffic ignores the colour and model of each car but stores its speed, position and direction. Evaluate this use of abstraction.",
    "markPoints": [
      "Colour/model are not needed for movement model",
      "Speed is relevant",
      "Position is relevant",
      "Direction is relevant",
      "Removing irrelevant detail reduces complexity",
      "Conclusion that abstraction is appropriate provided required behaviour remains represented"
    ],
    "modelAnswer": "The abstraction is appropriate because speed, position and direction affect traffic movement, whereas colour and model usually do not. Removing those irrelevant details simplifies the simulation without removing information needed for its purpose.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "abstraction",
      "simulation"
    ],
    "curriculumAreaIds": [
      "algorithms"
    ]
  },
  {
    "id": "gcse-algorithms-023",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "algorithms",
    "topicTitle": "Algorithms",
    "subtopic": "Inputs processes outputs",
    "specificationReferences": [
      "AQA 3.1 Fundamentals of algorithms",
      "OCR J277 2.1 Algorithms",
      "Pearson GCSE Computer Science - Algorithms"
    ],
    "questionType": "scenario",
    "difficulty": "foundation",
    "marks": 3,
    "question": "A program calculates a student's percentage from marks scored and marks available. State two inputs and one output.",
    "markPoints": [
      "Marks scored",
      "Marks available",
      "Percentage"
    ],
    "modelAnswer": "The inputs are marks scored and marks available. The output is the calculated percentage.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "input",
      "output",
      "percentage"
    ],
    "curriculumAreaIds": [
      "algorithms"
    ]
  },
  {
    "id": "gcse-algorithms-024",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "algorithms",
    "topicTitle": "Algorithms",
    "subtopic": "Linear search",
    "specificationReferences": [
      "AQA 3.1 Fundamentals of algorithms",
      "OCR J277 2.1 Algorithms",
      "Pearson GCSE Computer Science - Algorithms"
    ],
    "questionType": "trace",
    "difficulty": "standard",
    "marks": 5,
    "question": "A linear search looks for 'Mia' in ['Ava','Leo','Noah','Mia','Zara']. Complete the search logically and explain what happens if the target is not present.",
    "markPoints": [
      "Checks Ava",
      "Then Leo and Noah",
      "Finds Mia fourth",
      "Stops/returns position when found",
      "If absent, reaches end and reports not found"
    ],
    "modelAnswer": "The search checks Ava, Leo, Noah and then Mia, where it can stop. If the target is absent, every item is checked and the algorithm reports that it was not found.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "linear",
      "search"
    ],
    "curriculumAreaIds": [
      "algorithms"
    ]
  },
  {
    "id": "gcse-algorithms-025",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "algorithms",
    "topicTitle": "Algorithms",
    "subtopic": "Binary search",
    "specificationReferences": [
      "AQA 3.1 Fundamentals of algorithms",
      "OCR J277 2.1 Algorithms",
      "Pearson GCSE Computer Science - Algorithms"
    ],
    "questionType": "trace",
    "difficulty": "advanced",
    "marks": 6,
    "question": "Binary search is used on [3, 8, 12, 19, 27, 35, 44, 58, 71, 86, 93] to find 71. Show a valid sequence of middle values examined and state what happens to the search range after each comparison.",
    "markPoints": [
      "Starts with middle value 35",
      "71 > 35 so discard lower half including 35",
      "Next midpoint in upper range is 71 or a valid implementation-equivalent midpoint",
      "Target found",
      "Explains range is halved",
      "Uses sorted-list requirement correctly"
    ],
    "modelAnswer": "Using integer midpoint indexing, the first middle value is 35. Since 71 is larger, the lower half is discarded. The midpoint of the remaining upper range can then be 71, so the target is found. Each comparison discards half of the remaining sorted range.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "binary",
      "search",
      "midpoint"
    ],
    "curriculumAreaIds": [
      "algorithms"
    ]
  },
  {
    "id": "gcse-algorithms-026",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "algorithms",
    "topicTitle": "Algorithms",
    "subtopic": "Bubble sort",
    "specificationReferences": [
      "AQA 3.1 Fundamentals of algorithms",
      "OCR J277 2.1 Algorithms",
      "Pearson GCSE Computer Science - Algorithms"
    ],
    "questionType": "compare",
    "difficulty": "advanced",
    "marks": 6,
    "question": "Compare bubble sort with merge sort for sorting a very large list. Your answer should include how each algorithm works and a justified recommendation.",
    "markPoints": [
      "Bubble sort compares/swaps adjacent values",
      "Bubble sort uses repeated passes",
      "Merge sort divides data",
      "Merge sort merges ordered sub-lists",
      "Recognises bubble sort can require many comparisons/passes on large data",
      "Justified recommendation of merge sort for large list"
    ],
    "modelAnswer": "Bubble sort repeatedly compares adjacent items and may need many passes. Merge sort divides the list into smaller parts and merges them in order. For a very large list, merge sort is generally the better choice because its divide-and-merge approach scales more effectively.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "bubble",
      "merge",
      "sort",
      "efficiency"
    ],
    "curriculumAreaIds": [
      "algorithms"
    ]
  },
  {
    "id": "gcse-algorithms-027",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "algorithms",
    "topicTitle": "Algorithms",
    "subtopic": "Merge sort",
    "specificationReferences": [
      "AQA 3.1 Fundamentals of algorithms",
      "OCR J277 2.1 Algorithms",
      "Pearson GCSE Computer Science - Algorithms"
    ],
    "questionType": "trace",
    "difficulty": "advanced",
    "marks": 7,
    "question": "Show the complete merge-sort process for [11, 4, 9, 2, 7, 5].",
    "markPoints": [
      "Valid first split",
      "Splits continue to single items",
      "Correct merge of first section",
      "Correct merge of second section",
      "Maintains ascending order during merges",
      "Correct intermediate merged lists",
      "Final list [2,4,5,7,9,11]"
    ],
    "modelAnswer": "One valid route is [11,4,9] and [2,7,5], split to individual items, then merge in order to [4,9,11] and [2,5,7], followed by the final merge [2,4,5,7,9,11].",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "merge",
      "sort",
      "trace"
    ],
    "curriculumAreaIds": [
      "algorithms"
    ]
  },
  {
    "id": "gcse-algorithms-028",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "algorithms",
    "topicTitle": "Algorithms",
    "subtopic": "Insertion sort",
    "specificationReferences": [
      "AQA 3.1 Fundamentals of algorithms",
      "OCR J277 2.1 Algorithms",
      "Pearson GCSE Computer Science - Algorithms"
    ],
    "questionType": "compare",
    "difficulty": "advanced",
    "marks": 6,
    "question": "A list of 200 values is already almost in ascending order. Explain why insertion sort may be a reasonable choice and compare it with bubble sort.",
    "markPoints": [
      "Insertion sort builds/maintains sorted section",
      "Nearly sorted items may need little movement",
      "Bubble sort compares adjacent values over passes",
      "Bubble sort may still perform repeated passes",
      "Recognises suitability depends on implementation/data",
      "Justified recommendation"
    ],
    "modelAnswer": "Insertion sort can be effective on nearly sorted data because each new value may need to move only a short distance into the sorted section. Bubble sort works through repeated adjacent comparisons and can require repeated passes. For this nearly sorted list, insertion sort is a reasonable choice.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "insertion",
      "bubble",
      "sort"
    ],
    "curriculumAreaIds": [
      "algorithms"
    ]
  },
  {
    "id": "gcse-algorithms-029",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "algorithms",
    "topicTitle": "Algorithms",
    "subtopic": "Trace tables",
    "specificationReferences": [
      "AQA 3.1 Fundamentals of algorithms",
      "OCR J277 2.1 Algorithms",
      "Pearson GCSE Computer Science - Algorithms"
    ],
    "questionType": "trace",
    "difficulty": "advanced",
    "marks": 7,
    "question": "Trace this algorithm for n = 5. Show i, result and the output.\n\nSET result TO 1\nFOR i <- 1 TO n\n  SET result TO result * i\nENDFOR\nOUTPUT result",
    "markPoints": [
      "Initial result 1",
      "i=1 result 1",
      "i=2 result 2",
      "i=3 result 6",
      "i=4 result 24",
      "i=5 result 120",
      "Output 120"
    ],
    "modelAnswer": "The trace gives result values 1, 2, 6, 24 and 120 for i values 1 to 5. The output is 120.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "trace",
      "loop",
      "factorial"
    ],
    "curriculumAreaIds": [
      "algorithms"
    ]
  },
  {
    "id": "gcse-algorithms-030",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "algorithms",
    "topicTitle": "Algorithms",
    "subtopic": "Algorithm design",
    "specificationReferences": [
      "AQA 3.1 Fundamentals of algorithms",
      "OCR J277 2.1 Algorithms",
      "Pearson GCSE Computer Science - Algorithms"
    ],
    "questionType": "algorithm",
    "difficulty": "advanced",
    "marks": 9,
    "question": "A school records the attendance percentage of 30 students. Design pseudocode that inputs all 30 percentages, validates each as 0 to 100 inclusive, counts how many are below 90, calculates the mean of all valid percentages, and outputs both results.",
    "markPoints": [
      "Loop accepts 30 valid values",
      "Inputs attendance value",
      "Validates 0 to 100 inclusive",
      "Invalid values are re-entered/not counted",
      "Maintains total",
      "Tests percentage < 90",
      "Maintains below-90 count",
      "Calculates mean using 30 valid values",
      "Outputs mean and below-90 count"
    ],
    "modelAnswer": "SET total TO 0\nSET below90 TO 0\nSET count TO 0\nWHILE count < 30\n  INPUT attendance\n  IF attendance >= 0 AND attendance <= 100 THEN\n    SET total TO total + attendance\n    IF attendance < 90 THEN SET below90 TO below90 + 1 ENDIF\n    SET count TO count + 1\n  ENDIF\nENDWHILE\nOUTPUT total / 30\nOUTPUT below90",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "algorithm",
      "validation",
      "iteration",
      "average"
    ],
    "curriculumAreaIds": [
      "algorithms"
    ]
  }
];
