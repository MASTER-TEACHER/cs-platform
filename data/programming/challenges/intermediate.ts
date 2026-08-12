import { challenge, hidden, visible } from "./helpers";

export const intermediateProgrammingChallenges = [
  challenge({
    id: "gcse-i-running-total",
    title: "Running Total",
    description: "Calculate the total from 1 to n using iteration.",
    topicId: "programming",
    skills: ["iteration", "variables", "arithmetic"],
    difficulty: "intermediate",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `n = int(input())
total = 0

# Add every integer from 1 to n.

print(total)
`,
    stdin: "5",
    visibleTests: [visible("n5", "n = 5", "5", "15")],
    hiddenTests: [
      hidden("n1", "Hidden n = 1", "1", "1"),
      hidden("n10", "Hidden n = 10", "10", "55"),
    ],
    hint: "Use a running total inside a loop.",
    secondHint: "Loop over range(1, n + 1).",
    explanation: "A running total accumulates values during iteration.",
    examinerTip: "Check for off-by-one errors.",
    xpReward: 70,
  }),
  challenge({
    id: "gcse-i-function-double",
    title: "Reusable Function",
    description: "Complete a function that returns twice its argument.",
    topicId: "programming",
    skills: ["functions", "arithmetic"],
    difficulty: "intermediate",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `def double(number):
    # Return twice number.
    pass

print(double(int(input())))
`,
    stdin: "9",
    visibleTests: [visible("nine", "double(9)", "9", "18")],
    hiddenTests: [
      hidden("zero", "Hidden zero", "0", "0"),
      hidden("negative", "Hidden negative", "-4", "-8"),
    ],
    hint: "Use return inside the function.",
    secondHint: "return number * 2",
    explanation: "return sends a value back to the caller.",
    examinerTip: "Do not confuse print() with return.",
    xpReward: 75,
  }),
  challenge({
    id: "gcse-i-validation",
    title: "Validate a Mark",
    description: "Keep reading marks until the value is between 0 and 100 inclusive.",
    topicId: "programming",
    skills: ["validation", "iteration", "selection", "input-output"],
    difficulty: "intermediate",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `mark = int(input())

# Keep reading another mark while the current one is invalid.

print(mark)
`,
    stdin: "150\n-2\n73",
    visibleTests: [visible("main", "Invalid then valid", "150\n-2\n73", "73")],
    hiddenTests: [hidden("valid", "Hidden already-valid", "40", "40")],
    hint: "Continue while mark < 0 or mark > 100.",
    secondHint: "Read a new mark inside the while loop.",
    explanation: "Validation repeats until input satisfies the acceptance rule.",
    examinerTip: "Validation checks acceptability, not truth.",
    xpReward: 85,
  }),
  challenge({
    id: "al-i-factorial",
    title: "Recursive Factorial",
    description: "Implement factorial using recursion.",
    topicId: "advanced-programming",
    curriculumTopicIds: ["advanced-programming", "theory-computation"],
    skills: ["recursion", "functions", "algorithmic-thinking"],
    difficulty: "intermediate",
    qualifications: ["A_LEVEL"],
    examBoards: ["AQA", "OCR"],
    starterCode: `def factorial(n):
    # Complete the recursive function.
    pass

print(factorial(int(input())))
`,
    stdin: "5",
    visibleTests: [visible("five", "factorial(5)", "5", "120")],
    hiddenTests: [
      hidden("zero", "Hidden factorial(0)", "0", "1"),
      hidden("one", "Hidden factorial(1)", "1", "1"),
    ],
    hint: "Use a base case and a recursive case.",
    secondHint: "Return 1 for n <= 1; otherwise return n * factorial(n - 1).",
    explanation: "Each recursive call reduces the problem until the base case.",
    examinerTip: "Explain how the argument moves toward the base case.",
    xpReward: 105,
    estimatedMinutes: 10,
  }),
];
