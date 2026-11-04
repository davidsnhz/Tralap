import { useState } from "react";
import {
  ChevronLeft,
  FileText,
  Luggage,
  Search,
  Shirt,
  Sparkles,
  Sun,
  Undo2,
} from "lucide-react";
import { TRIP_TYPES } from "../data/intelligence";
import { C } from "../theme/colors";
import type { PackTab, Trip, TripMode } from "../types";
import { countLabel } from "../utils/text";
import { AddItemRow } from "./AddItemRow";
import { CheckItem } from "./CheckItem";
import { ProgressRing } from "./ProgressRing";
import { SwipeableCheckItem } from "./SwipeableCheckItem";

interface TripViewProps {
  trip: Trip;
  onBack: () => void;
  onToggle: (tab: PackTab, itemId: string) => void;
  onAddItem: (tab: PackTab, name: string) => boolean;
  onDeleteItem: (tab: PackTab, itemId: string) => void;
  onToggleReturn: (itemId: string) => void;
}

export function TripView({
  trip,
  onBack,
  onToggle,
  onAddItem,
  onDeleteItem,
  onToggleReturn,
}: TripViewProps) {
  const [tab, setTab] = useState<PackTab>("outfits");
  const [mode, setMode] = useState<TripMode>("ida");

  const all = [...trip.outfits, ...trip.essentials];
  const pctIda = all.length
    ? Math.round((all.filter((i) => i.done).length / all.length) * 100)
    : 0;
  const pctVuelta = trip.returnList.length
    ? Math.round(
        (trip.returnList.filter((i) => i.done).length / trip.returnList.length) * 100,
      )
    : 0;
  const pct = mode === "ida" ? pctIda : pctVuelta;
  const daysLabel = countLabel(trip.days, "día", "días");

  const items = tab === "outfits" ? trip.outfits : trip.essentials;
  const tripType = TRIP_TYPES.find((t) => t.id === trip.type);
  const TypeIcon = tripType?.icon ?? Sun;

  const modes: { id: TripMode; label: string; icon: typeof Luggage }[] = [
    { id: "ida", label: "Preparar maleta", icon: Luggage },
    { id: "vuelta", label: "Modo vuelta", icon: Undo2 },
  ];
  const tabs: { id: PackTab; label: string; icon: typeof Shirt }[] = [
    { id: "outfits", label: "Outfits", icon: Shirt },
    { id: "essentials", label: "Esenciales", icon: FileText },
  ];

  return (
    <div className="anim-fade">
      <div style={{ background: C.walnut, borderRadius: "0 0 28px 28px", padding: "20px 22px 22px" }}>
        <button
          onClick={onBack}
          style={{
            background: "rgba(255,255,255,.09)",
            border: "none",
            borderRadius: 12,
            width: 38,
            height: 38,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            marginBottom: 18,
          }}
        >
          <ChevronLeft size={20} color={C.white} />
        </button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <TypeIcon size={15} color={C.taupe} />
              <span style={{ fontSize: 13, fontWeight: 600, color: C.taupe, letterSpacing: 0.3 }}>
                {tripType?.label} · {daysLabel}
              </span>
            </div>
            <h1 className="display" style={{ margin: 0, fontSize: 28, fontWeight: 700, color: C.white, overflowWrap: "anywhere" }}>
              {trip.name}
            </h1>
            <p style={{ margin: "8px 0 0", fontSize: 13.5, color: C.taupe }}>
              {mode === "ida"
                ? pct === 100
                  ? "¡Maleta lista!"
                  : countLabel(all.filter((i) => !i.done).length, "cosa por guardar", "cosas por guardar")
                : pct === 100
                  ? "Todo revisado. ¡Buen regreso!"
                  : countLabel(
                      trip.returnList.filter((i) => !i.done).length,
                      "comprobación pendiente",
                      "comprobaciones pendientes",
                    )}
            </p>
          </div>
          <ProgressRing pct={pct} />
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 18,
            background: "rgba(255,255,255,.08)",
            borderRadius: 12,
            padding: 4,
            position: "relative",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 4,
              bottom: 4,
              width: "calc(50% - 4px)",
              left: mode === "ida" ? 4 : "calc(50%)",
              background: C.mocha,
              borderRadius: 9,
              transition: "left .28s cubic-bezier(.22,1,.36,1)",
            }}
          />
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              style={{
                flex: 1,
                position: "relative",
                zIndex: 1,
                border: "none",
                cursor: "pointer",
                background: "transparent",
                padding: "9px 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "'Space Grotesk', sans-serif",
                color: mode === m.id ? C.white : C.taupe,
                transition: "color .25s",
              }}
            >
              <m.icon size={14} /> {m.label}
            </button>
          ))}
        </div>
      </div>

      {mode === "ida" ? (
        <div key="ida" className="anim-fade">
          <div style={{ display: "flex", gap: 8, padding: "18px 22px 10px" }}>
            {tabs.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "12px 0",
                    borderRadius: 12,
                    cursor: "pointer",
                    fontSize: 14.5,
                    fontWeight: 700,
                    fontFamily: "'Space Grotesk', sans-serif",
                    border: `1px solid ${active ? C.walnut : C.taupe}`,
                    background: active ? C.walnut : C.white,
                    color: active ? C.white : C.mocha,
                    boxShadow: active ? "0 4px 12px rgba(89,70,56,.22)" : "none",
                    transform: active ? "translateY(-1px)" : "none",
                    transition: "all .25s cubic-bezier(.22,1,.36,1)",
                  }}
                >
                  <t.icon size={16} /> {t.label}
                </button>
              );
            })}
          </div>

          <div style={{ padding: "6px 22px 30px" }} key={tab}>
            <p
              style={{
                fontSize: 12.5,
                color: C.walnut,
                fontWeight: 600,
                margin: "6px 4px 12px",
                display: "flex",
                gap: 6,
                alignItems: "center",
              }}
            >
              <Sparkles size={13} />
              {tab === "outfits"
                ? `Cantidades calculadas para ${daysLabel}`
                : `Incluye sugerencias para ${tripType?.label.toLowerCase()}`}
            </p>
            {items.map((item, i) => (
              <SwipeableCheckItem
                key={item.id}
                item={item}
                delay={i * 35}
                onToggle={() => onToggle(tab, item.id)}
                onDelete={() => onDeleteItem(tab, item.id)}
              />
            ))}
            <AddItemRow onAdd={(name) => onAddItem(tab, name)} />
            <p style={{ fontSize: 11.5, color: C.walnut, textAlign: "center", margin: "12px 0 0" }}>
              Toca para marcar · desliza a la izquierda para eliminar
            </p>
          </div>
        </div>
      ) : (
        <div key="vuelta" className="anim-fade" style={{ padding: "18px 22px 30px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: "14px 16px",
              background: C.white,
              border: `1px solid ${C.taupe}`,
              borderRadius: 16,
              marginBottom: 14,
            }}
          >
            <Search size={18} color={C.mocha} style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ margin: 0, fontSize: 13, color: C.mocha, lineHeight: 1.5 }}>
              Repasa esto <strong style={{ color: C.walnut }}>antes de salir del alojamiento</strong>{" "}
              para no dejarte nada atrás.
            </p>
          </div>
          {trip.returnList.map((item, i) => (
            <CheckItem
              key={item.id}
              item={item}
              delay={i * 35}
              onToggle={() => onToggleReturn(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
