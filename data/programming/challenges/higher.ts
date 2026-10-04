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

  challenge({
    id: "gcse-h-palindrome",
    title: "Palindrome Checker",
    description: "Read text and output Palindrome if it reads the same forwards and backwards, otherwise Not palindrome.",
    topicId: "programming",
    skills: ["strings", "selection", "algorithmic-thinking"],
    difficulty: "higher",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `text = input()
# Check exact character order.
`,
    stdin: "level",
    visibleTests: [visible("yes", "Palindrome", "level", "Palindrome")],
    hiddenTests: [hidden("no", "Not palindrome", "python", "Not palindrome"), hidden("even", "Even length", "noon", "Palindrome")],
    hint: "Compare the text with its reverse.",
    secondHint: "Python slicing text[::-1] reverses a string.",
    explanation: "A simple transformation can support a clear comparison algorithm.",
    examinerTip: "Test odd, even and non-palindromes.",
    xpReward: 100,
    estimatedMinutes: 9,
  }),
  challenge({
    id: "gcse-h-second-largest",
    title: "Second Largest Distinct",
    description: "Read five integers and output the second-largest distinct value. Inputs contain at least two distinct values.",
    topicId: "programming",
    skills: ["lists", "iteration", "selection", "algorithmic-thinking"],
    difficulty: "higher",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `values = [int(input()) for _ in range(5)]
# Output second-largest DISTINCT value.
`,
    stdin: "9\n2\n9\n7\n4",
    visibleTests: [visible("dup", "Duplicate maximum", "9\n2\n9\n7\n4", "7")],
    hiddenTests: [hidden("neg", "Negative values", "-5\n-1\n-3\n-2\n-4", "-2")],
    hint: "Duplicates must not create the second distinct value.",
    secondHint: "You can track two values or remove duplicates then order.",
    explanation: "Precise requirements matter when duplicates are possible.",
    examinerTip: "Test duplicate maxima and negative numbers.",
    xpReward: 110,
    estimatedMinutes: 11,
  }),
  challenge({
    id: "gcse-h-insertion-sort",
    title: "Insertion Sort",
    description: "Read five integers, sort them ascending using insertion sort logic, and print them space-separated.",
    topicId: "programming",
    skills: ["sorting", "lists", "iteration", "algorithmic-thinking"],
    difficulty: "higher",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `values = [int(input()) for _ in range(5)]
# Implement insertion sort; do not call sorted() or list.sort().
print(*values)
`,
    stdin: "5\n2\n4\n1\n3",
    visibleTests: [visible("mix", "Mixed", "5\n2\n4\n1\n3", "1 2 3 4 5")],
    hiddenTests: [hidden("reverse", "Reverse", "5\n4\n3\n2\n1", "1 2 3 4 5")],
    hint: "Grow a sorted prefix one item at a time.",
    secondHint: "Shift larger prefix values right before inserting the key.",
    explanation: "Insertion sort inserts each new item into the correct place in the sorted prefix.",
    examinerTip: "Be able to trace the state after each insertion.",
    xpReward: 125,
    estimatedMinutes: 14,
  }),
  challenge({
    id: "gcse-h-binary-convert",
    title: "Decimal to Binary",
    description: "Read a non-negative integer up to 255 and output its binary representation without leading zeros; output 0 for zero.",
    topicId: "programming",
    skills: ["iteration", "arithmetic", "algorithmic-thinking"],
    difficulty: "higher",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `n = int(input())
# Convert without using bin().
`,
    stdin: "13",
    visibleTests: [visible("thirteen", "13", "13", "1101")],
    hiddenTests: [hidden("zero", "0", "0", "0"), hidden("max", "255", "255", "11111111")],
    hint: "Repeated division by 2 produces remainders.",
    secondHint: "Remainders are generated least-significant first, so reverse them.",
    explanation: "Repeated division is a standard base-conversion algorithm.",
    examinerTip: "Handle zero as a special case.",
    xpReward: 120,
    estimatedMinutes: 12,
  }),
  challenge({
    id: "gcse-h-frequency",
    title: "Most Frequent Value",
    description: "Read seven integers and output the value occurring most often. Tests have a unique most frequent value.",
    topicId: "programming",
    skills: ["lists", "iteration", "algorithmic-thinking"],
    difficulty: "higher",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `values = [int(input()) for _ in range(7)]
# Output the unique mode.
`,
    stdin: "2\n1\n2\n3\n2\n4\n1",
    visibleTests: [visible("mode", "Mode 2", "2\n1\n2\n3\n2\n4\n1", "2")],
    hiddenTests: [hidden("negative", "Negative mode", "-1\n0\n-1\n2\n3\n-1\n2", "-1")],
    hint: "Count occurrences for candidate values.",
    secondHint: "A dictionary or repeated counting can track frequencies.",
    explanation: "Frequency tables turn repeated values into counts.",
    examinerTip: "Know the assumptions around ties.",
    xpReward: 115,
    estimatedMinutes: 11,
  }),
  challenge({
    id: "gcse-h-file-analysis",
    title: "CSV Score Analysis",
    description: "Read comma-separated integer scores and output the highest score and mean on separate lines.",
    topicId: "programming",
    skills: ["files", "strings", "lists", "arithmetic"],
    difficulty: "higher",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `line = input()
# Treat line as one CSV record of integer scores.
`,
    stdin: "10,20,30,40",
    visibleTests: [visible("basic", "Four scores", "10,20,30,40", "40\n25.0")],
    hiddenTests: [hidden("same", "Equal scores", "5,5,5", "5\n5.0")],
    hint: "Split on commas and convert each field.",
    secondHint: "Use max and total/count after conversion.",
    explanation: "Delimited text must be parsed before numeric processing.",
    examinerTip: "Separate parsing from analysis.",
    xpReward: 105,
    estimatedMinutes: 10,
  }),
  challenge({
    id: "gcse-h-menu",
    title: "Menu Loop",
    description: "Read commands until QUIT. ADD x adds x to a running total; SHOW prints the total. Commands are supplied one per input line.",
    topicId: "programming",
    skills: ["iteration", "selection", "strings", "validation"],
    difficulty: "higher",
    qualifications: ["GCSE"],
    examBoards: ["AQA", "OCR", "EDEXCEL"],
    starterCode: `total = 0
# Repeatedly read commands until QUIT.
`,
    stdin: "ADD 5\nADD 3\nSHOW\nQUIT",
    visibleTests: [visible("basic", "Add and show", "ADD 5\nADD 3\nSHOW\nQUIT", "8")],
    hiddenTests: [hidden("multi", "Multiple shows", "SHOW\nADD 2\nSHOW\nQUIT", "0\n2")],
    hint: "Use an indefinite loop and inspect each command.",
    secondHint: "startswith('ADD ') can identify add commands.",
    explanation: "Menu-driven programs combine sentinel iteration and selection.",
    examinerTip: "Ensure QUIT terminates without requesting another input.",
    xpReward: 120,
    estimatedMinutes: 13,
  }),
  challenge({
    id: "al-h-quicksort",
    title: "Recursive Quicksort",
    description: "Complete quicksort(values) recursively and print the sorted integers.",
    topicId: "algorithms-a-level",
    skills: ["recursion", "lists", "algorithmic-thinking", "sorting"],
    difficulty: "higher",
    qualifications: ["A_LEVEL"],
    examBoards: ["AQA", "OCR"],
    starterCode: `def quicksort(values):
    # Return a new sorted list recursively.
    pass

values = [int(x) for x in input().split()]
print(*quicksort(values))
`,
    stdin: "5 1 4 2 3",
    visibleTests: [visible("mix", "Mixed", "5 1 4 2 3", "1 2 3 4 5")],
    hiddenTests: [hidden("dup", "Duplicates", "3 1 3 2", "1 2 3 3"), hidden("empty", "Empty line", "", "")],
    hint: "Use a base case for length <= 1.",
    secondHint: "Partition around a pivot, recurse on partitions, then combine.",
    explanation: "Divide-and-conquer recursion reduces the problem into smaller partitions.",
    examinerTip: "Your partition must preserve duplicate values.",
    xpReward: 145,
    estimatedMinutes: 16,
  }),
  challenge({
    id: "al-h-postfix",
    title: "Postfix Evaluator",
    description: "Evaluate a space-separated postfix expression containing integers and +, -, * using a stack.",
    topicId: "data-structures",
    skills: ["stacks", "algorithmic-thinking", "strings"],
    difficulty: "higher",
    qualifications: ["A_LEVEL"],
    examBoards: ["AQA", "OCR"],
    starterCode: `tokens = input().split()
stack = []
# Evaluate the postfix expression.
`,
    stdin: "3 4 + 2 *",
    visibleTests: [visible("basic", "(3+4)*2", "3 4 + 2 *", "14")],
    hiddenTests: [hidden("order", "Subtraction order", "10 3 -", "7")],
    hint: "Push numbers; an operator pops two operands.",
    secondHint: "For subtraction, the first popped value is the right operand.",
    explanation: "Stacks are well suited to postfix expression evaluation.",
    examinerTip: "Operand order matters for non-commutative operators.",
    xpReward: 145,
    estimatedMinutes: 15,
  }),
  challenge({
    id: "al-h-bfs",
    title: "Breadth-First Traversal",
    description: "Traverse the fixed graph from A using BFS and print visit order space-separated. Neighbours are already alphabetically ordered.",
    topicId: "algorithms-a-level",
    skills: ["queues", "algorithmic-thinking", "lists"],
    difficulty: "higher",
    qualifications: ["A_LEVEL"],
    examBoards: ["AQA", "OCR"],
    starterCode: `graph = {"A":["B","C"], "B":["D"], "C":["D","E"], "D":[], "E":[]}
# BFS from A without visiting a node twice.
`,
    stdin: "",
    visibleTests: [visible("graph", "Fixed graph", "", "A B C D E")],
    hiddenTests: [hidden("graph2", "Same graph hidden", "", "A B C D E")],
    hint: "Use a queue and a visited set/list.",
    secondHint: "Mark nodes visited when enqueuing to avoid duplicates.",
    explanation: "Breadth-first search explores vertices level by level.",
    examinerTip: "Avoid enqueuing the same shared neighbour repeatedly.",
    xpReward: 140,
    estimatedMinutes: 14,
  }),
  challenge({
    id: "al-h-oop-bank",
    title: "Bank Account Class",
    description: "Complete Account so deposit adds positive amounts and withdraw returns True only when sufficient funds exist.",
    topicId: "advanced-programming",
    skills: ["oop", "selection", "functions"],
    difficulty: "higher",
    qualifications: ["A_LEVEL"],
    examBoards: ["AQA", "OCR"],
    starterCode: `class Account:
    def __init__(self, balance):
        self.balance = balance

    def deposit(self, amount):
        pass

    def withdraw(self, amount):
        pass

account = Account(int(input()))
command = input()
amount = int(input())
result = getattr(account, command)(amount)
print(result)
print(account.balance)
`,
    stdin: "100\nwithdraw\n30",
    visibleTests: [visible("withdraw", "Valid withdrawal", "100\nwithdraw\n30", "True\n70")],
    hiddenTests: [hidden("reject", "Insufficient", "20\nwithdraw\n30", "False\n20"), hidden("deposit", "Deposit", "10\ndeposit\n15", "None\n25")],
    hint: "Methods update self.balance.",
    secondHint: "withdraw must leave the balance unchanged when funds are insufficient.",
    explanation: "Encapsulation places state and related behaviour inside an object.",
    examinerTip: "Define method return behaviour precisely.",
    xpReward: 150,
    estimatedMinutes: 16,
  }),
];

