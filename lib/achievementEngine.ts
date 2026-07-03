import { achievements } from "@/data/achievements";

type Profile = {
  xp?: number;
  completedLessons?: string[];
  badges?: string[];
};

type Achievement =
  | {
      id: string;
      title: string;
      description: string;
      icon: string;
      condition: {
        type: "xp";
        value: number;
      };
    }
  | {
      id: string;
      title: string;
      description: string;
      icon: string;
      condition: {
        type: "completedLessons";
        value: number;
      };
    }
  | {
      id: string;
      title: string;
      description: string;
      icon: string;
      condition: {
        type: "lessonCompleted";
        value: string;
      };
    };

export function getUnlockedAchievements(profile: Profile) {
  return (achievements as Achievement[]).filter((achievement) => {
    if (profile.badges?.includes(achievement.id)) {
      return false;
    }

    if (achievement.condition.type === "xp") {
      return (profile.xp || 0) >= achievement.condition.value;
    }

    if (achievement.condition.type === "completedLessons") {
      return (
        (profile.completedLessons?.length || 0) >= achievement.condition.value
      );
    }

    if (achievement.condition.type === "lessonCompleted") {
      return profile.completedLessons?.includes(achievement.condition.value);
    }

    return false;
  });
}