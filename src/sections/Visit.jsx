import { CalendarCheck, MapPin, Navigation, Phone } from "lucide-react";
import { addressLine, hours, links, site } from "../data/site";
import { media, mediaSrc } from "../data/media";
import { useOpenState } from "../lib/useOpenState";
import { Eyebrow, Reveal, SplitHeading } from "../components/Reveal";
import Magnetic from "../components/Magnetic";
import { btn } from "../components/ui";

export default function Visit() {
  const { isOpen, message, today } = useOpenState();

  return (
    <section id="visit" aria-labelledby="visit-title" className="relative py-24 sm:py-32">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="min-w-0">
            <Eyebrow>Visit us</Eyebrow>
            <SplitHeading
            id="visit-title"
              text="Find us on Park Meadows Drive."
              accent={["Park", "Meadows"]}
              className="mt-5 font-display text-[clamp(2.4rem,5vw,4.2rem)] text-cream"
            />

            <Reveal className="mt-8 flex flex-col gap-4">
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-4 rounded-2xl border border-cream/10 bg-ink-900/50 p-5 transition-colors hover:border-saffron/40"
              >
                <MapPin className="mt-0.5 size-5 shrink-0 text-saffron" aria-hidden="true" />
                <span>
                  <span className="block font-display text-2xl text-cream">{site.address.street}</span>
                  <span className="block text-muted">
                    {site.address.city}, {site.address.state} {site.address.zip}
                  </span>
                  <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-saffron group-hover:text-saffron-soft">
                    Get directions <Navigation className="size-3.5" aria-hidden="true" />
                  </span>
                </span>
              </a>
              <div className="flex flex-col gap-1 rounded-2xl border border-cream/10 bg-ink-900/50 p-5 sm:flex-row sm:items-center sm:gap-6">
                <Phone className="hidden size-5 shrink-0 text-saffron sm:block" aria-hidden="true" />
                <a href={site.phoneHref} className="inline-flex min-h-11 items-center font-display text-2xl text-cream hover:text-saffron-soft">
                  {site.phone}
                </a>
                <a href={site.phoneAltHref} className="inline-flex min-h-11 items-center text-muted hover:text-cream">
                  {site.phoneAlt}
                </a>
              </div>
            </Reveal>

            <Reveal className="mt-8 rounded-2xl border border-cream/10 bg-ink-900/50 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display text-2xl text-cream">Opening hours</h3>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${isOpen ? "bg-saffron/15 text-saffron-soft" : "bg-cream/10 text-muted"}`}
                >
                  {message}
                </span>
              </div>
              <table className="mt-4 w-full text-sm">
                <caption className="sr-only">Opening hours by day</caption>
                <tbody>
                  {hours.map((h) => {
                    const isToday = h.day === today.day;
                    return (
                      <tr key={h.day} className={`border-t border-cream/10 ${isToday ? "text-cream" : "text-muted"}`} aria-current={isToday ? "date" : undefined}>
                        <th scope="row" className="py-2.5 text-left font-medium">
                          <span className="flex items-center gap-2">
                            {isToday && <span className="size-1.5 rounded-full bg-saffron" aria-hidden="true" />}
                            {h.label}
                            {isToday && <span className="text-xs text-saffron">Today</span>}
                          </span>
                        </th>
                        <td className="py-2.5 text-right tabular-nums">
                          {h.open} – {h.close}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="mt-3 text-xs text-muted">Main menu served until 9:45 PM daily; the All Time Menu runs until close.</p>
            </Reveal>

            <Reveal className="mt-8 flex flex-wrap gap-3">
              <Magnetic>
                <a href={links.reserve} target="_blank" rel="noreferrer" className={btn.primary}>
                  <CalendarCheck className="size-4" aria-hidden="true" /> Reserve a table
                </a>
              </Magnetic>
              <a href={site.phoneHref} className={btn.ghost}>
                <Phone className="size-4" aria-hidden="true" /> Call the kitchen
              </a>
            </Reveal>
          </div>

          <div className="flex min-w-0 flex-col gap-5">
            {/* The real storefront, so guests recognise the building when they pull in */}
            <Reveal as="figure" className="group relative overflow-hidden rounded-[2rem] border border-cream/10 bg-ink-900/50">
              <div className="relative overflow-hidden">
                <img
                  src={mediaSrc("pt2")}
                  alt="The Paradise Tavern storefront at 9239 Park Meadows Drive, with the red Paradise Tavern sign over the entrance"
                  width={media.pt2.w}
                  height={media.pt2.h}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[744/252] w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
                  style={{ backgroundColor: media.pt2.color }}
                />
              </div>
              <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 py-4 sm:px-6">
                <span className="font-display text-2xl text-cream">Look for the red Paradise sign.</span>
                <span className="text-xs tracking-[0.2em] text-saffron uppercase">9239 · above the door</span>
              </figcaption>
            </Reveal>

            <Reveal className="relative min-h-[360px] flex-1 overflow-hidden rounded-[2rem] border border-cream/10">
              <iframe
                title={`Map showing Paradise Tavern at ${addressLine}`}
                src={site.mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-x-0 -top-[120px] h-[calc(100%+120px)] w-full border-0"
                style={{ filter: "grayscale(0.9) invert(0.92) contrast(0.88) hue-rotate(180deg) sepia(0.25)" }}
              />
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] shadow-[inset_0_0_80px_rgb(11_8_7/0.85)]" aria-hidden="true" />
              {/* The iframe is shifted up 120px to hide Google's place card, so the map's
                true centre (the restaurant) sits 60px above the middle of this box. */}
              <div className="pointer-events-none absolute top-[calc(50%-60px)] left-1/2 -translate-1/2" aria-hidden="true">
                <span className="absolute -inset-6 animate-ping rounded-full bg-paradise/30" />
                <span className="relative flex size-12 items-center justify-center rounded-full bg-paradise text-white shadow-[0_0_40px_rgb(208_43_34/0.8)]">
                  <MapPin className="size-5" />
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
