// pdf.js worker module, imported so pdf.js runs without a separate
// worker file (see components/marking-centre/BatchScanSplitter.tsx).
declare module "pdfjs-dist/legacy/build/pdf.worker.mjs" {
  export const WorkerMessageHandler: unknown;
}
