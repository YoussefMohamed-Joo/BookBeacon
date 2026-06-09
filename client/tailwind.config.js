/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#EDF2EF', 100: '#D5E1DA', 200: '#ABC3B5', 300: '#84A98C',
          400: '#5C826A', 500: '#3F5C4E', 600: '#334A3F', 700: '#26382F',
          800: '#1A2520', 900: '#0F1712', 950: '#080C0A',
        },
        dark: {
          50: '#F2F1EF', 100: '#E6E3DF', 200: '#C8C4BE', 300: '#A8A29E',
          400: '#8A847E', 500: '#6B6660', 600: '#52504A', 700: '#3D3B37',
          800: '#2A2A2A', 900: '#1F1F1F', 950: '#141414',
        },
        surface: {
          50: '#F4F1EC', 100: '#EAE6DF', 200: '#D5CFC5', 300: '#BFB7A9',
          400: '#A89E8D', 500: '#918674', 600: '#756C5D', 700: '#5C5448',
          800: '#453F36', 900: '#2E2A23', 950: '#181511',
        },
        accent: {
          cta: '#C4693F',
          warm: '#D08C60',
          gold: '#E6C99A',
          sage: '#84A98C',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(24px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
      },
      boxShadow: {
        'soft': '0 2px 12px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.03)',
        'card': '0 1px 6px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'warm': '0 4px 16px rgba(63, 92, 78, 0.08), 0 1px 4px rgba(63, 92, 78, 0.04)',
        'cta': '0 4px 14px rgba(196, 105, 63, 0.25)',
      },
    },
  },
  plugins: [],
};
