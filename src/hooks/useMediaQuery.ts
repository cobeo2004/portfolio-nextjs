import { useSyncExternalStore } from "react";

// Live match for a CSS media query. Always false on the server and during hydration, so
// markup that depends on it renders the simple version first.
export const useMediaQuery = (query: string) =>
  useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
