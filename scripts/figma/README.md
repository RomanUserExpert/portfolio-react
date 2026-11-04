# scripts/figma

Builds the Figma file «Folio website» from code. Tokens flow one way: `tokens/**/*.json` → Figma.
Runs through [Figmosha](E:/Work/Personal/Figmosha%20-%20general) (local Plugin API bridge, port 8898):
start the bridge, then run the plugin «Figmosha · General» in the Figma file.

| Script | What it does | Re-runnable |
|---|---|---|
| `tokens-spec.mjs` | Node: tokens JSON → flat spec (`npm run figma:spec` → `.figma-spec.json`, gitignored) with a `hash` of what Figma should contain | yes |
| `sync-tokens.js` | Figma: creates/updates collections Color Primitives, Size, Typography Primitives (one per `tokens/primitives` file, 1 mode, hidden), Semantic (Light/Dark), Layout (Desktop/Tablet/Mobile), 13 text styles, effect `shadow/raised`. Finds by name, never deletes, reports `stale`. Ends by saving a named version `tokens-sync <hash>` (the marker the CI check reads). `npm run figma:sync-tokens` | yes, idempotent |
| `check-tokens.js` | Figma, read-only: compares every variable in every mode (value or alias, scopes, code syntax, hidden), text and effect styles with the spec. Catches hand edits in Figma. `npm run figma:check-tokens` | yes |
| `lib.js` | Helpers prepended to every build script: `box`, `text`, `bind`, `fill`, `variants`, `textProp`, `inst`… | — |
| `build-foundations.js` | Page Foundations: palette, semantic colors in both modes, type, space, radius, size, effect, layout | yes (replaces its frame) |
| `build-components.js` | Page Components: Button, Tag, SectionLabel, Pill, Link, ThemeToggle, Logo, IconButton, Dot, ProjectCard, ProcessRow, Header, Footer, Carousel, Lightbox | yes, **but** rebuilding gives new component ids: rebuild Blocks and Pages after it |
| `build-blocks.js` | Page Blocks: GridPattern, Hero, ProjectsSection, AboutSection, ProcessSection, ContactSection, ProjectsHead, CaseHead, CaseSection, CvHead | same, rebuild Pages after it |
| `build-templates.js` | Page Pages: Home (Desktop/Mobile × Light/Dark), Projects, Case · RiskLayer, CV | yes |
| `build-cover.js` | Page Cover + file thumbnail | yes |
| `check-drift.mjs` | Node: finds where Figma lags behind the code: prop unions, CSS states and boolean props vs Figma variants/`state` (pairs from `figma/*.figma.ts`), Code Connect templates vs the Figma properties they read (every `getEnum` must map all options), and the token spec hash vs the newest `tokens-sync <hash>` version (target node in `figma/drift.config.json`). `npm run figma:check`; CI (`.github/workflows/figma-drift.yml`) runs it with `--comment --report`: a comment on each stale node in Figma, and one GitHub issue labelled `figma-drift`, assigned to the pusher, updated while drift changes and closed once fixed. Exit codes: 0 in sync, 1 drift, 2 could not check (no issue opened). Needs `FIGMA_ACCESS_TOKEN` | yes |
| `figmosha.sh` | `scripts/figma/figmosha.sh exec --file <script> [args]`: plain Figmosha call without `lib.js` (fast; for self-contained scripts) | — |
| `.github/workflows/code-connect.yml` | CI: on push to main touching `figma/**`, type-checks, parses and publishes Code Connect (no manual `publish` needed) | — |
| `run.sh` | `scripts/figma/run.sh <script> [figmosha args]`: prepends `lib.js` and runs it | — |
| `snap.sh` | `scripts/figma/snap.sh <node-id> out.png [scale]`: exports a node to PNG (chunked, Figmosha caps results at 64 KB) | — |

## Typical runs

```bash
# tokens changed (CI turns red until this runs: it compares the spec hash with the "tokens-sync" version)
npm run tokens && npm run figma:sync-tokens
npm run figma:check-tokens   # full value-by-value check, also catches hand edits in Figma

# full rebuild (blocks/templates need project data and uploaded images)
node -e 'import("./lib/projects.ts").then(m=>require("fs").writeFileSync("projects.tmp.json",JSON.stringify(m.projects)))'
scripts/figma/run.sh scripts/figma/build-foundations.js
scripts/figma/run.sh scripts/figma/build-components.js
scripts/figma/run.sh scripts/figma/build-blocks.js    --set-str DATA=@projects.tmp.json
scripts/figma/run.sh scripts/figma/build-templates.js --set-str DATA=@projects.tmp.json
scripts/figma/run.sh scripts/figma/build-cover.js
```

Images (project covers, case slide) are uploaded once with `figma.createImage` and their hashes kept in
`figma.root.getPluginData('folio-images')`; `lib.js` → `imageFill(node, slug)` reads them.

## Rules the scripts follow

- No raw hex or sizes where a token exists: fills/strokes bind to Semantic variables, padding/gap/radius/size to
  Size / Typography Primitives or Layout, text uses text styles (or bound `font/size/*` for one-offs).
- Components never use Color Primitives directly.
- Variables cannot move between collections through the API: renaming or splitting a collection means sync (creates the new one and
  re-points aliases) → remove the old collection → rebuild the pages.
- Templates pin their modes: `Semantic` Light/Dark, `Layout` Desktop/Mobile. Change the mode on a frame to re-theme.
- Figma-only token: `layout/hero-font-size` (static stand-in for the fluid h1; not emitted to CSS).
