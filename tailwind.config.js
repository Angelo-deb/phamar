/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'DM Sans', 'sans-serif'],
        display: ['var(--font-syne)', 'Syne', 'sans-serif'],
      },
      colors: {
        emerald: {
          950: '#022c22',
        },
      },
      backgroundImage: {
        'pharmacy-hero': "linear-gradient(135deg, rgba(2,44,34,0.92) 0%, rgba(6,78,59,0.88) 50%, rgba(4,47,46,0.92) 100%), url('https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1600&q=80')",
        'pharmacy-pills': "url('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1600&q=80')",
        'pharmacy-shelf': "url('https://images.unsplash.com/photo-1576602976047-174e57a47881?w=1600&q=80')",
        'pharmacy-lab':   "url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1600&q=80')",
      },
      animation: {
        'fade-in':   'fadeIn .35s ease both',
        'slide-up':  'slideUp .3s ease both',
        'slide-in':  'slideIn .25s ease both',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:   { from:{opacity:0},            to:{opacity:1} },
        slideUp:  { from:{opacity:0,transform:'translateY(12px)'}, to:{opacity:1,transform:'none'} },
        slideIn:  { from:{opacity:0,transform:'translateX(16px)'}, to:{opacity:1,transform:'none'} },
        pulseDot: { '0%,100%':{opacity:1},       '50%':{opacity:.4} },
      },
    },
  },
  plugins: [],
}
