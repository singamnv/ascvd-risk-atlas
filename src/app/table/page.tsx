import { getFactors, getStats } from "@/lib/data";
import RiskFactorTable from "@/components/RiskFactorTable";

export const metadata = { title: "Risk factor table" };

export default function TablePage() {
  const factors = getFactors();
  const stats = getStats();
  return (
    <main className="container-x" style={{ paddingTop: 28, paddingBottom: 20 }}>
      <div className="mono-kicker" style={{ marginBottom: 8 }}>{factors.length.toLocaleString()} risk factors</div>
      <h1 className="font-display" style={{ fontSize: 28, color: "var(--text)", margin: "0 0 6px", fontWeight: 700 }}>
        Risk factor table
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 14.5, margin: "0 0 20px", maxWidth: 780 }}>
        Filter by category, factor type, evidence grade, PREVENT inclusion, and more. Sort any column. Each row links to its
        full evidence bundle — references, trials, and genetic associations.
      </p>
      <RiskFactorTable
        factors={factors}
        categories={stats.categories.map((c) => ({ id: c.id, name: c.name }))}
        factorTypes={stats.factor_types}
      />
    </main>
  );
}
