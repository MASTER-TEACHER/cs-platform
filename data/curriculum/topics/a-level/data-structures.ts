import type { Topic } from "@/types/curriculum";

export const dataStructuresTopic: Topic = {
  "id": "data-structures",
  "title": "Data Structures",
  "description": "Study stacks, queues, linked structures, trees, graphs and hashing at A-level depth.",
  "difficulty": "⭐⭐⭐",
  "estimatedTime": "75 mins",
  "status": "published",
  "unit": "A-level Data Structures",
  "specificationReferences": [
    "AQA 4.2",
    "OCR H446 1.4"
  ],
  "lessons": [
    {
      "id": "al-stack-queue",
      "title": "Stacks, Queues and Priority Queues",
      "description": "Model LIFO, FIFO and priority-based ADTs.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Define stack and queue operations.",
        "Trace push/pop and enqueue/dequeue.",
        "Select a suitable ADT."
      ],
      "explanation": "A stack is LIFO, a queue is FIFO, and a priority queue removes items according to priority.",
      "workedExample": "Undo history suits a stack; print jobs suit a queue; emergency tasks can use a priority queue.",
      "practiceQuestions": [
        {
          "question": "Which principle describes a stack?",
          "answer": "LIFO",
          "acceptedAnswers": [
            "Last in first out"
          ]
        },
        {
          "question": "Which principle describes a queue?",
          "answer": "FIFO",
          "acceptedAnswers": [
            "First in first out"
          ]
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Which stack operation removes the top item?",
          "answer": "Pop"
        }
      ],
      "examQuestion": {
        "question": "Compare a stack and queue and give one use of each.",
        "marks": 6,
        "answer": "A stack removes the most recently added item and suits undo/history. A queue removes the earliest waiting item and suits print/task scheduling.",
        "markScheme": [
          "Defines stack order.",
          "Suitable stack use.",
          "Explains stack use.",
          "Defines queue order.",
          "Suitable queue use.",
          "Explains queue use."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Choose an ADT for undo, print jobs and emergency triage."
    },
    {
      "id": "al-linked",
      "title": "Linked Lists",
      "description": "Explain nodes, references and dynamic insertion/deletion.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Describe nodes and links.",
        "Trace insertion and deletion.",
        "Compare arrays and linked lists."
      ],
      "explanation": "A linked list stores nodes containing data and references. Nodes need not be contiguous, making insertion flexible but indexed access slower.",
      "workedExample": "Insert B between A and C by setting B.next to C and A.next to B.",
      "practiceQuestions": [
        {
          "question": "What does a node usually store?",
          "answer": "Data and a reference to another node"
        },
        {
          "question": "Why can insertion be efficient?",
          "answer": "Nodes can be relinked without shifting all later items"
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Give one disadvantage of a linked list.",
          "answer": "Sequential access",
          "acceptedAnswers": [
            "Extra memory for links",
            "No direct indexing"
          ]
        }
      ],
      "examQuestion": {
        "question": "Explain why a linked list may be preferred to an array for frequently changing data.",
        "marks": 5,
        "answer": "Linked lists grow dynamically and support insertion/deletion by relinking, but arbitrary access requires traversal and links use extra memory.",
        "markScheme": [
          "Dynamic size.",
          "Relinking.",
          "Avoids shifting.",
          "Recognises traversal cost.",
          "Balanced comparison."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Explain when an array would be the better choice."
    },
    {
      "id": "al-trees-graphs",
      "title": "Trees and Graphs",
      "description": "Represent hierarchical and network data structures.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Use tree terminology.",
        "Explain binary-search-tree ordering.",
        "Explain vertices, edges and traversal."
      ],
      "explanation": "Trees model hierarchy. Graphs model arbitrary relationships using vertices and edges. Search/traversal strategies depend on the structure and problem.",
      "workedExample": "A BST places smaller keys left and larger keys right; a route network can use weighted graph edges for distance.",
      "practiceQuestions": [
        {
          "question": "What is the top node of a tree called?",
          "answer": "Root"
        },
        {
          "question": "What is a graph vertex?",
          "answer": "A node in a graph"
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Why track visited graph vertices?",
          "answer": "To avoid revisiting nodes indefinitely",
          "acceptedAnswers": [
            "To prevent loops"
          ]
        }
      ],
      "examQuestion": {
        "question": "Compare a binary search tree with a general graph.",
        "marks": 5,
        "answer": "A BST is hierarchical and ordered for searching; a graph can represent arbitrary directed/undirected relationships and may contain cycles.",
        "markScheme": [
          "BST hierarchy.",
          "BST ordering.",
          "Graph arbitrary connections.",
          "Graph may contain cycles.",
          "Valid comparison."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Give one real-world problem suited to a tree and one suited to a graph."
    }
  ]
};
