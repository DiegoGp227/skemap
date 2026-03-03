import Link from "next/link";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#e6edf3", marginBottom: 8 }}>Skemap</h1>
          <p style={{ fontSize: 14, color: "#7d8590" }}>Selecciona un tablero</p>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <Link
            href="/dev-board"
            style={{
              padding: "14px 28px",
              background: "#161b22",
              border: "1px solid #21262d",
              borderRadius: 8,
              color: "#4a9eff",
              fontWeight: 600,
              fontSize: 14,
              textDecoration: "none",
              transition: "border-color 0.15s",
            }}
          >
            Dev Board
          </Link>
          <Link
            href="/discipline-board"
            style={{
              padding: "14px 28px",
              background: "#161b22",
              border: "1px solid #21262d",
              borderRadius: 8,
              color: "#10b981",
              fontWeight: 600,
              fontSize: 14,
              textDecoration: "none",
            }}
          >
            Discipline Board
          </Link>
        </div>
      </div>
    </div>
  );
}
