import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import Lenis from "lenis";
import { LenisContext } from "./lenis";

/**
 * Inertial scrolling (Lenis) for the whole site. It drives the real window
 * scroll position, so framer-motion's useScroll and sticky positioning keep
 * working untouched. Skipped entirely for reduced-motion visitors.
 */
export function SmoothScroll({ children }) {
  const reduce = useReducedMotion();
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    if (reduce) return;
    const instance = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.95 });
    let raf = requestAnimationFrame(function loop(t) {
      instance.raf(t);
      raf = requestAnimationFrame(loop);
    });
    setLenis(instance);
    return () => {
      cancelAnimationFrame(raf);
      instance.destroy();
      setLenis(null);
    };
  }, [reduce]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
