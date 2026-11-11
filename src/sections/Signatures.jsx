import { Link } from "react-router-dom";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { categories, signatures } from "../data/menu";
import { media, mediaSrc } from "../data/media";
import { priceLabel } from "../lib/format";
import { OrderButton } from "../lib/order";
import { DietTags, FavBadge, Heat } from "../components/Marks";
import { Eyebrow, Reveal, SplitHeading } from "../components/Reveal";
import { btn } from "../components/ui";

const catLabel = Object.fromEntries(categories.map((c) => [c.id, c.label]));

function DishCard({ dish, i }) {
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(useTransform(ry, [-0.5, 0.5], [5, -5]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(rx, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 });

  function onMove(e) {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
    if (reduce || e.pointerType !== "mouse") return;
    rx.set((e.clientX - r.left) / r.width - 0.5);
    ry.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <Reveal i={i % 3} className="[perspective:1200px]">
      <motion.article
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="spotlight group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-cream/10 bg-ink-850/80 shadow-[0_30px_80px_-40px_rgb(0_0_0/0.9)] transition-colors duration-500 hover:border-saffron/35"
      >
        <Link to={`/menu#${dish.cat}`} data-cursor="Menu" className="relative block aspect-[4/3] overflow-hidden" tabIndex={-1} aria-hidden="true">
          <img
            src={mediaSrc(dish.img)}
            alt=""
            width={media[dish.img].w}
            height={media[dish.img].h}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.08]"
            style={{ backgroundColor: media[dish.img].color }}
          />
          <span className="absolute inset-0 bg-linear-to-t from-ink-850 via-ink-850/10 to-transparent" />
          <span className="absolute top-4 left-4 rounded-full border border-cream/15 bg-ink-950/75 px-3 py-1.5 font-display text-lg font-semibold text-saffron-soft backdrop-blur">
            {priceLabel(dish)}
          </span>
          {dish.tags.includes("fav") && <FavBadge className="absolute top-4 right-4" />}
        </Link>
        <div className="-mt-8 flex flex-1 flex-col px-6 pb-6 sm:px-7" style={{ transform: "translateZ(30px)" }}>
          <p className="relative text-[0.7rem] font-semibold tracking-[0.2em] text-saffron uppercase">{catLabel[dish.cat]}</p>
          <h3 className="mt-2 font-display text-[1.85rem] text-cream">{dish.name}</h3>
          <p className="mt-2 line-clamp-3 text-[0.92rem] leading-relaxed text-muted">{dish.desc}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <Heat level={dish.heat} />
            <DietTags tags={dish.tags} />
          </div>
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-cream/10 pt-5">
            <OrderButton dish={dish} className={`${btn.primary} !min-h-11 !px-4 !py-2 text-sm`}>
              <ShoppingBag className="size-4" aria-hidden="true" /> Order
            </OrderButton>
            <Link to={`/menu#${dish.cat}`} className={btn.link}>
              See on menu
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </motion.article>
    </Reveal>
  );
}

export default function Signatures() {
  return (
    <section id="signatures" aria-labelledby="sig-title" className="relative py-24 sm:py-32">
      <div className="container-x">
        <div className="flex flex-col items-center text-center">
          <Eyebrow center>Signature dishes</Eyebrow>
          <SplitHeading
            id="sig-title"
            text="Six plates that built the name"
            accent={["name"]}
            className="mt-5 font-display text-[clamp(2.4rem,5.5vw,4.5rem)] text-cream"
          />
          <Reveal as="p" className="mt-5 max-w-xl text-muted">
            If it&rsquo;s your first time at Paradise, start here, then tell your server how hot you&rsquo;d like it.
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {signatures.map((d, i) => (
            <DishCard key={d.id} dish={d} i={i} />
          ))}
        </div>

        <Reveal className="mt-14 flex justify-center">
          <Link to="/menu" className={btn.gold}>
            Browse all {categories.length} chapters of the menu <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
