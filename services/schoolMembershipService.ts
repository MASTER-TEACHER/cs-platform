import { doc, getDoc, serverTimestamp, writeBatch } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "@/lib/firebase";
import type { SchoolMemberRole } from "@/types/school";

export async function assignUserToSchool({ schoolId, userId, role }: {
  schoolId: string; userId: string; role: SchoolMemberRole;
}): Promise<void> {
  const cleanedSchoolId = schoolId.trim();
  const cleanedUserId = userId.trim();
  if (!cleanedSchoolId || !cleanedUserId) throw new Error("A valid school and user are required.");
  const schoolRef = doc(db, "schools", cleanedSchoolId);
  const userRef = doc(db, "users", cleanedUserId);
  const [schoolSnapshot, userSnapshot] = await Promise.all([getDoc(schoolRef), getDoc(userRef)]);
  if (!schoolSnapshot.exists()) throw new Error("The selected school could not be found.");
  if (!userSnapshot.exists()) throw new Error("The selected user account could not be found.");
  const memberRef = doc(db, "schools", cleanedSchoolId, "members", cleanedUserId);
  const batch = writeBatch(db);
  batch.set(memberRef, {
    schoolId: cleanedSchoolId, userId: cleanedUserId, role, status: "active",
    joinedAt: serverTimestamp(), leftAt: null, updatedAt: serverTimestamp(),
  }, { merge: true });
  batch.update(userRef, {
    schoolId: cleanedSchoolId, accountType: "school", plan: "school", updatedAt: serverTimestamp(),
  });
  await batch.commit();
}

/** Only the signed-in student may leave their own school. */
export async function removeUserFromSchool({ schoolId, userId }: {
  schoolId: string; userId: string;
}): Promise<void> {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user || user.uid !== userId.trim()) {
    throw new Error("Sign in as the student who is leaving the school.");
  }
  const cleanedSchoolId = schoolId.trim();
  if (!cleanedSchoolId) throw new Error("A valid school is required.");
  const token = await user.getIdToken();
  const response = await fetch("/api/schools/leave", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const result: { error?: string; success?: boolean } = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.error || "Unable to leave school.");
  }
}
