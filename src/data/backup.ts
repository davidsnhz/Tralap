import type { Trip } from "../types";
import { normalizeName } from "../utils/text";
import { newId } from "./intelligence";
import { sanitizeTemplate, sanitizeTrips } from "./schema";
import { SCHEMA_VERSION, migrate } from "./storage";

/** Archivo de copia de seguridad: todo lo que hay en el dispositivo. */
export interface BackupFile {
  app: "tralap";
  v: number;
  exportedAt: string;
  trips: Trip[];
  template: string[];
}

export interface BackupData {
  trips: Trip[];
  template: string[];
}

export const LAST_BACKUP_KEY = "tralap:ultimaCopia";

export const createBackup = (
  { trips, template }: BackupData,
  now: Date = new Date(),
): BackupFile => ({
  app: "tralap",
  v: SCHEMA_VERSION,
  exportedAt: now.toISOString(),
  trips,
  template,
});

const pad = (n: number): string => String(n).padStart(2, "0");

export const backupFileName = (now: Date = new Date()): string =>
  `tralap-copia-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}.json`;

export type ParsedBackup =
  | ({ ok: true; dropped: number } & BackupData)
  | { ok: false; error: string };

const NOT_A_BACKUP = "Este archivo no es una copia de Tralap.";

/** Lee y valida el contenido de un archivo de copia. */
export function parseBackup(text: string): ParsedBackup {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: NOT_A_BACKUP };
  }
  if (typeof parsed !== "object" || parsed === null) return { ok: false, error: NOT_A_BACKUP };
  const file = parsed as Partial<Record<keyof BackupFile, unknown>>;
  if (file.app !== "tralap" || typeof file.v !== "number") {
    return { ok: false, error: NOT_A_BACKUP };
  }
  if (file.v > SCHEMA_VERSION) {
    return {
      ok: false,
      error: "Esta copia es de una versión más nueva de Tralap. Actualiza la app y vuelve a intentarlo.",
    };
  }
  try {
    const trips = sanitizeTrips(migrate(file.trips, file.v, "tralap:trips"));
    const template = sanitizeTemplate(migrate(file.template ?? [], file.v, "tralap:template"));
    if (trips === null || template === null) return { ok: false, error: NOT_A_BACKUP };
    return {
      ok: true,
      trips: trips.value,
      template: template.value,
      dropped: trips.dropped + template.dropped,
    };
  } catch {
    return { ok: false, error: NOT_A_BACKUP };
  }
}

export interface MergeResult extends BackupData {
  addedTrips: number;
  /** Viajes de la copia que ya estaban exactamente iguales. */
  existingTrips: number;
  addedTemplate: number;
}

/**
 * Añade lo de la copia a lo que ya hay, sin borrar ni sobrescribir nada.
 * Un viaje que ya está igual no se duplica; si comparte id con uno que ha
 * cambiado, se añade como un viaje más para que no se pierda ninguna versión.
 */
export function mergeBackup(current: BackupData, incoming: BackupData): MergeResult {
  // Contenido sin el id: así restaurar dos veces la misma copia no duplica nada.
  const content = (t: Trip): string => JSON.stringify({ ...t, id: undefined });
  const ids = new Set(current.trips.map((t) => t.id));
  const contents = new Set(current.trips.map(content));
  const trips = [...current.trips];
  let addedTrips = 0;
  let existingTrips = 0;
  for (const trip of incoming.trips) {
    const key = content(trip);
    if (contents.has(key)) {
      existingTrips++;
      continue;
    }
    const added = ids.has(trip.id) ? { ...trip, id: newId() } : trip;
    ids.add(added.id);
    contents.add(key);
    trips.push(added);
    addedTrips++;
  }

  const names = new Set(current.template.map(normalizeName));
  const template = [...current.template];
  let addedTemplate = 0;
  for (const name of incoming.template) {
    const key = normalizeName(name);
    if (names.has(key)) continue;
    names.add(key);
    template.push(name);
    addedTemplate++;
  }

  return { trips, template, addedTrips, existingTrips, addedTemplate };
}

export type ExportOutcome = "shared" | "downloaded" | "cancelled";

/**
 * En el móvil abre el menú de compartir (Guardar en Archivos, Drive, enviar…);
 * donde no se puede, descarga el archivo.
 */
export async function shareOrDownload(file: File, title: string): Promise<ExportOutcome> {
  const touch = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  if (touch && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title });
      return "shared";
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return "cancelled";
      // Otro fallo al compartir: se intenta la descarga normal.
    }
  }

  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
  return "downloaded";
}

export function exportBackup(data: BackupData): Promise<ExportOutcome> {
  const now = new Date();
  const json = JSON.stringify(createBackup(data, now), null, 2);
  const file = new File([json], backupFileName(now), { type: "application/json" });
  return shareOrDownload(file, "Copia de Tralap");
}

/** Descarga los datos apartados por no poder leerse (ver storage.ts). */
export function exportRescues(entries: Record<string, string | null>): Promise<ExportOutcome> {
  const now = new Date();
  const json = JSON.stringify({ app: "tralap-rescate", exportedAt: now.toISOString(), entries }, null, 2);
  const file = new File([json], `tralap-datos-apartados-${backupFileName(now).slice(13)}`, {
    type: "application/json",
  });
  return shareOrDownload(file, "Datos apartados de Tralap");
}

export function readLastBackup(): Date | null {
  try {
    const raw = window.localStorage.getItem(LAST_BACKUP_KEY);
    if (!raw) return null;
    const d = new Date(raw);
    return Number.isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}

export function writeLastBackup(date: Date): void {
  try {
    window.localStorage.setItem(LAST_BACKUP_KEY, date.toISOString());
  } catch {
    // No es crítico: solo sirve para recordar la fecha de la última copia.
  }
}
