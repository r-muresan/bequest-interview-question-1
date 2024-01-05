/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1C2C43',
        secondary: '#B0CDEF',
      },
    },
  },
  plugins: [],
}
