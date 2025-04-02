import forms from '@tailwindcss/forms';
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // 👈 enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#22ff88',        // neon green
        background: '#0f172a',     // dark navy
        surface: '#1e293b',        // card background
        border: '#334155',         // subtle border
        muted: '#64748b',          // muted text
      },
      animation: {
        fadeIn: 'fadeIn 0.8s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [
    [forms], // optional but nice for form styling
  ],
};