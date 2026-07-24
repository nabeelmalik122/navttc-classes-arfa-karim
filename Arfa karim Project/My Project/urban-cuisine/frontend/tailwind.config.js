/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: '#1A1A1A',
        gold: '#C9A227',
        'gold-light': '#D9B747',
        'gold-dark': '#A8841F',
        offwhite: '#F8F5F0',
        'offwhite-dark': '#EDE9E3',
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Poppins"', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to bottom, rgba(26,26,26,0.65) 0%, rgba(26,26,26,0.85) 100%)',
      },
    },
  },
  plugins: [],
}
