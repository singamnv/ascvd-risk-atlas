import Link from "next/link";
export default function NotFound() {
  return (
    <main className="container-x" style={{ paddingTop: 80, paddingBottom: 80, textAlign: "center" }}>
      <h1 className="font-display" style={{ fontSize: 40, color: "var(--text)", margin: "0 0 10px" }}>Not found</h1>
      <p style={{ color: "var(--muted)", marginBottom: 20 }}>That page or risk factor doesn&apos;t exist.</p>
      <Link href="/" className="btn" data-active="true" style={{ padding: "10px 20px" }}>← Back to overview</Link>
    </main>
  );
}
