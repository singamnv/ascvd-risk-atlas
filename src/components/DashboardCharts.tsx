"use client";
import Link from "next/link";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
  LabelList, Legend,
} from "recharts";

type TopFactor = { name: string; rf_id: string; score: number; effect: number; metric: string; n: number; reliability: string; category: string; color: string };
type CatRisk = { cid: string; label: string; median: number; max: number; n: number; color: string };
type DrugCat = { cid: string; label: string; approved: number; investigational: number; lifestyle: number; none: number; total: number };
type EvidCat = { cid: string; label: string; A: number; B: number; C: number; D: number; total: number };
type Included = { rf_id: string; name: string; category: string; count: number; color: string };
type CalcRank = { calc_id: string; name: string; strong: number; other: number; inputs: number; cats: number };

const GRADE_COLORS = { A: "#16a34a", B: "#0891b2", C: "#d97706", D: "#cbd5e1" };
const AXIS = { fontSize: 12, fill: "#64748b", fontFamily: "var(--ff-mono)" };

function Figure({ title, caption, method, children, height = 420 }: {
  title: string; caption: string; method?: string; children: React.ReactNode; height?: number;
}) {
  return (
    <section style={{ marginBottom: 30 }}>
      <h2 className="font-display" style={{ fontSize: 19, color: "var(--text)", margin: "0 0 4px" }}>{title}</h2>
      <p style={{ color: "var(--muted)", fontSize: 13.5, margin: "0 0 14px", maxWidth: 900, lineHeight: 1.5 }}>{caption}</p>
      <div className="card" style={{ padding: "18px 16px 12px" }}>
        <div style={{ width: "100%", height }}>{children}</div>
        {method && <p style={{ color: "var(--muted-2)", fontSize: 11.5, fontFamily: "var(--ff-mono)", margin: "10px 6px 2px", lineHeight: 1.5 }}>▸ {method}</p>}
      </div>
    </section>
  );
}

export default function DashboardCharts(props: {
  topFactors: TopFactor[]; catRisk: CatRisk[]; drugByCat: DrugCat[];
  evidByCat: EvidCat[]; topIncluded: Included[]; calcRank: CalcRank[];
  effScoring: string; effN: { total: number; withEst: number; estimates: number };
  drugN: { withTarget: number; total: number; curated: number };
}) {
  const { topFactors, catRisk, drugByCat, evidByCat, topIncluded, calcRank, effScoring, effN, drugN } = props;

  return (
    <div>
      {/* FIG 1 — highest-risk individual factors */}
      <Figure
        title="1 · Markers conferring the highest risk"
        caption="Risk-magnitude score for individual factors with a categorical effect estimate (high-vs-low or presence-vs-absence). Bars with a faded/hatched fill rest on a single extracted estimate — wide confidence intervals, read with caution. Colored by category; hover for the effect size, estimate count, and reliability."
        method={`Score = 100·ln(min(RR-equiv, 6))/ln(6), where the reported HR/OR/RR is treated as a fold-risk. ${effN.estimates} estimates were LLM-extracted from ${effN.withEst} factors' abstracts (meta-analyses preferred). typical_effect is the median of a factor's CATEGORICAL estimates only; per-SD/continuous estimates are retained in the record but excluded from this ranking. Several top-ranked factors (HIV, visceral adiposity, epicardial fat) rest on a single study — their high rank reflects one wide-CI estimate, not settled magnitude.`}
        height={Math.max(420, topFactors.length * 26)}
      >
        <ResponsiveContainer>
          <BarChart data={topFactors} layout="vertical" margin={{ left: 8, right: 60, top: 4, bottom: 4 }}>
            <CartesianGrid horizontal={false} stroke="rgba(11,18,32,0.07)" />
            <XAxis type="number" domain={[0, 100]} tick={AXIS} label={{ value: "risk-magnitude score", position: "insideBottom", offset: -2, style: { fontSize: 11, fill: "#8a97ad" } }} />
            <YAxis type="category" dataKey="name" width={210} tick={{ fontSize: 12, fill: "#31405c" }} interval={0} />
            <Tooltip content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload as TopFactor;
              return (
                <div className="card" style={{ padding: 10, fontSize: 12.5, maxWidth: 260 }}>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{d.name}</div>
                  <div>{d.metric} ≈ {d.effect}× · score {d.score}</div>
                  <div style={{ color: "var(--muted)" }}>{d.n} estimate{d.n !== 1 ? "s" : ""} · {d.reliability.replace(/_/g, " ")}</div>
                </div>
              );
            }} />
            <Bar dataKey="score" radius={[0, 4, 4, 0]}>
              {topFactors.map((d) => <Cell key={d.rf_id} fill={d.color} fillOpacity={d.reliability === "single_estimate" ? 0.4 : 1} />)}
              <LabelList dataKey="effect" position="right" formatter={(v: number) => `${v}×`} style={{ fontSize: 11, fill: "#64748b", fontFamily: "var(--ff-mono)" }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Figure>

      {/* FIG 2 — risk magnitude by group */}
      <Figure
        title="2 · Which groups carry the greatest risk"
        caption="Median (bar) and maximum (marker) risk-magnitude score within each category, across comparable categorical risk factors. Ranks the factor families by the typical effect size of their members."
        method="Median over each category's categorical, risk-increasing factors with an extracted estimate. Categories with few estimates are noisier — n shown on hover."
        height={480}
      >
        <ResponsiveContainer>
          <BarChart data={catRisk} layout="vertical" margin={{ left: 8, right: 40, top: 4, bottom: 4 }}>
            <CartesianGrid horizontal={false} stroke="rgba(11,18,32,0.07)" />
            <XAxis type="number" domain={[0, 100]} tick={AXIS} />
            <YAxis type="category" dataKey="label" width={210} tick={{ fontSize: 12, fill: "#31405c" }} interval={0} />
            <Tooltip content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload as CatRisk;
              return <div className="card" style={{ padding: 10, fontSize: 12.5 }}><b>{d.label}</b><br />median {d.median} · max {d.max}<br /><span style={{ color: "var(--muted)" }}>{d.n} factors</span></div>;
            }} />
            <Bar dataKey="median" radius={[0, 4, 4, 0]}>
              {catRisk.map((d) => <Cell key={d.cid} fill={d.color} />)}
              <LabelList dataKey="max" position="right" formatter={(v: number) => `↑${v}`} style={{ fontSize: 10.5, fill: "#8a97ad", fontFamily: "var(--ff-mono)" }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Figure>

      {/* FIG 3 — drug-target coverage by group */}
      <Figure
        title="3 · Which groups have drug targets"
        caption="For every category, the share of its factors with an approved or investigational pharmacologic target, versus lifestyle-only or none. Shows where the therapeutic arsenal is deep (lipids, blood pressure, glycemic) and where risk is currently untreatable (demographic, psychosocial, environmental, much of the novel-biomarker frontier)."
        method={`${drugN.withTarget} of ${drugN.total} factors flagged with a target. ${drugN.curated} were curated directly from the ASCVD drug literature and trial interventions; the rest inherit a category-level default gated by modifiability, so read this at the group level rather than as per-factor drug facts.`}
        height={480}
      >
        <ResponsiveContainer>
          <BarChart data={drugByCat} layout="vertical" stackOffset="expand" margin={{ left: 8, right: 30, top: 4, bottom: 16 }}>
            <CartesianGrid horizontal={false} stroke="rgba(11,18,32,0.07)" />
            <XAxis type="number" tickFormatter={(v) => `${Math.round(v * 100)}%`} tick={AXIS} />
            <YAxis type="category" dataKey="label" width={210} tick={{ fontSize: 12, fill: "#31405c" }} interval={0} />
            <Tooltip content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload as DrugCat;
              return <div className="card" style={{ padding: 10, fontSize: 12.5 }}><b>{d.label}</b> ({d.total})<br />approved {d.approved} · investig. {d.investigational}<br />lifestyle {d.lifestyle} · none {d.none}</div>;
            }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="approved" stackId="a" fill="#16a34a" name="approved" />
            <Bar dataKey="investigational" stackId="a" fill="#0891b2" name="investigational" />
            <Bar dataKey="lifestyle" stackId="a" fill="#eab308" name="lifestyle only" />
            <Bar dataKey="none" stackId="a" fill="#e2e8f4" name="none" />
          </BarChart>
        </ResponsiveContainer>
      </Figure>

      {/* FIG 4 — evidence gradient by group */}
      <Figure
        title="4 · Evidence gradient by group"
        caption="Grade composition of each category, from strong (A) to preliminary (D). Ranks groups by their count of strongly-evidenced (A/B) factors — the lipids, inflammatory, and comorbid families anchor the high-evidence end; environmental and novel biomarkers are mostly emerging."
        method="Grades from the atlas rubric: literature volume + meta-analyses + trials + genetic support + a genetic-causal-candidate bump. Ordered by A+B count."
        height={480}
      >
        <ResponsiveContainer>
          <BarChart data={evidByCat} layout="vertical" margin={{ left: 8, right: 30, top: 4, bottom: 16 }}>
            <CartesianGrid horizontal={false} stroke="rgba(11,18,32,0.07)" />
            <XAxis type="number" tick={AXIS} />
            <YAxis type="category" dataKey="label" width={210} tick={{ fontSize: 12, fill: "#31405c" }} interval={0} />
            <Tooltip content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload as EvidCat;
              return <div className="card" style={{ padding: 10, fontSize: 12.5 }}><b>{d.label}</b> ({d.total})<br />A {d.A} · B {d.B} · C {d.C} · D {d.D}</div>;
            }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="A" stackId="g" fill={GRADE_COLORS.A} name="A — strong" />
            <Bar dataKey="B" stackId="g" fill={GRADE_COLORS.B} name="B — moderate" />
            <Bar dataKey="C" stackId="g" fill={GRADE_COLORS.C} name="C — emerging" />
            <Bar dataKey="D" stackId="g" fill={GRADE_COLORS.D} name="D — preliminary" />
          </BarChart>
        </ResponsiveContainer>
      </Figure>

      {/* FIG 5 — most-included factors across calculators */}
      <Figure
        title="5 · What the calculators actually measure"
        caption="How many of the 17 cataloged risk calculators include each factor. A handful of traditional inputs (age, sex, smoking, blood pressure, cholesterol, diabetes) appear nearly universally; almost everything else in the atlas is used by few or none."
        method="Counted across all 17 calculators by mapping each input variable to its atlas factor. Top 20 shown."
        height={Math.max(420, topIncluded.length * 24)}
      >
        <ResponsiveContainer>
          <BarChart data={topIncluded} layout="vertical" margin={{ left: 8, right: 40, top: 4, bottom: 4 }}>
            <CartesianGrid horizontal={false} stroke="rgba(11,18,32,0.07)" />
            <XAxis type="number" domain={[0, 17]} tick={AXIS} allowDecimals={false} />
            <YAxis type="category" dataKey="name" width={210} tick={{ fontSize: 12, fill: "#31405c" }} interval={0} />
            <Tooltip content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload as Included;
              return <div className="card" style={{ padding: 10, fontSize: 12.5 }}><b>{d.name}</b><br />in {d.count} of 17 calculators</div>;
            }} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {topIncluded.map((d) => <Cell key={d.rf_id} fill={d.color} />)}
              <LabelList dataKey="count" position="right" style={{ fontSize: 11, fill: "#64748b", fontFamily: "var(--ff-mono)" }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Figure>

      {/* FIG 6 — calculator coverage ranking */}
      <Figure
        title="6 · How broadly each calculator covers the atlas"
        caption="Calculators ranked by the number of strongly-evidenced (A/B) atlas factors they include, split into strong vs other factors. QRISK3 is the broadest; Globorisk, followed by the SCORE2 family and Framingham, is the most parsimonious. Links go to each calculator's detail."
        method="Coverage = distinct atlas factors mapped from a calculator's inputs. Ranked by A/B factors covered, then total, then categories."
        height={Math.max(420, calcRank.length * 26)}
      >
        <ResponsiveContainer>
          <BarChart data={calcRank} layout="vertical" margin={{ left: 8, right: 40, top: 4, bottom: 16 }}>
            <CartesianGrid horizontal={false} stroke="rgba(11,18,32,0.07)" />
            <XAxis type="number" tick={AXIS} allowDecimals={false} />
            <YAxis type="category" dataKey="name" width={180} tick={{ fontSize: 12, fill: "#31405c" }} interval={0} />
            <Tooltip content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload as CalcRank;
              return <div className="card" style={{ padding: 10, fontSize: 12.5 }}><b>{d.name}</b><br />{d.strong} strong + {d.other} other factors<br /><span style={{ color: "var(--muted)" }}>{d.inputs} inputs · {d.cats} categories</span></div>;
            }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="strong" stackId="c" fill="#16a34a" name="strong (A/B) factors" radius={[0, 0, 0, 0]} />
            <Bar dataKey="other" stackId="c" fill="#c7d2fe" name="other factors" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Figure>

      <p style={{ color: "var(--muted-2)", fontSize: 12, margin: "6px 2px 0", lineHeight: 1.5 }}>
        Full scoring definition: {effScoring}
      </p>
      <p style={{ marginTop: 16, fontSize: 13 }}>
        <Link href="/calculators/" style={{ color: "var(--accent)", fontWeight: 600 }}>→ Compare all 17 risk calculators in detail</Link>
      </p>
    </div>
  );
}
