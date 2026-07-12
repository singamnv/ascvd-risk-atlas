export type Grade = "A" | "B" | "C" | "D";

export interface FactorSlim {
  rf_id: string;
  name: string;
  aliases: string[];
  category: string;
  factor_type: string;
  direction: string;
  modifiable: string;
  in_prevent: boolean;
  in_prevent_tier: string | null;
  prevent_concept: string | null;
  in_pce: boolean;
  captured_via_proxy: boolean;
  n_references: number;
  n_meta_analyses: number;
  n_trials: number;
  n_gwas: number;
  genetic_causal_candidate: boolean;
  causal_support: string;
  evidence_grade: Grade;
  evidence_score: number;
}

export interface Reference {
  pmid: string | null; doi: string | null; title: string | null;
  journal: string | null; year: string | null; type: string | null;
  is_meta: boolean; source: string | null;
}
export interface Trial {
  nct_id: string; title: string | null; status: string | null;
  phase: string[] | null; study_type: string | null;
  conditions: string[]; interventions: string[];
}
export interface GwasRow {
  rs_id: string | null; mapped_genes: string[] | null; efo_trait: string | null;
  reported_trait: string[] | string | null; p_value: number | null;
  pvalue_exponent: number | null; or_value: number | null; beta: number | null;
  study_accession: string | null; pubmed_id: string | null;
}
export interface EvidenceBundle {
  rf_id: string; canonical_name: string; aliases: string[];
  category: string; factor_type: string; direction: string; modifiable: string;
  in_prevent: boolean; in_prevent_tier: string | null; in_pce: boolean;
  evidence_grade: Grade; evidence_score: number;
  score_components: Record<string, number>;
  causal_support: string; genetic_causal_candidate: boolean; genetic_genes: string[];
  counts: { references: number; meta_analyses: number; trials: number; gwas: number };
  references: Reference[]; trials: Trial[]; gwas: GwasRow[];
}

export interface CategoryStat {
  id: string; name: string; short: string; order: number; description: string;
  n: number; grades: Record<string, number>;
  n_in_prevent: number; n_strong: number; n_with_genetic: number; n_with_trials: number;
}
export interface FactorType { id: string; name: string; description: string; }
export interface Stats {
  n_factors: number; n_prevent: number; n_pce: number;
  by_grade: Record<string, number>;
  by_category: Record<string, number>;
  by_type: Record<string, number>;
  by_direction: Record<string, number>;
  by_modifiable: Record<string, number>;
  evidence_totals: Record<string, number | null>;
  categories: CategoryStat[];
  factor_types: FactorType[];
  harvest_sources: Record<string, number>;
}
export interface EffectFactor {
  rf_id: string; name: string; category: string; evidence_grade: Grade;
  in_prevent: boolean; modifiable: string;
  primary_metric: string; typical_effect: number; typical_rr_equiv: number;
  effect_range: [number, number]; direction: string;
  n_estimates_extracted: number; per_sd_or_categorical: string;
  comparable_categorical: boolean; risk_magnitude_score: number;
  reliability: string; heterogeneity_note: string; example_pmids: string[];
}
export interface EffectData {
  description: string; n_factors: number; n_with_estimates: number;
  n_comparable_categorical: number; total_estimates_extracted: number;
  scoring: string; factors: EffectFactor[];
}
export interface DrugFactor {
  rf_id: string; name: string; category: string; modifiable: string;
  evidence_grade: Grade; in_prevent: boolean; has_drug_target: boolean;
  target_status: string; drug_classes: string[]; example_agents: string[]; example_ncts: string[];
}
export interface DrugCatRollup { n_factors: number; approved: number; investigational: number; lifestyle_only: number; none: number; curated_mapped?: number; }
export interface DrugData {
  description: string; target_status_legend: Record<string, string>;
  n_factors: number; n_with_drug_target: number; n_curated_mapped: number;
  overall_status_counts: Record<string, number>;
  category_rollup_all_997: Record<string, DrugCatRollup>;
  category_rollup_target_factors_148: Record<string, DrugCatRollup>;
  factors: DrugFactor[];
}
export interface CalcInput { label: string; rf_id: string | null; category: string | null; note: string; }
export interface CalcRef { pmid: string | null; doi: string | null; title: string | null; journal: string | null; year: number | null; }
export interface Calculator {
  calc_id: string; name: string; full_name: string; year: number; region: string;
  population: string; outcome_predicted: string; time_horizon: string;
  n_inputs: number; inputs: CalcInput[];
  n_factors_covered: number; n_categories_covered: number; n_strong_covered: number;
  coverage_rank: number; strengths: string[]; weaknesses: string[]; references: CalcRef[];
}
export interface CalcData {
  description: string; n_calculators: number; ranking_criteria: string;
  atlas_reference: { n_factors: number; n_categories: number; grade_counts: Record<string, number> };
  calculators: Calculator[];
}

export interface PreventGap {
  prevent_inputs: { var: string; category: string; note?: string }[];
  prevent_factor_ids: string[];
  n_prevent_variables: number;
  n_strong_total: number;
  n_strong_in_prevent: number;
  n_strong_proxy: number;
  n_strong_genuinely_omitted: number;
  proxy_captured: { rf_id: string; name: string; grade: Grade; proxy_note: string }[];
  omitted_by_category: Record<string, string[]>;
  top_omitted: {
    rf_id: string; name: string; category: string; grade: Grade; score: number;
    causal_support: string; genetic_causal_candidate: boolean; n_references: number; n_meta_analyses: number;
    n_trials: number; n_gwas: number; direction: string; modifiable: string;
  }[];
}
