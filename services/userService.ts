import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile, UserRole } from "@/types/database";

export async function createUserProfile(
  uid: string,
  name: string,
  email: string,
  role: UserRole = "student"
) {
  const userRef = doc(db, "users", uid);

  const profile: UserProfile = {
    uid,
    name,
    email,
    role,
    classIds: [],
    createdAt: new Date(),
  };

  await setDoc(userRef, profile);
  return profile;
}

export async function getUserProfile(uid: string) {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as UserProfile;
}