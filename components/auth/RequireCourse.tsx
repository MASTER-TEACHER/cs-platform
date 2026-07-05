"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function RequireCourse({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { profile, loading } = useUserProfile();

  useEffect(() => {
    if (loading) return;

    const publicPages = ["/login", "/register", "/onboarding"];
    const isPublicPage = publicPages.includes(pathname);

    if (!isPublicPage && profile && !profile.currentCourse) {
      router.push("/onboarding");
    }
  }, [loading, profile, pathname, router]);

  return <>{children}</>;
}