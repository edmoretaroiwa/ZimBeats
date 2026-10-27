export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: { bg: '#0a0a0a', card: '#18181b', line: '#27272a', gold: '#FFD700', flame: '#FF4500' },
    fontFamily: { sora: ['Sora', 'sans-serif'], sans: ['Inter', 'sans-serif'] },
    boxShadow: { glow: '0 0 28px -4px rgba(255,215,0,.35)' } } },
  plugins: [({ addUtilities }) => addUtilities({
    '.transform-style-3d': { 'transform-style': 'preserve-3d' }, '.transform-flat': { 'transform-style': 'flat' },
    '.backface-hidden': { 'backface-visibility': 'hidden' }, '.perspective-600': { perspective: '600px' },
    '.perspective-1000': { perspective: '1000px' }, '.perspective-1400': { perspective: '1400px' } })] }
