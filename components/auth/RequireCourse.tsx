"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";

const PUBLIC_ROUTES = [
  "/",
  "/landing",
  "/login",
  "/register",
  "/forgot-password",
  "/auth-test",
  "/teacher-access",
];

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.includes(pathname);
}

function isTeacherRoute(pathname: string) {
  return pathname === "/teacher" || pathname.startsWith("/teacher/");
}

function isAdminRoute(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export default function RequireCourse({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();

  const publicRoute = isPublicRoute(pathname);
  const teacherRoute = isTeacherRoute(pathname);
  const adminRoute = isAdminRoute(pathname);

  const isAdmin = profile?.role === "admin";

  const isTeacher =
    profile?.role === "teacher" || profile?.role === "admin";

  const loading =
    authLoading ||
    (!publicRoute && user !== null && profileLoading);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (publicRoute) {
      return;
    }

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!profile) {
      return;
    }

    // Admin pages are restricted to administrators only.
    if (adminRoute && !isAdmin) {
      router.replace(isTeacher ? "/teacher" : "/dashboard");
      return;
    }

    // Teacher pages are available to teachers and administrators.
    if (teacherRoute && !isTeacher) {
      router.replace("/dashboard");
      return;
    }

    // Teachers and administrators do not need student onboarding.
    if (isTeacher) {
      return;
    }

    // Students must select a course before using protected student pages.
    if (
      pathname !== "/onboarding" &&
      !profile.currentCourse
    ) {
      router.replace("/onboarding");
    }
  }, [
    loading,
    publicRoute,
    user,
    profile,
    adminRoute,
    isAdmin,
    teacherRoute,
    isTeacher,
    pathname,
    router,
  ]);

  if (loading && !publicRoute) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />

          <p className="mt-4 font-semibold text-slate-600">
            Loading CS Master...
          </p>
        </div>
      </main>
    );
  }

  if (!publicRoute && !user) {
    return null;
  }

  if (!publicRoute && user && !profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="font-semibold text-slate-600">
          Loading your profile...
        </p>
      </main>
    );
  }

  if (adminRoute && !isAdmin) {
    return null;
  }

  if (teacherRoute && !isTeacher) {
    return null;
  }

  return <>{children}</>;
}