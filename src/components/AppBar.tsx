import Link from "next/link";

// Main CoronaryAtlas site — the umbrella this app lives under.
const CORONARY_ATLAS_URL = "https://coronaryatlas.com";

export default function AppBar() {
  return (
    <div className="app-bar">
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.svg"
          alt="CoronaryAtlas logo"
          width={34}
          height={34}
          style={{ borderRadius: 10, display: "block", flex: "0 0 auto", boxShadow: "0 6px 16px -6px rgba(99,102,241,0.7)" }}
        />
        <div style={{ minWidth: 0 }}>
          <div className="font-display" style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.05, letterSpacing: "-0.4px", color: "var(--text)", whiteSpace: "nowrap" }}>
            CoronaryAtlas
          </div>
          <div className="mono-kicker" style={{ fontSize: 9.5, letterSpacing: 1.6, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            ASCVD Risk Atlas
          </div>
        </div>
      </Link>
      <nav className="nav-desktop" style={{ display: "flex", gap: 18, marginLeft: "auto", alignItems: "center" }}>
        <Link className="nav-link" href="/">Overview</Link>
        <Link className="nav-link" href="/dashboard/">Dashboard</Link>
        <Link className="nav-link" href="/table/">Risk Factors</Link>
        <Link className="nav-link" href="/calculators/">Risk Calculators</Link>
        <Link className="nav-link" href="/about/">Methodology</Link>
        <a className="nav-link" href={CORONARY_ATLAS_URL} target="_blank" rel="noopener" style={{ color: "var(--accent)" }}>
          CoronaryAtlas ↗
        </a>
      </nav>
    </div>
  );
}
