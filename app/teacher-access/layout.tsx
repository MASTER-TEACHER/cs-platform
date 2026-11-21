import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Teacher access",
  description: "Apply for a CS Master teacher account to set work, track classes and use the AI marking tools.",
  alternates: { canonical: "/teacher-access" },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
