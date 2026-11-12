export type Certificate = {
  title: string
  issuer: string
  year?: number
  verificationUrl?: string
}

// Include only public metadata and issuer links approved for sharing.
// Original documents stay in the local, Git-ignored certificados-privados folder.
export const certificates: readonly Certificate[] = [
  { title: 'Como Utilizar o ChatGPT para Simular Entrevistas Técnicas', issuer: 'DIO', year: 2026 },
  { title: 'Act Commands — Seu ChatGPT como Assistente Virtual', issuer: 'DIO', year: 2026 },
  { title: 'ChatGPT — O Essencial', issuer: 'DIO', year: 2026 },
  { title: 'Pedi pro ChatGPT Me Entrevistar... E Fui Surpreendido!', issuer: 'DIO', year: 2026 },
  { title: 'Prompts Assertivos para ChatGPT', issuer: 'DIO', year: 2026 },
  { title: 'Como Ingressar no Futuro Agora Mesmo com ChatGPT', issuer: 'DIO', year: 2026 },
  { title: 'Aprenda a Programar do Zero com JavaScript', issuer: 'DIO', year: 2026 },
  { title: 'Consolide Seu Conhecimento com Desafios de Código JavaScript', issuer: 'DIO', year: 2026 },
  { title: 'Importação e Exportação com JavaScript', issuer: 'DIO', year: 2026 },
  { title: 'Arrays e Estruturas de Repetição em JavaScript', issuer: 'DIO', year: 2026 },
  { title: 'Criando Objetos e Classes em JavaScript', issuer: 'DIO', year: 2026 },
  { title: 'Conhecendo Funções JavaScript', issuer: 'DIO', year: 2026 },
  { title: 'Primeiros Passos com JavaScript', issuer: 'DIO', year: 2026 },
  { title: 'Fundamentos de Business Intelligence (BI)', issuer: 'DIO', year: 2025 },
  { title: 'Conceitos Fundamentais de IA', issuer: 'DIO', year: 2024 },
  { title: 'Criação de Páginas de Internet Dinâmicas com PHP', issuer: 'Alfahelix', year: 2022 },
  { title: 'Inovando com CSS', issuer: 'Fundação Bradesco — Escola Virtual', year: 2022 },
  { title: 'Linguagem de Modelagem Unificada — UML', issuer: 'Fundação Bradesco — Escola Virtual', year: 2021 },
  { title: 'Webinar LGPD — Lei Geral de Proteção de Dados Pessoais', issuer: 'Unileão', year: 2020 },
  { title: 'Introdução à Linguagem CSS', issuer: 'Alfahelix', year: 2020 },
  { title: 'Introdução à Linguagem HTML', issuer: 'Alfahelix', year: 2020 },
  { title: 'Jogos Matemáticos — A Lógica por Trás dos Jogos', issuer: 'Unileão', year: 2019 },
  { title: 'Unileão Científico e II Jornada de Educação para a Sustentabilidade', issuer: 'Unileão', year: 2019 },
  { title: 'Google Apps como Ferramenta Colaborativa para Pesquisa Científica', issuer: 'Unileão', year: 2019 },
  { title: 'Seminário Interdisciplinar Empreendedorismo e Inovação', issuer: 'Unileão', year: 2019 },
  { title: 'Palestra Comemorativa ao Dia do Analista de Sistemas 2019.2', issuer: 'Unileão', year: 2019 },
  { title: 'I Fórum de Sustentabilidade dos Cursos de Análise e Desenvolvimento de Sistemas e Serviço Social', issuer: 'Unileão', year: 2019 },
  { title: 'XVI Mostra de Projetos Integradores', issuer: 'Unileão', year: 2019 },
  { title: 'Treinamento Online em Java', issuer: 'Polo Tech' },
]
