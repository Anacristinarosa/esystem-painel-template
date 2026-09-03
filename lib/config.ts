// ============================================================
// CONFIGURAÇÃO DA TUA PLATAFORMA
// ------------------------------------------------------------
// A skill /esystem-painel preenche isto a partir do teu
// desenho da Missão 2 e do arquétipo que escolheres
// (Relação ou Leitura) — ou perguntando-te ali mesmo.
// Edita à mão sempre que quiseres afinar textos.
// ============================================================

export const PLATAFORMA = {
  /** Nome que aparece no topo, no separador do browser e como título grande no login */
  nome: "eSystem",

  /** Iniciais (1-3 letras) para o logo pequeno */
  iniciais: "eS",

  /** Marca-mãe (chapéu pequeno acima do nome grande no login) — deixa string vazia para esconder */
  marcaMae: "A MINHA ESCOLA",

  /** Frase-âncora — aparece na landing pública, no primeiro ecrã */
  fraseAncora: "Os teus dossiers, num só sítio.",

  /** Subtítulo curto — aparece na landing por baixo da frase-âncora */
  subtitulo: "Entra e vê onde estás — tudo o que precisas está aqui.",

  /** Nome de quem tu és — a founder/profissional atrás da plataforma */
  founder: {
    nome: "A Founder",
    email: "tu@teudominio.pt",
  },

  /** Password inicial que dás aos clientes para o primeiro login. */
  passwordInicial: "muda-me-2026",

  /**
   * Arquétipo escolhido — "relacao" (tipo Monteiro) ou "leitura" (tipo Silva).
   * A skill /esystem-painel afina os defaults abaixo consoante este valor.
   * Editar aqui é possível, mas se quiseres trocar de arquétipo é mais
   * limpo pedir à skill.
   */
  arquetipo: "relacao" as "relacao" | "leitura",

  /**
   * As 4 peças possíveis do portal do cliente. Ativa só as que fazem sentido.
   * O menu do cliente e o admin mostram só as peças ativas. A skill
   * /esystem-painel preenche isto a partir do arquétipo.
   */
  pecas: {
    /** Dossiers do cliente com estado editável pela founder (pipeline) */
    dossiers: true,
    /** KPIs custom por cliente + leitura interpretativa lado a lado */
    numeros: false,
    /** PDFs/ficheiros trocados entre founder e cliente */
    documentos: true,
    /** Mensagens assíncronas founder ↔ cliente sobre o dossier */
    notas: true,
  },

  /**
   * Peça âncora — a que abre em destaque na Home do cliente. As outras
   * ficam como atalhos por baixo. Tem de ser uma das peças ativas acima.
   */
  ancora: "dossiers" as "dossiers" | "numeros" | "documentos" | "notas",

  /**
   * Estados possíveis de um dossier. A ordem define o pipeline visual
   * (esquerda → direita). O primeiro é o default quando a founder cria
   * um dossier novo.
   */
  estadosDossier: ["Análise", "Proposta", "Assinatura", "Ativo"] as string[],

  /**
   * Nomes que aparecem no menu e no dashboard para cada peça.
   * Personaliza pela tua voz.
   */
  labels: {
    dossiers: "Os teus dossiers",
    numeros: "Números",
    documentos: "Documentos",
    notas: "Notas do processo",
  },
} as const;

export type PecaKey = keyof typeof PLATAFORMA.pecas;
