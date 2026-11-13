import { useId, useState } from "react";
import { Bookmark, Check } from "lucide-react";
import { ACTIVITIES, TRIP_TYPES } from "../data/intelligence";
import { C } from "../theme/colors";
import { EASE, FONT, primaryButton } from "../theme/tokens";
import type { ActivityId, NewTripData, TripTypeId } from "../types";
import { countLabel } from "../utils/text";
import { Toggle } from "./Toggle";
import { Sheet } from "./ui/Sheet";

const LABEL_STYLE = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: C.ink,
} as const;

interface NewTripSheetProps {
  onClose: () => void;
  onCreate: (data: NewTripData) => void;
  templateCount: number;
}

export function NewTripSheet({ onClose, onCreate, templateCount }: NewTripSheetProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<TripTypeId>("playa");
  const [days, setDays] = useState(5);
  const [useTemplate, setUseTemplate] = useState(templateCount > 0);
  const [acts, setActs] = useState<ActivityId[]>([]);
  const ids = useId();

  const toggleAct = (id: ActivityId): void =>
    setActs((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  const ready = name.trim() !== "";
  const templateOn = useTemplate && templateCount > 0;

  const create = (): void => {
    if (!ready) return;
    onCreate({
      name: name.trim(),
      type,
      days,
      acts,
      useTemplate: templateOn,
    });
  };

  return (
    <Sheet title="Nuevo viaje" onClose={onClose}>
      <label htmlFor={`${ids}-destino`} style={LABEL_STYLE}>
        Destino
      </label>
      <input
        id={`${ids}-destino`}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && create()}
        placeholder="Ej. Menorca"
        enterKeyHint="done"
        autoComplete="off"
        className="field"
        style={{
          width: "100%",
          marginTop: 8,
          marginBottom: 20,
          padding: "13px 16px",
          borderRadius: 12,
          // 16 px como mínimo: con menos, Safari en iPhone amplía la página al escribir.
          fontSize: 16,
          fontFamily: FONT.body,
          color: C.ink,
          outline: "none",
        }}
      />

      <span id={`${ids}-tipo`} style={LABEL_STYLE}>
        Tipo de viaje
      </span>
      <div
        role="group"
        aria-labelledby={`${ids}-tipo`}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, margin: "8px 0 20px" }}
      >
        {TRIP_TYPES.map((t) => {
          const active = type === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setType(t.id)}
              aria-pressed={active}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "12px 14px",
                borderRadius: 12,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 500,
                fontFamily: FONT.body,
                border: `1px solid ${active ? C.walnut : C.line}`,
                background: active ? C.walnut : C.white,
                color: active ? C.white : C.ink,
                transition: "background .2s, border-color .2s, color .2s",
              }}
            >
              <t.icon size={16} color={active ? C.white : C.ink} /> {t.label}
            </button>
          );
        })}
      </div>

      <span id={`${ids}-actividades`} style={LABEL_STYLE}>
        Actividades{" "}
        <span style={{ color: C.gray, fontWeight: 400 }}>· opcional, añaden sus propios ítems</span>
      </span>
      <div
        role="group"
        aria-labelledby={`${ids}-actividades`}
        style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "8px 0 20px" }}
      >
        {ACTIVITIES.map((a) => {
          const active = acts.includes(a.id);
          return (
            <button
              key={a.id}
              onClick={() => toggleAct(a.id)}
              aria-pressed={active}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "9px 14px",
                borderRadius: 99,
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                fontFamily: FONT.body,
                background: active ? C.walnut : C.mist,
                color: active ? C.white : C.ink,
                transform: active ? "scale(1.03)" : "scale(1)",
                transition: `all .2s ${EASE.spring}`,
              }}
            >
              <a.icon size={14} />
              {a.label}
              {active && <Check size={13} strokeWidth={3} className="anim-pop" />}
            </button>
          );
        })}
      </div>

      <label
        htmlFor={`${ids}-duracion`}
        style={{ ...LABEL_STYLE, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}
      >
        Duración
        <span style={{ color: C.ink, fontVariantNumeric: "tabular-nums" }}>
          {countLabel(days, "día", "días")}
        </span>
      </label>
      <input
        id={`${ids}-duracion`}
        type="range"
        min="1"
        max="21"
        value={days}
        onChange={(e) => setDays(+e.target.value)}
        aria-valuetext={countLabel(days, "día", "días")}
        style={{ width: "100%", margin: "12px 0 20px", accentColor: C.walnut }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "13px 16px",
          borderRadius: 14,
          marginBottom: 20,
          background: C.mist,
          opacity: templateCount === 0 ? 0.6 : 1,
        }}
      >
        <Bookmark
          size={17}
          color={templateOn ? C.ink : C.mute}
          style={{ flexShrink: 0, transition: "color .25s" }}
        />
        <div style={{ flex: 1 }}>
          <div id={`${ids}-plantilla`} style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>
            Incluir mi plantilla
          </div>
          <div style={{ fontSize: 12.5, color: C.gray, marginTop: 1 }}>
            {templateCount === 0
              ? "Aún no has guardado imprescindibles"
              : `${countLabel(templateCount, "imprescindible", "imprescindibles")} → Esenciales`}
          </div>
        </div>
        <Toggle
          on={templateOn}
          onChange={() => templateCount > 0 && setUseTemplate((v) => !v)}
          labelledBy={`${ids}-plantilla`}
        />
      </div>

      <button onClick={create} className="press" style={primaryButton(ready)}>
        Crear lista de equipaje
      </button>
    </Sheet>
  );
}
