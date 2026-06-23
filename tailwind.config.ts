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
        "gr-rise": {
          "0%": { transform: "translateY(18px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "gr-confetti": {
          "0%": { transform: "translateY(0) rotate(0deg)", opacity: "0" },
          "12%": { opacity: "1" },
          "100%": { transform: "translateY(150px) rotate(280deg)", opacity: "0" },
        },
        "gr-sparkle": {
          "0%": { transform: "scale(0) translateY(0)", opacity: "0" },
          "30%": { transform: "scale(1) translateY(-10px)", opacity: "1" },
          "100%": { transform: "scale(.3) translateY(-46px)", opacity: "0" },
        },
        "gr-drift": {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(-1.2%,1%) scale(1.03)" },
        },
        "gr-slide-down": {
          "0%": { transform: "translateY(-24px)", opacity: "0" },
          "15%": { transform: "translateY(0)", opacity: "1" },
          "85%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-24px)", opacity: "0" },
        },
        "gr-orb-breathe": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.02)" },
        },
        "gr-orb-float-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "gr-orb-pulse": {
          "0%": { transform: "scale(1.02)" },
          "50%": { transform: "scale(1.08)" },
          "100%": { transform: "scale(1.02)" },
        },
        "gr-fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "gr-particle-drift": {
          "0%, 100%": { transform: "translate(0,0)", opacity: ".25" },
          "50%": { transform: "translate(6px,-16px)", opacity: ".6" },
        },
      },
      animation: {
        "gr-float": "gr-float 4s ease-in-out infinite",
        "gr-pulse": "gr-pulse 1.4s infinite",
        "gr-pop": "gr-pop .5s ease-out both",
        "gr-rise": "gr-rise .4s ease-out both",
        "gr-confetti": "gr-confetti 1.8s cubic-bezier(.21,.61,.35,1) forwards",
        "gr-sparkle": "gr-sparkle 2.4s ease-out forwards",
        "gr-drift": "gr-drift 18s ease-in-out infinite",
        "gr-slide-down": "gr-slide-down 3s ease-in-out both",
        "gr-orb-breathe": "gr-orb-breathe 4s ease-in-out infinite",
        "gr-orb-float-soft": "gr-orb-float-soft 6s ease-in-out infinite",
        "gr-orb-pulse": "gr-orb-pulse .4s ease-out",
        "gr-fade-in": "gr-fade-in .5s ease-out both",
        "gr-particle-drift": "gr-particle-drift 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
