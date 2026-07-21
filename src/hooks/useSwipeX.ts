import { useRef, useState } from "react";
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
  setDx: (dx: number) => void;
  /** true mientras el puntero arrastra: desactiva la transición CSS. */
  active: boolean;
  handlers: {
    onPointerDown: (e: PointerEvent<HTMLElement>) => void;
    onPointerMove: (e: PointerEvent<HTMLElement>) => void;
    onPointerUp: () => void;
    onPointerCancel: () => void;
  };
}

/**
 * Gesto de deslizar horizontal (Pointer Events: táctil y ratón), idéntico al
 * del mockup: arrastrar a la izquierda revela acciones; un toque sin arrastre
 * cierra las acciones si están abiertas o dispara onTap si están cerradas.
 */
export function useSwipeX({
  actionWidth,
  overshoot,
  snapDivisor,
  onTap,
  disabled = false,
}: UseSwipeXOptions): UseSwipeXResult {
  const [dx, setDx] = useState(0);
  const drag = useRef({ startX: 0, baseDx: 0, moved: false, active: false });

  const onPointerDown = (e: PointerEvent<HTMLElement>): void => {
    if (disabled) return;
    drag.current = { startX: e.clientX, baseDx: dx, moved: false, active: true };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent<HTMLElement>): void => {
    if (!drag.current.active) return;
    const delta = e.clientX - drag.current.startX;
    if (Math.abs(delta) > 6) drag.current.moved = true;
    setDx(
      Math.min(0, Math.max(-actionWidth - overshoot, drag.current.baseDx + delta)),
    );
  };

  const onPointerUp = (): void => {
    if (!drag.current.active) return;
    drag.current.active = false;
    if (!drag.current.moved) {
      if (dx < -10) setDx(0);
      else onTap();
      return;
    }
    setDx(dx < -actionWidth / snapDivisor ? -actionWidth : 0);
  };

  return {
    dx,
    setDx,
    active: drag.current.active,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp },
  };
}
