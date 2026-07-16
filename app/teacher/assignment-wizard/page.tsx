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
  where,
} from "firebase/firestore";

import Card from "@/components/ui/Card";
import AssignmentResourceStep from "@/components/teacher/AssignmentResourceStep";
import AssignmentClassStep from "@/components/teacher/AssignmentClassStep";
import AssignmentDetailsStep from "@/components/teacher/AssignmentDetailsStep";
import AssignmentReviewStep from "@/components/teacher/AssignmentReviewStep";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { createAssignment } from "@/services/assignmentService";

import type {
  AssignmentWizardClass,
  AssignmentWizardData,
  AssignmentWizardResource,
  AssignmentWizardStep,
} from "@/types/assignmentWizard";

const initialWizardData: AssignmentWizardData = {
  resource: null,
  selectedClassIds: [],
  dueDate: "",
  instructions: "",
};

export default function AssignmentWizardPage() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();

  const quizId = searchParams.get("quizId");

  const [step, setStep] =
    useState<AssignmentWizardStep>("resource");

  const [wizardData, setWizardData] =
    useState<AssignmentWizardData>(initialWizardData);

  const [classes, setClasses] = useState<AssignmentWizardClass[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingResource, setLoadingResource] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setClasses([]);
      setLoadingClasses(false);
      return;
    }

    const teacherId = user.uid;

    const classesQuery = query(
      collection(db, "classes"),
      where("teacherId", "==", teacherId)
    );

    const unsubscribe = onSnapshot(
      classesQuery,
      (snapshot) => {
        const loadedClasses: AssignmentWizardClass[] =
          snapshot.docs.map((classDocument) => {
            const data = classDocument.data();

            return {
              id: classDocument.id,
              name: data.name || "Untitled Class",
              yearGroup: data.yearGroup || "Not specified",
            };
          });

        loadedClasses.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setClasses(loadedClasses);
        setLoadingClasses(false);
      },
      (error) => {
        console.error("Failed to load classes:", error);
        toast.error("Could not load your classes.");
        setClasses([]);
        setLoadingClasses(false);
      }
    );

    return unsubscribe;
  }, [authLoading, user]);

  useEffect(() => {
    if (!quizId || !user) {
      return;
    }

    let cancelled = false;

    async function loadSavedQuiz() {
      setLoadingResource(true);

      try {
        const quizSnapshot = await getDoc(
          doc(db, "generatedQuizzes", quizId as string)
        );

        if (cancelled) {
          return;
        }

        if (!quizSnapshot.exists()) {
          toast.error("The selected quiz could not be found.");
          return;
        }

        const data = quizSnapshot.data();

        if (data.teacherId && data.teacherId !== user?.uid) {
          toast.error("You cannot assign another teacher's quiz.");
          return;
        }

        const resource: AssignmentWizardResource = {
          id: quizSnapshot.id,
          title: data.title || "Untitled AI Quiz",
          description:
            data.description || "Complete the assigned AI quiz.",
          resourceType: "ai-quiz",
          resourceId: quizSnapshot.id,
        };

        setWizardData((current) => ({
          ...current,
          resource,
          instructions:
            current.instructions ||
            data.description ||
            "Complete the quiz and review your answers.",
        }));

        setStep("classes");
        toast.success("Quiz loaded into the assignment wizard.");
      } catch (error) {
        console.error("Failed to load saved quiz:", error);
        toast.error("Could not load the selected quiz.");
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

  function selectResource(resource: AssignmentWizardResource) {
    setWizardData((current) => ({
      ...current,
      resource,
      instructions:
        current.instructions || resource.description,
    }));
  }

  function toggleClass(classId: string) {
    setWizardData((current) => {
      const alreadySelected =
        current.selectedClassIds.includes(classId);

      return {
        ...current,
        selectedClassIds: alreadySelected
          ? current.selectedClassIds.filter(
              (selectedId) => selectedId !== classId
            )
          : [...current.selectedClassIds, classId],
      };
    });
  }

  function goToStep(nextStep: AssignmentWizardStep) {
    setStep(nextStep);
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

    if (wizardData.selectedClassIds.length === 0) {
      toast.error("Choose at least one class.");
      return;
    }

    if (!wizardData.dueDate || !wizardData.instructions.trim()) {
      toast.error("Add a due date and instructions.");
      return;
    }

    setSubmitting(true);

    try {
      const assignmentType =
        wizardData.resource.resourceType === "lesson"
          ? "lesson"
          : "quiz";

      await Promise.all(
        wizardData.selectedClassIds.map((selectedClassId) =>
          createAssignment({
            teacherId: user.uid,
            classId: selectedClassId,
            title: wizardData.resource!.title,
            description: wizardData.instructions.trim(),
            type: assignmentType,
            resourceId: wizardData.resource!.resourceId,
            dueDate: wizardData.dueDate,
          })
        )
      );

      toast.success(
        `Assignment created for ${wizardData.selectedClassIds.length} ${
          wizardData.selectedClassIds.length === 1
            ? "class"
            : "classes"
        }.`
      );

      setWizardData(initialWizardData);
      setStep("resource");
    } catch (error) {
      console.error("Assignment wizard error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Could not create the assignments."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || loadingResource) {
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
              Choose a resource, select classes, add a deadline and create
              assignments in one guided workflow.
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

      <WizardProgress currentStep={step} />

      {step === "resource" && (
        <AssignmentResourceStep
          selectedResource={wizardData.resource}
          onSelect={selectResource}
          onNext={() => goToStep("classes")}
        />
      )}

      {step === "classes" && (
        <AssignmentClassStep
          classes={classes}
          selectedClassIds={wizardData.selectedClassIds}
          loading={loadingClasses}
          onToggleClass={toggleClass}
          onBack={() => goToStep("resource")}
          onNext={() => goToStep("details")}
        />
      )}

      {step === "details" && (
        <AssignmentDetailsStep
          dueDate={wizardData.dueDate}
          instructions={wizardData.instructions}
          onDueDateChange={(value) =>
            setWizardData((current) => ({
              ...current,
              dueDate: value,
            }))
          }
          onInstructionsChange={(value) =>
            setWizardData((current) => ({
              ...current,
              instructions: value,
            }))
          }
          onBack={() => goToStep("classes")}
          onNext={() => goToStep("review")}
        />
      )}

      {step === "review" && (
        <AssignmentReviewStep
          data={wizardData}
          classes={classes}
          submitting={submitting}
          onBack={() => goToStep("details")}
          onSubmit={submitAssignments}
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
    { id: "resource", label: "Resource" },
    { id: "classes", label: "Classes" },
    { id: "details", label: "Details" },
    { id: "review", label: "Review" },
  ];

  const currentIndex = steps.findIndex(
    (item) => item.id === currentStep
  );

  return (
    <Card>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {steps.map((item, index) => {
          const complete = index < currentIndex;
          const active = item.id === currentStep;

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
                {complete ? "✓" : index + 1}
              </p>

              <p className="mt-1 font-semibold">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}