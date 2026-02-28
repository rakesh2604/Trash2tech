import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* Trust-first palette: deep blue primary, muted green success */
        brand: {
          DEFAULT: '#1e3a5f',
          light: '#2c5282',
          dark: '#0f2744',
        },
        trust: {
          blue: '#1e3a5f',
          'blue-light': '#2c5282',
          'blue-dark': '#0f2744',
          green: '#276749',
          'green-light': '#2f855a',
          'green-muted': '#22543d',
        },
        /* Status semantics for pickup/lot states */
        status: {
          requested: '#3182ce',
          assigned: '#805ad5',
          collected: '#d69e2e',
          'hub-logged': '#dd6b20',
          dispatched: '#2b6cb0',
          verified: '#276749',
          completed: '#22543d',
          cancelled: '#742a2a',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      maxWidth: {
        content: 'var(--content-max-w, 1280px)',
      },
      minHeight: {
        touch: 'var(--touch-min-h, 44px)',
      },
    },
  },
  plugins: [],
};

export default config;
