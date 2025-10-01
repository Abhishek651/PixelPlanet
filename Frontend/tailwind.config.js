/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // Enable dark mode support
  theme: {
    extend: {
      colors: {
        primary: "#22c55e", // green-500
        "background-light": "#f0fdf4", // green-50
        "background-dark": "#052e16", // green-950
        "surface-light": "rgba(220, 252, 231, 0.6)", // green-100 with opacity
        "surface-dark": "rgba(22, 101, 52, 0.6)", // green-800 with opacity
        "text-light": "#1f2937", // gray-800
        "text-dark": "#e5e7eb", // gray-200
        "profile-start": "#4ade80", // green-400
        "profile-end": "#22c55e", // green-500
        "profile-dark-start": "#16a34a", // green-600
        "profile-dark-end": "#15803d", // green-700
      },
      fontFamily: {
        display: ["Montserrat", "sans-serif"],
        body: ["Poppins", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "1.5rem",
        lg: "2rem",
        xl: "3rem",
        full: "9999px"
      },
      boxShadow: {
        'soft': '0 10px 15px -3px rgba(0, 0, 0, 0.03), 0 4px 6px -4px rgba(0, 0, 0, 0.03)',
        'soft-lg': '0 25px 50px -12px rgba(0, 0, 0, 0.05)',
      },
      backdropBlur: {
        'xl': '24px',
      }
    },
  },
  plugins: [],
};