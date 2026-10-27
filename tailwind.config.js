export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: { bg: '#0a0a0a', card: '#18181b', line: '#27272a', gold: '#FFD700', flame: '#FF4500' },
    fontFamily: { sora: ['Sora', 'sans-serif'], sans: ['Inter', 'sans-serif'] },
    boxShadow: { glow: '0 0 28px -4px rgba(255,215,0,.35)' } } },
  plugins: [] }
