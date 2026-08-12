import type { Topic } from "@/types/curriculum";

export const advancedNetworksTopic: Topic = {
  "id": "advanced-networks",
  "title": "Advanced Networks and Communication",
  "description": "Explore layered communication, routing, internet technologies and network security.",
  "difficulty": "⭐⭐⭐",
  "estimatedTime": "75 mins",
  "status": "published",
  "unit": "A-level Networks",
  "specificationReferences": [
    "AQA 4.9",
    "OCR H446 1.3"
  ],
  "lessons": [
    {
      "id": "al-layering",
      "title": "Network Models and Layering",
      "description": "Explain layered protocols and encapsulation.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "simulator": "protocols",
      "objectives": [
        "Explain why protocols are layered.",
        "Describe encapsulation.",
        "Relate protocols to responsibilities."
      ],
      "explanation": "Layering separates communication responsibilities. Data is encapsulated with control information as it moves through layers.",
      "workedExample": "An application message is wrapped with transport and network information before link transmission.",
      "practiceQuestions": [
        {
          "question": "Why use layers?",
          "answer": "To separate responsibilities and support interoperability"
        },
        {
          "question": "What is encapsulation?",
          "answer": "Adding protocol control information around data"
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Does each layer need every implementation detail of the others?",
          "answer": "No"
        }
      ],
      "examQuestion": {
        "question": "Explain two advantages of a layered network model.",
        "marks": 5,
        "answer": "Layers provide abstraction, modularity, interoperability and easier troubleshooting.",
        "markScheme": [
          "Abstraction.",
          "Modularity.",
          "Interoperability.",
          "Troubleshooting/replaceability.",
          "Developed explanation."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Explain how layering helps different operating systems communicate."
    },
    {
      "id": "al-routing",
      "title": "Routing and Packet Delivery",
      "description": "Analyse packet movement across interconnected networks.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "simulator": "packet-routing",
      "objectives": [
        "Distinguish switching and routing.",
        "Explain routing tables.",
        "Trace packet forwarding."
      ],
      "explanation": "Switches forward frames locally while routers forward packets between networks using destination and route information.",
      "workedExample": "A packet may cross several routers, each choosing the next hop.",
      "practiceQuestions": [
        {
          "question": "Which device forwards packets between networks?",
          "answer": "Router"
        },
        {
          "question": "What does a routing table contain?",
          "answer": "Routes or next-hop information"
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Can packets from one message take different routes?",
          "answer": "Yes"
        }
      ],
      "examQuestion": {
        "question": "Explain how a packet can travel from a school LAN to a remote server.",
        "marks": 6,
        "answer": "Local frames reach the gateway, routers forward according to destination/network routes, and the packet crosses multiple networks.",
        "markScheme": [
          "Gateway/local forwarding.",
          "Switch role.",
          "Router role.",
          "Destination addressing.",
          "Multiple hops.",
          "End-to-end explanation."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Explain why dynamic routing can improve resilience."
    },
    {
      "id": "al-security",
      "title": "Advanced Network Security",
      "description": "Evaluate authentication, encryption and layered defences.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Explain authentication and authorisation.",
        "Explain encryption in transit.",
        "Evaluate defence in depth."
      ],
      "explanation": "Security combines identity controls, least privilege, encryption, patching, segmentation, filtering, monitoring and recovery.",
      "workedExample": "A school can separate guest/internal networks, require MFA and monitor unusual traffic.",
      "practiceQuestions": [
        {
          "question": "Authentication vs authorisation?",
          "answer": "Authentication verifies identity; authorisation controls permitted actions"
        },
        {
          "question": "What does encryption in transit protect?",
          "answer": "Data while being communicated"
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Why use defence in depth?",
          "answer": "No single control stops every attack"
        }
      ],
      "examQuestion": {
        "question": "Evaluate a layered security strategy for a school network.",
        "marks": 6,
        "answer": "Combine identity, segmentation, patching, filtering, encryption, monitoring and backup, explaining how each addresses a risk.",
        "markScheme": [
          "Identity control.",
          "Network/endpoint control.",
          "Encryption.",
          "Monitoring.",
          "Recovery.",
          "Supported evaluation."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Choose three school-network controls and rank them by priority."
    }
  ]
};
