/** @type {import('tailwindcss').Config} */


module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    
    extend: {
         borderColor: {
      border: 'hsl(0, 0%, 89.8%)', // replaces border-border
    },
    ringColor: {
      ring: 'hsl(0, 0%, 3.9%)', // replaces outline-ring
    },
      
      colors: {
         background: 'hsl(0, 0%, 100%)', // light mode
        foreground: 'hsl(0, 0%, 3.9%)', // light mode text
        card: 'hsl(0, 0%, 100%)',
        'card-foreground': 'hsl(0, 0%, 3.9%)',
        
       
        primary: {
         
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#0066ff",
          600: "#0052cc",
          700: "#0043a3",
        },
        secondary: {
         
          500: "#3399ff",
        },
        accent: {
          
          500: "#00ccff",
        },
        success: {
          500: "#00ff88",
        },
        warning: {
          500: "#ff9900",
        },
        error: {
          500: "#ff3366",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "bounce-slow": "bounce 2s infinite",
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
