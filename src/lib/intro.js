import { createContext, useContext } from "react";

/** True once the preloader has lifted, so the hero can play its entrance. */
export const IntroContext = createContext(true);
export const useIntroDone = () => useContext(IntroContext);
