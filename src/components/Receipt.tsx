import { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '../data/products';

const Wrapper = styled(motion.div)`
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 280px;
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

const ItemsList = styled.div`
  margin-bottom: 20px;
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

const ItemPrice = styled.span`
  font-size: 12px;
  opacity: 0.8;
`;

const RemoveBtn = styled(motion.button)`
  font-size: 16px;
  color: rgba(0,0,0,0.3);
  margin-left: 12px;
  line-height: 1;
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
  transition: all 0.3s ease;

  &:hover {
    background: #333;
  }
`;

interface Props {
  items: Product[];
  onRemove: (i: number) => void;
}

export const Receipt = ({ items, onRemove }: Props) => {
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

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY.current) {
        scrollDirection.current = 'up';
      } else if (currentScrollY > lastScrollY.current) {
        scrollDirection.current = 'down';
      }
      
      lastScrollY.current = currentScrollY;
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

  const total = items.reduce((s, i) => s + i.price, 0);
  const fmt = (p: number) => `₩${p.toLocaleString()}`;

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
            </Header>

            <ItemsList>
              <AnimatePresence mode="popLayout">
                {items.map((item, i) => (
                  <Item
                    key={`${item.id}-${i}`}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ItemInfo>
                      <ItemName>{item.name}</ItemName>
                      <ItemSub>{item.nameKr}</ItemSub>
                    </ItemInfo>
                    <ItemPrice>{fmt(item.price)}</ItemPrice>
                    <RemoveBtn
                      onClick={() => onRemove(i)}
                      whileHover={{ color: '#ED6427' }}
                      whileTap={{ scale: 0.9 }}
                    >
                      ×
                    </RemoveBtn>
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
                {fmt(total)}
              </TotalAmount>
            </TotalRow>

            <CheckoutBtn whileTap={{ scale: 0.98 }}>
              CHECKOUT
            </CheckoutBtn>
          </ReceiptPaper>
        </Wrapper>
      )}
    </AnimatePresence>
  );
};
