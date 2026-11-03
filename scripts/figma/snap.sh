#!/usr/bin/env bash
# Exports a Figma node to PNG for a visual check. Figmosha caps a result at 64 KB,
# so the base64 comes back in chunks.
#   scripts/figma/snap.sh <node-id> <out.png> [scale=0.5]
set -euo pipefail
id="$1"; out="$2"; scale="${3:-0.5}"
FIGMOSHA_DIR="${FIGMOSHA_DIR:-E:/Work/Personal/Figmosha - general}"
export FIGMOSHA_SESSION="${FIGMOSHA_SESSION:-Folio website}"
PY="$FIGMOSHA_DIR/venv/Scripts/python.exe"
CLI="$FIGMOSHA_DIR/figmosha.py"
CHUNK=40000
b64=""
offset=0
while :; do
  part=$("$PY" "$CLI" exec -t 120 --raw --set-str "ID=$id" --set-json "SCALE=$scale" --set-json "OFF=$offset" --set-json "LEN=$CHUNK" \
    "const n = await h.node(ID); const b = await n.exportAsync({format:'PNG', constraint:{type:'SCALE', value:SCALE}}); const s = figma.base64Encode(b); return {total: s.length, part: s.slice(OFF, OFF + LEN)}" \
    | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s.slice(s.indexOf("{")));const r=j.value;process.stdout.write(r.total+" "+r.part)})')
  total="${part%% *}"
  b64+="${part#* }"
  offset=$((offset + CHUNK))
  [ "$offset" -lt "$total" ] || break
done
printf '%s' "$b64" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{require("fs").writeFileSync(process.argv[1],Buffer.from(s,"base64"));console.log("saved",process.argv[1])})' "$out"
