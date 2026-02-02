import { useState, useEffect } from 'react';
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
  background: var(--cream);
  color: var(--black);
  font-family: 'Space Mono', monospace;
  padding: 24px 20px;
  position: relative;
  box-shadow: 
    0 30px 80px rgba(0,0,0,0.2),
    0 10px 30px rgba(0,0,0,0.15);

  &::before {
    content: '';
    position: absolute;
    top: -14px;
    left: 0;
    right: 0;
    height: 14px;
    background: 
      linear-gradient(135deg, transparent 33.33%, var(--cream) 33.33%, var(--cream) 66.66%, transparent 66.66%),
      linear-gradient(-135deg, transparent 33.33%, var(--cream) 33.33%, var(--cream) 66.66%, transparent 66.66%);
    background-size: 12px 14px;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -14px;
    left: 0;
    right: 0;
    height: 14px;
    background: 
      linear-gradient(45deg, transparent 33.33%, var(--cream) 33.33%, var(--cream) 66.66%, transparent 66.66%),
      linear-gradient(-45deg, transparent 33.33%, var(--cream) 33.33%, var(--cream) 66.66%, transparent 66.66%);
    background-size: 12px 14px;
  }
`;

const Header = styled.div`
  text-align: center;
  padding-bottom: 16px;
  border-bottom: 2px dashed #d4c9a8;
  margin-bottom: 16px;
`;

const Logo = styled.h3`
  font-family: 'EB Garamond', serif;
  font-size: 20px;
  font-style: italic;
  font-weight: 400;
  margin-bottom: 4px;
`;

const DateLine = styled.p`
  font-size: 9px;
  letter-spacing: 0.1em;
  opacity: 0.5;
`;

const ItemsList = styled.div`
  margin-bottom: 16px;
`;

const Item = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px dotted #d4c9a8;
  
  &:last-of-type {
    border-bottom: none;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.span`
  font-family: 'EB Garamond', serif;
  font-size: 13px;
  font-style: italic;
  display: block;
`;

const ItemSub = styled.span`
  font-size: 8px;
  opacity: 0.5;
  letter-spacing: 0.05em;
`;

const ItemPrice = styled.span`
  font-size: 11px;
  font-weight: 700;
`;

const RemoveBtn = styled(motion.button)`
  font-size: 14px;
  color: #bbb;
  margin-left: 10px;
  line-height: 1;
`;

const Divider = styled.div`
  border-bottom: 2px dashed #d4c9a8;
  margin: 12px 0;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 16px;
`;

const TotalLabel = styled.span`
  font-size: 9px;
  letter-spacing: 0.15em;
  opacity: 0.5;
`;

const TotalAmount = styled(motion.span)`
  font-size: 18px;
  font-weight: 700;
`;

const CheckoutBtn = styled(motion.button)`
  width: 100%;
  padding: 12px;
  background: #ED6427;
  color: var(--white);
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.2em;
`;

const Barcode = styled.div`
  display: flex;
  justify-content: center;
  gap: 1px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px dashed #d4c9a8;
`;

const Bar = styled(motion.div)<{ w: number }>`
  width: ${({ w }) => w}px;
  height: 24px;
  background: var(--black);
`;

const bars = [2,1,3,1,2,1,1,3,2,1,3,1,1,2,3,1,2,1,1,3,2,1,3,1,2];

interface Props {
  items: Product[];
  onRemove: (i: number) => void;
}

export const Receipt = ({ items, onRemove }: Props) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY) {
        // 스크롤 다운 - 보이기
        setIsVisible(true);
      } else {
        // 스크롤 업 - 숨기기
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const now = new Date();
  const date = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  const total = items.reduce((s, i) => s + i.price, 0);
  const fmt = (p: number) => `₩${p.toLocaleString()}`;

  const shouldShow = items.length > 0 && isVisible;

  return (
    <AnimatePresence>
      {shouldShow && (
        <Wrapper
          initial={{ x: '120%', rotate: 3 }}
          animate={{ x: 0, rotate: 1.5 }}
          exit={{ x: '120%', rotate: 5 }}
          transition={{ type: 'spring', stiffness: 80, damping: 15 }}
        >
          <ReceiptPaper>
            <Header>
              <Logo>Lock In</Logo>
              <DateLine>{date} · {time}</DateLine>
            </Header>

            <ItemsList>
              <AnimatePresence mode="popLayout">
                {items.map((item, i) => (
                  <Item
                    key={`${item.id}-${i}`}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  >
                    <ItemInfo>
                      <ItemName>{item.name}</ItemName>
                      <ItemSub>{item.nameKr}</ItemSub>
                    </ItemInfo>
                    <ItemPrice>{fmt(item.price)}</ItemPrice>
                    <RemoveBtn
                      onClick={() => onRemove(i)}
                      whileHover={{ scale: 1.2, color: '#ED6427' }}
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
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                {fmt(total)}
              </TotalAmount>
            </TotalRow>

            <CheckoutBtn whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              CHECKOUT
            </CheckoutBtn>

            <Barcode>
              {bars.map((w, i) => (
                <Bar key={i} w={w} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: i * 0.015 }} />
              ))}
            </Barcode>
          </ReceiptPaper>
        </Wrapper>
      )}
    </AnimatePresence>
  );
};
