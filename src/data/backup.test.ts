import { describe, expect, it } from "vitest";
import type { Trip } from "../types";
import { backupFileName, createBackup, mergeBackup, parseBackup } from "./backup";
import { SCHEMA_VERSION } from "./storage";

const trip = (id: string, name: string, done = false): Trip => ({
  id,
  name,
  type: "ciudad",
  days: 3,
  outfits: [{ id: `${id}-1`, name: "Camisetas", done, qty: 3 }],
  essentials: [],
  returnList: [],
});

describe("createBackup / parseBackup", () => {
  it("una copia recién hecha se lee igual", () => {
    const data = { trips: [trip("a", "Roma")], template: ["Cargador"] };
    const file = createBackup(data, new Date("2026-11-12T10:00:00Z"));
    expect(file).toMatchObject({ app: "tralap", v: SCHEMA_VERSION, exportedAt: "2026-11-12T10:00:00.000Z" });
    expect(parseBackup(JSON.stringify(file))).toEqual({ ok: true, dropped: 0, ...data });
  });

  it("nombre de archivo con la fecha", () => {
    expect(backupFileName(new Date(2026, 0, 5))).toBe("tralap-copia-2026-01-05.json");
  });

  it("rechaza archivos que no son copias de Tralap", () => {
    for (const text of ["no es json", "null", "[]", JSON.stringify({ trips: [] })]) {
      const result = parseBackup(text);
      expect(result.ok).toBe(false);
    }
  });

  it("avisa si la copia es de una versión más nueva", () => {
    const result = parseBackup(JSON.stringify({ app: "tralap", v: SCHEMA_VERSION + 1, trips: [] }));
    expect(result).toMatchObject({ ok: false });
    expect(!result.ok && result.error).toMatch(/versión más nueva/);
  });

  it("sin plantilla en el archivo se entiende como vacía", () => {
    const result = parseBackup(JSON.stringify({ app: "tralap", v: 1, trips: [] }));
    expect(result).toEqual({ ok: true, trips: [], template: [], dropped: 0 });
  });
});

describe("mergeBackup", () => {
  it("añade sin borrar nada de lo que ya hay", () => {
    const current = { trips: [trip("a", "Roma")], template: ["Cargador"] };
    const incoming = { trips: [trip("b", "Lisboa")], template: ["Gafas"] };
    const r = mergeBackup(current, incoming);
    expect(r.trips.map((t) => t.name)).toEqual(["Roma", "Lisboa"]);
    expect(r.template).toEqual(["Cargador", "Gafas"]);
    expect(r).toMatchObject({ addedTrips: 1, existingTrips: 0, addedTemplate: 1 });
  });

  it("restaurar la misma copia dos veces no duplica", () => {
    const backup = { trips: [trip("a", "Roma")], template: ["Cargador"] };
    const once = mergeBackup({ trips: [], template: [] }, backup);
    const twice = mergeBackup(once, backup);
    expect(twice.trips).toHaveLength(1);
    expect(twice.template).toEqual(["Cargador"]);
    expect(twice).toMatchObject({ addedTrips: 0, existingTrips: 1, addedTemplate: 0 });
  });

  it("mismo id pero contenido distinto: conserva las dos versiones", () => {
    const current = { trips: [trip("a", "Roma", true)], template: [] };
    const incoming = { trips: [trip("a", "Roma", false)], template: [] };
    const r = mergeBackup(current, incoming);
    expect(r.trips).toHaveLength(2);
    expect(r.trips[0]).toBe(current.trips[0]);
    expect(r.trips[1].id).not.toBe("a");
    // Y repetir la restauración ya no añade otra copia más.
    expect(mergeBackup(r, incoming).trips).toHaveLength(2);
  });

  it("la plantilla se une sin repetir nombres (mayúsculas y acentos aparte)", () => {
    const r = mergeBackup(
      { trips: [], template: ["Cepillo de dientes"] },
      { trips: [], template: ["cepillo de DIENTES", "Pasaporte"] },
    );
    expect(r.template).toEqual(["Cepillo de dientes", "Pasaporte"]);
  });
});
