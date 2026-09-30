import type { Resposta } from './match'

export const OPCOES: { v: Resposta['v']; rotulo: string }[] = [
  { v: -2, rotulo: 'Discordo totalmente' },
  { v: -1, rotulo: 'Discordo' },
  { v: 0, rotulo: 'Neutro' },
  { v: 1, rotulo: 'Concordo' },
  { v: 2, rotulo: 'Concordo totalmente' },
]

/** Como a posição de um candidato é descrita (3ª pessoa). */
export const ROTULO_CANDIDATO: Record<number, string> = {
  [-2]: 'Discorda totalmente',
  [-1]: 'Discorda',
  [1]: 'Concorda',
  [2]: 'Concorda totalmente',
}
