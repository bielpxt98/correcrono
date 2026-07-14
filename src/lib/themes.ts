export type LayoutId =
  | "bilheteria"
  | "poster"
  | "vitrine"
  | "revista"
  | "catalogo"
  | "neon"
  | "split"
  | "stadium"
  | "magazine";

export type FontId =
  | "geist"
  | "montserrat"
  | "oswald"
  | "playfair"
  | "space"
  | "roboto"
  | "poppins"
  | "bebas"
  | "raleway"
  | "lora"
  | "barlow"
  | "inter";

export type ColorId =
  | "laranja"
  | "azul"
  | "verde"
  | "roxo"
  | "vermelho"
  | "dourado"
  | "rosa"
  | "cinza"
  | "ciano"
  | "coral"
  | "midnight"
  | "amarelo"
  | "teal"
  | "indigo"
  | "branco"
  | "fogo";

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
  family: string;
};

export type ColorOption = {
  id: ColorId;
  name: string;
  description: string;
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
    name: "Capa + letreiro",
    description:
      "Foto de capa sempre atrás do título da corrida, com card de ingresso à direita.",
    structure: "Capa full | título + ingresso",
    previewBg: "#0b0c10",
    accent: "#ff6a1a",
  },
  {
    id: "poster",
    name: "Noturno cinematográfico",
    description:
      "Foto full-bleed, título grande embaixo, pílulas de categoria e Saiba Mais.",
    structure: "Foto full | título inferior | pílulas",
    previewBg: "#050508",
    accent: "#ffffff",
  },
  {
    id: "revista",
    name: "Elegante central",
    description:
      "Card flutuante com nav, título sobre a foto, faixas de info e galeria.",
    structure: "Nav | foto + título | info | galeria",
    previewBg: "#12141a",
    accent: "#e8e0d4",
  },
  {
    id: "neon",
    name: "Neon esporte",
    description:
      "Capa escura com título neon, faixa de stats e botão de destaque.",
    structure: "Capa | título neon | stats | CTA",
    previewBg: "#0a0a12",
    accent: "#22d3ee",
  },
  {
    id: "split",
    name: "Split foto/texto",
    description:
      "Metade capa, metade painel com título, dados e ingresso.",
    structure: "50% capa | 50% conteúdo",
    previewBg: "#0f172a",
    accent: "#f97316",
  },
  {
    id: "stadium",
    name: "Estádio wide",
    description:
      "Capa panorâmica, título centralizado e categorias em fileira.",
    structure: "Capa wide | título centro | categorias",
    previewBg: "#111827",
    accent: "#fbbf24",
  },
  {
    id: "magazine",
    name: "Revista editorial",
    description:
      "Capa como capa de revista, número do ano e texto editorial.",
    structure: "Capa revista | ano | texto | ingresso",
    previewBg: "#1c1917",
    accent: "#e7e5e4",
  },
  {
    id: "vitrine",
    name: "Vitrine de fotos",
    description: "Faixa de fotos no topo; título sobre a capa do evento.",
    structure: "Faixa fotos | capa + título + card",
    previewBg: "#0b0c10",
    accent: "#0ea5e9",
  },
  {
    id: "catalogo",
    name: "Catálogo",
    description: "Capa no topo com título, ingresso e grade de fotos.",
    structure: "Capa + título | card | grade",
    previewBg: "#0b0c10",
    accent: "#a3a3a3",
  },
];

export const FONTS: FontOption[] = [
  {
    id: "geist",
    name: "Geist",
    description: "Padrão moderno",
    cssVar: "var(--font-geist-sans)",
    family: "var(--font-geist-sans), system-ui, sans-serif",
  },
  {
    id: "montserrat",
    name: "Montserrat",
    description: "Esportiva",
    cssVar: "var(--font-montserrat)",
    family: "var(--font-montserrat), 'Montserrat', system-ui, sans-serif",
  },
  {
    id: "oswald",
    name: "Oswald",
    description: "Títulos fortes",
    cssVar: "var(--font-oswald)",
    family: "var(--font-oswald), 'Oswald', system-ui, sans-serif",
  },
  {
    id: "playfair",
    name: "Playfair",
    description: "Elegante",
    cssVar: "var(--font-playfair)",
    family: "var(--font-playfair), 'Playfair Display', Georgia, serif",
  },
  {
    id: "space",
    name: "Space Grotesk",
    description: "Tech",
    cssVar: "var(--font-space)",
    family: "var(--font-space), 'Space Grotesk', system-ui, sans-serif",
  },
  {
    id: "roboto",
    name: "Roboto",
    description: "Neutra",
    cssVar: "var(--font-roboto)",
    family: "var(--font-roboto), 'Roboto', system-ui, sans-serif",
  },
  {
    id: "poppins",
    name: "Poppins",
    description: "Arredondada",
    cssVar: "var(--font-poppins)",
    family: "var(--font-poppins), 'Poppins', system-ui, sans-serif",
  },
  {
    id: "bebas",
    name: "Bebas Neue",
    description: "Impacto",
    cssVar: "var(--font-bebas)",
    family: "var(--font-bebas), 'Bebas Neue', Impact, sans-serif",
  },
  {
    id: "raleway",
    name: "Raleway",
    description: "Leve e fina",
    cssVar: "var(--font-raleway)",
    family: "var(--font-raleway), 'Raleway', system-ui, sans-serif",
  },
  {
    id: "lora",
    name: "Lora",
    description: "Serif clássica",
    cssVar: "var(--font-lora)",
    family: "var(--font-lora), 'Lora', Georgia, serif",
  },
  {
    id: "barlow",
    name: "Barlow Condensed",
    description: "Compacta",
    cssVar: "var(--font-barlow)",
    family: "var(--font-barlow), 'Barlow Condensed', system-ui, sans-serif",
  },
  {
    id: "inter",
    name: "Inter",
    description: "UI limpa",
    cssVar: "var(--font-inter)",
    family: "var(--font-inter), 'Inter', system-ui, sans-serif",
  },
];

export function getFontFamily(id: unknown): string {
  const f = resolveFont(id);
  return FONTS.find((x) => x.id === f)!.family;
}

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
  {
    id: "ciano",
    name: "Ciano neon",
    description: "Escuro com ciano",
    vars: {
      brand: "#06b6d4",
      brandDark: "#0891b2",
      brandSoft: "#22d3ee",
      background: "#020617",
      foreground: "#ecfeff",
      card: "#0f172a",
      card2: "#1e293b",
      muted: "#94a3b8",
      border: "#334155",
    },
  },
  {
    id: "coral",
    name: "Coral sunset",
    description: "Coral e fundo escuro",
    vars: {
      brand: "#f97316",
      brandDark: "#ea580c",
      brandSoft: "#fb923c",
      background: "#1c0a00",
      foreground: "#fff7ed",
      card: "#292524",
      card2: "#3f3a36",
      muted: "#a8a29e",
      border: "#57534e",
    },
  },
  {
    id: "midnight",
    name: "Meia-noite",
    description: "Azul profundo",
    vars: {
      brand: "#3b82f6",
      brandDark: "#1d4ed8",
      brandSoft: "#93c5fd",
      background: "#020617",
      foreground: "#f8fafc",
      card: "#0f172a",
      card2: "#1e293b",
      muted: "#64748b",
      border: "#1e3a5f",
    },
  },
  {
    id: "amarelo",
    name: "Amarelo largada",
    description: "Preto e amarelo",
    vars: {
      brand: "#eab308",
      brandDark: "#ca8a04",
      brandSoft: "#facc15",
      background: "#0a0a0a",
      foreground: "#fefce8",
      card: "#171717",
      card2: "#262626",
      muted: "#a3a3a3",
      border: "#404040",
    },
  },
  {
    id: "teal",
    name: "Teal outdoor",
    description: "Verde-água",
    vars: {
      brand: "#14b8a6",
      brandDark: "#0d9488",
      brandSoft: "#5eead4",
      background: "#042f2e",
      foreground: "#f0fdfa",
      card: "#134e4a",
      card2: "#115e59",
      muted: "#99f6e4",
      border: "#2dd4bf55",
    },
  },
  {
    id: "indigo",
    name: "Índigo elite",
    description: "Roxo-azul elegante",
    vars: {
      brand: "#6366f1",
      brandDark: "#4f46e5",
      brandSoft: "#a5b4fc",
      background: "#0c0a1a",
      foreground: "#eef2ff",
      card: "#1e1b4b",
      card2: "#312e81",
      muted: "#a5b4fc",
      border: "#4338ca55",
    },
  },
  {
    id: "branco",
    name: "Branco clean",
    description: "Claro com destaque",
    vars: {
      brand: "#ea580c",
      brandDark: "#c2410c",
      brandSoft: "#fb923c",
      background: "#ffffff",
      foreground: "#0f172a",
      card: "#f8fafc",
      card2: "#f1f5f9",
      muted: "#64748b",
      border: "#e2e8f0",
    },
  },
  {
    id: "fogo",
    name: "Fogo urbano",
    description: "Vermelho e laranja",
    vars: {
      brand: "#ff3d00",
      brandDark: "#dd2c00",
      brandSoft: "#ff6e40",
      background: "#120600",
      foreground: "#fff3e0",
      card: "#1a0a00",
      card2: "#2d1200",
      muted: "#ffab91",
      border: "#bf360c55",
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
  if (v === "neon-old") return "neon";
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
