import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import {
  auth,
  db,
} from "@/lib/firebase";

import type {
  TutorConversation,
  TutorMessage,
  TutorResponse,
  TutorStudentContext,
} from "@/types/studentTutor";

type FirestoreMessage =
  Omit<
    TutorMessage,
    "createdAt"
  > & {
    createdAt?: Timestamp;
  };

type FirestoreConversation = {
  studentId: string;
  title: string;
  messages?: FirestoreMessage[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

const MAX_STORED_MESSAGES = 40;

const toDate = (
  value?: Timestamp | null,
) =>
  value?.toDate
    ? value.toDate()
    : null;

function convert(
  id: string,
  data: FirestoreConversation,
): TutorConversation {
  return {
    id,
    studentId:
      data.studentId,
    title:
      data.title ||
      "Tutor conversation",
    messages:
      (data.messages || []).map(
        (message) => ({
          ...message,
          createdAt:
            toDate(
              message.createdAt,
            ),
        }),
      ),
    createdAt:
      toDate(
        data.createdAt,
      ),
    updatedAt:
      toDate(
        data.updatedAt,
      ),
  };
}

const messageId = () =>
  `message-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

export async function createTutorConversation(
  studentId: string,
): Promise<TutorConversation> {
  const cleanedStudentId =
    studentId.trim();

  if (!cleanedStudentId) {
    throw new Error(
      "A valid student account is required.",
    );
  }

  const reference =
    await addDoc(
      collection(
        db,
        "studentTutorConversations",
      ),
      {
        studentId:
          cleanedStudentId,
        title:
          "New tutor conversation",
        messages: [],
        createdAt:
          serverTimestamp(),
        updatedAt:
          serverTimestamp(),
      },
    );

  const now =
    new Date();

  return {
    id:
      reference.id,
    studentId:
      cleanedStudentId,
    title:
      "New tutor conversation",
    messages: [],
    createdAt:
      now,
    updatedAt:
      now,
  };
}

export async function getTutorConversation(
  id: string,
): Promise<TutorConversation | null> {
  const snapshot =
    await getDoc(
      doc(
        db,
        "studentTutorConversations",
        id,
      ),
    );

  return snapshot.exists()
    ? convert(
        snapshot.id,
        snapshot.data() as
          FirestoreConversation,
      )
    : null;
}

export async function getLatestTutorConversation(
  studentId: string,
): Promise<TutorConversation | null> {
  const cleanedStudentId =
    studentId.trim();

  if (!cleanedStudentId) {
    return null;
  }

  const snapshot =
    await getDocs(
      query(
        collection(
          db,
          "studentTutorConversations",
        ),
        where(
          "studentId",
          "==",
          cleanedStudentId,
        ),
      ),
    );

  return (
    snapshot.docs
      .map((document) =>
        convert(
          document.id,
          document.data() as
            FirestoreConversation,
        ),
      )
      .sort(
        (first, second) =>
          (second.updatedAt?.getTime() ||
            second.createdAt?.getTime() ||
            0) -
          (first.updatedAt?.getTime() ||
            first.createdAt?.getTime() ||
            0),
      )[0] || null
  );
}

export async function getOrCreateTutorConversation(
  studentId: string,
): Promise<TutorConversation> {
  const existing =
    await getLatestTutorConversation(
      studentId,
    );

  if (existing) {
    return existing;
  }

  return createTutorConversation(
    studentId,
  );
}

export async function saveTutorExchange(
  input: {
    conversationId: string;
    studentId: string;
    studentMessage: string;
    tutorResponse: TutorResponse;
  },
): Promise<TutorConversation> {
  const conversation =
    await getTutorConversation(
      input.conversationId,
    );

  if (
    !conversation ||
    conversation.studentId !==
      input.studentId
  ) {
    throw new Error(
      "Tutor conversation unavailable.",
    );
  }

  const now =
    new Date();

  const studentMessage: TutorMessage = {
    id:
      messageId(),
    role:
      "student",
    content:
      input.studentMessage
        .trim()
        .slice(
          0,
          2000,
        ),
    createdAt:
      now,
  };

  const tutorMessage: TutorMessage = {
    id:
      messageId(),
    role:
      "assistant",
    content:
      input.tutorResponse.reply.slice(
        0,
        6000,
      ),
    createdAt:
      now,
    mode:
      input.tutorResponse.mode,
  };

  const messages: TutorMessage[] = [
    ...conversation.messages,
    studentMessage,
    tutorMessage,
  ].slice(
    -MAX_STORED_MESSAGES,
  );

  const title =
    conversation.messages.length
      ? conversation.title
      : input.studentMessage
          .trim()
          .slice(
            0,
            60,
          ) ||
        "Tutor conversation";

  await updateDoc(
    doc(
      db,
      "studentTutorConversations",
      input.conversationId,
    ),
    {
      title,
      messages:
        messages.map(
          (message) => ({
            ...message,
            createdAt:
              Timestamp.fromDate(
                message.createdAt ||
                  now,
              ),
          }),
        ),
      updatedAt:
        serverTimestamp(),
    },
  );

  return {
    ...conversation,
    title,
    messages,
    updatedAt:
      now,
  };
}

export async function clearTutorConversation(
  id: string,
  studentId: string,
): Promise<void> {
  const conversation =
    await getTutorConversation(
      id,
    );

  if (
    !conversation ||
    conversation.studentId !==
      studentId
  ) {
    throw new Error(
      "Tutor conversation unavailable.",
    );
  }

  await updateDoc(
    doc(
      db,
      "studentTutorConversations",
      id,
    ),
    {
      title:
        "New tutor conversation",
      messages: [],
      updatedAt:
        serverTimestamp(),
    },
  );
}

export async function requestTutorResponse(
  input: {
    studentId: string;
    conversationId: string;
    message: string;
    history: {
      role:
        | "student"
        | "assistant";
      content: string;
    }[];
    context:
      TutorStudentContext;
  },
): Promise<TutorResponse> {
  const currentUser =
    auth.currentUser;

  if (
    !currentUser ||
    currentUser.uid !==
      input.studentId
  ) {
    throw new Error(
      "Sign in with the student account to use the AI Tutor.",
    );
  }

  const idToken =
    await currentUser.getIdToken();

  const response =
    await fetch(
      "/api/ai/student-tutor",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          Authorization:
            `Bearer ${idToken}`,
        },
        body:
          JSON.stringify({
            ...input,
            history:
              input.history.slice(
                -10,
              ),
          }),
      },
    );

  const result =
    (await response.json()) as
      | TutorResponse
      | {
          error?: string;
        };

  if (!response.ok) {
    throw new Error(
      "error" in result &&
      result.error
        ? result.error
        : "The tutor could not respond.",
    );
  }

  return result as
    TutorResponse;
}