export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner container-x">
        <div>
          <strong>ASCVD Risk Atlas</strong> — a <a href="https://coronaryatlas.com" target="_blank" rel="noopener" style={{ color: "var(--accent)" }}>CoronaryAtlas</a> project. De novo evidence harvest from PubMed, OpenAlex, ClinicalTrials.gov, and the GWAS Catalog.
        </div>
        <div style={{ color: "var(--muted-2)" }}>
          Research/informational use only. Not medical advice.
        </div>
      </div>
    </footer>
  );
}
