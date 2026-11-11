import { useCallback, useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, MotionConfig } from "framer-motion";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import OrderSheet from "./components/OrderSheet";
import Preloader from "./components/Preloader";
import PageTransition from "./components/PageTransition";
import { BackToTop, Bokeh, Cursor, ScrollProgress } from "./components/Ambient";
import Home from "./pages/Home";
import MenuPage from "./pages/Menu";
import NotFound from "./pages/NotFound";
import { SmoothScroll } from "./lib/smooth";
import { useLenis } from "./lib/lenis";
import { OrderProvider } from "./lib/order";
import { IntroContext } from "./lib/intro";

const titles = {
  "/": "Paradise Tavern — Indian Kitchen & Bar · Lone Tree, CO",
  "/menu": "Menu · Paradise Tavern, Lone Tree",
};

function Shell() {
  const location = useLocation();
  const lenis = useLenis();
  const main = useRef(null);
  const [intro, setIntro] = useState(false);
  const onIntroDone = useCallback(() => setIntro(true), []);

  useEffect(() => {
    document.title = titles[location.pathname] ?? "Page not found · Paradise Tavern";
  }, [location.pathname]);

  // New page: start at the top (hash links scroll themselves afterwards)
  // and move focus to <main> so screen readers announce the change.
  const onExitComplete = () => {
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    main.current?.focus({ preventScroll: true });
  };

  return (
    <IntroContext.Provider value={intro}>
      <Preloader onDone={onIntroDone} />
      <a
        href="#main"
        className="fixed top-3 left-3 z-[110] -translate-y-24 rounded-full bg-saffron px-5 py-3 font-semibold text-ink-950 transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <div className="grain">
        <Bokeh />
        <ScrollProgress />
        <Nav />
        <main id="main" ref={main} tabIndex={-1} className="outline-none">
          <AnimatePresence mode="wait" initial={false} onExitComplete={onExitComplete}>
            <PageTransition key={location.pathname}>
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PageTransition>
          </AnimatePresence>
        </main>
        <Footer />
        <OrderSheet />
        <BackToTop />
        <Cursor />
      </div>
    </IntroContext.Provider>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <OrderProvider>
          <Shell />
        </OrderProvider>
      </SmoothScroll>
    </MotionConfig>
  );
}
