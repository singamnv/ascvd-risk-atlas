// Client-safe label maps — no node:fs imports, safe to use in client components.
export const CATEGORY_LABELS: Record<string, string> = {
  lipids: "Lipids & Lipoproteins",
  blood_pressure: "Blood Pressure & Hemodynamics",
  glycemic_metabolic: "Glycemic & Metabolic",
  anthropometric: "Anthropometric & Body Composition",
  inflammatory_immune: "Inflammatory & Immune",
  renal: "Renal & Electrolyte",
  hemostatic: "Hemostatic & Thrombotic",
  lifestyle_behavioral: "Lifestyle & Behavioral",
  genetic_familial: "Genetic & Family History",
  demographic_social: "Demographic & Social",
  psychosocial: "Psychosocial & Mental Health",
  imaging_subclinical: "Imaging & Subclinical Disease",
  comorbid_conditions: "Comorbid Conditions",
  environmental: "Environmental & Occupational",
  novel_biomarkers: "Novel & Emerging Biomarkers",
};
export const TYPE_LABELS: Record<string, string> = {
  lab_test: "Lab test / biomarker",
  physical_parameter: "Physical parameter",
  disease: "Disease / condition",
  behavior: "Behavior / exposure",
  genetic: "Genetic / heritable",
  imaging: "Imaging marker",
  demographic: "Demographic / social",
};
