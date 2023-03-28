/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      width: {
        a4: "210mm",
      },
      height: {
        a4: "297mm",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["night", "winter", "light", "dark"],
    darkTheme: "night",
  },
};
