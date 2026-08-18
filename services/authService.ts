import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type UserCredential,
} from "firebase/auth";

import {
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

export type RegistrationAccountType = "student" | "teacher";

function validateRegistration(
  name: string,
  email: string,
  password: string,
): void {
  if (!name.trim()) {
    throw new Error("Please enter your full name.");
  }

  if (!email.trim()) {
    throw new Error("Please enter your email address.");
  }

  if (password.length < 6) {
    throw new Error(
      "Your password must contain at least 6 characters.",
    );
  }
}

export async function registerAccount(
  name: string,
  email: string,
  password: string,
  accountType: RegistrationAccountType,
): Promise<UserCredential> {
  const cleanedName = name.trim();
  const cleanedEmail = email.trim().toLowerCase();

  validateRegistration(
    cleanedName,
    cleanedEmail,
    password,
  );

  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      cleanedEmail,
      password,
    );

  try {
    await updateProfile(userCredential.user, {
      displayName: cleanedName,
    });

    /*
     * SECURITY:
     *
     * Teacher applicants do NOT receive the teacher role here.
     *
     * They remain at the normal low-privilege student-level role
     * until an administrator approves the teacher request.
     *
     * accountIntent tells the UI which onboarding journey to use.
     */
    await setDoc(
      doc(db, "users", userCredential.user.uid),
      {
        uid: userCredential.user.uid,
        name: cleanedName,
        email: cleanedEmail,

        role: "student",

        accountIntent: accountType,

        teacherAccessStatus:
          accountType === "teacher"
            ? "not_submitted"
            : null,

        qualification: null,
        examBoard: null,
        onboardingComplete: false,

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
    );

    return userCredential;
  } catch (error) {
    console.error(
      "Unable to create the account profile:",
      error,
    );

    try {
      await deleteUser(userCredential.user);
    } catch (cleanupError) {
      console.error(
        "Unable to remove the incomplete Authentication account:",
        cleanupError,
      );

      await signOut(auth);
    }

    throw error;
  }
}

/*
 * Keep this function because existing parts of CS Master may
 * already import registerStudent().
 */
export async function registerStudent(
  name: string,
  email: string,
  password: string,
): Promise<UserCredential> {
  return registerAccount(
    name,
    email,
    password,
    "student",
  );
}

export async function loginUser(
  email: string,
  password: string,
): Promise<UserCredential> {
  const cleanedEmail =
    email.trim().toLowerCase();

  return signInWithEmailAndPassword(
    auth,
    cleanedEmail,
    password,
  );
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export async function resetPassword(
  email: string,
): Promise<void> {
  const cleanedEmail =
    email.trim().toLowerCase();

  if (!cleanedEmail) {
    throw new Error(
      "Please enter your email address.",
    );
  }

  await sendPasswordResetEmail(
    auth,
    cleanedEmail,
  );
}