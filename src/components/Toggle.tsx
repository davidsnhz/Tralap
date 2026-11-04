import { C } from "../theme/colors";

interface ToggleProps {
  on: boolean;
  onChange: () => void;
}

export function Toggle({ on, onChange }: ToggleProps) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={on}
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
          boxShadow: "0 1px 3px rgba(89,70,56,.25)",
          transform: on ? "translateX(19px)" : "translateX(0)",
          transition: "transform .25s cubic-bezier(.22,1,.36,1)",
        }}
      />
    </button>
  );
}
