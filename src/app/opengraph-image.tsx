import { ImageResponse } from "next/og";

export const alt = "AI Cover Letter - Generate tailored, professional cover letters using AI";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f3",
          backgroundImage: "radial-gradient(circle at 25px 25px, #e4e4ee 2%, transparent 0%), radial-gradient(circle at 75px 75px, #e4e4ee 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          padding: "60px 80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: 20,
            backgroundColor: "#5046e4",
            boxShadow: "0 12px 32px rgba(80, 70, 228, 0.35)",
            marginBottom: 28,
          }}
        >
          <svg
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>

        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#1a1a2e",
            letterSpacing: "-0.03em",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          AI Cover Letter
        </div>

        <div
          style={{
            fontSize: 24,
            fontWeight: 400,
            color: "#5a5a7a",
            textAlign: "center",
            maxWidth: 820,
            lineHeight: 1.45,
            marginBottom: 36,
          }}
        >
          Generate tailored, high-impact, professional cover letters in seconds with Gemini AI.
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              padding: "10px 24px",
              backgroundColor: "#eeedfd",
              borderRadius: 30,
              fontSize: 16,
              fontWeight: 600,
              color: "#5046e4",
              border: "1px solid #d4d1fb",
            }}
          >
            ✦ Tailored Tone & Length
          </div>
          <div
            style={{
              padding: "10px 24px",
              backgroundColor: "#eeedfd",
              borderRadius: 30,
              fontSize: 16,
              fontWeight: 600,
              color: "#5046e4",
              border: "1px solid #d4d1fb",
            }}
          >
            ✦ ATS-Optimized
          </div>
          <div
            style={{
              padding: "10px 24px",
              backgroundColor: "#eeedfd",
              borderRadius: 30,
              fontSize: 16,
              fontWeight: 600,
              color: "#5046e4",
              border: "1px solid #d4d1fb",
            }}
          >
            ✦ Instant Export & Copy
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
