import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import lightColors from '../tokens/semantic/color.light.json'
import darkColors from '../tokens/semantic/color.dark.json'
import componentColors from '../tokens/semantic/component.light.json'
import primitiveColors from '../tokens/primitives/color.json'
import dimension from '../tokens/primitives/dimension.json'
import typography from '../tokens/semantic/typography.json'

// Renders straight from tokens/**/*.json; every swatch and sample uses the CSS variable, so the theme toolbar re-themes it.

type Tree = { [key: string]: unknown }
type Leaf = { path: string[]; token: { $value: unknown; $description?: string; $extensions?: Record<string, unknown> } }
function leaves(node: Tree, path: string[] = []): Leaf[] {
  if ('$value' in node) return [{ path, token: node as Leaf['token'] }]
  return Object.entries(node).flatMap(([k, v]) => (k.startsWith('$') || typeof v !== 'object' || v === null ? [] : leaves(v as Tree, [...path, k])))
}
const cssVar = (path: string[]) => `var(--${path.join('-')})`
const refToVar = (ref: unknown) => (typeof ref === 'string' && ref.startsWith('{') ? `var(--${ref.slice(1, -1).replace(/\./g, '-')})` : String(ref))
const hexOf = (v: unknown) => (typeof v === 'object' && v && 'hex' in v ? `${(v as { hex: string }).hex}${'alpha' in v ? ` · ${Math.round((v as { alpha: number }).alpha * 100)}%` : ''}` : String(v))

const page: React.CSSProperties = { display: 'grid', gap: 'var(--space-40)', padding: 'var(--space-40)', maxWidth: 1100, color: 'var(--color-fg-default)' }
const label: React.CSSProperties = { fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)' as never, color: 'var(--color-fg-default)' }
const muted: React.CSSProperties = { fontSize: 'var(--font-size-sm)', color: 'var(--color-fg-muted)' }
const H = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 600, letterSpacing: 'var(--font-letter-spacing-widest)', textTransform: 'uppercase', marginBottom: 'var(--space-16)' }}>{children}</h2>
)

function Swatch({ path, sub }: { path: string[]; sub?: string }) {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-12)', alignItems: 'center' }}>
      <div style={{ width: 40, height: 40, flexShrink: 0, borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-default)', background: cssVar(path) }} />
      <div>
        <div style={label}>{path.join('/')}</div>
        <div style={muted}>{sub}</div>
      </div>
    </div>
  )
}

function Colors() {
  const dark = new Map(leaves(darkColors as Tree).map((l) => [l.path.join('/'), l.token.$value]))
  return (
    <div style={page}>
      <section>
        <H>Semantic · color</H>
        <p style={{ ...muted, marginBottom: 'var(--space-16)' }}>Switch the theme in the toolbar: names stay, values follow tokens/semantic/color.{'{light,dark}'}.json.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-16)' }}>
          {leaves(lightColors as Tree).map((l) => (
            <Swatch key={l.path.join('/')} path={l.path} sub={`${String(l.token.$value)} · dark ${String(dark.get(l.path.join('/')))}`} />
          ))}
        </div>
      </section>
      <section>
        <H>Component · color</H>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-16)' }}>
          {leaves(componentColors as Tree).map((l) => <Swatch key={l.path.join('/')} path={l.path} sub={String(l.token.$value)} />)}
        </div>
      </section>
      <section>
        <H>Primitives · color</H>
        <p style={{ ...muted, marginBottom: 'var(--space-16)' }}>Raw values. Components never use these directly.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-16)' }}>
          {leaves(primitiveColors as Tree).map((l) => <Swatch key={l.path.join('/')} path={l.path} sub={hexOf(l.token.$value)} />)}
        </div>
      </section>
    </div>
  )
}

function Typography() {
  return (
    <div style={page}>
      <H>Text styles · tokens/semantic/typography.json</H>
      {leaves(typography as Tree).map(({ path, token }) => {
        const v = token.$value as Record<string, unknown>
        const ext = token.$extensions ?? {}
        const isHero = v.fontSize === '{layout.hero-font-size}'
        const style: React.CSSProperties = {
          fontFamily: refToVar(v.fontFamily),
          fontWeight: refToVar(v.fontWeight) as never,
          // layout.hero-font-size is Figma-only; the site uses the fluid clamp
          fontSize: isHero ? 'clamp(var(--font-size-display-xl), 9.9vw, var(--font-size-display-2xl))' : refToVar(v.fontSize),
          lineHeight: refToVar(v.lineHeight),
          letterSpacing: ext['tech.r-o-design.letter-spacing'] ? refToVar(ext['tech.r-o-design.letter-spacing']) : undefined,
          textTransform: ext['tech.r-o-design.text-transform'] === 'uppercase' ? 'uppercase' : undefined,
          color: 'var(--color-fg-default)',
        }
        return (
          <div key={path.join('/')} style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 'var(--space-24)', alignItems: 'baseline' }}>
            <div>
              <div style={label}>{path.slice(1).join('/')}</div>
              <div style={muted}>{token.$description}</div>
            </div>
            <div style={style}>{path[1] === 'display' ? 'Roman Ovcharenko' : 'Turning complex systems into clear, usable products.'}</div>
          </div>
        )
      })}
    </div>
  )
}

function Space() {
  const d = dimension as Tree
  return (
    <div style={page}>
      <section>
        <H>Space</H>
        {leaves(d.space as Tree, ['space']).map(({ path }) => (
          <div key={path.join('-')} style={{ display: 'flex', gap: 'var(--space-16)', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
            <span style={{ ...label, width: 80 }}>{path.join('/')}</span>
            <span style={{ height: 12, width: cssVar(path), background: 'var(--color-icon-accent)' }} />
          </div>
        ))}
      </section>
      <section>
        <H>Radius · Size · Shadow</H>
        <div style={{ display: 'flex', gap: 'var(--space-24)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          {leaves(d.radius as Tree, ['radius']).map(({ path }) => (
            <div key={path.join('-')} style={{ display: 'grid', gap: 'var(--space-8)', justifyItems: 'center' }}>
              <div style={{ width: 72, height: 72, borderRadius: cssVar(path), background: 'var(--color-bg-subtle)', border: '1px solid var(--color-border-strong)' }} />
              <span style={label}>{path.join('/')}</span>
            </div>
          ))}
          {leaves(d.size as Tree, ['size']).map(({ path }) => (
            <div key={path.join('-')} style={{ display: 'grid', gap: 'var(--space-8)', justifyItems: 'center' }}>
              <div style={{ width: cssVar(path), height: cssVar(path), borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-subtle)', border: '1px solid var(--color-border-strong)' }} />
              <span style={label}>{path.join('/')}</span>
            </div>
          ))}
          <div style={{ display: 'grid', gap: 'var(--space-8)', justifyItems: 'center' }}>
            <div style={{ padding: 'var(--space-24)', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-default)', border: '1px solid var(--color-border-default)', boxShadow: 'var(--shadow-raised)' }}>
              <span style={label}>shadow/raised</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

const meta: Meta = { title: 'Foundations', parameters: { layout: 'fullscreen' } }
export default meta
export const ColorTokens: StoryObj = { name: 'Colors', render: () => <Colors /> }
export const TypographyTokens: StoryObj = { name: 'Typography', render: () => <Typography /> }
export const SpaceRadiusSize: StoryObj = { name: 'Space · Radius · Size', render: () => <Space /> }
