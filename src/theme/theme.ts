import { THEMES, cssVar, type ColorToken, type ThemeName } from "./colors";

const THEME_KEY = "tralap:tema";

const isThemeName = (value: unknown): value is ThemeName => value === "light" || value === "dark";

/** Tema elegido por el usuario; si aún no ha elegido, el del sistema. */
export function readTheme(): ThemeName {
  try {
    const saved = window.localStorage.getItem(THEME_KEY);
    if (isThemeName(saved)) return saved;
  } catch {
    // Sin acceso al almacenamiento: se usa el del sistema.
  }
  const prefersDark =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export function saveTheme(theme: ThemeName): void {
  try {
    window.localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Si no se puede guardar, el tema vale solo para esta sesión.
  }
}

/** Fija las variables CSS de la paleta y el color de la barra del navegador. */
export function applyTheme(theme: ThemeName): void {
  const root = document.documentElement;
  const palette = THEMES[theme];
  for (const token of Object.keys(palette) as ColorToken[]) {
    root.style.setProperty(cssVar(token), palette[token]);
  }
  root.style.colorScheme = theme;
  root.dataset.theme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? palette.white : palette.walnut);
}
