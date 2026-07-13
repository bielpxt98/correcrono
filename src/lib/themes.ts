export type LayoutId =
  | "bilheteria"
  | "poster"
  | "vitrine"
  | "revista"
  | "catalogo";

export type FontId =
  | "geist"
  | "montserrat"
  | "oswald"
  | "playfair"
  | "space"
  | "roboto";

export type LayoutOption = {
  id: LayoutId;
  name: string;
  description: string;
  /** Onde ficam as peças — para o admin entender */
  structure: string;
  /** Cores da mini-prévia no admin */
  previewBg: string;
  accent: string;
};

export type FontOption = {
  id: FontId;
  name: string;
  description: string;
  cssVar: string;
};

export const LAYOUTS: LayoutOption[] = [
  {
    id: "bilheteria",
    name: "Bilheteria",
    description: "Foto de fundo em tela cheia, título à esquerda e card de ingresso à direita.",
    structure: "Hero foto + letreiro + card ingresso | galeria embaixo",
    previewBg: "#0b0c10",
    accent: "#ff4d00",
  },
  {
    id: "poster",
    name: "Cartaz central",
    description: "Letreiro e botão no centro sobre a foto. Galeria em grade embaixo.",
    structure: "Foto full | título centro | botão | grade de fotos",
    previewBg: "#111827",
    accent: "#38bdf8",
  },
  {
    id: "vitrine",
    name: "Vitrine de fotos",
    description: "Faixa de fotos no topo, depois título + ingresso lado a lado.",
    structure: "Faixa fotos | título + card | sobre + regulamento",
    previewBg: "#f8fafc",
    accent: "#0ea5e9",
  },
  {
    id: "revista",
    name: "Revista",
    description: "Título grande no topo, card de ingresso embaixo, fotos em mosaico.",
    structure: "Letreiro top | ingresso | mosaico de fotos | textos",
    previewBg: "#0f172a",
    accent: "#d4a017",
  },
  {
    id: "catalogo",
    name: "Catálogo",
    description: "Ingresso em destaque no topo, fotos em colunas, textos depois.",
    structure: "Card ingresso top | 2 colunas fotos | sobre",
    previewBg: "#fafafa",
    accent: "#171717",
  },
];

export const FONTS: FontOption[] = [
  {
    id: "geist",
    name: "Geist",
    description: "Padrão moderno",
    cssVar: "var(--font-geist-sans)",
  },
  {
    id: "montserrat",
    name: "Montserrat",
    description: "Esportiva e limpa",
    cssVar: "var(--font-montserrat)",
  },
  {
    id: "oswald",
    name: "Oswald",
    description: "Títulos fortes",
    cssVar: "var(--font-oswald)",
  },
  {
    id: "playfair",
    name: "Playfair",
    description: "Elegante / premium",
    cssVar: "var(--font-playfair)",
  },
  {
    id: "space",
    name: "Space Grotesk",
    description: "Tech e atual",
    cssVar: "var(--font-space)",
  },
  {
    id: "roboto",
    name: "Roboto",
    description: "Neutra e legível",
    cssVar: "var(--font-roboto)",
  },
];

export function isLayoutId(v: unknown): v is LayoutId {
  return LAYOUTS.some((l) => l.id === v);
}

export function isFontId(v: unknown): v is FontId {
  return FONTS.some((f) => f.id === v);
}

export function resolveLayout(v: unknown): LayoutId {
  // migra IDs antigos de cor-only
  if (v === "light" || v === "minimal") return "vitrine";
  if (v === "neon") return "poster";
  if (v === "classic") return "revista";
  return isLayoutId(v) ? v : "bilheteria";
}

export function resolveFont(v: unknown): FontId {
  return isFontId(v) ? v : "geist";
}
