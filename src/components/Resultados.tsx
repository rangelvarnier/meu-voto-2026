import { useMemo, useState } from 'react'
import { TEMAS } from '../data/temas'
import { FORA_DA_DISPUTA } from '../data/posicoes'
import {
  CANDIDATOS,
  MIN_TEMAS_COMPARADOS,
  PESO_NEUTRO,
  UF,
  ranking,
  type Respostas,
  type Resultado,
} from '../lib/match'
import { OPCOES } from '../lib/opcoes'
import { Deputados } from './Deputados'

type Aba = 'presidente' | 'governador' | 'senador' | 'deputado_federal' | 'deputado_estadual'

const ABAS: { id: Aba; rotulo: string }[] = [
  { id: 'presidente', rotulo: 'Presidente' },
  { id: 'governador', rotulo: `Governador` },
  { id: 'senador', rotulo: 'Senado' },
  { id: 'deputado_federal', rotulo: 'Dep. Federal' },
  { id: 'deputado_estadual', rotulo: 'Dep. Estadual' },
]

const rotuloValor = (v: number) => OPCOES.find((o) => o.v === v)?.rotulo ?? '—'
const tema = (id: string) => TEMAS.find((t) => t.id === id)!

interface Props {
  respostas: Respostas
  onRefazer: () => void
  onLimpar: () => void
}

export function Resultados({ respostas, onRefazer, onLimpar }: Props) {
  const [aba, setAba] = useState<Aba>('presidente')
  const [usarPartido, setUsarPartido] = useState(false)
  const nRespostas = Object.keys(respostas).length

  return (
    <main className="resultados">
      <div className="cabecalho-res">
        <div>
          <h1>Seu resultado</h1>
          <p className="nota">
            {nRespostas} de {TEMAS.length} temas respondidos. A afinidade mede a concordância nos temas em que
            você e o candidato têm posição (temas marcados como importantes valem em dobro).
          </p>
        </div>
        <div className="acoes">
          <button onClick={onRefazer}>Editar respostas</button>
          <button className="link" onClick={onLimpar}>
            Apagar tudo
          </button>
        </div>
      </div>

      <nav className="abas" role="tablist">
        {ABAS.map((a) => (
          <button key={a.id} role="tab" aria-selected={aba === a.id} className={aba === a.id ? 'ativa' : ''} onClick={() => setAba(a.id)}>
            {a.rotulo}
          </button>
        ))}
      </nav>

      {aba === 'senador' && (
        <div className="aviso">
          <p>
            <strong>Em {UF}, duas vagas estão em disputa e você vota em dois nomes.</strong> Candidatos ao Senado não
            entregam plano de governo, então há pouca posição registrada.
          </p>
          <label className="importante">
            <input type="checkbox" checked={usarPartido} onChange={(e) => setUsarPartido(e.target.checked)} />
            Completar com o plano do presidenciável do mesmo partido (marcado como <em>do partido</em>). Atenção: isso favorece candidatos de partidos com presidenciável próprio.
          </label>
        </div>
      )}

      {(aba === 'presidente' || aba === 'governador' || aba === 'senador') && (
        <Ranking cargo={aba} respostas={respostas} usarPartido={usarPartido} />
      )}

      {(aba === 'deputado_federal' || aba === 'deputado_estadual') && <Deputados cargo={aba} respostas={respostas} />}

      <Metodologia />
    </main>
  )
}

function Ranking({ cargo, respostas, usarPartido }: { cargo: 'presidente' | 'governador' | 'senador'; respostas: Respostas; usarPartido: boolean }) {
  const { suficientes, insuficientes } = useMemo(() => ranking(cargo, respostas, usarPartido), [cargo, respostas, usarPartido])
  const fora = CANDIDATOS.filter((c) => c.cargo === cargo && FORA_DA_DISPUTA[c.sq])
  const escopoRespondido = TEMAS.some((t) => (t.escopo === 'estadual') === (cargo === 'governador') && respostas[t.id])

  if (!escopoRespondido)
    return (
      <p className="vazio">
        Você não respondeu nenhum tema {cargo === 'governador' ? 'estadual' : 'nacional'}. Edite suas respostas para ver esta
        comparação.
      </p>
    )

  return (
    <>
      <ol className="lista">
        {suficientes.map((r) => (
          <li key={r.candidato.sq}>
            <Card r={r} />
          </li>
        ))}
      </ol>
      {suficientes.length === 0 && <p className="vazio">Nenhum candidato tem {MIN_TEMAS_COMPARADOS}+ temas em comum com suas respostas.</p>}

      {insuficientes.length > 0 && (
        <>
          <h3 className="secao">Poucos dados para comparar</h3>
          <p className="nota">
            Menos de {MIN_TEMAS_COMPARADOS} temas em comum com suas respostas. Não aparecem no ranking porque a
            porcentagem seria pouco confiável.
          </p>
          <ul className="lista">
            {insuficientes.map((r) => (
              <li key={r.candidato.sq}>
                <Card r={r} discreto />
              </li>
            ))}
          </ul>
        </>
      )}

      {fora.map((c) => (
        <p key={c.sq} className="nota">
          ⓘ {FORA_DA_DISPUTA[c.sq].motivo}{' '}
          <a href={FORA_DA_DISPUTA[c.sq].fonte.url} target="_blank" rel="noreferrer">
            Fonte
          </a>
        </p>
      ))}
    </>
  )
}

function Card({ r, discreto = false }: { r: Resultado; discreto?: boolean }) {
  const [aberto, setAberto] = useState(false)
  const c = r.candidato
  return (
    <article className={`card ${discreto ? 'discreto' : ''}`}>
      <button className="card-topo" onClick={() => setAberto(!aberto)} aria-expanded={aberto}>
        <div className="numero">{c.numero}</div>
        <div className="quem">
          <strong>{c.nome}</strong>
          <span>
            {c.partido}
            {c.vice && ` · vice: ${c.vice}`}
            {c.coligacao && c.coligacao !== 'PARTIDO ISOLADO' && c.coligacao !== 'FEDERAÇÃO' && ` · ${c.coligacao}`}
          </span>
        </div>
        <div className="placar">
          {r.afinidade != null ? (
            <>
              <b>{r.afinidade}%</b>
              <small>
                {r.comparados} de {r.respondidos} temas
              </small>
            </>
          ) : (
            <small>sem temas em comum</small>
          )}
        </div>
      </button>
      {r.afinidade != null && !discreto && (
        <div className="barra">
          <div style={{ width: `${r.afinidade}%` }} />
        </div>
      )}
      {aberto && (
        <div className="detalhe">
          {r.comparacoes.length === 0 && <p className="nota">Não encontramos posição pública deste candidato nos temas que você respondeu.</p>}
          {r.comparacoes.map((cmp) => (
            <div key={cmp.temaId} className={`linha conc-${Math.round(cmp.concordancia * 4)}`}>
              <div className="linha-topo">
                <strong>{tema(cmp.temaId).titulo}</strong>
                <span className="chip">{Math.round(cmp.concordancia * 100)}% de acordo</span>
              </div>
              <div className="lado">
                <span>
                  Você: <b>{rotuloValor(cmp.eleitor.v)}</b>
                  {cmp.eleitor.importante && ' ★'}
                </span>
                <span>
                  {cmp.candidato.origem === 'partido' ? 'Partido' : 'Candidato'}: <b>{rotuloValor(cmp.candidato.v)}</b>
                  {cmp.candidato.origem === 'partido' && <em className="tag">do partido</em>}
                </span>
              </div>
              <blockquote>{cmp.candidato.trecho}</blockquote>
              <a href={cmp.candidato.fonte.url} target="_blank" rel="noreferrer" className="fonte">
                {cmp.candidato.fonte.titulo}
              </a>
            </div>
          ))}
          <p className="nota">
            {c.nomeCompleto} · {c.ocupacao}
            {r.mediaSimples != null && ` · média simples: ${r.mediaSimples}%`}
          </p>
        </div>
      )}
    </article>
  )
}

function Metodologia() {
  return (
    <details className="metodologia">
      <summary>Como o cálculo funciona e de onde vêm os dados</summary>
      <ul>
        <li>
          <b>Candidaturas</b>: base oficial de candidatos 2026 do TSE (
          <a href="https://dadosabertos.tse.jus.br/dataset/candidatos-2026" target="_blank" rel="noreferrer">
            dadosabertos.tse.jus.br
          </a>
          ).
        </li>
        <li>
          <b>Posições</b>: trechos dos planos de governo entregues ao TSE (Presidente e Governador) e declarações ou votos
          noticiados pela imprensa. Cada posição traz o trecho e o link da fonte.
        </li>
        <li>
          <b>Cálculo</b>: por tema, concordância = 1 − |sua resposta − posição do candidato| ÷ 4, numa escala de −2 a +2.
          A afinidade é a média ponderada desses valores, e temas importantes para você valem em dobro. Temas sem posição
          conhecida ficam fora do cálculo. Para que candidatos com poucos dados não passem à frente só por isso, a média
          recebe o peso de {PESO_NEUTRO} temas neutros (50%). A média simples aparece no detalhe de cada candidato.
        </li>
        <li>
          <b>Limites</b>: um plano não dizer nada sobre um tema não significa que o candidato não tenha opinião. Leia os
          planos completos no{' '}
          <a href="https://divulgacandcontas.tse.jus.br/" target="_blank" rel="noreferrer">
            DivulgaCandContas
          </a>
          .
        </li>
      </ul>
    </details>
  )
}
