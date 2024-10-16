/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: "340px",
      md: "540px",
      lg: "768px",
      xl: "1280px",
    },
    extend: {},
    keyframes: {
    },
    fontFamily: {
      Jost: ["Jost", "sans-serif"],
      Lobster: [ "Lobster","sans-seri"]
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "24px",
        md: "8px"
      }
    }
  },
  plugins: [],
}