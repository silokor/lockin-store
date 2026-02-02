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

const LinksSection = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  margin-bottom: 80px;
`;

const LinkGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 48px;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const Link = styled(motion.a)`
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.15em;
  opacity: 0.4;
  transition: opacity 0.3s ease;
  text-decoration: none;
  color: var(--white);

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

        <LinksSection
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <LinkGroup>
            <Link href="https://instagram.com/thezonebio" target="_blank" rel="noopener noreferrer">
              @thezonebio
            </Link>
            <Link href="https://instagram.com/thezonebio.kr" target="_blank" rel="noopener noreferrer">
              @thezonebio.kr
            </Link>
          </LinkGroup>
          <LinkGroup>
            <Link href="https://smartstore.naver.com/thezonebio" target="_blank" rel="noopener noreferrer">
              Naver Smartstore
            </Link>
            <Link href="mailto:contact@thezonebio.com">
              contact@thezonebio.com
            </Link>
          </LinkGroup>
        </LinksSection>

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
