/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        alexandria: ['Alexandria', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        sans: ['Alexandria', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#FDF8F5', 100: '#FCF0E8', 200: '#F9E0D0', 300: '#F5C8A8',
          400: '#F0A870', 500: '#3a3530', 600: '#2F2B27', 700: '#24211E',
          800: '#1A1815', 900: '#100F0D', 950: '#080706',
        },
        brand: {
          orange: '#ff9500',
          tan: '#dcb29c',
          cream: '#fcf8f5',
          brown: '#3a3530',
        },
        dark: {
          50: '#F5F3F2', 100: '#E8E5E2', 200: '#D1CCC8', 300: '#B0AAA4',
          400: '#8A827A', 500: '#6B645C', 600: '#524C46', 700: '#3D3934',
          800: '#2A2A2A', 900: '#1F1F1F', 950: '#141414',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'card': '0 1px 4px rgba(0, 0, 0, 0.03)',
        'peach': '0 4px 14px rgba(246, 219, 205, 0.5)',
        'orange': '0 4px 14px rgba(255, 149, 0, 0.25)',
      },
      borderRadius: {
        'btn': '0.75rem',
        'card': '1rem',
        'pill': '50rem',
      },
    },
  },
  plugins: [],
};
