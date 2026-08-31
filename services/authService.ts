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
  auth,
} from "@/lib/firebase";

export type RegistrationAccountType =
  | "student"
  | "teacher";

export type TeacherRegistrationDetails = {
  schoolName: string;
  schoolAdminEmail: string;
};

type CreateProfileResponse = {
  success?: boolean;
  alreadyExists?: boolean;
  uid?: string;
  accountIntent?: string;
  error?: string;
};

function cleanEmail(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase();
}

function isValidEmail(
  value: string,
): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value,
  );
}

function validateRegistration(
  name: string,
  email: string,
  password: string,
): void {
  if (!name.trim()) {
    throw new Error(
      "Please enter your full name.",
    );
  }

  if (!email.trim()) {
    throw new Error(
      "Please enter your email address.",
    );
  }

  if (
    !isValidEmail(
      cleanEmail(
        email,
      ),
    )
  ) {
    throw new Error(
      "Please enter a valid email address.",
    );
  }

  if (
    password.length <
    6
  ) {
    throw new Error(
      "Your password must contain at least 6 characters.",
    );
  }
}

function validateTeacherRegistration(
  teacherEmail: string,
  details:
    | TeacherRegistrationDetails
    | undefined,
): TeacherRegistrationDetails {
  if (!details) {
    throw new Error(
      "School details are required for teacher registration.",
    );
  }

  const schoolName =
    details.schoolName.trim();

  const schoolAdminEmail =
    cleanEmail(
      details.schoolAdminEmail,
    );

  if (!schoolName) {
    throw new Error(
      "Please enter your school name.",
    );
  }

  if (
    !schoolAdminEmail
  ) {
    throw new Error(
      "Please enter a school administrator email address.",
    );
  }

  if (
    !isValidEmail(
      schoolAdminEmail,
    )
  ) {
    throw new Error(
      "Please enter a valid school administrator email address.",
    );
  }

  if (
    schoolAdminEmail ===
    cleanEmail(
      teacherEmail,
    )
  ) {
    throw new Error(
      "The school administrator email must be different from your own email address.",
    );
  }

  return {
    schoolName,
    schoolAdminEmail,
  };
}

async function createServerProfile({
  credential,
  name,
  accountType,
  teacherDetails,
}: {
  credential: UserCredential;
  name: string;
  accountType: RegistrationAccountType;
  teacherDetails:
    | TeacherRegistrationDetails
    | null;
}): Promise<void> {
  /*
   * Force-refresh so the server receives a token belonging
   * to the newly created Firebase Authentication account.
   */
  const idToken =
    await credential.user.getIdToken(
      true,
    );

  const response =
    await fetch(
      "/api/auth/create-profile",
      {
        method:
          "POST",

        headers: {
          Authorization:
            `Bearer ${idToken}`,

          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            name,

            accountType,

            ...(accountType ===
              "teacher" &&
            teacherDetails
              ? {
                  schoolName:
                    teacherDetails.schoolName,

                  schoolAdminEmail:
                    teacherDetails.schoolAdminEmail,
                }
              : {}),
          }),
      },
    );

  let result:
    CreateProfileResponse;

  try {
    result =
      (await response.json()) as
        CreateProfileResponse;
  } catch {
    throw new Error(
      "CS Master could not read the profile-creation response.",
    );
  }

  if (
    !response.ok ||
    !result.success
  ) {
    throw new Error(
      result.error ||
        "Your CS Master profile could not be created.",
    );
  }
}

export async function registerAccount(
  name: string,
  email: string,
  password: string,
  accountType: RegistrationAccountType,
  teacherDetails?: TeacherRegistrationDetails,
): Promise<UserCredential> {
  const cleanedName =
    name.trim();

  const cleanedEmail =
    cleanEmail(
      email,
    );

  validateRegistration(
    cleanedName,
    cleanedEmail,
    password,
  );

  const resolvedTeacherDetails =
    accountType ===
    "teacher"
      ? validateTeacherRegistration(
          cleanedEmail,
          teacherDetails,
        )
      : null;

  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      cleanedEmail,
      password,
    );

  try {
    await updateProfile(
      userCredential.user,
      {
        displayName:
          cleanedName,
      },
    );

    /*
     * IMPORTANT:
     *
     * Firestore profile creation is deliberately server-side.
     *
     * The browser can authenticate, but it cannot decide its
     * own role, plan, approval state or tenant membership.
     */
    await createServerProfile({
      credential:
        userCredential,

      name:
        cleanedName,

      accountType,

      teacherDetails:
        resolvedTeacherDetails,
    });

    return userCredential;
  } catch (error) {
    console.error(
      "Unable to create the account profile:",
      error,
    );

    /*
     * If profile creation fails, remove the newly-created
     * Authentication account so we do not leave an orphaned
     * login behind.
     */
    try {
      await deleteUser(
        userCredential.user,
      );
    } catch (
      cleanupError
    ) {
      console.error(
        "Unable to remove the incomplete Authentication account:",
        cleanupError,
      );

      try {
        await signOut(
          auth,
        );
      } catch (
        signOutError
      ) {
        console.error(
          "Unable to sign out after incomplete registration:",
          signOutError,
        );
      }
    }

    throw error;
  }
}

/*
 * Compatibility helper used by older CS Master code.
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
    cleanEmail(
      email,
    );

  return signInWithEmailAndPassword(
    auth,
    cleanedEmail,
    password,
  );
}

export async function logoutUser(): Promise<void> {
  await signOut(
    auth,
  );
}

export async function resetPassword(
  email: string,
): Promise<void> {
  const cleanedEmail =
    cleanEmail(
      email,
    );

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