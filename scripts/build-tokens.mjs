// Builds styles/tokens.css from tokens/**/*.json (DTCG 2025.10) with Style Dictionary.
//   :root                      primitives + light semantic/component colors + desktop layout + effects
//   [data-theme="dark"]        dark semantic/component colors
//   @media (max-width: 768px)  tablet layout overrides
//   @media (max-width: 480px)  mobile layout overrides
// Not emitted: semantic/typography.json (composite text styles, for Figma and docs) and
// tokens marked $extensions["tech.r-o-design.figma-only"].
// Checks: light/dark files define the same token paths; key text pairs pass WCAG AA (4.5:1).
import StyleDictionary from 'style-dictionary'
import { readFile, writeFile } from 'node:fs/promises'

const OUT = 'styles/tokens.css'
const CSS_EXT = 'tech.r-o-design.css'
const FIGMA_ONLY = 'tech.r-o-design.figma-only'
const PRIMITIVES = 'tokens/primitives/**/*.json'
const S = (f) => `tokens/semantic/${f}.json`

StyleDictionary.registerTransform({
  name: 'value/css-extension',
  type: 'value',
  filter: (token) => Boolean(token.$extensions?.[CSS_EXT]),
  transform: (token) => token.$extensions[CSS_EXT],
})

const fromFile = (...names) => (token) =>
  names.some((n) => token.filePath.replace(/\\/g, '/').endsWith(`${n}.json`))
const cssVisible = (token) => !token.$extensions?.[FIGMA_ONLY] && !fromFile('semantic/typography')(token)

// Partial blocks (dark, media) reference primitives that live in :root by design, so SD's
// "filtered out token references" warning is expected there; full warnings stay on for :root.
function dictionary(source, filter, partial) {
  return new StyleDictionary({
    source,
    log: { warnings: partial ? 'disabled' : 'warn', verbosity: 'default' },
    platforms: {
      css: {
        transformGroup: 'css',
        transforms: ['value/css-extension'],
        files: [{
          destination: 'tokens.css',
          format: 'css/variables',
          filter: (t) => cssVisible(t) && filter(t),
          options: { outputReferences: true, showFileHeader: false },
        }],
      },
    },
  })
}

async function block(source, filter, partial = true) {
  const sd = dictionary(source, filter, partial)
  const [{ output }] = await sd.formatPlatform('css')
  const { allTokens } = await sd.getPlatformTokens('css')
  return { body: output.slice(output.indexOf('{') + 1, output.lastIndexOf('}')).trimEnd(), allTokens }
}

/* ── check 1: light and dark define the same paths ── */
const paths = (obj, pre = []) =>
  Object.entries(obj).flatMap(([k, v]) =>
    k.startsWith('$') ? [] : '$value' in v ? [[...pre, k].join('.')] : paths(v, [...pre, k]))
for (const base of ['color', 'component']) {
  const [l, d] = await Promise.all(['light', 'dark'].map(async (m) => paths(JSON.parse(await readFile(S(`${base}.${m}`), 'utf8')))))
  const diff = [...l.filter((p) => !d.includes(p)), ...d.filter((p) => !l.includes(p))]
  if (diff.length) throw new Error(`${base}.light/dark mismatch: ${diff.join(', ')}`)
}

/* ── build ── */
const light = await block([PRIMITIVES, S('color.light'), S('component.light'), S('layout'), S('effect')], () => true, false)
const dark = await block([PRIMITIVES, S('color.dark'), S('component.dark')], fromFile('semantic/color.dark', 'semantic/component.dark'))
const tablet = await block([PRIMITIVES, S('layout.tablet')], fromFile('semantic/layout.tablet'))
const mobile = await block([PRIMITIVES, S('layout.mobile')], fromFile('semantic/layout.mobile'))

/* ── check 2: contrast of key pairs (opaque colors only) ──
   A pair passes on WCAG 2 AA for normal text (4.5:1) or, for pairs with `apca`, on APCA Lc at that text size
   (buttons: 14px medium → Lc 75).
   `accepted` pairs are recorded design decisions: reported as warnings, they do not fail the build. */
const PAIRS = [
  { fg: 'color-fg-default', bg: 'color-bg-default', wcag: 4.5 },
  { fg: 'color-fg-muted', bg: 'color-bg-default', wcag: 4.5 },
  { fg: 'color-fg-secondary', bg: 'color-bg-subtle', wcag: 4.5 },
  { fg: 'color-fg-accent', bg: 'color-bg-default', wcag: 4.5 },
  { fg: 'color-fg-on-accent', bg: 'color-bg-accent', apca: 75, accepted: '2026-11-03: brand orange buttons kept as on prod (portfolio site)' },
  { fg: 'color-fg-on-accent', bg: 'color-bg-accent-hover', apca: 75 },
  { fg: 'color-fg-on-accent', bg: 'color-bg-accent-active', wcag: 4.5 },
  { fg: 'color-border-focus', bg: 'color-bg-default', wcag: 3 }, // non-text: focus indicator
  { fg: 'color-fg-accent-brand', bg: 'color-bg-default', apca: 75, accepted: '2026-11-03: brand orange button labels kept as on prod (portfolio site)' },
]
const channels = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
const lum = (hex) => {
  const c = channels(hex).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}
const wcag = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }
// APCA 0.0.98G-4g, returns |Lc|
const apca = (text, bg) => {
  const Y = (hex) => { const [r, g, b] = channels(hex).map((v) => v ** 2.4); return 0.2126729 * r + 0.7151522 * g + 0.072175 * b }
  const clamp = (y) => (y > 0.022 ? y : y + (0.022 - y) ** 1.414)
  const t = clamp(Y(text)), b = clamp(Y(bg))
  const s = b > t ? (b ** 0.56 - t ** 0.57) * 1.14 : (b ** 0.65 - t ** 0.62) * 1.14
  return Math.abs(s) < 0.1 ? 0 : Math.abs(s > 0 ? s - 0.027 : s + 0.027) * 100
}
const failures = [], accepted = []
for (const [mode, { allTokens }] of [['light', light], ['dark', dark]]) {
  const value = Object.fromEntries(allTokens.map((t) => [t.name, t.$value ?? t.value]))
  for (const p of PAIRS) {
    const [fg, bg] = [value[p.fg], value[p.bg]]
    if (!/^#[0-9a-f]{6}$/i.test(fg ?? '') || !/^#[0-9a-f]{6}$/i.test(bg ?? '')) { failures.push(`${mode}: cannot check ${p.fg} / ${p.bg}`); continue }
    // passes on WCAG 2 AA for normal text, or on APCA at the pair's own size/weight
    const w = wcag(fg, bg), lc = apca(fg, bg)
    if (w >= (p.wcag ?? 4.5) || (p.apca && lc >= p.apca)) continue
    const line = `${mode}: ${p.fg} on ${p.bg} = ${w.toFixed(2)}:1 / Lc ${lc.toFixed(1)} (needs ${p.wcag ?? 4.5}:1${p.apca ? ` or Lc ${p.apca}` : ''})`
    ;(p.accepted ? accepted : failures).push(p.accepted ? `${line} · accepted ${p.accepted}` : line)
  }
}
for (const a of accepted) console.warn(`⚠ contrast ${a}`)
if (failures.length) throw new Error(`Contrast check failed:\n  ${failures.join('\n  ')}`)

const indent = (s) => s.replace(/^(?=.)/gm, '  ')
await writeFile(OUT, `/**
 * Generated by scripts/build-tokens.mjs from the tokens/ folder. Do not edit directly: run \`npm run tokens\`.
 */

:root {${light.body}
}

[data-theme="dark"] {${dark.body}
}

@media (max-width: 768px) {
  :root {${indent(tablet.body)}
  }
}

@media (max-width: 480px) {
  :root {${indent(mobile.body)}
  }
}
`)
console.log(`✔ ${OUT} (light/dark parity ok, ${PAIRS.length * 2} contrast pairs checked, ${accepted.length} accepted exception)`)
