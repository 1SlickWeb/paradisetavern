import { createContext, useContext } from "react";

export const LenisContext = createContext(null);

export const useLenis = () => useContext(LenisContext);

/** Scroll to an element, selector, y offset or "top" — smooth when Lenis is running. */
export function useScrollTo() {
  const lenis = useLenis();
  return (target, { offset = -90, immediate = false } = {}) => {
    if (lenis) {
      lenis.scrollTo(target === "top" ? 0 : target, { offset, immediate, duration: 1.4 });
      return;
    }
    if (target === "top") return window.scrollTo({ top: 0, behavior: immediate ? "auto" : "smooth" });
    const el = typeof target === "string" ? document.querySelector(target) : target;
    const y = typeof target === "number" ? target : el && el.getBoundingClientRect().top + window.scrollY + offset;
    if (Number.isFinite(y)) window.scrollTo({ top: y, behavior: immediate ? "auto" : "smooth" });
  };
}
