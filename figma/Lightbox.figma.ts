// url=https://www.figma.com/design/bv5c2MSrdPo2d6nhNaOcLm/Folio-website?node-id=115-24882
// source=components/project/Lightbox.tsx
// component=Lightbox
import figma from 'figma'

// Opened by Carousel's expand button; all props are runtime state, none exist in Figma.

export default {
  example: figma.code`<Lightbox
  images={images}
  startIndex={current}
  onClose={() => setLightboxOpen(false)}
  onNavigate={setCurrent}
/>`,
  imports: ["import Lightbox from '@/components/project/Lightbox'"],
  id: 'lightbox',
  metadata: { nestable: true },
}
