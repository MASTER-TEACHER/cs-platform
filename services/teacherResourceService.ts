import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
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

export type ResourceSection = {
  title: string;
  duration: string;
  teacherInstructions: string;
  studentTask: string;
  assessment: string;
  resources: string[];
};

export type ResourceDifferentiation = {
  support: string[];
  core: string[];
  stretch: string[];
};

export type ResourceMisconception = {
  misconception: string;
  correction: string;
};

export type ResourceAssessmentQuestion = {
  question: string;
  answer: string;
  marks: number;
};

export type GeneratedTeachingResource = {
  id: string;
  title: string;
  resourceType: string;
  topic: string;
  yearGroup: string;
  examBoard: string;
  duration: string;
  difficulty: string;
  overview: string;
  learningObjectives: string[];
  successCriteria: string[];
  keywords: string[];
  priorKnowledge: string[];
  sections: ResourceSection[];
  differentiation: ResourceDifferentiation;
  misconceptions: ResourceMisconception[];
  assessmentQuestions: ResourceAssessmentQuestion[];
  homework: string;
  teacherNotes: string;
  createdAt: string;
};

export type TeacherResourceStatus =
  | "draft"
  | "published"
  | "archived";

export type SavedTeacherResource = {
  id: string;

  teacherId: string;
  sourceResourceId: string;

  title: string;
  topic: string;
  resourceType: string;

  yearGroup: string;
  examBoard: string;

  duration: string;
  difficulty: string;

  content: GeneratedTeachingResource;

  status: TeacherResourceStatus;

  createdAt: Date | null;
  updatedAt: Date | null;
};

type FirestoreTeacherResource = Omit<
  SavedTeacherResource,
  "id" | "createdAt" | "updatedAt"
> & {
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

const COLLECTION_NAME =
  "teacherResources";

function timestampToDate(
  value: unknown,
): Date | null {
  if (
    value instanceof Timestamp
  ) {
    return value.toDate();
  }

  return null;
}

function requireSignedInTeacherId(): string {
  const teacherId =
    auth.currentUser?.uid;

  if (!teacherId) {
    throw new Error(
      "A signed-in teacher account is required.",
    );
  }

  return teacherId;
}

async function requireOwnedTeacherResource(
  resourceDocumentId: string,
): Promise<{
  teacherId: string;
  reference: ReturnType<typeof doc>;
  data: FirestoreTeacherResource;
}> {
  const cleanedResourceId =
    resourceDocumentId.trim();

  if (!cleanedResourceId) {
    throw new Error(
      "A valid teaching resource is required.",
    );
  }

  const teacherId =
    requireSignedInTeacherId();

  const reference = doc(
    db,
    COLLECTION_NAME,
    cleanedResourceId,
  );

  const snapshot =
    await getDoc(reference);

  if (!snapshot.exists()) {
    throw new Error(
      "The teaching resource could not be found.",
    );
  }

  const data =
    snapshot.data() as
      FirestoreTeacherResource;

  if (
    !data.teacherId ||
    data.teacherId !== teacherId
  ) {
    throw new Error(
      "You do not have permission to modify this teaching resource.",
    );
  }

  return {
    teacherId,
    reference,
    data,
  };
}

export async function saveTeacherResource(
  teacherId: string,
  resource:
    GeneratedTeachingResource,
): Promise<string> {
  const signedInTeacherId =
    requireSignedInTeacherId();

  const cleanedTeacherId =
    teacherId.trim();

  if (!cleanedTeacherId) {
    throw new Error(
      "A signed-in teacher is required to save this resource.",
    );
  }

  /*
   * Prevent a caller from saving a resource under
   * another teacher's UID.
   */
  if (
    cleanedTeacherId !==
    signedInTeacherId
  ) {
    throw new Error(
      "You cannot save a resource for another teacher account.",
    );
  }

  const existingQuery = query(
    collection(
      db,
      COLLECTION_NAME,
    ),
    where(
      "teacherId",
      "==",
      signedInTeacherId,
    ),
    where(
      "sourceResourceId",
      "==",
      resource.id,
    ),
  );

  const existingSnapshot =
    await getDocs(
      existingQuery,
    );

  if (
    !existingSnapshot.empty
  ) {
    throw new Error(
      "This resource has already been saved to your library.",
    );
  }

  const documentReference =
    await addDoc(
      collection(
        db,
        COLLECTION_NAME,
      ),
      {
        teacherId:
          signedInTeacherId,

        sourceResourceId:
          resource.id,

        title:
          resource.title,

        topic:
          resource.topic,

        resourceType:
          resource.resourceType,

        yearGroup:
          resource.yearGroup,

        examBoard:
          resource.examBoard,

        duration:
          resource.duration,

        difficulty:
          resource.difficulty,

        content:
          resource,

        status:
          "draft",

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp(),
      },
    );

  return documentReference.id;
}

export async function getTeacherResources(
  teacherId: string,
): Promise<
  SavedTeacherResource[]
> {
  const signedInTeacherId =
    requireSignedInTeacherId();

  const cleanedTeacherId =
    teacherId.trim();

  if (!cleanedTeacherId) {
    return [];
  }

  /*
   * Do not allow this client-side service to become
   * a directory for another teacher's private content.
   */
  if (
    cleanedTeacherId !==
    signedInTeacherId
  ) {
    throw new Error(
      "You cannot access another teacher's resource library.",
    );
  }

  const resourcesQuery =
    query(
      collection(
        db,
        COLLECTION_NAME,
      ),
      where(
        "teacherId",
        "==",
        signedInTeacherId,
      ),
      orderBy(
        "createdAt",
        "desc",
      ),
    );

  const snapshot =
    await getDocs(
      resourcesQuery,
    );

  return snapshot.docs.map(
    (
      resourceDocument,
    ) => {
      const data =
        resourceDocument.data() as
          FirestoreTeacherResource;

      /*
       * Defensive validation.
       *
       * The Firestore query should already guarantee
       * this, but we do not return a malformed record
       * whose owner does not match the current user.
       */
      if (
        data.teacherId !==
        signedInTeacherId
      ) {
        throw new Error(
          "A resource ownership mismatch was detected.",
        );
      }

      return {
        id:
          resourceDocument.id,

        teacherId:
          data.teacherId,

        sourceResourceId:
          data.sourceResourceId,

        title:
          data.title,

        topic:
          data.topic,

        resourceType:
          data.resourceType,

        yearGroup:
          data.yearGroup,

        examBoard:
          data.examBoard,

        duration:
          data.duration,

        difficulty:
          data.difficulty,

        content:
          data.content,

        status:
          data.status,

        createdAt:
          timestampToDate(
            data.createdAt,
          ),

        updatedAt:
          timestampToDate(
            data.updatedAt,
          ),
      };
    },
  );
}

export async function updateTeacherResourceStatus(
  resourceDocumentId: string,
  status:
    TeacherResourceStatus,
): Promise<void> {
  const {
    reference,
  } =
    await requireOwnedTeacherResource(
      resourceDocumentId,
    );

  await updateDoc(
    reference,
    {
      status,
      updatedAt:
        serverTimestamp(),
    },
  );
}

export async function updateTeacherResourceContent(
  resourceDocumentId: string,
  resource:
    GeneratedTeachingResource,
): Promise<void> {
  const {
    reference,
  } =
    await requireOwnedTeacherResource(
      resourceDocumentId,
    );

  await updateDoc(
    reference,
    {
      title:
        resource.title,

      topic:
        resource.topic,

      resourceType:
        resource.resourceType,

      yearGroup:
        resource.yearGroup,

      examBoard:
        resource.examBoard,

      duration:
        resource.duration,

      difficulty:
        resource.difficulty,

      content:
        resource,

      updatedAt:
        serverTimestamp(),
    },
  );
}

export async function duplicateTeacherResource(
  resourceDocumentId: string,
  teacherId: string,
): Promise<string> {
  const signedInTeacherId =
    requireSignedInTeacherId();

  const cleanedTeacherId =
    teacherId.trim();

  if (
    !cleanedTeacherId ||
    cleanedTeacherId !==
      signedInTeacherId
  ) {
    throw new Error(
      "You cannot duplicate content into another teacher's library.",
    );
  }

  const {
    data: source,
  } =
    await requireOwnedTeacherResource(
      resourceDocumentId,
    );

  const stamp =
    Date.now();

  const duplicatedTitle =
    `${source.title} (Copy)`;

  const reference =
    await addDoc(
      collection(
        db,
        COLLECTION_NAME,
      ),
      {
        teacherId:
          signedInTeacherId,

        sourceResourceId:
          `${source.sourceResourceId}-copy-${stamp}`,

        title:
          duplicatedTitle,

        topic:
          source.topic,

        resourceType:
          source.resourceType,

        yearGroup:
          source.yearGroup,

        examBoard:
          source.examBoard,

        duration:
          source.duration,

        difficulty:
          source.difficulty,

        content: {
          ...source.content,

          id:
            `${source.content.id}-copy-${stamp}`,

          title:
            duplicatedTitle,
        },

        status:
          "draft",

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp(),
      },
    );

  return reference.id;
}

export async function deleteTeacherResource(
  resourceDocumentId: string,
): Promise<void> {
  const {
    reference,
    data,
  } =
    await requireOwnedTeacherResource(
      resourceDocumentId,
    );

  /*
   * Permanent deletion is intentionally restricted
   * to archived resources.
   */
  if (
    data.status !==
    "archived"
  ) {
    throw new Error(
      "Archive this resource before deleting it permanently.",
    );
  }

  await deleteDoc(
    reference,
  );
}