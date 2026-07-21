import { useState } from "react";
import { Home } from "./components/Home";
import { NewTripSheet } from "./components/NewTripSheet";
import { TripView } from "./components/TripView";
import { buildItems, newId } from "./data/intelligence";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { Item, NewTripData, PackTab, Trip } from "./types";

export default function App() {
  const [template, setTemplate] = useLocalStorage<string[]>("tralap:template", []);
  const [trips, setTrips] = useLocalStorage<Trip[]>("tralap:trips", []);
  const [openId, setOpenId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);

  const openTrip = trips.find((t) => t.id === openId) ?? null;

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

  const addItem = (tab: PackTab, name: string): void => {
    patchOpenTrip((t) => ({
      ...t,
      [tab]: [...t[tab], { id: newId(), name, done: false, custom: true }],
    }));
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
    setShowNew(false);
    setOpenId(trip.id);
  };

  const tplAdd = (name: string): void => {
    setTemplate((t) => (t.includes(name) ? t : [...t, name]));
  };
  const tplRemove = (name: string): void => {
    setTemplate((t) => t.filter((x) => x !== name));
  };

  return (
    <div className="tralap flex min-h-full justify-center bg-backdrop">
      <div className="relative flex min-h-full w-full max-w-app flex-col bg-fondo shadow-[0_0_60px_rgba(0,0,0,.5)]">
        <div className="flex-1 overflow-y-auto">
          {openTrip === null ? (
            <Home
              trips={trips}
              template={template}
              onOpen={setOpenId}
              onNew={() => setShowNew(true)}
              onRename={renameTrip}
              onDelete={deleteTrip}
              onTplAdd={tplAdd}
              onTplRemove={tplRemove}
            />
          ) : (
            <TripView
              key={openTrip.id}
              trip={openTrip}
              onBack={() => setOpenId(null)}
              onToggle={toggle}
              onAddItem={addItem}
              onDeleteItem={deleteItem}
              onToggleReturn={toggleReturn}
            />
          )}
        </div>
        {showNew && (
          <NewTripSheet
            onClose={() => setShowNew(false)}
            onCreate={createTrip}
            templateCount={template.length}
          />
        )}
      </div>
    </div>
  );
}
