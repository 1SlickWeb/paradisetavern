import { useLocation, useNavigate } from "react-router-dom";
import { useScrollTo } from "./lenis";

export const navItems = [
  { label: "Menu", to: "/menu" },
  { label: "Signatures", to: "/#signatures" },
  { label: "The Tavern", to: "/#tavern" },
  { label: "Reviews", to: "/#reviews" },
  { label: "Visit", to: "/#visit" },
];

/** Same-page hash links scroll smoothly; cross-page ones navigate first. */
export function useSectionLink() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const scrollTo = useScrollTo();
  return (to) => (e) => {
    if (!to.includes("#")) return;
    const [path, id] = to.split("#");
    e.preventDefault();
    if (pathname === (path || "/")) scrollTo(`#${id}`);
    else navigate(to);
  };
}
