import { useEffect, useState } from "react";
import { getOpenState } from "../data/site";

/** Live open/closed state, re-checked every minute. */
export function useOpenState() {
  const [state, setState] = useState(() => getOpenState());
  useEffect(() => {
    const id = setInterval(() => setState(getOpenState()), 60_000);
    return () => clearInterval(id);
  }, []);
  return state;
}
