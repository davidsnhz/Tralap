/** Recuento con la forma correcta: «1 día», «3 días». */
export const countLabel = (n: number, singular: string, plural: string): string =>
  `${n} ${n === 1 ? singular : plural}`;

/** Clave para comparar nombres sin tener en cuenta mayúsculas, acentos ni espacios. */
export const normalizeName = (name: string): string =>
  name
    .trim()
    .replace(/\s+/g, " ")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
