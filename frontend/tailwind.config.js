/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        moolya: {
          green: '#1b5e20',
          lightGreen: '#4caf50',
          yellow: '#fbc02d',
          darkYellow: '#f57f17',
          bg: '#f4f6f8',
          card: '#ffffff'
        }
      }
    },
  },
  plugins: [],
}
