// url=https://www.figma.com/design/bv5c2MSrdPo2d6nhNaOcLm/Folio-website?node-id=115-24120
// source=components/ui/Button.tsx
// component=Button
import figma from 'figma'
const instance = figma.selectedInstance

const label = instance.getString('label')
const variant = instance.getEnum('variant', {
  primary: 'primary',
  ghost: 'ghost',
})
// hover / focus / active are CSS-only; disabled is a real <button> attribute (and rules out href);
// loading is a Button prop
const flag = instance.getEnum('state', {
  default: '',
  hover: '',
  focus: '',
  active: '',
  disabled: ' disabled',
  loading: ' loading',
})

export default {
  example: figma.code`<Button${variant === 'ghost' ? ' variant="ghost"' : ''}${flag}>${label}</Button>`,
  imports: ["import Button from '@/components/ui/Button'"],
  id: 'button',
  metadata: { nestable: true },
}
