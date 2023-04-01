//TODO Convert to file to ts and esm modules
/* eslint-disable @typescript-eslint/no-var-requires */
import defaultTheme from "tailwindcss/defaultTheme";

import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
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
  daisyui: {
    darkMode: "dracula",
    themes: [
      "dracula",
      "dark",
      "night",
      "business",
      {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        dracula: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          ...require("daisyui/src/colors/themes")["[data-theme=dracula]"],
          ".btn-error": {
            color: "#440000",
          },
        },
      },
    ],
  },
} satisfies Config;
