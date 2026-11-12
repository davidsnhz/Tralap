import { TriangleAlert } from "lucide-react";
import { C } from "../../theme/colors";
import { FONT, SHADOW } from "../../theme/tokens";

export interface ToastData {
  id: number;
  message: string;
  action?: { label: string; run: () => void };
  tone?: "info" | "error";
}

interface ToastHostProps {
  toast: ToastData | null;
  onDismiss: () => void;
}

/**
 * Aviso flotante abajo (p. ej. «Viaje eliminado · Deshacer»). La región viva
 * existe siempre para que los lectores de pantalla anuncien cada aviso.
 */
export function ToastHost({ toast, onDismiss }: ToastHostProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        bottom: "calc(16px + env(safe-area-inset-bottom))",
        zIndex: 30,
        pointerEvents: "none",
      }}
    >
      {toast && (
        <div
          key={toast.id}
          className="anim-sheet"
          style={{
            pointerEvents: "auto",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: toast.action ? "8px 8px 8px 16px" : "13px 16px",
            borderRadius: 14,
            background: C.walnut,
            color: C.white,
            boxShadow: SHADOW.cta,
            fontSize: 14,
            fontWeight: 500,
            lineHeight: 1.4,
          }}
        >
          {toast.tone === "error" && (
            <TriangleAlert size={17} color={C.taupe} style={{ flexShrink: 0 }} />
          )}
          <span style={{ flex: 1, minWidth: 0, overflowWrap: "anywhere" }}>{toast.message}</span>
          {toast.action && (
            <button
              onClick={() => {
                toast.action?.run();
                onDismiss();
              }}
              style={{
                flexShrink: 0,
                minHeight: 40,
                padding: "0 12px",
                border: "none",
                borderRadius: 10,
                background: "transparent",
                color: C.taupe,
                fontSize: 14,
                fontWeight: 700,
                fontFamily: FONT.display,
                cursor: "pointer",
              }}
            >
              {toast.action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
