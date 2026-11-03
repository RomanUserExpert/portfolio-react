// Blocks page: page sections (components/sections + page heads) as components built from Components-page instances.
// breakpoint=desktop → 960 wide (main max-width) or 1440 for full-bleed Hero; mobile → 390 with Layout mode Mobile.
let page = figma.root.children.find((p) => p.name === 'Blocks')
if (!page) {
  page = figma.createPage(); page.name = 'Blocks'
  figma.root.insertChild(figma.root.children.findIndex((p) => p.name === 'Components') + 1, page)
}
await page.loadAsync()
await figma.setCurrentPageAsync(page)
replace(page, 'Blocks')

const PROJECTS = JSON.parse(DATA)
const root = box(page, { name: 'Blocks', w: 1600, pad: 'space/72', gap: 'space/72', fill: 'color/bg/default' })
mode(root, 'Semantic', 'Light')
const head = box(root, { name: 'Header', gap: 'space/12', fillW: true })
await text(head, 'Blocks', 'Overline/2XS', 'color/fg/accent')
await text(head, 'Page sections', 'Display/LG')
await text(head, 'components/sections and page heads, assembled only from component instances. Desktop variants inherit the Layout mode of the page; mobile variants pin Layout = Mobile.', 'Body/LG', 'color/fg/muted', { w: 760 })

async function section(title, source) {
  const s = box(root, { name: title, gap: 'space/24', fillW: true })
  const h = box(s, { name: 'Title', gap: 'space/6' })
  await text(h, title, 'Overline/2XS')
  await text(h, source, 'Body/SM', 'color/fg/muted')
  return box(s, { name: 'items', dir: 'HORIZONTAL', gap: 'space/40', wrap: true, fillW: true, align: 'MIN' })
}
const BP = [{ breakpoint: 'desktop' }, { breakpoint: 'mobile' }]
const W = { desktop: 960, mobile: 390 }
function spacer(parent, token) {
  const s = box(parent, { name: `↕ ${token}` }); s.layoutMode = 'NONE'
  bind(s, 'height', token); s.resize(1, s.height)
  return s
}
function topBorder(node) {
  node.strokes = [paint('color/border/default')]
  node.strokeTopWeight = 1; node.strokeBottomWeight = 0; node.strokeLeftWeight = 0; node.strokeRightWeight = 0
}
/** A section block: page-pad on the sides, section-pad top and bottom. */
function sectionFrame(bp, o = {}) {
  const c = box(null, { component: true, w: W[bp], pad: ['layout/section-pad', 'layout/page-pad'], gap: o.gap ?? 'space/40' })
  if (bp === 'mobile') mode(c, 'Layout', 'Mobile')
  if (o.border !== false) topBorder(c)
  return c
}
async function card(parent, p, width) {
  const i = await inst(parent, 'ProjectCard', { state: 'default' }, { title: p.title, description: p.description, showTag3: p.tags.length > 2 })
  p.tags.slice(0, 3).forEach((t, k) => setProps(i.findOne((n) => n.name === `tag${k + 1}`), { label: t }))
  imageFill(i.findOne((n) => n.name === 'cover'), p.slug)
  if (width === 'fill') i.layoutSizingHorizontal = 'FILL'
  return i
}

/* ───────── GridPattern (InteractiveGridPattern) ───────── */
let row = await section('GridPattern', 'components/ui/InteractiveGridPattern.tsx · 33px cells, fades left/right 6% and bottom from 55%. Static frame of the animation')
async function grid(w, h, cells) {
  const c = box(null, { component: true, w, h, clip: true }); c.layoutMode = 'NONE'; c.resize(w, h)
  const lines = []
  for (let x = 33; x < w; x += 33) { const r = figma.createRectangle(); r.resize(1, h); r.x = x; r.y = 0; fill(r, 'component/grid/line'); lines.push(r) }
  for (let y = 33; y < h; y += 33) { const r = figma.createRectangle(); r.resize(w, 1); r.x = 0; r.y = y; fill(r, 'component/grid/line'); lines.push(r) }
  for (const [cx, cy, kind] of cells) {
    const r = figma.createRectangle(); r.resize(32, 32); r.x = cx * 33 + 1; r.y = cy * 33 + 1
    fill(r, kind === 'active' ? 'component/grid/active' : 'component/grid/hover'); lines.push(r)
  }
  const fade = (name, stops, transform) => {
    const m = figma.createRectangle(); m.resize(w, h); m.name = name
    m.fills = [{ type: 'GRADIENT_LINEAR', gradientTransform: transform, gradientStops: stops.map(([position, a]) => ({ position, color: { r: 1, g: 1, b: 1, a } })) }]
    m.isMask = true; m.maskType = 'ALPHA'
    return m
  }
  const hMask = fade('fade-x', [[0, 0], [0.06, 1], [0.94, 1], [1, 0]], [[1, 0, 0], [0, 1, 0]])
  c.appendChild(hMask)
  for (const l of lines) c.appendChild(l)
  const inner = figma.group([hMask, ...lines], c); inner.name = 'cells'
  const vMask = fade('fade-y', [[0, 1], [0.55, 1], [1, 0]], [[0, 1, 0], [-1, 0, 1]])
  c.insertChild(0, vMask)
  const outer = figma.group([vMask, inner], c); outer.name = 'pattern'
  return c
}
const gridSet = await variants(row, 'GridPattern', BP, async ({ breakpoint }) => breakpoint === 'desktop'
  ? grid(1440, 834, [[30, 9, 'active'], [29, 9, 'hover'], [28, 10, 'hover'], [12, 4, 'hover'], [37, 14, 'hover'], [8, 17, 'hover']])
  : grid(390, 778, [[9, 6, 'active'], [8, 6, 'hover'], [3, 15, 'hover']]))

/* ───────── Hero ───────── */
row = await section('Hero', 'components/sections/Hero.tsx · full-bleed, min-height 100vh − header')
const hero = await variants(row, 'Hero', BP, async ({ breakpoint }) => {
  const mob = breakpoint === 'mobile'
  const w = mob ? 390 : 1440, h = mob ? 778 : 834
  const c = box(null, { component: true, w, h, justify: 'CENTER', align: 'CENTER', pad: [mob ? 'space/48' : 'space/64', 'space/0'], clip: true })
  if (mob) mode(c, 'Layout', 'Mobile')
  const g = gridSet.children.find((v) => v.variantProperties.breakpoint === breakpoint).createInstance()
  c.appendChild(g); g.layoutPositioning = 'ABSOLUTE'; g.x = 0; g.y = 0; g.constraints = { horizontal: 'STRETCH', vertical: 'STRETCH' }
  const content = box(c, { name: 'content', w: 960, pad: ['space/0', 'layout/page-pad'] })
  content.layoutSizingHorizontal = 'FILL'; bind(content, 'maxWidth', 'layout/max-width')
  await text(content, 'Product Designer', 'Overline/LG', 'color/fg/accent', { name: 'role' })
  spacer(content, mob ? 'space/24' : 'space/16')
  await text(content, 'Roman\nOvcharenko', 'Display/2XL', 'color/fg/default', { name: 'heading', fillW: true })
  spacer(content, mob ? 'space/24' : 'space/20')
  const desc = mob
    ? 'Turning complex systems into clear, usable products. SaaS platforms, enterprise tools, data-heavy interfaces — from first wireframe to production-ready Figma and post-launch support. Open to discuss any project.'
    : 'Turning complex systems into clear, usable products.\nSaaS platforms, enterprise tools, data-heavy interfaces —\nfrom first wireframe to production-ready Figma and post-launch support.\nOpen to discuss any project.'
  if (mob) await rawText(content, desc, { size: 'font/size/xl', lh: 170, color: 'color/fg/muted', name: 'description' }).then((t) => { t.layoutSizingHorizontal = 'FILL'; t.textAutoResize = 'HEIGHT' })
  else await text(content, desc, 'Body/2XL', 'color/fg/muted', { name: 'description', fillW: true })
  spacer(content, mob ? 'space/24' : 'space/40')
  const actions = box(content, { name: 'actions', dir: mob ? 'VERTICAL' : 'HORIZONTAL', gap: mob ? 'space/24' : 'space/10', fillW: mob })
  const b1 = await inst(actions, 'Button', { variant: 'primary', state: 'default' }, { label: 'View Work' })
  const b2 = await inst(actions, 'Button', { variant: 'ghost', state: 'default' }, { label: 'Get in Touch' })
  if (mob) { b1.layoutSizingHorizontal = 'FILL'; b2.layoutSizingHorizontal = 'FILL' }
  return c
})

/* ───────── Projects ───────── */
row = await section('ProjectsSection', 'components/sections/Projects.tsx · featured projects')
const featured = PROJECTS.filter((p) => p.featured)
await variants(row, 'ProjectsSection', BP, async ({ breakpoint }) => {
  const mob = breakpoint === 'mobile'
  const c = sectionFrame(breakpoint, { gap: 'space/0' })
  await inst(c, 'SectionLabel', null, { label: 'Projects' })
  spacer(c, 'space/40')
  const g = box(c, { name: 'grid', dir: mob ? 'VERTICAL' : 'HORIZONTAL', wrap: !mob, gap: 'space/16', fillW: true })
  for (const p of featured) await card(g, p, mob ? 'fill' : null)
  spacer(c, 'space/32')
  const f = box(c, { name: 'footer', dir: 'HORIZONTAL', justify: 'CENTER', fillW: true })
  const b = await inst(f, 'Button', { variant: 'ghost', state: 'default' }, { label: 'View All Projects →' })
  if (mob) b.layoutSizingHorizontal = 'FILL'
  return c
})

/* ───────── About ───────── */
row = await section('AboutSection', 'components/sections/About.tsx')
const domains = ['SaaS Dashboards & Admin Tools', 'Enterprise Internal Tools', 'Design Systems', 'Fintech & Trading Products', 'Landing Pages', 'E-commerce']
const tools = ['Figma', 'Miro', 'Photoshop', 'Webflow', 'Atomic Design', 'Dev Handoff']
const profiles = ['Behance ↗', 'Dribbble ↗', 'LinkedIn ↗', 'GitHub ↗']
await variants(row, 'AboutSection', BP, async ({ breakpoint }) => {
  const mob = breakpoint === 'mobile'
  const c = sectionFrame(breakpoint)
  await inst(c, 'SectionLabel', null, { label: 'About' })
  const lay = box(c, { name: 'layout', dir: mob ? 'VERTICAL' : 'HORIZONTAL', gap: mob ? 'space/40' : 'space/72', fillW: true })
  const t = box(lay, { name: 'text', gap: 'space/16', grow: !mob, fillW: mob })
  if (!mob) t.layoutGrow = 1
  await text(t, 'I’m a product designer based in Ukraine. Over the last 6 years I’ve focused on B2B SaaS, enterprise tools, and design systems — products where complexity needs to be tamed, not hidden.', 'Body/LG', 'color/fg/muted', { fillW: true, name: 'p1' })
  await text(t, 'I work from discovery and structure all the way through to a Figma file ready for development. I ask questions instead of making assumptions, and flag problems early rather than late.', 'Body/LG', 'color/fg/muted', { fillW: true, name: 'p2' })
  const cvw = box(t, { name: 'cv', fillW: mob }); bind(cvw, 'paddingTop', 'space/8')
  const cv = await inst(cvw, 'Button', { variant: 'ghost', state: 'default' }, { label: 'View CV ↗' })
  if (mob) cv.layoutSizingHorizontal = 'FILL'
  const side = box(lay, { name: 'sidebar', gap: 'space/24', w: mob ? undefined : 240, fillW: mob })
  const block = async (label) => { const b = box(side, { name: label, gap: 'space/10', fillW: true }); await text(b, label, 'Overline/2XS'); return b }
  const d = await block('Domains'); const dl = box(d, { name: 'list', gap: 'space/4', fillW: true })
  for (const x of domains) await text(dl, x, 'Body/MD', 'color/fg/muted', { fillW: true })
  const tb = await block('Tools'); const tf = box(tb, { name: 'tags', dir: 'HORIZONTAL', wrap: true, gap: 'space/4', fillW: true })
  for (const x of tools) await inst(tf, 'Pill', { state: 'default' }, { label: x })
  const pb = await block('Profiles'); const pl = box(pb, { name: 'links', gap: 'space/8' })
  for (const x of profiles) await inst(pl, 'Link', { variant: 'muted', state: 'default' }, { label: x })
  return c
})

/* ───────── Process ───────── */
row = await section('ProcessSection', 'components/sections/Process.tsx · rows bleed 12px past the content edge (margin: 0 -12px)')
const steps = [
  ['01', 'Discovery', 'Clarify goals, constraints, and what problem actually needs solving — before touching a single screen.'],
  ['02', 'Research & Framing', 'Review existing flows, identify friction, map journeys and key decision points.'],
  ['03', 'Structure & Wireframes', 'Information architecture and logic first — visuals follow from clarity, not the other way around.'],
  ['04', 'Design System', 'Scalable components with tokens, variants, and every key state defined.'],
  ['05', 'Prototyping', 'Interactive prototypes to validate flows and communicate intent before development starts.'],
  ['06', 'Dev Handoff', 'Clean Figma files — auto layout, components, tokens, all states. No guessing during implementation.'],
  ['07', 'Post-launch Support', 'Available after release — clarifying edge cases, adjusting to real user feedback, and keeping the design consistent as the product evolves.'],
]
await variants(row, 'ProcessSection', BP, async ({ breakpoint }) => {
  const mob = breakpoint === 'mobile'
  const c = sectionFrame(breakpoint)
  // page-pad − 12 on the sides so rows bleed; the label gets the 12 back
  pad(c, 'layout/section-pad', mob ? 'space/4' : 'space/20')
  const lw = box(c, { name: 'label', pad: ['space/0', 'space/12'] })
  await inst(lw, 'SectionLabel', null, { label: 'Process' })
  const list = box(c, { name: 'list', fillW: true })
  for (const [num, title, description] of steps) {
    const r = await inst(list, 'ProcessRow', { breakpoint }, { num, title, description })
    r.layoutSizingHorizontal = 'FILL'
  }
  const end = box(list, { name: 'end', fillW: true }); topBorder(end)
  return c
})

/* ───────── Contact ───────── */
row = await section('ContactSection', 'components/sections/Contact.tsx')
await variants(row, 'ContactSection', BP, async ({ breakpoint }) => {
  const mob = breakpoint === 'mobile'
  const c = sectionFrame(breakpoint, { border: false })
  await text(c, 'Get in touch', 'Display/2XL', 'color/fg/default', { name: 'title', fillW: true })
  const lay = box(c, { name: 'layout', gap: 'space/24', w: 520 })
  if (mob) lay.layoutSizingHorizontal = 'FILL'
  await text(lay, 'Have a project or idea you want to bring to life? Whether it’s early thinking or already in motion — I’m happy to jump in, ask the right questions, and help turn it into something that actually works.', 'Body/XL', 'color/fg/muted', { fillW: true, name: 'lead' })
  const links = box(lay, { name: 'links', dir: mob ? 'VERTICAL' : 'HORIZONTAL', gap: mob ? 'space/10' : 'space/16', align: mob ? 'MIN' : 'CENTER' })
  await inst(links, 'Link', { variant: 'accent', state: 'default' }, { label: 'super.ovcharenko2017@gmail.com' })
  if (!mob) {
    const d = figma.createEllipse(); links.appendChild(d); d.name = 'dot'
    bind(d, 'width', 'size/dot'); bind(d, 'height', 'size/dot'); fill(d, 'color/icon/accent')
  }
  await inst(links, 'Link', { variant: 'accent', state: 'default' }, { label: 'Telegram ↗' })
  return c
})

/* ───────── Page heads ───────── */
row = await section('Page heads', 'app/projects/page.tsx · app/projects/[slug]/page.tsx · app/cv/page.tsx (section padding 56 / 72, no top border)')
const pageHead = (name) => {
  const c = box(row, { component: true, name, w: 960, pad: ['space/0', 'layout/page-pad'] })
  bind(c, 'paddingTop', 'space/56')
  return c
}
const ph = pageHead('ProjectsHead')
await inst(ph, 'Link', { variant: 'muted', state: 'default' }, { label: '← Back' })
spacer(ph, 'space/12')
await text(ph, 'Projects', 'Display/LG', 'color/fg/default', { name: 'title' })
textProp(ph, 'title', 'Projects')

const ch = pageHead('CaseHead')
await inst(ch, 'Link', { variant: 'muted', state: 'default' }, { label: '← Back' })
spacer(ch, 'space/12')
await text(ch, 'RiskLayer', 'Display/LG', 'color/fg/default', { name: 'title' })
spacer(ch, 'space/12')
const ct = box(ch, { name: 'tags', dir: 'HORIZONTAL', gap: 'space/8', wrap: true, fillW: true })
for (const [k, t] of ['Fintech', 'Enterprise SaaS', 'Interaction Design'].entries()) { const i = await inst(ct, 'Tag', null, { label: t }); i.name = `tag${k + 1}` }
textProp(ch, 'title', 'RiskLayer')

const cs = box(row, { component: true, name: 'CaseSection', w: 960, pad: ['space/0', 'layout/page-pad'] })
const csIn = box(cs, { name: 'inner', gap: 'space/16', fillW: true, pad: ['space/40', 'space/0'] }); topBorder(csIn)
await inst(csIn, 'SectionLabel', null, { label: 'About Project' })
const pw = box(csIn, { name: 'paragraphs', gap: 'space/12', w: 640 }); bind(pw, 'maxWidth', 'layout/measure')
await text(pw, 'RiskLayer is a multi-module B2B platform for CROs, Compliance Officers, and Risk Analysts working in fintech and institutional finance.', 'Body/LG', 'color/fg/muted', { fillW: true, name: 'paragraph' })
const ul = box(csIn, { name: 'list', gap: 'space/6', w: 640 }); bind(ul, 'paddingTop', 'space/8'); bind(ul, 'maxWidth', 'layout/measure')
for (const [k, li] of ['Competitive Analysis & Domain Research', 'Information Architecture & Role-Based Navigation', 'Designing for Data Density and Progressive Disclosure'].entries()) {
  const r = box(ul, { name: `row${k + 1}`, dir: 'HORIZONTAL', fillW: true })
  bind(r, 'paddingLeft', 'space/16')
  const m = await rawText(r, '—', { size: 'font/size/lg', lh: 170, color: 'color/icon/subtle', name: 'marker' })
  m.layoutPositioning = 'ABSOLUTE'; m.x = 0; m.y = 0
  const t = await rawText(r, li, { size: 'font/size/lg', lh: 170, color: 'color/fg/muted', name: `item${k + 1}` })
  t.layoutSizingHorizontal = 'FILL'; t.textAutoResize = 'HEIGHT'
}
textProp(cs, 'paragraph', pw.children[0].characters)
for (let k = 1; k <= 3; k++) textProp(cs, `item${k}`, ul.children[k - 1].findOne((n) => n.name === `item${k}`).characters)
boolProp(cs, 'showParagraph', true, 'paragraphs')
boolProp(cs, 'showList', true, 'list')
boolProp(cs, 'showItem3', true, 'row3')

const cvh = pageHead('CvHead')
await inst(cvh, 'Link', { variant: 'muted', state: 'default' }, { label: '← Back' })
spacer(cvh, 'space/32')
const cvr = box(cvh, { name: 'header', dir: 'HORIZONTAL', justify: 'SPACE_BETWEEN', align: 'MAX', gap: 'space/24', fillW: true })
await text(cvr, 'CV / Resume', 'Display/LG', 'color/fg/default', { name: 'title' })
await inst(cvr, 'Button', { variant: 'primary', state: 'default' }, { label: 'Download PDF' })

figma.viewport.scrollAndZoomIntoView([root])
return { id: root.id, blocks: root.findAll((n) => (n.type === 'COMPONENT_SET') || (n.type === 'COMPONENT' && n.parent.type !== 'COMPONENT_SET')).map((n) => `${n.name} ${n.id} ${Math.round(n.width)}x${Math.round(n.height)}`) }
