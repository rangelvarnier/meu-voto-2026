import type { Resposta } from './match'

export const OPCOES: { v: Resposta['v']; rotulo: string }[] = [
  { v: -2, rotulo: 'Discordo totalmente' },
  { v: -1, rotulo: 'Discordo' },
  { v: 0, rotulo: 'Neutro' },
  { v: 1, rotulo: 'Concordo' },
  { v: 2, rotulo: 'Concordo totalmente' },
]
