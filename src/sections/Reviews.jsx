import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from "framer-motion";
import { ChevronDown, Quote, Star } from "lucide-react";
import { stats, testimonials } from "../data/testimonials";
import { Marquee } from "../components/Marquee";
import { Eyebrow, Reveal, SplitHeading } from "../components/Reveal";
import { btn } from "../components/ui";

function Count({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [m, unit] = value.match(/^(\d+)(.*)$/)?.slice(1) ?? [null, value];
  const [n, setN] = useState(reduce || m == null ? Number(m) : 0);

  useEffect(() => {
    if (!inView || reduce || m == null) return;
    const c = animate(0, Number(m), { duration: 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, reduce, m]);

  return (
    <span ref={ref} className="tabular-nums">
      {m == null ? value : `${n}${unit}`}
    </span>
  );
}

function Stats() {
  return (
    <div className="container-x">
      <dl className="grid grid-cols-2 overflow-hidden rounded-[2rem] border border-cream/10 bg-ink-900/50 backdrop-blur-sm lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal
            key={s.label}
            i={i}
            className={`flex flex-col-reverse justify-end gap-2 p-7 sm:p-9 ${i % 2 ? "border-l border-cream/10" : ""} ${i > 1 ? "border-t border-cream/10 lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}
          >
            <dt className="text-sm text-muted">
              <span className="font-semibold text-cream">{s.label}</span> · {s.detail}
            </dt>
            <dd className="font-display text-[clamp(2.6rem,5vw,4.2rem)] leading-none lining-nums text-gradient-gold">
              <Count value={s.value} />
            </dd>
          </Reveal>
        ))}
      </dl>
    </div>
  );
}

function Stars({ n = 5 }) {
  return (
    <span className="flex gap-0.5 text-saffron" role="img" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} className="size-4 fill-current" aria-hidden="true" />
      ))}
    </span>
  );
}

function ReviewCard({ r, clamp = true }) {
  return (
    <figure className="relative flex h-full w-[min(84vw,400px)] shrink-0 flex-col rounded-[1.5rem] border border-cream/10 bg-ink-850/85 p-7 backdrop-blur-sm transition-colors duration-500 hover:border-saffron/35 [.grid_&]:w-auto">
      <Quote className="absolute top-6 right-6 size-8 text-saffron/15" aria-hidden="true" />
      <Stars n={r.rating} />
      <blockquote className={`mt-4 flex-1 text-[0.95rem] leading-relaxed text-cream/85 ${clamp ? "line-clamp-6" : ""}`}>{r.quote}</blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-cream/10 pt-5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-paradise to-saffron-deep font-display text-lg font-semibold text-white" aria-hidden="true">
          {r.name.replace(/^Dr\.\s*/, "").charAt(0)}
        </span>
        <span className="min-w-0">
          <span className="block truncate font-semibold text-cream">{r.name}</span>
          <span className="block truncate text-xs text-muted">
            {r.credit} · {r.date}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

export default function Reviews() {
  const [all, setAll] = useState(false);
  const half = Math.ceil(testimonials.length / 2);
  const allFive = testimonials.every((r) => r.rating === 5);

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="relative py-24 sm:py-32">
      <Stats />

      <div className="container-x mt-24 flex flex-col items-center text-center sm:mt-32">
        <Eyebrow center>Google reviews</Eyebrow>
        <SplitHeading
            id="reviews-title" text="In our guests' own words" accent={["own", "words"]} className="mt-5 font-display text-[clamp(2.4rem,5.5vw,4.5rem)] text-cream" />
        <Reveal className="mt-6 inline-flex items-center gap-3 rounded-full border border-cream/15 bg-ink-900/60 px-5 py-2.5 text-sm">
          {allFive && <Stars />}
          <span className="text-cream/85">
            {testimonials.length} {allFive ? "five-star " : ""}reviews, transcribed word for word
          </span>
        </Reveal>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {all ? (
          <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container-x mt-14">
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((r, i) => (
                <motion.li key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 8) * 0.04 }}>
                  <ReviewCard r={r} clamp={false} />
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ) : (
          <motion.div key="rows" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-14 flex flex-col gap-5">
            <Marquee duration={70}>
              {testimonials.slice(0, half).map((r) => (
                <div key={r.id} className="pr-5">
                  <ReviewCard r={r} />
                </div>
              ))}
            </Marquee>
            <Marquee duration={80} reverse>
              {testimonials.slice(half).map((r) => (
                <div key={r.id} className="pr-5">
                  <ReviewCard r={r} />
                </div>
              ))}
            </Marquee>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-10 flex justify-center">
        <button type="button" onClick={() => setAll((v) => !v)} className={btn.ghost} aria-expanded={all}>
          {all ? "Back to the highlights" : "Read every review in full"}
          <ChevronDown className={`size-4 transition-transform duration-300 ${all ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
