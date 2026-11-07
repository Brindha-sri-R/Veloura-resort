/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#061713',
          900: '#0B2620',
          800: '#123D35', // Brand Forest Green
          700: '#1B4F45',
          600: '#266A5D',
          500: '#348677',
          100: '#E2ECE8',
          50: '#F0F6F3',
        },
        sage: {
          DEFAULT: '#D8E8DC', // Brand Sage Green
          50: '#F7FAF8',
          100: '#EDF5EF',
          200: '#D8E8DC',
          300: '#BFDAC6',
          400: '#9EBFAB',
          600: '#527561',
          800: '#2A4033',
        },
        sand: {
          DEFAULT: '#F5F0E6', // Brand Warm Sand
          50: '#FDFBF7',
          100: '#FAF6EE',
          200: '#F5F0E6',
          300: '#EDE2D0',
          400: '#DFCDB5',
          500: '#C7B193',
        },
        gold: {
          DEFAULT: '#C5A77A', // Brand Muted Gold
          50: '#FBF8F3',
          100: '#F5EFE4',
          200: '#EBDEC7',
          300: '#DCC39E',
          400: '#C5A77A',
          500: '#B08E5D',
          600: '#947448',
          700: '#735733',
        },
        ivory: {
          DEFAULT: '#F8F6F0', // Brand Editorial Ivory
          50: '#FCFBF8',
          100: '#F8F6F0',
          200: '#F2EDE2',
          300: '#E8E0D0',
          400: '#DDD2BD',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        widest: '.2em',
        luxury: '.28em',
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(18, 61, 53, 0.08)',
        'luxury-hover': '0 25px 50px -12px rgba(18, 61, 53, 0.16)',
        'card': '0 10px 30px -5px rgba(18, 61, 53, 0.05)',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}

