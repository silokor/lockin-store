import styled from '@emotion/styled';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const Section = styled.footer`
  padding: 160px 24px 80px;
  background: var(--black);
  color: var(--white);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const Logo = styled(motion.h2)`
  font-family: 'EB Garamond', serif;
  font-size: clamp(48px, 10vw, 120px);
  font-weight: 400;
  font-style: italic;
  margin-bottom: 24px;
`;

const Tagline = styled(motion.p)`
  font-family: 'EB Garamond', serif;
  font-size: 18px;
  font-style: italic;
  opacity: 0.4;
  margin-bottom: 80px;
`;

const Links = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 48px;
  margin-bottom: 80px;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 24px;
  }
`;

const Link = styled(motion.a)`
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.4;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

const Divider = styled(motion.div)`
  width: 60px;
  height: 1px;
  background: rgba(255,255,255,0.2);
  margin: 0 auto 40px;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const Copyright = styled.span`
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.1em;
  opacity: 0.3;
`;

export const Footer = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <Section ref={ref}>
      <Container>
        <Logo
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          Lock In
        </Logo>

        <Tagline
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.4 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
        >
          The focus you deserve.
        </Tagline>

        <Links
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="#">Story</Link>
          <Link href="#">Science</Link>
          <Link href="#">Shop</Link>
          <Link href="#">Contact</Link>
        </Links>

        <Divider
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
        />

        <Bottom>
          <Copyright>© 2026 THE ZONE BIO</Copyright>
          <Copyright>SEOUL, KOREA</Copyright>
        </Bottom>
      </Container>
    </Section>
  );
};
