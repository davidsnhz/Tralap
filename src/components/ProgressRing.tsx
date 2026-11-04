import { C } from "../theme/colors";

interface ProgressRingProps {
  pct: number;
}

/* Va sobre la cabecera Walnut, donde Mocha no se distingue: usa Soft Taupe. */
export function ProgressRing({ pct }: ProgressRingProps) {
  const R = 26;
  const CIRC = 2 * Math.PI * R;
  return (
    <div style={{ position: "relative", width: 64, height: 64 }}>
      <svg width="64" height="64" style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx="32"
          cy="32"
          r={R}
          fill="none"
          stroke="rgba(255,255,255,.15)"
          strokeWidth="6"
        />
        <circle
          cx="32"
          cy="32"
          r={R}
          fill="none"
          stroke={pct === 100 ? C.white : C.taupe}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC * (1 - pct / 100)}
          style={{
            transition:
              "stroke-dashoffset .5s cubic-bezier(.22,1,.36,1), stroke .3s",
          }}
        />
      </svg>
      <div
        className="display"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          fontWeight: 700,
          color: C.white,
        }}
      >
        {pct}%
      </div>
    </div>
  );
}
