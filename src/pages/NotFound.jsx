import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Logo from "../components/Logo";
import { btn } from "../components/ui";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-svh flex-col items-center justify-center pt-24 pb-16 text-center">
      <Logo className="h-28 opacity-90" />
      <p className="text-outline mt-4 font-display text-[clamp(7rem,24vw,14rem)] leading-none font-semibold">404</p>
      <h1 className="mt-2 font-display text-[clamp(2rem,5vw,3.4rem)] text-cream">This plate isn&rsquo;t on the menu.</h1>
      <p className="mt-3 max-w-md text-muted">The page you were looking for has moved or never existed. The biryani, however, is exactly where you left it.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className={btn.primary}>
          Back to the home page
        </Link>
        <Link to="/menu" className={btn.ghost}>
          See the menu <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
