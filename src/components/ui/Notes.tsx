import type { CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { C } from "../../theme/colors";

interface InfoNoteProps {
  icon: LucideIcon;
  children: ReactNode;
  style?: CSSProperties;
}

/** Nota sobre fondo Mist con un icono y una explicación breve. */
export function InfoNote({ icon: Icon, children, style }: InfoNoteProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "14px 16px",
        background: C.mist,
        borderRadius: 14,
        ...style,
      }}
    >
      <Icon size={17} color={C.gray} style={{ flexShrink: 0, marginTop: 2 }} />
      <p style={{ margin: 0, fontSize: 13, color: C.gray, lineHeight: 1.5 }}>{children}</p>
    </div>
  );
}

/** Texto destacado dentro de una InfoNote. */
export function Strong({ children }: { children: ReactNode }) {
  return <strong style={{ color: C.ink, fontWeight: 600 }}>{children}</strong>;
}

interface TextProps {
  children: ReactNode;
  style?: CSSProperties;
}

/** Pista pequeña y centrada bajo una lista. */
export function Hint({ children, style }: TextProps) {
  return (
    <p style={{ fontSize: 12, color: C.gray, textAlign: "center", lineHeight: 1.45, ...style }}>
      {children}
    </p>
  );
}

/** Mensaje de lista vacía. */
export function EmptyText({ children, style }: TextProps) {
  return (
    <p style={{ fontSize: 14, color: C.gray, textAlign: "center", lineHeight: 1.5, ...style }}>
      {children}
    </p>
  );
}
