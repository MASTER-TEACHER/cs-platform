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

/*
 * Public routes can be opened without authentication.
 */
const publicRoutes =
  new Set([
    "/",
    "/landing",
    "/login",
    "/register",
    "/forgot-password",
    "/pricing",
    "/auth-test",
    "/teacher-access",
    "/teacher-verification",

    "/about",
    "/contact",
    "/help",
    "/privacy",
    "/terms",
    "/cookies",
  ]);
/*
 * Routes used while creating or repairing an account.
 */
const accountSetupRoutes =
  new Set([
    "/",
    "/landing",
    "/login",
    "/register",
    "/forgot-password",
    "/auth-test",
  ]);

/*
 * These routes authenticate themselves independently
 * from the currently signed-in CS Master account.
 */
const externallyAccessibleRoutes =
  new Set([
    "/teacher-verification",
  ]);

/*
 * Known student/application route families.
 *
 * This list is important for 404 handling:
 * an unknown pathname must NOT automatically be treated
 * as a protected student route.
 */
const studentRoutePrefixes = [
  "/adaptive-learning",
  "/analytics",
  "/assignments",
  "/dashboard",
  "/exam",
  "/exam-trainer",
  "/join-school",
  "/knowledge-map",
  "/learn",
  "/profile",
  "/programming",
  "/quiz",
  "/resources",
  "/revision-plan",
  "/tutor",
  "/upgrade",
  "/visualisers",
];

function matchesRoutePrefix(
  pathname: string,
  prefix: string,
): boolean {
  return (
    pathname === prefix ||
    pathname.startsWith(
      `${prefix}/`,
    )
  );
}

function isStudentRoute(
  pathname: string,
): boolean {
  return studentRoutePrefixes.some(
    (prefix) =>
      matchesRoutePrefix(
        pathname,
        prefix,
      ),
  );
}

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

  const studentRoute =
    isStudentRoute(
      pathname,
    );

  const teacherAccessRoute =
    pathname ===
    "/teacher-access";

  const onboardingRoute =
    pathname ===
    "/onboarding";

  /*
   * Only recognised CS Master routes should participate
   * in authentication/course redirection.
   *
   * Anything else must be allowed through so Next.js can
   * render app/not-found.tsx with a real 404 response.
   */
  const isKnownApplicationRoute =
    isPublicRoute ||
    isExternallyAccessibleRoute ||
    teacherRoute ||
    adminRoute ||
    studentRoute ||
    teacherAccessRoute ||
    onboardingRoute;

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
   * Unknown routes deliberately bypass all authentication
   * redirects. This allows the root Next.js not-found page
   * to render for signed-out and signed-in users alike.
   */
  if (
    isKnownApplicationRoute &&
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
         * Teacher-applicant accounts are managed by
         * /teacher-access until approval is complete.
         */
        if (
          !teacherAccessRoute
        ) {
          redirectTarget =
            "/teacher-access";
        }
      } else {
        /*
         * Student account.
         */
        if (
          teacherRoute ||
          adminRoute
        ) {
          redirectTarget =
            "/dashboard";
        } else if (
          teacherAccessRoute
        ) {
          /*
           * Student users may deliberately visit the
           * teacher-access application route.
           */
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
          studentRoute &&
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

  /*
   * Unknown paths are intentionally rendered immediately.
   * Next.js supplies app/not-found.tsx as children here.
   */
  if (!isKnownApplicationRoute) {
    return <>{children}</>;
  }

  if (
    isExternallyAccessibleRoute
  ) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <LoadingScreen
        message="Loading CS Master..."
      />
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
      <LoadingScreen
        message="Preparing your account..."
      />
    );
  }

  if (redirectTarget) {
    return (
      <LoadingScreen
        message="Opening the correct portal..."
      />
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
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

        <p className="mt-4 font-black text-slate-700">
          {message}
        </p>
      </div>
    </main>
  );
}