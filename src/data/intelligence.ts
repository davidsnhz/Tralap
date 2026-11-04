import {
  Sun,
  Mountain,
  Building2,
  Briefcase,
  Footprints,
  Dumbbell,
  PartyPopper,
  Camera,
  Laptop,
  Waves,
} from "lucide-react";
import type {
  Activity,
  ActivityId,
  Item,
  Trip,
  TripType,
  TripTypeId,
} from "../types";
import { normalizeName } from "../utils/text";

export const TRIP_TYPES: TripType[] = [
  { id: "playa", label: "Playa", icon: Sun },
  { id: "montana", label: "Montaña", icon: Mountain },
  { id: "ciudad", label: "Ciudad", icon: Building2 },
  { id: "negocios", label: "Negocios", icon: Briefcase },
];

export const SUGGESTIONS: Record<TripTypeId, string[]> = {
  playa: ["Bañador", "Toalla de playa", "Crema solar", "Chanclas", "Gafas de sol", "Gorra"],
  montana: ["Botas de senderismo", "Chubasquero", "Forro polar", "Cantimplora", "Gorro", "Protector labial"],
  ciudad: ["Zapatillas cómodas", "Mochila pequeña", "Paraguas plegable", "Batería externa"],
  negocios: ["Traje / blazer", "Zapatos formales", "Portátil", "Tarjetas de visita"],
};

export const ACTIVITIES: Activity[] = [
  {
    id: "senderismo",
    label: "Senderismo",
    icon: Footprints,
    items: ["Botas de trekking", "Mochila de día", "Cantimplora"],
    replaces: ["Botas de senderismo", "Mochila pequeña"],
  },
  {
    id: "gimnasio",
    label: "Gimnasio",
    icon: Dumbbell,
    items: ["Ropa de deporte", "Zapatillas de entrenar"],
  },
  {
    id: "fiesta",
    label: "Fiesta / cena",
    icon: PartyPopper,
    items: ["Outfit de noche", "Zapatos de vestir"],
    replaces: ["Zapatos formales"],
  },
  {
    id: "foto",
    label: "Fotografía",
    icon: Camera,
    items: ["Cámara", "Baterías y tarjetas SD"],
  },
  {
    id: "trabajo",
    label: "Trabajo",
    icon: Laptop,
    items: ["Portátil y cargador", "Adaptador de enchufe"],
    replaces: ["Portátil"],
  },
  {
    id: "agua",
    label: "Agua / piscina",
    icon: Waves,
    items: ["Bañador", "Gafas de bucear", "Toalla de microfibra"],
    replaces: ["Toalla de playa"],
  },
];

export const ESSENTIALS_BASE: string[] = [
  "DNI / Pasaporte",
  "Cargador del móvil",
  "Neceser",
  "Cepillo y pasta de dientes",
  "Desodorante",
  "Medicamentos",
  "Auriculares",
  "Cartera",
];

export const RETURN_CHECKLIST: string[] = [
  "Cargadores y cables recogidos",
  "Neceser completo (ducha y lavabo)",
  "Documentos: DNI / pasaporte",
  "Revisar armario y cajones",
  "Revisar enchufes de la habitación",
  "Caja fuerte vacía",
  "Mirar debajo de la cama",
  "Nada tendido ni en el balcón",
];

export const calcBasics = (days: number): { name: string; qty: number }[] => [
  { name: "Ropa interior", qty: days + 1 },
  { name: "Calcetines", qty: days + 1 },
  { name: "Camisetas", qty: Math.ceil(days * 0.8) + 1 },
  { name: "Pantalones", qty: Math.max(2, Math.ceil(days / 3)) },
  { name: "Pijama", qty: days > 4 ? 2 : 1 },
];

export const newId = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const makeItem = (name: string, extra: Partial<Item> = {}): Item => ({
  id: newId(),
  name,
  done: false,
  ...extra,
});

/**
 * Genera las listas del viaje: outfits con cantidades de calcBasics,
 * y esenciales = base + sugerencias del tipo + ítems de actividades + plantilla,
 * sin duplicados: las actividades tienen prioridad sobre las sugerencias que ya
 * cubren, sea con el mismo nombre o porque las indican en `replaces`.
 */
export const buildItems = (
  type: TripTypeId,
  days: number,
  templateItems: string[] = [],
  actIds: ActivityId[] = [],
): Pick<Trip, "outfits" | "essentials" | "returnList"> => {
  const selected = ACTIVITIES.filter((a) => actIds.includes(a.id));
  const actItems = selected.flatMap((act) =>
    act.items.map((name) => makeItem(name, { fromActivity: act.id })),
  );
  const covered = new Set(
    selected.flatMap((act) => [...act.items, ...(act.replaces ?? [])]).map(normalizeName),
  );
  const suggested = SUGGESTIONS[type].filter((s) => !covered.has(normalizeName(s)));

  const essentials: Item[] = [];
  const seen = new Set<string>();
  const push = (item: Item): void => {
    const key = normalizeName(item.name);
    if (seen.has(key)) return;
    seen.add(key);
    essentials.push(item);
  };
  ESSENTIALS_BASE.forEach((name) => push(makeItem(name)));
  suggested.forEach((name) => push(makeItem(name, { suggested: true })));
  actItems.forEach(push);
  templateItems.forEach((name) => push(makeItem(name, { fromTemplate: true })));

  return {
    outfits: calcBasics(days).map((b) => makeItem(b.name, { qty: b.qty })),
    essentials,
    returnList: RETURN_CHECKLIST.map((name) => makeItem(name)),
  };
};
