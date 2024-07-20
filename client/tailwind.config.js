/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // This is for check the index file and in src folder to check the file of .js, .ts, .jsx, .tsx

    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    // ...
  ],
}