import "server-only";
import type { Transaction, DocumentReference } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";

/** Call only after reading the school document and before any transaction writes.
 * All joining transactions must update the school document to serialize admissions.
 * Existing out-of-band enrolment paths must also be migrated before a hard guarantee.
 */
export async function checkTransactionalStudentSeat(
  tx: Transaction,
  schoolId: string,
  seatLimit: number,
): Promise<void> {
  const query = adminDb.collection("users")
    .where("schoolId", "==", schoolId)
    .where("role", "==", "student");
  const users = await tx.get(query);
  if (users.size >= seatLimit) throw new Error("SEAT_LIMIT_REACHED");
}

export function serializeSchoolMembershipChange(
  tx: Transaction,
  schoolRef: DocumentReference,
): void {
  tx.update(schoolRef, { membershipUpdatedAt: new Date() });
}
