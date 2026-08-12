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
];
