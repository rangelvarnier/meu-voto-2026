import { TEMAS } from '../data/temas'
import { useApp } from '../lib/contexto'
import {
  calcular,
  candidatoPorSq,
  cobertura,
  estimativaPorPartido,
  MIN_TEMAS_COMPARADOS,
  posicoesDe,
  ROTULO_CARGO,
  type Candidato,
  type Respostas,
} from '../lib/match'
import { OPCOES, ROTULO_CANDIDATO } from '../lib/opcoes'
import { urlSugerirFonte } from '../lib/sugestao'
import { Estrela } from './Estrela'

const rotuloEleitor = (v: number) => OPCOES.find((o) => o.v === v)?.rotulo ?? '—'
const ehMajoritario = (c: Candidato) => c.cargo === 'presidente' || c.cargo === 'governador' || c.cargo === 'senador'
const classe = (v: number) => (v > 0 ? 'pos' : 'neg') + (Math.abs(v) === 2 ? ' forte' : '')

function afinidade(c: Candidato, respostas: Respostas): { texto: string; nota?: string } {
  if (ehMajoritario(c)) {
    const r = calcular(c, respostas, false)
    return r.afinidade != null && r.comparados >= MIN_TEMAS_COMPARADOS
      ? { texto: `${r.afinidade}%`, nota: `${r.comparados} temas` }
      : { texto: '—', nota: 'poucos dados' }
  }
  const e = estimativaPorPartido(c.partido, respostas)
  return e.afinidade != null ? { texto: `${e.afinidade}%`, nota: 'estimada pelo partido' } : { texto: '—', nota: 'sem dados' }
}

export function Comparar({ respostas }: { respostas: Respostas }) {
  const { favoritos, alternarFavorito, abrirPerfil } = useApp()
  const cands = favoritos.map(candidatoPorSq).filter((c): c is Candidato => !!c)

  if (cands.length === 0)
    return (
      <main className="resultados">
        <h1>Comparar favoritos</h1>
        <p className="vazio">
          Você ainda não favoritou ninguém. Use a estrela (☆) nos cartões de candidatos, na lista de deputados ou dentro
          do perfil para montar a comparação.
        </p>
      </main>
    )

  const posicoes = new Map(cands.map((c) => [c.sq, posicoesDe(c, false)]))
  const temas = TEMAS.filter((t) => cands.some((c) => posicoes.get(c.sq)![t.id]))

  return (
    <main className="resultados">
      <h1>Comparar favoritos</h1>
      <p className="nota">
        {cands.length} {cands.length === 1 ? 'candidato' : 'candidatos'}. Só aparecem os temas em que pelo menos um deles
        tem posição registrada, e “—” significa que não encontramos posição pública. Se você conhece uma fonte (plano,
        voto ou declaração noticiada), use “sugerir”. Toque no nome para abrir o perfil.
      </p>

      <div className="tabela-rolagem">
        <table className="comparacao">
          <thead>
            <tr>
              <th scope="col">Tema</th>
              {cands.map((c) => (
                <th scope="col" key={c.sq}>
                  <div className="col-topo">
                    <button className="link nome" onClick={() => abrirPerfil(c.sq)}>
                      {c.nome}
                    </button>
                    <Estrela sq={c.sq} nome={c.nome} />
                  </div>
                  <small>
                    {ROTULO_CARGO[c.cargo]} · {c.partido} · {c.numero}
                  </small>
                </th>
              ))}
            </tr>
            <tr className="linha-afinidade">
              <th scope="row">Afinidade com você</th>
              {cands.map((c) => {
                const a = afinidade(c, respostas)
                return (
                  <td key={c.sq}>
                    <b>{a.texto}</b>
                    <small>{a.nota}</small>
                  </td>
                )
              })}
            </tr>
            <tr className="linha-cobertura">
              <th scope="row">Temas com posição</th>
              {cands.map((c) => {
                const cob = cobertura(c, false)
                return (
                  <td key={c.sq}>
                    <b>{ehMajoritario(c) ? `${cob.com} de ${cob.total}` : cob.com}</b>
                    <a href={urlSugerirFonte(c)} target="_blank" rel="noreferrer">
                      sugerir fonte
                    </a>
                  </td>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {temas.map((t) => (
              <tr key={t.id}>
                <th scope="row">
                  {t.titulo}
                  <small>{respostas[t.id] ? `Você: ${rotuloEleitor(respostas[t.id].v)}` : 'Você não respondeu'}</small>
                </th>
                {cands.map((c) => {
                  const p = posicoes.get(c.sq)![t.id]
                  return (
                    <td key={c.sq} className={p ? classe(p.v) : 'nada'} title={p?.trecho}>
                      {p ? (
                        <>
                          <b>{ROTULO_CANDIDATO[p.v]}</b>
                          <a href={p.fonte.url} target="_blank" rel="noreferrer">
                            fonte
                          </a>
                        </>
                      ) : (
                        <>
                          —
                          <a href={urlSugerirFonte(c, t)} target="_blank" rel="noreferrer" title="Conhece uma fonte? Sugira">
                            sugerir
                          </a>
                        </>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {temas.length === 0 && <p className="vazio">Nenhum dos favoritos tem posição registrada nos temas do quiz.</p>}

      <div className="acoes">
        <button className="link" onClick={() => cands.forEach((c) => alternarFavorito(c.sq))}>
          Limpar favoritos
        </button>
      </div>
    </main>
  )
}
