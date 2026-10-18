// Theme state lives outside React so it can be read before hydration (see themeBootScript) and
// shared through useSyncExternalStore. Writes update <html data-theme> and localStorage directly.

type TThemeState = {
  choice: "light" | "dark" | null;
  wizard: boolean;
  systemDark: boolean;
};

const THEME_KEY = "sn-theme";
const WIZARD_KEY = "sn-wiz";
const SERVER_STATE: TThemeState = {
  choice: null,
  wizard: false,
  systemDark: false,
};

let state: TThemeState = SERVER_STATE;
let started = false;
const listeners = new Set<() => void>();

const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const write = (key: string, value: string | null) => {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Storage can be blocked (private mode); the theme then lasts for this visit only.
  }
};

const apply = () => {
  const root = document.documentElement;
  if (state.wizard) root.setAttribute("data-theme", "wizard");
  else if (state.choice) root.setAttribute("data-theme", state.choice);
  else root.removeAttribute("data-theme");
};

const set = (next: Partial<TThemeState>) => {
  state = { ...state, ...next };
  apply();
  listeners.forEach((l) => l());
};

const start = () => {
  if (started || typeof window === "undefined") return;
  started = true;
  const saved = read(THEME_KEY);
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  state = {
    choice: saved === "light" || saved === "dark" ? saved : null,
    wizard: read(WIZARD_KEY) === "1",
    systemDark: mq.matches,
  };
  mq.addEventListener("change", (e) => set({ systemDark: e.matches }));
};

export const themeStore = {
  subscribe: (listener: () => void) => {
    start();
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot: () => {
    start();
    return state;
  },
  getServerSnapshot: () => SERVER_STATE,
  setChoice: (choice: "light" | "dark") => {
    write(THEME_KEY, choice);
    set({ choice });
  },
  setWizard: (wizard: boolean) => {
    write(WIZARD_KEY, wizard ? "1" : null);
    set({ wizard });
  },
};

// Runs in <head> before the first paint so a saved theme never flashes the default one.
export const themeBootScript = `(function(){try{var r=document.documentElement;if(localStorage.getItem("${WIZARD_KEY}")==="1"){r.setAttribute("data-theme","wizard");return}var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark")r.setAttribute("data-theme",t)}catch(e){}})();`;
