import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export type ClassStatus = "active" | "archived";

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
  teacherId: string;
  teacherName?: string;
  studentIds: string[];
  students?: ClassStudent[];
  status: ClassStatus;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type CreateClassInput = {
  name: string;
  subject: string;
  yearGroup: string;
  academicYear: string;
  teacherId: string;
  teacherName?: string;
};

type FirestoreTeacherClass = Omit<
  TeacherClass,
  "id" | "createdAt" | "updatedAt"
> & {
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

type FirestoreStudentProfile = {
  uid?: unknown;
  name?: unknown;
  email?: unknown;
  role?: unknown;
  classIds?: unknown;
};

function convertTimestamp(value?: Timestamp): Date | null {
  return value?.toDate ? value.toDate() : null;
}

function normaliseClassName(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function normaliseString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normaliseEmail(value: unknown): string {
  return normaliseString(value).toLowerCase();
}

function normaliseStudent(student: ClassStudent): ClassStudent {
  return {
    studentId: student.studentId.trim(),
    displayName: student.displayName.trim() || "Unnamed Student",
    email: student.email.trim().toLowerCase(),
  };
}

function convertClassDocument(
  documentId: string,
  data: FirestoreTeacherClass,
): TeacherClass {
  return {
    id: documentId,
    name: data.name,
    subject: data.subject,
    yearGroup: data.yearGroup,
    academicYear: data.academicYear,
    teacherId: data.teacherId,
    teacherName: data.teacherName,
    studentIds: Array.isArray(data.studentIds) ? data.studentIds : [],
    students: Array.isArray(data.students) ? data.students : [],
    status: data.status ?? "active",
    createdAt: convertTimestamp(data.createdAt),
    updatedAt: convertTimestamp(data.updatedAt),
  };
}

/*
 * Loads the latest student name and email directly from
 * users/{studentId}.
 *
 * Embedded class data remains as a fallback for deleted or
 * unavailable user profiles.
 */
async function hydrateClassStudents(
  teacherClass: TeacherClass,
): Promise<TeacherClass> {
  const embeddedStudentsById = new Map(
    (teacherClass.students ?? []).map((student) => [
      student.studentId,
      student,
    ]),
  );

  const studentIds = Array.from(
    new Set(
      [
        ...teacherClass.studentIds,
        ...(teacherClass.students ?? []).map((student) => student.studentId),
      ]
        .map((studentId) => studentId.trim())
        .filter(Boolean),
    ),
  );

  if (studentIds.length === 0) {
    return {
      ...teacherClass,
      studentIds: [],
      students: [],
    };
  }

  const hydratedStudents = await Promise.all(
    studentIds.map(async (studentId): Promise<ClassStudent> => {
      const embeddedStudent = embeddedStudentsById.get(studentId);

      try {
        const studentSnapshot = await getDoc(doc(db, "users", studentId));

        if (!studentSnapshot.exists()) {
          return {
            studentId,
            displayName: embeddedStudent?.displayName || "Unnamed Student",
            email: embeddedStudent?.email || "",
          };
        }

        const studentData = studentSnapshot.data() as FirestoreStudentProfile;

        const profileName = normaliseString(studentData.name);

        const profileEmail = normaliseEmail(studentData.email);

        return {
          studentId,
          displayName:
            profileName || embeddedStudent?.displayName || "Unnamed Student",
          email: profileEmail || embeddedStudent?.email || "",
        };
      } catch (error) {
        console.warn(`Unable to hydrate student profile ${studentId}:`, error);

        return {
          studentId,
          displayName: embeddedStudent?.displayName || "Unnamed Student",
          email: embeddedStudent?.email || "",
        };
      }
    }),
  );

  return {
    ...teacherClass,
    studentIds,
    students: hydratedStudents,
  };
}

export async function createTeacherClass(
  input: CreateClassInput,
): Promise<string> {
  const className = normaliseClassName(input.name);

  if (!className) {
    throw new Error("Enter a valid class name.");
  }

  if (!input.teacherId.trim()) {
    throw new Error("A teacher account is required.");
  }

  const classReference = await addDoc(collection(db, "classes"), {
    name: className,
    subject: input.subject.trim() || "Computer Science",
    yearGroup: input.yearGroup.trim(),
    academicYear: input.academicYear.trim(),
    teacherId: input.teacherId.trim(),
    teacherName: input.teacherName?.trim() || "",
    studentIds: [],
    students: [],
    status: "active",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return classReference.id;
}

export async function getTeacherClasses(
  teacherId: string,
): Promise<TeacherClass[]> {
  const cleanedTeacherId = teacherId.trim();

  if (!cleanedTeacherId) {
    return [];
  }

  const classesQuery = query(
    collection(db, "classes"),
    where("teacherId", "==", cleanedTeacherId),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(classesQuery);

  return snapshot.docs.map((classDocument) =>
    convertClassDocument(
      classDocument.id,
      classDocument.data() as FirestoreTeacherClass,
    ),
  );
}

export async function getTeacherClassById(
  classId: string,
): Promise<TeacherClass | null> {
  const cleanedClassId = classId.trim();

  if (!cleanedClassId) {
    return null;
  }

  const classReference = doc(db, "classes", cleanedClassId);

  const snapshot = await getDoc(classReference);

  if (!snapshot.exists()) {
    return null;
  }

  const teacherClass = convertClassDocument(
    snapshot.id,
    snapshot.data() as FirestoreTeacherClass,
  );

  return hydrateClassStudents(teacherClass);
}

export async function updateTeacherClass(
  classId: string,
  updates: Partial<
    Pick<
      TeacherClass,
      "name" | "subject" | "yearGroup" | "academicYear" | "status"
    >
  >,
): Promise<void> {
  const cleanedClassId = classId.trim();

  if (!cleanedClassId) {
    throw new Error("A valid class is required.");
  }

  const cleanedUpdates: Record<string, string> = {};

  if (updates.name !== undefined) {
    const className = normaliseClassName(updates.name);

    if (!className) {
      throw new Error("Enter a valid class name.");
    }

    cleanedUpdates.name = className;
  }

  if (updates.subject !== undefined) {
    cleanedUpdates.subject = updates.subject.trim();
  }

  if (updates.yearGroup !== undefined) {
    cleanedUpdates.yearGroup = updates.yearGroup.trim();
  }

  if (updates.academicYear !== undefined) {
    cleanedUpdates.academicYear = updates.academicYear.trim();
  }

  if (updates.status !== undefined) {
    cleanedUpdates.status = updates.status;
  }

  await updateDoc(doc(db, "classes", cleanedClassId), {
    ...cleanedUpdates,
    updatedAt: serverTimestamp(),
  });
}

/*
 * Enrols a registered student.
 *
 * This transaction updates both:
 * - classes/{classId}
 * - users/{studentId}
 */
export async function addStudentToClass(
  classId: string,
  student: ClassStudent,
): Promise<void> {
  const cleanedClassId = classId.trim();
  const cleanedStudent = normaliseStudent(student);

  if (!cleanedClassId) {
    throw new Error("A valid class is required.");
  }

  if (!cleanedStudent.studentId) {
    throw new Error("A valid student account is required.");
  }

  const classReference = doc(db, "classes", cleanedClassId);

  const studentReference = doc(db, "users", cleanedStudent.studentId);

  await runTransaction(db, async (transaction) => {
    const [classSnapshot, studentSnapshot] = await Promise.all([
      transaction.get(classReference),
      transaction.get(studentReference),
    ]);

    if (!classSnapshot.exists()) {
      throw new Error("The selected class could not be found.");
    }

    if (!studentSnapshot.exists()) {
      throw new Error("The selected student account could not be found.");
    }

    const classData = classSnapshot.data() as FirestoreTeacherClass;

    const studentData = studentSnapshot.data() as FirestoreStudentProfile;

    if (studentData.role !== "student") {
      throw new Error("Only student accounts can be enrolled.");
    }

    const profileName = normaliseString(studentData.name);

    const profileEmail = normaliseEmail(studentData.email);

    const verifiedStudent: ClassStudent = {
      studentId: cleanedStudent.studentId,
      displayName:
        profileName || cleanedStudent.displayName || "Unnamed Student",
      email: profileEmail || cleanedStudent.email || "",
    };

    const existingStudentIds = Array.isArray(classData.studentIds)
      ? classData.studentIds
      : [];

    const existingStudents = Array.isArray(classData.students)
      ? classData.students
      : [];

    if (existingStudentIds.includes(verifiedStudent.studentId)) {
      throw new Error("This student is already enrolled in the class.");
    }

    const updatedStudents = [
      ...existingStudents.filter(
        (existingStudent) =>
          existingStudent.studentId !== verifiedStudent.studentId,
      ),
      verifiedStudent,
    ];

    const currentClassIds = Array.isArray(studentData.classIds)
      ? studentData.classIds.filter(
          (value): value is string => typeof value === "string",
        )
      : [];

    transaction.update(classReference, {
      studentIds: [...existingStudentIds, verifiedStudent.studentId],
      students: updatedStudents,
      updatedAt: serverTimestamp(),
    });

    transaction.update(studentReference, {
      classIds: Array.from(new Set([...currentClassIds, cleanedClassId])),
      updatedAt: serverTimestamp(),
    });
  });
}

export async function removeStudentFromClass(
  classId: string,
  student: ClassStudent,
): Promise<void> {
  const cleanedClassId = classId.trim();
  const cleanedStudent = normaliseStudent(student);

  if (!cleanedClassId || !cleanedStudent.studentId) {
    throw new Error("A valid class and student are required.");
  }

  const classReference = doc(db, "classes", cleanedClassId);

  const studentReference = doc(db, "users", cleanedStudent.studentId);

  await runTransaction(db, async (transaction) => {
    const [classSnapshot, studentSnapshot] = await Promise.all([
      transaction.get(classReference),
      transaction.get(studentReference),
    ]);

    if (!classSnapshot.exists()) {
      throw new Error("The selected class could not be found.");
    }

    const classData = classSnapshot.data() as FirestoreTeacherClass;

    const updatedStudentIds = (classData.studentIds ?? []).filter(
      (studentId) => studentId !== cleanedStudent.studentId,
    );

    const updatedStudents = (classData.students ?? []).filter(
      (classStudent) => classStudent.studentId !== cleanedStudent.studentId,
    );

    transaction.update(classReference, {
      studentIds: updatedStudentIds,
      students: updatedStudents,
      updatedAt: serverTimestamp(),
    });

    if (studentSnapshot.exists()) {
      const studentData = studentSnapshot.data() as FirestoreStudentProfile;

      const currentClassIds = Array.isArray(studentData.classIds)
        ? studentData.classIds.filter(
            (value): value is string => typeof value === "string",
          )
        : [];

      const updatedClassIds = currentClassIds.filter(
        (studentClassId) => studentClassId !== cleanedClassId,
      );

      transaction.update(studentReference, {
        classIds: updatedClassIds,
        updatedAt: serverTimestamp(),
      });
    }
  });
}

export async function archiveTeacherClass(classId: string): Promise<void> {
  await updateTeacherClass(classId, {
    status: "archived",
  });
}

export async function restoreTeacherClass(classId: string): Promise<void> {
  await updateTeacherClass(classId, {
    status: "active",
  });
}

export async function deleteTeacherClass(classId: string): Promise<void> {
  const cleanedClassId = classId.trim();

  if (!cleanedClassId) {
    throw new Error("A valid class is required.");
  }

  await deleteDoc(doc(db, "classes", cleanedClassId));
}
