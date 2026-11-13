import { useState } from "react";
import { Bookmark, X } from "lucide-react";
import { C } from "../theme/colors";
import { AddItemRow } from "./AddItemRow";
import { EmptyText, InfoNote, Strong } from "./ui/Notes";
import { rowSurface } from "./ui/surfaces";

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
          ...rowSurface(false),
        }}
      >
        <Bookmark size={16} color={C.gray} style={{ flexShrink: 0 }} />
        <span style={{ flex: 1, minWidth: 0, overflowWrap: "anywhere", fontSize: 15, fontWeight: 500, color: C.ink }}>
          {name}
        </span>
        <button
          onClick={remove}
          aria-label={`Quitar ${name} de la plantilla`}
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            background: "transparent",
            color: C.gray,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background .18s, color .18s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = C.mist;
            e.currentTarget.style.color = C.rojo;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = C.gray;
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
      <InfoNote icon={Bookmark} style={{ marginBottom: 16 }}>
        Guarda aquí lo que <Strong>siempre llevas</Strong> a cualquier viaje. Al crear un viaje
        nuevo podrás incluirlo todo de un toque, sin volver a escribirlo.
      </InfoNote>

      {template.length === 0 ? (
        <EmptyText style={{ padding: "24px 0" }}>
          Tu plantilla está vacía. Añade tu primer imprescindible.
        </EmptyText>
      ) : (
        template.map((name, i) => (
          <TemplateRow key={name} name={name} delay={i * 35} onRemove={() => onRemove(name)} />
        ))
      )}

      <AddItemRow onAdd={onAdd} placeholder="Ej. Tapones para dormir…" />
    </div>
  );
}
