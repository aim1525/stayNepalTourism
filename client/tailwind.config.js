/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyberCrimson: '#FF0055',
        cyberAmber: '#FFB700',
        cyberCyan: '#00F0FF',
        cyberPurple: '#7000FF',
        darkSlate: '#0B0F17',
        cardDark: '#131A29',
      },
      fontFamily: {
        sans: ['Inter', 'Mukta', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', filter: 'drop-shadow(0 0 15px rgba(255, 0, 85, 0.6))' },
          '50%': { opacity: '0.9', filter: 'drop-shadow(0 0 25px rgba(0, 240, 255, 0.8))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
