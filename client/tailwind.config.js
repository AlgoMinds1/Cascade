/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emergency: '#DC2626',
        intel: '#2563EB',
        warning: '#F59E0B',
        amber: '#F59E0B',
        surface: '#FFFFFF',
        bg: '#FAFBFC',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 20px rgba(37, 99, 235, 0.15)',
        'glow-red': '0 0 20px rgba(220, 38, 38, 0.3)',
      },
      keyframes: {
        slideDown: {
          '0%': { transform: 'translateY(-110%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-110%)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        flashIn: {
          '0%': { backgroundColor: 'rgba(37,99,235,0.18)' },
          '100%': { backgroundColor: 'transparent' },
        },
        pulseRing: {
          '0%': { boxShadow: '0 0 0 0 rgba(220,38,38,0.5)' },
          '70%': { boxShadow: '0 0 0 8px rgba(220,38,38,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(220,38,38,0)' },
        },
        bounceShort: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.65' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-4px)' },
          '40%': { transform: 'translateX(4px)' },
          '60%': { transform: 'translateX(-3px)' },
          '80%': { transform: 'translateX(3px)' },
        },
      },
      animation: {
        'slide-down': 'slideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.3s ease-in forwards',
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'flash-in': 'flashIn 1.2s ease-out forwards',
        'pulse-ring': 'pulseRing 1.4s ease-out infinite',
        'bounce-short': 'bounceShort 0.6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
        'shake': 'shake 0.4s ease-in-out',
      },
    },
  },
  plugins: [],
}
