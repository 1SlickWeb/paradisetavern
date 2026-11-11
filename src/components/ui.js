/**
 * Button recipes. Every button is at least 44px tall and has a visible
 * hover, press and focus state.
 */
const base =
  "relative inline-flex min-h-11 items-center justify-center gap-2 rounded-full font-sans text-[0.95rem] font-semibold whitespace-nowrap transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-out active:scale-[0.97] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50";

export const btn = {
  /** Paradise red — the one primary action in any view */
  primary: `${base} px-6 py-3 bg-paradise text-white shadow-[0_8px_30px_-8px_rgb(208_43_34/0.7)] hover:bg-paradise-deep hover:shadow-[0_10px_40px_-6px_rgb(208_43_34/0.85)]`,
  /** Saffron — secondary emphasis, dark text for contrast */
  gold: `${base} px-6 py-3 bg-saffron text-ink-950 shadow-[0_8px_30px_-10px_rgb(240_169_59/0.7)] hover:bg-saffron-soft`,
  /** Outline on dark */
  ghost: `${base} px-6 py-3 border border-cream/25 text-cream hover:border-saffron hover:text-saffron-soft bg-ink-950/30 backdrop-blur-sm`,
  /** Round icon button */
  icon: "inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-cream/15 bg-ink-900/60 text-cream backdrop-blur transition-colors duration-300 hover:border-saffron hover:text-saffron cursor-pointer active:scale-95",
  /** Text link with an animated arrow */
  link: "group inline-flex min-h-11 items-center gap-2 font-sans text-sm font-semibold text-saffron hover:text-saffron-soft transition-colors cursor-pointer",
};
