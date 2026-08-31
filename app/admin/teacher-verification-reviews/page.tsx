"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  auth,
} from "@/lib/firebase";

type Review = {
  id: string;

  userId: string;

  teacherName: string;
  teacherEmail: string;

  schoolName: string;
  schoolAdminEmail: string;

  jobTitle: string;
  message: string;

  teacherDomain: string;
  administratorDomain: string;

  verificationRisk: string;

  platformReviewReason: string;

  requestedAt:
    | string
    | null;

  schoolVerifiedAt:
    | string
    | null;
};

type ReviewListResponse = {
  success?: boolean;
  reviews?: Review[];
  error?: string;
};

type ReviewDecision =
  | "approve"
  | "reject";

type PendingDecision = {
  review: Review;
  decision: ReviewDecision;
} | null;

function formatDate(
  value:
    | string
    | null,
): string {
  if (!value) {
    return "Not recorded";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "Not recorded";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      dateStyle:
        "medium",

      timeStyle:
        "short",
    },
  ).format(date);
}

function riskLabel(
  risk: string,
): string {
  switch (risk) {
    case "personal_email_domain":
      return "Personal email domain";

    case "domain_mismatch":
      return "Domain mismatch";

    case "invalid_email_domain":
      return "Invalid email domain";

    case "same_organisation_domain":
      return "Same organisation domain";

    default:
      return (
        risk ||
        "Manual review"
      );
  }
}

export default function TeacherVerificationReviewsPage() {
  const [
    reviews,
    setReviews,
  ] =
    useState<Review[]>(
      [],
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    processingId,
    setProcessingId,
  ] =
    useState("");

  const [
    notes,
    setNotes,
  ] =
    useState<
      Record<
        string,
        string
      >
    >({});

  const [
    pendingDecision,
    setPendingDecision,
  ] =
    useState<PendingDecision>(
      null,
    );

  const loadReviews =
    useCallback(
      async () => {
        const user =
          auth.currentUser;

        if (!user) {
          setLoading(
            false,
          );

          return;
        }

        try {
          setLoading(
            true,
          );

          const token =
            await user.getIdToken(
              true,
            );

          const response =
            await fetch(
              "/api/admin/teacher-verification-reviews",
              {
                method:
                  "GET",

                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },

                cache:
                  "no-store",
              },
            );

          const result =
            (await response.json()) as
              ReviewListResponse;

          if (
            !response.ok
          ) {
            throw new Error(
              result.error ||
                "Teacher reviews could not be loaded.",
            );
          }

          setReviews(
            result.reviews ??
              [],
          );
        } catch (error) {
          console.error(
            "Teacher verification review loading error:",
            error,
          );

          toast.error(
            error instanceof Error
              ? error.message
              : "Teacher reviews could not be loaded.",
          );
        } finally {
          setLoading(
            false,
          );
        }
      },
      [],
    );

  useEffect(() => {
    const timer =
      window.setTimeout(
        () => {
          void loadReviews();
        },
        0,
      );

    return () => {
      window.clearTimeout(
        timer,
      );
    };
  }, [
    loadReviews,
  ]);

  function requestDecision(
    review: Review,
    decision: ReviewDecision,
  ) {
    if (processingId) {
      return;
    }

    const note =
      notes[
        review.id
      ]?.trim() ??
      "";

    if (!note) {
      toast.error(
        "Add an internal review note before making the final decision.",
      );

      return;
    }

    setPendingDecision({
      review,
      decision,
    });
  }

  async function confirmDecision() {
    if (
      !pendingDecision ||
      processingId
    ) {
      return;
    }

    const user =
      auth.currentUser;

    if (!user) {
      toast.error(
        "Administrator sign-in is required.",
      );

      return;
    }

    const {
      review,
      decision,
    } =
      pendingDecision;

    const note =
      notes[
        review.id
      ]?.trim() ??
      "";

    if (!note) {
      toast.error(
        "An internal review note is required.",
      );

      setPendingDecision(
        null,
      );

      return;
    }

    try {
      setProcessingId(
        review.id,
      );

      const token =
        await user.getIdToken(
          true,
        );

      const response =
        await fetch(
          "/api/admin/teacher-verification-reviews",
          {
            method:
              "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                requestId:
                  review.id,

                decision,

                note,
              }),
          },
        );

      const result =
        (await response.json()) as {
          success?: boolean;
          error?: string;
        };

      if (
        !response.ok
      ) {
        throw new Error(
          result.error ||
            "The review decision could not be saved.",
        );
      }

      toast.success(
        decision ===
          "approve"
          ? `${review.teacherName} has been approved.`
          : `${review.teacherName}'s request has been rejected.`,
      );

      setReviews(
        (
          current,
        ) =>
          current.filter(
            (
              item,
            ) =>
              item.id !==
              review.id,
          ),
      );

      setNotes(
        (
          current,
        ) => {
          const next = {
            ...current,
          };

          delete next[
            review.id
          ];

          return next;
        },
      );

      setPendingDecision(
        null,
      );
    } catch (error) {
      console.error(
        "Teacher verification review decision error:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "The review decision could not be saved.",
      );
    } finally {
      setProcessingId(
        "",
      );
    }
  }

  return (
    <>
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <section className="rounded-3xl bg-slate-950 p-7 text-white">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-300">
            CS Master Admin
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Teacher verification reviews
          </h1>

          <p className="mt-2 max-w-3xl leading-7 text-slate-300">
            Review teacher applications that passed
            school-email confirmation but require additional
            CS Master security checks.
          </p>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-wider text-slate-500">
                Manual review queue
              </p>

              <p className="mt-1 text-2xl font-black text-slate-950">
                {reviews.length}{" "}
                {reviews.length === 1
                  ? "request"
                  : "requests"}{" "}
                awaiting review
              </p>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                void loadReviews()
              }
              className="rounded-xl border border-slate-300 px-5 py-3 font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Refreshing..."
                : "Refresh queue"}
            </button>
          </div>
        </section>

        {loading ? (
          <section className="mt-6 flex min-h-64 items-center justify-center rounded-3xl border border-slate-200 bg-white">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

              <p className="mt-4 font-black text-slate-700">
                Loading teacher reviews...
              </p>
            </div>
          </section>
        ) : reviews.length ===
          0 ? (
          <section className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center">
            <div className="text-5xl">
              ✅
            </div>

            <h2 className="mt-4 text-2xl font-black text-emerald-950">
              Review queue clear
            </h2>

            <p className="mt-2 text-emerald-800">
              There are currently no teacher verification
              requests requiring CS Master review.
            </p>
          </section>
        ) : (
          <div className="mt-6 space-y-6">
            {reviews.map(
              (
                review,
              ) => (
                <article
                  key={
                    review.id
                  }
                  className="overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-sm"
                >
                  <header className="border-b border-amber-200 bg-amber-50 p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-amber-700">
                          Security review required
                        </p>

                        <h2 className="mt-2 text-2xl font-black text-slate-950">
                          {review.teacherName ||
                            "Teacher applicant"}
                        </h2>

                        <p className="mt-1 text-sm text-slate-600">
                          {review.schoolName ||
                            "School not specified"}
                        </p>
                      </div>

                      <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-black text-amber-900">
                        {riskLabel(
                          review.verificationRisk,
                        )}
                      </span>
                    </div>
                  </header>

                  <div className="grid gap-6 p-6 lg:grid-cols-2">
                    <section className="rounded-2xl border border-slate-200 p-5">
                      <h3 className="font-black text-slate-950">
                        Teacher
                      </h3>

                      <dl className="mt-4 space-y-3 text-sm">
                        <div>
                          <dt className="font-bold text-slate-500">
                            Email
                          </dt>

                          <dd className="mt-1 break-all font-semibold text-slate-950">
                            {review.teacherEmail}
                          </dd>
                        </div>

                        <div>
                          <dt className="font-bold text-slate-500">
                            Job title
                          </dt>

                          <dd className="mt-1 font-semibold text-slate-950">
                            {review.jobTitle ||
                              "Not provided"}
                          </dd>
                        </div>

                        <div>
                          <dt className="font-bold text-slate-500">
                            Teacher domain
                          </dt>

                          <dd className="mt-1 font-mono text-slate-950">
                            {review.teacherDomain ||
                              "Unknown"}
                          </dd>
                        </div>
                      </dl>
                    </section>

                    <section className="rounded-2xl border border-slate-200 p-5">
                      <h3 className="font-black text-slate-950">
                        School verification
                      </h3>

                      <dl className="mt-4 space-y-3 text-sm">
                        <div>
                          <dt className="font-bold text-slate-500">
                            Administrator email
                          </dt>

                          <dd className="mt-1 break-all font-semibold text-slate-950">
                            {review.schoolAdminEmail}
                          </dd>
                        </div>

                        <div>
                          <dt className="font-bold text-slate-500">
                            Administrator domain
                          </dt>

                          <dd className="mt-1 font-mono text-slate-950">
                            {review.administratorDomain ||
                              "Unknown"}
                          </dd>
                        </div>

                        <div>
                          <dt className="font-bold text-slate-500">
                            School confirmed
                          </dt>

                          <dd className="mt-1 text-slate-950">
                            {formatDate(
                              review.schoolVerifiedAt,
                            )}
                          </dd>
                        </div>
                      </dl>
                    </section>
                  </div>

                  {review.message && (
                    <section className="mx-6 mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                        Applicant information
                      </p>

                      <p className="mt-2 whitespace-pre-wrap leading-7 text-slate-700">
                        {review.message}
                      </p>
                    </section>
                  )}

                  <section className="mx-6 mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
                    <p className="font-black text-red-950">
                      Why this requires review
                    </p>

                    <p className="mt-2 text-sm leading-6 text-red-800">
                      {riskLabel(
                        review.platformReviewReason ||
                          review.verificationRisk,
                      )}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-red-800">
                      Email ownership alone does not prove
                      that the verifier is authorised by the
                      named school. Confirm the organisation
                      and applicant before granting teacher
                      privileges.
                    </p>
                  </section>

                  <section className="border-t border-slate-200 bg-slate-50 p-6">
                    <label className="block">
                      <span className="text-sm font-black text-slate-700">
                        Internal review note
                        <span className="ml-1 text-red-600">
                          *
                        </span>
                      </span>

                      <textarea
                        value={
                          notes[
                            review.id
                          ] ??
                          ""
                        }
                        onChange={(
                          event,
                        ) =>
                          setNotes(
                            (
                              current,
                            ) => ({
                              ...current,

                              [review.id]:
                                event
                                  .target
                                  .value,
                            }),
                          )
                        }
                        rows={3}
                        placeholder="Record the checks completed and the reason for your decision."
                        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      />

                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        Required for the security audit trail.
                      </p>
                    </label>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        disabled={
                          Boolean(
                            processingId,
                          )
                        }
                        onClick={() =>
                          requestDecision(
                            review,
                            "approve",
                          )
                        }
                        className="rounded-xl bg-emerald-600 px-6 py-4 font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        Approve teacher
                      </button>

                      <button
                        type="button"
                        disabled={
                          Boolean(
                            processingId,
                          )
                        }
                        onClick={() =>
                          requestDecision(
                            review,
                            "reject",
                          )
                        }
                        className="rounded-xl border border-red-300 bg-white px-6 py-4 font-black text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:text-slate-400"
                      >
                        Reject request
                      </button>
                    </div>
                  </section>
                </article>
              ),
            )}
          </div>
        )}
      </main>

      {pendingDecision && (
        <DecisionModal
          pendingDecision={
            pendingDecision
          }
          processing={
            processingId ===
            pendingDecision
              .review
              .id
          }
          note={
            notes[
              pendingDecision
                .review
                .id
            ] ??
            ""
          }
          onCancel={() =>
            setPendingDecision(
              null,
            )
          }
          onConfirm={() =>
            void confirmDecision()
          }
        />
      )}
    </>
  );
}

function DecisionModal({
  pendingDecision,
  processing,
  note,
  onCancel,
  onConfirm,
}: {
  pendingDecision: {
    review: Review;
    decision: ReviewDecision;
  };

  processing: boolean;

  note: string;

  onCancel: () => void;

  onConfirm: () => void;
}) {
  const {
    review,
    decision,
  } =
    pendingDecision;

  const approving =
    decision ===
    "approve";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/65 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="teacher-review-modal-title"
    >
      <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div
          className={`p-6 text-white ${
            approving
              ? "bg-emerald-700"
              : "bg-red-700"
          }`}
        >
          <p className="text-xs font-black uppercase tracking-[0.18em] opacity-80">
            CS Master security decision
          </p>

          <h2
            id="teacher-review-modal-title"
            className="mt-2 text-2xl font-black"
          >
            {approving
              ? "Approve teacher account?"
              : "Reject teacher account?"}
          </h2>
        </div>

        <div className="p-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="font-bold text-slate-500">
                  Teacher
                </dt>

                <dd className="mt-1 font-black text-slate-950">
                  {review.teacherName}
                </dd>
              </div>

              <div>
                <dt className="font-bold text-slate-500">
                  School
                </dt>

                <dd className="mt-1 font-semibold text-slate-950">
                  {review.schoolName}
                </dd>
              </div>

              <div>
                <dt className="font-bold text-slate-500">
                  Risk reason
                </dt>

                <dd className="mt-1 font-semibold text-amber-800">
                  {riskLabel(
                    review.verificationRisk,
                  )}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 p-5">
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">
              Internal audit note
            </p>

            <p className="mt-2 whitespace-pre-wrap leading-6 text-slate-700">
              {note}
            </p>
          </div>

          <div
            className={`mt-5 rounded-2xl border p-5 ${
              approving
                ? "border-emerald-200 bg-emerald-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            <p
              className={`font-black ${
                approving
                  ? "text-emerald-950"
                  : "text-red-950"
              }`}
            >
              {approving
                ? "Teacher privileges will be activated."
                : "Teacher privileges will remain locked."}
            </p>

            <p
              className={`mt-2 text-sm leading-6 ${
                approving
                  ? "text-emerald-800"
                  : "text-red-800"
              }`}
            >
              {approving
                ? "This account will be promoted to the teacher role and the applicant will receive an approval email."
                : "The application will be marked rejected and the applicant will receive a rejection email."}
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={
                processing
              }
              onClick={
                onCancel
              }
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-black text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={
                processing
              }
              onClick={
                onConfirm
              }
              className={`rounded-xl px-5 py-3 font-black text-white transition disabled:cursor-not-allowed disabled:bg-slate-300 ${
                approving
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {processing
                ? "Saving decision..."
                : approving
                  ? "Yes, approve teacher"
                  : "Yes, reject request"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
