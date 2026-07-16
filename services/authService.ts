import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import { createUserProfile } from "@/services/userService";

export async function registerStudent(
  name: string,
  email: string,
  password: string
) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  try {
    await createUserProfile(
      userCredential.user.uid,
      name,
      email,
      "student"
    );

    return userCredential;
  } catch (error) {
    /*
     * The Authentication account may already exist even if the
     * Firestore profile write fails. Log the account out so the app
     * does not continue with an incomplete profile.
     */
    await signOut(auth);
    throw error;
  }
}

export async function loginUser(
  email: string,
  password: string
) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function logoutUser() {
  return signOut(auth);
}

export async function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}