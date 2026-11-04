// url=https://www.figma.com/design/bv5c2MSrdPo2d6nhNaOcLm/Folio-website?node-id=115-24739
// source=components/ui/IconButton.tsx
// component=IconButton
import figma from 'figma'
const instance = figma.selectedInstance

const variant = instance.getEnum('variant', {
  surface: 'surface',
  'surface-square': 'surface-square',
  overlay: 'overlay',
})
// 'state' (default | hover) is CSS-only: no prop in code.

// surface / overlay draw a text glyph from the 'icon' property; surface-square holds the expand SVG
// (a frame, not a property), which lives inline in Carousel.tsx.
const icon = variant === 'surface-square' ? '' : instance.getString('icon')
// The button is icon-only, so aria-label is required: name it after the glyph the site uses.
const labels: Record<string, string> = { '→': 'Next', '←': 'Previous', '✕': 'Close' }
const ariaLabel = variant === 'surface-square' ? 'View fullscreen' : labels[icon] ?? icon

export default {
  example:
    variant === 'surface-square'
      ? figma.code`<IconButton variant="surface-square" aria-label="${ariaLabel}">
  {/* expand icon: inline SVG, see components/project/Carousel.tsx */}
</IconButton>`
      : figma.code`<IconButton variant="${variant}" aria-label="${ariaLabel}">${icon}</IconButton>`,
  imports: ["import IconButton from '@/components/ui/IconButton'"],
  id: 'icon-button',
  metadata: { nestable: true },
}
