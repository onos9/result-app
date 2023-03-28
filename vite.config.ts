import { sveltekit } from "@sveltejs/kit/vite";
import type { UserConfig } from "vite";
import UnoCSS from "unocss/vite";
import presetIcons from "@unocss/preset-icons";

const config: UserConfig = {
  server: {
    host: "localhost",
    port: 3000,
  },
  preview:{
    port:5000,
    strictPort:false,
  },
  plugins: [
    sveltekit(),
    UnoCSS({
      presets: [presetIcons()],
    }),
  ],
};

export default config;
