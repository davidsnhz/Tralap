import { C } from "../theme/colors";
import { EASE, veil } from "../theme/tokens";

interface ProgressRingProps {
  pct: number;
}

/* Va sobre la cabecera oscura del viaje: pista en blanco translúcido y avance en blanco. */
export function ProgressRing({ pct }: ProgressRingProps) {
  const R = 26;
  const CIRC = 2 * Math.PI * R;
  return (
    <div style={{ position: "relative", width: 64, height: 64, flexShrink: 0 }}>
      <svg width="64" height="64" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="32" cy="32" r={R} fill="none" stroke={veil(0.16)} strokeWidth="5" />
        <circle
          cx="32"
          cy="32"
          r={R}
          fill="none"
          stroke={C.white}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC * (1 - pct / 100)}
          style={{ transition: `stroke-dashoffset .5s ${EASE.out}` }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13.5,
          fontWeight: 600,
          fontVariantNumeric: "tabular-nums",
          color: C.white,
        }}
      >
        {pct}%
      </div>
    </div>
  );
}
