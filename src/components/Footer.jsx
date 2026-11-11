import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, CalendarCheck, ShoppingBag } from "lucide-react";
import Logo from "./Logo";
import Magnetic from "./Magnetic";
import { btn } from "./ui";
import { navItems, useSectionLink } from "../lib/navigation";
import { OrderButton } from "../lib/order";
import { addressLine, hours, links, site } from "../data/site";

const WORD = "PARADISE".split("");

function Letter({ ch, i, progress }) {
  const start = 0.15 + i * 0.05;
  const y = useTransform(progress, [start, start + 0.45], ["105%", "0%"]);
  return (
    <span className="inline-block overflow-hidden">
      <motion.span className="text-gradient-gold inline-block" style={{ y }}>
        {ch}
      </motion.span>
    </span>
  );
}

export default function Footer() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const section = useSectionLink();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const weekday = hours.find((h) => h.day === 1);
  const weekend = hours.find((h) => h.day === 5);

  return (
    <footer ref={ref} className="relative mt-10 overflow-hidden border-t border-saffron/15 bg-ink-900/80 pt-20 backdrop-blur-sm">
      <div className="rule-glow absolute inset-x-0 top-0" aria-hidden="true" />

      {/* Closing call to action */}
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-8 border-b border-cream/10 pb-14 lg:flex-row lg:items-end">
          <h2 className="max-w-2xl font-display text-[clamp(2.4rem,5vw,4.2rem)] text-cream">
            Hungry? Book a table or <em className="text-gradient-gold">call ahead</em> for pickup.
          </h2>
          <div className="flex flex-wrap gap-3">
            <Magnetic>
              <a href={links.reserve} target="_blank" rel="noreferrer" className={btn.gold}>
                <CalendarCheck className="size-4" aria-hidden="true" /> Reserve a table
              </a>
            </Magnetic>
            <Magnetic>
              <OrderButton className={btn.primary}>
                <ShoppingBag className="size-4" aria-hidden="true" /> Order for pickup
              </OrderButton>
            </Magnetic>
          </div>
        </div>

        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo className="h-36" loading="lazy" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
              Signature biryanis, Mughlai and tandoor, with liquor and beer to match. Part of Paradise, at 44 locations across 16 states.
            </p>
          </div>
          <nav aria-label="Footer">
            <h3 className="eyebrow">Explore</h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-6">
              {[{ label: "Home", to: "/" }, ...navItems, { label: "FAQ", to: "/#faq" }, { label: "Printed menu", to: "/menu?printed=1" }].map((n) => (
                <li key={n.to}>
                  <Link to={n.to} onClick={section(n.to)} className="inline-flex min-h-10 items-center text-sm text-cream/80 transition-colors hover:text-saffron">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h3 className="eyebrow">Visit</h3>
            <address className="mt-4 text-sm leading-relaxed text-cream/80 not-italic">
              <a href={site.mapsUrl} target="_blank" rel="noreferrer" className="group inline-flex items-start gap-1 hover:text-saffron">
                {addressLine}
                <ArrowUpRight className="mt-0.5 size-3.5 shrink-0 opacity-60 group-hover:opacity-100" aria-hidden="true" />
              </a>
              <span className="mt-3 block">
                <a href={site.phoneHref} className="inline-flex min-h-10 items-center hover:text-saffron">
                  {site.phone}
                </a>
                <span className="mx-2 text-muted">·</span>
                <a href={site.phoneAltHref} className="inline-flex min-h-10 items-center hover:text-saffron">
                  {site.phoneAlt}
                </a>
              </span>
            </address>
            <p className="mt-2 text-sm text-muted">
              Sun–Tue {weekday.open} – {weekday.close}
              <br />
              Wed–Sat {weekend.open} – {weekend.close}
            </p>
          </div>
        </div>
      </div>

      {/* Giant wordmark */}
      <div className="pointer-events-none select-none" aria-hidden="true">
        <p className="text-center font-display text-[20.5vw] leading-[0.78] font-semibold tracking-[-0.02em] opacity-90">
          {reduce ? <span className="text-gradient-gold">PARADISE</span> : WORD.map((ch, i) => <Letter key={i} ch={ch} i={i} progress={scrollYProgress} />)}
        </p>
      </div>

      <div className="relative border-t border-cream/10 bg-ink-950">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name} · {site.tagline}
          </p>
          <p>Prices change without notice. Dish and mood photography is illustrative.</p>
        </div>
      </div>
    </footer>
  );
}
