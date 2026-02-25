import { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
`;

const Modal = styled(motion.div)`
  background: var(--warm);
  width: 100%;
  max-width: 480px;
  position: relative;
  overflow: hidden;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  opacity: 0.4;
  transition: opacity 0.3s;
  z-index: 10;

  &:hover {
    opacity: 1;
  }
`;

const Header = styled.div<{ color: string }>`
  background: ${({ color }) => color};
  padding: 48px 40px 40px;
  color: white;
  text-align: center;
`;

const HeaderTitle = styled.h2`
  font-family: 'EB Garamond', serif;
  font-size: 32px;
  font-style: italic;
  font-weight: 400;
  margin-bottom: 8px;
`;

const HeaderSub = styled.p`
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.1em;
  opacity: 0.8;
`;

const Body = styled.div`
  padding: 40px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div``;

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

const SubmitButton = styled(motion.button)<{ color: string }>`
  width: 100%;
  padding: 18px 32px;
  background: ${({ color }) => color};
  border: none;
  color: white;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  cursor: pointer;
  margin-top: 8px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Note = styled.p`
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  opacity: 0.4;
  text-align: center;
  margin-top: 16px;
  line-height: 1.6;
`;

// Success State
const SuccessContent = styled(motion.div)`
  padding: 60px 40px;
  text-align: center;
`;

const SuccessIcon = styled.div`
  font-size: 56px;
  margin-bottom: 24px;
`;

const SuccessTitle = styled.h2`
  font-family: 'EB Garamond', serif;
  font-size: 32px;
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

const CloseButton = styled(motion.button)`
  padding: 16px 40px;
  background: var(--black);
  border: none;
  color: var(--white);
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.15em;
  cursor: pointer;
`;

// Google Apps Script Web App URL
const WAITLIST_API = 'https://script.google.com/macros/s/AKfycby88MuyWmfLkwMlh-ZuJASo4C7AVdpiCLQ7Wicu4doe-iUVTvhXFO85KVMZsvtVcIRz/exec';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productColor: string;
}

export const WaitlistModal = ({ isOpen, onClose, productName, productColor }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    source: ''
  });

  const isValid = form.name && form.email && form.email.includes('@');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      const payload = {
        ...form,
        product: productName,
        timestamp: new Date().toISOString()
      };

      // Send to Google Apps Script
      await fetch(WAITLIST_API, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // Always show success (no-cors doesn't return response)
      setIsSuccess(true);
    } catch (error) {
      console.error('Waitlist error:', error);
      // Still show success for UX (data might have been saved)
      setIsSuccess(true);
    }

    setIsSubmitting(false);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setForm({ name: '', email: '', phone: '', source: '' });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <Modal
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseBtn onClick={handleClose}>×</CloseBtn>

            <AnimatePresence mode="wait">
              {isSuccess ? (
                <SuccessContent
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <SuccessIcon>✓</SuccessIcon>
                  <SuccessTitle>You're on the list</SuccessTitle>
                  <SuccessText>
                    We'll notify you when {productName} is available.
                    <br />
                    Thank you for your interest.
                  </SuccessText>
                  <CloseButton
                    onClick={handleClose}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    CLOSE
                  </CloseButton>
                </SuccessContent>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Header color={productColor}>
                    <HeaderTitle>Join the Waitlist</HeaderTitle>
                    <HeaderSub>{productName}</HeaderSub>
                  </Header>

                  <Body>
                    <Form onSubmit={handleSubmit}>
                      <FormGroup>
                        <Label>Name *</Label>
                        <Input
                          type="text"
                          placeholder="Your name"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          required
                        />
                      </FormGroup>

                      <FormGroup>
                        <Label>Email *</Label>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          required
                        />
                      </FormGroup>

                      <FormGroup>
                        <Label>Phone (Optional)</Label>
                        <Input
                          type="tel"
                          placeholder="010-0000-0000"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                      </FormGroup>

                      <FormGroup>
                        <Label>How did you hear about us? (Optional)</Label>
                        <Select
                          value={form.source}
                          onChange={(e) => setForm({ ...form, source: e.target.value })}
                        >
                          <option value="">Select an option</option>
                          <option value="instagram">Instagram</option>
                          <option value="twitter">Twitter / X</option>
                          <option value="youtube">YouTube</option>
                          <option value="friend">Friend / Word of mouth</option>
                          <option value="search">Google / Search</option>
                          <option value="other">Other</option>
                        </Select>
                      </FormGroup>

                      <SubmitButton
                        color={productColor}
                        type="submit"
                        disabled={!isValid || isSubmitting}
                        whileHover={{ scale: isValid ? 1.02 : 1 }}
                        whileTap={{ scale: isValid ? 0.98 : 1 }}
                      >
                        {isSubmitting ? 'SUBMITTING...' : 'JOIN WAITLIST'}
                      </SubmitButton>
                    </Form>

                    <Note>
                      We'll only contact you about product availability.
                      <br />
                      No spam, ever.
                    </Note>
                  </Body>
                </motion.div>
              )}
            </AnimatePresence>
          </Modal>
        </Overlay>
      )}
    </AnimatePresence>
  );
};
