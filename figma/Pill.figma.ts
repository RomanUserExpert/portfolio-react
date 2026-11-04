// url=https://www.figma.com/design/bv5c2MSrdPo2d6nhNaOcLm/Folio-website?node-id=115-24261
// source=components/ui/Pill.tsx
// component=Pill
import figma from 'figma'
const instance = figma.selectedInstance

const label = instance.getString('label')
// 'state' (default | hover) is CSS-only: no prop in code.

export default {
  example: figma.code`<Pill label="${label}" />`,
  imports: ["import Pill from '@/components/ui/Pill'"],
  id: 'pill',
  metadata: { nestable: true },
}
