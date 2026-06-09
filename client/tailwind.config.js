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
          50: '#F2F7F2', 100: '#E2EDE4', 200: '#C6DBC9', 300: '#A2C5A7',
          400: '#7BAE83', 500: '#4A6F5D', 600: '#3D5E4E', 700: '#2F4A3E',
          800: '#223A2F', 900: '#1A2F25', 950: '#0F1E17',
        },
        dark: {
          50: '#F5F5F0', 100: '#E8E8E0', 200: '#D1D1C7', 300: '#B0B0A4',
          400: '#8A8A7E', 500: '#6B6B60', 600: '#525248', 700: '#3A3A34',
          800: '#2B2B2B', 900: '#1F1F1F', 950: '#141414',
        },
        surface: {
          50: '#F6F2E9', 100: '#EDE8DC', 200: '#DCD3C2', 300: '#C8BCA4',
          400: '#B0A284', 500: '#9A8A6C', 600: '#7D6F56', 700: '#635743',
          800: '#4D4333', 900: '#3A3226', 950: '#221D15',
        },
        accent: {
          warm: '#D9A066',
          cta: '#E07A5F',
          sage: '#81B29A',
          gold: '#F2CC8F',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideDown: { '0%': { transform: 'translateY(-10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-6px)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        wiggle: { '0%, 100%': { transform: 'rotate(0deg)' }, '25%': { transform: 'rotate(2deg)' }, '75%': { transform: 'rotate(-2deg)' } },
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 10px 20px -2px rgba(0, 0, 0, 0.03)',
        'warm': '0 4px 20px rgba(74, 111, 93, 0.08), 0 1px 3px rgba(74, 111, 93, 0.04)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.03)',
      },
    },
  },
  plugins: [],
};
