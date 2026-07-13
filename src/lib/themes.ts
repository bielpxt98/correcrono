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

export type ColorId =
  | "laranja"
  | "azul"
  | "verde"
  | "roxo"
  | "vermelho"
  | "dourado"
  | "rosa"
  | "cinza";

export type LayoutOption = {
  id: LayoutId;
  name: string;
  description: string;
  structure: string;
  previewBg: string;
  accent: string;
};

export type FontOption = {
  id: FontId;
  name: string;
  description: string;
  cssVar: string;
};

export type ColorOption = {
  id: ColorId;
  name: string;
  description: string;
  /** CSS vars aplicadas na home */
  vars: {
    brand: string;
    brandDark: string;
    brandSoft: string;
    background: string;
    foreground: string;
    card: string;
    card2: string;
    muted: string;
    border: string;
  };
};

export const LAYOUTS: LayoutOption[] = [
  {
    id: "bilheteria",
    name: "Bilheteria",
    description: "Foto de fundo, título à esquerda e card de ingresso à direita.",
    structure: "Hero foto + letreiro + card | galeria",
    previewBg: "#0b0c10",
    accent: "#ff4d00",
  },
  {
    id: "poster",
    name: "Cartaz central",
    description: "Título e botão no centro sobre a foto. Galeria em grade.",
    structure: "Foto full | título centro | grade",
    previewBg: "#111827",
    accent: "#38bdf8",
  },
  {
    id: "vitrine",
    name: "Vitrine de fotos",
    description: "Faixa de fotos no topo, depois título + ingresso.",
    structure: "Faixa fotos | título + card",
    previewBg: "#f8fafc",
    accent: "#0ea5e9",
  },
  {
    id: "revista",
    name: "Revista",
    description: "Título no topo, ingresso no meio, mosaico de fotos.",
    structure: "Letreiro | ingresso | mosaico",
    previewBg: "#0f172a",
    accent: "#d4a017",
  },
  {
    id: "catalogo",
    name: "Catálogo",
    description: "Ingresso em destaque no topo, fotos em colunas.",
    structure: "Card top | 2 colunas fotos",
    previewBg: "#fafafa",
    accent: "#171717",
  },
];

export const FONTS: FontOption[] = [
  { id: "geist", name: "Geist", description: "Padrão moderno", cssVar: "var(--font-geist-sans)" },
  { id: "montserrat", name: "Montserrat", description: "Esportiva", cssVar: "var(--font-montserrat)" },
  { id: "oswald", name: "Oswald", description: "Títulos fortes", cssVar: "var(--font-oswald)" },
  { id: "playfair", name: "Playfair", description: "Elegante", cssVar: "var(--font-playfair)" },
  { id: "space", name: "Space Grotesk", description: "Tech", cssVar: "var(--font-space)" },
  { id: "roboto", name: "Roboto", description: "Neutra", cssVar: "var(--font-roboto)" },
];

export const COLORS: ColorOption[] = [
  {
    id: "laranja",
    name: "Laranja bilheteria",
    description: "Escuro com laranja (padrão)",
    vars: {
      brand: "#ff4d00",
      brandDark: "#e04400",
      brandSoft: "#ff7a3d",
      background: "#0b0c10",
      foreground: "#f8fafc",
      card: "#14161c",
      card2: "#1a1d26",
      muted: "#94a3b8",
      border: "#2a2f3a",
    },
  },
  {
    id: "azul",
    name: "Azul corrida",
    description: "Fundo escuro e azul vivo",
    vars: {
      brand: "#2563eb",
      brandDark: "#1d4ed8",
      brandSoft: "#60a5fa",
      background: "#0b1220",
      foreground: "#f8fafc",
      card: "#132033",
      card2: "#1a2a42",
      muted: "#94a3b8",
      border: "#2a3f5f",
    },
  },
  {
    id: "verde",
    name: "Verde esporte",
    description: "Preto com verde limão",
    vars: {
      brand: "#84cc16",
      brandDark: "#65a30d",
      brandSoft: "#a3e635",
      background: "#050505",
      foreground: "#f4f4f5",
      card: "#121212",
      card2: "#1a1a1a",
      muted: "#a1a1aa",
      border: "#27272a",
    },
  },
  {
    id: "roxo",
    name: "Roxo noturno",
    description: "Roxo e fundo escuro",
    vars: {
      brand: "#a855f7",
      brandDark: "#9333ea",
      brandSoft: "#c084fc",
      background: "#0c0a14",
      foreground: "#faf5ff",
      card: "#1a1428",
      card2: "#241b36",
      muted: "#a78bfa",
      border: "#3b2f55",
    },
  },
  {
    id: "vermelho",
    name: "Vermelho energia",
    description: "Vermelho forte",
    vars: {
      brand: "#ef4444",
      brandDark: "#dc2626",
      brandSoft: "#f87171",
      background: "#0c0a0a",
      foreground: "#fef2f2",
      card: "#1c1212",
      card2: "#2a1818",
      muted: "#a8a29e",
      border: "#3f2a2a",
    },
  },
  {
    id: "dourado",
    name: "Dourado premium",
    description: "Marinho e dourado",
    vars: {
      brand: "#d4a017",
      brandDark: "#b8860b",
      brandSoft: "#f0c14b",
      background: "#0b1220",
      foreground: "#f8fafc",
      card: "#132033",
      card2: "#1a2a42",
      muted: "#94a3b8",
      border: "#2a3f5f",
    },
  },
  {
    id: "rosa",
    name: "Rosa moderno",
    description: "Fundo claro e rosa",
    vars: {
      brand: "#db2777",
      brandDark: "#be185d",
      brandSoft: "#f472b6",
      background: "#fdf2f8",
      foreground: "#1f0a14",
      card: "#ffffff",
      card2: "#fce7f3",
      muted: "#9d174d",
      border: "#fbcfe8",
    },
  },
  {
    id: "cinza",
    name: "Cinza minimal",
    description: "Preto, branco e cinza",
    vars: {
      brand: "#171717",
      brandDark: "#000000",
      brandSoft: "#525252",
      background: "#fafafa",
      foreground: "#0a0a0a",
      card: "#ffffff",
      card2: "#f5f5f5",
      muted: "#737373",
      border: "#e5e5e5",
    },
  },
];

export function isLayoutId(v: unknown): v is LayoutId {
  return LAYOUTS.some((l) => l.id === v);
}

export function isFontId(v: unknown): v is FontId {
  return FONTS.some((f) => f.id === v);
}

export function isColorId(v: unknown): v is ColorId {
  return COLORS.some((c) => c.id === v);
}

export function resolveLayout(v: unknown): LayoutId {
  if (v === "light" || v === "minimal") return "vitrine";
  if (v === "neon") return "poster";
  if (v === "classic") return "revista";
  return isLayoutId(v) ? v : "bilheteria";
}

export function resolveFont(v: unknown): FontId {
  return isFontId(v) ? v : "geist";
}

export function resolveColor(v: unknown): ColorId {
  return isColorId(v) ? v : "laranja";
}

export function getColorOption(id: unknown): ColorOption {
  const resolved = resolveColor(id);
  return COLORS.find((c) => c.id === resolved)!;
}

/** Estilo inline das CSS vars da paleta (sobrescreve layout) */
export function colorVarsStyle(id: unknown): React.CSSProperties {
  const c = getColorOption(id).vars;
  return {
    ["--brand" as string]: c.brand,
    ["--brand-dark" as string]: c.brandDark,
    ["--brand-soft" as string]: c.brandSoft,
    ["--background" as string]: c.background,
    ["--foreground" as string]: c.foreground,
    ["--card" as string]: c.card,
    ["--card-2" as string]: c.card2,
    ["--muted" as string]: c.muted,
    ["--border" as string]: c.border,
  } as React.CSSProperties;
}
