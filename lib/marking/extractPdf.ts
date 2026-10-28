import "server-only";

import pdfParse from "pdf-parse/lib/pdf-parse.js";

export type ExtractedPdf = {
  text: string;
  pages: number;
  truncated: boolean;
};

const MAX_TEXT = 20000;

export async function extractMarkingPdf(
  bytes: Buffer,
): Promise<ExtractedPdf> {
  if (
    bytes.length === 0 ||
    bytes.length > 12 * 1024 * 1024 ||
    bytes.subarray(0, 5).toString("ascii") !== "%PDF-"
  ) {
    throw new Error("CENTRE_INVALID_PDF");
  }

  let fullText = "";
  let pages = 0;

  try {
    const parsed = await pdfParse(bytes);
    fullText = parsed.text.trim();
    pages = parsed.numpages;
  } catch {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const { createRequire } = await import("node:module");
    const { pathToFileURL } = await import("node:url");

    const require = createRequire(process.cwd() + "/package.json");
    const workerPath = require.resolve(
      "pdfjs-dist/legacy/build/pdf.worker.mjs",
    );

    pdfjs.GlobalWorkerOptions.workerSrc =
      pathToFileURL(workerPath).href;

    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(bytes),
      useSystemFonts: true,
      disableFontFace: true,
      isEvalSupported: false,
    });

    const document = await loadingTask.promise;

    try {
      pages = document.numPages;
      const pageTexts: string[] = [];

      for (let pageNumber = 1; pageNumber <= pages; pageNumber++) {
        const page = await document.getPage(pageNumber);
        const content = await page.getTextContent();

        pageTexts.push(
          content.items
            .map(item => ("str" in item ? item.str : ""))
            .join(" "),
        );

        page.cleanup();
      }

      fullText = pageTexts.join("\n").trim();
    } finally {
      await document.destroy();
    }
  }

  return {
    text: fullText.slice(0, MAX_TEXT),
    pages,
    truncated: fullText.length > MAX_TEXT,
  };
}
