import { Quiz } from "@/types/quiz";

export const booleanLogicQuiz: Quiz = {
  id: "boolean-logic-quiz",
  topicId: "boolean-logic",
  title: "Boolean Logic Quiz",
  description: "Test your understanding of AND, OR and NOT gates, truth tables and Boolean expressions.",
  estimatedTime: "8 mins",
  questions: [
    { id: "boolean-logic-q1", type: "multipleChoice", question: "When does an AND gate output 1?", options: ["Only when both inputs are 1", "When either input is 1", "Only when both inputs are 0", "Whenever inputs are different"], correctAnswer: "Only when both inputs are 1", explanation: "AND outputs true only when both inputs are true.", xpReward: 10 },
    { id: "boolean-logic-q2", type: "multipleChoice", question: "When does an OR gate output 1?", options: ["When at least one input is 1", "Only when both inputs are 1", "Only when both inputs are 0", "Never"], correctAnswer: "When at least one input is 1", explanation: "OR outputs true when one or more inputs are true.", xpReward: 10 },
    { id: "boolean-logic-q3", type: "multipleChoice", question: "What does a NOT gate do?", options: ["Inverts the input", "Adds two inputs", "Stores data permanently", "Sorts binary values"], correctAnswer: "Inverts the input", explanation: "NOT changes 1 to 0 and 0 to 1.", xpReward: 10 },
    { id: "boolean-logic-q4", type: "shortAnswer", question: "What is the output of 1 AND 0?", correctAnswer: "0", explanation: "AND requires both inputs to be 1.", xpReward: 10 },
    { id: "boolean-logic-q5", type: "shortAnswer", question: "What is the output of 0 OR 1?", correctAnswer: "1", explanation: "OR outputs 1 when at least one input is 1.", xpReward: 10 },
    { id: "boolean-logic-q6", type: "shortAnswer", question: "What is the output of NOT 1?", correctAnswer: "0", explanation: "NOT reverses the input.", xpReward: 10 },
    { id: "boolean-logic-q7", type: "trueFalse", question: "A truth table lists all possible inputs and their corresponding outputs.", options: ["True", "False"], correctAnswer: "True", explanation: "Truth tables show the output for every possible Boolean input combination.", xpReward: 10 },
    { id: "boolean-logic-q8", type: "multipleChoice", question: "For A AND (NOT B), which input combination gives output 1?", options: ["A = 1, B = 0", "A = 1, B = 1", "A = 0, B = 0", "A = 0, B = 1"], correctAnswer: "A = 1, B = 0", explanation: "NOT B must be 1, so B must be 0, and A must also be 1.", xpReward: 10 },
  ],
};
