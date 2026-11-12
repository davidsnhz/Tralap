import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import type { Trip } from "./types";

const trip = (id: string, name: string): Trip => ({
  id,
  name,
  type: "playa",
  days: 2,
  outfits: [
    { id: `${id}-1`, name: "Camisetas", done: false, qty: 2 },
    { id: `${id}-2`, name: "Bañador", done: false },
  ],
  essentials: [{ id: `${id}-3`, name: "Pasaporte", done: false }],
  returnList: [{ id: `${id}-4`, name: "Cargador", done: false }],
});

const seed = (trips: Trip[], template: string[] = []): void => {
  localStorage.setItem("tralap:trips", JSON.stringify({ v: 1, data: trips }));
  localStorage.setItem("tralap:template", JSON.stringify({ v: 1, data: template }));
};

const savedTrips = (): Trip[] =>
  (JSON.parse(localStorage.getItem("tralap:trips") ?? "{}") as { data: Trip[] }).data;

beforeEach(() => {
  window.history.replaceState(null, "", "/");
  vi.useRealTimers();
});

describe("Eliminar sin deslizar y deshacer", () => {
  it("elimina un viaje desde su menú y lo recupera con Deshacer", () => {
    seed([trip("a", "Menorca"), trip("b", "Roma")]);
    window.history.replaceState(null, "", "/#/viaje/a");
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Opciones del viaje" }));
    fireEvent.click(screen.getByRole("menuitem", { name: /Eliminar viaje/ }));
    expect(savedTrips().map((t) => t.name)).toEqual(["Roma"]);

    const status = screen.getByRole("status");
    expect(status.textContent).toContain("Viaje eliminado: Menorca");
    fireEvent.click(within(status).getByRole("button", { name: "Deshacer" }));
    // Vuelve a su sitio, no al final.
    expect(savedTrips().map((t) => t.name)).toEqual(["Menorca", "Roma"]);
  });

  it("modo Editar: papelera visible en cada fila y Deshacer la devuelve a su sitio", () => {
    vi.useFakeTimers();
    seed([trip("a", "Menorca")]);
    window.history.replaceState(null, "", "/#/viaje/a");
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Editar" }));
    fireEvent.click(screen.getByRole("button", { name: "Eliminar Camisetas" }));
    act(() => vi.advanceTimersByTime(400)); // animación de plegado
    expect(savedTrips()[0].outfits.map((i) => i.name)).toEqual(["Bañador"]);

    fireEvent.click(within(screen.getByRole("status")).getByRole("button", { name: "Deshacer" }));
    expect(savedTrips()[0].outfits.map((i) => i.name)).toEqual(["Camisetas", "Bañador"]);
  });

  it("el aviso de Deshacer desaparece solo", () => {
    vi.useFakeTimers();
    seed([trip("a", "Menorca")]);
    window.history.replaceState(null, "", "/#/viaje/a");
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Opciones del viaje" }));
    fireEvent.click(screen.getByRole("menuitem", { name: /Eliminar viaje/ }));
    expect(screen.getByRole("status").textContent).toContain("Menorca");
    act(() => vi.advanceTimersByTime(7000));
    expect(screen.getByRole("status").textContent).toBe("");
  });

  it("renombra el viaje desde su menú", () => {
    seed([trip("a", "Menorca")]);
    window.history.replaceState(null, "", "/#/viaje/a");
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Opciones del viaje" }));
    fireEvent.click(screen.getByRole("menuitem", { name: /Renombrar/ }));
    const input = screen.getByRole("textbox", { name: "Nombre del viaje" });
    fireEvent.change(input, { target: { value: "Menorca 2027" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(savedTrips()[0].name).toBe("Menorca 2027");
  });

  it("las filas se pueden marcar con el teclado", () => {
    seed([trip("a", "Menorca")]);
    window.history.replaceState(null, "", "/#/viaje/a");
    render(<App />);
    const row = screen.getByRole("checkbox", { name: /Camisetas/ });
    fireEvent.keyDown(row, { key: " " });
    expect(savedTrips()[0].outfits[0].done).toBe(true);
    expect(row.getAttribute("aria-checked")).toBe("true");
  });
});

describe("Datos ilegibles", () => {
  it("no se tiran: se apartan y la hoja «Tus datos» lo dice", () => {
    localStorage.setItem("tralap:trips", "{roto");
    window.history.replaceState(null, "", "/#/datos");
    render(<App />);
    expect(screen.getByRole("dialog", { name: "Tus datos" })).toBeTruthy();
    expect(screen.getByText(/no pudo leer/)).toBeTruthy();
    const rescued = Object.keys(localStorage).filter((k) => k.startsWith("tralap:rescate:"));
    expect(rescued.map((k) => localStorage.getItem(k))).toEqual(["{roto"]);
  });
});
