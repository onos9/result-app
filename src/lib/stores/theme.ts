import { browser } from "$app/environment";
import { writable } from "svelte/store";

const Theme = () => {
  let scheme = "auto";
  if (browser) scheme = localStorage.picoPreferredColorScheme ?? scheme;

  const { set, subscribe, update } = writable(scheme);

  const setTheme = (scheme: "auto" | "dark" | "light") => {
    const prefered = getPreferredColorScheme();

    if (scheme == "auto") {
      scheme = prefered == "dark" ? "light" : "dark";
    }
      
    set(scheme);
    if (browser) localStorage.picoPreferredColorScheme = scheme;
  };

  const toggle = () => {
    const prefered = getPreferredColorScheme();

    if (scheme == "auto") {
      scheme = prefered == "dark" ? "light" : "dark";
    } else if (scheme == "dark" || scheme == "light") {
      scheme = scheme == "dark" ? "light" : "dark";
    }

    set(scheme);

    if (browser) {
      document.documentElement.setAttribute("data-theme", scheme);
      localStorage.picoPreferredColorScheme = scheme;
    }
    // console.log(scheme);
    return scheme;
  };

  const getPreferredColorScheme = () => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  return { setTheme, toggle, subscribe, update };
};

export const theme = Theme();
