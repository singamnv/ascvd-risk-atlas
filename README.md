# ASCVD Risk Atlas

A **CoronaryAtlas** project — a de novo atlas of every risk factor ever reported for
atherosclerotic cardiovascular disease (ASCVD), each canonicalized, evidence-graded,
and linked to the primary literature, clinical trials, and genetic associations.

Live site: **https://ascvd.coronaryatlas.com**
Umbrella: **https://coronaryatlas.com**

## What's inside

- **997 canonical risk factors** across 15 categories (lipids, blood pressure, glycemic/metabolic,
  anthropometric, inflammatory/immune, renal, hemostatic, lifestyle, genetic, demographic/social,
  psychosocial, imaging/subclinical, comorbid conditions, environmental, novel biomarkers).
- **Evidence grading (A–D)** combining literature volume, meta-analyses, trial support, and
  genetic (GWAS / genetic-causal) support into a 0–100 score.
- **Analytics dashboard** — six figures ranking factors by risk magnitude, drug-target coverage,
  evidence gradient, and calculator inclusion.
- **17 CVD risk calculators** (PREVENT, PCE, QRISK3, SCORE2 family, Framingham, MESA, JBS3,
  Reynolds, PROCAM, ASSIGN, China-PAR, FINRISK, WHO, Globorisk, Astro-CHARM, SCORE2-Diabetes)
  with input→factor mappings, strengths/weaknesses, and verified derivation references.
- **PREVENT gap analysis** — which strongly-evidenced factors the AHA PREVENT equations omit.

## Data provenance

Evidence harvested de novo from PubMed, OpenAlex, ClinicalTrials.gov, and the GWAS Catalog.
Effect-size estimates are LLM-extracted from abstracts (approximate; heterogeneous comparators —
see the Methodology page for the full limitations statement). Drug-target flags are curated for
82 core factors; others inherit a modifiability-gated category default (group-level, not per-factor).

## Tech stack

- Next.js 15 (App Router, static export — `output: "export"`)
- React 19, TypeScript, Tailwind CSS v4
- recharts for dashboard figures
- Data served as static JSON from `public/data/`

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to ./out
```

## Deployment (AWS Amplify)

This repo builds as a static site via `amplify.yml` (artifacts in `out/`).
Deployed as its own Amplify app on the subdomain `ascvd.coronaryatlas.com`.

## Disclaimer

Research and informational use only. Not medical advice. Individual risk assessment and
clinical decisions must be made by a qualified healthcare professional with the full patient context.
