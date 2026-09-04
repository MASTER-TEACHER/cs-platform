"use client";

import Card from "@/components/ui/Card";
import type {
  AssignmentWizardClass,
  AssignmentWizardData,
} from "@/types/assignmentWizard";

type AssignmentReviewStepProps = {
  data: AssignmentWizardData;
  classes: AssignmentWizardClass[];
  submitting: boolean;
  onBack: () => void;
  onSubmit: () => void;
};

function formatResourceType(value: string): string {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default function AssignmentReviewStep({
  data,
  classes,
  submitting,
  onBack,
  onSubmit,
}: AssignmentReviewStepProps) {
  const selectedClasses = classes.filter((classItem) =>
    data.selectedClassIds.includes(classItem.id),
  );

  const selectedStudents = Array.from(
    new Map(
      classes
        .flatMap((classItem) =>
          classItem.students
            .filter((student) => data.selectedStudentIds.includes(student.id))
            .map((student) => ({
              ...student,
              className: classItem.name,
              yearGroup: classItem.yearGroup,
            })),
        )
        .map((student) => [student.id, student]),
    ).values(),
  );

  const recipientCount =
    data.recipientMode === "classes"
      ? selectedClasses.length
      : selectedStudents.length;

  const resourceLabel =
    data.resource?.resourceType === "programming-challenge"
      ? "Programming challenge"
      : data.resource?.resourceType === "lesson"
        ? "Assigned lesson"
        : data.resource?.resourceType === "exam-paper"
          ? "Assigned exam paper"
          : data.resource?.resourceType === "quiz" ||
              data.resource?.resourceType === "ai-quiz"
            ? "Assigned quiz"
            : "Resource";

  return (
    <Card>
      <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">
        Step 4 of 4
      </p>

      <h2 className="mt-2 text-2xl font-bold text-slate-900">
        Review Assignment
      </h2>

      <p className="mt-2 text-slate-600">
        Check the resource, recipients and deadline before assigning this work.
      </p>

      <div className="mt-6 space-y-5">
        <ReviewSection
          label={resourceLabel}
          value={data.resource?.title || "No resource selected"}
        />

        {data.resource?.resourceType === "lesson" && (
          <>
            <ReviewSection
              label="Topic"
              value={data.resource.topicTitle || "Not specified"}
            />
            <ReviewSection
              label="Curriculum"
              value={`${data.resource.examBoard || "Not specified"} ${
                data.resource.qualification === "A_LEVEL" ? "A-Level" : "GCSE"
              }`}
            />
          </>
        )}

        {data.resource?.resourceType === "exam-paper" && (
          <>
            <ReviewSection
              label="Topic"
              value={data.resource.examTopic || "Not specified"}
            />
            <ReviewSection
              label="Paper"
              value={`${data.resource.questionCount ?? 0} questions · ${
                data.resource.totalMarks ?? 0
              } marks`}
            />
            <ReviewSection
              label="Curriculum"
              value={`${data.resource.examBoard || "Not specified"} · ${
                data.resource.examQualification || "Not specified"
              }`}
            />
          </>
        )}

        {(data.resource?.resourceType === "quiz" ||
          data.resource?.resourceType === "ai-quiz") && (
          <>
            <ReviewSection
              label="Quiz"
              value={`${data.resource.questionCount ?? 0} questions${
                data.resource.estimatedTime
                  ? ` · ${data.resource.estimatedTime}`
                  : ""
              }`}
            />
            <ReviewSection
              label="Curriculum"
              value={`${data.resource.examBoard || "Not specified"} · ${
                data.resource.qualification === "A_LEVEL"
                  ? "A-Level"
                  : data.resource.qualification === "GCSE"
                    ? "GCSE"
                    : "Not specified"
              }`}
            />
            <ReviewSection
              label="Delivery mode"
              value={
                data.deliveryMode === "assessment"
                  ? "Monitored assessment"
                  : "Practice"
              }
            />
          </>
        )}

        <ReviewSection
          label="Resource type"
          value={
            data.resource
              ? formatResourceType(data.resource.resourceType)
              : "Not selected"
          }
        />

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Recipients
          </p>

          {data.recipientMode === "classes" ? (
            <>
              <p className="mt-2 text-sm text-slate-600">
                Whole class mode — every enrolled student in the selected
                class/classes will receive this assignment.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedClasses.length === 0 ? (
                  <p className="text-slate-600">No classes selected.</p>
                ) : (
                  selectedClasses.map((classItem) => (
                    <span
                      key={classItem.id}
                      className="rounded-full bg-teal-100 px-4 py-2 text-sm font-semibold text-teal-700"
                    >
                      {classItem.name} · {classItem.yearGroup} · {classItem.studentIds.length} student
                      {classItem.studentIds.length === 1 ? "" : "s"}
                    </span>
                  ))
                )}
              </div>
            </>
          ) : (
            <>
              <p className="mt-2 text-sm text-slate-600">
                Individual mode — only the students listed below will receive
                this assignment.
              </p>
              <div className="mt-3 space-y-2">
                {selectedStudents.length === 0 ? (
                  <p className="text-slate-600">No students selected.</p>
                ) : (
                  selectedStudents.map((student) => (
                    <div
                      key={`${student.className}-${student.id}`}
                      className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3"
                    >
                      <p className="font-bold text-indigo-950">{student.name}</p>
                      <p className="mt-1 text-xs text-indigo-700">
                        {student.className} · {student.yearGroup}
                        {student.email ? ` · ${student.email}` : ""}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        <ReviewSection label="Due date" value={data.dueDate} />

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Instructions
          </p>
          <p className="mt-3 leading-7 text-slate-700">{data.instructions}</p>
        </div>

        {data.resource?.resourceType === "lesson" && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <p className="font-black text-blue-950">Automatic lesson completion</p>
            <p className="mt-2 text-sm leading-6 text-blue-800">
              The assignment will be completed only when the student completes
              this exact interactive lesson in CS Master.
            </p>
          </div>
        )}

        {(data.resource?.resourceType === "quiz" ||
          data.resource?.resourceType === "ai-quiz") && (
          <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
            <p className="font-black text-violet-950">Automatic quiz completion</p>
            <p className="mt-2 text-sm leading-6 text-violet-800">
              The assignment completes only after the student submits this exact
              protected quiz. Scoring and XP are recorded by the secure server
              workflow, and completed attempts reopen in read-only review mode.
            </p>
          </div>
        )}

        {data.resource?.resourceType === "programming-challenge" && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <p className="font-black text-blue-950">Automatic programming completion</p>
            <p className="mt-2 text-sm leading-6 text-blue-800">
              The assignment completes only when the student passes every test
              for the exact programming challenge selected here.
            </p>
          </div>
        )}

        {data.resource?.resourceType === "teaching-resource" && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="font-black text-emerald-950">Student-confirmed completion</p>
            <p className="mt-2 text-sm leading-6 text-emerald-800">
              Students open the published resource, complete the work and then
              mark the assignment as completed from their assignment page.
            </p>
          </div>
        )}

        {data.resource?.resourceType === "exam-paper" && (
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5">
            <p className="font-black text-indigo-950">Written assessment workflow</p>
            <p className="mt-2 text-sm leading-6 text-indigo-800">
              Student answers are autosaved. Submission locks the paper. AI
              marking suggestions remain provisional until the teacher reviews
              the marks and finalises the result.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ← Back
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={
            submitting ||
            !data.resource ||
            recipientCount === 0 ||
            !data.dueDate ||
            !data.instructions.trim()
          }
          className="rounded-xl bg-teal-600 px-6 py-3 font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? "Creating Assignments..."
            : data.recipientMode === "classes"
              ? `Assign to ${selectedClasses.length} ${
                  selectedClasses.length === 1 ? "Class" : "Classes"
                }`
              : `Assign to ${selectedStudents.length} ${
                  selectedStudents.length === 1 ? "Student" : "Students"
                }`}
        </button>
      </div>
    </Card>
  );
}

function ReviewSection({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-3 font-bold text-slate-900">{value}</p>
    </div>
  );
}
