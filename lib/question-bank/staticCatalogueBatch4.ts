import type { BankQuestion } from "./bankUtilities";

/**
 * CS Master Batch 4: 90 topic-specific authored questions.
 * Exam-board classifications are provisional pending
 * specification-level academic review.
 */
export const batch4Questions: BankQuestion[] =
[
    {
        "key":  "catalogue-batch4-0001",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-batch4-0001",
                         "questionNumber":  1,
                         "topic":  "Programming",
                         "questionType":  "code-tracing",
                         "commandWord":  "trace",
                         "question":  "Trace Python: x=4; x=x*3; x=x-5. State x.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0001-point-1",
                                                "description":  "4 multiplied by 3 gives 12",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0001-point-2",
                                                "description":  "Subtracting 5 gives 7",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "7",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0002",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-batch4-0002",
                         "questionNumber":  2,
                         "topic":  "Programming",
                         "questionType":  "debugging",
                         "commandWord":  "debug",
                         "question":  "A function uses if age \u003e 18 to allow adults aged 18 and over. Identify and correct the error.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO3",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0002-point-1",
                                                "description":  "The condition incorrectly excludes age 18",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0002-point-2",
                                                "description":  "Replace \u003e with \u003e=",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Use age \u003e= 18.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0003",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-batch4-0003",
                         "questionNumber":  3,
                         "topic":  "Programming",
                         "questionType":  "code-tracing",
                         "commandWord":  "trace",
                         "question":  "Trace Python: total=0; for n in [2,5,3]: total+=n. State total.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0003-point-1",
                                                "description":  "The three values are accumulated",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0003-point-2",
                                                "description":  "The final total is 10",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "10",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0004",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-batch4-0004",
                         "questionNumber":  4,
                         "topic":  "Programming",
                         "questionType":  "code-completion",
                         "commandWord":  "complete",
                         "question":  "Complete the Python condition to accept scores from 0 to 100 inclusive: if ______: print(\"Valid\").",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO3",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0004-point-1",
                                                "description":  "Checks the lower bound inclusively",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0004-point-2",
                                                "description":  "Checks the upper bound inclusively",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "0 \u003c= score \u003c= 100",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0005",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-batch4-0005",
                         "questionNumber":  5,
                         "topic":  "Programming",
                         "questionType":  "debugging",
                         "commandWord":  "debug",
                         "question":  "A loop intended to count from 1 to 5 uses range(1,5). Explain the correction.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO3",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0005-point-1",
                                                "description":  "Python excludes the stop value",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0005-point-2",
                                                "description":  "Using 6 includes 5",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Use range(1,6).",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0006",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-batch4-0006",
                         "questionNumber":  6,
                         "topic":  "Programming",
                         "questionType":  "code-tracing",
                         "commandWord":  "trace",
                         "question":  "Trace Python: values=[3,8,1]; values[1]=5; print(sum(values)).",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0006-point-1",
                                                "description":  "The second item changes from 8 to 5",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0006-point-2",
                                                "description":  "The new sum is 9",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "9",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0007",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-batch4-0007",
                         "questionNumber":  7,
                         "topic":  "Programming",
                         "questionType":  "algorithm-design",
                         "commandWord":  "design",
                         "question":  "Describe an algorithm that counts the even numbers in a list.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO3",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0007-point-1",
                                                "description":  "Initialises and uses a counter",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0007-point-2",
                                                "description":  "Tests divisibility by two and increments correctly",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Initialise count to zero; inspect each item; increment for values divisible by two.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0008",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-batch4-0008",
                         "questionNumber":  8,
                         "topic":  "Programming",
                         "questionType":  "code-tracing",
                         "commandWord":  "trace",
                         "question":  "Trace Python: a=7; b=2; print(a//b).",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0008-point-1",
                                                "description":  "Uses integer floor division",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0008-point-2",
                                                "description":  "Correct result 3",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "3",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0009",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-batch4-0009",
                         "questionNumber":  9,
                         "topic":  "Programming",
                         "questionType":  "debugging",
                         "commandWord":  "debug",
                         "question":  "A program uses if password = storedPassword in Python. Identify the syntax error and correct it.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO3",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0009-point-1",
                                                "description":  "Identifies assignment rather than comparison",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0009-point-2",
                                                "description":  "Uses the equality operator ==",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Use == for comparison.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0010",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-batch4-0010",
                         "questionNumber":  10,
                         "topic":  "Programming",
                         "questionType":  "code-tracing",
                         "commandWord":  "trace",
                         "question":  "Trace Python: word=\"COMPUTER\"; print(word[0:3]).",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0010-point-1",
                                                "description":  "The slice begins at index 0",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0010-point-2",
                                                "description":  "The end index 3 is excluded",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "COM",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0011",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-batch4-0011",
                         "questionNumber":  11,
                         "topic":  "Programming",
                         "questionType":  "code-completion",
                         "commandWord":  "complete",
                         "question":  "Write the Python expression that returns the number of items in a list called scores.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO3",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0011-point-1",
                                                "description":  "Uses the len function",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0011-point-2",
                                                "description":  "Supplies scores as its argument",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "len(scores)",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0012",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-batch4-0012",
                         "questionNumber":  12,
                         "topic":  "Programming",
                         "questionType":  "debugging",
                         "commandWord":  "debug",
                         "question":  "A loop sets total=0 inside every iteration before adding the next score. Explain why the total is incorrect and how to fix it.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO3",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0012-point-1",
                                                "description":  "Resetting total discards earlier additions",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0012-point-2",
                                                "description":  "Move initialisation before the loop",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Initialise total once before the loop.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0013",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-batch4-0013",
                         "questionNumber":  13,
                         "topic":  "Programming",
                         "questionType":  "code-tracing",
                         "commandWord":  "trace",
                         "question":  "Trace Python: x=2; while x\u003c10: x=x*2. State x.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0013-point-1",
                                                "description":  "The values progress 2, 4, 8, 16",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0013-point-2",
                                                "description":  "The loop stops at 16",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "16",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0014",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-batch4-0014",
                         "questionNumber":  14,
                         "topic":  "Programming",
                         "questionType":  "algorithm-design",
                         "commandWord":  "design",
                         "question":  "Describe how to find the largest value in a non-empty list without using max().",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO3",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0014-point-1",
                                                "description":  "Initialises maximum from the first item",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0014-point-2",
                                                "description":  "Updates it when a larger item is found",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Start with the first value; compare every remaining value and replace the stored maximum when larger.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0015",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-batch4-0015",
                         "questionNumber":  15,
                         "topic":  "Programming",
                         "questionType":  "code-tracing",
                         "commandWord":  "trace",
                         "question":  "Trace Python: nums=[1,4,7]; print(nums[-1]).",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0015-point-1",
                                                "description":  "Negative index -1 selects the last item",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0015-point-2",
                                                "description":  "Correct output 7",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "7",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0016",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-batch4-0016",
                         "questionNumber":  16,
                         "topic":  "Programming",
                         "questionType":  "debugging",
                         "commandWord":  "debug",
                         "question":  "A function should return the square of x but contains return x+x. Explain and correct it.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO3",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0016-point-1",
                                                "description":  "Addition doubles x rather than squaring it",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0016-point-2",
                                                "description":  "Multiplication x*x gives the square",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Use return x*x.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0017",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-batch4-0017",
                         "questionNumber":  17,
                         "topic":  "Programming",
                         "questionType":  "code-tracing",
                         "commandWord":  "trace",
                         "question":  "Trace Python: s=\"cat\"; print(s.upper()).",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0017-point-1",
                                                "description":  "The upper method converts letters to uppercase",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0017-point-2",
                                                "description":  "Correct output CAT",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "CAT",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0018",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-batch4-0018",
                         "questionNumber":  18,
                         "topic":  "Programming",
                         "questionType":  "code-completion",
                         "commandWord":  "complete",
                         "question":  "Write a Python condition that is true when n is divisible by 5.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO3",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0018-point-1",
                                                "description":  "Uses remainder modulo 5",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0018-point-2",
                                                "description":  "Compares the remainder with zero",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "n % 5 == 0",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0019",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "A Level",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-batch4-0019",
                         "questionNumber":  19,
                         "topic":  "Programming",
                         "questionType":  "code-tracing",
                         "commandWord":  "trace",
                         "question":  "Trace Python: values=[1,2,3,4]; result=[x*x for x in values if x%2==0]. State result.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0019-point-1",
                                                "description":  "Filters the even values 2 and 4",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0019-point-2",
                                                "description":  "Squares them to obtain 4 and 16",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "[4,16]",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0020",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "A Level",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-batch4-0020",
                         "questionNumber":  20,
                         "topic":  "Programming",
                         "questionType":  "debugging",
                         "commandWord":  "debug",
                         "question":  "A recursive factorial function returns 0 when n==0. Identify the error and correct it.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO3",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0020-point-1",
                                                "description":  "Factorial of zero is one",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0020-point-2",
                                                "description":  "Returning zero would make positive factorial results zero",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "The base case must return 1.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0021",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-batch4-0021",
                         "questionNumber":  21,
                         "topic":  "Algorithms",
                         "questionType":  "code-tracing",
                         "commandWord":  "trace",
                         "question":  "Trace: total=0; FOR i=1 TO 5; total=total+i; NEXT. State total.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0021-point-1",
                                                "description":  "Adds integers 1 through 5",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0021-point-2",
                                                "description":  "Correct total 15",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "15",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0022",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-batch4-0022",
                         "questionNumber":  22,
                         "topic":  "Algorithms",
                         "questionType":  "code-tracing",
                         "commandWord":  "trace",
                         "question":  "A linear search checks [8,3,6,1] for target 6. How many comparisons are needed?",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0022-point-1",
                                                "description":  "Checks 8 then 3",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0022-point-2",
                                                "description":  "Finds 6 on the third comparison",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "3",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0023",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-batch4-0023",
                         "questionNumber":  23,
                         "topic":  "Algorithms",
                         "questionType":  "algorithm-design",
                         "commandWord":  "design",
                         "question":  "Describe an algorithm to determine whether a list contains a given value.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO3",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0023-point-1",
                                                "description":  "Checks each element against the target",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0023-point-2",
                                                "description":  "Returns an appropriate found or not-found result",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Compare the target with each element; return true if found and false after checking all elements.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0024",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-batch4-0024",
                         "questionNumber":  24,
                         "topic":  "Algorithms",
                         "questionType":  "code-tracing",
                         "commandWord":  "trace",
                         "question":  "Trace: x=1; REPEAT x=x+3 UNTIL x\u003e9. State x.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0024-point-1",
                                                "description":  "Values become 4, 7 and 10",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0024-point-2",
                                                "description":  "Stops when 10 exceeds 9",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "10",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0025",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-batch4-0025",
                         "questionNumber":  25,
                         "topic":  "Algorithms",
                         "questionType":  "code-tracing",
                         "commandWord":  "trace",
                         "question":  "Insertion sort processes [5,2,4]. State the list after inserting 2 into the sorted prefix.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0025-point-1",
                                                "description":  "Moves 5 to the right",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0025-point-2",
                                                "description":  "Inserts 2 before 5",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "[2,5,4]",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0026",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-batch4-0026",
                         "questionNumber":  26,
                         "topic":  "Algorithms",
                         "questionType":  "code-tracing",
                         "commandWord":  "trace",
                         "question":  "Bubble sort makes one complete left-to-right pass over [4,1,3]. State the list after the pass.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0026-point-1",
                                                "description":  "Swaps 4 with 1",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0026-point-2",
                                                "description":  "Then swaps 4 with 3",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "[1,3,4]",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0027",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-batch4-0027",
                         "questionNumber":  27,
                         "topic":  "Algorithms",
                         "questionType":  "algorithm-design",
                         "commandWord":  "design",
                         "question":  "Describe how to count occurrences of a target value in an array.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO3",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0027-point-1",
                                                "description":  "Initialises and maintains a counter",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0027-point-2",
                                                "description":  "Checks equality and increments for matches",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Initialise a counter; examine each element and increment when equal to the target.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0028",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-batch4-0028",
                         "questionNumber":  28,
                         "topic":  "Algorithms",
                         "questionType":  "code-tracing",
                         "commandWord":  "trace",
                         "question":  "A binary search checks the middle value 12 in sorted [2,5,8,12,17,21,30] for target 21. Which half is searched next?",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0028-point-1",
                                                "description":  "21 is greater than 12",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0028-point-2",
                                                "description":  "The lower half and middle item are discarded",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "The values to the right of 12.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0029",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-batch4-0029",
                         "questionNumber":  29,
                         "topic":  "Algorithms",
                         "questionType":  "code-tracing",
                         "commandWord":  "trace",
                         "question":  "Trace: count=0; FOR i=2 TO 8 STEP 2; count=count+1; NEXT. State count.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0029-point-1",
                                                "description":  "Loop values are 2, 4, 6 and 8",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0029-point-2",
                                                "description":  "Four iterations occur",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "4",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0030",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-batch4-0030",
                         "questionNumber":  30,
                         "topic":  "Algorithms",
                         "questionType":  "algorithm-design",
                         "commandWord":  "design",
                         "question":  "Describe an algorithm to calculate the mean of ten input numbers.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO3",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0030-point-1",
                                                "description":  "Accumulates all ten inputs",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0030-point-2",
                                                "description":  "Divides the total by ten",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Read ten numbers and accumulate their total; divide by ten.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0031",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-batch4-0031",
                         "questionNumber":  31,
                         "topic":  "Algorithms",
                         "questionType":  "code-tracing",
                         "commandWord":  "trace",
                         "question":  "Trace: x=20; WHILE x\u003e5; x=x-6; ENDWHILE. State x.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0031-point-1",
                                                "description":  "Values become 14, 8 and 2",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0031-point-2",
                                                "description":  "Stops when x is no longer greater than 5",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "2",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0032",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-batch4-0032",
                         "questionNumber":  32,
                         "topic":  "Algorithms",
                         "questionType":  "algorithm-design",
                         "commandWord":  "design",
                         "question":  "Describe how to reverse the order of an array into a second array.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO3",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0032-point-1",
                                                "description":  "Traverses from the last element backwards",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0032-point-2",
                                                "description":  "Places elements into the new array in reverse order",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Read the original array from its final index to its first and append each item to the result.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0033",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "A Level",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-batch4-0033",
                         "questionNumber":  33,
                         "topic":  "Algorithms",
                         "questionType":  "code-tracing",
                         "commandWord":  "trace",
                         "question":  "For edges A-B weight 3, A-C weight 8 and B-C weight 2, calculate the shortest path from A to C.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0033-point-1",
                                                "description":  "Recognises the route through B",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0033-point-2",
                                                "description":  "Calculates 3+2=5, less than 8",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "A-B-C with total weight 5.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0034",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "A Level",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-batch4-0034",
                         "questionNumber":  34,
                         "topic":  "Algorithms",
                         "questionType":  "algorithm-design",
                         "commandWord":  "design",
                         "question":  "Describe how breadth-first search avoids visiting the same graph vertex repeatedly.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO3",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0034-point-1",
                                                "description":  "Tracks discovered vertices",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0034-point-2",
                                                "description":  "Does not enqueue already discovered vertices again",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Maintain a visited set and mark vertices when discovered before enqueueing undiscovered neighbours.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0035",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "A Level",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-batch4-0035",
                         "questionNumber":  35,
                         "topic":  "Algorithms",
                         "questionType":  "code-tracing",
                         "commandWord":  "trace",
                         "question":  "A binary search starts with 32 sorted items. What is the maximum number of midpoint checks needed for a successful search?",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0035-point-1",
                                                "description":  "Each unsuccessful comparison approximately halves the candidates",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0035-point-2",
                                                "description":  "At most six midpoint checks for 32 items",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "6",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0036",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-batch4-0036",
                         "questionNumber":  36,
                         "topic":  "Binary representation and arithmetic",
                         "questionType":  "conversion",
                         "commandWord":  "calculate",
                         "question":  "Convert decimal 86 into unsigned 8-bit binary.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0036-point-1",
                                                "description":  "Uses 64+16+4+2",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0036-point-2",
                                                "description":  "Correct binary 01010110",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "01010110",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0037",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-batch4-0037",
                         "questionNumber":  37,
                         "topic":  "Binary representation and arithmetic",
                         "questionType":  "worked-calculation",
                         "commandWord":  "calculate",
                         "question":  "Add 00101101 and 00010111 as unsigned 8-bit binary.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0037-point-1",
                                                "description":  "45+23=68 or correct binary working",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0037-point-2",
                                                "description":  "Correct result 01000100",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "01000100",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0038",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-batch4-0038",
                         "questionNumber":  38,
                         "topic":  "Hexadecimal",
                         "questionType":  "conversion",
                         "commandWord":  "calculate",
                         "question":  "Convert hexadecimal A7 to decimal.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0038-point-1",
                                                "description":  "Calculates 10 times 16 plus 7",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0038-point-2",
                                                "description":  "Correct result 167",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "167",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0039",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-batch4-0039",
                         "questionNumber":  39,
                         "topic":  "Data representation",
                         "questionType":  "calculation",
                         "commandWord":  "calculate",
                         "question":  "Calculate the maximum unsigned value representable using 10 bits.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0039-point-1",
                                                "description":  "Uses 2 to the power of 10",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0039-point-2",
                                                "description":  "Subtracts one to obtain 1023",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "1023",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0040",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-batch4-0040",
                         "questionNumber":  40,
                         "topic":  "Image representation",
                         "questionType":  "worked-calculation",
                         "commandWord":  "calculate",
                         "question":  "Calculate pixel-data size in bytes for a 100 by 80 bitmap at 4 bits per pixel. Ignore metadata.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0040-point-1",
                                                "description":  "100 times 80 times 4 gives 32000 bits",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0040-point-2",
                                                "description":  "Divides by 8 to obtain 4000 bytes",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "4000 bytes",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0041",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-batch4-0041",
                         "questionNumber":  41,
                         "topic":  "Data representation",
                         "questionType":  "conversion",
                         "commandWord":  "calculate",
                         "question":  "Convert binary 11001010 to decimal as an unsigned integer.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0041-point-1",
                                                "description":  "Uses 128+64+8+2",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0041-point-2",
                                                "description":  "Correct total 202",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "202",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0042",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-batch4-0042",
                         "questionNumber":  42,
                         "topic":  "Data representation",
                         "questionType":  "conversion",
                         "commandWord":  "calculate",
                         "question":  "Convert decimal 125 to hexadecimal.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0042-point-1",
                                                "description":  "125 is 7 times 16 plus 13",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0042-point-2",
                                                "description":  "Hexadecimal result 7D",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "7D",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0043",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-batch4-0043",
                         "questionNumber":  43,
                         "topic":  "Data representation",
                         "questionType":  "worked-calculation",
                         "commandWord":  "calculate",
                         "question":  "Calculate 10110100 shifted logically right by two places.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0043-point-1",
                                                "description":  "Moves bits two places right and fills with zeros",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0043-point-2",
                                                "description":  "Correct result 00101101",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "00101101",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0044",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-batch4-0044",
                         "questionNumber":  44,
                         "topic":  "Sound representation",
                         "questionType":  "calculation",
                         "commandWord":  "calculate",
                         "question":  "Calculate uncompressed mono audio size in bits for 1000 samples at 16 bits per sample.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0044-point-1",
                                                "description":  "Multiplies samples by bits per sample",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0044-point-2",
                                                "description":  "Correct total 16000 bits",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "16000 bits",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0045",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-batch4-0045",
                         "questionNumber":  45,
                         "topic":  "Image representation",
                         "questionType":  "calculation",
                         "commandWord":  "calculate",
                         "question":  "Calculate the number of colours available with a 6-bit colour depth.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0045-point-1",
                                                "description":  "Uses two possible states per bit",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0045-point-2",
                                                "description":  "Calculates 2 to the power of 6 equals 64",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "64",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0046",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-batch4-0046",
                         "questionNumber":  46,
                         "topic":  "Data representation",
                         "questionType":  "conversion",
                         "commandWord":  "calculate",
                         "question":  "Convert unsigned binary 11110000 to hexadecimal.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0046-point-1",
                                                "description":  "Splits into 1111 and 0000",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0046-point-2",
                                                "description":  "Converts to F and 0",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "F0",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0047",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-batch4-0047",
                         "questionNumber":  47,
                         "topic":  "Data representation",
                         "questionType":  "conversion",
                         "commandWord":  "calculate",
                         "question":  "Convert hexadecimal 2B to unsigned 8-bit binary.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0047-point-1",
                                                "description":  "Converts 2 to 0010",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0047-point-2",
                                                "description":  "Converts B to 1011",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "00101011",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0048",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-batch4-0048",
                         "questionNumber":  48,
                         "topic":  "Data representation",
                         "questionType":  "worked-calculation",
                         "commandWord":  "calculate",
                         "question":  "Represent negative 5 in 8-bit two\u0027s complement.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0048-point-1",
                                                "description":  "Starts from positive 5 or applies inversion",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0048-point-2",
                                                "description":  "Correct two\u0027s-complement result 11111011",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "11111011",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0049",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "A Level",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-batch4-0049",
                         "questionNumber":  49,
                         "topic":  "Data representation",
                         "questionType":  "worked-calculation",
                         "commandWord":  "calculate",
                         "question":  "Represent -13 in 8-bit two\u0027s complement.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0049-point-1",
                                                "description":  "Correctly inverts 00001101 and adds one",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0049-point-2",
                                                "description":  "Correct result 11110011",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "11110011",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0050",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "A Level",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-batch4-0050",
                         "questionNumber":  50,
                         "topic":  "Data representation",
                         "questionType":  "calculation",
                         "commandWord":  "calculate",
                         "question":  "Calculate the unsigned decimal value of hexadecimal 1AF.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0050-point-1",
                                                "description":  "Calculates 256+160+15",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0050-point-2",
                                                "description":  "Correct total 431",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "431",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0051",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-batch4-0051",
                         "questionNumber":  51,
                         "topic":  "Boolean logic",
                         "questionType":  "truth-table",
                         "commandWord":  "complete",
                         "question":  "For A=1 and B=0, calculate A AND B and A OR B.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0051-point-1",
                                                "description":  "Correct AND output 0",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0051-point-2",
                                                "description":  "Correct OR output 1",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "AND=0; OR=1.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0052",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-batch4-0052",
                         "questionNumber":  52,
                         "topic":  "Boolean logic",
                         "questionType":  "truth-table",
                         "commandWord":  "complete",
                         "question":  "For A=0 and B=1, calculate NOT A AND B.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0052-point-1",
                                                "description":  "NOT A becomes 1",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0052-point-2",
                                                "description":  "1 AND 1 gives 1",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "1",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0053",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-batch4-0053",
                         "questionNumber":  53,
                         "topic":  "Boolean logic",
                         "questionType":  "truth-table",
                         "commandWord":  "complete",
                         "question":  "For A=1 and B=1, calculate A XOR B.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0053-point-1",
                                                "description":  "XOR is true only for unequal inputs",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0053-point-2",
                                                "description":  "Equal inputs produce 0",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "0",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0054",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-batch4-0054",
                         "questionNumber":  54,
                         "topic":  "Boolean logic",
                         "questionType":  "truth-table",
                         "commandWord":  "complete",
                         "question":  "For A=0 and B=0, calculate A NAND B.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0054-point-1",
                                                "description":  "AND of zero and zero is zero",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0054-point-2",
                                                "description":  "NOT of zero gives one",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "1",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0055",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-batch4-0055",
                         "questionNumber":  55,
                         "topic":  "Boolean logic",
                         "questionType":  "truth-table",
                         "commandWord":  "complete",
                         "question":  "For A=1 and B=0, calculate A NOR B.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0055-point-1",
                                                "description":  "OR of one and zero is one",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0055-point-2",
                                                "description":  "NOT of one gives zero",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "0",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0056",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-batch4-0056",
                         "questionNumber":  56,
                         "topic":  "Boolean logic",
                         "questionType":  "truth-table",
                         "commandWord":  "complete",
                         "question":  "For A=1, B=0 and C=1, calculate (A AND B) OR C.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0056-point-1",
                                                "description":  "A AND B equals zero",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0056-point-2",
                                                "description":  "Zero OR one equals one",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "1",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0057",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-batch4-0057",
                         "questionNumber":  57,
                         "topic":  "Boolean logic",
                         "questionType":  "truth-table",
                         "commandWord":  "complete",
                         "question":  "For A=0 and B=1, calculate NOT(A OR B).",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0057-point-1",
                                                "description":  "A OR B equals one",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0057-point-2",
                                                "description":  "NOT one equals zero",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "0",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0058",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-batch4-0058",
                         "questionNumber":  58,
                         "topic":  "Boolean logic",
                         "questionType":  "truth-table",
                         "commandWord":  "complete",
                         "question":  "For A=1 and B=0, calculate (NOT A) OR (NOT B).",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0058-point-1",
                                                "description":  "NOT A is zero and NOT B is one",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0058-point-2",
                                                "description":  "OR produces one",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "1",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0059",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "A Level",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-batch4-0059",
                         "questionNumber":  59,
                         "topic":  "Boolean algebra",
                         "questionType":  "calculation",
                         "commandWord":  "complete",
                         "question":  "Simplify A AND (A OR B).",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0059-point-1",
                                                "description":  "Applies the absorption identity",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0059-point-2",
                                                "description":  "Correct simplified expression A",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "A",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0060",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "A Level",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-batch4-0060",
                         "questionNumber":  60,
                         "topic":  "Boolean algebra",
                         "questionType":  "calculation",
                         "commandWord":  "complete",
                         "question":  "Simplify NOT(A AND B) using De Morgan\u0027s law.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0060-point-1",
                                                "description":  "Negates both variables",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0060-point-2",
                                                "description":  "Changes AND to OR",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "(NOT A) OR (NOT B)",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0061",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-batch4-0061",
                         "questionNumber":  61,
                         "topic":  "Computer networks",
                         "questionType":  "scenario-application",
                         "commandWord":  "explain",
                         "question":  "A user can reach a server by IP address but not by hostname. Explain the likely service failure.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0061-point-1",
                                                "description":  "DNS translates hostnames to IP addresses",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0061-point-2",
                                                "description":  "Failure can prevent hostname access while direct IP access works",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "DNS resolution is failing.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0062",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-batch4-0062",
                         "questionNumber":  62,
                         "topic":  "Cybersecurity",
                         "questionType":  "scenario-application",
                         "commandWord":  "explain",
                         "question":  "A school shares one administrator account among staff. Explain two security disadvantages.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0062-point-1",
                                                "description":  "Shared use makes actions harder to attribute",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0062-point-2",
                                                "description":  "Compromise grants elevated access",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Accountability is reduced and compromise exposes elevated privileges.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0063",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-batch4-0063",
                         "questionNumber":  63,
                         "topic":  "Databases and SQL",
                         "questionType":  "scenario-application",
                         "commandWord":  "explain",
                         "question":  "A Students table uses StudentID as its primary key. Explain why names alone are unsuitable as a primary key.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0063-point-1",
                                                "description":  "Different students may have the same name",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0063-point-2",
                                                "description":  "Names can change and are not reliable identifiers",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Names can be duplicated and may change.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0064",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-batch4-0064",
                         "questionNumber":  64,
                         "topic":  "Computer networks",
                         "questionType":  "scenario-application",
                         "commandWord":  "explain",
                         "question":  "A school installs a wireless access point. Explain its role in the network.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0064-point-1",
                                                "description":  "Provides a wireless connection for devices",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0064-point-2",
                                                "description":  "Bridges wireless traffic to the LAN",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "It allows wireless devices to connect to the local network.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0065",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-batch4-0065",
                         "questionNumber":  65,
                         "topic":  "Cybersecurity",
                         "questionType":  "scenario-application",
                         "commandWord":  "explain",
                         "question":  "A user downloads a program from an unknown website. Explain two precautions before installation.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0065-point-1",
                                                "description":  "Check the source or publisher is trustworthy",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0065-point-2",
                                                "description":  "Use updated malware protection to scan the download",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Verify the source and scan the file using updated security software.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0066",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-batch4-0066",
                         "questionNumber":  66,
                         "topic":  "Databases and SQL",
                         "questionType":  "scenario-application",
                         "commandWord":  "explain",
                         "question":  "A database query should return only products costing less than 20. Explain how a WHERE clause helps.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0066-point-1",
                                                "description":  "WHERE specifies the filtering condition",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0066-point-2",
                                                "description":  "Only records satisfying price \u003c 20 are returned",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "It filters rows using a price comparison.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0067",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-batch4-0067",
                         "questionNumber":  67,
                         "topic":  "Computer networks",
                         "questionType":  "scenario-application",
                         "commandWord":  "explain",
                         "question":  "A company sends confidential information over public Wi-Fi. Explain why TLS is useful.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0067-point-1",
                                                "description":  "Encrypts transmitted data",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0067-point-2",
                                                "description":  "Certificate validation helps authenticate the server",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "TLS encrypts data in transit and helps authenticate the destination.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0068",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-batch4-0068",
                         "questionNumber":  68,
                         "topic":  "Cybersecurity",
                         "questionType":  "scenario-application",
                         "commandWord":  "explain",
                         "question":  "An attacker repeatedly guesses account passwords. Explain two controls that reduce this risk.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0068-point-1",
                                                "description":  "Rate limiting slows or blocks repeated guesses",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0068-point-2",
                                                "description":  "MFA requires an additional factor",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Rate limiting restricts repeated attempts and multi-factor authentication adds another factor.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0069",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-batch4-0069",
                         "questionNumber":  69,
                         "topic":  "Databases and SQL",
                         "questionType":  "scenario-application",
                         "commandWord":  "explain",
                         "question":  "A table stores the same customer address in every order row. Explain a problem caused by this design.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0069-point-1",
                                                "description":  "The same information is duplicated",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0069-point-2",
                                                "description":  "Updates may leave inconsistent copies",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Repeated addresses may become inconsistent when updated.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0070",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "A Level",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-batch4-0070",
                         "questionNumber":  70,
                         "topic":  "Databases",
                         "questionType":  "scenario-application",
                         "commandWord":  "explain",
                         "question":  "An Orders table contains CustomerID referencing Customers. Explain how referential integrity protects the database.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0070-point-1",
                                                "description":  "The foreign key references the customer key",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0070-point-2",
                                                "description":  "The constraint prevents invalid references",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "It prevents references to nonexistent customers where the constraint is enforced.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0071",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "A Level",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-batch4-0071",
                         "questionNumber":  71,
                         "topic":  "Networking",
                         "questionType":  "scenario-application",
                         "commandWord":  "explain",
                         "question":  "A reliable data transfer loses a TCP segment. Explain how delivery can recover.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0071-point-1",
                                                "description":  "Acknowledgements indicate receipt",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0071-point-2",
                                                "description":  "Missing data can be retransmitted",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "The receiver acknowledges received data and the sender retransmits missing data.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0072",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "A Level",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-batch4-0072",
                         "questionNumber":  72,
                         "topic":  "Cybersecurity",
                         "questionType":  "scenario-application",
                         "commandWord":  "explain",
                         "question":  "A web application builds SQL statements by joining user input into query text. Explain a safer approach.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0072-point-1",
                                                "description":  "Parameterisation separates values from SQL commands",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0072-point-2",
                                                "description":  "This reduces SQL injection risk",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Use parameterised queries to keep data separate from SQL syntax.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0073",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "A Level",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-batch4-0073",
                         "questionNumber":  73,
                         "topic":  "Databases",
                         "questionType":  "scenario-application",
                         "commandWord":  "explain",
                         "question":  "Two transactions update the same bank balance concurrently. Explain why transaction isolation matters.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0073-point-1",
                                                "description":  "Concurrent operations may interfere",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0073-point-2",
                                                "description":  "Isolation prevents inappropriate visibility or conflicting updates",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Isolation controls interference between concurrent transactions to prevent inconsistent outcomes.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0074",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "A Level",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-batch4-0074",
                         "questionNumber":  74,
                         "topic":  "Networking",
                         "questionType":  "scenario-application",
                         "commandWord":  "explain",
                         "question":  "A company divides its network into separate VLANs. Explain one benefit and one limitation.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0074-point-1",
                                                "description":  "VLANs logically separate broadcast domains",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0074-point-2",
                                                "description":  "Communication between VLANs requires routing",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "VLANs separate broadcast domains but inter-VLAN communication requires routing or layer-three switching.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0075",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "A Level",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-batch4-0075",
                         "questionNumber":  75,
                         "topic":  "Databases",
                         "questionType":  "scenario-application",
                         "commandWord":  "explain",
                         "question":  "A query repeatedly joins large tables. Explain how an appropriate index may improve performance.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO2",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0075-point-1",
                                                "description":  "An index can speed suitable lookups",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0075-point-2",
                                                "description":  "Indexes use storage or impose update overhead",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "An index can reduce the rows examined, although it consumes storage and must be maintained.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0076",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-batch4-0076",
                         "questionNumber":  76,
                         "topic":  "Ethical, legal and environmental impacts",
                         "questionType":  "evaluate",
                         "commandWord":  "evaluate",
                         "question":  "Evaluate replacing working school laptops every two years instead of extending their useful life.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO3",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0076-point-1",
                                                "description":  "Considers a benefit of newer hardware",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0076-point-2",
                                                "description":  "Considers environmental or financial costs and reaches a reasoned judgement",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "New devices may improve performance and support but increase purchasing costs and electronic waste.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0077",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-batch4-0077",
                         "questionNumber":  77,
                         "topic":  "Cybersecurity",
                         "questionType":  "evaluate",
                         "commandWord":  "evaluate",
                         "question":  "Evaluate using biometric authentication instead of passwords for school devices.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO3",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0077-point-1",
                                                "description":  "Explains a practical security or usability advantage",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0077-point-2",
                                                "description":  "Explains a limitation and reaches a justified conclusion",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Biometrics can be convenient but introduce privacy and recovery concerns; combining factors may be preferable.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0078",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-batch4-0078",
                         "questionNumber":  78,
                         "topic":  "Computer networks",
                         "questionType":  "evaluate",
                         "commandWord":  "evaluate",
                         "question":  "Evaluate using Wi-Fi rather than Ethernet for a school computer room.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO3",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0078-point-1",
                                                "description":  "Explains a benefit of wireless access",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0078-point-2",
                                                "description":  "Explains a wired-network advantage and reaches a judgement",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Wi-Fi offers mobility and easier installation but wired connections can provide predictable performance and fewer radio-interference issues.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0079",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-batch4-0079",
                         "questionNumber":  79,
                         "topic":  "Memory and storage",
                         "questionType":  "evaluate",
                         "commandWord":  "evaluate",
                         "question":  "Evaluate cloud storage rather than local storage for a small business.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO3",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0079-point-1",
                                                "description":  "Explains a cloud-storage benefit",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0079-point-2",
                                                "description":  "Explains a risk or limitation and reaches a justified choice",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Cloud storage supports remote access and managed redundancy but depends on connectivity and provider security.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0080",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-batch4-0080",
                         "questionNumber":  80,
                         "topic":  "Software development and testing",
                         "questionType":  "evaluate",
                         "commandWord":  "evaluate",
                         "question":  "Evaluate the importance of automated tests for an application updated every week.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO3",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0080-point-1",
                                                "description":  "Explains the value of repeated automated checking",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0080-point-2",
                                                "description":  "Recognises a limitation and reaches a reasoned judgement",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Automated regression tests can identify repeated faults quickly but require maintenance and cannot cover every risk.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0081",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-batch4-0081",
                         "questionNumber":  81,
                         "topic":  "Cybersecurity",
                         "questionType":  "evaluate",
                         "commandWord":  "evaluate",
                         "question":  "Evaluate allowing staff to use personal devices to access school data.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO3",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0081-point-1",
                                                "description":  "Explains a flexibility or cost benefit",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0081-point-2",
                                                "description":  "Explains a security or management risk and reaches a judgement",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Personal devices may increase flexibility but introduce device-management and data-protection risks.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0082",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-batch4-0082",
                         "questionNumber":  82,
                         "topic":  "Data compression",
                         "questionType":  "evaluate",
                         "commandWord":  "evaluate",
                         "question":  "Evaluate using lossy compression for an archive of important scanned legal documents.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO3",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0082-point-1",
                                                "description":  "Explains a storage benefit of lossy compression",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0082-point-2",
                                                "description":  "Explains information-loss risk and recommends an appropriate choice",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Lossy compression saves space but may permanently remove detail; lossless formats are safer when exact reproduction matters.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0083",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-batch4-0083",
                         "questionNumber":  83,
                         "topic":  "Programming",
                         "questionType":  "evaluate",
                         "commandWord":  "evaluate",
                         "question":  "Evaluate using a graphical programming environment rather than a text-based language for beginners.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO3",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0083-point-1",
                                                "description":  "Explains a benefit for beginners",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0083-point-2",
                                                "description":  "Explains a limitation and reaches a justified judgement",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Blocks can reduce syntax difficulties but may limit exposure to text-based programming skills and advanced constructs.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0084",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "GCSE",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-batch4-0084",
                         "questionNumber":  84,
                         "topic":  "Computer networks",
                         "questionType":  "evaluate",
                         "commandWord":  "evaluate",
                         "question":  "Evaluate using a client-server network instead of a peer-to-peer network for a large school.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO3",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0084-point-1",
                                                "description":  "Explains a central-management benefit",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0084-point-2",
                                                "description":  "Explains a cost or dependency and reaches a judgement",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Central management and authentication support a large school, but servers require administration and resources.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0085",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "A Level",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-batch4-0085",
                         "questionNumber":  85,
                         "topic":  "Algorithms",
                         "questionType":  "evaluate",
                         "commandWord":  "evaluate",
                         "question":  "Evaluate choosing a hash table instead of a balanced binary search tree for frequent key lookups.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO3",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0085-point-1",
                                                "description":  "Compares expected lookup efficiency",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0085-point-2",
                                                "description":  "Discusses ordering or worst-case tradeoffs and reaches a judgement",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Hash tables often provide expected constant-time lookup but do not naturally maintain key order; balanced trees support ordered traversal with logarithmic operations.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0086",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "A Level",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-batch4-0086",
                         "questionNumber":  86,
                         "topic":  "Software development",
                         "questionType":  "evaluate",
                         "commandWord":  "evaluate",
                         "question":  "Evaluate test-driven development for a team building safety-critical software.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO3",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0086-point-1",
                                                "description":  "Explains a benefit of tests written early",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0086-point-2",
                                                "description":  "Recognises limits of tests and reaches a justified judgement",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Early tests can clarify requirements and support regression checks but cannot replace independent validation or wider assurance.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0087",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "A Level",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-batch4-0087",
                         "questionNumber":  87,
                         "topic":  "Data structures",
                         "questionType":  "evaluate",
                         "commandWord":  "evaluate",
                         "question":  "Evaluate an adjacency matrix versus an adjacency list for a sparse graph.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO3",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0087-point-1",
                                                "description":  "Explains sparse-graph space benefits of lists",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0087-point-2",
                                                "description":  "Explains matrix lookup benefits or memory costs and reaches a judgement",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Lists generally save space for sparse graphs; matrices offer constant-time edge existence checks but use quadratic space.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0088",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "A Level",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-batch4-0088",
                         "questionNumber":  88,
                         "topic":  "Computer organisation",
                         "questionType":  "evaluate",
                         "commandWord":  "evaluate",
                         "question":  "Evaluate increasing CPU clock speed rather than adding cores for a mixed workload.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO3",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0088-point-1",
                                                "description":  "Explains sequential versus parallel workload effects",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0088-point-2",
                                                "description":  "Considers bottlenecks or constraints and reaches a justified choice",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Higher clock speed may benefit sequential work while additional cores help parallel workloads; memory and thermal constraints also matter.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0089",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "A Level",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-batch4-0089",
                         "questionNumber":  89,
                         "topic":  "Databases",
                         "questionType":  "evaluate",
                         "commandWord":  "evaluate",
                         "question":  "Evaluate using a relational database instead of a document database for a school management system.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO3",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0089-point-1",
                                                "description":  "Compares structured relationships or transaction needs",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0089-point-2",
                                                "description":  "Considers flexibility or access patterns and reaches a judgement",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Relational databases support structured relationships and transactions, while document models may suit flexible records; the choice depends on access patterns and consistency requirements.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-batch4-0090",
        "sourceId":  "cs-master-batch4",
        "sourceTitle":  "CS Master topic-specific catalogue",
        "qualification":  "A Level",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-batch4-0090",
                         "questionNumber":  90,
                         "topic":  "Networking",
                         "questionType":  "evaluate",
                         "commandWord":  "evaluate",
                         "question":  "Evaluate using TCP rather than UDP for live video communication.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "higher",
                         "assessmentObjective":  "AO3",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-batch4-0090-point-1",
                                                "description":  "Explains reliability versus latency tradeoffs",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-batch4-0090-point-2",
                                                "description":  "Relates the tradeoff to live video and reaches a judgement",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "TCP provides reliable ordered delivery but retransmission can increase latency; UDP avoids transport-level retransmission and lets the application control loss handling.",
                         "examinerGuidance":  [
                                                  "Award one mark for each valid marking point.",
                                                  "Accept technically equivalent answers."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    }
];
