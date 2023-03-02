// eslint-disable-next-line @typescript-eslint/no-var-requires
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
  plugins: [require("daisyui")],
};

module.exports = config;
