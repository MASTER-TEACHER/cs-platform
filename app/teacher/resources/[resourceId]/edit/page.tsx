"use client";

import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileQuestion,
  GraduationCap,
  Lightbulb,
  Loader2,
  Plus,
  Save,
  Tag,
  Target,
  Trash2,
  Users,
} from "lucide-react";

import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  ChangeEvent,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

import { auth, db } from "@/lib/firebase";

import {
  GeneratedTeachingResource,
  ResourceAssessmentQuestion,
  ResourceMisconception,
  ResourceSection,
  updateTeacherResourceContent,
} from "@/services/teacherResourceService";

type EditableResourceDocument = {
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
  status: "draft" | "published";
};

type StringArrayField =
  "learningObjectives" | "successCriteria" | "keywords" | "priorKnowledge";

type DifferentiationField = "support" | "core" | "stretch";

const YEAR_GROUPS = [
  "Year 7",
  "Year 8",
  "Year 9",
  "Year 10",
  "Year 11",
  "Year 12",
  "Year 13",
  "GCSE",
  "A Level",
];

const EXAM_BOARDS = [
  "AQA",
  "OCR",
  "Pearson Edexcel",
  "WJEC",
  "Eduqas",
  "Cambridge International",
  "Not exam-board specific",
];

const DIFFICULTY_LEVELS = ["foundation", "standard", "higher"];

function createEmptySection(): ResourceSection {
  return {
    title: "New section",
    duration: "10 minutes",
    teacherInstructions: "",
    studentTask: "",
    assessment: "",
    resources: [],
  };
}

function createEmptyMisconception(): ResourceMisconception {
  return {
    misconception: "",
    correction: "",
  };
}

function createEmptyAssessmentQuestion(): ResourceAssessmentQuestion {
  return {
    question: "",
    answer: "",
    marks: 1,
  };
}

function FieldLabel({
  htmlFor,
  children,
  required = false,
}: {
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-sm font-bold text-slate-800"
    >
      {children}

      {required && (
        <span className="ml-1 text-red-500" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        {icon}
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-950">{title}</h2>

        {description && (
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        )}
      </div>
    </div>
  );
}

function EditableStringList({
  title,
  description,
  icon,
  items,
  placeholder,
  onChange,
  onAdd,
  onRemove,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  items: string[];
  placeholder: string;
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <SectionHeader icon={icon} title={title} description={description} />

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={`${title}-${index}`} className="flex items-start gap-3">
            <textarea
              value={item}
              onChange={(event) => onChange(index, event.target.value)}
              rows={2}
              placeholder={placeholder}
              className="min-h-[52px] flex-1 resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />

            <button
              type="button"
              onClick={() => onRemove(index)}
              disabled={items.length === 1}
              aria-label={`Remove ${title.toLowerCase()} item ${index + 1}`}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-bold text-indigo-700 transition hover:bg-indigo-100"
      >
        <Plus className="h-4 w-4" />
        Add item
      </button>
    </section>
  );
}

function EditPageSkeleton() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="h-10 w-44 animate-pulse rounded-xl bg-slate-200" />

      <div className="animate-pulse rounded-3xl border border-slate-200 bg-white p-7">
        <div className="h-8 w-64 rounded bg-slate-200" />
        <div className="mt-4 h-5 w-full max-w-2xl rounded bg-slate-100" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
          >
            <div className="h-8 w-44 rounded bg-slate-200" />
            <div className="mt-6 h-12 rounded-xl bg-slate-100" />
            <div className="mt-4 h-12 rounded-xl bg-slate-100" />
          </div>
        ))}
      </div>
    </main>
  );
}

export default function EditTeacherResourcePage() {
  const params = useParams<{
    resourceId: string;
  }>();

  const router = useRouter();
  const resourceId = params.resourceId;

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [authLoading, setAuthLoading] = useState(true);

  const [resource, setResource] = useState<GeneratedTeachingResource | null>(
    null,
  );

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const loadResource = useCallback(async () => {
    if (!currentUser || !resourceId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const resourceReference = doc(db, "teacherResources", resourceId);

      const resourceSnapshot = await getDoc(resourceReference);

      if (!resourceSnapshot.exists()) {
        setError("This teaching resource could not be found.");
        setResource(null);
        return;
      }

      const data = resourceSnapshot.data() as EditableResourceDocument;

      if (data.teacherId !== currentUser.uid) {
        setError("You do not have permission to edit this resource.");
        setResource(null);
        return;
      }

      setResource(data.content);
    } catch (caughtError) {
      console.error("Failed to load editable resource:", caughtError);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The resource could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, [currentUser, resourceId]);

  useEffect(() => {
    if (!authLoading) {
      void loadResource();
    }
  }, [authLoading, loadResource]);

  function updateTopLevelField<K extends keyof GeneratedTeachingResource>(
    field: K,
    value: GeneratedTeachingResource[K],
  ) {
    setResource((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [field]: value,
      };
    });

    setError(null);
    setSuccess(null);
  }

  function updateStringArrayItem(
    field: StringArrayField,
    index: number,
    value: string,
  ) {
    setResource((current) => {
      if (!current) {
        return current;
      }

      const updatedItems = [...current[field]];
      updatedItems[index] = value;

      return {
        ...current,
        [field]: updatedItems,
      };
    });

    setSuccess(null);
  }

  function addStringArrayItem(field: StringArrayField) {
    setResource((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [field]: [...current[field], ""],
      };
    });
  }

  function removeStringArrayItem(field: StringArrayField, index: number) {
    setResource((current) => {
      if (!current || current[field].length <= 1) {
        return current;
      }

      return {
        ...current,
        [field]: current[field].filter((_, itemIndex) => itemIndex !== index),
      };
    });
  }

  function updateSection(
    index: number,
    field: keyof ResourceSection,
    value: string | string[],
  ) {
    setResource((current) => {
      if (!current) {
        return current;
      }

      const sections = [...current.sections];

      sections[index] = {
        ...sections[index],
        [field]: value,
      };

      return {
        ...current,
        sections,
      };
    });

    setSuccess(null);
  }

  function addSection() {
    setResource((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        sections: [...current.sections, createEmptySection()],
      };
    });
  }

  function removeSection(index: number) {
    setResource((current) => {
      if (!current || current.sections.length <= 1) {
        return current;
      }

      return {
        ...current,
        sections: current.sections.filter(
          (_, sectionIndex) => sectionIndex !== index,
        ),
      };
    });
  }

  function updateDifferentiationItem(
    field: DifferentiationField,
    index: number,
    value: string,
  ) {
    setResource((current) => {
      if (!current) {
        return current;
      }

      const items = [...current.differentiation[field]];

      items[index] = value;

      return {
        ...current,
        differentiation: {
          ...current.differentiation,
          [field]: items,
        },
      };
    });
  }

  function addDifferentiationItem(field: DifferentiationField) {
    setResource((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        differentiation: {
          ...current.differentiation,
          [field]: [...current.differentiation[field], ""],
        },
      };
    });
  }

  function removeDifferentiationItem(
    field: DifferentiationField,
    index: number,
  ) {
    setResource((current) => {
      if (!current || current.differentiation[field].length <= 1) {
        return current;
      }

      return {
        ...current,
        differentiation: {
          ...current.differentiation,
          [field]: current.differentiation[field].filter(
            (_, itemIndex) => itemIndex !== index,
          ),
        },
      };
    });
  }

  function updateMisconception(
    index: number,
    field: keyof ResourceMisconception,
    value: string,
  ) {
    setResource((current) => {
      if (!current) {
        return current;
      }

      const misconceptions = [...current.misconceptions];

      misconceptions[index] = {
        ...misconceptions[index],
        [field]: value,
      };

      return {
        ...current,
        misconceptions,
      };
    });
  }

  function addMisconception() {
    setResource((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        misconceptions: [...current.misconceptions, createEmptyMisconception()],
      };
    });
  }

  function removeMisconception(index: number) {
    setResource((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        misconceptions: current.misconceptions.filter(
          (_, itemIndex) => itemIndex !== index,
        ),
      };
    });
  }

  function updateAssessmentQuestion(
    index: number,
    field: keyof ResourceAssessmentQuestion,
    value: string | number,
  ) {
    setResource((current) => {
      if (!current) {
        return current;
      }

      const assessmentQuestions = [...current.assessmentQuestions];

      assessmentQuestions[index] = {
        ...assessmentQuestions[index],
        [field]: value,
      };

      return {
        ...current,
        assessmentQuestions,
      };
    });
  }

  function addAssessmentQuestion() {
    setResource((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        assessmentQuestions: [
          ...current.assessmentQuestions,
          createEmptyAssessmentQuestion(),
        ],
      };
    });
  }

  function removeAssessmentQuestion(index: number) {
    setResource((current) => {
      if (!current || current.assessmentQuestions.length <= 1) {
        return current;
      }

      return {
        ...current,
        assessmentQuestions: current.assessmentQuestions.filter(
          (_, itemIndex) => itemIndex !== index,
        ),
      };
    });
  }

  function validateResource(): string | null {
    if (!resource) {
      return "The resource could not be loaded.";
    }

    if (resource.title.trim().length < 2) {
      return "Enter a valid resource title.";
    }

    if (resource.topic.trim().length < 2) {
      return "Enter a valid topic.";
    }

    if (!resource.overview.trim()) {
      return "Enter a resource overview.";
    }

    if (resource.learningObjectives.some((item) => !item.trim())) {
      return "Learning objectives cannot contain blank items.";
    }

    if (resource.successCriteria.some((item) => !item.trim())) {
      return "Success criteria cannot contain blank items.";
    }

    if (
      resource.sections.some(
        (section) =>
          !section.title.trim() ||
          !section.teacherInstructions.trim() ||
          !section.studentTask.trim(),
      )
    ) {
      return "Every section requires a title, teacher instructions and student task.";
    }

    if (
      resource.assessmentQuestions.some(
        (question) =>
          !question.question.trim() ||
          !question.answer.trim() ||
          question.marks < 1,
      )
    ) {
      return "Every assessment question requires a question, answer and valid mark value.";
    }

    return null;
  }

  async function handleSave() {
    const validationError = validateResource();

    if (validationError) {
      setError(validationError);
      setSuccess(null);
      return;
    }

    if (!resource) {
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const cleanedResource: GeneratedTeachingResource = {
        ...resource,
        title: resource.title.trim(),
        topic: resource.topic.trim(),
        overview: resource.overview.trim(),
        learningObjectives: resource.learningObjectives.map((item) =>
          item.trim(),
        ),
        successCriteria: resource.successCriteria.map((item) => item.trim()),
        keywords: resource.keywords.map((item) => item.trim()).filter(Boolean),
        priorKnowledge: resource.priorKnowledge
          .map((item) => item.trim())
          .filter(Boolean),
        sections: resource.sections.map((section) => ({
          ...section,
          title: section.title.trim(),
          duration: section.duration.trim(),
          teacherInstructions: section.teacherInstructions.trim(),
          studentTask: section.studentTask.trim(),
          assessment: section.assessment.trim(),
          resources: section.resources
            .map((item) => item.trim())
            .filter(Boolean),
        })),
        differentiation: {
          support: resource.differentiation.support
            .map((item) => item.trim())
            .filter(Boolean),
          core: resource.differentiation.core
            .map((item) => item.trim())
            .filter(Boolean),
          stretch: resource.differentiation.stretch
            .map((item) => item.trim())
            .filter(Boolean),
        },
        misconceptions: resource.misconceptions
          .map((item) => ({
            misconception: item.misconception.trim(),
            correction: item.correction.trim(),
          }))
          .filter((item) => item.misconception && item.correction),
        assessmentQuestions: resource.assessmentQuestions.map((question) => ({
          question: question.question.trim(),
          answer: question.answer.trim(),
          marks: Math.max(1, Math.round(question.marks)),
        })),
        homework: resource.homework.trim(),
        teacherNotes: resource.teacherNotes.trim(),
      };

      await updateTeacherResourceContent(resourceId, cleanedResource);

      setResource(cleanedResource);
      setSuccess("Your resource changes were saved successfully.");

      window.setTimeout(() => {
        router.push(`/teacher/resources/${resourceId}`);
      }, 800);
    } catch (caughtError) {
      console.error("Failed to save resource changes:", caughtError);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Your changes could not be saved.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || loading) {
    return <EditPageSkeleton />;
  }

  if (error && !resource) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/teacher/resources"
          className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Resource Library
        </Link>

        <section className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-red-600" />

          <h1 className="mt-4 text-2xl font-bold text-red-950">
            Resource unavailable
          </h1>

          <p className="mt-2 text-sm text-red-800">{error}</p>
        </section>
      </main>
    );
  }

  if (!resource) {
    return null;
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={`/teacher/resources/${resourceId}`}
          className="inline-flex w-fit items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Cancel editing
        </Link>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          {saving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Saving changes...
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Save changes
            </>
          )}
        </button>
      </div>

      <section className="rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-sky-600 p-6 text-white shadow-lg sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
            <BookOpen className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Edit teaching resource
            </h1>

            <p className="mt-2 max-w-2xl leading-7 text-indigo-50">
              Refine the generated lesson content before publishing, exporting
              or assigning it to a class.
            </p>
          </div>
        </div>
      </section>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <div>
            <p className="font-bold">Changes not saved</p>

            <p className="mt-1 text-sm leading-6">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

          <p className="text-sm font-semibold">{success}</p>
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          icon={<BookOpen className="h-5 w-5" />}
          title="Resource details"
          description="Update the resource title, topic and curriculum information."
        />

        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <FieldLabel htmlFor="resource-title" required>
              Resource title
            </FieldLabel>

            <input
              id="resource-title"
              value={resource.title}
              onChange={(event) =>
                updateTopLevelField("title", event.target.value)
              }
              maxLength={200}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div>
            <FieldLabel htmlFor="resource-topic" required>
              Topic
            </FieldLabel>

            <input
              id="resource-topic"
              value={resource.topic}
              onChange={(event) =>
                updateTopLevelField("topic", event.target.value)
              }
              maxLength={150}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div>
            <FieldLabel htmlFor="resource-year">
              Year group or qualification
            </FieldLabel>

            <div className="relative">
              <select
                id="resource-year"
                value={resource.yearGroup}
                onChange={(event) =>
                  updateTopLevelField("yearGroup", event.target.value)
                }
                className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pr-10 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              >
                {YEAR_GROUPS.map((yearGroup) => (
                  <option key={yearGroup} value={yearGroup}>
                    {yearGroup}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="resource-board">Exam board</FieldLabel>

            <div className="relative">
              <select
                id="resource-board"
                value={resource.examBoard}
                onChange={(event) =>
                  updateTopLevelField("examBoard", event.target.value)
                }
                className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pr-10 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              >
                {EXAM_BOARDS.map((examBoard) => (
                  <option key={examBoard} value={examBoard}>
                    {examBoard}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="resource-duration">Duration</FieldLabel>

            <div className="relative">
              <Clock3 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                id="resource-duration"
                value={resource.duration}
                onChange={(event) =>
                  updateTopLevelField("duration", event.target.value)
                }
                placeholder="For example: 60 minutes"
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="resource-difficulty">Difficulty</FieldLabel>

            <select
              id="resource-difficulty"
              value={resource.difficulty}
              onChange={(event) =>
                updateTopLevelField("difficulty", event.target.value)
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm capitalize text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            >
              {DIFFICULTY_LEVELS.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5">
          <FieldLabel htmlFor="resource-overview" required>
            Resource overview
          </FieldLabel>

          <textarea
            id="resource-overview"
            value={resource.overview}
            onChange={(event) =>
              updateTopLevelField("overview", event.target.value)
            }
            rows={5}
            maxLength={2500}
            className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <EditableStringList
          title="Learning objectives"
          description="What students should know or be able to do."
          icon={<Target className="h-5 w-5" />}
          items={resource.learningObjectives}
          placeholder="Enter a measurable learning objective."
          onChange={(index, value) =>
            updateStringArrayItem("learningObjectives", index, value)
          }
          onAdd={() => addStringArrayItem("learningObjectives")}
          onRemove={(index) =>
            removeStringArrayItem("learningObjectives", index)
          }
        />

        <EditableStringList
          title="Success criteria"
          description="How students will demonstrate successful learning."
          icon={<CheckCircle2 className="h-5 w-5" />}
          items={resource.successCriteria}
          placeholder="Enter a success criterion."
          onChange={(index, value) =>
            updateStringArrayItem("successCriteria", index, value)
          }
          onAdd={() => addStringArrayItem("successCriteria")}
          onRemove={(index) => removeStringArrayItem("successCriteria", index)}
        />

        <EditableStringList
          title="Prior knowledge"
          description="Knowledge students should already possess."
          icon={<BookOpen className="h-5 w-5" />}
          items={
            resource.priorKnowledge.length > 0 ? resource.priorKnowledge : [""]
          }
          placeholder="Enter required prior knowledge."
          onChange={(index, value) =>
            updateStringArrayItem("priorKnowledge", index, value)
          }
          onAdd={() => addStringArrayItem("priorKnowledge")}
          onRemove={(index) => removeStringArrayItem("priorKnowledge", index)}
        />

        <EditableStringList
          title="Keywords"
          description="Important vocabulary students should use."
          icon={<Tag className="h-5 w-5" />}
          items={resource.keywords.length > 0 ? resource.keywords : [""]}
          placeholder="Enter a keyword."
          onChange={(index, value) =>
            updateStringArrayItem("keywords", index, value)
          }
          onAdd={() => addStringArrayItem("keywords")}
          onRemove={(index) => removeStringArrayItem("keywords", index)}
        />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          icon={<BookOpen className="h-5 w-5" />}
          title="Resource sequence"
          description="Edit teacher instructions, student tasks, assessment opportunities and required resources."
        />

        <div className="space-y-6">
          {resource.sections.map((section, index) => (
            <article
              key={`section-${index}`}
              className="overflow-hidden rounded-2xl border border-slate-200"
            >
              <header className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
                    {index + 1}
                  </span>

                  <p className="font-bold text-slate-950">
                    Section {index + 1}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeSection(index)}
                  disabled={resource.sections.length === 1}
                  className="inline-flex w-fit items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove section
                </button>
              </header>

              <div className="grid gap-5 p-5 lg:grid-cols-2">
                <div>
                  <FieldLabel htmlFor={`section-title-${index}`} required>
                    Section title
                  </FieldLabel>

                  <input
                    id={`section-title-${index}`}
                    value={section.title}
                    onChange={(event) =>
                      updateSection(index, "title", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <FieldLabel htmlFor={`section-duration-${index}`}>
                    Duration
                  </FieldLabel>

                  <input
                    id={`section-duration-${index}`}
                    value={section.duration}
                    onChange={(event) =>
                      updateSection(index, "duration", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <FieldLabel
                    htmlFor={`teacher-instructions-${index}`}
                    required
                  >
                    Teacher instructions
                  </FieldLabel>

                  <textarea
                    id={`teacher-instructions-${index}`}
                    value={section.teacherInstructions}
                    onChange={(event) =>
                      updateSection(
                        index,
                        "teacherInstructions",
                        event.target.value,
                      )
                    }
                    rows={6}
                    className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm leading-7 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <FieldLabel htmlFor={`student-task-${index}`} required>
                    Student task
                  </FieldLabel>

                  <textarea
                    id={`student-task-${index}`}
                    value={section.studentTask}
                    onChange={(event) =>
                      updateSection(index, "studentTask", event.target.value)
                    }
                    rows={6}
                    className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm leading-7 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <FieldLabel htmlFor={`assessment-${index}`}>
                    Assessment opportunity
                  </FieldLabel>

                  <textarea
                    id={`assessment-${index}`}
                    value={section.assessment}
                    onChange={(event) =>
                      updateSection(index, "assessment", event.target.value)
                    }
                    rows={4}
                    className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm leading-7 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <FieldLabel htmlFor={`resources-${index}`}>
                    Resources required
                  </FieldLabel>

                  <textarea
                    id={`resources-${index}`}
                    value={section.resources.join("\n")}
                    onChange={(event) =>
                      updateSection(
                        index,
                        "resources",
                        event.target.value
                          .split("\n")
                          .map((item) => item.trim()),
                      )
                    }
                    rows={4}
                    placeholder="Enter one resource per line."
                    className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm leading-7 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>

        <button
          type="button"
          onClick={addSection}
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-bold text-indigo-700 transition hover:bg-indigo-100"
        >
          <Plus className="h-4 w-4" />
          Add section
        </button>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          icon={<Users className="h-5 w-5" />}
          title="Differentiation"
          description="Edit support, core and stretch strategies."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {(
            [
              ["support", "Support"],
              ["core", "Core"],
              ["stretch", "Stretch"],
            ] as const
          ).map(([field, label]) => (
            <div
              key={field}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <h3 className="font-bold text-slate-950">{label}</h3>

              <div className="mt-4 space-y-3">
                {resource.differentiation[field].map((item, index) => (
                  <div
                    key={`${field}-${index}`}
                    className="flex items-start gap-2"
                  >
                    <textarea
                      value={item}
                      onChange={(event) =>
                        updateDifferentiationItem(
                          field,
                          index,
                          event.target.value,
                        )
                      }
                      rows={3}
                      className="flex-1 resize-y rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm leading-6 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />

                    <button
                      type="button"
                      onClick={() => removeDifferentiationItem(field, index)}
                      disabled={resource.differentiation[field].length === 1}
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => addDifferentiationItem(field)}
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700"
              >
                <Plus className="h-4 w-4" />
                Add strategy
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          icon={<AlertCircle className="h-5 w-5" />}
          title="Common misconceptions"
          description="Edit likely errors and the guidance used to correct them."
        />

        <div className="space-y-5">
          {resource.misconceptions.map((item, index) => (
            <article
              key={`misconception-${index}`}
              className="rounded-2xl border border-amber-200 bg-amber-50 p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-bold text-amber-950">
                  Misconception {index + 1}
                </h3>

                <button
                  type="button"
                  onClick={() => removeMisconception(index)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-white text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div>
                  <FieldLabel htmlFor={`misconception-${index}`}>
                    Misconception
                  </FieldLabel>

                  <textarea
                    id={`misconception-${index}`}
                    value={item.misconception}
                    onChange={(event) =>
                      updateMisconception(
                        index,
                        "misconception",
                        event.target.value,
                      )
                    }
                    rows={4}
                    className="w-full resize-y rounded-xl border border-amber-300 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <FieldLabel htmlFor={`correction-${index}`}>
                    Correction
                  </FieldLabel>

                  <textarea
                    id={`correction-${index}`}
                    value={item.correction}
                    onChange={(event) =>
                      updateMisconception(
                        index,
                        "correction",
                        event.target.value,
                      )
                    }
                    rows={4}
                    className="w-full resize-y rounded-xl border border-amber-300 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>

        <button
          type="button"
          onClick={addMisconception}
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-bold text-indigo-700 transition hover:bg-indigo-100"
        >
          <Plus className="h-4 w-4" />
          Add misconception
        </button>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          icon={<FileQuestion className="h-5 w-5" />}
          title="Assessment questions"
          description="Edit questions, model answers and mark allocations."
        />

        <div className="space-y-5">
          {resource.assessmentQuestions.map((question, index) => (
            <article
              key={`question-${index}`}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-bold text-slate-950">
                  Question {index + 1}
                </h3>

                <button
                  type="button"
                  onClick={() => removeAssessmentQuestion(index)}
                  disabled={resource.assessmentQuestions.length === 1}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-white text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_130px]">
                <div>
                  <FieldLabel htmlFor={`question-${index}`} required>
                    Question
                  </FieldLabel>

                  <textarea
                    id={`question-${index}`}
                    value={question.question}
                    onChange={(event) =>
                      updateAssessmentQuestion(
                        index,
                        "question",
                        event.target.value,
                      )
                    }
                    rows={3}
                    className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <FieldLabel htmlFor={`marks-${index}`} required>
                    Marks
                  </FieldLabel>

                  <input
                    id={`marks-${index}`}
                    type="number"
                    min={1}
                    max={20}
                    value={question.marks}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      updateAssessmentQuestion(
                        index,
                        "marks",
                        Number(event.target.value),
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div className="mt-4">
                <FieldLabel htmlFor={`answer-${index}`} required>
                  Model answer
                </FieldLabel>

                <textarea
                  id={`answer-${index}`}
                  value={question.answer}
                  onChange={(event) =>
                    updateAssessmentQuestion(
                      index,
                      "answer",
                      event.target.value,
                    )
                  }
                  rows={4}
                  className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-7 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </div>
            </article>
          ))}
        </div>

        <button
          type="button"
          onClick={addAssessmentQuestion}
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-bold text-indigo-700 transition hover:bg-indigo-100"
        >
          <Plus className="h-4 w-4" />
          Add assessment question
        </button>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeader
            icon={<GraduationCap className="h-5 w-5" />}
            title="Homework"
          />

          <textarea
            value={resource.homework}
            onChange={(event) =>
              updateTopLevelField("homework", event.target.value)
            }
            rows={7}
            className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm leading-7 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeader
            icon={<Lightbulb className="h-5 w-5" />}
            title="Teacher notes"
          />

          <textarea
            value={resource.teacherNotes}
            onChange={(event) =>
              updateTopLevelField("teacherNotes", event.target.value)
            }
            rows={7}
            className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm leading-7 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </section>
      </div>

      <section className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          Save your changes before returning to the resource viewer.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/teacher/resources/${resourceId}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {saving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving changes...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save changes
              </>
            )}
          </button>
        </div>
      </section>
    </main>
  );
}
