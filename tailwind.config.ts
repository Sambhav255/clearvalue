import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          bg: '#FAF7F4',
          card: '#FFFFFF',
          cardBorder: '#E8E2DA',
          navy: '#1A1A2E',
          orange: '#C84B0C',
          orangeHover: '#B04008',
          orangeLight: '#F5E6DE',
          text: '#1C1C1C',
          textSecondary: '#6B6560',
          textMuted: '#9C948E',
          border: '#E8E2DA',
          inputBg: '#F5F1EC',
        },
        chart: {
          legacy: '#9C948E',
          everpure: '#C84B0C',
        },
      },
      accentColor: {
        brand: '#C84B0C',
      },
    },
  },
  plugins: [],
} satisfies Config
