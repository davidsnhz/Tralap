import type { Config } from "tailwindcss";

/**
 * Paleta oficial de Tralap (fuente de verdad: tralap-mockup-v6.jsx, objeto C).
 * Los mismos valores se exportan para JS/TS en src/theme/colors.ts.
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        negro: "#141414",
        gris: "#55555A",
        "gris-suave": "#A3A3A8",
        fondo: "#F4F4F5",
        linea: "#E5E5E8",
        blanco: "#FFFFFF",
        marron: "#A9805B",
        verde: "#5B7B54",
        rojo: "#C24C34",
        "verde-claro": "#8FBC85",
        backdrop: "#111113",
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
