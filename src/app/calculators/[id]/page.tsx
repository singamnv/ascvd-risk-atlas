import Link from "next/link";
import { notFound } from "next/navigation";
import { getCalculators, getFactors, CATEGORY_LABELS } from "@/lib/data";

export function generateStaticParams() {
  return getCalculators().calculators.map((c) => ({ id: c.calc_id }));
}
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = getCalculators().calculators.find((x) => x.calc_id === id);
  return { title: c ? c.name : "Calculator" };
}

export default async function CalculatorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = getCalculators();
  const c = data.calculators.find((x) => x.calc_id === id);
  if (!c) notFound();
  const factors = getFactors();
  const fById = new Map(factors.map((f) => [f.rf_id, f]));

  return (
    <main className="container-x" style={{ paddingTop: 24, paddingBottom: 40, maxWidth: 1000 }}>
      <Link href="/calculators/" className="nav-link" style={{ fontSize: 13 }}>← All calculators</Link>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, margin: "14px 0 6px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <h1 className="font-display" style={{ fontSize: 28, color: "var(--text)", margin: 0, fontWeight: 700 }}>{c.name}</h1>
          <p style={{ color: "var(--muted)", fontSize: 14, margin: "4px 0 0" }}>{c.full_name}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="font-display" style={{ fontSize: 30, fontWeight: 700, color: "var(--accent)" }}>#{c.coverage_rank}</div>
          <div className="mono-kicker">coverage rank</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "10px 0 22px" }}>
        <span className="chip">{c.region}</span><span className="chip">{c.year}</span>
        <span className="chip">{c.time_horizon}</span><span className="chip">{c.outcome_predicted}</span>
        <span className="chip">{c.n_inputs} inputs</span>
      </div>
      <p style={{ color: "var(--text-2)", fontSize: 14, margin: "0 0 24px" }}>{c.population}</p>

      {/* coverage stats */}
      <div className="grid-auto" style={{ marginBottom: 26 }}>
        {[
          { k: c.n_factors_covered, l: "atlas factors covered", c: "var(--text)" },
          { k: c.n_strong_covered, l: "strongly-evidenced (A/B)", c: "var(--grade-A)" },
          { k: c.n_categories_covered, l: "of 15 categories", c: "var(--accent)" },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: "16px 18px" }}>
            <div className="font-display" style={{ fontSize: 28, fontWeight: 700, color: s.c }}>{s.k}</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* strengths / weaknesses */}
      <div className="grid-auto" style={{ marginBottom: 26, gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
        <div className="card" style={{ padding: 16 }}>
          <div className="mono-kicker" style={{ marginBottom: 10, color: "var(--grade-A)" }}>Strengths</div>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6, fontSize: 13.5, color: "var(--text-2)" }}>
            {c.strengths.map((s, i) => <li key={i} style={{ marginBottom: 6 }}>{s}</li>)}
          </ul>
        </div>
        <div className="card" style={{ padding: 16 }}>
          <div className="mono-kicker" style={{ marginBottom: 10, color: "var(--grade-C)" }}>Weaknesses</div>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6, fontSize: 13.5, color: "var(--text-2)" }}>
            {c.weaknesses.map((s, i) => <li key={i} style={{ marginBottom: 6 }}>{s}</li>)}
          </ul>
        </div>
      </div>

      {/* inputs table */}
      <h2 className="font-display" style={{ fontSize: 18, color: "var(--text)", margin: "0 0 12px" }}>Input variables ({c.n_inputs})</h2>
      <div className="card table-scroll" style={{ overflowX: "auto", marginBottom: 26 }}>
        <table className="data-table">
          <thead><tr><th>Input</th><th>Maps to atlas factor</th><th>Category</th><th>Grade</th><th>Note</th></tr></thead>
          <tbody>
            {c.inputs.map((inp, i) => {
              const f = inp.rf_id ? fById.get(inp.rf_id) : null;
              return (
                <tr key={i}>
                  <td style={{ fontWeight: 500, color: "var(--text)" }}>{inp.label}</td>
                  <td>{f ? <Link href={`/factor/${f.rf_id}/`} style={{ color: "var(--accent)" }}>{f.name}</Link>
                    : <span style={{ color: "var(--muted-3)", fontSize: 12.5 }}>{inp.rf_id ? inp.rf_id : "— derived / not in atlas"}</span>}</td>
                  <td className={inp.category ? `cat-${inp.category}` : ""} style={{ fontSize: 12.5 }}>
                    {inp.category ? <span className="chip"><span className="chip-dot" />{CATEGORY_LABELS[inp.category] ?? inp.category}</span> : "—"}
                  </td>
                  <td>{f ? <span className={`grade-pill grade-${f.evidence_grade}`}>{f.evidence_grade}</span> : "—"}</td>
                  <td style={{ fontSize: 12, color: "var(--muted)", maxWidth: 240 }}>{inp.note}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* references */}
      {c.references.length > 0 && (
        <>
          <h2 className="font-display" style={{ fontSize: 18, color: "var(--text)", margin: "0 0 12px" }}>References</h2>
          <div className="card" style={{ padding: 16 }}>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {c.references.map((r, i) => {
                const url = r.pmid ? `https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/` : (r.doi ? `https://doi.org/${r.doi}` : undefined);
                return (
                  <li key={i} style={{ borderBottom: "1px solid var(--hairline)", paddingBottom: 8, fontSize: 13.5 }}>
                    {url ? <a href={url} target="_blank" rel="noopener" style={{ color: "var(--text)", fontWeight: 500 }}>{r.title || "(untitled)"}</a>
                      : <span style={{ color: "var(--text)" }}>{r.title || "(untitled)"}</span>}
                    <span style={{ color: "var(--muted)", fontSize: 12.5 }}> — {r.journal || ""} {r.year || ""}{r.pmid ? ` · PMID ${r.pmid}` : ""}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </main>
  );
}
