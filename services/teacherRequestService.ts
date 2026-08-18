import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export type CreateTeacherRequestInput = {
  userId: string;
  name: string;
  email: string;
  schoolName: string;
  jobTitle: string;
  message: string;
};

type ExistingTeacherRequest = {
  id: string;
  status:
    | "pending"
    | "approved"
    | "rejected";
};

async function findExistingRequest(
  userId: string,
): Promise<ExistingTeacherRequest | null> {
  const snapshot = await getDocs(
    query(
      collection(
        db,
        "teacherRequests",
      ),
      where(
        "userId",
        "==",
        userId,
      ),
      limit(10),
    ),
  );

  if (snapshot.empty) {
    return null;
  }

  const requests =
    snapshot.docs.map(
      (requestDocument) => {
        const data =
          requestDocument.data();

        const status =
          data.status === "approved" ||
          data.status === "rejected"
            ? data.status
            : "pending";

        return {
          id: requestDocument.id,
          status,
        } satisfies ExistingTeacherRequest;
      },
    );

  return (
    requests.find(
      (request) =>
        request.status === "pending",
    ) ||
    requests.find(
      (request) =>
        request.status === "approved",
    ) ||
    requests[0] ||
    null
  );
}

export async function createTeacherRequest({
  userId,
  name,
  email,
  schoolName,
  jobTitle,
  message,
}: CreateTeacherRequestInput): Promise<string> {
  const cleanedUserId =
    userId.trim();

  const cleanedName =
    name.trim();

  const cleanedEmail =
    email.trim().toLowerCase();

  const cleanedSchool =
    schoolName.trim();

  const cleanedJobTitle =
    jobTitle.trim();

  if (
    !cleanedUserId ||
    !cleanedName ||
    !cleanedSchool ||
    !cleanedJobTitle
  ) {
    throw new Error(
      "Please complete all required fields.",
    );
  }

  const existing =
    await findExistingRequest(
      cleanedUserId,
    );

  if (
    existing?.status === "pending"
  ) {
    await setDoc(
      doc(
        db,
        "users",
        cleanedUserId,
      ),
      {
        accountIntent: "teacher",
        teacherAccessStatus:
          "pending",
        updatedAt:
          serverTimestamp(),
      },
      {
        merge: true,
      },
    );

    return existing.id;
  }

  if (
    existing?.status === "approved"
  ) {
    throw new Error(
      "Teacher access has already been approved for this account.",
    );
  }

  const requestReference =
    await addDoc(
      collection(
        db,
        "teacherRequests",
      ),
      {
        userId: cleanedUserId,
        name: cleanedName,
        email: cleanedEmail,
        schoolName:
          cleanedSchool,
        jobTitle:
          cleanedJobTitle,
        message:
          message.trim(),

        status: "pending",

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp(),
      },
    );

  await setDoc(
    doc(
      db,
      "users",
      cleanedUserId,
    ),
    {
      accountIntent: "teacher",

      teacherAccessStatus:
        "pending",

      updatedAt:
        serverTimestamp(),
    },
    {
      merge: true,
    },
  );

  return requestReference.id;
}