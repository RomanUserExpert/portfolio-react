# scripts/figma

Builds the Figma file «Folio website» from code. Tokens flow one way: `tokens/**/*.json` → Figma.
Runs through [Figmosha](E:/Work/Personal/Figmosha%20-%20general) (local Plugin API bridge, port 8898):
start the bridge, then run the plugin «Figmosha · General» in the Figma file.

| Script | What it does | Re-runnable |
|---|---|---|
| `tokens-spec.mjs` | Node: tokens JSON → flat spec (`npm run figma:spec` → `.figma-spec.json`, gitignored) | yes |
| `sync-tokens.js` | Figma: creates/updates collections Primitives, Semantic (Light/Dark), Layout (Desktop/Tablet/Mobile), 13 text styles, effect `shadow/raised`. Finds by name, never deletes, reports `stale` | yes, idempotent |
| `lib.js` | Helpers prepended to every build script: `box`, `text`, `bind`, `fill`, `variants`, `textProp`, `inst`… | — |
| `build-foundations.js` | Page Foundations: palette, semantic colors in both modes, type, space, radius, size, effect, layout | yes (replaces its frame) |
| `build-components.js` | Page Components: Button, Tag, SectionLabel, Pill, Link, ThemeToggle, Logo, IconButton, Dot, ProjectCard, ProcessRow, Header, Footer, Carousel, Lightbox | yes, **but** rebuilding gives new component ids: rebuild Blocks and Pages after it |
| `build-blocks.js` | Page Blocks: GridPattern, Hero, ProjectsSection, AboutSection, ProcessSection, ContactSection, ProjectsHead, CaseHead, CaseSection, CvHead | same, rebuild Pages after it |
| `build-templates.js` | Page Pages: Home (Desktop/Mobile × Light/Dark), Projects, Case · RiskLayer, CV | yes |
| `build-cover.js` | Page Cover + file thumbnail | yes |
| `run.sh` | `scripts/figma/run.sh <script> [figmosha args]`: prepends `lib.js` and runs it | — |
| `snap.sh` | `scripts/figma/snap.sh <node-id> out.png [scale]`: exports a node to PNG (chunked, Figmosha caps results at 64 KB) | — |

## Typical runs

```bash
# tokens changed
npm run tokens && npm run figma:spec
"$FIGMOSHA/venv/Scripts/python.exe" "$FIGMOSHA/figmosha.py" exec --file scripts/figma/sync-tokens.js --set SPEC=@.figma-spec.json

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
  Primitives or Layout, text uses text styles (or bound `font/size/*` for one-offs).
- Components never use Primitives colors directly.
- Templates pin their modes: `Semantic` Light/Dark, `Layout` Desktop/Mobile. Change the mode on a frame to re-theme.
- Figma-only token: `layout/hero-font-size` (static stand-in for the fluid h1; not emitted to CSS).
