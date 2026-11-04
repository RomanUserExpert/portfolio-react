#!/usr/bin/env node
// Finds where design and code drift apart (Figma components, tokens, Code Connect templates), so nothing goes stale silently.
//
//   node scripts/figma/check-drift.mjs            report, exit 1 on drift
//   node scripts/figma/check-drift.mjs --comment  also pin a comment on each stale component in Figma
//                                                 (and delete it once the drift is gone)
//   node scripts/figma/check-drift.mjs --report <file.md>  also write a Markdown report (the CI GitHub issue body)
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
//   snippets  the Code Connect template itself: every instance.getString/getBoolean/getEnum property must exist
//             in Figma, and every getEnum must map exactly the Figma variant options (else: undefined in Dev Mode)
//   tokens    hash of the token spec (scripts/figma/tokens-spec.mjs) vs the newest "tokens-sync <hash>" version in
//             the file's history, saved by sync-tokens.js. Catches "tokens changed, sync not run". It cannot see hand
//             edits in Figma: variables over REST need an Enterprise-only scope, so the full value-by-value comparison
//             runs locally through Figmosha (npm run figma:check-tokens). Target node: figma/drift.config.json.
//
// Per-template opt-out with a reason: `// drift-ignore=state:hover  <why>` (also variant:value, prop:name)
//
// Needs FIGMA_ACCESS_TOKEN (scopes: file_content:read, file_versions:read, file_comments:write for --comment).

import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
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

// Figma's REST API can stall for minutes right after a large edit (e.g. a token sync touching every variable):
// time out each call and retry, so CI fails with a clear message instead of hanging until the job limit.
const TIMEOUT_MS = 45_000
const RETRIES = [10_000, 30_000, 60_000]

async function figma(path, init = {}) {
  const url = path.startsWith('http') ? path : API + path
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, {
        ...init,
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { 'X-Figma-Token': token, 'Content-Type': 'application/json', ...init.headers },
      })
      const body = await res.text()
      if (res.status === 429 || res.status >= 500) throw new Error(`HTTP ${res.status}`)
      if (!res.ok) throw Object.assign(new Error(`Figma ${init.method ?? 'GET'} ${path} → ${res.status}: ${body.slice(0, 200)}`), { fatal: true })
      return body ? JSON.parse(body) : {}
    } catch (e) {
      if (e.fatal || attempt >= RETRIES.length) {
        throw e.fatal ? e : new Error(`Figma ${init.method ?? 'GET'} ${path} failed after ${attempt + 1} tries (${e.name === 'TimeoutError' ? `no answer in ${TIMEOUT_MS / 1000}s` : e.message}). Figma may still be processing a large edit: re-run the job in a few minutes.`)
      }
      console.error(`  figma api: ${e.name === 'TimeoutError' ? 'timeout' : e.message} on ${path}, retrying in ${RETRIES[attempt] / 1000}s`)
      await new Promise((r) => setTimeout(r, RETRIES[attempt]))
    }
  }
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
    return { template: `figma/${f}`, templateSrc: src, component, source, url, fileKey: m[1], nodeId: m[2].replace('-', ':'), ignore }
  })
}

function readTokensTarget() {
  const file = join(ROOT, 'figma', 'drift.config.json')
  if (!existsSync(file)) return null
  const { tokens } = JSON.parse(readFileSync(file, 'utf8'))
  if (!tokens) return null
  const m = tokens.url.match(/figma\.com\/(?:design|file)\/([^/]+)\/.*node-id=([\d-]+)/)
  if (!m) throw new Error(`figma/drift.config.json: can't read file key and node-id from ${tokens.url}`)
  return {
    component: 'Tokens', template: 'tokens/*.json', source: tokens.spec, url: tokens.url, fileKey: m[1], nodeId: m[2].replace('-', ':'),
    fix: 'Fix: npm run figma:sync-tokens (syncs variables/styles and saves a new "tokens-sync <hash>" version), then npm run figma:check-tokens.',
  }
}

async function tokensIssues(t) {
  const spec = JSON.parse(execFileSync(process.execPath, [join(ROOT, t.source)], { encoding: 'utf8', maxBuffer: 32 << 20 }))
  if (!spec.hash) return [`${t.source} emits no hash`]
  // newest first; the stamp is usually on the first page, but other saves can push it further
  let page = `/files/${t.fileKey}/versions`
  for (let i = 0; page && i < 10; i++) {
    const { versions, pagination } = await figma(page)
    const stamp = versions.find((v) => /^tokens-sync [0-9a-f]+$/.test(v.label ?? ''))
    if (stamp) {
      const synced = stamp.label.split(' ')[1]
      return synced === spec.hash ? [] : [`tokens/*.json changed since the last sync: Figma has tokens-sync ${synced} (${stamp.created_at.slice(0, 10)}), the code is ${spec.hash}`]
    }
    page = pagination?.next_page ?? null
  }
  return ['no "tokens-sync <hash>" version in the file history: tokens were never synced by sync-tokens.js']
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
  return [...issues, ...templateIssues(t, props)]
}

// The Code Connect template itself vs the Figma component: every property it reads must exist, and every
// getEnum must map exactly the Figma variant options (an unmapped option renders `undefined` in the snippet).
// Only `instance.get…` calls count: nested ones like `tag.getString('label')` read a child component.
const CC = 'Code Connect:'
function templateIssues(t, props) {
  const issues = []
  const src = t.templateSrc.replace(/\/\/.*$/gm, '')
  const where = `\`${t.template}\``
  for (const [, kind, name, body] of src.matchAll(/instance\.get(String|Boolean|Enum|InstanceSwap)\(\s*'([^']+)'(?:\s*,\s*\{([^}]*)\})?/g)) {
    const fig = props[name]
    const want = { String: 'TEXT', Boolean: 'BOOLEAN', Enum: 'VARIANT', InstanceSwap: 'INSTANCE_SWAP' }[kind]
    if (!fig) { issues.push(`${CC} ${where} reads \`${name}\`, the Figma component has no such property`); continue }
    if (fig.type !== want) { issues.push(`${CC} ${where} reads \`${name}\` as ${want}, in Figma it is ${fig.type}`); continue }
    if (kind !== 'Enum' || body === undefined) continue
    const keys = [...body.matchAll(/(?:^|,)\s*(?:'([^']+)'|"([^"]+)"|([\w$-]+))\s*:/g)].map((x) => x[1] ?? x[2] ?? x[3])
    const missing = fig.variantOptions.filter((o) => !keys.includes(o))
    const extra = keys.filter((k) => !fig.variantOptions.includes(k))
    if (missing.length) issues.push(`${CC} ${where} maps \`${name}\` without ${missing.map((o) => `\`${o}\``).join(', ')}: the snippet renders undefined there`)
    if (extra.length) issues.push(`${CC} ${where} maps \`${name}\`=${extra.map((o) => `\`${o}\``).join(', ')}, which Figma no longer has`)
  }
  return issues
}

function fixFor(t, issues) {
  if (t.fix) return t.fix
  const design = issues.some((i) => !i.startsWith(CC))
  const cc = issues.some((i) => i.startsWith(CC))
  return [
    design && `Fix: add it to scripts/figma/build-components.js (patch the live set in place to keep ids), update ${t.template}.`,
    cc && `Fix: update ${t.template}; the Code Connect workflow publishes it on push to main.`,
  ].filter(Boolean).join('\n')
}

// ---------- Figma comments ----------

function commentText(t, issues) {
  return [
    `${COMMENT_TAG} · ${t.component}`,
    ...issues.map((i) => `• ${i}`),
    fixFor(t, issues),
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

// Exit codes: 0 in sync · 1 drift · 2 could not check (config or Figma API error). CI opens an issue only on 1.
async function main() {
const templates = readTemplates()
const tokens = readTokensTarget()
const byFile = Map.groupBy(templates, (t) => t.fileKey)
if (tokens && !byFile.has(tokens.fileKey)) byFile.set(tokens.fileKey, [])
let drift = 0
const stale = [] // { t, issues } for the Markdown report

for (const [fileKey, ts] of byFile) {
  const ids = [...ts.map((t) => t.nodeId), ...(tokens?.fileKey === fileKey ? [tokens.nodeId] : [])]
  const { nodes } = await figma(`/files/${fileKey}/nodes?depth=1&ids=${ids.join(',')}`)
  const missing = (t) => `Figma node ${t.nodeId} not found: was the page rebuilt? Update the url in ${t.template === 'tokens/*.json' ? 'figma/drift.config.json' : t.template}`
  const results = ts.map((t) => {
    const node = nodes[t.nodeId]?.document
    if (!node) return { t, issues: [missing(t)] }
    return { t, issues: diff(t, node.componentPropertyDefinitions) }
  })
  if (tokens?.fileKey === fileKey) {
    results.push({ t: tokens, issues: nodes[tokens.nodeId]?.document ? await tokensIssues(tokens) : [missing(tokens)] })
  }

  for (const { t, issues } of results.sort((a, b) => a.t.component.localeCompare(b.t.component))) {
    if (!issues.length) { console.log(`✓ ${t.component}`); continue }
    drift++
    stale.push({ t, issues })
    console.log(`✗ ${t.component}  (${t.source} ↔ ${t.url})`)
    for (const i of issues) console.log(`    ${i}`)
  }

  if (args.has('--comment')) for (const line of await syncComments(fileKey, results)) console.log(`  figma: ${line}`)
}

const scope = `${templates.length} components${tokens ? ' + tokens' : ''}`
console.log(drift ? `\n${drift} item(s) out of date in Figma (checked ${scope})` : `\nFigma is in sync with the code (${scope})`)

const reportAt = process.argv.indexOf('--report')
if (reportAt > -1) {
  const lines = drift
    ? [
        `Design and code are out of sync in **${drift}** item(s) (checked ${scope}): Figma components, tokens or Code Connect templates.`,
        '',
        ...stale.flatMap(({ t, issues }) => [
          `### ${t.component}`,
          `[Open in Figma](${t.url}) · code: \`${t.source}\``,
          '',
          ...issues.map((i) => `- ${i}`),
          '',
          ...fixFor(t, issues).split(/\n/).map((l) => l.replace(/^Fix: /, '**Fix:** ')),
          '',
        ]),
        '_Opened and kept up to date by `scripts/figma/check-drift.mjs` (workflow Figma drift); closed automatically once Figma catches up._',
      ]
    : [`Figma is in sync with the code (${scope}).`]
  writeFileSync(process.argv[reportAt + 1], lines.join('\n') + '\n')
}
return drift
}

// exitCode, not exit(): exiting with fetch sockets still open trips a libuv assertion on Windows
main().then(
  (drift) => { process.exitCode = drift ? 1 : 0 },
  (e) => { console.error(`check-drift could not run: ${e.message}`); process.exitCode = 2 },
)
