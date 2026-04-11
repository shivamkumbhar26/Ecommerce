/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#fef7f0',
          100: '#fdecd9',
          200: '#fbd4b0',
          300: '#f8b57d',
          400: '#f48c45',
          500: '#f06c20',
          600: '#e15316',
          700: '#ba3f14',
          800: '#943318',
          900: '#772c17',
        },
        ink: {
          50:  '#f6f6f7',
          100: '#e2e2e5',
          200: '#c5c5cc',
          300: '#9d9daa',
          400: '#767687',
          500: '#5b5b6f',
          600: '#4a4a5d',
          700: '#3d3d4e',
          800: '#29293a',
          900: '#18181f',
          950: '#0e0e14',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'spin-slow': 'spin 2s linear infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideDown: { from: { opacity: 0, transform: 'translateY(-10px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: 0, transform: 'scale(0.95)' }, to: { opacity: 1, transform: 'scale(1)' } },
        pulseSoft: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.6 } },
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.06)',
        'card-hover': '0 4px 12px rgba(0,0,0,.10), 0 12px 32px rgba(0,0,0,.10)',
        'modal': '0 24px 64px rgba(0,0,0,.24)',
      }
    },
  },
  plugins: [],
}