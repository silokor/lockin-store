import styled from '@emotion/styled';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

/* ─── Depth layers ─── */

const Section = styled.section`
  min-height: 300vh;
  position: relative;
  overflow: hidden;
`;

const Sticky = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

/* Scroll-triggered radial gradient overlay: black → dark blue */
const GradientOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: var(--black);
  z-index: 0;
`;

const GradientShift = styled(motion.div)`
  position: absolute;
  inset: -50%;
  border-radius: 50%;
  background: radial-gradient(circle, #0a0a1a 0%, transparent 70%);
  z-index: 1;
`;

/* ─── Background layer (slowest parallax) ─── */

const BackgroundLayer = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  pointer-events: none;
`;

const BgText = styled(motion.div)`
  font-family: 'EB Garamond', serif;
  font-size: clamp(200px, 40vw, 500px);
  font-weight: 400;
  font-style: italic;
  opacity: 0.04;
  white-space: nowrap;
  user-select: none;
  color: var(--white);
  will-change: transform;
`;

/* ─── Middle layer (medium parallax) ─── */

const MiddleLayer = styled(motion.div)`
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0 10vw;
`;

const Content = styled.div`
  max-width: 900px;
  text-align: center;
`;

const Eyebrow = styled(motion.span)`
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  opacity: 0.4;
  color: var(--white);
  display: block;
  margin-bottom: 48px;
`;

const HeadingLine = styled.div`
  font-family: 'EB Garamond', serif;
  font-size: clamp(36px, 6vw, 72px);
  font-weight: 400;
  line-height: 1.3;
  color: var(--white);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0 0.3em;
  margin-bottom: 48px;
`;

const Word = styled(motion.span)<{ isHighlight?: boolean }>`
  display: inline-block;
  font-style: ${({ isHighlight }) => (isHighlight ? 'italic' : 'normal')};
  color: ${({ isHighlight }) => (isHighlight ? '#ED6427' : 'var(--white)')};
`;

const Description = styled(motion.p)`
  font-family: 'EB Garamond', serif;
  font-size: clamp(16px, 2vw, 20px);
  line-height: 1.8;
  opacity: 0.6;
  color: var(--white);
  max-width: 600px;
  margin: 0 auto 56px;
`;

/* ─── Foreground layer (fastest parallax) ─── */

const ForegroundLayer = styled(motion.div)`
  position: absolute;
  inset: 0;
  z-index: 20;
  pointer-events: none;
`;

const SideText = styled(motion.span)<{ side: 'left' | 'right' }>`
  position: absolute;
  ${({ side }) => side}: 40px;
  top: 50%;
  transform: translateY(-50%);
  writing-mode: vertical-rl;
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  opacity: 0.2;
  color: var(--white);

  @media (max-width: 768px) {
    display: none;
  }
`;

const IngredientsRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
  pointer-events: auto;
`;

/* ─── Glass-morphism ingredient badge ─── */

const IngredientBadge = styled(motion.div)`
  text-align: center;
  padding: 20px 28px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: default;
  will-change: transform;
  transition: border-color 0.3s;

  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const IngredientName = styled.span`
  font-family: 'EB Garamond', serif;
  font-size: 18px;
  font-style: italic;
  display: block;
  margin-bottom: 6px;
  color: var(--white);
`;

const IngredientKr = styled.span`
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.1em;
  opacity: 0.4;
  color: var(--white);
`;

/* ─── Data ─── */

const ingredients = [
  { en: "Lion's Mane", kr: 'Brain Focus' },
  { en: 'Cordyceps', kr: 'Energy Flow' },
  { en: 'Red Ginseng', kr: 'Vitality' },
  { en: 'L-Theanine', kr: 'Calm Focus' },
];

const headingWords = [
  { text: 'Engineered', highlight: false },
  { text: 'for', highlight: false },
  { text: 'those', highlight: false },
  { text: 'who', highlight: false },
  { text: 'refuse', highlight: false },
  { text: 'to', highlight: false },
  { text: 'choose', highlight: false },
  { text: 'between', highlight: false },
  { text: 'ambition', highlight: true },
  { text: 'and', highlight: false },
  { text: 'well-being.', highlight: true },
];

/* ─── Component ─── */

export const Manifesto = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Smooth spring for organic feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001,
  });

  // Parallax: background (slow), middle (medium), foreground (fast)
  const bgY = useTransform(smoothProgress, [0, 1], [40, -40]);
  const midY = useTransform(smoothProgress, [0, 1], [80, -80]);
  const fgY = useTransform(smoothProgress, [0, 1], [120, -120]);

  // 3D rotation for "Focus" background text
  const bgRotateY = useTransform(smoothProgress, [0, 0.25, 0.5, 0.75, 1], [15, -8, 12, -6, 10]);
  const bgScale = useTransform(smoothProgress, [0, 0.5, 1], [0.85, 1.15, 0.9]);

  // Gradient expansion
  const gradientScale = useTransform(smoothProgress, [0, 0.6, 1], [0.3, 1.2, 1.6]);
  const gradientOpacity = useTransform(smoothProgress, [0, 0.3, 1], [0, 0.8, 1]);

  // Word reveal: map each word to its own opacity & Y based on scroll position
  const totalWords = headingWords.length;

  return (
    <Section ref={sectionRef}>
      <Sticky>
        {/* Base background */}
        <GradientOverlay />

        {/* Expanding radial gradient: black → dark blue */}
        <GradientShift style={{ scale: gradientScale, opacity: gradientOpacity }} />

        {/* Background depth layer — slowest */}
        <BackgroundLayer style={{ y: bgY }}>
          <BgText
            style={{
              scale: bgScale,
              rotateY: bgRotateY,
              perspective: 1200,
            }}
          >
            Focus
          </BgText>
        </BackgroundLayer>

        {/* Middle depth layer — medium */}
        <MiddleLayer style={{ y: midY }}>
          <Content>
            <Eyebrow
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 0.4, y: 0 }}
              transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
              viewport={{ once: true }}
            >
              Why Lock In
            </Eyebrow>

            {/* Cinematic word-by-word reveal */}
            <HeadingLine>
              {headingWords.map((word, i) => {
                const start = 0.1 + (i / totalWords) * 0.35;
                const end = start + 0.08;
                return (
                  <WordReveal
                    key={i}
                    text={word.text}
                    highlight={word.highlight}
                    scrollProgress={smoothProgress}
                    rangeStart={start}
                    rangeEnd={end}
                  />
                );
              })}
            </HeadingLine>

            <Description
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 0.6, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
              viewport={{ once: true }}
            >
              The next-gen beverage chosen by Silicon Valley's top 1%.
              <br />
              Precision engineering in every cup.
            </Description>

            {/* Ingredient glass badges */}
            <IngredientsRow>
              {ingredients.map((item, i) => (
                <IngredientBadge
                  key={item.en}
                  initial={{ opacity: 0, y: 40, scale: 0.85 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 120,
                    damping: 14,
                    delay: 0.5 + i * 0.12,
                  }}
                  viewport={{ once: true }}
                  whileHover={{
                    rotateX: -5,
                    rotateY: 8,
                    scale: 1.05,
                    transition: { type: 'spring', stiffness: 300, damping: 20 },
                  }}
                  style={{ perspective: 800 }}
                >
                  <IngredientName>{item.en}</IngredientName>
                  <IngredientKr>{item.kr}</IngredientKr>
                </IngredientBadge>
              ))}
            </IngredientsRow>
          </Content>
        </MiddleLayer>

        {/* Foreground layer — fastest */}
        <ForegroundLayer style={{ y: fgY }}>
          <SideText side="left">Silicon Valley's Choice</SideText>
          <SideText side="right">Since 2026</SideText>
        </ForegroundLayer>
      </Sticky>
    </Section>
  );
};

/* ─── Word Reveal sub-component ─── */

interface WordRevealProps {
  text: string;
  highlight: boolean;
  scrollProgress: ReturnType<typeof useSpring>;
  rangeStart: number;
  rangeEnd: number;
}

const WordReveal = ({ text, highlight, scrollProgress, rangeStart, rangeEnd }: WordRevealProps) => {
  const opacity = useTransform(scrollProgress, [rangeStart, rangeEnd], [0, 1]);
  const y = useTransform(scrollProgress, [rangeStart, rangeEnd], [20, 0]);

  return (
    <Word isHighlight={highlight} style={{ opacity, y }}>
      {text}
    </Word>
  );
};
