"use client";

import { useEffect, useState } from "react";

/** Match a CSS media query; SSR-safe (false until mounted). */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** Narrow phones / small tablets — stacked desk instead of freeform canvas. */
export const MOBILE_DESK_QUERY = "(max-width: 767px)";

export function useMobileDesk(): boolean {
  return useMediaQuery(MOBILE_DESK_QUERY);
}
