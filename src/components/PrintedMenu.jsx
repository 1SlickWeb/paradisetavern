import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { menuPages } from "../data/menuPages";
import { useLenis } from "../lib/lenis";
import { pad2 } from "../lib/format";
import { btn } from "./ui";
import { ease } from "../lib/motion";

const src = (n) => `/menu/page-${pad2(n)}.webp`;

/**
 * Full-screen viewer for the 18 scanned pages of the printed menu —
 * where the full draught, whiskey and wine lists live. Arrow keys, swipe,
 * and a thumbnail strip. Escape closes and focus returns to the opener.
 */
export default function PrintedMenu({ open, onClose, start = 0 }) {
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const [[page, dir], setPage] = useState([start, 0]);
  const dialog = useRef(null);
  const strip = useRef(null);
  const total = menuPages.length;

  const go = (d) => setPage(([p]) => [(p + d + total) % total, d]);

  useEffect(() => {
    if (!open) return;
    const returnTo = document.activeElement;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    setTimeout(() => dialog.current?.querySelector("[data-autofocus]")?.focus(), 50);
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      document.documentElement.style.overflow = "";
      returnTo?.focus?.();
    };
  }, [open, onClose, lenis]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    strip.current?.querySelector(`[data-page="${page}"]`)?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [page]);

  const m = menuPages[page];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialog}
          role="dialog"
          aria-modal="true"
          aria-label="Printed menu"
          className="fixed inset-0 z-[90] flex flex-col bg-ink-950/96 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
          data-lenis-prevent
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-8">
            <p className="text-sm text-muted">
              <span className="font-display text-xl text-cream">Printed menu</span> · page{" "}
              <span className="tabular-nums text-cream">{m.n}</span> of {total}
            </p>
            <button type="button" onClick={onClose} className={btn.icon} aria-label="Close printed menu" data-autofocus>
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-14 sm:px-24">
            <AnimatePresence mode="popLayout" custom={dir} initial={false}>
              <motion.img
                key={m.n}
                src={src(m.n)}
                alt={`Printed menu, page ${m.n} of ${total}`}
                width={m.w}
                height={m.h}
                custom={dir}
                className="max-h-full w-auto rounded-lg object-contain shadow-2xl"
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -80 }}
                transition={{ duration: 0.45, ease: ease.out }}
                drag={reduce ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) go(1);
                  else if (info.offset.x > 80) go(-1);
                }}
                style={{ touchAction: "pan-y" }}
              />
            </AnimatePresence>
            <button type="button" onClick={() => go(-1)} className={`${btn.icon} absolute left-2 sm:left-8`} aria-label="Previous page">
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => go(1)} className={`${btn.icon} absolute right-2 sm:right-8`} aria-label="Next page">
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>

          <div ref={strip} className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-4 sm:justify-center sm:px-8">
            {menuPages.map((p, i) => (
              <button
                key={p.n}
                type="button"
                data-page={i}
                onClick={() => setPage([i, i > page ? 1 : -1])}
                aria-label={`Page ${p.n}`}
                aria-current={i === page ? "page" : undefined}
                className={`h-16 w-11 shrink-0 cursor-pointer overflow-hidden rounded-md border-2 transition-all ${
                  i === page ? "border-saffron opacity-100" : "border-transparent opacity-45 hover:opacity-80"
                }`}
              >
                <img src={src(p.n)} alt="" loading="lazy" decoding="async" className="size-full object-cover" />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
