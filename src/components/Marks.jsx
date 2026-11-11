import { Leaf, Star } from "lucide-react";
import { tagLabels } from "../data/menu";

export function Chili({ className = "size-4", filled = true }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path
        d="M14.5 4.5c.4-1.4 1.6-2.3 3-2.4M15 6c2.6-.3 4.6 1.5 4.6 4 0 6.3-7.4 11.4-14.1 11.9-1.4.1-2-1.6-.8-2.3C9 17.4 11 13.6 11.2 9.7 11.4 7.6 13 6.2 15 6Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** 0–3 chillies, from the icons printed next to each dish. */
export function Heat({ level = 0, className = "" }) {
  if (!level) return <span className={`text-xs text-muted ${className}`}>Mild</span>;
  return (
    <span className={`inline-flex items-center gap-0.5 text-chili ${className}`} role="img" aria-label={`Heat ${level} of 3`}>
      {[1, 2, 3].map((n) => (
        <Chili key={n} className={`size-4 ${n > level ? "opacity-25" : ""}`} filled={n <= level} />
      ))}
    </span>
  );
}

const short = { veg: "Veg", vegan: "Vegan", gf: "GF", nf: "NF", df: "DF" };

/** Dietary chips. "fav" is rendered separately as the star badge. */
export function DietTags({ tags = [], className = "" }) {
  const list = tags.filter((t) => t !== "fav");
  if (!list.length) return null;
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`} aria-label="Dietary information">
      {list.map((t) => (
        <li
          key={t}
          title={tagLabels[t]}
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.7rem] font-semibold tracking-wide ${
            t === "veg" || t === "vegan"
              ? "border-leaf/40 bg-leaf/10 text-leaf"
              : "border-cream/15 bg-cream/5 text-cream/80"
          }`}
        >
          {(t === "veg" || t === "vegan") && <Leaf className="size-3" aria-hidden="true" />}
          <abbr title={tagLabels[t]} className="no-underline">
            {short[t]}
          </abbr>
        </li>
      ))}
    </ul>
  );
}

export function FavBadge({ className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-saffron px-2.5 py-1 text-[0.7rem] font-bold text-ink-950 shadow-lg ${className}`}
    >
      <Star className="size-3 fill-current" aria-hidden="true" /> All-time favourite
    </span>
  );
}
