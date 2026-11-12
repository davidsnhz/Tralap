import type { CSSProperties } from "react";
import { C } from "../../theme/colors";
import { SHADOW } from "../../theme/tokens";

/** Superficie de una fila de lista: tarjeta blanca, o hundida en el fondo si está hecha. */
export const rowSurface = (done: boolean): CSSProperties => ({
  background: done ? C.offWhite : C.white,
  border: `1px solid ${done ? "transparent" : C.taupe}`,
  borderRadius: 14,
  boxShadow: done ? "none" : SHADOW.row,
});
