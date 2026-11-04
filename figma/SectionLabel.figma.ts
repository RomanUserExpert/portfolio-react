// url=https://www.figma.com/design/bv5c2MSrdPo2d6nhNaOcLm/Folio-website?node-id=115-24204
// source=components/ui/SectionLabel.tsx
// component=SectionLabel
import figma from 'figma'
const instance = figma.selectedInstance

const label = instance.getString('label')

export default {
  example: figma.code`<SectionLabel>${label}</SectionLabel>`,
  imports: ["import SectionLabel from '@/components/ui/SectionLabel'"],
  id: 'section-label',
  metadata: { nestable: true },
}
