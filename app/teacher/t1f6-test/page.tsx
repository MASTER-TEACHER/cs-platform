"use client";

import {
  useState,
} from "react";

import { useAuth } from "@/contexts/AuthContext";

import {
  saveTeacherResource,
  type GeneratedTeachingResource,
} from "@/services/teacherResourceService";

export default function T1F6TestPage() {
  const {
    user,
    profile,
    loading,
  } = useAuth();

  const [teacherLabel, setTeacherLabel] =
    useState("TEACHER-A");

  const [creating, setCreating] =
    useState(false);

  const [message, setMessage] =
    useState("");

  async function createTestResource() {
    if (!user?.uid) {
      setMessage(
        "No authenticated teacher account was found.",
      );

      return;
    }

    const cleanedLabel =
      teacherLabel
        .trim()
        .toUpperCase()
        .replace(
          /[^A-Z0-9-]/g,
          "-",
        );

    if (!cleanedLabel) {
      setMessage(
        "Enter a teacher label such as TEACHER-A.",
      );

      return;
    }

    const title =
      `T1F6-${cleanedLabel}-PRIVATE-RESOURCE`;

    const sourceId =
      `t1f6-${cleanedLabel.toLowerCase()}-${Date.now()}`;

    const resource:
      GeneratedTeachingResource = {
        id:
          sourceId,

        title,

        resourceType:
          "lesson",

        topic:
          "Ownership Test",

        yearGroup:
          "Year 10",

        examBoard:
          "AQA",

        duration:
          "30 minutes",

        difficulty:
          "standard",

        overview:
          "Temporary resource for T1F-6 teacher ownership and isolation testing.",

        learningObjectives: [
          "Verify that teacher-created content remains private to its owning teacher.",
        ],

        successCriteria: [
          "The owning teacher can see this resource.",
          "Another teacher cannot see this resource.",
        ],

        keywords: [
          "ownership",
          "isolation",
          "testing",
        ],

        priorKnowledge: [],

        sections: [],

        differentiation: {
          support: [],
          core: [],
          stretch: [],
        },

        misconceptions: [],

        assessmentQuestions: [],

        homework:
          "",

        teacherNotes:
          "Temporary T1F-6 test resource. Delete after ownership testing is complete.",

        createdAt:
          new Date().toISOString(),
      };

    try {
      setCreating(true);
      setMessage("");

      const documentId =
        await saveTeacherResource(
          user.uid,
          resource,
        );

      setMessage(
        `SUCCESS: ${title} created for UID ${user.uid}. Firestore document: ${documentId}`,
      );
    } catch (error) {
      console.error(
        "Unable to create T1F-6 test resource:",
        error,
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "The test resource could not be created.",
      );
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return (
      <main className="p-8">
        <p className="font-semibold text-slate-700">
          Loading teacher account...
        </p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="p-8">
        <p className="font-bold text-red-600">
          Sign in before using the T1F-6 test page.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="rounded-3xl bg-gradient-to-r from-slate-950 to-violet-800 p-8 text-white shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-200">
            T1F-6 · Development Test
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Teacher Ownership Test Data
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-slate-200">
            Creates a correctly structured teaching resource
            using the currently authenticated Firebase teacher
            account. No AI quota is used.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">
            Current authenticated account
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase text-slate-500">
                Name
              </p>

              <p className="mt-1 font-bold text-slate-950">
                {profile?.name || "Teacher"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase text-slate-500">
                Email
              </p>

              <p className="mt-1 break-all font-bold text-slate-950">
                {user.email || "No email"}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase text-slate-500">
              Firebase UID
            </p>

            <p className="mt-1 break-all font-mono text-sm font-bold text-slate-950">
              {user.uid}
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-teal-200 bg-white p-6 shadow-sm">
          <label
            htmlFor="teacherLabel"
            className="text-sm font-bold text-slate-900"
          >
            Test teacher label
          </label>

          <input
            id="teacherLabel"
            type="text"
            value={teacherLabel}
            onChange={(event) =>
              setTeacherLabel(
                event.target.value,
              )
            }
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-semibold outline-none focus:border-teal-500"
            placeholder="TEACHER-A"
          />

          <p className="mt-3 text-sm text-slate-600">
            This will create:
          </p>

          <p className="mt-1 font-mono font-bold text-violet-700">
            T1F6-
            {teacherLabel
              .trim()
              .toUpperCase()
              .replace(
                /[^A-Z0-9-]/g,
                "-",
              ) || "TEACHER-A"}
            -PRIVATE-RESOURCE
          </p>

          <button
            type="button"
            onClick={
              createTestResource
            }
            disabled={creating}
            className="mt-6 rounded-xl bg-teal-600 px-5 py-3 font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating
              ? "Creating..."
              : "Create test resource"}
          </button>

          {message ? (
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="break-words text-sm font-semibold text-slate-800">
                {message}
              </p>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}