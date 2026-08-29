/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./context/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        saffron: { 50: "#FFF7ED", 500: "#FF9933", 600: "#F2790A" },
        indiagreen: { 500: "#138808", 600: "#0F6B06" },
        navy: { 700: "#0B2447", 800: "#081A34", 900: "#050F1F" },
        risk: { bg: "#FEF2F2", border: "#FCA5A5", text: "#B91C1C" },
        safe: { bg: "#F0FDF4", border: "#86EFAC", text: "#15803D" },
        info: { bg: "#EFF6FF", border: "#93C5FD", text: "#1D4ED8" },
      },
      boxShadow: { card: "0 2px 12px rgba(11, 36, 71, 0.08)" },
      animation: { "pulse-slow": "pulse 2.2s cubic-bezier(0.4,0,0.6,1) infinite" },
    },
  },
  plugins: [],
};
