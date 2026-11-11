import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeroOrbit from "../sections/HeroOrbit";
import Glance from "../sections/Glance";
import Signatures from "../sections/Signatures";
import Chapters from "../sections/Chapters";
import Tavern from "../sections/Tavern";
import SpiceMeter from "../sections/SpiceMeter";
import Reviews from "../sections/Reviews";
import Visit from "../sections/Visit";
import Faq from "../sections/Faq";
import { useScrollTo } from "../lib/lenis";

export default function Home() {
  const { hash } = useLocation();
  const scrollTo = useScrollTo();

  // Arriving from another page via /#visit etc.
  useEffect(() => {
    if (!hash) return;
    const t = setTimeout(() => scrollTo(hash), 450);
    return () => clearTimeout(t);
  }, [hash]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <HeroOrbit />
      <Glance />
      <Signatures />
      <Chapters />
      <Tavern />
      <SpiceMeter />
      <Reviews />
      <Visit />
      <Faq />
    </>
  );
}
