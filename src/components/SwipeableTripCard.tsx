import { useState } from "react";
import { Calendar, Pencil, Sun, Trash2 } from "lucide-react";
import { TRIP_TYPES } from "../data/intelligence";
import { useSwipeX } from "../hooks/useSwipeX";
import { C } from "../theme/colors";
import { EASE, FONT, SHADOW } from "../theme/tokens";
import type { Trip } from "../types";
import { countLabel } from "../utils/text";
import { SwipeAction } from "./ui/SwipeAction";

const ACTIONS_W = 148;

interface SwipeableTripCardProps {
  trip: Trip;
  index: number;
  onOpen: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
}

export function SwipeableTripCard({
  trip,
  index,
  onOpen,
  onRename,
  onDelete,
}: SwipeableTripCardProps) {
  const [removing, setRemoving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(trip.name);

  const all = [...trip.outfits, ...trip.essentials];
  const pct = all.length
    ? Math.round((all.filter((x) => x.done).length / all.length) * 100)
    : 0;
  const TypeIcon = TRIP_TYPES.find((t) => t.id === trip.type)?.icon ?? Sun;

  const { dx, close, active, handlers } = useSwipeX({
    actionWidth: ACTIONS_W,
    overshoot: 20,
    snapDivisor: 2.2,
    onTap: onOpen,
    disabled: editing,
  });

  const handleDelete = (): void => {
    setRemoving(true);
    setTimeout(onDelete, 320);
  };

  const startRename = (): void => {
    setDraft(trip.name);
    setEditing(true);
    close();
  };

  const cancelRename = (): void => {
    setEditing(false);
    close();
  };

  const saveRename = (): void => {
    const v = draft.trim();
    if (v) onRename(v);
    setEditing(false);
    close();
  };

  return (
    <div
      className={`swipe-wrap anim-rise ${removing ? "removing" : ""}`}
      style={{ animationDelay: `${index * 60}ms`, position: "relative", marginBottom: 12 }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "flex-end",
          gap: 8,
          borderRadius: 18,
          overflow: "hidden",
        }}
      >
        <SwipeAction icon={Pencil} label="Renombrar" onClick={startRename} visible={dx < -30} tone="secondary" size="card" />
        <SwipeAction icon={Trash2} label="Eliminar" onClick={handleDelete} visible={dx < -30} tone="danger" size="card" />
      </div>

      <div
        {...handlers}
        role={editing ? undefined : "button"}
        tabIndex={editing ? undefined : 0}
        onKeyDown={(e) => {
          if (editing || e.target !== e.currentTarget) return;
          if (e.key !== "Enter" && e.key !== " ") return;
          e.preventDefault();
          onOpen();
        }}
        style={{
          transform: `translateX(${dx}px)`,
          transition: active ? "none" : `transform .3s ${EASE.out}`,
          background: C.white,
          borderRadius: 18,
          padding: 18,
          display: "flex",
          alignItems: "center",
          gap: 16,
          border: `1px solid ${C.taupe}`,
          boxShadow: SHADOW.card,
          cursor: "grab",
          userSelect: "none",
          touchAction: "pan-y",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: C.taupe,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TypeIcon size={22} color={C.walnut} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {editing ? (
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveRename();
                if (e.key === "Escape") cancelRename();
              }}
              onBlur={saveRename}
              onPointerDown={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                fontSize: 17,
                fontWeight: 700,
                color: C.walnut,
                fontFamily: FONT.display,
                letterSpacing: "-0.02em",
                border: "none",
                borderBottom: `2px solid ${C.mocha}`,
                outline: "none",
                background: "transparent",
                padding: "0 0 2px",
              }}
            />
          ) : (
            <div className="display" style={{ fontSize: 17, fontWeight: 700, color: C.walnut, overflowWrap: "anywhere" }}>
              {trip.name}
            </div>
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 12.5,
              color: C.mocha,
              marginTop: 3,
            }}
          >
            <Calendar size={12} /> {countLabel(trip.days, "día", "días")}
          </div>
          <div
            style={{
              height: 5,
              background: C.taupe,
              borderRadius: 99,
              marginTop: 10,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                borderRadius: 99,
                background: pct === 100 ? C.walnut : C.mocha,
                transition: `width .5s ${EASE.out}`,
              }}
            />
          </div>
        </div>
        <span
          className="display"
          style={{ fontSize: 15, fontWeight: 700, color: pct === 100 ? C.walnut : C.mocha }}
        >
          {pct}%
        </span>
      </div>
    </div>
  );
}
