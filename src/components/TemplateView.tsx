import { useState } from "react";
import { Bookmark, X } from "lucide-react";
import { C } from "../theme/colors";
import { AddItemRow } from "./AddItemRow";

interface TemplateRowProps {
  name: string;
  onRemove: () => void;
  delay: number;
}

function TemplateRow({ name, onRemove, delay }: TemplateRowProps) {
  const [removing, setRemoving] = useState(false);
  const remove = (): void => {
    setRemoving(true);
    setTimeout(onRemove, 300);
  };
  return (
    <div
      className={`tpl-row anim-rise ${removing ? "removing" : ""}`}
      style={{ animationDelay: `${delay}ms`, marginBottom: 8 }}
    >
      <div
        className="item-row"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "13px 8px 13px 16px",
          background: C.white,
          border: `1px solid ${C.taupe}`,
          borderRadius: 14,
          boxShadow: "0 1px 2px rgba(89,70,56,.04)",
        }}
      >
        <Bookmark size={16} color={C.mocha} style={{ flexShrink: 0 }} />
        <span style={{ flex: 1, minWidth: 0, overflowWrap: "anywhere", fontSize: 15, fontWeight: 500, color: C.walnut }}>
          {name}
        </span>
        <button
          onClick={remove}
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            background: "transparent",
            color: C.mocha,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background .18s, color .18s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = C.offWhite;
            e.currentTarget.style.color = C.rojo;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = C.mocha;
          }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

interface TemplateViewProps {
  template: string[];
  onAdd: (name: string) => boolean;
  onRemove: (name: string) => void;
}

export function TemplateView({ template, onAdd, onRemove }: TemplateViewProps) {
  return (
    <div className="anim-fade">
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          padding: "14px 16px",
          background: C.white,
          border: `1px solid ${C.taupe}`,
          borderRadius: 16,
          marginBottom: 16,
        }}
      >
        <Bookmark size={18} color={C.mocha} style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ margin: 0, fontSize: 13, color: C.mocha, lineHeight: 1.5 }}>
          Guarda aquí lo que <strong style={{ color: C.walnut }}>siempre llevas</strong> a
          cualquier viaje. Al crear un viaje nuevo podrás incluirlo todo de un toque, sin
          volver a escribirlo.
        </p>
      </div>

      {template.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            fontSize: 13.5,
            color: C.walnut,
            padding: "24px 0",
          }}
        >
          Tu plantilla está vacía. Añade tu primer imprescindible.
        </p>
      ) : (
        template.map((name, i) => (
          <TemplateRow key={name} name={name} delay={i * 35} onRemove={() => onRemove(name)} />
        ))
      )}

      <AddItemRow onAdd={onAdd} placeholder="Ej. Tapones para dormir…" />
    </div>
  );
}
