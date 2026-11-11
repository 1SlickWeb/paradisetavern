import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { CalendarCheck, Menu as MenuIcon, Phone, ShoppingBag, X } from "lucide-react";
import Logo from "./Logo";
import { btn } from "./ui";
import { OrderButton } from "../lib/order";
import { useLenis } from "../lib/lenis";
import { navItems, useSectionLink } from "../lib/navigation";
import { useOpenState } from "../lib/useOpenState";
import { addressLine, links, site } from "../data/site";
import { ease } from "../lib/motion";

function OpenPill({ compact = false }) {
  const { isOpen, message } = useOpenState();
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
        isOpen ? "border-saffron/40 bg-saffron/10 text-saffron-soft" : "border-cream/15 bg-cream/5 text-muted"
      }`}
    >
      <span className="relative flex size-2">
        {isOpen && <span className="absolute inline-flex size-full animate-ping rounded-full bg-saffron opacity-60" />}
        <span className={`relative inline-flex size-2 rounded-full ${isOpen ? "bg-saffron" : "bg-muted"}`} />
      </span>
      {compact ? (isOpen ? "Open now" : "Closed") : message}
    </span>
  );
}

export default function Nav() {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const section = useSectionLink();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const toggleRef = useRef(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(y > 40);
    // The menu page's filter bar docks under the nav, so it never hides there.
    setHidden(pathname !== "/menu" && y > 500 && y > prev + 4 && !open);
    if (y < prev - 4) setHidden(false);
  });

  // Close the overlay on route change; lock scroll while it's open.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lenis]);

  const isActive = (to) => !to.includes("#") && pathname.startsWith(to);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        initial={false}
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.45, ease: ease.out }}
      >
        <div
          className={`pointer-events-none absolute inset-0 -z-10 transition-opacity duration-500 ${solid || open ? "opacity-100" : "opacity-0"}`}
          style={{
            background:
              pathname === "/menu"
                ? "rgb(11 8 7)"
                : "linear-gradient(180deg, rgb(11 8 7 / 0.92), rgb(11 8 7 / 0.55) 70%, transparent)",
          }}
          aria-hidden="true"
        />
        <nav aria-label="Main" className="container-x flex h-20 items-center justify-between gap-4 lg:h-24">
          <Link to="/" aria-label="Paradise Tavern, home" className="relative z-10 rounded-lg">
            <Logo
              alt=""
              fetchPriority="high"
              className={`transition-[height] duration-500 ease-out ${solid ? "h-14 lg:h-16" : "h-[4.25rem] lg:h-20"}`}
            />
          </Link>

          <ul className="hidden items-center gap-1 rounded-full border border-cream/10 bg-ink-900/55 p-1.5 shadow-[0_10px_40px_-10px_rgb(0_0_0/0.6)] backdrop-blur-xl lg:flex">
            {navItems.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  onClick={section(n.to)}
                  aria-current={isActive(n.to) ? "page" : undefined}
                  className={`relative inline-flex min-h-10 items-center rounded-full px-4 text-sm font-medium transition-colors duration-300 ${
                    isActive(n.to) ? "text-ink-950" : "text-cream/80 hover:text-cream"
                  }`}
                >
                  {isActive(n.to) && (
                    <motion.span layoutId="nav-active" className="absolute inset-0 -z-10 rounded-full bg-saffron" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
                  )}
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="relative z-10 flex items-center gap-2">
            <span className="hidden xl:inline-flex">
              <OpenPill />
            </span>
            <a href={site.phoneHref} className={`${btn.icon} max-sm:hidden`} aria-label={`Call ${site.phone}`}>
              <Phone className="size-4" aria-hidden="true" />
            </a>
            <a href={links.reserve} target="_blank" rel="noreferrer" className={`${btn.ghost} !px-5 max-md:hidden`}>
              Reserve
            </a>
            <OrderButton className={`${btn.primary} !px-5`}>
              <ShoppingBag className="size-4" aria-hidden="true" />
              <span>Order</span>
            </OrderButton>
            <button
              ref={toggleRef}
              type="button"
              className={`${btn.icon} lg:hidden`}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" aria-hidden="true" /> : <MenuIcon className="size-5" aria-hidden="true" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-ink-950/97 px-6 pt-28 pb-10 backdrop-blur-xl lg:hidden"
            initial={reduce ? { opacity: 0 } : { clipPath: "circle(0% at calc(100% - 44px) 40px)" }}
            animate={reduce ? { opacity: 1 } : { clipPath: "circle(150% at calc(100% - 44px) 40px)" }}
            exit={reduce ? { opacity: 0 } : { clipPath: "circle(0% at calc(100% - 44px) 40px)", transition: { duration: 0.45, ease: ease.inOut } }}
            transition={{ duration: 0.7, ease: ease.inOut }}
            data-lenis-prevent
          >
            <OpenPill />
            <ul className="mt-8 flex flex-col">
              {[{ label: "Home", to: "/" }, ...navItems].map((n, i) => (
                <motion.li
                  key={n.to}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: ease.out }}
                  className="border-b border-cream/10"
                >
                  <Link
                    to={n.to}
                    onClick={(e) => {
                      section(n.to)(e);
                      setOpen(false);
                    }}
                    className="flex min-h-16 items-center justify-between font-display text-4xl text-cream"
                  >
                    {n.label}
                    <span className="font-sans text-xs text-muted">0{i + 1}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.div
              className="mt-auto flex flex-col gap-3 pt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <a href={links.reserve} target="_blank" rel="noreferrer" className={btn.gold}>
                <CalendarCheck className="size-4" aria-hidden="true" /> Reserve a table
              </a>
              <a href={site.phoneHref} className={btn.ghost}>
                <Phone className="size-4" aria-hidden="true" /> {site.phone}
              </a>
              <p className="mt-2 text-center text-sm text-muted">{addressLine}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
