// Turns tokens/**/*.json (DTCG 2025.10) into a flat spec for scripts/figma/sync-tokens.js.
//   node scripts/figma/tokens-spec.mjs > .figma-spec.json
// Collections:  Primitives (1 mode, hidden from publishing)
//               Semantic   (Light / Dark: color.* + component.*)
//               Layout     (Desktop / Tablet / Mobile: layout.json merged with the override files)
// Plus text styles (semantic/typography.json) and effect styles (semantic/effect.json).
// Units: rem × 16 → px; line-height and letter-spacing go into text styles as PERCENT, not variables.
import { readFile } from 'node:fs/promises'

const read = async (f) => JSON.parse(await readFile(new URL(`../../tokens/${f}.json`, import.meta.url), 'utf8'))

/** Flattens a DTCG tree: {path, type, value, description, scopes, hidden, ext}. Group $type and com.figma inherit. */
function flatten(node, path = [], inherited = {}) {
  const here = { ...inherited }
  if (node.$type) here.type = node.$type
  const fig = node.$extensions?.['com.figma']
  if (fig?.scopes) here.scopes = fig.scopes
  if (fig?.hiddenFromPublishing) here.hidden = true
  if ('$value' in node) {
    return [{ path: path.join('/'), type: here.type, value: node.$value, description: node.$description, scopes: here.scopes, hidden: here.hidden, ext: node.$extensions ?? {} }]
  }
  return Object.entries(node).flatMap(([k, v]) => (k.startsWith('$') ? [] : flatten(v, [...path, k], here)))
}

const prim = [
  ...flatten(await read('primitives/color')),
  ...flatten(await read('primitives/dimension')),
  ...flatten(await read('primitives/typography')),
  ...flatten(await read('primitives/motion')),
  ...flatten(await read('primitives/z-index')),
]
const byPath = new Map(prim.map((t) => [t.path, t]))
const refPath = (v) => (typeof v === 'string' && /^\{.+\}$/.test(v) ? v.slice(1, -1).replace(/\./g, '/') : null)

/* Which primitives exist in Figma. Skipped: line-height, letter-spacing (text style literals), breakpoint, motion, z-index. */
const inFigma = (t) => /^(color|space|radius|size)\//.test(t.path) || /^font\/(family|weight|size)\//.test(t.path)

const toPx = (d) => (d.unit === 'rem' ? d.value * 16 : d.value)
function literal(t) {
  switch (t.type) {
    case 'color': {
      const [r, g, b] = t.value.components
      return { kind: 'COLOR', value: { r, g, b, a: t.value.alpha ?? 1 } }
    }
    case 'dimension': return { kind: 'FLOAT', value: toPx(t.value) }
    case 'fontWeight': case 'number': return { kind: 'FLOAT', value: t.value }
    case 'fontFamily': return { kind: 'STRING', value: Array.isArray(t.value) ? t.value[0] : t.value }
    default: throw new Error(`no Figma type for ${t.path} (${t.type})`)
  }
}
const css = (path) => `var(--${path.replace(/\//g, '-')})`

const collections = []
const where = new Map() // token path → collection name

/* Primitives */
const primVars = prim.filter(inFigma).map((t) => {
  const l = literal(t)
  where.set(t.path, 'Primitives')
  return { name: t.path, type: l.kind, values: { Value: l.value }, scopes: t.scopes ?? [], hidden: true, code: css(t.path), description: t.description }
})
collections.push({ name: 'Primitives', modes: ['Value'], vars: primVars })

/* Moded collections: values are aliases into Primitives (or literals when not a reference). */
function moded(name, modes, trees) {
  const perMode = Object.fromEntries(modes.map((m, i) => [m, new Map(flatten(trees[i]).map((t) => [t.path, t]))]))
  const first = perMode[modes[0]]
  const vars = [...first.values()].map((t) => {
    const values = {}
    let kind
    for (const m of modes) {
      const tm = perMode[m].get(t.path) ?? t
      const ref = refPath(tm.value)
      if (ref) {
        const target = byPath.get(ref)
        if (!target || !inFigma(target)) throw new Error(`${name}/${t.path} → {${ref}} is not a Figma primitive`)
        kind = literal(target).kind
        values[m] = { alias: ref, collection: 'Primitives' }
      } else {
        const l = literal({ ...tm, type: t.type })
        kind = l.kind
        values[m] = l.value
      }
    }
    where.set(t.path, name)
    return { name: t.path, type: kind, values, scopes: t.scopes ?? [], hidden: false, code: css(t.path), description: t.description }
  })
  collections.push({ name, modes, vars })
}

const merge = (base, over) => ({ layout: { ...base.layout, ...over.layout } })
const [cl, cd, kl, kd, layout, tablet, mobile] = await Promise.all(
  ['semantic/color.light', 'semantic/color.dark', 'semantic/component.light', 'semantic/component.dark',
   'semantic/layout', 'semantic/layout.tablet', 'semantic/layout.mobile'].map(read))
moded('Semantic', ['Light', 'Dark'], [{ ...cl, ...kl }, { ...cd, ...kd }])
moded('Layout', ['Desktop', 'Tablet', 'Mobile'], [layout, merge(layout, tablet), merge(layout, mobile)])

/* Text styles */
const STYLE = { 400: 'Regular', 500: 'Medium', 600: 'Semi Bold', 700: 'Bold' }
const resolve = (v) => { const r = refPath(v); return r ? byPath.get(r) : null }
const textStyles = flatten(await read('semantic/typography')).map((t) => {
  const v = t.value
  const fam = resolve(v.fontFamily)
  const weight = resolve(v.fontWeight).value
  const sizeRef = refPath(v.fontSize)
  const sizeTok = byPath.get(sizeRef)
  const ls = resolve(t.ext['tech.r-o-design.letter-spacing'])
  const family = fam.value[0]
  return {
    name: t.path.replace(/^typography\//, '').split('/').map((s) => s.toUpperCase().length <= 3 ? s.toUpperCase() : s[0].toUpperCase() + s.slice(1)).join('/'),
    description: t.description,
    family,
    // Special Gothic Expanded One ships only Regular
    style: family.startsWith('Special Gothic') ? 'Regular' : STYLE[weight],
    familyVar: { collection: where.get(fam.path), name: fam.path },
    size: sizeTok ? toPx(sizeTok.value) : null,
    sizeVar: { collection: where.get(sizeRef), name: sizeRef },
    lineHeightPercent: Math.round(resolve(v.lineHeight).value * 1000) / 10,
    letterSpacingPercent: ls ? Math.round(ls.value * 1000) / 10 : 0,
    textCase: t.ext['tech.r-o-design.text-transform'] === 'uppercase' ? 'UPPER' : 'ORIGINAL',
  }
})
for (const s of textStyles) {
  if (!s.sizeVar.collection) throw new Error(`text style ${s.name}: ${s.sizeVar.name} is not in Figma`)
  if (s.size == null) {
    // fontSize points at a Layout token (moded): take the Desktop value for the style's static size
    const lay = collections.find((c) => c.name === 'Layout').vars.find((x) => x.name === s.sizeVar.name)
    s.size = byPath.get(lay.values.Desktop.alias).value.value * 16
  }
}

/* Effect styles */
const effectStyles = flatten(await read('semantic/effect')).map((t) => {
  const v = t.value
  return {
    name: t.path, description: t.description,
    colorVar: { collection: where.get(refPath(v.color)), name: refPath(v.color) },
    x: v.offsetX.value, y: v.offsetY.value, blur: v.blur.value, spread: v.spread.value,
  }
})

const spec = { generated: 'scripts/figma/tokens-spec.mjs', collections, textStyles, effectStyles }
process.stdout.write(JSON.stringify(spec))
