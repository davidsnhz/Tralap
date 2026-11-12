import { useId, useState } from "react";
import { Bookmark, Check } from "lucide-react";
import { ACTIVITIES, TRIP_TYPES } from "../data/intelligence";
import { C } from "../theme/colors";
import { EASE, FONT, SHADOW } from "../theme/tokens";
import type { ActivityId, NewTripData, TripTypeId } from "../types";
import { countLabel } from "../utils/text";
import { Toggle } from "./Toggle";
import { Sheet } from "./ui/Sheet";

const LABEL_STYLE = { fontSize: 12, fontWeight: 700, color: C.mocha, letterSpacing: 1 } as const;

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

  const create = (): void => {
    if (!name.trim()) return;
    onCreate({
      name: name.trim(),
      type,
      days,
      acts,
      useTemplate: useTemplate && templateCount > 0,
    });
  };

  return (
    <Sheet title="Nuevo viaje" onClose={onClose}>
      <label htmlFor={`${ids}-destino`} style={LABEL_STYLE}>
        DESTINO
      </label>
      <input
        id={`${ids}-destino`}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && create()}
        placeholder="Ej. Menorca"
        enterKeyHint="done"
        autoComplete="off"
        style={{
          width: "100%",
          marginTop: 8,
          marginBottom: 16,
          padding: "13px 16px",
          borderRadius: 12,
          border: `1.5px solid ${C.taupe}`,
          background: C.white,
          // 16 px como mínimo: con menos, Safari en iPhone amplía la página al escribir.
          fontSize: 16,
          fontFamily: FONT.body,
          color: C.walnut,
          outline: "none",
        }}
      />

      <span id={`${ids}-tipo`} style={LABEL_STYLE}>
        TIPO DE VIAJE
      </span>
      <div
        role="group"
        aria-labelledby={`${ids}-tipo`}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, margin: "8px 0 16px" }}
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
                gap: 8,
                padding: "12px 14px",
                borderRadius: 12,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: FONT.body,
                border: `1.5px solid ${active ? C.walnut : C.taupe}`,
                background: active ? C.walnut : C.white,
                color: active ? C.white : C.mocha,
                transition: "all .2s",
              }}
            >
              <t.icon size={16} /> {t.label}
            </button>
          );
        })}
      </div>

      <span id={`${ids}-actividades`} style={LABEL_STYLE}>
        ACTIVIDADES{" "}
        <span style={{ color: C.mocha, fontWeight: 500, letterSpacing: 0 }}>
          (opcional — añaden sus propios ítems)
        </span>
      </span>
      <div
        role="group"
        aria-labelledby={`${ids}-actividades`}
        style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "8px 0 16px" }}
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
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: FONT.body,
                border: `1.5px solid ${active ? C.walnut : C.taupe}`,
                background: active ? C.walnut : C.taupe,
                color: active ? C.white : C.walnut,
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

      <label htmlFor={`${ids}-duracion`} style={LABEL_STYLE}>
        DURACIÓN —{" "}
        <span className="display" style={{ color: C.mocha, fontSize: 13 }}>
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
        style={{ width: "100%", margin: "12px 0 16px", accentColor: C.mocha }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "13px 16px",
          borderRadius: 14,
          marginBottom: 18,
          background: C.offWhite,
          border: `1.5px solid ${useTemplate && templateCount > 0 ? C.mocha : C.taupe}`,
          opacity: templateCount === 0 ? 0.55 : 1,
          transition: "border-color .25s",
        }}
      >
        <Bookmark
          size={17}
          color={useTemplate && templateCount > 0 ? C.mocha : C.taupe}
          style={{ transition: "color .25s" }}
        />
        <div style={{ flex: 1 }}>
          <div id={`${ids}-plantilla`} style={{ fontSize: 14, fontWeight: 600, color: C.walnut }}>
            Incluir mi plantilla
          </div>
          <div style={{ fontSize: 12, color: C.walnut, marginTop: 1 }}>
            {templateCount === 0
              ? "Aún no has guardado imprescindibles"
              : `${countLabel(templateCount, "imprescindible", "imprescindibles")} → Esenciales`}
          </div>
        </div>
        <Toggle
          on={useTemplate && templateCount > 0}
          onChange={() => templateCount > 0 && setUseTemplate((v) => !v)}
          labelledBy={`${ids}-plantilla`}
        />
      </div>

      <button
        onClick={create}
        style={{
          width: "100%",
          padding: "16px 0",
          borderRadius: 14,
          border: "none",
          background: name.trim() ? C.walnut : C.taupe,
          color: name.trim() ? C.white : C.mocha,
          fontSize: 15,
          fontWeight: 700,
          fontFamily: FONT.display,
          cursor: name.trim() ? "pointer" : "default",
          boxShadow: name.trim() ? SHADOW.cta : "none",
          transition: "all .25s",
        }}
      >
        Crear lista de equipaje
      </button>
    </Sheet>
  );
}
