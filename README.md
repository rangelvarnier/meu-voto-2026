# Meu Voto 2026

Quiz em estilo "bússola eleitoral" para as eleições de 2026. Você responde 22 temas (15 nacionais e 7 estaduais) e o
app mostra sua concordância com os candidatos a **Presidente**, **Governador de SC** e **Senador por SC**, com o trecho
e a fonte de cada posição. Para **deputados federais e estaduais de SC** traz a lista oficial do TSE, uma estimativa de
afinidade pelo partido e, para quem já é deputado federal, o voto na PEC do fim da 6x1.

## Rodar

```bash
npm install
npm run dev
```

## Publicar na Vercel

O projeto já vem com `vercel.json` (Vite, saída em `dist`, cache longo dos assets e cabeçalhos de segurança).

**Opção A: pelo GitHub (recomendada, com deploy automático a cada push)**
1. Crie um repositório vazio no GitHub e envie o código (`git remote add origin …` e `git push -u origin main`).
2. Na Vercel, clique em *Add New → Project → Import* e escolha o repositório. As configurações são detectadas sozinhas.

**Opção B: pela linha de comando**
```bash
npx vercel        # primeiro deploy (preview); faz login no navegador
npx vercel --prod # publica em produção
```

Não há variáveis de ambiente nem backend: é um site estático.

## Atualizar a lista de candidatos (TSE)

```bash
python3 scripts/importar_tse.py SC
```

O script baixa `consulta_cand_2026.zip` dos [Dados Abertos do TSE](https://dadosabertos.tse.jus.br/dataset/candidatos-2026)
e regrava `src/data/tse.json`, só com campos públicos (sem CPF, e-mail ou título). Para outro estado, troque `SC` pela UF.
Nesse caso as posições de governador e senador em `posicoes.ts` precisam ser levantadas de novo.

## Estrutura

| Arquivo | O que tem |
| --- | --- |
| `src/data/temas.ts` | As 22 afirmações do quiz (escopo nacional ou estadual) |
| `src/data/posicoes.ts` | Posição de cada candidato por tema (−2 a +2), com trecho e fonte |
| `src/data/tse.json` | Candidaturas oficiais (gerado pelo script) |
| `src/lib/match.ts` | Cálculo de afinidade, ranking e estimativa por partido |
| `src/components/` | Quiz, Resultados e Deputados |

## Curadoria das posições

- **Fontes aceitas**: o plano de governo registrado no TSE ou uma declaração/voto noticiado pela imprensa, com link.
  Nenhuma posição é deduzida por ideologia.
- **Sem posição encontrada = tema fica fora do cálculo.** Não completamos lacunas.
- Os planos de Jorginho Mello e Gelson Merísio são PDFs de imagem e foram lidos por OCR.
- Candidatos ao Senado não entregam plano. A opção "completar com o partido", desligada por padrão, usa o plano do
  presidenciável do mesmo partido e marca essas posições como *do partido*.
- Pablo Marçal (PRTB) aparece como indeferido e substituído por Leonardo Avalanche.
- Levantamento feito em 29/09/2026. Posições podem mudar durante a campanha.

### Como corrigir ou adicionar uma posição

Em `src/data/posicoes.ts`, na chave `SQ_CANDIDATO` do candidato:

```ts
temaId: { v: 2, trecho: 'Trecho curto e fiel à fonte.', fonte: imprensa('Veículo: título', 'https://...') },
```

## Cálculo

Para cada tema: `concordância = 1 − |resposta − posição| / 4`. A afinidade é a média ponderada (temas marcados como
importantes valem 2) somada a 2 "temas neutros" de 50%, para que candidatos com pouquíssimos dados não liderem o ranking.
Quem tem menos de 3 temas em comum com as respostas aparece em uma seção separada.

**Não é recomendação de voto.**
