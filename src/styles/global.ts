import { css } from '@emotion/react';

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
  }

  html {
    font-size: 16px;
  }

  body {
    font-family: 'Space Mono', monospace;
    background: var(--warm);
    color: var(--black);
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  ::selection {
    background: var(--black);
    color: var(--white);
  }

  ::-webkit-scrollbar {
    width: 0;
  }
`;
