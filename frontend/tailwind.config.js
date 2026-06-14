/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0f172a',
        darkSurface: '#1e293b',
        premiumAccent: '#8b5cf6', // Violet premium
      }
    },
  },
  plugins: [],
}
