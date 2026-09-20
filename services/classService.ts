import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import type {
  ExamBoard,
  Qualification,
} from "@/types/user";

export type ClassStatus =
  | "active"
  | "archived";

export type ClassStudent = {
  studentId: string;
  displayName: string;
  email: string;
};

export type TeacherClass = {
  id: string;

  name: string;
  subject: string;
  yearGroup: string;
  academicYear: string;

  qualification:
    | Qualification
    | "";

  examBoard:
    | ExamBoard
    | "";

  teacherId: string;
teacherName?: string;

/*
 * Additional teachers who are permitted to manage this class.
 * teacherId remains the permanent class owner for backwards compatibility.
 */
coTeacherIds: string[];

schoolId: string;

  /*
   * Permanent reusable class join code.
   * Unlike schoolInvites, this code is NOT consumed when a student joins.
   */
  joinCode: string;
  joinCodeEnabled: boolean;

  studentIds: string[];
  students?: ClassStudent[];

  assignmentIds: string[];

  status: ClassStatus;

  createdAt: Date | null;
  updatedAt: Date | null;
};

export type CreateClassInput = {
  name: string;
  subject: string;
  yearGroup: string;
  academicYear: string;

  qualification:
    | Qualification
    | "";

  examBoard:
    | ExamBoard
    | "";

  teacherId: string;
  teacherName?: string;

  schoolId?: string;
};

type FirestoreTeacherClass =
  Omit<
    TeacherClass,
    | "id"
    | "createdAt"
    | "updatedAt"
  > & {
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
  };

type FirestoreStudentProfile = {
  uid?: unknown;
  name?: unknown;
  email?: unknown;
  role?: unknown;

  schoolId?: unknown;

  classIds?: unknown;
};

function convertTimestamp(
  value?: Timestamp,
): Date | null {
  return value?.toDate
    ? value.toDate()
    : null;
}

function normaliseClassName(
  value: string,
): string {
  return value
    .trim()
    .replace(/\s+/g, " ");
}

function normaliseString(
  value: unknown,
): string {
  return typeof value ===
    "string"
    ? value.trim()
    : "";
}

function normaliseEmail(
  value: unknown,
): string {
  return normaliseString(
    value,
  ).toLowerCase();
}

function normaliseQualification(
  value: unknown,
): Qualification | "" {
  return value === "GCSE" ||
    value === "A_LEVEL"
    ? value
    : "";
}

function normaliseExamBoard(
  value: unknown,
): ExamBoard | "" {
  return value === "AQA" ||
    value === "OCR" ||
    value === "EDEXCEL"
    ? value
    : "";
}

function normaliseStringArray(
  value: unknown,
): string[] {
  return Array.isArray(value)
    ? value.filter(
        (
          item,
        ): item is string =>
          typeof item === "string",
      )
    : [];
}

const CLASS_JOIN_CODE_ALPHABET =
  "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function normaliseClassJoinCode(
  value: unknown,
): string {
  return normaliseString(
    value,
  )
    .toUpperCase()
    .replace(
      /[^A-Z0-9]/g,
      "",
    )
    .slice(0, 10);
}

export function generateClassJoinCode(
  length = 8,
): string {
  const safeLength =
    Math.max(
      6,
      Math.min(
        length,
        10,
      ),
    );

  const randomValues =
    new Uint32Array(
      safeLength,
    );

  globalThis.crypto.getRandomValues(
    randomValues,
  );

  return Array.from(
    randomValues,
    (value) =>
      CLASS_JOIN_CODE_ALPHABET[
        value %
          CLASS_JOIN_CODE_ALPHABET.length
      ],
  ).join("");
}

function normaliseStudent(
  student: ClassStudent,
): ClassStudent {
  return {
    studentId:
      student.studentId.trim(),

    displayName:
      student.displayName.trim() ||
      "Unnamed Student",

    email:
      student.email
        .trim()
        .toLowerCase(),
  };
}

function convertClassDocument(
  documentId: string,
  data:
    Partial<FirestoreTeacherClass>,
): TeacherClass {
  return {
    id:
      documentId,

    name:
      normaliseString(
        data.name,
      ) ||
      "Untitled Class",

    subject:
      normaliseString(
        data.subject,
      ) ||
      "Computer Science",

    yearGroup:
      normaliseString(
        data.yearGroup,
      ),

    academicYear:
      normaliseString(
        data.academicYear,
      ),

    qualification:
      normaliseQualification(
        data.qualification,
      ),

    examBoard:
      normaliseExamBoard(
        data.examBoard,
      ),

    teacherId:
      normaliseString(
        data.teacherId,
      ),

   teacherName:
  normaliseString(
    data.teacherName,
  ),

coTeacherIds:
  normaliseStringArray(
    data.coTeacherIds,
  ),

schoolId:
  normaliseString(
    data.schoolId,
  ),

    joinCode:
      normaliseClassJoinCode(
        data.joinCode,
      ),

    joinCodeEnabled:
      data.joinCodeEnabled !==
      false,

    studentIds:
      normaliseStringArray(
        data.studentIds,
      ),

    students:
      Array.isArray(
        data.students,
      )
        ? data.students
        : [],

    assignmentIds:
      normaliseStringArray(
        data.assignmentIds,
      ),

    status:
      data.status ===
      "archived"
        ? "archived"
        : "active",

    createdAt:
      convertTimestamp(
        data.createdAt,
      ),

    updatedAt:
      convertTimestamp(
        data.updatedAt,
      ),
  };
}

/*
 * Loads the freshest name/email directly from users/{studentId}.
 * Embedded class student details remain a fallback.
 */
async function hydrateClassStudents(
  teacherClass:
    TeacherClass,
): Promise<TeacherClass> {
  const embeddedById =
    new Map(
      (
        teacherClass.students ??
        []
      ).map(
        (student) => [
          student.studentId,
          student,
        ],
      ),
    );

  const studentIds =
    Array.from(
      new Set(
        [
          ...teacherClass.studentIds,

          ...(
            teacherClass.students ??
            []
          ).map(
            (student) =>
              student.studentId,
          ),
        ]
          .map(
            (studentId) =>
              studentId.trim(),
          )
          .filter(Boolean),
      ),
    );

  if (
    studentIds.length === 0
  ) {
    return {
      ...teacherClass,
      studentIds: [],
      students: [],
    };
  }

  const hydrated =
    await Promise.all(
      studentIds.map(
        async (
          studentId,
        ): Promise<ClassStudent> => {
          const embedded =
            embeddedById.get(
              studentId,
            );

          try {
            const snapshot =
              await getDoc(
                doc(
                  db,
                  "users",
                  studentId,
                ),
              );

            if (
              !snapshot.exists()
            ) {
              return {
                studentId,
                displayName:
                  embedded
                    ?.displayName ||
                  "Unnamed Student",
                email:
                  embedded
                    ?.email ||
                  "",
              };
            }

            const data =
              snapshot.data() as
                FirestoreStudentProfile;

            return {
              studentId,

              displayName:
                normaliseString(
                  data.name,
                ) ||
                embedded
                  ?.displayName ||
                "Unnamed Student",

              email:
                normaliseEmail(
                  data.email,
                ) ||
                embedded
                  ?.email ||
                "",
            };
          } catch (
            error
          ) {
            console.warn(
              `Unable to hydrate student profile ${studentId}:`,
              error,
            );

            return {
              studentId,
              displayName:
                embedded
                  ?.displayName ||
                "Unnamed Student",
              email:
                embedded?.email ||
                "",
            };
          }
        },
      ),
    );

  return {
    ...teacherClass,
    studentIds,
    students:
      hydrated,
  };
}

export async function createTeacherClass(
  input:
    CreateClassInput,
): Promise<string> {
  const className =
    normaliseClassName(
      input.name,
    );

  if (!className) {
    throw new Error(
      "Enter a valid class name.",
    );
  }

  const teacherId =
    input.teacherId.trim();

  if (!teacherId) {
    throw new Error(
      "A teacher account is required.",
    );
  }

  if (
    !input.yearGroup.trim()
  ) {
    throw new Error(
      "Select or enter a year group.",
    );
  }

  if (
    !input.academicYear.trim()
  ) {
    throw new Error(
      "Enter an academic year.",
    );
  }

  if (
    !input.qualification
  ) {
    throw new Error(
      "Select a qualification.",
    );
  }

  if (
    !input.examBoard
  ) {
    throw new Error(
      "Select an exam board.",
    );
  }

  const teacherReference =
    doc(
      db,
      "users",
      teacherId,
    );

  const teacherSnapshot =
    await getDoc(
      teacherReference,
    );

  if (
    !teacherSnapshot.exists()
  ) {
    throw new Error(
      "The teacher account could not be found.",
    );
  }

  const teacherData =
    teacherSnapshot.data();

  const schoolId =
    input.schoolId
      ?.trim() ||
    normaliseString(
      teacherData.schoolId,
    );

  if (!schoolId) {
    throw new Error(
      "Your teacher account must be linked to a school before creating classes.",
    );
  }

  const joinCode =
    generateClassJoinCode();

  const classReference =
    await addDoc(
      collection(
        db,
        "classes",
      ),
      {
        name:
          className,

        subject:
          input.subject.trim() ||
          "Computer Science",

        yearGroup:
          input.yearGroup.trim(),

        academicYear:
          input.academicYear.trim(),

        qualification:
          input.qualification,

        examBoard:
          input.examBoard,

        teacherId,

        teacherName:
          input.teacherName
            ?.trim() ||
          normaliseString(
            teacherData.name,
          ) ||
          "Teacher",
coTeacherIds: [],

        schoolId,

        joinCode,
        joinCodeEnabled:
          true,

        studentIds: [],
        students: [],
        assignmentIds: [],

        status:
          "active",

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp(),
      },
    );

  return classReference.id;
}

export async function getTeacherClasses(
  teacherId: string,
): Promise<TeacherClass[]> {
  const cleanedTeacherId =
    teacherId.trim();

  if (!cleanedTeacherId) {
    return [];
  }

  const classesCollection =
    collection(
      db,
      "classes",
    );

  const ownedClassesQuery =
    query(
      classesCollection,
      where(
        "teacherId",
        "==",
        cleanedTeacherId,
      ),
    );

  const coTaughtClassesQuery =
    query(
      classesCollection,
      where(
        "coTeacherIds",
        "array-contains",
        cleanedTeacherId,
      ),
    );

  const [
    ownedSnapshot,
    coTaughtSnapshot,
  ] =
    await Promise.all([
      getDocs(
        ownedClassesQuery,
      ),
      getDocs(
        coTaughtClassesQuery,
      ),
    ]);

  const classesById =
    new Map<
      string,
      TeacherClass
    >();

  for (
    const classDocument of
      ownedSnapshot.docs
  ) {
    const teacherClass =
      convertClassDocument(
        classDocument.id,
        classDocument.data() as
          Partial<FirestoreTeacherClass>,
      );

    classesById.set(
      teacherClass.id,
      teacherClass,
    );
  }

  for (
    const classDocument of
      coTaughtSnapshot.docs
  ) {
    const teacherClass =
      convertClassDocument(
        classDocument.id,
        classDocument.data() as
          Partial<FirestoreTeacherClass>,
      );

    classesById.set(
      teacherClass.id,
      teacherClass,
    );
  }

  return Array.from(
    classesById.values(),
  ).sort(
    (classA, classB) => {
      const timeA =
        classA.createdAt?.getTime() ??
        0;

      const timeB =
        classB.createdAt?.getTime() ??
        0;

      return timeB - timeA;
    },
  );
}

export async function getTeacherClassById(
  classId: string,
): Promise<TeacherClass | null> {
  const cleanedClassId =
    classId.trim();

  if (!cleanedClassId) {
    return null;
  }

  const snapshot =
    await getDoc(
      doc(
        db,
        "classes",
        cleanedClassId,
      ),
    );

  if (
    !snapshot.exists()
  ) {
    return null;
  }

  return hydrateClassStudents(
    convertClassDocument(
      snapshot.id,
      snapshot.data() as
        Partial<FirestoreTeacherClass>,
    ),
  );
}

export type UpdateTeacherClassInput =
  Partial<
    Pick<
      TeacherClass,
      | "name"
      | "subject"
      | "yearGroup"
      | "academicYear"
      | "qualification"
      | "examBoard"
      | "status"
    >
  >;

export async function updateTeacherClass(
  classId: string,
  updates:
    UpdateTeacherClassInput,
): Promise<void> {
  const cleanedClassId =
    classId.trim();

  if (!cleanedClassId) {
    throw new Error(
      "A valid class is required.",
    );
  }

  const updateData:
    Record<
      string,
      unknown
    > = {};

  if (
    updates.name !==
    undefined
  ) {
    const name =
      normaliseClassName(
        updates.name,
      );

    if (!name) {
      throw new Error(
        "Enter a valid class name.",
      );
    }

    updateData.name =
      name;
  }

  if (
    updates.subject !==
    undefined
  ) {
    updateData.subject =
      updates.subject.trim() ||
      "Computer Science";
  }

  if (
    updates.yearGroup !==
    undefined
  ) {
    if (
      !updates.yearGroup.trim()
    ) {
      throw new Error(
        "Enter a year group.",
      );
    }

    updateData.yearGroup =
      updates.yearGroup.trim();
  }

  if (
    updates.academicYear !==
    undefined
  ) {
    if (
      !updates.academicYear.trim()
    ) {
      throw new Error(
        "Enter an academic year.",
      );
    }

    updateData.academicYear =
      updates.academicYear.trim();
  }

  if (
    updates.qualification !==
    undefined
  ) {
    if (
      updates.qualification !==
        "GCSE" &&
      updates.qualification !==
        "A_LEVEL"
    ) {
      throw new Error(
        "Select GCSE or A Level.",
      );
    }

    updateData.qualification =
      updates.qualification;
  }

  if (
    updates.examBoard !==
    undefined
  ) {
    if (
      updates.examBoard !==
        "AQA" &&
      updates.examBoard !==
        "OCR" &&
      updates.examBoard !==
        "EDEXCEL"
    ) {
      throw new Error(
        "Select AQA, OCR or Edexcel.",
      );
    }

    updateData.examBoard =
      updates.examBoard;
  }

  if (
    updates.status !==
    undefined
  ) {
    updateData.status =
      updates.status;
  }

  const classReference =
    doc(
      db,
      "classes",
      cleanedClassId,
    );

  const classSnapshot =
    await getDoc(
      classReference,
    );

  if (
    !classSnapshot.exists()
  ) {
    throw new Error(
      "The class could not be found.",
    );
  }

  const existingClass =
    classSnapshot.data() as
      Partial<FirestoreTeacherClass>;

  /*
   * T1A -> T1B compatibility:
   * legacy classes created before school tenancy may still lack schoolId.
   * Adopt the owning teacher's current school during the first settings
   * update so the tenant security rule remains satisfied.
   */
  if (
    !normaliseString(
      existingClass.schoolId,
    )
  ) {
    const ownerId =
      normaliseString(
        existingClass.teacherId,
      );

    if (ownerId) {
      const ownerSnapshot =
        await getDoc(
          doc(
            db,
            "users",
            ownerId,
          ),
        );

      const ownerSchoolId =
        ownerSnapshot.exists()
          ? normaliseString(
              ownerSnapshot.data()
                .schoolId,
            )
          : "";

      if (ownerSchoolId) {
        updateData.schoolId =
          ownerSchoolId;
      }
    }
  }

  await updateDoc(
    classReference,
    {
      ...updateData,
      updatedAt:
        serverTimestamp(),
    },
  );
}

export async function ensureClassJoinCode(
  classId: string,
): Promise<string> {
  const cleanedClassId =
    classId.trim();

  if (!cleanedClassId) {
    throw new Error(
      "A valid class is required.",
    );
  }

  const classReference =
    doc(
      db,
      "classes",
      cleanedClassId,
    );

  const snapshot =
    await getDoc(
      classReference,
    );

  if (!snapshot.exists()) {
    throw new Error(
      "The class could not be found.",
    );
  }

  const currentCode =
    normaliseClassJoinCode(
      snapshot.data()
        .joinCode,
    );

  if (currentCode) {
    return currentCode;
  }

  const joinCode =
    generateClassJoinCode();

  await updateDoc(
    classReference,
    {
      joinCode,
      joinCodeEnabled:
        true,
      updatedAt:
        serverTimestamp(),
    },
  );

  return joinCode;
}

export async function regenerateClassJoinCode(
  classId: string,
): Promise<string> {
  const cleanedClassId =
    classId.trim();

  if (!cleanedClassId) {
    throw new Error(
      "A valid class is required.",
    );
  }

  const joinCode =
    generateClassJoinCode();

  await updateDoc(
    doc(
      db,
      "classes",
      cleanedClassId,
    ),
    {
      joinCode,
      joinCodeEnabled:
        true,
      updatedAt:
        serverTimestamp(),
    },
  );

  return joinCode;
}

export async function setClassJoinCodeEnabled(
  classId: string,
  enabled: boolean,
): Promise<void> {
  const cleanedClassId =
    classId.trim();

  if (!cleanedClassId) {
    throw new Error(
      "A valid class is required.",
    );
  }

  await updateDoc(
    doc(
      db,
      "classes",
      cleanedClassId,
    ),
    {
      joinCodeEnabled:
        enabled,
      updatedAt:
        serverTimestamp(),
    },
  );
}

/*
 * Enrolment updates both the class and student profile atomically.
 * Same-school membership is verified inside the transaction.
 */
export async function addStudentToClass(
  classId: string,
  student:
    ClassStudent,
): Promise<void> {
  const cleanedClassId =
    classId.trim();

  const cleanedStudent =
    normaliseStudent(
      student,
    );

  if (!cleanedClassId) {
    throw new Error(
      "A valid class is required.",
    );
  }

  if (
    !cleanedStudent.studentId
  ) {
    throw new Error(
      "A valid student account is required.",
    );
  }

  const classReference =
    doc(
      db,
      "classes",
      cleanedClassId,
    );

  const studentReference =
    doc(
      db,
      "users",
      cleanedStudent.studentId,
    );

  await runTransaction(
    db,
    async (
      transaction,
    ) => {
      const [
        classSnapshot,
        studentSnapshot,
      ] =
        await Promise.all([
          transaction.get(
            classReference,
          ),
          transaction.get(
            studentReference,
          ),
        ]);

      if (
        !classSnapshot.exists()
      ) {
        throw new Error(
          "The selected class could not be found.",
        );
      }

      if (
        !studentSnapshot.exists()
      ) {
        throw new Error(
          "The selected student account could not be found.",
        );
      }

      const classData =
        classSnapshot.data() as
          Partial<FirestoreTeacherClass>;

      const studentData =
        studentSnapshot.data() as
          FirestoreStudentProfile;

      if (
        studentData.role !==
        "student"
      ) {
        throw new Error(
          "Only student accounts can be enrolled.",
        );
      }

      let classSchoolId =
        normaliseString(
          classData.schoolId,
        );

      /*
       * Legacy classes created before schoolId existed can adopt their
       * owning teacher's current school on the next enrolment.
       */
      if (!classSchoolId) {
        const ownerId =
          normaliseString(
            classData.teacherId,
          );

        if (ownerId) {
          const teacherSnapshot =
            await transaction.get(
              doc(
                db,
                "users",
                ownerId,
              ),
            );

          if (
            teacherSnapshot.exists()
          ) {
            classSchoolId =
              normaliseString(
                teacherSnapshot.data()
                  .schoolId,
              );
          }
        }
      }

      const studentSchoolId =
        normaliseString(
          studentData.schoolId,
        );

      if (!classSchoolId) {
        throw new Error(
          "This class is not linked to a school yet.",
        );
      }

      if (!studentSchoolId) {
        throw new Error(
          "This student is not linked to your school.",
        );
      }

      if (
        studentSchoolId !==
        classSchoolId
      ) {
        throw new Error(
          "This student belongs to a different school and cannot be enrolled in this class.",
        );
      }

      const verifiedStudent:
        ClassStudent = {
        studentId:
          cleanedStudent.studentId,

        displayName:
          normaliseString(
            studentData.name,
          ) ||
          cleanedStudent.displayName ||
          "Unnamed Student",

        email:
          normaliseEmail(
            studentData.email,
          ) ||
          cleanedStudent.email ||
          "",
      };

      const existingStudentIds =
        normaliseStringArray(
          classData.studentIds,
        );

      const existingStudents =
        Array.isArray(
          classData.students,
        )
          ? classData.students
          : [];

      if (
        existingStudentIds.includes(
          verifiedStudent.studentId,
        )
      ) {
        throw new Error(
          "This student is already enrolled in the class.",
        );
      }

      const updatedStudents =
        [
          ...existingStudents.filter(
            (
              existingStudent,
            ) =>
              existingStudent.studentId !==
              verifiedStudent.studentId,
          ),
          verifiedStudent,
        ];

      const currentClassIds =
        normaliseStringArray(
          studentData.classIds,
        );

      transaction.update(
        classReference,
        {
          schoolId:
            classSchoolId,

          studentIds: [
            ...existingStudentIds,
            verifiedStudent.studentId,
          ],

          students:
            updatedStudents,

          updatedAt:
            serverTimestamp(),
        },
      );

      transaction.update(
        studentReference,
        {
          classIds:
            Array.from(
              new Set([
                ...currentClassIds,
                cleanedClassId,
              ]),
            ),

          updatedAt:
            serverTimestamp(),
        },
      );
    },
  );
}

export async function removeStudentFromClass(
  classId: string,
  student:
    ClassStudent,
): Promise<void> {
  const cleanedClassId =
    classId.trim();

  const cleanedStudent =
    normaliseStudent(
      student,
    );

  if (
    !cleanedClassId ||
    !cleanedStudent.studentId
  ) {
    throw new Error(
      "A valid class and student are required.",
    );
  }

  const classReference =
    doc(
      db,
      "classes",
      cleanedClassId,
    );

  const studentReference =
    doc(
      db,
      "users",
      cleanedStudent.studentId,
    );

  await runTransaction(
    db,
    async (
      transaction,
    ) => {
      const [
        classSnapshot,
        studentSnapshot,
      ] =
        await Promise.all([
          transaction.get(
            classReference,
          ),
          transaction.get(
            studentReference,
          ),
        ]);

      if (
        !classSnapshot.exists()
      ) {
        throw new Error(
          "The selected class could not be found.",
        );
      }

      const classData =
        classSnapshot.data() as
          Partial<FirestoreTeacherClass>;

      const updatedStudentIds =
        normaliseStringArray(
          classData.studentIds,
        ).filter(
          (
            studentId,
          ) =>
            studentId !==
            cleanedStudent.studentId,
        );

      const updatedStudents =
        (
          Array.isArray(
            classData.students,
          )
            ? classData.students
            : []
        ).filter(
          (
            classStudent,
          ) =>
            classStudent.studentId !==
            cleanedStudent.studentId,
        );

      transaction.update(
        classReference,
        {
          studentIds:
            updatedStudentIds,

          students:
            updatedStudents,

          updatedAt:
            serverTimestamp(),
        },
      );

      if (
        studentSnapshot.exists()
      ) {
        const studentData =
          studentSnapshot.data() as
            FirestoreStudentProfile;

        const currentClassIds =
          normaliseStringArray(
            studentData.classIds,
          );

        transaction.update(
          studentReference,
          {
            classIds:
              currentClassIds.filter(
                (
                  studentClassId,
                ) =>
                  studentClassId !==
                  cleanedClassId,
              ),

            updatedAt:
              serverTimestamp(),
          },
        );
      }
    },
  );
}

export async function addCoTeacherToClass(
  classId: string,
  ownerTeacherId: string,
  coTeacherId: string,
): Promise<void> {
  const cleanedClassId =
    classId.trim();

  const cleanedOwnerTeacherId =
    ownerTeacherId.trim();

  const cleanedCoTeacherId =
    coTeacherId.trim();

  if (
    !cleanedClassId ||
    !cleanedOwnerTeacherId ||
    !cleanedCoTeacherId
  ) {
    throw new Error(
      "A valid class, owner and co-teacher are required.",
    );
  }

  if (
    cleanedOwnerTeacherId ===
    cleanedCoTeacherId
  ) {
    throw new Error(
      "The class owner cannot be added as a co-teacher.",
    );
  }

  const classReference =
    doc(
      db,
      "classes",
      cleanedClassId,
    );

  const coTeacherReference =
    doc(
      db,
      "users",
      cleanedCoTeacherId,
    );

const ownerReference =
  doc(
    db,
    "users",
    cleanedOwnerTeacherId,
  );

  await runTransaction(
    db,
    async (transaction) => {
      const [
  classSnapshot,
  ownerSnapshot,
  coTeacherSnapshot,
] =
  await Promise.all([
    transaction.get(
      classReference,
    ),
    transaction.get(
      ownerReference,
    ),
    transaction.get(
      coTeacherReference,
    ),
  ]);


  
      if (
        !classSnapshot.exists()
      ) {
        throw new Error(
          "The selected class could not be found.",
        );
      }

      if (
        !coTeacherSnapshot.exists()
      ) {
        throw new Error(
          "The teacher account could not be found.",
        );
      }

if (
  !ownerSnapshot.exists()
) {
  throw new Error(
    "The class owner account could not be found.",
  );
}

      const classData =
        classSnapshot.data() as
          Partial<FirestoreTeacherClass>;

      const coTeacherData =
        coTeacherSnapshot.data() as
          FirestoreStudentProfile;

      const classOwnerId =
        normaliseString(
          classData.teacherId,
        );

      if (
        classOwnerId !==
        cleanedOwnerTeacherId
      ) {
        throw new Error(
          "Only the class owner can add co-teachers.",
        );
      }

      if (
        coTeacherData.role !==
        "teacher"
      ) {
        throw new Error(
          "Only teacher accounts can be added as co-teachers.",
        );
      }

      const classSchoolId =
        normaliseString(
          classData.schoolId,
        );

const ownerData =
  ownerSnapshot.data() as
    FirestoreStudentProfile;

const ownerSchoolId =
  normaliseString(
    ownerData.schoolId,
  );

      const coTeacherSchoolId =
        normaliseString(
          coTeacherData.schoolId,
        );

      if (!classSchoolId) {
        throw new Error(
          "This class is not linked to a school.",
        );
      }

if (
  !ownerSchoolId ||
  ownerSchoolId !== classSchoolId
) {
  throw new Error(
    "The class owner is not linked to this school's tenancy.",
  );
}

const coTeacherMembershipReference =
  doc(
    db,
    "schools",
    classSchoolId,
    "members",
    cleanedCoTeacherId,
  );

const coTeacherMembershipSnapshot =
  await transaction.get(
    coTeacherMembershipReference,
  );

if (
  !coTeacherMembershipSnapshot.exists()
) {
  throw new Error(
    "The selected teacher is not an active member of this school.",
  );
}

const coTeacherMembership =
  coTeacherMembershipSnapshot.data();

const membershipStatus =
  normaliseString(
    coTeacherMembership.status,
  );

if (
  membershipStatus &&
  membershipStatus !== "active"
) {
  throw new Error(
    "The selected teacher does not have an active school membership.",
  );
}

      if (!coTeacherSchoolId) {
        throw new Error(
          "The selected teacher is not linked to a school.",
        );
      }

      if (
        classSchoolId !==
        coTeacherSchoolId
      ) {
        throw new Error(
          "Only teachers from the same school can be added to this class.",
        );
      }

      const existingCoTeacherIds =
        normaliseStringArray(
          classData.coTeacherIds,
        );

      if (
        existingCoTeacherIds.includes(
          cleanedCoTeacherId,
        )
      ) {
        throw new Error(
          "This teacher is already a co-teacher for the class.",
        );
      }

      transaction.update(
        classReference,
        {
          coTeacherIds: [
            ...existingCoTeacherIds,
            cleanedCoTeacherId,
          ],

          updatedAt:
            serverTimestamp(),
        },
      );
    },
  );
}

export async function removeCoTeacherFromClass(
  classId: string,
  ownerTeacherId: string,
  coTeacherId: string,
): Promise<void> {
  const cleanedClassId =
    classId.trim();

  const cleanedOwnerTeacherId =
    ownerTeacherId.trim();

  const cleanedCoTeacherId =
    coTeacherId.trim();

  if (
    !cleanedClassId ||
    !cleanedOwnerTeacherId ||
    !cleanedCoTeacherId
  ) {
    throw new Error(
      "A valid class, owner and co-teacher are required.",
    );
  }

  const classReference =
    doc(
      db,
      "classes",
      cleanedClassId,
    );

  await runTransaction(
    db,
    async (transaction) => {
      const classSnapshot =
        await transaction.get(
          classReference,
        );

      if (
        !classSnapshot.exists()
      ) {
        throw new Error(
          "The selected class could not be found.",
        );
      }

      const classData =
        classSnapshot.data() as
          Partial<FirestoreTeacherClass>;

      const classOwnerId =
        normaliseString(
          classData.teacherId,
        );

      if (
        classOwnerId !==
        cleanedOwnerTeacherId
      ) {
        throw new Error(
          "Only the class owner can remove co-teachers.",
        );
      }

      const existingCoTeacherIds =
        normaliseStringArray(
          classData.coTeacherIds,
        );

      transaction.update(
        classReference,
        {
          coTeacherIds:
            existingCoTeacherIds.filter(
              (teacherId) =>
                teacherId !==
                cleanedCoTeacherId,
            ),

          updatedAt:
            serverTimestamp(),
        },
      );
    },
  );
}

export async function archiveTeacherClass(
  classId: string,
): Promise<void> {
  await updateTeacherClass(
    classId,
    {
      status:
        "archived",
    },
  );
}

export async function restoreTeacherClass(
  classId: string,
): Promise<void> {
  await updateTeacherClass(
    classId,
    {
      status:
        "active",
    },
  );
}

/*
 * Permanent deletion is intentionally conservative.
 * Classes with students or assignment references should be archived
 * instead so school history is not accidentally severed.
 */
export async function deleteTeacherClass(
  classId: string,
): Promise<void> {
  const cleanedClassId =
    classId.trim();

  if (!cleanedClassId) {
    throw new Error(
      "A valid class is required.",
    );
  }

  const reference =
    doc(
      db,
      "classes",
      cleanedClassId,
    );

  const snapshot =
    await getDoc(
      reference,
    );

  if (
    !snapshot.exists()
  ) {
    return;
  }

  const teacherClass =
    convertClassDocument(
      snapshot.id,
      snapshot.data() as
        Partial<FirestoreTeacherClass>,
    );

  if (
    teacherClass.studentIds
      .length > 0
  ) {
    throw new Error(
      "Remove students before permanently deleting this class. Archive it instead if you need to preserve history.",
    );
  }

  if (
    teacherClass.assignmentIds
      .length > 0
  ) {
    throw new Error(
      "This class has assignment history and cannot be permanently deleted. Archive it instead.",
    );
  }

  await deleteDoc(
    reference,
  );
}
