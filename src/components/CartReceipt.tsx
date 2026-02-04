import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const Wrapper = styled(motion.div)`
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 300px;
  z-index: 100;
  
  @media (max-width: 640px) {
    bottom: 20px;
    right: 20px;
    left: 20px;
    width: auto;
  }
`;

const ReceiptPaper = styled(motion.div)`
  background: #ffffff;
  color: var(--black);
  font-family: 'Space Mono', monospace;
  padding: 28px 24px;
  position: relative;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
`;

const Header = styled.div`
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(0,0,0,0.08);
  margin-bottom: 20px;
`;

const Logo = styled.h3`
  font-family: 'EB Garamond', serif;
  font-size: 18px;
  font-style: italic;
  font-weight: 400;
  letter-spacing: 0.05em;
`;

const ItemCount = styled.span`
  font-size: 10px;
  opacity: 0.4;
  display: block;
  margin-top: 4px;
`;

const ItemsList = styled.div`
  margin-bottom: 20px;
  max-height: 240px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.1);
  }
`;

const Item = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 14px 0;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  
  &:last-of-type {
    border-bottom: none;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.7;
  }
`;

const ItemName = styled.span`
  font-family: 'EB Garamond', serif;
  font-size: 14px;
  font-style: italic;
  display: block;
  margin-bottom: 2px;
`;

const ItemSub = styled.span`
  font-size: 9px;
  opacity: 0.4;
  letter-spacing: 0.05em;
`;

const ItemRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
`;

const RemoveBtn = styled(motion.button)`
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  font-size: 14px;
  color: rgba(0,0,0,0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 4px;

  &:hover {
    color: #ED6427;
  }
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const QtyBtn = styled.button`
  width: 20px;
  height: 20px;
  border: 1px solid rgba(0,0,0,0.1);
  background: transparent;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(0,0,0,0.05);
  }
`;

const QtyNum = styled.span`
  font-size: 11px;
  min-width: 20px;
  text-align: center;
`;

const ItemPrice = styled.span`
  font-family: 'EB Garamond', serif;
  font-size: 14px;
  font-style: italic;
  min-width: 70px;
  text-align: right;
`;

const Divider = styled.div`
  border-bottom: 1px solid rgba(0,0,0,0.08);
  margin: 16px 0;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 24px;
`;

const TotalLabel = styled.span`
  font-size: 9px;
  letter-spacing: 0.2em;
  opacity: 0.4;
`;

const TotalAmount = styled(motion.span)`
  font-family: 'EB Garamond', serif;
  font-size: 24px;
  font-style: italic;
`;

const CheckoutBtn = styled(motion.button)`
  width: 100%;
  padding: 14px;
  background: var(--black);
  border: none;
  color: var(--white);
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  font-weight: 400;
  letter-spacing: 0.2em;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #333;
  }
`;

const ShippingNote = styled.div`
  font-size: 9px;
  opacity: 0.4;
  text-align: center;
  margin-top: 12px;
`;

export const CartReceipt = () => {
  const navigate = useNavigate();
  const { items, total, updateQuantity, removeFromCart, itemCount } = useCart();
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const lastScrollY = useRef(0);
  const scrollDirection = useRef<'up' | 'down' | null>(null);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setIsVisible(true);
      return;
    }

    setIsVisible(false);
    lastScrollY.current = window.scrollY;

    const isAtBottom = () => {
      const threshold = 50;
      return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - threshold;
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY.current) {
        scrollDirection.current = 'up';
      } else if (currentScrollY > lastScrollY.current) {
        scrollDirection.current = 'down';
      }
      
      lastScrollY.current = currentScrollY;
      
      if (isAtBottom()) {
        clearTimeout(scrollTimeout.current);
        setIsVisible(true);
        return;
      }
      
      setIsVisible(false);
      clearTimeout(scrollTimeout.current);

      scrollTimeout.current = setTimeout(() => {
        if (scrollDirection.current === 'up') {
          setIsVisible(true);
        }
      }, 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout.current);
    };
  }, [isMobile]);

  const formatPrice = (price: number) => `₩${price.toLocaleString()}`;

  const shouldShow = items.length > 0 && isVisible;

  return (
    <AnimatePresence>
      {shouldShow && (
        <Wrapper
          initial={{ x: '120%', rotate: 3 }}
          animate={{ x: 0, rotate: 1 }}
          exit={{ x: '120%', rotate: 5 }}
          transition={{ type: 'spring', stiffness: 80, damping: 15 }}
        >
          <ReceiptPaper>
            <Header>
              <Logo>Lock In</Logo>
              <ItemCount>{itemCount} {itemCount === 1 ? 'item' : 'items'}</ItemCount>
            </Header>

            <ItemsList>
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <Item
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ItemInfo onClick={() => navigate(`/product/${item.id}`)}>
                      <ItemName>{item.name}</ItemName>
                      <ItemSub>{item.nameKr}</ItemSub>
                    </ItemInfo>
                    <ItemRight>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <ItemPrice>{formatPrice(item.price * item.quantity)}</ItemPrice>
                        <RemoveBtn
                          onClick={() => removeFromCart(item.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          ×
                        </RemoveBtn>
                      </div>
                      <QuantityControl>
                        <QtyBtn onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>−</QtyBtn>
                        <QtyNum>{item.quantity}</QtyNum>
                        <QtyBtn onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</QtyBtn>
                      </QuantityControl>
                    </ItemRight>
                  </Item>
                ))}
              </AnimatePresence>
            </ItemsList>

            <Divider />

            <TotalRow>
              <TotalLabel>TOTAL</TotalLabel>
              <TotalAmount
                key={total}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {formatPrice(total)}
              </TotalAmount>
            </TotalRow>

            <CheckoutBtn 
              onClick={() => navigate('/checkout')}
              whileTap={{ scale: 0.98 }}
            >
              CHECKOUT
            </CheckoutBtn>
          </ReceiptPaper>
        </Wrapper>
      )}
    </AnimatePresence>
  );
};
