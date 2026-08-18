"use client";

import {
  useEffect,
  type ReactNode,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";

type RequireCourseProps = {
  children: ReactNode;
};

const publicRoutes = new Set([
  "/",
  "/landing",
  "/login",
  "/register",
  "/forgot-password",
  "/auth-test",
  "/teacher-access",
]);

function isTeacherRoute(
  pathname: string,
): boolean {
  return (
    pathname === "/teacher" ||
    pathname.startsWith(
      "/teacher/",
    )
  );
}

function isAdminRoute(
  pathname: string,
): boolean {
  return (
    pathname === "/admin" ||
    pathname.startsWith(
      "/admin/",
    )
  );
}

export default function RequireCourse({
  children,
}: RequireCourseProps) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    user,
    profile,
    loading,
    profileReady,
    profileError,
  } = useAuth();

  const isPublicRoute =
    publicRoutes.has(pathname);

  const teacherRoute =
    isTeacherRoute(pathname);

  const adminRoute =
    isAdminRoute(pathname);

  const teacherAccessRoute =
    pathname === "/teacher-access";

  const onboardingRoute =
    pathname === "/onboarding";

  const curriculumComplete =
    profile?.onboardingComplete ===
      true &&
    Boolean(profile.qualification) &&
    Boolean(profile.examBoard);

  const isTeacherApplicant =
    profile?.role === "student" &&
    profile.accountIntent ===
      "teacher";

  let redirectTarget:
    | string
    | null = null;

  /*
   * ---------------------------------------------------------
   * SIGNED OUT
   * ---------------------------------------------------------
   */

  if (
    !loading &&
    !user &&
    !isPublicRoute
  ) {
    redirectTarget = "/login";
  }

  /*
   * ---------------------------------------------------------
   * SIGNED IN + PROFILE READY
   * ---------------------------------------------------------
   */

  if (
    !loading &&
    user &&
    profileReady &&
    profile
  ) {
    /*
     * -------------------------------------------------------
     * ADMIN
     * -------------------------------------------------------
     */

    if (profile.role === "admin") {
      if (!adminRoute) {
        redirectTarget = "/admin";
      }

      /*
       * -----------------------------------------------------
       * APPROVED TEACHER
       * -----------------------------------------------------
       */
    } else if (
      profile.role === "teacher"
    ) {
      if (
        isPublicRoute ||
        onboardingRoute ||
        adminRoute
      ) {
        redirectTarget =
          "/teacher";
      }

      /*
       * -----------------------------------------------------
       * TEACHER APPLICANT
       *
       * SECURITY:
       *
       * A teacher applicant deliberately keeps role="student"
       * until an administrator approves the request.
       *
       * accountIntent="teacher" therefore takes precedence
       * over normal student curriculum routing.
       *
       * This prevents teacher applicants from ever being
       * forced through GCSE/A-level student onboarding.
       * -----------------------------------------------------
       */
    } else if (
      isTeacherApplicant
    ) {
      if (!teacherAccessRoute) {
        redirectTarget =
          "/teacher-access";
      }

      /*
       * -----------------------------------------------------
       * STANDARD STUDENT
       * -----------------------------------------------------
       */
    } else {
      /*
       * A normal student is never allowed into protected
       * teacher or admin routes.
       */
      if (
        teacherRoute ||
        adminRoute
      ) {
        redirectTarget =
          "/dashboard";

        /*
         * Keep /teacher-access available to an existing
         * student who deliberately wants to request a
         * teacher-account upgrade.
         */
      } else if (
        teacherAccessRoute
      ) {
        redirectTarget = null;

        /*
         * Other public authentication/setup routes should
         * return a signed-in student to the appropriate
         * student destination.
         */
      } else if (isPublicRoute) {
        redirectTarget =
          curriculumComplete
            ? "/dashboard"
            : "/onboarding";

        /*
         * Completed students no longer need onboarding.
         */
      } else if (
        onboardingRoute &&
        curriculumComplete
      ) {
        redirectTarget =
          "/dashboard";

        /*
         * Incomplete students must complete curriculum setup
         * before using the main student application.
         */
      } else if (
        !onboardingRoute &&
        !curriculumComplete
      ) {
        redirectTarget =
          "/onboarding";
      }
    }
  }

  useEffect(() => {
    if (redirectTarget) {
      router.replace(
        redirectTarget,
      );
    }
  }, [
    redirectTarget,
    router,
  ]);

  if (loading) {
    return (
      <LoadingScreen message="Loading CS Master..." />
    );
  }

  if (profileError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
        <section className="w-full max-w-xl rounded-3xl border border-red-200 bg-red-50 p-8">
          <h1 className="text-2xl font-black text-red-950">
            Your account could
            not be loaded
          </h1>

          <p className="mt-3 text-red-800">
            {profileError}
          </p>
        </section>
      </main>
    );
  }

  if (
    user &&
    (!profileReady || !profile)
  ) {
    return (
      <LoadingScreen message="Preparing your account..." />
    );
  }

  /*
   * Never briefly render content belonging to the wrong
   * portal while Next.js completes the redirect.
   */
  if (redirectTarget) {
    return (
      <LoadingScreen message="Opening the correct portal..." />
    );
  }

  return <>{children}</>;
}

function LoadingScreen({
  message,
}: {
  message: string;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="text-center">
        <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

        <p className="mt-4 font-bold text-slate-700">
          {message}
        </p>
      </div>
    </main>
  );
}