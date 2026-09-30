import { useMemo, useState } from 'react'
import { VOTOS_6X1, FONTE_VOTOS_6X1 } from '../data/posicoes'
import {
  CANDIDATOS,
  CIDADES,
  UF,
  estimativaPorPartido,
  ligadoACidade,
  semAcento,
  type CriterioCidade,
  type Respostas,
} from '../lib/match'
import { useApp } from '../lib/contexto'
import { Estrela } from './Estrela'

interface Props {
  cargo: 'deputado_federal' | 'deputado_estadual'
  respostas: Respostas
}

const POR_PAGINA = 40

export function Deputados({ cargo, respostas }: Props) {
  const [busca, setBusca] = useState('')
  const [partido, setPartido] = useState('')
  const [ordem, setOrdem] = useState<'afinidade' | 'nome' | 'numero'>('afinidade')
  const [limite, setLimite] = useState(POR_PAGINA)
  const [cidade, setCidade] = useState('')
  const [criterio, setCriterio] = useState<CriterioCidade>('ambos')
  const { abrirPerfil } = useApp()

  const lista = useMemo(() => CANDIDATOS.filter((c) => c.cargo === cargo), [cargo])

  const porPartido = useMemo(() => {
    const m = new Map<string, ReturnType<typeof estimativaPorPartido>>()
    for (const p of new Set(lista.map((c) => c.partido))) m.set(p, estimativaPorPartido(p, respostas))
    return m
  }, [lista, respostas])

  const partidos = [...porPartido.entries()].sort((a, b) => (b[1].afinidade ?? -1) - (a[1].afinidade ?? -1) || a[0].localeCompare(b[0]))

  const filtrados = useMemo(() => {
    const q = semAcento(busca.trim())
    return lista
      .filter(
        (c) =>
          (!partido || c.partido === partido) &&
          ligadoACidade(c, cidade, criterio) &&
          (!q || semAcento(`${c.nome} ${c.nomeCompleto} ${c.numero} ${c.ocupacao}`).includes(q)),
      )
      .sort((a, b) => {
        if (ordem === 'nome') return a.nome.localeCompare(b.nome)
        if (ordem === 'numero') return a.numero.localeCompare(b.numero)
        return (porPartido.get(b.partido)?.afinidade ?? -1) - (porPartido.get(a.partido)?.afinidade ?? -1) || a.nome.localeCompare(b.nome)
      })
  }, [lista, busca, partido, ordem, porPartido, cidade, criterio])

  return (
    <section className="deputados">
      <div className="aviso">
        <p>
          São <b>{lista.length}</b> candidatos a {cargo === 'deputado_federal' ? 'deputado federal' : 'deputado estadual'} em{' '}
          {UF}. Não dá para levantar posição por posição de cada um, então a afinidade aqui é uma <b>estimativa pelo partido</b>:
          a média da sua afinidade com o presidenciável do partido (ou da coligação ou federação dele) e com o candidato a governador da coligação do
          partido em {UF}. Deputados podem votar diferente do partido. Use isto como ponto de partida para pesquisar.
        </p>
      </div>

      <h3 className="secao">Afinidade estimada por partido</h3>
      <div className="partidos">
        {partidos.map(([p, e]) => (
          <button key={p} className={`partido ${partido === p ? 'ativo' : ''}`} onClick={() => setPartido(partido === p ? '' : p)} title={explicar(e)}>
            <b>{p}</b>
            <span>{e.afinidade != null ? `${e.afinidade}%` : 's/ dados'}</span>
          </button>
        ))}
      </div>

      <p className="nota">
        O TSE não divulga a cidade de residência dos candidatos em dados abertos. Por isso usamos a{' '}
        <b>cidade de nascimento</b> e as cidades onde a pessoa <b>já concorreu a vereador, prefeito ou vice</b>, que costumam
        indicar a base eleitoral. Quem nunca disputou eleição municipal aparece só pela cidade de nascimento.
      </p>
      <div className="filtros">
        <input
          type="search"
          placeholder="Buscar por nome, número ou ocupação"
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value)
            setLimite(POR_PAGINA)
          }}
        />
        <select value={ordem} onChange={(e) => setOrdem(e.target.value as typeof ordem)}>
          <option value="afinidade">Ordenar: afinidade do partido</option>
          <option value="nome">Ordenar: nome</option>
          <option value="numero">Ordenar: número</option>
        </select>
        <input
          type="search"
          list="cidades-sc"
          placeholder="Cidade (ex.: Chapecó)"
          value={cidade}
          onChange={(e) => {
            setCidade(e.target.value)
            setLimite(POR_PAGINA)
          }}
          aria-label="Filtrar por cidade"
        />
        <datalist id="cidades-sc">
          {CIDADES.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        <select value={criterio} onChange={(e) => setCriterio(e.target.value as CriterioCidade)} aria-label="Critério da cidade">
          <option value="ambos">Cidade: nasceu ou já disputou</option>
          <option value="nascimento">Cidade: onde nasceu</option>
          <option value="disputas">Cidade: onde já disputou eleição</option>
        </select>
        {partido && (
          <button className="link" onClick={() => setPartido('')}>
            Limpar partido ({partido})
          </button>
        )}
      </div>

      <p className="nota">{filtrados.length} candidatos</p>
      <ul className="tabela">
        {filtrados.slice(0, limite).map((c) => {
          const est = porPartido.get(c.partido)
          const voto = VOTOS_6X1[c.sq]
          return (
            <li key={c.sq}>
              <Estrela sq={c.sq} nome={c.nome} />
              <span className="numero">{c.numero}</span>
              <span className="quem">
                <button className="link nome" onClick={() => abrirPerfil(c.sq)}>
                  {c.nome}
                </button>
                <small>
                  {c.partido}
                  {c.federacao && ` (${c.federacao})`} · {c.ocupacao}
                </small>
                <small className="cidades">
                  {c.nascimento && <>Nasceu em {c.nascimento}</>}
                  {c.disputas?.[0] && (
                    <>
                      {c.nascimento && ' · '}
                      Última disputa: {c.disputas[0].cargo} em {c.disputas[0].cidade} ({c.disputas[0].ano}
                      {c.disputas[0].resultado && `, ${c.disputas[0].resultado.toLowerCase()}`})
                    </>
                  )}
                </small>
                {voto && (
                  <small className="voto">
                    Já é deputado(a). Votou <b>{voto}</b> na PEC do fim da 6x1{' '}
                    <a href={FONTE_VOTOS_6X1.url} target="_blank" rel="noreferrer">
                      (fonte)
                    </a>
                  </small>
                )}
              </span>
              <span className="placar-mini">{est?.afinidade != null ? `${est.afinidade}%` : '—'}</span>
            </li>
          )
        })}
      </ul>
      {filtrados.length > limite && (
        <button className="mais" onClick={() => setLimite(limite + POR_PAGINA)}>
          Mostrar mais ({filtrados.length - limite} restantes)
        </button>
      )}
    </section>
  )
}

function explicar(e: ReturnType<typeof estimativaPorPartido>) {
  const partes = []
  if (e.presidente) partes.push(`Presidente: ${e.presidente.candidato.nome} (${e.presidente.afinidade ?? '—'}%, ${e.presidente.comparados} temas)`)
  if (e.governador) partes.push(`Governador: ${e.governador.candidato.nome} (${e.governador.afinidade ?? '—'}%, ${e.governador.comparados} temas)`)
  return partes.length ? partes.join('\n') : 'Partido sem presidenciável nem coligação ao governo com dados suficientes'
}
