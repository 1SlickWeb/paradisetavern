import { motion, useReducedMotion } from "framer-motion";
import { ease, rise } from "../lib/motion";

/** Fades and lifts its children in once, when they scroll into view. */
export function Reveal({ as = "div", i = 0, className = "", children, amount = 0.25, ...rest }) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  if (reduce) {
    const Plain = as;
    return (
      <Plain className={className} {...rest}>
        {children}
      </Plain>
    );
  }
  return (
    <Tag
      className={className}
      variants={rise}
      custom={i}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

const bare = (w) => w.replace(/[^\w’']/g, "");

/**
 * Heading whose words rise out of a mask one after another. Words listed
 * in `accent` are set in gold italic. Screen readers get the plain string
 * from a visually hidden copy; the animated words are aria-hidden.
 */
export function SplitHeading({ as = "h2", id, text, className = "", delay = 0, accent = [] }) {
  const reduce = useReducedMotion();
  const Tag = as;
  const words = text.split(" ");
  const accented = new Set(accent.map(bare));
  return (
    <Tag id={id} className={className}>
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className={`inline-block ${accented.has(bare(w)) ? "italic text-gradient-gold pr-[0.06em]" : ""}`}
            initial={reduce ? false : { y: "105%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, ease: ease.out, delay: delay + i * 0.06 }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Small uppercase label with a short rule under it, centred or left. */
export function Eyebrow({ children, center = false, className = "" }) {
  return (
    <div className={`flex flex-col gap-3 ${center ? "items-center text-center" : "items-start"} ${className}`}>
      <span className="eyebrow">{children}</span>
      <span
        className={`h-px w-14 ${center ? "bg-linear-to-r from-transparent via-saffron to-transparent" : "bg-linear-to-r from-saffron to-transparent"}`}
        aria-hidden="true"
      />
    </div>
  );
}
