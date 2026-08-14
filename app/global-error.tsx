"use client";

import { useEffect } from "react";

/** Root layout crash recovery — must include html/body. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", error?.digest || error?.message);
  }, [error]);

  return (
    <html lang="hi">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, sans-serif",
          background: "#0f1a14",
          color: "#f3faf5",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          textAlign: "center",
        }}
      >
        <div>
          <p style={{ opacity: 0.7, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em" }}>
            AGRIVEDA
          </p>
          <h1 style={{ fontSize: 22, margin: "8px 0" }}>ऐप अटक गई</h1>
          <p style={{ opacity: 0.85, fontSize: 14, maxWidth: 320, margin: "0 auto" }}>
            पेज क्रैश हो गया। दोबारा लोड करें। समस्या रहे तो support@agriveda.in पर लिखें।
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 20,
              border: 0,
              borderRadius: 12,
              background: "#16a34a",
              color: "#fff",
              fontWeight: 800,
              padding: "10px 18px",
              cursor: "pointer",
            }}
          >
            फिर से कोशिश
          </button>
        </div>
      </body>
    </html>
  );
}
