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

  await updateDoc(userRef, {
    completedLessons: arrayUnion(lessonId),
    xp: increment(xpReward),
  });

  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return;
  }

  const profile = snapshot.data();

  const unlockedAchievements = getUnlockedAchievements(profile);

  if (unlockedAchievements.length > 0) {
    await updateDoc(userRef, {
      badges: arrayUnion(
        ...unlockedAchievements.map((achievement) => achievement.id)
      ),
    });
  }
}