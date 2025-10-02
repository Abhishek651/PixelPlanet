/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // New Green-Themed Palette
        'nyanza': '#d8f3dc',
        'celadon': '#b7e4c7',
        'mint-light': '#95d5b2',
        'mint': '#74c69d',
        'mint-dark': '#52b788',
        'sea-green': '#40916c',
        'dartmouth-green': '#2d6a4f',
        'brunswick-green': '#1b4332',
        'dark-green': '#081c15',
        // Aliases for easier use
        'primary': '#40916c', // sea-green
        'primary-light': '#52b788', // mint-dark
        'background-light': '#f7fdf8', // A very light nyanza
        'background-dark': '#081c15', // dark-green
        'surface-light': 'rgba(216, 243, 220, 0.6)', // nyanza with opacity
        'surface-dark': 'rgba(27, 67, 50, 0.6)', // brunswick-green with opacity
        'text-light': '#081c15', // dark-green for high contrast on light bg
        'text-dark': '#d8f3dc', // nyanza for high contrast on dark bg
        'text-secondary-light': '#2d6a4f', // dartmouth-green
        'text-secondary-dark': '#95d5b2', // mint-light
      },
      fontFamily: {
        display: ["Montserrat", "sans-serif"],
        body: ["Poppins", "sans-serif"],
      },
      borderRadius: {
        'xl': '1.5rem',
        '2xl': '2rem',
        '3xl': '3rem',
      },
      boxShadow: {
        'soft': '0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
      },
      backdropBlur: {
        'xl': '24px',
      }
    },
  },
  plugins: [],
};