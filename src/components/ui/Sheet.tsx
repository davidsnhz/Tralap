import { useEffect, useId, type ReactNode } from "react";
import { X } from "lucide-react";
import { C } from "../../theme/colors";
import { shade } from "../../theme/tokens";

interface SheetProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

/** Hoja inferior sobre un velo, con título y botón de cerrar (Escape también cierra). */
export function Sheet({ title, onClose, children }: SheetProps) {
  const titleId = useId();

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="anim-fade"
      style={{
        position: "absolute",
        inset: 0,
        background: shade(0.42),
        display: "flex",
        alignItems: "flex-end",
        zIndex: 10,
      }}
    >
      <div
        className="anim-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={{
          background: C.white,
          borderRadius: "24px 24px 0 0",
          width: "100%",
          padding: "24px 24px calc(28px + env(safe-area-inset-bottom))",
          maxHeight: "92%",
          overflowY: "auto",
          overscrollBehavior: "contain",
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
          <h2
            id={titleId}
            className="display"
            style={{ margin: 0, fontSize: 22, fontWeight: 700, color: C.walnut }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
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
        {children}
      </div>
    </div>
  );
}
