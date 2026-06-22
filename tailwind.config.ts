import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "gr-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "gr-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: ".45", transform: "scale(.8)" },
        },
        "gr-pop": {
          "0%": { transform: "scale(.7)", opacity: "0" },
          "60%": { transform: "scale(1.06)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "gr-fall": {
          "0%": { transform: "translateY(-40px) rotate(0)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translateY(640px) rotate(420deg)", opacity: ".9" },
        },
        "gr-rise": {
          "0%": { transform: "translateY(18px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "gr-confetti": {
          "0%": { transform: "translateY(0) rotate(0deg)", opacity: "0" },
          "12%": { opacity: "1" },
          "100%": { transform: "translateY(150px) rotate(280deg)", opacity: "0" },
        },
      },
      animation: {
        "gr-float": "gr-float 4s ease-in-out infinite",
        "gr-pulse": "gr-pulse 1.4s infinite",
        "gr-pop": "gr-pop .5s ease-out both",
        "gr-fall": "gr-fall 2.4s linear infinite",
        "gr-rise": "gr-rise .4s ease-out both",
        "gr-confetti": "gr-confetti 1.8s cubic-bezier(.21,.61,.35,1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
