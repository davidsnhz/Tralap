import { C } from "./colors";

const rgb = (hex: string): string =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(",");

/** Negro con transparencia: sombras y el velo tras las hojas. */
export const shade = (alpha: number): string => `rgba(${rgb(C.ink)},${alpha})`;

/** Blanco con transparencia: detalles sobre la cabecera oscura del viaje. */
export const veil = (alpha: number): string => `rgba(${rgb(C.white)},${alpha})`;

export const FONT = {
  /** Solo títulos: nombre de la app, de los viajes y de las hojas. */
  display: "'Space Grotesk', sans-serif",
  /** Todo lo demás, botones incluidos. */
  body: "'Inter', sans-serif",
} as const;

export const EASE = {
  /** Salida suave: casi todo el movimiento de la app. */
  out: "cubic-bezier(.22,1,.36,1)",
  /** Pequeño rebote: chips que se activan. */
  spring: "cubic-bezier(.34,1.3,.64,1)",
} as const;

export const SHADOW = {
  card: `0 1px 2px ${shade(0.04)}`,
  /** Píldora blanca del selector. */
  raised: `0 1px 2px ${shade(0.1)}, 0 0 0 1px ${shade(0.04)}`,
  menu: `0 2px 6px ${shade(0.06)}, 0 12px 32px ${shade(0.14)}`,
  knob: `0 1px 3px ${shade(0.22)}`,
  logo: `0 1px 3px ${shade(0.16)}`,
  app: `0 0 0 1px ${C.line}, 0 24px 64px ${shade(0.08)}`,
} as const;

/** Botón principal: Walnut a todo el ancho y plano. Se apaga en Mist si no se puede pulsar. */
export const primaryButton = (enabled = true) =>
  ({
    width: "100%",
    padding: "16px 0",
    borderRadius: 14,
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontSize: 15,
    fontWeight: 600,
    fontFamily: FONT.body,
    background: enabled ? C.walnut : C.mist,
    color: enabled ? C.white : C.gray,
    cursor: enabled ? "pointer" : "default",
    transition: "background .25s, color .25s, transform .15s",
  }) as const;
