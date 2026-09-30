/**
 * Posições dos candidatos, com fonte para cada uma.
 *
 * Escala: 2 = concorda fortemente, 1 = concorda, -1 = discorda, -2 = discorda fortemente.
 * Um tema ausente significa "não encontramos posição pública", e ele não entra no cálculo.
 *
 * Regra de curadoria: só registramos o que está no plano de governo entregue ao TSE
 * ou em declaração/voto noticiado por veículo de imprensa (com link). Nada é inferido
 * por ideologia. A exceção são as posições "do partido" para senadores, que o app
 * calcula a partir do plano do presidenciável do mesmo partido e mostra marcadas.
 *
 * Levantamento: 29/09/2026. Veja também o README (seção Curadoria).
 */

export type Valor = -2 | -1 | 1 | 2

export interface Fonte {
  titulo: string
  url: string
}

export interface Posicao {
  v: Valor
  trecho: string
  fonte: Fonte
}

const DATASET_TSE = 'https://dadosabertos.tse.jus.br/dataset/candidatos-2026'
const plano = (arquivo: string): Fonte => ({
  titulo: `Plano de governo registrado no TSE (${arquivo})`,
  url: DATASET_TSE,
})
const imprensa = (titulo: string, url: string): Fonte => ({ titulo, url })

// Fontes de imprensa reutilizadas
const BAND_ABORTO = imprensa(
  'Band: aborto e drogas dividem presidenciáveis',
  'https://www.band.com.br/politica/eleicoes/eleicoes-2026-aborto-e-drogas-dividem-presidenciaveis-compare-propostas',
)
const NSC_6X1 = imprensa(
  'NSC Total: como votaram deputados de SC na PEC da 6x1 (27/05/2026)',
  'https://www.nsctotal.com.br/noticias/fim-da-escala-6x1-como-votaram-deputados-de-sc-nos-dois-turnos-em-pec-aprovada-na-camara',
)

const P = {
  lula: plano('2026BR280002542548_01.pdf'),
  flavio: plano('2026BR280002551544_01.pdf'),
  zema: plano('2026BR280002539826_01.pdf'),
  caiado: plano('2026BR280002551932_01.pdf'),
  renan: plano('2026BR280002540694_01.pdf'),
  cury: plano('2026BR280002551547_01.pdf'),
  hertz: plano('2026BR280002541457_01.pdf'),
  samara: plano('2026BR280002538811_01.pdf'),
  edmilson: plano('2026BR280002551975_01.pdf'),
  rui: plano('2026BR280002552487_01.pdf'),
  grassi: plano('2026BR280002548139_01.pdf'),
  avalanche: plano('2026BR280002554479_01.pdf'),
  jorginho: plano('2026SC240002537073_01.pdf'),
  joao: plano('2026SC240002551001_01.pdf'),
  merisio: plano('2026SC240002548628_01.pdf'),
  lais: plano('2026SC240002550544_01.pdf'),
  ralf: plano('2026SC240002552157_01.pdf'),
  sodre: plano('2026SC240002541913_01.pdf'),
  brigadeiro: plano('2026SC240002544118_01.pdf'),
  pedreiro: plano('2026SC240002553718_01.pdf'),
}

/** Chave: SQ_CANDIDATO do TSE. */
export const POSICOES: Record<string, Partial<Record<string, Posicao>>> = {
  // ─── PRESIDENTE ───────────────────────────────────────────────
  // Lula (PT)
  '280002542548': {
    fim6x1: { v: 2, trecho: 'Assegurar o fim da escala 6x1 e a redução da jornada de trabalho para 40 horas, sem redução salarial.', fonte: P.lula },
    armas: { v: -2, trecho: 'Critica a desregulamentação que "facilitou a proliferação descontrolada de armas de fogo" e defende o controle de armas.', fonte: P.lula },
    taxarRicos: { v: 2, trecho: '"Colocar o pobre no orçamento e o rico no Imposto de Renda."', fonte: P.lula },
    cotas: { v: 2, trecho: 'Continuidade e aprimoramento da política de cotas no serviço público e no ensino superior.', fonte: P.lula },
    bolsaFamilia: { v: 2, trecho: 'Bolsa Família "recriado e expandido"; defende programas eficientes de transferência de renda.', fonte: P.lula },
    redes: { v: 2, trecho: 'Avançar "na regulação democrática das redes sociais e das plataformas digitais".', fonte: P.lula },
    demarcacao: { v: 2, trecho: 'Garantir proteção aos territórios, "com ações para demarcação e desintrusão de terras".', fonte: P.lula },
    anistia: {
      v: -2,
      trecho: 'Vetou integralmente o PL da Dosimetria, que reduzia penas do 8/1 (08/01/2026).',
      fonte: imprensa('Poder360: Lula veta PL da Dosimetria', 'https://www.poder360.com.br/poder-governo/lula-veta-integralmente-o-pl-da-dosimetria/'),
    },
  },
  // Flávio Bolsonaro (PL)
  '280002551544': {
    privatizacao: { v: 1, trecho: 'Retomar o Programa Nacional de Desestatização "com critério, avaliando caso a caso".', fonte: P.flavio },
    aborto: { v: -2, trecho: 'Defende o respeito "à vida desde a concepção".', fonte: P.flavio },
    drogas: { v: -2, trecho: 'Opõe-se à legalização e defende endurecer a fiscalização.', fonte: BAND_ABORTO },
    maioridade: { v: 2, trecho: 'Apoiar e sancionar a redução da maioridade penal de 18 para 16 anos, e punir maiores de 14 em crimes graves.', fonte: P.flavio },
    civicoMilitar: { v: 2, trecho: '"Vamos ampliar as Escolas Cívico-Militares."', fonte: P.flavio },
    stf: { v: 2, trecho: 'Limitar as decisões monocráticas do STF, privilegiando as colegiadas.', fonte: P.flavio },
    redes: { v: -2, trecho: 'Propõe um "Tesouraço na Censura" para garantir a liberdade de criticar sem medo.', fonte: P.flavio },
    reduzirImpostos: { v: 1, trecho: 'Reduzir impostos sobre energia elétrica e combustíveis.', fonte: P.flavio },
    anistia: {
      v: 2,
      trecho: 'Diz que buscará anistia para Jair Bolsonaro e condenados do 8/1 já na transição; senão, dará indulto.',
      fonte: imprensa('InfoMoney: Flávio buscará anistia para Bolsonaro', 'https://www.infomoney.com.br/politica/flavio-diz-que-buscara-anistia-para-bolsonaro-ainda-durante-governo-de-transicao/'),
    },
  },
  // Romeu Zema (Novo)
  '280002539826': {
    privatizacao: { v: 2, trecho: '"Privatizar todas as empresas estatais."', fonte: P.zema },
    armas: { v: 1, trecho: 'Garantir o porte de armas em toda a extensão da propriedade rural.', fonte: P.zema },
    maioridade: { v: 2, trecho: '"Reduzir a maioridade penal para 16 anos ou menos."', fonte: P.zema },
    reduzirImpostos: { v: 2, trecho: 'Metas progressivas de redução da carga tributária que imponham cortes de gastos.', fonte: P.zema },
    civicoMilitar: { v: 1, trecho: 'Avançar em parcerias com escolas conveniadas e escolas cívico-militares.', fonte: P.zema },
    redes: { v: -2, trecho: 'Vedar a exclusão de perfis e a moderação de opiniões pelas plataformas, "inclusive por determinação judicial".', fonte: P.zema },
    stf: { v: 2, trecho: '"Limitar o poder do Supremo", com mais requisitos para indicação e fiscalização pelo Senado.', fonte: P.zema },
    anistia: {
      v: 2,
      trecho: 'Disse que daria indulto "imediato" a Bolsonaro e defendeu anistia aos condenados do 8/1.',
      fonte: imprensa('Tribuna de Minas: Zema diz que daria indulto imediato a Bolsonaro', 'https://tribunademinas.com.br/noticias/politica/02-10-2025/zema-descarta-ser-vice-de-tarcisio-e-diz-que-daria-indulto-imediato-a-bolsonaro.html'),
    },
  },
  // Ronaldo Caiado (PSD)
  '280002551932': {
    maioridade: { v: 2, trecho: 'Trabalhar pela aprovação da PEC da redução da maioridade penal para 16 anos.', fonte: P.caiado },
    anistia: {
      v: 2,
      trecho: 'Disse que dará indulto a Bolsonaro no primeiro dia de governo, "para pacificar o país".',
      fonte: imprensa('O Povo: Caiado diz que, se eleito, vai dar indulto a Bolsonaro', 'https://www.opovo.com.br/noticias/politica/2026/07/26/caiado-diz-que-se-eleito-vai-dar-indulto-a-bolsonaro-quero-pacificar-o-pais.html'),
    },
  },
  // Renan Santos (Missão)
  '280002540694': {
    cotas: { v: -2, trecho: '"Substituir o sistema de cotas por um sistema de bolsas de mérito."', fonte: P.renan },
    bolsaFamilia: { v: -2, trecho: 'Substituir o Bolsa Família por frentes de trabalho remuneradas para quem está em idade ativa.', fonte: P.renan },
    reduzirImpostos: { v: 1, trecho: 'Reformas para liberar "espaço fiscal para investimentos e redução de impostos".', fonte: P.renan },
    anistia: {
      v: 1,
      trecho: 'Diz que os presos do 8/1 "merecem anistia", mas que Bolsonaro deve ser preso.',
      fonte: imprensa('Itatiaia: Renan Santos defende prisão para Bolsonaro e anistia para presos', 'https://www.itatiaia.com.br/politica/presidente-do-partido-do-mbl-defende-prisao-para-bolsonaro-e-anistia-para-presos/'),
    },
  },
  // Augusto Cury (Avante)
  '280002551547': {
    stf: { v: 2, trecho: 'Mandato de oito anos para os ministros do STF.', fonte: P.cury },
    bolsaFamilia: { v: 1, trecho: 'Bolsa Família valorizado como "renda geral", sem punir quem assinar carteira ou abrir empresa.', fonte: P.cury },
    cotas: {
      v: -1,
      trecho: 'Não propõe ações afirmativas e trata a desigualdade pelo empreendedorismo.',
      fonte: imprensa('Gênero e Número: planos dos presidenciáveis', 'https://www.generonumero.media/artigos/planos-dos-presidenciaveis-2026/'),
    },
  },
  // Hertz Dias (PSTU)
  '280002541457': {
    fim6x1: { v: 2, trecho: 'Jornada 4x3 sem redução salarial e revogação das reformas trabalhista e previdenciária.', fonte: P.hertz },
    aborto: { v: 2, trecho: '"Aborto legal, seguro e gratuito pelo SUS."', fonte: P.hertz },
    drogas: { v: 2, trecho: '"Descriminalização das drogas e revogação da Lei Antidrogas."', fonte: P.hertz },
    maioridade: { v: -2, trecho: '"Contra a redução da maioridade penal."', fonte: P.hertz },
    taxarRicos: { v: 2, trecho: 'Imposto progressivo sobre as grandes fortunas, de R$ 1 bilhão para cima.', fonte: P.hertz },
    privatizacao: { v: -2, trecho: 'Critica as privatizações do setor elétrico e do saneamento.', fonte: P.hertz },
  },
  // Samara Martins (UP)
  '280002538811': {
    fim6x1: { v: 2, trecho: '"Fim imediato da escala 6x1 e estabelecimento da escala 4x3."', fonte: P.samara },
    aborto: { v: 2, trecho: '"Descriminalização e legalização do aborto."', fonte: P.samara },
    drogas: { v: 1, trecho: 'Defende a revisão das políticas de combate às drogas.', fonte: BAND_ABORTO },
    maioridade: { v: -2, trecho: '"Não à redução da maioridade penal."', fonte: P.samara },
    privatizacao: { v: -2, trecho: 'Contra "a privatização do patrimônio público".', fonte: P.samara },
    taxarRicos: { v: 2, trecho: '"Imposto sobre as grandes fortunas e progressivo. Quem ganha mais, paga mais."', fonte: P.samara },
    demarcacao: { v: 2, trecho: '"Demarcação e titulação imediata de todas as terras indígenas."', fonte: P.samara },
  },
  // Edmilson Costa (PCB)
  '280002551975': {
    fim6x1: { v: 2, trecho: 'Jornada de 30 horas sem redução salarial e fim da escala 6x1.', fonte: P.edmilson },
    aborto: { v: 2, trecho: '"Legalização do aborto, com garantia de atendimento na rede pública."', fonte: P.edmilson },
    drogas: { v: 2, trecho: '"Descriminalização do uso de drogas, com legalização da maconha a curto prazo."', fonte: P.edmilson },
    maioridade: { v: -2, trecho: '"Contra a redução da maioridade penal."', fonte: P.edmilson },
    privatizacao: { v: -2, trecho: '"As empresas estratégicas privatizadas serão retomadas para o patrimônio público."', fonte: P.edmilson },
    civicoMilitar: { v: -2, trecho: '"Fim das escolas cívico-militares."', fonte: P.edmilson },
    cotas: { v: 2, trecho: 'Cotas raciais em todos os concursos públicos, incluindo os das forças de segurança.', fonte: P.edmilson },
    redes: { v: 2, trecho: '"Forte regulação das Big Techs e redes sociais."', fonte: P.edmilson },
    taxarRicos: { v: 1, trecho: 'Reforma tributária "com impostos progressivos".', fonte: P.edmilson },
    demarcacao: { v: 2, trecho: '"Proteção, titulação, demarcação e expansão das terras indígenas, quilombolas…"', fonte: P.edmilson },
  },
  // Rui Costa Pimenta (PCO)
  '280002552487': {
    privatizacao: { v: -2, trecho: '"Cancelamento de todas as privatizações realizadas."', fonte: P.rui },
    fim6x1: { v: 2, trecho: 'Jornada de no máximo 7 horas por dia, 5 dias por semana (35 horas).', fonte: P.rui },
    taxarRicos: { v: 2, trecho: '"Imposto sobre as grandes fortunas."', fonte: P.rui },
    bolsaFamilia: { v: 2, trecho: '"Bolsa Família de pelo menos um salário mínimo."', fonte: P.rui },
    demarcacao: { v: 2, trecho: '"Reforma Agrária com expropriação do latifúndio e demarcação das terras dos índios."', fonte: P.rui },
  },
  // Wilson Grassi (Democrata)
  '280002548139': {
    reduzirImpostos: { v: 1, trecho: 'Imposto único sobre movimentações financeiras e isenção de IR até cinco salários mínimos.', fonte: P.grassi },
  },
  // Clariana Barão (DC)
  '280002552484': {
    aborto: { v: -2, trecho: 'Contra a legalização do aborto.', fonte: BAND_ABORTO },
    drogas: { v: -2, trecho: 'Contra a flexibilização das leis sobre entorpecentes.', fonte: BAND_ABORTO },
  },
  // Leonardo Avalanche (PRTB)
  '280002554479': {
    reduzirImpostos: { v: 2, trecho: 'Imposto único de 3,5% no lugar de todos os tributos, "uma redução drástica".', fonte: P.avalanche },
    bolsaFamilia: { v: 1, trecho: 'Qualificação e emprego para beneficiários "sem perder o Bolsa Família".', fonte: P.avalanche },
  },

  // ─── GOVERNADOR (SC) ─────────────────────────────────────────
  // Jorginho Mello (PL)
  '240002537073': {
    cameras: {
      v: -2,
      trecho: 'O governo encerrou o uso de câmeras corporais pela PM.',
      fonte: imprensa('NSC Total: uso de câmeras corporais pela PM será encerrado em SC', 'https://www.nsctotal.com.br/?p=7284436'),
    },
    civicoSC: {
      v: 2,
      trecho: 'Criou o programa estadual (Decreto 426/2023) e o ampliou para 15 escolas.',
      fonte: imprensa('Correio da Manhã: SC amplia escolas cívico-militares', 'https://www.correiodamanha.com.br/nacional/sul/2025/01/178724-escolas-estaduais-civico-militares.html'),
    },
    impostosSC: { v: 1, trecho: '"Quatro anos de gestão sem nenhum aumento de impostos."', fonte: P.jorginho },
  },
  // João Rodrigues (PSD)
  '240002551001': {
    pedagio: { v: 1, trecho: 'Parte substancial do investimento em transportes virá de "parcerias público-privadas e concessões".', fonte: P.joao },
  },
  // Gelson Merísio (PSB)
  '240002548628': {
    tarifaZero: { v: 2, trecho: 'Apoiar a "implantação da tarifa zero nos municípios".', fonte: P.merisio },
    cameras: { v: 2, trecho: '"Retorno do uso de câmeras corporais nas operações policiais."', fonte: P.merisio },
    privEstaduais: { v: -1, trecho: 'Propõe o "fortalecimento do Sistema Casan".', fonte: P.merisio },
  },
  // Laís Chaud (UP)
  '240002550544': {
    privEstaduais: { v: -2, trecho: '"Fortalecer a CASAN enquanto empresa pública estratégica."', fonte: P.lais },
    cameras: { v: 2, trecho: 'Retomar imediatamente o uso obrigatório de câmeras corporais por policiais militares e civis.', fonte: P.lais },
  },
  // Ralf Zimmer (PRD)
  '240002552157': {
    pedagio: { v: 2, trecho: 'Duplicar a BR-282 por concessão ou PPP "com pedágio como fonte compensatória de custeio".', fonte: P.ralf },
  },
  // Professor Marcus Sodré (PSTU)
  '240002541913': {
    privEstaduais: { v: -2, trecho: 'Critica a transferência de infraestrutura pública ao setor privado "por meio de privatizações, concessões…".', fonte: P.sodre },
    pedagio: { v: -2, trecho: '"Fim dos pedágios e a reversão dos processos de privatização das rodovias!"', fonte: P.sodre },
    tarifaZero: { v: 2, trecho: '"Redução da tarifa, rumo à tarifa zero."', fonte: P.sodre },
    civicoSC: { v: -2, trecho: '"Fim das escolas cívico militares!"', fonte: P.sodre },
    desmilitarizar: { v: 2, trecho: '"Desmilitarização da Polícia Militar!"', fonte: P.sodre },
  },
  // Marcelo Brigadeiro (Missão)
  '240002544118': {
    privEstaduais: { v: 2, trecho: '"Promoção de privatizações e ampliação de PPPs e concessões."', fonte: P.brigadeiro },
    impostosSC: { v: 2, trecho: '"Reduzir a carga tributária para aumentar a competitividade do setor produtivo catarinense."', fonte: P.brigadeiro },
  },
  // Bruno Pedreiro (PCO)
  '240002553718': {
    privEstaduais: { v: -2, trecho: '"Cancelar as privatizações." (programa nacional do PCO, registrado como plano)', fonte: P.pedreiro },
    tarifaZero: { v: 1, trecho: '"Passe livre nos transportes para desempregados e trabalhadores da economia informal."', fonte: P.pedreiro },
  },

  // ─── SENADOR (SC) ─── (candidatos ao Senado não entregam plano ao TSE)
  // Esperidião Amin (PP)
  '240002548632': {
    anistia: {
      v: 2,
      trecho: 'Protocolou o PL da Anistia "ampla e irrestrita" aos envolvidos no 8/1 depois do veto à Dosimetria.',
      fonte: imprensa('Diario de Pernambuco: relator da Dosimetria protocola PL da Anistia', 'https://www.diariodepernambuco.com.br/amp/politica/2026/01/11704670-apos-veto-de-lula-relator-do-pl-da-dosimetria-protocola-pl-da-anistia.html'),
    },
    stf: {
      v: 1,
      trecho: 'No debate NSC/CBN, criticou as "extravagâncias praticadas por integrantes do STF".',
      fonte: imprensa('NSC Total: como foi o debate ao Senado em SC', 'https://www.nsctotal.com.br/?p=8016083'),
    },
  },
  // Carol de Toni (PL)
  '240002541931': {
    fim6x1: { v: -2, trecho: 'Como deputada federal, votou NÃO nos dois turnos da PEC do fim da 6x1.', fonte: NSC_6X1 },
    aborto: {
      v: -2,
      trecho: 'Presidiu a CCJ que aprovou a PEC 164/2012, que garante a "inviolabilidade do direito à vida desde a concepção".',
      fonte: imprensa('Poder360: CCJ aprova PEC que pode proibir o aborto em todos os casos', 'https://www.poder360.com.br/poder-congresso/ccj-aprova-pec-que-pode-proibir-o-aborto-em-todos-os-casos/'),
    },
  },
  // Lunelli (MDB)
  '240002548630': {
    stf: {
      v: 1,
      trecho: 'Leva ao debate a reforma do Judiciário e mudanças nas regras do STF.',
      fonte: imprensa('NSC Total: candidatos ao Senado e grandes temas nacionais', 'https://www.nsctotal.com.br/?p=8014606'),
    },
  },
}

/** Candidatura indeferida ou substituída: fica fora do ranking. */
export const FORA_DA_DISPUTA: Record<string, { motivo: string; fonte: Fonte }> = {
  '280002553884': {
    motivo: 'Candidatura de Pablo Marçal indeferida pelo TSE. O PRTB o substituiu por Leonardo Avalanche (mesmo número, 28).',
    fonte: imprensa('Gazeta do Povo: quem são os candidatos a presidente', 'https://www.gazetadopovo.com.br/eleicoes/2026/quem-sao-candidatos-presidente-2026/'),
  },
}

/** Votos dos deputados federais de SC que tentam a reeleição, pelo SQ do TSE (PEC do fim da 6x1, 1º turno, 27/05/2026).
 *  Zé Trovão votou NÃO no 1º turno e faltou ao 2º. */
export const VOTOS_6X1: Record<string, 'SIM' | 'NÃO' | 'AUSENTE'> = {
  '240002533824': 'SIM', // Ana Paula Lima (PT)
  '240002533833': 'SIM', // Pedro Uczai (PT)
  '240002537085': 'SIM', // Jorge Goetten (Republicanos)
  '240002539374': 'SIM', // Ismael dos Santos (PL)
  '240002539376': 'NÃO', // Daniel Freitas (PL)
  '240002539382': 'NÃO', // Daniela Reinehr (PL)
  '240002539378': 'NÃO', // Julia Zanatta (PL)
  '240002539377': 'NÃO', // Ricardo Guidi (PL)
  '240002539384': 'NÃO', // Zé Trovão (PL)
  '240002535434': 'NÃO', // Gilson Marques (Novo)
  '240002541406': 'NÃO', // Pezenti (MDB)
  '240002541915': 'NÃO', // Fabio Schiochet (União)
  '240002541408': 'AUSENTE', // Valdir Cobalchini (MDB)
  '240002537081': 'AUSENTE', // Geovania de Sá (Republicanos)
}
export const FONTE_VOTOS_6X1 = NSC_6X1
