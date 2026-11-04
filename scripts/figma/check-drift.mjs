#!/usr/bin/env node
// Finds where Figma components lag behind the code, so Figma never silently goes stale.
//
//   node scripts/figma/check-drift.mjs            report, exit 1 on drift
//   node scripts/figma/check-drift.mjs --comment  also pin a comment on each stale component in Figma
//                                                 (and delete it once the drift is gone)
//
// Component pairs come from the Code Connect templates (figma/*.figma.ts: `// url=` and `// source=`),
// so there is no second list to keep in sync. Checks, code → Figma:
//   variants  string-literal unions in the component's props (variant?: 'primary' | 'ghost')
//             vs the Figma VARIANT property of the same name
//   states    :hover / :focus-visible / :active / :disabled in the component's .module.css
//             vs the options of the Figma `state` property
//   booleans  boolean props (loading?: boolean) vs a Figma property of the same name (BOOLEAN, or a
//             true/false VARIANT like Dot `active`) or a `state` option of that name (Button state=loading)
// Only what the code has and Figma lacks counts as drift. Figma-only properties (state, breakpoint,
// scrolled, theme) are design states without a prop and are expected.
// Not checked: tokens. The Figma variables REST API needs `file_variables:read`, an Enterprise-only scope.
//
// Per-template opt-out with a reason: `// drift-ignore=state:hover  <why>` (also variant:value, prop:name)
//
// Needs FIGMA_ACCESS_TOKEN (scopes: file_content:read, file_comments:write for --comment).

import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const API = 'https://api.figma.com/v1'
// Plain text on purpose: Figma stores emoji as shortcodes (⚠️ → ":warning:"), which breaks matching
const COMMENT_TAG = '[Figma drift]'
const OUR_COMMENT = /^(?::warning: Figma drift|\[Figma drift\]) · /
const STATE_OF = { hover: 'hover', 'focus-visible': 'focus', focus: 'focus', active: 'active', disabled: 'disabled' }

const args = new Set(process.argv.slice(2))
const token = process.env.FIGMA_ACCESS_TOKEN
if (!token) {
  console.error('FIGMA_ACCESS_TOKEN is not set: put it in .env.local and run `set -a; . ./.env.local; set +a` first (CI: repo secret FIGMA_ACCESS_TOKEN)')
  process.exit(2)
}

async function figma(path, init = {}) {
  const res = await fetch(API + path, { ...init, headers: { 'X-Figma-Token': token, 'Content-Type': 'application/json', ...init.headers } })
  const body = await res.text()
  if (!res.ok) throw new Error(`Figma ${init.method ?? 'GET'} ${path} → ${res.status}: ${body.slice(0, 200)}`)
  return body ? JSON.parse(body) : {}
}

// ---------- code side ----------

function readTemplates() {
  const dir = join(ROOT, 'figma')
  return readdirSync(dir).filter((f) => f.endsWith('.figma.ts')).map((f) => {
    const src = readFileSync(join(dir, f), 'utf8')
    const url = src.match(/^\/\/ url=(\S+)/m)?.[1]
    const source = src.match(/^\/\/ source=(\S+)/m)?.[1]
    const component = src.match(/^\/\/ component=(\S+)/m)?.[1]
    if (!url || !source || !component) throw new Error(`figma/${f}: needs // url=, // source= and // component= header lines`)
    const m = url.match(/figma\.com\/(?:design|file)\/([^/]+)\/.*node-id=([\d-]+)/)
    if (!m) throw new Error(`figma/${f}: can't read file key and node-id from ${url}`)
    const ignore = new Set([...src.matchAll(/^\/\/ drift-ignore=(\S+)/gm)].map((x) => x[1]))
    return { template: `figma/${f}`, component, source, url, fileKey: m[1], nodeId: m[2].replace('-', ':'), ignore }
  })
}

function codeVariants(source) {
  const tsx = readFileSync(join(ROOT, source), 'utf8')
  const out = {}
  for (const [, name, union] of tsx.matchAll(/(\w+)\??\s*:\s*((?:'[^']+'\s*\|\s*)+'[^']+')/g)) {
    out[name] = [...union.matchAll(/'([^']+)'/g)].map((x) => x[1])
  }
  return out
}

function codeBooleans(source) {
  const tsx = readFileSync(join(ROOT, source), 'utf8')
  return [...new Set([...tsx.matchAll(/(\w+)\??\s*:\s*boolean\b/g)].map((x) => x[1]))]
}

function codeStates(source) {
  const css = join(ROOT, source.replace(/\.tsx$/, '.module.css'))
  if (!existsSync(css)) return []
  const text = readFileSync(css, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
  return [...new Set([...text.matchAll(/:(hover|focus-visible|focus|active|disabled)\b/g)].map((x) => STATE_OF[x[1]]))]
}

// ---------- compare ----------

function diff(t, defs) {
  const props = Object.fromEntries(Object.entries(defs ?? {}).map(([k, v]) => [k.replace(/#.*$/, ''), v]))
  const issues = []

  for (const [name, values] of Object.entries(codeVariants(t.source))) {
    const fig = props[name]
    if (!fig) continue // a code-only union (e.g. Lightbox internals) has no design counterpart
    if (fig.type !== 'VARIANT') continue
    for (const v of values) {
      if (!fig.variantOptions.includes(v) && !t.ignore.has(`${name}:${v}`)) {
        issues.push(`\`${name}="${v}"\` exists in code, Figma \`${name}\` has only ${fig.variantOptions.join(' | ')}`)
      }
    }
  }

  const figStates = props.state?.type === 'VARIANT' ? props.state.variantOptions : null

  for (const name of codeBooleans(t.source)) {
    if (t.ignore.has(`prop:${name}`)) continue
    const fig = props[name]
    const asProperty = fig && (fig.type === 'BOOLEAN' || (fig.type === 'VARIANT' && fig.variantOptions.includes('true')))
    if (asProperty || figStates?.includes(name)) continue
    issues.push(`boolean prop \`${name}\` exists in code, Figma has neither a \`${name}\` property nor \`state=${name}\``)
  }

  const states = codeStates(t.source).filter((s) => !t.ignore.has(`state:${s}`))
  for (const s of states) {
    if (!figStates) issues.push(`CSS has :${s === 'focus' ? 'focus-visible' : s}, the Figma component has no \`state\` property`)
    else if (!figStates.includes(s)) issues.push(`CSS has :${s === 'focus' ? 'focus-visible' : s}, Figma \`state\` has only ${figStates.join(' | ')}`)
  }
  return issues
}

// ---------- Figma comments ----------

function commentText(t, issues) {
  return [
    `${COMMENT_TAG} · ${t.component}`,
    ...issues.map((i) => `• ${i}`),
    `Fix: add it to scripts/figma/build-components.js, rebuild Components/Blocks/Pages, update ${t.template} and run figma connect publish.`,
    '(auto: scripts/figma/check-drift.mjs, removed when fixed)',
  ].join('\n')
}

async function syncComments(fileKey, results) {
  const me = await figma('/me')
  const { comments } = await figma(`/files/${fileKey}/comments`)
  const ours = comments.filter((c) => c.user?.id === me.id && !c.parent_id && OUR_COMMENT.test(c.message ?? ''))
  const log = []
  for (const { t, issues } of results) {
    const existing = ours.filter((c) => c.client_meta?.node_id === t.nodeId)
    const want = issues.length ? commentText(t, issues) : null
    for (const c of existing) {
      if (c.message === want) continue
      await figma(`/files/${fileKey}/comments/${c.id}`, { method: 'DELETE' })
      log.push(`removed comment on ${t.component}`)
    }
    if (want && !existing.some((c) => c.message === want)) {
      await figma(`/files/${fileKey}/comments`, {
        method: 'POST',
        body: JSON.stringify({ message: want, client_meta: { node_id: t.nodeId, node_offset: { x: 0, y: 0 } } }),
      })
      log.push(`commented on ${t.component}`)
    }
  }
  return log
}

// ---------- main ----------

const templates = readTemplates()
const byFile = Map.groupBy(templates, (t) => t.fileKey)
let drift = 0

for (const [fileKey, ts] of byFile) {
  const { nodes } = await figma(`/files/${fileKey}/nodes?depth=1&ids=${ts.map((t) => t.nodeId).join(',')}`)
  const results = ts.map((t) => {
    const node = nodes[t.nodeId]?.document
    if (!node) return { t, issues: [`Figma node ${t.nodeId} not found: was Components rebuilt? Update the url in ${t.template}`] }
    return { t, issues: diff(t, node.componentPropertyDefinitions) }
  })

  for (const { t, issues } of results.sort((a, b) => a.t.component.localeCompare(b.t.component))) {
    if (!issues.length) { console.log(`✓ ${t.component}`); continue }
    drift++
    console.log(`✗ ${t.component}  (${t.source} ↔ ${t.url})`)
    for (const i of issues) console.log(`    ${i}`)
  }

  if (args.has('--comment')) for (const line of await syncComments(fileKey, results)) console.log(`  figma: ${line}`)
}

console.log(drift ? `\n${drift} component(s) out of date in Figma` : `\nFigma is in sync with the code (${templates.length} components)`)
// exitCode, not exit(): exiting with fetch sockets still open trips a libuv assertion on Windows
process.exitCode = drift ? 1 : 0
