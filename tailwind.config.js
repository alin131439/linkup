/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        accent: {
          pink: '#f093fb',
          blue: '#4facfe',
          green: '#43e97b',
          orange: '#fa709a',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in-down': 'slideInDown 0.4s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'heart-burst': 'heartBurst 0.6s ease-out',
        'gradient': 'gradient 8s linear infinite',
        'bulb-light': 'bulbLight 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'flash-bright': 'flashBright 1.4s ease-in-out',
        'dark-to-light': 'darkToLight 2s ease-in-out',
        'connection-pulse': 'connectionPulse 1.5s ease-out',
        'spawn-in': 'spawnIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.6)' },
        },
        heartBurst: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.3)' },
          '100%': { transform: 'scale(1)' },
        },
        gradient: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        bulbLight: {
          '0%': { transform: 'scale(1)', filter: 'brightness(1)' },
          '25%': { transform: 'scale(1.3)', filter: 'brightness(2.5)' },
          '50%': { transform: 'scale(1.2)', filter: 'brightness(2)' },
          '75%': { transform: 'scale(1.1)', filter: 'brightness(1.6)' },
          '100%': { transform: 'scale(1)', filter: 'brightness(1.2)' },
        },
        flashBright: {
          '0%': { backgroundColor: 'rgba(0,0,0,0)', opacity: '0' },
          '20%': { backgroundColor: 'rgba(255,255,255,0.15)', opacity: '0.6' },
          '50%': { backgroundColor: 'rgba(255,255,255,0.25)', opacity: '0.8' },
          '80%': { backgroundColor: 'rgba(255,255,255,0.1)', opacity: '0.4' },
          '100%': { backgroundColor: 'rgba(0,0,0,0)', opacity: '0' },
        },
        darkToLight: {
          '0%': { backgroundColor: '#0f0f23' },
          '25%': { backgroundColor: '#1a1a35' },
          '50%': { backgroundColor: '#2a2a4a' },
          '75%': { backgroundColor: '#6b6b85' },
          '100%': { backgroundColor: '#fafafa' },
        },
        connectionPulse: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '50%': { transform: 'scale(1.2)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        spawnIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'pink-gradient': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'blue-gradient': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'green-gradient': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'orange-gradient': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'purple-gradient': 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
      },
    },
  },
  plugins: [],
};
