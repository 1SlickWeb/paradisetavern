/**
 * The restaurant's logo.
 *
 *   public/media/PT-logo.png        the supplied artwork (transparent, made
 *                                   for light backgrounds) — never edited
 *   public/media/PT-logo-dark.webp  the same artwork prepared for this dark
 *                                   site: the knocked-out "TAVERN" letters and
 *                                   the champagne badge filled white, as on the
 *                                   printed menu, and the black rules turned
 *                                   cream so they stay visible
 *
 * If the artwork changes, regenerate the dark version from the new PNG, or
 * ask for a version designed for dark backgrounds.
 */
export const LOGO_SRC = "/media/PT-logo-dark.webp";

export default function Logo({ className = "h-16", alt = "Paradise Tavern", ...rest }) {
  return (
    <img
      src={LOGO_SRC}
      alt={alt}
      width={505}
      height={494}
      decoding="async"
      draggable="false"
      className={`w-auto select-none ${className}`}
      {...rest}
    />
  );
}
