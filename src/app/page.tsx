import Link from "next/link";
import { getStats, getPreventGap, CATEGORY_LABELS } from "@/lib/data";

export default function Home() {
  const stats = getStats();
  const gap = getPreventGap();
  const cats = [...stats.categories].sort((a, b) => b.n - a.n);
  const maxN = Math.max(...cats.map((c) => c.n));

  return (
    <main className="container-x" style={{ paddingTop: 40, paddingBottom: 20 }}>
      {/* Hero */}
      <section style={{ marginBottom: 40 }}>
        <div className="mono-kicker" style={{ marginBottom: 12 }}>De novo evidence atlas</div>
        <h1 className="font-display" style={{ fontSize: "clamp(30px, 5vw, 46px)", lineHeight: 1.08, color: "var(--text)", margin: "0 0 16px", fontWeight: 700, maxWidth: 900 }}>
          Every risk factor ever reported for{" "}
          <span style={{ background: "var(--accent-grad)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
            atherosclerotic cardiovascular disease
          </span>
          , graded by evidence.
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--text-2)", maxWidth: 820, margin: "0 0 24px" }}>
          A ground-up harvest of the primary literature, clinical trials, and human genetics catalogs{" "}
          <strong>{stats.n_factors.toLocaleString()}</strong> distinct risk factors across {stats.categories.length} categories —
          from lipids and blood pressure to clonal hematopoiesis, air pollution, and gut-microbiome metabolites. Each factor
          links to its supporting evidence and is scored so you can judge how much weight it carries — and see which the{" "}
          <Link href="/gap/" style={{ color: "var(--accent)", fontWeight: 600 }}>AHA PREVENT equations omit</Link>.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/table/" className="btn" data-active="true" style={{ padding: "10px 20px", fontSize: 14 }}>
            Explore the risk-factor table →
          </Link>
          <Link href="/dashboard/" className="btn" style={{ padding: "10px 20px", fontSize: 14 }}>
            Analytics dashboard
          </Link>
          <Link href="/calculators/" className="btn" style={{ padding: "10px 20px", fontSize: 14 }}>
            Risk calculators
          </Link>
        </div>
      </section>

      {/* Headline stats */}
      <section className="grid-auto" style={{ marginBottom: 40 }}>
        {[
          { k: stats.n_factors.toLocaleString(), l: "risk factors cataloged" },
          { k: (stats.evidence_totals.distinct_articles ?? 0).toLocaleString(), l: "articles harvested" },
          { k: (stats.harvest_sources.clinical_trials ?? 0).toLocaleString(), l: "clinical trials linked" },
          { k: ((stats.harvest_sources.gwas_trait_assoc ?? 0) + (stats.harvest_sources.gwas_gene_assoc ?? 0)).toLocaleString(), l: "GWAS associations" },
          { k: (stats.by_grade.A ?? 0) + (stats.by_grade.B ?? 0), l: "strongly-evidenced (A/B)" },
          { k: gap.n_strong_genuinely_omitted, l: "strong factors PREVENT omits", accent: true },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: "18px 20px" }}>
            <div className="font-display" style={{ fontSize: 30, fontWeight: 700, color: s.accent ? "var(--accent)" : "var(--text)" }}>{s.k}</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </section>

      {/* Category breakdown */}
      <section style={{ marginBottom: 40 }}>
        <h2 className="font-display" style={{ fontSize: 22, color: "var(--text)", margin: "0 0 4px" }}>Risk factors by category</h2>
        <p style={{ color: "var(--muted)", fontSize: 14, margin: "0 0 20px" }}>Each bar shows the count of distinct factors; the shaded portion is strongly-evidenced (grade A or B).</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {cats.map((c) => (
            <Link key={c.id} href={`/table/?cat=${c.id}`} className={`cat-${c.id} cat-bar-row`} style={{ display: "grid", gridTemplateColumns: "220px 1fr 60px", gap: 12, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "var(--text-2)" }}>
                <span className="chip-dot" /> {CATEGORY_LABELS[c.id] ?? c.name}
              </div>
              <div style={{ background: "var(--panel-2)", borderRadius: 6, height: 22, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, width: `${(c.n / maxN) * 100}%`, background: "var(--panel-3)", borderRight: "2px solid var(--c)" }} />
                <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: `${(c.n_strong / maxN) * 100}%`, background: "var(--c)", opacity: 0.55 }} />
              </div>
              <div style={{ textAlign: "right", fontFamily: "var(--ff-mono)", fontSize: 13, color: "var(--muted)" }}>
                {c.n_strong}/{c.n}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
