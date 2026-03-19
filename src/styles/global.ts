import { css } from '@emotion/react';

// NOTE: Font imports are kept here via @import for compatibility.
// For improved performance, consider moving them to <link> tags in index.html.

export const globalStyles = css`
  @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Space+Mono:wght@400;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    --black: #0d0d0d;
    --white: #f5f5f5;
    --cream: #f5f5dc;
    --warm: #faf8f5;
    --accent: #ED6427;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Space Mono', monospace;
    background: var(--warm);
    color: var(--black);
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    -webkit-tap-highlight-color: transparent;
  }

  ::selection {
    background: #ED6427;
    color: white;
  }

  ::-webkit-scrollbar {
    width: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;
