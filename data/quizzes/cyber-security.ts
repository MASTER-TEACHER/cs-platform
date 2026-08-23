import { Quiz } from "@/types/quiz";

export const cyberSecurityQuiz: Quiz = {
  id: "cyber-security-quiz",
  topicId: "cyber-security",
  title: "Cyber Security Quiz",
  description: "Test your understanding of threats, vulnerabilities, social engineering, malware, authentication and prevention methods.",
  estimatedTime: "8 mins",
  questions: [
    { id: "cyber-security-q1", type: "multipleChoice", question: "What is phishing?", options: ["A social-engineering attack that tries to trick users into revealing sensitive information", "A method of compressing images", "A scheduling algorithm", "A type of storage"], correctAnswer: "A social-engineering attack that tries to trick users into revealing sensitive information", explanation: "Phishing uses fraudulent messages or websites to steal sensitive information.", xpReward: 10 },
    { id: "cyber-security-q2", type: "multipleChoice", question: "What is malware?", options: ["Software designed to cause harm or perform unwanted actions", "A secure protocol", "A database key", "A language translator"], correctAnswer: "Software designed to cause harm or perform unwanted actions", explanation: "Malware includes viruses, ransomware, spyware and other malicious software.", xpReward: 10 },
    { id: "cyber-security-q3", type: "trueFalse", question: "Using two-factor authentication can make an account harder to compromise.", options: ["True", "False"], correctAnswer: "True", explanation: "Two-factor authentication requires an additional form of verification.", xpReward: 10 },
    { id: "cyber-security-q4", type: "multipleChoice", question: "What is a brute-force attack?", options: ["Trying many possible passwords or keys until one works", "Physically breaking a computer case", "Deleting image pixels", "Increasing clock speed"], correctAnswer: "Trying many possible passwords or keys until one works", explanation: "Brute force systematically tests many possible credentials.", xpReward: 10 },
    { id: "cyber-security-q5", type: "multipleChoice", question: "What is penetration testing?", options: ["Authorised testing of a system to identify security weaknesses", "Compressing a packet", "Testing printer ink", "Creating database records"], correctAnswer: "Authorised testing of a system to identify security weaknesses", explanation: "Penetration testing simulates attacks so vulnerabilities can be found and fixed.", xpReward: 10 },
    { id: "cyber-security-q6", type: "trueFalse", question: "Regular software updates can help fix known security vulnerabilities.", options: ["True", "False"], correctAnswer: "True", explanation: "Updates often include security patches.", xpReward: 10 },
    { id: "cyber-security-q7", type: "multipleChoice", question: "Which is the strongest password practice?", options: ["Use a long, unique password and avoid reusing it", "Use the same short password everywhere", "Share passwords", "Use only your first name"], correctAnswer: "Use a long, unique password and avoid reusing it", explanation: "Long, unique passwords reduce risk from guessing and credential reuse.", xpReward: 10 },
    { id: "cyber-security-q8", type: "multipleChoice", question: "What does a firewall help control?", options: ["Incoming and outgoing network traffic", "Image colour depth", "CPU cache size", "Database field length only"], correctAnswer: "Incoming and outgoing network traffic", explanation: "Firewalls apply rules to network traffic and can block unauthorised connections.", xpReward: 10 },
  ],
};
