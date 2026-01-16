/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        finops: {
          bg: "#020617", // Slate 950
          surface: "#0f172a", // Slate 900
          primary: "#06b6d4", // Cyan 500
          secondary: "#6366f1", // Indigo 500
          accent: "#10b981", // Emerald 500 (Positive/Savings)
          danger: "#ef4444", // Red 500 (Alerts)
          text: "#f8fafc", // Slate 50
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
