"use client";

import {
  CheckCircle2,
  ChevronDown,
  Download,
  FileText,
  Loader2,
  X,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

import type { SavedTeacherResource } from "@/services/teacherResourceService";

import { exportResourceToWord } from "@/utils/export/wordExport";

type ExportMenuProps = {
  resource: SavedTeacherResource;
};

export default function ExportMenu({ resource }: ExportMenuProps) {
  const menuReference = useRef<HTMLDivElement | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);

  const [exportingWord, setExportingWord] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        menuReference.current &&
        !menuReference.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);

      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!success) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSuccess(null);
    }, 4000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [success]);

  async function handleWordExport() {
    setExportingWord(true);
    setError(null);
    setSuccess(null);
    setMenuOpen(false);

    try {
      await exportResourceToWord(resource);

      setSuccess("Microsoft Word document exported successfully.");
    } catch (caughtError) {
      console.error("Failed to export Word document:", caughtError);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The Word document could not be exported.",
      );
    } finally {
      setExportingWord(false);
    }
  }

  return (
    <>
      <div ref={menuReference} className="relative">
        <button
          type="button"
          onClick={() => {
            setMenuOpen((current) => !current);
            setError(null);
          }}
          disabled={exportingWord}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {exportingWord ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Export
              <ChevronDown
                className={`h-4 w-4 transition ${menuOpen ? "rotate-180" : ""}`}
              />
            </>
          )}
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 top-full z-40 mt-2 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => void handleWordExport()}
              className="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-indigo-50"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <FileText className="h-5 w-5" />
              </span>

              <span>
                <span className="block text-sm font-bold text-slate-950">
                  Microsoft Word
                </span>

                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  Download an editable, professionally formatted .docx lesson
                  plan.
                </span>
              </span>
            </button>

            <div className="my-2 border-t border-slate-100" />

            <div className="flex items-start gap-3 rounded-xl px-3 py-3 opacity-60">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700">
                <FileText className="h-5 w-5" />
              </span>

              <span>
                <span className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  PDF
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                    Coming soon
                  </span>
                </span>

                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  Export a print-ready PDF version of the resource.
                </span>
              </span>
            </div>
          </div>
        )}
      </div>

      {success && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-3 rounded-2xl border border-emerald-200 bg-white p-4 text-emerald-800 shadow-2xl"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

          <div>
            <p className="font-bold">Export complete</p>

            <p className="mt-1 text-sm leading-6">{success}</p>
          </div>

          <button
            type="button"
            onClick={() => setSuccess(null)}
            aria-label="Close notification"
            className="ml-2 text-slate-400 transition hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-3 rounded-2xl border border-red-200 bg-white p-4 text-red-800 shadow-2xl"
        >
          <FileText className="mt-0.5 h-5 w-5 shrink-0" />

          <div>
            <p className="font-bold">Export failed</p>

            <p className="mt-1 text-sm leading-6">{error}</p>
          </div>

          <button
            type="button"
            onClick={() => setError(null)}
            aria-label="Close notification"
            className="ml-2 text-slate-400 transition hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  );
}
