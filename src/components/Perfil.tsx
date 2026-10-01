import { useEffect } from 'react'
import { TEMAS } from '../data/temas'
import { PROPOSTAS, URL_DIVULGACAND } from '../data/propostas'
import { VOTOS_6X1, FONTE_VOTOS_6X1 } from '../data/posicoes'
import { candidatoPorSq, cobertura, posicoesDe, ROTULO_CARGO, type Respostas } from '../lib/match'
import { urlSugerirFonte } from '../lib/sugestao'
import { OPCOES, ROTULO_CANDIDATO } from '../lib/opcoes'
import { Estrela } from './Estrela'

interface Props {
  sq: string
  respostas: Respostas
  onFechar: () => void
}

const rotuloEleitor = (v: number) => OPCOES.find((o) => o.v === v)?.rotulo ?? '—'

export function Perfil({ sq, respostas, onFechar }: Props) {
  const c = candidatoPorSq(sq)

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onFechar()
    document.addEventListener('keydown', esc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', esc)
      document.body.style.overflow = ''
    }
  }, [onFechar])

  if (!c) return null
  const propostas = PROPOSTAS[c.sq]
  const posicoes = posicoesDe(c, false)
  const temasComPosicao = TEMAS.filter((t) => posicoes[t.id])
  const cob = cobertura(c, false)
  const voto = VOTOS_6X1[c.sq]
  const entregaPlano = c.cargo === 'presidente' || c.cargo === 'governador'

  return (
    <div className="fundo-modal" onClick={onFechar}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={`Perfil de ${c.nome}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-topo">
          <div className="numero grande">{c.numero}</div>
          <div className="quem">
            <h2>{c.nome}</h2>
            <span>
              {ROTULO_CARGO[c.cargo]} · {c.partido}
              {c.federacao && ` (federação ${c.federacao})`}
            </span>
          </div>
          <Estrela sq={c.sq} nome={c.nome} />
          <button className="fechar" onClick={onFechar} aria-label="Fechar perfil">
            ×
          </button>
        </div>

        <div className="modal-corpo">
          <dl className="ficha">
            <dt>Nome completo</dt>
            <dd>{c.nomeCompleto}</dd>
            <dt>Ocupação declarada</dt>
            <dd>{c.ocupacao}</dd>
            {c.vice && (
              <>
                <dt>Vice</dt>
                <dd>{c.vice}</dd>
              </>
            )}
            {c.coligacao && c.coligacao !== 'PARTIDO ISOLADO' && c.coligacao !== 'FEDERAÇÃO' && (
              <>
                <dt>Coligação</dt>
                <dd>
                  {c.coligacao}
                  <small> · {c.composicao}</small>
                </dd>
              </>
            )}
            {c.nascimento && (
              <>
                <dt>Nasceu em</dt>
                <dd>{c.nascimento}</dd>
              </>
            )}
          </dl>

          {c.disputas && c.disputas.length > 0 && (
            <section>
              <h3>Eleições municipais anteriores</h3>
              <ul className="historico">
                {c.disputas.map((d, i) => (
                  <li key={i}>
                    <b>{d.ano}</b> · {d.cargo} em {d.cidade}
                    {d.resultado && <span className="tag">{d.resultado}</span>}
                  </li>
                ))}
              </ul>
              <p className="nota">Fonte: histórico de candidaturas do TSE.</p>
            </section>
          )}

          {voto && (
            <section>
              <h3>Votação na Câmara</h3>
              <p>
                {voto === 'AUSENTE' ? 'Ausente' : `Votou ${voto}`} na PEC do fim da escala 6x1 (27/05/2026).{' '}
                <a href={FONTE_VOTOS_6X1.url} target="_blank" rel="noreferrer">
                  Fonte
                </a>
              </p>
            </section>
          )}

          <section>
            <h3>Propostas</h3>
            {propostas ? (
              <>
                <p className="nota">
                  {propostas.plano}. Resumo do plano de governo registrado no TSE.
                </p>
                <h4>Áreas do plano</h4>
                <ul className="chips">
                  {propostas.eixos.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
                <h4>Propostas em destaque</h4>
                <ul className="destaques">
                  {propostas.destaques.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
                <p className="nota">
                  Texto completo: busque por “{c.nome}” em{' '}
                  <a href={URL_DIVULGACAND} target="_blank" rel="noreferrer">
                    DivulgaCandContas (TSE)
                  </a>
                  .
                </p>
              </>
            ) : entregaPlano ? (
              <p className="nota">Não incluímos o plano deste candidato no resumo.</p>
            ) : (
              <p className="nota">
                Candidaturas a {ROTULO_CARGO[c.cargo].toLowerCase()} não entregam plano de governo ao TSE. Só há posição
                pública quando existe voto ou declaração noticiada, como abaixo.
              </p>
            )}
          </section>

          <section>
            <h3>Posições nos temas do quiz</h3>
            <p className="nota">
              Posição registrada em {cob.com} de {cob.total} temas {c.cargo === 'governador' || c.cargo === 'deputado_estadual' ? 'estaduais' : 'nacionais'}.
            </p>
            {temasComPosicao.length === 0 && <p className="nota">Não encontramos posição pública neste candidato para os temas do quiz.</p>}
            {temasComPosicao.map((t) => {
              const p = posicoes[t.id]
              const r = respostas[t.id]
              return (
                <div key={t.id} className="linha">
                  <div className="linha-topo">
                    <strong>{t.titulo}</strong>
                    <span className="chip">{ROTULO_CANDIDATO[p.v]}</span>
                  </div>
                  {r && <div className="lado">Você: <b>{rotuloEleitor(r.v)}</b></div>}
                  <blockquote>{p.trecho}</blockquote>
                  <a className="fonte" href={p.fonte.url} target="_blank" rel="noreferrer">
                    {p.fonte.titulo}
                  </a>
                </div>
              )
            })}
            {cob.faltando.length > 0 && (
              <>
                <h4>Sem posição encontrada</h4>
                <p className="nota">
                  Conhece um trecho do plano, um voto ou uma declaração noticiada sobre algum destes temas? Envie a fonte
                  e a gente confere antes de incluir.
                </p>
                <ul className="chips">
                  {cob.faltando.map((t) => (
                    <li key={t.id}>
                      <a href={urlSugerirFonte(c, t)} target="_blank" rel="noreferrer">
                        {t.titulo} · sugerir fonte
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
