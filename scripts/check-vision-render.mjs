// Verifies that scanned (image-based) PDF pages can be rendered for handwriting
// transcription. Run with:  npm run vision:check
// The old test-vision-render.cjs only rendered a blank page, which passes even when
// image rendering is broken.
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { PDFDocument } from "pdf-lib";
import { createCanvas } from "@napi-rs/canvas";

const require = createRequire(import.meta.url);

// 1. There must be exactly one copy of @napi-rs/canvas, shared with pdfjs-dist.
const appCanvas = require.resolve("@napi-rs/canvas");
let pdfjsCanvas = appCanvas;
try {
  const pdfjsRequire = createRequire(require.resolve("pdfjs-dist/package.json"));
  pdfjsCanvas = pdfjsRequire.resolve("@napi-rs/canvas");
} catch { /* pdfjs has no separate copy */ }
if (pdfjsCanvas !== appCanvas) {
  console.error("VISION_CHECK_FAILED: two copies of @napi-rs/canvas are installed:");
  console.error("  app:   ", appCanvas);
  console.error("  pdfjs: ", pdfjsCanvas);
  console.error("Run: npm install   (package.json now pins a version compatible with pdfjs-dist)");
  process.exit(1);
}

// 2. Render a page that contains a photographed/scanned image.
const source = createCanvas(400, 200);
const sctx = source.getContext("2d");
sctx.fillStyle = "#ffffff"; sctx.fillRect(0, 0, 400, 200);
sctx.fillStyle = "#1a2a6c"; sctx.font = "40px sans-serif"; sctx.fillText("handwriting", 40, 110);
const pdf = await PDFDocument.create();
const image = await pdf.embedJpg(await source.encode("jpeg", 85));
pdf.addPage([400, 200]).drawImage(image, { x: 0, y: 0, width: 400, height: 200 });
const bytes = await pdf.save();

const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(require.resolve("pdfjs-dist/legacy/build/pdf.worker.mjs")).href;
const document = await pdfjs.getDocument({ data: new Uint8Array(bytes), useSystemFonts: true, disableFontFace: true, isEvalSupported: false }).promise;
const page = await document.getPage(1);
const viewport = page.getViewport({ scale: 2 });
const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
const ctx = canvas.getContext("2d");
const timer = setTimeout(() => { console.error("VISION_CHECK_FAILED: rendering hung"); process.exit(1); }, 20000);
await page.render({ canvas, canvasContext: ctx, viewport }).promise;
clearTimeout(timer);

// 3. The rendered page must contain dark ink, not a blank or black canvas.
const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
let ink = 0, black = 0;
for (let i = 0; i < data.length; i += 4) {
  const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
  if (lum < 120) ink++;
  if (lum < 10) black++;
}
const pixels = data.length / 4;
await document.loadingTask.destroy();
if (ink < pixels * 0.005 || black > pixels * 0.9) {
  console.error("VISION_CHECK_FAILED: scanned image did not render correctly", { ink, black, pixels });
  process.exit(1);
}
console.log("VISION_CHECK_OK: scanned pages render correctly for handwriting transcription");
