import type { CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { C } from "../../theme/colors";

interface InfoNoteProps {
  icon: LucideIcon;
  children: ReactNode;
  style?: CSSProperties;
}

/** Tarjeta blanca con un icono y una explicación breve. */
export function InfoNote({ icon: Icon, children, style }: InfoNoteProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "14px 16px",
        background: C.white,
        border: `1px solid ${C.taupe}`,
        borderRadius: 16,
        ...style,
      }}
    >
      <Icon size={18} color={C.mocha} style={{ flexShrink: 0, marginTop: 2 }} />
      <p style={{ margin: 0, fontSize: 13, color: C.mocha, lineHeight: 1.5 }}>{children}</p>
    </div>
  );
}

/** Texto destacado dentro de una InfoNote. */
export function Strong({ children }: { children: ReactNode }) {
  return <strong style={{ color: C.walnut }}>{children}</strong>;
}

interface TextProps {
  children: ReactNode;
  style?: CSSProperties;
}

/** Pista pequeña y centrada bajo una lista. */
export function Hint({ children, style }: TextProps) {
  return <p style={{ fontSize: 11.5, color: C.walnut, textAlign: "center", ...style }}>{children}</p>;
}

/** Mensaje de lista vacía. */
export function EmptyText({ children, style }: TextProps) {
  return <p style={{ fontSize: 13.5, color: C.walnut, textAlign: "center", ...style }}>{children}</p>;
}
