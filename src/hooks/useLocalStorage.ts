import { useCallback, useState } from "react";

/**
 * Versión del esquema de datos persistidos. Si el modelo cambia de forma
 * incompatible, incrementa este número y añade la migración correspondiente
 * en `migrate`.
 */
export const SCHEMA_VERSION = 1;

interface Envelope<T> {
  v: number;
  data: T;
}

/** Punto único para migrar datos de versiones anteriores del esquema. */
const migrate = <T>(stored: Envelope<unknown>, fallback: T): T => {
  if (stored.v === SCHEMA_VERSION) return stored.data as T;
  // Versión desconocida o futura: se descarta y se parte del valor inicial.
  return fallback;
};

const read = <T>(key: string, fallback: T): T => {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "v" in parsed &&
      "data" in parsed &&
      typeof (parsed as Envelope<unknown>).v === "number"
    ) {
      return migrate(parsed as Envelope<unknown>, fallback);
    }
    return fallback;
  } catch {
    return fallback;
  }
};

/**
 * Estado React persistido en localStorage con versión de esquema.
 * Uso: const [trips, setTrips] = useLocalStorage<Trip[]>("tralap:trips", []);
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => read(key, initialValue));

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        try {
          const envelope: Envelope<T> = { v: SCHEMA_VERSION, data: resolved };
          window.localStorage.setItem(key, JSON.stringify(envelope));
        } catch {
          // Sin espacio o modo privado: la app sigue funcionando en memoria.
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, set];
}
