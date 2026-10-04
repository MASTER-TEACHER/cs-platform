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

  challenge({
    id: "gcse-f-rectangle-area",
    title: "Rectangle Area",
    description: "Read width and height and output the area.",
    topicId: "programming",
    skills: ["input-output", "variables", "arithmetic"],
    difficulty: "foundation",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `w = int(input())
h = int(input())
# Calculate and print the area.
`,
    stdin: "4\n7",
    visibleTests: [visible("r1", "4 by 7", "4\n7", "28")],
    hiddenTests: [hidden("r2", "1 by 9", "1\n9", "9"), hidden("r3", "6 by 6", "6\n6", "36")],
    hint: "Multiply the two dimensions.",
    secondHint: "Read both inputs before calculating.",
    explanation: "Sequence, input and arithmetic combine to solve a simple calculation.",
    examinerTip: "Use meaningful variables and convert input to the required numeric type.",
    xpReward: 45,
    estimatedMinutes: 4,
  }),
  challenge({
    id: "gcse-f-temperature",
    title: "Temperature Converter",
    description: "Convert Celsius to Fahrenheit using F = C * 9 / 5 + 32.",
    topicId: "programming",
    skills: ["input-output", "arithmetic"],
    difficulty: "foundation",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `c = float(input())
# Convert c to Fahrenheit and print the result.
`,
    stdin: "0",
    visibleTests: [visible("zero", "0 C", "0", "32.0")],
    hiddenTests: [hidden("hundred", "100 C", "100", "212.0")],
    hint: "Use the formula in the description.",
    secondHint: "Python / produces a floating-point result.",
    explanation: "Translate the stated formula accurately into code.",
    examinerTip: "Check operator precedence when implementing formulas.",
    xpReward: 45,
    estimatedMinutes: 4,
  }),
  challenge({
    id: "gcse-f-even-odd",
    title: "Even or Odd",
    description: "Output Even when an integer is even, otherwise Odd.",
    topicId: "programming",
    skills: ["selection", "arithmetic"],
    difficulty: "foundation",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `n = int(input())
# Output Even or Odd.
`,
    stdin: "8",
    visibleTests: [visible("even", "Even value", "8", "Even")],
    hiddenTests: [hidden("odd", "Odd value", "7", "Odd"), hidden("zero", "Zero", "0", "Even")],
    hint: "Use the remainder operator.",
    secondHint: "An even number has n % 2 equal to 0.",
    explanation: "Modulo is useful for divisibility tests.",
    examinerTip: "Remember that zero is even.",
    xpReward: 50,
    estimatedMinutes: 5,
  }),
  challenge({
    id: "gcse-f-largest-two",
    title: "Largest of Two",
    description: "Read two integers and output the larger value.",
    topicId: "programming",
    skills: ["selection", "input-output"],
    difficulty: "foundation",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `a = int(input())
b = int(input())
# Print the larger value.
`,
    stdin: "3\n9",
    visibleTests: [visible("b", "Second larger", "3\n9", "9")],
    hiddenTests: [hidden("a", "First larger", "12\n2", "12"), hidden("equal", "Equal", "5\n5", "5")],
    hint: "Compare a and b.",
    secondHint: "Handle equality as well as either value being larger.",
    explanation: "Selection chooses behaviour from a condition.",
    examinerTip: "Test equality as an edge case.",
    xpReward: 50,
    estimatedMinutes: 5,
  }),
  challenge({
    id: "gcse-f-name-length",
    title: "Name Length",
    description: "Read a line of text and output its number of characters.",
    topicId: "programming",
    skills: ["strings", "input-output"],
    difficulty: "foundation",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `name = input()
# Output the number of characters.
`,
    stdin: "Ada",
    visibleTests: [visible("ada", "Ada", "Ada", "3")],
    hiddenTests: [hidden("one", "One character", "X", "1"), hidden("space", "Includes space", "CS Master", "9")],
    hint: "Python has a built-in length function.",
    secondHint: "Use len(name).",
    explanation: "Strings are sequences and len returns their character count.",
    examinerTip: "Spaces are characters too.",
    xpReward: 45,
    estimatedMinutes: 4,
  }),
  challenge({
    id: "gcse-f-repeat-word",
    title: "Repeat a Word",
    description: "Read a word and a count, then print the word that many times on separate lines.",
    topicId: "programming",
    skills: ["iteration", "input-output"],
    difficulty: "foundation",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `word = input()
count = int(input())
# Repeat word count times.
`,
    stdin: "Hi\n3",
    visibleTests: [visible("three", "Three repeats", "Hi\n3", "Hi\nHi\nHi")],
    hiddenTests: [hidden("one", "One repeat", "Go\n1", "Go")],
    hint: "Use a counted loop.",
    secondHint: "range(count) repeats exactly count times.",
    explanation: "Counted iteration is appropriate when the repeat count is known.",
    examinerTip: "Watch loop bounds carefully.",
    xpReward: 55,
    estimatedMinutes: 5,
  }),
  challenge({
    id: "gcse-f-list-sum",
    title: "Sum Three Scores",
    description: "Read three integer scores and output their total.",
    topicId: "programming",
    skills: ["lists", "iteration", "arithmetic"],
    difficulty: "foundation",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `scores = [int(input()), int(input()), int(input())]
# Output the total.
`,
    stdin: "2\n4\n6",
    visibleTests: [visible("basic", "2,4,6", "2\n4\n6", "12")],
    hiddenTests: [hidden("zeros", "Zeros", "0\n0\n0", "0"), hidden("mixed", "Mixed", "10\n5\n1", "16")],
    hint: "You can use sum or iterate with an accumulator.",
    secondHint: "The list already contains all three integers.",
    explanation: "A list groups related values that can be processed together.",
    examinerTip: "Know when a built-in operation is suitable.",
    xpReward: 55,
    estimatedMinutes: 5,
  }),
  challenge({
    id: "gcse-f-password-length",
    title: "Password Length Check",
    description: "Output Valid if a password has at least 8 characters, otherwise Too short.",
    topicId: "programming",
    skills: ["strings", "selection", "validation"],
    difficulty: "foundation",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `password = input()
# Validate its length.
`,
    stdin: "computer",
    visibleTests: [visible("valid", "Eight chars", "computer", "Valid")],
    hiddenTests: [hidden("short", "Short", "abc", "Too short"), hidden("long", "Long", "computerscience", "Valid")],
    hint: "Compare len(password) with 8.",
    secondHint: "At least means >=.",
    explanation: "Validation checks data against stated rules.",
    examinerTip: "Translate boundary wording exactly.",
    xpReward: 55,
    estimatedMinutes: 5,
  }),
  challenge({
    id: "gcse-f-function-square",
    title: "Square Function",
    description: "Complete square(number) so it returns the square of its argument.",
    topicId: "programming",
    skills: ["functions", "arithmetic"],
    difficulty: "foundation",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `def square(number):
    # Return number squared.
    pass

print(square(int(input())))
`,
    stdin: "5",
    visibleTests: [visible("five", "square(5)", "5", "25")],
    hiddenTests: [hidden("zero", "Zero", "0", "0"), hidden("negative", "Negative", "-4", "16")],
    hint: "Return a multiplication result.",
    secondHint: "Return number * number.",
    explanation: "Functions package reusable behaviour and can return a value.",
    examinerTip: "Do not confuse print with return.",
    xpReward: 55,
    estimatedMinutes: 5,
  }),
  challenge({
    id: "al-f-absolute-difference",
    title: "Absolute Difference Function",
    description: "Complete a function returning the absolute difference between two integers.",
    topicId: "advanced-programming",
    skills: ["functions", "selection", "arithmetic"],
    difficulty: "foundation",
    qualifications: ["A_LEVEL"],
    examBoards: ["AQA", "OCR"],
    starterCode: `def difference(a, b):
    # Return the absolute difference.
    pass

a = int(input())
b = int(input())
print(difference(a, b))
`,
    stdin: "9\n4",
    visibleTests: [visible("basic", "9 and 4", "9\n4", "5")],
    hiddenTests: [hidden("reverse", "Reverse order", "2\n10", "8"), hidden("equal", "Equal", "7\n7", "0")],
    hint: "The result must never be negative.",
    secondHint: "Use abs(a - b), or selection.",
    explanation: "A function can encapsulate a small deterministic calculation.",
    examinerTip: "Consider all input orderings.",
    xpReward: 60,
    estimatedMinutes: 5,
  }),
  challenge({
    id: "al-f-count-positive",
    title: "Count Positive Values",
    description: "Read five integers and output how many are greater than zero.",
    topicId: "advanced-programming",
    skills: ["iteration", "selection", "variables"],
    difficulty: "foundation",
    qualifications: ["A_LEVEL"],
    examBoards: ["AQA", "OCR"],
    starterCode: `values = [int(input()) for _ in range(5)]
count = 0
# Count positive values.
print(count)
`,
    stdin: "1\n-2\n3\n0\n5",
    visibleTests: [visible("mix", "Mixed values", "1\n-2\n3\n0\n5", "3")],
    hiddenTests: [hidden("none", "No positives", "0\n-1\n-2\n-3\n-4", "0")],
    hint: "Use a loop and increment count conditionally.",
    secondHint: "Positive means strictly greater than zero.",
    explanation: "Counters are a common iteration pattern.",
    examinerTip: "Distinguish > 0 from >= 0.",
    xpReward: 60,
    estimatedMinutes: 6,
  }),
];

