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
      fontFamily: {
        // Homepage display serif — H1/H2 only. Exposed as --font-serif by the
        // Fraunces loader in app/layout.tsx.
        serif: ["var(--font-serif)", "Georgia", "serif"],
        // Body/UI sans — was only reaching pages via an inline <body style>, so
        // `font-sans` fell back to Tailwind's default. Wire it to Inter (loaded
        // as --font-inter) so per-world `font-sans` type choices actually apply.
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        // Numbered kickers / mono accents. `font-mono` had no config, rendering
        // the browser default monospace — now an explicit stack.
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        // Malaf card palette (docs/card-visuals.html) — client-facing public card pages
        card: {
          bg: "#0e0f13",
          panel: "#16181f",
          ink: "#f4f2ec",
          muted: "#9aa0ae",
          accent: "#c9a45c",
          green: "#3ddc84",
        },
        // Dashboard palette (own daily-use back office) — coral accent on light neutral,
        // a family resemblance to the homepage brand without reusing it wholesale
        dash: {
          bg: "#fafaf9",
          surface: "#ffffff",
          border: "#e7e4de",
          ink: "#1c1a17",
          muted: "#7a766c",
          accent: "#e8623d",
          "accent-ink": "#ffffff",
          success: "#1f9254",
          warning: "#c98500",
          danger: "#d1453b",
          info: "#2a78d6",
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
