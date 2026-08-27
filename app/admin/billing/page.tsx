"use client";

import {
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";

import Card from "@/components/ui/Card";
import {
  auth,
} from "@/lib/firebase";

type BillingRow = {
  schoolId: string;
  schoolName: string;
  status: string;
  planKey: string | null;
  seatLimit: number;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
};

export default function AdminBillingPage() {
  const [
    rows,
    setRows,
  ] =
    useState<BillingRow[]>(
      [],
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const user =
          auth.currentUser;

        if (!user) {
          throw new Error(
            "Admin sign-in required.",
          );
        }

        const response =
          await fetch(
            "/api/admin/billing",
            {
              headers: {
                Authorization:
                  `Bearer ${await user.getIdToken()}`,
              },
              cache:
                "no-store",
            },
          );

        const data =
          (await response.json()) as {
            subscriptions?: BillingRow[];
            error?: string;
          };

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Billing data could not be loaded.",
          );
        }

        if (!cancelled) {
          setRows(
            data.subscriptions ||
              [],
          );
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Billing data could not be loaded.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-slate-950 to-indigo-950 text-white">
        <p className="text-sm font-black uppercase tracking-widest text-indigo-200">
          Platform administration
        </p>
        <h1 className="mt-3 text-4xl font-black">
          School subscriptions
        </h1>
        <p className="mt-3 text-indigo-100">
          Read-only commercial visibility across Stripe-linked CS Master schools.
        </p>
      </Card>

      <Card>
        {loading ? (
          <p className="font-bold text-slate-600">
            Loading subscriptions...
          </p>
        ) : rows.length === 0 ? (
          <p className="text-slate-600">
            No Stripe school subscriptions have been created yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="p-3">School</th>
                  <th className="p-3">Plan</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Seat limit</th>
                  <th className="p-3">Stripe subscription</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(
                  (row) => (
                    <tr
                      key={row.schoolId}
                      className="border-b last:border-0"
                    >
                      <td className="p-3 font-bold text-slate-950">
                        {row.schoolName}
                      </td>
                      <td className="p-3 capitalize">
                        {row.planKey || "None"}
                      </td>
                      <td className="p-3 capitalize">
                        {row.status.replace(/_/g, " ")}
                      </td>
                      <td className="p-3">
                        {row.seatLimit}
                      </td>
                      <td className="p-3 font-mono text-xs">
                        {row.stripeSubscriptionId || "Not created"}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}