"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";
import SchoolSubscriptionGate from "@/components/billing/SchoolSubscriptionGate";
import IndividualPremiumGate from "@/components/billing/IndividualPremiumGate";

export default function StudentAccessGate({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const csOnlyPaths = ["/programming", "/visualisers", "/a-level-practice", "/nea", "/exam-trainer", "/model-papers", "/adaptive-learning", "/knowledge-map", "/revision-plan"];
  const imediaOnlyPaths = ["/imedia-practice"];


  const {
    user,
    profile,
    loading,
    profileReady,
    profileError,
  } = useAuth();

  const currentSubject = profile?.subject === "CREATIVE_IMEDIA" ? "CREATIVE_IMEDIA" : "COMPUTER_SCIENCE";
  const subjectBlocked = profile?.role === "student" && (
    (currentSubject === "CREATIVE_IMEDIA" && csOnlyPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))) ||
    (currentSubject === "COMPUTER_SCIENCE" && imediaOnlyPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`)))
  );

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!profileReady || !profile) {
      return;
    }

    if (subjectBlocked) { router.replace("/dashboard"); return; }

    if (profile.role === "admin") {
      router.replace("/admin");
      return;
    }

    if (profile.role === "teacher") {
      router.replace("/teacher");
      return;
    }

    if (
      profile.accountIntent === "teacher"
    ) {
      router.replace("/teacher-access");
      return;
    }

    if (
      !profile.onboardingComplete ||
      !profile.qualification ||
      !profile.examBoard
    ) {
      router.replace("/onboarding");
    }
  }, [
    loading,
    user,
    profileReady,
    profile,
    router,
    subjectBlocked,
  ]);

  if (
    loading ||
    (user &&
      !profileReady &&
      !profileError)
  ) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-6 py-12">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

          <p className="mt-4 font-black text-slate-700">
            Preparing your student workspace...
          </p>
        </div>
      </main>
    );
  }

  if (subjectBlocked) return <main className="min-h-[60vh] p-8 text-slate-700">Returning to your selected subject...</main>;

  if (profileError) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-12">
        <section className="rounded-3xl border border-red-200 bg-red-50 p-8">
          <p className="text-sm font-black uppercase tracking-widest text-red-700">
            Student workspace
          </p>

          <h1 className="mt-2 text-3xl font-black text-red-950">
            Your account profile could not be loaded
          </h1>

          <p className="mt-4 leading-7 text-red-800">
            {profileError}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-6 rounded-xl bg-red-700 px-5 py-3 font-black text-white transition hover:bg-red-800"
          >
            Retry
          </button>
        </section>
      </main>
    );
  }

  if (
    !user ||
    !profileReady ||
    !profile ||
    profile.role !== "student" ||
    profile.accountIntent === "teacher" ||
    !profile.onboardingComplete ||
    !profile.qualification ||
    !profile.examBoard
  ) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-6 py-12">
        <p className="font-bold text-slate-600">
          Redirecting to the correct workspace...
        </p>
      </main>
    );
  }

  return (
    <IndividualPremiumGate>
      <SchoolSubscriptionGate>
        {children}
      </SchoolSubscriptionGate>
    </IndividualPremiumGate>
  );
}
