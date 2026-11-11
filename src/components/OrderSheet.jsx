import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Clock, MapPin, Phone, X } from "lucide-react";
import { useOrder } from "../lib/orderContext";
import { useLenis } from "../lib/lenis";
import { addressLine, site } from "../data/site";
import { priceLabel } from "../lib/format";
import { btn } from "./ui";
import { ease } from "../lib/motion";
import { useOpenState } from "../lib/useOpenState";

/**
 * Phone-ordering sheet. Bottom sheet on phones, centred card on larger
 * screens. Traps focus, closes on Escape / backdrop, restores focus after.
 */
export default function OrderSheet() {
  const { open, dish, closeOrder } = useOrder();
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const panel = useRef(null);
  const returnTo = useRef(null);
  const { message } = useOpenState();

  useEffect(() => {
    if (!open) return;
    returnTo.current = document.activeElement;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => panel.current?.querySelector("[data-autofocus]")?.focus(), 60);

    const onKey = (e) => {
      if (e.key === "Escape") closeOrder();
      if (e.key !== "Tab" || !panel.current) return;
      const f = panel.current.querySelectorAll("a[href],button:not([disabled])");
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      document.documentElement.style.overflow = "";
      returnTo.current?.focus?.();
    };
  }, [open, closeOrder, lenis]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
          <motion.div
            className="absolute inset-0 bg-ink-950/75 backdrop-blur-md"
            onClick={closeOrder}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            aria-hidden="true"
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-title"
            className="relative w-full max-w-lg overflow-hidden rounded-t-[2rem] border border-cream/10 bg-ink-850 p-7 pb-[max(1.75rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-[2rem] sm:p-9"
            initial={reduce ? { opacity: 0 } : { y: "100%", opacity: 0.6 }}
            animate={reduce ? { opacity: 1 } : { y: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: "100%", opacity: 0, transition: { duration: 0.3, ease: ease.inOut } }}
            transition={{ duration: 0.55, ease: ease.out }}
            data-lenis-prevent
          >
            <div
              className="pointer-events-none absolute -top-24 left-1/2 size-64 -translate-x-1/2 rounded-full bg-paradise/30 blur-3xl"
              aria-hidden="true"
            />
            <button type="button" onClick={closeOrder} className={`${btn.icon} absolute top-5 right-5`} aria-label="Close">
              <X className="size-5" aria-hidden="true" />
            </button>

            <p className="eyebrow">Takeout &amp; pickup</p>
            <h2 id="order-title" className="mt-3 pr-12 font-display text-4xl text-cream">
              {dish ? (
                <>
                  Order the <em className="text-gradient-gold">{dish.name}</em>
                </>
              ) : (
                "Order by phone"
              )}
            </h2>
            {dish && <p className="mt-2 text-sm text-muted">{priceLabel(dish)}</p>}
            <p className="mt-4 text-[0.95rem] leading-relaxed text-cream/80">
              Our online ordering page is on its way. Until it lands, call the kitchen and your order will be ready for pickup.
            </p>

            <div className="mt-7 flex flex-col gap-3">
              <a href={site.phoneHref} className={`${btn.primary} w-full !py-4 text-base`} data-autofocus>
                <Phone className="size-5" aria-hidden="true" /> Call {site.phone}
              </a>
              <a href={site.phoneAltHref} className={`${btn.ghost} w-full`}>
                Or {site.phoneAlt}
              </a>
            </div>

            <dl className="mt-7 grid gap-3 border-t border-cream/10 pt-6 text-sm">
              <div className="flex items-start gap-3">
                <dt className="sr-only">Hours</dt>
                <Clock className="mt-0.5 size-4 shrink-0 text-saffron" aria-hidden="true" />
                <dd className="text-cream/80">{message}. Main menu orders until 9:45 PM.</dd>
              </div>
              <div className="flex items-start gap-3">
                <dt className="sr-only">Pickup address</dt>
                <MapPin className="mt-0.5 size-4 shrink-0 text-saffron" aria-hidden="true" />
                <dd className="text-cream/80">{addressLine}</dd>
              </div>
            </dl>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
