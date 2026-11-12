import { C } from "./colors";

const rgb = (hex: string): string =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(",");

/** Walnut con transparencia: sombras y velos. */
export const shade = (alpha: number): string => `rgba(${rgb(C.walnut)},${alpha})`;

/** Blanco con transparencia: detalles sobre la cabecera Walnut. */
export const veil = (alpha: number): string => `rgba(${rgb(C.white)},${alpha})`;

export const FONT = {
  display: "'Space Grotesk', sans-serif",
  body: "'Inter', sans-serif",
} as const;

export const EASE = {
  /** Salida suave: casi todo el movimiento de la app. */
  out: "cubic-bezier(.22,1,.36,1)",
  /** Pequeño rebote: chips que se activan. */
  spring: "cubic-bezier(.34,1.3,.64,1)",
} as const;

export const SHADOW = {
  row: `0 1px 2px ${shade(0.04)}`,
  card: `0 2px 8px ${shade(0.05)}`,
  raised: `0 4px 12px ${shade(0.22)}`,
  cta: `0 6px 16px ${shade(0.25)}`,
  knob: `0 1px 3px ${shade(0.25)}`,
  logo: `0 1px 4px ${shade(0.28)}`,
  app: `0 0 60px ${shade(0.3)}`,
} as const;
