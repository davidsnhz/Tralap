/** Recuento con la forma correcta: «1 día», «3 días». */
export const countLabel = (n: number, singular: string, plural: string): string =>
  `${n} ${n === 1 ? singular : plural}`;

const DAY_MS = 86_400_000;
const startOfDay = (d: Date): number =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

/** Días naturales entre dos fechas (ignora la hora; tolera cambios de horario). */
export const daysBetween = (from: Date, to: Date): number =>
  Math.round((startOfDay(to) - startOfDay(from)) / DAY_MS);

/** «hoy», «ayer», «hace 3 días» o, pasado un mes, «el 3 de octubre de 2026». */
export function sinceLabel(date: Date, now: Date = new Date()): string {
  const days = daysBetween(date, now);
  if (days <= 0) return "hoy";
  if (days === 1) return "ayer";
  if (days < 30) return `hace ${days} días`;
  return `el ${date.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}`;
}

/** Clave para comparar nombres sin tener en cuenta mayúsculas, acentos ni espacios. */
export const normalizeName = (name: string): string =>
  name
    .trim()
    .replace(/\s+/g, " ")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
