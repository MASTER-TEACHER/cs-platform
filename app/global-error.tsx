"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main style={{ fontFamily: "system-ui, sans-serif", padding: "48px 24px" }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <h1>CS Master could not load</h1>
            <p>
              A platform-level error occurred. Try loading the application again.
            </p>
            <button
              type="button"
              onClick={reset}
              style={{
                marginTop: 16,
                padding: "12px 18px",
                borderRadius: 10,
                border: 0,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}