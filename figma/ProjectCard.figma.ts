// url=https://www.figma.com/design/bv5c2MSrdPo2d6nhNaOcLm/Folio-website?node-id=115-24776
// source=components/project/ProjectCard.tsx
// component=ProjectCard
import figma from 'figma'
const instance = figma.selectedInstance

const title = instance.getString('title')
const description = instance.getString('description')
const showTag3 = instance.getBoolean('showTag3')
// 'state' (default | hover) is CSS-only: no prop in code.

// Tags are nested Tag instances (not component properties); the code wants plain strings,
// so read each Tag's own 'label' property.
function tagLabel(layer: string) {
  const tag = instance.findInstance(layer)
  if (tag && tag.type === 'INSTANCE') {
    return tag.getString('label')
  }
  return undefined
}
const tags = [tagLabel('tag1'), tagLabel('tag2'), showTag3 ? tagLabel('tag3') : undefined]
  .filter(Boolean)
  .map((t) => `'${t}'`)
  .join(', ')

// slug and cover have no Figma property: on the site cards get them from lib/projects.ts.
// slug follows the convention there (lowercased title); cover is a placeholder path.
const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '')

export default {
  example: figma.code`<ProjectCard
  slug="${slug}"
  title="${title}"
  tags={[${tags}]}
  description="${description}"
  cover="/cases/${title}/cover.png"
/>`,
  imports: ["import ProjectCard from '@/components/project/ProjectCard'"],
  id: 'project-card',
  metadata: { nestable: true },
}
