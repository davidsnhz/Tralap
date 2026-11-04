import { C } from "../theme/colors";
import type { Item } from "../types";
import { ItemContent } from "./ItemContent";

interface CheckItemProps {
  item: Item;
  onToggle: () => void;
  delay?: number;
}

/* Fila fija (modo vuelta): solo marcar */
export function CheckItem({ item, onToggle, delay = 0 }: CheckItemProps) {
  return (
    <button
      onClick={onToggle}
      className="item-row anim-rise"
      style={{
        animationDelay: `${delay}ms`,
        display: "flex",
        alignItems: "center",
        gap: 14,
        width: "100%",
        padding: "14px 16px",
        cursor: "pointer",
        textAlign: "left",
        background: item.done ? C.offWhite : C.white,
        border: `1px solid ${item.done ? "transparent" : C.taupe}`,
        borderRadius: 14,
        marginBottom: 8,
        boxShadow: item.done ? "none" : "0 1px 2px rgba(89,70,56,.04)",
      }}
    >
      <ItemContent item={item} />
    </button>
  );
}
