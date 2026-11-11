/**
 * Every easing, duration and shared variant on the site lives here, so the
 * whole thing moves with one voice. Exits are faster than entrances.
 */

export const ease = {
  out: [0.16, 1, 0.3, 1], // expo out — entrances
  inOut: [0.87, 0, 0.13, 1], // expo in-out — curtains, page wipes
  soft: [0.22, 1, 0.36, 1],
};

export const dur = {
  fast: 0.2,
  base: 0.45,
  slow: 0.9,
  curtain: 0.85,
};

export const spring = {
  snappy: { type: "spring", stiffness: 380, damping: 32, mass: 0.6 },
  soft: { type: "spring", stiffness: 120, damping: 22, mass: 0.9 },
};

/** Fade-and-rise used by <Reveal>. */
export const rise = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: dur.slow, ease: ease.out, delay: i * 0.08 },
  }),
};

export const stagger = (gap = 0.08, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

/** Letter-by-letter mask reveal, used in headings. */
export const letter = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.8, ease: ease.out } },
  exit: { y: "-110%", transition: { duration: 0.35, ease: ease.inOut } },
};
