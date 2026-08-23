"use client";

import { useEffect, useState } from "react";

import Card from "@/components/ui/Card";
import { useAuth } from "@/contexts/AuthContext";
import { getSchoolById } from "@/services/schoolService";

export default function AccountMembershipCard() {
  const {
    profile,
    loading,
    profileReady,
  } = useAuth();

  const [schoolName, setSchoolName] =
    useState("");

  const [schoolLoading, setSchoolLoading] =
    useState(false);

  const schoolId =
    profile?.schoolId?.trim() || "";

  useEffect(() => {
    let cancelled = false;

    async function loadSchool() {
      if (!schoolId) {
        setSchoolName("");
        return;
      }

      try {
        setSchoolLoading(true);

        const school =
          await getSchoolById(
            schoolId,
          );

        if (!cancelled) {
          setSchoolName(
            school?.name ||
              "Your school",
          );
        }
      } catch (error) {
        console.error(
          "Unable to load school membership:",
          error,
        );

        if (!cancelled) {
          setSchoolName(
            "Your school",
          );
        }
      } finally {
        if (!cancelled) {
          setSchoolLoading(false);
        }
      }
    }

    void loadSchool();

    return () => {
      cancelled = true;
    };
  }, [schoolId]);

  if (
    loading ||
    !profileReady ||
    !profile
  ) {
    return null;
  }

  const qualification =
    profile.qualification
      ? profile.qualification ===
        "A_LEVEL"
        ? "A Level"
        : "GCSE"
      : "";

  const examBoard =
    profile.examBoard || "";

  const curriculum =
    [examBoard, qualification]
      .filter(Boolean)
      .join(" · ");

  if (
    profile.accountType ===
      "school" &&
    schoolId
  ) {
    return (
      <Card className="rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-6">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-teal-700">
              School membership
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-950">
              {schoolLoading
                ? "Loading school..."
                : schoolName}
            </h2>

            <p className="mt-2 text-sm font-semibold text-teal-800">
              Active student membership
              {curriculum
                ? ` · ${curriculum}`
                : ""}
            </p>
          </div>

          <div className="grid min-w-[260px] grid-cols-2 gap-3">
            <MembershipMetric
              label="Account"
              value="School"
            />

            <MembershipMetric
              label="Access"
              value="School plan"
            />
          </div>
        </div>

        <p className="mt-5 rounded-2xl border border-teal-100 bg-white/70 px-4 py-3 text-sm leading-6 text-slate-600">
          Your learning history remains attached to your CS Master account.
          School membership allows your school to add you to classes,
          assignments and school analytics.
        </p>
      </Card>
    );
  }

  const plan =
    profile.personalPlan ===
    "premium"
      ? "Premium"
      : "Free";

  return (
    <Card className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">
            Account membership
          </p>

          <h2 className="mt-2 text-2xl font-black text-slate-950">
            Individual learner
          </h2>

          <p className="mt-2 text-sm font-semibold text-blue-800">
            {plan} plan
            {curriculum
              ? ` · ${curriculum}`
              : ""}
          </p>
        </div>

        <div className="grid min-w-[260px] grid-cols-2 gap-3">
          <MembershipMetric
            label="Account"
            value="Individual"
          />

          <MembershipMetric
            label="Plan"
            value={plan}
          />
        </div>
      </div>
    </Card>
  );
}

function MembershipMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/80 bg-white/80 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}
