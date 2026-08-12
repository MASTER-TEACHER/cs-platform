import { challenge, hidden, visible } from "./helpers";

export const foundationProgrammingChallenges = [
  challenge({
    id: "gcse-f-output-total",
    title: "Output a Total",
    description: "Store two values, calculate their total and print it.",
    topicId: "programming",
    skills: ["sequence", "variables", "arithmetic", "input-output"],
    difficulty: "foundation",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `first = 7
second = 5

# Calculate the total and print it.
`,
    visibleTests: [visible("main", "Given values", "", "12")],
    hint: "Create a total using first + second.",
    secondHint: "Use print(first + second).",
    explanation: "Variables can store numeric data and expressions can be output with print().",
    examinerTip: "Keep the sequence clear: store, calculate, output.",
    xpReward: 40,
    estimatedMinutes: 4,
  }),
  challenge({
    id: "gcse-f-pass-fail",
    title: "Pass or Fail",
    description: "Use selection to output Pass for marks of 40 or more.",
    topicId: "programming",
    skills: ["selection", "input-output"],
    difficulty: "foundation",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `mark = int(input())

# Output Pass for 40 or more.
# Otherwise output Fail.
`,
    stdin: "55",
    visibleTests: [
      visible("pass", "Passing mark", "55", "Pass"),
      visible("boundary", "Boundary mark", "40", "Pass"),
    ],
    hiddenTests: [hidden("fail", "Hidden failing mark", "39", "Fail")],
    hint: "Use an if statement and an else branch.",
    secondHint: "The condition should be mark >= 40.",
    explanation: "Selection executes different code according to a Boolean condition.",
    examinerTip: "Always test boundary values.",
    xpReward: 55,
    estimatedMinutes: 6,
  }),
  challenge({
    id: "gcse-f-countdown",
    title: "Simple Countdown",
    description: "Use iteration to output 3, 2, 1.",
    topicId: "programming",
    skills: ["iteration", "sequence"],
    difficulty: "foundation",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `# Output:
# 3
# 2
# 1

`,
    visibleTests: [visible("countdown", "Countdown", "", "3\n2\n1")],
    hint: "Use range() with a negative step.",
    secondHint: "range(3, 0, -1) produces 3, 2, 1.",
    explanation: "range(start, stop, step) excludes the stop value.",
    examinerTip: "Trace the first value, stopping rule and step.",
    xpReward: 55,
    estimatedMinutes: 6,
  }),
  challenge({
    id: "al-f-cube-function",
    title: "A-Level Warm-up: Cube a Number",
    description: "Create a function that returns the cube of its argument.",
    topicId: "advanced-programming",
    skills: ["functions", "arithmetic"],
    difficulty: "foundation",
    qualifications: ["A_LEVEL"],
    examBoards: ["AQA", "OCR"],
    starterCode: `def cube(number):
    # Return number cubed.
    pass

print(cube(int(input())))
`,
    stdin: "3",
    visibleTests: [visible("three", "cube(3)", "3", "27")],
    hiddenTests: [
      hidden("zero", "Hidden zero", "0", "0"),
      hidden("negative", "Hidden negative", "-2", "-8"),
    ],
    hint: "Use return inside the function.",
    secondHint: "Return number * number * number.",
    explanation: "Functions package reusable behaviour and return values to callers.",
    examinerTip: "Distinguish parameters, return values and side effects.",
    xpReward: 55,
    estimatedMinutes: 5,
  }),
];
