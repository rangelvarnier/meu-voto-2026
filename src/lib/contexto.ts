import { createContext, useContext } from 'react'

export interface Contexto {
  favoritos: string[]
  ehFavorito: (sq: string) => boolean
  alternarFavorito: (sq: string) => void
  abrirPerfil: (sq: string) => void
}

export const Ctx = createContext<Contexto | null>(null)

export function useApp(): Contexto {
  const c = useContext(Ctx)
  if (!c) throw new Error('useApp fora do provider')
  return c
}
