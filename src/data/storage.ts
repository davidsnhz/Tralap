import type { Sanitizer } from "./schema";

/**
 * Versión del formato guardado. Si el modelo de datos cambia de forma
 * incompatible: súbela y añade en MIGRATIONS el paso desde la anterior.
 */
export const SCHEMA_VERSION = 1;

/** Datos guardados junto a la versión del formato con que se escribieron. */
export interface Envelope<T> {
  v: number;
  data: T;
}

/**
 * MIGRATIONS[n] convierte los datos de una clave de la versión n a la n + 1.
 * Ejemplo para una futura versión 2:
 *   1: (data, key) => key === "tralap:trips" ? (data as OldTrip[]).map(toV2) : data,
 */
export type Migration = (data: unknown, key: string) => unknown;
export const MIGRATIONS: Readonly<Record<number, Migration>> = {};

/** Prefijo de las copias de datos que no se pudieron leer: nunca se tiran. */
export const RESCUE_PREFIX = "tralap:rescate:";

export const isEnvelope = (x: unknown): x is Envelope<unknown> =>
  typeof x === "object" &&
  x !== null &&
  "v" in x &&
  "data" in x &&
  typeof (x as Envelope<unknown>).v === "number";

/** Lleva los datos de la versión `from` a la actual, paso a paso. */
export function migrate(
  data: unknown,
  from: number,
  key: string,
  migrations: Readonly<Record<number, Migration>> = MIGRATIONS,
  to: number = SCHEMA_VERSION,
): unknown {
  let out = data;
  for (let v = from; v < to; v++) {
    const step = migrations[v];
    if (!step) throw new Error(`Falta la migración de la versión ${v} a la ${v + 1}`);
    out = step(out, key);
  }
  return out;
}

/** Aparta una copia literal de lo guardado (una sola vez por contenido). */
function rescue(storage: Storage, key: string, raw: string, now: Date): void {
  try {
    const prefix = `${RESCUE_PREFIX}${key}:`;
    const already = Object.keys(storage).some(
      (k) => k.startsWith(prefix) && storage.getItem(k) === raw,
    );
    if (!already) storage.setItem(`${prefix}${now.toISOString()}`, raw);
  } catch {
    // Sin espacio: no se puede apartar, pero tampoco se borra nada aquí.
  }
}

export interface LoadOptions {
  migrations?: Readonly<Record<number, Migration>>;
  version?: number;
  now?: Date;
}

/**
 * Lee una clave de forma segura. Lo que no se puede entender del todo (JSON roto,
 * una versión más nueva de la app, elementos ilegibles) se copia aparte con el
 * prefijo RESCUE_PREFIX antes de seguir, así nunca se pierde en silencio.
 */
export function loadStored<T>(
  storage: Storage,
  key: string,
  fallback: T,
  sanitize: Sanitizer<T>,
  { migrations = MIGRATIONS, version = SCHEMA_VERSION, now = new Date() }: LoadOptions = {},
): T {
  let raw: string | null;
  try {
    raw = storage.getItem(key);
  } catch {
    return fallback;
  }
  if (raw === null) return fallback;

  try {
    const parsed: unknown = JSON.parse(raw);
    // Sin sobre de versión se interpreta como datos del formato actual.
    const env: Envelope<unknown> = isEnvelope(parsed) ? parsed : { v: version, data: parsed };
    if (env.v > version) {
      // Escrito por una versión más nueva de la app: se guarda tal cual.
      rescue(storage, key, raw, now);
      return fallback;
    }
    const clean = sanitize(migrate(env.data, env.v, key, migrations, version));
    if (clean === null) {
      rescue(storage, key, raw, now);
      return fallback;
    }
    if (clean.dropped > 0) rescue(storage, key, raw, now);
    return clean.value;
  } catch {
    rescue(storage, key, raw, now);
    return fallback;
  }
}

/** Guarda con el sobre de versión. Devuelve false si el navegador no lo permite. */
export function saveStored<T>(storage: Storage, key: string, value: T): boolean {
  try {
    const envelope: Envelope<T> = { v: SCHEMA_VERSION, data: value };
    storage.setItem(key, JSON.stringify(envelope));
    return true;
  } catch {
    return false;
  }
}

/** Claves con datos apartados, de la más antigua a la más reciente. */
export function listRescues(storage: Storage): string[] {
  try {
    return Object.keys(storage)
      .filter((k) => k.startsWith(RESCUE_PREFIX))
      .sort();
  } catch {
    return [];
  }
}

/* ---- Avisos de error al guardar (p. ej. sin espacio) ---- */

type Listener = () => void;
const saveErrorListeners = new Set<Listener>();

export function onSaveError(listener: Listener): () => void {
  saveErrorListeners.add(listener);
  return () => {
    saveErrorListeners.delete(listener);
  };
}

export function reportSaveError(): void {
  saveErrorListeners.forEach((l) => l());
}
