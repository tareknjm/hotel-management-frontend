export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy:  { DEFAULT: '#0F172A', 800: '#1E293B', 700: '#334155', 600: '#475569' },
        gold:  { DEFAULT: '#F59E0B', light: '#FCD34D', dark: '#D97706' },
        cream: '#FFFBEB',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans:    ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}