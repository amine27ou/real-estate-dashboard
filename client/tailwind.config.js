/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "login-banner": "url('./src/assets/login-banner.png')",
      },
    },
  },
  plugins: [],
}
