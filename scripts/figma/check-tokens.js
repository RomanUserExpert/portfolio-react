// Runs inside Figma through Figmosha. READ-ONLY full comparison of Figma variables and styles with the spec
// from tokens-spec.mjs: every variable in every mode (literal or alias target), scopes, code syntax, hidden flag,
// plus text and effect styles. Catches what the CI stamp cannot: hand edits made in Figma.
//
//   npm run figma:check-tokens
//   (= npm run figma:spec && scripts/figma/run.sh scripts/figma/check-tokens.js --set SPEC=@.figma-spec.json)
//
// Fix any mismatch by changing tokens/*.json (the source of truth) or by re-running sync-tokens.js.

const issues = []
const eq = (a, b, eps = 0.002) => Math.abs(a - b) <= eps
const sameColor = (a, b) => ['r', 'g', 'b', 'a'].every((k) => eq(a[k] ?? 1, b[k] ?? 1))
const fmt = (v) => (v && typeof v === 'object' && 'r' in v ? `rgba(${['r', 'g', 'b'].map((k) => Math.round(v[k] * 255)).join(',')},${+(v.a ?? 1).toFixed(2)})` : JSON.stringify(v))

const collections = await figma.variables.getLocalVariableCollectionsAsync()
const local = await figma.variables.getLocalVariablesAsync()
const byId = new Map(local.map((v) => [v.id, v]))
const collName = new Map(collections.map((c) => [c.id, c.name]))

for (const c of SPEC.collections) {
  const coll = collections.find((x) => x.name === c.name)
  if (!coll) { issues.push(`collection ${c.name}: missing`); continue }
  const modes = coll.modes.map((m) => m.name)
  if (modes.join('/') !== c.modes.join('/')) issues.push(`collection ${c.name}: modes ${modes.join('/')} ≠ ${c.modes.join('/')}`)
  const inColl = local.filter((v) => v.variableCollectionId === coll.id)
  const names = new Set(c.vars.map((s) => s.name))
  for (const v of inColl) if (!names.has(v.name)) issues.push(`${c.name}:${v.name}: in Figma, not in tokens (stale)`)

  for (const s of c.vars) {
    const id = `${c.name}:${s.name}`
    const v = inColl.find((x) => x.name === s.name)
    if (!v) { issues.push(`${id}: missing in Figma`); continue }
    if (v.resolvedType !== s.type) { issues.push(`${id}: type ${v.resolvedType} ≠ ${s.type}`); continue }
    if ([...v.scopes].sort().join() !== [...s.scopes].sort().join()) issues.push(`${id}: scopes [${v.scopes}] ≠ [${s.scopes}]`)
    if (v.codeSyntax.WEB !== s.code) issues.push(`${id}: code syntax ${v.codeSyntax.WEB} ≠ ${s.code}`)
    if (v.hiddenFromPublishing !== !!s.hidden) issues.push(`${id}: hidden ${v.hiddenFromPublishing} ≠ ${!!s.hidden}`)
    for (const m of c.modes) {
      const mode = coll.modes.find((x) => x.name === m)
      if (!mode) continue
      const want = s.values[m]
      const have = v.valuesByMode[mode.modeId]
      if (want && want.alias) {
        const target = have && have.type === 'VARIABLE_ALIAS' ? byId.get(have.id) : null
        const got = target ? `${collName.get(target.variableCollectionId)}:${target.name}` : `literal ${fmt(have)}`
        if (got !== `${want.collection}:${want.alias}`) issues.push(`${id} [${m}]: → ${got} ≠ → ${want.collection}:${want.alias}`)
      } else if (have && have.type === 'VARIABLE_ALIAS') {
        issues.push(`${id} [${m}]: alias → ${byId.get(have.id)?.name} ≠ literal ${fmt(want)}`)
      } else if (s.type === 'COLOR' ? !sameColor(have, want) : s.type === 'FLOAT' ? !eq(have, want, 0.001) : have !== want) {
        issues.push(`${id} [${m}]: ${fmt(have)} ≠ ${fmt(want)}`)
      }
    }
  }
}

const varName = (alias) => { const v = alias && byId.get(alias.id); return v ? `${collName.get(v.variableCollectionId)}:${v.name}` : 'none' }

const textStyles = await figma.getLocalTextStylesAsync()
for (const t of SPEC.textStyles) {
  const st = textStyles.find((x) => x.name === t.name)
  const id = `text style ${t.name}`
  if (!st) { issues.push(`${id}: missing`); continue }
  if (st.fontName.family !== t.family || st.fontName.style !== t.style) issues.push(`${id}: font ${st.fontName.family} ${st.fontName.style} ≠ ${t.family} ${t.style}`)
  if (!eq(st.fontSize, t.size, 0.01)) issues.push(`${id}: size ${st.fontSize} ≠ ${t.size}`)
  if (st.lineHeight.unit !== 'PERCENT' || !eq(st.lineHeight.value, t.lineHeightPercent, 0.05)) issues.push(`${id}: line-height ${JSON.stringify(st.lineHeight)} ≠ ${t.lineHeightPercent}%`)
  if (st.letterSpacing.unit !== 'PERCENT' || !eq(st.letterSpacing.value, t.letterSpacingPercent, 0.05)) issues.push(`${id}: letter-spacing ${JSON.stringify(st.letterSpacing)} ≠ ${t.letterSpacingPercent}%`)
  if (st.textCase !== t.textCase) issues.push(`${id}: case ${st.textCase} ≠ ${t.textCase}`)
  const bv = st.boundVariables ?? {}
  if (varName(bv.fontSize) !== `${t.sizeVar.collection}:${t.sizeVar.name}`) issues.push(`${id}: size bound to ${varName(bv.fontSize)} ≠ ${t.sizeVar.collection}:${t.sizeVar.name}`)
  if (varName(bv.fontFamily) !== `${t.familyVar.collection}:${t.familyVar.name}`) issues.push(`${id}: family bound to ${varName(bv.fontFamily)} ≠ ${t.familyVar.collection}:${t.familyVar.name}`)
}

const effectStyles = await figma.getLocalEffectStylesAsync()
for (const e of SPEC.effectStyles) {
  const st = effectStyles.find((x) => x.name === e.name)
  const id = `effect style ${e.name}`
  if (!st) { issues.push(`${id}: missing`); continue }
  const fx = st.effects[0]
  if (!fx || fx.type !== 'DROP_SHADOW') { issues.push(`${id}: not a drop shadow`); continue }
  if (fx.offset.x !== e.x || fx.offset.y !== e.y || fx.radius !== e.blur || (fx.spread ?? 0) !== e.spread) {
    issues.push(`${id}: ${fx.offset.x}/${fx.offset.y} blur ${fx.radius} spread ${fx.spread} ≠ ${e.x}/${e.y} blur ${e.blur} spread ${e.spread}`)
  }
  if (varName(fx.boundVariables?.color) !== `${e.colorVar.collection}:${e.colorVar.name}`) issues.push(`${id}: color bound to ${varName(fx.boundVariables?.color)} ≠ ${e.colorVar.collection}:${e.colorVar.name}`)
}

const checked = SPEC.collections.reduce((n, c) => n + c.vars.length, 0)
return issues.length
  ? `✗ ${issues.length} mismatch(es) between tokens/*.json and Figma\n` + issues.map((i) => `  ${i}`).join('\n')
  : `✓ Figma matches tokens/*.json: ${checked} variables, ${SPEC.textStyles.length} text styles, ${SPEC.effectStyles.length} effect styles`
