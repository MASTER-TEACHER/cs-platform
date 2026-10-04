import { challenge, hidden, visible } from "./challenges/helpers";

export const debugProgrammingChallenges = [
  challenge({
    id: "debug-f-missing-colon",
    title: "Repair the Selection",
    description: "Fix the syntax error without changing the intended result.",
    topicId: "programming",
    skills: ["debugging", "selection"],
    mode: "debug",
    difficulty: "foundation",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `temperature = int(input())

if temperature < 5
    print("Cold")
else:
    print("Not cold")
`,
    stdin: "3",
    visibleTests: [visible("cold", "Cold input", "3", "Cold")],
    hiddenTests: [hidden("warm", "Hidden warm input", "8", "Not cold")],
    hint: "The grammar of the if statement is incomplete.",
    secondHint: "Python if headers end with a colon.",
    explanation: "The program contains a syntax error because the if statement is missing its colon.",
    examinerTip: "Syntax errors prevent parsing; logic errors produce the wrong result.",
    xpReward: 50,
  }),
  challenge({
    id: "debug-i-off-by-one",
    title: "Repair the Loop",
    description: "Fix a logic error caused by the upper limit of range().",
    topicId: "programming",
    skills: ["debugging", "iteration"],
    mode: "debug",
    difficulty: "intermediate",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `n = int(input())
total = 0

for value in range(1, n):
    total += value

print(total)
`,
    stdin: "5",
    visibleTests: [visible("n5", "n = 5", "5", "15")],
    hiddenTests: [hidden("n3", "Hidden n = 3", "3", "6")],
    hint: "The loop stops before n.",
    secondHint: "Change the range end to n + 1.",
    explanation: "range() excludes its stop argument, so the original code omits n.",
    examinerTip: "Off-by-one mistakes are logic errors.",
    xpReward: 70,
  }),
  challenge({
    id: "debug-h-return",
    title: "Repair the Return Value",
    description: "Fix a function that prints when it should return.",
    topicId: "programming",
    skills: ["debugging", "functions"],
    mode: "debug",
    difficulty: "higher",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `def square(number):
    print(number * number)

value = int(input())
answer = square(value)
print(answer)
`,
    stdin: "6",
    visibleTests: [visible("six", "square(6)", "6", "36")],
    hiddenTests: [hidden("three", "Hidden square(3)", "3", "9")],
    hint: "The caller needs a value from the function.",
    secondHint: "Replace the function's print() with return.",
    explanation: "print() displays a value but returns None. The caller expects square() to return the result.",
    examinerTip: "Trace output and returned values separately.",
    xpReward: 90,
  }),
  challenge({
    id: "al-debug-recursion",
    title: "Repair the Recursive Function",
    description: "Fix recursion that moves away from its base case.",
    topicId: "advanced-programming",
    skills: ["debugging", "recursion", "functions"],
    mode: "debug",
    difficulty: "higher",
    qualifications: ["A_LEVEL"],
    examBoards: ["AQA", "OCR"],
    starterCode: `def sum_to(n):
    if n == 0:
        return 0

    return n + sum_to(n - 1)

print(sum_to(int(input())))
`,
    stdin: "4",
    visibleTests: [visible("four", "sum_to(4)", "4", "10")],
    hiddenTests: [hidden("one", "Hidden sum_to(1)", "1", "1")],
    hint: "The recursive argument moves in the wrong direction.",
    secondHint: "Use n - 1 instead of n + 1.",
    explanation: "Positive values never reach zero when n + 1 is used. The recursive call must reduce n.",
    examinerTip: "When debugging recursion, check termination first.",
    xpReward: 120,
    estimatedMinutes: 10,
  }),

  challenge({
    id: "debug-f-variable-name",
    title: "Repair the Variable",
    description: "Fix the NameError so the program outputs the doubled input.",
    topicId: "programming",
    skills: ["debugging", "variables", "arithmetic"],
    mode: "debug",
    difficulty: "foundation",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `number = int(input())
result = numbr * 2
print(result)
`,
    stdin: "6",
    visibleTests: [visible("six", "6", "6", "12")],
    hiddenTests: [hidden("zero", "0", "0", "0")],
    hint: "One identifier is misspelled.",
    secondHint: "Use the same variable name that was assigned.",
    explanation: "Name errors often come from inconsistent identifiers.",
    examinerTip: "Read error messages and inspect the referenced line.",
    xpReward: 55,
    estimatedMinutes: 5,
  }),
  challenge({
    id: "debug-f-comparison",
    title: "Repair the Comparison",
    description: "Fix the selection so 50 and above outputs Pass.",
    topicId: "programming",
    skills: ["debugging", "selection"],
    mode: "debug",
    difficulty: "foundation",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `score = int(input())
if score > 50:
    print("Pass")
else:
    print("Fail")
`,
    stdin: "50",
    visibleTests: [visible("boundary", "50", "50", "Pass")],
    hiddenTests: [hidden("high", "80", "80", "Pass"), hidden("low", "49", "49", "Fail")],
    hint: "Test the exact boundary.",
    secondHint: "The requirement says 50 and above.",
    explanation: "Boundary tests expose comparison-operator mistakes.",
    examinerTip: "Translate inclusive language to >= or <=.",
    xpReward: 60,
    estimatedMinutes: 5,
  }),
  challenge({
    id: "debug-f-input-type",
    title: "Repair Numeric Input",
    description: "Fix the program so it adds 10 numerically to the entered integer.",
    topicId: "programming",
    skills: ["debugging", "input-output", "arithmetic"],
    mode: "debug",
    difficulty: "foundation",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `value = input()
print(value + 10)
`,
    stdin: "5",
    visibleTests: [visible("five", "5", "5", "15")],
    hiddenTests: [hidden("zero", "0", "0", "10")],
    hint: "input() returns text.",
    secondHint: "Convert the input with int().",
    explanation: "Type conversion is required before numeric arithmetic on text input.",
    examinerTip: "Distinguish concatenation from arithmetic.",
    xpReward: 60,
    estimatedMinutes: 5,
  }),
  challenge({
    id: "debug-i-accumulator",
    title: "Repair the Accumulator",
    description: "Fix the loop so it totals all integers from 1 to n.",
    topicId: "programming",
    skills: ["debugging", "iteration", "variables"],
    mode: "debug",
    difficulty: "intermediate",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `n = int(input())
total = 0
for value in range(1, n + 1):
    total = value
print(total)
`,
    stdin: "5",
    visibleTests: [visible("five", "n=5", "5", "15")],
    hiddenTests: [hidden("three", "n=3", "3", "6")],
    hint: "The total is being replaced each iteration.",
    secondHint: "Accumulate with += rather than overwrite.",
    explanation: "An accumulator must preserve the previous total.",
    examinerTip: "Trace variable values across iterations.",
    xpReward: 80,
    estimatedMinutes: 7,
  }),
  challenge({
    id: "debug-i-list-index",
    title: "Repair the Index",
    description: "Fix the loop so every list item is printed exactly once.",
    topicId: "programming",
    skills: ["debugging", "lists", "iteration"],
    mode: "debug",
    difficulty: "intermediate",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `values = [10, 20, 30]
for i in range(1, len(values) + 1):
    print(values[i])
`,
    stdin: "",
    visibleTests: [visible("list", "All items", "", "10\n20\n30")],
    hiddenTests: [hidden("same", "Hidden", "", "10\n20\n30")],
    hint: "Python list indices start at zero.",
    secondHint: "Use range(len(values)).",
    explanation: "Index ranges must match valid list positions.",
    examinerTip: "Off-by-one errors commonly appear at both ends.",
    xpReward: 85,
    estimatedMinutes: 7,
  }),
  challenge({
    id: "debug-i-validation",
    title: "Repair Validation Logic",
    description: "Fix the loop condition so it repeats while age is outside 11 to 18 inclusive.",
    topicId: "programming",
    skills: ["debugging", "validation", "iteration", "selection"],
    mode: "debug",
    difficulty: "intermediate",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `age = int(input())
while age < 11 and age > 18:
    age = int(input())
print("Accepted")
`,
    stdin: "5\n16",
    visibleTests: [visible("retry", "Invalid then valid", "5\n16", "Accepted")],
    hiddenTests: [hidden("high", "High then valid", "25\n18", "Accepted")],
    hint: "Can one number be below 11 and above 18 at the same time?",
    secondHint: "Outside the range means age < 11 OR age > 18.",
    explanation: "Boolean operators must reflect the intended set of invalid values.",
    examinerTip: "Test one value below and one above the range.",
    xpReward: 90,
    estimatedMinutes: 8,
  }),
  challenge({
    id: "debug-i-function-return",
    title: "Repair the Function",
    description: "Fix the function so the caller receives the calculated square.",
    topicId: "programming",
    skills: ["debugging", "functions"],
    mode: "debug",
    difficulty: "intermediate",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `def square(n):
    print(n * n)

answer = square(int(input()))
print(answer)
`,
    stdin: "4",
    visibleTests: [visible("four", "4", "4", "16")],
    hiddenTests: [hidden("two", "2", "2", "4")],
    hint: "The function currently prints instead of returning.",
    secondHint: "Replace the inner print with return.",
    explanation: "A returned value can be assigned by the caller; printed output cannot.",
    examinerTip: "Differentiate a function's result from a side effect.",
    xpReward: 90,
    estimatedMinutes: 8,
  }),
  challenge({
    id: "debug-h-binary-search",
    title: "Repair Binary Search",
    description: "Fix the update logic so binary search terminates and finds the target index.",
    topicId: "algorithms-a-level",
    skills: ["debugging", "searching", "algorithmic-thinking"],
    mode: "debug",
    difficulty: "higher",
    qualifications: ["A_LEVEL"],
    examBoards: ["AQA", "OCR"],
    starterCode: `values = [2, 5, 8, 12, 16, 23]
target = int(input())
low, high = 0, len(values) - 1
result = -1
while low <= high:
    mid = (low + high) // 2
    if values[mid] == target:
        result = mid
        break
    elif values[mid] < target:
        high = mid - 1
    else:
        low = mid + 1
print(result)
`,
    stdin: "16",
    visibleTests: [visible("found", "16", "16", "4")],
    hiddenTests: [hidden("low", "2", "2", "0"), hidden("absent", "7", "7", "-1")],
    hint: "The interval moves in the wrong direction.",
    secondHint: "If middle is too small, move low upward; if too large, move high downward.",
    explanation: "Binary search discards the half that cannot contain the target.",
    examinerTip: "Trace low, mid and high to diagnose search bugs.",
    xpReward: 130,
    estimatedMinutes: 13,
  }),
  challenge({
    id: "debug-h-stack",
    title: "Repair Stack Pop",
    description: "Fix the postfix addition code so it computes left + right from the two top stack values.",
    topicId: "data-structures",
    skills: ["debugging", "stacks"],
    mode: "debug",
    difficulty: "higher",
    qualifications: ["A_LEVEL"],
    examBoards: ["AQA", "OCR"],
    starterCode: `stack = [3, 4]
left = stack.pop(0)
right = stack.pop()
print(left + right)
`,
    stdin: "",
    visibleTests: [visible("add", "3+4", "", "7")],
    hiddenTests: [hidden("same", "Hidden", "", "7")],
    hint: "A stack removes from the top, which is the end of this list.",
    secondHint: "Use pop() for both operands, assigning right first then left.",
    explanation: "Stack operations are LIFO.",
    examinerTip: "Use operations that match the abstract data type.",
    xpReward: 115,
    estimatedMinutes: 10,
  }),
  challenge({
    id: "debug-h-recursive-base",
    title: "Repair Recursive Factorial",
    description: "Fix the base case so factorial(0) and factorial(5) are correct.",
    topicId: "advanced-programming",
    skills: ["debugging", "recursion", "functions"],
    mode: "debug",
    difficulty: "higher",
    qualifications: ["A_LEVEL"],
    examBoards: ["AQA", "OCR"],
    starterCode: `def factorial(n):
    if n == 1:
        return 1
    return n * factorial(n - 1)

print(factorial(int(input())))
`,
    stdin: "0",
    visibleTests: [visible("zero", "factorial(0)", "0", "1")],
    hiddenTests: [hidden("five", "factorial(5)", "5", "120")],
    hint: "The recursion must stop for zero.",
    secondHint: "Use n == 0 as a base case (or n <= 1 for valid non-negative input).",
    explanation: "A base case must cover the smallest valid problem instance.",
    examinerTip: "Test the base case directly.",
    xpReward: 125,
    estimatedMinutes: 12,
  }),
  challenge({
    id: "debug-h-sort-swap",
    title: "Repair Bubble Sort",
    description: "Fix the swap so one full bubble sort produces ascending order.",
    topicId: "programming",
    skills: ["debugging", "sorting", "lists"],
    mode: "debug",
    difficulty: "higher",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `values = [int(x) for x in input().split()]
for end in range(len(values)-1, 0, -1):
    for i in range(end):
        if values[i] > values[i+1]:
            values[i] = values[i+1]
            values[i+1] = values[i]
print(*values)
`,
    stdin: "4 1 3 2",
    visibleTests: [visible("mix", "Mixed", "4 1 3 2", "1 2 3 4")],
    hiddenTests: [hidden("reverse", "Reverse", "5 4 3 2 1", "1 2 3 4 5")],
    hint: "The first assignment destroys one of the values.",
    secondHint: "Use tuple assignment or a temporary variable.",
    explanation: "A swap must preserve both original values until reassignment is complete.",
    examinerTip: "Trace a two-item swap before tracing the whole sort.",
    xpReward: 125,
    estimatedMinutes: 12,
  }),
];

