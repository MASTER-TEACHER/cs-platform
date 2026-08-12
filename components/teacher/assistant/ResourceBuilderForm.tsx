"use client";

import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileQuestion,
  GraduationCap,
  Lightbulb,
  Loader2,
  RefreshCcw,
  Save,
  Send,
  Sparkles,
  Target,
  TestTube2,
  Users,
  WandSparkles,
} from "lucide-react";

import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";

import { auth } from "@/lib/firebase";

import {
  GeneratedTeachingResource,
  saveTeacherResource,
} from "@/services/teacherResourceService";

export type ResourceBuilderInitialValues = {
  topic?: string;
  yearGroup?: string;
  examBoard?: string;
  duration?: string;
  difficulty?: "foundation" | "standard" | "higher";
  objectives?: string;
  additionalNotes?: string;
};

type ResourceBuilderFormProps = {
  resourceType: string;
  initialValues?: ResourceBuilderInitialValues;
  prefillVersion?: number;
};

type GenerateResourceResponse = {
  resource?: GeneratedTeachingResource;
  error?: string;
};

type FormState = {
  topic: string;
  yearGroup: string;
  examBoard: string;
  duration: string;
  difficulty: "foundation" | "standard" | "higher";
  objectives: string;
  additionalNotes: string;
};

const SUPPORTED_RESOURCE_TYPES = [
  "lesson-plan",
  "starter",
  "retrieval-quiz",
  "worksheet",
  "homework",
  "exit-ticket",
] as const;

type SupportedResourceType = (typeof SUPPORTED_RESOURCE_TYPES)[number];

const RESOURCE_LABELS: Record<SupportedResourceType, string> = {
  "lesson-plan": "Lesson Plan",
  starter: "Starter Activity",
  "retrieval-quiz": "Retrieval Quiz",
  worksheet: "Worksheet",
  homework: "Homework",
  "exit-ticket": "Exit Ticket",
};

const DEFAULT_FORM: FormState = {
  topic: "",
  yearGroup: "Year 10",
  examBoard: "AQA",
  duration: "60",
  difficulty: "standard",
  objectives: "",
  additionalNotes: "",
};

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

const DURATIONS = [
  ["10", "10 minutes"],
  ["15", "15 minutes"],
  ["20", "20 minutes"],
  ["30", "30 minutes"],
  ["45", "45 minutes"],
  ["50", "50 minutes"],
  ["60", "60 minutes"],
  ["75", "75 minutes"],
  ["90", "90 minutes"],
  ["120", "120 minutes"],
];

function isSupportedResourceType(
  value: string,
): value is SupportedResourceType {
  return SUPPORTED_RESOURCE_TYPES.includes(value as SupportedResourceType);
}

function normaliseResourceType(resourceType: string): SupportedResourceType {
  return isSupportedResourceType(resourceType) ? resourceType : "lesson-plan";
}

function createDemoResource(
  resourceType: SupportedResourceType,
): GeneratedTeachingResource {
  return {
    id: `demo-binary-addition-${Date.now()}`,
    title: "Binary Addition",
    resourceType: RESOURCE_LABELS[resourceType],
    topic: "Binary addition",
    yearGroup: "Year 10",
    examBoard: "AQA",
    duration: "60 minutes",
    difficulty: "standard",
    overview:
      "Students develop their understanding of binary place values before completing binary addition calculations and identifying overflow errors.",
    learningObjectives: [
      "Explain how binary place values represent denary numbers.",
      "Add two 8-bit binary numbers accurately.",
      "Identify when an overflow error has occurred.",
    ],
    successCriteria: [
      "I can align binary digits using the correct place values.",
      "I can apply binary addition rules accurately.",
      "I can explain why an overflow error occurs.",
    ],
    keywords: ["binary", "denary", "bit", "byte", "overflow", "place value"],
    priorKnowledge: [
      "Students should understand binary place values.",
      "Students should be able to convert simple binary values into denary.",
    ],
    sections: [
      {
        title: "Retrieval starter",
        duration: "8 minutes",
        teacherInstructions:
          "Display five binary-to-denary conversion questions. Review answers using place-value columns.",
        studentTask:
          "Convert the five binary numbers into denary and explain one answer to a partner.",
        assessment:
          "Check whether students can identify the correct place value of each bit.",
        resources: ["Mini-whiteboards", "Binary place-value grid"],
      },
      {
        title: "Teacher modelling",
        duration: "15 minutes",
        teacherInstructions:
          "Model binary addition using aligned columns. Explicitly teach the four basic binary addition rules and demonstrate carrying.",
        studentTask:
          "Complete each worked example alongside the teacher and annotate the carrying steps.",
        assessment:
          "Question students about each carry decision before revealing the next step.",
        resources: ["Worked-example slides", "Visualiser or whiteboard"],
      },
      {
        title: "Guided practice",
        duration: "12 minutes",
        teacherInstructions:
          "Work through three increasingly challenging examples. Pause after each column so students can decide the output and carry.",
        studentTask:
          "Complete the calculations and compare each result with a partner.",
        assessment:
          "Use mini-whiteboards to identify common errors immediately.",
        resources: ["Guided-practice questions"],
      },
      {
        title: "Independent practice",
        duration: "18 minutes",
        teacherInstructions:
          "Students complete differentiated binary addition questions. Provide place-value scaffolds where required.",
        studentTask:
          "Complete the core questions before attempting the overflow challenge.",
        assessment: "Circulate and check alignment, carries and final answers.",
        resources: ["Differentiated worksheet", "Binary place-value scaffold"],
      },
      {
        title: "Exit ticket",
        duration: "7 minutes",
        teacherInstructions:
          "Ask students to complete one calculation and one explanation question independently.",
        studentTask:
          "Calculate 01101101 + 00110110 and explain whether an overflow error occurs.",
        assessment:
          "Collect responses to identify students requiring further support.",
        resources: ["Exit-ticket slips"],
      },
    ],
    differentiation: {
      support: [
        "Provide a labelled binary place-value grid.",
        "Use partially completed carrying examples.",
        "Pair students for verbal rehearsal before independent work.",
      ],
      core: [
        "Complete standard 8-bit binary addition calculations.",
        "Explain each carrying step using binary rules.",
      ],
      stretch: [
        "Identify and explain overflow errors.",
        "Create a binary addition question that produces overflow.",
      ],
    },
    misconceptions: [
      {
        misconception:
          "Students may assume that 1 + 1 equals 2 in the answer column.",
        correction:
          "In binary, 1 + 1 produces 0 in the current column and carries 1 to the next column.",
      },
      {
        misconception:
          "Students may treat a ninth result bit as part of an 8-bit value.",
        correction:
          "A ninth bit cannot be represented in an 8-bit register, so an overflow error occurs.",
      },
    ],
    assessmentQuestions: [
      {
        question: "Calculate 00101101 + 00010111.",
        answer: "01000100",
        marks: 2,
      },
      {
        question:
          "State the result of adding 1 and 1 in binary, including the carry.",
        answer:
          "Write 0 in the current column and carry 1 into the next column.",
        marks: 2,
      },
      {
        question:
          "Explain why adding two 8-bit binary numbers can cause an overflow error.",
        answer:
          "The result may require more than eight bits. The extra bit cannot be stored in an 8-bit register.",
        marks: 3,
      },
    ],
    homework:
      "Complete six binary addition calculations and write a short explanation of how overflow can affect a computer system.",
    teacherNotes:
      "Check that students align digits correctly before calculating. Consider reteaching binary place values if starter accuracy is low.",
    createdAt: new Date().toISOString(),
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
      className="mb-2 block text-sm font-semibold text-slate-800"
    >
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="flex items-start gap-2 text-sm leading-6 text-slate-700"
        >
          <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function PreviewCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          {icon}
        </div>

        <h3 className="text-lg font-bold text-slate-950">{title}</h3>
      </div>

      {children}
    </section>
  );
}

function ResourcePreview({
  resource,
  isSaving,
  isSaved,
  onSave,
  onRegenerate,
}: {
  resource: GeneratedTeachingResource;
  isSaving: boolean;
  isSaved: boolean;
  onSave: () => void;
  onRegenerate: () => void;
}) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-sky-600 p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              {[
                resource.resourceType,
                resource.yearGroup,
                resource.examBoard,
                resource.difficulty,
              ].map((value) => (
                <span
                  key={value}
                  className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold capitalize"
                >
                  {value}
                </span>
              ))}
            </div>

            <h2 className="text-3xl font-extrabold">{resource.title}</h2>

            <p className="mt-4 max-w-3xl leading-7 text-indigo-50">
              {resource.overview}
            </p>

            <div className="mt-4 flex flex-wrap gap-5 text-sm text-indigo-50">
              <span className="flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                {resource.duration}
              </span>

              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                {resource.topic}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-3">
            <button
              type="button"
              onClick={onRegenerate}
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold hover:bg-white/20"
            >
              <RefreshCcw className="h-4 w-4" />
              Regenerate
            </button>

            <button
              type="button"
              onClick={onSave}
              disabled={isSaving || isSaved}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-indigo-700 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isSaved ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <Save className="h-4 w-4" />
              )}

              {isSaving
                ? "Saving..."
                : isSaved
                  ? "Saved to Library"
                  : "Save to Library"}
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <PreviewCard
          title="Learning objectives"
          icon={<Target className="h-5 w-5" />}
        >
          <BulletList items={resource.learningObjectives} />
        </PreviewCard>

        <PreviewCard
          title="Success criteria"
          icon={<CheckCircle2 className="h-5 w-5" />}
        >
          <BulletList items={resource.successCriteria} />
        </PreviewCard>
      </div>

      <PreviewCard
        title="Resource sequence"
        icon={<BookOpen className="h-5 w-5" />}
      >
        <div className="space-y-5">
          {resource.sections.map((section, index) => (
            <article
              key={`${section.title}-${index}`}
              className="overflow-hidden rounded-2xl border border-slate-200"
            >
              <div className="flex items-center justify-between gap-4 bg-slate-50 px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
                    {index + 1}
                  </span>

                  <h4 className="font-bold text-slate-900">{section.title}</h4>
                </div>

                <span className="text-sm font-semibold text-slate-600">
                  {section.duration}
                </span>
              </div>

              <div className="grid gap-5 p-5 lg:grid-cols-2">
                <div>
                  <h5 className="mb-2 font-bold text-slate-900">
                    Teacher instructions
                  </h5>
                  <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
                    {section.teacherInstructions}
                  </p>
                </div>

                <div>
                  <h5 className="mb-2 font-bold text-slate-900">
                    Student task
                  </h5>
                  <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
                    {section.studentTask}
                  </p>
                </div>

                <div>
                  <h5 className="mb-2 font-bold text-slate-900">Assessment</h5>
                  <p className="text-sm leading-7 text-slate-700">
                    {section.assessment}
                  </p>
                </div>

                <div>
                  <h5 className="mb-2 font-bold text-slate-900">Resources</h5>
                  <BulletList items={section.resources} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </PreviewCard>

      <PreviewCard title="Differentiation" icon={<Users className="h-5 w-5" />}>
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            ["Support", resource.differentiation.support],
            ["Core", resource.differentiation.core],
            ["Stretch", resource.differentiation.stretch],
          ].map(([title, items]) => (
            <div
              key={title as string}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <h4 className="mb-3 font-bold text-slate-900">
                {title as string}
              </h4>
              <BulletList items={items as string[]} />
            </div>
          ))}
        </div>
      </PreviewCard>

      <PreviewCard
        title="Common misconceptions"
        icon={<AlertCircle className="h-5 w-5" />}
      >
        <div className="space-y-4">
          {resource.misconceptions.map((item, index) => (
            <div
              key={`${item.misconception}-${index}`}
              className="rounded-xl border border-amber-200 bg-amber-50 p-4"
            >
              <p className="font-bold text-amber-950">{item.misconception}</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {item.correction}
              </p>
            </div>
          ))}
        </div>
      </PreviewCard>

      <PreviewCard
        title="Assessment questions"
        icon={<FileQuestion className="h-5 w-5" />}
      >
        <div className="space-y-4">
          {resource.assessmentQuestions.map((question, index) => (
            <details
              key={`${question.question}-${index}`}
              className="rounded-xl border border-slate-200"
            >
              <summary className="cursor-pointer bg-slate-50 px-4 py-4 font-semibold text-slate-900">
                {index + 1}. {question.question} ({question.marks}{" "}
                {question.marks === 1 ? "mark" : "marks"})
              </summary>

              <div className="border-t border-slate-200 px-4 py-4 text-sm leading-7 text-slate-700">
                <strong>Answer:</strong> {question.answer}
              </div>
            </details>
          ))}
        </div>
      </PreviewCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <PreviewCard
          title="Homework"
          icon={<GraduationCap className="h-5 w-5" />}
        >
          <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
            {resource.homework}
          </p>
        </PreviewCard>

        <PreviewCard
          title="Teacher notes"
          icon={<Lightbulb className="h-5 w-5" />}
        >
          <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
            {resource.teacherNotes}
          </p>
        </PreviewCard>
      </div>
    </div>
  );
}

export default function ResourceBuilderForm({
  resourceType,
  initialValues = {},
  prefillVersion = 0,
}: ResourceBuilderFormProps) {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);

  const [resource, setResource] = useState<GeneratedTeachingResource | null>(
    null,
  );

  const [isGenerating, setIsGenerating] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [success, setSuccess] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const previewRef = useRef<HTMLDivElement | null>(null);

  const resolvedResourceType = normaliseResourceType(resourceType);

  const resourceLabel = RESOURCE_LABELS[resolvedResourceType];

  useEffect(() => {
    setForm({
      ...DEFAULT_FORM,
      ...initialValues,
      duration: initialValues.duration ?? DEFAULT_FORM.duration,
      difficulty: initialValues.difficulty ?? DEFAULT_FORM.difficulty,
    });

    setResource(null);
    setError(null);
    setSuccess(null);
    setIsSaved(false);
  }, [resolvedResourceType, initialValues, prefillVersion]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  function updateField<K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError(null);
    setSuccess(null);
  }

  function validateForm(): string | null {
    if (form.topic.trim().length < 2) {
      return "Enter a topic with at least two characters.";
    }

    const duration = Number(form.duration);

    if (!Number.isInteger(duration) || duration < 5 || duration > 180) {
      return "Select a valid duration.";
    }

    return null;
  }

  async function generateResource() {
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    abortControllerRef.current?.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsGenerating(true);
    setError(null);
    setSuccess(null);
    setIsSaved(false);

    try {
      const response = await fetch("/api/teacher/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          resourceType: resolvedResourceType,
          topic: form.topic.trim(),
          yearGroup: form.yearGroup,
          examBoard: form.examBoard,
          duration: Number(form.duration),
          difficulty: form.difficulty,
          objectives: form.objectives.trim(),
          additionalNotes: form.additionalNotes.trim(),
        }),
      });

      const data = (await response.json()) as GenerateResourceResponse;

      if (!response.ok) {
        throw new Error(data.error || "The resource could not be generated.");
      }

      if (!data.resource) {
        throw new Error("The server did not return a resource.");
      }

      setResource(data.resource);

      window.setTimeout(() => {
        previewRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (caughtError) {
      if (
        caughtError instanceof DOMException &&
        caughtError.name === "AbortError"
      ) {
        return;
      }

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The resource could not be generated.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function loadDemoResource() {
    const demoResource = createDemoResource(resolvedResourceType);

    setForm((current) => ({
      ...current,
      topic: "Binary addition",
      yearGroup: "Year 10",
      examBoard: "AQA",
      duration: "60",
      difficulty: "standard",
    }));

    setResource(demoResource);
    setError(null);
    setSuccess(
      "Demo resource loaded. You can now test saving it to Firestore.",
    );
    setIsSaved(false);

    window.setTimeout(() => {
      previewRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }

  async function handleSaveResource() {
    if (!resource) {
      setError("Generate or load a resource first.");
      return;
    }

    const teacher = auth.currentUser;

    if (!teacher) {
      setError("You must be signed in as a teacher to save resources.");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await saveTeacherResource(teacher.uid, resource);

      setIsSaved(true);
      setSuccess("Resource saved successfully to your teacher library.");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The resource could not be saved.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await generateResource();
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <WandSparkles className="h-5 w-5" />
            </div>

            <div>
              <p className="font-bold text-indigo-950">
                Creating: {resourceLabel}
              </p>

              <p className="mt-1 text-sm leading-6 text-indigo-800">
                Generate with GPT-5.6 or load the demo resource to test saving
                without API credits.
              </p>
            </div>
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="assistant-topic" required>
            Topic
          </FieldLabel>

          <input
            id="assistant-topic"
            value={form.topic}
            onChange={(event) => updateField("topic", event.target.value)}
            placeholder="For example: Binary addition"
            maxLength={150}
            disabled={isGenerating}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:bg-slate-100"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <FieldLabel htmlFor="assistant-year" required>
              Year group or qualification
            </FieldLabel>

            <div className="relative">
              <select
                id="assistant-year"
                value={form.yearGroup}
                onChange={(event) =>
                  updateField("yearGroup", event.target.value)
                }
                className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pr-10 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
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
            <FieldLabel htmlFor="assistant-board" required>
              Exam board
            </FieldLabel>

            <div className="relative">
              <select
                id="assistant-board"
                value={form.examBoard}
                onChange={(event) =>
                  updateField("examBoard", event.target.value)
                }
                className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pr-10 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
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
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <FieldLabel htmlFor="assistant-duration" required>
              Duration
            </FieldLabel>

            <select
              id="assistant-duration"
              value={form.duration}
              onChange={(event) => updateField("duration", event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            >
              {DURATIONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel htmlFor="assistant-difficulty" required>
              Difficulty
            </FieldLabel>

            <select
              id="assistant-difficulty"
              value={form.difficulty}
              onChange={(event) =>
                updateField(
                  "difficulty",
                  event.target.value as FormState["difficulty"],
                )
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="foundation">Foundation</option>
              <option value="standard">Standard</option>
              <option value="higher">Higher</option>
            </select>
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="assistant-objectives">
            Learning objectives
          </FieldLabel>

          <textarea
            id="assistant-objectives"
            value={form.objectives}
            onChange={(event) => updateField("objectives", event.target.value)}
            rows={4}
            maxLength={1500}
            placeholder="Leave blank to generate suitable objectives."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <div>
          <FieldLabel htmlFor="assistant-notes">
            Additional instructions
          </FieldLabel>

          <textarea
            id="assistant-notes"
            value={form.additionalNotes}
            onChange={(event) =>
              updateField("additionalNotes", event.target.value)
            }
            rows={4}
            maxLength={2000}
            placeholder="For example: Include SEND scaffolding and an exam-style challenge."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-bold">Action failed</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

            <p className="text-sm font-semibold">{success}</p>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={isGenerating || form.topic.trim().length < 2}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generate {resourceLabel}
                <Send className="h-4 w-4" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={loadDemoResource}
            disabled={isGenerating}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-3.5 text-sm font-bold text-indigo-700 hover:bg-indigo-100"
          >
            <TestTube2 className="h-5 w-5" />
            Load Demo Resource
          </button>
        </div>
      </form>

      <div ref={previewRef} className="scroll-mt-24">
        {isGenerating && !resource && (
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-8 text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-indigo-600" />
            <h3 className="mt-4 text-lg font-bold text-slate-950">
              Creating your resource
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              GPT-5.6 is preparing the lesson content.
            </p>
          </div>
        )}

        {resource && (
          <ResourcePreview
            resource={resource}
            isSaving={isSaving}
            isSaved={isSaved}
            onSave={handleSaveResource}
            onRegenerate={generateResource}
          />
        )}
      </div>
    </div>
  );
}
