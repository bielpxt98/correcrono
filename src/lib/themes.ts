export type LayoutId =
  | "bilheteria"
  | "light"
  | "neon"
  | "classic"
  | "minimal";

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
  preview: string; // gradient CSS for admin cards
};

export type FontOption = {
  id: FontId;
  name: string;
  description: string;
  cssVar: string;
  className: string;
};

export const LAYOUTS: LayoutOption[] = [
  {
    id: "bilheteria",
    name: "Bilheteria",
    description: "Escuro + laranja (estilo ingresso digital)",
    preview: "linear-gradient(135deg,#0b0c10,#ff4d00)",
  },
  {
    id: "light",
    name: "Claro",
    description: "Fundo claro, limpo e profissional",
    preview: "linear-gradient(135deg,#f8fafc,#0ea5e9)",
  },
  {
    id: "neon",
    name: "Neon esporte",
    description: "Preto com verde limão / energia de corrida",
    preview: "linear-gradient(135deg,#050505,#a3e635)",
  },
  {
    id: "classic",
    name: "Clássico",
    description: "Azul-marinho e dourado (evento premium)",
    preview: "linear-gradient(135deg,#0f172a,#d4a017)",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Preto e branco, tipografia em destaque",
    preview: "linear-gradient(135deg,#111,#fff)",
  },
];

export const FONTS: FontOption[] = [
  {
    id: "geist",
    name: "Geist",
    description: "Padrão moderno (atual)",
    cssVar: "var(--font-geist-sans)",
    className: "font-theme-geist",
  },
  {
    id: "montserrat",
    name: "Montserrat",
    description: "Limpa e esportiva",
    cssVar: "var(--font-montserrat)",
    className: "font-theme-montserrat",
  },
  {
    id: "oswald",
    name: "Oswald",
    description: "Títulos fortes de corrida",
    cssVar: "var(--font-oswald)",
    className: "font-theme-oswald",
  },
  {
    id: "playfair",
    name: "Playfair",
    description: "Elegante / premium",
    cssVar: "var(--font-playfair)",
    className: "font-theme-playfair",
  },
  {
    id: "space",
    name: "Space Grotesk",
    description: "Tecnológica e atual",
    cssVar: "var(--font-space)",
    className: "font-theme-space",
  },
  {
    id: "roboto",
    name: "Roboto",
    description: "Neutra e legível",
    cssVar: "var(--font-roboto)",
    className: "font-theme-roboto",
  },
];

export function isLayoutId(v: unknown): v is LayoutId {
  return LAYOUTS.some((l) => l.id === v);
}

export function isFontId(v: unknown): v is FontId {
  return FONTS.some((f) => f.id === v);
}

export function resolveLayout(v: unknown): LayoutId {
  return isLayoutId(v) ? v : "bilheteria";
}

export function resolveFont(v: unknown): FontId {
  return isFontId(v) ? v : "geist";
}
