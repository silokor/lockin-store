import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import { useCart } from "../context/CartContext";

/* ── Styled Components ── */

const Wrapper = styled(motion.div)<{ $isMobile: boolean }>`
  position: fixed;
  z-index: 100;

  ${({ $isMobile }) =>
    $isMobile
      ? `
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
  `
      : `
    bottom: 40px;
    right: 40px;
    width: 320px;
  `}
`;

const ReceiptCard = styled(motion.div)<{ $isMobile: boolean }>`
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background: rgba(13, 13, 13, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--white, #f5f5f5);
  font-family: "Space Mono", monospace;
  padding: 28px 24px;
  position: relative;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;

  ${({ $isMobile }) =>
    $isMobile
      ? `
    border-radius: 20px 20px 0 0;
    padding: 20px 20px calc(20px + env(safe-area-inset-bottom));
  `
      : `
    border-radius: 16px;
  `}
`;

const Header = styled.div`
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 20px;
`;

const Logo = styled.h3`
  font-family: "EB Garamond", serif;
  font-size: 18px;
  font-style: italic;
  font-weight: 400;
  letter-spacing: 0.05em;
  color: var(--white, #f5f5f5);
`;

const ItemCountLabel = styled.span`
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
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
`;

const Item = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 14px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

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
  font-family: "EB Garamond", serif;
  font-size: 14px;
  font-style: italic;
  display: block;
  margin-bottom: 2px;
  color: var(--white, #f5f5f5);
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
  color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 4px;
  transition: color 0.2s;

  &:hover {
    color: #ed6427;
  }
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const QtyBtn = styled.button`
  width: 22px;
  height: 22px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  background: transparent;
  font-size: 12px;
  color: var(--white, #f5f5f5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
  }

  &:disabled {
    opacity: 0.25;
    cursor: default;
  }
`;

const QtyNum = styled.span`
  font-size: 11px;
  min-width: 20px;
  text-align: center;
  overflow: hidden;
`;

const ItemPrice = styled.span`
  font-family: "EB Garamond", serif;
  font-size: 14px;
  font-style: italic;
  min-width: 70px;
  text-align: right;
  color: var(--white, #f5f5f5);
`;

const DividerLine = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
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

const TotalAmount = styled.span`
  font-family: "EB Garamond", serif;
  font-size: 28px;
  font-style: italic;
  color: var(--white, #f5f5f5);
`;

const CheckoutBtn = styled(motion.button)`
  width: 100%;
  padding: 16px;
  background: #ed6427;
  border: none;
  border-radius: 10px;
  color: #fff;
  font-family: "Space Mono", monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  cursor: pointer;
  box-shadow: 0 4px 24px rgba(237, 100, 39, 0.3);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 6px 32px rgba(237, 100, 39, 0.5);
  }
`;

const ShippingNote = styled.div`
  font-size: 9px;
  opacity: 0.3;
  text-align: center;
  margin-top: 12px;
`;

/* ── Animated Counter ── */

const AnimatedNumber = ({ value }: { value: number }) => {
  const motionVal = useMotionValue(value);
  const spring = useSpring(motionVal, { stiffness: 80, damping: 20 });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    motionVal.set(value);
  }, [value, motionVal]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (v: number) => {
      setDisplay(Math.round(v));
    });
    return unsubscribe;
  }, [spring]);

  return <>{`₩${display.toLocaleString()}`}</>;
};

/* ── Component ── */

export const CartReceipt = () => {
  const navigate = useNavigate();
  const { items, total, updateQuantity, removeFromCart, itemCount } = useCart();
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const lastScrollY = useRef(0);
  const scrollDirection = useRef<"up" | "down" | null>(null);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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
      return (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - threshold
      );
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY.current) {
        scrollDirection.current = "up";
      } else if (currentScrollY > lastScrollY.current) {
        scrollDirection.current = "down";
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
        if (scrollDirection.current === "up") {
          setIsVisible(true);
        }
      }, 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout.current);
    };
  }, [isMobile]);

  const formatPrice = (price: number) => `₩${price.toLocaleString()}`;

  const shouldShow = items.length > 0 && isVisible;

  const wrapperVariants = isMobile
    ? {
        initial: { y: "100%", opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: "100%", opacity: 0 },
      }
    : {
        initial: { y: 40, opacity: 0, scale: 0.96 },
        animate: { y: 0, opacity: 1, scale: 1 },
        exit: { y: 40, opacity: 0, scale: 0.96 },
      };

  return (
    <AnimatePresence>
      {shouldShow && (
        <Wrapper
          $isMobile={isMobile}
          initial={wrapperVariants.initial}
          animate={wrapperVariants.animate}
          exit={wrapperVariants.exit}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 28,
          }}
        >
          <ReceiptCard $isMobile={isMobile}>
            <Header>
              <Logo>Lock In</Logo>
              <ItemCountLabel>
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </ItemCountLabel>
            </Header>

            <ItemsList>
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <Item
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                    transition={{ duration: 0.25 }}
                  >
                    <ItemInfo onClick={() => navigate(`/product/${item.id}`)}>
                      <ItemName>{item.name}</ItemName>
                      <ItemSub>{item.nameKr}</ItemSub>
                    </ItemInfo>
                    <ItemRight>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <ItemPrice>
                          {formatPrice(item.price * item.quantity)}
                        </ItemPrice>
                        <RemoveBtn
                          onClick={() => removeFromCart(item.id)}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.85 }}
                        >
                          &times;
                        </RemoveBtn>
                      </div>
                      <QuantityControl>
                        <QtyBtn
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          −
                        </QtyBtn>
                        <QtyNum>
                          <motion.span
                            key={item.quantity}
                            initial={{ y: -8, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 8, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            style={{ display: "inline-block" }}
                          >
                            {item.quantity}
                          </motion.span>
                        </QtyNum>
                        <QtyBtn
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </QtyBtn>
                      </QuantityControl>
                    </ItemRight>
                  </Item>
                ))}
              </AnimatePresence>
            </ItemsList>

            <DividerLine />

            <TotalRow>
              <TotalLabel>TOTAL</TotalLabel>
              <TotalAmount>
                <AnimatedNumber value={total} />
              </TotalAmount>
            </TotalRow>

            <CheckoutBtn
              onClick={() => navigate("/checkout")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              CHECKOUT
            </CheckoutBtn>

            <ShippingNote>배송비 별도</ShippingNote>
          </ReceiptCard>
        </Wrapper>
      )}
    </AnimatePresence>
  );
};
