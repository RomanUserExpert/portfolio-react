// url=https://www.figma.com/design/bv5c2MSrdPo2d6nhNaOcLm/Folio-website?node-id=115-24696
// source=components/ui/TextLink.tsx
// component=TextLink
import figma from 'figma'
const instance = figma.selectedInstance

const label = instance.getString('label')
const variant = instance.getEnum('variant', {
  nav: 'nav',
  muted: 'muted',
  accent: 'accent',
})
// 'state' (default | hover) is CSS-only: no prop in code.
// href has no Figma property: "#" marks where the destination goes.

export default {
  example: figma.code`<TextLink variant="${variant}" href="#">${label}</TextLink>`,
  imports: ["import TextLink from '@/components/ui/TextLink'"],
  id: 'text-link',
  metadata: { nestable: true },
}
