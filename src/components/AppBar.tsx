"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Main CoronaryAtlas site — the umbrella this app lives under.
const CORONARY_ATLAS_URL = "https://coronaryatlas.com";

const NAV: { href: string; label: string }[] = [
  { href: "/", label: "Overview" },
  { href: "/dashboard/", label: "Dashboard" },
  { href: "/table/", label: "Risk Factors" },
  { href: "/calculators/", label: "Risk Calculators" },
  { href: "/about/", label: "Methodology" },
];

export default function AppBar() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  // Close the mobile menu on route change.
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <div className="app-bar">
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }} onClick={() => setOpen(false)}>
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

      {/* Desktop nav */}
      <nav className="nav-desktop" style={{ display: "flex", gap: 18, marginLeft: "auto", alignItems: "center" }}>
        {NAV.map((n) => <Link key={n.href} className="nav-link" href={n.href}>{n.label}</Link>)}
        <a className="nav-link" href={CORONARY_ATLAS_URL} target="_blank" rel="noopener" style={{ color: "var(--accent)" }}>
          CoronaryAtlas ↗
        </a>
      </nav>

      {/* Mobile hamburger */}
      <button
        className="nav-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {open ? <><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></>
                : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
        </svg>
      </button>

      {/* Mobile dropdown panel */}
      {open && (
        <nav className="nav-mobile">
          {NAV.map((n) => <Link key={n.href} className="nav-link" href={n.href}>{n.label}</Link>)}
          <a className="nav-link" href={CORONARY_ATLAS_URL} target="_blank" rel="noopener" style={{ color: "var(--accent)" }}>
            CoronaryAtlas ↗
          </a>
        </nav>
      )}
    </div>
  );
}
