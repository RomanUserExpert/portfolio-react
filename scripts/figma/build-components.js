// Components page: one component (set) per React component in components/ui, components/project, components/layout.
// Property names follow the React props (variant, state, label, …). Everything is bound to tokens.
const page = await pageNamed('Components')
await figma.setCurrentPageAsync(page)
replace(page, 'Components')

const root = box(page, { name: 'Components', w: 1440, pad: 'space/72', gap: 'space/72', fill: 'color/bg/default' })
mode(root, 'Semantic', 'Light')
const head = box(root, { name: 'Header', gap: 'space/12', fillW: true })
await text(head, 'Components', 'Overline/2XS', 'color/fg/accent')
await text(head, 'Folio components', 'Display/LG')
await text(head, 'Mirrors components/ui, components/project and components/layout. Property names match the React props. Every color, size and radius is a variable.', 'Body/LG', 'color/fg/muted', { w: 760 })

async function section(title, source) {
  const s = box(root, { name: title, gap: 'space/24', fillW: true })
  const h = box(s, { name: 'Title', gap: 'space/6' })
  await text(h, title, 'Overline/2XS')
  await text(h, source, 'Body/SM', 'color/fg/muted')
  const row = box(s, { name: 'items', dir: 'HORIZONTAL', gap: 'space/40', wrap: true, fillW: true, align: 'MIN' })
  return row
}
const both = (a, b) => a.flatMap((x) => b.map((y) => ({ ...x, ...y })))
const STATES = [{ state: 'default' }, { state: 'hover' }]

/* ───────── Button ───────── */
let row = await section('Button', 'components/ui/Button.tsx · variant: primary | ghost')
const button = await variants(row, 'Button', both([{ variant: 'primary' }, { variant: 'ghost' }], STATES), async ({ variant, state }) => {
  const c = box(null, { component: true, dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', pad: ['space/10', 'space/24'], radius: 'radius/sm' })
  const hov = state === 'hover'
  if (variant === 'primary') {
    fill(c, hov ? 'color/bg/accent-hover' : 'color/bg/accent')
    stroke(c, hov ? 'color/bg/accent-hover' : 'color/bg/accent')
    await text(c, 'View Work', 'Label/MD', 'color/fg/on-accent', { name: 'label' })
  } else {
    stroke(c, hov ? 'color/border/accent' : 'color/border/default')
    await text(c, 'View Work', 'Label/MD', 'color/fg/accent', { name: 'label' })
  }
  return c
})
textProp(button, 'label', 'View Work')

/* ───────── Tag, SectionLabel, Pill ───────── */
row = await section('Tag · SectionLabel · Pill', 'components/ui/Tag.tsx · components/ui/SectionLabel.tsx · About tool pills')
const tag = box(row, { component: true, name: 'Tag', dir: 'HORIZONTAL', pad: ['space/2', 'space/6'], fill: 'color/bg/subtle', stroke: 'color/border/default', radius: 'radius/sm' })
await text(tag, 'Fintech', 'Label/XS', 'color/fg/secondary', { name: 'label' })
textProp(tag, 'label', 'Fintech')

const sl = box(row, { component: true, name: 'SectionLabel', dir: 'HORIZONTAL' })
await text(sl, 'Projects', 'Overline/2XS', 'color/fg/default', { name: 'label' })
textProp(sl, 'label', 'Projects')

const pill = await variants(row, 'Pill', STATES, async ({ state }) => {
  const hov = state === 'hover'
  const c = box(null, { component: true, dir: 'HORIZONTAL', pad: ['space/4', 'space/8'], radius: 'radius/full', stroke: hov ? 'color/border/strong' : 'color/border/default' })
  await text(c, 'Figma', 'Label/XS', hov ? 'color/fg/default' : 'color/fg/muted', { name: 'label' })
  return c
})
textProp(pill, 'label', 'Figma')

/* ───────── Link ───────── */
row = await section('Link', 'Header nav, About profiles, back links (← Back), Contact email · variant: nav | muted | accent')
const link = await variants(row, 'Link', both([{ variant: 'nav' }, { variant: 'muted' }, { variant: 'accent' }], STATES), async ({ variant, state }) => {
  const hov = state === 'hover'
  const c = box(null, { component: true, dir: 'HORIZONTAL', align: 'CENTER' })
  if (variant === 'nav') await text(c, 'Work', 'Body/SM', hov ? 'color/fg/default' : 'color/fg/muted', { name: 'label' })
  if (variant === 'muted') await text(c, 'Behance ↗', 'Body/MD', hov ? 'color/fg/accent' : 'color/fg/muted', { name: 'label' })
  if (variant === 'accent') {
    bind(c, 'paddingBottom', 'space/2')
    c.strokes = [paint(hov ? 'color/border/accent' : 'color/bg/default')]
    c.strokeTopWeight = 0; c.strokeLeftWeight = 0; c.strokeRightWeight = 0; c.strokeBottomWeight = 1
    if (!hov) c.strokes = []
    await rawText(c, 'super.ovcharenko2017@gmail.com', { style: 'Medium', size: 'font/size/lg', lh: 160, color: 'color/fg/accent', name: 'label' })
  }
  return c
})
textProp(link, 'label', 'Work')

/* ───────── ThemeToggle, Logo ───────── */
row = await section('ThemeToggle · Logo', 'components/layout/Header.tsx')
const toggle = await variants(row, 'ThemeToggle', both([{ theme: 'light' }, { theme: 'dark' }], STATES), async ({ theme, state }) => {
  const hov = state === 'hover'
  const c = box(null, { component: true, dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', gap: 'space/4', w: 82, pad: ['space/4', 'space/0'], radius: 'radius/full', stroke: hov ? 'color/border/strong' : 'color/border/default' })
  const fg = hov ? 'color/fg/default' : 'color/fg/muted'
  await rawText(c, theme === 'dark' ? '●' : '◐', { style: 'Medium', size: 'font/size/md', lh: 100, color: fg, name: 'icon' })
  const l = await rawText(c, theme === 'dark' ? 'Dark' : 'Light', { style: 'Medium', size: 'font/size/xs', lh: 100, color: fg, name: 'label' })
  return c
})

const logo = box(row, { component: true, name: 'Logo', dir: 'HORIZONTAL', align: 'CENTER', gap: 'space/8' })
const mark = figma.createNodeFromSvg('<svg width="32" height="32" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M30 0L38.1027 21.8973L60 30L38.1027 38.1027L30 60L21.8973 38.1027L0 30L21.8973 21.8973L30 0Z" fill="black"/><path d="M30 16L33.7813 26.2187L44 30L33.7813 33.7813L30 44L26.2187 33.7813L16 30L26.2187 26.2187L30 16Z" fill="black"/></svg>')
mark.name = 'mark'
logo.appendChild(mark)
fill(mark.children[0], 'color/fg/default'); mark.children[0].name = 'star'
fill(mark.children[1], 'color/icon/accent'); mark.children[1].name = 'star-accent'
mark.fills = []
await rawText(logo, 'R.O.', { family: 'Special Gothic Expanded One', size: 'font/size/2xl', lh: 100, ls: 1.5, name: 'wordmark' })

/* ───────── IconButton, Dot ───────── */
row = await section('IconButton · Dot', 'Carousel arrows and expand, Lightbox controls · Carousel dots')
const iconBtn = await variants(row, 'IconButton', both([{ variant: 'surface' }, { variant: 'surface-square' }, { variant: 'overlay' }], STATES), async ({ variant, state }) => {
  const hov = state === 'hover'
  const c = box(null, { component: true, dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER' })
  c.primaryAxisSizingMode = 'FIXED'; c.counterAxisSizingMode = 'FIXED'
  const size = { surface: 'size/control-md', 'surface-square': 'size/control-sm', overlay: 'size/control-lg' }[variant]
  bind(c, 'width', size); bind(c, 'height', size)
  radius(c, variant === 'surface-square' ? 'radius/sm' : 'radius/full')
  if (variant === 'overlay') {
    fill(c, hov ? 'component/lightbox/control-bg-hover' : 'component/lightbox/control-bg')
    stroke(c, 'component/lightbox/border')
    await rawText(c, '→', { size: 'font/size/2xl', lh: 100, color: 'component/lightbox/fg', name: 'icon' })
  } else {
    fill(c, hov ? 'color/bg/subtle-hover' : 'color/bg/default')
    stroke(c, hov ? 'color/border/strong' : 'color/border/default')
    if (variant === 'surface') await rawText(c, '→', { size: 'font/size/xl', lh: 100, color: 'color/fg/default', name: 'icon' })
    else {
      const ic = figma.createNodeFromSvg('<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 5V1H5M9 1H13V5M13 9V13H9M5 13H1V9" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>')
      ic.name = 'expand'
      c.appendChild(ic)
      ic.fills = []
      stroke(ic.children[0], 'color/fg/default', 1.5, 'CENTER')
    }
  }
  return c
})
textProp(iconBtn, 'icon', '→')

const dot = await variants(row, 'Dot', [{ active: 'false' }, { active: 'true' }], async ({ active }) => {
  const c = box(null, { component: true, radius: 'radius/full' })
  c.layoutMode = 'NONE'
  bind(c, 'width', 'size/dot'); bind(c, 'height', 'size/dot')
  const on = active === 'true'
  fill(c, on ? 'color/fg/default' : 'color/icon/subtle')
  stroke(c, on ? 'color/fg/default' : 'color/border/strong')
  return c
})

/* ───────── ProjectCard ───────── */
row = await section('ProjectCard', 'components/project/ProjectCard.tsx · title, description, tags (3 Tag instances, hide the third with showTag3), cover image as a fill override')
const card = await variants(row, 'ProjectCard', STATES, async ({ state }) => {
  const hov = state === 'hover'
  const c = box(null, { component: true, w: 440, radius: 'radius/sm', stroke: hov ? 'color/border/strong' : 'color/border/default', clip: true })
  const thumb = box(c, { name: 'cover', fillW: true, h: 248, fill: 'color/bg/subtle' })
  imageFill(thumb, 'risklayer')
  const body = box(c, { name: 'body', gap: 'space/6', pad: 'space/20', fillW: true })
  const top = box(body, { name: 'top', dir: 'HORIZONTAL', gap: 'space/8', align: 'CENTER', fillW: true })
  await text(top, 'RiskLayer', 'Heading/LG', hov ? 'color/fg/accent' : 'color/fg/default', { name: 'title' })
  await rawText(top, '↗', { style: 'Bold', size: 'font/size/2xl', lh: 100, color: hov ? 'color/fg/accent' : 'color/fg/muted', name: 'arrow' })
  const tags = box(body, { name: 'tags', dir: 'HORIZONTAL', gap: 'space/8', wrap: true, fillW: true })
  for (const [i, t] of ['Fintech', 'Enterprise SaaS', 'Interaction Design'].entries()) {
    const ti = tag.createInstance(); tags.appendChild(ti); ti.name = `tag${i + 1}`
    setProps(ti, { label: t })
  }
  await text(body, 'Multi-module B2B platform for CROs, Compliance Officers, and Risk Analysts - six distinct workflows covering risk monitoring, stress testing, compliance rule management.', 'Body/SM', 'color/fg/muted', { name: 'description', fillW: true, truncate: 2 })
  return c
})
textProp(card, 'title', 'RiskLayer')
textProp(card, 'description', card.children[0].findOne((n) => n.name === 'description').characters)
boolProp(card, 'showTag3', true, 'tag3')

/* ───────── ProcessRow ───────── */
row = await section('ProcessRow', 'components/sections/Process.tsx row · breakpoint: desktop | mobile')
const proc = await variants(row, 'ProcessRow', [{ breakpoint: 'desktop' }, { breakpoint: 'mobile' }], async ({ breakpoint }) => {
  const mob = breakpoint === 'mobile'
  const c = box(null, { component: true, dir: 'HORIZONTAL', gap: 'space/20', w: mob ? 358 : 920, pad: ['space/20', 'space/12'] })
  c.strokes = [paint('color/border/default')]; c.strokeTopWeight = 1; c.strokeBottomWeight = 0; c.strokeLeftWeight = 0; c.strokeRightWeight = 0
  const num = box(c, { name: 'num-col', w: 32 }); bind(num, 'paddingTop', 'space/2')
  await rawText(num, '01', { style: 'Semi Bold', size: 'font/size/2xs', lh: 160, ls: 5, color: 'color/fg/muted', name: 'num' })
  const body = box(c, { name: 'content', dir: mob ? 'VERTICAL' : 'HORIZONTAL', gap: mob ? 'space/6' : 'space/20', grow: true })
  const tcol = box(body, { name: 'title-col', w: mob ? undefined : 176 }); bind(tcol, 'paddingTop', 'space/2')
  if (mob) tcol.layoutSizingHorizontal = 'FILL'
  await text(tcol, 'Discovery', 'Heading/MD', 'color/fg/default', { name: 'title', fillW: true })
  await text(body, 'Clarify goals, constraints, and what problem actually needs solving — before touching a single screen.', 'Body/MD', 'color/fg/muted', { name: 'description', fillW: true })
  return c
})
textProp(proc, 'num', '01')
textProp(proc, 'title', 'Discovery')
textProp(proc, 'description', 'Clarify goals, constraints, and what problem actually needs solving — before touching a single screen.')

/* ───────── Header, Footer ───────── */
row = await section('Header · Footer', 'components/layout · scrolled: false | true · breakpoint: desktop | mobile')
const navLabels = ['Work', 'About', 'Process', 'Get in Touch']
const header = await variants(row, 'Header', [
  { breakpoint: 'desktop', scrolled: 'false' }, { breakpoint: 'desktop', scrolled: 'true' }, { breakpoint: 'mobile', scrolled: 'false' },
], async ({ breakpoint, scrolled }) => {
  const mob = breakpoint === 'mobile'
  const floating = mob || scrolled === 'true'
  const c = box(null, { component: true, dir: 'HORIZONTAL', align: 'CENTER', w: mob ? 358 : 960, pad: ['space/16', 'layout/page-pad'], fill: 'color/bg/default' })
  if (floating) {
    stroke(c, 'color/border/default'); radius(c, 'radius/md')
    await c.setEffectStyleIdAsync(ES['shadow/raised'].id)
  }
  else { c.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0 }]; c.strokeWeight = 1 } // CSS: 1px transparent border
  const lg = logo.createInstance(); c.appendChild(lg)
  const spacer = box(c, { name: 'spacer', grow: true })
  if (!mob) {
    const nav = box(c, { name: 'nav', dir: 'HORIZONTAL', gap: 'space/24', align: 'CENTER' })
    bind(c, 'itemSpacing', 'space/24')
    for (const l of navLabels) { const i = link.defaultVariant.createInstance(); nav.appendChild(i); setProps(i, { label: l }) }
  }
  const t = toggle.defaultVariant.createInstance(); c.appendChild(t)
  return c
})
const footer = await variants(row, 'Footer', [{ breakpoint: 'desktop' }, { breakpoint: 'mobile' }], async ({ breakpoint }) => {
  const mob = breakpoint === 'mobile'
  const c = box(null, { component: true, w: mob ? 390 : 960, pad: ['space/24', 'layout/page-pad'] })
  c.strokes = [paint('color/border/default')]; c.strokeTopWeight = 1; c.strokeBottomWeight = 0; c.strokeLeftWeight = 0; c.strokeRightWeight = 0
  const inner = box(c, { name: 'inner', dir: mob ? 'VERTICAL' : 'HORIZONTAL', justify: mob ? 'MIN' : 'SPACE_BETWEEN', align: 'CENTER', gap: mob ? 'space/4' : undefined, fillW: true })
  await rawText(inner, '© 2026 Roman Ovcharenko', { size: 'font/size/xs', lh: 160, color: 'color/fg/muted', name: 'copyright' })
  await rawText(inner, 'Product Designer · Ukraine', { size: 'font/size/xs', lh: 160, color: 'color/fg/muted', name: 'meta' })
  return c
})

/* ───────── Carousel, Lightbox ───────── */
row = await section('Carousel · Lightbox', 'components/project/Carousel.tsx · Lightbox.tsx (always dark: component/lightbox/*)')
const carousel = box(row, { component: true, name: 'Carousel', w: 896, h: 504, stroke: 'color/border/default', radius: 'radius/md', clip: true, fill: 'color/bg/subtle' })
carousel.layoutMode = 'NONE'
const slide = figma.createRectangle(); carousel.appendChild(slide); slide.name = 'slide'
slide.resize(896, 504); imageFill(slide, 'risklayer-slide-1'); slide.constraints = { horizontal: 'SCALE', vertical: 'SCALE' }
const place = (n, x, y, cons) => { carousel.appendChild(n); n.x = x; n.y = y; n.constraints = cons }
const prev = iconBtn.defaultVariant.createInstance(); setProps(prev, { icon: '←' }); prev.name = 'prev'
place(prev, 16, (504 - 40) / 2, { horizontal: 'MIN', vertical: 'CENTER' })
const next = iconBtn.defaultVariant.createInstance(); next.name = 'next'
place(next, 896 - 16 - 40, (504 - 40) / 2, { horizontal: 'MAX', vertical: 'CENTER' })
const expand = iconBtn.children.find((v) => v.variantProperties.variant === 'surface-square' && v.variantProperties.state === 'default').createInstance(); expand.name = 'expand'
place(expand, 896 - 12 - 32, 12, { horizontal: 'MAX', vertical: 'MIN' })
const dots = box(null, { name: 'dots', dir: 'HORIZONTAL', gap: 'space/6' })
for (let i = 0; i < 7; i++) { const d = dot.children.find((v) => v.variantProperties.active === (i === 0 ? 'true' : 'false')).createInstance(); dots.appendChild(d) }
place(dots, (896 - dots.width) / 2, 504 - 16 - 6, { horizontal: 'CENTER', vertical: 'MAX' })

const lb = box(row, { component: true, name: 'Lightbox', w: 1440, h: 900, fill: 'component/lightbox/scrim' })
lb.layoutMode = 'NONE'
const lbImg = figma.createRectangle(); lb.appendChild(lbImg); lbImg.name = 'image'
lbImg.resize(1248, 702); lbImg.x = 96; lbImg.y = 99; imageFill(lbImg, 'risklayer-slide-1', 'FIT'); radius(lbImg, 'radius/sm')
lbImg.constraints = { horizontal: 'SCALE', vertical: 'SCALE' }
const ov = (v) => iconBtn.children.find((x) => x.variantProperties.variant === 'overlay' && x.variantProperties.state === 'default').createInstance()
const close = ov(); setProps(close, { icon: '✕' }); close.name = 'close'; lb.appendChild(close); close.x = 1440 - 20 - 44; close.y = 20; close.constraints = { horizontal: 'MAX', vertical: 'MIN' }
const lp = ov(); setProps(lp, { icon: '←' }); lp.name = 'prev'; lb.appendChild(lp); lp.x = 20; lp.y = 428; lp.constraints = { horizontal: 'MIN', vertical: 'CENTER' }
const ln = ov(); ln.name = 'next'; lb.appendChild(ln); ln.x = 1440 - 20 - 44; ln.y = 428; ln.constraints = { horizontal: 'MAX', vertical: 'CENTER' }
const counter = await rawText(lb, '1 / 7', { size: 'font/size/sm', lh: 160, ls: 5, color: 'component/lightbox/fg-muted', name: 'counter' })
counter.x = (1440 - counter.width) / 2; counter.y = 900 - 20 - counter.height; counter.constraints = { horizontal: 'CENTER', vertical: 'MAX' }

figma.viewport.scrollAndZoomIntoView([root])
const sets = root.findAll((n) => n.type === 'COMPONENT_SET').map((n) => `${n.name} (${n.children.length})`)
const singles = root.findAll((n) => n.type === 'COMPONENT' && n.parent.type !== 'COMPONENT_SET').map((n) => n.name)
return { id: root.id, sets, singles, ids: Object.fromEntries(root.findAll((n) => n.type === 'COMPONENT_SET' || (n.type === 'COMPONENT' && n.parent.type !== 'COMPONENT_SET')).map((n) => [n.name, n.id])) }
