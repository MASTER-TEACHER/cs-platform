import {
  collection,
  doc,
  getDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export type SchoolMemberRecord = {
  uid: string;
  name: string;
  email: string;

  role: string;
  membershipRole: string;
  status: string;

  qualification: string;
  examBoard: string;
  currentCourse: string;

  classIds: string[];

  joinedAt: Date | null;
};

function safeString(
  value: unknown,
): string {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function safeStringArray(
  value: unknown,
): string[] {
  return Array.isArray(value)
    ? value.filter(
        (item): item is string =>
          typeof item === "string",
      )
    : [];
}

function timestampToDate(
  value: unknown,
): Date | null {
  return value instanceof Timestamp
    ? value.toDate()
    : null;
}

/*
 * T1H tenant-safe directory rule:
 *
 * A school membership document is the authoritative proof that a user belongs
 * to the requested school. A direct users/{uid} read is useful enrichment, but
 * it must not be required for the directory to load because Firestore may
 * correctly restrict cross-profile reads.
 *
 * If the user document cannot be read, the service falls back to identity and
 * course fields stored on the school membership document.
 */
export async function getSchoolMembers(
  schoolId: string,
): Promise<SchoolMemberRecord[]> {
  const cleanedSchoolId =
    schoolId.trim();

  if (!cleanedSchoolId) {
    return [];
  }

  const membershipSnapshot =
    await getDocs(
      collection(
        db,
        "schools",
        cleanedSchoolId,
        "members",
      ),
    );

  const members =
    await Promise.all(
      membershipSnapshot.docs.map(
        async (
          membershipDocument,
        ) => {
          const membership =
            membershipDocument.data();

          const userSnapshot =
            await getDoc(
              doc(
                db,
                "users",
                membershipDocument.id,
              ),
            ).catch(() => null);

          const user =
            userSnapshot?.exists()
              ? userSnapshot.data()
              : {};

          return {
            uid:
              membershipDocument.id,

            name:
              safeString(
                user.name,
              ) ||
              safeString(
                membership.name,
              ) ||
              safeString(
                membership.displayName,
              ) ||
              "Unnamed member",

            email:
              (
                safeString(
                  user.email,
                ) ||
                safeString(
                  membership.email,
                )
              ).toLowerCase(),

            role:
              safeString(
                user.role,
              ) ||
              safeString(
                membership.userRole,
              ),

            membershipRole:
              safeString(
                membership.role,
              ),

            status:
              safeString(
                membership.status,
              ) ||
              "active",

            qualification:
              safeString(
                user.qualification,
              ) ||
              safeString(
                membership.qualification,
              ),

            examBoard:
              safeString(
                user.examBoard,
              ) ||
              safeString(
                membership.examBoard,
              ),

            currentCourse:
              safeString(
                user.currentCourse,
              ) ||
              safeString(
                membership.currentCourse,
              ),

            classIds:
              safeStringArray(
                user.classIds,
              ).length > 0
                ? safeStringArray(
                    user.classIds,
                  )
                : safeStringArray(
                    membership.classIds,
                  ),

            joinedAt:
              timestampToDate(
                membership.joinedAt,
              ),
          };
        },
      ),
    );

  return members.sort(
    (
      first,
      second,
    ) =>
      first.name.localeCompare(
        second.name,
        "en-GB",
        {
          sensitivity: "base",
        },
      ),
  );
}

export async function getEligibleCoTeachers(
  schoolId: string,
  ownerTeacherId: string,
  existingCoTeacherIds: string[] = [],
): Promise<SchoolMemberRecord[]> {
  const cleanedSchoolId =
    schoolId.trim();

  const cleanedOwnerTeacherId =
    ownerTeacherId.trim();

  if (
    !cleanedSchoolId ||
    !cleanedOwnerTeacherId
  ) {
    return [];
  }

  const existingCoTeacherSet =
    new Set(
      existingCoTeacherIds
        .map((teacherId) =>
          teacherId.trim(),
        )
        .filter(Boolean),
    );

  const members =
    await getSchoolMembers(
      cleanedSchoolId,
    );

  return members.filter(
    (member) => {
      /*
       * The permanent class owner must never appear
       * in the list of teachers who can be added.
       */
      if (
        member.uid ===
        cleanedOwnerTeacherId
      ) {
        return false;
      }

      /*
       * Do not offer teachers who already manage
       * this class.
       */
      if (
        existingCoTeacherSet.has(
          member.uid,
        )
      ) {
        return false;
      }

      /*
       * Only active school members may be added
       * as co-teachers.
       */
      if (
        member.status &&
        member.status !== "active"
      ) {
        return false;
      }

      /*
       * CS Master has two related role systems:
       *
       * users/{uid}.role
       *   - teacher
       *   - admin
       *
       * schools/{schoolId}/members/{uid}.role
       *   - teacher
       *   - school_admin
       *
       * Either teacher/staff representation is
       * valid for co-teaching.
       */
      const isSchoolStaff =
        member.role === "teacher" ||
        member.role === "admin" ||
        member.membershipRole ===
          "teacher" ||
        member.membershipRole ===
          "school_admin";

      return isSchoolStaff;
    },
  );
}
