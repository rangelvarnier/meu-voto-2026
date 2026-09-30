import { useEffect, useState } from 'react'
import { Quiz } from './components/Quiz'
import { Resultados } from './components/Resultados'
import type { Respostas } from './lib/match'
import { TSE_GERADO_EM, UF } from './lib/match'
import { TEMAS } from './data/temas'
import './App.css'

type Etapa = 'inicio' | 'quiz' | 'resultado'
const CHAVE = 'meu-voto-2026:respostas'

function carregar(): Respostas {
  try {
    return JSON.parse(localStorage.getItem(CHAVE) ?? '{}')
  } catch {
    return {}
  }
}

export default function App() {
  const [respostas, setRespostas] = useState<Respostas>(carregar)
  const [etapa, setEtapa] = useState<Etapa>(() => (Object.keys(carregar()).length ? 'resultado' : 'inicio'))

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
    <div className="app">
      <header className="topo">
        <button className="marca" onClick={() => setEtapa('inicio')}>
          Meu Voto <span>2026</span>
        </button>
        <span className="uf">Brasil · {UF}</span>
      </header>

      {etapa === 'inicio' && (
        <main className="inicio">
          <h1>Compare suas opiniões com as dos candidatos</h1>
          <p className="lead">
            Diga o que você pensa sobre {TEMAS.length} temas. O app compara suas respostas com as posições que os candidatos
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
          <div className="acoes">
            <button className="primario" onClick={() => setEtapa('quiz')}>
              {Object.keys(respostas).length ? 'Revisar respostas' : 'Começar'}
            </button>
            {Object.keys(respostas).length > 0 && (
              <button onClick={() => setEtapa('resultado')}>Ver resultado</button>
            )}
          </div>
          <p className="nota">
            Candidaturas: base oficial do TSE (gerada em {new Date(TSE_GERADO_EM + 'T12:00').toLocaleDateString('pt-BR')}).
            Posições levantadas em 29/09/2026. 1º turno: 4 de outubro de 2026.
          </p>
        </main>
      )}

      {etapa === 'quiz' && (
        <Quiz respostas={respostas} onChange={setRespostas} onFim={() => setEtapa('resultado')} />
      )}

      {etapa === 'resultado' && (
        <Resultados
          respostas={respostas}
          onRefazer={() => setEtapa('quiz')}
          onLimpar={() => {
            setRespostas({})
            setEtapa('inicio')
          }}
        />
      )}

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
  )
}
