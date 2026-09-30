import { useApp } from '../lib/contexto'

export function Estrela({ sq, nome }: { sq: string; nome: string }) {
  const { ehFavorito, alternarFavorito } = useApp()
  const on = ehFavorito(sq)
  return (
    <button
      type="button"
      className={`estrela ${on ? 'on' : ''}`}
      aria-pressed={on}
      aria-label={on ? `Remover ${nome} dos favoritos` : `Favoritar ${nome} para comparar`}
      title={on ? 'Remover dos favoritos' : 'Favoritar para comparar'}
      onClick={() => alternarFavorito(sq)}
    >
      {on ? '★' : '☆'}
    </button>
  )
}
