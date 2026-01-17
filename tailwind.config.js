/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        finops: {
          bg: "#0f172a", // Slate 900 (Lighter than 950)
          surface: "#1e293b", // Slate 800 (Lighter than 900)
          primary: "#22d3ee", // Cyan 400 (Brighter pop)
          secondary: "#818cf8", // Indigo 400
          accent: "#34d399", // Emerald 400
          danger: "#f87171", // Red 400
          text: "#f1f5f9", // Slate 100
          muted: "#94a3b8", // Slate 400
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
