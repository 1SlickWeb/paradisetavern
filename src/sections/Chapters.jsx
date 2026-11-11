import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { categories, items } from "../data/menu";
import { media, mediaSrc } from "../data/media";
import { chapterImg } from "../data/chapters";
import { pad2 } from "../lib/format";
import { Eyebrow } from "../components/Reveal";

const counts = items.reduce((acc, i) => ({ ...acc, [i.cat]: (acc[i.cat] || 0) + 1 }), {});

function ChapterCard({ c, i }) {
  const img = chapterImg[c.id];
  return (
    <Link
      to={`/menu#${c.id}`}
      data-cursor="Open"
      className="group relative flex h-[min(62svh,480px)] w-[78vw] max-w-[340px] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-[1.75rem] border border-cream/10 bg-ink-800 p-6 sm:w-[340px]"
    >
      <img
        src={mediaSrc(img)}
        alt=""
        width={media[img].w}
        height={media[img].h}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full object-cover opacity-55 transition-[transform,opacity] duration-[1.2s] ease-out group-hover:scale-110 group-hover:opacity-75"
        style={{ backgroundColor: media[img].color }}
      />
      <span className="absolute inset-0 bg-linear-to-t from-ink-950 via-ink-950/55 to-ink-950/10" aria-hidden="true" />
      <span className="text-outline absolute top-3 right-5 font-display text-[6.5rem] leading-none font-semibold transition-colors duration-500 group-hover:[-webkit-text-stroke-color:rgb(240_169_59/0.7)]" aria-hidden="true">
        {pad2(i + 1)}
      </span>
      <div className="relative">
        <p className="text-[0.7rem] font-semibold tracking-[0.2em] text-saffron uppercase">
          Chapter {pad2(i + 1)} · {counts[c.id]} {c.id === "drinks" ? "pours" : "dishes"}
        </p>
        <h3 className="mt-2 font-display text-[2.1rem] leading-[1.05] text-cream">{c.label}</h3>
        <p className="mt-2 text-sm text-cream/70">{c.note}</p>
        <span className="mt-5 inline-flex size-11 items-center justify-center rounded-full border border-cream/20 text-cream transition-all duration-500 group-hover:rotate-45 group-hover:border-saffron group-hover:bg-saffron group-hover:text-ink-950">
          <ArrowUpRight className="size-5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

function Intro() {
  return (
    <div className="flex w-[78vw] max-w-[380px] shrink-0 snap-start flex-col justify-center pr-4 sm:w-[380px]">
      <Eyebrow>The full menu</Eyebrow>
      <h2 id="chapters-title" className="mt-5 font-display text-[clamp(2.4rem,4.6vw,4rem)] text-cream">
        {items.length} dishes, <em className="text-gradient-gold">twelve chapters.</em>
      </h2>
      <p className="mt-5 text-muted">
        From Indo-Chinese starters to Deccan dosas and the tandoor, the printed menu reads like a road trip across India. Pick a chapter.
      </p>
    </div>
  );
}

export default function Chapters() {
  const reduce = useReducedMotion();
  const section = useRef(null);
  const track = useRef(null);
  const [dims, setDims] = useState({ distance: 0, desktop: false });

  useLayoutEffect(() => {
    const measure = () => {
      const desktop = window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;
      const distance = Math.max(0, track.current.scrollWidth - window.innerWidth);
      setDims({ distance, desktop });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const pinned = dims.desktop && !reduce;
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -dims.distance]);
  const x = useSpring(xRaw, { stiffness: 120, damping: 28, mass: 0.4 });
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={section}
      id="chapters"
      aria-labelledby="chapters-title"
      className="relative"
      style={pinned ? { height: `calc(100vh + ${dims.distance}px)` } : undefined}
    >
      <div className={pinned ? "sticky top-0 flex h-screen flex-col justify-center overflow-hidden" : "py-20"}>
        <motion.div
          ref={track}
          style={pinned ? { x } : undefined}
          className={`flex gap-5 px-[clamp(1rem,4.5vw,3.5rem)] sm:gap-6 ${
            pinned ? "w-max" : "no-scrollbar snap-x snap-mandatory overflow-x-auto scroll-px-[clamp(1rem,4.5vw,3.5rem)] pb-4"
          }`}
        >
          <Intro />
          {categories.map((c, i) => (
            <ChapterCard key={c.id} c={c} i={i} />
          ))}
        </motion.div>
        {pinned && (
          <div className="container-x mt-10">
            <div className="h-px w-full bg-cream/10">
              <motion.div className="h-px bg-saffron" style={{ width: bar }} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
