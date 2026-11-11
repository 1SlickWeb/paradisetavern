import { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import Logo from "./Logo";
import { ease } from "../lib/motion";

const KEY = "pt-intro-seen";

function seenThisSession() {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * First-visit intro: the wok mark, the script name drawing in and a 0–100
 * counter, then the whole panel lifts away. Runs once per browser session,
 * never for reduced-motion visitors, and is never longer than ~2s.
 */
export default function Preloader({ onDone }) {
  const reduce = useReducedMotion();
  const [skip] = useState(() => reduce || seenThisSession());
  const [leaving, setLeaving] = useState(false);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => String(Math.round(v)).padStart(3, "0"));

  useEffect(() => {
    if (skip) {
      onDone();
      return;
    }
    const controls = animate(count, 100, {
      duration: 1.5,
      ease: [0.65, 0, 0.35, 1],
      onComplete: () => {
        try {
          sessionStorage.setItem(KEY, "1");
        } catch {
          /* private mode: the intro will just show again */
        }
        setLeaving(true);
        setTimeout(onDone, 350);
      },
    });
    return () => controls.stop();
  }, [skip, count, onDone]);

  if (skip) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink-950"
      initial={{ y: 0 }}
      animate={leaving ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 0.9, ease: ease.inOut }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgb(208_43_34/0.22),transparent_55%)]" />
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: ease.out }}
      >
        {/* the logo draws in from the top, pan first, badge last */}
        <motion.div
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1.3, ease: ease.inOut, delay: 0.1 }}
        >
          <Logo alt="" className="h-56 sm:h-72" fetchPriority="high" />
        </motion.div>
      </motion.div>
      <div className="absolute right-6 bottom-6 font-display text-6xl text-cream/15 lining-nums tabular-nums sm:right-10 sm:bottom-8 sm:text-8xl">
        <motion.span>{rounded}</motion.span>
      </div>
      <div className="absolute bottom-8 left-6 text-xs tracking-[0.3em] text-muted uppercase sm:left-10">Lone Tree · Colorado</div>
    </motion.div>
  );
}
