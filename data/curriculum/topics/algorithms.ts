import type { Topic } from "@/types/curriculum";

export const algorithmsTopic: Topic = {
  id: "algorithms",
  title: "Algorithms",
  description:
    "Develop computational thinking, searching, sorting, trace-table and algorithm-design skills.",
  difficulty: "⭐⭐☆",
  estimatedTime: "120 mins",
  simulator: "linear-search",
  status: "published",
  unit: "Algorithms",
  specificationReferences: ["AQA 3.1", "AQA 3.2"],

  lessons: [
    {
      id: "computational-thinking",
      title: "Computational Thinking",
      description:
        "Use decomposition, abstraction and algorithmic thinking to solve problems.",
      estimatedTime: "18 mins",
      xpReward: 80,
      objectives: [
        "Define decomposition.",
        "Define abstraction.",
        "Explain algorithmic thinking.",
      ],
      explanation:
        "Decomposition breaks a complex problem into smaller parts. Abstraction removes unnecessary detail and focuses on important information. Algorithmic thinking develops a clear sequence of steps that can solve a problem.",
      workedExample:
        "A school booking system can be decomposed into login, room search, availability checking, booking and confirmation.",
      practiceQuestions: [
        {
          question: "What is decomposition?",
          answer: "Breaking a problem into smaller parts",
          acceptedAnswers: [
            "Splitting a complex problem into manageable sub-problems",
          ],
        },
        {
          question: "What is abstraction?",
          answer: "Removing unnecessary detail",
          acceptedAnswers: ["Focusing only on relevant information"],
        },
      ],
      checkpointQuestions: [
        {
          question:
            "Which computational-thinking technique creates a step-by-step solution?",
          answer: "Algorithmic thinking",
          acceptedAnswers: ["Algorithm design"],
        },
      ],
      examQuestion: {
        question:
          "Explain how decomposition and abstraction could help when designing a school timetable system.",
        marks: 4,
        answer:
          "Decomposition separates the system into smaller parts such as teachers, rooms, subjects and time slots. Abstraction ignores irrelevant details and keeps only information needed to create a valid timetable.",
        markScheme: [
          "Breaks the problem into smaller parts.",
          "Provides a relevant sub-problem.",
          "Removes unnecessary detail.",
          "Keeps relevant constraints or information.",
        ],
        guidance: ["Credit relevant timetable examples."],
      },
      reflectionPrompt:
        "Describe a real-world problem and show how you would decompose it.",
    },

    {
      id: "linear-search",
      title: "Linear Search",
      description: "Understand how a linear search checks values one by one.",
      estimatedTime: "18 mins",
      xpReward: 85,
      simulator: "linear-search",
      objectives: [
        "Describe linear search.",
        "Trace a linear search.",
        "Explain when linear search is suitable.",
      ],
      explanation:
        "Linear search checks each item in sequence until the target is found or the list ends. It works on sorted and unsorted data, but may require checking every item.",
      workedExample:
        "Searching [7, 3, 9, 5] for 9 checks 7, then 3, then 9. The target is found after three comparisons.",
      practiceQuestions: [
        {
          question: "Does a list need to be sorted before using linear search?",
          answer: "No",
        },
        {
          question:
            "In the worst case, how many items might linear search inspect?",
          answer: "Every item",
          acceptedAnswers: ["All items in the list"],
        },
      ],
      checkpointQuestions: [
        {
          question: "Which item is checked first in a linear search?",
          answer: "The first item",
        },
      ],
      examQuestion: {
        question: "Describe how linear search finds a target value in a list.",
        marks: 4,
        answer:
          "The algorithm starts at the first item and compares it with the target. If it does not match, it moves to the next item. This continues until the target is found or the end of the list is reached.",
        markScheme: [
          "Starts at the first item.",
          "Compares the current item with the target.",
          "Moves sequentially to the next item.",
          "Stops when found or when the list ends.",
        ],
        guidance: ["Credit accurate sequencing."],
      },
      reflectionPrompt:
        "Explain one advantage and one disadvantage of linear search.",
    },

    {
      id: "binary-search",
      title: "Binary Search",
      description: "Search sorted data by repeatedly halving the search area.",
      estimatedTime: "20 mins",
      xpReward: 95,
      simulator: "binary-search",
      objectives: [
        "State the requirement for binary search.",
        "Trace the halving process.",
        "Compare binary and linear search.",
      ],
      explanation:
        "Binary search requires sorted data. It compares the target with the middle item. If the target is smaller, the upper half is discarded; if larger, the lower half is discarded. The process repeats until the target is found or no items remain.",
      workedExample:
        "To find 21 in [3, 7, 12, 18, 21, 25, 30], compare with 18, discard the lower half, then compare with 25 and finally 21.",
      practiceQuestions: [
        {
          question: "What condition must be true before binary search is used?",
          answer: "The data must be sorted",
          acceptedAnswers: ["The list must be in order"],
        },
        {
          question:
            "What happens to the search area after each binary-search comparison?",
          answer: "It is approximately halved",
          acceptedAnswers: ["Half is discarded"],
        },
      ],
      checkpointQuestions: [
        {
          question: "Which item is inspected first in binary search?",
          answer: "The middle item",
        },
      ],
      examQuestion: {
        question:
          "Explain why binary search is normally faster than linear search on a large sorted list.",
        marks: 4,
        answer:
          "Binary search compares the middle item and discards half of the remaining search area after each comparison. Linear search may inspect items one by one, so it can require many more comparisons.",
        markScheme: [
          "Binary search checks the middle item.",
          "It discards half the search area.",
          "The number of remaining items falls rapidly.",
          "Linear search may inspect items sequentially.",
        ],
        guidance: ["The sorted-data requirement may also receive credit."],
      },
      reflectionPrompt:
        "Explain why binary search is unsuitable for an unsorted list.",
    },

    {
      id: "bubble-sort",
      title: "Bubble Sort",
      description: "Sort values by comparing and swapping adjacent items.",
      estimatedTime: "20 mins",
      xpReward: 95,
      simulator: "bubble-sort",
      objectives: [
        "Describe bubble sort.",
        "Trace comparisons and swaps.",
        "Explain the purpose of repeated passes.",
      ],
      explanation:
        "Bubble sort compares adjacent items. If they are in the wrong order, they are swapped. A complete pass moves a large value towards the end. Passes repeat until no swaps are needed.",
      workedExample:
        "For [5, 2, 4], compare 5 and 2 and swap to get [2, 5, 4]. Compare 5 and 4 and swap to get [2, 4, 5].",
      practiceQuestions: [
        {
          question: "Which items are compared in bubble sort?",
          answer: "Adjacent items",
          acceptedAnswers: ["Neighbouring values"],
        },
        {
          question: "When can bubble sort stop early?",
          answer: "When a pass makes no swaps",
          acceptedAnswers: ["When the list is already sorted"],
        },
      ],
      checkpointQuestions: [
        {
          question:
            "What operation occurs when adjacent values are in the wrong order?",
          answer: "They are swapped",
        },
      ],
      examQuestion: {
        question:
          "Describe how bubble sort orders a list into ascending order.",
        marks: 5,
        answer:
          "Adjacent values are compared. If the left value is greater, the pair is swapped. The algorithm continues across the list. Repeated passes are made until a complete pass produces no swaps.",
        markScheme: [
          "Compares adjacent items.",
          "Checks whether they are in the wrong order.",
          "Swaps incorrect pairs.",
          "Continues across the list.",
          "Repeats until no swaps are needed.",
        ],
        guidance: ["Credit accurate equivalent wording."],
      },
      reflectionPrompt:
        "Explain why bubble sort may be inefficient for a very large list.",
    },

    {
      id: "merge-sort",
      title: "Merge Sort",
      description: "Sort data by splitting and merging ordered sublists.",
      estimatedTime: "22 mins",
      xpReward: 100,
      simulator: "merge-sort",
      objectives: [
        "Describe the split phase.",
        "Describe the merge phase.",
        "Compare merge sort with bubble sort.",
      ],
      explanation:
        "Merge sort repeatedly divides a list until each sublist contains one item. It then merges sublists in order by comparing their front values. The process continues until one sorted list remains.",
      workedExample:
        "[8, 3, 6, 2] splits into [8, 3] and [6, 2], then single items. Merging produces [3, 8] and [2, 6], then [2, 3, 6, 8].",
      practiceQuestions: [
        {
          question: "When does the splitting phase stop?",
          answer: "When each sublist contains one item",
          acceptedAnswers: ["At single-item lists"],
        },
        {
          question: "What happens during the merge phase?",
          answer: "Sorted sublists are combined in order",
          acceptedAnswers: ["Front values are compared and merged"],
        },
      ],
      checkpointQuestions: [
        {
          question: "Does merge sort use divide and conquer?",
          answer: "Yes",
        },
      ],
      examQuestion: {
        question: "Describe the main stages of merge sort.",
        marks: 5,
        answer:
          "The list is repeatedly divided into smaller sublists until each contains one item. Pairs of sublists are then merged by comparing their values and placing them in order. Merging continues until one sorted list remains.",
        markScheme: [
          "Repeatedly divides the list.",
          "Continues to single-item sublists.",
          "Compares values while merging.",
          "Creates ordered merged sublists.",
          "Continues until one sorted list remains.",
        ],
        guidance: ["Credit divide-and-conquer terminology."],
      },
      reflectionPrompt:
        "Explain why merge sort requires additional temporary storage.",
    },

    {
      id: "insertion-sort",
      title: "Insertion Sort",
      description:
        "Build a sorted section by inserting each value into its correct position.",
      estimatedTime: "22 mins",
      xpReward: 100,
      simulator: "insertion-sort",

      objectives: [
        "Describe how insertion sort works.",
        "Identify the sorted and unsorted sections of a list.",
        "Trace shifts and insertions.",
        "Compare insertion sort with other sorting algorithms.",
      ],

      explanation:
        "Insertion sort builds a sorted section of the list from left to right. The next unsorted value is stored as a key. Values in the sorted section that are greater than the key are shifted one position to the right. The key is then inserted into the gap created. This process repeats until every item belongs to the sorted section.",

      workedExample:
        "For [5, 2, 4], begin with 5 as the sorted section. Take 2 as the key, shift 5 right and insert 2 to produce [2, 5, 4]. Then take 4, shift 5 right and insert 4 between 2 and 5, producing [2, 4, 5].",

      practiceQuestions: [
        {
          question:
            "Which part of the list is already ordered during insertion sort?",
          answer: "The sorted section",
          acceptedAnswers: [
            "The left-hand sorted section",
            "The values to the left",
          ],
        },
        {
          question: "What happens to values larger than the key?",
          answer: "They are shifted one position to the right",
          acceptedAnswers: ["They move right"],
        },
        {
          question: "What is the key value?",
          answer: "The next unsorted value being inserted",
          acceptedAnswers: [
            "The value currently being placed into the sorted section",
          ],
        },
      ],

      checkpointQuestions: [
        {
          question:
            "After inserting 3 into the sorted section [2, 5, 7], what does the section become?",
          answer: "[2, 3, 5, 7]",
          acceptedAnswers: ["2, 3, 5, 7"],
        },
      ],

      examQuestion: {
        question:
          "Describe how insertion sort can be used to arrange a list into ascending order.",
        marks: 5,
        answer:
          "Insertion sort treats the first item as a sorted section. It takes the next unsorted value as a key and compares it with values in the sorted section. Larger values are shifted to the right. The key is inserted into the correct position. The process repeats until all values are sorted.",
        markScheme: [
          "Identifies a sorted section.",
          "Selects the next unsorted value as the key.",
          "Compares the key with values in the sorted section.",
          "Shifts larger values and inserts the key.",
          "Repeats until the whole list is sorted.",
        ],
        guidance: ["Credit equivalent step-by-step descriptions."],
      },

      reflectionPrompt:
        "Explain why insertion sort may perform well when a list is already nearly sorted.",
    },

    {
      id: "quick-sort",
      title: "Quick Sort",
      description:
        "Use pivots, partitioning and recursion to divide and sort a list efficiently.",
      estimatedTime: "26 mins",
      xpReward: 125,
      simulator: "quick-sort",

      objectives: [
        "Explain the purpose of a pivot.",
        "Describe how a list is partitioned.",
        "Explain how quick sort uses recursion.",
        "Trace a simple quick-sort example.",
        "Compare quick sort with other sorting algorithms.",
      ],

      explanation:
        "Quick sort is a divide-and-conquer sorting algorithm. A pivot is selected from the current section of the list. Values are partitioned so that smaller values are placed on one side of the pivot and larger values on the other. The pivot reaches its final sorted position. The same process is then applied recursively to the smaller partitions until the complete list is sorted.",

      workedExample:
        "For [6, 3, 8, 2, 7], choose 7 as the pivot. Values smaller than or equal to 7 are placed before it and larger values after it, producing a partition such as [6, 3, 2, 7, 8]. Quick sort then repeats independently on [6, 3, 2] and [8].",

      practiceQuestions: [
        {
          question:
            "What is the selected comparison value in quick sort called?",
          answer: "Pivot",
          acceptedAnswers: ["The pivot"],
        },
        {
          question: "What happens during partitioning?",
          answer: "Values are arranged on different sides of the pivot",
          acceptedAnswers: [
            "Smaller values go to one side and larger values to the other",
          ],
        },
        {
          question:
            "What technique allows quick sort to repeat on smaller partitions?",
          answer: "Recursion",
          acceptedAnswers: ["Recursive calls"],
        },
      ],

      checkpointQuestions: [
        {
          question:
            "After a partition is completed, what is true about the pivot?",
          answer: "It is in its final sorted position",
          acceptedAnswers: ["The pivot is correctly positioned"],
        },
      ],

      examQuestion: {
        question: "Describe the main stages of quick sort.",
        marks: 6,
        answer:
          "A pivot value is selected. The remaining values are compared with the pivot and partitioned so smaller values are placed on one side and larger values on the other. The pivot is placed into its final position. The same process is then applied recursively to each smaller partition until the list is sorted.",
        markScheme: [
          "Selects a pivot.",
          "Compares values with the pivot.",
          "Partitions smaller values to one side.",
          "Partitions larger values to the other side.",
          "Places the pivot into its sorted position.",
          "Recursively repeats the process on the smaller partitions.",
        ],
        guidance: [
          "Quick sort should be treated as advanced or board-specific content where it is not compulsory.",
        ],
      },

      reflectionPrompt:
        "Explain why the choice of pivot can affect the performance of quick sort.",
    },

    {
      id: "trace-tables",
      title: "Trace Tables",
      description:
        "Record how variables and outputs change while an algorithm runs.",
      estimatedTime: "20 mins",
      xpReward: 100,
      simulator: "trace-table",
      objectives: [
        "Explain the purpose of a trace table.",
        "Trace variables through selection and iteration.",
        "Use trace results to identify errors.",
      ],
      explanation:
        "A trace table records variable values, conditions and outputs after each important step of an algorithm. It helps predict behaviour and locate logic errors.",
      workedExample:
        "For total = 0 and a loop adding 1, 2 and 3, the total column records 1, then 3, then 6.",
      practiceQuestions: [
        {
          question: "What does a trace table record?",
          answer:
            "How variable values and outputs change as an algorithm executes",
          acceptedAnswers: [
            "The state of variables at each step",
            "Values during execution",
          ],
        },
        {
          question: "Give one use of a trace table.",
          answer: "To predict an algorithm's output",
          acceptedAnswers: ["To find logic errors", "To test an algorithm"],
        },
      ],
      checkpointQuestions: [
        {
          question:
            "Should a trace-table row be added when an important variable changes?",
          answer: "Yes",
        },
      ],
      examQuestion: {
        question:
          "Explain how a trace table can help a programmer test an algorithm.",
        marks: 4,
        answer:
          "The programmer records variable values, conditions and outputs as the algorithm runs. These can be compared with expected values, helping identify the step at which incorrect behaviour begins.",
        markScheme: [
          "Records variable values.",
          "Records conditions or outputs.",
          "Compares actual and expected behaviour.",
          "Helps locate the step containing a logic error.",
        ],
        guidance: ["Credit a clear testing explanation."],
      },
      reflectionPrompt:
        "Explain why carefully chosen test data improves the value of a trace table.",
    },

    {
      id: "flowcharts-pseudocode",
      title: "Flowcharts and Pseudocode",
      description:
        "Represent algorithms using pseudocode and standard flowchart symbols.",
      estimatedTime: "25 mins",
      xpReward: 110,
      simulator: "flowchart",

      objectives: [
        "Identify common flowchart symbols.",
        "Explain the purpose of flowcharts and pseudocode.",
        "Follow the execution of a flowchart.",
        "Convert simple pseudocode into a flowchart.",
        "Represent sequence, selection and iteration.",
      ],

      explanation:
        "Algorithms can be represented using pseudocode or flowcharts. Pseudocode expresses an algorithm using structured, language-independent instructions. Flowcharts represent the same logic visually using standard symbols connected by arrows. A Start/End symbol identifies the beginning or end of an algorithm. Input/Output symbols represent data entering or leaving the algorithm. Process symbols represent calculations or assignments, while decision symbols represent conditions that can lead to different paths. Flowcharts can represent sequence, selection and iteration.",

      workedExample: `Consider this pseudocode:

START
INPUT score

IF score >= 50 THEN
    OUTPUT "Pass"
ELSE
    OUTPUT "Fail"
ENDIF

END

The equivalent flowchart begins with Start, followed by Input score. A decision checks whether score >= 50. The Yes path outputs "Pass", while the No path outputs "Fail". Both paths eventually reach End.`,

      practiceQuestions: [
        {
          question: "Which flowchart symbol is normally used for a decision?",
          answer: "Diamond",
          acceptedAnswers: ["Decision diamond", "Diamond symbol"],
        },
        {
          question:
            "Which flowchart symbol represents a calculation or assignment?",
          answer: "Process",
          acceptedAnswers: ["Process box", "Rectangle"],
        },
        {
          question: "What do arrows show in a flowchart?",
          answer: "The direction of execution",
          acceptedAnswers: [
            "Program flow",
            "Flow of control",
            "The order of execution",
          ],
        },
        {
          question: "What is pseudocode?",
          answer: "A language-independent way of describing an algorithm",
          acceptedAnswers: [
            "A structured description of an algorithm",
            "A way of representing an algorithm without using a specific programming language",
          ],
        },
      ],

      checkpointQuestions: [
        {
          question: "Which flowchart symbol would be used for INPUT name?",
          answer: "Input/output",
          acceptedAnswers: ["Input output", "Parallelogram"],
        },
        {
          question:
            "Which programming construct is represented when a decision causes one of two different paths to execute?",
          answer: "Selection",
          acceptedAnswers: ["Conditional selection", "IF statement"],
        },
        {
          question:
            "What programming construct is represented when arrows return to an earlier decision and repeat instructions?",
          answer: "Iteration",
          acceptedAnswers: ["Loop", "Repetition"],
        },
      ],

      examQuestion: {
        question: `A program asks the user to enter a temperature.

If the temperature is greater than 30, the program outputs "Hot".
Otherwise, it outputs "Normal".

Describe how this algorithm could be represented as a flowchart.`,
        marks: 6,

        answer: `The flowchart should begin with a Start symbol. An input/output symbol should be used to input the temperature. A decision symbol should test whether temperature > 30. The Yes branch should lead to an output symbol displaying "Hot". The No branch should lead to an output symbol displaying "Normal". Both paths should then lead to an End symbol.`,

        markScheme: [
          "Includes a Start symbol.",
          "Uses an input/output symbol to input temperature.",
          "Uses a decision symbol for temperature > 30.",
          'Correct Yes branch outputs "Hot".',
          'Correct No branch outputs "Normal".',
          "Both paths lead to an End symbol.",
        ],

        guidance: [
          "Credit equivalent descriptions that clearly identify correct flowchart symbols and control flow.",
        ],
      },

      reflectionPrompt:
        "Explain one situation where a flowchart may be easier to understand than pseudocode and one situation where pseudocode may be more convenient.",
    },
  ],
};
