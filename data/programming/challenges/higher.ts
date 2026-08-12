import { challenge, hidden, visible } from "./helpers";

export const higherProgrammingChallenges = [
  challenge({
    id: "gcse-h-count-vowels",
    title: "Count Vowels",
    description: "Count vowels in a string using iteration and selection.",
    topicId: "programming",
    skills: ["strings", "iteration", "selection"],
    difficulty: "higher",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `text = input().lower()
count = 0

# Count a, e, i, o and u.

print(count)
`,
    stdin: "computer science",
    visibleTests: [visible("main", "computer science", "computer science", "6")],
    hiddenTests: [
      hidden("none", "Hidden no-vowel string", "rhythms", "0"),
      hidden("mixed", "Hidden mixed case", "EdUcAtIoN", "5"),
    ],
    hint: `Test whether each character is in "aeiou".`,
    secondHint: `Use: if character in "aeiou":`,
    explanation: "Each character is inspected once after normalising case.",
    examinerTip: "State what each loop variable represents.",
    xpReward: 90,
  }),
  challenge({
    id: "gcse-h-bubble-pass",
    title: "One Bubble Sort Pass",
    description: "Perform one pass of bubble sort over a list.",
    topicId: "algorithms",
    curriculumTopicIds: ["algorithms", "programming"],
    skills: ["sorting", "lists", "iteration", "selection"],
    difficulty: "higher",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `values = [7, 3, 9, 2]

# Perform ONE left-to-right bubble-sort pass.

print(values)
`,
    visibleTests: [visible("pass", "One pass", "", "[3, 7, 2, 9]")],
    hint: "Compare neighbouring values and swap when the left is greater.",
    secondHint: "Loop from index 0 to len(values) - 2.",
    explanation: "After one pass, the largest item has moved to the final position.",
    examinerTip: "One pass is not the same as a complete sort.",
    xpReward: 105,
  }),
  challenge({
    id: "al-h-oop-rectangle",
    title: "Rectangle Class",
    description: "Implement object state and an instance method.",
    topicId: "advanced-programming",
    skills: ["oop", "functions"],
    difficulty: "higher",
    qualifications: ["A_LEVEL"],
    examBoards: ["AQA", "OCR"],
    starterCode: `class Rectangle:
    def __init__(self, width, height):
        # Store the attributes.
        pass

    def area(self):
        # Return the area.
        pass

width = int(input())
height = int(input())
shape = Rectangle(width, height)
print(shape.area())
`,
    stdin: "7\n4",
    visibleTests: [visible("main", "7 by 4", "7\n4", "28")],
    hiddenTests: [hidden("hidden", "Hidden rectangle", "1\n9", "9")],
    hint: "Store width and height on self.",
    secondHint: "Return self.width * self.height.",
    explanation: "The constructor initialises state; the method reads that state.",
    examinerTip: "Use class, object, constructor, attribute and method precisely.",
    xpReward: 120,
  }),
  challenge({
    id: "al-h-binary-search",
    title: "Binary Search",
    description: "Implement iterative binary search over sorted data.",
    topicId: "algorithms",
    curriculumTopicIds: ["algorithms", "computational-thinking"],
    skills: ["searching", "iteration", "selection", "functions", "algorithmic-thinking"],
    difficulty: "higher",
    qualifications: ["A_LEVEL"],
    examBoards: ["AQA", "OCR"],
    starterCode: `def binary_search(values, target):
    low = 0
    high = len(values) - 1

    # Return the matching index, or -1.
    pass

data = [2, 5, 8, 12, 16, 23, 38]
print(binary_search(data, int(input())))
`,
    stdin: "16",
    visibleTests: [visible("found", "Target 16", "16", "4")],
    hiddenTests: [
      hidden("first", "Hidden first item", "2", "0"),
      hidden("missing", "Hidden missing item", "99", "-1"),
    ],
    hint: "Continue while low <= high and calculate a midpoint.",
    secondHint: "Move high to mid - 1 or low to mid + 1.",
    explanation: "Binary search repeatedly halves a sorted search interval.",
    examinerTip: "Binary search requires sorted data.",
    xpReward: 130,
    estimatedMinutes: 15,
  }),
];
