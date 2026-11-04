import { Bookmark, Check, Sparkles } from "lucide-react";
import { ACTIVITIES } from "../data/intelligence";
import { C } from "../theme/colors";
import type { Item } from "../types";

interface ItemContentProps {
  item: Item;
}

/* Contenido visual de una fila de checklist */
export function ItemContent({ item }: ItemContentProps) {
  const ActivityIcon = item.fromActivity
    ? (ACTIVITIES.find((a) => a.id === item.fromActivity)?.icon ?? Sparkles)
    : null;

  return (
    <>
      <span
        style={{
          width: 24,
          height: 24,
          borderRadius: 8,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `2px solid ${C.mocha}`,
          background: item.done ? C.mocha : "transparent",
          transition: "background .2s, border-color .2s",
        }}
      >
        {item.done && (
          <Check size={15} color={C.white} strokeWidth={3.5} className="anim-pop" />
        )}
      </span>
      <span
        style={{
          flex: 1,
          minWidth: 0,
          overflowWrap: "anywhere",
          fontSize: 15,
          fontWeight: 500,
          color: item.done ? C.mocha : C.walnut,
          textDecoration: item.done ? "line-through" : "none",
          textDecorationColor: C.mocha,
          transition: "color .25s",
        }}
      >
        {item.name}
      </span>
      {item.qty !== undefined && (
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: item.done ? C.mocha : C.walnut,
            background: item.done ? "transparent" : C.taupe,
            padding: "3px 10px",
            borderRadius: 99,
            transition: "all .2s",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          ×{item.qty}
        </span>
      )}
      {item.fromTemplate && !item.done && <Bookmark size={15} color={C.mocha} />}
      {ActivityIcon && !item.done && <ActivityIcon size={15} color={C.mocha} />}
      {item.suggested && !item.done && <Sparkles size={15} color={C.mocha} />}
    </>
  );
}
