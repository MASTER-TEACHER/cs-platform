import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type {
  CreateSchoolInput,
  School,
  SchoolStatus,
} from "@/types/school";

type FirestoreSchool = {
  name?: unknown;
  slug?: unknown;
  status?: unknown;
  ownerUserId?: unknown;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

function safeString(
  value: unknown,
): string {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function safeStatus(
  value: unknown,
): SchoolStatus {
  return value === "suspended" ||
    value === "archived"
    ? value
    : "active";
}

function slugify(
  value: string,
): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function timestampToDate(
  value: unknown,
): Date | null {
  return value instanceof Timestamp
    ? value.toDate()
    : null;
}

function convertSchool(
  id: string,
  data: FirestoreSchool,
): School {
  return {
    id,
    name:
      safeString(data.name) ||
      "Unnamed school",
    slug:
      safeString(data.slug),
    status:
      safeStatus(data.status),
    ownerUserId:
      safeString(
        data.ownerUserId,
      ),
    createdAt:
      timestampToDate(
        data.createdAt,
      ),
    updatedAt:
      timestampToDate(
        data.updatedAt,
      ),
  };
}

export async function getSchoolById(
  schoolId: string,
): Promise<School | null> {
  const cleanedSchoolId =
    schoolId.trim();

  if (!cleanedSchoolId) {
    return null;
  }

  const snapshot =
    await getDoc(
      doc(
        db,
        "schools",
        cleanedSchoolId,
      ),
    );

  if (!snapshot.exists()) {
    return null;
  }

  return convertSchool(
    snapshot.id,
    snapshot.data(),
  );
}

export async function createSchool({
  name,
  ownerUserId,
}: CreateSchoolInput): Promise<string> {
  const cleanedName =
    name
      .trim()
      .replace(/\s+/g, " ");

  const cleanedOwnerUserId =
    ownerUserId.trim();

  if (!cleanedName) {
    throw new Error(
      "Enter a valid school name.",
    );
  }

  if (!cleanedOwnerUserId) {
    throw new Error(
      "A valid school owner account is required.",
    );
  }

  /*
   * Read the authenticated teacher profile before creating
   * any tenant records.
   */
  const ownerRef =
    doc(
      db,
      "users",
      cleanedOwnerUserId,
    );

  const ownerSnapshot =
    await getDoc(ownerRef);

  if (!ownerSnapshot.exists()) {
    throw new Error(
      "The school owner account could not be found.",
    );
  }

  const ownerData =
    ownerSnapshot.data();

  const ownerRole =
    safeString(
      ownerData.role,
    );

  if (
    ownerRole !== "teacher" &&
    ownerRole !== "admin"
  ) {
    throw new Error(
      "Only an approved teacher or administrator can create a school.",
    );
  }

  const existingSchoolId =
    safeString(
      ownerData.schoolId,
    );

  if (existingSchoolId) {
    throw new Error(
      "This account is already linked to a school.",
    );
  }

  /*
   * Firestore generates the school ID locally before the
   * batch is committed. This allows all three tenant records
   * to reference exactly the same school ID.
   */
  const schoolRef =
    doc(
      collection(
        db,
        "schools",
      ),
    );

  const membershipRef =
    doc(
      db,
      "schools",
      schoolRef.id,
      "members",
      cleanedOwnerUserId,
    );

  const batch =
    writeBatch(db);

  /*
   * 1. Create the school organisation.
   */
  batch.set(
    schoolRef,
    {
      name:
        cleanedName,

      slug:
        `${slugify(
          cleanedName,
        )}-${schoolRef.id.slice(
          0,
          6,
        )}`,

      status:
        "active",

      ownerUserId:
        cleanedOwnerUserId,

      createdAt:
        serverTimestamp(),

      updatedAt:
        serverTimestamp(),
    },
  );

  /*
   * 2. Create the owner's active school-admin membership.
   *
   * Firestore's school creation rule checks this with
   * existsAfter()/getAfter(), so it MUST be part of the
   * same batch as the school creation.
   */
  batch.set(
    membershipRef,
    {
      schoolId:
        schoolRef.id,

      userId:
        cleanedOwnerUserId,

      role:
        "school_admin",

      status:
        "active",

      joinedAt:
        serverTimestamp(),

      leftAt:
        null,

      updatedAt:
        serverTimestamp(),
    },
  );

  /*
   * 3. Link the teacher profile to the school.
   *
   * IMPORTANT:
   * Some early development/test accounts pre-date the
   * canonical uid field. Firestore's user update rule
   * requires request.resource.data.uid to equal the
   * authenticated user's UID.
   *
   * Writing uid here safely repairs those legacy profiles
   * while performing the school tenancy transition.
   */
  batch.update(
    ownerRef,
    {
      uid:
        cleanedOwnerUserId,

      schoolId:
        schoolRef.id,

      accountType:
        "school",

      plan:
        "school",

      updatedAt:
        serverTimestamp(),
    },
  );

  /*
   * All three writes must succeed or none of them does.
   */
  await batch.commit();

  return schoolRef.id;
}