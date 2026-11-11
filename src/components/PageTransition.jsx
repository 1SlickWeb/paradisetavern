import { motion, useReducedMotion } from "framer-motion";
import { ease } from "../lib/motion";

/**
 * Two-panel curtain between routes: on exit a red panel rises to cover the
 * old page, on enter a saffron-edged panel lifts off the new one. Reduced
 * motion gets a plain cross-fade.
 */
export default function PageTransition({ children }) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
        {children}
      </motion.div>
    );
  }
  return (
    <>
      {children}
      <motion.div
        className="pointer-events-none fixed inset-0 z-[95] origin-bottom bg-paradise"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.5, ease: ease.inOut }}
        aria-hidden="true"
      />
      <motion.div
        className="pointer-events-none fixed inset-0 z-[96] flex origin-top items-center justify-center bg-paradise"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0, transition: { duration: 0.75, ease: ease.inOut, delay: 0.1 } }}
        exit={{ scaleY: 0 }}
        aria-hidden="true"
      >
        <span className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-paradise via-saffron to-paradise" />
      </motion.div>
    </>
  );
}
