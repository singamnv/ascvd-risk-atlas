import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllFactorIds, getEvidence, CATEGORY_LABELS, TYPE_LABELS } from "@/lib/data";

export function generateStaticParams() {
  return getAllFactorIds().map((id) => ({ id }));
}
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const e = getEvidence(id);
  return { title: e ? e.canonical_name : "Risk factor" };
}

function pmidUrl(pmid: string | null, doi: string | null) {
  if (pmid) return `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;
  if (doi) return `https://doi.org/${doi}`;
  return undefined;
}

export default async function FactorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const e = getEvidence(id);
  if (!e) notFound();
  const sc = e.score_components;

  return (
    <main className="container-x" style={{ paddingTop: 24, paddingBottom: 30, maxWidth: 1080 }}>
      <Link href="/table/" className="nav-link" style={{ fontSize: 13 }}>← Back to table</Link>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, margin: "14px 0 8px", flexWrap: "wrap" }}>
        <span className={`grade-pill grade-${e.evidence_grade}`} style={{ width: 40, height: 40, fontSize: 20, borderRadius: 10 }}>{e.evidence_grade}</span>
        <div style={{ flex: 1, minWidth: 240 }}>
          <h1 className="font-display" style={{ fontSize: 30, color: "var(--text)", margin: 0, fontWeight: 700 }}>{e.canonical_name}</h1>
          <div className={`cat-${e.category}`} style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            <span className="chip"><span className="chip-dot" />{CATEGORY_LABELS[e.category] ?? e.category}</span>
            <span className="chip">{TYPE_LABELS[e.factor_type] ?? e.factor_type}</span>
            <span className="chip">{e.direction}</span>
            <span className="chip">{e.modifiable.replace(/_/g, " ")}</span>
            {e.genetic_causal_candidate && <span className="chip" style={{ color: "var(--grade-A)", borderColor: "var(--grade-A)" }}>genetic-causal</span>}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="font-display" style={{ fontSize: 34, fontWeight: 700, color: "var(--text)" }}>{e.evidence_score.toFixed(0)}</div>
          <div className="mono-kicker">evidence score</div>
        </div>
      </div>

      {e.aliases.length > 0 && (
        <p style={{ color: "var(--muted)", fontSize: 13, margin: "4px 0 18px" }}>
          <strong style={{ color: "var(--muted-2)" }}>Also known as:</strong> {e.aliases.join(", ")}
        </p>
      )}

      {/* PREVENT status + score breakdown */}
      <div className="grid-auto" style={{ marginBottom: 24 }}>
        <div className="card" style={{ padding: 16 }}>
          <div className="mono-kicker" style={{ marginBottom: 8 }}>PREVENT status</div>
          {e.in_prevent
            ? <p style={{ margin: 0, fontSize: 14 }}>✓ Used by PREVENT (<strong>{e.in_prevent_tier}</strong> input).</p>
            : <p style={{ margin: 0, fontSize: 14, color: "var(--text-2)" }}>Not a PREVENT input variable.</p>}
          {e.in_pce && <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--muted)" }}>Also used by the Pooled Cohort Equations.</p>}
        </div>
        <div className="card" style={{ padding: 16 }}>
          <div className="mono-kicker" style={{ marginBottom: 8 }}>Causal support</div>
          <p style={{ margin: 0, fontSize: 14 }}>{e.causal_support.replace(/_/g, " ")}</p>
        </div>
        <div className="card" style={{ padding: 16 }}>
          <div className="mono-kicker" style={{ marginBottom: 8 }}>Score components</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: 12.5, fontFamily: "var(--ff-mono)", color: "var(--muted)" }}>
            <span>lit volume: {sc.literature_volume}</span>
            <span>meta-analyses: {sc.meta_analysis}</span>
            <span>trials: {sc.trial_support}</span>
            <span>genetic: {sc.genetic_support}</span>
            <span>MR bonus: {sc.mr_bonus}</span>
          </div>
        </div>
      </div>

      {/* Genetic genes */}
      {e.genetic_genes.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div className="mono-kicker" style={{ marginBottom: 6 }}>Associated genes</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {e.genetic_genes.map((g) => <span key={g} className="chip" style={{ fontFamily: "var(--ff-mono)" }}>{g}</span>)}
          </div>
        </div>
      )}

      {/* Evidence tabs as sections */}
      <EvidenceSection title={`References (${e.counts.references})`} sub={`${e.counts.meta_analyses} meta-analyses / systematic reviews`}>
        {e.references.length === 0 ? <Empty /> : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {e.references.slice(0, 100).map((r, i) => {
              const url = pmidUrl(r.pmid, r.doi);
              return (
                <li key={i} style={{ borderBottom: "1px solid var(--hairline)", paddingBottom: 8 }}>
                  {r.is_meta && <span className="chip" style={{ padding: "1px 7px", fontSize: 10, marginRight: 6, color: "var(--grade-A)", borderColor: "var(--grade-A)" }}>META</span>}
                  {url ? <a href={url} target="_blank" rel="noopener" style={{ color: "var(--text)", fontWeight: 500 }}>{r.title || "(untitled)"}</a>
                    : <span style={{ color: "var(--text)" }}>{r.title || "(untitled)"}</span>}
                  <span style={{ color: "var(--muted)", fontSize: 12.5 }}> — {r.journal || "n/a"} {r.year || ""}{r.pmid ? ` · PMID ${r.pmid}` : ""}</span>
                </li>
              );
            })}
          </ul>
        )}
      </EvidenceSection>

      <EvidenceSection title={`Clinical trials (${e.counts.trials})`} sub={e.counts.trials > e.trials.length ? `showing top ${e.trials.length}` : ""}>
        {e.trials.length === 0 ? <Empty /> : (
          <div className="table-scroll">
            <table className="data-table">
              <thead><tr><th>NCT</th><th>Title</th><th>Status</th><th>Type</th><th>Interventions</th></tr></thead>
              <tbody>
                {e.trials.map((t) => (
                  <tr key={t.nct_id}>
                    <td><a href={`https://clinicaltrials.gov/study/${t.nct_id}`} target="_blank" rel="noopener" style={{ color: "var(--accent)", fontFamily: "var(--ff-mono)", fontSize: 12.5 }}>{t.nct_id}</a></td>
                    <td style={{ maxWidth: 380 }}>{t.title}</td>
                    <td style={{ fontSize: 12, color: "var(--muted)" }}>{(t.status || "").replace(/_/g, " ")}</td>
                    <td style={{ fontSize: 12, color: "var(--muted)" }}>{t.study_type}</td>
                    <td style={{ fontSize: 12, color: "var(--muted)" }}>{(t.interventions || []).slice(0, 3).join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </EvidenceSection>

      <EvidenceSection title={`Genetic associations (${e.counts.gwas})`} sub={e.counts.gwas > e.gwas.length ? `showing top ${e.gwas.length} by significance` : ""}>
        {e.gwas.length === 0 ? <Empty /> : (
          <div className="table-scroll">
            <table className="data-table">
              <thead><tr><th>Variant</th><th>Gene(s)</th><th>Trait</th><th style={{ textAlign: "right" }}>p</th><th style={{ textAlign: "right" }}>OR/β</th><th>Study</th></tr></thead>
              <tbody>
                {e.gwas.map((g, i) => (
                  <tr key={i}>
                    <td><a href={`https://www.ebi.ac.uk/gwas/variants/${g.rs_id}`} target="_blank" rel="noopener" style={{ color: "var(--accent)", fontFamily: "var(--ff-mono)", fontSize: 12.5 }}>{g.rs_id}</a></td>
                    <td style={{ fontFamily: "var(--ff-mono)", fontSize: 12 }}>{(g.mapped_genes || []).join(", ")}</td>
                    <td style={{ fontSize: 12.5 }}>{g.efo_trait}</td>
                    <td style={{ textAlign: "right", fontFamily: "var(--ff-mono)", fontSize: 12 }}>{g.pvalue_exponent != null ? `1e${g.pvalue_exponent}` : (g.p_value ?? "—")}</td>
                    <td style={{ textAlign: "right", fontFamily: "var(--ff-mono)", fontSize: 12 }}>{g.or_value ?? g.beta ?? "—"}</td>
                    <td><a href={`https://www.ebi.ac.uk/gwas/studies/${g.study_accession}`} target="_blank" rel="noopener" style={{ color: "var(--muted)", fontFamily: "var(--ff-mono)", fontSize: 11.5 }}>{g.study_accession}</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </EvidenceSection>
    </main>
  );
}

function EvidenceSection({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
        <h2 className="font-display" style={{ fontSize: 18, color: "var(--text)", margin: 0 }}>{title}</h2>
        {sub && <span style={{ color: "var(--muted-2)", fontSize: 12.5 }}>{sub}</span>}
      </div>
      <div className="card" style={{ padding: 16, overflowX: "auto" }}>{children}</div>
    </section>
  );
}
function Empty() { return <p style={{ margin: 0, color: "var(--muted-3)", fontSize: 14 }}>None linked.</p>; }
