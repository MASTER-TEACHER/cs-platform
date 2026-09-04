import {
  challenge,
  hidden,
  visible,
} from "./helpers";

export const foundationProgrammingChallenges = [
  challenge({
    id: "gcse-f-output-total",
    title: "Output a Total",
    description:
      "Store two values, calculate their total and print it.",
    topicId: "programming",
    skills: [
      "sequence",
      "variables",
      "arithmetic",
      "input-output",
    ],
    difficulty: "foundation",
    qualifications: ["GCSE"],
    examBoards: [
      "AQA",
      "OCR",
      "EDEXCEL",
    ],
    starterCode: `first = 7
second = 5

# Calculate the total and print it.
`,
    visibleTests: [
      visible(
        "main",
        "Given values",
        "",
        "12",
      ),
    ],
    hint:
      "Create a total using first + second.",
    secondHint:
      "Use print(first + second).",
    explanation:
      "Variables can store numeric data and expressions can be output with print().",
    examinerTip:
      "Keep the sequence clear: store, calculate, output.",
    xpReward: 40,
    estimatedMinutes: 4,
  }),

  challenge({
    id: "gcse-f-pass-fail",
    title: "Pass or Fail",
    description:
      "Use selection to output Pass for marks of 40 or more.",
    topicId: "programming",
    skills: [
      "selection",
      "input-output",
    ],
    difficulty: "foundation",
    qualifications: ["GCSE"],
    examBoards: [
      "AQA",
      "OCR",
      "EDEXCEL",
    ],
    starterCode: `mark = int(input())

# Output Pass for 40 or more.
# Otherwise output Fail.
`,
    stdin: "55",
    visibleTests: [
      visible(
        "pass",
        "Passing mark",
        "55",
        "Pass",
      ),
      visible(
        "boundary",
        "Boundary mark",
        "40",
        "Pass",
      ),
    ],
    hiddenTests: [
      hidden(
        "fail",
        "Hidden failing mark",
        "39",
        "Fail",
      ),
    ],
    hint:
      "Use an if statement and an else branch.",
    secondHint:
      "The condition should be mark >= 40.",
    explanation:
      "Selection executes different code according to a Boolean condition.",
    examinerTip:
      "Always test boundary values.",
    xpReward: 55,
    estimatedMinutes: 6,
  }),

  challenge({
    id: "gcse-f-countdown",
    title: "Simple Countdown",
    description:
      "Use iteration to output 3, 2, 1.",
    topicId: "programming",
    skills: [
      "iteration",
      "sequence",
    ],
    difficulty: "foundation",
    qualifications: ["GCSE"],
    examBoards: [
      "AQA",
      "OCR",
      "EDEXCEL",
    ],
    starterCode: `# Output:
# 3
# 2
# 1

`,
    visibleTests: [
      visible(
        "countdown",
        "Countdown",
        "",
        "3\n2\n1",
      ),
    ],
    hint:
      "Use range() with a negative step.",
    secondHint:
      "range(3, 0, -1) produces 3, 2, 1.",
    explanation:
      "range(start, stop, step) excludes the stop value.",
    examinerTip:
      "Trace the first value, stopping rule and step.",
    xpReward: 55,
    estimatedMinutes: 6,
  }),

  /*
   * ============================================================
   * A-LEVEL FOUNDATION / WARM-UP CHALLENGES
   * ============================================================
   *
   * These provide multiple independent programming signals for
   * Advanced Programming rather than forcing students to repeat
   * a single challenge.
   */

  challenge({
    id: "al-f-cube-function",
    title:
      "A-Level Warm-up: Cube a Number",
    description:
      "Create a function that returns the cube of its argument.",
    topicId:
      "advanced-programming",
    curriculumTopicIds: [
      "advanced-programming",
    ],
    skills: [
      "functions",
      "arithmetic",
    ],
    difficulty: "foundation",
    qualifications: ["A_LEVEL"],
    examBoards: [
      "AQA",
      "OCR",
    ],
    starterCode: `def cube(number):
    # Return number cubed.
    pass

print(cube(int(input())))
`,
    stdin: "3",
    visibleTests: [
      visible(
        "three",
        "cube(3)",
        "3",
        "27",
      ),
    ],
    hiddenTests: [
      hidden(
        "zero",
        "Hidden zero",
        "0",
        "0",
      ),
      hidden(
        "negative",
        "Hidden negative",
        "-2",
        "-8",
      ),
    ],
    hint:
      "Use return inside the function.",
    secondHint:
      "Return number * number * number.",
    explanation:
      "Functions package reusable behaviour and return values to callers.",
    examinerTip:
      "Distinguish parameters, return values and side effects.",
    xpReward: 55,
    estimatedMinutes: 5,
  }),

  challenge({
    id: "al-f-positive-negative-zero",
    title:
      "A-Level Warm-up: Classify a Number",
    description:
      "Write a function that returns Positive, Negative or Zero.",
    topicId:
      "advanced-programming",
    curriculumTopicIds: [
      "advanced-programming",
    ],
    skills: [
      "functions",
      "selection",
    ],
    difficulty: "foundation",
    qualifications: ["A_LEVEL"],
    examBoards: [
      "AQA",
      "OCR",
    ],
    starterCode: `def classify(number):
    # Return Positive, Negative or Zero.
    pass

print(classify(int(input())))
`,
    stdin: "8",
    visibleTests: [
      visible(
        "positive",
        "Positive value",
        "8",
        "Positive",
      ),
    ],
    hiddenTests: [
      hidden(
        "negative",
        "Hidden negative value",
        "-4",
        "Negative",
      ),
      hidden(
        "zero",
        "Hidden zero value",
        "0",
        "Zero",
      ),
    ],
    hint:
      "Use if, elif and else.",
    secondHint:
      "Test number > 0 and number < 0.",
    explanation:
      "Multi-branch selection allows a program to choose between several mutually exclusive outcomes.",
    examinerTip:
      "Make sure all possible values are handled.",
    xpReward: 60,
    estimatedMinutes: 6,
  }),

  challenge({
    id: "al-f-largest-of-two",
    title:
      "A-Level Warm-up: Larger Value",
    description:
      "Create a function that returns the larger of two integers.",
    topicId:
      "advanced-programming",
    curriculumTopicIds: [
      "advanced-programming",
    ],
    skills: [
      "functions",
      "selection",
      "arithmetic",
    ],
    difficulty: "foundation",
    qualifications: ["A_LEVEL"],
    examBoards: [
      "AQA",
      "OCR",
    ],
    starterCode: `def larger(first, second):
    # Return the larger value.
    pass

values = input().split()
print(larger(int(values[0]), int(values[1])))
`,
    stdin: "7 12",
    visibleTests: [
      visible(
        "second-larger",
        "Second value larger",
        "7 12",
        "12",
      ),
    ],
    hiddenTests: [
      hidden(
        "first-larger",
        "Hidden first value larger",
        "15 3",
        "15",
      ),
      hidden(
        "equal",
        "Hidden equal values",
        "9 9",
        "9",
      ),
    ],
    hint:
      "Compare first and second.",
    secondHint:
      "Return first when first >= second; otherwise return second.",
    explanation:
      "A function can combine parameters, selection and a return value to encapsulate a decision.",
    examinerTip:
      "Remember to consider equal values as a boundary case.",
    xpReward: 65,
    estimatedMinutes: 6,
  }),

  challenge({
    id: "al-f-list-total",
    title:
      "A-Level Warm-up: Total a List",
    description:
      "Write a function that calculates the total of a list without using sum().",
    topicId:
      "advanced-programming",
    curriculumTopicIds: [
      "advanced-programming",
    ],
    skills: [
      "functions",
      "iteration",
      "variables",
      "arithmetic",
    ],
    difficulty: "foundation",
    qualifications: ["A_LEVEL"],
    examBoards: [
      "AQA",
      "OCR",
    ],
    starterCode: `def total_values(values):
    total = 0

    # Add each value to total.

    return total

numbers = [int(value) for value in input().split()]
print(total_values(numbers))
`,
    stdin: "2 4 6",
    visibleTests: [
      visible(
        "three-values",
        "Three values",
        "2 4 6",
        "12",
      ),
    ],
    hiddenTests: [
      hidden(
        "single",
        "Hidden single value",
        "9",
        "9",
      ),
      hidden(
        "mixed",
        "Hidden mixed values",
        "-2 5 3",
        "6",
      ),
    ],
    hint:
      "Iterate through values and update total.",
    secondHint:
      "Inside the loop use total = total + value.",
    explanation:
      "Iteration can accumulate a result by updating a variable for every item in a collection.",
    examinerTip:
      "Be able to trace accumulator variables through each iteration.",
    xpReward: 70,
    estimatedMinutes: 7,
  }),

  challenge({
    id: "al-f-count-matches",
    title:
      "A-Level Warm-up: Count Matches",
    description:
      "Count how many values in a list are equal to a target value.",
    topicId:
      "advanced-programming",
    curriculumTopicIds: [
      "advanced-programming",
    ],
    skills: [
      "functions",
      "iteration",
      "selection",
      "variables",
    ],
    difficulty: "foundation",
    qualifications: ["A_LEVEL"],
    examBoards: [
      "AQA",
      "OCR",
    ],
    starterCode: `def count_matches(values, target):
    count = 0

    # Count values equal to target.

    return count

parts = input().split()
target = int(parts[0])
values = [int(value) for value in parts[1:]]
print(count_matches(values, target))
`,
    stdin: "4 2 4 1 4 7",
    visibleTests: [
      visible(
        "several",
        "Several matches",
        "4 2 4 1 4 7",
        "2",
      ),
    ],
    hiddenTests: [
      hidden(
        "none",
        "Hidden no matches",
        "9 1 2 3",
        "0",
      ),
      hidden(
        "all",
        "Hidden all match",
        "5 5 5 5",
        "3",
      ),
    ],
    hint:
      "Loop through the values and compare each one with target.",
    secondHint:
      "Increment count only when value == target.",
    explanation:
      "Counting algorithms combine iteration, selection and an accumulator.",
    examinerTip:
      "Distinguish counting occurrences from calculating a total.",
    xpReward: 75,
    estimatedMinutes: 8,
  }),
];