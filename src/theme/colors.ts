/**
 * Paleta oficial de Tralap: única fuente de los colores. La usan los
 * componentes, tailwind.config.ts (clases y theme() en index.css) y
 * vite.config.ts (manifiesto y theme-color).
 *
 * El diseño es monocromo con un único acento. Casi todo es blanco, negro y
 * grises: fondo, texto, iconos, bordes y progreso. El marrón oscuro aparece
 * solo en lo que se pulsa o está elegido: el botón principal, la opción
 * seleccionada (pestañas, tipo de viaje, actividades, interruptores), la
 * casilla marcada y la cabecera del viaje. El texto y los iconos nunca van en
 * marrón: van en negro o gris, y en blanco sobre el marrón.
 */
export const C = {
  white: "#FFFFFF", // fondo de la app, tarjetas y hojas
  ink: "#141414", // negro: títulos, texto, iconos y progreso
  gray: "#636363", // texto secundario e iconos discretos
  mute: "#CFCFCF", // casillas vacías e interruptores apagados
  line: "#E8E8E8", // bordes finos y separadores
  mist: "#F5F5F5", // rellenos suaves: pistas, chips, notas, filas hechas

  walnut: "#432B17", // Pantone 161 C (#603D20) oscurecido un 30 %. El acento: botones y lo seleccionado
  espresso: "#2A1B0E", // el mismo tono, mucho más oscuro: fondo de la cabecera del viaje
  mocha: "#A0633A", // acento secundario: acción «Renombrar» al deslizar

  rojo: "#C24C34", // solo eliminar y errores
} as const;
