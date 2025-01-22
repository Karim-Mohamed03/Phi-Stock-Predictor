
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html"
    ],
    theme: {
      extend: {
        colors: {
          black: '#000000',
          gray: {
            900: '#111827',
            800: '#1F2937',
            700: '#374151',
            600: '#4B5563',
            500: '#6B7280',
          },
          purple: {
            500: '#A855F7',
            600: '#9333EA',
            700: '#7E22CE',
          },
        },
        fontFamily: {
          sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        },
        fontSize: {
          'xs': '0.75rem',
          'sm': '0.875rem',
          'base': '1rem',
          'lg': '1.125rem',
          'xl': '1.25rem',
          '2xl': '1.5rem',
          '6xl': '4rem',
        },
        spacing: {
          '2': '0.5rem',
          '4': '1rem',
          '6': '1.5rem',
          '8': '2rem',
          '12': '3rem',
        },
        borderRadius: {
          'lg': '0.5rem',
          'xl': '1rem',
        },
        animation: {
          'wave': 'wave 3s ease-in-out infinite',
          'wave-slow': 'wave 4s ease-in-out infinite',
          'wave-slower': 'wave 5s ease-in-out infinite',
        },
        keyframes: {
          wave: {
            '0%': { transform: 'translateX(0)' },
            '50%': { transform: 'translateX(-25%)' },
            '100%': { transform: 'translateX(0)' },
          },
        },
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/typography'),
    ],
    darkMode: 'class',
  }