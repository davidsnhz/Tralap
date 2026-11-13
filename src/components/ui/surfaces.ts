import type { CSSProperties } from "react";
import { C } from "../../theme/colors";

/** Superficie de una fila de lista: blanca con borde fino, o rellena en Mist si está hecha. */
export const rowSurface = (done: boolean): CSSProperties => ({
  background: done ? C.mist : C.white,
  border: `1px solid ${done ? "transparent" : C.line}`,
  borderRadius: 14,
});
