import { items } from "./menu";

/**
 * The dishes that circle the homepage hero, in order.
 *
 * Each entry points at a real menu item by `id` — name, price, heat and
 * dietary marks come from menu.js, so a price change there shows up here.
 * `img` is a file in public/media; `pos` and `zoom` frame the plate inside
 * the round crop (object-position, then a scale from that same point).
 */
const orbit = [
  { id: "hyderabadi-dum-biryani", img: "dish-biryani", pos: "50% 55%", zoom: 1.15 },
  { id: "makhani-masala", img: "dish-korma", pos: "0% 50%", zoom: 1.35 },
  { id: "tandoori-chicken", img: "dish-tandoori", pos: "50% 50%", zoom: 1 },
  { id: "dal-makhani", img: "dish-dal", pos: "50% 50%", zoom: 1.1 },
  { id: "taj-lamb-chops", img: "dish-kebab", pos: "50% 50%", zoom: 1 },
  { id: "veg-samosa", img: "dish-samosa", pos: "50% 50%", zoom: 1 },
  { id: "tikka-masala", img: "dish-butter-chicken", pos: "50% 82%", zoom: 1.2 },
  { id: "paneer-tikka", img: "dish-paneer-tikka", pos: "50% 50%", zoom: 1 },
  { id: "garlic-naan", img: "dish-naan", pos: "50% 60%", zoom: 1.1 },
  { id: "veg-thali", img: "feast-spread", pos: "50% 35%", zoom: 1 },
  { id: "gulab-jamun", img: "dish-gulab-jamun", pos: "55% 62%", zoom: 1.4 },
];

export const orbitDishes = orbit.map((o) => {
  const item = items.find((i) => i.id === o.id);
  if (!item) throw new Error(`orbit.js: no menu item with id "${o.id}"`);
  return { ...item, ...o };
});
