/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#231651",
        secondary: "#4DCCBD",
        tertiary: "#9747FF"
      }
    },
  },
  plugins: [],
}

