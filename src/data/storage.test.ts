import { describe, expect, it } from "vitest";
import type { Trip } from "../types";
import { sanitizeTemplate, sanitizeTrips } from "./schema";
import { RESCUE_PREFIX, listRescues, loadStored, migrate, saveStored } from "./storage";

const KEY = "tralap:trips";

const trip = (over: Partial<Trip> = {}): Trip => ({
  id: "t1",
  name: "Menorca",
  type: "playa",
  days: 5,
  outfits: [{ id: "i1", name: "Camisetas", done: true, qty: 5 }],
  essentials: [{ id: "i2", name: "Pasaporte", done: false, suggested: true }],
  returnList: [],
  ...over,
});

const rescuedValues = (): (string | null)[] =>
  listRescues(localStorage).map((k) => localStorage.getItem(k));

describe("loadStored", () => {
  it("sin datos devuelve el valor inicial y no aparta nada", () => {
    expect(loadStored(localStorage, KEY, [], sanitizeTrips)).toEqual([]);
    expect(listRescues(localStorage)).toEqual([]);
  });

  it("lee lo que guarda saveStored", () => {
    saveStored(localStorage, KEY, [trip()]);
    expect(loadStored(localStorage, KEY, [], sanitizeTrips)).toEqual([trip()]);
    expect(listRescues(localStorage)).toEqual([]);
  });

  it("JSON roto: aparta el texto original y no lo pierde", () => {
    localStorage.setItem(KEY, "{roto");
    expect(loadStored(localStorage, KEY, [], sanitizeTrips)).toEqual([]);
    expect(rescuedValues()).toEqual(["{roto"]);
    expect(listRescues(localStorage)[0].startsWith(`${RESCUE_PREFIX}${KEY}:`)).toBe(true);
  });

  it("datos de una versión más nueva: los aparta tal cual", () => {
    const raw = JSON.stringify({ v: 99, data: [{ algo: "nuevo" }] });
    localStorage.setItem(KEY, raw);
    expect(loadStored(localStorage, KEY, [], sanitizeTrips)).toEqual([]);
    expect(rescuedValues()).toEqual([raw]);
  });

  it("conserva los viajes válidos y aparta una copia si alguno era ilegible", () => {
    const raw = JSON.stringify({ v: 1, data: [trip(), { sinNombre: true }, 42] });
    localStorage.setItem(KEY, raw);
    expect(loadStored(localStorage, KEY, [], sanitizeTrips)).toEqual([trip()]);
    expect(rescuedValues()).toEqual([raw]);
  });

  it("no acumula copias apartadas del mismo contenido", () => {
    localStorage.setItem(KEY, "{roto");
    loadStored(localStorage, KEY, [], sanitizeTrips, { now: new Date("2026-01-01") });
    loadStored(localStorage, KEY, [], sanitizeTrips, { now: new Date("2026-01-02") });
    expect(listRescues(localStorage)).toHaveLength(1);
  });

  it("aplica las migraciones pendientes antes de validar", () => {
    // Supuesta versión 1 que guardaba la plantilla como texto separado por comas.
    const migrations = { 1: (data: unknown) => String(data).split(",") };
    localStorage.setItem("tralap:template", JSON.stringify({ v: 1, data: "Cargador,Gafas" }));
    const value = loadStored(localStorage, "tralap:template", [], sanitizeTemplate, {
      migrations,
      version: 2,
    });
    expect(value).toEqual(["Cargador", "Gafas"]);
    expect(listRescues(localStorage)).toEqual([]);
  });

  it("si falta una migración, aparta los datos en vez de descartarlos", () => {
    const raw = JSON.stringify({ v: 1, data: ["Cargador"] });
    localStorage.setItem("tralap:template", raw);
    const value = loadStored(localStorage, "tralap:template", [], sanitizeTemplate, {
      migrations: {},
      version: 2,
    });
    expect(value).toEqual([]);
    expect(rescuedValues()).toEqual([raw]);
  });

  it("acepta datos sin sobre de versión si tienen la forma actual", () => {
    localStorage.setItem(KEY, JSON.stringify([trip()]));
    expect(loadStored(localStorage, KEY, [], sanitizeTrips)).toEqual([trip()]);
  });
});

describe("migrate", () => {
  it("encadena los pasos de versión en orden", () => {
    const migrations = {
      1: (d: unknown) => `${String(d)}>2`,
      2: (d: unknown) => `${String(d)}>3`,
    };
    expect(migrate("v1", 1, KEY, migrations, 3)).toBe("v1>2>3");
    expect(migrate("v3", 3, KEY, migrations, 3)).toBe("v3");
  });
});

describe("sanitizeTrips", () => {
  it("corrige lo que tiene arreglo obvio", () => {
    const result = sanitizeTrips([
      { id: "a", name: "  Roma ", type: "inventado", days: 400, outfits: "no", essentials: [] },
    ]);
    expect(result?.dropped).toBe(0);
    expect(result?.value[0]).toMatchObject({
      id: "a",
      name: "Roma",
      type: "ciudad",
      days: 365,
      outfits: [],
      returnList: [],
    });
  });

  it("repara ids repetidos para que React no confunda filas", () => {
    const result = sanitizeTrips([trip(), trip({ name: "Otra" })]);
    const ids = result?.value.map((t) => t.id) ?? [];
    expect(new Set(ids).size).toBe(2);
  });

  it("no es una lista: no se puede interpretar", () => {
    expect(sanitizeTrips({ trips: [] })).toBeNull();
    expect(sanitizeTemplate("Cargador")).toBeNull();
  });

  it("plantilla: quita vacíos y repetidos sin contar los repetidos como perdidos", () => {
    expect(sanitizeTemplate(["Cargador", "cargador ", "", 3, "Gafas"])).toEqual({
      value: ["Cargador", "Gafas"],
      dropped: 2,
    });
  });
});
