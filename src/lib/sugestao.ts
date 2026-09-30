import { ROTULO_CARGO, type Candidato } from './match'
import type { Tema } from '../data/temas'

const REPO = 'https://github.com/rangelvarnier/meu-voto-2026'

/**
 * Link para abrir uma issue no GitHub já preenchida com o candidato e o tema.
 * A curadoria confere a fonte antes de incluir a posição em `posicoes.ts`.
 */
export function urlSugerirFonte(c: Candidato, tema?: Tema) {
  const params = new URLSearchParams({
    template: 'posicao.yml',
    title: `Posição: ${c.nome} (${c.partido})${tema ? ` · ${tema.titulo}` : ''}`,
    candidato: `${c.nome} (${ROTULO_CARGO[c.cargo]}, ${c.partido}, nº ${c.numero}, SQ ${c.sq})`,
  })
  if (tema) params.set('tema', `${tema.titulo}: ${tema.afirmacao}`)
  return `${REPO}/issues/new?${params}`
}
