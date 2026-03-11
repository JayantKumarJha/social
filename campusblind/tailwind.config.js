/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        dm: ['var(--font-dm)', 'sans-serif'],
      },
      colors: {
        bg: '#060810',
        bg2: '#0c0f1a',
        bg3: '#111527',
        blue: {
          DEFAULT: '#2563ff',
          dim: '#1a3fa0',
          glow: '#3b7bff',
        },
        avatar: {
          DEFAULT: '#7c3aed',
          glow: '#a855f7',
        },
        cyan: '#00d4ff',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease both',
        'pulse-dot': 'pulseDot 2s ease infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
