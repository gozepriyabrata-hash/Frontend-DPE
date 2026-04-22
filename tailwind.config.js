// Trigger rebuild
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        neo: ['"Space Mono"', 'monospace'],
        display: ['"Syne"', 'sans-serif'],
      },
      colors: {
        neo: {
          bg: '#FFFDF0', // Cream off-white
          yellow: '#FFD000',
          cyan: '#00F0FF',
          pink: '#FF0073',
          green: '#00E676',
          purple: '#B5179E',
          orange: '#FF5E00',
          black: '#121212',
          gray: '#E0E0E0',
        }
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0px 0px rgba(18,18,18,1)',
        'brutal': '4px 4px 0px 0px rgba(18,18,18,1)',
        'brutal-lg': '8px 8px 0px 0px rgba(18,18,18,1)',
        'brutal-xl': '12px 12px 0px 0px rgba(18,18,18,1)',
        'brutal-hover': '2px 2px 0px 0px rgba(18,18,18,1)', // Used when pushing down
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'marquee-fast': 'marquee 10s linear infinite',
        'wiggle': 'wiggle 0.3s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
};
