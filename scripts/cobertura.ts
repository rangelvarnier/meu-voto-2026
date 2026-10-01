/**
 * Relatório de cobertura das posições: quantos temas cada candidato majoritário tem com fonte
 * e quais faltam. Serve para priorizar a pesquisa da curadoria.
 *
 *   npm run cobertura
 */
import { readFileSync } from 'node:fs'
import { TEMAS } from '../src/data/temas.ts'
import { POSICOES, FORA_DA_DISPUTA } from '../src/data/posicoes.ts'

interface Cand { sq: string; cargo: string; nome: string; partido: string }
const tse = JSON.parse(readFileSync(new URL('../src/data/tse.json', import.meta.url), 'utf8')) as { candidatos: Cand[] }

const CARGOS = [
  ['presidente', 'nacional'],
  ['governador', 'estadual'],
  ['senador', 'nacional'],
] as const

let comTotal = 0
let possivel = 0
for (const [cargo, escopo] of CARGOS) {
  const temas = TEMAS.filter((t) => t.escopo === escopo)
  const cands = tse.candidatos.filter((c) => c.cargo === cargo && !FORA_DA_DISPUTA[c.sq])
  const linhas = cands
    .map((c) => {
      const pos = POSICOES[c.sq] ?? {}
      const faltando = temas.filter((t) => !pos[t.id])
      return { c, com: temas.length - faltando.length, faltando }
    })
    .sort((a, b) => a.com - b.com || a.c.nome.localeCompare(b.c.nome))

  const soma = linhas.reduce((s, l) => s + l.com, 0)
  comTotal += soma
  possivel += cands.length * temas.length
  console.log(`\n${cargo.toUpperCase()}: ${soma}/${cands.length * temas.length} (${Math.round((soma / (cands.length * temas.length)) * 100)}%)`)
  for (const l of linhas)
    console.log(`  ${String(l.com).padStart(2)}/${temas.length}  ${`${l.c.nome} (${l.c.partido})`.padEnd(34)} falta: ${l.faltando.map((t) => t.id).join(', ')}`)

  const porTema = temas.map((t) => ({ t, n: cands.filter((c) => POSICOES[c.sq]?.[t.id]).length })).sort((a, b) => a.n - b.n)
  console.log(`  Temas menos cobertos: ${porTema.slice(0, 5).map(({ t, n }) => `${t.id} ${n}/${cands.length}`).join(' · ')}`)
}
console.log(`\nTOTAL: ${comTotal}/${possivel} (${Math.round((comTotal / possivel) * 100)}%)`)
