import { Quiz } from "@/types/quiz";

export const networksQuiz: Quiz = {
  id: "networks-quiz",
  topicId: "networks",
  title: "Computer Networks Quiz",
  description: "Test your understanding of network types, hardware, topologies, protocols, addressing and network performance.",
  estimatedTime: "8 mins",
  questions: [
    { id: "networks-q1", type: "multipleChoice", question: "What does LAN stand for?", options: ["Local Area Network", "Long Access Node", "Logical Application Network", "Linked Address Number"], correctAnswer: "Local Area Network", explanation: "A LAN connects devices over a relatively small geographical area.", xpReward: 10 },
    { id: "networks-q2", type: "multipleChoice", question: "What is the main purpose of a router?", options: ["To forward packets between different networks", "To store every file permanently", "To increase screen resolution", "To translate source code"], correctAnswer: "To forward packets between different networks", explanation: "Routers direct packets between networks using addressing information.", xpReward: 10 },
    { id: "networks-q3", type: "trueFalse", question: "A switch can connect devices together on a local network.", options: ["True", "False"], correctAnswer: "True", explanation: "A switch forwards frames between devices on a LAN.", xpReward: 10 },
    { id: "networks-q4", type: "multipleChoice", question: "Which protocol is commonly used to transfer web pages securely?", options: ["HTTPS", "FTP", "SMTP", "POP3"], correctAnswer: "HTTPS", explanation: "HTTPS is HTTP secured with encryption and authentication.", xpReward: 10 },
    { id: "networks-q5", type: "multipleChoice", question: "What does an IP address identify?", options: ["A device or network interface on an IP network", "A user's password", "A compression ratio", "A CPU register"], correctAnswer: "A device or network interface on an IP network", explanation: "IP addresses identify destinations and allow packets to be routed.", xpReward: 10 },
    { id: "networks-q6", type: "multipleChoice", question: "What is bandwidth?", options: ["The maximum amount of data that can be transferred in a given time", "The physical length of a cable", "The number of users in a database", "The size of a CPU register"], correctAnswer: "The maximum amount of data that can be transferred in a given time", explanation: "Bandwidth measures data-transfer capacity.", xpReward: 10 },
    { id: "networks-q7", type: "trueFalse", question: "Latency is the delay before data reaches its destination.", options: ["True", "False"], correctAnswer: "True", explanation: "Latency measures delay and affects network responsiveness.", xpReward: 10 },
    { id: "networks-q8", type: "multipleChoice", question: "Which topology connects devices to a central switch or hub?", options: ["Star", "Bus", "Ring", "Mesh only"], correctAnswer: "Star", explanation: "In a star topology, devices connect individually to a central networking device.", xpReward: 10 },
  ],
};
