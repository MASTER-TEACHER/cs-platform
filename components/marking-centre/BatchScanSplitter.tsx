"use client";

/*
 * Split one scanned batch PDF into one script per candidate, in the
 * browser. The scan is read locally (pdf.js + Tesseract.js); nothing is
 * uploaded until the teacher approves, and then only the per-candidate
 * PDFs go through the normal staged upload.
 *
 * Same approach as CS Master Script Separator v2.1:
 *   1. find where the candidate code is printed on page 1,
 *   2. read that band on every page,
 *   3. extra OCR passes only for covers that are not certain,
 *   4. the teacher reviews every script before anything is staged.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { announceActivity } from "@/components/auth/IdleSessionGuard";
import type { PDFDocumentProxy } from "pdfjs-dist";

import {
  anchorWords,
  buildMatchers,
  buildSegments,
  checkSegments,
  decide,
  hardProblems,
  hasEvidence,
  normaliseCode,
  readText,
  suggest,
  type Matcher,
  type PageDecision,
  type PageReading,
  type Segment,
} from "@/lib/marking/batchSplit";

type Paper = { id: string; title: string };

type Props = {
  papers: Paper[];
  defaultPaperId: string;
  candidateCodes: string[];
  existing: Set<string>;
  disabled?: boolean;
  onStage: (files: File[], paperId: string) => void;
};

type Ocr = {
  read: (canvas: HTMLCanvasElement) => Promise<string>;
  mode: (psm: "6" | "7" | "11") => Promise<void>;
  stop: () => Promise<void>;
};

type Band = { top: number; bottom: number };
/** A name area to black out on every cover, as fractions of the page. */
type Box = { x0: number; y0: number; x1: number; y1: number };
const REDACT_KEY = "csmaster:redactBoxes";

function drawBoxes(canvas: HTMLCanvasElement, boxes: Box[]) {
  const context = canvas.getContext("2d")!;
  context.fillStyle = "#000000";
  for (const b of boxes) {
    context.fillRect(b.x0 * canvas.width, b.y0 * canvas.height, (b.x1 - b.x0) * canvas.width, (b.y1 - b.y0) * canvas.height);
  }
}

const RENDER_SCALE = 2.5;
const LARGE_FILE = 300 * 1024 * 1024;

/* ------------------------------------------------------------------ */
/* Browser helpers                                                     */
/* ------------------------------------------------------------------ */

async function loadPdfjs() {
  // Legacy build: works on older school laptops and Chromebooks too.
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const holder = globalThis as unknown as { pdfjsWorker?: unknown };
  // Run pdf.js on the page itself: avoids hosting a separate worker file.
  if (!holder.pdfjsWorker) {
    holder.pdfjsWorker = await import("pdfjs-dist/legacy/build/pdf.worker.mjs");
  }
  return pdfjs;
}

async function startOcr(): Promise<Ocr> {
  // tesseract.js is CommonJS: use its default export when the bundler adds one.
  const imported = await import("tesseract.js");
  const Tesseract = (imported as unknown as { default?: typeof imported }).default ?? imported;
  const workers = await Promise.all([0, 1].map(() => Tesseract.createWorker("eng")));
  const scheduler = Tesseract.createScheduler();
  workers.forEach((worker) => scheduler.addWorker(worker));

  const modes = {
    "6": Tesseract.PSM.SINGLE_BLOCK,
    "7": Tesseract.PSM.SINGLE_LINE,
    "11": Tesseract.PSM.SPARSE_TEXT,
  };

  return {
    read: async (canvas) => (await scheduler.addJob("recognize", canvas)).data.text ?? "",
    mode: async (psm) => {
      await Promise.all(workers.map((w) => w.setParameters({ tessedit_pageseg_mode: modes[psm] })));
    },
    stop: async () => {
      await scheduler.terminate();
    },
  };
}

async function renderPage(pdf: PDFDocumentProxy, pageNumber: number, scale: number) {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("This browser cannot render PDF pages.");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: context, viewport }).promise;
  page.cleanup();
  return canvas;
}

function crop(source: HTMLCanvasElement, band: Band) {
  const top = Math.floor(source.height * band.top);
  const height = Math.max(1, Math.ceil(source.height * (band.bottom - band.top)));
  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(source, 0, top, source.width, height, 0, 0, source.width, height);
  return canvas;
}

/** Greyscale with contrast stretch, optionally thresholded. */
function variant(source: HTMLCanvasElement, threshold?: number) {
  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;
  const context = canvas.getContext("2d", { willReadFrequently: true })!;
  context.drawImage(source, 0, 0);
  const image = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = image.data;

  let low = 255;
  let high = 0;
  for (let i = 0; i < data.length; i += 4) {
    const grey = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    data[i] = grey;
    if (grey < low) low = grey;
    if (grey > high) high = grey;
  }
  const range = Math.max(1, high - low);
  const grey = new Uint8ClampedArray(canvas.width * canvas.height);
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    grey[p] = ((data[i] - low) * 255) / range;
  }

  stripLines(grey, canvas.width, canvas.height);

  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    let value = grey[p];
    if (threshold !== undefined) value = value > threshold ? 255 : 0;
    data[i] = data[i + 1] = data[i + 2] = value;
  }
  context.putImageData(image, 0, 0);
  return canvas;
}

/**
 * Erase ruled box borders. Codes are usually printed inside boxes, and
 * the border lines make Tesseract misread them ("0002" -> "VUUUZ").
 * Horizontal runs longer than 60pt and vertical runs longer than 22pt
 * are far longer than any character stroke, so text is untouched.
 */
function stripLines(grey: Uint8ClampedArray, width: number, height: number) {
  const dark = (p: number) => grey[p] < 128;
  const horizontal = Math.round(60 * RENDER_SCALE);
  const vertical = Math.round(22 * RENDER_SCALE);
  const erase: number[] = [];

  for (let y = 0; y < height; y++) {
    let run = 0;
    for (let x = 0; x <= width; x++) {
      if (x < width && dark(y * width + x)) run++;
      else {
        if (run >= horizontal) for (let k = x - run; k < x; k++) erase.push(y * width + k);
        run = 0;
      }
    }
  }
  for (let x = 0; x < width; x++) {
    let run = 0;
    for (let y = 0; y <= height; y++) {
      if (y < height && dark(y * width + x)) run++;
      else {
        if (run >= vertical) for (let k = y - run; k < y; k++) erase.push(k * width + x);
        run = 0;
      }
    }
  }
  for (const p of erase) grey[p] = 255;
}

/**
 * Find the band of page 1 that holds a candidate code. Sparse-text mode
 * (PSM 11) is used because codes are usually printed inside ruled boxes,
 * which confuse the block modes.
 */
async function locateBand(
  page1: HTMLCanvasElement,
  ocr: Ocr,
  matchers: Matcher[]
): Promise<{ band: Band; text: string } | null> {
  const height = 0.14;
  const bands: Band[] = [];
  for (let top = 0; top + height <= 1.0001; top += 0.07) {
    bands.push({ top, bottom: Math.min(1, top + height) });
  }

  // Two readings of every band: sparse text, then thresholded block text.
  const strips = bands.map((band) => crop(page1, band));
  await ocr.mode("11");
  const sparse = await Promise.all(strips.map((strip) => ocr.read(variant(strip))));
  await ocr.mode("6");
  const block = await Promise.all(strips.map((strip) => ocr.read(variant(strip, 150))));
  const texts = sparse.map((text, i) => `${text}\n${block[i]}`);
  // Prefer a band where the code sits next to cover wording, so a short
  // code is not confused with a date or page number elsewhere on page 1.
  const score = (text: string) => {
    const reading = readText(text, matchers);
    if (!reading.matches.length) return reading.unknown.length ? 1 : 0;
    const wording = reading.marker || /CANDIDATE/i.test(text);
    const long = reading.matches.some((code) => normaliseCode(code).length >= 8);
    return 2 + (wording ? 2 : 0) + (long ? 1 : 0);
  };
  const scores = texts.map(score);
  const best = Math.max(...scores);
  if (best <= 0) return null;
  const index = scores.indexOf(best);

  const band = bands[index];
  return {
    band: { top: Math.max(0, band.top - 0.03), bottom: Math.min(1, band.bottom + 0.03) },
    text: texts[index],
  };
}

function pageList(segment: Segment) {
  return segment.end - segment.start + 1;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function BatchScanSplitter({ papers, defaultPaperId, candidateCodes, existing, disabled = false, onStage }: Props) {
  const [open, setOpen] = useState(false);
  const [paperId, setPaperId] = useState(defaultPaperId);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [suggestions, setSuggestions] = useState<Record<number, string[]>>({});
  const [splitAt, setSplitAt] = useState("");
  const [previewPage, setPreviewPage] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [marking, setMarking] = useState(false);
  const [page1Url, setPage1Url] = useState("");
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragBox, setDragBox] = useState<Box | null>(null);
  const bandRef = useRef<Band | null>(null);
  const coverStarts = useMemo(() => new Set(segments.map(s => s.start)), [segments]);

  const bytesRef = useRef<ArrayBuffer | null>(null);
  const pdfRef = useRef<PDFDocumentProxy | null>(null);
  const cancelRef = useRef(false);

  useEffect(() => setPaperId((current) => current || defaultPaperId), [defaultPaperId]);

  // Reuse the name areas marked last time (cover layouts rarely change).
  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(REDACT_KEY) || "[]");
      if (Array.isArray(saved)) setBoxes(saved.filter((b: Box) => [b.x0, b.y0, b.x1, b.y1].every(v => typeof v === "number")));
    } catch { /* ignore */ }
  }, []);

  useEffect(
    () => () => {
      cancelRef.current = true;
      void pdfRef.current?.destroy();
    },
    []
  );

  const checked = useMemo(() => checkSegments(segments, candidateCodes), [segments, candidateCodes]);
  const blocking = checked.filter((s) => hardProblems(s).length > 0).length;
  const missing = useMemo(() => {
    const found = new Set(checked.map((s) => s.code));
    return candidateCodes.filter((code) => !found.has(code));
  }, [checked, candidateCodes]);

  function reset() {
    cancelRef.current = true;
    void pdfRef.current?.destroy();
    pdfRef.current = null;
    bytesRef.current = null;
    setFile(null);
    setSegments([]);
    setSuggestions({});
    setPageCount(0);
    setPreviewPage(null);
    setPreviewUrl("");
    setConfirmed(false);
    setStatus("");
    setError("");
    setProgress(0);
  }

  async function scan() {
    if (!file || running) return;
    setError("");
    setSegments([]);
    setConfirmed(false);
    setRunning(true);
    cancelRef.current = false;
    let ocr: Ocr | null = null;

    try {
      if (!candidateCodes.length) throw new Error("Add candidate codes to this exam first.");
      const matchers = buildMatchers(candidateCodes);

      setStatus("Opening the PDF...");
      const bytes = await file.arrayBuffer();
      bytesRef.current = bytes;
      const pdfjs = await loadPdfjs();
      await pdfRef.current?.destroy();
      const pdf = await pdfjs.getDocument({ data: new Uint8Array(bytes.slice(0)), isEvalSupported: false }).promise;
      pdfRef.current = pdf;
      const total = pdf.numPages;
      setPageCount(total);

      setStatus("Loading the text reader (the first time takes a little longer)...");
      ocr = await startOcr();

      setStatus("Finding the candidate code on page 1...");
      const page1 = await renderPage(pdf, 1, RENDER_SCALE);
      const located = await locateBand(page1, ocr, matchers);
      if (!located) {
        throw new Error(
          "No candidate code from this exam was found on page 1. Check that page 1 is a cover sheet, " +
            "that the scan is the right way up, and that this batch belongs to this exam."
        );
      }

      const { band } = located;
      bandRef.current = band;
      // Printed words around the code on page 1 (e.g. "Candidate number",
      // "INSTRUCTIONS TO CANDIDATES"): short codes only count on pages
      // that look like this cover. Page 1 itself is read from the same band.
      const anchors = anchorWords(located.text, candidateCodes);
      const read = (text: string) => readText(text, matchers, anchors);

      // Pass 1: one quick reading per page (a second, thresholded look
      // only when the first finds nothing).
      await ocr.mode("11");
      const readings: PageReading[][] = [];
      const strips: Record<number, HTMLCanvasElement> = {};
      const inflight: Promise<void>[] = [];

      for (let n = 1; n <= total; n++) {
        if (cancelRef.current) throw new Error("Scan cancelled.");
        const pageCanvas = n === 1 ? page1 : await renderPage(pdf, n, RENDER_SCALE);
        const strip = crop(pageCanvas, band);

        const job = (async () => {
          const first = read(await ocr!.read(variant(strip)));
          const list = [first];
          if (!hasEvidence(first)) {
            const retry = read(await ocr!.read(variant(strip, 150)));
            if (hasEvidence(retry)) list.push(retry);
          }
          readings[n - 1] = list;
          if (list.some(hasEvidence)) strips[n] = strip;
          setProgress(Math.round((Object.keys(readings).length / total) * 85));
          announceActivity();
          setStatus(`Reading page ${Object.keys(readings).length} of ${total}...`);
        })();
        inflight.push(job);
        if (inflight.length >= 4) await inflight.shift();
      }
      await Promise.all(inflight);

      // Pass 2: more readings only for covers that are not yet certain.
      let decisions: PageDecision[] = readings.map((list, i) => decide(i + 1, list));
      const unsure = decisions.filter((d) => d.isCover && !d.code).map((d) => d.page);

      if (unsure.length) {
        const extra: [psm: "6" | "7" | "11", threshold?: number][] = [
          ["11", 185], ["6"], ["6", 150], ["6", 185], ["7"], ["7", 150],
        ];
        let done = 0;
        for (const [psm, threshold] of extra) {
          if (cancelRef.current) throw new Error("Scan cancelled.");
          await ocr.mode(psm);
          await Promise.all(
            unsure.map(async (page) => {
              readings[page - 1].push(read(await ocr!.read(variant(strips[page], threshold))));
            })
          );
          done++;
          setProgress(85 + Math.round((done / extra.length) * 15));
          setStatus(`Checking ${unsure.length} unclear cover(s) more closely...`);
          announceActivity();
        }
        decisions = readings.map((list, i) => decide(i + 1, list));
      }

      const built = buildSegments(decisions, total);
      const hints: Record<number, string[]> = {};
      for (const segment of built) {
        if (!segment.code) {
          const decision = decisions[segment.start - 1];
          const options = suggest(decision?.readings ?? [], candidateCodes);
          if (options.length) hints[segment.start] = options;
        }
      }

      setSuggestions(hints);
      setSegments(built);
      setProgress(100);
      setStatus(`Found ${built.length} script(s) in ${total} pages.`);
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : "The scan could not be read.");
      setStatus("");
    } finally {
      await ocr?.stop().catch(() => undefined);
      setRunning(false);
    }
  }

  function setCode(start: number, code: string) {
    setConfirmed(false);
    setSegments((old) => old.map((s) => (s.start === start ? { ...s, code: code || null, note: code ? "Chosen by teacher" : s.note } : s)));
  }

  function mergeIntoPrevious(index: number) {
    if (index === 0) return;
    setConfirmed(false);
    setSegments((old) => {
      const next = [...old];
      next[index - 1] = { ...next[index - 1], end: next[index].end };
      next.splice(index, 1);
      return next;
    });
  }

  function addBoundary() {
    const page = Number(splitAt);
    if (!Number.isInteger(page) || page < 2 || page > pageCount) {
      setError(`Enter a page number between 2 and ${pageCount}.`);
      return;
    }
    if (segments.some((s) => s.start === page)) {
      setError(`A script already starts on page ${page}.`);
      return;
    }
    setError("");
    setConfirmed(false);
    setSegments((old) => {
      const index = old.findIndex((s) => s.start < page && s.end >= page);
      if (index < 0) return old;
      const next = [...old];
      const current = next[index];
      next.splice(index, 1, { ...current, end: page - 1 }, { start: page, end: current.end, code: null, note: "Boundary added by teacher", problems: [] });
      return next;
    });
    setSplitAt("");
    void showPage(page);
  }

  async function showPage(page: number) {
    if (!pdfRef.current) return;
    setPreviewPage(page);
    try {
      const canvas = await renderPage(pdfRef.current, page, 0.8);
      if (boxes.length && coverStarts.has(page)) drawBoxes(canvas, boxes);
      setPreviewUrl(canvas.toDataURL("image/jpeg", 0.8));
    } catch {
      setPreviewUrl("");
    }
  }

  async function startMarking() {
    if (!pdfRef.current) return;
    const canvas = await renderPage(pdfRef.current, 1, 1);
    setPage1Url(canvas.toDataURL("image/jpeg", 0.85));
    setMarking(true);
  }

  function pointer(event: import("react").PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)),
    };
  }

  function saveBoxes(next: Box[]) {
    setBoxes(next);
    setConfirmed(false);
    try { window.localStorage.setItem(REDACT_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  }

  const overlapsCode = boxes.some(b => bandRef.current !== null && b.y1 > bandRef.current.top && b.y0 < bandRef.current.bottom);

  /** A new PDF of the given pages, rendered at 200 dpi as JPEG images. */
  async function rasterise(range: number[], redactFirst = false, dpi = 200, quality = 0.85): Promise<Uint8Array> {
    const { PDFDocument } = await import("pdf-lib");
    const pdf = pdfRef.current;
    if (!pdf) throw new Error("The scan is no longer open. Choose the batch PDF again.");
    const output = await PDFDocument.create();
    for (const index of range) {
      const page = await pdf.getPage(index + 1);
      const size = page.getViewport({ scale: 1 });
      const canvas = await renderPage(pdf, index + 1, dpi / 72);
      if (redactFirst && index === range[0]) drawBoxes(canvas, boxes);
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/jpeg", quality));
      if (!blob) throw new Error("A page could not be converted.");
      const image = await output.embedJpg(await blob.arrayBuffer());
      output.addPage([size.width, size.height]).drawImage(image, { x: 0, y: 0, width: size.width, height: size.height });
      canvas.width = canvas.height = 0;
    }
    return output.save();
  }

  async function stage() {
    if (!bytesRef.current || blocking || !confirmed || running) return;
    setRunning(true);
    setError("");
    try {
      setStatus("Creating one PDF per candidate...");
      const { PDFDocument } = await import("pdf-lib");
      const source = await PDFDocument.load(bytesRef.current, { ignoreEncryption: true });
      const files: File[] = [];

      for (const [index, segment] of checked.entries()) {
        const range = Array.from({ length: pageList(segment) }, (_, i) => segment.start - 1 + i);
        const redact = boxes.length > 0;
        announceActivity();

        // With name areas marked, the cover is rebuilt as an image with the
        // areas blacked out (so the names are removed, not just covered);
        // the other pages are copied unchanged.
        const output = await PDFDocument.create();
        if (redact) {
          const cover = await PDFDocument.load(await rasterise([range[0]], true));
          const [first] = await output.copyPages(cover, [0]);
          output.addPage(first);
        }
        const rest = redact ? range.slice(1) : range;
        if (rest.length) {
          const pages = await output.copyPages(source, rest);
          pages.forEach((page) => output.addPage(page));
        }
        let data = await output.save();

        // Some scanners put every page's image in one shared store, so a
        // copied page drags the whole batch with it (each script ends up as
        // big as the batch). If this script is far bigger than its share,
        // rebuild it from the page images alone.
        const share = ((bytesRef.current?.byteLength ?? 0) * range.length) / Math.max(1, pageCount);
        // Uploads are limited to 25 MB: anything over 20 MB is rebuilt too,
        // stepping down image quality until it fits (still clear for marking).
        const FIT = 20 * 1024 * 1024;
        if (data.length > Math.max(share * 3, 4 * 1024 * 1024) || data.length > FIT) {
          for (const [dpi, quality] of [[200, 0.85], [150, 0.75], [120, 0.65], [100, 0.55]] as const) {
            setStatus(`Making ${segment.code} smaller for upload (${dpi} dpi)...`);
            announceActivity();
            data = await rasterise(range, redact, dpi, quality);
            if (data.length <= FIT) break;
          }
          if (data.length > 25 * 1024 * 1024) {
            throw new Error(`${segment.code} is still ${(data.length / 1048576).toFixed(1)} MB after compressing (${range.length} pages). Check for a missed cover: this script may contain two candidates.`);
          }
        }
        files.push(new File([data.slice().buffer as ArrayBuffer], `${normaliseCode(segment.code!)}.pdf`, { type: "application/pdf" }));
        setProgress(Math.round(((index + 1) / checked.length) * 100));
      }

      onStage(files, paperId);
      setStatus(`${files.length} script(s) added to the upload list below. Check them, then click Confirm upload.`);
      setSegments([]);
      setConfirmed(false);
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : "The scripts could not be created.");
    } finally {
      setRunning(false);
    }
  }

  if (!open) {
    return (
      <div className="rounded-lg border border-dashed border-indigo-300 bg-indigo-50 p-4">
        <p className="text-sm font-semibold text-indigo-900">Scanned the whole class as one PDF?</p>
        <p className="mt-1 text-sm text-slate-700">
          Split it into one script per candidate here. The scan is read in your browser and nothing uploads until you approve the split.
        </p>
        <button type="button" disabled={disabled} onClick={() => setOpen(true)} className="mt-3 rounded-lg bg-indigo-700 px-4 py-2 text-sm text-white disabled:opacity-50">
          Split a batch scan
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-4 rounded-lg border border-indigo-200 p-4" aria-label="Split a batch scan">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold">Split a batch scan</h4>
          <p className="text-sm text-slate-600">
            Page 1 must be a cover with a candidate code. Each code is checked against this exam&apos;s candidate list.
          </p>
        </div>
        <button type="button" className="text-sm text-slate-600 underline" onClick={() => { reset(); setOpen(false); }} disabled={running}>
          Close
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="text-sm">
          Paper
          <select className="mt-1 block w-full rounded border p-2" value={paperId} disabled={running || segments.length > 0} onChange={(e) => setPaperId(e.target.value)}>
            {papers.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </label>
        <label className="text-sm md:col-span-2">
          Batch PDF
          <input
            className="mt-1 block w-full text-xs"
            type="file"
            accept=".pdf,application/pdf"
            disabled={running}
            onChange={(e) => {
              const chosen = e.target.files?.[0] ?? null;
              reset();
              setOpen(true);
              setFile(chosen);
              if (chosen && chosen.size > LARGE_FILE) {
                setStatus("This is a very large file. Splitting it may be slow on some computers.");
              }
              e.target.value = "";
            }}
          />
          {file && <span className="mt-1 block text-xs text-slate-600">{file.name} · {(file.size / 1024 / 1024).toFixed(1)} MB</span>}
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" disabled={!file || running || disabled} onClick={() => void scan()} className="rounded-lg bg-indigo-700 px-4 py-2 text-sm text-white disabled:opacity-50">
          {running ? "Working..." : segments.length ? "Scan again" : "Find scripts"}
        </button>
        {running && (
          <button type="button" className="rounded-lg border px-4 py-2 text-sm" onClick={() => { cancelRef.current = true; }}>
            Cancel
          </button>
        )}
      </div>

      {(running || progress > 0) && (
        <div className="h-2 w-full overflow-hidden rounded bg-slate-200" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
      <p className="text-sm text-slate-700" role="status" aria-live="polite">{status}</p>
      {error && <p className="rounded border border-red-300 bg-red-50 p-2 text-sm text-red-800">{error}</p>}

      {segments.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="space-y-3">
            <p className="text-sm">
              <strong>{checked.length}</strong> script(s) in {pageCount} pages.{" "}
              {blocking > 0 ? (
                <span className="font-semibold text-amber-800">{blocking} need your attention before splitting.</span>
              ) : (
                <span className="text-emerald-800">All scripts are matched to a candidate.</span>
              )}
            </p>

            <div className="max-h-[28rem] overflow-y-auto rounded border">
              <table className="w-full border-collapse text-left text-xs">
                <thead className="sticky top-0 bg-slate-100">
                  <tr>
                    <th className="p-2">#</th>
                    <th className="p-2">Pages</th>
                    <th className="p-2">Candidate</th>
                    <th className="p-2">Check</th>
                    <th className="p-2"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {checked.map((segment, index) => {
                    const problems = segment.problems;
                    const hard = hardProblems(segment).length > 0;
                    const hint = suggestions[segment.start];
                    const already = segment.code && existing.has(`${paperId}_${segment.code}`);
                    return (
                      <tr key={segment.start} className={`border-t ${hard ? "bg-amber-50" : ""}`}>
                        <td className="p-2 align-top">{index + 1}</td>
                        <td className="p-2 align-top whitespace-nowrap">
                          {segment.start}–{segment.end} <span className="text-slate-500">({pageList(segment)})</span>
                        </td>
                        <td className="p-2 align-top">
                          <select
                            aria-label={`Candidate for script ${index + 1}`}
                            className="w-full rounded border p-1"
                            value={segment.code ?? ""}
                            disabled={running}
                            onChange={(e) => setCode(segment.start, e.target.value)}
                          >
                            <option value="">Choose candidate</option>
                            {candidateCodes.map((code) => <option key={code} value={code}>{code}</option>)}
                          </select>
                          {!segment.code && hint && (
                            <button type="button" className="mt-1 block text-left text-indigo-700 underline" onClick={() => setCode(segment.start, hint[0])} disabled={hint.length !== 1}>
                              {hint.length === 1 ? `Closest candidate: ${hint[0]} (use this)` : `Close matches: ${hint.join(", ")}`}
                            </button>
                          )}
                        </td>
                        <td className="p-2 align-top">
                          {problems.length === 0 ? <span className="text-emerald-800">OK · {segment.note}</span> : problems.map((p) => <span key={p} className="block text-amber-900">{p}</span>)}
                          {!segment.code && segment.note && <span className="block text-slate-600">{segment.note}</span>}
                          {already && <span className="block text-slate-600">Already uploaded for this paper: tick Replace below to overwrite.</span>}
                        </td>
                        <td className="p-2 align-top whitespace-nowrap">
                          <button type="button" className="block text-indigo-700 underline" onClick={() => void showPage(segment.start)}>Preview</button>
                          {index > 0 && (
                            <button type="button" className="mt-1 block text-slate-700 underline" disabled={running} onClick={() => mergeIntoPrevious(index)}>
                              Join to previous
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="space-y-2 rounded border border-slate-300 p-3">
              <p className="text-sm font-semibold">Hide names on cover pages</p>
              <p className="text-xs text-slate-600">
                Mark where students write their names on the cover. Those areas are blacked out on every cover before upload, so names never reach CS Master or the AI. The candidate code is read separately and is not affected.
              </p>
              <p className="text-xs">{boxes.length ? `${boxes.length} name area(s) will be blacked out on every cover.` : <span className="font-semibold text-amber-900">No name areas marked: covers will be uploaded as scanned.</span>}</p>
              {overlapsCode && <p className="text-xs font-semibold text-amber-900">A name area overlaps the row where the candidate code was read. Check the preview to make sure the code is still visible.</p>}
              <div className="flex flex-wrap gap-2">
                <button type="button" className="rounded border px-3 py-1 text-xs" disabled={running} onClick={() => void startMarking()}>{boxes.length ? "Change name areas" : "Mark name areas"}</button>
                {boxes.length > 0 && <button type="button" className="rounded border px-3 py-1 text-xs" disabled={running} onClick={() => saveBoxes([])}>Remove all areas</button>}
              </div>
              {marking && page1Url && (
                <div className="space-y-2">
                  <p className="text-xs">Drag a box over each name area on page 1 (first name, last name, signature). Click a black box to remove it.</p>
                  <div
                    className="relative w-full max-w-xl cursor-crosshair touch-none select-none border"
                    onPointerDown={(e) => { const p = pointer(e); setDragStart(p); setDragBox({ x0: p.x, y0: p.y, x1: p.x, y1: p.y }); e.currentTarget.setPointerCapture(e.pointerId); }}
                    onPointerMove={(e) => { if (!dragStart) return; const p = pointer(e); setDragBox({ x0: Math.min(dragStart.x, p.x), y0: Math.min(dragStart.y, p.y), x1: Math.max(dragStart.x, p.x), y1: Math.max(dragStart.y, p.y) }); }}
                    onPointerUp={() => { if (dragBox && dragBox.x1 - dragBox.x0 > 0.01 && dragBox.y1 - dragBox.y0 > 0.005) saveBoxes([...boxes, dragBox]); setDragStart(null); setDragBox(null); }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={page1Url} alt="Page 1 of the batch" className="block w-full" draggable={false} />
                    {[...boxes, ...(dragBox ? [dragBox] : [])].map((b, i) => (
                      <button
                        key={i}
                        type="button"
                        aria-label={i < boxes.length ? `Remove name area ${i + 1}` : "New name area"}
                        className="absolute bg-black/80"
                        style={{ left: `${b.x0 * 100}%`, top: `${b.y0 * 100}%`, width: `${(b.x1 - b.x0) * 100}%`, height: `${(b.y1 - b.y0) * 100}%` }}
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => { if (i < boxes.length) saveBoxes(boxes.filter((_, k) => k !== i)); }}
                      />
                    ))}
                  </div>
                  <button type="button" className="rounded bg-indigo-700 px-3 py-1 text-xs text-white" onClick={() => { setMarking(false); void showPage(1); }}>Done</button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-end gap-2">
              <label className="text-xs">
                Missed cover? Start a new script at page
                <input className="mt-1 block w-24 rounded border p-1" inputMode="numeric" value={splitAt} onChange={(e) => setSplitAt(e.target.value.replace(/\D/g, ""))} />
              </label>
              <button type="button" className="rounded border px-3 py-1 text-xs" disabled={running || !splitAt} onClick={addBoundary}>Add boundary</button>
            </div>

            {missing.length > 0 && (
              <details className="text-xs text-slate-700">
                <summary className="cursor-pointer">{missing.length} candidate(s) have no script in this batch</summary>
                <p className="mt-1 break-words">{missing.join(", ")}</p>
              </details>
            )}

            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-1" checked={confirmed} disabled={blocking > 0 || running} onChange={(e) => setConfirmed(e.target.checked)} />
              I have checked the script boundaries and candidates.
            </label>
            <button type="button" disabled={blocking > 0 || !confirmed || running} onClick={() => void stage()} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm text-white disabled:opacity-50">
              Split and add {checked.length} script(s) to the upload list
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold">Page preview</p>
            {previewPage ? (
              <>
                <div className="flex items-center justify-between text-xs">
                  <button type="button" className="rounded border px-2 py-1" disabled={previewPage <= 1} onClick={() => void showPage(previewPage - 1)}>Previous</button>
                  <span>Page {previewPage} of {pageCount}</span>
                  <button type="button" className="rounded border px-2 py-1" disabled={previewPage >= pageCount} onClick={() => void showPage(previewPage + 1)}>Next</button>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {previewUrl ? <img src={previewUrl} alt={`Scanned page ${previewPage}`} className="w-full rounded border" /> : <p className="text-xs text-slate-600">Rendering...</p>}
              </>
            ) : (
              <p className="text-xs text-slate-600">Choose Preview on a script to see its first page.</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
