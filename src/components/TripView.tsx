import { useState } from "react";
import {
  Check,
  ChevronLeft,
  Ellipsis,
  FileText,
  Luggage,
  Pencil,
  Search,
  Shirt,
  Sparkles,
  Sun,
  Trash2,
  Undo2,
} from "lucide-react";
import { TRIP_TYPES } from "../data/intelligence";
import { C } from "../theme/colors";
import { FONT, SHADOW, veil } from "../theme/tokens";
import type { PackTab, Trip, TripMode } from "../types";
import { countLabel } from "../utils/text";
import { AddItemRow } from "./AddItemRow";
import { CheckItem } from "./CheckItem";
import { ProgressRing } from "./ProgressRing";
import { SwipeableCheckItem } from "./SwipeableCheckItem";
import { Hint, InfoNote, Strong } from "./ui/Notes";
import { SegmentedTabs, type TabOption } from "./ui/SegmentedTabs";

interface TripViewProps {
  trip: Trip;
  onBack: () => void;
  onToggle: (tab: PackTab, itemId: string) => void;
  onAddItem: (tab: PackTab, name: string) => boolean;
  onDeleteItem: (tab: PackTab, itemId: string) => void;
  onToggleReturn: (itemId: string) => void;
  onRename: (name: string) => void;
  onDelete: () => void;
}

const MODES: TabOption<TripMode>[] = [
  { id: "ida", label: "Preparar maleta", icon: Luggage },
  { id: "vuelta", label: "Modo vuelta", icon: Undo2 },
];
const PACK_TABS: TabOption<PackTab>[] = [
  { id: "outfits", label: "Outfits", icon: Shirt },
  { id: "essentials", label: "Esenciales", icon: FileText },
];

const headerButton = {
  background: veil(0.1),
  border: "none",
  borderRadius: 99,
  width: 40,
  height: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
} as const;

const menuItem = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "12px 14px",
  border: "none",
  borderRadius: 10,
  background: "transparent",
  fontSize: 14.5,
  fontWeight: 500,
  fontFamily: FONT.body,
  cursor: "pointer",
  textAlign: "left",
} as const;

export function TripView({
  trip,
  onBack,
  onToggle,
  onAddItem,
  onDeleteItem,
  onToggleReturn,
  onRename,
  onDelete,
}: TripViewProps) {
  const [tab, setTab] = useState<PackTab>("outfits");
  const [mode, setMode] = useState<TripMode>("ida");
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [draft, setDraft] = useState(trip.name);
  const [editing, setEditing] = useState(false);

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

  const startRename = (): void => {
    setMenuOpen(false);
    setDraft(trip.name);
    setRenaming(true);
  };
  const saveRename = (): void => {
    const v = draft.trim();
    if (v && v !== trip.name) onRename(v);
    setRenaming(false);
  };

  return (
    <div className="anim-fade">
      <div
        style={{
          background: C.espresso,
          borderRadius: "0 0 28px 28px",
          padding: "calc(20px + env(safe-area-inset-top)) 22px 22px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 18,
            position: "relative",
          }}
        >
          <button onClick={onBack} aria-label="Volver a Inicio" style={headerButton}>
            <ChevronLeft size={20} color={C.onHeader} />
          </button>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Opciones del viaje"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            style={headerButton}
          >
            <Ellipsis size={20} color={C.onHeader} />
          </button>
          {menuOpen && (
            <>
              {/* Velo invisible: tocar fuera cierra el menú */}
              <div
                onClick={() => setMenuOpen(false)}
                style={{ position: "fixed", inset: 0, zIndex: 5 }}
              />
              <div
                role="menu"
                className="anim-fade"
                onKeyDown={(e) => e.key === "Escape" && setMenuOpen(false)}
                style={{
                  position: "absolute",
                  top: 46,
                  right: 0,
                  zIndex: 6,
                  minWidth: 200,
                  padding: 6,
                  borderRadius: 14,
                  background: C.white,
                  boxShadow: SHADOW.menu,
                }}
              >
                <button role="menuitem" autoFocus onClick={startRename} style={{ ...menuItem, color: C.ink }}>
                  <Pencil size={17} color={C.gray} /> Renombrar
                </button>
                <button
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete();
                  }}
                  style={{ ...menuItem, color: C.rojo }}
                >
                  <Trash2 size={17} /> Eliminar viaje
                </button>
              </div>
            </>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12 }}>
          <div style={{ flex: renaming ? 1 : undefined, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <TypeIcon size={15} color={veil(0.72)} />
              <span style={{ fontSize: 13, fontWeight: 500, color: veil(0.72) }}>
                {tripType?.label} · {daysLabel}
              </span>
            </div>
            {renaming ? (
              <input
                autoFocus
                aria-label="Nombre del viaje"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveRename();
                  if (e.key === "Escape") setRenaming(false);
                }}
                onBlur={saveRename}
                enterKeyHint="done"
                className="display"
                style={{
                  width: "100%",
                  margin: 0,
                  padding: "0 0 2px",
                  fontSize: 28,
                  fontWeight: 700,
                  color: C.onHeader,
                  WebkitTextStroke: "0.35px currentColor",
                  background: "transparent",
                  border: "none",
                  borderBottom: `2px solid ${veil(0.72)}`,
                  outline: "none",
                }}
              />
            ) : (
              <h1
                className="display"
                style={{ margin: 0, fontSize: 28, lineHeight: 1.15, fontWeight: 700, color: C.onHeader, WebkitTextStroke: "0.35px currentColor", overflowWrap: "anywhere" }}
              >
                {trip.name}
              </h1>
            )}
            <p style={{ margin: "8px 0 0", fontSize: 13.5, color: veil(0.72) }}>
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

        <SegmentedTabs tabs={MODES} value={mode} onChange={setMode} tone="onDark" style={{ marginTop: 20 }} />
      </div>

      {mode === "ida" ? (
        <div key="ida" className="anim-fade">
          <SegmentedTabs tabs={PACK_TABS} value={tab} onChange={setTab} style={{ padding: "18px 22px 8px" }} />

          <div style={{ padding: "6px 22px 30px" }} key={tab}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                margin: "0 0 6px 4px",
              }}
            >
              <p
                style={{
                  fontSize: 12.5,
                  color: C.gray,
                  fontWeight: 500,
                  margin: 0,
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                }}
              >
                <Sparkles size={13} style={{ flexShrink: 0 }} />
                {tab === "outfits"
                  ? `Cantidades calculadas para ${daysLabel}`
                  : `Incluye sugerencias para ${tripType?.label.toLowerCase()}`}
              </p>
              {items.length > 0 && (
                <button
                  onClick={() => setEditing((v) => !v)}
                  aria-pressed={editing}
                  style={{
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    minHeight: 34,
                    padding: "0 12px",
                    borderRadius: 99,
                    border: "none",
                    background: editing ? C.walnut : C.mist,
                    color: editing ? C.onAccent : C.ink,
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: FONT.body,
                    cursor: "pointer",
                    transition: "background .2s, color .2s",
                  }}
                >
                  {editing ? <Check size={14} /> : <Pencil size={14} />}
                  {editing ? "Listo" : "Editar"}
                </button>
              )}
            </div>
            {items.map((item, i) => (
              <SwipeableCheckItem
                key={item.id}
                item={item}
                delay={i * 35}
                editing={editing}
                onToggle={() => onToggle(tab, item.id)}
                onDelete={() => onDeleteItem(tab, item.id)}
              />
            ))}
            <AddItemRow onAdd={(name) => onAddItem(tab, name)} />
            <Hint style={{ margin: "12px 0 0" }}>
              {editing
                ? "Toca la papelera para eliminar. Podrás deshacerlo."
                : "Toca para marcar · desliza a la izquierda o pulsa Editar para eliminar"}
            </Hint>
          </div>
        </div>
      ) : (
        <div key="vuelta" className="anim-fade" style={{ padding: "18px 22px 30px" }}>
          <InfoNote icon={Search} style={{ marginBottom: 14 }}>
            Repasa esto <Strong>antes de salir del alojamiento</Strong> para no dejarte nada atrás.
          </InfoNote>
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
