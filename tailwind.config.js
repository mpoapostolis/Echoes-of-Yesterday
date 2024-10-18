/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Update this path to match your project structure
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
