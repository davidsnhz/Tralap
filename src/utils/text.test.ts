import { describe, expect, it } from "vitest";
import { countLabel, daysBetween, normalizeName, sinceLabel } from "./text";

describe("countLabel", () => {
  it("usa el singular solo para 1", () => {
    expect(countLabel(1, "día", "días")).toBe("1 día");
    expect(countLabel(0, "día", "días")).toBe("0 días");
    expect(countLabel(7, "día", "días")).toBe("7 días");
  });
});

describe("normalizeName", () => {
  it("ignora mayúsculas, tildes y espacios de más", () => {
    expect(normalizeName("  Cámara   de fotos ")).toBe("camara de fotos");
    expect(normalizeName("BAÑADOR")).toBe(normalizeName("bañador"));
  });
});

describe("sinceLabel", () => {
  const now = new Date(2026, 10, 12, 9, 0);
  it("cuenta días naturales, no horas", () => {
    expect(sinceLabel(new Date(2026, 10, 12, 0, 5), now)).toBe("hoy");
    expect(sinceLabel(new Date(2026, 10, 11, 23, 50), now)).toBe("ayer");
    expect(sinceLabel(new Date(2026, 10, 9, 12, 0), now)).toBe("hace 3 días");
  });
  it("pasado un mes da la fecha", () => {
    expect(sinceLabel(new Date(2026, 9, 3), now)).toBe("el 3 de octubre de 2026");
  });
  it("daysBetween ignora la hora", () => {
    expect(daysBetween(new Date(2026, 9, 13, 23, 0), now)).toBe(30);
  });
});
