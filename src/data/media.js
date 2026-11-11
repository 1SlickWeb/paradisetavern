/**
 * Every image in public/media, with its intrinsic size and average colour.
 * Add an entry here whenever you add a file there.
 *
 * Each entry is the image's intrinsic size and its average colour. The size
 * lets every <img> declare width/height up front (no layout shift); the
 * colour paints the frame before the file arrives (no white flash).
 */

export const media = {
  "ambience-bar": { w: 2000, h: 1340, color: "#312c17" },
  "ambience-booth": { w: 2000, h: 3000, color: "#211512" },
  "ambience-table": { w: 2000, h: 3000, color: "#2f2618" },
  "dish-barfi": { w: 1100, h: 1650, color: "#16120d" },
  "dish-biryani": { w: 1100, h: 1650, color: "#948976" },
  "dish-bread-basket": { w: 1100, h: 1467, color: "#7c746c" },
  "dish-butter-chicken": { w: 1100, h: 1955, color: "#514731" },
  "dish-curry-naan": { w: 1100, h: 596, color: "#8c7a60" },
  "dish-dal": { w: 1100, h: 1467, color: "#52524f" },
  "dish-gulab-jamun": { w: 1100, h: 1650, color: "#4d352f" },
  "dish-kebab": { w: 1100, h: 1650, color: "#785d46" },
  "dish-korma": { w: 1100, h: 733, color: "#9b8a62" },
  "dish-naan": { w: 1100, h: 1648, color: "#493c2c" },
  "dish-paneer-tikka": { w: 1100, h: 733, color: "#855539" },
  "dish-samosa": { w: 1100, h: 733, color: "#ac937f" },
  "dish-tandoori": { w: 1100, h: 733, color: "#7a5a3e" },
  "feast-spread": { w: 2000, h: 2666, color: "#816649" },
  "hero-feast": { w: 2000, h: 1333, color: "#5c4f35" },
  "hero-flame": { w: 2000, h: 3000, color: "#322112" },
  "hero-tandoor": { w: 2000, h: 3000, color: "#75401d" },
  "spice-dark": { w: 2000, h: 3177, color: "#1d100b" },
  "spice-flatlay": { w: 2000, h: 1411, color: "#433827" },

  // Real photographs of Paradise Tavern, supplied by the restaurant (JPEG,
  // added by hand). Both are small, so they're only used where they can
  // be shown near their native size; `real` marks them as genuine on-site
  // photos, as opposed to the illustrative stock above.
  pt1: { w: 600, h: 339, color: "#5e5453", ext: "jpeg", real: true }, // the room: big screens, bar, guests
  pt2: { w: 744, h: 252, color: "#79797a", ext: "jpeg", real: true }, // the storefront on Park Meadows Drive
};

export const mediaSrc = (name) => `/media/${name}.${media[name]?.ext ?? "webp"}`;
