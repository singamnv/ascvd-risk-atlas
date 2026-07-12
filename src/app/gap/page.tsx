import Link from "next/link";
import { getPreventGap, CATEGORY_LABELS } from "@/lib/data";

export const metadata = { title: "PREVENT gap analysis" };

export default function GapPage() {
  const gap = getPreventGap();

  return (
    <main className="container-x" style={{ paddingTop: 28, paddingBottom: 30, maxWidth: 1100 }}>
      <Link href="/calculators/" className="nav-link" style={{ fontSize: 13 }}>← Risk calculators</Link>
      <div className="mono-kicker" style={{ marginTop: 14, marginBottom: 8 }}>Score limitations</div>
      <h1 className="font-display" style={{ fontSize: 28, color: "var(--text)", margin: "0 0 8px", fontWeight: 700 }}>
        What the PREVENT equations leave out
      </h1>
      <p style={{ color: "var(--text-2)", fontSize: 15, lineHeight: 1.6, margin: "0 0 24px", maxWidth: 860 }}>
        The AHA <strong>PREVENT</strong> equations (2023) predict cardiovascular risk from {gap.n_prevent_variables} input
        variables. This atlas catalogs many more risk factors that carry strong evidence. Below, each strongly-evidenced
        (grade A or B) factor is classified as directly used by PREVENT, captured indirectly through a proxy input, or
        genuinely omitted — the last group is where a more comprehensive predictor could add discrimination.
      </p>

      {/* Funnel stats */}
      <div className="grid-auto" style={{ marginBottom: 28 }}>
        {[
          { k: gap.n_strong_total, l: "strongly-evidenced factors (A/B)", c: "var(--text)" },
          { k: gap.n_strong_in_prevent, l: "directly used by PREVENT", c: "var(--grade-A)" },
          { k: gap.n_strong_proxy, l: "captured via a proxy input", c: "var(--grade-C)" },
          { k: gap.n_strong_genuinely_omitted, l: "genuinely omitted", c: "var(--accent)" },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: "18px 20px" }}>
            <div className="font-display" style={{ fontSize: 32, fontWeight: 700, color: s.c }}>{s.k}</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Proxy-captured note */}
      <section style={{ marginBottom: 28 }}>
        <h2 className="font-display" style={{ fontSize: 18, color: "var(--text)", margin: "0 0 6px" }}>Captured indirectly (proxy inputs)</h2>
        <p style={{ color: "var(--muted)", fontSize: 13.5, margin: "0 0 12px", maxWidth: 820 }}>
          PREVENT does not measure these directly, but a correlated input variable partially captures their signal — so
          they are not counted as gaps.
        </p>
        <div className="card" style={{ padding: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {gap.proxy_captured.map((p) => (
              <div key={p.rf_id} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13.5, borderBottom: "1px solid var(--hairline)", paddingBottom: 8 }}>
                <span className={`grade-pill grade-${p.grade}`}>{p.grade}</span>
                <Link href={`/factor/${p.rf_id}/`} style={{ fontWeight: 600, color: "var(--text)", minWidth: 200 }}>{p.name}</Link>
                <span style={{ color: "var(--muted)", fontSize: 12.5 }}>→ {p.proxy_note}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Omitted by category */}
      <section style={{ marginBottom: 28 }}>
        <h2 className="font-display" style={{ fontSize: 18, color: "var(--text)", margin: "0 0 12px" }}>Genuinely-omitted strong factors by category</h2>
        <div className="grid-auto">
          {Object.entries(gap.omitted_by_category).map(([cid, names]) => (
            <div key={cid} className={`card cat-${cid}`} style={{ padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span className="chip-dot" />
                <span style={{ fontWeight: 600, fontSize: 13.5, color: "var(--text)" }}>{CATEGORY_LABELS[cid] ?? cid}</span>
                <span style={{ marginLeft: "auto", fontFamily: "var(--ff-mono)", fontSize: 13, color: "var(--muted)" }}>{names.length}</span>
              </div>
              <div style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.7 }}>{names.join(" · ")}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Top omitted table */}
      <section>
        <h2 className="font-display" style={{ fontSize: 18, color: "var(--text)", margin: "0 0 12px" }}>
          Highest-evidence omitted factors
        </h2>
        <div className="card table-scroll" style={{ overflow: "hidden" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Risk factor</th><th>Category</th><th>Grade</th>
                <th style={{ textAlign: "right" }}>Score</th><th>Causal</th>
                <th style={{ textAlign: "right" }}>Refs</th><th style={{ textAlign: "right" }}>Trials</th><th style={{ textAlign: "right" }}>GWAS</th>
              </tr>
            </thead>
            <tbody>
              {gap.top_omitted.slice(0, 60).map((f) => (
                <tr key={f.rf_id}>
                  <td><Link href={`/factor/${f.rf_id}/`} style={{ fontWeight: 600, color: "var(--text)" }}>{f.name}</Link></td>
                  <td className={`cat-${f.category}`}><span className="chip"><span className="chip-dot" />{CATEGORY_LABELS[f.category] ?? f.category}</span></td>
                  <td><span className={`grade-pill grade-${f.grade}`}>{f.grade}</span></td>
                  <td style={{ textAlign: "right", fontFamily: "var(--ff-mono)", fontSize: 13 }}>{f.score.toFixed(0)}</td>
                  <td style={{ fontSize: 12, color: f.genetic_causal_candidate ? "var(--grade-A)" : "var(--muted)" }}>{f.genetic_causal_candidate ? "genetic-causal" : f.causal_support.replace(/_/g, " ")}</td>
                  <td style={{ textAlign: "right", fontFamily: "var(--ff-mono)", fontSize: 13 }}>{f.n_references}{f.n_meta_analyses > 0 && <span style={{ color: "var(--grade-A)" }}> ·{f.n_meta_analyses}m</span>}</td>
                  <td style={{ textAlign: "right", fontFamily: "var(--ff-mono)", fontSize: 13, color: f.n_trials ? "var(--text-2)" : "var(--muted-3)" }}>{f.n_trials || "—"}</td>
                  <td style={{ textAlign: "right", fontFamily: "var(--ff-mono)", fontSize: 13, color: f.n_gwas ? "var(--text-2)" : "var(--muted-3)" }}>{f.n_gwas || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
