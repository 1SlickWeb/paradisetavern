/**
 * Single source of truth for everything the restaurant owner is likely to
 * change. Nothing below is duplicated anywhere else in the app.
 */

export const site = {
  name: "Paradise Tavern",
  tagline: "Indian Kitchen & Bar",
  phone: "(303) 247-9264",
  phoneHref: "tel:+13032479264",
  phoneAlt: "(720) 762-4302",
  phoneAltHref: "tel:+17207624302",
  email: "hello@paradisetavern.com",
  address: {
    street: "9239 Park Meadows Drive",
    city: "Lone Tree",
    state: "CO",
    zip: "80124",
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=9239+Park+Meadows+Drive+Lone+Tree+CO+80124",
  mapEmbedUrl:
    "https://www.google.com/maps?q=9239+Park+Meadows+Drive,+Lone+Tree,+CO+80124&output=embed",

  /**
   * Where the contact form POSTs its JSON. Leave empty and the form falls
   * back to opening the visitor's mail client with everything pre-filled —
   * which means the form works today, with no backend. Paste a Formspree /
   * Netlify Forms / your-own-API URL here to switch to a real submission.
   */
  formEndpoint: "",
};

export const addressLine = `${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}`;

/**
 * Reservations go to the restaurant's Toast page.
 *
 * ORDER ONLINE: the client is supplying this URL later. Until then the
 * button routes to /order, an in-site holding page that keeps phone
 * ordering working. Drop the real link into `orderOnline.href` and set
 * `orderOnline.ready` to true — the CTA switches to an external link
 * everywhere at once, and /order stops being linked.
 */
export const links = {
  reserve:
    "https://toast.app/r/paradise-tavern-use-9239-park-meadows-drive?toast_sg=f4bfe89a-2daf-4158-af08-760dc14ed7ed&toast_ss=a72be889-e4ce-4f09-ac8d-7f203177c89e&toast_src=website_link&utm_source=undefined&utm_content=home&utm_medium=toast_sites&utm_term=nav",
  orderOnline: {
    ready: false,
    href: "",
  },
};

/** Monday-first for display; `day` matches Date#getDay() (0 = Sunday). */
export const hours = [
  { day: 1, label: "Monday", open: "11:00 AM", close: "10:00 PM", closeH: 22 },
  { day: 2, label: "Tuesday", open: "11:00 AM", close: "10:00 PM", closeH: 22 },
  { day: 3, label: "Wednesday", open: "11:00 AM", close: "10:30 PM", closeH: 22.5 },
  { day: 4, label: "Thursday", open: "11:00 AM", close: "10:30 PM", closeH: 22.5 },
  { day: 5, label: "Friday", open: "11:00 AM", close: "10:30 PM", closeH: 22.5 },
  { day: 6, label: "Saturday", open: "11:00 AM", close: "10:30 PM", closeH: 22.5 },
  { day: 0, label: "Sunday", open: "11:00 AM", close: "10:00 PM", closeH: 22 },
];

const OPEN_H = 11;

/**
 * Live open/closed state for the header pill and contact page.
 * Uses the visitor's own clock — good enough for a single-location
 * restaurant whose guests are almost always in the same timezone.
 */
export function getOpenState(now = new Date()) {
  const today = hours.find((h) => h.day === now.getDay());
  const hour = now.getHours() + now.getMinutes() / 60;
  const isOpen = hour >= OPEN_H && hour < today.closeH;

  if (isOpen) {
    return { isOpen: true, today, message: `Open now until ${today.close}` };
  }
  if (hour < OPEN_H) {
    return { isOpen: false, today, message: `Opens today at ${today.open}` };
  }
  const tomorrow = hours.find((h) => h.day === (now.getDay() + 1) % 7);
  return { isOpen: false, today, message: `Opens ${tomorrow.label} at ${tomorrow.open}` };
}
