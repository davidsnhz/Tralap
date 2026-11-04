import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useSwipeX } from "../hooks/useSwipeX";
import { C } from "../theme/colors";
import type { Item } from "../types";
import { ItemContent } from "./ItemContent";

const ITEM_ACTION_W = 74;

interface SwipeableCheckItemProps {
  item: Item;
  onToggle: () => void;
  onDelete: () => void;
  delay?: number;
}

/* Fila de checklist deslizable: toque = marcar, deslizar izq. = eliminar */
export function SwipeableCheckItem({
  item,
  onToggle,
  onDelete,
  delay = 0,
}: SwipeableCheckItemProps) {
  const [removing, setRemoving] = useState(false);
  const { dx, active, handlers } = useSwipeX({
    actionWidth: ITEM_ACTION_W,
    overshoot: 16,
    snapDivisor: 2,
    onTap: onToggle,
  });

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
        <button
          onClick={handleDelete}
          style={{
            width: ITEM_ACTION_W - 8,
            border: "none",
            cursor: "pointer",
            borderRadius: 12,
            background: C.rojo,
            color: C.white,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            fontSize: 10.5,
            fontWeight: 700,
            fontFamily: "'Inter', sans-serif",
            opacity: dx < -25 ? 1 : 0,
            transform: `scale(${dx < -25 ? 1 : 0.85})`,
            transition: "opacity .2s, transform .2s",
          }}
        >
          <Trash2 size={16} /> Eliminar
        </button>
      </div>

      {/* Fila */}
      <div
        {...handlers}
        className="item-row"
        style={{
          transform: `translateX(${dx}px)`,
          transition: active ? "none" : "transform .3s cubic-bezier(.22,1,.36,1)",
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "14px 16px",
          background: item.done ? C.offWhite : C.white,
          border: `1px solid ${item.done ? "transparent" : C.taupe}`,
          borderRadius: 14,
          boxShadow: item.done ? "none" : "0 1px 2px rgba(89,70,56,.04)",
          cursor: "pointer",
          userSelect: "none",
          touchAction: "pan-y",
        }}
      >
        <ItemContent item={item} />
      </div>
    </div>
  );
}
