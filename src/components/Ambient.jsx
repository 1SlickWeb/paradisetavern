import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useScrollTo } from "../lib/lenis";
import { btn } from "./ui";

/* Lamp-light orbs drifting behind everything — the gold bokeh of the
   reference site. Pure CSS transforms; frozen under reduced motion. */
const ORBS = [
  { l: "6%", t: "12%", s: 320, c: "#f0a93b", o: 0.22, dx: "60px", dy: "-40px", dur: "28s" },
  { l: "78%", t: "8%", s: 260, c: "#ff8a4c", o: 0.16, dx: "-50px", dy: "50px", dur: "32s", delay: "-6s" },
  { l: "62%", t: "58%", s: 380, c: "#f0a93b", o: 0.14, dx: "-70px", dy: "-30px", dur: "36s", delay: "-12s" },
  { l: "12%", t: "70%", s: 300, c: "#d02b22", o: 0.16, dx: "50px", dy: "-60px", dur: "30s", delay: "-3s" },
  { l: "40%", t: "30%", s: 200, c: "#f7cb7f", o: 0.12, dx: "40px", dy: "40px", dur: "24s", delay: "-9s" },
  { l: "88%", t: "80%", s: 240, c: "#f0a93b", o: 0.18, dx: "-40px", dy: "-50px", dur: "27s", delay: "-15s" },
];

export function Bokeh() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {ORBS.map((o, i) => (
        <span
          key={i}
          className="bokeh-orb"
          style={{
            left: o.l,
            top: o.t,
            width: o.s,
            height: o.s,
            "--c": o.c,
            "--o": o.o,
            "--dx": o.dx,
            "--dy": o.dy,
            "--dur": o.dur,
            "--delay": o.delay,
            "--blur": "50px",
          }}
        />
      ))}
    </div>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[55] h-[3px] origin-left bg-linear-to-r from-paradise via-saffron to-saffron-soft shadow-[0_0_12px_rgb(240_169_59/0.7)]"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}

/**
 * Dot + trailing ring. Grows over anything interactive, and shows a label
 * over elements carrying data-cursor="View". Mouse-only.
 */
export function Cursor() {
  const reduce = useReducedMotion();
  const [enabled] = useState(() => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 260, damping: 26, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 260, damping: 26, mass: 0.5 });
  const [state, setState] = useState({ hover: false, label: "", hidden: true });

  useEffect(() => {
    if (!enabled || reduce) return;
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target.closest?.("a,button,[role=button],input,select,textarea,label,[data-cursor]");
      const label = t?.closest?.("[data-cursor]")?.dataset.cursor || "";
      setState((s) => (s.hover === !!t && s.label === label && !s.hidden ? s : { hover: !!t, label, hidden: false }));
    };
    const leave = () => setState((s) => ({ ...s, hidden: true }));
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [enabled, reduce, x, y]);

  if (!enabled || reduce) return null;
  const size = state.label ? 84 : state.hover ? 54 : 34;
  return (
    <div className="pointer-events-none fixed inset-0 z-[80] hidden md:block" aria-hidden="true">
      <motion.div className="absolute top-0 left-0 size-1.5 -translate-1/2 rounded-full bg-saffron" style={{ x, y, opacity: state.hidden ? 0 : 1 }} />
      <motion.div
        className="absolute top-0 left-0 flex items-center justify-center rounded-full border text-[0.7rem] font-semibold tracking-wider text-ink-950 uppercase"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%", opacity: state.hidden ? 0 : 1 }}
        animate={{
          width: size,
          height: size,
          backgroundColor: state.label ? "rgb(240 169 59 / 0.95)" : "rgb(240 169 59 / 0)",
          borderColor: state.hover ? "rgb(240 169 59 / 0.9)" : "rgb(240 169 59 / 0.45)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        {state.label}
      </motion.div>
    </div>
  );
}

export function BackToTop() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  const scrollTo = useScrollTo();
  useEffect(() => scrollY.on("change", (v) => setShow(v > 1400)), [scrollY]);
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={() => scrollTo("top")}
          className={`${btn.icon} fixed right-5 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-40 !size-12 shadow-xl`}
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
        >
          <ArrowUp className="size-5" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
