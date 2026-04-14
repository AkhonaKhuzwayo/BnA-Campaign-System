/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bna-black': '#0A0A0A',
        'bna-dark': '#1E1E1E',
        'bna-border': '#2A2A2A',
        'bna-light': '#F0F0F0',
        'bna-secondary': '#B0B0B0',
        'bna-btn': '#333333',
        'bna-btn-hover': '#555555',
        'bna-teal': '#00A8A8',
      }
    }
  },
  plugins: []
}

