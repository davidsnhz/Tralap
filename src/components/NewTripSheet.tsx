import { useState } from "react";
import { Bookmark, Check, X } from "lucide-react";
import { ACTIVITIES, TRIP_TYPES } from "../data/intelligence";
import { C } from "../theme/colors";
import type { ActivityId, NewTripData, TripTypeId } from "../types";
import { countLabel } from "../utils/text";
import { Toggle } from "./Toggle";

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

  const toggleAct = (id: ActivityId): void =>
    setActs((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  return (
    <div
      className="anim-fade"
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(89,70,56,.42)",
        display: "flex",
        alignItems: "flex-end",
        zIndex: 10,
      }}
    >
      <div
        className="anim-sheet"
        style={{
          background: C.white,
          borderRadius: "24px 24px 0 0",
          width: "100%",
          padding: "24px 24px 28px",
          maxHeight: "92%",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 18,
          }}
        >
          <h2 className="display" style={{ margin: 0, fontSize: 22, fontWeight: 700, color: C.walnut }}>
            Nuevo viaje
          </h2>
          <button
            onClick={onClose}
            style={{
              background: C.taupe,
              border: "none",
              borderRadius: 10,
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={16} color={C.walnut} />
          </button>
        </div>

        <label style={{ fontSize: 12, fontWeight: 700, color: C.mocha, letterSpacing: 1 }}>
          DESTINO
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Menorca"
          style={{
            width: "100%",
            marginTop: 8,
            marginBottom: 16,
            padding: "13px 16px",
            borderRadius: 12,
            border: `1.5px solid ${C.taupe}`,
            background: C.white,
            fontSize: 15,
            fontFamily: "'Inter', sans-serif",
            color: C.walnut,
            outline: "none",
          }}
        />

        <label style={{ fontSize: 12, fontWeight: 700, color: C.mocha, letterSpacing: 1 }}>
          TIPO DE VIAJE
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, margin: "8px 0 16px" }}>
          {TRIP_TYPES.map((t) => {
            const active = type === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 14px",
                  borderRadius: 12,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
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

        <label style={{ fontSize: 12, fontWeight: 700, color: C.mocha, letterSpacing: 1 }}>
          ACTIVIDADES{" "}
          <span style={{ color: C.mocha, fontWeight: 500, letterSpacing: 0 }}>
            (opcional — añaden sus propios ítems)
          </span>
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "8px 0 16px" }}>
          {ACTIVITIES.map((a) => {
            const active = acts.includes(a.id);
            return (
              <button
                key={a.id}
                onClick={() => toggleAct(a.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "9px 14px",
                  borderRadius: 99,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  border: `1.5px solid ${active ? C.walnut : C.taupe}`,
                  background: active ? C.walnut : C.taupe,
                  color: active ? C.white : C.walnut,
                  transform: active ? "scale(1.03)" : "scale(1)",
                  transition: "all .2s cubic-bezier(.34,1.3,.64,1)",
                }}
              >
                <a.icon size={14} />
                {a.label}
                {active && <Check size={13} strokeWidth={3} className="anim-pop" />}
              </button>
            );
          })}
        </div>

        <label style={{ fontSize: 12, fontWeight: 700, color: C.mocha, letterSpacing: 1 }}>
          DURACIÓN —{" "}
          <span className="display" style={{ color: C.mocha, fontSize: 13 }}>
            {countLabel(days, "día", "días")}
          </span>
        </label>
        <input
          type="range"
          min="1"
          max="21"
          value={days}
          onChange={(e) => setDays(+e.target.value)}
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
            <div style={{ fontSize: 14, fontWeight: 600, color: C.walnut }}>
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
          />
        </div>

        <button
          onClick={() =>
            name.trim() &&
            onCreate({
              name: name.trim(),
              type,
              days,
              acts,
              useTemplate: useTemplate && templateCount > 0,
            })
          }
          style={{
            width: "100%",
            padding: "16px 0",
            borderRadius: 14,
            border: "none",
            background: name.trim() ? C.walnut : C.taupe,
            color: name.trim() ? C.white : C.mocha,
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "'Space Grotesk', sans-serif",
            cursor: name.trim() ? "pointer" : "default",
            boxShadow: name.trim() ? "0 6px 16px rgba(89,70,56,.25)" : "none",
            transition: "all .25s",
          }}
        >
          Crear lista de equipaje
        </button>
      </div>
    </div>
  );
}
