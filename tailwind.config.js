/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'white_smoke': { DEFAULT: '#f5f5f5', 100: '#313131', 200: '#626262', 300: '#939393', 400: '#c4c4c4', 500: '#f5f5f5', 600: '#f7f7f7', 700: '#f9f9f9', 800: '#fbfbfb', 900: '#fdfdfd' },
        'rusty_red': { DEFAULT: '#d64550', 100: '#2e0a0d', 200: '#5c141a', 300: '#8a1e27', 400: '#b82834', 500: '#d64550', 600: '#de6872', 700: '#e68e95', 800: '#eeb4b9', 900: '#f7d9dc' },
        'onyx': { DEFAULT: '#3c3c3c', 100: '#0c0c0c', 200: '#181818', 300: '#252525', 400: '#313131', 500: '#3c3c3c', 600: '#646464', 700: '#8b8b8b', 800: '#b1b1b1', 900: '#d8d8d8' },
        'glaucous': { DEFAULT: '#677db7', 100: '#121827', 200: '#25304e', 300: '#374775', 400: '#495f9b', 500: '#677db7', 600: '#8596c6', 700: '#a3b0d4', 800: '#c2cbe2', 900: '#e0e5f1' }
      }
    },
  },
  plugins: [require('tailwindcss-primeui')],
}

