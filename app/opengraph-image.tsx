import { ImageResponse } from "next/og";

export const alt = "Fortis · Every lift, itemised. Free gym log for iPhone.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Plain receipt-style card: straight edges, dashed inner dividers only (no torn edges, barcodes or sign-offs).
export default function Image() {
  const rows: [string, string][] = [["3 × Bench Press", "100 kg × 5  PR"], ["3 × Overhead Press", "60 kg × 6  PR"], ["3 × Triceps Pushdown", "40 kg × 12"]];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#fbfaf8", color: "#0a0a0a", padding: 72, alignItems: "center", gap: 64, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: "#171717", display: "flex", alignItems: "center", justifyContent: "center", color: "#fafafa", fontSize: 30, fontWeight: 700 }}>F</div>
            <div style={{ fontSize: 34, fontWeight: 700 }}>Fortis</div>
          </div>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.02, letterSpacing: -3, marginTop: 40, display: "flex", flexDirection: "column" }}>
            <span>Every lift,</span><span style={{ color: "#737373" }}>itemised.</span>
          </div>
          <div style={{ fontSize: 24, color: "#737373", marginTop: 28 }}>Free gym log · Offline · Auto progression · AI-ready</div>
        </div>
        <div style={{ width: 420, display: "flex", flexDirection: "column", background: "#fff", border: "2px solid #dfdeda", borderRadius: 20, padding: 32, fontFamily: "monospace", fontSize: 20 }}>
          <div style={{ fontSize: 15, letterSpacing: 3, color: "#737373" }}>FORTIS · NO. 000142</div>
          <div style={{ fontSize: 34, fontWeight: 700, marginTop: 10, fontFamily: "sans-serif" }}>Push Day</div>
          <div style={{ borderTop: "2px dashed #dfdeda", margin: "20px 0" }} />
          {rows.map(([a, b]) => (
            <div key={a} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0" }}><span>{a}</span><span>{b}</span></div>
          ))}
          <div style={{ borderTop: "2px dashed #dfdeda", margin: "20px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 22 }}><span>TOTAL VOLUME</span><span>8,420 kg</span></div>
        </div>
      </div>
    ),
    size,
  );
}
