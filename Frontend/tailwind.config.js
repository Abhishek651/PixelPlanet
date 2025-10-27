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
        // Your existing palette (mostly greens)
        'nyanza': '#d8f3dc',
        'celadon': '#b7e4c7',
        'mint-light': '#95d5b2',
        'mint': '#74c69d',
        'mint-dark': '#52b788',
        'sea-green': '#40916c',
        'dartmouth-green': '#2d6a4f',
        'brunswick-green': '#1b4332',
        'dark-green': '#081c15',

        // Adjusted Primary, Background, and Text for Login/Signup
        'primary': '#4CAF50', // A strong, vibrant green matching the image
        'primary-light': '#8BC34A', // Lighter green for hover/active states
        'background-light': '#FFFFFF', // Pure white for the main card background
        'background-dark': '#081c15', // Keep dark green for dark mode background
        'surface-light': 'rgba(255, 255, 255, 0.9)', // White with subtle glassmorphism
        'surface-dark': 'rgba(27, 67, 50, 0.6)', // Keep dark green surface for dark mode
        'text-light': '#212121', // Darker gray for text on light backgrounds
        'text-dark': '#E0E0E0', // Lighter gray for text on dark backgrounds
        'text-secondary-light': '#757575', // Gray for secondary text
        'text-secondary-dark': '#BDBDBD', // Lighter gray for secondary text
        'border-light': '#E0E0E0', // Light gray for borders
        'border-dark': '#424242', // Darker gray for borders
        
        // Dark theme colors for challenges page
        'dark-background': '#1A2C29',
        'dark-surface': '#253D3A',
        'dark-text-primary': '#E0E0E0',
        'dark-text-secondary': '#A0A0A0',
        'dark-border': '#3D5552',
        'dark-accent-green': '#4CAF50',
        'dark-gradient-start': '#1A2C29',
        'dark-gradient-end': '#0F1C1A',
        'gold-crown': '#FFD700',
        'gold-shadow': '#B8860B',
      },
      fontFamily: {
        display: ["Montserrat", "sans-serif"],
        body: ["Poppins", "sans-serif"],
      },
      borderRadius: {
        'xl': '1.5rem',
        '2xl': '2rem',
        '3xl': '3rem',
        '4xl': '4rem', // For the very rounded card top
        '5xl': '5rem',
      },
      boxShadow: {
        'soft': '0 4px 6px rgba(0, 0, 0, 0.05)',
        'soft-md': '0 8px 12px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 15px 30px rgba(0, 0, 0, 0.1)',
        'soft-xl': '0 25px 50px rgba(0, 0, 0, 0.15)',
        'dark-soft': '0 4px 8px rgba(0, 0, 0, 0.2)',
        'dark-deep': '0 8px 16px rgba(0, 0, 0, 0.4)',
      },
      backdropBlur: {
        'xl': '24px',
      }
    },
  },
  plugins: [],
};