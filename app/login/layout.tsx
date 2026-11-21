import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to CS Master to continue your Computer Science learning.",
  alternates: { canonical: "/login" },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
