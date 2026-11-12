import { useCallback, useEffect, useState } from "react";
import type { Sanitizer } from "../data/schema";
import { loadStored, reportSaveError, saveStored } from "../data/storage";

/**
 * Estado React persistido en localStorage con versión de formato, migraciones
 * y validación (ver data/storage.ts). Si la app está abierta en otra pestaña,
 * se adoptan sus cambios para que una no pise lo que guardó la otra.
 *
 * Uso: const [trips, setTrips] = useLocalStorage("tralap:trips", [], sanitizeTrips);
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  sanitize: Sanitizer<T>,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() =>
    loadStored(window.localStorage, key, initialValue, sanitize),
  );

  useEffect(() => {
    const onStorage = (e: StorageEvent): void => {
      if (e.storageArea !== window.localStorage || e.key !== key) return;
      setValue(loadStored(window.localStorage, key, initialValue, sanitize));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key, initialValue, sanitize]);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        // Sin espacio o almacenamiento bloqueado: la app sigue en memoria y avisa.
        // (El aviso se difiere: aquí React está calculando el estado.)
        if (!saveStored(window.localStorage, key, resolved)) queueMicrotask(reportSaveError);
        return resolved;
      });
    },
    [key],
  );

  return [value, set];
}
