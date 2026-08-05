/** @type {import('tailwindcss').Config} */

// NOCTURNE — the single source of truth for the Private VIP Istanbul palette.
// Every value here is verified against WCAG on the ink-900 surface; see
// design-system/MASTER.md for the measured contrast ratios.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    // Systematic breakpoints. `xs` exists so the 375px phone gets first-class
    // treatment rather than inheriting the unprefixed base by accident.
    screens: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
    },
    extend: {
      colors: {
        // Surfaces — warm blacks, never pure #000 (it smears on OLED and
        // reads cheap next to warm photography).
        ink: {
          950: '#0B0A09', // page base
          900: '#0F0E0C', // primary surface
          850: '#14120F', // raised surface
          800: '#1A1815', // card
          700: '#24211C', // card hover / strong border
          600: '#332E27', // divider on raised surface
        },
        // Brass — the single accent. 7.7:1 on ink-900, so it is safe for
        // body-size text, not just large display type.
        brass: {
          300: '#E3D2AE',
          400: '#D4BC8A',
          500: '#C0A062', // primary accent
          600: '#A88746',
          700: '#816738',
        },
        // Foreground ramp, warm to sit with the brass rather than fight it.
        bone: {
          DEFAULT: '#F5F1EA', // 17.1:1 — primary text
          dim: '#C9C2B6', //  10.9:1 — secondary text
          muted: '#8E877C', //  5.4:1 — tertiary text, still AA
        },
        danger: '#F87171', // 6.1:1 on ink-900
        success: '#6EE7A8', // 11.4:1 on ink-900
      },
      fontFamily: {
        // Cormorant carries display sizes only — its thin strokes disappear
        // below ~28px on a dark background.
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        // Fluid display scale. clamp() means no breakpoint jumps and no
        // layout shift as the viewport resizes.
        'display-xl': ['clamp(2.75rem, 1.6rem + 5.6vw, 7rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.25rem, 1.5rem + 3.6vw, 4.5rem)', { lineHeight: '1.02', letterSpacing: '-0.015em' }],
        'display-md': ['clamp(1.75rem, 1.3rem + 2.2vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'display-sm': ['clamp(1.5rem, 1.2rem + 1.4vw, 2.125rem)', { lineHeight: '1.15' }],
        // Uppercase micro-label used for eyebrows, categories and meta rows.
        eyebrow: ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.22em' }],
      },
      spacing: {
        // Spacious rhythm (density dial 3/10): section padding steps.
        section: 'clamp(4.5rem, 3rem + 7vw, 9rem)',
        gutter: 'clamp(1.25rem, 0.5rem + 3vw, 3rem)',
      },
      maxWidth: {
        prose: '68ch', // 60–75 character measure
        shell: '86rem',
      },
      borderRadius: {
        card: '2px', // Luxury print reads square; heavy rounding reads SaaS.
      },
      transitionTimingFunction: {
        // One easing vocabulary for the whole site.
        enter: 'cubic-bezier(0.16, 1, 0.3, 1)', // expo.out
        exit: 'cubic-bezier(0.7, 0, 0.84, 0)', // expo.in
      },
      transitionDuration: {
        micro: '180ms',
        base: '280ms',
        slow: '520ms',
      },
      zIndex: {
        base: '0',
        raised: '10',
        sticky: '20',
        header: '40',
        overlay: '100',
        modal: '110',
        toast: '1000',
      },
      keyframes: {
        'brass-sweep': {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(120%)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translate3d(0, 14px, 0)' },
          to: { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
      },
      animation: {
        'brass-sweep': 'brass-sweep 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-up': 'fade-up 520ms cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
}
