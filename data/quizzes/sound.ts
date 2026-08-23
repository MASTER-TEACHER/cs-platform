import { Quiz } from "@/types/quiz";

export const soundQuiz: Quiz = {
  id: "sound-quiz",
  topicId: "sound",
  title: "Sound Representation Quiz",
  description: "Test your understanding of sampling, sample rate, bit depth and digital audio representation.",
  estimatedTime: "8 mins",
  questions: [
    { id: "sound-q1", type: "multipleChoice", question: "How is analogue sound converted into digital data?", options: ["By taking samples of the sound wave", "By storing colours", "By converting it to ASCII", "By increasing CPU speed"], correctAnswer: "By taking samples of the sound wave", explanation: "Digital audio stores measurements of an analogue waveform at regular intervals.", xpReward: 10 },
    { id: "sound-q2", type: "multipleChoice", question: "What does sample rate measure?", options: ["How many samples are taken each second", "How many colours are stored", "How many files are compressed", "How many speakers are connected"], correctAnswer: "How many samples are taken each second", explanation: "Sample rate is the number of measurements taken per second.", xpReward: 10 },
    { id: "sound-q3", type: "trueFalse", question: "A higher sample rate generally gives a more accurate representation of the original sound.", options: ["True", "False"], correctAnswer: "True", explanation: "More frequent samples follow the original waveform more closely.", xpReward: 10 },
    { id: "sound-q4", type: "multipleChoice", question: "What does bit depth determine in digital audio?", options: ["The number of possible values for each sample", "The number of samples each second", "The number of audio files", "Network speed"], correctAnswer: "The number of possible values for each sample", explanation: "Bit depth controls how precisely sample amplitude can be represented.", xpReward: 10 },
    { id: "sound-q5", type: "shortAnswer", question: "How many possible values can an 8-bit sample represent?", correctAnswer: "256", explanation: "2^8 = 256 possible values.", xpReward: 10 },
    { id: "sound-q6", type: "trueFalse", question: "Increasing sample rate and bit depth will usually increase audio file size.", options: ["True", "False"], correctAnswer: "True", explanation: "More samples and more bits per sample both increase stored data.", xpReward: 10 },
    { id: "sound-q7", type: "multipleChoice", question: "Which combination normally gives the highest-quality digital recording?", options: ["High sample rate and high bit depth", "Low sample rate and low bit depth", "High sample rate and no bit depth", "Low sample rate and 1-bit colour depth"], correctAnswer: "High sample rate and high bit depth", explanation: "Both settings improve how accurately the sound is represented.", xpReward: 10 },
    { id: "sound-q8", type: "multipleChoice", question: "Why is digital sound only an approximation of an analogue wave?", options: ["Only discrete samples of the continuous wave are stored", "Computers cannot store numbers", "Sound is converted to an image", "Every sample is identical"], correctAnswer: "Only discrete samples of the continuous wave are stored", explanation: "Analogue sound is continuous, while digital audio stores discrete measurements.", xpReward: 10 },
  ],
};
