export type Escopo = 'nacional' | 'estadual'

export interface Tema {
  id: string
  escopo: Escopo
  titulo: string
  afirmacao: string
  contexto: string
}

// Afirmações neutras: concordar ou discordar não é "certo" nem "errado".
export const TEMAS: Tema[] = [
  // Nacionais: comparados com candidatos a Presidente e Senador
  {
    id: 'privatizacao',
    escopo: 'nacional',
    titulo: 'Estatais federais',
    afirmacao: 'O governo deve privatizar empresas estatais federais.',
    contexto: 'Ex.: Petrobras, Correios, Caixa. Quem discorda costuma defender manter ou retomar o controle público.',
  },
  {
    id: 'fim6x1',
    escopo: 'nacional',
    titulo: 'Escala 6x1',
    afirmacao: 'A escala 6x1 deve acabar.',
    contexto: 'A PEC aprovada na Câmara em maio de 2026 reduz a jornada sem reduzir o salário e aguarda o Senado.',
  },
  {
    id: 'armas',
    escopo: 'nacional',
    titulo: 'Armas',
    afirmacao: 'O cidadão deve ter acesso mais fácil à posse e ao porte de armas.',
    contexto: 'Envolve as regras para CACs, posse em casa e porte em propriedades rurais. O presidente muda boa parte disso por decreto.',
  },
  {
    id: 'aborto',
    escopo: 'nacional',
    titulo: 'Aborto',
    afirmacao: 'O aborto deve deixar de ser crime.',
    contexto:
      'Hoje é permitido só em caso de estupro, de risco à vida da gestante ou de anencefalia. Depende do Congresso e do STF; o presidente propõe ou veta.',
  },
  {
    id: 'drogas',
    escopo: 'nacional',
    titulo: 'Drogas',
    afirmacao: 'Portar drogas para uso pessoal deve deixar de ser crime.',
    contexto: 'Em 2024 o STF decidiu que portar até 40 g de maconha para uso próprio não é crime. Mudar a Lei Antidrogas depende do Congresso.',
  },
  {
    id: 'anistia',
    escopo: 'nacional',
    titulo: 'Anistia do 8/1',
    afirmacao: 'Os condenados pela trama golpista e pelos atos de 8 de janeiro devem ser perdoados (anistia ou indulto).',
    contexto:
      'A anistia é aprovada pelo Congresso; o indulto é dado pelo presidente. Algumas candidaturas incluem Jair Bolsonaro e outras não, e o detalhe aparece em cada posição.',
  },
  {
    id: 'maioridade',
    escopo: 'nacional',
    titulo: 'Maioridade penal',
    afirmacao: 'A maioridade penal deve ser reduzida (por exemplo, para 16 anos).',
    contexto: 'Hoje, menores de 18 respondem pelo ECA. Mudar exige PEC, votada pela Câmara e pelo Senado, sem sanção do presidente.',
  },
  {
    id: 'taxarRicos',
    escopo: 'nacional',
    titulo: 'Impostos sobre os mais ricos',
    afirmacao: 'Os mais ricos devem pagar mais impostos (altas rendas, grandes fortunas).',
    contexto: 'Fala de quem paga os impostos, e não de quanto se arrecada no total.',
  },
  {
    id: 'reduzirImpostos',
    escopo: 'nacional',
    titulo: 'Carga tributária',
    afirmacao: 'A carga total de impostos deve cair.',
    contexto: 'Fala do tamanho total da arrecadação, e não de quem paga. Reduzir a carga costuma exigir cortar gastos.',
  },
  {
    id: 'civicoMilitar',
    escopo: 'nacional',
    titulo: 'Escolas cívico-militares',
    afirmacao: 'O país deve ampliar as escolas cívico-militares.',
    contexto: 'O programa federal foi encerrado em 2023. Alguns estados, como SC, mantêm programas próprios.',
  },
  {
    id: 'cotas',
    escopo: 'nacional',
    titulo: 'Cotas raciais',
    afirmacao: 'As cotas raciais em universidades e concursos devem ser mantidas.',
    contexto: 'Quem discorda costuma propor critérios só sociais ou de mérito.',
  },
  {
    id: 'bolsaFamilia',
    escopo: 'nacional',
    titulo: 'Transferência de renda',
    afirmacao: 'Programas como o Bolsa Família devem ser mantidos ou ampliados.',
    contexto: 'Quem discorda pode propor trocar o benefício por frentes de trabalho ou outros formatos.',
  },
  {
    id: 'redes',
    escopo: 'nacional',
    titulo: 'Redes sociais',
    afirmacao: 'Redes sociais e big techs devem ser reguladas para conter desinformação e discurso de ódio.',
    contexto: 'Quem discorda costuma ver risco de censura e defender menos moderação.',
  },
  {
    id: 'clt',
    escopo: 'nacional',
    titulo: 'Regras de trabalho',
    afirmacao: 'Deve ser permitido contratar com regras mais flexíveis que as da CLT, como pagamento por hora.',
    contexto: 'Quem discorda costuma defender revogar a reforma trabalhista de 2017 e ampliar as proteções da CLT.',
  },
  {
    id: 'stf',
    escopo: 'nacional',
    titulo: 'Poderes do STF',
    afirmacao: 'Os poderes do STF devem ser limitados (mandato fixo, menos decisões individuais etc.).',
    contexto:
      'Inclui mandato fixo para ministros e limite a decisões individuais. Depende de PEC; o Senado também sabatina os indicados e julga ministros.',
  },
  {
    id: 'demarcacao',
    escopo: 'nacional',
    titulo: 'Terras indígenas',
    afirmacao: 'O governo deve continuar demarcando terras indígenas e quilombolas.',
    contexto: 'Tem relação com o debate sobre o marco temporal e com a expansão agropecuária.',
  },

  // Estaduais: comparados com candidatos a Governador de SC
  {
    id: 'privEstaduais',
    escopo: 'estadual',
    titulo: 'Casan e Celesc',
    afirmacao: 'SC deve privatizar estatais como Casan e Celesc.',
    contexto: 'Casan cuida de água e esgoto. Celesc cuida de energia.',
  },
  {
    id: 'pedagio',
    escopo: 'estadual',
    titulo: 'Concessão de rodovias',
    afirmacao: 'Rodovias devem ser concedidas à iniciativa privada, com cobrança de pedágio.',
    contexto: 'Quem discorda defende obras feitas com dinheiro público e sem pedágio.',
  },
  {
    id: 'tarifaZero',
    escopo: 'estadual',
    titulo: 'Tarifa zero',
    afirmacao: 'O estado deve apoiar a tarifa zero (ônibus gratuito) no transporte coletivo.',
    contexto: 'O transporte urbano é dos municípios. O estado pode financiar e cuida das linhas metropolitanas.',
  },
  {
    id: 'cameras',
    escopo: 'estadual',
    titulo: 'Câmeras corporais',
    afirmacao: 'Policiais de SC devem voltar a usar câmeras corporais.',
    contexto: 'SC foi pioneira em 2019 e encerrou o uso na PM no governo atual.',
  },
  {
    id: 'civicoSC',
    escopo: 'estadual',
    titulo: 'Cívico-militares em SC',
    afirmacao: 'SC deve manter e ampliar seu programa estadual de escolas cívico-militares.',
    contexto: 'O programa estadual foi criado em 2023 (Decreto nº 426).',
  },
  {
    id: 'impostosSC',
    escopo: 'estadual',
    titulo: 'Impostos estaduais',
    afirmacao: 'SC deve reduzir a carga de impostos estaduais para atrair empresas.',
    contexto: 'O principal imposto estadual é o ICMS, que a reforma tributária substitui aos poucos pelo IBS entre 2029 e 2033.',
  },
]

export const temasPorEscopo = (e: Escopo) => TEMAS.filter((t) => t.escopo === e)
