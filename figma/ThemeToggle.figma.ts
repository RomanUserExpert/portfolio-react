// url=https://www.figma.com/design/bv5c2MSrdPo2d6nhNaOcLm/Folio-website?node-id=115-24714
// source=components/ui/ThemeToggle.tsx
// component=ThemeToggle
import figma from 'figma'

// 'theme' (light | dark) is read from <html data-theme> at runtime and 'state' is CSS-only:
// ThemeToggle takes no props in code.

export default {
  example: figma.code`<ThemeToggle />`,
  imports: ["import ThemeToggle from '@/components/ui/ThemeToggle'"],
  id: 'theme-toggle',
  metadata: { nestable: true },
}
