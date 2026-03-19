import { forwardRef, useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import type { Product } from '../data/products';

/* ═══════════════════════════════════════════
   Full-viewport cinematic product section
   ═══════════════════════════════════════════ */

const Section = styled.section<{ accentColor: string }>`
  min-height: 200vh;
  position: relative;
  overflow: hidden;
`;

const StickyFrame = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

/* Color-tinted backdrop that crossfades between products */
const Backdrop = styled(motion.div)<{ accentColor: string }>`
  position: absolute;
  inset: 0;
  z-index: 0;
`;

const BackdropBase = styled.div<{ isDark: boolean }>`
  position: absolute;
  inset: 0;
  background: ${({ isDark }) => (isDark ? 'var(--black)' : 'var(--warm)')};
`;

const BackdropTint = styled(motion.div)<{ accentColor: string }>`
  position: absolute;
  inset: -20%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    ${({ accentColor }) => accentColor}15 0%,
    transparent 60%
  );
`;

/* ─── Layout ─── */

const LayoutGrid = styled.div`
  position: relative;
  z-index: 5;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 60px;
  display: grid;
  grid-template-columns: 7fr 5fr;
  gap: 80px;
  align-items: center;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 0 32px;
  }
`;

/* ═══════════════════════════════════════════
   3D Product Orb system
   ═══════════════════════════════════════════ */

const VisualContainer = styled(motion.div)<{ isEven: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  order: ${({ isEven }) => (isEven ? 2 : 1)};
  min-height: 500px;

  @media (max-width: 968px) {
    order: 1;
    min-height: 360px;
  }
`;

const OrbSystem = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1200px;
`;

const ConcentricRing = styled(motion.div)<{ color: string; ringSize: number }>`
  position: absolute;
  width: ${({ ringSize }) => ringSize}px;
  height: ${({ ringSize }) => ringSize}px;
  border: 1px solid ${({ color }) => color}25;
  border-radius: 50%;
  will-change: transform;
`;

const OrbCore = styled(motion.div)<{ color: string; coreSize: number }>`
  width: ${({ coreSize }) => coreSize}px;
  height: ${({ coreSize }) => coreSize}px;
  border-radius: 50%;
  background: ${({ color }) => color};
  position: relative;
  will-change: transform, box-shadow;

  /* Glass highlight */
  &::before {
    content: '';
    position: absolute;
    top: 12%;
    left: 18%;
    width: 38%;
    height: 38%;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.45),
      rgba(255, 255, 255, 0.05) 60%,
      transparent
    );
    border-radius: 50%;
    filter: blur(8px);
    will-change: transform;
  }
`;

const FloatingImage = styled(motion.img)<{ imgPadding?: number }>`
  position: absolute;
  width: 420px;
  height: 420px;
  object-fit: contain;
  filter: drop-shadow(0 30px 50px rgba(0, 0, 0, 0.6));
  z-index: 100;
  padding: ${({ imgPadding }) => imgPadding || 0}px;
  will-change: transform;

  @media (max-width: 968px) {
    width: 300px;
    height: 300px;
  }
`;

/* Kit orbs */
const KitOrbsRow = styled(motion.div)`
  display: flex;
  gap: 28px;
  perspective: 1000px;
`;

const MiniOrb = styled(motion.div)<{ color: string }>`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: ${({ color }) => color};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 15%;
    left: 20%;
    width: 30%;
    height: 30%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.35), transparent);
    border-radius: 50%;
    filter: blur(5px);
  }

  @media (max-width: 768px) {
    width: 65px;
    height: 65px;
  }
`;

/* ═══════════════════════════════════════════
   Text content area
   ═══════════════════════════════════════════ */

const TextContent = styled(motion.div)<{ isEven: boolean }>`
  order: ${({ isEven }) => (isEven ? 1 : 2)};
  z-index: 10;

  @media (max-width: 968px) {
    order: 2;
  }
`;

const IndexLabel = styled(motion.span)`
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.3em;
  opacity: 0.3;
  display: block;
  margin-bottom: 16px;
`;

/* Clip-path mask for product name reveal */
const NameMask = styled(motion.div)`
  overflow: hidden;
  margin-bottom: 8px;
`;

const ProductName = styled(motion.h2)`
  font-family: 'EB Garamond', serif;
  font-size: clamp(48px, 8vw, 84px);
  font-weight: 400;
  font-style: italic;
  line-height: 1;
  will-change: transform;
`;

const ProductNameKr = styled(motion.span)`
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.1em;
  opacity: 0.5;
  display: block;
  margin-bottom: 36px;
`;

const Desc = styled(motion.p)`
  font-family: 'EB Garamond', serif;
  font-size: clamp(16px, 2vw, 20px);
  line-height: 1.7;
  opacity: 0.7;
  max-width: 420px;
  margin-bottom: 16px;
`;

const DescKr = styled(motion.p)`
  font-family: 'Space Mono', monospace;
  font-size: 13px;
  line-height: 1.8;
  opacity: 0.5;
  max-width: 420px;
  margin-bottom: 32px;
`;

const NotesLabel = styled.span`
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.4;
  display: block;
  margin-bottom: 12px;
`;

const NotesWrap = styled(motion.div)`
  margin-bottom: 40px;
`;

const NoteChip = styled(motion.span)<{ isDark: boolean }>`
  font-family: 'EB Garamond', serif;
  font-size: 14px;
  font-style: italic;
  padding: 8px 16px;
  border: 1px solid
    ${({ isDark }) => (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)')};
  display: inline-block;
`;

const IncludesWrap = styled(motion.div)`
  margin-bottom: 40px;
`;

const IncludeItem = styled.span`
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.05em;
  opacity: 0.6;

  &:not(:last-child)::after {
    content: ' \u00B7 ';
    opacity: 0.3;
  }
`;

const PriceRow = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const PriceText = styled.span`
  font-family: 'EB Garamond', serif;
  font-size: 32px;
  font-style: italic;
`;

const Badge = styled.span<{ color: string }>`
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.15em;
  padding: 8px 14px;
  background: ${({ color }) => color};
  color: white;
`;

const DetailButton = styled(motion.button)<{
  isDark: boolean;
  accentColor: string;
}>`
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.15em;
  padding: 14px 28px;
  margin-top: 24px;
  background: transparent;
  color: ${({ isDark }) => (isDark ? 'var(--white)' : 'var(--black)')};
  border: 1px solid
    ${({ isDark }) => (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)')};
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: ${({ accentColor }) => accentColor};
    color: white;
    border-color: ${({ accentColor }) => accentColor};
  }
`;

/* ═══════════════════════════════════════════
   Animated price counter
   ═══════════════════════════════════════════ */

const AnimatedPrice = ({ target, inView }: { target: number; inView: boolean }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!inView) {
      setCurrent(0);
      return;
    }
    const duration = 1200;
    const startTime = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [inView, target]);

  return <PriceText>{`\u20A9${current.toLocaleString()}`}</PriceText>;
};

/* ═══════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════ */

const kitColors = ['#A71B1B', '#37385A', '#ED6427'];
const indexLabels = ['01 \u2014 Morning', '02 \u2014 Afternoon', '03 \u2014 Evening', '04 \u2014 Discovery'];
const productImages: Record<string, string> = {
  decaf: '/decaf-product.png',
  house: '/house-product.png',
  vibrant: '/vibrant-product.png',
};

/* ═══════════════════════════════════════════
   Main component
   ═══════════════════════════════════════════ */

interface Props {
  product: Product;
  index: number;
}

export const ProductShowcase = forwardRef<HTMLDivElement, Props>(
  ({ product, index }, ref) => {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const inViewRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(inViewRef, { amount: 0.4 });

    const isDark = index % 2 !== 0 && product.id !== 'house';
    const isEven = index % 2 === 1;
    const isKit = product.isKit;
    const hasImage = product.id in productImages;

    const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: ['start end', 'end start'],
    });

    const smoothScroll = useSpring(scrollYProgress, {
      stiffness: 100,
      damping: 30,
      restDelta: 0.001,
    });

    // Parallax split: visual moves faster than text
    const visualY = useTransform(smoothScroll, [0, 1], [80, -80]);
    const textY = useTransform(smoothScroll, [0, 1], [40, -40]);

    // 3D orb transforms
    const ring1Rotate = useTransform(smoothScroll, [0, 1], [0, 180]);
    const ring2Rotate = useTransform(smoothScroll, [0, 1], [0, -120]);
    const ring3Rotate = useTransform(smoothScroll, [0, 1], [0, 90]);
    const orbShadowBlur = useTransform(smoothScroll, [0, 0.5, 1], [30, 80, 30]);
    const orbShadowSpread = useTransform(smoothScroll, [0, 0.5, 1], [10, 40, 10]);

    // Glass highlight shift
    const highlightX = useTransform(smoothScroll, [0, 1], [-5, 5]);
    const highlightY = useTransform(smoothScroll, [0, 1], [-3, 3]);

    // Image 3D tilt
    const imageTiltX = useTransform(smoothScroll, [0, 0.5, 1], [4, 0, -4]);
    const imageTiltY = useTransform(smoothScroll, [0, 0.5, 1], [-3, 0, 3]);

    // Backdrop tint scale
    const tintScale = useTransform(smoothScroll, [0, 0.5, 1], [0.5, 1.2, 0.5]);
    const tintOpacity = useTransform(smoothScroll, [0.2, 0.5, 0.8], [0, 1, 0]);

    // Orb box-shadow (computed outside JSX to avoid hooks-in-render)
    const orbBoxShadow = useTransform(
      [orbShadowBlur, orbShadowSpread],
      ([blur, spread]: number[]) =>
        `0 40px ${blur}px ${spread}px ${product.color}30`
    );

    return (
      <Section ref={ref} data-product-id={product.id} accentColor={product.color}>
        <div ref={containerRef} style={{ minHeight: '200vh' }}>
          <StickyFrame>
            {/* Section transition: accent color tint */}
            <Backdrop accentColor={product.color}>
              <BackdropBase isDark={isDark} />
              <BackdropTint
                accentColor={product.color}
                style={{ scale: tintScale, opacity: tintOpacity }}
              />
            </Backdrop>

            <LayoutGrid ref={inViewRef}>
              {/* ─── Visual: 3D Orb ─── */}
              <VisualContainer isEven={isEven} style={{ y: visualY }}>
                {isKit ? (
                  <KitOrbsRow style={{ y: visualY }}>
                    {kitColors.map((color, i) => (
                      <MiniOrb
                        key={color}
                        color={color}
                        initial={{ scale: 0, y: 40 }}
                        animate={isInView ? { scale: 1, y: 0 } : {}}
                        transition={{
                          type: 'spring',
                          stiffness: 140,
                          damping: 18,
                          delay: 0.2 + i * 0.12,
                        }}
                        style={{
                          boxShadow: isInView
                            ? `0 25px 50px ${color}35`
                            : `0 10px 20px ${color}15`,
                        }}
                        whileHover={{
                          scale: 1.15,
                          rotateY: 15,
                          transition: { type: 'spring', stiffness: 300, damping: 15 },
                        }}
                      />
                    ))}
                  </KitOrbsRow>
                ) : (
                  <OrbSystem>
                    {/* Concentric rings rotating at different speeds */}
                    <ConcentricRing
                      color={product.color}
                      ringSize={320}
                      style={{ rotateZ: ring1Rotate, rotateX: 12 }}
                    />
                    <ConcentricRing
                      color={product.color}
                      ringSize={380}
                      style={{ rotateZ: ring2Rotate, rotateY: 8, opacity: 0.6 }}
                    />
                    <ConcentricRing
                      color={product.color}
                      ringSize={440}
                      style={{ rotateZ: ring3Rotate, rotateX: -6, opacity: 0.3 }}
                    />

                    <OrbCore
                      color={product.color}
                      coreSize={200}
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ type: 'spring', stiffness: 140, damping: 18 }}
                      style={{
                        boxShadow: orbBoxShadow,
                      }}
                    />

                    {hasImage && (
                      <FloatingImage
                        src={productImages[product.id]}
                        alt={product.name}
                        imgPadding={
                          product.id === 'decaf' || product.id === 'house' ? 20 : 0
                        }
                        initial={{ scale: 0, opacity: 0 }}
                        animate={isInView ? { scale: 1, opacity: 1 } : {}}
                        transition={{
                          type: 'spring',
                          stiffness: 140,
                          damping: 18,
                          delay: 0.15,
                        }}
                        style={{
                          rotateX: imageTiltX,
                          rotateY: imageTiltY,
                        }}
                      />
                    )}
                  </OrbSystem>
                )}
              </VisualContainer>

              {/* ─── Text content ─── */}
              <TextContent isEven={isEven} style={{ y: textY }}>
                <IndexLabel
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 0.3 } : {}}
                  transition={{ duration: 0.6 }}
                >
                  {indexLabels[index]}
                </IndexLabel>

                {/* Clip-path reveal for product name */}
                <NameMask
                  initial={{ clipPath: 'inset(100% 0 0 0)' }}
                  animate={isInView ? { clipPath: 'inset(0% 0 0 0)' } : {}}
                  transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1], delay: 0.1 }}
                >
                  <ProductName>{product.name}</ProductName>
                </NameMask>

                <ProductNameKr
                  initial={{ opacity: 0, y: 8 }}
                  animate={isInView ? { opacity: 0.5, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.35 }}
                >
                  {product.nameKr}
                </ProductNameKr>

                <Desc
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 0.7, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  {product.description}
                </Desc>

                <DescKr
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 0.5, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.35 }}
                >
                  {product.descriptionKr}
                </DescKr>

                {isKit && product.includes ? (
                  <IncludesWrap
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <NotesLabel>Package Includes</NotesLabel>
                    {product.includes.map((item) => (
                      <IncludeItem key={item}>{item}</IncludeItem>
                    ))}
                  </IncludesWrap>
                ) : (
                  <NotesWrap
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <NotesLabel>Tasting Notes</NotesLabel>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                      {product.tastingNotes.map((note, i) => (
                        <NoteChip
                          key={note}
                          isDark={isDark}
                          initial={{ opacity: 0, y: 10 }}
                          animate={isInView ? { opacity: 1, y: 0 } : {}}
                          transition={{ duration: 0.4, delay: 0.5 + i * 0.06 }}
                        >
                          {note}
                        </NoteChip>
                      ))}
                    </div>
                  </NotesWrap>
                )}

                {/* Price with count-up animation */}
                <PriceRow
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <AnimatedPrice target={product.price} inView={isInView} />
                  {product.badge && <Badge color={product.color}>{product.badge}</Badge>}
                </PriceRow>

                <DetailButton
                  isDark={isDark}
                  accentColor={product.color}
                  onClick={() => navigate(`/product/${product.id}`)}
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  VIEW DETAILS &rarr;
                </DetailButton>
              </TextContent>
            </LayoutGrid>
          </StickyFrame>
        </div>
      </Section>
    );
  }
);

ProductShowcase.displayName = 'ProductShowcase';
