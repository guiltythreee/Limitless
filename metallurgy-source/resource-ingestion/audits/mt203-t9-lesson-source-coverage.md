# MT203 T9 lesson-to-source coverage audit

**Source:** `MT203 – PST 2026(1)_3.pdf`, pages 207–212 (212-page user-provided source; SHA-256 `ba86baeb56d8bae0a0cd875cd1e4b63eac5cf11cb502d9e84e5ed52cc1f6e546`).
**Compared against:** `metallurgy-source/app/data/lessons-mt203.ts`, topic `t9`.
**Scope:** source-to-lesson coverage. T9 additions for pages 110–114 and 207–211 are recorded below; question-bank, metadata and learner-progress data were not changed.

## Page-by-page coverage

| Source page | Source content | Existing T9 coverage | Status |
|---|---|---|---|
| 207 | Definition of polymer degradation as change in product/polymer properties under environmental factors (heat, light, acids, alkalis, some salts); usually undesirable cracking/disintegration, but sometimes desirable (biodegradation or deliberate molecular-weight reduction for recycling); changes termed **aging** | Lesson defines degradation as reducing molecular weight or undesirably altering chemical structure; lists several mechanisms and uses | **Covered after lesson update.** T9 now includes the source definition, environmental factors, desirable/undesirable distinction, cracking/disintegration examples, deliberate molecular-weight reduction for recycling, and *aging* (commit b3b0c80). |
| 208 | Historical framing: polymers synthesized from glycolic acid in the 1920s; degradation was then viewed negatively as deterioration of properties/performance with time. Diagram qualitatively shows molecular weight, strength and mass decreasing over time | No historical framing or linked qualitative trend diagram in T9 | **Covered after lesson update.** The lecture's 1920s glycolic-acid statement and qualitative molecular-weight/strength/mass curves are included; no numerical kinetics are inferred. |
| 209 | Four lecture categories: photoinduced (light, UV, gamma, IR etc.); thermal (slide lists pyrolysis, hydrogenation, grafting, ozonolysis, oxidation etc.); chemical (depolymerization); biological (microorganisms) | Existing lesson has a different, more granular table: thermal, mechanical/shear, oxidative, photo/UV, radiation, hydrolytic, ultrasonic | **Covered with source warning.** The four categories and examples are now reproduced as printed. The unusual placement of hydrogenation, grafting and ozonolysis under “Thermal degradation” is explicitly flagged for source/lecturer clarification. |
| 210 | Biodegradation mechanisms: enzymatic degradation and hydrolysis; hydrolysis dependence on main-chain structure with order **anhydride > ester > carbonate**; homogeneous and heterogeneous degradation; statement that it is mandatory for biomedical applications | Existing T9 mentions PLA hydrolytic/enzymatic degradation and PHA/PHB biodegradability, but not the mechanism hierarchy, homogeneous/heterogeneous distinction, or biomedical-application statement | **Covered after lesson update.** Enzymatic degradation, hydrolysis, the printed anhydride > ester > carbonate order, homogeneous/heterogeneous labels and biomedical note are included. No quantitative rates are inferred. |
| 211 | Polymer recycling: making polymers degradable; incinerating combustible polymers; recycling by remolding, blending and depolymerization; finding innovative uses for used polymers. Introduces 1988 Society of the Plastic Industry (SPI) voluntary Plastic Container Coding System. Table gives codes 1–7 and names; code 3 is printed **“V or PVC”**; code 1 is printed PETE (PET) | Existing lesson covers thermoplastic/thermoset recycling distinctions and has a seven-code table, but omits the listed recycling routes, SPI attribution/date, and code-3 wording “V or PVC” | **Covered after lesson update.** Recycling routes, the 1988 SPI voluntary coding-system context, and the full p. 211 table wording are included. The p. 211/p. 212 code-3 discrepancy is preserved. |
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
The existing T9 content on blend compatibilization, composite rule-of-mixtures, polymer modification and stabilizer chemistry is not covered by pages 207–212; it is addressed through earlier source pages in the separate coverage checks. The four-category list on p. 209 is now presented separately from the more granular degradation-mechanism table so the two classifications are not conflated.

## Visual verification

All six pages (207–212) were rendered and visually inspected. This confirms:
- p. 208's qualitative three-curve plot is labelled Molecular Weight, Strength and Mass against Time.
- p. 210's hydrolysis hierarchy and homogeneous/heterogeneous labels are visible.
- p. 211's table explicitly says “V or PVC”.
- p. 212's visual chart explicitly says “V”.

## Change-control decision

Lesson updates are recorded in commits 98160eabeae375b26c232570d96dec473238cb0a (composites, pp. 110–114) and b3b0c806211b9de8c00a1b5f18345eac0884ca8a (degradation/recycling, pp. 207–211). No topic IDs, qbank records, question counts, metadata or learner data were changed. The next step is to finish the T9/T10/T11 source reconciliation and verify remaining visual-critical pages.


## Additional T9 source coverage: composites (pp. 110–114)

A later source sequence on composites was also compared with T9 and added to the lesson in commit `98160eabeae375b26c232570d96dec473238cb0a`.

| Source page | Source content | T9 coverage after update | Status |
|---:|---|---|---|
| 110 | Composite definition: chemically distinct, insoluble phases with a recognizable interface; MMC, CMC and PMC/OMC matrix classes | Definition and all three matrix classes added | covered |
| 111 | PMC matrix is relatively soft/flexible; reinforcement strong, stiff and brittle; matrix transfers load and protects fibres; fibre reinforcement benefits | Matrix/reinforcement roles and listed benefits added | covered |
| 112 | FRP design factors; aspect ratio $l/d$; strength improves with larger aspect ratio; smaller diameter reduces surface flaws; longer fibres have fewer low-load ends | Design factors and qualitative relationships added | partially covered |
| 113 | Chopped E-glass/epoxy plot: composite strength increases with fibre length | Trend described; numerical plot values not extracted | covered qualitatively |
| 114 | Maximum strength with long fibres parallel to applied load; other orientations illustrated | Directional statement added; other orientations retained as source visual | covered qualitatively |

**Explicit source anomaly, p. 112:** the slide image visibly prints typical fibre diameters as **10 mm to 150 mm**. The lesson flags this exact printed range as a source-unit anomaly and does not use it as a design value. It must not be silently converted to micrometres or another unit.

This additional coverage does not close the separate T9 gaps recorded for pages 207–211 (degradation classifications, biodegradation hierarchy, recycling routes and the p. 211/p. 212 resin-code wording difference). Those remain outstanding.


## T9 lesson update — degradation and recycling (pp. 207–211)

The lesson now includes the source-backed material previously recorded as missing/partial:
- p. 207 definition of degradation, environmental factors, aging, and desirable/undesirable changes.
- p. 208 historical statement and qualitative order of molecular-weight, strength and mass decline.
- p. 209 four categories and examples exactly as printed, with the unusual “thermal” grouping flagged rather than corrected.
- p. 210 enzymatic degradation, hydrolysis, anhydride > ester > carbonate, homogeneous/heterogeneous labels and biomedical note.
- p. 211 recycling routes and 1988 SPI voluntary coding-system context; the p. 211 “V or PVC” vs p. 212 “V” discrepancy is preserved.

The p. 211 code 7 entry is “OTHER — Others or mixed plastics”; p. 212 prints “OTHER” without expansion. Both source wordings are now represented. The p. 212 chart does not expand “V” or “OTHER”.

**Lesson commit:** `b3b0c806211b9de8c00a1b5f18345eac0884ca8a`.


## Post-reconciliation status — 16 November 2026

The page-by-page findings above have been incorporated into the current T9 lesson source. The current lesson contains the p.110–114 composite definition, matrix classes, matrix/reinforcement roles, design factors and fibre-orientation material; and the p.207–212 degradation, biodegradation, recycling and resin-code material. The lesson preserves the p.112 printed fibre-diameter anomaly and the p.211/p.212 code-3 wording difference.

**Current status:** source-backed T9 material from the audited pages is represented. The lesson keeps the lecture's four-category degradation classification separate from the broader mechanism/stabilizer table. The p.209 thermal-category examples remain explicitly flagged as printed; no silent scientific reclassification has been made. The p.210 homogeneous/heterogeneous labels are recorded without inventing definitions not supplied by the slide.

**Lesson checkpoints:** composites `98160eabeae375b26c232570d96dec473238cb0a`; degradation/recycling `b3b0c806211b9de8c00a1b5f18345eac0884ca8a`.

### Reconciliation gate

T9, T10 and T11 lesson coverage is now reconciled against the identified source gaps. This closes the lesson-content prerequisite for a question-bank audit; it does **not** approve extracted ingestion candidates or authorize blind question generation. The next phase is a source-traceable assessment audit: map existing MT203 questions to the reconciled lesson/source objectives, identify uncovered objectives and duplicate/weak items, and only then propose a controlled number of new questions. Existing question IDs, counts, metadata and learner progress must remain unchanged until a separately reviewed question patch is approved.
