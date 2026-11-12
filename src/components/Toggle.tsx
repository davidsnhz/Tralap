import { C } from "../theme/colors";
import { EASE, SHADOW } from "../theme/tokens";

interface ToggleProps {
  on: boolean;
  onChange: () => void;
  /** id del texto que nombra el interruptor. */
  labelledBy?: string;
}

export function Toggle({ on, onChange, labelledBy }: ToggleProps) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={on}
      aria-labelledby={labelledBy}
      style={{
        width: 46,
        height: 27,
        borderRadius: 99,
        border: "none",
        cursor: "pointer",
        background: on ? C.mocha : C.taupe,
        position: "relative",
        flexShrink: 0,
        transition: "background .25s ease",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: 3,
          width: 21,
          height: 21,
          borderRadius: "50%",
          background: C.white,
          boxShadow: SHADOW.knob,
          transform: on ? "translateX(19px)" : "translateX(0)",
          transition: `transform .25s ${EASE.out}`,
        }}
      />
    </button>
  );
}
