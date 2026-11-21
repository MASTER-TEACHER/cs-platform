/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,

  // Keep native PDF rendering outside Turbopack bundles.
  serverExternalPackages: ["@napi-rs/canvas", "pdfjs-dist"],

  // The PDF worker is loaded by path at runtime, so make sure Vercel ships it with the
  // marking routes (handwriting and mark scheme reading).
  outputFileTracingIncludes: {
    "/api/marking-centre/**": ["./node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs"],
  },

  async headers() {
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-DNS-Prefetch-Control", value: "off" },
      { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
      {
        key: "Permissions-Policy",
        value:
          "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
      },
      {
        key: "Cross-Origin-Opener-Policy",
        value: "same-origin-allow-popups",
      },
      {
        key: "Strict-Transport-Security",
        value: "max-age=31536000; includeSubDomains",
      },
    ];

    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "Pragma", value: "no-cache" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
