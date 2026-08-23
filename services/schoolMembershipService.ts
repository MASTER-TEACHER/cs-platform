import {
  doc,
  getDoc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type {
  SchoolMemberRole,
} from "@/types/school";

export async function assignUserToSchool({
  schoolId,
  userId,
  role,
}: {
  schoolId: string;
  userId: string;
  role: SchoolMemberRole;
}): Promise<void> {
  const cleanedSchoolId = schoolId.trim();
  const cleanedUserId = userId.trim();

  if (!cleanedSchoolId || !cleanedUserId) {
    throw new Error("A valid school and user are required.");
  }

  const schoolRef = doc(db, "schools", cleanedSchoolId);
  const userRef = doc(db, "users", cleanedUserId);

  const [schoolSnapshot, userSnapshot] = await Promise.all([
    getDoc(schoolRef),
    getDoc(userRef),
  ]);

  if (!schoolSnapshot.exists()) {
    throw new Error("The selected school could not be found.");
  }

  if (!userSnapshot.exists()) {
    throw new Error("The selected user account could not be found.");
  }

  const memberRef = doc(
    db,
    "schools",
    cleanedSchoolId,
    "members",
    cleanedUserId,
  );

  const batch = writeBatch(db);

  batch.set(
    memberRef,
    {
      schoolId: cleanedSchoolId,
      userId: cleanedUserId,
      role,
      status: "active",
      joinedAt: serverTimestamp(),
      leftAt: null,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  batch.update(userRef, {
    schoolId: cleanedSchoolId,
    accountType: "school",
    plan: "school",
    updatedAt: serverTimestamp(),
  });

  await batch.commit();
}

export async function removeUserFromSchool({
  schoolId,
  userId,
}: {
  schoolId: string;
  userId: string;
}): Promise<void> {
  const cleanedSchoolId = schoolId.trim();
  const cleanedUserId = userId.trim();

  if (!cleanedSchoolId || !cleanedUserId) {
    throw new Error("A valid school and user are required.");
  }

  const userRef = doc(db, "users", cleanedUserId);
  const userSnapshot = await getDoc(userRef);

  if (!userSnapshot.exists()) {
    throw new Error("The selected user account could not be found.");
  }

  const userData = userSnapshot.data();

  if (
    typeof userData.schoolId === "string" &&
    userData.schoolId &&
    userData.schoolId !== cleanedSchoolId
  ) {
    throw new Error(
      "This user no longer belongs to the selected school.",
    );
  }

  const personalPlan =
    userData.personalPlan === "premium"
      ? "premium"
      : "free";

  const memberRef = doc(
    db,
    "schools",
    cleanedSchoolId,
    "members",
    cleanedUserId,
  );

  const batch = writeBatch(db);

  batch.set(
    memberRef,
    {
      status: "former",
      leftAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  batch.update(userRef, {
    schoolId: null,
    accountType: "individual",
    plan: personalPlan,
    classIds: [],
    updatedAt: serverTimestamp(),
  });

  await batch.commit();
}
