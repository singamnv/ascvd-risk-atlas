"use client";
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import type { FactorSlim } from "@/lib/types";
import { CATEGORY_LABELS, TYPE_LABELS } from "@/lib/labels";

type SortKey = "name" | "category" | "factor_type" | "evidence_grade" | "evidence_score" | "n_references" | "n_trials" | "n_gwas";
const GRADE_ORDER = { A: 0, B: 1, C: 2, D: 3 };

export default function RiskFactorTable({
  factors, categories, factorTypes,
}: {
  factors: FactorSlim[];
  categories: { id: string; name: string }[];
  factorTypes: { id: string; name: string }[];
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("");
  const [ftype, setFtype] = useState<string>("");
  const [grade, setGrade] = useState<string>("");
  const [prevent, setPrevent] = useState<string>(""); // "", "in", "out", "gap"
  const [modif, setModif] = useState<string>("");
  const [sortKey, setSortKey] = useState<SortKey>("evidence_score");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // read ?cat= from URL on mount
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const c = p.get("cat"); if (c) setCat(c);
    const g = p.get("grade"); if (g) setGrade(g);
  }, []);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    let rows = factors.filter((f) => {
      if (cat && f.category !== cat) return false;
      if (ftype && f.factor_type !== ftype) return false;
      if (grade && f.evidence_grade !== grade) return false;
      if (modif && f.modifiable !== modif) return false;
      if (prevent === "in" && !f.in_prevent) return false;
      if (prevent === "out" && f.in_prevent) return false;
      if (prevent === "gap" && (f.in_prevent || f.captured_via_proxy || !(f.evidence_grade === "A" || f.evidence_grade === "B"))) return false;
      if (ql) {
        const hay = (f.name + " " + f.aliases.join(" ")).toLowerCase();
        if (!hay.includes(ql)) return false;
      }
      return true;
    });
    rows = [...rows].sort((a, b) => {
      let av: number | string, bv: number | string;
      if (sortKey === "evidence_grade") { av = GRADE_ORDER[a.evidence_grade]; bv = GRADE_ORDER[b.evidence_grade]; }
      else if (sortKey === "name" || sortKey === "category" || sortKey === "factor_type") { av = a[sortKey]; bv = b[sortKey]; }
      else { av = a[sortKey]; bv = b[sortKey]; }
      let cmp = typeof av === "string" ? av.localeCompare(bv as string) : (av as number) - (bv as number);
      // tie-break by score desc
      if (cmp === 0 && sortKey !== "evidence_score") cmp = b.evidence_score - a.evidence_score;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [factors, q, cat, ftype, grade, prevent, modif, sortKey, sortDir]);

  function toggleSort(k: SortKey) {
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(k); setSortDir(k === "name" || k === "category" || k === "factor_type" ? "asc" : "desc"); }
  }
  function arrow(k: SortKey) { return sortKey === k ? (sortDir === "asc" ? " ↑" : " ↓") : ""; }
  function reset() { setQ(""); setCat(""); setFtype(""); setGrade(""); setPrevent(""); setModif(""); }

  const activeFilters = [cat, ftype, grade, prevent, modif, q].filter(Boolean).length;

  return (
    <div>
      {/* Filter bar */}
      <div className="card" style={{ padding: 14, marginBottom: 16, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <input className="field-input" placeholder="Search name or alias…" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: "1 1 220px", minWidth: 180 }} />
        <select className="field-select" value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{CATEGORY_LABELS[c.id] ?? c.name}</option>)}
        </select>
        <select className="field-select" value={ftype} onChange={(e) => setFtype(e.target.value)}>
          <option value="">All types</option>
          {factorTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <select className="field-select" value={grade} onChange={(e) => setGrade(e.target.value)}>
          <option value="">All grades</option>
          <option value="A">A — strong / causal</option>
          <option value="B">B — moderate</option>
          <option value="C">C — emerging</option>
          <option value="D">D — preliminary</option>
        </select>
        <select className="field-select" value={prevent} onChange={(e) => setPrevent(e.target.value)}>
          <option value="">PREVENT: any</option>
          <option value="in">In PREVENT</option>
          <option value="out">Not in PREVENT</option>
          <option value="gap">Gap (strong, omitted)</option>
        </select>
        <select className="field-select" value={modif} onChange={(e) => setModif(e.target.value)}>
          <option value="">Modifiability: any</option>
          <option value="modifiable">Modifiable</option>
          <option value="partially_modifiable">Partially modifiable</option>
          <option value="non_modifiable">Non-modifiable</option>
        </select>
        {activeFilters > 0 && <button className="btn" onClick={reset}>Clear ({activeFilters})</button>}
        <span style={{ marginLeft: "auto", fontFamily: "var(--ff-mono)", fontSize: 13, color: "var(--muted)" }}>
          {filtered.length.toLocaleString()} shown
        </span>
      </div>

      {/* Table */}
      <div className="card table-scroll" style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => toggleSort("name")}>Risk factor{arrow("name")}</th>
              <th onClick={() => toggleSort("category")}>Category{arrow("category")}</th>
              <th onClick={() => toggleSort("factor_type")}>Type{arrow("factor_type")}</th>
              <th onClick={() => toggleSort("evidence_grade")}>Grade{arrow("evidence_grade")}</th>
              <th onClick={() => toggleSort("evidence_score")} style={{ textAlign: "right" }}>Score{arrow("evidence_score")}</th>
              <th onClick={() => toggleSort("n_references")} style={{ textAlign: "right" }}>Refs{arrow("n_references")}</th>
              <th onClick={() => toggleSort("n_trials")} style={{ textAlign: "right" }}>Trials{arrow("n_trials")}</th>
              <th onClick={() => toggleSort("n_gwas")} style={{ textAlign: "right" }}>GWAS{arrow("n_gwas")}</th>
              <th>PREVENT</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f) => (
              <tr key={f.rf_id}>
                <td>
                  <Link href={`/factor/${f.rf_id}/`} style={{ fontWeight: 600, color: "var(--text)" }}>{f.name}</Link>
                  <div style={{ display: "flex", gap: 5, marginTop: 3, flexWrap: "wrap" }}>
                    {f.genetic_causal_candidate && <span className="chip" style={{ padding: "1px 7px", fontSize: 10.5, color: "var(--grade-A)", borderColor: "var(--grade-A)" }}>genetic-causal</span>}
                    {f.direction === "protective" && <span className="chip" style={{ padding: "1px 7px", fontSize: 10.5 }}>protective</span>}
                  </div>
                </td>
                <td className={`cat-${f.category}`}>
                  <span className="chip"><span className="chip-dot" />{CATEGORY_LABELS[f.category] ?? f.category}</span>
                </td>
                <td style={{ color: "var(--muted)", fontSize: 13 }}>{TYPE_LABELS[f.factor_type] ?? f.factor_type}</td>
                <td><span className={`grade-pill grade-${f.evidence_grade}`}>{f.evidence_grade}</span></td>
                <td style={{ textAlign: "right", fontFamily: "var(--ff-mono)", fontSize: 13 }}>{f.evidence_score.toFixed(0)}</td>
                <td style={{ textAlign: "right", fontFamily: "var(--ff-mono)", fontSize: 13 }}>
                  {f.n_references}{f.n_meta_analyses > 0 && <span style={{ color: "var(--grade-A)" }}> ·{f.n_meta_analyses}m</span>}
                </td>
                <td style={{ textAlign: "right", fontFamily: "var(--ff-mono)", fontSize: 13, color: f.n_trials ? "var(--text-2)" : "var(--muted-3)" }}>{f.n_trials || "—"}</td>
                <td style={{ textAlign: "right", fontFamily: "var(--ff-mono)", fontSize: 13, color: f.n_gwas ? "var(--text-2)" : "var(--muted-3)" }}>{f.n_gwas || "—"}</td>
                <td>
                  {f.in_prevent ? <span className="chip" style={{ color: "var(--grade-A)", borderColor: "var(--grade-A)" }}>{f.in_prevent_tier}</span>
                    : f.captured_via_proxy ? <span className="chip" style={{ color: "var(--grade-C)" }}>proxy</span>
                    : <span style={{ color: "var(--muted-3)", fontSize: 12 }}>—</span>}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={9} style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>No risk factors match these filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
