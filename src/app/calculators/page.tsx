import Link from "next/link";
import { getCalculators, getPreventGap } from "@/lib/data";

export const metadata = { title: "Risk calculators" };

export default function CalculatorsPage() {
  const data = getCalculators();
  const gap = getPreventGap();
  const calcs = [...data.calculators].sort((a, b) => a.coverage_rank - b.coverage_rank);
  const maxFactors = Math.max(...calcs.map((c) => c.n_factors_covered));

  return (
    <main className="container-x" style={{ paddingTop: 28, paddingBottom: 30 }}>
      <div className="mono-kicker" style={{ marginBottom: 8 }}>{data.n_calculators} calculators</div>
      <h1 className="font-display" style={{ fontSize: 28, color: "var(--text)", margin: "0 0 8px", fontWeight: 700 }}>
        ASCVD risk calculators
      </h1>
      <p style={{ color: "var(--text-2)", fontSize: 15, lineHeight: 1.6, margin: "0 0 22px", maxWidth: 900 }}>
        The established cardiovascular risk scores, each with its input variables mapped onto the atlas factor set. Ranked
        by how many strongly-evidenced (grade A/B) factors they include. Even the broadest use a small slice of the{" "}
        {data.atlas_reference.n_factors.toLocaleString()} cataloged factors — see the{" "}
        <Link href="#prevent-gap" style={{ color: "var(--accent)", fontWeight: 600 }}>PREVENT gap analysis</Link> below for what the current US default omits.
      </p>

      {/* Ranking table */}
      <div className="card table-scroll" style={{ overflow: "hidden", marginBottom: 20 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th><th>Calculator</th><th>Region</th><th>Year</th>
              <th style={{ textAlign: "right" }}>Inputs</th>
              <th>Coverage (strong ▪ other)</th>
              <th style={{ textAlign: "right" }}>Strong</th>
              <th style={{ textAlign: "right" }}>Categories</th>
            </tr>
          </thead>
          <tbody>
            {calcs.map((c) => (
              <tr key={c.calc_id}>
                <td style={{ fontFamily: "var(--ff-mono)", color: "var(--muted)" }}>{c.coverage_rank}</td>
                <td><Link href={`/calculators/${c.calc_id}/`} style={{ fontWeight: 600, color: "var(--text)" }}>{c.name}</Link>
                  <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{c.time_horizon} · {c.outcome_predicted}</div>
                </td>
                <td style={{ fontSize: 12.5, color: "var(--muted)" }}>{c.region}</td>
                <td style={{ fontFamily: "var(--ff-mono)", fontSize: 12.5, color: "var(--muted)" }}>{c.year}</td>
                <td style={{ textAlign: "right", fontFamily: "var(--ff-mono)", fontSize: 13 }}>{c.n_inputs}</td>
                <td style={{ minWidth: 180 }}>
                  <div style={{ display: "flex", height: 16, borderRadius: 4, overflow: "hidden", background: "var(--panel-2)", width: `${(c.n_factors_covered / maxFactors) * 100}%`, minWidth: 40 }}>
                    <div style={{ width: `${(c.n_strong_covered / c.n_factors_covered) * 100}%`, background: "#16a34a" }} />
                    <div style={{ flex: 1, background: "#c7d2fe" }} />
                  </div>
                </td>
                <td style={{ textAlign: "right", fontFamily: "var(--ff-mono)", fontSize: 13, fontWeight: 600, color: "var(--grade-A)" }}>{c.n_strong_covered}</td>
                <td style={{ textAlign: "right", fontFamily: "var(--ff-mono)", fontSize: 13, color: "var(--muted)" }}>{c.n_categories_covered}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ color: "var(--muted-2)", fontSize: 12, margin: "0 0 36px" }}>▸ {data.ranking_criteria}</p>

      {/* PREVENT gap analysis section */}
      <section id="prevent-gap" style={{ scrollMarginTop: 70 }}>
        <div className="mono-kicker" style={{ marginBottom: 8 }}>Score limitations</div>
        <h2 className="font-display" style={{ fontSize: 24, color: "var(--text)", margin: "0 0 8px", fontWeight: 700 }}>
          What the PREVENT equations leave out
        </h2>
        <p style={{ color: "var(--text-2)", fontSize: 14.5, lineHeight: 1.6, margin: "0 0 20px", maxWidth: 880 }}>
          PREVENT is the current AHA default. Of the {gap.n_strong_total} strongly-evidenced (A/B) atlas factors, it uses{" "}
          {gap.n_strong_in_prevent} directly, captures {gap.n_strong_proxy} via proxy inputs, and genuinely omits{" "}
          <strong>{gap.n_strong_genuinely_omitted}</strong> — the candidate feature space for a more comprehensive predictor.
        </p>
        <div className="grid-auto" style={{ marginBottom: 24 }}>
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
        <p style={{ fontSize: 13.5 }}>
          <Link href="/gap/" style={{ color: "var(--accent)", fontWeight: 600 }}>→ Full PREVENT gap breakdown (omitted factors by category, top-evidence table)</Link>
        </p>
      </section>
    </main>
  );
}
