"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Card from "@/components/ui/Card";
import { useAuth } from "@/contexts/AuthContext";

import { acceptSchoolInviteWithBilling } from "@/services/billingClientService";

export default function JoinSchoolPage() {
  const router = useRouter();

  const {
    user,
    profile,
    refreshProfile,
  } = useAuth();

  const [code, setCode] =
    useState("");

  const [joining, setJoining] =
    useState(false);

  async function handleJoin() {
    if (!user?.uid) {
      toast.error(
        "Sign in before joining a school.",
      );
      return;
    }

    try {
      setJoining(true);

      const result =
        await acceptSchoolInviteWithBilling(
          code,
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
      setJoining(false);
    }
  }

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
          Enter the single-use code provided by your school. Your existing
          lessons, quiz results, XP, analytics and personal plan history remain
          attached to this same CS Master account.
        </p>
      </Card>

      <Card className="rounded-3xl border border-slate-200 p-7">
        <label className="block">
          <span className="text-sm font-bold text-slate-700">
            School join code
          </span>

          <input
            type="text"
            value={code}
            onChange={(event) =>
              setCode(
                event.target.value
                  .toUpperCase()
                  .replace(
                    /[^A-Z0-9]/g,
                    "",
                  )
                  .slice(0, 8),
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
            void handleJoin()
          }
          disabled={
            joining ||
            code.length < 6
          }
          className="mt-5 w-full rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {joining
            ? "Joining school..."
            : "Join school"}
        </button>
      </Card>
    </div>
  );
}
