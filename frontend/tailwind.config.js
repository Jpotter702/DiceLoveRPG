/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: {
          DEFAULT: '#e5e7eb',
          dark: '#374151'
        },
        background: {
          DEFAULT: '#ffffff',
          dark: '#111827'
        },
        foreground: {
          DEFAULT: '#111827',
          dark: '#f9fafb'
        },
        primary: {
          DEFAULT: '#1f2937',
          foreground: '#f9fafb',
          dark: '#3b82f6',
          'dark-foreground': '#f9fafb'
        },
        secondary: {
          DEFAULT: '#f3f4f6',
          foreground: '#1f2937',
          dark: '#374151',
          'dark-foreground': '#f9fafb'
        },
        muted: {
          DEFAULT: '#f3f4f6',
          foreground: '#6b7280',
          dark: '#374151',
          'dark-foreground': '#9ca3af'
        },
        accent: {
          DEFAULT: '#f3f4f6',
          foreground: '#1f2937',
          dark: '#3b82f6',
          'dark-foreground': '#f9fafb'
        },
      },
      borderRadius: {
        'lg': 'var(--radius-lg)',
        'md': 'var(--radius-md)',
        'sm': 'var(--radius-sm)',
      },
      boxShadow: {
        'soft': 'var(--shadow-soft)',
        'medium': 'var(--shadow-medium)',
        'strong': 'var(--shadow-strong)',
      },
      spacing: {
        'xs': 'var(--space-xs)',    // 0.25rem
        'sm': 'var(--space-sm)',    // 0.5rem
        'md': 'var(--space-md)',    // 1rem
        'lg': 'var(--space-lg)',    // 1.5rem
        'xl': 'var(--space-xl)',    // 2rem
        '2xl': 'var(--space-2xl)',  // 3rem
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
} 