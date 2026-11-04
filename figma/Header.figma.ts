// url=https://www.figma.com/design/bv5c2MSrdPo2d6nhNaOcLm/Folio-website?node-id=115-24850
// source=components/layout/Header.tsx
// component=Header
import figma from 'figma'

// 'breakpoint' (desktop | mobile) and 'scrolled' are runtime states (CSS media query, scroll listener):
// Header takes no props in code.

export default {
  example: figma.code`<Header />`,
  imports: ["import Header from '@/components/layout/Header'"],
  id: 'header',
  metadata: { nestable: true },
}
