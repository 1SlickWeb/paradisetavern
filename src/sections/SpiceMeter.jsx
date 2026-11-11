import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { TriangleAlert } from "lucide-react";
import { spiceScale } from "../data/menu";
import { Chili } from "../components/Marks";
import { Eyebrow, Reveal, SplitHeading } from "../components/Reveal";
import { ease } from "../lib/motion";

/** Heat colour for a 0–1 intensity: leaf → saffron → chili → paradise red. */
function heatColor(t) {
  const stops = [
    [140, 191, 115],
    [240, 169, 59],
    [255, 90, 60],
    [208, 43, 34],
  ];
  const s = Math.min(stops.length - 1.001, t * (stops.length - 1));
  const i = Math.floor(s);
  const f = s - i;
  const [a, b] = [stops[i], stops[i + 1]];
  return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * f)).join(" ")})`;
}

const value = (lvl) => parseInt(lvl.scale, 10); // "6 / 10" → 6

function Flame({ t, color }) {
  const reduce = useReducedMotion();
  return (
    <motion.svg
      viewBox="0 0 120 160"
      className="h-full w-auto overflow-visible"
      animate={{ scale: 0.55 + t * 0.55 }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
      style={{ originY: 1 }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="flame-core" cx="50%" cy="75%" r="60%">
          <stop offset="0%" stopColor="#fff4d6" />
          <stop offset="45%" stopColor="#f7cb7f" />
          <stop offset="100%" stopColor={color} />
        </radialGradient>
      </defs>
      <motion.g className={reduce ? "" : "animate-flicker"} style={{ transformOrigin: "60px 150px" }}>
        <path d="M60 4C78 40 108 58 108 102c0 30-22 54-48 54S12 132 12 102c0-22 12-34 22-46 2 14 8 22 16 24C44 52 50 28 60 4Z" fill={color} opacity=".55" />
        <path d="M60 40c12 24 32 38 32 66 0 21-15 38-32 38s-32-17-32-38c0-14 7-22 13-30 2 9 6 14 11 16-3-18 1-34 8-52Z" fill="url(#flame-core)" />
      </motion.g>
    </motion.svg>
  );
}

export default function SpiceMeter() {
  const [lvl, setLvl] = useState(3); // Medium
  const id = useId();
  const level = spiceScale[lvl];
  const t = lvl / (spiceScale.length - 1);
  const color = heatColor(t);
  const lit = value(level);

  return (
    <section id="spice" aria-labelledby="spice-title" className="relative overflow-hidden py-24 sm:py-32">
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: 0.25 + t * 0.55 }}
        style={{ background: `radial-gradient(ellipse 55% 50% at 70% 55%, ${color}, transparent 70%)` }}
        aria-hidden="true"
      />
      <div className="container-x relative grid items-center gap-14 lg:grid-cols-2">
        <div className="min-w-0">
          <Eyebrow>The house spice scale</Eyebrow>
          <SplitHeading
            id="spice-title"
            text="How hot do you dare?"
            accent={["dare?"]}
            className="mt-5 font-display text-[clamp(2.4rem,5.5vw,4.5rem)] text-cream"
          />
          <Reveal as="p" className="mt-5 max-w-lg text-muted">
            Order by name, the way our regulars do. Our scale runs past ten, so slide it and see where you land before you tell your server.
          </Reveal>

          <Reveal className="mt-10">
            <label htmlFor={id} className="flex items-baseline justify-between text-sm text-muted">
              <span>Choose a heat level</span>
              <span className="font-display text-xl text-cream tabular-nums">{level.scale}</span>
            </label>
            <input
              id={id}
              type="range"
              min={0}
              max={spiceScale.length - 1}
              step={1}
              value={lvl}
              onChange={(e) => setLvl(Number(e.target.value))}
              aria-valuetext={`${level.label}, ${level.scale}`}
              className="spice-range mt-2"
              style={{ "--thumb": color }}
            />
            <div className="mt-1 flex justify-between text-[0.7rem] tracking-wider text-muted uppercase">
              <span>Very mild</span>
              <span>Challenge</span>
            </div>
            <div className="no-scrollbar -mx-1 mt-6 flex gap-2 overflow-x-auto px-1 pb-1">
              {spiceScale.map((s, i) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setLvl(i)}
                  aria-pressed={i === lvl}
                  className={`min-h-11 shrink-0 cursor-pointer rounded-full border px-4 text-xs font-semibold transition-colors duration-300 ${
                    i === lvl ? "border-transparent bg-cream text-ink-950" : "border-cream/15 text-cream/75 hover:border-cream/40 hover:text-cream"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal className="relative min-w-0">
          <div className="relative overflow-hidden rounded-[2rem] border border-cream/10 bg-ink-900/70 p-8 backdrop-blur-md sm:p-10">
            <div className="flex items-end gap-6">
              <div className="h-40 shrink-0 sm:h-48">
                <Flame t={t} color={color} />
              </div>
              <div className="min-w-0 pb-2">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={level.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease: ease.out }}
                  >
                    <p className="font-display text-[clamp(2.2rem,4.5vw,3.6rem)] leading-none" style={{ color }}>
                      {level.label}
                    </p>
                    <p className="mt-3 text-[1.02rem] text-cream/85" aria-live="polite">
                      {level.note}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-12 gap-1.5" role="img" aria-label={`${lit} out of 12 chillies`}>
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.span
                  key={i}
                  animate={{ opacity: i < lit ? 1 : 0.16, scale: i < lit ? 1 : 0.85, color: i < lit ? heatColor(i / 11) : "#b9ab9a" }}
                  transition={{ delay: i * 0.025, duration: 0.3 }}
                  className="flex justify-center"
                >
                  <Chili className="size-full max-w-7" />
                </motion.span>
              ))}
            </div>

            <AnimatePresence>
              {lvl >= 3 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <p className="flex items-start gap-2 pt-6 text-sm text-saffron-soft">
                    <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    House rule: dishes ordered medium to challenge can&rsquo;t be returned for being too spicy.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
