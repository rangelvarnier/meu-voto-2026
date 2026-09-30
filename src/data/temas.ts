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
    afirmacao: 'A escala 6x1 deve acabar, com redução da jornada sem redução de salário.',
    contexto: 'A PEC foi aprovada na Câmara em maio de 2026 e aguarda o Senado.',
  },
  {
    id: 'armas',
    escopo: 'nacional',
    titulo: 'Armas',
    afirmacao: 'O cidadão deve ter acesso mais fácil à posse e ao porte de armas.',
    contexto: 'Envolve as regras para CACs, posse em casa e porte em propriedades rurais.',
  },
  {
    id: 'aborto',
    escopo: 'nacional',
    titulo: 'Aborto',
    afirmacao: 'O aborto deve ser descriminalizado ou legalizado.',
    contexto: 'Hoje é permitido só em caso de estupro, de risco à vida da gestante ou de anencefalia.',
  },
  {
    id: 'drogas',
    escopo: 'nacional',
    titulo: 'Drogas',
    afirmacao: 'O uso de drogas deve ser descriminalizado.',
    contexto: 'Inclui propostas de rever a Lei Antidrogas ou de legalizar a maconha.',
  },
  {
    id: 'anistia',
    escopo: 'nacional',
    titulo: 'Anistia do 8/1',
    afirmacao: 'Os condenados pelos atos de 8 de janeiro de 2023 devem receber anistia ou indulto.',
    contexto: 'Algumas candidaturas incluem Jair Bolsonaro na anistia e outras não. O detalhe aparece em cada posição.',
  },
  {
    id: 'maioridade',
    escopo: 'nacional',
    titulo: 'Maioridade penal',
    afirmacao: 'A maioridade penal deve ser reduzida (por exemplo, para 16 anos).',
    contexto: 'Hoje, menores de 18 respondem pelo ECA, com medidas socioeducativas.',
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
    afirmacao: 'A carga total de impostos deve cair, mesmo que isso exija cortar gastos públicos.',
    contexto: 'Fala do tamanho total da arrecadação.',
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
    id: 'stf',
    escopo: 'nacional',
    titulo: 'Poderes do STF',
    afirmacao: 'Os poderes do STF devem ser limitados (mandato fixo, menos decisões individuais etc.).',
    contexto: 'Inclui propostas de mandato fixo para ministros e de limite a decisões monocráticas.',
  },
  {
    id: 'demarcacao',
    escopo: 'nacional',
    titulo: 'Terras indígenas',
    afirmacao: 'Terras indígenas e quilombolas devem ser demarcadas, mesmo que isso limite a expansão agropecuária.',
    contexto: 'Tem relação com o debate sobre o marco temporal.',
  },

  // Estaduais: comparados com candidatos a Governador de SC
  {
    id: 'privEstaduais',
    escopo: 'estadual',
    titulo: 'Casan e Celesc',
    afirmacao: 'SC deve privatizar ou abrir o capital de estatais como Casan e Celesc.',
    contexto: 'Casan cuida de água e esgoto. Celesc cuida de energia.',
  },
  {
    id: 'pedagio',
    escopo: 'estadual',
    titulo: 'Concessão de rodovias',
    afirmacao: 'Obras e manutenção de rodovias devem ser concedidas à iniciativa privada, com pedágio se preciso.',
    contexto: 'Quem discorda defende obras feitas com dinheiro público e sem pedágio.',
  },
  {
    id: 'tarifaZero',
    escopo: 'estadual',
    titulo: 'Tarifa zero',
    afirmacao: 'O estado deve apoiar a tarifa zero (ônibus gratuito) no transporte coletivo.',
    contexto: 'Envolve subsídio público ao transporte municipal e metropolitano.',
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
    contexto: 'O principal imposto estadual é o ICMS.',
  },
  {
    id: 'desmilitarizar',
    escopo: 'estadual',
    titulo: 'Polícia Militar',
    afirmacao: 'A Polícia Militar deve ser desmilitarizada.',
    contexto: 'Alterar o modelo depende também da Constituição Federal, mas o tema aparece em planos estaduais.',
  },
]

export const temasPorEscopo = (e: Escopo) => TEMAS.filter((t) => t.escopo === e)
