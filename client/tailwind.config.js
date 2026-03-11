/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fffdf2',
          100: '#fff8d1',
          200: '#ffefa3',
          300: '#ffe470',
          400: '#ffdc3d',
          500: '#FFD814',
          600: '#e6c212',
          700: '#b3970e',
          800: '#806c0a',
          900: '#4d4106',
          950: '#332b04',
        },
        accent: {
          50: '#e6f1f3',
          100: '#c2dce0',
          200: '#99c6cc',
          300: '#70b0b8',
          400: '#479aa4',
          500: '#007185',
          600: '#006678',
          700: '#004f5d',
          800: '#003842',
          900: '#002228',
          950: '#001317',
        },
        surface: {
          50: '#f1f3f5',
          100: '#e2e7ec',
          200: '#cbd5e0',
          300: '#a3b4c6',
          400: '#7b92ac',
          500: '#5c7291',
          600: '#4b5e7a',
          700: '#3d4d66',
          800: '#313f54',
          850: '#2a3749',
          900: '#232F3E',
          950: '#131921',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(255, 216, 20, 0.15), transparent)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.2)',
        'glow': '0 0 20px rgba(255, 216, 20, 0.3)',
        'glow-lg': '0 0 40px rgba(255, 216, 20, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
