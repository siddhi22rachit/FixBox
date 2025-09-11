import tailwindAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#f5f5f5", // add bg-background
        foreground: "#111111",
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#0066ff",
          600: "#0052cc",
          700: "#0043a3",
        },
        secondary: { 500: "#3399ff" },
        accent: { 500: "#00ccff" },
        success: { 500: "#00ff88" },
        warning: { 500: "#ff9900" },
        error: { 500: "#ff3366" },
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
      animation: {
        "fade-in": "fadeIn 0.6s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "bounce-slow": "bounce 2s infinite",
      },
      backdropBlur: { xs: "2px" },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [tailwindAnimate],
};
