// Foundations page: every swatch, bar and specimen is bound to a synced variable or style.
const page = await pageNamed('Foundations')
await figma.setCurrentPageAsync(page)
replace(page, 'Foundations')

const root = box(page, { name: 'Foundations', w: 1440, pad: 'space/72', gap: 'space/72', fill: 'color/bg/default' })
mode(root, 'Semantic', 'Light')

const head = box(root, { name: 'Header', gap: 'space/12', fillW: true })
await text(head, 'Foundations', 'Overline/2XS', 'color/fg/accent')
await text(head, 'Folio design tokens', 'Display/LG')
await text(head, 'Source of truth: tokens/**/*.json (DTCG 2025.10). Code: npm run tokens → styles/tokens.css. Figma: npm run figma:spec + scripts/figma/sync-tokens.js. Do not edit variables by hand.', 'Body/LG', 'color/fg/muted', { w: 760 })

async function section(title, note) {
  const s = box(root, { name: title, gap: 'space/24', fillW: true })
  stroke(s, null)
  const h = box(s, { name: 'Title', gap: 'space/6', fillW: true })
  await text(h, title, 'Overline/2XS')
  if (note) await text(h, note, 'Body/SM', 'color/fg/muted', { w: 760 })
  return s
}

/* ── Primitive colors ── */
async function swatch(parent, name, w = 112, onDark = false) {
  const c = box(parent, { name, gap: 'space/8', w })
  const tile = box(c, { name: 'tile', h: 72, fillW: true, radius: 'radius/sm', stroke: 'color/border/default', clip: true })
  if (name.includes('/alpha/')) {
    fill(tile, onDark ? 'color/neutral/900' : 'color/neutral/50')
    const chip = box(tile, { name: 'value', fillW: true, h: 72, fill: name })
    chip.layoutGrow = 1
  } else fill(tile, name)
  const v = await resolved(name)
  await text(c, name.replace('color/', ''), 'Label/XS', 'color/fg/default', { fillW: true })
  await text(c, hex(v) + (v.a < 1 ? ` · ${Math.round(v.a * 100)}%` : ''), 'Body/SM', 'color/fg/muted', { fillW: true })
}
const prim = await section('Color Primitives', 'Collection «Color Primitives». Raw values, hidden from pickers and never used in components: use Semantic.')
for (const [label, names] of [
  ['Neutral', Object.keys(VARS).filter((n) => n.startsWith('color/neutral/'))],
  ['Orange & base', ['color/orange/500', 'color/orange/600', 'color/white', 'color/black']],
  ['Alpha', Object.keys(VARS).filter((n) => n.startsWith('color/alpha/'))],
]) {
  await text(prim, label, 'Heading/MD')
  const row = box(prim, { name: label, dir: 'HORIZONTAL', gap: 'space/16', wrap: true, fillW: true })
  for (const n of names) await swatch(row, n, 112, n.includes('/white/'))
}

/* ── Semantic colors, Light and Dark side by side ── */
const sem = await section('Semantic · color', 'What components use. Same names in both modes; switch the Semantic mode on any frame to re-theme it.')
const pair = box(sem, { name: 'Modes', dir: 'HORIZONTAL', gap: 'space/24', fillW: true })
const semNames = Object.keys(VARS).filter((n) => VARS[n].variableCollectionId === COLL.Semantic.id)
for (const m of ['Light', 'Dark']) {
  const col = box(pair, { name: m, gap: 'space/12', pad: 'space/24', fill: 'color/bg/default', stroke: 'color/border/default', radius: 'radius/md', grow: true })
  mode(col, 'Semantic', m)
  await text(col, m, 'Heading/LG')
  for (const n of semNames) {
    const row = box(col, { name: n, dir: 'HORIZONTAL', gap: 'space/12', align: 'CENTER', fillW: true })
    const chip = box(row, { name: 'chip', w: 32, h: 32, radius: 'radius/sm', stroke: 'color/border/default', fill: n })
    chip.layoutSizingVertical = 'FIXED'
    const t = box(row, { name: 'label', gap: 'space/2', grow: true })
    await text(t, n, 'Label/XS')
    await text(t, `→ ${(await aliasName(n, m)) || '—'}   ${VARS[n].codeSyntax.WEB}`, 'Body/SM', 'color/fg/muted')
  }
}

/* ── Typography ── */
const typo = await section('Typography · text styles', 'Composite styles from tokens/semantic/typography.json. Size and family are bound to variables; Display/2XL follows the Layout mode.')
for (const s of Object.values(TS)) {
  const row = box(typo, { name: s.name, dir: 'HORIZONTAL', gap: 'space/32', align: 'CENTER', fillW: true, pad: ['space/16', 'space/0'] })
  const meta = box(row, { name: 'meta', gap: 'space/2', w: 260 })
  await text(meta, s.name, 'Label/XS')
  const r1 = (x) => Math.round(x * 10) / 10
  const lh = s.lineHeight.unit === 'PERCENT' ? `${r1(s.lineHeight.value)}%` : 'auto'
  await text(meta, `${s.fontName.family} ${s.fontName.style} · ${s.fontSize}/${lh}${s.letterSpacing.value ? ` · ls ${r1(s.letterSpacing.value)}%` : ''}${s.textCase === 'UPPER' ? ' · upper' : ''}`, 'Body/SM', 'color/fg/muted', { fillW: true })
  const sample = s.name.startsWith('Display') ? 'Roman Ovcharenko' : 'Turning complex systems into clear, usable products.'
  const t = await text(row, sample, s.name, 'color/fg/default')
  t.layoutGrow = 1
  t.textAutoResize = 'HEIGHT'
}
// Hero h1 at every Layout mode
const hero = box(typo, { name: 'Display/2XL by Layout mode', dir: 'HORIZONTAL', gap: 'space/24', align: 'MAX', fillW: true })
for (const m of ['Desktop', 'Tablet', 'Mobile']) {
  const c = box(hero, { name: m, gap: 'space/8' })
  mode(c, 'Layout', m)
  await text(c, `Layout: ${m}`, 'Label/XS', 'color/fg/muted')
  await text(c, 'Roman', 'Display/2XL')
}

/* ── Spacing ── */
const sp = await section('Size · space', 'Collection «Size». 4px grid with half steps 2, 6, 10. Bound to padding and gap.')
for (const n of Object.keys(VARS).filter((x) => x.startsWith('space/'))) {
  const row = box(sp, { name: n, dir: 'HORIZONTAL', gap: 'space/16', align: 'CENTER' })
  await text(row, n, 'Label/XS', 'color/fg/default', { w: 96 })
  const bar = box(row, { name: 'bar', h: 12, fill: 'color/icon/accent', radius: 'radius/none' })
  bar.layoutMode = 'NONE'
  bind(bar, 'width', n)
}

/* ── Radius, size, shadow ── */
const shapes = await section('Radius · Size · Effect')
const r1 = box(shapes, { name: 'Radius', dir: 'HORIZONTAL', gap: 'space/24', align: 'MAX' })
for (const n of Object.keys(VARS).filter((x) => x.startsWith('radius/'))) {
  const c = box(r1, { name: n, gap: 'space/8', align: 'CENTER' })
  const b = box(c, { name: 'shape', w: 80, h: 80, fill: 'color/bg/subtle', stroke: 'color/border/strong' })
  radius(b, n)
  await text(c, n, 'Label/XS')
}
const r2 = box(shapes, { name: 'Size', dir: 'HORIZONTAL', gap: 'space/24', align: 'MAX' })
for (const n of Object.keys(VARS).filter((x) => x.startsWith('size/'))) {
  const c = box(r2, { name: n, gap: 'space/8', align: 'CENTER' })
  const b = box(c, { name: 'shape', fill: 'color/bg/subtle', stroke: 'color/border/strong', radius: 'radius/sm' })
  b.layoutMode = 'NONE'
  bind(b, 'width', n); bind(b, 'height', n)
  await text(c, n, 'Label/XS')
}
const r3 = box(shapes, { name: 'Effect', dir: 'HORIZONTAL', gap: 'space/24', pad: 'space/24' })
const card = box(r3, { name: 'shadow/raised', pad: 'space/24', fill: 'color/bg/default', stroke: 'color/border/default', radius: 'radius/md' })
await card.setEffectStyleIdAsync(ES['shadow/raised'].id)
await text(card, 'shadow/raised', 'Label/MD')
await text(card, 'Floating header', 'Body/SM', 'color/fg/muted')

/* ── Layout ── */
const lay = await section('Layout', 'Collection with Desktop / Tablet / Mobile modes. Set the mode on a page frame to switch padding and the hero size.')
const table = box(lay, { name: 'table', gap: 'space/8', fillW: true })
const head2 = box(table, { name: 'head', dir: 'HORIZONTAL', gap: 'space/16', fillW: true })
for (const h of ['Token', 'Desktop', 'Tablet', 'Mobile']) await text(head2, h, 'Label/XS', 'color/fg/muted', { w: h === 'Token' ? 260 : 200 })
for (const n of Object.keys(VARS).filter((x) => x.startsWith('layout/'))) {
  const r = box(table, { name: n, dir: 'HORIZONTAL', gap: 'space/16', fillW: true })
  await text(r, n, 'Label/XS', 'color/fg/default', { w: 260 })
  for (const m of ['Desktop', 'Tablet', 'Mobile']) {
    const a = await aliasName(n, m)
    const v = await resolved(n, m)
    await text(r, a ? `${a} (${v})` : String(v), 'Body/SM', 'color/fg/muted', { w: 200 })
  }
}

figma.viewport.scrollAndZoomIntoView([root])
return { id: root.id, h: Math.round(root.height), sections: root.children.length }
