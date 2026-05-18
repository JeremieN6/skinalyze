/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF8F4',
        sage: '#8B9E6E',
        'sage-dark': '#6B7C54',
        gold: '#C4975A',
        'gold-light': '#E8A87C',
        dark: '#1C2420',
        'dark-text': '#3D4A3A',
        muted: '#7A8876',
        'sage-light': '#EBF0E4',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
