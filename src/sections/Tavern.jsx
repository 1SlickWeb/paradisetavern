import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { media, mediaSrc } from "../data/media";
import { pad2 } from "../lib/format";
import { ease } from "../lib/motion";
import { Eyebrow, Reveal, SplitHeading } from "../components/Reveal";

/**
 * Four rooms of the house. Facts come from the printed menu; the quotes are
 * from the Google reviews in testimonials.js, attributed by name.
 */
const scenes = [
  {
    id: "kitchen",
    img: "hero-tandoor",
    kicker: "The kitchen",
    title: "Off the tandoor, onto the iron.",
    body: "Signature biryanis sealed and steamed on the dum, Mughlai curries and smoking sizzlers: tandoori chicken, malai tikka and Taj lamb chops, brought to the table still hissing.",
  },
  {
    id: "bar",
    img: "ambience-bar",
    kicker: "The bar",
    title: "Raising the bar, one jig at a time.",
    body: "Paradise margaritas, a Calcutta paan old fashioned, filter coffee martinis and a jaljeera mojito, alongside a full draught list, whiskey, tequila and wine.",
  },
  {
    id: "room",
    img: "pt1",
    alt: "Guests at the bar and dining tables inside Paradise Tavern, with a row of big screens showing a game",
    kicker: "The room",
    title: "Pool tables. Big screens. Good company.",
    body: "Come for dinner, stay for the game or a few racks of pool. It's a tavern as much as a kitchen, and plenty of the menu comes in sharing sizes.",
    quote: { text: "The pool tables are top notch and plentiful. The atmosphere was alive, vibrant and clean!", by: "Benjamin Kite, Google review" },
  },
  {
    id: "robots",
    img: "ambience-table",
    kicker: "The service",
    title: "Yes, some of it arrives by robot.",
    body: "Our servers know the menu inside out and will steer you through all 160 dishes. Every so often, a robot rolls up with your plates.",
    quote: { text: "Can't forget the tasty IPA's and the robots delivering you food to the table.", by: "Javier King, Google review" },
  },
];

function SceneImage({ img, alt = "", className = "" }) {
  const m = media[img];
  // Real photos of the restaurant are small, so they're never stretched to
  // fill the frame: the photo sits at its own proportions over a blurred,
  // darkened copy of itself, tagged as the genuine article.
  if (m.real) {
    return (
      <div className={`relative size-full overflow-hidden ${className}`} style={{ backgroundColor: m.color }}>
        <img src={mediaSrc(img)} alt="" aria-hidden="true" loading="lazy" decoding="async" className="absolute inset-0 size-full scale-125 object-cover opacity-70 blur-2xl" />
        <div className="absolute inset-0 bg-ink-950/45" aria-hidden="true" />
        <div className="absolute inset-0 flex items-center justify-center p-5 sm:p-8">
          <img
            src={mediaSrc(img)}
            alt={alt}
            width={m.w}
            height={m.h}
            loading="lazy"
            decoding="async"
            className="max-h-full w-full rounded-xl object-contain shadow-[0_30px_70px_-20px_rgb(0_0_0/0.9)] ring-1 ring-cream/15"
          />
        </div>
        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-ink-950/75 px-3 py-1.5 text-[0.7rem] font-semibold tracking-wide text-cream backdrop-blur">
          <span className="size-1.5 rounded-full bg-paradise" aria-hidden="true" />
          Inside Paradise Tavern
        </span>
      </div>
    );
  }
  return (
    <img
      src={mediaSrc(img)}
      alt=""
      width={media[img].w}
      height={media[img].h}
      loading="lazy"
      decoding="async"
      className={`size-full object-cover ${className}`}
      style={{ backgroundColor: media[img].color }}
    />
  );
}

export default function Tavern() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const i = Math.min(scenes.length - 1, Math.max(0, Math.floor(p * scenes.length)));
    setActive((a) => (a === i ? a : i));
  });

  return (
    <section id="tavern" aria-labelledby="tavern-title" className="relative py-24 sm:py-32">
      <div className="container-x">
        <div className="max-w-2xl">
          <Eyebrow>The Tavern</Eyebrow>
          <SplitHeading
            id="tavern-title"
            text="Half kitchen, half tavern, all Paradise."
            accent={["Paradise."]}
            className="mt-5 font-display text-[clamp(2.4rem,5.5vw,4.5rem)] text-cream"
            as="h2"
          />
        </div>

        <div ref={ref} className="mt-16 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
          {/* sticky photograph (desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-[12vh] h-[76vh] overflow-hidden rounded-[2rem] border border-cream/10">
              <AnimatePresence initial={false}>
                <motion.div
                  key={scenes[active].id}
                  className="absolute inset-0"
                  initial={reduce ? { opacity: 0 } : { clipPath: "inset(100% 0 0 0)", scale: 1.15 }}
                  animate={reduce ? { opacity: 1 } : { clipPath: "inset(0% 0 0 0)", scale: 1 }}
                  exit={{ opacity: 0.999, transition: { duration: 1 } }}
                  transition={{ duration: 1.1, ease: ease.inOut }}
                >
                  <SceneImage img={scenes[active].img} alt={scenes[active].alt} />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-linear-to-t from-ink-950/70 via-transparent to-transparent" aria-hidden="true" />
              <div className="absolute bottom-6 left-6 flex items-center gap-3">
                {scenes.map((s, i) => (
                  <span key={s.id} className={`h-1 rounded-full transition-all duration-500 ${i === active ? "w-10 bg-saffron" : "w-4 bg-cream/30"}`} />
                ))}
              </div>
              <span className="absolute right-6 bottom-4 font-display text-7xl text-cream/80 tabular-nums" aria-hidden="true">
                {pad2(active + 1)}
              </span>
            </div>
          </div>

          {/* scrolling copy */}
          <ol className="flex flex-col">
            {scenes.map((s, i) => (
              <li key={s.id} className="flex flex-col justify-center py-6 lg:min-h-[76vh] lg:py-0">
                <div className="mb-6 aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-cream/10 lg:hidden">
                  <SceneImage img={s.img} alt={s.alt} />
                </div>
                <Reveal>
                  <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.22em] text-saffron uppercase">
                    <span className="font-display text-base tracking-normal text-cream/50">{pad2(i + 1)}</span>
                    <span className="h-px w-8 bg-saffron/50" aria-hidden="true" />
                    {s.kicker}
                  </p>
                  <h3 className="mt-4 font-display text-[clamp(2rem,3.6vw,3.2rem)] text-cream">{s.title}</h3>
                  <p className="mt-4 max-w-lg text-[1.02rem] leading-relaxed text-muted">{s.body}</p>
                  {s.quote && (
                    <figure className="mt-7 max-w-lg border-l-2 border-paradise pl-5">
                      <blockquote className="font-display text-xl text-cream/90 italic">&ldquo;{s.quote.text}&rdquo;</blockquote>
                      <figcaption className="mt-2 text-xs tracking-wider text-muted uppercase">{s.quote.by}</figcaption>
                    </figure>
                  )}
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
