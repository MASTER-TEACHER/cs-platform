import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import { createUserProfile } from "@/services/userService";

export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: "student" | "teacher" = "student"
) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await createUserProfile(
    userCredential.user.uid,
    name,
    email,
    role
  );

  return userCredential;
}

export async function loginUser(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function logoutUser() {
  return signOut(auth);
}

export async function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}