import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { useSwipeX } from "./useSwipeX";

const ACTION_W = 100;

function Row({ label, onTap }: { label: string; onTap: () => void }) {
  const { dx, handlers } = useSwipeX({ actionWidth: ACTION_W, overshoot: 20, snapDivisor: 2, onTap });
  return (
    <div data-testid={label} data-dx={dx} {...handlers}>
      {label}
    </div>
  );
}

const dxOf = (label: string): number => Number(screen.getByTestId(label).dataset.dx);

const press = (el: HTMLElement, x: number, y: number): void => {
  fireEvent.pointerDown(el, { clientX: x, clientY: y, pointerId: 1 });
};
const move = (el: HTMLElement, x: number, y: number): void => {
  fireEvent.pointerMove(el, { clientX: x, clientY: y, pointerId: 1 });
};

describe("useSwipeX", () => {
  it("un toque sin movimiento dispara onTap", () => {
    const onTap = vi.fn();
    render(<Row label="a" onTap={onTap} />);
    const el = screen.getByTestId("a");
    press(el, 200, 50);
    move(el, 203, 52);
    fireEvent.pointerUp(el);
    expect(onTap).toHaveBeenCalledTimes(1);
  });

  it("desplazar en vertical no cuenta como toque ni abre la fila", () => {
    const onTap = vi.fn();
    render(<Row label="a" onTap={onTap} />);
    const el = screen.getByTestId("a");
    press(el, 200, 50);
    move(el, 202, 120);
    fireEvent.pointerUp(el);
    expect(onTap).not.toHaveBeenCalled();
    expect(dxOf("a")).toBe(0);
  });

  it("si el navegador cancela el gesto (scroll), no hay toque", () => {
    const onTap = vi.fn();
    render(<Row label="a" onTap={onTap} />);
    const el = screen.getByTestId("a");
    press(el, 200, 50);
    fireEvent.pointerCancel(el);
    fireEvent.pointerUp(el);
    expect(onTap).not.toHaveBeenCalled();
  });

  it("deslizar a la izquierda más de la mitad abre las acciones", () => {
    render(<Row label="a" onTap={vi.fn()} />);
    const el = screen.getByTestId("a");
    press(el, 300, 50);
    move(el, 200, 52);
    fireEvent.pointerUp(el);
    expect(dxOf("a")).toBe(-ACTION_W);
  });

  it("un deslizamiento corto vuelve a cerrar", () => {
    render(<Row label="a" onTap={vi.fn()} />);
    const el = screen.getByTestId("a");
    press(el, 300, 50);
    move(el, 270, 50);
    fireEvent.pointerUp(el);
    expect(dxOf("a")).toBe(0);
  });

  it("con la fila abierta, un toque la cierra sin disparar onTap", () => {
    const onTap = vi.fn();
    render(<Row label="a" onTap={onTap} />);
    const el = screen.getByTestId("a");
    press(el, 300, 50);
    move(el, 180, 50);
    fireEvent.pointerUp(el);
    press(el, 150, 50);
    fireEvent.pointerUp(el);
    expect(dxOf("a")).toBe(0);
    expect(onTap).not.toHaveBeenCalled();
  });

  it("solo puede haber una fila abierta: tocar otra cierra la primera sin abrir nada", () => {
    const onTapB = vi.fn();
    render(
      <>
        <Row label="a" onTap={vi.fn()} />
        <Row label="b" onTap={onTapB} />
      </>,
    );
    const a = screen.getByTestId("a");
    const b = screen.getByTestId("b");
    press(a, 300, 50);
    move(a, 180, 50);
    fireEvent.pointerUp(a);
    expect(dxOf("a")).toBe(-ACTION_W);
    press(b, 200, 120);
    fireEvent.pointerUp(b);
    expect(dxOf("a")).toBe(0);
    expect(onTapB).not.toHaveBeenCalled();
  });
});
