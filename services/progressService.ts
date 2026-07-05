import {
  arrayUnion,
  doc,
  getDoc,
  increment,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getUnlockedAchievements } from "@/lib/achievementEngine";

export async function completeLesson(
  uid: string,
  lessonId: string,
  xpReward: number = 50
) {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    throw new Error("User profile not found.");
  }

  const profile = snapshot.data();

  const completedLessons: string[] = profile.completedLessons || [];
  const badges: string[] = profile.badges || [];
  const currentXP: number = profile.xp || 0;

  if (completedLessons.includes(lessonId)) {
    return {
      alreadyCompleted: true,
      unlockedAchievements: [],
    };
  }

  const updatedProfile = {
    ...profile,
    xp: currentXP + xpReward,
    completedLessons: [...completedLessons, lessonId],
    badges,
  };

  const unlockedAchievements = getUnlockedAchievements(updatedProfile);

  await updateDoc(userRef, {
    completedLessons: arrayUnion(lessonId),
    xp: increment(xpReward),
    badges: arrayUnion(
      ...unlockedAchievements.map((achievement) => achievement.id)
    ),
  });

  return {
    alreadyCompleted: false,
    unlockedAchievements,
  };
}