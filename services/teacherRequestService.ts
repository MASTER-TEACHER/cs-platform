import {
  auth,
} from "@/lib/firebase";

export type CreateTeacherRequestInput = {
  userId: string;

  /*
   * Retained as optional compatibility fields so older callers
   * do not immediately break. The secure API does not trust
   * these browser-supplied identity values.
   */
  name?: string;
  email?: string;
  schoolName?: string;

  jobTitle: string;
  message: string;
};

type TeacherRequestResponse = {
  success?: boolean;

  status?: string;

  schoolName?: string;

  schoolAdminEmail?: string;

  expiresAt?: string;

  verificationRisk?: string;

  error?: string;
};

export async function createTeacherRequest({
  userId,
  jobTitle,
  message,
}: CreateTeacherRequestInput): Promise<string> {
  const user =
    auth.currentUser;

  if (!user) {
    throw new Error(
      "Please sign in before requesting teacher access.",
    );
  }

  if (
    user.uid !==
    userId.trim()
  ) {
    throw new Error(
      "The signed-in account does not match this teacher application.",
    );
  }

  const cleanedJobTitle =
    jobTitle.trim();

  if (!cleanedJobTitle) {
    throw new Error(
      "Please enter your job title.",
    );
  }

  const token =
    await user.getIdToken(
      true,
    );

  const response =
    await fetch(
      "/api/teacher-verification/request",
      {
        method:
          "POST",

        headers: {
          Authorization:
            `Bearer ${token}`,

          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            jobTitle:
              cleanedJobTitle,

            message:
              message.trim(),
          }),
      },
    );

  let result:
    TeacherRequestResponse;

  try {
    result =
      (await response.json()) as
        TeacherRequestResponse;
  } catch {
    throw new Error(
      "CS Master could not read the teacher-verification response.",
    );
  }

  if (!response.ok) {
    throw new Error(
      result.error ||
        "Teacher verification could not be requested.",
    );
  }

  return user.uid;
}