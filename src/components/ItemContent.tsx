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
          width: 22,
          height: 22,
          borderRadius: 7,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1.5px solid ${item.done ? C.walnut : C.mute}`,
          background: item.done ? C.walnut : C.white,
          transition: "background .2s, border-color .2s",
        }}
      >
        {item.done && (
          <Check size={14} color={C.onAccent} strokeWidth={3} className="anim-pop" />
        )}
      </span>
      <span
        style={{
          flex: 1,
          minWidth: 0,
          overflowWrap: "anywhere",
          fontSize: 15,
          fontWeight: item.done ? 400 : 500,
          color: item.done ? C.gray : C.ink,
          textDecorationLine: item.done ? "line-through" : "none",
          textDecorationColor: C.mute,
          transition: "color .25s",
        }}
      >
        {item.name}
      </span>
      {item.qty !== undefined && (
        <span
          style={{
            fontSize: 12.5,
            fontWeight: 600,
            fontVariantNumeric: "tabular-nums",
            color: C.ink,
            background: item.done ? "transparent" : C.mist,
            padding: "3px 9px",
            borderRadius: 99,
            transition: "background .2s",
          }}
        >
          ×{item.qty}
        </span>
      )}
      {item.fromTemplate && !item.done && <Bookmark size={15} color={C.gray} />}
      {ActivityIcon && !item.done && <ActivityIcon size={15} color={C.gray} />}
      {item.suggested && !item.done && <Sparkles size={15} color={C.gray} />}
    </>
  );
}
