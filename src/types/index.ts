import type { LucideIcon } from "lucide-react";

export type TripTypeId = "playa" | "montana" | "ciudad" | "negocios";

export type ActivityId =
  | "senderismo"
  | "gimnasio"
  | "fiesta"
  | "foto"
  | "trabajo"
  | "agua";

export interface TripType {
  id: TripTypeId;
  label: string;
  icon: LucideIcon;
}

export interface Activity {
  id: ActivityId;
  label: string;
  icon: LucideIcon;
  items: string[];
  /** Sugerencias del tipo de viaje que esta actividad ya cubre con sus ítems. */
  replaces?: string[];
}

/** Elemento de checklist (outfits, esenciales o lista de vuelta). */
export interface Item {
  id: string;
  name: string;
  done: boolean;
  /** Cantidad calculada (solo outfits). */
  qty?: number;
  /** Sugerido por el tipo de viaje. */
  suggested?: boolean;
  /** Proviene de la plantilla personal. */
  fromTemplate?: boolean;
  /** Proviene de una actividad seleccionada. */
  fromActivity?: ActivityId;
  /** Añadido a mano por el usuario. */
  custom?: boolean;
}

export interface Trip {
  id: string;
  name: string;
  type: TripTypeId;
  days: number;
  outfits: Item[];
  essentials: Item[];
  returnList: Item[];
}

export type PackTab = "outfits" | "essentials";
export type TripMode = "ida" | "vuelta";
export type HomeTab = "viajes" | "plantilla";

export interface NewTripData {
  name: string;
  type: TripTypeId;
  days: number;
  acts: ActivityId[];
  useTemplate: boolean;
}
