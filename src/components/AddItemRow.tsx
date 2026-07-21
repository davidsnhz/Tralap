import { useState } from "react";
import { Plus } from "lucide-react";
import { C } from "../theme/colors";

interface AddItemRowProps {
  onAdd: (name: string) => void;
  placeholder?: string;
}

export function AddItemRow({
  onAdd,
  placeholder = "Añadir elemento…",
}: AddItemRowProps) {
  const [value, setValue] = useState("");
  const submit = (): void => {
    if (value.trim()) {
      onAdd(value.trim());
      setValue("");
    }
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginTop: 4,
        padding: "4px 4px 4px 16px",
        borderRadius: 14,
        border: `1.5px dashed ${C.linea}`,
        background: C.blanco,
      }}
    >
      <Plus size={17} color={C.grisSuave} />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder={placeholder}
        style={{
          flex: 1,
          border: "none",
          outline: "none",
          background: "transparent",
          fontSize: 15,
          fontFamily: "'Inter', sans-serif",
          color: C.negro,
          padding: "12px 0",
        }}
      />
      <button
        onClick={submit}
        style={{
          border: "none",
          borderRadius: 10,
          padding: "9px 16px",
          cursor: value.trim() ? "pointer" : "default",
          background: value.trim() ? C.negro : C.fondo,
          color: value.trim() ? C.blanco : C.grisSuave,
          fontSize: 13.5,
          fontWeight: 600,
          fontFamily: "'Inter', sans-serif",
          transition: "all .2s",
        }}
      >
        Añadir
      </button>
    </div>
  );
}
