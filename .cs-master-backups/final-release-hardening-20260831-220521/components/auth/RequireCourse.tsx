"use client";

import {
  useEffect,
  type ReactNode,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  useAuth,
} from "@/contexts/AuthContext";

type RequireCourseProps = {
  children: ReactNode;
};

const publicRoutes =
  new Set([
    "/",
    "/landing",
    "/login",
    "/register",
    "/forgot-password",
    "/auth-test",
    "/teacher-access",
    "/teacher-verification",
  ]);

const accountSetupRoutes =
  new Set([
    "/",
    "/landing",
    "/login",
    "/register",
    "/forgot-password",
    "/auth-test",
  ]);

const externallyAccessibleRoutes =
  new Set([
    "/teacher-verification",
  ]);

function isTeacherRoute(
  pathname: string,
): boolean {
  return (
    pathname ===
      "/teacher" ||
    pathname.startsWith(
      "/teacher/",
    )
  );
}

function isAdminRoute(
  pathname: string,
): boolean {
  return (
    pathname ===
      "/admin" ||
    pathname.startsWith(
      "/admin/",
    )
  );
}

export default function RequireCourse({
  children,
}: RequireCourseProps) {
  const router =
    useRouter();

  const pathname =
    usePathname();

  const {
    user,
    profile,
    loading,
    profileReady,
    profileError,
  } =
    useAuth();

  const isPublicRoute =
    publicRoutes.has(
      pathname,
    );

  const isAccountSetupRoute =
    accountSetupRoutes.has(
      pathname,
    );

  const isExternallyAccessibleRoute =
    externallyAccessibleRoutes.has(
      pathname,
    );

  const teacherRoute =
    isTeacherRoute(
      pathname,
    );

  const adminRoute =
    isAdminRoute(
      pathname,
    );

  const teacherAccessRoute =
    pathname ===
    "/teacher-access";

  const onboardingRoute =
    pathname ===
    "/onboarding";

  const curriculumComplete =
    profile?.onboardingComplete ===
      true &&
    Boolean(
      profile.qualification,
    ) &&
    Boolean(
      profile.examBoard,
    );

  const isTeacherApplicant =
    profile?.role ===
      "student" &&
    profile.accountIntent ===
      "teacher";

  let redirectTarget:
    | string
    | null = null;

  /*
   * Token-authenticated routes must remain independent from
   * whichever CS Master account happens to be signed in.
   */
  if (
    !isExternallyAccessibleRoute
  ) {
    if (
      !loading &&
      !user &&
      !isPublicRoute
    ) {
      redirectTarget =
        "/login";
    }

    if (
      !loading &&
      user &&
      profileReady &&
      profile
    ) {
      if (
        profile.role ===
        "admin"
      ) {
        if (!adminRoute) {
          redirectTarget =
            "/admin";
        }
      } else if (
        profile.role ===
        "teacher"
      ) {
        if (
          isAccountSetupRoute ||
          onboardingRoute ||
          adminRoute ||
          teacherAccessRoute
        ) {
          redirectTarget =
            "/teacher";
        }
      } else if (
        isTeacherApplicant
      ) {
        /*
         * All teacher-applicant states are deliberately
         * rendered by /teacher-access:
         *
         * not_submitted
         * pending
         * platform review
         * rejected
         */
        if (
          !teacherAccessRoute
        ) {
          redirectTarget =
            "/teacher-access";
        }
      } else {
        if (
          teacherRoute ||
          adminRoute
        ) {
          redirectTarget =
            "/dashboard";
        } else if (
          teacherAccessRoute
        ) {
          redirectTarget =
            null;
        } else if (
          isAccountSetupRoute
        ) {
          redirectTarget =
            curriculumComplete
              ? "/dashboard"
              : "/onboarding";
        } else if (
          onboardingRoute &&
          curriculumComplete
        ) {
          redirectTarget =
            "/dashboard";
        } else if (
          !onboardingRoute &&
          !curriculumComplete
        ) {
          redirectTarget =
            "/onboarding";
        }
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

  if (
    isExternallyAccessibleRoute
  ) {
    return <>{children}</>;
  }

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
            Your account could not be loaded
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
    (
      !profileReady ||
      !profile
    )
  ) {
    return (
      <LoadingScreen message="Preparing your account..." />
    );
  }

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