import type { Topic } from "@/types/curriculum";

type Lesson = Topic["lessons"][number];

export const supplementalALevelLessons: Record<string, Lesson[]> =
{
  "advanced-programming": [
    {
      "id": "al-files-exceptions",
      "title": "Files, Exceptions and Robust Input",
      "description": "Use file handling and exceptions safely in larger programs.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Use sequential file operations.",
        "Explain exception handling.",
        "Distinguish validation from exception handling."
      ],
      "explanation": "Robust programs validate expected user errors and also handle exceptional failures such as unavailable files or failed conversions.",
      "workedExample": "A program can validate a filename format before attempting a file operation, then catch an I/O exception if the resource is unavailable.",
      "practiceQuestions": [
        {
          "question": "Why is validation not the same as exception handling?",
          "answer": "Validation checks expected invalid input; exceptions handle exceptional failures."
        },
        {
          "question": "What should happen after a recoverable exception?",
          "answer": "The program should handle it predictably, for example by reporting the problem or retrying."
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Should every programming error be caught and ignored?",
          "answer": "No"
        }
      ],
      "examQuestion": {
        "question": "Explain how validation and exception handling work together in robust software.",
        "marks": 6,
        "answer": "Validation rejects predictable invalid data before processing; exception handling responds to failures that still occur during execution. Both should give controlled behaviour rather than hiding defects.",
        "markScheme": [
          "Validation purpose.",
          "Exception purpose.",
          "Difference between them.",
          "Controlled recovery.",
          "Avoids silent failure.",
          "Developed link to robustness."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Identify one place in your own code where validation and exception handling should be different."
    },
    {
      "id": "al-abstract-data-types",
      "title": "Abstract Data Types and Interfaces",
      "description": "Separate the behaviour promised by a data type from its implementation.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Define an abstract data type.",
        "Explain interface versus implementation.",
        "Choose an implementation based on required operations."
      ],
      "explanation": "An abstract data type specifies what operations are available and what they mean, without requiring users to know the underlying representation.",
      "workedExample": "A queue ADT promises enqueue, dequeue and front operations whether it is implemented using an array, circular buffer or linked structure.",
      "practiceQuestions": [
        {
          "question": "What does an ADT specify?",
          "answer": "The behaviour and operations of a data type."
        },
        {
          "question": "Does an ADT require one implementation?",
          "answer": "No"
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Can two implementations provide the same ADT?",
          "answer": "Yes"
        }
      ],
      "examQuestion": {
        "question": "Explain why separating an ADT from its implementation improves software design.",
        "marks": 5,
        "answer": "Clients can depend on stable operations while the internal representation changes. This supports encapsulation, testing and replacement of implementations.",
        "markScheme": [
          "Defines ADT.",
          "Separates interface/implementation.",
          "Encapsulation.",
          "Implementation can change.",
          "Client code impact reduced."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Name one structure where you would benefit from hiding the implementation."
    }
  ],
  "data-structures": [
    {
      "id": "al-hash-tables",
      "title": "Hash Tables and Collision Handling",
      "description": "Use hashing for efficient keyed access and analyse collision strategies.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Explain a hash function.",
        "Explain collisions.",
        "Compare chaining and open addressing."
      ],
      "explanation": "A hash table maps keys to table positions. Because many keys share a finite table, collisions must be resolved consistently.",
      "workedExample": "Chaining stores colliding items in a secondary collection at the same slot; open addressing probes alternative slots.",
      "practiceQuestions": [
        {
          "question": "Why can collisions occur?",
          "answer": "Different keys can map to the same table index."
        },
        {
          "question": "Name one collision strategy.",
          "answer": "Chaining or open addressing."
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Can a good hash function guarantee no collisions for arbitrary keys?",
          "answer": "No"
        }
      ],
      "examQuestion": {
        "question": "Evaluate a hash table for frequent exact lookup by unique identifier.",
        "marks": 6,
        "answer": "Hash tables can give near-constant average lookup with a suitable hash function and load factor, but collisions, resizing and lack of natural ordering must be managed.",
        "markScheme": [
          "Fast average lookup.",
          "Hash function.",
          "Collision handling.",
          "Load factor.",
          "Ordering limitation.",
          "Judgement."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "When would a balanced tree be preferable to a hash table?"
    },
    {
      "id": "al-binary-trees",
      "title": "Binary Search Trees and Tree Traversal",
      "description": "Use ordered trees and analyse traversal behaviour.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Apply BST ordering.",
        "Trace tree searches.",
        "Compare inorder, preorder and postorder traversal."
      ],
      "explanation": "A binary search tree places lower and higher keys on predictable branches. Tree height strongly affects operation cost.",
      "workedExample": "Inorder traversal of a valid BST visits keys in sorted order.",
      "practiceQuestions": [
        {
          "question": "What does inorder traversal of a BST produce?",
          "answer": "Keys in sorted order."
        },
        {
          "question": "What property affects BST search performance most directly?",
          "answer": "Tree height or balance."
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Can an unbalanced BST degrade to linear search behaviour?",
          "answer": "Yes"
        }
      ],
      "examQuestion": {
        "question": "Explain why balancing matters in a binary search tree.",
        "marks": 5,
        "answer": "Balanced trees keep height relatively small, so searches typically require far fewer comparisons than a chain-like unbalanced tree.",
        "markScheme": [
          "Tree height.",
          "Branch comparisons.",
          "Balanced case.",
          "Unbalanced case.",
          "Performance consequence."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Sketch a sequence of inserts that would create a badly unbalanced BST."
    }
  ],
  "computational-thinking": [
    {
      "id": "al-thinking-ahead",
      "title": "Thinking Ahead and State Transitions",
      "description": "Reason about future states, dependencies and consequences before coding.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Identify dependencies.",
        "Predict state changes.",
        "Use preconditions and postconditions."
      ],
      "explanation": "Thinking ahead means considering how a current decision changes later states and what assumptions must remain true.",
      "workedExample": "Before deleting a record, a designer checks whether other records still reference it and plans the resulting state.",
      "practiceQuestions": [
        {
          "question": "What is a precondition?",
          "answer": "Something that must be true before an operation."
        },
        {
          "question": "What is a postcondition?",
          "answer": "Something expected to be true after an operation."
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Can local decisions create later constraints?",
          "answer": "Yes"
        }
      ],
      "examQuestion": {
        "question": "Explain how preconditions and postconditions support algorithm reasoning.",
        "marks": 5,
        "answer": "They define the contract around an operation, expose assumptions and provide testable statements about required starting and ending states.",
        "markScheme": [
          "Precondition.",
          "Postcondition.",
          "Contract.",
          "Reasoning benefit.",
          "Testing benefit."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Write a precondition and postcondition for one operation in your own project."
    },
    {
      "id": "al-thinking-logically",
      "title": "Thinking Logically and Concurrently",
      "description": "Use logical reasoning and recognise opportunities for independent work.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Use invariants and logical conditions.",
        "Identify independent subtasks.",
        "Recognise dependencies that prevent safe parallelism."
      ],
      "explanation": "Logical reasoning checks whether conclusions follow from known conditions. Concurrent thinking asks which activities can progress independently without conflicting state.",
      "workedExample": "Two image-processing operations on separate files may run concurrently, while two writes to the same shared total require coordination.",
      "practiceQuestions": [
        {
          "question": "What is an invariant?",
          "answer": "A condition intended to remain true during an algorithm or process."
        },
        {
          "question": "When are two tasks safely independent?",
          "answer": "When neither relies on conflicting shared state or ordering constraints."
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Does concurrency automatically make every task faster?",
          "answer": "No"
        }
      ],
      "examQuestion": {
        "question": "Evaluate whether a problem should be decomposed into concurrent tasks.",
        "marks": 6,
        "answer": "Concurrency can reduce elapsed time for independent work, but dependencies, shared state, coordination and overhead can limit or reverse the benefit.",
        "markScheme": [
          "Independent work.",
          "Dependencies.",
          "Shared state.",
          "Overhead.",
          "Correctness.",
          "Judgement."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Identify one part of a system that should remain sequential and explain why."
    }
  ],
  "advanced-data-representation": [
    {
      "id": "al-character-encoding",
      "title": "Unicode and Character Encoding",
      "description": "Understand Unicode, code points and variable-length encodings.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Explain Unicode code points.",
        "Explain why UTF-8 is variable length.",
        "Compare global character support with ASCII."
      ],
      "explanation": "Unicode defines a large repertoire of characters; encodings such as UTF-8 represent those code points using sequences of bytes.",
      "workedExample": "ASCII characters occupy one byte in UTF-8, while many other characters use multiple bytes.",
      "practiceQuestions": [
        {
          "question": "What is a Unicode code point?",
          "answer": "A numeric identifier for a character."
        },
        {
          "question": "Why can UTF-8 use different numbers of bytes?",
          "answer": "Different code points are encoded with variable-length byte sequences."
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Is Unicode the same thing as one fixed-width byte encoding?",
          "answer": "No"
        }
      ],
      "examQuestion": {
        "question": "Compare ASCII with Unicode for an international messaging system.",
        "marks": 5,
        "answer": "ASCII has a small character repertoire, while Unicode supports many writing systems and symbols. UTF-8 is therefore more suitable for international text.",
        "markScheme": [
          "ASCII limitation.",
          "Unicode breadth.",
          "International need.",
          "Encoding point.",
          "Conclusion."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "What text could your application fail to represent if it assumed ASCII?"
    },
    {
      "id": "al-compression-coding",
      "title": "Compression and Information Representation",
      "description": "Analyse lossless/lossy compression and coding trade-offs.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Distinguish lossless and lossy compression.",
        "Explain why redundancy enables compression.",
        "Choose a method for a scenario."
      ],
      "explanation": "Compression reduces stored or transmitted data by exploiting redundancy or, in lossy methods, by removing information considered less important.",
      "workedExample": "Run-length encoding works well on long repeated sequences but can increase size for highly varied data.",
      "practiceQuestions": [
        {
          "question": "When is lossless compression essential?",
          "answer": "When the original data must be reconstructed exactly."
        },
        {
          "question": "Can compression ever increase file size?",
          "answer": "Yes, for unsuitable data or due to overhead."
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Does lossy compression preserve every source bit?",
          "answer": "No"
        }
      ],
      "examQuestion": {
        "question": "Evaluate lossless and lossy compression for a chosen data type.",
        "marks": 6,
        "answer": "Lossless preserves exact reconstruction but often achieves smaller reductions; lossy can reduce size further by discarding information, so suitability depends on whether information loss is acceptable.",
        "markScheme": [
          "Lossless definition.",
          "Lossy definition.",
          "Size trade-off.",
          "Quality trade-off.",
          "Scenario link.",
          "Judgement."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Choose one data type and justify an appropriate compression approach."
    }
  ],
  "advanced-systems": [
    {
      "id": "al-io-storage",
      "title": "Input, Output and Storage at A-level",
      "description": "Evaluate devices and storage technologies for different contexts.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Compare storage technologies.",
        "Evaluate device suitability.",
        "Explain RAM, ROM and virtual storage."
      ],
      "explanation": "System design should select input, output and storage technologies based on capacity, speed, durability, portability, cost and operating conditions.",
      "workedExample": "A rugged embedded logger may favour solid-state storage because it has no moving parts.",
      "practiceQuestions": [
        {
          "question": "Name one factor in choosing storage.",
          "answer": "Capacity, speed, durability, cost or portability."
        },
        {
          "question": "Is virtual storage the same as virtual memory?",
          "answer": "No"
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Should the fastest device always be chosen?",
          "answer": "No"
        }
      ],
      "examQuestion": {
        "question": "Recommend a storage technology for a field data logger and justify the choice.",
        "marks": 6,
        "answer": "A suitable answer weighs capacity, power, physical robustness, write endurance, speed and cost against the deployment conditions.",
        "markScheme": [
          "Relevant technology.",
          "Capacity.",
          "Performance.",
          "Reliability.",
          "Context.",
          "Judgement."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Which storage criterion matters most for one device you use regularly?"
    },
    {
      "id": "al-boolean-hardware",
      "title": "Boolean Logic and Hardware Control",
      "description": "Apply Boolean expressions to system behaviour and logic design.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Construct truth tables.",
        "Simplify logical conditions.",
        "Relate Boolean logic to hardware control."
      ],
      "explanation": "Boolean expressions describe decisions using true/false values and can be implemented by logic gates or software conditions.",
      "workedExample": "A safety output might activate only when two independent checks are true and an emergency-stop input is false.",
      "practiceQuestions": [
        {
          "question": "What values does Boolean logic use?",
          "answer": "True/false or 1/0."
        },
        {
          "question": "What does NOT do?",
          "answer": "Inverts a Boolean value."
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Can equivalent Boolean expressions have different written forms?",
          "answer": "Yes"
        }
      ],
      "examQuestion": {
        "question": "Explain how a truth table can be used to verify a Boolean control expression.",
        "marks": 5,
        "answer": "The truth table enumerates all possible input combinations and compares the expression's output with the required behaviour, exposing missing or incorrect cases.",
        "markScheme": [
          "All combinations.",
          "Evaluate expression.",
          "Compare requirement.",
          "Find incorrect cases.",
          "Verification purpose."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Write a Boolean rule for one real system condition."
    }
  ],
  "advanced-networks": [
    {
      "id": "al-web-technologies",
      "title": "Web Technologies and Client-Server Communication",
      "description": "Understand requests, responses, web resources and client-server roles.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Explain client-server interaction.",
        "Distinguish HTML, CSS and JavaScript roles.",
        "Explain HTTP request/response behaviour."
      ],
      "explanation": "Web applications combine network protocols with resources interpreted by the browser. The client requests resources and services from one or more servers.",
      "workedExample": "A browser requests a page, then may request stylesheets, scripts and API data separately.",
      "practiceQuestions": [
        {
          "question": "What protocol commonly carries web requests?",
          "answer": "HTTP or HTTPS."
        },
        {
          "question": "What is JavaScript commonly used for in a browser?",
          "answer": "Behaviour and interactive logic."
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Does one web page necessarily require only one network request?",
          "answer": "No"
        }
      ],
      "examQuestion": {
        "question": "Explain the roles of HTML, CSS, JavaScript and HTTP in a web application.",
        "marks": 6,
        "answer": "HTML provides structure/content, CSS presentation, JavaScript behaviour, and HTTP/HTTPS transports requests and responses between client and server.",
        "markScheme": [
          "HTML.",
          "CSS.",
          "JavaScript.",
          "HTTP.",
          "Client/server relation.",
          "Integrated explanation."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Trace the requests a browser might make when loading one modern page."
    },
    {
      "id": "al-internet-addressing",
      "title": "Addressing, DNS and Internet Routing",
      "description": "Connect addressing, naming and routing across networks.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Explain IP addressing.",
        "Explain DNS resolution.",
        "Explain routing between networks."
      ],
      "explanation": "IP addresses identify network endpoints, DNS maps human-friendly names to records, and routers forward packets toward destination networks.",
      "workedExample": "A user enters a domain name; DNS supplies an address and routers then forward packets toward that address.",
      "practiceQuestions": [
        {
          "question": "What does DNS primarily resolve?",
          "answer": "Domain names to records such as IP addresses."
        },
        {
          "question": "What device forwards packets between networks?",
          "answer": "A router."
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Is a domain name itself the destination IP address?",
          "answer": "No"
        }
      ],
      "examQuestion": {
        "question": "Explain the sequence from entering a domain name to sending a packet toward the server.",
        "marks": 6,
        "answer": "The client resolves the name through DNS, obtains an IP address, creates packets for that destination and sends them through routers using routing information.",
        "markScheme": [
          "DNS request.",
          "Address returned.",
          "Packet destination.",
          "Router role.",
          "Multiple hops.",
          "Coherent sequence."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Why can a DNS failure stop access even when the server itself is online?"
    }
  ],
  "advanced-databases": [
    {
      "id": "al-indexes",
      "title": "Indexes and Query Performance",
      "description": "Understand how indexes trade storage/write cost for faster retrieval.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Explain an index.",
        "Relate indexes to search performance.",
        "Evaluate indexing trade-offs."
      ],
      "explanation": "An index stores additional structure that helps the DBMS locate rows without scanning every record, but it must be stored and maintained.",
      "workedExample": "An index on a frequently searched student number can reduce lookup work, while every update to that field may require index maintenance.",
      "practiceQuestions": [
        {
          "question": "What is the main purpose of a database index?",
          "answer": "To speed suitable data retrieval."
        },
        {
          "question": "Does an index have no cost?",
          "answer": "No"
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Can too many indexes make writes more expensive?",
          "answer": "Yes"
        }
      ],
      "examQuestion": {
        "question": "Evaluate adding an index to a large, frequently searched but rarely updated column.",
        "marks": 6,
        "answer": "The index is likely beneficial because searches are frequent and updates rare, but it consumes storage and must still be maintained when data changes.",
        "markScheme": [
          "Search benefit.",
          "Avoids scans.",
          "Storage cost.",
          "Write cost.",
          "Workload link.",
          "Judgement."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Which field in a school database would be a strong indexing candidate?"
    },
    {
      "id": "al-concurrency-db",
      "title": "Concurrent Transactions and Isolation",
      "description": "Understand anomalies caused by overlapping database work.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Explain concurrent transactions.",
        "Describe a lost update or dirty read.",
        "Explain isolation as a control."
      ],
      "explanation": "When transactions overlap, reads and writes can interfere unless the DBMS provides suitable isolation through locking or versioning.",
      "workedExample": "Two clerks updating the same stock value without isolation can overwrite one another's changes.",
      "practiceQuestions": [
        {
          "question": "What is a lost update?",
          "answer": "One transaction's change is overwritten by another."
        },
        {
          "question": "Why use isolation?",
          "answer": "To control interference between concurrent transactions."
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Can concurrency improve throughput while still creating correctness risks?",
          "answer": "Yes"
        }
      ],
      "examQuestion": {
        "question": "Explain why transaction isolation is important in a multi-user database.",
        "marks": 6,
        "answer": "Isolation prevents unsafe visibility or overwriting of intermediate states, reducing anomalies while allowing controlled concurrency.",
        "markScheme": [
          "Concurrent access.",
          "Anomaly.",
          "Isolation.",
          "Mechanism idea.",
          "Integrity.",
          "Multi-user context."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Describe one database operation in which a lost update would be serious."
    }
  ],
  "big-data": [
    {
      "id": "al-distributed-processing",
      "title": "Distributed Processing and Large Data Sets",
      "description": "Understand why large data workloads are split across machines.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Explain partitioning.",
        "Explain parallel processing.",
        "Recognise coordination and failure costs."
      ],
      "explanation": "Distributed systems divide data and work across machines to increase aggregate capacity and parallelism, but they introduce communication and coordination problems.",
      "workedExample": "A large log archive can be partitioned so multiple workers count events independently before partial totals are combined.",
      "practiceQuestions": [
        {
          "question": "Why distribute a large workload?",
          "answer": "To use combined storage/processing resources."
        },
        {
          "question": "Name one distributed-system challenge.",
          "answer": "Communication, coordination or node failure."
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Does adding machines always give linear speed-up?",
          "answer": "No"
        }
      ],
      "examQuestion": {
        "question": "Explain one benefit and two challenges of distributed data processing.",
        "marks": 6,
        "answer": "Benefits include combined capacity and parallel work; challenges include communication overhead, coordination, consistency and failures.",
        "markScheme": [
          "Valid benefit.",
          "Parallel/capacity explanation.",
          "Challenge one.",
          "Challenge two.",
          "Distributed context.",
          "Developed reasoning."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "What part of a large analysis could be processed independently?"
    }
  ],
  "functional-programming": [
    {
      "id": "al-functional-composition",
      "title": "Function Composition and Recursion",
      "description": "Compose small functions and reason about recursive functional solutions.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Explain composition.",
        "Use recursion over immutable data.",
        "Relate small pure functions to testing."
      ],
      "explanation": "Functional programs often build larger behaviour by composing small functions whose outputs become inputs to other functions.",
      "workedExample": "A pipeline can filter invalid records, map valid records to totals, then fold the totals into one result.",
      "practiceQuestions": [
        {
          "question": "What is function composition?",
          "answer": "Combining functions so one function's output feeds another."
        },
        {
          "question": "What does fold/reduce commonly do?",
          "answer": "Combines a collection into an accumulated result."
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Can recursion process a list without mutating it?",
          "answer": "Yes"
        }
      ],
      "examQuestion": {
        "question": "Explain how composition can improve the clarity and testability of a functional program.",
        "marks": 5,
        "answer": "Small functions have focused responsibilities and can be tested independently; composition makes the data flow explicit and allows behaviours to be combined predictably.",
        "markScheme": [
          "Small functions.",
          "Independent testing.",
          "Explicit data flow.",
          "Reuse.",
          "Composition benefit."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Break one larger transformation into three composable functions."
    }
  ],
  "software-development": [
    {
      "id": "al-methodologies",
      "title": "Development Methodologies and Prototyping",
      "description": "Compare iterative, agile and plan-driven development approaches.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Compare development methodologies.",
        "Explain prototypes.",
        "Choose an approach for changing requirements."
      ],
      "explanation": "Methodologies organise how requirements, design, implementation and feedback are managed. Iterative approaches revisit these activities rather than treating them as a one-way sequence.",
      "workedExample": "A prototype can expose misunderstood interface requirements before the full system is built.",
      "practiceQuestions": [
        {
          "question": "Why build a prototype?",
          "answer": "To explore or validate requirements/design ideas."
        },
        {
          "question": "Which style suits frequently changing requirements well?",
          "answer": "An iterative/agile approach."
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Does agile mean no planning or documentation?",
          "answer": "No"
        }
      ],
      "examQuestion": {
        "question": "Evaluate an iterative approach for a client whose requirements are expected to change.",
        "marks": 6,
        "answer": "Iterations allow regular feedback and reprioritisation, reducing the cost of discovering misunderstandings late, though they require disciplined scope and client involvement.",
        "markScheme": [
          "Feedback.",
          "Changing requirements.",
          "Early discovery.",
          "Scope risk.",
          "Client involvement.",
          "Judgement."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Which methodology would suit your own project and why?"
    }
  ],
  "theory-computation": [
    {
      "id": "al-regular-languages",
      "title": "Regular Languages and Regular Expressions",
      "description": "Relate pattern descriptions to finite-state recognition.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Use regular-expression concepts.",
        "Relate regex to FSMs.",
        "Recognise limits of regular languages."
      ],
      "explanation": "Regular expressions and finite-state machines describe the same class of regular languages, though they present the rules differently.",
      "workedExample": "An identifier rule such as letter followed by zero or more letters/digits can be expressed as a regular pattern and recognised by an FSM.",
      "practiceQuestions": [
        {
          "question": "What class of language can an FSM recognise?",
          "answer": "A regular language."
        },
        {
          "question": "Are regular expressions and FSMs equivalent in expressive power for regular languages?",
          "answer": "Yes"
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Can every nested language be represented by a finite-state machine?",
          "answer": "No"
        }
      ],
      "examQuestion": {
        "question": "Explain the relationship between regular expressions and finite-state machines.",
        "marks": 5,
        "answer": "A regular expression describes a regular language as a pattern, while an FSM recognises the same kind of language through state transitions. Each regular language can be represented in either form.",
        "markScheme": [
          "Regex describes pattern.",
          "FSM recognises input.",
          "Regular language.",
          "Equivalent expressive power.",
          "Clear relationship."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Write a simple regular-language rule for one kind of valid identifier."
    }
  ],
  "legal-ethical-a-level": [
    {
      "id": "al-privacy-governance",
      "title": "Privacy, Surveillance and Data Governance",
      "description": "Evaluate necessity, proportionality and governance around sensitive data.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Identify privacy risks.",
        "Apply data minimisation and purpose limitation.",
        "Evaluate less intrusive alternatives."
      ],
      "explanation": "Responsible data use requires more than security: organisations must justify why data is needed, limit its use and consider the effect on individuals.",
      "workedExample": "A facial-recognition proposal should be compared with less intrusive access controls before collecting biometric data.",
      "practiceQuestions": [
        {
          "question": "What is data minimisation?",
          "answer": "Collecting only the personal data necessary for the purpose."
        },
        {
          "question": "Why consider proportionality?",
          "answer": "To judge whether the intrusion is justified by the benefit and need."
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Can data be ethically problematic even if technically secure?",
          "answer": "Yes"
        }
      ],
      "examQuestion": {
        "question": "Discuss whether a school should deploy facial recognition at every entrance.",
        "marks": 8,
        "answer": "A strong answer balances security benefits against biometric privacy, error rates, bias, proportionality, alternatives, retention and governance before reaching a justified conclusion.",
        "markScheme": [
          "Benefit.",
          "Biometric sensitivity.",
          "Accuracy/bias.",
          "Proportionality.",
          "Alternative.",
          "Retention/security.",
          "Transparency.",
          "Conclusion."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "What evidence would you need before approving a high-impact monitoring system?"
    }
  ]
} as Record<string, Lesson[]>;

export function withSupplementalALevelLessons(
  topic: Topic,
): Topic {
  const additions =
    supplementalALevelLessons[topic.id] || [];

  if (additions.length === 0) {
    return topic;
  }

  const existingIds =
    new Set(
      topic.lessons.map(
        (lesson) => lesson.id,
      ),
    );

  return {
    ...topic,
    estimatedTime:
      `${topic.lessons.length + additions.length} lessons`,
    lessons: [
      ...topic.lessons,
      ...additions.filter(
        (lesson) =>
          !existingIds.has(
            lesson.id,
          ),
      ),
    ],
  };
}
