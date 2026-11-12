import type { ActivityId, Item, Trip, TripTypeId } from "../types";
import { normalizeName } from "../utils/text";
import { ACTIVITIES, TRIP_TYPES, newId } from "./intelligence";

/**
 * Comprobación de datos que vienen de fuera del código: localStorage, una copia
 * de seguridad o una versión anterior de la app. Se es tolerante: lo que se puede
 * entender se conserva, se corrige lo que tiene arreglo obvio y solo se aparta lo
 * que no tiene sentido. `dropped` cuenta lo apartado para avisar de ello.
 */
export interface Sanitized<T> {
  value: T;
  dropped: number;
}
export type Sanitizer<T> = (raw: unknown) => Sanitized<T> | null;

const TRIP_TYPE_IDS = new Set<string>(TRIP_TYPES.map((t) => t.id));
const ACTIVITY_IDS = new Set<string>(ACTIVITIES.map((a) => a.id));
const DEFAULT_TYPE: TripTypeId = "ciudad";
const MAX_DAYS = 365;

const isRecord = (x: unknown): x is Record<string, unknown> =>
  typeof x === "object" && x !== null && !Array.isArray(x);

const validId = (x: unknown): x is string => typeof x === "string" && x.length > 0;

export function sanitizeItem(raw: unknown): Item | null {
  if (!isRecord(raw) || typeof raw.name !== "string" || !raw.name.trim()) return null;
  const item: Item = {
    id: validId(raw.id) ? raw.id : newId(),
    name: raw.name.trim(),
    done: raw.done === true,
  };
  if (typeof raw.qty === "number" && Number.isFinite(raw.qty) && raw.qty >= 1) {
    item.qty = Math.round(raw.qty);
  }
  if (raw.suggested === true) item.suggested = true;
  if (raw.fromTemplate === true) item.fromTemplate = true;
  if (raw.custom === true) item.custom = true;
  if (typeof raw.fromActivity === "string" && ACTIVITY_IDS.has(raw.fromActivity)) {
    item.fromActivity = raw.fromActivity as ActivityId;
  }
  return item;
}

/** Lista de ítems: aparta los ilegibles y repara ids repetidos. */
function sanitizeItems(raw: unknown): Sanitized<Item[]> {
  if (!Array.isArray(raw)) return { value: [], dropped: 0 };
  const seen = new Set<string>();
  const value: Item[] = [];
  let dropped = 0;
  for (const entry of raw) {
    const item = sanitizeItem(entry);
    if (item === null) {
      dropped++;
      continue;
    }
    if (seen.has(item.id)) item.id = newId();
    seen.add(item.id);
    value.push(item);
  }
  return { value, dropped };
}

export function sanitizeTrip(raw: unknown): Sanitized<Trip> | null {
  if (!isRecord(raw) || typeof raw.name !== "string" || !raw.name.trim()) return null;
  const days =
    typeof raw.days === "number" && Number.isFinite(raw.days)
      ? Math.min(MAX_DAYS, Math.max(1, Math.round(raw.days)))
      : 1;
  const outfits = sanitizeItems(raw.outfits);
  const essentials = sanitizeItems(raw.essentials);
  const returnList = sanitizeItems(raw.returnList);
  return {
    value: {
      id: validId(raw.id) ? raw.id : newId(),
      name: raw.name.trim(),
      type:
        typeof raw.type === "string" && TRIP_TYPE_IDS.has(raw.type)
          ? (raw.type as TripTypeId)
          : DEFAULT_TYPE,
      days,
      outfits: outfits.value,
      essentials: essentials.value,
      returnList: returnList.value,
    },
    dropped: outfits.dropped + essentials.dropped + returnList.dropped,
  };
}

export const sanitizeTrips: Sanitizer<Trip[]> = (raw) => {
  if (!Array.isArray(raw)) return null;
  const seen = new Set<string>();
  const value: Trip[] = [];
  let dropped = 0;
  for (const entry of raw) {
    const trip = sanitizeTrip(entry);
    if (trip === null) {
      dropped++;
      continue;
    }
    dropped += trip.dropped;
    if (seen.has(trip.value.id)) trip.value.id = newId();
    seen.add(trip.value.id);
    value.push(trip.value);
  }
  return { value, dropped };
};

export const sanitizeTemplate: Sanitizer<string[]> = (raw) => {
  if (!Array.isArray(raw)) return null;
  const seen = new Set<string>();
  const value: string[] = [];
  let dropped = 0;
  for (const entry of raw) {
    const name = typeof entry === "string" ? entry.trim() : "";
    if (!name) {
      dropped++;
      continue;
    }
    // Un nombre repetido no es información perdida: simplemente se omite.
    const key = normalizeName(name);
    if (seen.has(key)) continue;
    seen.add(key);
    value.push(name);
  }
  return { value, dropped };
};
