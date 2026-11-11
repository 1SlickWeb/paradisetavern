# Paradise Tavern — v2

A ground-up redesign of the Paradise Tavern site (Indian Kitchen & Bar,
9239 Park Meadows Drive, Lone Tree, CO 80124), modelled on two reference
recordings (`ref_1.mp4`, `ref_2.mp4`, not shipped).

React 19 · Vite 8 · Tailwind CSS v4 · Framer Motion · Lenis (smooth scroll) · React Router · Lucide icons.

```bash
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview
npm run lint
```

## The flow

**Home (`/`)**: one long, cinematic scroll:

1. **Preloader**: wok mark, the script name drawing in and a 0–100 counter. Once per session; never under reduced motion.
2. **Hero orbit**: eleven real dishes circle the headline on a tilted ellipse. Scrolling turns the table, pausing on each dish; the caption shows its menu name, price and heat. Arrows and dots jump to any dish. The hero blurs away as you leave it.
3. **Marquees + At a glance**: a dish-name ticker, giant hollow type that reacts to scroll speed, and an intro card whose words light up as you read.
4. **Signature dishes**: the six homepage dishes (`signatureIds` in `menu.js`) as tilt-and-spotlight cards.
5. **Twelve chapters**: the menu's chapters scroll sideways (pinned on desktop, swipe on touch).
6. **The Tavern**: kitchen, bar, room and robots, with a sticky photo that wipes between scenes.
7. **Spice meter**: the house 8-step scale as a slider.
8. **Stats + Google reviews**: count-up figures, two marquee rows of reviews, and a "read every review in full" grid.
9. **Visit**: live open/closed state, today's hours highlighted, directions, map.
10. **FAQ**: answers taken from the printed menu's small print and house rules.
11. **Footer**: closing call to action and a giant PARADISE that rises letter by letter.

**Menu (`/menu`)**: search, dietary and heat filters, a chapter rail with scroll-spy, per-protein prices, the spice scale and house rules. "Flip through the printed menu" opens all 18 scans in a lightbox (`/menu?printed=1`). Chapters deep-link: `/menu#biryani`.

**Ordering**: every "Order" button opens a phone-ordering sheet until online ordering exists. Set `links.orderOnline.ready = true` and `href` in `src/data/site.js` and every button becomes the external link. **Reserve** goes to the Toast page.

## Where things live

```
src/
  data/       site.js (hours, phones, links) · menu.js (160 dishes) · testimonials.js
              orbit.js (hero dishes + photo framing) · chapters.js · faq.js · media.js
  sections/   one file per homepage section
  pages/      Home · Menu · NotFound
  components/ Nav · Footer · OrderSheet · PrintedMenu · Preloader · Ambient (bokeh,
              cursor, progress bar) · Marquee · Reveal · Marks (chillies, diet tags) · ui.js
  lib/        motion.js (all easings) · lenis.js / smooth.jsx · order.jsx · navigation.js
  index.css   design tokens (@theme) and the few effects that aren't utilities
```

Colour, type and easing are tokens in `src/index.css` and `src/lib/motion.js`; components never hardcode a hex value.

## Still to supply

- **More real photography.** Two genuine photos are in use: `pt1.jpeg` (the room, in The Tavern's third scene, tagged "Inside Paradise Tavern") and `pt2.jpeg` (the storefront, above the map in Visit). Both are small (600×339 and 744×252), so they're shown near their native size. Larger originals, ideally 2000px+, would let them go full-bleed, and would also make a proper social-share image (`og:image`, 1200×630). Everything else in `public/media/` is still stock from v1; the footer says "Dish and mood photography is illustrative". Replace those using the same filenames, then adjust `pos`/`zoom` in `data/orbit.js` so each plate sits in its circle. New images need an entry in `data/media.js`; real photos get `real: true`.
- **Logo.** The supplied `public/media/PT-logo.png` is made for light backgrounds: "TAVERN" and the champagne badge are knocked out to transparency and the rules are black. The site therefore uses `PT-logo-dark.webp`, generated from it with those areas filled white and the rules turned cream. `favicon.png` (the pan) and `apple-touch-icon.png` are generated from the same artwork. An SVG, or a version designed for dark backgrounds, would be sharper.
- **Online ordering URL**: see above.
- **Prices.** They were read from the scanned menu; check them against the current print run.

## Accessibility & motion

- `prefers-reduced-motion`: no preloader, smooth scroll, custom cursor or ambient loops; the hero becomes a static screen with step buttons; reveals render immediately.
- Skip link, visible focus everywhere, focus moves to `<main>` on route change, dialogs trap and restore focus and close on Escape.
- Targets are at least 44px; every animated heading has a plain-text copy for screen readers; marquee duplicates are `aria-hidden`.

## Deploying

Static build. Client-side routing needs unknown paths rewritten to `index.html` (`public/_redirects` covers Netlify; Vercel works as is).
