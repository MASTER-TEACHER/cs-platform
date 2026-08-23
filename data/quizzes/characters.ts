import { Quiz } from "@/types/quiz";

export const charactersQuiz: Quiz = {
  id: "characters-quiz",
  topicId: "characters",
  title: "Character Encoding Quiz",
  description: "Test your understanding of character sets, ASCII, Unicode and how text is represented in binary.",
  estimatedTime: "8 mins",
  questions: [
    { id: "characters-q1", type: "multipleChoice", question: "What is a character set?", options: ["A collection of characters and the codes used to represent them", "A list of passwords", "A set of pixels", "A group of protocols"], correctAnswer: "A collection of characters and the codes used to represent them", explanation: "A character set maps characters to numerical codes that computers can store in binary.", xpReward: 10 },
    { id: "characters-q2", type: "multipleChoice", question: "Which character set was designed primarily for English-language text?", options: ["ASCII", "Unicode", "JPEG", "MIDI"], correctAnswer: "ASCII", explanation: "ASCII provides codes for common English letters, digits, punctuation and control characters.", xpReward: 10 },
    { id: "characters-q3", type: "trueFalse", question: "Unicode can represent a much wider range of characters than ASCII.", options: ["True", "False"], correctAnswer: "True", explanation: "Unicode supports characters from many languages and writing systems.", xpReward: 10 },
    { id: "characters-q4", type: "shortAnswer", question: "How many bits are needed to represent 256 different values?", correctAnswer: "8", explanation: "Eight bits can represent 2^8 = 256 different values.", xpReward: 10 },
    { id: "characters-q5", type: "multipleChoice", question: "Why does each character need a unique code within a character set?", options: ["So the computer can distinguish one character from another", "So text files always become smaller", "So images display in colour", "So programs do not need variables"], correctAnswer: "So the computer can distinguish one character from another", explanation: "Unique codes allow stored binary values to be decoded back into the intended characters.", xpReward: 10 },
    { id: "characters-q6", type: "shortAnswer", question: "The ASCII code for uppercase A is denary 65. What is 65 in 8-bit binary?", correctAnswer: "01000001", explanation: "65 = 64 + 1, giving 01000001 in 8 bits.", xpReward: 10 },
    { id: "characters-q7", type: "multipleChoice", question: "What is one advantage of Unicode over ASCII?", options: ["It can represent characters from many more languages", "It removes the need for binary", "It can only represent capital letters", "It always uses fewer bits"], correctAnswer: "It can represent characters from many more languages", explanation: "Unicode was designed for a much broader range of characters and symbols.", xpReward: 10 },
    { id: "characters-q8", type: "trueFalse", question: "Text is ultimately stored by computers as binary patterns.", options: ["True", "False"], correctAnswer: "True", explanation: "Character codes are numerical values that are stored as binary.", xpReward: 10 },
  ],
};
