export const achievements = [
  {
    id: "first-lesson",
    title: "First Lesson Complete",
    description: "Complete your first lesson.",
    icon: "🏅",
    condition: {
      type: "completedLessons",
      value: 1,
    },
  },
  {
    id: "xp-100",
    title: "100 XP Club",
    description: "Earn 100 XP.",
    icon: "⭐",
    condition: {
      type: "xp",
      value: 100,
    },
  },
  {
    id: "binary-beginner",
    title: "Binary Beginner",
    description: "Complete the Introduction to Binary lesson.",
    icon: "💻",
    condition: {
      type: "lessonCompleted",
      value: "binary-intro",
    },
  },
];