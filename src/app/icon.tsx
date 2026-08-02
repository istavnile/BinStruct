import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#080a0f",
          border: "1px solid rgba(0,255,157,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
          fontSize: 11,
          fontWeight: 700,
          color: "#00ff9d",
          letterSpacing: "0.02em",
        }}
      >
        BS
      </div>
    ),
    { ...size }
  );
}
