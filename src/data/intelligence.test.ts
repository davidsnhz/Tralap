import { describe, expect, it } from "vitest";
import { buildItems, calcBasics, ESSENTIALS_BASE, RETURN_CHECKLIST, SUGGESTIONS } from "./intelligence";
import { normalizeName } from "../utils/text";

const names = (items: { name: string }[]): string[] => items.map((i) => i.name);

describe("calcBasics", () => {
  it("calcula las cantidades a partir de los días", () => {
    const byName = Object.fromEntries(calcBasics(5).map((b) => [b.name, b.qty]));
    expect(byName).toEqual({
      "Ropa interior": 6,
      Calcetines: 6,
      Camisetas: 5,
      Pantalones: 2,
      Pijama: 2,
    });
  });

  it("para un día lleva al menos dos pantalones y un pijama", () => {
    const byName = Object.fromEntries(calcBasics(1).map((b) => [b.name, b.qty]));
    expect(byName.Pantalones).toBe(2);
    expect(byName.Pijama).toBe(1);
  });
});

describe("buildItems", () => {
  it("incluye la base, las sugerencias del tipo y la lista de vuelta", () => {
    const { essentials, returnList, outfits } = buildItems("playa", 5);
    expect(names(essentials)).toEqual([...ESSENTIALS_BASE, ...SUGGESTIONS.playa]);
    expect(essentials.filter((i) => i.suggested)).toHaveLength(SUGGESTIONS.playa.length);
    expect(names(returnList)).toEqual(RETURN_CHECKLIST);
    expect(outfits.every((i) => typeof i.qty === "number")).toBe(true);
  });

  it("todos los elementos empiezan sin marcar y con ids distintos", () => {
    const { outfits, essentials, returnList } = buildItems("ciudad", 3, ["Antifaz"], ["foto"]);
    const all = [...outfits, ...essentials, ...returnList];
    expect(all.every((i) => !i.done)).toBe(true);
    expect(new Set(all.map((i) => i.id)).size).toBe(all.length);
  });

  it("una actividad sustituye a las sugerencias equivalentes (replaces)", () => {
    const { essentials } = buildItems("montana", 4, [], ["senderismo"]);
    const list = names(essentials);
    expect(list).toContain("Botas de trekking");
    expect(list).not.toContain("Botas de senderismo");
    // Cantimplora está en la sugerencia y en la actividad: aparece una sola vez, marcada como de la actividad.
    expect(list.filter((n) => n === "Cantimplora")).toHaveLength(1);
    expect(essentials.find((i) => i.name === "Cantimplora")?.fromActivity).toBe("senderismo");
  });

  it("la plantilla no duplica lo que ya está, aunque cambien mayúsculas o tildes", () => {
    const { essentials } = buildItems("playa", 5, ["  crema SOLAR ", "Tapones"]);
    const keys = essentials.map((i) => normalizeName(i.name));
    expect(keys.filter((k) => k === "crema solar")).toHaveLength(1);
    expect(essentials.find((i) => i.name === "Tapones")?.fromTemplate).toBe(true);
  });

  it("no hay nombres repetidos en ninguna combinación de tipo y actividades", () => {
    const acts = ["senderismo", "gimnasio", "fiesta", "foto", "trabajo", "agua"] as const;
    for (const type of ["playa", "montana", "ciudad", "negocios"] as const) {
      const { essentials } = buildItems(type, 7, ["Bañador", "Portátil"], [...acts]);
      const keys = essentials.map((i) => normalizeName(i.name));
      expect(new Set(keys).size).toBe(keys.length);
    }
  });
});
