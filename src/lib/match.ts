import tse from '../data/tse.json'
import { TEMAS, type Escopo } from '../data/temas'
import { POSICOES, FORA_DA_DISPUTA, VOTOS_6X1, FONTE_VOTOS_6X1, type Posicao } from '../data/posicoes'

export type Cargo = 'presidente' | 'governador' | 'senador' | 'deputado_federal' | 'deputado_estadual'

export interface Candidato {
  sq: string
  cargo: Cargo
  numero: string
  nome: string
  nomeCompleto: string
  partido: string
  federacao: string | null
  coligacao: string
  composicao: string
  ocupacao: string
  genero: string
  vice?: string
  nascimento?: string
  disputas?: Disputa[]
}

/** Eleição municipal anterior (vereador, prefeito ou vice), segundo o histórico do TSE. */
export interface Disputa {
  ano: number
  cargo: string
  cidade: string
  resultado: string
}

export const ROTULO_CARGO: Record<Cargo, string> = {
  presidente: 'Presidente',
  governador: 'Governador',
  senador: 'Senador',
  deputado_federal: 'Deputado Federal',
  deputado_estadual: 'Deputado Estadual',
}

export const CANDIDATOS = tse.candidatos as Candidato[]
const POR_SQ = new Map(CANDIDATOS.map((c) => [c.sq, c]))
export const candidatoPorSq = (sq: string) => POR_SQ.get(sq)
export const UF = tse.uf
export const TSE_GERADO_EM = tse.geradoEm

/** Resposta do eleitor: -2..2 (0 = neutro). Tema sem resposta = pulado. */
export interface Resposta {
  v: -2 | -1 | 0 | 1 | 2
  importante: boolean
}
export type Respostas = Record<string, Resposta>

export type Origem = 'proprio' | 'partido'
export interface PosicaoUsada extends Posicao {
  origem: Origem
}

export const MIN_TEMAS_COMPARADOS = 3

/**
 * Peso de "temas fictícios" a 50% somado a cada candidato. Evita que quem tem 2 ou 3
 * posições conhecidas passe à frente de quem tem 8 só por ter menos dados.
 */
export const PESO_NEUTRO = 2

export const ESCOPO_DO_CARGO: Record<'presidente' | 'governador' | 'senador', Escopo> = {
  presidente: 'nacional',
  senador: 'nacional',
  governador: 'estadual',
}

export const foraDaDisputa = (sq: string) => FORA_DA_DISPUTA[sq]

const presidenciaveis = CANDIDATOS.filter((c) => c.cargo === 'presidente' && !FORA_DA_DISPUTA[c.sq])
const PRESIDENCIAVEL_DO_PARTIDO = new Map(presidenciaveis.map((c) => [c.partido, c]))

export const presidenciavelDoPartido = (partido: string) => PRESIDENCIAVEL_DO_PARTIDO.get(partido)

/** Presidenciável do próprio partido ou, se não houver, o da coligação/federação que o partido integra. */
export const presidenciavelDaChapa = (partido: string) =>
  PRESIDENCIAVEL_DO_PARTIDO.get(partido) ?? presidenciaveis.find((c) => naChapa(c, partido))

/**
 * Posições de um candidato. Senadores sem posição própria num tema podem herdar,
 * se o eleitor permitir, a do presidenciável do mesmo partido, sempre marcada como "partido".
 */
export function posicoesDe(c: Candidato, usarPartido: boolean): Record<string, PosicaoUsada> {
  const out: Record<string, PosicaoUsada> = {}
  const proprias = POSICOES[c.sq] ?? {}
  for (const [tema, p] of Object.entries(proprias)) if (p) out[tema] = { ...p, origem: 'proprio' }

  // Voto registrado na Câmara vale como posição própria e com fonte
  const voto = VOTOS_6X1[c.sq]
  if (voto && voto !== 'AUSENTE' && !out.fim6x1) {
    out.fim6x1 = {
      v: voto === 'SIM' ? 2 : -2,
      trecho: `Votou ${voto} na PEC do fim da escala 6x1 (1º turno, 27/05/2026).`,
      fonte: FONTE_VOTOS_6X1,
      origem: 'proprio',
    }
  }

  if (usarPartido && c.cargo === 'senador') {
    const ref = PRESIDENCIAVEL_DO_PARTIDO.get(c.partido)
    const doPartido = ref ? POSICOES[ref.sq] ?? {} : {}
    for (const [tema, p] of Object.entries(doPartido)) {
      if (p && !out[tema]) out[tema] = { ...p, origem: 'partido' }
    }
  }
  return out
}

export interface Comparacao {
  temaId: string
  eleitor: Resposta
  candidato: PosicaoUsada
  concordancia: number // 0..1
}

export interface Resultado {
  candidato: Candidato
  afinidade: number | null // 0..100, ajustada por PESO_NEUTRO; null quando não há nada para comparar
  mediaSimples: number | null
  comparados: number
  respondidos: number
  comparacoes: Comparacao[]
}

export function calcular(c: Candidato, respostas: Respostas, usarPartido: boolean): Resultado {
  const escopo = ESCOPO_DO_CARGO[c.cargo as keyof typeof ESCOPO_DO_CARGO]
  const temas = TEMAS.filter((t) => t.escopo === escopo && respostas[t.id])
  const pos = posicoesDe(c, usarPartido)

  let soma = 0
  let pesos = 0
  const comparacoes: Comparacao[] = []
  for (const t of temas) {
    const r = respostas[t.id]
    const p = pos[t.id]
    if (!p) continue
    const concordancia = 1 - Math.abs(r.v - p.v) / 4
    const peso = r.importante ? 2 : 1
    soma += concordancia * peso
    pesos += peso
    comparacoes.push({ temaId: t.id, eleitor: r, candidato: p, concordancia })
  }
  return {
    candidato: c,
    afinidade: pesos ? Math.round(((soma + PESO_NEUTRO * 0.5) / (pesos + PESO_NEUTRO)) * 100) : null,
    mediaSimples: pesos ? Math.round((soma / pesos) * 100) : null,
    comparados: comparacoes.length,
    respondidos: temas.length,
    comparacoes,
  }
}

/** Separa quem tem dados suficientes de quem não tem, para que 1 tema em comum não lidere o ranking. */
export function ranking(cargo: 'presidente' | 'governador' | 'senador', respostas: Respostas, usarPartido: boolean) {
  const todos = CANDIDATOS.filter((c) => c.cargo === cargo && !FORA_DA_DISPUTA[c.sq]).map((c) =>
    calcular(c, respostas, usarPartido),
  )
  const ordena = (a: Resultado, b: Resultado) =>
    (b.afinidade ?? -1) - (a.afinidade ?? -1) || b.comparados - a.comparados || a.candidato.nome.localeCompare(b.candidato.nome)
  return {
    suficientes: todos.filter((r) => r.comparados >= MIN_TEMAS_COMPARADOS).sort(ordena),
    insuficientes: todos.filter((r) => r.comparados < MIN_TEMAS_COMPARADOS).sort(ordena),
  }
}

// ─── Deputados: estimativa pelo partido ─────────────────────────

const normalizaSigla = (s: string) => s.toUpperCase().replace(/PC DO B/g, 'PCDOB')

const siglas = (composicao: string) => new Set(normalizaSigla(composicao).split(/[^A-ZÀ-Ü0-9]+/).filter(Boolean))

const naChapa = (c: Candidato, partido: string) =>
  normalizaSigla(c.partido) === normalizaSigla(partido) || siglas(c.composicao).has(normalizaSigla(partido))

const governadores = () => CANDIDATOS.filter((c) => c.cargo === 'governador')

/** Governador cuja coligação inclui o partido do deputado (ou o próprio partido). */
export function governadorDoPartido(partido: string) {
  return governadores().find((g) => naChapa(g, partido))
}

export interface EstimativaPartido {
  afinidade: number | null
  presidente?: Resultado
  governador?: Resultado
}

export function estimativaPorPartido(partido: string, respostas: Respostas): EstimativaPartido {
  const pres = presidenciavelDaChapa(partido)
  const gov = governadorDoPartido(partido)
  const rp = pres ? calcular(pres, respostas, false) : undefined
  const rg = gov ? calcular(gov, respostas, false) : undefined
  const validos = [rp, rg].filter((r): r is Resultado => !!r && r.comparados >= MIN_TEMAS_COMPARADOS && r.afinidade != null)
  return {
    afinidade: validos.length ? Math.round(validos.reduce((s, r) => s + r.afinidade!, 0) / validos.length) : null,
    presidente: rp,
    governador: rg,
  }
}

// ─── Cidades (deputados) ────────────────────────────────────────

export const semAcento = (s: string) => s.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')

/** Cidades citadas nos dados de deputados (nascimento ou eleições municipais anteriores). */
export const CIDADES = [
  ...new Set(
    CANDIDATOS.filter((c) => c.cargo.startsWith('deputado')).flatMap((c) => [
      ...(c.nascimento ? [c.nascimento] : []),
      ...(c.disputas ?? []).map((d) => d.cidade),
    ]),
  ),
].sort((a, b) => a.localeCompare(b, 'pt-BR'))

export type CriterioCidade = 'ambos' | 'nascimento' | 'disputas'

export function ligadoACidade(c: Candidato, cidade: string, criterio: CriterioCidade) {
  const q = semAcento(cidade.trim())
  if (!q) return true
  const nasceu = !!c.nascimento && semAcento(c.nascimento) === q
  const disputou = (c.disputas ?? []).some((d) => semAcento(d.cidade) === q)
  return criterio === 'nascimento' ? nasceu : criterio === 'disputas' ? disputou : nasceu || disputou
}
