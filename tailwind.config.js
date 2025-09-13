/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: [
      './pages/**/*.{ts,tsx}',
      './components/**/*.{ts,tsx}',
      './app/**/*.{ts,tsx}',
      './src/**/*.{ts,tsx}',
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['"Inter"', 'sans-serif'],
          display: ['"Exo 2"', 'sans-serif'],
        },
        colors: {
          background: 'hsl(var(--background))',
          foreground: 'hsl(var(--foreground))',
          card: 'hsl(var(--card))',
          'card-foreground': 'hsl(var(--card-foreground))',
          popover: 'hsl(var(--popover))',
          'popover-foreground': 'hsl(var(--popover-foreground))',
          primary: {
            DEFAULT: 'hsl(var(--primary))',
            foreground: 'hsl(var(--primary-foreground))',
          },
          secondary: {
            DEFAULT: 'hsl(var(--secondary))',
            foreground: 'hsl(var(--secondary-foreground))',
          },
          muted: {
            DEFAULT: 'hsl(var(--muted))',
            foreground: 'hsl(var(--muted-foreground))',
          },
          accent: {
            DEFAULT: 'hsl(var(--accent))',
            foreground: 'hsl(var(--accent-foreground))',
          },
          destructive: {
            DEFAULT: 'hsl(var(--destructive))',
            foreground: 'hsl(var(--destructive-foreground))',
          },
          border: 'hsl(var(--border))',
          input: 'hsl(var(--input))',
          ring: 'hsl(var(--ring))',
          xp: 'hsl(var(--xp))',
          coin: 'hsl(var(--coin))',
          'brand-purple': 'hsl(var(--brand-purple))',
          'brand-cyan': 'hsl(var(--brand-cyan))',
        },
        borderRadius: {
          lg: `var(--radius)`,
          md: `calc(var(--radius) - 4px)`,
          sm: `calc(var(--radius) - 8px)`,
        },
        keyframes: {
          'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
          'fade-in-up': { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
          'pulse-glow': {
            '0%, 100%': { boxShadow: '0 0 15px hsl(var(--primary)), 0 0 5px hsl(var(--primary))' },
            '50%': { boxShadow: '0 0 30px hsl(var(--primary)), 0 0 10px hsl(var(--primary))' },
          },
          'background-pan': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
          'border-spin': {
            '100%': { transform: 'rotate(360deg)' },
          },
        },
        animation: {
          'fade-in': 'fade-in 0.5s ease-out forwards',
          'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
          'pulse-glow': 'pulse-glow 2s infinite ease-in-out',
          'background-pan': 'background-pan 15s linear infinite',
          'border-spin': 'border-spin 7s linear infinite',
        },
      },
    },
    plugins: [require('tailwindcss-animate')],
  };
