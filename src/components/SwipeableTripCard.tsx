import { useState } from "react";
import { Calendar, Pencil, Sun, Trash2 } from "lucide-react";
import { TRIP_TYPES } from "../data/intelligence";
import { useSwipeX } from "../hooks/useSwipeX";
import { C } from "../theme/colors";
import type { Trip } from "../types";

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

  const { dx, setDx, active, handlers } = useSwipeX({
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

  const saveRename = (): void => {
    const v = draft.trim();
    if (v) onRename(v);
    setEditing(false);
    setDx(0);
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
        <button
          onClick={() => {
            setEditing(true);
            setDx(-ACTIONS_W);
          }}
          style={{
            width: 66,
            border: "none",
            cursor: "pointer",
            borderRadius: 16,
            background: C.fondo,
            color: C.negro,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            fontSize: 11,
            fontWeight: 700,
            fontFamily: "'Inter', sans-serif",
            opacity: dx < -30 ? 1 : 0,
            transform: `scale(${dx < -30 ? 1 : 0.85})`,
            transition: "opacity .2s, transform .2s",
          }}
        >
          <Pencil size={17} color={C.marron} /> Renombrar
        </button>
        <button
          onClick={handleDelete}
          style={{
            width: 66,
            border: "none",
            cursor: "pointer",
            borderRadius: 16,
            background: C.rojo,
            color: C.blanco,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            fontSize: 11,
            fontWeight: 700,
            fontFamily: "'Inter', sans-serif",
            opacity: dx < -30 ? 1 : 0,
            transform: `scale(${dx < -30 ? 1 : 0.85})`,
            transition: "opacity .2s, transform .2s",
          }}
        >
          <Trash2 size={17} /> Eliminar
        </button>
      </div>

      <div
        {...handlers}
        style={{
          transform: `translateX(${dx}px)`,
          transition: active ? "none" : "transform .3s cubic-bezier(.22,1,.36,1)",
          background: C.blanco,
          borderRadius: 18,
          padding: 18,
          display: "flex",
          alignItems: "center",
          gap: 16,
          border: `1px solid ${C.linea}`,
          boxShadow: "0 2px 8px rgba(20,20,20,.05)",
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
            background: C.fondo,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TypeIcon size={22} color={C.marron} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {editing ? (
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveRename();
                if (e.key === "Escape") setEditing(false);
              }}
              onBlur={saveRename}
              onPointerDown={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                fontSize: 17,
                fontWeight: 700,
                color: C.negro,
                fontFamily: "'Space Grotesk', sans-serif",
                letterSpacing: "-0.02em",
                border: "none",
                borderBottom: `2px solid ${C.marron}`,
                outline: "none",
                background: "transparent",
                padding: "0 0 2px",
              }}
            />
          ) : (
            <div className="display" style={{ fontSize: 17, fontWeight: 700, color: C.negro }}>
              {trip.name}
            </div>
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 12.5,
              color: C.grisSuave,
              marginTop: 3,
            }}
          >
            <Calendar size={12} /> {trip.days} días
          </div>
          <div
            style={{
              height: 5,
              background: C.fondo,
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
                background: pct === 100 ? C.verde : C.marron,
                transition: "width .5s cubic-bezier(.22,1,.36,1)",
              }}
            />
          </div>
        </div>
        <span
          className="display"
          style={{ fontSize: 15, fontWeight: 700, color: pct === 100 ? C.verde : C.marron }}
        >
          {pct}%
        </span>
      </div>
    </div>
  );
}
