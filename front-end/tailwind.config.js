/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1E2B1F',
        paper: '#F5F6EF',
        leaf: {
          DEFAULT: '#2F5233',
          50: '#EAF1EC',
          100: '#D4E3D7',
          200: '#A8C7AD',
          300: '#7DAB85',
          400: '#528F5D',
          500: '#2F5233',
          600: '#264225',
          700: '#1D331B',
          800: '#142312',
        },
        marigold: {
          DEFAULT: '#E3A008',
          50: '#FDF6E3',
          100: '#FAEABD',
          200: '#F5D67E',
          300: '#F0C240',
          400: '#E3A008',
          500: '#C28705',
          600: '#9A6A04',
          700: '#725003',
        },
        dusk: {
          DEFAULT: '#2C3E66',
          50: '#E8ECF4',
          100: '#C7D1E2',
          200: '#8FA3C5',
          300: '#5C75A8',
          400: '#3D5689',
          500: '#2C3E66',
          600: '#233052',
          700: '#1A243D',
        },
        sky: {
          DEFAULT: '#3E7CB1',
          50: '#E8F2FA',
          100: '#C2DDF0',
          200: '#8FC4E0',
          300: '#5AABD0',
          400: '#3E7CB1',
          500: '#326893',
          600: '#275275',
        },
        rust: {
          DEFAULT: '#B5482F',
          50: '#F8E8E3',
          100: '#EFD0C5',
          200: '#DFA291',
          300: '#CE745D',
          400: '#B5482F',
          500: '#933B27',
          600: '#722E1F',
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Work Sans"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '1180px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'ring-fill': 'ringFill 0.8s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        ringFill: {
          '0%': { strokeDashoffset: 'var(--circumference)' },
          '100%': { strokeDashoffset: 'var(--offset)' },
        },
      },
    },
  },
  plugins: [],
};
