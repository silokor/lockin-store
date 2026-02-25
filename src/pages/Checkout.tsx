import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { Global } from '@emotion/react';
import { globalStyles } from '../styles/global';
import { useCart } from '../context/CartContext';

declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: {
          zonecode: string;
          address: string;
          addressType: string;
          bname: string;
          buildingName: string;
        }) => void;
      }) => { open: () => void };
    };
    TossPayments: (clientKey: string) => {
      requestPayment: (method: string, options: {
        amount: number;
        orderId: string;
        orderName: string;
        customerName: string;
        successUrl: string;
        failUrl: string;
      }) => Promise<void>;
    };
  }
}

const Page = styled.div`
  min-height: 100vh;
  background: var(--warm);
  padding-top: 120px;
  padding-bottom: 80px;
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
  background: var(--warm);
  border-bottom: 1px solid rgba(0,0,0,0.05);

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

const Logo = styled(Link)`
  font-family: 'EB Garamond', serif;
  font-size: 20px;
  font-style: italic;
  color: var(--black);
  text-decoration: none;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 60px;
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 80px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 60px;
    padding: 0 32px;
  }
`;

const FormSection = styled(motion.div)``;

const OrderSection = styled(motion.div)`
  @media (max-width: 1024px) {
    order: -1;
  }
`;

const SectionTitle = styled.h2`
  font-family: 'EB Garamond', serif;
  font-size: 32px;
  font-style: italic;
  font-weight: 400;
  margin-bottom: 40px;
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 48px;
`;

const Step = styled.div<{ active?: boolean; completed?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.1em;
  opacity: ${({ active, completed }) => (active || completed) ? 1 : 0.3};
  color: ${({ completed }) => completed ? '#37385A' : 'var(--black)'};
`;

const StepNumber = styled.span<{ active?: boolean; completed?: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  border: 1px solid ${({ active, completed }) => (active || completed) ? 'var(--black)' : 'rgba(0,0,0,0.2)'};
  background: ${({ active }) => active ? 'var(--black)' : 'transparent'};
  color: ${({ active }) => active ? 'var(--white)' : 'inherit'};
`;

const StepLine = styled.div<{ completed?: boolean }>`
  width: 40px;
  height: 1px;
  background: ${({ completed }) => completed ? 'var(--black)' : 'rgba(0,0,0,0.1)'};
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  display: block;
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  opacity: 0.5;
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 20px;
  border: 1px solid rgba(0,0,0,0.1);
  background: white;
  font-family: 'Space Mono', monospace;
  font-size: 14px;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:focus {
    outline: none;
    border-color: var(--black);
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  }

  &::placeholder {
    opacity: 0.3;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 16px 20px;
  border: 1px solid rgba(0,0,0,0.1);
  background: white;
  font-family: 'Space Mono', monospace;
  font-size: 14px;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;

  &:focus {
    outline: none;
    border-color: var(--black);
  }
`;

const AddressInputRow = styled.div`
  display: flex;
  gap: 12px;
`;

const AddressSearchBtn = styled.button`
  padding: 16px 24px;
  background: var(--black);
  border: none;
  color: var(--white);
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.1em;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.3s;

  &:hover {
    background: #333;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(0,0,0,0.08);
  margin: 40px 0;
`;

// Order Summary
const OrderCard = styled.div`
  background: white;
  padding: 32px;
  border: 1px solid rgba(0,0,0,0.05);
`;

const OrderTitle = styled.h3`
  font-family: 'EB Garamond', serif;
  font-size: 20px;
  font-style: italic;
  font-weight: 400;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
`;

const OrderItem = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(0,0,0,0.03);

  &:last-of-type {
    border-bottom: none;
  }
`;

const ItemColorDot = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ color }) => color};
  flex-shrink: 0;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.span`
  font-family: 'EB Garamond', serif;
  font-size: 16px;
  font-style: italic;
  display: block;
  margin-bottom: 4px;
`;

const ItemMeta = styled.span`
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  opacity: 0.4;
  letter-spacing: 0.05em;
`;

const ItemPrice = styled.span`
  font-family: 'EB Garamond', serif;
  font-size: 16px;
  font-style: italic;
`;

const ItemActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  border: 1px solid rgba(0,0,0,0.1);
`;

const QtyBtn = styled.button`
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  font-family: 'Space Mono', monospace;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: rgba(0,0,0,0.05);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const QtyNum = styled.span`
  width: 28px;
  text-align: center;
  font-family: 'Space Mono', monospace;
  font-size: 12px;
`;

const RemoveBtn = styled.button`
  width: 28px;
  height: 28px;
  background: none;
  border: 1px solid rgba(0,0,0,0.1);
  font-size: 16px;
  color: rgba(0,0,0,0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    color: #ED6427;
    border-color: #ED6427;
  }
`;

const QuantityBadge = styled.span`
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  padding: 4px 8px;
  background: rgba(0,0,0,0.05);
  margin-left: 8px;
`;

const SummaryRow = styled.div<{ bold?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 12px;
  
  span:first-of-type {
    font-family: 'Space Mono', monospace;
    font-size: ${({ bold }) => bold ? '11px' : '10px'};
    letter-spacing: 0.1em;
    opacity: ${({ bold }) => bold ? 1 : 0.5};
    text-transform: uppercase;
  }
  
  span:last-child {
    font-family: 'EB Garamond', serif;
    font-size: ${({ bold }) => bold ? '28px' : '16px'};
    font-style: italic;
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 18px 32px;
  background: var(--black);
  border: none;
  color: var(--white);
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  cursor: pointer;
  margin-top: 24px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyCart = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 24px;
  opacity: 0.2;
`;

const EmptyText = styled.p`
  font-family: 'EB Garamond', serif;
  font-size: 20px;
  font-style: italic;
  opacity: 0.5;
  margin-bottom: 24px;
`;

const ShopLink = styled(Link)`
  display: inline-block;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.15em;
  color: var(--black);
  text-decoration: none;
  padding: 14px 28px;
  border: 1px solid var(--black);
  transition: all 0.3s;

  &:hover {
    background: var(--black);
    color: var(--white);
  }
`;

// 성공 모달
const SuccessOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
`;

const SuccessCard = styled(motion.div)`
  background: white;
  padding: 60px;
  max-width: 500px;
  text-align: center;
`;

const SuccessIcon = styled.div`
  font-size: 56px;
  margin-bottom: 24px;
`;

const SuccessTitle = styled.h2`
  font-family: 'EB Garamond', serif;
  font-size: 36px;
  font-style: italic;
  font-weight: 400;
  margin-bottom: 16px;
`;

const SuccessText = styled.p`
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  line-height: 1.8;
  opacity: 0.6;
  margin-bottom: 32px;
`;

const SuccessButton = styled(Link)`
  display: inline-block;
  padding: 16px 40px;
  background: var(--black);
  color: var(--white);
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.15em;
  text-decoration: none;
`;

type CheckoutStep = 'shipping' | 'payment';

export const Checkout = () => {
  const navigate = useNavigate();
  const { items, total, clearCart, updateQuantity, removeFromCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [shipping, setShipping] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    addressDetail: '',
    zipCode: '',
    memo: ''
  });

  const [payment, setPayment] = useState({
    method: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: ''
  });

  const shippingFee = 0;
  const grandTotal = total + shippingFee;

  const formatPrice = (price: number) => `₩${price.toLocaleString()}`;

  const isShippingValid = shipping.name && shipping.phone && shipping.email && shipping.address && shipping.zipCode;
  const isPaymentValid = payment.cardNumber && payment.cardExpiry && payment.cardCvc && payment.cardName;

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
          if (data.bname !== '') {
            extraAddress += data.bname;
          }
          if (data.buildingName !== '') {
            extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
          }
          fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        }

        setShipping(prev => ({
          ...prev,
          zipCode: data.zonecode,
          address: fullAddress
        }));
      }
    }).open();
  };

  const handleShippingSubmit = () => {
    if (isShippingValid) {
      setStep('payment');
    }
  };

  const handlePaymentSubmit = async () => {
    setIsProcessing(true);
    
    try {
      // 토스페이먼츠 테스트 클라이언트 키
      const clientKey = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';
      const tossPayments = window.TossPayments(clientKey);
      
      // 주문 ID 생성 (고유해야 함)
      const orderId = `LOCKIN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // 주문명 생성
      const orderName = items.length === 1 
        ? items[0].name 
        : `${items[0].name} 외 ${items.length - 1}건`;
      
      await tossPayments.requestPayment('카드', {
        amount: grandTotal,
        orderId: orderId,
        orderName: orderName,
        customerName: shipping.name,
        successUrl: `${window.location.origin}/checkout?success=true`,
        failUrl: `${window.location.origin}/checkout?fail=true`,
      });
    } catch (error) {
      // User closed payment window
      console.log('Payment cancelled:', error);
    }
    
    setIsProcessing(false);
  };

  if (items.length === 0 && !showSuccess) {
    return (
      <Page>
        <Global styles={globalStyles} />
        <Nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <BackLink to="/">← CONTINUE SHOPPING</BackLink>
          <Logo to="/">Lock In</Logo>
        </Nav>
        <Container>
          <EmptyCart>
            <EmptyIcon>🛒</EmptyIcon>
            <EmptyText>Your cart is empty</EmptyText>
            <ShopLink to="/">EXPLORE COLLECTION</ShopLink>
          </EmptyCart>
        </Container>
      </Page>
    );
  }

  return (
    <Page>
      <Global styles={globalStyles} />
      
      <Nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <BackLink to="/">← CONTINUE SHOPPING</BackLink>
        <Logo to="/">Lock In</Logo>
      </Nav>

      <Container>
        <FormSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SectionTitle>Checkout</SectionTitle>
          
          <StepIndicator>
            <Step active={step === 'shipping'} completed={step === 'payment'}>
              <StepNumber active={step === 'shipping'} completed={step === 'payment'}>
                {step === 'payment' ? '✓' : '1'}
              </StepNumber>
              SHIPPING
            </Step>
            <StepLine completed={step === 'payment'} />
            <Step active={step === 'payment'}>
              <StepNumber active={step === 'payment'}>2</StepNumber>
              PAYMENT
            </Step>
          </StepIndicator>

          <AnimatePresence mode="wait">
            {step === 'shipping' ? (
              <motion.div
                key="shipping"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <FormRow>
                  <FormGroup>
                    <Label>Name *</Label>
                    <Input
                      type="text"
                      placeholder="Your name"
                      value={shipping.name}
                      onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Phone *</Label>
                    <Input
                      type="tel"
                      placeholder="010-0000-0000"
                      value={shipping.phone}
                      onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                    />
                  </FormGroup>
                </FormRow>

                <FormGroup>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={shipping.email}
                    onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Zip Code *</Label>
                  <AddressInputRow>
                    <Input
                      type="text"
                      placeholder="12345"
                      value={shipping.zipCode}
                      readOnly
                      style={{ flex: 1, cursor: 'pointer', background: '#fafafa' }}
                      onClick={handleAddressSearch}
                    />
                    <AddressSearchBtn type="button" onClick={handleAddressSearch}>
                      SEARCH
                    </AddressSearchBtn>
                  </AddressInputRow>
                </FormGroup>

                <FormGroup>
                  <Label>Address *</Label>
                  <Input
                    type="text"
                    placeholder="Click to search address"
                    value={shipping.address}
                    readOnly
                    style={{ cursor: 'pointer', background: '#fafafa' }}
                    onClick={handleAddressSearch}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Address Detail</Label>
                  <Input
                    type="text"
                    placeholder="Apt 101"
                    value={shipping.addressDetail}
                    onChange={(e) => setShipping({ ...shipping, addressDetail: e.target.value })}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Delivery Memo</Label>
                  <Select
                    value={shipping.memo}
                    onChange={(e) => setShipping({ ...shipping, memo: e.target.value })}
                  >
                    <option value="">Select an option</option>
                    <option value="door">Leave at door</option>
                    <option value="guard">Leave with security</option>
                    <option value="call">Call before delivery</option>
                    <option value="box">Put in delivery box</option>
                  </Select>
                </FormGroup>

                <SubmitButton
                  onClick={handleShippingSubmit}
                  disabled={!isShippingValid}
                  whileHover={{ scale: isShippingValid ? 1.01 : 1 }}
                  whileTap={{ scale: isShippingValid ? 0.99 : 1 }}
                >
                  CONTINUE TO PAYMENT
                </SubmitButton>
              </motion.div>
            ) : (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div style={{ 
                  padding: '32px', 
                  background: 'white', 
                  border: '1px solid rgba(0,0,0,0.08)',
                  marginBottom: 24,
                  textAlign: 'center'
                }}>
                  <div style={{ 
                    fontFamily: 'EB Garamond', 
                    fontSize: 24, 
                    fontStyle: 'italic',
                    marginBottom: 12 
                  }}>
                    Toss Payments
                  </div>
                  <div style={{ 
                    fontFamily: 'Space Mono', 
                    fontSize: 11, 
                    opacity: 0.5,
                    lineHeight: 1.8
                  }}>
                    Click the button below<br />
                    to open the payment window
                  </div>
                </div>

                <Divider />

                <div style={{ opacity: 0.5, marginBottom: 24 }}>
                  <div style={{ fontFamily: 'Space Mono', fontSize: 10, letterSpacing: '0.1em', marginBottom: 8 }}>
                    SHIPPING TO
                  </div>
                  <div style={{ fontFamily: 'EB Garamond', fontSize: 15, fontStyle: 'italic' }}>
                    {shipping.name} · {shipping.phone}
                  </div>
                  <div style={{ fontFamily: 'Space Mono', fontSize: 12, opacity: 0.7 }}>
                    {shipping.address} {shipping.addressDetail}
                  </div>
                  <button
                    onClick={() => setStep('shipping')}
                    style={{
                      marginTop: 12,
                      background: 'none',
                      border: 'none',
                      fontFamily: 'Space Mono',
                      fontSize: 10,
                      letterSpacing: '0.1em',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      opacity: 0.6
                    }}
                  >
                    EDIT
                  </button>
                </div>

                <SubmitButton
                  onClick={handlePaymentSubmit}
                  disabled={isProcessing}
                  whileHover={{ scale: !isProcessing ? 1.01 : 1 }}
                  whileTap={{ scale: !isProcessing ? 0.99 : 1 }}
                >
                  {isProcessing ? 'PROCESSING...' : `PAY ${formatPrice(grandTotal)} WITH TOSS`}
                </SubmitButton>
              </motion.div>
            )}
          </AnimatePresence>
        </FormSection>

        <OrderSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <OrderCard>
            <OrderTitle>Order Summary</OrderTitle>

            {items.map((item) => (
              <OrderItem key={item.id}>
                <ItemColorDot color={item.color} />
                <ItemInfo>
                  <ItemName>{item.name}</ItemName>
                  <ItemMeta>{item.nameKr}</ItemMeta>
                </ItemInfo>
                <ItemActions>
                  <ItemPrice>{formatPrice(item.price * item.quantity)}</ItemPrice>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <QuantityControl>
                      <QtyBtn onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>−</QtyBtn>
                      <QtyNum>{item.quantity}</QtyNum>
                      <QtyBtn onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</QtyBtn>
                    </QuantityControl>
                    <RemoveBtn onClick={() => removeFromCart(item.id)}>×</RemoveBtn>
                  </div>
                </ItemActions>
              </OrderItem>
            ))}

            <Divider />

            <SummaryRow>
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </SummaryRow>
            <SummaryRow>
              <span>Shipping</span>
              <span>{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}</span>
            </SummaryRow>
            <Divider />

            <SummaryRow bold>
              <span>Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </SummaryRow>
          </OrderCard>
        </OrderSection>
      </Container>

      <AnimatePresence>
        {showSuccess && (
          <SuccessOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SuccessCard
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <SuccessIcon>✓</SuccessIcon>
              <SuccessTitle>Order Confirmed</SuccessTitle>
              <SuccessText>
                Thank you for your order.<br />
                We'll send you a confirmation email shortly.
              </SuccessText>
              <SuccessButton to="/">BACK TO SHOP</SuccessButton>
            </SuccessCard>
          </SuccessOverlay>
        )}
      </AnimatePresence>
    </Page>
  );
};
