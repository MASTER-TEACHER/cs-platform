"use client";

import { useEffect, useState, type ReactNode } from "react";
import { announceActivity } from "@/components/auth/IdleSessionGuard";

type View = { url: string; page: number; pages: number | null };

type Props = {
  endpoint: string;
  getToken: () => Promise<string>;
  paperId: string;
  candidateCode: string;
  questionId: string;
  title: string;
  position?: string;
  onPrevious?: () => void;
  onNext?: () => void;
  onClose: () => void;
  /** Number keys 0..maxMarks set the mark when provided. */
  onMarkKey?: (marks: number) => void;
  maxMarks?: number;
  children: ReactNode;
};

/**
 * The candidate's own script, opened at the page where the given question was
 * answered, in a panel on the right. Controls for marking go underneath (children).
 */
export default function ScriptSidePanel({ endpoint, getToken, paperId, candidateCode, questionId, title, position, onPrevious, onNext, onClose, onMarkKey, maxMarks, children }: Props) {
  const [views, setViews] = useState<Record<string, View>>({});
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const key = `${paperId}:${candidateCode}:${questionId}`;
  const view = views[key];

  useEffect(() => {
    let cancelled = false;
    setError("");
    announceActivity();
    if (views[key]) { setPage(views[key].page); return; }
    void (async () => {
      try {
        const response = await fetch(`${endpoint}/view?${new URLSearchParams({ paperId, candidateCode, questionId })}`, {
          cache: "no-store", headers: { Authorization: `Bearer ${await getToken()}` },
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "Unable to open the script.");
        if (cancelled) return;
        setViews(old => ({ ...old, [key]: data as View }));
        setPage((data as View).page);
      } catch (e) { if (!cancelled) setError(e instanceof Error ? e.message : "Unable to open the script."); }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Keys: 0-9 set the mark, N / right arrow next, P / left arrow previous, Esc closes.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT")) return;
      if (event.key === "Escape") onClose();
      else if ((event.key === "ArrowRight" || event.key.toLowerCase() === "n") && onNext) onNext();
      else if ((event.key === "ArrowLeft" || event.key.toLowerCase() === "p") && onPrevious) onPrevious();
      else if (onMarkKey && /^\d$/.test(event.key) && Number(event.key) <= (maxMarks ?? 9)) onMarkKey(Number(event.key));
      else return;
      event.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <aside role="dialog" aria-label={title} className="fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l-2 border-indigo-300 bg-white shadow-2xl md:w-[58vw]">
      <div className="flex flex-wrap items-center gap-2 border-b bg-indigo-50 p-2 text-sm">
        <strong>{title}</strong>
        {position && <span className="text-xs text-slate-600">{position}</span>}
        <div className="ml-auto flex gap-1">
          {onPrevious !== undefined && <button type="button" className="rounded border bg-white px-2 py-1 text-xs" disabled={!onPrevious} onClick={onPrevious}>← Previous</button>}
          {onNext !== undefined && <button type="button" className="rounded border bg-white px-2 py-1 text-xs" disabled={!onNext} onClick={onNext}>Next →</button>}
          <button type="button" aria-label="Close" className="rounded border bg-white px-2 py-1 text-xs" onClick={onClose}>✕</button>
        </div>
      </div>
      <div className="flex items-center gap-2 border-b px-2 py-1 text-xs">
        <button type="button" className="rounded border px-2" disabled={page <= 1} onClick={() => setPage(n => Math.max(1, n - 1))}>◀</button>
        <span>Page {page}{view?.pages ? ` of ${view.pages}` : ""}{view && page === view.page ? " (answer found here)" : ""}</span>
        <button type="button" className="rounded border px-2" disabled={Boolean(view?.pages && page >= view.pages)} onClick={() => setPage(n => n + 1)}>▶</button>
        {view && page !== view.page && <button type="button" className="text-indigo-700 underline" onClick={() => setPage(view.page)}>Back to answer page</button>}
      </div>
      <div className="min-h-0 flex-1 bg-slate-100">
        {view
          ? <iframe key={`${candidateCode}-${page}`} title={`Script ${candidateCode}`} src={`${view.url}#page=${page}&view=FitH&toolbar=0&navpanes=0`} className="h-full w-full" />
          : <p className="p-4 text-sm">{error || "Opening script..."}</p>}
      </div>
      <div className="max-h-[45vh] space-y-2 overflow-auto border-t bg-white p-3 text-xs">{children}</div>
    </aside>
  );
}
