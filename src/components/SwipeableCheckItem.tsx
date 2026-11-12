import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useSwipeX } from "../hooks/useSwipeX";
import { C } from "../theme/colors";
import { EASE } from "../theme/tokens";
import type { Item } from "../types";
import { ItemContent } from "./ItemContent";
import { SwipeAction } from "./ui/SwipeAction";
import { rowSurface } from "./ui/surfaces";

const ITEM_ACTION_W = 74;

interface SwipeableCheckItemProps {
  item: Item;
  onToggle: () => void;
  onDelete: () => void;
  delay?: number;
  /** Modo edición: papelera a la vista, sin gestos ni marcado. */
  editing?: boolean;
}

/* Fila de checklist deslizable: toque = marcar, deslizar izq. = eliminar */
export function SwipeableCheckItem({
  item,
  onToggle,
  onDelete,
  delay = 0,
  editing = false,
}: SwipeableCheckItemProps) {
  const [removing, setRemoving] = useState(false);
  const { dx: swipeDx, active, handlers } = useSwipeX({
    actionWidth: ITEM_ACTION_W,
    overshoot: 16,
    snapDivisor: 2,
    onTap: onToggle,
    disabled: editing,
  });
  const dx = editing ? 0 : swipeDx;

  const handleDelete = (): void => {
    setRemoving(true);
    setTimeout(onDelete, 300);
  };

  return (
    <div
      className={`tpl-row anim-rise ${removing ? "removing" : ""}`}
      style={{ animationDelay: `${delay}ms`, position: "relative", marginBottom: 8 }}
    >
      {/* Acción eliminar oculta detrás */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "flex-end",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <SwipeAction icon={Trash2} label="Eliminar" onClick={handleDelete} visible={dx < -25} tone="danger" size="row" />
      </div>

      {/* Fila */}
      <div
        {...handlers}
        role={editing ? undefined : "checkbox"}
        aria-checked={editing ? undefined : item.done}
        tabIndex={editing ? undefined : 0}
        onKeyDown={(e) => {
          if (editing || (e.key !== "Enter" && e.key !== " ")) return;
          e.preventDefault();
          onToggle();
        }}
        className="item-row"
        style={{
          transform: `translateX(${dx}px)`,
          transition: active ? "none" : `transform .3s ${EASE.out}`,
          display: "flex",
          alignItems: "center",
          gap: 14,
          // En edición la papelera (40 px) sustituye al relleno: la fila mide lo mismo.
          padding: editing ? "6px 6px 6px 16px" : "14px 16px",
          ...rowSurface(item.done),
          cursor: editing ? "default" : "pointer",
          userSelect: "none",
          touchAction: "pan-y",
        }}
      >
        <ItemContent item={item} />
        {editing && (
          <button
            onClick={handleDelete}
            aria-label={`Eliminar ${item.name}`}
            className="anim-pop"
            style={{
              flexShrink: 0,
              width: 40,
              height: 40,
              borderRadius: 10,
              border: "none",
              background: "transparent",
              color: C.rojo,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
