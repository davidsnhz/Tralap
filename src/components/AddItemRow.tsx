import { useState } from "react";
import { Plus } from "lucide-react";
import { C } from "../theme/colors";
import { FONT } from "../theme/tokens";

interface AddItemRowProps {
  /** Devuelve false si el elemento ya estaba en la lista. */
  onAdd: (name: string) => boolean;
  placeholder?: string;
}

export function AddItemRow({
  onAdd,
  placeholder = "Añadir elemento…",
}: AddItemRowProps) {
  const [value, setValue] = useState("");
  const [duplicate, setDuplicate] = useState(false);
  const submit = (): void => {
    if (!value.trim()) return;
    if (onAdd(value.trim())) setValue("");
    else setDuplicate(true);
  };
  return (
    <>
      <div
        className="field"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginTop: 4,
          padding: "4px 4px 4px 16px",
          borderRadius: 14,
        }}
      >
        <Plus size={17} color={C.gray} />
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setDuplicate(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder={placeholder}
          aria-label="Nuevo elemento"
          enterKeyHint="done"
          style={{
            flex: 1,
            minWidth: 0,
            border: "none",
            outline: "none",
            background: "transparent",
            // 16 px como mínimo: con menos, Safari en iPhone amplía la página al escribir.
            fontSize: 16,
            fontFamily: FONT.body,
            color: C.ink,
            padding: "11px 0",
          }}
        />
        <button
          onClick={submit}
          style={{
            border: "none",
            borderRadius: 10,
            padding: "9px 16px",
            cursor: value.trim() ? "pointer" : "default",
            background: value.trim() ? C.walnut : C.mist,
            color: value.trim() ? C.white : C.gray,
            fontSize: 13.5,
            fontWeight: 600,
            fontFamily: FONT.body,
            transition: "all .2s",
          }}
        >
          Añadir
        </button>
      </div>
      {duplicate && (
        <p role="alert" style={{ fontSize: 12.5, fontWeight: 600, color: C.rojo, margin: "8px 4px 0" }}>
          Ya está en la lista
        </p>
      )}
    </>
  );
}
