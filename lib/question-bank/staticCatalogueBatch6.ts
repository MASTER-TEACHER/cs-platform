import type { BankQuestion } from "./bankUtilities";

/**
 * CS Master Batch 6: 58 original questions focused on the smallest pools
 * (A Level Edexcel/OCR, GCSE Edexcel/OCR). Checked against batches 1-5 for
 * repeats. Exam-board classifications are provisional pending review.
 */
export const batch6Questions: BankQuestion[] = [
  {
    "key": "catalogue-batch6-0001",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch6-0001",
      "questionNumber": 1,
      "topic": "Cybersecurity",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain how a Caesar cipher works and why it is not secure.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch6-0001-point-1",
          "description": "Each letter is shifted a fixed number of places along the alphabet",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0001-point-2",
          "description": "There are only 25 possible keys, so all can be tried quickly (brute force)",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0001-point-3",
          "description": "Frequency analysis can reveal the shift",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Letters are shifted by a fixed key; with only 25 keys it can be brute-forced or broken by frequency analysis.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0002",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch6-0002",
      "questionNumber": 2,
      "topic": "Cybersecurity",
      "questionType": "calculation",
      "commandWord": "calculate",
      "question": "Encrypt the word CAT using a Caesar cipher with a shift of 3.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch6-0002-point-1",
          "description": "Each letter shifted forward by 3",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0002-point-2",
          "description": "FDW",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "FDW",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0003",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch6-0003",
      "questionNumber": 3,
      "topic": "Cybersecurity",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "State the conditions a one-time pad (Vernam cipher) key must meet for the cipher to be unbreakable.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch6-0003-point-1",
          "description": "The key is truly random",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0003-point-2",
          "description": "The key is at least as long as the message",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0003-point-3",
          "description": "The key is used only once and kept secret / destroyed after use",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A truly random key, at least as long as the message, used once only and kept secret.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0004",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch6-0004",
      "questionNumber": 4,
      "topic": "Programming",
      "questionType": "code-tracing",
      "commandWord": "trace",
      "question": "State the result of the Python expression [x * 2 for x in range(5) if x % 2 == 1].",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch6-0004-point-1",
          "description": "Only x = 1 and x = 3 are selected",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0004-point-2",
          "description": "Result: [2, 6]",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "[2, 6]",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0005",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch6-0005",
      "questionNumber": 5,
      "topic": "Recursion",
      "questionType": "code-tracing",
      "commandWord": "trace",
      "question": "State what rev(\"abc\") returns and explain how:\ndef rev(s):\n    if s == \"\":\n        return \"\"\n    return rev(s[1:]) + s[0]",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch6-0005-point-1",
          "description": "Returns \"cba\"",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0005-point-2",
          "description": "Each call moves the first character to after the reversed remainder, until the empty-string base case",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "\"cba\": rev(\"abc\") = rev(\"bc\") + \"a\" = (rev(\"c\") + \"b\") + \"a\".",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0006",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch6-0006",
      "questionNumber": 6,
      "topic": "Theory of computation",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Explain the differences between a finite state machine and a Turing machine.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch6-0006-point-1",
          "description": "A Turing machine has an unlimited tape it can read from and write to (memory)",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0006-point-2",
          "description": "An FSM has no memory beyond its current state",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0006-point-3",
          "description": "A Turing machine can compute anything that is computable / is more powerful",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "An FSM only has a finite set of states, whereas a Turing machine also has an infinite read/write tape, making it able to compute anything computable.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0007",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch6-0007",
      "questionNumber": 7,
      "topic": "Operating systems",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Compare a real-time operating system with a batch operating system, giving an example use of each.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch6-0007-point-1",
          "description": "Real-time OS responds to input within a guaranteed short time",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0007-point-2",
          "description": "Example: aircraft control / car braking / medical monitoring",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0007-point-3",
          "description": "Batch OS processes jobs in groups without user interaction",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0007-point-4",
          "description": "Example: payroll / bank statements / billing",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Real-time OSs respond immediately (e.g. engine control); batch OSs process queued jobs without interaction (e.g. payroll).",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0008",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch6-0008",
      "questionNumber": 8,
      "topic": "Object-oriented programming",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain the purpose of the self parameter in a Python method.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch6-0008-point-1",
          "description": "Refers to the particular object (instance) the method is called on",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0008-point-2",
          "description": "Allows the method to access/change that object's attributes",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "self refers to the current object so the method can use that object's attributes.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0009",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch6-0009",
      "questionNumber": 9,
      "topic": "Object-oriented programming",
      "questionType": "code-completion",
      "commandWord": "write",
      "question": "A class Person has a constructor __init__(self, name). Write the start of a subclass Student whose constructor also stores a candidate number.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch6-0009-point-1",
          "description": "class Student(Person):",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0009-point-2",
          "description": "def __init__(self, name, candidate_no): with super().__init__(name)",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0009-point-3",
          "description": "self.candidate_no = candidate_no",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "class Student(Person):\n    def __init__(self, name, candidate_no):\n        super().__init__(name)\n        self.candidate_no = candidate_no",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0010",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch6-0010",
      "questionNumber": 10,
      "topic": "Algorithms",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe how quicksort works and state when its worst case occurs.",
      "context": "",
      "marks": 4,
      "difficulty": "higher",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch6-0010-point-1",
          "description": "A pivot element is chosen",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0010-point-2",
          "description": "Items are partitioned into those less than and greater than the pivot",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0010-point-3",
          "description": "Each partition is sorted recursively",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0010-point-4",
          "description": "Worst case O(n²) when the pivot is always the smallest/largest value, e.g. an already sorted list with the first item as pivot",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Choose a pivot, partition around it and recursively sort each side; worst case O(n²) when pivots are always extreme values.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0011",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch6-0011",
      "questionNumber": 11,
      "topic": "Algorithms",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain how a linear search can be made more efficient when the list is already sorted.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch6-0011-point-1",
          "description": "Stop as soon as an item larger than the target is reached",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0011-point-2",
          "description": "Because the target cannot appear later in a sorted list",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Stop early once the current item exceeds the target, as the target cannot appear later.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0012",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch6-0012",
      "questionNumber": 12,
      "topic": "Software development",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain the benefits of using version control software in a programming team.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch6-0012-point-1",
          "description": "Records every change and who made it",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0012-point-2",
          "description": "Earlier versions can be restored if a change breaks the program",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0012-point-3",
          "description": "Branches let developers work in parallel and merge their changes",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Version control tracks changes and authors, allows rollback and supports parallel work through branching and merging.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0013",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch6-0013",
      "questionNumber": 13,
      "topic": "Software development",
      "questionType": "explain",
      "commandWord": "define",
      "question": "Explain what is meant by refactoring code and why it is done.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch6-0013-point-1",
          "description": "Restructuring code without changing what it does",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0013-point-2",
          "description": "To improve readability / maintainability / efficiency",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Refactoring improves the structure of code without changing its behaviour, making it easier to maintain.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0014",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch6-0014",
      "questionNumber": 14,
      "topic": "Programming",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain how exception handling (try/except) can make a program more robust, using an example.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch6-0014-point-1",
          "description": "Code that may fail is placed in a try block",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0014-point-2",
          "description": "Errors are caught in the except block instead of crashing the program",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0014-point-3",
          "description": "Example: catching ValueError when converting user input to int and asking again",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "try/except catches runtime errors, e.g. a ValueError from int(input()), so the program can respond instead of crashing.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0015",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch6-0015",
      "questionNumber": 15,
      "topic": "Programming",
      "questionType": "code-completion",
      "commandWord": "write",
      "question": "Write Python code that reads whole numbers from a file scores.txt (one per line) and outputs their total.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch6-0015-point-1",
          "description": "Opens the file for reading (e.g. with open(...))",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0015-point-2",
          "description": "Loops through each line",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0015-point-3",
          "description": "Converts each line to an integer and adds it to a running total",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0015-point-4",
          "description": "Outputs the total",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "total = 0\nwith open(\"scores.txt\") as f:\n    for line in f:\n        total += int(line)\nprint(total)",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0016",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch6-0016",
      "questionNumber": 16,
      "topic": "Programming",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Explain the difference between a list and a tuple in Python.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch6-0016-point-1",
          "description": "A list is mutable / its items can be changed",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0016-point-2",
          "description": "A tuple is immutable / cannot be changed after creation",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Lists can be changed after creation; tuples cannot.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0017",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch6-0017",
      "questionNumber": 17,
      "topic": "Ethical, legal and environmental impacts",
      "questionType": "discuss",
      "commandWord": "discuss",
      "question": "Discuss the environmental impact of large data centres that support cloud computing.",
      "context": "",
      "marks": 6,
      "difficulty": "higher",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch6-0017-point-1",
          "description": "Marked using the levels of response. Indicative content: Very high electricity use for servers and cooling; Carbon emissions if powered by fossil fuels; Water use for cooling; Can be more efficient than many separate local servers / economies of scale; Use of renewable energy and heat reuse to reduce impact; E-waste when servers are replaced.",
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
      "modelAnswer": "Weighs energy, water and e-waste against efficiency gains and renewable power, with a justified conclusion.",
      "examinerGuidance": [
        "Mark using the levels of response."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0018",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch6-0018",
      "questionNumber": 18,
      "topic": "Data representation",
      "questionType": "conversion",
      "commandWord": "calculate",
      "question": "Represent 13.25 in unsigned fixed-point binary with 4 bits before and 4 bits after the binary point.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch6-0018-point-1",
          "description": "Integer part 1101",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0018-point-2",
          "description": "Fractional part .0100 (answer 1101.0100)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "1101.0100",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0019",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch6-0019",
      "questionNumber": 19,
      "topic": "Networking",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain how a virtual private network (VPN) protects data sent over a public network.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch6-0019-point-1",
          "description": "Creates an encrypted tunnel between the device and the VPN server",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0019-point-2",
          "description": "Intercepted data cannot be read",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0019-point-3",
          "description": "Hides the user's real IP address / allows secure access to a private network",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A VPN encrypts traffic through a tunnel so intercepted data is unreadable and the user's IP is hidden.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0020",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch6-0020",
      "questionNumber": 20,
      "topic": "Computer organisation",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "State the purpose of the Current Instruction Register (CIR).",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch6-0020-point-1",
          "description": "Holds the instruction currently being decoded/executed",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0020-point-2",
          "description": "The instruction is split into opcode and operand",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "The CIR holds the instruction being decoded and executed, split into opcode and operand.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0021",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch6-0021",
      "questionNumber": 21,
      "topic": "Networking",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Compare circuit switching and packet switching.",
      "context": "",
      "marks": 4,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch6-0021-point-1",
          "description": "Circuit switching sets up a dedicated path for the whole communication",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0021-point-2",
          "description": "Packet switching splits data into packets that can take different routes",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0021-point-3",
          "description": "Circuit switching: guaranteed bandwidth/order but path is reserved even when idle",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0021-point-4",
          "description": "Packet switching uses bandwidth efficiently / more resilient to failures",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Circuit switching reserves one path for the whole call; packet switching sends packets by any route, sharing bandwidth efficiently.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0022",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch6-0022",
      "questionNumber": 22,
      "topic": "Networking",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain the purpose of a proxy server.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch6-0022-point-1",
          "description": "Acts as an intermediary between users and the internet",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0022-point-2",
          "description": "Can filter/block content or log requests",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0022-point-3",
          "description": "Can cache pages to speed up access / hide the user's IP address",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A proxy sits between users and the internet, filtering and caching requests and hiding users' addresses.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0023",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch6-0023",
      "questionNumber": 23,
      "topic": "Networking",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Explain the difference between thin-client and thick-client computing.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch6-0023-point-1",
          "description": "Thin client relies on a server for most processing and storage",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0023-point-2",
          "description": "Thick client processes and stores data locally",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0023-point-3",
          "description": "Thin clients are cheaper and centrally managed but depend on the network/server",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A thin client depends on the server for processing; a thick client does most work itself.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0024",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch6-0024",
      "questionNumber": 24,
      "topic": "Programming",
      "questionType": "code-tracing",
      "commandWord": "trace",
      "question": "State the output when the parameter is passed (a) byVal and (b) byRef:\nprocedure addOne(x)\n  x = x + 1\nendprocedure\na = 5\naddOne(a)\nprint(a)",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch6-0024-point-1",
          "description": "byVal: 5 — a copy is changed so a is unaffected",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0024-point-2",
          "description": "byRef: 6 — the original variable is changed",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "(a) 5 (b) 6",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0025",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch6-0025",
      "questionNumber": 25,
      "topic": "Programming",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain one advantage of passing a large array to a subroutine by reference rather than by value.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch6-0025-point-1",
          "description": "No copy of the array is made",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0025-point-2",
          "description": "Saves memory and time",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Passing by reference avoids copying the array, saving memory and time.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0026",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch6-0026",
      "questionNumber": 26,
      "topic": "Ethical, legal and environmental impacts",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe what the Regulation of Investigatory Powers Act 2000 allows.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch6-0026-point-1",
          "description": "Allows certain public bodies to carry out surveillance/intercept communications",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0026-point-2",
          "description": "Only under specified conditions / with authorisation",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0026-point-3",
          "description": "Can require service providers to provide access to data / decrypt communications",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "RIPA lets authorised public bodies intercept communications and require providers to give access, under defined conditions.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0027",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch6-0027",
      "questionNumber": 27,
      "topic": "Ethical, legal and environmental impacts",
      "questionType": "discuss",
      "commandWord": "discuss",
      "question": "Discuss the moral and social impacts of social-media recommendation algorithms.",
      "context": "",
      "marks": 6,
      "difficulty": "higher",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch6-0027-point-1",
          "description": "Marked using the levels of response. Indicative content: Personalised content keeps users engaged / helps discovery; Filter bubbles / echo chambers reinforce existing views; Can promote harmful or misleading content; Mental health and addiction concerns, especially for young people; Collection of personal data to profile users; Responsibility of companies vs users; regulation.",
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
      "modelAnswer": "Weighs personalisation benefits against filter bubbles, harmful content, wellbeing and privacy, reaching a justified view.",
      "examinerGuidance": [
        "Mark using the levels of response."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0028",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch6-0028",
      "questionNumber": 28,
      "topic": "Algorithms",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain what is meant by thinking concurrently and give an example.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch6-0028-point-1",
          "description": "Identifying parts of a problem that can be processed at the same time",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0028-point-2",
          "description": "Example, e.g. loading images while the user types / rendering different parts of a frame on separate cores",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Working out which tasks can run at the same time, e.g. downloading files while the UI stays responsive.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0029",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch6-0029",
      "questionNumber": 29,
      "topic": "Algorithms",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain how caching is an example of thinking ahead, including one drawback.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch6-0029-point-1",
          "description": "Data/instructions likely to be needed again are stored for quick access",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0029-point-2",
          "description": "Reduces time to fetch them again",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0029-point-3",
          "description": "Drawback: cached data may be out of date / uses memory / complex to manage",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Caching stores likely-needed data in advance so it is quicker to retrieve, but cached data can become stale.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0030",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch6-0030",
      "questionNumber": 30,
      "topic": "Cybersecurity",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe a man-in-the-middle attack and one way to prevent it.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch6-0030-point-1",
          "description": "Attacker secretly intercepts/relays communication between two parties",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0030-point-2",
          "description": "Can read or alter data",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0030-point-3",
          "description": "Prevention: encryption such as TLS/HTTPS with valid certificates",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "An attacker intercepts traffic between two parties; end-to-end encryption with certificates (HTTPS) prevents it.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0031",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch6-0031",
      "questionNumber": 31,
      "topic": "Computational complexity",
      "questionType": "explain",
      "commandWord": "state",
      "question": "State the best-case and worst-case time complexity of insertion sort and when each occurs.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch6-0031-point-1",
          "description": "Best case O(n) when the list is already sorted",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0031-point-2",
          "description": "Worst case O(n²) when the list is in reverse order",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Best O(n) for sorted input; worst O(n²) for reverse-sorted input.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0032",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch6-0032",
      "questionNumber": 32,
      "topic": "Computational complexity",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "A program needs to search an unsorted list once. Explain why a linear search is better than sorting the list and then using binary search.",
      "context": "",
      "marks": 3,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch6-0032-point-1",
          "description": "Linear search is O(n)",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0032-point-2",
          "description": "Sorting first takes at least O(n log n)",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0032-point-3",
          "description": "For a single search the sort costs more than it saves",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Sorting costs O(n log n), more than the O(n) linear search, so sorting only pays off for many searches.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0033",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch6-0033",
      "questionNumber": 33,
      "topic": "Data structures",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe how a node is removed from the middle of a linked list.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch6-0033-point-1",
          "description": "Traverse the list to find the node and its predecessor",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0033-point-2",
          "description": "Set the predecessor's pointer to the node after the one being removed",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0033-point-3",
          "description": "Return the removed node to the free list / free its memory",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Find the node, point the previous node at the next one, and free the removed node.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0034",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch6-0034",
      "questionNumber": 34,
      "topic": "Algorithms",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe how two sorted lists are merged into one sorted list.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch6-0034-point-1",
          "description": "Compare the first remaining item of each list",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0034-point-2",
          "description": "Move the smaller item to the output list",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0034-point-3",
          "description": "Repeat until one list is empty, then append the rest of the other list",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Repeatedly take the smaller front item from the two lists, then copy over whatever remains.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0035",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch6-0035",
      "questionNumber": 35,
      "topic": "Software development",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe pair programming and give one benefit.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch6-0035-point-1",
          "description": "Two programmers work at one computer: one writes code, the other reviews it, swapping roles",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0035-point-2",
          "description": "Benefit: fewer errors / knowledge sharing / better quality code",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Two programmers share one computer, writing and reviewing in turn, which catches errors early.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0036",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch6-0036",
      "questionNumber": 36,
      "topic": "Databases",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain what a flat-file database is and one disadvantage.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch6-0036-point-1",
          "description": "A database stored in a single table",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0036-point-2",
          "description": "Disadvantage: data redundancy / inconsistency / harder to update",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A single-table database, which leads to repeated data and inconsistencies.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0037",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch6-0037",
      "questionNumber": 37,
      "topic": "Databases",
      "questionType": "code-completion",
      "commandWord": "write",
      "question": "Write SQL to delete all records from the Bookings table where BookingDate is before 1 January 2024.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch6-0037-point-1",
          "description": "DELETE FROM Bookings",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0037-point-2",
          "description": "WHERE BookingDate < '2024-01-01'",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "DELETE FROM Bookings WHERE BookingDate < '2024-01-01';",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0038",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "A Level",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch6-0038",
      "questionNumber": 38,
      "topic": "Operating systems",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain the roles of a linker and a loader.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch6-0038-point-1",
          "description": "Linker combines object code files and library code into one executable",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0038-point-2",
          "description": "Linker resolves references between modules/libraries",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0038-point-3",
          "description": "Loader copies the executable into memory and prepares it to run / adjusts addresses",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "The linker joins compiled modules and libraries into one executable; the loader places it in memory ready to run.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0039",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch6-0039",
      "questionNumber": 39,
      "topic": "Binary representation and arithmetic",
      "questionType": "conversion",
      "commandWord": "calculate",
      "question": "State the denary value of the 8-bit two's complement number 11111010.",
      "context": "",
      "marks": 2,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch6-0039-point-1",
          "description": "−128 + 64 + 32 + 16 + 8 + 2 (or invert and add 1 to get 6)",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0039-point-2",
          "description": "Answer: −6",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "−6",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0040",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch6-0040",
      "questionNumber": 40,
      "topic": "Binary representation and arithmetic",
      "questionType": "explain",
      "commandWord": "define",
      "question": "State how many bits are in a nibble and how many different values it can represent.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch6-0040-point-1",
          "description": "4 bits",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0040-point-2",
          "description": "16 values (0 to 15)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "4 bits, 16 values",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0041",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch6-0041",
      "questionNumber": 41,
      "topic": "Character representation",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "In ASCII, 'A' is 65 and 'a' is 97. Explain how a program could convert any lower-case letter to upper case.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch6-0041-point-1",
          "description": "Upper- and lower-case codes differ by 32",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0041-point-2",
          "description": "Subtract 32 from the lower-case character's code (then convert back to a character)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Subtract 32 from the code of the lower-case letter, e.g. chr(ord(c) - 32).",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0042",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch6-0042",
      "questionNumber": 42,
      "topic": "Defensive design",
      "questionType": "algorithm-design",
      "commandWord": "describe",
      "question": "Describe how a program should handle a user entering an invalid option in a menu that accepts 1, 2 or 3.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO3",
      "markScheme": [
        {
          "id": "catalogue-batch6-0042-point-1",
          "description": "Check the input against the allowed values (validation)",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0042-point-2",
          "description": "Display an error message and ask again in a loop until a valid choice is entered",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Validate the choice and repeat the prompt with an error message until 1, 2 or 3 is entered.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0043",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch6-0043",
      "questionNumber": 43,
      "topic": "Programming languages and IDEs",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain what an assembler does.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch6-0043-point-1",
          "description": "Translates assembly language",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0043-point-2",
          "description": "into machine code",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "It translates assembly language mnemonics into machine code.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0044",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch6-0044",
      "questionNumber": 44,
      "topic": "Software development and testing",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe the main stages of the software development life cycle.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch6-0044-point-1",
          "description": "Analysis: identifying the requirements",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0044-point-2",
          "description": "Design: planning algorithms, interfaces and data",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0044-point-3",
          "description": "Implementation, testing and evaluation/maintenance",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Analysis, design, implementation, testing and evaluation/maintenance.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0045",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch6-0045",
      "questionNumber": 45,
      "topic": "Sound representation",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "Calculate the number of bits needed for one second of stereo sound sampled at 48,000 Hz with a 16-bit depth.",
      "context": "",
      "marks": 2,
      "difficulty": "higher",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch6-0045-point-1",
          "description": "48,000 × 16 = 768,000 bits per channel",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0045-point-2",
          "description": "× 2 channels = 1,536,000 bits",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "1,536,000 bits",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0046",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch6-0046",
      "questionNumber": 46,
      "topic": "Data compression",
      "questionType": "worked-calculation",
      "commandWord": "calculate",
      "question": "A 12 MB file is compressed to 3 MB. Calculate the percentage reduction in file size.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch6-0046-point-1",
          "description": "Reduction = 12 − 3 = 9 MB",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0046-point-2",
          "description": "9 ÷ 12 × 100 = 75%",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "75%",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0047",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch6-0047",
      "questionNumber": 47,
      "topic": "Hexadecimal",
      "questionType": "conversion",
      "commandWord": "calculate",
      "question": "Convert the binary number 11100111 into hexadecimal.",
      "context": "",
      "marks": 1,
      "difficulty": "foundation",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch6-0047-point-1",
          "description": "1110 = E and 0111 = 7 (answer E7)",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "E7",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0048",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch6-0048",
      "questionNumber": 48,
      "topic": "Image representation",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain why a small bitmap image looks blocky (pixelated) when it is enlarged.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch6-0048-point-1",
          "description": "The image has a fixed number of pixels",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0048-point-2",
          "description": "Enlarging makes each pixel bigger, so the individual squares become visible",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "There are no extra pixels to add detail, so each pixel is simply made bigger and becomes visible.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0049",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch6-0049",
      "questionNumber": 49,
      "topic": "Programming languages and IDEs",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Give two advantages of writing programs in a high-level language.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch6-0049-point-1",
          "description": "Any 2 from: Easier to read, write and understand (closer to English); Easier to debug/maintain; Portable: can run on different types of processor; One statement can do the work of many machine-code instructions.",
          "marks": 2
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "They are easier to read and debug and can run on different processors.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0050",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "EDEXCEL",
    "question": {
      "id": "catalogue-batch6-0050",
      "questionNumber": 50,
      "topic": "Cybersecurity",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain how anti-malware software protects a computer.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch6-0050-point-1",
          "description": "Scans files and compares them against a database of known malware signatures / watches for suspicious behaviour",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0050-point-2",
          "description": "Quarantines or deletes threats found",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "It scans for known malware signatures or suspicious behaviour and quarantines or removes threats.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0051",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch6-0051",
      "questionNumber": 51,
      "topic": "Sound representation",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain why music streaming services compress their audio files.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch6-0051-point-1",
          "description": "Any 2 from: Smaller files use less bandwidth / data; Music starts playing faster with less buffering; Less storage needed on servers and devices.",
          "marks": 2
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Compression makes files smaller so they stream quickly with less buffering and use less data.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0052",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch6-0052",
      "questionNumber": 52,
      "topic": "Defensive design",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain what is meant by anticipating misuse when designing a program.",
      "context": "",
      "marks": 2,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch6-0052-point-1",
          "description": "Thinking ahead about how users might enter unexpected or malicious input",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0052-point-2",
          "description": "Planning validation/authentication/error handling so the program does not crash or get exploited",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Predicting how users might misuse the program and adding checks so it copes safely.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0053",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch6-0053",
      "questionNumber": 53,
      "topic": "Programming languages and IDEs",
      "questionType": "explain",
      "commandWord": "state",
      "question": "State what a translator is and name its three types.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch6-0053-point-1",
          "description": "A translator converts code into machine code",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0053-point-2",
          "description": "Compiler, interpreter and assembler",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "A program that converts code to machine code: compiler, interpreter, assembler.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0054",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch6-0054",
      "questionNumber": 54,
      "topic": "Data representation",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain why computers use binary to represent data.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch6-0054-point-1",
          "description": "Computers are built from switches/transistors with two states (on/off)",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0054-point-2",
          "description": "Two states map directly to 1 and 0",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Transistors have two states, on and off, which represent 1 and 0.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0055",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch6-0055",
      "questionNumber": 55,
      "topic": "Computer networks",
      "questionType": "compare",
      "commandWord": "compare",
      "question": "Explain the difference between the internet and the World Wide Web.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch6-0055-point-1",
          "description": "The internet is a global network of interconnected networks (the infrastructure)",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0055-point-2",
          "description": "The World Wide Web is the collection of web pages/websites accessed over the internet",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "The internet is the worldwide network; the Web is the websites accessed using it.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0056",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch6-0056",
      "questionNumber": 56,
      "topic": "Ethical, legal and environmental impacts",
      "questionType": "explain",
      "commandWord": "explain",
      "question": "Explain what is meant by the digital divide and give two causes.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO2",
      "markScheme": [
        {
          "id": "catalogue-batch6-0056-point-1",
          "description": "The gap between people who have access to technology/the internet and those who do not",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0056-point-2",
          "description": "Cause: cost of devices/broadband",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0056-point-3",
          "description": "Cause: poor infrastructure in rural areas / lack of digital skills / age",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "The gap in access to technology, caused by cost, poor rural broadband and lack of skills.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0057",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch6-0057",
      "questionNumber": 57,
      "topic": "Algorithms",
      "questionType": "explain",
      "commandWord": "define",
      "question": "Explain what is meant by algorithmic thinking.",
      "context": "",
      "marks": 2,
      "difficulty": "foundation",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch6-0057-point-1",
          "description": "Working out the steps / set of rules needed to solve a problem",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0057-point-2",
          "description": "So the solution can be followed or programmed / reused",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "Identifying the sequence of steps needed to solve a problem.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  },
  {
    "key": "catalogue-batch6-0058",
    "sourceId": "cs-master-batch6",
    "sourceTitle": "CS Master varied catalogue",
    "qualification": "GCSE",
    "examBoard": "OCR",
    "question": {
      "id": "catalogue-batch6-0058",
      "questionNumber": 58,
      "topic": "Systems software",
      "questionType": "explain",
      "commandWord": "describe",
      "question": "Describe how an operating system manages files.",
      "context": "",
      "marks": 3,
      "difficulty": "standard",
      "assessmentObjective": "AO1",
      "markScheme": [
        {
          "id": "catalogue-batch6-0058-point-1",
          "description": "Organises files into folders/directories in a hierarchy",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0058-point-2",
          "description": "Allows files to be named, saved, moved, copied and deleted",
          "marks": 1
        },
        {
          "id": "catalogue-batch6-0058-point-3",
          "description": "Controls access permissions to files",
          "marks": 1
        }
      ],
      "levelDescriptors": [],
      "modelAnswer": "The OS organises files in folders, handles naming, saving, moving and deleting, and controls access rights.",
      "examinerGuidance": [
        "Award one mark for each valid marking point.",
        "Accept technically equivalent answers."
      ],
      "commonMisconceptions": []
    }
  }
];
