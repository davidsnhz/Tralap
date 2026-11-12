import { useCallback, useEffect, useState } from "react";

export type Route =
  | { name: "home" }
  | { name: "new" }
  | { name: "data" }
  | { name: "trip"; id: string };

const HOME: Route = { name: "home" };

/** Marca las entradas de historial creadas dentro de la app. */
const IN_APP = "tralap";

const parseHash = (hash: string): Route => {
  if (hash === "#/nuevo") return { name: "new" };
  if (hash === "#/datos") return { name: "data" };
  const match = /^#\/viaje\/([^/]+)$/.exec(hash);
  return match ? { name: "trip", id: match[1] } : HOME;
};

const toUrl = (route: Route): string => {
  const base = window.location.pathname + window.location.search;
  if (route.name === "new") return `${base}#/nuevo`;
  if (route.name === "data") return `${base}#/datos`;
  if (route.name === "trip") return `${base}#/viaje/${route.id}`;
  return base;
};

/**
 * Pantalla actual guardada en el hash de la URL (no necesita reglas en el
 * hosting), para que el botón atrás del móvil y la recarga funcionen.
 */
export function useRoute() {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));

  useEffect(() => {
    const sync = (): void => setRoute(parseHash(window.location.hash));
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  /** Abre una pantalla: el botón atrás volverá a la actual. */
  const push = useCallback((next: Route): void => {
    window.history.pushState({ [IN_APP]: true }, "", toUrl(next));
    setRoute(next);
  }, []);

  /** Sustituye la pantalla actual sin añadir un paso más al botón atrás. */
  const replace = useCallback((next: Route): void => {
    window.history.replaceState(window.history.state, "", toUrl(next));
    setRoute(next);
  }, []);

  /**
   * Vuelve a Inicio. Si se entró directamente a un viaje (sin pasar por Inicio)
   * no hay a dónde retroceder sin salir de la app, así que se sustituye.
   */
  const goHome = useCallback((): void => {
    const state = window.history.state as Record<string, unknown> | null;
    if (state?.[IN_APP]) window.history.back();
    else replace(HOME);
  }, [replace]);

  return { route, push, replace, goHome };
}
