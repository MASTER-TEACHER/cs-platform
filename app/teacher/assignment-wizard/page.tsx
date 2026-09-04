"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import AssignmentClassStep from "@/components/teacher/AssignmentClassStep";
import AssignmentDetailsStep from "@/components/teacher/AssignmentDetailsStep";
import AssignmentResourceStep from "@/components/teacher/AssignmentResourceStep";
import AssignmentReviewStep from "@/components/teacher/AssignmentReviewStep";
import Card from "@/components/ui/Card";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { createAssignment } from "@/services/assignmentService";
import { createProgrammingAssignment } from "@/services/programmingAssignmentService";
import { createExamAssignment } from "@/services/examAssignmentService";
import { getExamQuestionSetById } from "@/services/examQuestionService";
import { getTeacherResources } from "@/services/teacherResourceService";
import { createResourceAssignment } from "@/services/resourceAssignmentService";

import type {
  AssignmentWizardClass,
  AssignmentWizardData,
  AssignmentWizardResource,
  AssignmentWizardStep,
} from "@/types/assignmentWizard";

const initialWizardData: AssignmentWizardData = {
  resource: null,
  recipientMode: "classes",
  selectedClassIds: [],
  selectedStudentIds: [],
  dueDate: "",
  instructions: "",
  deliveryMode: "practice",
};

export default function AssignmentWizardPage() {
  const { user, loading: authLoading } =
    useAuth();
  const searchParams = useSearchParams();
  const quizId = searchParams.get("quizId");
  const contentType = searchParams.get("contentType");
  const contentId = searchParams.get("contentId");

  const assignmentSource = searchParams.get("source");
  const interventionStudentId = searchParams.get("studentId");
  const interventionTopic = searchParams.get("topic");
  const interventionId = searchParams.get("interventionId");

  const isInterventionReassessment =
    assignmentSource === "intervention-review" &&
    Boolean(interventionStudentId) &&
    Boolean(interventionId);

  const [step, setStep] =
    useState<AssignmentWizardStep>(
      "resource",
    );
  const [wizardData, setWizardData] =
    useState<AssignmentWizardData>(
      initialWizardData,
    );
  const [classes, setClasses] =
    useState<
      AssignmentWizardClass[]
    >([]);
  const [loadingClasses, setLoadingClasses] =
    useState(true);
  const [loadingResource, setLoadingResource] =
    useState(false);
  const [submitting, setSubmitting] =
    useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      void Promise.resolve().then(() => {
        setClasses([]);
        setLoadingClasses(false);
      });

      return;
    }

    const classesQuery = query(
      collection(db, "classes"),
      where(
        "teacherId",
        "==",
        user.uid,
      ),
    );

    const unsubscribe = onSnapshot(
      classesQuery,
      async (snapshot) => {
        const loadedClasses: AssignmentWizardClass[] =
          await Promise.all(
            snapshot.docs.map(async (classDocument) => {
              const data = classDocument.data();
              const studentIds = Array.isArray(data.studentIds)
                ? Array.from(
                    new Set(
                      data.studentIds
                        .filter(
                          (value: unknown): value is string =>
                            typeof value === "string" && Boolean(value.trim()),
                        )
                        .map((value: string) => value.trim()),
                    ),
                  )
                : [];

              const embeddedStudents = Array.isArray(data.students)
                ? data.students
                : [];

              const embeddedStudentsById = new Map<string, Record<string, unknown>>(
                embeddedStudents
                  .filter(
                    (value: unknown): value is Record<string, unknown> =>
                      Boolean(value) && typeof value === "object",
                  )
                  .map(
                    (student): [string, Record<string, unknown>] => {
                      const rawId =
                        student.studentId ?? student.id ?? student.uid ?? "";

                      return [String(rawId).trim(), student];
                    },
                  )
                  .filter(([studentId]) => Boolean(studentId)),
              );

              const students = studentIds.map((studentId) => {
                const studentData = embeddedStudentsById.get(studentId) ?? {};

                return {
                  id: studentId,
                  name: String(
                    studentData.displayName ??
                      studentData.name ??
                      studentData.fullName ??
                      studentData.email ??
                      "Student",
                  ),
                  email: String(studentData.email ?? ""),
                };
              });

              students.sort((a, b) => a.name.localeCompare(b.name));

              return {
                id: classDocument.id,
                name: data.name || "Untitled Class",
                yearGroup: data.yearGroup || "Not specified",
                studentIds,
                students,
              };
            }),
          );

        loadedClasses.sort((a, b) => a.name.localeCompare(b.name));

        if (
          isInterventionReassessment &&
          interventionStudentId
        ) {
          const matchingClassIds = loadedClasses
            .filter((classItem) =>
              classItem.studentIds.includes(interventionStudentId),
            )
            .map((classItem) => classItem.id);

          setWizardData((current) => ({
            ...current,
            selectedClassIds:
              current.selectedClassIds.length > 0
                ? current.selectedClassIds
                : matchingClassIds,
            instructions:
              current.instructions ||
              (interventionTopic
                ? `Complete a focused reassessment on ${interventionTopic}. Use the result to review the current intervention.`
                : "Complete this focused reassessment. Use the result to review the current intervention."),
          }));
        }

        setClasses(loadedClasses);
        setLoadingClasses(false);
      },
      (error) => {
        console.error(
          "Failed to load classes:",
          error,
        );
        toast.error(
          "Could not load your classes.",
        );
        setClasses([]);
        setLoadingClasses(false);
      },
    );

    return unsubscribe;
  }, [
    authLoading,
    user,
    isInterventionReassessment,
    interventionStudentId,
    interventionTopic,
  ]);

  useEffect(() => {
    if (!quizId || !user) return;

    let cancelled = false;

    async function loadSavedQuiz() {
      await Promise.resolve();

      if (cancelled) return;

      setLoadingResource(true);

      try {
        const quizSnapshot =
          await getDoc(
            doc(
              db,
              "generatedQuizzes",
              quizId as string,
            ),
          );

        if (cancelled) return;

        if (!quizSnapshot.exists()) {
          toast.error(
            "The selected quiz could not be found.",
          );
          return;
        }

        const data =
          quizSnapshot.data();

        if (
          data.teacherId &&
          data.teacherId !== user?.uid
        ) {
          toast.error(
            "You cannot assign another teacher's quiz.",
          );
          return;
        }

        const questionCount =
          typeof data.questionCount === "number"
            ? data.questionCount
            : Array.isArray(data.questions)
              ? data.questions.length
              : 0;

        const resource: AssignmentWizardResource = {
          id: quizSnapshot.id,
          title:
            data.title ||
            "Untitled AI Quiz",
          description:
            data.description ||
            "Complete the assigned AI quiz.",
          resourceType:
            "ai-quiz",
          resourceId:
            quizSnapshot.id,
          questionCount,
          examBoard:
            typeof data.examBoard === "string"
              ? data.examBoard
              : undefined,
          qualification:
            data.qualification === "A_LEVEL"
              ? "A_LEVEL"
              : data.qualification === "GCSE"
                ? "GCSE"
                : undefined,
          estimatedTime:
            typeof data.estimatedTime === "string"
              ? data.estimatedTime
              : undefined,
        };

        setWizardData(
          (current) => ({
            ...current,
            resource,
            instructions:
              current.instructions ||
              data.description ||
              "Complete the quiz and review your answers.",
          }),
        );

        setStep("classes");

        toast.success(
          "Quiz loaded into the assignment wizard.",
        );
      } catch (error) {
        console.error(
          "Failed to load saved quiz:",
          error,
        );

        toast.error(
          "Could not load the selected quiz.",
        );
      } finally {
        if (!cancelled) {
          setLoadingResource(false);
        }
      }
    }

    void loadSavedQuiz();

    return () => {
      cancelled = true;
    };
  }, [quizId, user]);

  useEffect(() => {
    if (!contentType || !contentId || !user) return;

    /*
     * Capture the guarded values as stable non-null strings before
     * entering the nested async function.
     *
     * TypeScript does not preserve the narrowing of search-param values
     * inside an async closure unless we store them after the guard.
     */
    const selectedContentType = contentType;
    const selectedContentId = contentId;
    const teacherId = user.uid;

    let cancelled = false;

    async function loadContent() {
      await Promise.resolve();

      if (cancelled) return;

      setLoadingResource(true);
      try {
        if (selectedContentType === "teaching-resource") {
          const resources = await getTeacherResources(teacherId);
          if (cancelled) return;
          const saved = resources.find(
            (item) => item.id === selectedContentId,
          );
          if (!saved) {
            toast.error("The selected teaching resource could not be found.");
            return;
          }
          if (saved.status !== "published") {
            toast.error("Publish this teaching resource before assigning it.");
            return;
          }

          const resource: AssignmentWizardResource = {
            id: saved.id,
            title: saved.title,
            description: saved.content.overview || `Complete ${saved.title}.`,
            resourceType: "teaching-resource",
            resourceId: saved.id,
            topicTitle: saved.topic,
            examBoard: saved.examBoard,
            qualification:
              saved.yearGroup === "A Level" ||
              saved.yearGroup === "Year 12" ||
              saved.yearGroup === "Year 13"
                ? "A_LEVEL"
                : "GCSE",
          };

          setWizardData((current) => ({
            ...current,
            resource,
            instructions: current.instructions || resource.description,
          }));
          setStep("classes");
          toast.success("Teaching resource loaded into the assignment wizard.");
          return;
        }

        if (selectedContentType === "exam-paper") {
          const questionSet = await getExamQuestionSetById(selectedContentId);
          if (cancelled) return;
          if (!questionSet || questionSet.teacherId !== teacherId) {
            toast.error("The selected exam paper could not be found.");
            return;
          }
          if (questionSet.status !== "published") {
            toast.error("Publish this question set before assigning it.");
            return;
          }

          const resource: AssignmentWizardResource = {
            id: questionSet.id,
            title: questionSet.title,
            description: `${questionSet.questionCount} questions · ${questionSet.totalMarks} marks`,
            resourceType: "exam-paper",
            resourceId: questionSet.id,
            examTopic: questionSet.topic,
            examBoard: questionSet.examBoard,
            examQualification: questionSet.qualification,
            qualification: questionSet.qualification === "A_LEVEL" ? "A_LEVEL" : "GCSE",
            questionCount: questionSet.questionCount,
            totalMarks: questionSet.totalMarks,
          };

          setWizardData((current) => ({
            ...current,
            resource,
            instructions:
              current.instructions ||
              "Complete the written assessment under the conditions set by your teacher.",
          }));
          setStep("classes");
          toast.success("Exam paper loaded into the assignment wizard.");
        }
      } catch (error) {
        console.error("Failed to load content into assignment wizard:", error);
        toast.error(error instanceof Error ? error.message : "The selected content could not be loaded.");
      } finally {
        if (!cancelled) setLoadingResource(false);
      }
    }

    void loadContent();
    return () => { cancelled = true; };
  }, [contentType, contentId, user]);

  function selectResource(
    resource: AssignmentWizardResource,
  ) {
    const quizResource =
      resource.resourceType === "quiz" ||
      resource.resourceType === "ai-quiz";

    setWizardData((current) => ({
      ...current,
      resource,
      instructions:
        current.instructions ||
        resource.description,
      deliveryMode: quizResource
        ? current.deliveryMode
        : "practice",
    }));
  }

  function changeRecipientMode(mode: "classes" | "students") {
    setWizardData((current) => ({
      ...current,
      recipientMode: mode,
      selectedClassIds: mode === "classes" ? current.selectedClassIds : [],
      selectedStudentIds: mode === "students" ? current.selectedStudentIds : [],
    }));
  }

  function toggleStudent(studentId: string) {
    setWizardData((current) => {
      const alreadySelected = current.selectedStudentIds.includes(studentId);

      return {
        ...current,
        selectedStudentIds: alreadySelected
          ? current.selectedStudentIds.filter((id) => id !== studentId)
          : [...current.selectedStudentIds, studentId],
      };
    });
  }

  function toggleClass(
    classId: string,
  ) {
    setWizardData((current) => {
      const alreadySelected =
        current.selectedClassIds.includes(
          classId,
        );

      return {
        ...current,
        selectedClassIds:
          alreadySelected
            ? current.selectedClassIds.filter(
                (selectedId) =>
                  selectedId !== classId,
              )
            : [
                ...current.selectedClassIds,
                classId,
              ],
      };
    });
  }

  async function submitAssignments() {
    if (!user) {
      toast.error("You must be logged in as a teacher.");
      return;
    }

    if (!wizardData.resource) {
      toast.error("Choose a resource first.");
      return;
    }

    const hasRecipients =
      wizardData.recipientMode === "classes"
        ? wizardData.selectedClassIds.length > 0
        : wizardData.selectedStudentIds.length > 0;

    if (!hasRecipients) {
      toast.error(
        wizardData.recipientMode === "classes"
          ? "Choose at least one class."
          : "Choose at least one student.",
      );
      return;
    }

    if (!wizardData.dueDate || !wizardData.instructions.trim()) {
      toast.error("Add a due date and instructions.");
      return;
    }

    setSubmitting(true);

    try {
      const targetClassIds =
        wizardData.recipientMode === "classes"
          ? wizardData.selectedClassIds
          : classes
              .filter((classItem) =>
                classItem.studentIds.some((studentId) =>
                  wizardData.selectedStudentIds.includes(studentId),
                ),
              )
              .map((classItem) => classItem.id);

      const selectedClassSnapshots = await Promise.all(
        targetClassIds.map((classId) => getDoc(doc(db, "classes", classId))),
      );

      const claimedStudentIds = new Set<string>();

      const recipientGroups = selectedClassSnapshots
        .map((classSnapshot, index) => {
          const classId = targetClassIds[index];

          if (!classSnapshot.exists()) {
            throw new Error(
              "A selected class could not be found. Refresh the page and choose the recipients again.",
            );
          }

          const classData = classSnapshot.data();

          if (
            typeof classData.teacherId === "string" &&
            classData.teacherId &&
            classData.teacherId !== user.uid
          ) {
            throw new Error(
              "You cannot assign work to another teacher's class.",
            );
          }

          const enrolledStudentIds = Array.isArray(classData.studentIds)
            ? Array.from(
                new Set(
                  classData.studentIds
                    .filter(
                      (value: unknown): value is string =>
                        typeof value === "string" && Boolean(value.trim()),
                    )
                    .map((value: string) => value.trim()),
                ),
              )
            : [];

          if (enrolledStudentIds.length === 0) {
            throw new Error(
              `${String(classData.name ?? "A selected class")} has no enrolled students.`,
            );
          }

          const studentIds =
            wizardData.recipientMode === "classes"
              ? enrolledStudentIds
              : enrolledStudentIds.filter((studentId) => {
                  if (!wizardData.selectedStudentIds.includes(studentId)) {
                    return false;
                  }

                  if (claimedStudentIds.has(studentId)) {
                    return false;
                  }

                  claimedStudentIds.add(studentId);
                  return true;
                });

          return {
            classId,
            className: String(classData.name ?? "Untitled Class"),
            studentIds,
          };
        })
        .filter((group) => group.studentIds.length > 0);

      if (recipientGroups.length === 0) {
        throw new Error(
          "None of the selected recipients are currently enrolled in an available class.",
        );
      }

      const resource = wizardData.resource;
      const dueDate = new Date(`${wizardData.dueDate}T23:59:59`);

      if (resource.resourceType === "programming-challenge") {
        await Promise.all(
          recipientGroups.map((group) =>
            createProgrammingAssignment({
              teacherId: user.uid,
              classId: group.classId,
              challengeId: resource.resourceId,
              dueDate: wizardData.dueDate,
              instructions: wizardData.instructions.trim(),
              studentIds: group.studentIds,
            }),
          ),
        );
      } else if (resource.resourceType === "teaching-resource") {
        await Promise.all(
          recipientGroups.map((group) =>
            createResourceAssignment({
              resourceId: resource.resourceId,
              resourceTitle: resource.title,
              resourceTopic: resource.topicTitle || "Teaching resource",
              resourceType: "teacher-resource",
              teacherId: user.uid,
              teacherName: user.displayName || "Teacher",
              classId: group.classId,
              className: group.className,
              instructions: wizardData.instructions.trim(),
              dueDate,
              studentIds: group.studentIds,
            }),
          ),
        );
      } else if (resource.resourceType === "lesson") {
        await Promise.all(
          recipientGroups.map((group) =>
            createResourceAssignment({
              resourceId: resource.resourceId,
              resourceTitle: resource.title,
              resourceTopic: resource.topicTitle || "Interactive lesson",
              resourceType: "lesson",
              teacherId: user.uid,
              teacherName: user.displayName || "Teacher",
              classId: group.classId,
              className: group.className,
              instructions: wizardData.instructions.trim(),
              dueDate,
              studentIds: group.studentIds,
            }),
          ),
        );
      } else if (resource.resourceType === "exam-paper") {
        const questionSet = await getExamQuestionSetById(resource.resourceId);

        if (!questionSet) {
          throw new Error(
            "The selected exam paper could not be found in the Question Bank.",
          );
        }

        await Promise.all(
          recipientGroups.map((group) =>
            createExamAssignment({
              teacherId: user.uid,
              teacherName: user.displayName || "Teacher",
              classId: group.classId,
              className: group.className,
              studentIds: group.studentIds,
              questionSetId: questionSet.id,
              questionSetTitle: questionSet.title,
              questionSetSnapshot: questionSet.content,
              title: resource.title,
              instructions: wizardData.instructions.trim(),
              dueDate,
            }),
          ),
        );
      } else if (
        resource.resourceType === "quiz" ||
        resource.resourceType === "ai-quiz"
      ) {
        const isAIQuiz = resource.resourceType === "ai-quiz";

        await Promise.all(
          recipientGroups.map((group) =>
            createAssignment({
              teacherId: user.uid,
              classId: group.classId,
              title: resource.title,
              description: wizardData.instructions.trim(),
              type: "quiz",
              resourceId: resource.resourceId,
              dueDate: wizardData.dueDate,
              quizSource: isAIQuiz ? "ai-generated" : "built-in",
              deliveryMode: wizardData.deliveryMode,
              qualification: resource.qualification,
              examBoard: resource.examBoard,
              studentIds: group.studentIds,
            }),
          ),
        );
      } else {
        throw new Error("This assignment type is not yet supported.");
      }

      if (isInterventionReassessment && interventionId) {
        await updateDoc(doc(db, "interventions", interventionId), {
          reassessmentAssignedAt: serverTimestamp(),
          reassessmentAssignedBy: user.uid,
          reassessmentTopic: interventionTopic || "",
          reassessmentResourceType: resource.resourceType,
          reassessmentResourceId: resource.resourceId,
          reassessmentDueDate: wizardData.dueDate,
          reassessmentClassIds: recipientGroups.map((group) => group.classId),
          updatedAt: serverTimestamp(),
        });
      }

      const studentRecipientCount = recipientGroups.reduce(
        (sum, group) => sum + group.studentIds.length,
        0,
      );

      toast.success(
        wizardData.recipientMode === "students"
          ? `Assignment created for ${studentRecipientCount} ${
              studentRecipientCount === 1 ? "student" : "students"
            }.`
          : `Assignment created for ${recipientGroups.length} ${
              recipientGroups.length === 1 ? "class" : "classes"
            } (${studentRecipientCount} students).`,
      );

      setWizardData(initialWizardData);
      setStep("resource");
    } catch (error) {
      console.error("Assignment wizard error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not create the assignments.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (
    authLoading ||
    loadingResource
  ) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

          <p className="mt-4 font-semibold text-slate-600">
            Preparing assignment wizard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 text-white">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-100">
              Teacher Portal
            </p>

            <h1 className="mt-3 text-4xl font-extrabold">
              Assignment Wizard
            </h1>

            <p className="mt-3 max-w-2xl text-emerald-100">
              Choose a resource or programming challenge, choose whole classes or individual students,
              add a deadline and create assignments in one guided workflow.
            </p>
          </div>

          <Link
            href="/teacher/assignments"
            className="rounded-xl bg-white px-5 py-3 text-center font-bold text-teal-700 transition hover:bg-emerald-50"
          >
            ← Assignments
          </Link>
        </div>
      </Card>

      {isInterventionReassessment && (
        <Card className="border border-indigo-200 bg-indigo-50">
          <p className="text-xs font-black uppercase tracking-wide text-indigo-700">
            Intervention reassessment
          </p>

          <h2 className="mt-2 text-xl font-black text-indigo-950">
            Focused follow-up assessment
          </h2>

          <p className="mt-2 text-sm leading-6 text-indigo-800">
            {interventionTopic
              ? `Choose an appropriate task for ${interventionTopic}. The class containing the intervention student has been preselected where possible. You can switch to Individual student(s) in Step 2 when targeted follow-up is required.`
              : "Choose an appropriate reassessment task. The class containing the intervention student has been preselected where possible. You can switch to Individual student(s) in Step 2 when targeted follow-up is required."}
          </p>

          <p className="mt-2 text-xs font-semibold text-indigo-700">
            Choose the intended recipients in Step 2, then return to the intervention impact review after new evidence is available.
          </p>
        </Card>
      )}

      <WizardProgress
        currentStep={step}
      />

      {step === "resource" && (
        <AssignmentResourceStep
          selectedResource={
            wizardData.resource
          }
          onSelect={selectResource}
          onNext={() =>
            setStep("classes")
          }
        />
      )}

      {step === "classes" && (
        <AssignmentClassStep
          classes={classes}
          recipientMode={wizardData.recipientMode}
          selectedClassIds={wizardData.selectedClassIds}
          selectedStudentIds={wizardData.selectedStudentIds}
          loading={loadingClasses}
          onRecipientModeChange={changeRecipientMode}
          onToggleClass={toggleClass}
          onToggleStudent={toggleStudent}
          onBack={() => setStep("resource")}
          onNext={() => setStep("details")}
        />
      )}

      {step === "details" && (
        <div className="space-y-6">
          {(wizardData.resource?.resourceType === "quiz" ||
            wizardData.resource?.resourceType === "ai-quiz") && (
            <Card>
              <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                Quiz delivery mode
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                How should students take this quiz?
              </h2>

              <p className="mt-2 text-slate-600">
                Practice keeps the normal quiz experience. Assessment marks the
                assignment for monitored Exam Mode delivery.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    setWizardData((current) => ({
                      ...current,
                      deliveryMode: "practice",
                    }))
                  }
                  className={`rounded-2xl border-2 p-5 text-left transition ${
                    wizardData.deliveryMode === "practice"
                      ? "border-teal-500 bg-teal-50"
                      : "border-slate-200 bg-white hover:border-teal-300"
                  }`}
                >
                  <p className="font-black text-slate-950">
                    Practice quiz
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Standard quiz player with feedback, XP and normal navigation.
                  </p>

                  <p className="mt-3 text-xs font-bold uppercase tracking-wide text-teal-700">
                    Default
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setWizardData((current) => ({
                      ...current,
                      deliveryMode: "assessment",
                    }))
                  }
                  className={`rounded-2xl border-2 p-5 text-left transition ${
                    wizardData.deliveryMode === "assessment"
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-slate-200 bg-white hover:border-indigo-300"
                  }`}
                >
                  <p className="font-black text-slate-950">
                    Assessment / test
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Intended for monitored Exam Mode delivery with integrity
                    monitoring and restricted navigation.
                  </p>

                  <p className="mt-3 text-xs font-bold uppercase tracking-wide text-indigo-700">
                    Monitored
                  </p>
                </button>
              </div>

              {wizardData.deliveryMode === "assessment" && (
                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                  This assignment is stored as an assessment quiz for monitored
                  Exam Mode delivery. Practice quizzes remain unchanged.
                </div>
              )}
            </Card>
          )}

          <AssignmentDetailsStep
            dueDate={wizardData.dueDate}
            instructions={
              wizardData.instructions
            }
            onDueDateChange={(value) =>
              setWizardData(
                (current) => ({
                  ...current,
                  dueDate: value,
                }),
              )
            }
            onInstructionsChange={(value) =>
              setWizardData(
                (current) => ({
                  ...current,
                  instructions: value,
                }),
              )
            }
            onBack={() =>
              setStep("classes")
            }
            onNext={() =>
              setStep("review")
            }
          />
        </div>
      )}

      {step === "review" && (
        <AssignmentReviewStep
          data={wizardData}
          classes={classes}
          submitting={submitting}
          onBack={() =>
            setStep("details")
          }
          onSubmit={
            submitAssignments
          }
        />
      )}
    </div>
  );
}

function WizardProgress({
  currentStep,
}: {
  currentStep: AssignmentWizardStep;
}) {
  const steps: Array<{
    id: AssignmentWizardStep;
    label: string;
  }> = [
    {
      id: "resource",
      label: "Resource",
    },
    {
      id: "classes",
      label: "Recipients",
    },
    {
      id: "details",
      label: "Details",
    },
    {
      id: "review",
      label: "Review",
    },
  ];

  const currentIndex =
    steps.findIndex(
      (item) =>
        item.id === currentStep,
    );

  return (
    <Card>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {steps.map(
          (item, index) => {
            const complete =
              index < currentIndex;
            const active =
              item.id ===
              currentStep;

            return (
              <div
                key={item.id}
                className={`rounded-xl border p-4 text-center ${
                  active
                    ? "border-teal-500 bg-teal-50 text-teal-700"
                    : complete
                      ? "border-green-300 bg-green-50 text-green-700"
                      : "border-slate-200 bg-slate-50 text-slate-500"
                }`}
              >
                <p className="text-sm font-bold">
                  {complete
                    ? "✓"
                    : index + 1}
                </p>

                <p className="mt-1 font-semibold">
                  {item.label}
                </p>
              </div>
            );
          },
        )}
      </div>
    </Card>
  );
}
