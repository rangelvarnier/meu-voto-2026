import { useMemo, useState } from 'react'
import { VOTOS_6X1, FONTE_VOTOS_6X1 } from '../data/posicoes'
import { CANDIDATOS, UF, estimativaPorPartido, type Respostas } from '../lib/match'

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

  const lista = useMemo(() => CANDIDATOS.filter((c) => c.cargo === cargo), [cargo])

  const porPartido = useMemo(() => {
    const m = new Map<string, ReturnType<typeof estimativaPorPartido>>()
    for (const p of new Set(lista.map((c) => c.partido))) m.set(p, estimativaPorPartido(p, respostas))
    return m
  }, [lista, respostas])

  const partidos = [...porPartido.entries()].sort((a, b) => (b[1].afinidade ?? -1) - (a[1].afinidade ?? -1) || a[0].localeCompare(b[0]))

  const filtrados = useMemo(() => {
    const q = busca
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
    const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')
    return lista
      .filter((c) => (!partido || c.partido === partido) && (!q || norm(`${c.nome} ${c.nomeCompleto} ${c.numero} ${c.ocupacao}`).includes(q)))
      .sort((a, b) => {
        if (ordem === 'nome') return a.nome.localeCompare(b.nome)
        if (ordem === 'numero') return a.numero.localeCompare(b.numero)
        return (porPartido.get(b.partido)?.afinidade ?? -1) - (porPartido.get(a.partido)?.afinidade ?? -1) || a.nome.localeCompare(b.nome)
      })
  }, [lista, busca, partido, ordem, porPartido])

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
        {partido && (
          <button className="link" onClick={() => setPartido('')}>
            Limpar filtro ({partido})
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
              <span className="numero">{c.numero}</span>
              <span className="quem">
                <strong>{c.nome}</strong>
                <small>
                  {c.partido}
                  {c.federacao && ` (${c.federacao})`} · {c.ocupacao}
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
