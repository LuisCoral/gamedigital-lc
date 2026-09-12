/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#050505',
          secondary: '#0D0D0D',
        },
        surface: '#151515',
        text: {
          primary: '#FFFFFF',
          secondary: '#A1A1AA',
        },
        neon: {
          cyan: '#00F5FF',
          magenta: '#FF00D4',
          green: '#39FF88',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Rajdhani', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
