/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        hatch: {
          navy: '#1B2B4B',
          teal: '#2DD4BF',
          sand: '#F5F0E8',
          slate: '#64748B',
          dark: '#0F1B2D',
        }
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      }
    }
  },
  plugins: [require('@tailwindcss/typography')],
}
