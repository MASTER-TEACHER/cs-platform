"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Card from "@/components/ui/Card";
import { useAuth } from "@/contexts/AuthContext";

import { acceptSchoolInviteWithBilling } from "@/services/billingClientService";

type ClassJoinResponse = {
  success?: boolean;
  alreadyJoined?: boolean;
  classId?: string;
  className?: string;
  schoolId?: string;
  error?: string;
};

function normaliseCode(value: string): string {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 10);
}

export default function JoinSchoolPage() {
  const router = useRouter();

  const {
    user,
    profile,
    refreshProfile,
  } = useAuth();

  const [
    schoolCode,
    setSchoolCode,
  ] = useState("");

  const [
    classCode,
    setClassCode,
  ] = useState("");

  const [
    joiningSchool,
    setJoiningSchool,
  ] = useState(false);

  const [
    joiningClass,
    setJoiningClass,
  ] = useState(false);

  async function handleJoinSchool() {
    if (!user?.uid) {
      toast.error(
        "Sign in before joining a school.",
      );
      return;
    }

    try {
      setJoiningSchool(true);

      const result =
        await acceptSchoolInviteWithBilling(
          schoolCode,
        );

      const refreshed =
        await refreshProfile();

      toast.success(
        "You have joined the school successfully.",
      );

      if (
        refreshed?.role === "teacher" ||
        result.role === "teacher"
      ) {
        router.replace(
          "/teacher/school",
        );
      } else {
        router.replace(
          "/dashboard",
        );
      }

      router.refresh();
    } catch (error) {
      console.error(
        "Unable to join school:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "You could not join the school.",
      );
    } finally {
      setJoiningSchool(false);
    }
  }

  async function handleJoinClass() {
    if (!user?.uid) {
      toast.error(
        "Sign in before joining a class.",
      );
      return;
    }

    if (
      profile?.role !== "student"
    ) {
      toast.error(
        "Only student accounts can join a class with a class code.",
      );
      return;
    }

    try {
      setJoiningClass(true);

      const token =
        await user.getIdToken(
          true,
        );

      const response =
        await fetch(
          "/api/classes/join",
          {
            method: "POST",
            headers: {
              Authorization:
                `Bearer ${token}`,
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              code:
                classCode,
            }),
          },
        );

      const result =
        (await response.json()) as
          ClassJoinResponse;

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.error ||
            "You could not join this class.",
        );
      }

      await refreshProfile();

      toast.success(
        result.alreadyJoined
          ? `You are already enrolled in ${result.className || "this class"}.`
          : `Joined ${result.className || "class"} successfully.`,
      );

      setClassCode("");

      router.replace(
        "/dashboard",
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Unable to join class:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "You could not join this class.",
      );
    } finally {
      setJoiningClass(false);
    }
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-amber-700">
            Sign in required
          </p>

          <h1 className="mt-3 text-3xl font-black text-amber-950">
            Sign in to continue
          </h1>

          <p className="mt-3 leading-7 text-amber-800">
            School and class join codes are attached to your authenticated
            CS Master account.
          </p>

          <Link
            href="/login"
            className="mt-5 inline-flex rounded-xl bg-slate-950 px-6 py-3 font-black text-white"
          >
            Sign in
          </Link>
        </Card>
      </div>
    );
  }

  /*
   * Students always get the reusable class-code workflow.
   * If they are not already attached to a school, a valid class code
   * can attach them to the class's school and the class in one step.
   */
  if (
    profile?.role === "student"
  ) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Card className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-blue-700">
            Class membership
          </p>

          <h1 className="mt-3 text-3xl font-black text-slate-950">
            Join a class
          </h1>

          <p className="mt-3 leading-7 text-slate-600">
            Enter the permanent class code shared by your teacher. The same code
            can be used by every student in the class and remains active until
            the teacher disables or regenerates it.
          </p>

          {!profile?.schoolId ? (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">
              You are not linked to a school yet. A valid class code will attach
              your student account to that class&apos;s school and enrol you in
              the class in one step.
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">
              Your school membership is active. The class code must belong to a
              class in the same school.
            </div>
          )}
        </Card>

        <Card className="rounded-3xl border border-slate-200 p-7">
          <label className="block">
            <span className="text-sm font-bold text-slate-700">
              Permanent class code
            </span>

            <input
              type="text"
              value={classCode}
              onChange={(event) =>
                setClassCode(
                  normaliseCode(
                    event.target.value,
                  ),
                )
              }
              placeholder="ABCD2345"
              maxLength={10}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-4 font-mono text-2xl font-black uppercase tracking-[0.16em] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <button
            type="button"
            onClick={() =>
              void handleJoinClass()
            }
            disabled={
              joiningClass ||
              classCode.length < 6
            }
            className="mt-5 w-full rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {joiningClass
              ? "Joining class..."
              : "Join class"}
          </button>
        </Card>

        {!profile?.schoolId ? (
          <Card className="rounded-3xl border border-slate-200 bg-white p-7">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">
              School-only invitation
            </p>

            <h2 className="mt-2 text-xl font-black text-slate-950">
              Join a school without joining a class
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Use this only if your school has given you a separate single-use
              student school invitation code.
            </p>

            <input
              type="text"
              value={schoolCode}
              onChange={(event) =>
                setSchoolCode(
                  normaliseCode(
                    event.target.value,
                  ).slice(0, 8),
                )
              }
              placeholder="ABCDEFGH"
              maxLength={8}
              className="mt-5 w-full rounded-xl border border-slate-300 px-4 py-3 font-mono text-xl font-black uppercase tracking-[0.14em]"
            />

            <button
              type="button"
              onClick={() =>
                void handleJoinSchool()
              }
              disabled={
                joiningSchool ||
                schoolCode.length < 6
              }
              className="mt-4 rounded-xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-800 disabled:opacity-50"
            >
              {joiningSchool
                ? "Joining school..."
                : "Use school invitation code"}
            </button>
          </Card>
        ) : null}
      </div>
    );
  }

  /*
   * Approved teachers without a school use the same route for the
   * existing single-use teacher school-invitation workflow.
   */
  if (profile?.schoolId) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-emerald-700">
            School membership active
          </p>

          <h1 className="mt-3 text-3xl font-black text-emerald-950">
            You already belong to a school
          </h1>

          <p className="mt-3 leading-7 text-emerald-800">
            Your account is already attached to a CS Master school organisation.
            A transfer workflow will be added separately rather than allowing one
            join code to silently move you between schools.
          </p>

          {profile?.role === "teacher" ? (
            <Link
              href="/teacher/school"
              className="mt-5 inline-flex rounded-xl bg-emerald-700 px-5 py-3 font-black text-white"
            >
              Open school workspace
            </Link>
          ) : null}
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
        <p className="text-sm font-black uppercase tracking-[0.14em] text-blue-700">
          School membership
        </p>

        <h1 className="mt-3 text-3xl font-black text-slate-950">
          Join your school
        </h1>

        <p className="mt-3 leading-7 text-slate-600">
          Enter the single-use school invitation code provided by your school.
          Approved teachers use teacher invitation codes. This school code is
          separate from the permanent reusable code attached to each class.
        </p>

        {profile?.role === "teacher" && (
          <div className="mt-5 rounded-2xl border border-violet-200 bg-violet-50 p-4 text-sm leading-6 text-violet-800">
            Your teacher account is approved. Ask the school administrator or an
            authorised teacher at the school to generate a Teacher Join Code from
            Teacher → School → Invitations.
          </div>
        )}
      </Card>

      <Card className="rounded-3xl border border-slate-200 p-7">
        <label className="block">
          <span className="text-sm font-bold text-slate-700">
            School invitation code
          </span>

          <input
            type="text"
            value={schoolCode}
            onChange={(event) =>
              setSchoolCode(
                normaliseCode(
                  event.target.value,
                ).slice(0, 8),
              )
            }
            placeholder="ABCDEFGH"
            maxLength={8}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-4 font-mono text-2xl font-black uppercase tracking-[0.16em] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <button
          type="button"
          onClick={() =>
            void handleJoinSchool()
          }
          disabled={
            joiningSchool ||
            schoolCode.length < 6
          }
          className="mt-5 w-full rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {joiningSchool
            ? "Joining school..."
            : "Join school"}
        </button>
      </Card>
    </div>
  );
}
