"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AlertTriangle, Loader2, ShieldCheck } from "lucide-react";

import Card from "@/components/ui/Card";
import { useAuth } from "@/contexts/AuthContext";

export default function TeacherAccessGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, loading, profileReady, profileError } = useAuth();

  const authorised = profile?.role === "teacher" || profile?.role === "admin";

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, pathname, router, user]);

  if (loading || (user && !profileReady && !profileError)) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-9 w-9 animate-spin text-teal-600" />
          <p className="mt-4 font-bold text-slate-700">Loading teacher workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (profileError) {
    return (
      <Card className="mx-auto max-w-2xl rounded-3xl border border-red-200 bg-red-50 p-7">
        <div className="flex items-start gap-4">
          <AlertTriangle className="mt-1 h-6 w-6 shrink-0 text-red-700" />
          <div>
            <h1 className="text-xl font-black text-red-950">Teacher profile unavailable</h1>
            <p className="mt-2 text-sm leading-6 text-red-800">{profileError}</p>
            <Link href="/login" className="mt-5 inline-flex rounded-xl bg-red-700 px-5 py-3 text-sm font-black text-white">
              Return to sign in
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  if (!authorised) {
    return (
      <Card className="mx-auto max-w-2xl rounded-3xl border border-amber-200 bg-amber-50 p-7">
        <div className="flex items-start gap-4">
          <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-amber-700" />
          <div>
            <h1 className="text-xl font-black text-amber-950">Teacher access required</h1>
            <p className="mt-2 text-sm leading-6 text-amber-800">
              This workspace is available only to approved teacher or administrator accounts.
            </p>
            <Link href="/dashboard" className="mt-5 inline-flex rounded-xl bg-amber-700 px-5 py-3 text-sm font-black text-white">
              Return to dashboard
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  return <>{children}</>;
}
