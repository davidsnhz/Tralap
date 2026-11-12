/**
 * Paleta oficial de Tralap: única fuente de los colores. La usan los
 * componentes, tailwind.config.ts (clases y theme() en index.css) y
 * vite.config.ts (manifiesto y theme-color).
 *
 * Texto: Walnut es el principal. Mocha solo para texto secundario sobre Pure
 * White; sobre Off White se queda corto de contraste y se usa Walnut. Sobre
 * superficies Walnut, el texto secundario y el progreso van en Soft Taupe.
 */
export const C = {
  walnut: "#594638", // botones principales, iconos destacados, navegación activa
  mocha: "#8A705B", // botones secundarios, progreso y detalles gráficos
  taupe: "#D6CDC4", // chips, etiquetas, separadores y elementos desactivados
  offWhite: "#F9F7F4", // fondo general de la aplicación
  white: "#FFFFFF", // tarjetas, modales, formularios y superficies elevadas
  rojo: "#C24C34", // fuera de la paleta: solo eliminar y errores
} as const;
