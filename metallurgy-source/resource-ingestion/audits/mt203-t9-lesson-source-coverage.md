# MT203 T9 lesson-to-source coverage audit

**Source:** `MT203 – PST 2026(1)_3.pdf`, pages 207–212 (212-page user-provided source; SHA-256 `ba86baeb56d8bae0a0cd875cd1e4b63eac5cf11cb502d9e84e5ed52cc1f6e546`).
**Compared against:** `metallurgy-source/app/data/lessons-mt203.ts`, topic `t9`.
**Scope:** source coverage only. No lesson, question-bank, metadata, or learner-progress changes were made.

## Page-by-page coverage

| Source page | Source content | Existing T9 coverage | Status |
|---|---|---|---|
| 207 | Definition of polymer degradation as change in product/polymer properties under environmental factors (heat, light, acids, alkalis, some salts); usually undesirable cracking/disintegration, but sometimes desirable (biodegradation or deliberate molecular-weight reduction for recycling); changes termed **aging** | Lesson defines degradation as reducing molecular weight or undesirably altering chemical structure; lists several mechanisms and uses | **Partially covered.** Environmental-factor framing, property-change definition, cracking/disintegration examples, deliberate molecular-weight reduction for recycling, and the term *aging* are not explicitly captured. |
| 208 | Historical framing: polymers synthesized from glycolic acid in the 1920s; degradation was then viewed negatively as deterioration of properties/performance with time. Diagram qualitatively shows molecular weight, strength and mass decreasing over time | No historical framing or linked qualitative trend diagram in T9 | **Missing.** Preserve this as the lecture's historical statement; do not infer a broader chronology from it. |
| 209 | Four lecture categories: photoinduced (light, UV, gamma, IR etc.); thermal (slide lists pyrolysis, hydrogenation, grafting, ozonolysis, oxidation etc.); chemical (depolymerization); biological (microorganisms) | Existing lesson has a different, more granular table: thermal, mechanical/shear, oxidative, photo/UV, radiation, hydrolytic, ultrasonic | **Partially covered / classification mismatch.** Photo, thermal and radiation-related concepts overlap, but the lecture's four-category structure and its explicit chemical/depolymerization and biological/microorganism entries are absent. The slide's thermal examples should be transcribed faithfully and flagged for subject-matter review rather than silently reclassified or corrected. |
| 210 | Biodegradation mechanisms: enzymatic degradation and hydrolysis; hydrolysis dependence on main-chain structure with order **anhydride > ester > carbonate**; homogeneous and heterogeneous degradation; statement that it is mandatory for biomedical applications | Existing T9 mentions PLA hydrolytic/enzymatic degradation and PHA/PHB biodegradability, but not the mechanism hierarchy, homogeneous/heterogeneous distinction, or biomedical-application statement | **Partially covered.** Missing the explicit mechanism structure, bond-class order, homogeneous/heterogeneous terms and biomedical note. |
| 211 | Polymer recycling: making polymers degradable; incinerating combustible polymers; recycling by remolding, blending and depolymerization; finding innovative uses for used polymers. Introduces 1988 Society of the Plastic Industry (SPI) voluntary Plastic Container Coding System. Table gives codes 1–7 and names; code 3 is printed **“V or PVC”**; code 1 is printed PETE (PET) | Existing lesson covers thermoplastic/thermoset recycling distinctions and has a seven-code table, but omits the listed recycling routes, SPI attribution/date, and code-3 wording “V or PVC” | **Partially covered.** The current code-3 entry follows the next slide's abbreviated label rather than this table's “V or PVC”; record the source discrepancy (see below). |
| 212 | Visual recycling-code chart with categories 1 PETE, 2 HDPE, 3 V, 4 LDPE, 5 PP, 6 PS, 7 OTHER; bottle/container illustrations | Existing T9 table reproduces these seven labels and expansions, explicitly preserving **V** and **OTHER** | **Covered** for the seven labels. The slide does not expand V or OTHER. |

## Source discrepancy requiring preservation

The two consecutive source slides do not use identical code-3 wording:
- **p. 211 table:** “V or PVC” and “Poly(vinyl chloride)”.
- **p. 212 visual chart:** “V”.

The existing lesson's code-3 label **V** matches p. 212, but it does not represent the fuller p. 211 table entry. Do not normalize the source to a single spelling without showing the distinction. A future lesson revision should state that the table on p. 211 says “V or PVC”, while the chart on p. 212 abbreviates it to “V”. The source prints PETE (PET) on p. 211 and PETE on p. 212; existing PETE expansion is consistent with the table.

## Consolidated T9 findings

### Missing or incomplete source-backed material
1. Degradation definition in terms of changes in properties under environmental factors, the term **aging**, and the source's desirable/undesirable distinction (p. 207).
2. Historical framing and qualitative time trends for molecular weight, strength and mass (p. 208).
3. The lecture's four-part degradation classification and explicit chemical/depolymerization and biological/microorganism categories (p. 209).
4. Biodegradation mechanisms: enzymatic degradation, hydrolysis, anhydride > ester > carbonate, homogeneous/heterogeneous degradation, and biomedical-application statement (p. 210).
5. Recycling options: making polymers degradable, incinerating combustible polymers, remolding, blending, depolymerization, and finding innovative uses for used polymers (p. 211).
6. SPI 1988 voluntary Plastic Container Coding System context (p. 211).
7. Explicit reconciliation of the code-3 wording difference between p. 211 and p. 212.

### Existing T9 material not established by these six pages
The existing T9 content on blend compatibilization, composite rule-of-mixtures, polymer modification, stabilizer chemistry, and biodegradable-polymer examples is not covered by pages 207–212. This audit does not mark those sections wrong or remove them; they require evidence from their own earlier source pages. Likewise, the existing degradation mechanisms table includes mechanical/shear, oxidative, hydrolytic and ultrasonic mechanisms that are not part of the four-category list on p. 209. Their presence should not be mistaken for a verbatim representation of that slide.

## Visual verification

All six pages (207–212) were rendered and visually inspected. This confirms:
- p. 208's qualitative three-curve plot is labelled Molecular Weight, Strength and Mass against Time.
- p. 210's hydrolysis hierarchy and homogeneous/heterogeneous labels are visible.
- p. 211's table explicitly says “V or PVC”.
- p. 212's visual chart explicitly says “V”.

## Change-control decision

This is an audit only. No lesson text, topic structure, qbank records, question counts, metadata, or learner data were changed. The next step is to reconcile the T9, T10 and T11 audits against their respective source pages, then prepare a narrowly scoped, source-traceable lesson correction plan for explicit review before implementation.
