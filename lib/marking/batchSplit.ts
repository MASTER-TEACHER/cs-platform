/*
 * Batch scan splitting: pure logic (no browser APIs), shared by the
 * in-platform splitter. Mirrors CS Master Script Separator v2.1, but
 * matches readings against this exam's own candidate list, so it works
 * for EX codes and for registered school codes alike.
 *
 * Only anonymous candidate codes are read. Names are never extracted.
 */

export type PageReading = {
  /** Candidate codes (exactly as registered) found in this reading. */
  matches: string[];
  /** EX-format readings that are not candidates in this exam. */
  unknown: string[];
  /** Printed cover wording found. */
  marker: boolean;
  /** Short codes found but rejected because the page did not look like a cover. */
  rejected?: string[];
};

export type PageDecision = {
  page: number;
  isCover: boolean;
  code: string | null;
  readings: string[];
  note: string;
};

export type Segment = {
  start: number;
  end: number;
  code: string | null;
  note: string;
  problems: string[];
};

export function normaliseCode(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

/* ------------------------------------------------------------------ */
/* Matching readings to known candidate codes                          */
/* ------------------------------------------------------------------ */

// What Tesseract may print in place of each expected character.
const CONFUSABLE: Record<string, string> = {
  "0": "0OQD",
  "1": "1IL|",
  "2": "2Z",
  "5": "5S",
  "6": "6G",
  "8": "8B",
  B: "B8",
  D: "D0",
  O: "O0",
  Q: "Q0",
  I: "I1L|",
  L: "L1I|",
  S: "S5",
  Z: "Z2",
  G: "G6",
};

const SEPARATOR = "[\\s:_~.|-]*";

function charClass(char: string): string {
  const options = CONFUSABLE[char] ?? char;
  const escaped = options.replace(/[|\\\]^-]/g, "\\$&");
  return options.length > 1 ? `[${escaped}]` : escaped;
}

export type Matcher = { code: string; pattern: RegExp; length: number };

export function buildMatchers(candidateCodes: string[]): Matcher[] {
  return candidateCodes
    .map((code) => {
      const compact = normaliseCode(code);
      if (!compact) return null;
      // Number codes may have been printed without their leading zeros
      // (Excel shows 0002 as 2), so the zeros are optional.
      const core = /^\d+$/.test(compact) ? compact.replace(/^0+(?=\d)/, "") : compact;
      const zeros = compact.length - core.length;
      const body =
        (zeros ? `(?:${charClass("0")}${SEPARATOR}){0,${zeros}}` : "") +
        Array.from(core).map(charClass).join(SEPARATOR);
      // OCR often glues a stray letter onto "EX" ("~JEX-..."). The EX
      // prefix plus 16 characters is distinctive enough without a
      // leading boundary; short school codes keep both boundaries.
      const lead = /^EX[A-F0-9]{16}$/.test(compact) ? "" : "(?<![A-Z0-9])";
      return {
        code,
        length: compact.length,
        pattern: new RegExp(`${lead}${body}(?![A-Z0-9])`),
      };
    })
    .filter((m): m is Matcher => m !== null);
}

/* ------------------------------------------------------------------ */
/* EX codes that are not on the list (wrong class, or a misread)       */
/* ------------------------------------------------------------------ */

const EXACT_EX = /^EX[A-F0-9]{16}$/;
const HEX_FIXES: Record<string, string> = { O: "0", Q: "0", S: "5", I: "1", L: "1", Z: "2" };
const EX_SEPARATED = /(?<![A-Z0-9])EX[\s:_~.|-]+([A-Z0-9]{16})(?![A-Z0-9])/g;
const EX_COMPACT = /(?<![A-Z0-9])EX([A-F0-9OQSILZ]{16})(?![A-Z0-9])/g;

function fixHex(raw: string): string {
  return "EX" + Array.from(raw).map((c) => HEX_FIXES[c] ?? c).join("");
}

export function exReadings(text: string): string[] {
  const found: string[] = [];
  for (const line of text.toUpperCase().split(/\r?\n/)) {
    for (const pattern of [EX_SEPARATED, EX_COMPACT]) {
      for (const match of line.matchAll(pattern)) {
        const value = fixHex(match[1]);
        if (!found.includes(value)) found.push(value);
      }
    }
  }
  return found;
}

const COVER_MARKERS = [
  "INSTRUCTIONSTOCANDIDATES",
  "INSTOCANDIDATES",
  "INFORMATIONFORCANDIDATES",
  "CANDIDATENUMBER",
  "CANDIDATECODE",
];

export function coverMarker(text: string): boolean {
  const compact = text.toUpperCase().replace(/[^A-Z]/g, "");
  return COVER_MARKERS.some((m) => compact.includes(m));
}

/* ------------------------------------------------------------------ */
/* Cover template: printed words around the code on page 1             */
/* ------------------------------------------------------------------ */

/** Codes shorter than this (e.g. 4- or 6-digit numbers) need cover evidence. */
export const SHORT_CODE = 8;

const COMMON = new Set(["THE", "AND", "FOR", "THIS", "WITH", "YOUR", "THAT", "FROM", "HAVE", "WILL", "ARE"]);

/** Printed words near the code on page 1, used to recognise other covers. */
export function anchorWords(text: string, candidateCodes: string[]): string[] {
  const codes = candidateCodes.map(normaliseCode);
  const words = new Set(text.toUpperCase().match(/[A-Z]{4,}/g) ?? []);
  return [...words].filter((word) => !COMMON.has(word) && !codes.some((code) => code.includes(word))).slice(0, 30);
}

/**
 * Does this reading look like page 1's cover? At least half of the
 * printed anchor words must be present. With fewer than three anchor
 * words there is no reliable template, so this returns null.
 */
export function looksLikeCover(text: string, anchors: string[]): boolean | null {
  if (anchors.length < 3) return null;
  const words = new Set(text.toUpperCase().match(/[A-Z]{4,}/g) ?? []);
  const found = anchors.filter((word) => words.has(word)).length;
  return found / anchors.length >= 0.5;
}

export function readText(text: string, matchers: Matcher[], anchors: string[] = []): PageReading {
  const upper = text.toUpperCase();
  const lines = upper.split(/\r?\n/);
  const matches: string[] = [];
  const rejected: string[] = [];
  const marker = coverMarker(upper);
  const cover = looksLikeCover(upper, anchors);

  for (const matcher of matchers) {
    if (lines.some((line) => matcher.pattern.test(line))) {
      // A short number on an answer page ("0140 in binary") is not a cover.
      if (matcher.length < SHORT_CODE && cover === false && !marker) {
        rejected.push(matcher.code);
      } else {
        matches.push(matcher.code);
      }
    }
  }

  const known = new Set(matches.map(normaliseCode));
  const unknown = exReadings(upper).filter((value) => !known.has(value));

  return { matches, unknown, marker, rejected };
}

export function hasEvidence(reading: PageReading): boolean {
  return reading.matches.length > 0 || reading.unknown.length > 0 || reading.marker;
}

/* ------------------------------------------------------------------ */
/* Deciding a page from one or more OCR readings                       */
/* ------------------------------------------------------------------ */

/**
 * A code is accepted when two OCR passes agree on it, or when a single
 * pass matches a long code (10+ characters) with nothing conflicting:
 * a 16-character code is very unlikely to be matched by accident.
 */
export function decide(page: number, readings: PageReading[]): PageDecision {
  const votes = new Map<string, number>();
  const unknown = new Set<string>();
  let marker = false;

  for (const reading of readings) {
    for (const code of new Set(reading.matches)) {
      votes.set(code, (votes.get(code) ?? 0) + 1);
    }
    reading.unknown.forEach((value) => unknown.add(value));
    marker ||= reading.marker;
  }

  const ranking = [...votes.entries()].sort((a, b) => b[1] - a[1]);
  const isCover = ranking.length > 0 || unknown.size > 0 || marker;
  const all = [...ranking.map(([code]) => code), ...unknown];

  if (!isCover) {
    return { page, isCover: false, code: null, readings: [], note: "" };
  }

  if (ranking.length > 0) {
    const [best, count] = ranking[0];
    const runnerUp = ranking[1]?.[1] ?? 0;
    const longCode = normaliseCode(best).length >= 10;

    if (count > runnerUp && (count >= 2 || (longCode && ranking.length === 1 && unknown.size === 0))) {
      return {
        page,
        isCover: true,
        code: best,
        readings: all.filter((value) => value !== best),
        note: count >= 2 ? `${count} agreeing readings` : "Matched a candidate code",
      };
    }

    return {
      page,
      isCover: true,
      code: null,
      readings: all,
      note: "More than one candidate code read: choose the right one",
    };
  }

  if (unknown.size > 0) {
    return {
      page,
      isCover: true,
      code: null,
      readings: all,
      note: "Code read is not a candidate in this exam",
    };
  }

  return {
    page,
    isCover: true,
    code: null,
    readings: [],
    note: "Cover wording found but the code could not be read",
  };
}

/* ------------------------------------------------------------------ */
/* Suggestions and segments                                            */
/* ------------------------------------------------------------------ */

function distance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const current = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
      previous = current;
    }
  }
  return row[b.length];
}

/** Closest candidates to an unrecognised reading (never applied automatically). */
export function suggest(readings: string[], candidateCodes: string[], maxDistance = 2): string[] {
  const scored = new Map<string, number>();
  for (const reading of readings) {
    const value = normaliseCode(reading);
    for (const code of candidateCodes) {
      const d = distance(value, normaliseCode(code));
      if (d <= maxDistance) scored.set(code, Math.min(d, scored.get(code) ?? 99));
    }
  }
  const best = Math.min(...scored.values());
  return [...scored.entries()].filter(([, d]) => d === best).map(([code]) => code).sort();
}

/** Turn page decisions (page 1 must be a cover) into scripts. */
export function buildSegments(decisions: PageDecision[], pageCount: number): Segment[] {
  const starts = decisions.filter((d) => d.isCover).sort((a, b) => a.page - b.page);
  if (!starts.length || starts[0].page !== 1) {
    starts.unshift({ page: 1, isCover: true, code: null, readings: [], note: "Page 1 is not a recognised cover" });
  }

  return starts.map((start, index) => ({
    start: start.page,
    end: (starts[index + 1]?.page ?? pageCount + 1) - 1,
    code: start.code,
    note: start.note,
    problems: [],
  }));
}

/** Recalculate problems after any edit. Export is blocked while any remain. */
export function checkSegments(segments: Segment[], candidateCodes: string[]): Segment[] {
  const counts = new Map<string, number>();
  segments.forEach((s) => s.code && counts.set(s.code, (counts.get(s.code) ?? 0) + 1));
  const lengths = segments.map((s) => s.end - s.start + 1).sort((a, b) => a - b);
  const median = lengths[Math.floor(lengths.length / 2)] ?? 0;

  return segments.map((segment) => {
    const problems: string[] = [];
    const pages = segment.end - segment.start + 1;
    if (!segment.code) problems.push("Choose the candidate for this script");
    else if (!candidateCodes.includes(segment.code)) problems.push("Not a candidate in this exam");
    else if ((counts.get(segment.code) ?? 0) > 1) problems.push("Same candidate appears more than once");
    if (segments.length >= 4 && median >= 3 && (pages >= median * 2 || pages <= Math.floor(median / 2))) {
      problems.push(`${pages} pages (most scripts have ${median}): check for a missed or extra cover`);
    }
    return { ...segment, problems: problems.filter((p) => !p.startsWith(`${pages} pages`) || segment.code) };
  });
}

export function hardProblems(segment: Segment): string[] {
  return segment.problems.filter((p) => !p.includes("pages (most scripts"));
}
