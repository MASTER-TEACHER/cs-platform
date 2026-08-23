import { Quiz } from "@/types/quiz";

export const imagesQuiz: Quiz = {
  id: "images-quiz",
  topicId: "images",
  title: "Image Representation Quiz",
  description: "Test your understanding of pixels, resolution, colour depth and bitmap image storage.",
  estimatedTime: "8 mins",
  questions: [
    { id: "images-q1", type: "multipleChoice", question: "What is a pixel?", options: ["A single picture element in a bitmap image", "A complete image file", "A sound sample", "A character code"], correctAnswer: "A single picture element in a bitmap image", explanation: "Bitmap images are made from a grid of picture elements called pixels.", xpReward: 10 },
    { id: "images-q2", type: "multipleChoice", question: "What does image resolution describe?", options: ["The number of pixels used to represent the image", "The number of colours in ASCII", "The sampling rate", "The bandwidth"], correctAnswer: "The number of pixels used to represent the image", explanation: "Resolution describes the pixel dimensions or total pixel count of an image.", xpReward: 10 },
    { id: "images-q3", type: "trueFalse", question: "Increasing image resolution usually increases file size.", options: ["True", "False"], correctAnswer: "True", explanation: "More pixels require more data to be stored.", xpReward: 10 },
    { id: "images-q4", type: "multipleChoice", question: "What does colour depth control?", options: ["The number of colours that can be represented", "Only the width of an image", "The number of sound samples", "Processor speed"], correctAnswer: "The number of colours that can be represented", explanation: "Colour depth is the number of bits used for each pixel.", xpReward: 10 },
    { id: "images-q5", type: "shortAnswer", question: "How many colours can be represented using a colour depth of 4 bits?", correctAnswer: "16", explanation: "2^4 = 16 possible colours.", xpReward: 10 },
    { id: "images-q6", type: "multipleChoice", question: "Which change would normally produce a more detailed bitmap image?", options: ["Increasing the resolution", "Reducing the number of pixels", "Reducing colour depth to 1 bit", "Removing the header"], correctAnswer: "Increasing the resolution", explanation: "More pixels allow finer detail to be represented.", xpReward: 10 },
    { id: "images-q7", type: "shortAnswer", question: "An image is 100 pixels wide and 50 pixels high. How many pixels does it contain?", correctAnswer: "5000", explanation: "100 × 50 = 5000 pixels.", xpReward: 10 },
    { id: "images-q8", type: "trueFalse", question: "A bitmap image stores data about the colour of individual pixels.", options: ["True", "False"], correctAnswer: "True", explanation: "Bitmap files store pixel colour values.", xpReward: 10 },
  ],
};
