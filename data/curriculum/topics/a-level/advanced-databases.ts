import type { Topic } from "@/types/curriculum";

export const advancedDatabasesTopic: Topic = {
  "id": "advanced-databases",
  "title": "Advanced Databases",
  "description": "Study relational design, normalisation, joins, transactions and database management.",
  "difficulty": "⭐⭐⭐",
  "estimatedTime": "75 mins",
  "status": "published",
  "unit": "A-level Databases",
  "specificationReferences": [
    "AQA 4.10",
    "OCR H446 1.3"
  ],
  "lessons": [
    {
      "id": "al-normalisation",
      "title": "Relational Design and Normalisation",
      "description": "Design schemas that reduce redundancy.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "simulator": "entity-relationship",
      "objectives": [
        "Model entities and relationships.",
        "Identify keys.",
        "Explain normalisation."
      ],
      "explanation": "Normalisation separates entities into related tables so facts are stored in appropriate places and update anomalies are reduced.",
      "workedExample": "Customer and Order are separated so customer details are stored once while orders reference CustomerID.",
      "practiceQuestions": [
        {
          "question": "What uniquely identifies a row?",
          "answer": "A primary key"
        },
        {
          "question": "Why normalise?",
          "answer": "To reduce redundancy and update anomalies"
        }
      ],
      "checkpointQuestions": [
        {
          "question": "What links to a key in another table?",
          "answer": "A foreign key"
        }
      ],
      "examQuestion": {
        "question": "Explain how normalisation improves database design.",
        "marks": 6,
        "answer": "It reduces duplicate facts, prevents inconsistent updates, separates entities and preserves relationships through keys.",
        "markScheme": [
          "Reduces redundancy.",
          "Avoids anomalies.",
          "Separates entities.",
          "Uses keys.",
          "Improves consistency.",
          "Developed explanation."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Identify redundancy in a denormalised table."
    },
    {
      "id": "al-joins",
      "title": "SQL Joins and Aggregation",
      "description": "Retrieve information across related tables.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "simulator": "sql",
      "objectives": [
        "Use joins.",
        "Use aggregate functions.",
        "Use grouping."
      ],
      "explanation": "Joins combine related rows using keys. Aggregates summarise groups; GROUP BY defines those groups.",
      "workedExample": "Join Customer to Order on CustomerID and count orders per customer.",
      "practiceQuestions": [
        {
          "question": "What does JOIN do?",
          "answer": "Combines related rows from multiple tables"
        },
        {
          "question": "Which clause groups rows for aggregate calculations?",
          "answer": "GROUP BY"
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Which function counts rows?",
          "answer": "COUNT"
        }
      ],
      "examQuestion": {
        "question": "Explain SQL that reports the number of orders per customer.",
        "marks": 5,
        "answer": "Join the tables on the key, group by customer and use COUNT on order rows.",
        "markScheme": [
          "Uses both tables.",
          "Correct join condition.",
          "Uses COUNT.",
          "Uses GROUP BY.",
          "Returns customer-level result."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Explain why joins are better than duplicating customer details."
    },
    {
      "id": "al-transactions",
      "title": "Transactions and Integrity",
      "description": "Explain safe multi-user database updates.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Explain DBMS responsibilities.",
        "Describe transactions.",
        "Explain concurrency concerns."
      ],
      "explanation": "A DBMS manages storage, queries, permissions and concurrent access. Transactions group operations so a logical change completes consistently or rolls back.",
      "workedExample": "A bank transfer debits one account and credits another as one transaction.",
      "practiceQuestions": [
        {
          "question": "What is a transaction?",
          "answer": "A logical group of database operations treated as one unit"
        },
        {
          "question": "Why is rollback useful?",
          "answer": "It restores a consistent state after failure"
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Why control concurrency?",
          "answer": "Simultaneous operations can conflict or create inconsistent data"
        }
      ],
      "examQuestion": {
        "question": "Explain why transactions matter in online banking.",
        "marks": 5,
        "answer": "Related updates must succeed together; transaction control prevents partial changes and preserves consistency under failure.",
        "markScheme": [
          "Groups operations.",
          "All-or-nothing idea.",
          "Prevents partial update.",
          "Maintains consistency.",
          "Mentions failure/concurrency."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Give another process that should be transactional."
    }
  ]
};
