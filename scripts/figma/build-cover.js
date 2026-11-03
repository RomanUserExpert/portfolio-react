// Cover page: file thumbnail (1920×1080).
const page = await pageNamed('Cover')
await figma.setCurrentPageAsync(page)
replace(page, 'Cover')
const c = box(page, { name: 'Cover', w: 1920, h: 1080, fill: 'color/bg/default', justify: 'CENTER', pad: ['space/0', 'space/72'], gap: 'space/24', clip: true })
mode(c, 'Semantic', 'Light')
const g = await inst(null, 'GridPattern', { breakpoint: 'desktop' })
c.appendChild(g); g.layoutPositioning = 'ABSOLUTE'; g.rescale(1920 / 1440); g.x = 0; g.y = 0
const logo = await inst(c, 'Logo'); logo.rescale(2)
await text(c, 'Folio\nDesign System', 'Display/2XL', 'color/fg/default', { w: 1400 })
await text(c, 'Tokens, components, blocks and page templates for r-o-design.tech.\nSource of truth: tokens/**/*.json in portfolio-react · synced by scripts/figma.', 'Body/2XL', 'color/fg/muted', { w: 1100 })
const tags = box(c, { name: 'meta', dir: 'HORIZONTAL', gap: 'space/8' })
for (const t of ['DTCG 2025.10', 'Light / Dark', 'Desktop / Tablet / Mobile', `Updated ${new Date().toISOString().slice(0, 10)}`]) await inst(tags, 'Tag', null, { label: t })
await figma.setFileThumbnailNodeAsync(c)
return c.id
