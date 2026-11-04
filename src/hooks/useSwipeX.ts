import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";

interface UseSwipeXOptions {
  /** Anchura de la zona de acciones que queda al descubierto. */
  actionWidth: number;
  /** Margen extra de arrastre más allá de las acciones. */
  overshoot: number;
  /** Divisor del umbral de apertura (actionWidth / snapDivisor). */
  snapDivisor: number;
  /** Toque sin arrastre (con las acciones cerradas). */
  onTap: () => void;
  disabled?: boolean;
}

interface UseSwipeXResult {
  dx: number;
  /** Cierra las acciones de esta fila. */
  close: () => void;
  /** true mientras el puntero arrastra: desactiva la transición CSS. */
  active: boolean;
  handlers: {
    onPointerDown: (e: PointerEvent<HTMLElement>) => void;
    onPointerMove: (e: PointerEvent<HTMLElement>) => void;
    onPointerUp: () => void;
    onPointerCancel: () => void;
  };
}

/** Movimiento (px) a partir del cual el gesto deja de ser un toque. */
const TAP_SLOP = 8;

/** Cierra la fila con las acciones abiertas: solo puede haber una a la vez. */
let closeOpenRow: (() => void) | null = null;

/**
 * Gesto de deslizar horizontal (Pointer Events: táctil y ratón): arrastrar a la
 * izquierda revela acciones; un toque sin arrastre cierra las acciones si están
 * abiertas o dispara onTap si están cerradas.
 *
 * Con `touch-action: pan-y`, al desplazar la lista con el dedo el navegador
 * cancela el gesto (pointercancel): eso nunca cuenta como toque.
 */
export function useSwipeX({
  actionWidth,
  overshoot,
  snapDivisor,
  onTap,
  disabled = false,
}: UseSwipeXOptions): UseSwipeXResult {
  const [dx, setDx] = useState(0);
  const drag = useRef({
    startX: 0,
    startY: 0,
    baseDx: 0,
    moved: false,
    horizontal: false,
    active: false,
    /** El gesto ha servido para cerrar otra fila: no cuenta como toque. */
    suppressTap: false,
  });

  const close = useCallback((): void => {
    setDx(0);
    if (closeOpenRow === close) closeOpenRow = null;
  }, []);

  useEffect(
    () => () => {
      if (closeOpenRow === close) closeOpenRow = null;
    },
    [close],
  );

  const onPointerDown = (e: PointerEvent<HTMLElement>): void => {
    if (disabled) return;
    const closeOther = closeOpenRow !== close ? closeOpenRow : null;
    closeOther?.();
    drag.current = {
      startX: e.clientX,
      startY: e.clientY,
      baseDx: dx,
      moved: false,
      horizontal: false,
      active: true,
      suppressTap: closeOther !== null,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent<HTMLElement>): void => {
    const d = drag.current;
    if (!d.active) return;
    const deltaX = e.clientX - d.startX;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(e.clientY - d.startY);
    if (absX > TAP_SLOP || absY > TAP_SLOP) d.moved = true;
    if (!d.horizontal) {
      if (absX <= TAP_SLOP || absX <= absY) return;
      d.horizontal = true;
    }
    setDx(Math.min(0, Math.max(-actionWidth - overshoot, d.baseDx + deltaX)));
  };

  const onPointerUp = (): void => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    if (!d.moved) {
      if (dx < -10) close();
      else if (!d.suppressTap) onTap();
      return;
    }
    if (dx < -actionWidth / snapDivisor) {
      setDx(-actionWidth);
      closeOpenRow = close;
    } else {
      close();
    }
  };

  const onPointerCancel = (): void => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    setDx(d.baseDx);
  };

  return {
    dx,
    close,
    active: drag.current.active,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel },
  };
}
