/**
 * Paleta oficial de Tralap (fuente de verdad: tralap-mockup-v6.jsx).
 * Los mismos valores están registrados como tokens en tailwind.config.ts.
 */
export const C = {
  negro: "#141414", // superficies fuertes y texto principal
  gris: "#55555A", // texto secundario
  grisSuave: "#A3A3A8", // detalles apagados
  fondo: "#F4F4F5", // fondo gris clarito neutro
  linea: "#E5E5E8", // bordes
  blanco: "#FFFFFF",
  marron: "#A9805B", // acento — SOLO detalles (iconos, progreso, badges)
  verde: "#5B7B54",
  rojo: "#C24C34",
} as const;

/** Verde claro usado en el anillo/segmento del modo vuelta. */
export const VERDE_CLARO = "#8FBC85";
