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
        /* Landing eco-tech palette */
        eco: {
          DEFAULT: '#22C55E',
          glow: 'rgba(34,197,94,0.4)',
        },
        electric: {
          DEFAULT: '#3B82F6',
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
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      maxWidth: {
        content: 'var(--content-max-w, 1280px)',
      },
      minHeight: {
        touch: 'var(--touch-min-h, 44px)',
      },
      backgroundImage: {
        'eco-gradient': 'linear-gradient(180deg, #0B1220 0%, #0F1A2B 50%, #071018 100%)',
      },
      boxShadow: {
        'eco-glow-subtle': '0 0 25px rgba(34,197,94,0.25)',
        'eco-glow': '0 0 40px rgba(34,197,94,0.25)',
        'eco-glow-strong': '0 0 60px rgba(34,197,94,0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
