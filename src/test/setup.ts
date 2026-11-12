import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// jsdom no implementa la captura del puntero que usa useSwipeX.
if (!("setPointerCapture" in Element.prototype)) {
  Object.assign(Element.prototype, { setPointerCapture: () => {} });
}

// Algunas versiones de jsdom no traen PointerEvent: basta con un MouseEvent con pointerId.
if (typeof window.PointerEvent === "undefined") {
  class PointerEventPolyfill extends MouseEvent {
    pointerId: number;
    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init);
      this.pointerId = init.pointerId ?? 1;
    }
  }
  Object.assign(window, { PointerEvent: PointerEventPolyfill });
}

afterEach(() => {
  cleanup();
  localStorage.clear();
});
