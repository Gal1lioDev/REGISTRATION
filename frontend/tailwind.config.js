/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Oxanium"', '"Rajdhani"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      colors: {
        cyber: {
          bg: '#080b0e',
          panel: '#0d1217',
          card: '#121820',
          border: '#1f2937',
          borderDim: '#16202c',
          green: '#00ff66',
          greenDark: '#059669',
          amber: '#f59e0b',
          red: '#ef4444',
          text: '#e2e8f0',
          muted: '#8492a6',
        }
      },
      animation: {
        'blink': 'blink 1s step-start infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
