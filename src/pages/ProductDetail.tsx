import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { keyframes, Global } from '@emotion/react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
} from 'framer-motion';
import { globalStyles } from '../styles/global';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

/* ──────────────────────────────────────────────
   Keyframes
   ────────────────────────────────────────────── */

const ringRotate = keyframes`
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to   { transform: translate(-50%, -50%) rotate(360deg); }
`;

const ringRotateReverse = keyframes`
  from { transform: translate(-50%, -50%) rotate(360deg); }
  to   { transform: translate(-50%, -50%) rotate(0deg); }
`;

const breathe = keyframes`
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50%      { transform: translate(-50%, -50%) scale(1.02); }
`;

const lightSweep = keyframes`
  0%   { transform: translate(-50%, -50%) translateX(-120%) rotate(25deg); opacity: 0; }
  40%  { opacity: 0.45; }
  100% { transform: translate(-50%, -50%) translateX(120%) rotate(25deg); opacity: 0; }
`;

/* ──────────────────────────────────────────────
   Styled Components
   ────────────────────────────────────────────── */

const Page = styled(motion.div)`
  min-height: 100vh;
  background: var(--warm);
  overflow-x: hidden;
`;

const Nav = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(250, 247, 242, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);

  @media (max-width: 768px) {
    padding: 16px 20px;
  }
`;

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.15em;
  color: var(--black);
  text-decoration: none;
  opacity: 0.5;
  transition: opacity 0.3s;

  &:hover {
    opacity: 1;
  }

  svg {
    width: 16px;
    height: 16px;
    stroke-width: 1.5;
  }
`;

const CartButton = styled.button`
  position: relative;
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--black);
  padding: 10px 18px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 100px;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: var(--black);
    color: var(--white);
    border-color: var(--black);
  }
`;

const CartCount = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 18px;
  height: 18px;
  background: var(--black);
  color: var(--white);
  font-size: 9px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* ── Hero / Visual Pane ── */

const HeroWrapper = styled.div`
  position: relative;
  min-height: 200vh;

  @media (max-width: 968px) {
    min-height: auto;
  }
`;

const VisualPane = styled(motion.div)<{ color: string }>`
  position: sticky;
  top: 0;
  height: 100vh;
  background: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 1;

  @media (max-width: 968px) {
    position: relative;
    height: 70vh;
  }
`;

const OrbScene = styled(motion.div)`
  position: relative;
  width: 300px;
  height: 300px;
  transform-style: preserve-3d;
  perspective: 1000px;

  @media (max-width: 768px) {
    width: 220px;
    height: 220px;
  }
`;

const Orb = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  box-shadow:
    inset 0 0 60px rgba(255, 255, 255, 0.08),
    0 40px 80px rgba(0, 0, 0, 0.3);
`;

const Ring = styled.div<{ size: number; duration: number; reverse?: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  animation: ${({ reverse }) => (reverse ? ringRotateReverse : ringRotate)}
    ${({ duration }) => duration}s linear infinite;

  @media (max-width: 768px) {
    width: ${({ size }) => size * 0.73}px;
    height: ${({ size }) => size * 0.73}px;
  }
`;

const ProductImageWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 500px;
  height: 500px;
  animation: ${breathe} 4s ease-in-out infinite;
  pointer-events: none;

  @media (max-width: 768px) {
    width: 350px;
    height: 350px;
  }
`;

const ProductImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 30px 60px rgba(0, 0, 0, 0.4));
`;

const LightSweep = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60%;
  height: 140%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.25) 45%,
    rgba(255, 255, 255, 0.35) 50%,
    rgba(255, 255, 255, 0.25) 55%,
    transparent 100%
  );
  animation: ${lightSweep} 5s ease-in-out infinite;
  animation-delay: 2s;
  pointer-events: none;
`;

/* ── Kit Orbs ── */

const KitOrbs = styled(motion.div)`
  display: flex;
  gap: 32px;
`;

const MiniOrb = styled(motion.div)<{ color: string }>`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: ${({ color }) => color};
  box-shadow: 0 20px 40px ${({ color }) => color}40;
`;

/* ── Content Pane (slides up over hero) ── */

const ContentPane = styled(motion.div)`
  position: relative;
  z-index: 10;
  background: var(--warm);
  border-radius: 32px 32px 0 0;
  padding: 80px 80px 120px;
  margin-top: -40px;

  @media (max-width: 968px) {
    padding: 48px 24px 100px;
    border-radius: 24px 24px 0 0;
    margin-top: -24px;
  }
`;

const ContentInner = styled.div`
  max-width: 640px;
  margin: 0 auto;
`;

/* ── Typography & Content Elements ── */

const Badge = styled(motion.span)<{ color: string }>`
  display: inline-block;
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.18em;
  padding: 6px 14px;
  background: ${({ color }) => color};
  color: white;
  border-radius: 100px;
  margin-bottom: 20px;
`;

const Flavor = styled(motion.p)`
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.1em;
  opacity: 0.45;
  margin-bottom: 12px;
`;

const TitleWrapper = styled(motion.div)`
  overflow: hidden;
  margin-bottom: 6px;
`;

const Title = styled(motion.h1)`
  font-family: 'EB Garamond', serif;
  font-size: clamp(52px, 10vw, 88px);
  font-weight: 400;
  font-style: italic;
  line-height: 1;
`;

const TitleKr = styled(motion.span)`
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.1em;
  opacity: 0.35;
  display: block;
  margin-bottom: 36px;
`;

const Description = styled(motion.p)`
  font-family: 'EB Garamond', serif;
  font-size: 19px;
  line-height: 1.8;
  opacity: 0.65;
  max-width: 500px;
  margin-bottom: 12px;
`;

const DescriptionKr = styled(motion.p)`
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  line-height: 2;
  opacity: 0.4;
  max-width: 500px;
  margin-bottom: 48px;
`;

const NotesSection = styled(motion.div)`
  margin-bottom: 48px;
`;

const NotesLabel = styled.span`
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.35;
  display: block;
  margin-bottom: 16px;
`;

const NotesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const NoteTag = styled(motion.span)`
  font-family: 'EB Garamond', serif;
  font-size: 15px;
  font-style: italic;
  padding: 10px 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 100px;
  transition: all 0.3s;

  &:hover {
    background: var(--black);
    color: var(--white);
    border-color: var(--black);
  }
`;

const IncludesList = styled(motion.div)`
  margin-bottom: 48px;
`;

const IncludeItem = styled(motion.div)`
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.05em;
  padding: 14px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 12px;

  &::before {
    content: '\u2713';
    opacity: 0.35;
  }
`;

/* ── Price & Quantity ── */

const PriceRow = styled(motion.div)`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
  flex-wrap: wrap;
`;

const PriceBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Price = styled.span`
  font-family: 'EB Garamond', serif;
  font-size: 38px;
  font-style: italic;
  line-height: 1;
`;

const OriginalPrice = styled.span`
  font-family: 'Space Mono', monospace;
  font-size: 14px;
  text-decoration: line-through;
  opacity: 0.3;
`;

const DiscountBadge = styled.span`
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  color: #ed6427;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 100px;
  overflow: hidden;
`;

const QtyButton = styled.button`
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  font-family: 'Space Mono', monospace;
  font-size: 16px;
  color: var(--black);
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }

  &:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }
`;

const QtyDisplay = styled(motion.span)`
  width: 36px;
  text-align: center;
  font-family: 'Space Mono', monospace;
  font-size: 13px;
  user-select: none;
`;

/* ── Add to Cart ── */

const AddButton = styled(motion.button)<{ color: string }>`
  width: 100%;
  padding: 20px 32px;
  background: ${({ color }) => color};
  border: none;
  border-radius: 16px;
  color: white;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.4s;

  &:hover {
    box-shadow: 0 12px 40px ${({ color }) => color}50;
  }
`;

const ButtonFlash = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.3);
  pointer-events: none;
`;

/* ── Toast ── */

const Toast = styled(motion.div)`
  position: fixed;
  top: 80px;
  right: 24px;
  background: var(--black);
  color: var(--white);
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.1em;
  padding: 16px 28px;
  border-radius: 12px;
  z-index: 300;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

/* ──────────────────────────────────────────────
   Data
   ────────────────────────────────────────────── */

const productImages: Record<string, string> = {
  decaf: '/decaf-product.png',
  house: '/house-product.png',
  vibrant: '/vibrant-product.png',
};

const kitColors = ['#A71B1B', '#37385A', '#ED6427'];

/* ──────────────────────────────────────────────
   Animated Price Counter
   ────────────────────────────────────────────── */

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  const start = useCallback(() => {
    if (started.current) return;
    started.current = true;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);

  return { value, start };
}

/* ──────────────────────────────────────────────
   Component
   ────────────────────────────────────────────── */

export const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToCart, itemCount } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [buttonFlash, setButtonFlash] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  const product = products.find((p) => p.id === productId);

  // Mouse-tracking for 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [10, -10]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-10, 10]), {
    stiffness: 150,
    damping: 20,
  });

  const visualRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll progress for parallax
  const { scrollYProgress } = useScroll();
  const visualScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const visualOpacity = useTransform(scrollYProgress, [0.2, 0.5], [1, 0.7]);

  // Price count-up
  const { value: displayPrice, start: startPriceCount } = useCountUp(
    product?.price ?? 0,
    1000,
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  // Intersection observer for content reveal
  useEffect(() => {
    if (!contentRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setContentVisible(true);
          startPriceCount();
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [startPriceCount]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!visualRef.current) return;
    const rect = visualRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mouseX.set(e.clientX - cx);
    mouseY.set(e.clientY - cy);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  if (!product) {
    navigate('/');
    return null;
  }

  const formatPrice = (price: number) => `\u20A9${price.toLocaleString()}`;
  const hasImage = product.id in productImages;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setButtonFlash(true);
    setTimeout(() => setButtonFlash(false), 300);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  /* ── Stagger delays for content reveal ── */
  const s = (i: number) => 0.08 * i;

  const revealVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: s(i), ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
    }),
  };

  const noteSpring = {
    hidden: { opacity: 0, scale: 0.8, y: 16 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 24,
        delay: s(6) + i * 0.07,
      },
    }),
  };

  return (
    <AnimatePresence mode="wait">
      <Page
        key={productId}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <Global styles={globalStyles} />

        {/* ── Navigation ── */}
        <Nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <BackLink to="/">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            BACK
          </BackLink>
          <CartButton onClick={() => navigate('/checkout')}>
            CART
            {itemCount > 0 && <CartCount>{itemCount}</CartCount>}
          </CartButton>
        </Nav>

        {/* ── Immersive Hero ── */}
        <HeroWrapper>
          <VisualPane
            ref={visualRef}
            color={product.color}
            style={{ scale: visualScale, opacity: visualOpacity }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {product.isKit ? (
              <KitOrbs>
                {kitColors.map((color, i) => (
                  <MiniOrb
                    key={color}
                    color={color}
                    initial={{ scale: 0, y: 30 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.12 }}
                  />
                ))}
              </KitOrbs>
            ) : (
              <OrbScene style={{ rotateX, rotateY }}>
                {/* Concentric rings with CSS animation */}
                <Ring size={380} duration={30} />
                <Ring size={460} duration={45} reverse />
                <Ring size={540} duration={60} />

                <Orb />

                {hasImage && (
                  <ProductImageWrapper>
                    <ProductImg
                      src={productImages[product.id]}
                      alt={product.name}
                    />
                    <LightSweep />
                  </ProductImageWrapper>
                )}
              </OrbScene>
            )}
          </VisualPane>

          {/* ── Content Pane (slides up over sticky hero) ── */}
          <ContentPane ref={contentRef}>
            <ContentInner>
              {/* Badge */}
              {product.badge && (
                <Badge
                  color={product.color}
                  variants={revealVariant}
                  initial="hidden"
                  animate={contentVisible ? 'visible' : 'hidden'}
                  custom={0}
                >
                  {product.badge}
                </Badge>
              )}

              {/* Flavor */}
              <Flavor
                variants={revealVariant}
                initial="hidden"
                animate={contentVisible ? 'visible' : 'hidden'}
                custom={1}
              >
                {product.flavor}
              </Flavor>

              {/* Title with clip-path reveal */}
              <TitleWrapper
                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                animate={
                  contentVisible
                    ? { clipPath: 'inset(0 0% 0 0)' }
                    : { clipPath: 'inset(0 100% 0 0)' }
                }
                transition={{ duration: 0.8, delay: s(2), ease: [0.65, 0, 0.35, 1] as [number, number, number, number] }}
              >
                <Title>{product.name}</Title>
              </TitleWrapper>

              {/* Korean name */}
              <TitleKr
                variants={revealVariant}
                initial="hidden"
                animate={contentVisible ? 'visible' : 'hidden'}
                custom={3}
              >
                {product.nameKr}
              </TitleKr>

              {/* Description */}
              <Description
                variants={revealVariant}
                initial="hidden"
                animate={contentVisible ? 'visible' : 'hidden'}
                custom={4}
              >
                {product.description}
              </Description>
              <DescriptionKr
                variants={revealVariant}
                initial="hidden"
                animate={contentVisible ? 'visible' : 'hidden'}
                custom={5}
              >
                {product.descriptionKr}
              </DescriptionKr>

              {/* Tasting Notes / Kit Includes */}
              {product.isKit && product.includes ? (
                <IncludesList
                  variants={revealVariant}
                  initial="hidden"
                  animate={contentVisible ? 'visible' : 'hidden'}
                  custom={6}
                >
                  <NotesLabel>Package Includes</NotesLabel>
                  {product.includes.map((item, i) => (
                    <IncludeItem
                      key={item}
                      variants={noteSpring}
                      initial="hidden"
                      animate={contentVisible ? 'visible' : 'hidden'}
                      custom={i}
                    >
                      {item}
                    </IncludeItem>
                  ))}
                </IncludesList>
              ) : (
                <NotesSection
                  variants={revealVariant}
                  initial="hidden"
                  animate={contentVisible ? 'visible' : 'hidden'}
                  custom={6}
                >
                  <NotesLabel>Tasting Notes</NotesLabel>
                  <NotesList>
                    {product.tastingNotes.map((note, i) => (
                      <NoteTag
                        key={note}
                        variants={noteSpring}
                        initial="hidden"
                        animate={contentVisible ? 'visible' : 'hidden'}
                        custom={i}
                      >
                        {note}
                      </NoteTag>
                    ))}
                  </NotesList>
                </NotesSection>
              )}

              {/* Price + Quantity */}
              <PriceRow
                variants={revealVariant}
                initial="hidden"
                animate={contentVisible ? 'visible' : 'hidden'}
                custom={8}
              >
                <PriceBlock>
                  {product.originalPrice && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        marginBottom: 4,
                      }}
                    >
                      <OriginalPrice>
                        {formatPrice(product.originalPrice)}
                      </OriginalPrice>
                      <DiscountBadge>
                        {Math.round(
                          (1 - product.price / product.originalPrice) * 100,
                        )}
                        % OFF
                      </DiscountBadge>
                    </div>
                  )}
                  <Price>{formatPrice(displayPrice)}</Price>
                </PriceBlock>

                <QuantityControl>
                  <QtyButton
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </QtyButton>
                  <AnimatePresence mode="popLayout">
                    <QtyDisplay
                      key={quantity}
                      initial={{ y: -12, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 12, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {quantity}
                    </QtyDisplay>
                  </AnimatePresence>
                  <QtyButton onClick={() => setQuantity((q) => q + 1)}>
                    +
                  </QtyButton>
                </QuantityControl>
              </PriceRow>

              {/* Add to Cart */}
              <motion.div
                variants={revealVariant}
                initial="hidden"
                animate={contentVisible ? 'visible' : 'hidden'}
                custom={9}
                style={{ transformOrigin: 'center bottom' }}
              >
                <AddButton
                  color={product.color}
                  onClick={handleAddToCart}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.97 }}
                >
                  ADD TO CART
                  <AnimatePresence>
                    {buttonFlash && (
                      <ButtonFlash
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </AnimatePresence>
                </AddButton>
              </motion.div>
            </ContentInner>
          </ContentPane>
        </HeroWrapper>

        {/* ── Toast (slides from right) ── */}
        <AnimatePresence>
          {showToast && (
            <Toast
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 80 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              ADDED TO CART
            </Toast>
          )}
        </AnimatePresence>
      </Page>
    </AnimatePresence>
  );
};
