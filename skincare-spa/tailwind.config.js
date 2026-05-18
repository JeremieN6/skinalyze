/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0eeff',
          100: '#e0ddff',
          200: '#c4bbff',
          300: '#a899ff',
          400: '#8c77ff',
          500: '#6C63FF',
          600: '#5a4fdb',
          700: '#483db7',
          800: '#372d93',
          900: '#271f6f',
        },
        skinbeige: {
          50: '#fdf8f0',
          100: '#faf0e0',
          200: '#f5e1c1',
          300: '#efd2a2',
          400: '#e9c383',
          500: '#e3b464',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
