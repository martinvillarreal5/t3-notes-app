/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    screens: {
      xs: "550px",
      /*  
      Breakpoint prefix	Minimum width	CSS
      sm	640px	@media (min-width: 640px) { ... }
      md	768px	@media (min-width: 768px) { ... }
      lg	1024px	@media (min-width: 1024px) { ... }
      xl	1280px	@media (min-width: 1280px) { ... }
      2xl	1536px
      */
      ...defaultTheme.screens,
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/line-clamp")],
  daisyui: {
    themes: [
      "dracula",
      "dark",
      "night",
      "business",
      {
        dracula: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          // The color of the text of btn-error doesnt match the one in the docs, so i assume is a bug
          // Here's a ugly workaround. Only for the base button
          ...require("daisyui/src/colors/themes")["[data-theme=dracula]"],
          ".btn-error": {
            color: "#440000",
          },
        },
      },
    ],
  },
};

module.exports = config;
