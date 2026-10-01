import { useCallback, useEffect, useMemo, useState } from 'react'
import { Quiz } from './components/Quiz'
import { Resultados } from './components/Resultados'
import { Comparar } from './components/Comparar'
import { Perfil } from './components/Perfil'
import { Ctx, type Contexto } from './lib/contexto'
import type { Respostas } from './lib/match'
import { TSE_GERADO_EM, UF } from './lib/match'
import { TEMAS, type Escopo } from './data/temas'
import './App.css'

type Etapa = 'inicio' | 'quiz' | 'resultado' | 'comparar'
const CHAVE = 'meu-voto-2026:respostas'
const CHAVE_FAV = 'meu-voto-2026:favoritos'

function carregarFavoritos(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(CHAVE_FAV) ?? '[]')
    return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []
  } catch {
    return []
  }
}

const IDS = new Set(TEMAS.map((t) => t.id))

/** Descarta respostas de temas que saíram do quiz. */
function carregar(): Respostas {
  try {
    const salvas: Respostas = JSON.parse(localStorage.getItem(CHAVE) ?? '{}')
    return Object.fromEntries(Object.entries(salvas).filter(([id]) => IDS.has(id)))
  } catch {
    return {}
  }
}

type Bloco = Escopo | 'todos'
const nTemas = (e: Escopo) => TEMAS.filter((t) => t.escopo === e).length

export default function App() {
  const [respostas, setRespostas] = useState<Respostas>(carregar)
  const [etapa, setEtapa] = useState<Etapa>(() => (Object.keys(carregar()).length ? 'resultado' : 'inicio'))
  const [bloco, setBloco] = useState<Bloco>('todos')
  const temasDoBloco = useMemo(() => (bloco === 'todos' ? TEMAS : TEMAS.filter((t) => t.escopo === bloco)), [bloco])
  const comecar = (b: Bloco) => {
    setBloco(b)
    setEtapa('quiz')
  }

  const [favoritos, setFavoritos] = useState<string[]>(carregarFavoritos)
  const [perfil, setPerfil] = useState<string | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE_FAV, JSON.stringify(favoritos))
    } catch {
      /* segue sem salvar */
    }
  }, [favoritos])

  const alternarFavorito = useCallback(
    (sq: string) => setFavoritos((f) => (f.includes(sq) ? f.filter((x) => x !== sq) : [...f, sq])),
    [],
  )
  const contexto = useMemo<Contexto>(
    () => ({
      favoritos,
      ehFavorito: (sq) => favoritos.includes(sq),
      alternarFavorito,
      abrirPerfil: setPerfil,
    }),
    [favoritos, alternarFavorito],
  )

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(respostas))
    } catch {
      /* navegação privada: segue sem salvar */
    }
  }, [respostas])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [etapa])

  return (
    <Ctx.Provider value={contexto}>
    <div className="app">
      <header className="topo">
        <button className="marca" onClick={() => setEtapa('inicio')}>
          Meu Voto <span>2026</span>
        </button>
        <nav className="topo-nav">
          <button className={`link ${etapa === 'comparar' ? 'atual' : ''}`} onClick={() => setEtapa('comparar')}>
            ★ Favoritos ({favoritos.length})
          </button>
          <span className="uf">Brasil · {UF}</span>
        </nav>
      </header>

      {etapa === 'inicio' && (
        <main className="inicio">
          <h1>Compare suas opiniões com as dos candidatos</h1>
          <p className="lead">
            Diga o que você pensa sobre temas nacionais e de {UF}. O app compara suas respostas com as posições que os candidatos
            a Presidente, Governador e Senador de {UF} registraram nos planos de governo entregues ao TSE ou declararam
            publicamente. Toda posição mostra a fonte.
          </p>
          <ul className="regras">
            <li>
              <strong>Não é recomendação de voto.</strong> O resultado mostra só em quais temas você concorda ou discorda
              de cada candidato.
            </li>
            <li>
              <strong>Quem tem pouco dado aparece separado.</strong> Muitos planos não falam de todos os temas, e o app não
              completa lacunas por suposição.
            </li>
            <li>
              <strong>Deputados</strong> ({UF}): a lista oficial do TSE vem com uma estimativa de afinidade pelo partido e,
              para quem já é deputado, o voto na PEC da 6x1.
            </li>
            <li>Suas respostas ficam só neste navegador.</li>
          </ul>
          <p className="lead">O que você quer comparar?</p>
          <div className="acoes">
            <button className="primario" onClick={() => comecar('nacional')}>
              Presidente e Senado ({nTemas('nacional')} temas)
            </button>
            <button className="primario" onClick={() => comecar('estadual')}>
              Governador ({nTemas('estadual')} temas)
            </button>
            <button onClick={() => comecar('todos')}>Tudo ({TEMAS.length} temas)</button>
            {Object.keys(respostas).length > 0 && (
              <button className="link" onClick={() => setEtapa('resultado')}>
                Ver resultado
              </button>
            )}
          </div>
          <p className="nota">
            Candidaturas: base oficial do TSE (gerada em {new Date(TSE_GERADO_EM + 'T12:00').toLocaleDateString('pt-BR')}).
            Posições levantadas em 29/09/2026. 1º turno: 4 de outubro de 2026.
          </p>
        </main>
      )}

      {etapa === 'quiz' && (
        <Quiz key={bloco} temas={temasDoBloco} respostas={respostas} onChange={setRespostas} onFim={() => setEtapa('resultado')} />
      )}

      {etapa === 'resultado' && (
        <Resultados
          respostas={respostas}
          onRefazer={() => comecar('todos')}
          onLimpar={() => {
            setRespostas({})
            setEtapa('inicio')
          }}
        />
      )}

      {etapa === 'comparar' && <Comparar respostas={respostas} />}

      {perfil && <Perfil sq={perfil} respostas={respostas} onFechar={() => setPerfil(null)} />}

      <footer className="rodape">
        <p>
          Projeto independente, sem vínculo com partidos, candidatos ou com o TSE. Não é recomendação de voto. Suas
          respostas ficam só no seu navegador e não são enviadas a nenhum servidor.
        </p>
        <p>
          Dados:{' '}
          <a href="https://dadosabertos.tse.jus.br/dataset/candidatos-2026" target="_blank" rel="noreferrer">
            TSE Dados Abertos
          </a>{' '}
          e as fontes citadas em cada posição. Viu um erro? Confira o plano completo no{' '}
          <a href="https://divulgacandcontas.tse.jus.br/" target="_blank" rel="noreferrer">
            DivulgaCandContas
          </a>
          .
        </p>
      </footer>
    </div>
    </Ctx.Provider>
  )
}
