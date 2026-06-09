/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0B1F3A',
          blue: '#1E5EFF',
          'blue-dark': '#1545CC',
          yellow: '#FFD84D',
        },
        dark: {
          50: '#F5F7FA', 100: '#E8EBF0', 200: '#D0D5E0', 300: '#AAB3C5',
          400: '#7A87A0', 500: '#5A6680', 600: '#3D4A63', 700: '#2A3750',
          800: '#132D4B', 900: '#0B1F3A', 950: '#071528',
        },
      },
      fontFamily: {
        alexandria: ['Alexandria', 'sans-serif'],
        sans: ['Alexandria', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.15)',
        'card-hover': '0 8px 24px rgba(30,94,255,0.15)',
        'blue': '0 4px 14px rgba(30,94,255,0.3)',
        'yellow': '0 4px 14px rgba(255,216,77,0.3)',
        'glow': '0 0 20px rgba(30,94,255,0.1)',
      },
      borderRadius: {
        'card': '14px',
        'btn': '10px',
      },
    },
  },
  plugins: [],
};
