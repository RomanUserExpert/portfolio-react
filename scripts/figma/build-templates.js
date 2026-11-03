// Pages: full templates assembled from Blocks + Components instances only.
// Each template pins its Semantic (Light/Dark) and Layout (Desktop/Mobile) modes.
const page = await pageNamed('Pages')
await figma.setCurrentPageAsync(page)
for (const n of [...page.children]) if (n.getPluginData('folio') === 'template') n.remove()

const PROJECTS = JSON.parse(DATA)
const VIEW = { desktop: { w: 1440, h: 900 }, mobile: { w: 390, h: 844 } }

function frame(name, bp, theme) {
  const f = box(page, { name, w: VIEW[bp].w, fill: 'color/bg/default', align: 'CENTER', clip: true })
  f.setPluginData('folio', 'template')
  mode(f, 'Semantic', theme)
  mode(f, 'Layout', bp === 'mobile' ? 'Mobile' : 'Desktop')
  return f
}
async function header(parent, bp) {
  if (bp === 'mobile') {
    const wrap = box(parent, { name: 'header', pad: ['space/0', 'layout/page-pad'], fillW: true, align: 'CENTER' })
    await inst(wrap, 'Header', { breakpoint: 'mobile', scrolled: 'false' })
  } else await inst(parent, 'Header', { breakpoint: 'desktop', scrolled: 'false' })
}
async function footer(parent, bp) { const f = await inst(parent, 'Footer', { breakpoint: bp }); if (bp === 'mobile') f.layoutSizingHorizontal = 'FILL' }
function gap(parent, token) { const s = box(parent, { name: `↕ ${token}` }); s.layoutMode = 'NONE'; bind(s, 'height', token); s.resize(1, s.height); return s }
async function card(parent, p) {
  const i = await inst(parent, 'ProjectCard', { state: 'default' }, { title: p.title, description: p.description, showTag3: p.tags.length > 2 })
  p.tags.slice(0, 3).forEach((t, k) => setProps(i.findOne((n) => n.name === `tag${k + 1}`), { label: t }))
  imageFill(i.findOne((n) => n.name === 'cover'), p.slug)
  return i
}

const made = []
/* ───────── Home ───────── */
for (const [bp, theme] of [['desktop', 'Light'], ['desktop', 'Dark'], ['mobile', 'Light'], ['mobile', 'Dark']]) {
  const f = frame(`Home · ${bp === 'mobile' ? 'Mobile' : 'Desktop'} · ${theme}`, bp, theme)
  await header(f, bp)
  const hero = await inst(f, 'Hero', { breakpoint: bp }); hero.layoutSizingHorizontal = 'FILL'
  for (const b of ['ProjectsSection', 'AboutSection', 'ProcessSection', 'ContactSection']) {
    const i = await inst(f, b, { breakpoint: bp })
    if (bp === 'mobile') i.layoutSizingHorizontal = 'FILL'
  }
  await footer(f, bp)
  made.push(f)
}

/* ───────── Projects ───────── */
{
  const f = frame('Projects · Desktop · Light', 'desktop', 'Light')
  await header(f, 'desktop')
  const body = box(f, { name: 'main', w: 960 }); bind(body, 'paddingBottom', 'space/72')
  const h = await inst(body, 'ProjectsHead'); h.layoutSizingHorizontal = 'FILL'
  gap(body, 'space/40')
  const gw = box(body, { name: 'grid-wrap', pad: ['space/0', 'layout/page-pad'], fillW: true })
  const g = box(gw, { name: 'grid', dir: 'HORIZONTAL', wrap: true, gap: 'space/16', fillW: true })
  for (const p of PROJECTS) await card(g, p)
  await footer(f, 'desktop')
  made.push(f)
}

/* ───────── Case (RiskLayer) ───────── */
{
  const p = PROJECTS[0]
  const f = frame(`Case · ${p.title} · Desktop · Light`, 'desktop', 'Light')
  await header(f, 'desktop')
  const body = box(f, { name: 'main', w: 960 }); bind(body, 'paddingBottom', 'space/72')
  const h = await inst(body, 'CaseHead', null, { title: p.title }); h.layoutSizingHorizontal = 'FILL'
  p.tags.slice(0, 3).forEach((t, k) => setProps(h.findOne((n) => n.name === `tag${k + 1}`), { label: t }))
  gap(body, 'space/24')
  const cw = box(body, { name: 'carousel', pad: ['space/0', 'layout/page-pad'], fillW: true })
  await inst(cw, 'Carousel')
  gap(body, 'space/64')
  for (const s of p.sections) {
    const list = s.list || []
    const props = { paragraph: (s.paragraphs || []).join('\n\n') || ' ', showParagraph: !!(s.paragraphs || []).length, showList: list.length > 0, showItem3: list.length > 2 }
    for (let k = 0; k < 3; k++) props[`item${k + 1}`] = list[k] || ' '
    const i = await inst(body, 'CaseSection', null, props); i.layoutSizingHorizontal = 'FILL'
    setProps(i.findOne((n) => n.type === 'INSTANCE' && n.name === 'SectionLabel'), { label: s.label })
  }
  await footer(f, 'desktop')
  made.push(f)
}

/* ───────── CV ───────── */
{
  const f = frame('CV · Desktop · Light', 'desktop', 'Light')
  await header(f, 'desktop')
  const body = box(f, { name: 'main', w: 960 }); bind(body, 'paddingBottom', 'space/72')
  const h = await inst(body, 'CvHead'); h.layoutSizingHorizontal = 'FILL'
  gap(body, 'space/40')
  const pwrap = box(body, { name: 'preview-wrap', pad: ['space/0', 'layout/page-pad'], fillW: true })
  const prev = box(pwrap, { name: 'preview', fillW: true, h: 720, fill: 'color/bg/subtle', stroke: 'color/border/default', radius: 'radius/md', clip: true, align: 'CENTER', pad: ['space/24', 'space/0'] })
  const draft = await pageNamed('Draft')
  const cv = draft.findOne((n) => n.name === 'CV — Roman Ovcharenko')
  if (cv) {
    const c = cv.clone(); prev.appendChild(c); c.rescale(600 / c.width); c.name = 'CV page (copy from Draft)'
    await c.setEffectStyleIdAsync(ES['shadow/raised'].id)
  } else await text(prev, 'PDF preview', 'Body/MD', 'color/fg/muted')
  await footer(f, 'desktop')
  made.push(f)
}

/* ── lay out: row per page type ── */
let x = 0, y = 0
const rows = [made.slice(0, 4), made.slice(4)]
for (const r of rows) {
  x = 0; let rowH = 0
  for (const f of r) { f.x = x; f.y = y; x += f.width + 160; rowH = Math.max(rowH, f.height) }
  y += rowH + 240
}
figma.viewport.scrollAndZoomIntoView(made)
return made.map((f) => `${f.name} ${f.id} ${Math.round(f.width)}x${Math.round(f.height)}`)
