import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { C } from "../../theme/colors";
import { EASE, FONT, SHADOW, veil } from "../../theme/tokens";

export interface TabOption<T extends string> {
  id: T;
  label: string;
  icon: LucideIcon;
}

interface SegmentedTabsProps<T extends string> {
  tabs: TabOption<T>[];
  value: T;
  onChange: (id: T) => void;
  /** "onDark" para usarlo dentro de la cabecera oscura del viaje. */
  tone?: "default" | "onDark";
  style?: CSSProperties;
}

const TONES = {
  default: { track: C.mist, pill: C.walnut, active: C.white, idle: C.gray },
  onDark: { track: veil(0.1), pill: C.white, active: C.ink, idle: veil(0.72) },
} as const;

const PAD = 4;

/** Selector de una sola pieza: la píldora se desliza hasta la opción activa. */
export function SegmentedTabs<T extends string>({
  tabs,
  value,
  onChange,
  tone = "default",
  style,
}: SegmentedTabsProps<T>) {
  const colors = TONES[tone];
  const index = Math.max(
    0,
    tabs.findIndex((t) => t.id === value),
  );

  return (
    <div style={style}>
      <div
        style={{
          position: "relative",
          display: "flex",
          padding: PAD,
          borderRadius: 14,
          background: colors.track,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: PAD,
            bottom: PAD,
            left: PAD,
            width: `calc((100% - ${PAD * 2}px) / ${tabs.length})`,
            transform: `translateX(${index * 100}%)`,
            borderRadius: 10,
            background: colors.pill,
            boxShadow: SHADOW.raised,
            transition: `transform .3s ${EASE.out}`,
          }}
        />
        {tabs.map((t) => {
          const active = value === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              aria-pressed={active}
              style={{
                flex: 1,
                position: "relative",
                zIndex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                padding: "10px 0",
                border: "none",
                borderRadius: 10,
                background: "transparent",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: FONT.body,
                color: active ? colors.active : colors.idle,
                transition: "color .25s",
              }}
            >
              <t.icon size={15} /> {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
