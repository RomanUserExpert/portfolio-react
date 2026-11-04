// url=https://www.figma.com/design/bv5c2MSrdPo2d6nhNaOcLm/Folio-website?node-id=115-24742
// source=components/ui/Dot.tsx
// component=Dot
import figma from 'figma'
const instance = figma.selectedInstance

// 'active' is a VARIANT with values "false" | "true", not a BOOLEAN property
const active = instance.getEnum('active', { false: false, true: true })

export default {
  example: figma.code`<Dot${active ? ' active' : ''} aria-label="Slide 1" />`,
  imports: ["import Dot from '@/components/ui/Dot'"],
  id: 'dot',
  metadata: { nestable: true },
}
