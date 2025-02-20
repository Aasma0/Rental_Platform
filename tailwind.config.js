/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brown: {
          100: '#f3e7d9',
          200: '#e5cdb5',
          300: '#d7b491',
          400: '#c89a6e',
          500: '#ba804a',
          600: '#9e643c',
          700: '#81502e',
          800: '#653c20',
          900: '#492813',
        },
      },
    },
  },
  plugins: [],
}

