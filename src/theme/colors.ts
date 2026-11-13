/**
 * Paleta oficial de Tralap: única fuente de los colores. La usan los
 * componentes, tailwind.config.ts (clases y theme() en index.css) y
 * vite.config.ts (manifiesto y theme-color).
 *
 * El diseño es monocromo con un único acento. Casi todo es blanco, negro y
 * grises: fondo, texto, iconos, bordes y progreso. El marrón aparece solo en
 * lo que se pulsa o está elegido: el botón principal, la opción seleccionada
 * (pestañas, tipo de viaje, actividades, interruptores), la casilla marcada
 * y la cabecera del viaje. El texto y los iconos nunca van en marrón.
 *
 * Hay dos temas con los mismos nombres. En el oscuro se invierten el fondo y
 * el texto, y el acento y la cabecera pasan a un lino muy claro, con el texto de
 * encima en marrón muy oscuro. Los componentes no usan estos valores
 * directamente: usan C, que apunta a variables CSS (las fija applyTheme en
 * theme.ts), así que cambian de tema sin volver a pintarse.
 */
export const THEMES = {
  light: {
    white: "#FFFFFF", // fondo de la app, tarjetas y hojas
    ink: "#141414", // títulos, texto, iconos y progreso
    gray: "#636363", // texto secundario e iconos discretos
    mute: "#CFCFCF", // casillas vacías e interruptores apagados
    line: "#E8E8E8", // bordes finos y separadores
    mist: "#F5F5F5", // rellenos suaves: pistas, chips, notas, filas hechas

    walnut: "#432B17", // el acento (Pantone 161 C oscurecido un 30 %): botones y lo seleccionado
    onAccent: "#FFFFFF", // texto e iconos sobre el acento
    espresso: "#2A1B0E", // fondo de la cabecera del viaje
    onHeader: "#FFFFFF", // texto e iconos sobre la cabecera
    headerPill: "#FFFFFF", // píldora de la opción activa dentro de la cabecera
    onHeaderPill: "#2A1B0E", // texto sobre esa píldora
    rojo: "#C24C34", // solo eliminar y errores

    // Iguales en los dos temas.
    snow: "#FFFFFF", // texto e iconos sobre Mocha o Rojo
    mocha: "#A0633A", // acento secundario: acción «Renombrar» al deslizar
  },
  dark: {
    white: "#151515",
    ink: "#F2F2F2",
    gray: "#A6A6A6",
    mute: "#4D4D4D",
    line: "#2C2C2C",
    mist: "#212121",

    walnut: "#E9DFD2", // lino: muy claro, con un punto de marrón
    onAccent: "#2A1B0E",
    espresso: "#E9DFD2", // la cabecera va en el mismo lino que los botones
    onHeader: "#2A1B0E",
    headerPill: "#151515", // el negro del fondo de la app, no marrón
    onHeaderPill: "#E9DFD2",
    rojo: "#DC6A52",

    snow: "#FFFFFF",
    mocha: "#A0633A",
  },
} as const;

export type ThemeName = keyof typeof THEMES;
export type ColorToken = keyof (typeof THEMES)["light"];

/** Nombre de la variable CSS de un color. */
export const cssVar = (token: ColorToken): string => `--c-${token}`;

/** Colores para los componentes: cada uno es una referencia a su variable CSS. */
export const C = Object.fromEntries(
  (Object.keys(THEMES.light) as ColorToken[]).map((token) => [token, `var(${cssVar(token)})`]),
) as Record<ColorToken, string>;
