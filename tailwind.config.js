/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#e9edff',
          200: '#cfd7ff',
          300: '#aab8ff',
          400: '#7d8eff',
          500: '#5566ff',
          600: '#3a47e6',
          700: '#2e38b4',
          800: '#252e8c',
          900: '#20276f',
        },
        success: '#16a34a',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      spacing: {
        '1': '4px',
        '1.5': '6px',
        '2': '8px',
        '2.5': '10px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
      },
    },
  },
  plugins: [],
};


