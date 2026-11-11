import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, ChevronDown, Search, SlidersHorizontal, Star, X } from "lucide-react";
import { categories, houseRules, items, spiceScale, tagLabels } from "../data/menu";
import { media, mediaSrc } from "../data/media";
import { chapterImg } from "../data/chapters";
import { money, pad2 } from "../lib/format";
import { useScrollTo } from "../lib/lenis";
import { ease } from "../lib/motion";
import { DietTags, Heat } from "../components/Marks";
import { Reveal } from "../components/Reveal";
import PrintedMenu from "../components/PrintedMenu";
import { btn } from "../components/ui";

/** Scroll offset that parks a chapter just below the docked nav + filter bar. */
const chapterOffset = (bar) => -((window.innerWidth >= 1024 ? 96 : 80) + (bar?.offsetHeight ?? 80) + 20);

const DIETS = ["veg", "vegan", "gf", "nf", "df"];
const HEATS = [
  { v: 3, label: "Any heat" },
  { v: 0, label: "No heat" },
  { v: 1, label: "Up to 1" },
  { v: 2, label: "Up to 2" },
];

function Price({ item }) {
  if (item.price != null) return <span className="font-display text-2xl text-saffron-soft tabular-nums">{money(item.price)}</span>;
  if (!item.prices?.length) return <span className="text-sm text-muted">Ask your server</span>;
  if (item.prices.length === 1)
    return (
      <span className="text-right">
        <span className="block font-display text-2xl text-saffron-soft tabular-nums">{money(item.prices[0].price)}</span>
        <span className="text-xs text-muted">{item.prices[0].label}</span>
      </span>
    );
  return null;
}

function Dish({ item }) {
  const multi = item.prices?.length > 1;
  return (
    <li className="group relative rounded-2xl border border-transparent p-4 transition-colors duration-300 hover:border-cream/10 hover:bg-ink-850/60 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-display text-[1.6rem] leading-tight text-cream">
            {item.name}
            {item.tags.includes("fav") && (
              <Star className="mb-1 ml-2 inline size-4 fill-saffron text-saffron" aria-label="All-time favourite" role="img" />
            )}
          </h3>
          {item.alt && <p className="text-sm text-saffron/80 italic">{item.alt}</p>}
        </div>
        <span className="mt-2 hidden h-px flex-1 translate-y-3 border-b border-dotted border-cream/20 sm:block" aria-hidden="true" />
        <Price item={item} />
      </div>
      <p className="mt-2 text-[0.93rem] leading-relaxed text-muted">{item.desc}</p>
      {multi && (
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Prices">
          {item.prices.map((p) => (
            <li key={p.label} className="rounded-full border border-cream/12 bg-ink-900/70 px-3 py-1 text-xs text-cream/85">
              {p.label} <span className="ml-1 font-semibold text-saffron-soft">{money(p.price)}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        {item.heat > 0 && <Heat level={item.heat} />}
        <DietTags tags={item.tags} />
      </div>
    </li>
  );
}

function Chapter({ c, i, list }) {
  const img = chapterImg[c.id];
  return (
    <section id={c.id} aria-labelledby={`${c.id}-title`} className="scroll-mt-44 lg:scroll-mt-32">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-cream/10">
        <img
          src={mediaSrc(img)}
          alt=""
          width={media[img].w}
          height={media[img].h}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover opacity-45"
          style={{ backgroundColor: media[img].color }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-ink-950 via-ink-950/80 to-ink-950/20" aria-hidden="true" />
        <div className="relative flex items-end justify-between gap-6 p-6 sm:p-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-saffron uppercase">Chapter {pad2(i + 1)}</p>
            <h2 id={`${c.id}-title`} className="mt-2 font-display text-[clamp(2.2rem,4vw,3.2rem)] text-cream">
              {c.label}
            </h2>
            <p className="mt-1 text-cream/75">{c.note}</p>
          </div>
          <span className="text-outline hidden font-display text-8xl leading-none font-semibold sm:block" aria-hidden="true">
            {pad2(i + 1)}
          </span>
        </div>
      </div>
      <ul className="mt-4 grid gap-1 xl:grid-cols-2 xl:gap-x-4">
        {list.map((item) => (
          <Dish key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}

export default function MenuPage() {
  const reduce = useReducedMotion();
  const { hash } = useLocation();
  const [params, setParams] = useSearchParams();
  const scrollTo = useScrollTo();
  const [query, setQuery] = useState("");
  const [diets, setDiets] = useState([]);
  const [favOnly, setFavOnly] = useState(false);
  const [maxHeat, setMaxHeat] = useState(3);
  const [active, setActive] = useState(categories[0].id);
  const chipRow = useRef(null);
  const toolbar = useRef(null);
  const q = useDeferredValue(query.trim().toLowerCase());
  const printedOpen = params.get("printed") === "1";

  const filtered = useMemo(
    () =>
      items.filter(
        (i) =>
          (!q || `${i.name} ${i.alt ?? ""} ${i.desc}`.toLowerCase().includes(q)) &&
          diets.every((d) => i.tags.includes(d)) &&
          (!favOnly || i.tags.includes("fav")) &&
          i.heat <= maxHeat,
      ),
    [q, diets, favOnly, maxHeat],
  );
  const byCat = useMemo(
    () => categories.map((c) => ({ c, list: filtered.filter((i) => i.cat === c.id) })).filter((g) => g.list.length),
    [filtered],
  );
  const filtering = q || diets.length || favOnly || maxHeat < 3;

  // Deep link: /menu#biryani
  useEffect(() => {
    if (!hash) return;
    const t = setTimeout(() => scrollTo(hash, { offset: chapterOffset(toolbar.current) }), 350);
    return () => clearTimeout(t);
  }, [hash]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll-spy
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-35% 0px -60% 0px" },
    );
    byCat.forEach(({ c }) => {
      const el = document.getElementById(c.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [byCat]);

  useEffect(() => {
    chipRow.current?.querySelector(`[data-cat="${active}"]`)?.scrollIntoView({ block: "nearest", inline: "center", behavior: reduce ? "auto" : "smooth" });
  }, [active, reduce]);

  const toggleDiet = (d) => setDiets((s) => (s.includes(d) ? s.filter((x) => x !== d) : [...s, d]));
  const reset = () => {
    setQuery("");
    setDiets([]);
    setFavOnly(false);
    setMaxHeat(3);
  };
  const jump = (id) => scrollTo(`#${id}`, { offset: chapterOffset(toolbar.current) });
  const setPrinted = (v) => setParams(v ? { printed: "1" } : {}, { replace: true });

  return (
    <>
      {/* Header */}
      <header className="relative overflow-hidden pt-36 pb-12 sm:pt-44">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgb(208_43_34/0.22),transparent_70%)]" aria-hidden="true" />
        <div className="container-x relative">
          <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            The menu
          </motion.p>
          <h1 className="mt-4 max-w-4xl font-display text-[clamp(3rem,9vw,7.5rem)] leading-[0.92] text-cream">
            {["Everything", "we cook."].map((w, i) => (
              <span key={w} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className={`block ${i === 1 ? "text-gradient-gold italic" : ""}`}
                  initial={reduce ? false : { y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1, ease: ease.out, delay: 0.25 + i * 0.1 }}
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>
          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-lg text-muted">
              {items.length} dishes in {categories.length} chapters, transcribed from our printed menu. Prices change from time to time; your server has the latest.
            </p>
            <button type="button" onClick={() => setPrinted(true)} className={btn.ghost}>
              <BookOpen className="size-4" aria-hidden="true" /> Flip through the printed menu
            </button>
          </div>
        </div>
      </header>

      {/* Sticky filters */}
      <div ref={toolbar} className="sticky top-20 z-30 lg:top-24 border-y border-cream/10 bg-ink-950/85 backdrop-blur-xl">
        <div className="container-x flex flex-col gap-3 py-3 lg:flex-row lg:items-center">
          <label className="relative flex-1 lg:max-w-xs">
            <span className="sr-only">Search the menu</span>
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes, e.g. paneer"
              className="h-11 w-full rounded-full border border-cream/15 bg-ink-900/80 pr-10 pl-11 [&::-webkit-search-cancel-button]:appearance-none text-[0.95rem] text-cream placeholder:text-muted/80 focus:border-saffron focus:outline-none"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} className="absolute top-1/2 right-1 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted hover:text-cream" aria-label="Clear search">
                <X className="size-4" aria-hidden="true" />
              </button>
            )}
          </label>
          <div className="no-scrollbar -mx-1 flex items-center gap-2 overflow-x-auto px-1" role="group" aria-label="Filters">
            <SlidersHorizontal className="size-4 shrink-0 text-muted" aria-hidden="true" />
            <button
              type="button"
              aria-pressed={favOnly}
              onClick={() => setFavOnly((v) => !v)}
              className={`inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 text-xs font-semibold transition-colors ${
                favOnly ? "border-saffron bg-saffron text-ink-950" : "border-cream/15 text-cream/80 hover:border-cream/40"
              }`}
            >
              <Star className="size-3.5" aria-hidden="true" /> Favourites
            </button>
            {DIETS.map((d) => (
              <button
                key={d}
                type="button"
                aria-pressed={diets.includes(d)}
                onClick={() => toggleDiet(d)}
                className={`inline-flex min-h-10 shrink-0 cursor-pointer items-center rounded-full border px-3.5 text-xs font-semibold transition-colors ${
                  diets.includes(d) ? "border-leaf bg-leaf text-ink-950" : "border-cream/15 text-cream/80 hover:border-cream/40"
                }`}
              >
                {tagLabels[d]}
              </button>
            ))}
            <label className="relative shrink-0">
              <span className="sr-only">Maximum heat</span>
              <select
                value={maxHeat}
                onChange={(e) => setMaxHeat(Number(e.target.value))}
                className="min-h-10 cursor-pointer appearance-none rounded-full border border-cream/15 bg-ink-900 pr-9 pl-4 text-xs font-semibold text-cream/85 hover:border-cream/40 focus:border-saffron focus:outline-none"
              >
                {HEATS.map((h) => (
                  <option key={h.v} value={h.v}>
                    {h.v === 3 ? h.label : `${h.label} chilli${h.v === 1 ? "" : "es"}`}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
            </label>
          </div>
          <p className={`shrink-0 text-xs text-muted lg:ml-auto ${filtering ? "" : "max-lg:sr-only"}`} aria-live="polite">
            {filtering ? `${filtered.length} of ${items.length} dishes` : `${items.length} dishes`}
            {filtering && (
              <button type="button" onClick={reset} className="ml-2 cursor-pointer font-semibold text-saffron underline-offset-4 hover:underline">
                Clear
              </button>
            )}
          </p>
        </div>
        {/* chapter chips (below lg) */}
        <div ref={chipRow} className="no-scrollbar flex gap-1.5 overflow-x-auto border-t border-cream/10 px-4 py-2 lg:hidden">
          {byCat.map(({ c }) => (
            <button
              key={c.id}
              type="button"
              data-cat={c.id}
              onClick={() => jump(c.id)}
              aria-current={active === c.id ? "true" : undefined}
              className={`min-h-9 shrink-0 cursor-pointer rounded-full px-3.5 text-xs font-semibold transition-colors ${
                active === c.id ? "bg-cream text-ink-950" : "text-cream/70 hover:text-cream"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="container-x grid gap-10 pt-10 pb-24 lg:grid-cols-[230px_1fr] lg:gap-14">
        <aside className="hidden lg:block">
          <nav aria-label="Menu chapters" className="sticky top-52">
            <ol className="flex flex-col border-l border-cream/10">
              {byCat.map(({ c, list }) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => jump(c.id)}
                    aria-current={active === c.id ? "true" : undefined}
                    className={`relative flex min-h-10 w-full cursor-pointer items-center justify-between gap-2 py-1.5 pr-2 pl-5 text-left text-sm transition-colors ${
                      active === c.id ? "text-cream" : "text-muted hover:text-cream"
                    }`}
                  >
                    {active === c.id && <motion.span layoutId="rail" className="absolute top-0 -left-px h-full w-0.5 bg-saffron" transition={{ type: "spring", stiffness: 400, damping: 36 }} />}
                    {c.label}
                    <span className="text-xs text-muted tabular-nums">{list.length}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <div className="flex min-w-0 flex-col gap-14">
          {byCat.length ? (
            byCat.map(({ c, list }) => <Chapter key={c.id} c={c} i={categories.indexOf(c)} list={list} />)
          ) : (
            <div className="rounded-[1.75rem] border border-cream/10 bg-ink-900/60 p-12 text-center">
              <p className="font-display text-3xl text-cream">Nothing matches that, yet.</p>
              <p className="mt-2 text-muted">Try fewer filters, or ask your server: the kitchen can often adapt a dish.</p>
              <button type="button" onClick={reset} className={`${btn.gold} mt-6`}>
                Clear all filters
              </button>
            </div>
          )}

          {/* House spice scale + rules */}
          <Reveal className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[1.75rem] border border-cream/10 bg-ink-900/60 p-6 sm:p-8">
              <h2 className="font-display text-3xl text-cream">House spice scale</h2>
              <ol className="mt-5 flex flex-col">
                {spiceScale.map((s, i) => (
                  <li key={s.label} className="grid grid-cols-[4.5rem_1fr] gap-3 border-t border-cream/10 py-3 text-sm">
                    <span className="font-display text-lg tabular-nums" style={{ color: `hsl(${100 - i * 14} 70% 62%)` }}>
                      {s.scale.replace(" ", "")}
                    </span>
                    <span>
                      <span className="font-semibold text-cream">{s.label}</span>
                      <span className="block text-muted">{s.note}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-[1.75rem] border border-cream/10 bg-ink-900/60 p-6 sm:p-8">
              <h2 className="font-display text-3xl text-cream">House rules</h2>
              <ul className="mt-5 flex flex-col">
                {houseRules.map((r) => (
                  <li key={r} className="flex gap-3 border-t border-cream/10 py-3 text-sm text-muted">
                    <span className="mt-2 size-1.5 shrink-0 rotate-45 bg-saffron" aria-hidden="true" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>

      <PrintedMenu open={printedOpen} onClose={() => setPrinted(false)} />
    </>
  );
}
