// url=https://www.figma.com/design/bv5c2MSrdPo2d6nhNaOcLm/Folio-website?node-id=115-24865
// source=components/project/Carousel.tsx
// component=Carousel
import figma from 'figma'

// Slides come from the case data (lib/projects.ts → project.images); Figma shows one sample slide.
// Arrows, expand and dots are rendered by Carousel itself (IconButton, Dot).

export default {
  example: figma.code`<Carousel images={project.images} />`,
  imports: ["import Carousel from '@/components/project/Carousel'"],
  id: 'carousel',
  metadata: { nestable: true },
}
