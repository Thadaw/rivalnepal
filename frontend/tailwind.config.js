import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        border: "hsl(var(--border))",
        card: "hsl(var(--card))",

        /* NEXORA brand architecture */
        brand: {
          black: "#000000",
          white: "#FFFFFF",
          offwhite: "#F5F5F2",
          charcoal: "#171717",
          darkgray: "#303030",
          lightgray: "#E8E8E8",
        },
        ink: { DEFAULT: "#000000", soft: "#171717", muted: "#303030" },
        noir: "#000000",
        chalk: "#F5F5F2",
        charcoal: "#171717",
        graphite: "#303030",
        ash: "#E8E8E8",
        bone: { DEFAULT: "#F5F5F2", deep: "#E8E8E8" },

        /* Functional colours stay outside the brand palette */
        success: { DEFAULT: "#16794C", light: "#E9F4EE" },
        error: { DEFAULT: "#B3261E", light: "#FBEDEC" },
        warning: { DEFAULT: "#A96500", light: "#FBF1E3" },

        /* Retained for the separate administration interface */
        lime: {
          50: "#f8ffe9",
          100: "#effcc6",
          200: "#e3f99a",
          300: "#d4fb5c",
          400: "#c6f542",
          500: "#afdf2a",
          600: "#93bc1d",
          700: "#6e8f14",
        },
        clay: "#e4572e",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        serif: ["Space Grotesk", "sans-serif"],
      },
      maxWidth: {
        page: "1440px",
      },
      spacing: {
        gutter: "var(--gutter)",
      },
      boxShadow: {
        soft: "0 18px 50px rgba(14,16,11,.08)",
        lift: "0 24px 60px -18px rgba(14,16,11,.28)",
        glow: "0 0 0 6px rgba(198,245,66,.25)",
      },
    },
  },
  plugins: [forms],
};
