// url=https://www.figma.com/design/bv5c2MSrdPo2d6nhNaOcLm/Folio-website?node-id=115-24178
// source=components/ui/Tag.tsx
// component=Tag
import figma from 'figma'
const instance = figma.selectedInstance

const label = instance.getString('label')

export default {
  example: figma.code`<Tag label="${label}" />`,
  imports: ["import Tag from '@/components/ui/Tag'"],
  id: 'tag',
  metadata: { nestable: true },
}
