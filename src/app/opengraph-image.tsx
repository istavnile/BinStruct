import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "BinStruct — Template management para producción audiovisual";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#080a0f",
          fontFamily: "monospace",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(0,255,157,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,157,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Glow bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: -120,
            left: -120,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,255,157,0.08) 0%, transparent 70%)",
          }}
        />
        {/* Glow top-right */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)",
          }}
        />

        {/* Terminal window */}
        <div
          style={{
            position: "absolute",
            top: 80,
            left: 80,
            right: 80,
            bottom: 80,
            border: "1px solid #1c2232",
            background: "#0c0e18",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Title bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 20px",
              borderBottom: "1px solid #1c2232",
              background: "#080a0f",
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 6, background: "rgba(255,69,69,0.6)" }} />
              <div style={{ width: 12, height: 12, borderRadius: 6, background: "rgba(255,184,0,0.5)" }} />
              <div style={{ width: 12, height: 12, borderRadius: 6, background: "rgba(0,255,157,0.5)" }} />
            </div>
            <div
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: 11,
                color: "#3d4f60",
                letterSpacing: "0.15em",
              }}
            >
              BINSTRUCT — TEMPLATE MANAGER
            </div>
          </div>

          {/* Content */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "48px 64px",
              gap: 24,
            }}
          >
            {/* Logo + Title */}
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  border: "1px solid rgba(0,255,157,0.4)",
                  background: "rgba(0,255,157,0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#00ff9d",
                  letterSpacing: "0.05em",
                }}
              >
                BS
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ fontSize: 48, fontWeight: 700, color: "#c9d5e0", letterSpacing: "0.08em" }}>
                  BINSTRUCT
                </div>
                <div style={{ fontSize: 14, color: "#3d4f60", letterSpacing: "0.15em" }}>
                  v0.1.0 · template management
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingLeft: 4 }}>
              <div style={{ fontSize: 20, color: "#5a6a7a", letterSpacing: "0.04em" }}>
                <span style={{ color: "#00ff9d" }}>›</span>
                {"  "}Crea, organiza y exporta estructuras de carpetas
              </div>
              <div style={{ fontSize: 20, color: "#5a6a7a", letterSpacing: "0.04em" }}>
                <span style={{ color: "#00ff9d" }}>›</span>
                {"  "}para producción audiovisual y proyectos creativos
              </div>
            </div>

            {/* Tree preview */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                marginTop: 8,
                padding: "16px 20px",
                border: "1px solid #1c2232",
                background: "rgba(0,0,0,0.3)",
                maxWidth: 420,
              }}
            >
              {[
                { indent: 0, color: "#00ff9d", name: "[NOMBRE_DEL_PROYECTO]/" },
                { indent: 1, color: "#00d4ff", name: "01_PREPRODUCCION/" },
                { indent: 2, color: "#00d4ff", name: "guiones/" },
                { indent: 1, color: "#ff2d78", name: "02_PRODUCCION/" },
                { indent: 1, color: "#ffb800", name: "03_POSTPRODUCCION/" },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    paddingLeft: item.indent * 18,
                    fontSize: 13,
                    color: item.color,
                    opacity: item.indent === 2 ? 0.6 : 1,
                  }}
                >
                  <span style={{ opacity: 0.5 }}>▶</span>
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            right: 100,
            fontSize: 10,
            color: "#1c2232",
            letterSpacing: "0.2em",
          }}
        >
          desarrollado por Istav Nile @ 12 Development
        </div>
      </div>
    ),
    { ...size }
  );
}
