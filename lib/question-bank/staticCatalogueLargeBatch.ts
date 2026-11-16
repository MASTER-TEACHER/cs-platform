import type { BankQuestion } from "./bankUtilities";

/**
 * CS Master authored catalogue: consolidated expansion.
 * Question text, marking points and model answers are stored locally.
 * Exam-board mappings require teacher specification review.
 */
export const largeBatchQuestions: BankQuestion[] =
[
    {
        "key":  "catalogue-large-0001",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-large-0001",
                         "questionNumber":  1,
                         "topic":  "CPU architecture",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why the cache can reduce average memory access time.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0001-point-1",
                                                "description":  "Cache holds frequently or recently used data and instructions.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0001-point-2",
                                                "description":  "Cache access is generally faster than accessing main memory.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Frequently used instructions and data can be held close to the CPU, avoiding some slower RAM accesses.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0002",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-large-0002",
                         "questionNumber":  2,
                         "topic":  "CPU architecture",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "A processor has four cores rather than two. Explain why a program may not run twice as fast.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0002-point-1",
                                                "description":  "Additional cores can execute suitable work concurrently.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0002-point-2",
                                                "description":  "Sequential operations or other bottlenecks limit the speedup.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Only work that can execute in parallel can benefit fully from additional cores; sequential work and other bottlenecks remain.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0003",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-large-0003",
                         "questionNumber":  3,
                         "topic":  "Memory and storage",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why a laptop uses ROM or firmware storage during startup.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0003-point-1",
                                                "description":  "Firmware is retained without power.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0003-point-2",
                                                "description":  "Startup instructions initialise hardware or begin the boot process.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Non-volatile firmware holds startup instructions that are available before the operating system has loaded.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0004",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-large-0004",
                         "questionNumber":  4,
                         "topic":  "Memory and storage",
                         "questionType":  "compare",
                         "commandWord":  "compare",
                         "question":  "Compare the suitability of an SSD and a magnetic hard disk for a frequently transported laptop.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0004-point-1",
                                                "description":  "An SSD has no moving parts and is more resistant to physical shocks.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0004-point-2",
                                                "description":  "A hard disk may offer lower cost per unit of storage.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "An SSD has no moving mechanical parts and generally offers better shock resistance, while a hard disk may provide cheaper capacity.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0005",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-large-0005",
                         "questionNumber":  5,
                         "topic":  "Algorithms",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why merge sort uses a divide-and-conquer approach.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0005-point-1",
                                                "description":  "The list is divided into smaller subproblems.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0005-point-2",
                                                "description":  "Sorted sublists are merged to form the result.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "It divides the list into smaller sublists and merges sorted results to produce the ordered list.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0006",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-large-0006",
                         "questionNumber":  6,
                         "topic":  "Algorithms",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "A search checks each item until a match is found. Explain its worst-case behaviour for a list of n items.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0006-point-1",
                                                "description":  "The search may inspect every item.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0006-point-2",
                                                "description":  "The worst-case number of checks grows linearly with n.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "A linear search may inspect all n items if the target is last or absent.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0007",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-large-0007",
                         "questionNumber":  7,
                         "topic":  "Programming",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why a function should return a value instead of always printing it.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0007-point-1",
                                                "description":  "A return passes a result back to the caller.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0007-point-2",
                                                "description":  "The caller can reuse the result in further computation.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Returning a value lets other program statements store or process the result, whereas printing only displays it.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0008",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-large-0008",
                         "questionNumber":  8,
                         "topic":  "Programming",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "A program stores test scores in a list. Explain why iteration is useful when finding their average.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0008-point-1",
                                                "description":  "Iteration processes each score systematically.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0008-point-2",
                                                "description":  "The total can be divided by the number of scores.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "A loop can visit each score and accumulate a total before dividing by the number of scores.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0009",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-large-0009",
                         "questionNumber":  9,
                         "topic":  "Boolean logic",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why an alarm controlled by NOT doorClosed activates when doorClosed is false.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0009-point-1",
                                                "description":  "NOT inverts the Boolean input.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0009-point-2",
                                                "description":  "A false doorClosed value produces true.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "NOT reverses a Boolean input, so a false closed-state produces a true alarm condition.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0010",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-large-0010",
                         "questionNumber":  10,
                         "topic":  "Binary representation and arithmetic",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain how a left shift by one affects an unsigned binary integer when no significant bit is lost.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0010-point-1",
                                                "description":  "Bits move one place towards higher significance.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0010-point-2",
                                                "description":  "The represented value doubles when no overflow occurs.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Each place value doubles, so the represented integer doubles.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0011",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-large-0011",
                         "questionNumber":  11,
                         "topic":  "Hexadecimal",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why hexadecimal is convenient for displaying long binary values.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0011-point-1",
                                                "description":  "One hexadecimal digit represents four bits.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0011-point-2",
                                                "description":  "Hexadecimal shortens the displayed representation.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Each hexadecimal digit corresponds exactly to four bits, giving a shorter human-readable representation.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0012",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-large-0012",
                         "questionNumber":  12,
                         "topic":  "Image representation",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "A bitmap uses 16 bits per pixel. Explain the effect of reducing it to 8 bits per pixel without changing its dimensions.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0012-point-1",
                                                "description":  "Storage per pixel is halved.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0012-point-2",
                                                "description":  "The number of representable colours is reduced.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "The uncompressed pixel data requires half as many bits but supports fewer distinct colour values.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0013",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-large-0013",
                         "questionNumber":  13,
                         "topic":  "Sound representation",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why increasing bit depth can improve the quality of sampled audio.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0013-point-1",
                                                "description":  "Higher bit depth permits more amplitude levels.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0013-point-2",
                                                "description":  "It can reduce quantisation error.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "More quantisation levels are available, reducing quantisation error for an appropriate recording.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0014",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-large-0014",
                         "questionNumber":  14,
                         "topic":  "Character representation",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why a text file containing accented characters might not be represented correctly using a restricted character set.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0014-point-1",
                                                "description":  "The character set may lack required characters.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0014-point-2",
                                                "description":  "Unsupported characters may be replaced or corrupted.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "The character set may not contain every required symbol, so characters may be lost or substituted.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0015",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-large-0015",
                         "questionNumber":  15,
                         "topic":  "Data compression",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why lossless compression is preferable for a source-code file.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0015-point-1",
                                                "description":  "Lossless compression restores the exact original data.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0015-point-2",
                                                "description":  "Changes to source-code characters could change program behaviour.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "The original characters must be recovered exactly because changing them may alter or break the program.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0016",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-large-0016",
                         "questionNumber":  16,
                         "topic":  "Databases and SQL",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why a WHERE clause is useful in a database query.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0016-point-1",
                                                "description":  "WHERE applies a selection condition.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0016-point-2",
                                                "description":  "Only matching records are returned.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "It restricts returned rows to those satisfying a specified condition.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0017",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-large-0017",
                         "questionNumber":  17,
                         "topic":  "Software development and testing",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain the purpose of regression testing after a bug has been fixed.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0017-point-1",
                                                "description":  "Existing functionality is tested again.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0017-point-2",
                                                "description":  "It detects faults introduced by changes.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Previously working functionality is retested to detect unintended effects of the modification.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0018",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-large-0018",
                         "questionNumber":  18,
                         "topic":  "Defensive design",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why range validation alone cannot guarantee that an entered age is truthful.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0018-point-1",
                                                "description":  "Range validation checks permitted numerical limits.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0018-point-2",
                                                "description":  "A value inside those limits can still be factually incorrect.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "A plausible value may still be false because validation checks format or constraints rather than factual accuracy.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0019",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-large-0019",
                         "questionNumber":  19,
                         "topic":  "Computer networks",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why a router normally uses IP addresses rather than MAC addresses to forward packets between networks.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0019-point-1",
                                                "description":  "IP addresses are used to identify routed destinations.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0019-point-2",
                                                "description":  "MAC addresses apply to local-link frame delivery.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "IP addresses identify network destinations for routing, while MAC addresses support delivery on a local link.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0020",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-large-0020",
                         "questionNumber":  20,
                         "topic":  "Cybersecurity",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain how applying software security patches can reduce attack opportunities.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0020-point-1",
                                                "description":  "Updates can fix known security weaknesses.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0020-point-2",
                                                "description":  "Removing vulnerabilities reduces possible exploitation.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Patches can correct known vulnerabilities before attackers exploit them.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0021",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-large-0021",
                         "questionNumber":  21,
                         "topic":  "CPU architecture",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain the role of the accumulator in a simple processor architecture.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0021-point-1",
                                                "description":  "The accumulator holds intermediate data or results.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0021-point-2",
                                                "description":  "It supports arithmetic or logic processing.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "It stores intermediate values or results produced by arithmetic and logic operations.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0022",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-large-0022",
                         "questionNumber":  22,
                         "topic":  "CPU architecture",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why increasing clock speed does not always increase application performance proportionally.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0022-point-1",
                                                "description":  "Clock speed affects processor cycles per second.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0022-point-2",
                                                "description":  "Other bottlenecks can restrict overall performance.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "The processor may be limited by memory access, instruction efficiency or other system components.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0023",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-large-0023",
                         "questionNumber":  23,
                         "topic":  "Memory and storage",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why virtual memory can allow more programs to remain active than physical RAM alone can hold.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0023-point-1",
                                                "description":  "Secondary storage can hold pages not currently in RAM.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0023-point-2",
                                                "description":  "Accessing these pages is slower than RAM access.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "The operating system can move some memory contents to secondary storage, although this is slower than RAM.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0024",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-large-0024",
                         "questionNumber":  24,
                         "topic":  "Algorithms",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why a bubble sort can finish early if a complete pass makes no swaps.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0024-point-1",
                                                "description":  "A swap-free pass indicates the list is sorted.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0024-point-2",
                                                "description":  "Further passes are unnecessary.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "No swaps indicate adjacent elements are already in order throughout the pass, so the list is sorted.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0025",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-large-0025",
                         "questionNumber":  25,
                         "topic":  "Programming",
                         "questionType":  "compare",
                         "commandWord":  "compare",
                         "question":  "Explain the difference between a syntax error and a logic error.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0025-point-1",
                                                "description":  "Syntax errors break language grammar.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0025-point-2",
                                                "description":  "Logic errors cause incorrect behaviour despite valid syntax.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "A syntax error violates language grammar, while a logic error allows execution but produces unintended results.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0026",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-large-0026",
                         "questionNumber":  26,
                         "topic":  "Programming",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why meaningful variable names improve maintainability.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0026-point-1",
                                                "description":  "Names reveal the role of variables.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0026-point-2",
                                                "description":  "This makes future reading or modification easier.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "They communicate the intended purpose of stored values and make code easier to understand or modify.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0027",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-large-0027",
                         "questionNumber":  27,
                         "topic":  "Boolean logic",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain when a NAND gate outputs false.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0027-point-1",
                                                "description":  "NAND is NOT applied to AND.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0027-point-2",
                                                "description":  "Its output is false when both inputs are true.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "NAND is the negation of AND and is false only when both inputs are true.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0028",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-large-0028",
                         "questionNumber":  28,
                         "topic":  "Data representation",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why an unsigned 6-bit integer cannot store the value 70.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0028-point-1",
                                                "description":  "Six bits provide 64 possible values.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0028-point-2",
                                                "description":  "The maximum unsigned value is 63.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Six bits provide 64 combinations representing 0 to 63, so 70 exceeds the maximum.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0029",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-large-0029",
                         "questionNumber":  29,
                         "topic":  "Image representation",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why image resolution and colour depth affect uncompressed bitmap size differently.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0029-point-1",
                                                "description":  "Resolution determines pixel count.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0029-point-2",
                                                "description":  "Colour depth determines bits per pixel.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Resolution determines the number of pixels while colour depth determines the bits stored for each pixel.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0030",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-large-0030",
                         "questionNumber":  30,
                         "topic":  "Sound representation",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why a mono recording normally requires less uncompressed storage than a stereo recording with the same duration and sampling settings.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0030-point-1",
                                                "description":  "Mono stores one audio channel.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0030-point-2",
                                                "description":  "Stereo stores two channels and therefore more sample data.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Mono stores one channel while stereo stores two channels of samples.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0031",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-large-0031",
                         "questionNumber":  31,
                         "topic":  "Data compression",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why a compressed archive may contain files that were already compressed with little additional reduction.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0031-point-1",
                                                "description":  "Compression removes exploitable redundancy.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0031-point-2",
                                                "description":  "Previously compressed data may have little redundancy left.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Existing compression may have removed most exploitable redundancy, leaving little for another compressor.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0032",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-large-0032",
                         "questionNumber":  32,
                         "topic":  "Computer networks",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why packet switching can use network capacity efficiently when many users share a connection.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0032-point-1",
                                                "description":  "Messages are divided into packets.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0032-point-2",
                                                "description":  "Shared links can carry packets from different users.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Data is sent in packets that can share network links rather than reserving an entire circuit continuously.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0033",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-large-0033",
                         "questionNumber":  33,
                         "topic":  "Cybersecurity",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why a backup stored on the same computer may be insufficient protection against ransomware.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0033-point-1",
                                                "description":  "The malware may reach the local backup.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0033-point-2",
                                                "description":  "A separate protected backup reduces the chance of losing both copies.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Ransomware may encrypt or delete accessible backup files as well as the originals.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0034",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-large-0034",
                         "questionNumber":  34,
                         "topic":  "Systems software",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why an operating system needs device drivers.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0034-point-1",
                                                "description":  "Drivers support communication with hardware.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0034-point-2",
                                                "description":  "They provide device-specific control or translation.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Drivers provide a way for the operating system to communicate with and control particular hardware devices.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0035",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-large-0035",
                         "questionNumber":  35,
                         "topic":  "Software development and testing",
                         "questionType":  "compare",
                         "commandWord":  "compare",
                         "question":  "Explain the difference between test data at a boundary and test data just outside it.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0035-point-1",
                                                "description":  "Boundary data tests the specified limit.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0035-point-2",
                                                "description":  "Outside-boundary data tests rejection of invalid values.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Boundary data checks an accepted limit while just-outside data checks whether the program rejects a value beyond that limit.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0036",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-large-0036",
                         "questionNumber":  36,
                         "topic":  "Algorithms",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why insertion sort can be efficient for a list that is already nearly sorted.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0036-point-1",
                                                "description":  "Nearly sorted input requires fewer movements.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0036-point-2",
                                                "description":  "This can reduce the work insertion sort performs.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Few elements need to move far, so relatively few shifts or comparisons may be required.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0037",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-large-0037",
                         "questionNumber":  37,
                         "topic":  "Algorithms",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain the purpose of a flowchart decision symbol.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0037-point-1",
                                                "description":  "A decision symbol evaluates a condition.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0037-point-2",
                                                "description":  "Different outcomes lead to different branches.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "It tests a condition and directs execution along alternative paths based on the result.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0038",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-large-0038",
                         "questionNumber":  38,
                         "topic":  "Programming",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why input validation should occur before a value is used in a calculation.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0038-point-1",
                                                "description":  "Validation checks input against constraints.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0038-point-2",
                                                "description":  "Rejecting invalid input reduces incorrect processing.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Invalid data could produce errors or misleading results, so constraints should be checked first.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0039",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-large-0039",
                         "questionNumber":  39,
                         "topic":  "Programming",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why a count-controlled loop is suitable for processing exactly twelve monthly readings.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0039-point-1",
                                                "description":  "The required iteration count is fixed.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0039-point-2",
                                                "description":  "The loop can process each of the twelve readings.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "The number of iterations is known in advance, so the loop can execute once per reading.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0040",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-large-0040",
                         "questionNumber":  40,
                         "topic":  "Data representation",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why two\u0027s complement is useful for representing signed integers.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0040-point-1",
                                                "description":  "Two\u0027s complement represents negative as well as positive values.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0040-point-2",
                                                "description":  "It supports signed arithmetic with binary addition.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "It represents positive and negative integers and supports arithmetic using the same binary addition circuitry.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0041",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-large-0041",
                         "questionNumber":  41,
                         "topic":  "Data representation",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain what happens when an unsigned arithmetic result exceeds the largest value available in its fixed bit width.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0041-point-1",
                                                "description":  "The result exceeds the representable range.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0041-point-2",
                                                "description":  "A fixed-width representation cannot store the full result.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "The result cannot be represented fully in that width, causing overflow or loss of higher bits.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0042",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-large-0042",
                         "questionNumber":  42,
                         "topic":  "Boolean logic",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why an XOR gate can detect whether two binary inputs differ.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0042-point-1",
                                                "description":  "XOR is true for different inputs.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0042-point-2",
                                                "description":  "XOR is false when the inputs match.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "XOR outputs true for unequal inputs and false for equal inputs.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0043",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-large-0043",
                         "questionNumber":  43,
                         "topic":  "Computer networks",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why HTTPS protects information better than unencrypted HTTP on an untrusted network.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0043-point-1",
                                                "description":  "TLS encrypts transmitted application data.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0043-point-2",
                                                "description":  "Certificate validation helps authenticate the server.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "HTTPS uses TLS to encrypt data in transit and authenticate the server when certificates are validated.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0044",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-large-0044",
                         "questionNumber":  44,
                         "topic":  "Cybersecurity",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why assigning all users administrator privileges increases security risk.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0044-point-1",
                                                "description":  "Administrator accounts have elevated permissions.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0044-point-2",
                                                "description":  "Compromise can cause greater damage.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Compromised accounts gain greater power and can make system-wide changes or access restricted resources.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0045",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-large-0045",
                         "questionNumber":  45,
                         "topic":  "Memory and storage",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why optical storage may be suitable for distributing read-only reference material.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0045-point-1",
                                                "description":  "Optical discs can be portable distribution media.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0045-point-2",
                                                "description":  "Read-only media can prevent ordinary modification of the distributed content.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "It can provide portable media with content that is not intended to be frequently rewritten.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0046",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-large-0046",
                         "questionNumber":  46,
                         "topic":  "Databases and SQL",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why storing dates as a proper date data type is better than storing arbitrary text.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0046-point-1",
                                                "description":  "Date types enforce a suitable representation.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0046-point-2",
                                                "description":  "They support reliable date comparison or sorting.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "A date type supports consistent validation, comparison and chronological sorting.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0047",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-large-0047",
                         "questionNumber":  47,
                         "topic":  "Systems software",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why multitasking does not mean that a single-core processor executes two instructions simultaneously.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0047-point-1",
                                                "description":  "A single core executes one instruction stream at a time.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0047-point-2",
                                                "description":  "Scheduling switches execution between tasks.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "A single core switches rapidly between tasks, giving an appearance of concurrent progress.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0048",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-large-0048",
                         "questionNumber":  48,
                         "topic":  "Image representation",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why an image with more pixels does not necessarily look sharper on every display.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0048-point-1",
                                                "description":  "Pixel count alone does not determine perceived sharpness.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0048-point-2",
                                                "description":  "Display density or scaling affects appearance.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Visible sharpness also depends on display size, pixel density, scaling and viewing conditions.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0049",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-large-0049",
                         "questionNumber":  49,
                         "topic":  "Software development and testing",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why a test plan should state expected results before tests are executed.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0049-point-1",
                                                "description":  "The expected outcome is defined in advance.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0049-point-2",
                                                "description":  "Actual results can be compared against it.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Expected results provide an objective basis for deciding whether observed behaviour is correct.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0050",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "GCSE",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-large-0050",
                         "questionNumber":  50,
                         "topic":  "Defensive design",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain how sanitising text input can reduce risks when displaying user-supplied content on a webpage.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0050-point-1",
                                                "description":  "Untrusted text must be treated as data.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0050-point-2",
                                                "description":  "Correct output escaping helps prevent script injection.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Appropriate escaping prevents supplied characters from being interpreted as executable markup or scripts.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0051",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-large-0051",
                         "questionNumber":  51,
                         "topic":  "Data structures",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why a binary search tree can become inefficient if values are inserted in sorted order without balancing.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0051-point-1",
                                                "description":  "Sorted insertion can produce a skewed tree.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0051-point-2",
                                                "description":  "Search may then require linear time.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "The tree may become a chain, increasing search height from logarithmic to linear.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0052",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-large-0052",
                         "questionNumber":  52,
                         "topic":  "Data structures",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why a hash table may need collision resolution.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0052-point-1",
                                                "description":  "Distinct keys may hash to the same index.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0052-point-2",
                                                "description":  "Collision resolution allows both entries to be stored or retrieved.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Different keys can produce the same table index, so the structure must handle competing entries.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0053",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-large-0053",
                         "questionNumber":  53,
                         "topic":  "Computational complexity",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why O(n log n) grows more slowly than O(n squared) for sufficiently large n.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0053-point-1",
                                                "description":  "Logarithmic growth is slower than linear growth.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0053-point-2",
                                                "description":  "The quadratic term dominates for sufficiently large inputs.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "The logarithmic factor grows much more slowly than n, so n log n eventually becomes smaller than n squared.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0054",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-large-0054",
                         "questionNumber":  54,
                         "topic":  "Recursion",
                         "questionType":  "compare",
                         "commandWord":  "compare",
                         "question":  "Explain the difference between direct and indirect recursion.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0054-point-1",
                                                "description":  "Direct recursion calls the same function.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0054-point-2",
                                                "description":  "Indirect recursion returns to the original function through other calls.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Direct recursion occurs when a function calls itself, while indirect recursion occurs through a chain of other functions.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0055",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-large-0055",
                         "questionNumber":  55,
                         "topic":  "Object-oriented programming",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why composition can sometimes be preferable to inheritance.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0055-point-1",
                                                "description":  "Composition builds objects using other objects.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0055-point-2",
                                                "description":  "It avoids inappropriate inheritance relationships or tight coupling.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Composition assembles behaviour from contained objects without requiring an is-a relationship or tightly coupled class hierarchy.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0056",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-large-0056",
                         "questionNumber":  56,
                         "topic":  "Computer organisation",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why a pipeline branch hazard can reduce processor throughput.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0056-point-1",
                                                "description":  "A branch makes the next instruction path uncertain.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0056-point-2",
                                                "description":  "Stalls or flushed instructions reduce throughput.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "The processor may fetch instructions along the wrong path and need to stall or discard speculative work.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0057",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-large-0057",
                         "questionNumber":  57,
                         "topic":  "Boolean algebra",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain the consensus behind the identity A OR (A AND B) equals A.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0057-point-1",
                                                "description":  "A false makes the expression false.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0057-point-2",
                                                "description":  "A true makes the expression true regardless of B.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "When A is false both terms are false; when A is true the whole expression is true regardless of B.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0058",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-large-0058",
                         "questionNumber":  58,
                         "topic":  "Databases",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why a composite primary key can be appropriate for an enrolment table.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0058-point-1",
                                                "description":  "The key uses multiple fields together.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0058-point-2",
                                                "description":  "Their combination uniquely identifies a record.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "The combination of student identifier and course identifier may uniquely identify an enrolment even though neither field does alone.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0059",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-large-0059",
                         "questionNumber":  59,
                         "topic":  "Theory of computation",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why a finite-state machine cannot count an unlimited number of nested brackets.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0059-point-1",
                                                "description":  "A finite-state machine has finite memory or states.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0059-point-2",
                                                "description":  "Unbounded nesting requires unbounded depth tracking.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "It has only finitely many states and cannot remember arbitrary nesting depth.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0060",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-large-0060",
                         "questionNumber":  60,
                         "topic":  "Functional programming",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why immutability can simplify reasoning about concurrent programs.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0060-point-1",
                                                "description":  "Immutable values are not modified in place.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0060-point-2",
                                                "description":  "This reduces shared-state interference.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Values cannot be changed after creation, reducing interference caused by shared mutable state.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0061",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-large-0061",
                         "questionNumber":  61,
                         "topic":  "Networking",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why TCP flow control and congestion control address different problems.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0061-point-1",
                                                "description":  "Flow control protects the receiving endpoint.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0061-point-2",
                                                "description":  "Congestion control responds to network congestion.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Flow control prevents overwhelming the receiver, while congestion control responds to limited network capacity.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0062",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-large-0062",
                         "questionNumber":  62,
                         "topic":  "Operating systems",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why a deadlock can arise when processes acquire resources in different orders.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0062-point-1",
                                                "description":  "Processes can hold resources while requesting others.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0062-point-2",
                                                "description":  "Circular waiting can prevent all involved processes from progressing.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Each process may hold a resource while waiting for another held by a different process, creating circular waiting.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0063",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-large-0063",
                         "questionNumber":  63,
                         "topic":  "Algorithms",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why Dijkstra\u0027s algorithm is not generally suitable for graphs with negative edge weights.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0063-point-1",
                                                "description":  "Dijkstra relies on non-negative edge weights.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0063-point-2",
                                                "description":  "Negative edges can invalidate settled shortest-path decisions.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Its greedy selection assumes settled shortest distances cannot later be improved, which negative edges can violate.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0064",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-large-0064",
                         "questionNumber":  64,
                         "topic":  "Data representation",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why floating-point calculations can produce rounding error even when the algorithm is correct.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0064-point-1",
                                                "description":  "Finite binary precision cannot represent every real value exactly.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0064-point-2",
                                                "description":  "Stored approximations can cause rounding differences.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Many real values cannot be represented exactly with a finite binary significand, so approximations are stored.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0065",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "AQA",
        "question":  {
                         "id":  "catalogue-large-0065",
                         "questionNumber":  65,
                         "topic":  "Software development",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why unit testing and integration testing detect different classes of fault.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0065-point-1",
                                                "description":  "Unit tests check isolated components.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0065-point-2",
                                                "description":  "Integration tests check interactions between components.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Unit tests focus on individual components, while integration tests examine their interactions and interfaces.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0066",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-large-0066",
                         "questionNumber":  66,
                         "topic":  "Data structures",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why an adjacency list can be more memory-efficient than an adjacency matrix for a sparse graph.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0066-point-1",
                                                "description":  "An adjacency matrix reserves space for vertex pairs.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0066-point-2",
                                                "description":  "An adjacency list primarily stores existing connections.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "It stores only existing edges rather than reserving a cell for every possible pair of vertices.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0067",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-large-0067",
                         "questionNumber":  67,
                         "topic":  "Data structures",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why a circular queue can reuse space more effectively than a simple fixed linear queue.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0067-point-1",
                                                "description":  "Indices wrap around the underlying array.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0067-point-2",
                                                "description":  "Vacated positions can be reused.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "The rear index can wrap to free positions at the beginning of the array instead of wasting them after removals.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0068",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-large-0068",
                         "questionNumber":  68,
                         "topic":  "Computational complexity",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why a constant factor is normally ignored in Big O notation.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0068-point-1",
                                                "description":  "Big O focuses on growth as input size increases.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0068-point-2",
                                                "description":  "Constant multiplicative factors do not change the asymptotic class.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Big O describes asymptotic growth rather than the exact running time for a particular machine or implementation.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0069",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-large-0069",
                         "questionNumber":  69,
                         "topic":  "Recursion",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why tail recursion may be optimised into iteration by a compiler.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0069-point-1",
                                                "description":  "A tail call is the final operation.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0069-point-2",
                                                "description":  "An optimiser may reuse stack space.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "When the recursive call is the final action, an implementation may reuse the current stack frame instead of creating another.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0070",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-large-0070",
                         "questionNumber":  70,
                         "topic":  "Object-oriented programming",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain how method overriding supports polymorphism.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0070-point-1",
                                                "description":  "A subclass supplies a different method implementation.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0070-point-2",
                                                "description":  "Dispatch can select behaviour based on the actual object type.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "A subclass can provide its own implementation of an inherited interface, and the method selected depends on the runtime object.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0071",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-large-0071",
                         "questionNumber":  71,
                         "topic":  "Computer organisation",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why direct memory access can reduce CPU involvement in large data transfers.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0071-point-1",
                                                "description":  "A controller manages the transfer.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0071-point-2",
                                                "description":  "The CPU avoids processing every transferred item.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "A DMA controller moves data between a device and memory without requiring the CPU to copy every item.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0072",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-large-0072",
                         "questionNumber":  72,
                         "topic":  "Boolean algebra",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why NOT(A OR B) is equivalent to (NOT A) AND (NOT B).",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0072-point-1",
                                                "description":  "Both inputs must be false for the result to be true.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0072-point-2",
                                                "description":  "The identity follows from De Morgan\u0027s law.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Both expressions are true only when A and B are both false, as stated by De Morgan\u0027s law.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0073",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-large-0073",
                         "questionNumber":  73,
                         "topic":  "Databases",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why third normal form helps prevent transitive dependencies between non-key attributes.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0073-point-1",
                                                "description":  "Third normal form removes relevant transitive dependencies.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0073-point-2",
                                                "description":  "This reduces redundancy or update anomalies.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Non-key attributes should depend on a key rather than on another non-key attribute, reducing duplicated facts and anomalies.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0074",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-large-0074",
                         "questionNumber":  74,
                         "topic":  "Networking",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why a subnet mask is needed when deciding whether an IP destination is on the local network.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0074-point-1",
                                                "description":  "The mask identifies network bits.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0074-point-2",
                                                "description":  "Network identifiers can be compared to determine local delivery.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "The mask identifies the network portion of an address, allowing comparison of source and destination network identifiers.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0075",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-large-0075",
                         "questionNumber":  75,
                         "topic":  "Operating systems",
                         "questionType":  "compare",
                         "commandWord":  "compare",
                         "question":  "Explain the difference between preemptive and non-preemptive scheduling.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0075-point-1",
                                                "description":  "Preemptive scheduling can take the CPU from a running process.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0075-point-2",
                                                "description":  "Non-preemptive scheduling waits for voluntary release or completion.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Preemptive scheduling can interrupt a running process, while non-preemptive scheduling waits for the process to yield or finish.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0076",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-large-0076",
                         "questionNumber":  76,
                         "topic":  "Algorithms",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why A-star search can expand fewer nodes than uninformed search when supplied with a useful admissible heuristic.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0076-point-1",
                                                "description":  "The heuristic estimates remaining path cost.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0076-point-2",
                                                "description":  "It prioritises promising nodes while preserving optimality under suitable conditions.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "A heuristic estimates remaining cost and guides exploration towards promising nodes without overestimating the true remaining cost.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0077",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-large-0077",
                         "questionNumber":  77,
                         "topic":  "Data representation",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why arithmetic right shifting a signed two\u0027s-complement number usually preserves its sign.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0077-point-1",
                                                "description":  "Arithmetic shifting replicates the sign bit.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0077-point-2",
                                                "description":  "This preserves the sign of the signed value.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "The sign bit is replicated as bits shift right, retaining a negative sign for negative values.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0078",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "OCR",
        "question":  {
                         "id":  "catalogue-large-0078",
                         "questionNumber":  78,
                         "topic":  "Software development",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why black-box testing can miss defects that white-box testing may reveal.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0078-point-1",
                                                "description":  "Black-box testing focuses on observable behaviour.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0078-point-2",
                                                "description":  "White-box testing examines internal control flow or branches.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Black-box tests assess external behaviour, while white-box tests can target internal branches and paths that input-output tests might not cover.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0079",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-large-0079",
                         "questionNumber":  79,
                         "topic":  "Data structures",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why a priority queue is suitable for scheduling jobs with different urgency levels.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0079-point-1",
                                                "description":  "Items are ordered or selected by priority.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0079-point-2",
                                                "description":  "More urgent jobs can be processed before less urgent jobs.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "It removes an item according to priority rather than simply insertion order.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0080",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-large-0080",
                         "questionNumber":  80,
                         "topic":  "Data structures",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why a graph representation is more suitable than a simple list for modelling a transport network.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0080-point-1",
                                                "description":  "Vertices represent locations.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0080-point-2",
                                                "description":  "Edges represent links between locations.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Vertices can represent locations and edges can represent direct connections between them.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0081",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-large-0081",
                         "questionNumber":  81,
                         "topic":  "Computational complexity",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why an exponential-time exhaustive search becomes difficult as the number of binary decisions grows.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0081-point-1",
                                                "description":  "Each binary choice multiplies the possible combinations.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0081-point-2",
                                                "description":  "The total grows exponentially with decision count.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Each additional binary decision can double the combinations, so the search space grows exponentially.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0082",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-large-0082",
                         "questionNumber":  82,
                         "topic":  "Recursion",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why memoisation can improve a recursive Fibonacci implementation.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0082-point-1",
                                                "description":  "Results of subproblems are cached.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0082-point-2",
                                                "description":  "Repeated calculations are avoided.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "It stores previously computed results so repeated subproblems are not evaluated again.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0083",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-large-0083",
                         "questionNumber":  83,
                         "topic":  "Object-oriented programming",
                         "questionType":  "compare",
                         "commandWord":  "compare",
                         "question":  "Explain the difference between an abstract class and a concrete class.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0083-point-1",
                                                "description":  "An abstract class cannot be instantiated directly.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0083-point-2",
                                                "description":  "A concrete class supplies sufficient implementation to create objects.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "An abstract class defines an incomplete contract or behaviour and is not directly instantiated, while a concrete class can be instantiated.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0084",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-large-0084",
                         "questionNumber":  84,
                         "topic":  "Computer organisation",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why increasing the number of CPU cores may improve server throughput without improving single-thread latency.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0084-point-1",
                                                "description":  "Different cores can handle independent requests concurrently.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0084-point-2",
                                                "description":  "A single sequential task may not execute faster.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Independent requests can run concurrently on different cores, but one sequential request may still use only one core.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0085",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-large-0085",
                         "questionNumber":  85,
                         "topic":  "Boolean algebra",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why A XOR A always evaluates to false.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0085-point-1",
                                                "description":  "XOR requires unequal inputs for true.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0085-point-2",
                                                "description":  "The two inputs are always identical.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "XOR is true only when its two inputs differ, and identical copies of A never differ.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0086",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-large-0086",
                         "questionNumber":  86,
                         "topic":  "Databases",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why a database transaction should be atomic when transferring money between accounts.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0086-point-1",
                                                "description":  "Atomicity treats the operations as one unit.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0086-point-2",
                                                "description":  "A partial debit or credit must not remain committed.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Either both the debit and credit should complete or neither should, preventing partial updates.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0087",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-large-0087",
                         "questionNumber":  87,
                         "topic":  "Networking",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why DNS caching can improve response time but temporarily return outdated information.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0087-point-1",
                                                "description":  "Caching reduces repeated resolution requests.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0087-point-2",
                                                "description":  "Stored answers can be stale until their cache lifetime expires.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Cached answers avoid repeated lookups, but they may remain until expiry after a DNS record changes.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0088",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-large-0088",
                         "questionNumber":  88,
                         "topic":  "Operating systems",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why paging can cause thrashing when available physical memory is insufficient.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0088-point-1",
                                                "description":  "Frequent page faults trigger page transfers.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0088-point-2",
                                                "description":  "Excessive transfers reduce useful processing time.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "The system spends excessive time swapping pages between memory and storage rather than executing useful instructions.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0089",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-large-0089",
                         "questionNumber":  89,
                         "topic":  "Algorithms",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why a stable sorting algorithm matters when sorting records by multiple fields.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0089-point-1",
                                                "description":  "Equal-key records keep their relative order.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0089-point-2",
                                                "description":  "This preserves ordering established by an earlier sort.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "A stable sort preserves the original relative order of records with equal keys, allowing earlier ordering to be retained.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0090",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-large-0090",
                         "questionNumber":  90,
                         "topic":  "Data representation",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why normalising a floating-point number helps maximise the precision available in its significand.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0090-point-1",
                                                "description":  "Normalisation standardises the significand representation.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0090-point-2",
                                                "description":  "It makes effective use of available precision.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Normalisation places the significant digits in a standard form so the available significand positions are used effectively.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0091",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-large-0091",
                         "questionNumber":  91,
                         "topic":  "Software development",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why continuous integration can detect integration problems earlier than infrequent manual merging.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0091-point-1",
                                                "description":  "Changes are integrated frequently.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0091-point-2",
                                                "description":  "Automated checks detect incompatibilities earlier.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "Changes are combined and tested regularly, revealing interface and compatibility failures soon after introduction.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0092",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-large-0092",
                         "questionNumber":  92,
                         "topic":  "Theory of computation",
                         "questionType":  "compare",
                         "commandWord":  "compare",
                         "question":  "Explain the difference between a decidable problem and a semi-decidable problem.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0092-point-1",
                                                "description":  "A decider halts on every valid input.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0092-point-2",
                                                "description":  "A semi-decider may run indefinitely for some no-instances.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "A decidable problem has an algorithm that halts with a correct yes-or-no answer for every input; a semi-decision procedure may not halt for negative instances.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    },
    {
        "key":  "catalogue-large-0093",
        "sourceId":  "cs-master-large-authored-batch",
        "sourceTitle":  "CS Master large authored catalogue",
        "qualification":  "A Level",
        "examBoard":  "EDEXCEL",
        "question":  {
                         "id":  "catalogue-large-0093",
                         "questionNumber":  93,
                         "topic":  "Functional programming",
                         "questionType":  "explain",
                         "commandWord":  "explain",
                         "question":  "Explain why higher-order functions can reduce repeated control-flow code.",
                         "context":  "",
                         "marks":  2,
                         "difficulty":  "standard",
                         "assessmentObjective":  "AO1",
                         "markScheme":  [
                                            {
                                                "id":  "catalogue-large-0093-point-1",
                                                "description":  "Higher-order functions operate on other functions.",
                                                "marks":  1
                                            },
                                            {
                                                "id":  "catalogue-large-0093-point-2",
                                                "description":  "Reusable operations reduce repeated iteration logic.",
                                                "marks":  1
                                            }
                                        ],
                         "levelDescriptors":  [

                                              ],
                         "modelAnswer":  "They accept functions as arguments or return functions, allowing common operations such as mapping and filtering to be reused.",
                         "examinerGuidance":  [
                                                  "Award one mark for each correct marking point.",
                                                  "Accept technically equivalent responses."
                                              ],
                         "commonMisconceptions":  [

                                                  ]
                     }
    }
];
