// url=https://www.figma.com/design/bv5c2MSrdPo2d6nhNaOcLm/Folio-website?node-id=115-24796
// source=components/sections/ProcessRow.tsx
// component=ProcessRow
import figma from 'figma'
const instance = figma.selectedInstance

const num = instance.getString('num')
const title = instance.getString('title')
const description = instance.getString('description')
// 'breakpoint' (desktop | mobile) is a CSS media query: no prop in code.

export default {
  example: figma.code`<ProcessRow num="${num}" title="${title}" description="${description}" />`,
  imports: ["import ProcessRow from '@/components/sections/ProcessRow'"],
  id: 'process-row',
  metadata: { nestable: true },
}
