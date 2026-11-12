import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { C } from "../../theme/colors";
import { EASE, FONT, SHADOW } from "../../theme/tokens";

export interface TabOption<T extends string> {
  id: T;
  label: string;
  icon: LucideIcon;
}

interface SegmentedTabsProps<T extends string> {
  tabs: TabOption<T>[];
  value: T;
  onChange: (id: T) => void;
  style?: CSSProperties;
}

/** Pestañas grandes a todo el ancho: la activa va en Walnut. */
export function SegmentedTabs<T extends string>({ tabs, value, onChange, style }: SegmentedTabsProps<T>) {
  return (
    <div style={{ display: "flex", gap: 8, ...style }}>
      {tabs.map((t) => {
        const active = value === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            aria-pressed={active}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "12px 0",
              borderRadius: 12,
              cursor: "pointer",
              fontSize: 14.5,
              fontWeight: 700,
              fontFamily: FONT.display,
              border: `1px solid ${active ? C.walnut : C.taupe}`,
              background: active ? C.walnut : C.white,
              color: active ? C.white : C.mocha,
              boxShadow: active ? SHADOW.raised : "none",
              transform: active ? "translateY(-1px)" : "none",
              transition: `all .25s ${EASE.out}`,
            }}
          >
            <t.icon size={16} /> {t.label}
          </button>
        );
      })}
    </div>
  );
}
