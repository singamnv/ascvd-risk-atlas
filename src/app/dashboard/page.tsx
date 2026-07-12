import { getEffects, getDrugTargets, getCalculators, getStats, getFactors } from "@/lib/data";
import { CATEGORY_LABELS } from "@/lib/labels";
import DashboardCharts from "@/components/DashboardCharts";

export const metadata = { title: "Analytics dashboard" };

const CAT_COLORS: Record<string, string> = {
  lipids: "#f59e0b", blood_pressure: "#ef4444", glycemic_metabolic: "#f97316",
  anthropometric: "#eab308", inflammatory_immune: "#ec4899", renal: "#14b8a6",
  hemostatic: "#dc2626", lifestyle_behavioral: "#22c55e", genetic_familial: "#8b5cf6",
  demographic_social: "#64748b", psychosocial: "#a855f7", imaging_subclinical: "#06b6d4",
  comorbid_conditions: "#6366f1", environmental: "#84cc16", novel_biomarkers: "#3b82f6",
};

export default function DashboardPage() {
  const eff = getEffects();
  const drug = getDrugTargets();
  const calc = getCalculators();
  const stats = getStats();
  const factors = getFactors();

  // ---- Figure 1: highest-risk factors (categorical-comparable, reliable first) ----
  const rankable = eff.factors
    .filter((f) => f.comparable_categorical && f.reliability !== "none" && f.direction === "risk")
    .sort((a, b) => b.risk_magnitude_score - a.risk_magnitude_score);
  const topFactors = rankable.slice(0, 22).map((f) => ({
    name: f.name.length > 34 ? f.name.slice(0, 32) + "…" : f.name,
    rf_id: f.rf_id, score: Math.round(f.risk_magnitude_score * 10) / 10,
    effect: f.typical_rr_equiv, metric: f.primary_metric, n: f.n_estimates_extracted,
    reliability: f.reliability, category: f.category, color: CAT_COLORS[f.category] ?? "#6366f1",
  }));

  // ---- Figure 2: risk magnitude by category group (median of comparable risk factors) ----
  const byCatEff: Record<string, number[]> = {};
  eff.factors.filter((f) => f.comparable_categorical && f.direction === "risk").forEach((f) => {
    (byCatEff[f.category] ??= []).push(f.risk_magnitude_score);
  });
  const catRisk = Object.entries(byCatEff).map(([cid, arr]) => {
    const sorted = [...arr].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    return { cid, label: CATEGORY_LABELS[cid] ?? cid, median: Math.round(median * 10) / 10,
      max: Math.round(Math.max(...arr) * 10) / 10, n: arr.length, color: CAT_COLORS[cid] ?? "#6366f1" };
  }).sort((a, b) => b.median - a.median);

  // ---- Figure 3: drug-target coverage by group ----
  const drugByCat = Object.entries(drug.category_rollup_all_997).map(([cid, r]) => ({
    cid, label: CATEGORY_LABELS[cid] ?? cid,
    approved: r.approved, investigational: r.investigational, lifestyle: r.lifestyle_only, none: r.none,
    total: r.n_factors,
  })).sort((a, b) => (b.approved + b.investigational) / b.total - (a.approved + a.investigational) / a.total);

  // ---- Figure 4: evidence gradient (A→D) by group ----
  const evidByCat = stats.categories.map((c) => ({
    cid: c.id, label: CATEGORY_LABELS[c.id] ?? c.name,
    A: c.grades.A ?? 0, B: c.grades.B ?? 0, C: c.grades.C ?? 0, D: c.grades.D ?? 0, total: c.n,
  })).sort((a, b) => (b.A + b.B) - (a.A + a.B));

  // ---- Figure 5: calculator inclusion — how many of the 17 calculators include each factor ----
  const inclCount: Record<string, { name: string; category: string; count: number }> = {};
  calc.calculators.forEach((c) => {
    const seen = new Set<string>();
    c.inputs.forEach((i) => { if (i.rf_id && !seen.has(i.rf_id)) { seen.add(i.rf_id); } });
    seen.forEach((rid) => {
      const f = factors.find((x) => x.rf_id === rid);
      inclCount[rid] ??= { name: f?.name ?? rid, category: f?.category ?? "", count: 0 };
      inclCount[rid].count++;
    });
  });
  const topIncluded = Object.entries(inclCount)
    .map(([rid, v]) => ({ rf_id: rid, ...v, color: CAT_COLORS[v.category] ?? "#94a3b8" }))
    .sort((a, b) => b.count - a.count).slice(0, 20);

  // ---- Figure 6: calculator coverage ranking ----
  const calcRank = [...calc.calculators].sort((a, b) => a.coverage_rank - b.coverage_rank).map((c) => ({
    calc_id: c.calc_id, name: c.name, strong: c.n_strong_covered,
    other: c.n_factors_covered - c.n_strong_covered, inputs: c.n_inputs, cats: c.n_categories_covered,
  }));

  return (
    <main className="container-x" style={{ paddingTop: 28, paddingBottom: 30 }}>
      <div className="mono-kicker" style={{ marginBottom: 8 }}>Analytics</div>
      <h1 className="font-display" style={{ fontSize: 28, color: "var(--text)", margin: "0 0 8px", fontWeight: 700 }}>
        Risk factor dashboard
      </h1>
      <p style={{ color: "var(--text-2)", fontSize: 15, lineHeight: 1.6, margin: "0 0 8px", maxWidth: 900 }}>
        Cross-cutting views of the {stats.n_factors.toLocaleString()}-factor atlas: which factors and groups confer the
        greatest risk, which are pharmacologically targetable, how evidence is distributed, and how much of this the
        risk calculators actually capture.
      </p>
      <DashboardCharts
        topFactors={topFactors}
        catRisk={catRisk}
        drugByCat={drugByCat}
        evidByCat={evidByCat}
        topIncluded={topIncluded}
        calcRank={calcRank}
        effScoring={eff.scoring}
        effN={{ total: eff.n_factors, withEst: eff.n_with_estimates, estimates: eff.total_estimates_extracted }}
        drugN={{ withTarget: drug.n_with_drug_target, total: drug.n_factors, curated: drug.n_curated_mapped }}
      />
    </main>
  );
}
