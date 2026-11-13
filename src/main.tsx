import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App";
import "./index.css";
import { applyTheme, readTheme } from "./theme/theme";

registerSW({ immediate: true });

// Antes de pintar: así la app no parpadea en el tema equivocado.
applyTheme(readTheme());

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("No se encontró el elemento #root");

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
