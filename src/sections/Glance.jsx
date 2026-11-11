import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Marquee, VelocityMarquee } from "../components/Marquee";
import { items } from "../data/menu";

const tickerDishes = [
  "Hyderabadi Dum Biryani",
  "Tandoori Chicken",
  "Makhani Masala",
  "65 Suite",
  "Pune Pani Poori",
  "Mysore Masala Dosa",
  "Taj Lamb Chops",
  "Garlic Naan",
  "Fiery Goan Vindaloo",
  "Gulab Jamun",
  "Calcutta Paan Old Fashioned",
];

function Diamond() {
  return <span className="mx-6 inline-block size-1.5 rotate-45 bg-saffron sm:mx-9" aria-hidden="true" />;
}

const GLANCE = `Paradise Tavern is the Lone Tree outpost of Paradise, the Indian restaurant group behind the signature biryani, now at 44 locations across 16 states. Mughlai and tandoor specialities, ${items.length} dishes from Hyderabad to Mumbai's street corners, and a full bar — because what goes better with liquor and beer than Indian food?`;

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <span className="relative mr-[0.28em] inline-block">
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
}

export default function Glance() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = GLANCE.split(" ");

  return (
    <section id="after-hero" aria-labelledby="glance-title" className="relative overflow-hidden pt-10 pb-24 sm:pb-36">
      {/* dish-name ticker */}
      <div className="border-y border-saffron/15 bg-ink-900/60 py-5 backdrop-blur-sm">
        <Marquee duration={55}>
          {tickerDishes.map((d) => (
            <span key={d} className="flex items-center font-display text-lg tracking-[0.18em] text-cream/75 uppercase sm:text-xl">
              {d}
              <Diamond />
            </span>
          ))}
        </Marquee>
      </div>

      {/* giant hollow type that rides the scroll velocity */}
      <VelocityMarquee baseVelocity={-1.6} className="mt-10 sm:mt-14">
        {["Biryani", "Tandoor", "Street food", "Full bar", "Pool & big screens"].map((w) => (
          <span key={w} className="flex items-center">
            <span className="text-outline font-display text-[clamp(4rem,13vw,11rem)] leading-none font-semibold uppercase">{w}</span>
            <svg viewBox="0 0 24 24" className="mx-8 size-10 text-paradise sm:mx-14 sm:size-14" aria-hidden="true">
              <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6Z" fill="currentColor" />
            </svg>
          </span>
        ))}
      </VelocityMarquee>

      <div className="container-x mt-14 sm:mt-20">
        <div
          ref={ref}
          className="relative mx-auto max-w-4xl rounded-[2rem] border border-saffron/20 bg-linear-to-b from-ink-800/80 to-ink-900/60 px-6 py-12 text-center shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9)] backdrop-blur-md sm:px-14 sm:py-16"
        >
          <span className="pointer-events-none absolute -top-px left-1/2 h-px w-1/2 -translate-x-1/2 bg-linear-to-r from-transparent via-saffron to-transparent" aria-hidden="true" />
          <h2 id="glance-title" className="font-display text-lg tracking-[0.3em] text-saffron uppercase italic">
            At a glance
          </h2>
          <span className="mx-auto mt-3 block h-px w-12 bg-saffron/50" aria-hidden="true" />
          {reduce ? (
            <p className="mt-7 font-display text-[clamp(1.5rem,3vw,2.35rem)] leading-snug text-cream">{GLANCE}</p>
          ) : (
            <p className="mt-7 font-display text-[clamp(1.5rem,3vw,2.35rem)] leading-snug text-cream">
              <span className="sr-only">{GLANCE}</span>
              <span aria-hidden="true">
                {words.map((w, i) => (
                  <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
                    {w}
                  </Word>
                ))}
              </span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
