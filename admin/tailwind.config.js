/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './node_modules/react-tailwindcss-datepicker/dist/index.esm.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans']
      },
      gridTemplateColumns: {
        '1/5': '1fr 5fr'
      },
      colors: {
        ...defaultTheme.colors,
        calCo1: '#845EC2',
        calCo2: '#D65DB1',
        calCo3: '#FF6F91',
        calCo4: '#FF9671',
        calCo5: '#FFC75F',
        calCo6: '#F9F871',
        calCo7: '#008F7A',
        calCo8: '#008E9B',
        calCo9: '#0081CF',
        calCo10: '#C4FCEF',
        calCo11: '#FBEAFF',
        calCo12: '#F3C5FF',
        calCo13: '#FEFEDF'
      }
    }
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui'), require('@tailwindcss/forms')],
  daisyui: {
    themes: ['light', 'dark']
  },
  darkMode: ['class', '[data-theme="dark"]'],
  variants: {
    extend: {}
  }
};
