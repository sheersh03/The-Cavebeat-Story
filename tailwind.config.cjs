
/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { ink:"#05070b", mist:"#eaeef2", accent:"#99f6e4", neon:"#7ee3ff" },
      boxShadow: {
        glow: "0 0 40px rgba(126, 227, 255, 0.25)",
      }
    }
  },
  plugins: []
}
