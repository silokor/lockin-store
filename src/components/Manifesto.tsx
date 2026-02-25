import styled from '@emotion/styled';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const Section = styled.section`
  min-height: 200vh;
  background: var(--black);
  color: var(--white);
  position: relative;
  overflow: hidden;
`;

const Sticky = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10vw;
`;

// 배경 텍스트
const BgText = styled(motion.div)`
  position: absolute;
  font-family: 'EB Garamond', serif;
  font-size: clamp(200px, 40vw, 500px);
  font-weight: 400;
  font-style: italic;
  opacity: 0.03;
  white-space: nowrap;
  user-select: none;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

// 메인 컨텐츠
const Content = styled(motion.div)`
  max-width: 900px;
  text-align: center;
  z-index: 10;
`;

const Eyebrow = styled(motion.span)`
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  opacity: 0.4;
  display: block;
  margin-bottom: 48px;
`;

const MainCopy = styled(motion.h2)`
  font-family: 'EB Garamond', serif;
  font-size: clamp(36px, 6vw, 72px);
  font-weight: 400;
  line-height: 1.3;
  margin-bottom: 48px;
`;

const Highlight = styled.span`
  font-style: italic;
  color: #ED6427;
`;

const Description = styled(motion.p)`
  font-family: 'EB Garamond', serif;
  font-size: clamp(16px, 2vw, 20px);
  line-height: 1.8;
  opacity: 0.6;
  max-width: 600px;
  margin: 0 auto 48px;
`;

const Ingredients = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 48px;
  flex-wrap: wrap;
`;

const Ingredient = styled(motion.div)`
  text-align: center;
`;

const IngredientName = styled.span`
  font-family: 'EB Garamond', serif;
  font-size: 18px;
  font-style: italic;
  display: block;
  margin-bottom: 4px;
`;

const IngredientKr = styled.span`
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.1em;
  opacity: 0.4;
`;

// 사이드 요소
const SideText = styled(motion.span)<{ side: 'left' | 'right' }>`
  position: absolute;
  ${({ side }) => side}: 40px;
  top: 50%;
  transform: translateY(-50%);
  writing-mode: vertical-rl;
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  opacity: 0.2;

  @media (max-width: 768px) {
    display: none;
  }
`;

const ingredients = [
  { en: "Lion's Mane", kr: 'Brain Focus' },
  { en: 'Cordyceps', kr: 'Energy Flow' },
  { en: 'Red Ginseng', kr: 'Vitality' },
  { en: 'L-Theanine', kr: 'Calm Focus' },
];

export const Manifesto = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const bgScale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1.2]);

  return (
    <Section ref={ref}>
      <Sticky>
        <BgText style={{ scale: bgScale }}>Focus</BgText>

        <SideText side="left">Silicon Valley's Choice</SideText>
        <SideText side="right">Since 2026</SideText>

        <Content style={{ y }}>
          <Eyebrow
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.4 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            Why Lock In
          </Eyebrow>

          <MainCopy
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Engineered for those who refuse to choose between <Highlight>ambition</Highlight> and <Highlight>well-being.</Highlight>
          </MainCopy>

          <Description
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 0.6, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            viewport={{ once: true }}
          >
            The next-gen beverage chosen by Silicon Valley's top 1%.
            <br />
            Precision engineering in every cup.
          </Description>

          <Ingredients
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            viewport={{ once: true }}
          >
            {ingredients.map((item, i) => (
              <Ingredient
                key={item.en}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + i * 0.1 }}
                viewport={{ once: true }}
              >
                <IngredientName>{item.en}</IngredientName>
                <IngredientKr>{item.kr}</IngredientKr>
              </Ingredient>
            ))}
          </Ingredients>
        </Content>
      </Sticky>
    </Section>
  );
};
