import {
  doc,
  getDoc,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export type SchoolInviteRole =
  | "student"
  | "teacher";

function normaliseCode(value: string): string {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function generateCode(): string {
  const alphabet =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let value = "";

  for (
    let index = 0;
    index < 8;
    index += 1
  ) {
    value +=
      alphabet[
        Math.floor(
          Math.random() *
            alphabet.length,
        )
      ];
  }

  return value;
}

function timestampToDate(
  value: unknown,
): Date | null {
  return value instanceof Timestamp
    ? value.toDate()
    : null;
}

export async function createSchoolInvite({
  schoolId,
  createdBy,
  role,
}: {
  schoolId: string;
  createdBy: string;
  role: SchoolInviteRole;
}): Promise<string> {
  const cleanedSchoolId =
    schoolId.trim();

  const cleanedCreatedBy =
    createdBy.trim();

  if (
    !cleanedSchoolId ||
    !cleanedCreatedBy
  ) {
    throw new Error(
      "A valid school and teacher account are required.",
    );
  }

  /*
   * Do NOT pre-read the randomly generated invite document.
   * Firestore rules correctly deny arbitrary reads of non-existent
   * invite documents, which causes the permissions error before
   * creation. The random 8-character code space is extremely large.
   */
  const code =
    generateCode();

  const expiresAt =
    new Date();

  expiresAt.setDate(
    expiresAt.getDate() + 14,
  );

  const inviteRef =
    doc(
      db,
      "schoolInvites",
      code,
    );

  const batch =
    writeBatch(db);

  batch.set(
    inviteRef,
    {
      code,
      schoolId:
        cleanedSchoolId,
      role,
      createdBy:
        cleanedCreatedBy,
      status:
        "active",
      expiresAt:
        Timestamp.fromDate(
          expiresAt,
        ),
      usedBy:
        "",
      createdAt:
        serverTimestamp(),
      updatedAt:
        serverTimestamp(),
    },
  );

  await batch.commit();

  return code;
}

export async function acceptSchoolInvite({
  code,
  userId,
}: {
  code: string;
  userId: string;
}): Promise<{
  schoolId: string;
  role: SchoolInviteRole;
}> {
  const cleanedCode =
    normaliseCode(code);

  const cleanedUserId =
    userId.trim();

  if (
    !cleanedCode ||
    !cleanedUserId
  ) {
    throw new Error(
      "Enter a valid school join code.",
    );
  }

  const inviteRef =
    doc(
      db,
      "schoolInvites",
      cleanedCode,
    );

  const inviteSnapshot =
    await getDoc(
      inviteRef,
    );

  if (
    !inviteSnapshot.exists()
  ) {
    throw new Error(
      "That school join code could not be found.",
    );
  }

  const invite =
    inviteSnapshot.data();

  if (
    invite.status !==
    "active"
  ) {
    throw new Error(
      "This school join code is no longer active.",
    );
  }

  const expiresAt =
    timestampToDate(
      invite.expiresAt,
    );

  if (
    expiresAt &&
    expiresAt.getTime() <
      Date.now()
  ) {
    throw new Error(
      "This school join code has expired.",
    );
  }

  const schoolId =
    typeof invite.schoolId ===
    "string"
      ? invite.schoolId.trim()
      : "";

  const role:
    SchoolInviteRole =
    invite.role ===
    "teacher"
      ? "teacher"
      : "student";

  if (!schoolId) {
    throw new Error(
      "This school invitation is invalid.",
    );
  }

  const userRef =
    doc(
      db,
      "users",
      cleanedUserId,
    );

  const userSnapshot =
    await getDoc(
      userRef,
    );

  if (
    !userSnapshot.exists()
  ) {
    throw new Error(
      "Your CS Master profile could not be found.",
    );
  }

  const userData =
    userSnapshot.data();

  const existingSchoolId =
    typeof userData.schoolId ===
    "string"
      ? userData.schoolId.trim()
      : "";

  if (
    existingSchoolId &&
    existingSchoolId !==
      schoolId
  ) {
    throw new Error(
      "Your account already belongs to another school. Use the school transfer process instead.",
    );
  }

  if (
    role === "teacher" &&
    userData.role !==
      "teacher" &&
    userData.role !==
      "admin"
  ) {
    throw new Error(
      "This join code is for an approved teacher account.",
    );
  }

  const membershipRef =
    doc(
      db,
      "schools",
      schoolId,
      "members",
      cleanedUserId,
    );

  const batch =
    writeBatch(db);

  batch.set(
    membershipRef,
    {
      schoolId,
      userId:
        cleanedUserId,
      role,
      status:
        "active",
      inviteId:
        cleanedCode,
      joinedAt:
        serverTimestamp(),
      leftAt:
        null,
      updatedAt:
        serverTimestamp(),
    },
    {
      merge: true,
    },
  );

  batch.update(
    userRef,
    {
      schoolId,
      accountType:
        "school",
      plan:
        "school",
      updatedAt:
        serverTimestamp(),
    },
  );

  batch.update(
    inviteRef,
    {
      status:
        "used",
      usedBy:
        cleanedUserId,
      updatedAt:
        serverTimestamp(),
    },
  );

  await batch.commit();

  return {
    schoolId,
    role,
  };
}