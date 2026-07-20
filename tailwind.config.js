const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Malaf card palette (docs/card-visuals.html)
        card: {
          bg: "#0e0f13",
          panel: "#16181f",
          ink: "#f4f2ec",
          muted: "#9aa0ae",
          accent: "#c9a45c",
          green: "#3ddc84",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [heroui({
    themes: {
      light: {
        colors: {
          primary: { DEFAULT: "#c9a45c", foreground: "#141414" },
          success: { DEFAULT: "#10b981", foreground: "#ffffff" },
          warning: { DEFAULT: "#f59e0b", foreground: "#ffffff" },
          danger: { DEFAULT: "#ef4444", foreground: "#ffffff" },
        },
      },
      dark: {
        colors: {
          background: "#0e0f13",
          primary: { DEFAULT: "#c9a45c", foreground: "#141414" },
        },
      },
    },
  })],
}
