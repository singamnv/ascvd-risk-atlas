import { getStats } from "@/lib/data";

export const metadata = { title: "Methodology" };

export default function AboutPage() {
  const stats = getStats();
  const hs = stats.harvest_sources;
  return (
    <main className="container-x" style={{ paddingTop: 28, paddingBottom: 40, maxWidth: 860 }}>
      <h1 className="font-display" style={{ fontSize: 28, color: "var(--text)", margin: "0 0 16px", fontWeight: 700 }}>Methodology</h1>

      <Section title="What this is">
        <p>The ASCVD Risk Factor Atlas is a de novo, evidence-linked catalog of every risk factor reported in the
        biomedical literature for atherosclerotic cardiovascular disease — coronary heart disease, ischemic stroke,
        peripheral artery disease, and aortic/large-artery atherosclerosis. It was built ground-up by mining primary
        sources rather than transcribing an existing guideline list, so it surfaces both established factors and
        uncommon or emerging ones.</p>
      </Section>

      <Section title="How it was built">
        <ol style={{ paddingLeft: 20, lineHeight: 1.7 }}>
          <li><strong>Literature harvest</strong> — {(stats.evidence_totals.distinct_articles ?? 0).toLocaleString()} distinct
          articles from PubMed and OpenAlex across broad, per-category, and study-type queries.</li>
          <li><strong>Candidate extraction</strong> — named-entity extraction over abstracts surfaced every mentioned risk
          factor / exposure / biomarker, each linked to its source article.</li>
          <li><strong>Trials & genetics</strong> — {(hs.clinical_trials ?? 0).toLocaleString()} ClinicalTrials.gov studies
          and {((hs.gwas_trait_assoc ?? 0) + (hs.gwas_gene_assoc ?? 0)).toLocaleString()} GWAS Catalog associations (trait- and
          gene-anchored) were harvested for linking.</li>
          <li><strong>Canonicalization</strong> — synonyms were merged into {stats.n_factors.toLocaleString()} distinct
          canonical factors, each assigned a category, type, direction, and modifiability.</li>
          <li><strong>Evidence linking & grading</strong> — references, trials, and genetic associations were attached to each
          factor and combined into an evidence-strength grade and score.</li>
        </ol>
      </Section>

      <Section title="Evidence grading">
        <p>Each factor receives a grade from its evidence profile:</p>
        <ul style={{ paddingLeft: 20, lineHeight: 1.8 }}>
          <li><span className="grade-pill grade-A" style={{ marginRight: 6 }}>A</span> Strong &amp; causal — multiple meta-analyses, or genetic/Mendelian-randomization support plus trial evidence, with high literature volume.</li>
          <li><span className="grade-pill grade-B" style={{ marginRight: 6 }}>B</span> Moderate — consistent evidence with a meta-analysis or genetic association.</li>
          <li><span className="grade-pill grade-C" style={{ marginRight: 6 }}>C</span> Emerging — several primary studies, limited meta-analytic/causal confirmation.</li>
          <li><span className="grade-pill grade-D" style={{ marginRight: 6 }}>D</span> Preliminary — few reports or single studies.</li>
        </ul>
        <p style={{ color: "var(--muted)", fontSize: 13.5 }}>The score (0–100) weights literature volume, meta-analyses,
        linked trials, genetic associations, and a Mendelian-randomization bonus. This is a pragmatic ranking to gauge how
        much evidence a factor carries — not a formal GRADE assessment.</p>
      </Section>

      <Section title="Limitations">
        <ul style={{ paddingLeft: 20, lineHeight: 1.7, color: "var(--text-2)" }}>
          <li>Extraction is automated; category/direction assignments are best-effort and may contain errors.</li>
          <li>Trial and gene→factor links are keyword/curation based and can miss or over-include.</li>
          <li>Reference counts reflect this harvest, not the entire literature — they index attention, not truth.</li>
          <li>Some bidirectional conditions (e.g. heart failure) appear as factors where the literature reports them as such.</li>
        </ul>
      </Section>

      <p style={{ marginTop: 24, padding: 14, background: "var(--panel-2)", borderRadius: 10, fontSize: 13, color: "var(--muted)" }}>
        Research and informational use only. Nothing here is medical advice; clinical decisions require a qualified
        professional with full patient context.
      </p>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 24 }}>
      <h2 className="font-display" style={{ fontSize: 19, color: "var(--text)", margin: "0 0 8px" }}>{title}</h2>
      <div style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--text-2)" }}>{children}</div>
    </section>
  );
}
