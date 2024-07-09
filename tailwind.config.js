/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FFF9DB',
          100: '#FFF3B3',
          200: '#FFE680',
          300: '#FFD94D',
          400: '#FFD226',
          500: '#FFD700',
          600: '#CCAC00',
          700: '#997300',
          800: '#664900',
          900: '#332400',
        },
      },
    },
  },
  plugins: [],
}