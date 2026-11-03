// Runs inside Figma through Figmosha. Applies the spec from tokens-spec.mjs idempotently:
// finds collections, modes, variables and styles by name, updates them, creates what is missing.
// Nothing is deleted; variables in a collection that are not in the spec are reported as `stale`.
//
//   node scripts/figma/tokens-spec.mjs > .figma-spec.json
//   figmosha exec --file scripts/figma/sync-tokens.js --set SPEC=@.figma-spec.json
//
// SPEC is injected by Figmosha as a parsed object.

const report = { created: [], updated: 0, stale: [], textStyles: [], effectStyles: [] }

/* ── collections & modes ── */
const allCollections = await figma.variables.getLocalVariableCollectionsAsync()
const col = {}
for (const c of SPEC.collections) {
  let coll = allCollections.find((x) => x.name === c.name)
  if (!coll) { coll = figma.variables.createVariableCollection(c.name); report.created.push(`collection ${c.name}`) }
  c.modes.forEach((m, i) => {
    if (coll.modes[i]) { if (coll.modes[i].name !== m) coll.renameMode(coll.modes[i].modeId, m) }
    else coll.addMode(m)
  })
  col[c.name] = coll
}
const modeId = (cname, m) => col[cname].modes.find((x) => x.name === m).modeId

/* ── variables: two passes so aliases can point at variables created in this run ── */
const local = await figma.variables.getLocalVariablesAsync()
const vars = {} // "Collection:name" → Variable
for (const v of local) {
  const c = Object.values(col).find((x) => x.id === v.variableCollectionId)
  if (c) vars[`${c.name}:${v.name}`] = v
}
for (const c of SPEC.collections) {
  for (const s of c.vars) {
    const key = `${c.name}:${s.name}`
    let v = vars[key]
    if (v && v.resolvedType !== s.type) { v.remove(); v = undefined }
    if (!v) { v = figma.variables.createVariable(s.name, col[c.name], s.type); vars[key] = v; report.created.push(key) }
    else report.updated++
    v.scopes = s.scopes
    v.hiddenFromPublishing = !!s.hidden
    v.description = s.description || ''
    v.setVariableCodeSyntax('WEB', s.code)
  }
  const names = new Set(c.vars.map((s) => s.name))
  for (const k of Object.keys(vars)) {
    const [cn, n] = [k.slice(0, k.indexOf(':')), k.slice(k.indexOf(':') + 1)]
    if (cn === c.name && !names.has(n)) report.stale.push(k)
  }
}
for (const c of SPEC.collections) {
  for (const s of c.vars) {
    const v = vars[`${c.name}:${s.name}`]
    for (const m of c.modes) {
      const val = s.values[m]
      const target = val && val.alias ? vars[`${val.collection}:${val.alias}`] : null
      if (val && val.alias && !target) throw new Error(`${c.name}:${s.name} [${m}] → missing ${val.collection}:${val.alias}`)
      v.setValueForMode(modeId(c.name, m), target ? figma.variables.createVariableAlias(target) : val)
    }
  }
}

/* ── text styles ── */
const textStyles = await figma.getLocalTextStylesAsync()
for (const t of SPEC.textStyles) {
  let st = textStyles.find((x) => x.name === t.name)
  if (!st) { st = figma.createTextStyle(); st.name = t.name; report.created.push(`text ${t.name}`) }
  await figma.loadFontAsync({ family: t.family, style: t.style })
  st.fontName = { family: t.family, style: t.style }
  st.fontSize = t.size
  st.lineHeight = { unit: 'PERCENT', value: t.lineHeightPercent }
  st.letterSpacing = { unit: 'PERCENT', value: t.letterSpacingPercent }
  st.textCase = t.textCase
  st.description = t.description || ''
  st.setBoundVariable('fontSize', vars[`${t.sizeVar.collection}:${t.sizeVar.name}`])
  st.setBoundVariable('fontFamily', vars[`${t.familyVar.collection}:${t.familyVar.name}`])
  report.textStyles.push(t.name)
}

/* ── effect styles ── */
const effectStyles = await figma.getLocalEffectStylesAsync()
for (const e of SPEC.effectStyles) {
  let st = effectStyles.find((x) => x.name === e.name)
  if (!st) { st = figma.createEffectStyle(); st.name = e.name; report.created.push(`effect ${e.name}`) }
  const colorVar = vars[`${e.colorVar.collection}:${e.colorVar.name}`]
  const base = {
    type: 'DROP_SHADOW', visible: true, blendMode: 'NORMAL', showShadowBehindNode: false,
    color: { r: 0, g: 0, b: 0, a: 0.08 }, offset: { x: e.x, y: e.y }, radius: e.blur, spread: e.spread,
  }
  st.effects = [figma.variables.setBoundVariableForEffect(base, 'color', colorVar)]
  st.description = e.description || ''
  report.effectStyles.push(e.name)
}

return {
  collections: SPEC.collections.map((c) => `${c.name} [${c.modes.join('/')}] ${c.vars.length}`),
  created: report.created.length, createdSample: report.created.slice(0, 8),
  updated: report.updated, stale: report.stale,
  textStyles: report.textStyles.length, effectStyles: report.effectStyles,
}
