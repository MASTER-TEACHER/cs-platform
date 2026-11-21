import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Create a free account",
  description: "Create a free CS Master account for GCSE and A-level Computer Science lessons, quizzes and practice.",
  alternates: { canonical: "/register" },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
