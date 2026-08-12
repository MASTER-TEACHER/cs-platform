"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";

import AssistantChat from "@/components/teacher/assistant/AssistantChat";
import ResourceBuilderForm, {
  type ResourceBuilderInitialValues,
} from "@/components/teacher/assistant/ResourceBuilderForm";
import Card from "@/components/ui/Card";
import type {
  AssistantAction,
  AssistantResourceType,
  ResourceBuilderAction,
} from "@/types/assistant";

type ResourceType =
  | "lesson-plan"
  | "starter"
  | "retrieval-quiz"
  | "worksheet"
  | "homework"
  | "exit-ticket";

const resourceOptions: {
  id: ResourceType;
  title: string;
  description: string;
  icon: string;
}[] = [
  {
    id: "lesson-plan",
    title: "Complete Lesson Plan",
    description:
      "Generate objectives, activities, assessment, differentiation and homework.",
    icon: "📘",
  },
  {
    id: "starter",
    title: "Starter Activity",
    description:
      "Create a focused opening activity to activate prior knowledge.",
    icon: "🚀",
  },
  {
    id: "retrieval-quiz",
    title: "Retrieval Quiz",
    description:
      "Generate low-stakes questions with answers and misconceptions.",
    icon: "🧠",
  },
  {
    id: "worksheet",
    title: "Student Worksheet",
    description: "Produce structured tasks, examples and independent practice.",
    icon: "📝",
  },
  {
    id: "homework",
    title: "Homework Task",
    description:
      "Create purposeful homework with challenge and success criteria.",
    icon: "🏠",
  },
  {
    id: "exit-ticket",
    title: "Exit Ticket",
    description: "Generate quick assessment questions for the end of a lesson.",
    icon: "🎟️",
  },
];

function isResourceType(value: AssistantResourceType): value is ResourceType {
  return resourceOptions.some((option) => option.id === value);
}

function createBuilderInitialValues(
  action: ResourceBuilderAction,
): ResourceBuilderInitialValues {
  return {
    topic: action.topic,
    yearGroup: action.yearGroup,
    examBoard: action.examBoard,
    duration: String(action.duration),
    difficulty: action.difficulty,
    objectives: action.objectives,
    additionalNotes: action.additionalNotes,
  };
}

export default function TeacherAssistantPage() {
  const router = useRouter();
  const builderSectionRef = useRef<HTMLElement | null>(null);
  const [selectedResource, setSelectedResource] =
    useState<ResourceType>("lesson-plan");
  const [builderInitialValues, setBuilderInitialValues] =
    useState<ResourceBuilderInitialValues>({});
  const [prefillVersion, setPrefillVersion] = useState(0);
  const [copilotNotice, setCopilotNotice] = useState("");

  const selectedOption = useMemo(
    () =>
      resourceOptions.find((option) => option.id === selectedResource) ??
      resourceOptions[0],
    [selectedResource],
  );

  const scrollToBuilder = useCallback(() => {
    window.setTimeout(() => {
      builderSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }, []);

  const handleAssistantAction = useCallback(
    (action: AssistantAction) => {
      if (action.type === "open-resource-builder") {
        if (!isResourceType(action.resourceType)) {
          setCopilotNotice(
            "The requested resource type is not supported by the builder.",
          );
          return;
        }

        setSelectedResource(action.resourceType);
        setBuilderInitialValues(createBuilderInitialValues(action));
        setPrefillVersion((current) => current + 1);
        setCopilotNotice(
          `${action.topic} has been loaded into the Resource Builder. Review the settings, then generate the resource.`,
        );
        scrollToBuilder();
        return;
      }

      const parameters = new URLSearchParams({
        topic: action.topic,
        qualification: action.qualification,
        examBoard: action.examBoard,
        difficulty: action.difficulty,
        questionCount: String(action.questionCount),
      });

      router.push(`/teacher/quiz-generator?${parameters.toString()}`);
    },
    [router, scrollToBuilder],
  );

  function handleManualResourceSelection(resourceType: ResourceType) {
    setSelectedResource(resourceType);
    setBuilderInitialValues({});
    setPrefillVersion((current) => current + 1);
    setCopilotNotice("");
  }

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-3xl bg-slate-950 px-6 py-10 text-white shadow-xl sm:px-10">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-teal-400/10 px-4 py-2 text-sm font-bold text-teal-300">
              CS Master Copilot
            </span>
            <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-5xl">
              Plan, create and teach with intelligent support
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Chat with your AI teaching assistant, create structured Computer
              Science resources and save approved content directly to your
              library.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#copilot"
                className="rounded-xl bg-teal-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-teal-300"
              >
                Ask Copilot
              </Link>
              <Link
                href="#resource-builder"
                className="rounded-xl border border-slate-700 px-5 py-3 font-bold text-white transition hover:border-slate-500 hover:bg-slate-900"
              >
                Build a resource
              </Link>
              <Link
                href="/teacher/quiz-generator"
                className="rounded-xl border border-slate-700 px-5 py-3 font-bold text-white transition hover:border-slate-500 hover:bg-slate-900"
              >
                Quiz Generator
              </Link>
            </div>
          </div>

          <div className="grid w-full max-w-md grid-cols-2 gap-3">
            <HeroMetric value="7" label="Assistant modes" />
            <HeroMetric value="6" label="Resource types" />
            <HeroMetric value="24/7" label="Teaching support" />
            <HeroMetric value="Demo" label="No-credit mode" />
          </div>
        </div>
      </section>

      <div id="copilot" className="scroll-mt-24">
        <AssistantChat onAction={handleAssistantAction} />
      </div>

      <section>
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-indigo-600">
            Structured generation
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            What would you like to create?
          </h2>
          <p className="mt-2 text-slate-600">
            Use the structured builder when you need a complete, editable
            resource that can be saved to your teacher library.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {resourceOptions.map((option) => {
            const selected = option.id === selectedResource;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleManualResourceSelection(option.id)}
                className={`rounded-3xl border p-6 text-left transition ${selected ? "border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-100" : "border-slate-200 bg-white hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg"}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                    {option.icon}
                  </div>
                  {selected && (
                    <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white">
                      Selected
                    </span>
                  )}
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {option.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <section
        ref={builderSectionRef}
        id="resource-builder"
        className="grid scroll-mt-24 grid-cols-1 gap-6 xl:grid-cols-3"
      >
        <div className="xl:col-span-2">
          <Card>
            <p className="text-sm font-bold uppercase tracking-wide text-teal-600">
              Resource Builder
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              {selectedOption.title}
            </h2>
            <p className="mt-2 text-slate-600">
              Configure the resource so the assistant can generate content that
              matches your learners and curriculum.
            </p>

            {copilotNotice && (
              <div className="mt-6 rounded-2xl border border-teal-200 bg-teal-50 p-4 text-sm font-semibold text-teal-800">
                {copilotNotice}
              </div>
            )}

            <div className="mt-8">
              <ResourceBuilderForm
                resourceType={selectedResource}
                initialValues={builderInitialValues}
                prefillVersion={prefillVersion}
              />
            </div>
          </Card>
        </div>

        <Card>
          <p className="text-sm font-bold uppercase tracking-wide text-violet-600">
            Included in structured resources
          </p>
          <div className="mt-5 space-y-4">
            <FeatureItem
              icon="🎯"
              title="Clear objectives"
              text="Measurable outcomes linked to the selected topic."
            />
            <FeatureItem
              icon="🧩"
              title="Structured activities"
              text="Teacher instruction, modelling, practice and plenary."
            />
            <FeatureItem
              icon="📊"
              title="Assessment checks"
              text="Questions that reveal understanding and misconceptions."
            />
            <FeatureItem
              icon="🌱"
              title="Differentiation"
              text="Support, core and stretch for varied learners."
            />
            <FeatureItem
              icon="✏️"
              title="Editable output"
              text="Review and adapt generated content before publishing."
            />
          </div>
        </Card>
      </section>
    </div>
  );
}

function HeroMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-2xl font-black text-teal-300">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-300">{label}</p>
    </div>
  );
}

function FeatureItem({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4 rounded-2xl bg-slate-50 p-4">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="font-bold text-slate-900">{title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
      </div>
    </div>
  );
}
