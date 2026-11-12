import type { Config } from "tailwindcss";
import { C } from "./src/theme/colors.ts";

/* Los colores salen de src/theme/colors.ts: la paleta solo se define allí. */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        walnut: C.walnut,
        mocha: C.mocha,
        taupe: C.taupe,
        "off-white": C.offWhite,
        rojo: C.rojo,
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      maxWidth: {
        app: "430px",
      },
    },
  },
  plugins: [],
} satisfies Config;
