import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0F172A',
          800: '#1A2744',
          700: '#1E293B',
        },
        orange: {
          500: '#F97316',
          400: '#FB923C',
        },
        slate: {
          100: '#F1F5F9',
          400: '#94A3B8',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
