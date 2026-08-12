import type { Topic } from "@/types/curriculum";

export const programmingTopic: Topic = {
  id: "programming",
  title: "Programming Fundamentals",
  description:
    "Develop practical programming skills using variables, selection, iteration, arrays, strings, subroutines, validation, testing and debugging.",
  difficulty: "⭐⭐☆",
  estimatedTime: "180 mins",
  simulator: "python",
  status: "published",
  unit: "Programming",
  specificationReferences: ["AQA 3.2", "AQA 3.4"],

  lessons: [
    {
      id: "variables-data-types",
      title: "Variables, Constants and Data Types",
      description:
        "Store values using meaningful identifiers and suitable data types.",
      estimatedTime: "18 mins",
      xpReward: 80,
      simulator: "variables",
      objectives: [
        "Define variables and constants.",
        "Select suitable data types.",
        "Trace assignment statements.",
      ],
      explanation:
        "A variable is a named storage location whose value can change. A constant is a named value that should not change while a program runs. Common data types include integer, real or float, Boolean, character and string.",
      workedExample:
        "age = 15 stores an integer. price = 4.99 stores a real value. logged_in = True stores a Boolean value.",
      practiceQuestions: [
        {
          question: "Which data type is most suitable for the value 42?",
          answer: "Integer",
          acceptedAnswers: ["Int"],
        },
        {
          question: "Which data type stores True or False?",
          answer: "Boolean",
          acceptedAnswers: ["Bool"],
        },
      ],
      checkpointQuestions: [
        {
          question: "What is the difference between a variable and a constant?",
          answer: "A variable can change while a constant should remain fixed",
          acceptedAnswers: ["Variables change but constants do not"],
        },
      ],
      examQuestion: {
        question:
          "Explain why suitable data types should be selected when designing a program.",
        marks: 4,
        answer:
          "Suitable data types ensure values are stored and processed correctly. They can reduce memory use, prevent invalid operations and make validation and program behaviour clearer.",
        markScheme: [
          "Values are represented correctly.",
          "Only suitable operations are permitted.",
          "Memory may be used efficiently.",
          "Program reliability or clarity is improved.",
        ],
        guidance: ["Credit developed valid reasons."],
      },
      reflectionPrompt:
        "Choose suitable data types for a student's name, age, average mark and attendance status.",
    },

    {
      id: "input-output-operators",
      title: "Input, Output and Operators",
      description: "Receive user input, produce output and build expressions.",
      estimatedTime: "18 mins",
      xpReward: 80,
      simulator: "python",
      objectives: [
        "Use input and output statements.",
        "Apply arithmetic, comparison and Boolean operators.",
        "Convert input into suitable data types.",
      ],
      explanation:
        "Input allows data to enter a program. Output communicates results. Arithmetic operators perform calculations, comparison operators produce Boolean results and Boolean operators combine conditions. In Python, input is initially a string and may need conversion.",
      workedExample:
        "age = int(input('Age: ')) converts the entered text into an integer. The expression age >= 16 produces True or False.",
      practiceQuestions: [
        {
          question:
            "What data type does Python input() return before conversion?",
          answer: "String",
          acceptedAnswers: ["Str", "Text"],
        },
        {
          question: "Which comparison operator means greater than or equal to?",
          answer: ">=",
        },
      ],
      checkpointQuestions: [
        {
          question: "Write the Python function used to display output.",
          answer: "print",
          acceptedAnswers: ["print()"],
        },
      ],
      examQuestion: {
        question:
          "Write Python statements that input two integers and output their total.",
        marks: 4,
        answer:
          "first = int(input('First: '))\nsecond = int(input('Second: '))\ntotal = first + second\nprint(total)",
        markScheme: [
          "Inputs the first value.",
          "Inputs the second value.",
          "Converts inputs to integers or otherwise ensures numeric values.",
          "Adds and outputs the values.",
        ],
        guidance: ["Accept equivalent valid Python."],
      },
      reflectionPrompt:
        "Explain why forgetting int() around numeric input can cause an unexpected result.",
    },

    {
      id: "selection",
      title: "Selection",
      description: "Use IF, ELIF and ELSE to make decisions.",
      estimatedTime: "20 mins",
      xpReward: 90,
      simulator: "selection",
      objectives: [
        "Construct Boolean conditions.",
        "Use IF, ELIF and ELSE.",
        "Trace nested and multi-branch selection.",
      ],
      explanation:
        "Selection chooses which instructions execute according to a condition. IF tests the first condition, ELIF tests alternatives and ELSE handles the remaining case. Conditions should be mutually sensible and ordered carefully.",
      workedExample:
        "if score >= 70: grade = 'A'\nelif score >= 50: grade = 'B'\nelse: grade = 'C'",
      practiceQuestions: [
        {
          question:
            "Which keyword handles the remaining case when earlier conditions are false?",
          answer: "else",
        },
        {
          question:
            "What data type is produced by a comparison such as score >= 50?",
          answer: "Boolean",
        },
      ],
      checkpointQuestions: [
        {
          question: "Why should score >= 70 be tested before score >= 50?",
          answer: "A score of 70 or more also satisfies score >= 50",
          acceptedAnswers: [
            "The more specific or higher condition must be checked first",
          ],
        },
      ],
      examQuestion: {
        question:
          "Write Python selection that outputs 'Pass' for marks of 40 or more and 'Fail' otherwise.",
        marks: 3,
        answer: "if mark >= 40:\n    print('Pass')\nelse:\n    print('Fail')",
        markScheme: [
          "Uses an IF statement.",
          "Uses the correct condition mark >= 40.",
          "Outputs correct results in both branches.",
        ],
        guidance: ["Accept equivalent valid code."],
      },
      reflectionPrompt:
        "Explain how incorrect condition order can make a branch unreachable.",
    },

    {
      id: "iteration",
      title: "Iteration",
      description: "Use count-controlled and condition-controlled loops.",
      estimatedTime: "22 mins",
      xpReward: 100,
      simulator: "iteration",
      objectives: [
        "Use FOR loops.",
        "Use WHILE loops.",
        "Avoid infinite loops and off-by-one errors.",
      ],
      explanation:
        "Iteration repeats instructions. A FOR loop is commonly used when the number of repetitions is known. A WHILE loop repeats while a condition remains true. Loop variables and conditions must change correctly to ensure termination.",
      workedExample:
        "for number in range(1, 6): print(number) outputs 1 to 5. A WHILE loop can repeat input until a valid value is entered.",
      practiceQuestions: [
        {
          question:
            "Which loop is usually suitable when the number of repetitions is known?",
          answer: "FOR loop",
          acceptedAnswers: ["For"],
        },
        {
          question:
            "What can happen if a WHILE-loop condition never becomes false?",
          answer: "An infinite loop",
          acceptedAnswers: ["The loop never stops"],
        },
      ],
      checkpointQuestions: [
        {
          question: "How many values are produced by range(0, 5)?",
          answer: "5",
          acceptedAnswers: ["Five"],
        },
      ],
      examQuestion: {
        question:
          "Write Python code that outputs the numbers 1 to 10 using a loop.",
        marks: 3,
        answer: "for number in range(1, 11):\n    print(number)",
        markScheme: [
          "Uses a loop.",
          "Generates the values 1 through 10.",
          "Outputs each value.",
        ],
        guidance: ["Accept a correct WHILE-loop solution."],
      },
      reflectionPrompt:
        "Explain the difference between count-controlled and condition-controlled iteration.",
    },

    {
      id: "arrays-strings",
      title: "Arrays, Lists and Strings",
      description: "Store collections and process text using indexes.",
      estimatedTime: "22 mins",
      xpReward: 100,
      simulator: "arrays",
      objectives: [
        "Use one-dimensional arrays or lists.",
        "Access and update indexed values.",
        "Apply common string operations.",
      ],
      explanation:
        "An array or list stores multiple related values under one identifier. Individual items are accessed by index. Strings are sequences of characters and support indexing, length, slicing and methods such as upper() or lower(). Python indexes begin at zero.",
      workedExample:
        "scores = [65, 72, 81]. scores[1] is 72. name[0] is the first character of name.",
      practiceQuestions: [
        {
          question: "What is the index of the first item in a Python list?",
          answer: "0",
          acceptedAnswers: ["Zero"],
        },
        {
          question: "What does len(values) return?",
          answer: "The number of items",
          acceptedAnswers: ["The length of the list"],
        },
      ],
      checkpointQuestions: [
        {
          question:
            "For colours = ['red', 'blue', 'green'], what is colours[2]?",
          answer: "green",
        },
      ],
      examQuestion: {
        question:
          "Write Python code that calculates and outputs the total of all values in a list called scores.",
        marks: 4,
        answer:
          "total = 0\nfor score in scores:\n    total = total + score\nprint(total)",
        markScheme: [
          "Initialises a total.",
          "Iterates through scores.",
          "Adds each score to the total.",
          "Outputs the total.",
        ],
        guidance: [
          "Accept print(sum(scores)) if built-in functions are allowed.",
        ],
      },
      reflectionPrompt:
        "Explain why accessing an index outside a list's valid range causes an error.",
    },

    {
      id: "procedures-functions",
      title: "Procedures and Functions",
      description:
        "Create reusable subroutines with parameters and return values.",
      estimatedTime: "22 mins",
      xpReward: 105,
      simulator: "functions",
      objectives: [
        "Define a subroutine.",
        "Use parameters and arguments.",
        "Distinguish procedures from functions.",
      ],
      explanation:
        "A subroutine is a named reusable block of code. Parameters receive values when the subroutine is called. A function returns a value, while a procedure primarily performs an action. Subroutines improve decomposition, reuse and testing.",
      workedExample:
        "def area(width, height): return width * height defines a function with two parameters and returns a calculated value.",
      practiceQuestions: [
        {
          question: "What is a parameter?",
          answer: "A named value received by a subroutine",
          acceptedAnswers: ["A variable in a function or procedure definition"],
        },
        {
          question: "What distinguishes a function from a procedure?",
          answer: "A function returns a value",
          acceptedAnswers: ["Functions produce a return value"],
        },
      ],
      checkpointQuestions: [
        {
          question: "Which keyword sends a value back from a Python function?",
          answer: "return",
        },
      ],
      examQuestion: {
        question:
          "Write a Python function called double that receives a number and returns twice its value.",
        marks: 4,
        answer: "def double(number):\n    return number * 2",
        markScheme: [
          "Uses def.",
          "Names the function double.",
          "Receives a parameter.",
          "Returns the parameter multiplied by 2.",
        ],
        guidance: ["Accept equivalent valid Python."],
      },
      reflectionPrompt:
        "Explain how subroutines make a large program easier to maintain.",
    },

    {
      id: "validation-testing",
      title: "Validation and Testing",
      description: "Prevent unsuitable input and test programs systematically.",
      estimatedTime: "20 mins",
      xpReward: 95,
      simulator: "debugging",
      objectives: [
        "Describe common validation checks.",
        "Use normal, boundary, invalid and erroneous test data.",
        "Distinguish validation from verification.",
      ],
      explanation:
        "Validation checks whether input is sensible and follows rules, but does not guarantee it is correct. Common checks include range, type, length, presence and format. Testing should use normal, boundary, invalid and erroneous data. Verification checks that data has been copied accurately.",
      workedExample:
        "For an allowed age of 11 to 18, useful tests include 11 and 18 as boundaries, 15 as normal, 10 as invalid and 'fifteen' as erroneous data.",
      practiceQuestions: [
        {
          question: "Does validation prove that entered data is correct?",
          answer: "No",
        },
        {
          question:
            "Which validation check ensures a value lies between minimum and maximum values?",
          answer: "Range check",
        },
      ],
      checkpointQuestions: [
        {
          question:
            "What type of test data uses the exact minimum or maximum accepted value?",
          answer: "Boundary data",
          acceptedAnswers: ["Boundary test data"],
        },
      ],
      examQuestion: {
        question:
          "A program accepts examination marks from 0 to 100. Give four useful test values and classify each one.",
        marks: 4,
        answer:
          "50 normal, 0 boundary, 100 boundary, -1 invalid. Other valid classifications are acceptable.",
        markScheme: [
          "Provides suitable normal data.",
          "Provides a lower or upper boundary.",
          "Provides the other boundary or another valid boundary case.",
          "Provides invalid or erroneous data.",
        ],
        guidance: ["Credit equivalent suitable values."],
      },
      reflectionPrompt:
        "Explain the difference between validation and verification.",
    },

    {
      id: "debugging-errors",
      title: "Errors and Debugging",
      description: "Identify syntax, logic and runtime errors.",
      estimatedTime: "20 mins",
      xpReward: 100,
      simulator: "debugging",
      objectives: [
        "Distinguish syntax, logic and runtime errors.",
        "Use error messages and trace techniques.",
        "Correct faulty code.",
      ],
      explanation:
        "A syntax error breaks language rules and prevents correct parsing. A runtime error occurs while the program executes. A logic error allows the program to run but produces an incorrect result. Debugging uses messages, test data, trace tables and careful inspection.",
      workedExample:
        "print('Hello' has a syntax error. Dividing by zero can cause a runtime error. Using + instead of * in an area calculation is a logic error.",
      practiceQuestions: [
        {
          question:
            "Which error allows a program to run but produces an incorrect result?",
          answer: "Logic error",
        },
        {
          question: "Which error occurs while a program is executing?",
          answer: "Runtime error",
        },
      ],
      checkpointQuestions: [
        {
          question: "Which tool records changing variable values step by step?",
          answer: "Trace table",
        },
      ],
      examQuestion: {
        question:
          "Explain the difference between syntax, runtime and logic errors.",
        marks: 6,
        answer:
          "A syntax error breaks the programming language's rules. A runtime error occurs during execution and may stop the program. A logic error allows execution to continue but produces an incorrect result.",
        markScheme: [
          "Defines syntax error.",
          "Links syntax to language rules or parsing.",
          "Defines runtime error.",
          "Links runtime error to execution.",
          "Defines logic error.",
          "States that logic errors produce incorrect results.",
        ],
        guidance: ["Credit valid examples."],
      },
      reflectionPrompt:
        "Explain why varied test data is especially important for finding logic errors.",
    },

    {
      id: "file-handling-defensive",
      title: "File Handling and Defensive Design",
      description:
        "Read and write persistent data and design programs for misuse and failure.",
      estimatedTime: "20 mins",
      xpReward: 100,
      simulator: "python",
      objectives: [
        "Explain why files are used.",
        "Describe reading, writing and appending.",
        "Apply defensive-design principles.",
      ],
      explanation:
        "Files store data after a program ends. Programs may read existing data, write new contents or append to the end. Defensive design anticipates invalid input, misuse and failures through validation, authentication, clear prompts, error handling and maintainable code.",
      workedExample:
        "Opening a score file in append mode adds a new result without deleting earlier scores. Exception handling can respond safely if the file is missing.",
      practiceQuestions: [
        {
          question:
            "Which file mode adds data to the end without replacing existing contents?",
          answer: "Append",
          acceptedAnswers: ["a", "Append mode"],
        },
        {
          question: "Give one defensive-design technique.",
          answer: "Input validation",
          acceptedAnswers: [
            "Authentication",
            "Error handling",
            "Clear prompts",
            "Maintainable code",
          ],
        },
      ],
      checkpointQuestions: [
        {
          question: "Why is persistent storage needed?",
          answer: "So data remains available after the program ends",
          acceptedAnswers: ["To save data permanently"],
        },
      ],
      examQuestion: {
        question:
          "Explain two defensive-design techniques that improve program reliability or security.",
        marks: 4,
        answer:
          "Input validation rejects unsuitable data before it is processed. Exception handling catches expected failures and allows the program to display a controlled message or recover safely.",
        markScheme: [
          "Identifies a valid technique.",
          "Explains the first technique.",
          "Identifies a second valid technique.",
          "Explains the second technique.",
        ],
        guidance: [
          "Credit authentication, maintainability and clear user guidance.",
        ],
      },
      reflectionPrompt:
        "Design a defensive input routine for entering a whole-number age from 11 to 18.",
    },

    {
      id: "programming-challenge",
      title: "Programming Challenge",
      description:
        "Combine programming constructs to solve a structured problem.",
      estimatedTime: "28 mins",
      xpReward: 130,
      simulator: "python",
      objectives: [
        "Decompose a programming problem.",
        "Combine input, selection, iteration and subroutines.",
        "Test and improve a solution.",
      ],
      explanation:
        "A complete programming solution begins with analysis and decomposition. Inputs, outputs, processing, validation and test cases should be identified before implementation. The solution should then be tested against normal, boundary and invalid cases.",
      workedExample:
        "A quiz program can be decomposed into presenting questions, receiving answers, checking answers, updating a score and displaying a final result.",
      practiceQuestions: [
        {
          question: "What should be identified before coding begins?",
          answer: "Inputs, outputs and processing",
          acceptedAnswers: [
            "The problem requirements",
            "Inputs, processes, outputs and test cases",
          ],
        },
        {
          question: "Why should a large solution be divided into subroutines?",
          answer: "To improve decomposition, reuse and testing",
          acceptedAnswers: ["To make the program easier to maintain"],
        },
      ],
      checkpointQuestions: [
        {
          question: "What should happen after implementation?",
          answer: "Testing",
          acceptedAnswers: ["The program should be tested and debugged"],
        },
      ],
      examQuestion: {
        question:
          "Design an algorithm for a program that inputs five marks, validates each mark from 0 to 100, then outputs the average.",
        marks: 6,
        answer:
          "Set total to 0. Repeat five times: input a mark; while the mark is below 0 or above 100, input it again; add the valid mark to total. Calculate average as total divided by 5 and output it.",
        markScheme: [
          "Initialises a total.",
          "Repeats for five marks.",
          "Inputs each mark.",
          "Validates the range 0 to 100.",
          "Adds valid marks and calculates the average.",
          "Outputs the average.",
        ],
        guidance: ["Accept pseudocode or valid programming language."],
      },
      reflectionPrompt:
        "List the test data you would use for the five-mark average program.",
    },
  ],
};
