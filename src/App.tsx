import { useEffect } from "react";
import { Home } from "./components/Home";
import { NewTripSheet } from "./components/NewTripSheet";
import { TripView } from "./components/TripView";
import { buildItems, newId } from "./data/intelligence";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useRoute } from "./hooks/useRoute";
import type { Item, NewTripData, PackTab, Trip } from "./types";
import { normalizeName } from "./utils/text";

export default function App() {
  const [template, setTemplate] = useLocalStorage<string[]>("tralap:template", []);
  const [trips, setTrips] = useLocalStorage<Trip[]>("tralap:trips", []);
  const { route, push, replace, goHome } = useRoute();

  const openId = route.name === "trip" ? route.id : null;
  const openTrip = trips.find((t) => t.id === openId) ?? null;

  // Enlace a un viaje que ya no existe: se vuelve a Inicio.
  useEffect(() => {
    if (openId !== null && openTrip === null) replace({ name: "home" });
  }, [openId, openTrip, replace]);

  const patchOpenTrip = (patch: (trip: Trip) => Trip): void => {
    setTrips((ts) => ts.map((t) => (t.id === openId ? patch(t) : t)));
  };

  const toggleIn = (list: Item[], itemId: string): Item[] =>
    list.map((it) => (it.id === itemId ? { ...it, done: !it.done } : it));

  const toggle = (tab: PackTab, itemId: string): void => {
    patchOpenTrip((t) => ({ ...t, [tab]: toggleIn(t[tab], itemId) }));
  };

  const toggleReturn = (itemId: string): void => {
    patchOpenTrip((t) => ({ ...t, returnList: toggleIn(t.returnList, itemId) }));
  };

  /** Devuelve false si el elemento ya está en el viaje. */
  const addItem = (tab: PackTab, name: string): boolean => {
    if (openTrip === null) return false;
    const key = normalizeName(name);
    const exists = [...openTrip.outfits, ...openTrip.essentials].some(
      (it) => normalizeName(it.name) === key,
    );
    if (exists) return false;
    patchOpenTrip((t) => ({
      ...t,
      [tab]: [...t[tab], { id: newId(), name, done: false, custom: true }],
    }));
    return true;
  };

  const deleteItem = (tab: PackTab, itemId: string): void => {
    patchOpenTrip((t) => ({ ...t, [tab]: t[tab].filter((it) => it.id !== itemId) }));
  };

  const renameTrip = (id: string, name: string): void => {
    setTrips((ts) => ts.map((t) => (t.id === id ? { ...t, name } : t)));
  };

  const deleteTrip = (id: string): void => {
    setTrips((ts) => ts.filter((t) => t.id !== id));
  };

  const createTrip = ({ name, type, days, acts, useTemplate }: NewTripData): void => {
    const trip: Trip = {
      id: newId(),
      name,
      type,
      days,
      ...buildItems(type, days, useTemplate ? template : [], acts),
    };
    setTrips((ts) => [...ts, trip]);
    // Sustituye a «nuevo viaje»: atrás vuelve a Inicio, no al formulario.
    replace({ name: "trip", id: trip.id });
  };

  /** Devuelve false si el elemento ya está en la plantilla. */
  const tplAdd = (name: string): boolean => {
    const key = normalizeName(name);
    if (template.some((x) => normalizeName(x) === key)) return false;
    setTemplate((t) => [...t, name]);
    return true;
  };
  const tplRemove = (name: string): void => {
    setTemplate((t) => t.filter((x) => x !== name));
  };

  return (
    <div className="tralap flex h-full justify-center bg-backdrop">
      <div className="relative flex h-full w-full max-w-app flex-col overflow-hidden bg-fondo shadow-[0_0_60px_rgba(0,0,0,.5)]">
        {/* La key reinicia el scroll al cambiar de pantalla */}
        <div
          key={openTrip?.id ?? "home"}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
        >
          {openTrip === null ? (
            <Home
              trips={trips}
              template={template}
              onOpen={(id) => push({ name: "trip", id })}
              onNew={() => push({ name: "new" })}
              onRename={renameTrip}
              onDelete={deleteTrip}
              onTplAdd={tplAdd}
              onTplRemove={tplRemove}
            />
          ) : (
            <TripView
              trip={openTrip}
              onBack={goHome}
              onToggle={toggle}
              onAddItem={addItem}
              onDeleteItem={deleteItem}
              onToggleReturn={toggleReturn}
            />
          )}
        </div>
        {route.name === "new" && (
          <NewTripSheet
            onClose={goHome}
            onCreate={createTrip}
            templateCount={template.length}
          />
        )}
      </div>
    </div>
  );
}
