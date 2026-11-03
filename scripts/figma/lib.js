// Shared helpers for Figma build scripts (prepended to each script by scripts/figma/run.sh).
// Everything binds to the synced variables and styles: no raw hex, no raw sizes where a token exists.

const VARS = {}
for (const v of await figma.variables.getLocalVariablesAsync()) VARS[v.name] = v
const COLL = {}
for (const c of await figma.variables.getLocalVariableCollectionsAsync()) COLL[c.name] = c
const TS = {}
for (const s of await figma.getLocalTextStylesAsync()) TS[s.name] = s
const ES = {}
for (const s of await figma.getLocalEffectStylesAsync()) ES[s.name] = s
for (const s of Object.values(TS)) await figma.loadFontAsync(s.fontName)

function V(name) {
  const v = VARS[name]
  if (!v) throw new Error(`no variable ${name}`)
  return v
}
const paint = (name) => figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', V(name))
function fill(node, name) { node.fills = name ? [paint(name)] : [] }
function stroke(node, name, weight = 1, align = 'INSIDE') {
  node.strokes = name ? [paint(name)] : []
  node.strokeWeight = weight
  node.strokeAlign = align
}
function bind(node, prop, name) { node.setBoundVariable(prop, V(name)) }
function radius(node, name) { for (const p of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']) bind(node, p, name) }
function pad(node, v, h = v) {
  bind(node, 'paddingTop', v); bind(node, 'paddingBottom', v)
  bind(node, 'paddingLeft', h); bind(node, 'paddingRight', h)
}
function mode(node, collection, modeName) {
  const c = COLL[collection]
  node.setExplicitVariableModeForCollection(c, c.modes.find((m) => m.name === modeName).modeId)
}

/** Auto-layout frame. Order matters: parent → layoutMode → sizing → spacing. */
function box(parent, o = {}) {
  const f = o.component ? figma.createComponent() : figma.createFrame()
  f.name = o.name || 'box'
  f.resize(1, 1) // a new frame is 100×100; an empty hug frame would keep that
  if (parent) parent.appendChild(f)
  f.layoutMode = o.dir || 'VERTICAL'
  f.primaryAxisSizingMode = o.w != null && f.layoutMode === 'HORIZONTAL' ? 'FIXED' : 'AUTO'
  f.counterAxisSizingMode = o.w != null && f.layoutMode === 'VERTICAL' ? 'FIXED' : 'AUTO'
  if (o.w != null) f.resize(o.w, f.height)
  if (o.h != null) { f.resize(f.width, o.h); if (f.layoutMode === 'VERTICAL') f.primaryAxisSizingMode = 'FIXED'; else f.counterAxisSizingMode = 'FIXED' }
  if (o.fillW && parent && parent.layoutMode) f.layoutSizingHorizontal = 'FILL'
  if (o.grow) f.layoutGrow = 1
  if (o.wrap) f.layoutWrap = 'WRAP'
  if (o.gap != null) (typeof o.gap === 'string' ? bind(f, 'itemSpacing', o.gap) : (f.itemSpacing = o.gap))
  if (o.wrap && o.gap != null) (typeof o.gap === 'string' ? bind(f, 'counterAxisSpacing', o.gap) : (f.counterAxisSpacing = o.gap))
  if (o.pad) pad(f, ...[].concat(o.pad))
  if (o.align) f.counterAxisAlignItems = o.align
  if (o.justify) f.primaryAxisAlignItems = o.justify
  f.fills = []
  if (o.fill) fill(f, o.fill)
  if (o.stroke) stroke(f, o.stroke)
  if (o.radius) radius(f, o.radius)
  f.clipsContent = !!o.clip
  return f
}

async function text(parent, chars, style, color = 'color/fg/default', o = {}) {
  const t = figma.createText()
  if (parent) parent.appendChild(t)
  await t.setTextStyleIdAsync(TS[style].id)
  t.characters = chars
  fill(t, color)
  t.name = o.name || chars.slice(0, 40)
  if (o.fillW && parent && parent.layoutMode) { t.layoutSizingHorizontal = 'FILL'; t.textAutoResize = 'HEIGHT' }
  if (o.w) { t.resize(o.w, t.height); t.textAutoResize = 'HEIGHT' }
  if (o.truncate) { t.textTruncation = 'ENDING'; t.maxLines = o.truncate }
  return t
}

/** Plain text with explicit font props (for one-offs without a text style; sizes still bound). */
async function rawText(parent, chars, { family = 'Inter', style = 'Regular', size, lh, ls, color = 'color/fg/default', upper, name } = {}) {
  await figma.loadFontAsync({ family, style })
  const t = figma.createText()
  if (parent) parent.appendChild(t)
  t.fontName = { family, style }
  t.characters = chars
  if (size) bind(t, 'fontSize', size)
  if (lh) t.lineHeight = { unit: 'PERCENT', value: lh }
  if (ls) t.letterSpacing = { unit: 'PERCENT', value: ls }
  if (upper) t.textCase = 'UPPER'
  bind(t, 'fontFamily', family.startsWith('Special') ? 'font/family/display' : 'font/family/body')
  fill(t, color)
  t.name = name || chars.slice(0, 40)
  return t
}

async function pageNamed(name) {
  const p = figma.root.children.find((x) => x.name === name)
  if (!p) throw new Error(`no page ${name}`)
  await p.loadAsync()
  return p
}
/** Removes a previous top-level node with this name so build scripts can be re-run. */
function replace(page, name) { for (const n of page.children.filter((c) => c.name === name)) n.remove() }

const hex = (c) => '#' + [c.r, c.g, c.b].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('').toUpperCase()
async function resolved(name, modeName) {
  let v = V(name)
  let col = Object.values(COLL).find((c) => c.id === v.variableCollectionId)
  let val = v.valuesByMode[modeName ? col.modes.find((m) => m.name === modeName).modeId : col.defaultModeId]
  while (val && val.type === 'VARIABLE_ALIAS') {
    v = await figma.variables.getVariableByIdAsync(val.id)
    col = Object.values(COLL).find((c) => c.id === v.variableCollectionId)
    val = v.valuesByMode[col.defaultModeId]
  }
  return val
}
async function aliasName(name, modeName) {
  const v = V(name)
  const col = Object.values(COLL).find((c) => c.id === v.variableCollectionId)
  const val = v.valuesByMode[col.modes.find((m) => m.name === modeName).modeId]
  return val && val.type === 'VARIABLE_ALIAS' ? (await figma.variables.getVariableByIdAsync(val.id)).name : null
}

/* ── components ── */
const IMAGES = JSON.parse(figma.root.getPluginData('folio-images') || '{}')
function imageFill(node, key, scaleMode = 'FILL') {
  if (!IMAGES[key]) throw new Error(`no uploaded image ${key}`)
  node.fills = [{ type: 'IMAGE', imageHash: IMAGES[key], scaleMode }]
}

/** Builds one component per combo, then combines them into a set. combo → {variant: 'primary', state: 'hover'} */
async function variants(parent, name, combos, build) {
  const nodes = []
  for (const props of combos) {
    const c = await build(props)
    c.name = Object.entries(props).map(([k, v]) => `${k}=${v}`).join(', ')
    nodes.push(c)
  }
  const set = figma.combineAsVariants(nodes, parent)
  set.name = name
  set.layoutMode = 'HORIZONTAL'
  set.layoutWrap = 'WRAP'
  set.primaryAxisSizingMode = 'AUTO'
  set.counterAxisSizingMode = 'AUTO'
  set.itemSpacing = 24
  set.counterAxisSpacing = 24
  set.paddingTop = set.paddingBottom = set.paddingLeft = set.paddingRight = 24
  set.fills = []
  stroke(set, 'color/border/default', 1)
  set.dashPattern = [4, 4]
  radius(set, 'radius/md')
  return set
}
/** TEXT property on a component or set; binds every text layer named `layer` inside it. */
function textProp(node, prop, def, layer = prop) {
  const key = node.addComponentProperty(prop, 'TEXT', def)
  const scopes = node.type === 'COMPONENT_SET' ? node.children : [node]
  for (const c of scopes) for (const t of c.findAll((n) => n.type === 'TEXT' && n.name === layer)) t.componentPropertyReferences = { characters: key }
  return key
}
function boolProp(node, prop, def, layer) {
  const key = node.addComponentProperty(prop, 'BOOLEAN', def)
  const scopes = node.type === 'COMPONENT_SET' ? node.children : [node]
  for (const c of scopes) for (const n of c.findAll((x) => x.name === layer)) n.componentPropertyReferences = { ...(n.componentPropertyReferences || {}), visible: key }
  return key
}
/** Finds a component (or a variant inside a set) on any loaded page by name and props. */
async function findComponent(name, props) {
  for (const p of figma.root.children) {
    if (!['Components', 'Blocks'].includes(p.name)) continue
    await p.loadAsync()
    const hit = p.findOne((n) => (n.type === 'COMPONENT_SET' || n.type === 'COMPONENT') && n.name === name && (n.type === 'COMPONENT_SET' || n.parent.type !== 'COMPONENT_SET'))
    if (!hit) continue
    if (hit.type === 'COMPONENT') return hit
    const want = Object.entries(props || {})
    return hit.children.find((v) => want.every(([k, val]) => v.variantProperties[k] === val)) || hit.defaultVariant
  }
  throw new Error(`no component ${name}`)
}
async function inst(parent, name, props, texts) {
  const c = await findComponent(name, props)
  const i = c.createInstance()
  if (parent) parent.appendChild(i)
  if (texts) setProps(i, texts)
  return i
}
/** Sets instance properties by bare name: {label: 'View Work', active: true}. */
function setProps(i, values) {
  const defs = i.componentProperties
  const out = {}
  for (const [k, v] of Object.entries(values)) {
    const full = Object.keys(defs).find((d) => d === k || d.split('#')[0] === k)
    if (!full) throw new Error(`no property ${k} on ${i.name}`)
    out[full] = v
  }
  i.setProperties(out)
}
