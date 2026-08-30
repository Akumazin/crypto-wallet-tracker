/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#090A0F',
          900: '#0D0F17',
          850: '#121622',
          800: '#171B2A',
          700: '#22283E',
          600: '#323B5A',
        },
        brand: {
          cyan: '#00F2FE',
          blue: '#4FACFE',
          purple: '#836EF9',
          green: '#2EE59D',
          amber: '#F59E0B',
          pink: '#EC4899',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 242, 254, 0.2), 0 0 10px rgba(0, 242, 254, 0.2)' },
          '100%': { boxShadow: '0 0 15px rgba(0, 242, 254, 0.6), 0 0 25px rgba(0, 242, 254, 0.4)' },
        }
      }
    },
  },
  plugins: [],
}
