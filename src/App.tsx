import { useCallback, useEffect, useState } from "react";
import { DataSheet } from "./components/DataSheet";
import { Home } from "./components/Home";
import { NewTripSheet } from "./components/NewTripSheet";
import { TripView } from "./components/TripView";
import { ToastHost, type ToastData } from "./components/ui/Toast";
import { mergeBackup, readLastBackup, writeLastBackup, type BackupData } from "./data/backup";
import { buildItems, newId } from "./data/intelligence";
import { requestPersistentStorage } from "./data/persist";
import { sanitizeTemplate, sanitizeTrips } from "./data/schema";
import { onSaveError } from "./data/storage";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useRoute } from "./hooks/useRoute";
import { SHADOW } from "./theme/tokens";
import type { Item, NewTripData, PackTab, Trip } from "./types";
import { daysBetween, normalizeName } from "./utils/text";

const NO_TRIPS: Trip[] = [];
const NO_TEMPLATE: string[] = [];
/** Días sin copia a partir de los que se recuerda guardar una. */
const BACKUP_REMINDER_DAYS = 30;
const UNDO_MS = 6000;
const TOAST_MS = 5000;

const insertAt = <T,>(list: T[], index: number, item: T): T[] => [
  ...list.slice(0, index),
  item,
  ...list.slice(index),
];

let toastSeq = 0;

export default function App() {
  const [template, setTemplate] = useLocalStorage("tralap:template", NO_TEMPLATE, sanitizeTemplate);
  const [trips, setTrips] = useLocalStorage("tralap:trips", NO_TRIPS, sanitizeTrips);
  const [lastBackup, setLastBackup] = useState<Date | null>(readLastBackup);
  const [toast, setToast] = useState<ToastData | null>(null);
  const { route, push, replace, goHome } = useRoute();

  const openId = route.name === "trip" ? route.id : null;
  const openTrip = trips.find((t) => t.id === openId) ?? null;

  // Enlace a un viaje que ya no existe: se vuelve a Inicio.
  useEffect(() => {
    if (openId !== null && openTrip === null) replace({ name: "home" });
  }, [openId, openTrip, replace]);

  /* ---- Avisos ---- */

  const showToast = useCallback((t: Omit<ToastData, "id">): void => {
    setToast({ ...t, id: ++toastSeq });
  }, []);
  const dismissToast = useCallback((): void => setToast(null), []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), toast.action ? UNDO_MS : TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(
    () =>
      onSaveError(() =>
        showToast({
          tone: "error",
          message:
            "No se ha podido guardar en este dispositivo. Guarda una copia para no perder los cambios.",
        }),
      ),
    [showToast],
  );

  /* ---- Viaje abierto ---- */

  const patchTrip = (tripId: string, patch: (trip: Trip) => Trip): void => {
    setTrips((ts) => ts.map((t) => (t.id === tripId ? patch(t) : t)));
  };

  const toggleIn = (list: Item[], itemId: string): Item[] =>
    list.map((it) => (it.id === itemId ? { ...it, done: !it.done } : it));

  const toggle = (tab: PackTab, itemId: string): void => {
    if (openId) patchTrip(openId, (t) => ({ ...t, [tab]: toggleIn(t[tab], itemId) }));
  };

  const toggleReturn = (itemId: string): void => {
    if (openId) patchTrip(openId, (t) => ({ ...t, returnList: toggleIn(t.returnList, itemId) }));
  };

  /** Devuelve false si el elemento ya está en el viaje. */
  const addItem = (tab: PackTab, name: string): boolean => {
    if (openTrip === null) return false;
    const key = normalizeName(name);
    const exists = [...openTrip.outfits, ...openTrip.essentials].some(
      (it) => normalizeName(it.name) === key,
    );
    if (exists) return false;
    patchTrip(openTrip.id, (t) => ({
      ...t,
      [tab]: [...t[tab], { id: newId(), name, done: false, custom: true }],
    }));
    return true;
  };

  const deleteItem = (tab: PackTab, itemId: string): void => {
    if (openTrip === null) return;
    const tripId = openTrip.id;
    const index = openTrip[tab].findIndex((it) => it.id === itemId);
    if (index < 0) return;
    const item = openTrip[tab][index];
    patchTrip(tripId, (t) => ({ ...t, [tab]: t[tab].filter((it) => it.id !== itemId) }));
    showToast({
      message: `Eliminado: ${item.name}`,
      action: {
        label: "Deshacer",
        run: () =>
          patchTrip(tripId, (t) =>
            t[tab].some((it) => it.id === itemId)
              ? t
              : { ...t, [tab]: insertAt(t[tab], index, item) },
          ),
      },
    });
  };

  /* ---- Viajes ---- */

  const renameTrip = (id: string, name: string): void => {
    setTrips((ts) => ts.map((t) => (t.id === id ? { ...t, name } : t)));
  };

  const deleteTrip = (id: string): void => {
    const index = trips.findIndex((t) => t.id === id);
    if (index < 0) return;
    const trip = trips[index];
    setTrips((ts) => ts.filter((t) => t.id !== id));
    showToast({
      message: `Viaje eliminado: ${trip.name}`,
      action: {
        label: "Deshacer",
        run: () => setTrips((ts) => (ts.some((t) => t.id === id) ? ts : insertAt(ts, index, trip))),
      },
    });
  };

  const deleteOpenTrip = (): void => {
    if (openTrip === null) return;
    const id = openTrip.id;
    goHome();
    deleteTrip(id);
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
    void requestPersistentStorage();
  };

  /* ---- Plantilla ---- */

  /** Devuelve false si el elemento ya está en la plantilla. */
  const tplAdd = (name: string): boolean => {
    const key = normalizeName(name);
    if (template.some((x) => normalizeName(x) === key)) return false;
    setTemplate((t) => [...t, name]);
    return true;
  };

  const tplRemove = (name: string): void => {
    const index = template.indexOf(name);
    if (index < 0) return;
    const key = normalizeName(name);
    setTemplate((t) => t.filter((x) => x !== name));
    showToast({
      message: `Quitado de tu plantilla: ${name}`,
      action: {
        label: "Deshacer",
        run: () =>
          setTemplate((t) =>
            t.some((x) => normalizeName(x) === key) ? t : insertAt(t, index, name),
          ),
      },
    });
  };

  /* ---- Copias de seguridad ---- */

  const importData = (incoming: BackupData) => {
    const result = mergeBackup({ trips, template }, incoming);
    setTrips(result.trips);
    setTemplate(result.template);
    void requestPersistentStorage();
    return result;
  };

  const backupSaved = (date: Date): void => {
    writeLastBackup(date);
    setLastBackup(date);
  };

  const backupDue =
    trips.length > 0 &&
    (lastBackup === null || daysBetween(lastBackup, new Date()) >= BACKUP_REMINDER_DAYS);

  return (
    <div
      className="tralap flex h-full justify-center bg-mist"
      style={{ paddingLeft: "env(safe-area-inset-left)", paddingRight: "env(safe-area-inset-right)" }}
    >
      <div
        className="relative flex h-full w-full max-w-app flex-col overflow-hidden bg-white"
        style={{ boxShadow: SHADOW.app }}
      >
        {/* La key reinicia el scroll al cambiar de pantalla */}
        <div
          key={openTrip?.id ?? "home"}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          {openTrip === null ? (
            <Home
              trips={trips}
              template={template}
              onOpen={(id) => push({ name: "trip", id })}
              onNew={() => push({ name: "new" })}
              onData={() => push({ name: "data" })}
              backupDue={backupDue}
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
              onRename={(name) => renameTrip(openTrip.id, name)}
              onDelete={deleteOpenTrip}
            />
          )}
        </div>
        {route.name === "new" && (
          <NewTripSheet onClose={goHome} onCreate={createTrip} templateCount={template.length} />
        )}
        {route.name === "data" && (
          <DataSheet
            trips={trips}
            template={template}
            lastBackup={lastBackup}
            onBackupSaved={backupSaved}
            onImport={importData}
            onClose={goHome}
          />
        )}
        <ToastHost toast={toast} onDismiss={dismissToast} />
      </div>
    </div>
  );
}
