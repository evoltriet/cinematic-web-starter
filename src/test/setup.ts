import "@testing-library/jest-dom/vitest";

class IntersectionObserverMock implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly thresholds = [0];
  constructor(private readonly callback: IntersectionObserverCallback) {}
  disconnect() {}
  observe(target: Element) { this.callback([{ isIntersecting: true, intersectionRatio: 1, target } as IntersectionObserverEntry], this); }
  takeRecords() { return []; }
  unobserve() {}
}

Object.defineProperty(window, "IntersectionObserver", { writable: true, value: IntersectionObserverMock });
Object.defineProperty(globalThis, "IntersectionObserver", { writable: true, value: IntersectionObserverMock });
Object.defineProperty(window, "matchMedia", { writable: true, value: (query: string) => ({ matches: false, media: query, onchange: null, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false }) });
Object.defineProperty(window, "scrollTo", { writable: true, value: () => {} });
