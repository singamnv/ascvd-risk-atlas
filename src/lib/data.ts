import fs from "node:fs";
import path from "node:path";
import type { FactorSlim, EvidenceBundle, Stats, PreventGap, EffectData, DrugData, CalcData } from "./types";

const DATA_DIR = path.join(process.cwd(), "public", "data");
function readJSON<T>(rel: string): T {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, rel), "utf-8")) as T;
}

export function getFactors(): FactorSlim[] { return readJSON<FactorSlim[]>("factors.json"); }
export function getStats(): Stats { return readJSON<Stats>("stats.json"); }
export function getPreventGap(): PreventGap { return readJSON<PreventGap>("prevent_gap.json"); }
export function getScope(): Record<string, unknown> { return readJSON("scope.json"); }
export function getEffects(): EffectData { return readJSON<EffectData>("effect_sizes.json"); }
export function getDrugTargets(): DrugData { return readJSON<DrugData>("drug_targets.json"); }
export function getCalculators(): CalcData { return readJSON<CalcData>("calculators.json"); }

export function getEvidence(rfId: string): EvidenceBundle | null {
  const p = path.join(DATA_DIR, "evidence", rfId + ".json");
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, "utf-8")) as EvidenceBundle;
}
export function getAllFactorIds(): string[] { return getFactors().map((f) => f.rf_id); }

export { CATEGORY_LABELS, TYPE_LABELS } from "./labels";
