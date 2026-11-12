import type { Item } from "../types";
import { ItemContent } from "./ItemContent";
import { rowSurface } from "./ui/surfaces";

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
      role="checkbox"
      aria-checked={item.done}
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
        ...rowSurface(item.done),
        marginBottom: 8,
      }}
    >
      <ItemContent item={item} />
    </button>
  );
}
