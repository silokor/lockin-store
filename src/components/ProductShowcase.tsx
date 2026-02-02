import { forwardRef, useRef } from 'react';
import styled from '@emotion/styled';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import type { Product } from '../data/products';

const Section = styled.section<{ isDark: boolean }>`
  min-height: 100vh;
  position: relative;
  background: ${({ isDark }) => isDark ? 'var(--black)' : 'var(--warm)'};
  color: ${({ isDark }) => isDark ? 'var(--white)' : 'var(--black)'};
  display: flex;
  align-items: center;
  padding: 120px 0;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 60px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 120px;
  align-items: center;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 60px;
    padding: 0 32px;
  }
`;

const Visual = styled(motion.div)<{ isEven: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  order: ${({ isEven }) => isEven ? 2 : 1};

  @media (max-width: 968px) {
    order: 1;
  }
`;

const OrbContainer = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Orb = styled(motion.div)<{ color: string; size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: 50%;
  background: ${({ color }) => color};
  position: relative;
  box-shadow: 0 40px 80px ${({ color }) => color}30;
  
  &::before {
    content: '';
    position: absolute;
    top: 15%;
    left: 20%;
    width: 35%;
    height: 35%;
    background: linear-gradient(135deg, rgba(255,255,255,0.4), transparent);
    border-radius: 50%;
    filter: blur(10px);
  }
`;

const Ring = styled(motion.div)<{ color: string; size: number }>`
  position: absolute;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border: 1px solid ${({ color }) => color}30;
  border-radius: 50%;
`;

const FloatingImage = styled(motion.img)`
  position: absolute;
  width: 400px;
  height: 400px;
  object-fit: contain;
  filter: drop-shadow(0 20px 30px rgba(0,0,0,0.5));
  z-index: 100;
`;

// Kit용 미니 오브
const KitOrbs = styled(motion.div)`
  display: flex;
  gap: 24px;
`;

const MiniOrb = styled(motion.div)<{ color: string }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${({ color }) => color};
  box-shadow: 0 20px 40px ${({ color }) => color}30;

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }
`;

const Content = styled(motion.div)<{ isEven: boolean }>`
  order: ${({ isEven }) => isEven ? 1 : 2};

  @media (max-width: 968px) {
    order: 2;
  }
`;

const Index = styled(motion.span)`
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.3em;
  opacity: 0.3;
  display: block;
  margin-bottom: 16px;
`;

const ProductName = styled(motion.h2)`
  font-family: 'EB Garamond', serif;
  font-size: clamp(48px, 8vw, 80px);
  font-weight: 400;
  font-style: italic;
  line-height: 1;
  margin-bottom: 8px;
`;

const ProductNameKr = styled(motion.span)`
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.1em;
  opacity: 0.5;
  display: block;
  margin-bottom: 32px;
`;

const Description = styled(motion.p)`
  font-family: 'EB Garamond', serif;
  font-size: clamp(16px, 2vw, 20px);
  line-height: 1.7;
  opacity: 0.7;
  max-width: 400px;
  margin-bottom: 16px;
`;

const DescriptionKr = styled(motion.p)`
  font-family: 'Space Mono', monospace;
  font-size: 13px;
  line-height: 1.8;
  opacity: 0.5;
  max-width: 400px;
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

const Notes = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 40px;
`;

const Note = styled(motion.span)<{ isDark: boolean }>`
  font-family: 'EB Garamond', serif;
  font-size: 14px;
  font-style: italic;
  padding: 8px 16px;
  border: 1px solid ${({ isDark }) => isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'};
`;

// Kit 구성품
const Includes = styled(motion.div)`
  margin-bottom: 40px;
`;

const IncludeItem = styled.span<{ isDark: boolean }>`
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.05em;
  opacity: 0.6;
  
  &:not(:last-child)::after {
    content: ' · ';
    opacity: 0.3;
  }
`;

const PriceRow = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Price = styled.span`
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

const kitColors = ['#A71B1B', '#37385A', '#ED6427'];

interface Props {
  product: Product;
  index: number;
}

export const ProductShowcase = forwardRef<HTMLDivElement, Props>(
  ({ product, index }, ref) => {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { amount: 0.4 });
    const isDark = index % 2 !== 0 && product.id !== 'house';
    const isEven = index % 2 === 1;
    const isKit = product.isKit;

    const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: ["start end", "end start"]
    });

    const orbY = useTransform(scrollYProgress, [0, 1], [50, -50]);
    const contentY = useTransform(scrollYProgress, [0, 1], [30, -30]);
    const productImages: Record<string, string> = {
      'decaf': '/decaf-product.png',
      'house': '/house-product.png',
      'vibrant': '/vibrant-product.png',
    };
    const hasImage = product.id in productImages;

    const formatPrice = (price: number) => `₩${price.toLocaleString()}`;
    const indexLabels = ['01 — Morning', '02 — Afternoon', '03 — Evening', '04 — Discovery'];

    return (
      <Section ref={ref} data-product-id={product.id} isDark={isDark}>
        <Container ref={containerRef}>
          <Visual isEven={isEven}>
            {isKit ? (
              <KitOrbs style={{ y: orbY }}>
                {kitColors.map((color, i) => (
                  <MiniOrb
                    key={color}
                    color={color}
                    initial={{ scale: 0, y: 30 }}
                    animate={isInView ? { scale: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  />
                ))}
              </KitOrbs>
            ) : (
              <OrbContainer style={{ y: orbY }}>
                <Ring color={product.color} size={320} />
                <Ring color={product.color} size={380} style={{ opacity: 0.5 }} />
                <Orb
                  color={product.color}
                  size={200}
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                />
                {hasImage && (
                  <FloatingImage
                    src={productImages[product.id]}
                    alt={product.name}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                  />
                )}
              </OrbContainer>
            )}
          </Visual>

          <Content isEven={isEven} style={{ y: contentY }}>
            <Index
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 0.3 } : {}}
              transition={{ duration: 0.6 }}
            >
              {indexLabels[index]}
            </Index>

            <ProductName
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              {product.name}
            </ProductName>

            <ProductNameKr
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 0.5 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {product.nameKr}
            </ProductNameKr>

            <Description
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 0.7, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {product.description}
            </Description>

            <DescriptionKr
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 0.5, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.35 }}
            >
              {product.descriptionKr}
            </DescriptionKr>

            {isKit && product.includes ? (
              <Includes
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <NotesLabel>Package Includes</NotesLabel>
                {product.includes.map((item) => (
                  <IncludeItem key={item} isDark={isDark}>{item}</IncludeItem>
                ))}
              </Includes>
            ) : (
              <Notes
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <NotesLabel>Tasting Notes</NotesLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {product.tastingNotes.map((note, i) => (
                    <Note
                      key={note}
                      isDark={isDark}
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.5 + i * 0.05 }}
                    >
                      {note}
                    </Note>
                  ))}
                </div>
              </Notes>
            )}

            <PriceRow
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Price>{formatPrice(product.price)}</Price>
              {product.badge && <Badge color={product.color}>{product.badge}</Badge>}
            </PriceRow>
          </Content>
        </Container>
      </Section>
    );
  }
);

ProductShowcase.displayName = 'ProductShowcase';
