/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7f8', 100: '#b3e9ed', 200: '#80dbdf',
          300: '#4dc9d1', 400: '#00a8b5', 500: '#0098A4',
          600: '#007A83', 700: '#005c63', 800: '#003d42',
          900: '#001f22',
        },
        brand: {
          navy: '#0a1628',
          teal: '#0098A4',
          'teal-dark': '#007A83',
          cyan: '#4EE7F3',
        },
        dark: {
          50: '#F5F7FA', 100: '#E8EBF0', 200: '#D0D5E0', 300: '#a0c4c8',
          400: '#5a8a8e', 500: '#3d6a6e', 600: '#1a4a4e', 700: '#0f3a3d',
          800: '#0f2e30', 900: '#0a1628', 950: '#050e14',
        },
        teal: {
          50: '#e6f7f8', 100: '#b3e9ed', 200: '#80dbdf',
          300: '#4dc9d1', 400: '#00a8b5', 500: '#0098A4',
          600: '#007A83', 700: '#005c63', 800: '#003d42',
          900: '#001f22',
        },
      },
      fontFamily: {
        alexandria: ['Alexandria', 'sans-serif'],
        sans: ['Alexandria', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.15)',
        'card-hover': '0 8px 24px rgba(0,152,164,0.15)',
        'teal': '0 4px 14px rgba(0,152,164,0.3)',
        'cyan': '0 4px 14px rgba(78,231,243,0.3)',
        'glow': '0 0 20px rgba(0,152,164,0.1)',
      },
      borderRadius: {
        'card': '14px',
        'btn': '10px',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          'from': { opacity: '0', transform: 'translateX(-30px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          'from': { opacity: '0', transform: 'translateX(30px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          'from': { opacity: '0', transform: 'scale(0.95)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        softPress: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.97)' },
          '100%': { transform: 'scale(1)' },
        },
        ripple: {
          '0%': { boxShadow: '0 0 0 0 rgba(0,152,164,0.3)' },
          '100%': { boxShadow: '0 0 0 12px rgba(0,152,164,0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
        'fade-in-up': 'fadeInUp 0.5s ease forwards',
        'slide-in-left': 'slideInLeft 0.5s ease forwards',
        'slide-in-right': 'slideInRight 0.5s ease forwards',
        'scale-in': 'scaleIn 0.4s ease forwards',
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'soft-press': 'softPress 0.3s ease',
        'ripple': 'ripple 0.6s ease-out',
      },
    },
  },
  plugins: [],
};
