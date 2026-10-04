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

  challenge({
    id: "gcse-i-average",
    title: "Average of Scores",
    description: "Read n followed by n integer scores and output their arithmetic mean.",
    topicId: "programming",
    skills: ["iteration", "lists", "arithmetic"],
    difficulty: "intermediate",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `n = int(input())
scores = [int(input()) for _ in range(n)]
# Output the mean.
`,
    stdin: "4\n10\n20\n30\n40",
    visibleTests: [visible("four", "Four scores", "4\n10\n20\n30\n40", "25.0")],
    hiddenTests: [hidden("one", "One score", "1\n7", "7.0")],
    hint: "Mean is total divided by count.",
    secondHint: "Use sum(scores) / n.",
    explanation: "Accumulators and counts support average calculations.",
    examinerTip: "Consider whether the input guarantees n > 0.",
    xpReward: 75,
    estimatedMinutes: 7,
  }),
  challenge({
    id: "gcse-i-linear-search",
    title: "Linear Search",
    description: "Read a target and five integers. Output the first index of the target, or -1 if absent.",
    topicId: "programming",
    skills: ["searching", "lists", "iteration", "selection"],
    difficulty: "intermediate",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `target = int(input())
values = [int(input()) for _ in range(5)]
# Output first matching index or -1.
`,
    stdin: "7\n2\n7\n4\n7\n9",
    visibleTests: [visible("found", "First match", "7\n2\n7\n4\n7\n9", "1")],
    hiddenTests: [hidden("absent", "Absent", "8\n2\n7\n4\n7\n9", "-1")],
    hint: "Scan from index 0 upward.",
    secondHint: "Stop or preserve the first match.",
    explanation: "Linear search checks items in sequence.",
    examinerTip: "A correct algorithm must define the not-found result.",
    xpReward: 85,
    estimatedMinutes: 9,
  }),
  challenge({
    id: "gcse-i-count-character",
    title: "Character Frequency",
    description: "Read text and a one-character target and output how many times it occurs.",
    topicId: "programming",
    skills: ["strings", "iteration", "selection"],
    difficulty: "intermediate",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `text = input()
target = input()
count = 0
# Count exact matches.
print(count)
`,
    stdin: "banana\na",
    visibleTests: [visible("banana", "Count a", "banana\na", "3")],
    hiddenTests: [hidden("none", "No match", "computer\nz", "0"), hidden("case", "Case sensitive", "AaA\na", "1")],
    hint: "Iterate through each character.",
    secondHint: "Increment only when character == target.",
    explanation: "Strings can be traversed like other sequences.",
    examinerTip: "State whether comparisons are case-sensitive.",
    xpReward: 75,
    estimatedMinutes: 7,
  }),
  challenge({
    id: "gcse-i-validation-range",
    title: "Validated Mark",
    description: "Keep asking for an integer mark until it is between 0 and 100 inclusive, then print Accepted.",
    topicId: "programming",
    skills: ["validation", "iteration", "selection"],
    difficulty: "intermediate",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `mark = int(input())
# Keep reading while mark is invalid.
# Then print Accepted.
`,
    stdin: "120\n-1\n75",
    visibleTests: [visible("retry", "Two invalid then valid", "120\n-1\n75", "Accepted")],
    hiddenTests: [hidden("low", "Lower boundary", "0", "Accepted"), hidden("high", "Upper boundary", "100", "Accepted")],
    hint: "Use a while condition for values outside the range.",
    secondHint: "Invalid means mark < 0 or mark > 100.",
    explanation: "Validation often requires repetition until acceptable data is supplied.",
    examinerTip: "Boundary values should be tested explicitly.",
    xpReward: 80,
    estimatedMinutes: 8,
  }),
  challenge({
    id: "gcse-i-file-lines",
    title: "Count File Records",
    description: "The variable data contains newline-separated names. Output the number of non-empty records.",
    topicId: "programming",
    skills: ["files", "strings", "iteration"],
    difficulty: "intermediate",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `data = input()
# Input uses | to represent line breaks in this exercise.
data = data.replace("|", "\n")
# Count non-empty lines.
`,
    stdin: "Ada|Grace|Alan",
    visibleTests: [visible("three", "Three records", "Ada|Grace|Alan", "3")],
    hiddenTests: [hidden("empty", "Empty middle", "Ada||Alan", "2")],
    hint: "Split the string into lines and ignore empty strings.",
    secondHint: "data.splitlines() creates a list of lines.",
    explanation: "File processing commonly iterates through records or lines.",
    examinerTip: "Be explicit about blank records.",
    xpReward: 80,
    estimatedMinutes: 8,
  }),
  challenge({
    id: "gcse-i-bubble-pass",
    title: "One Bubble Pass",
    description: "Read four integers, perform one left-to-right bubble-sort pass in ascending order, and print the values space-separated.",
    topicId: "programming",
    skills: ["sorting", "lists", "iteration", "selection"],
    difficulty: "intermediate",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `values = [int(input()) for _ in range(4)]
# Perform ONE bubble-sort pass.
print(*values)
`,
    stdin: "5\n2\n4\n1",
    visibleTests: [visible("pass", "One pass", "5\n2\n4\n1", "2 4 1 5")],
    hiddenTests: [hidden("sorted", "Already sorted", "1\n2\n3\n4", "1 2 3 4")],
    hint: "Compare adjacent items and swap when left > right.",
    secondHint: "Loop to len(values)-1.",
    explanation: "Bubble sort moves a large value toward the end during a pass.",
    examinerTip: "Do not accidentally implement a full sort when one pass is requested.",
    xpReward: 90,
    estimatedMinutes: 9,
  }),
  challenge({
    id: "gcse-i-caesar",
    title: "Caesar Shift Lowercase",
    description: "Read a lowercase word and a shift from 0 to 25. Output the shifted lowercase word, wrapping after z.",
    topicId: "programming",
    skills: ["strings", "iteration", "arithmetic"],
    difficulty: "intermediate",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `text = input()
shift = int(input())
result = ""
# Shift each lowercase letter.
print(result)
`,
    stdin: "xyz\n3",
    visibleTests: [visible("wrap", "Wrap around", "xyz\n3", "abc")],
    hiddenTests: [hidden("zero", "Zero shift", "code\n0", "code")],
    hint: "Convert letters to numeric positions.",
    secondHint: "Use modulo 26 before converting back.",
    explanation: "Modulo implements wrap-around cleanly.",
    examinerTip: "Keep the stated character range in mind.",
    xpReward: 95,
    estimatedMinutes: 10,
  }),
  challenge({
    id: "gcse-i-two-d-list",
    title: "Row Totals",
    description: "Read six integers representing a 2 by 3 grid and output the total of each row on separate lines.",
    topicId: "programming",
    skills: ["lists", "iteration", "arithmetic"],
    difficulty: "intermediate",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `grid = [[int(input()) for _ in range(3)] for _ in range(2)]
# Output each row total.
`,
    stdin: "1\n2\n3\n4\n5\n6",
    visibleTests: [visible("grid", "1 to 6", "1\n2\n3\n4\n5\n6", "6\n15")],
    hiddenTests: [hidden("zeros", "Zeros", "0\n0\n0\n1\n1\n1", "0\n3")],
    hint: "Each row is itself a list.",
    secondHint: "Iterate through grid and sum each row.",
    explanation: "Two-dimensional structures can be processed row by row.",
    examinerTip: "Keep row and column dimensions clear.",
    xpReward: 85,
    estimatedMinutes: 8,
  }),
  challenge({
    id: "al-i-stack-check",
    title: "Balanced Parentheses",
    description: "Read a string containing parentheses and other characters. Output Balanced if parentheses are balanced, otherwise Unbalanced.",
    topicId: "data-structures",
    skills: ["stacks", "iteration", "selection", "strings"],
    difficulty: "intermediate",
    qualifications: ["A_LEVEL"],
    examBoards: ["AQA", "OCR"],
    starterCode: `text = input()
stack = []
# Use stack to check parentheses.
`,
    stdin: "a*(b+c)",
    visibleTests: [visible("balanced", "Balanced", "a*(b+c)", "Balanced")],
    hiddenTests: [hidden("open", "Missing close", "((a)", "Unbalanced"), hidden("close", "Extra close", "a)", "Unbalanced")],
    hint: "Push opening brackets and pop on closing brackets.",
    secondHint: "A closing bracket cannot pop an empty stack; the stack must be empty at the end.",
    explanation: "A stack naturally models nested delimiters.",
    examinerTip: "Handle both premature closing and leftover opening brackets.",
    xpReward: 100,
    estimatedMinutes: 10,
  }),
  challenge({
    id: "al-i-queue",
    title: "Queue Simulation",
    description: "Read comma-separated queue items and output them in FIFO order, one per line.",
    topicId: "data-structures",
    skills: ["queues", "lists", "iteration"],
    difficulty: "intermediate",
    qualifications: ["A_LEVEL"],
    examBoards: ["AQA", "OCR"],
    starterCode: `items = input().split(",")
# Process items in FIFO order.
`,
    stdin: "A,B,C",
    visibleTests: [visible("abc", "Three items", "A,B,C", "A\nB\nC")],
    hiddenTests: [hidden("one", "One item", "X", "X")],
    hint: "FIFO means first in, first out.",
    secondHint: "Iterating from the start preserves arrival order.",
    explanation: "Queues model first-in-first-out processing.",
    examinerTip: "Contrast queue order with a stack.",
    xpReward: 90,
    estimatedMinutes: 8,
  }),
  challenge({
    id: "al-i-recursive-sum",
    title: "Recursive Sum",
    description: "Complete recursive_sum(n) to return 1+2+...+n for n >= 0.",
    topicId: "advanced-programming",
    skills: ["recursion", "functions", "arithmetic"],
    difficulty: "intermediate",
    qualifications: ["A_LEVEL"],
    examBoards: ["AQA", "OCR"],
    starterCode: `def recursive_sum(n):
    # Return 1 + ... + n recursively.
    pass

print(recursive_sum(int(input())))
`,
    stdin: "5",
    visibleTests: [visible("five", "n=5", "5", "15")],
    hiddenTests: [hidden("zero", "Base case", "0", "0"), hidden("one", "n=1", "1", "1")],
    hint: "Define a base case first.",
    secondHint: "Return 0 for n == 0, otherwise n + recursive_sum(n-1).",
    explanation: "Recursion needs a base case and progress toward it.",
    examinerTip: "Explain termination as well as the recursive step.",
    xpReward: 100,
    estimatedMinutes: 10,
  }),
];

