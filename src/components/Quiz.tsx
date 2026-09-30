import { useState } from 'react'
import { TEMAS } from '../data/temas'
import type { Resposta, Respostas } from '../lib/match'
import { OPCOES } from '../lib/opcoes'
import { UF } from '../lib/match'

interface Props {
  respostas: Respostas
  onChange: (r: Respostas) => void
  onFim: () => void
}

export function Quiz({ respostas, onChange, onFim }: Props) {
  const [i, setI] = useState(0)
  const tema = TEMAS[i]
  const atual = respostas[tema.id]
  const ultimo = i === TEMAS.length - 1

  const avancar = () => (ultimo ? onFim() : setI(i + 1))

  const responder = (v: Resposta['v']) => {
    onChange({ ...respostas, [tema.id]: { v, importante: atual?.importante ?? false } })
  }

  const pular = () => {
    const resto = { ...respostas }
    delete resto[tema.id]
    onChange(resto)
    avancar()
  }

  return (
    <main className="quiz">
      <div className="progresso" aria-label={`Pergunta ${i + 1} de ${TEMAS.length}`}>
        <div style={{ width: `${((i + 1) / TEMAS.length) * 100}%` }} />
      </div>
      <p className="etapa">
        {i + 1} / {TEMAS.length} · {tema.escopo === 'nacional' ? 'Tema nacional (Presidente e Senado)' : `Tema estadual (Governo de ${UF})`}
      </p>

      <h2>{tema.titulo}</h2>
      <p className="afirmacao">“{tema.afirmacao}”</p>
      <p className="contexto">{tema.contexto}</p>

      <div className="escala" role="radiogroup">
        {OPCOES.map((o) => (
          <button
            key={o.v}
            role="radio"
            aria-checked={atual?.v === o.v}
            className={`opcao v${o.v} ${atual?.v === o.v ? 'marcada' : ''}`}
            onClick={() => responder(o.v)}
          >
            {o.rotulo}
          </button>
        ))}
      </div>

      <label className="importante">
        <input
          type="checkbox"
          checked={atual?.importante ?? false}
          disabled={!atual}
          onChange={(e) => onChange({ ...respostas, [tema.id]: { ...atual!, importante: e.target.checked } })}
        />
        Este tema é muito importante para mim (vale em dobro)
      </label>

      <nav className="navquiz">
        <button onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>
          ← Voltar
        </button>
        <button onClick={pular}>Pular tema</button>
        {atual && <button onClick={avancar}>{ultimo ? 'Ver resultado' : 'Próximo →'}</button>}
        {!ultimo && Object.keys(respostas).length > 0 && (
          <button className="link" onClick={onFim}>
            Ir ao resultado
          </button>
        )}
      </nav>
    </main>
  )
}
