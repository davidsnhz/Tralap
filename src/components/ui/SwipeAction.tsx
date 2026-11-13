import type { LucideIcon } from "lucide-react";
import { C } from "../../theme/colors";
import { FONT } from "../../theme/tokens";

const SIZES = {
  card: { width: 66, radius: 16, gap: 4, fontSize: 11, icon: 17 },
  row: { width: 66, radius: 12, gap: 3, fontSize: 10.5, icon: 16 },
} as const;

interface SwipeActionProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  /** Se ve cuando la fila está deslizada lo suficiente. */
  visible: boolean;
  tone: "danger" | "secondary";
  size: keyof typeof SIZES;
}

/** Botón que queda al descubierto al deslizar una fila o tarjeta. */
export function SwipeAction({ icon: Icon, label, onClick, visible, tone, size }: SwipeActionProps) {
  const s = SIZES[size];
  return (
    <button
      onClick={onClick}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      style={{
        width: s.width,
        border: "none",
        cursor: "pointer",
        borderRadius: s.radius,
        background: tone === "danger" ? C.rojo : C.mocha,
        color: C.snow,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: s.gap,
        fontSize: s.fontSize,
        fontWeight: 600,
        fontFamily: FONT.body,
        opacity: visible ? 1 : 0,
        transform: `scale(${visible ? 1 : 0.85})`,
        transition: "opacity .2s, transform .2s",
      }}
    >
      <Icon size={s.icon} /> {label}
    </button>
  );
}
