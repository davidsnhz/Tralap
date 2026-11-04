import type { Config } from "tailwindcss";

/**
 * Paleta oficial de Tralap.
 * Los mismos valores se exportan para JS/TS en src/theme/colors.ts.
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        walnut: "#594638",
        mocha: "#8A705B",
        taupe: "#D6CDC4",
        "off-white": "#F9F7F4",
        rojo: "#C24C34",
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
