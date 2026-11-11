import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDown, ArrowRight, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { orbitDishes } from "../data/orbit";
import { categories } from "../data/menu";
import { mediaSrc } from "../data/media";
import { priceLabel, pad2 } from "../lib/format";
import { OrderButton } from "../lib/order";
import { useScrollTo } from "../lib/lenis";
import { useIntroDone } from "../lib/intro";
import { ease } from "../lib/motion";
import { Heat } from "../components/Marks";
import { btn } from "../components/ui";

const N = orbitDishes.length;
const STEP_SVH = 32; // scroll distance per dish
const TAU = Math.PI * 2;
const catLabel = Object.fromEntries(categories.map((c) => [c.id, c.label]));

/** Hold on each dish, then glide to the next: a smoothstep with dwell. */
function dwell(t) {
  const i = Math.floor(t);
  const f = t - i;
  const k = Math.min(1, Math.max(0, (f - 0.22) / 0.56));
  return i + k * k * (3 - 2 * k);
}

/** Where plate `i` sits on the ellipse for rotation `r`. */
function place(i, r, g) {
  const a = ((i - r) / N) * TAU;
  const k = (Math.cos(a) + 1) / 2; // 1 = front, 0 = back
  return { x: Math.sin(a) * g.rx, y: Math.cos(a) * g.ry, k, a };
}

function Plate({ dish, i, rot, geo, size, cy, intro, onPick }) {
  const x = useTransform([rot, geo], ([r, g]) => place(i, r, g).x);
  const y = useTransform([rot, geo], ([r, g]) => place(i, r, g).y);
  const scale = useTransform([rot, geo], ([r, g]) => 0.2 + 0.8 * Math.pow(place(i, r, g).k, 2));
  const zIndex = useTransform([rot, geo], ([r, g]) => Math.round(place(i, r, g).k * 100));
  const shade = useTransform([rot, geo], ([r, g]) => (1 - place(i, r, g).k) * 0.78);
  const spin = useTransform(rot, (r) => (i - r) * 38);

  return (
    <motion.div
      className="absolute left-1/2"
      style={{ x, y, scale, zIndex, width: size, height: size, top: cy - size / 2, marginLeft: -size / 2 }}
    >
      <motion.button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={() => onPick(i)}
        className="relative block size-full cursor-pointer rounded-full"
        initial={{ opacity: 0, scale: 0.3 }}
        animate={intro ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.3 }}
        transition={{ duration: 1.1, ease: ease.out, delay: 0.25 + ((i * 3) % N) * 0.05 }}
      >
        {/* contact shadow */}
        <span className="absolute inset-x-[8%] -bottom-[14%] h-[22%] rounded-[50%] bg-black/70 blur-xl" />
        <motion.span className="absolute inset-0 overflow-hidden rounded-full ring-1 ring-saffron/35 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.9),inset_0_0_0_6px_rgb(246_238_227/0.06)]" style={{ rotate: spin }}>
          <img
            src={mediaSrc(dish.img)}
            alt=""
            draggable="false"
            className="size-full object-cover"
            style={{ objectPosition: dish.pos, transform: `scale(${dish.zoom})`, transformOrigin: dish.pos }}
            loading={i < 4 ? "eager" : "lazy"}
            decoding="async"
          />
          <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgb(255_255_255/0.16),transparent_45%)]" />
        </motion.span>
        <motion.span className="absolute inset-0 rounded-full bg-ink-950" style={{ opacity: shade }} />
      </motion.button>
    </motion.div>
  );
}

function Mandala({ rot, offset }) {
  const rotate = useTransform(rot, (r) => r * 14);
  const rotateB = useTransform(rot, (r) => -r * 9);
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center" style={{ transform: `translateY(${offset}px)` }} aria-hidden="true">
      <motion.svg viewBox="0 0 600 600" className="absolute size-[min(120vw,980px)] opacity-[0.16]" style={{ rotate }}>
        <circle cx="300" cy="300" r="290" fill="none" stroke="#f0a93b" strokeWidth="0.8" strokeDasharray="2 10" />
        <circle cx="300" cy="300" r="240" fill="none" stroke="#f0a93b" strokeWidth="0.6" />
        {Array.from({ length: 24 }).map((_, i) => (
          <path
            key={i}
            d="M300 70 C 312 110, 312 140, 300 170 C 288 140, 288 110, 300 70Z"
            fill="none"
            stroke="#f0a93b"
            strokeWidth="0.7"
            transform={`rotate(${i * 15} 300 300)`}
          />
        ))}
      </motion.svg>
      <motion.svg viewBox="0 0 600 600" className="absolute size-[min(80vw,640px)] opacity-[0.12]" style={{ rotate: rotateB }}>
        <circle cx="300" cy="300" r="280" fill="none" stroke="#f7cb7f" strokeWidth="0.8" strokeDasharray="1 7" />
        {Array.from({ length: 12 }).map((_, i) => (
          <circle key={i} cx="300" cy="40" r="10" fill="none" stroke="#f7cb7f" strokeWidth="0.7" transform={`rotate(${i * 30} 300 300)`} />
        ))}
      </motion.svg>
    </div>
  );
}

export default function HeroOrbit() {
  const reduce = useReducedMotion();
  const intro = useIntroDone();
  const scrollTo = useScrollTo();
  const section = useRef(null);
  const stage = useRef(null);
  const head = useRef(null);
  const cap = useRef(null);
  const [box, setBox] = useState({ w: 1280, h: 800, headH: 300, capH: 220 });
  const [active, setActive] = useState(0);

  // Geometry is measured, not guessed: the stage, the headline block and
  // the caption block. Any of them changing size re-lays the ring.
  useLayoutEffect(() => {
    const measure = () =>
      setBox({
        w: stage.current.clientWidth,
        h: stage.current.clientHeight,
        headH: head.current.offsetHeight,
        capH: cap.current.offsetHeight,
      });
    measure();
    const ro = new ResizeObserver(measure);
    [stage.current, head.current, cap.current].forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, []);

  const mobile = box.w < 768;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(v, hi));
  // 1. The headline docks just under the nav (96px desktop / 80px below lg).
  const navH = box.w >= 1024 ? 96 : 80;
  const headTop = navH + clamp((box.h - 700) * 0.12, 12, 48);
  const headBottom = headTop + box.headH;
  // 2. Fit the ring between the headline and the caption. At rest the
  //    front plate must clear the headline, and its two neighbours (which
  //    sit lower-left/right, where the caption lives on desktop) must clear
  //    the caption. Plates only shrink when the screen is too short for both.
  const a1 = TAU / N;
  const s1 = 0.2 + 0.8 * ((Math.cos(a1) + 1) / 2) ** 2; // neighbour scale
  let ry = mobile ? clamp(box.h * 0.12, 60, 110) : clamp(box.h * 0.17, 70, 170);
  const drop = ry * (1 - Math.cos(a1)); // how much higher a neighbour sits
  const bandTop = headBottom + 16;
  const bandBottom = box.h - box.capH - 12;
  const want = mobile ? clamp(box.w * 0.38, 110, 170) : clamp(Math.min(box.h * 0.28, box.w * 0.2), 110, 320);
  // phones: the whole front plate sits above the caption; desktop: only the
  // neighbours must, the front plate may drop between caption and controls
  const fit = mobile ? bandBottom - bandTop : (bandBottom - bandTop + drop) / (0.5 + s1 / 2);
  const size = Math.round(Math.max(90, Math.min(want, fit)));
  const lo = bandTop + size / 2;
  const hi = mobile ? bandBottom - size / 2 : Math.min(bandBottom + drop - (s1 * size) / 2, box.h - 24 - size / 2);
  const frontY = lo <= hi ? lo + (hi - lo) * 0.6 : lo;
  // 3. The ring hangs above the front plate; its back passes behind the
  //    headline but never climbs under the nav.
  ry = Math.max(40, Math.min(ry, (frontY - navH - 30) / 2));
  const g = { rx: mobile ? box.w * 0.42 : Math.min(box.w * 0.42, 620), ry };
  const cy = frontY - ry;
  const headY = headTop + box.headH / 2;
  const geo = useMotionValue(g);
  useEffect(() => geo.set(g), [geo, g.rx, g.ry]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll → rotation (with dwell), smoothed by a spring.
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const target = useTransform(scrollYProgress, (p) => dwell(Math.min(p, 0.9999) * (N - 1)));
  const smooth = useSpring(target, { stiffness: 90, damping: 22, mass: 0.6 });
  const manual = useMotionValue(0); // reduced-motion mode: buttons set this directly
  const rot = reduce ? manual : smooth;

  useMotionValueEvent(rot, "change", (r) => {
    const i = ((Math.round(r) % N) + N) % N;
    setActive((a) => (a === i ? a : i));
  });

  // Leaving the hero: blur and sink, like the reference.
  const { scrollYProgress: exit } = useScroll({ target: section, offset: ["end end", "end start"] });
  const exitScale = useTransform(exit, [0, 1], [1, 0.9]);
  const exitBlur = useTransform(exit, [0, 0.8], ["blur(0px)", "blur(10px)"]);
  const exitOpacity = useTransform(exit, [0, 0.9], [1, 0.2]);
  const hint = useTransform(scrollYProgress, [0, 0.04], [1, 0]);

  function go(i) {
    const idx = ((i % N) + N) % N;
    if (reduce) {
      manual.set(idx);
      return;
    }
    const el = section.current;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const run = el.offsetHeight - window.innerHeight;
    scrollTo(top + (idx / (N - 1)) * run + 1, { offset: 0 });
  }

  const dish = orbitDishes[active];

  return (
    <section
      ref={section}
      id="top"
      aria-label="Paradise Tavern"
      className="relative"
      style={{ height: reduce ? "100svh" : `${100 + (N - 1) * STEP_SVH}svh` }}
    >
      <motion.div
        ref={stage}
        className="sticky top-0 h-svh min-h-[560px] overflow-hidden"
        style={reduce ? undefined : { scale: exitScale, filter: exitBlur, opacity: exitOpacity }}
      >
        {/* Glow + mandala */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 50% 42% at 50% ${(headY / box.h) * 100}%, rgb(208 43 34 / 0.26), transparent 70%), radial-gradient(ellipse 30% 18% at 50% ${((cy + g.ry + size * 0.3) / box.h) * 100}%, rgb(240 169 59 / 0.18), transparent 70%)`,
          }}
          aria-hidden="true"
        />
        <Mandala rot={rot} offset={cy - box.h / 2} />

        {/* The ring of plates */}
        <div className="absolute inset-0">
          {orbitDishes.map((d, i) => (
            <Plate key={d.id} dish={d} i={i} rot={rot} geo={geo} size={size} cy={cy} intro={intro} onPick={go} />
          ))}
        </div>

        {/* Headline, above the ring */}
        <div
          ref={head}
          className="pointer-events-none absolute inset-x-0 z-[120] flex flex-col items-center px-6 text-center"
          style={{ top: headTop }}
        >
          <motion.div
            className="flex flex-wrap justify-center gap-2"
            initial={{ opacity: 0, y: 12 }}
            animate={intro ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: ease.out, delay: 0.1 }}
          >
            <span className="rounded-full border border-cream/15 bg-ink-900/70 px-3 py-1 text-[0.7rem] font-medium text-cream/85 backdrop-blur sm:text-xs">
              Indian Kitchen &amp; Bar
            </span>
            <span className="rounded-full bg-paradise px-3 py-1 text-[0.7rem] font-semibold text-white sm:text-xs">Park Meadows · Lone Tree</span>
          </motion.div>
          <h1 className="mt-4 font-display text-[clamp(2.3rem,min(6.6vw,9vh),5.6rem)] leading-[0.98] font-medium text-cream [text-shadow:0_4px_40px_rgb(11_8_7/0.9)]">
            {["Biryani, tandoor", "& a full bar."].map((line, li) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className="block"
                  initial={{ y: "105%" }}
                  animate={intro ? { y: "0%" } : {}}
                  transition={{ duration: 1.1, ease: ease.out, delay: 0.2 + li * 0.12 }}
                >
                  {li === 1 ? (
                    <>
                      &amp; a <em className="text-gradient-gold pr-1">full bar.</em>
                    </>
                  ) : (
                    line
                  )}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            className={`mt-4 max-w-md text-[0.95rem] leading-relaxed text-cream/75 [text-shadow:0_2px_18px_rgb(11_8_7)] ${box.h < 800 ? "hidden" : "hidden sm:block"}`}
            initial={{ opacity: 0 }}
            animate={intro ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.6 }}
          >
            The Lone Tree home of Paradise, the Indian kitchen known for its signature biryanis. 160 dishes, pool tables and big screens.
          </motion.p>
        </div>

        {/* Caption for the dish at the front */}
        <div ref={cap} className="absolute inset-x-0 bottom-0 z-[130] pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <div
            className="pointer-events-none absolute inset-x-0 -top-24 bottom-0 -z-10 hidden bg-[radial-gradient(ellipse_46%_100%_at_14%_100%,rgb(11_8_7/0.94),rgb(11_8_7/0.6)_45%,transparent_80%)] md:block"
            aria-hidden="true"
          />
          <div className="container-x flex flex-col items-center gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex w-full flex-col items-center text-center md:max-w-[30rem] md:items-start md:text-left" aria-live="off">
              <div className="flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-saffron uppercase">
                <span className="tabular-nums">
                  {pad2(active + 1)} / {pad2(N)}
                </span>
                <span className="h-px w-8 bg-saffron/50" aria-hidden="true" />
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={dish.cat} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                    {catLabel[dish.cat]}
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="mt-1 flex w-full items-center gap-2">
                <button type="button" onClick={() => go(active - 1)} className={`${btn.icon} md:hidden`} aria-label="Previous dish">
                  <ChevronLeft className="size-5" aria-hidden="true" />
                </button>
                <div className="relative h-[2.6rem] min-w-0 flex-1 overflow-hidden sm:h-[3.2rem]">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.p
                      key={dish.id}
                      className={`absolute inset-x-0 truncate font-display leading-[2.6rem] text-cream sm:text-[2.6rem] sm:leading-[3.2rem] ${dish.name.length > 18 ? "text-[1.35rem]" : "text-[1.6rem]"}`}
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      exit={{ y: "-100%", opacity: 0 }}
                      transition={{ duration: 0.5, ease: ease.out }}
                    >
                      {dish.name}
                    </motion.p>
                  </AnimatePresence>
                </div>
                <button type="button" onClick={() => go(active + 1)} className={`${btn.icon} md:hidden`} aria-label="Next dish">
                  <ChevronRight className="size-5" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-2 flex items-center gap-4">
                <span className="font-display text-2xl text-saffron-soft">{priceLabel(dish)}</span>
                <Heat level={dish.heat} />
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-2.5 md:justify-start">
                <OrderButton dish={dish} className={btn.primary}>
                  <ShoppingBag className="size-4" aria-hidden="true" /> Order this
                </OrderButton>
                <Link to={`/menu#${dish.cat}`} className={btn.ghost}>
                  On the menu <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="hidden flex-col items-end gap-3 md:flex">
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => go(active - 1)} className={btn.icon} aria-label="Previous dish">
                  <ChevronLeft className="size-5" aria-hidden="true" />
                </button>
                <ol className="flex items-center gap-1" aria-label="Choose a dish">
                  {orbitDishes.map((d, i) => (
                    <li key={d.id}>
                      <button
                        type="button"
                        onClick={() => go(i)}
                        aria-label={d.name}
                        aria-current={i === active ? "true" : undefined}
                        className="group flex size-6 cursor-pointer items-center justify-center"
                      >
                        <span
                          className={`block h-1.5 rounded-full transition-all duration-500 ${
                            i === active ? "w-5 bg-saffron" : "w-1.5 bg-cream/30 group-hover:bg-cream/60"
                          }`}
                        />
                      </button>
                    </li>
                  ))}
                </ol>
                <button type="button" onClick={() => go(active + 1)} className={btn.icon} aria-label="Next dish">
                  <ChevronRight className="size-5" aria-hidden="true" />
                </button>
              </div>
              {!reduce && (
                <motion.button
                  type="button"
                  style={{ opacity: hint }}
                  onClick={() => scrollTo("#after-hero", { offset: 0 })}
                  className="hidden min-h-11 cursor-pointer items-center gap-2 text-xs tracking-[0.2em] text-muted uppercase hover:text-cream md:inline-flex"
                >
                  Scroll to turn the table
                  <motion.span animate={{ y: [0, 5, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
                    <ArrowDown className="size-4" aria-hidden="true" />
                  </motion.span>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
