import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { Global } from '@emotion/react';
import { globalStyles } from '../styles/global';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

const Page = styled.div`
  min-height: 100vh;
  background: var(--warm);
`;

const Nav = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  padding: 32px 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to bottom, var(--warm), transparent);

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const BackLink = styled(Link)`
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.15em;
  color: var(--black);
  text-decoration: none;
  opacity: 0.6;
  transition: opacity 0.3s;

  &:hover {
    opacity: 1;
  }
`;

const CartButton = styled(Link)`
  position: relative;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.1em;
  color: var(--black);
  text-decoration: none;
  padding: 12px 20px;
  border: 1px solid rgba(0,0,0,0.1);
  transition: all 0.3s;

  &:hover {
    background: var(--black);
    color: var(--white);
    border-color: var(--black);
  }
`;

const CartCount = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  background: var(--black);
  color: var(--white);
  font-size: 10px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Hero = styled.section<{ color: string }>`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    min-height: auto;
  }
`;

const VisualPane = styled(motion.div)<{ color: string }>`
  background: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 60px;
  position: relative;
  overflow: hidden;

  @media (max-width: 968px) {
    min-height: 60vh;
    padding: 100px 32px 60px;
  }
`;

const OrbGroup = styled(motion.div)`
  position: relative;
`;

const Orb = styled(motion.div)<{ color: string }>`
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  box-shadow: 
    inset 0 0 60px rgba(255,255,255,0.1),
    0 40px 80px rgba(0,0,0,0.3);
  
  @media (max-width: 768px) {
    width: 220px;
    height: 220px;
  }
`;

const Ring = styled(motion.div)`
  position: absolute;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 50%;
`;

const ProductImage = styled(motion.img)`
  position: absolute;
  width: 500px;
  height: 500px;
  object-fit: contain;
  filter: drop-shadow(0 30px 60px rgba(0,0,0,0.4));

  @media (max-width: 768px) {
    width: 350px;
    height: 350px;
  }
`;

const ContentPane = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 120px 80px;

  @media (max-width: 968px) {
    padding: 60px 32px 100px;
  }
`;

const Badge = styled.span<{ color: string }>`
  display: inline-block;
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.15em;
  padding: 8px 14px;
  background: ${({ color }) => color};
  color: white;
  margin-bottom: 24px;
`;

const Flavor = styled.p`
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.1em;
  opacity: 0.5;
  margin-bottom: 16px;
`;

const Title = styled.h1`
  font-family: 'EB Garamond', serif;
  font-size: clamp(56px, 10vw, 96px);
  font-weight: 400;
  font-style: italic;
  line-height: 1;
  margin-bottom: 8px;
`;

const TitleKr = styled.span`
  font-family: 'Space Mono', monospace;
  font-size: 13px;
  letter-spacing: 0.1em;
  opacity: 0.4;
  display: block;
  margin-bottom: 40px;
`;

const Description = styled.p`
  font-family: 'EB Garamond', serif;
  font-size: 20px;
  line-height: 1.8;
  opacity: 0.7;
  max-width: 480px;
  margin-bottom: 16px;
`;

const DescriptionKr = styled.p`
  font-family: 'Space Mono', monospace;
  font-size: 13px;
  line-height: 2;
  opacity: 0.5;
  max-width: 480px;
  margin-bottom: 48px;
`;

const NotesSection = styled.div`
  margin-bottom: 48px;
`;

const NotesLabel = styled.span`
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.4;
  display: block;
  margin-bottom: 16px;
`;

const NotesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const NoteTag = styled.span`
  font-family: 'EB Garamond', serif;
  font-size: 15px;
  font-style: italic;
  padding: 10px 20px;
  border: 1px solid rgba(0,0,0,0.12);
  transition: all 0.3s;

  &:hover {
    background: var(--black);
    color: var(--white);
    border-color: var(--black);
  }
`;

// Kit 구성품
const IncludesList = styled.div`
  margin-bottom: 48px;
`;

const IncludeItem = styled.div`
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.05em;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  display: flex;
  align-items: center;
  gap: 12px;

  &::before {
    content: '✓';
    opacity: 0.4;
  }
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
`;

const Price = styled.span`
  font-family: 'EB Garamond', serif;
  font-size: 40px;
  font-style: italic;
`;

const OriginalPrice = styled.span`
  font-family: 'Space Mono', monospace;
  font-size: 16px;
  text-decoration: line-through;
  opacity: 0.35;
`;

const DiscountBadge = styled.span`
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  color: #ED6427;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  border: 1px solid rgba(0,0,0,0.1);
`;

const QtyButton = styled.button`
  width: 44px;
  height: 44px;
  background: transparent;
  border: none;
  font-family: 'Space Mono', monospace;
  font-size: 18px;
  color: var(--black);
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: rgba(0,0,0,0.05);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const QtyDisplay = styled.span`
  width: 44px;
  text-align: center;
  font-family: 'Space Mono', monospace;
  font-size: 14px;
`;

const AddButton = styled(motion.button)<{ color: string }>`
  width: 100%;
  max-width: 360px;
  padding: 18px 32px;
  background: ${({ color }) => color};
  border: none;
  color: white;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    box-shadow: 0 10px 40px ${({ color }) => color}40;
  }
`;

const AddedToast = styled(motion.div)`
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--black);
  color: var(--white);
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.1em;
  padding: 16px 32px;
  z-index: 300;
`;

const productImages: Record<string, string> = {
  'decaf': '/decaf-product.png',
  'house': '/house-product.png',
  'vibrant': '/vibrant-product.png',
};

// Kit용 미니 오브
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

const kitColors = ['#A71B1B', '#37385A', '#ED6427'];

export const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToCart, itemCount } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);

  const product = products.find(p => p.id === productId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  if (!product) {
    navigate('/');
    return null;
  }

  const formatPrice = (price: number) => `₩${price.toLocaleString()}`;
  const hasImage = product.id in productImages;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <Page>
      <Global styles={globalStyles} />
      
      <Nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <BackLink to="/">← BACK TO COLLECTION</BackLink>
        <CartButton to="/checkout">
          CART
          {itemCount > 0 && <CartCount>{itemCount}</CartCount>}
        </CartButton>
      </Nav>

      <Hero color={product.color}>
        <VisualPane
          color={product.color}
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
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                />
              ))}
            </KitOrbs>
          ) : (
            <OrbGroup>
              <Ring
                style={{ width: 380, height: 380, top: -40, left: -40 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
              <Ring
                style={{ width: 460, height: 460, top: -80, left: -80 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.5 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
              <Orb
                color={product.color}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              />
              {hasImage && (
                <ProductImage
                  src={productImages[product.id]}
                  alt={product.name}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              )}
            </OrbGroup>
          )}
        </VisualPane>

        <ContentPane
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {product.badge && <Badge color={product.color}>{product.badge}</Badge>}
          <Flavor>{product.flavor}</Flavor>
          <Title>{product.name}</Title>
          <TitleKr>{product.nameKr}</TitleKr>

          <Description>{product.description}</Description>
          <DescriptionKr>{product.descriptionKr}</DescriptionKr>

          {product.isKit && product.includes ? (
            <IncludesList>
              <NotesLabel>Package Includes</NotesLabel>
              {product.includes.map((item) => (
                <IncludeItem key={item}>{item}</IncludeItem>
              ))}
            </IncludesList>
          ) : (
            <NotesSection>
              <NotesLabel>Tasting Notes</NotesLabel>
              <NotesList>
                {product.tastingNotes.map((note) => (
                  <NoteTag key={note}>{note}</NoteTag>
                ))}
              </NotesList>
            </NotesSection>
          )}

          <PriceRow>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, marginBottom: 16 }}>
              {product.originalPrice && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <OriginalPrice>{formatPrice(product.originalPrice)}</OriginalPrice>
                  <DiscountBadge>
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </DiscountBadge>
                </div>
              )}
              <Price>{formatPrice(product.price)}</Price>
            </div>
            <QuantityControl>
              <QtyButton 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                −
              </QtyButton>
              <QtyDisplay>{quantity}</QtyDisplay>
              <QtyButton onClick={() => setQuantity(q => q + 1)}>+</QtyButton>
            </QuantityControl>
          </PriceRow>

          <AddButton
            color={product.color}
            onClick={handleAddToCart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            ADD TO CART
          </AddButton>
        </ContentPane>
      </Hero>

      <AnimatePresence>
        {showToast && (
          <AddedToast
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            ADDED TO CART
          </AddedToast>
        )}
      </AnimatePresence>
    </Page>
  );
};
