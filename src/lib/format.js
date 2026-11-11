/** $19, $3.50, $12.50 — whole dollars drop the cents. */
export function money(n) {
  if (n == null) return "";
  return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`;
}

/** The lowest price a dish can be ordered at, for "from $16" labels. */
export function fromPrice(item) {
  if (item.price != null) return item.price;
  if (!item.prices?.length) return null;
  return Math.min(...item.prices.map((p) => p.price));
}

export function priceLabel(item) {
  const p = fromPrice(item);
  if (p == null) return "";
  return item.prices?.length > 1 ? `from ${money(p)}` : money(p);
}

export const pad2 = (n) => String(n).padStart(2, "0");
