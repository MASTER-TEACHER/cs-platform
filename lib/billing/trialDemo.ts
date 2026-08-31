import "server-only";

import {
  FieldValue,
} from "firebase-admin/firestore";

import {
  adminDb,
} from "@/lib/firebaseAdmin";

type DemoStudent = {
  studentId: string;
  displayName: string;
  email: string;

  currentMastery: number;
  predictedGrade: string;

  weakTopic: string;
  strengthTopic: string;

  assignmentStatus:
    | "complete"
    | "overdue"
    | "in_progress";

  interventionRequired: boolean;
};

const DEMO_STUDENTS: DemoStudent[] = [
  {
    studentId:
      "demo-ava-thompson",

    displayName:
      "Ava Thompson",

    email:
      "ava.demo@csmaster.example",

    currentMastery:
      82,

    predictedGrade:
      "8",

    weakTopic:
      "Networks",

    strengthTopic:
      "Programming",

    assignmentStatus:
      "complete",

    interventionRequired:
      false,
  },

  {
    studentId:
      "demo-marcus-green",

    displayName:
      "Marcus Green",

    email:
      "marcus.demo@csmaster.example",

    currentMastery:
      54,

    predictedGrade:
      "5",

    weakTopic:
      "Boolean Logic",

    strengthTopic:
      "Data Representation",

    assignmentStatus:
      "in_progress",

    interventionRequired:
      true,
  },

  {
    studentId:
      "demo-sophie-patel",

    displayName:
      "Sophie Patel",

    email:
      "sophie.demo@csmaster.example",

    currentMastery:
      76,

    predictedGrade:
      "7",

    weakTopic:
      "Algorithms",

    strengthTopic:
      "Cyber Security",

    assignmentStatus:
      "complete",

    interventionRequired:
      false,
  },

  {
    studentId:
      "demo-daniel-williams",

    displayName:
      "Daniel Williams",

    email:
      "daniel.demo@csmaster.example",

    currentMastery:
      41,

    predictedGrade:
      "4",

    weakTopic:
      "Programming",

    strengthTopic:
      "Computer Systems",

    assignmentStatus:
      "overdue",

    interventionRequired:
      true,
  },

  {
    studentId:
      "demo-isla-brown",

    displayName:
      "Isla Brown",

    email:
      "isla.demo@csmaster.example",

    currentMastery:
      91,

    predictedGrade:
      "9",

    weakTopic:
      "Databases",

    strengthTopic:
      "Algorithms",

    assignmentStatus:
      "complete",

    interventionRequired:
      false,
  },

  {
    studentId:
      "demo-jayden-clarke",

    displayName:
      "Jayden Clarke",

    email:
      "jayden.demo@csmaster.example",

    currentMastery:
      63,

    predictedGrade:
      "6",

    weakTopic:
      "Data Representation",

    strengthTopic:
      "Networks",

    assignmentStatus:
      "in_progress",

    interventionRequired:
      true,
  },
];

function createDemoClassId(
  teacherId: string,
): string {
  return `demo_${teacherId}`;
}

export async function createTrialDemoClass(
  teacherId: string,
): Promise<string> {
  const cleanedTeacherId =
    teacherId.trim();

  if (!cleanedTeacherId) {
    throw new Error(
      "A teacher account is required to create demo data.",
    );
  }

  const teacherRef =
    adminDb
      .collection("users")
      .doc(cleanedTeacherId);

  const trialRef =
    adminDb
      .collection("schoolTrials")
      .doc(cleanedTeacherId);

  const teacherSnapshot =
    await teacherRef.get();

  if (!teacherSnapshot.exists) {
    throw new Error(
      "Teacher profile not found.",
    );
  }

  const teacher =
    teacherSnapshot.data() ?? {};

  const teacherName =
    typeof teacher.name ===
      "string" &&
    teacher.name.trim()
      ? teacher.name.trim()
      : "Teacher";

  const trialSnapshot =
    await trialRef.get();

  if (!trialSnapshot.exists) {
    throw new Error(
      "An active School Trial is required before demo data can be created.",
    );
  }

  const trial =
    trialSnapshot.data() ?? {};

  if (
    trial.status !==
    "active"
  ) {
    throw new Error(
      "Demo data can only be created for an active School Trial.",
    );
  }

  /*
   * Trial teachers may not yet belong to a real school.
   *
   * Their demo workspace therefore gets a synthetic tenant ID.
   * This is server-generated and exists only for demonstration
   * content.
   */
  const existingSchoolId =
    typeof teacher.schoolId ===
      "string"
      ? teacher.schoolId.trim()
      : "";

  const demoSchoolId =
    existingSchoolId ||
    `trial-${cleanedTeacherId}`;

  const demoClassId =
    createDemoClassId(
      cleanedTeacherId,
    );

  const demoClassRef =
    adminDb
      .collection("classes")
      .doc(demoClassId);

  const now =
    new Date();

  const currentYear =
    now.getFullYear();

  const nextYear =
    currentYear + 1;

  const academicYear =
    `${currentYear}/${String(
      nextYear,
    ).slice(-2)}`;

  const embeddedStudents =
    DEMO_STUDENTS.map(
      (student) => ({
        studentId:
          student.studentId,

        displayName:
          student.displayName,

        email:
          student.email,
      }),
    );

  const demoStudentIds =
    DEMO_STUDENTS.map(
      (student) =>
        student.studentId,
    );

  /*
   * The deterministic document ID makes this operation
   * idempotent.
   *
   * Calling it again updates the same demo class rather than
   * generating duplicates.
   */
  await demoClassRef.set(
    {
      name:
        "CS Master Demo Class",

      subject:
        "Computer Science",

      yearGroup:
        "Year 11",

      academicYear,

      qualification:
        "GCSE",

      examBoard:
        "AQA",

      teacherId:
        cleanedTeacherId,

      teacherName,

      schoolId:
        demoSchoolId,

      studentIds:
        demoStudentIds,

      students:
        embeddedStudents,

      assignmentIds:
        [],

      status:
        "active",

      isDemo:
        true,

      demoSource:
        "school_trial",

      demoOwnerId:
        cleanedTeacherId,

      updatedAt:
        FieldValue.serverTimestamp(),

      createdAt:
        FieldValue.serverTimestamp(),
    },
    {
      merge: true,
    },
  );

  /*
   * Store synthetic performance separately.
   *
   * These are NOT real users and therefore must never be
   * written into users/{uid}.
   */
  const batch =
    adminDb.batch();

  for (
    const student of
    DEMO_STUDENTS
  ) {
    const analyticsRef =
      adminDb
        .collection(
          "demoStudentAnalytics",
        )
        .doc(
          `${cleanedTeacherId}_${student.studentId}`,
        );

    batch.set(
      analyticsRef,
      {
        teacherId:
          cleanedTeacherId,

        classId:
          demoClassId,

        schoolId:
          demoSchoolId,

        studentId:
          student.studentId,

        studentName:
          student.displayName,

        email:
          student.email,

        currentMastery:
          student.currentMastery,

        predictedGrade:
          student.predictedGrade,

        weakTopic:
          student.weakTopic,

        strengthTopic:
          student.strengthTopic,

        assignmentStatus:
          student.assignmentStatus,

        interventionRequired:
          student.interventionRequired,

        isDemo:
          true,

        updatedAt:
          FieldValue.serverTimestamp(),
      },
      {
        merge: true,
      },
    );
  }

  batch.set(
    trialRef,
    {
      schoolId:
        demoSchoolId,

      demoClassId,

      demoDataStatus:
        "ready",

      demoDataCreatedAt:
        FieldValue.serverTimestamp(),

      updatedAt:
        FieldValue.serverTimestamp(),
    },
    {
      merge: true,
    },
  );

  await batch.commit();

  return demoClassId;
}