# Limitless Design System — Preservation-First Audit

**Audit baseline:** `main` at `b2fc9751080b9eba170b33035dddf58023ecf5a2`  
**Status:** Architecture inventory only. No runtime styles, components, routes, data, or persistence are changed by this checkpoint.

## Objective

Create one coherent design language and reusable component foundation across Limitless without flattening the visual identity of its disciplines or changing existing behaviour.

The shared system must own semantic contracts and reusable primitives. Each discipline remains responsible for its own accent palette, artwork, specialist information architecture, and domain-specific interactions.

## Current architecture inventory

| Area | Current implementation | Preservation concern |
|---|---|---|
| Global shell / home | `theme.css`, `home-dashboard.css`, `hub-theme.css`, `site-theme.js` | Multiple theme and shell layers; global theme event and storage contract must remain unchanged |
| Competition | `competition/competition.css`, `competition/competition-dashboard.css` | Dedicated dashboard overrides the older competition skin; campaign-specific controls and visual identity must be retained |
| Codeforces | `codeforces-red/*.css` | Independent blue palette, navigation, cards and responsive rules |
| Probability | `probability-source/app/globals.css`, local landing/workspace CSS | Owns Tailwind theme mapping, palette, typography and app-level layout |
| Metallurgy | `metallurgy-source/app/globals.css`, course and workspace CSS | Owns a separate blue palette and app-level layout; course-specific archive selectors are widely used |
| Shared learning player | `shared/learning-player/PlayerShell.ts`, `player.css`, contracts and tests | Existing cross-discipline structural shell and semantic aliases; extend rather than replace |
| Shared studies | `shared/studies/*` | Existing landing composition, navigation, workspace layout and tests; use as the studies foundation |

## Existing shared contracts to preserve

- `shared/learning-player` supplies semantic colour aliases, spacing/radius/type tokens, player regions, focus treatment, responsive palette behaviour, and reduced-motion handling.
- `shared/studies` supplies shared landing composition, study-mode tabs, utility navigation, workspace layout, registry and progress abstractions.
- Probability and Metallurgy currently expose overlapping base variables such as `--ink`, `--panel`, `--gold`, `--paper`, `--body`, `--dim`, `--chip`, `--panel-bg`, `--panel-line`, and `--panel-shadow`.
- Competition, Codeforces and the home dashboard use separate semantic namespaces (for example `--comp-*`, `--home-*`) and hard-coded values in component rules.
- The global theme preference is stored under `limitless.site.theme`; theme changes dispatch `limitless:themechange`. This behaviour is a compatibility contract, not a target for redesign.

## Main sources of fragmentation

1. Several independent CSS entry points define similar surfaces, borders, typography, navigation and spacing.
2. Theme token names and semantic meaning are not consistently shared across standalone pages and Next.js apps.
3. Some pages use shared components, while others implement their own markup and interaction styles.
4. The competition dashboard and Codeforces areas intentionally use different palettes, but their common control patterns are not expressed through shared primitives.
5. The existing shared player/studies foundations cover important areas but are not yet a complete site-wide component system.

## Proposed ownership model

### Shared foundation

- Semantic tokens: canvas, surface, elevated surface, text, muted text, border, accent, focus, success, warning and danger.
- Layout tokens: spacing, content widths, breakpoints, radii, elevation and motion.
- Primitives: button, icon button, card/surface, form field, tabs, badge, progress, navigation item, dialog and empty/loading/error states.
- Accessibility contract: visible focus, keyboard operation, reduced motion, contrast requirements and touch target minimums.
- Compatibility adapters mapping current page-specific variables into the semantic vocabulary.

### Discipline adapters

Each app maps its existing palette into semantic tokens. Probability keeps its parchment/gold identity; Metallurgy keeps its blue materials-science identity; Competition and Codeforces retain their blue competition identity; the home shell retains its own art direction. Shared components must not force identical layouts where the information architecture differs.

## Migration sequence

1. **Baseline and inventory:** record current routes, screenshots, theme states, responsive states, keyboard behaviour and persistence-sensitive controls.
2. **Token contract:** define semantic tokens and per-app adapters without changing rendered values.
3. **Primitive pilot:** migrate one low-risk, visually bounded component and compare before/after in dark/light and desktop/mobile states.
4. **Shared shell adoption:** migrate repeated navigation/surface patterns only after the pilot passes.
5. **Section-by-section migration:** Probability, Metallurgy, Competition/Codeforces and Home, each in isolated changes with rollback.
6. **Consolidation:** remove duplicated CSS only after every consumer has moved and reference searches prove the old selectors are unused.

## Non-negotiable regression gates

- No direct edits to production `main` for design-system work.
- No mass CSS replacement, global selector rewrite, or broad markup refactor.
- Preserve routes, navigation destinations, theme storage/events, local and remote persistence, question/answer logic, progress, bookmarks, rewards, keyboard shortcuts, and user data.
- Preserve discipline-specific artwork, palette and content hierarchy.
- Run the affected app's lint/type-check/build and focused tests, plus cross-discipline shared-component tests.
- Compare screenshots at representative desktop and mobile viewports in both themes.
- Check keyboard-only navigation, visible focus, reduced motion, and touch targets.
- Save a passing checkpoint before expanding the migration.
- Do not merge while required checks fail or visual/functional parity is unverified.
- Keep each migration small enough to revert independently.

## Baseline CI observations (2026-11-15)

- Metallurgy Learning Regression Tests passed on commit `be881576b39a44f35bb261484b3310b28e78d5ea`.
- Metallurgy Content Regression Tests failed in `test-answer-key-balance.mjs`: current MT203 answer counts were A=77, B=75, C=76, D=77 (spread 2; guard expects at most 1). All earlier MT203 tests in that job passed. This is a content/guard issue to triage separately; it is not caused by this design-system audit.
- Metallurgy website build completed, but the generated-site commit step failed during `git pull --rebase` with conflicts across generated `metallurgy/**` output. This indicates concurrent generated-output commits can race; the workflow's rebase strategy needs a separate reliability fix. The production deploy workflow itself succeeded on that run.
- A new P6 learning-player contract workflow was still running at audit time; its result must be checked before using it as a passing baseline.

These observations are recorded, not silently altered here. They must be resolved or explicitly accepted as baseline exceptions before the design migration depends on them.

## Explicitly out of scope for this checkpoint

- Changing any existing CSS import or stylesheet order.
- Replacing app-level theme definitions.
- Changing DOM structure, React components, route structure or navigation.
- Modifying localStorage/IndexedDB/Supabase schemas or progress/reward logic.
- Deleting existing stylesheets or generated assets.
- Merging or deploying a visual redesign.

## Acceptance criterion for the first implementation PR

The first implementation PR should add the semantic token contract and a single app adapter while producing no visible change. Automated assertions must verify required token mappings and that the adapter does not redefine existing source variables. A later, separate PR may migrate one primitive and include visual comparison evidence.
