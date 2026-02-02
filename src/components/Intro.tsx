import styled from '@emotion/styled';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const Section = styled.section`
  height: 600vh;
  position: relative;
`;

const Sticky = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--warm);
`;

const Background = styled(motion.div)`
  position: absolute;
  inset: 0;
`;

// 페이즈 컨테이너들
const Phase = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
`;

// 타이틀
const BigTitle = styled(motion.h1)`
  font-family: 'EB Garamond', serif;
  font-size: clamp(80px, 18vw, 240px);
  font-weight: 400;
  font-style: italic;
  line-height: 0.9;
  text-align: center;
  color: var(--black);
`;

// 인트로 3줄 구조
const IntroLine = styled(motion.p)<{ isMain?: boolean }>`
  font-family: ${({ isMain }) => isMain ? "'EB Garamond', serif" : "'Space Mono', monospace"};
  font-size: ${({ isMain }) => isMain ? 'clamp(48px, 12vw, 160px)' : 'clamp(18px, 3vw, 32px)'};
  font-style: ${({ isMain }) => isMain ? 'italic' : 'normal'};
  font-weight: 400;
  text-align: center;
  color: var(--black);
  letter-spacing: ${({ isMain }) => isMain ? 'normal' : '0.1em'};
  text-transform: ${({ isMain }) => isMain ? 'none' : 'uppercase'};
`;

const SmallText = styled(motion.p)`
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  text-align: center;
`;

const MediumText = styled(motion.p)`
  font-family: 'EB Garamond', serif;
  font-size: clamp(24px, 4vw, 48px);
  font-weight: 400;
  text-align: center;
  line-height: 1.4;
  max-width: 800px;
`;

const KoreanText = styled(motion.p)`
  font-family: 'Space Mono', monospace;
  font-size: clamp(14px, 2vw, 18px);
  letter-spacing: 0.05em;
  text-align: center;
`;

// 제품 오브들
const OrbsContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  margin-top: 60px;
`;

const Orb = styled(motion.div)<{ color: string }>`
  width: clamp(60px, 10vw, 100px);
  height: clamp(60px, 10vw, 100px);
  border-radius: 50%;
  background: ${({ color }) => color};
  box-shadow: 0 20px 60px ${({ color }) => color}40;
`;

// 성분 리스트
const IngredientsList = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  margin-top: 40px;
`;

const IngredientItem = styled(motion.div)`
  text-align: center;
`;

const IngredientName = styled.span`
  font-family: 'EB Garamond', serif;
  font-size: clamp(20px, 3vw, 32px);
  font-style: italic;
  display: block;
`;

const IngredientKr = styled.span`
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.15em;
  opacity: 0.5;
`;

// 라인
const HorizontalLine = styled(motion.div)`
  width: 80px;
  height: 1px;
  background: var(--black);
  margin: 40px 0;
`;

// 스크롤 인디케이터
const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const ScrollDot = styled(motion.div)`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--black);
`;

const ScrollTrack = styled.div`
  width: 1px;
  height: 40px;
  background: rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
`;

const ScrollFill = styled(motion.div)`
  width: 100%;
  background: var(--black);
  position: absolute;
  top: 0;
  left: 0;
`;

const colors = ['#A71B1B', '#37385A', '#ED6427'];

const ingredients = [
  { en: "Lion's Mane", kr: '노루궁뎅이버섯' },
  { en: 'Cordyceps', kr: '동충하초' },
  { en: 'Red Ginseng', kr: '홍삼' },
  { en: 'L-Theanine', kr: '테아닌' },
];

export const Intro = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  // Phase 1: 브랜드명 (0 - 0.15)
  const phase1Opacity = useTransform(scrollYProgress, [0, 0.1, 0.15, 0.2], [1, 1, 1, 0]);
  const phase1Scale = useTransform(scrollYProgress, [0, 0.15], [1, 1.1]);
  const phase1Y = useTransform(scrollYProgress, [0.1, 0.2], [0, -100]);

  // Phase 2: 서브카피 (0.15 - 0.35)
  const phase2Opacity = useTransform(scrollYProgress, [0.15, 0.2, 0.3, 0.35], [0, 1, 1, 0]);
  const phase2Y = useTransform(scrollYProgress, [0.15, 0.2, 0.3, 0.35], [50, 0, 0, -50]);

  // Phase 3: 제품 오브 (0.3 - 0.5)
  const phase3Opacity = useTransform(scrollYProgress, [0.3, 0.35, 0.45, 0.5], [0, 1, 1, 0]);
  const orb1Scale = useTransform(scrollYProgress, [0.3, 0.38], [0, 1]);
  const orb2Scale = useTransform(scrollYProgress, [0.33, 0.41], [0, 1]);
  const orb3Scale = useTransform(scrollYProgress, [0.36, 0.44], [0, 1]);

  // Phase 4: 성분 (0.45 - 0.7)
  const phase4Opacity = useTransform(scrollYProgress, [0.45, 0.5, 0.65, 0.7], [0, 1, 1, 0]);
  const ing1Opacity = useTransform(scrollYProgress, [0.48, 0.52], [0, 1]);
  const ing2Opacity = useTransform(scrollYProgress, [0.52, 0.56], [0, 1]);
  const ing3Opacity = useTransform(scrollYProgress, [0.56, 0.60], [0, 1]);
  const ing4Opacity = useTransform(scrollYProgress, [0.60, 0.64], [0, 1]);

  // Phase 5: 파이널 메시지 (0.65 - 0.85)
  const phase5Opacity = useTransform(scrollYProgress, [0.65, 0.72, 0.82, 0.88], [0, 1, 1, 0]);
  const phase5Scale = useTransform(scrollYProgress, [0.65, 0.72], [0.9, 1]);

  // 배경 전환 (0.85 - 1)
  const bgOpacity = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]);

  // 스크롤 인디케이터
  const scrollProgress = useTransform(scrollYProgress, [0, 0.85], ['0%', '100%']);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.02, 0.8, 0.85], [0, 1, 1, 0]);

  return (
    <Section ref={ref}>
      <Sticky>
        <Background style={{ backgroundColor: 'var(--black)', opacity: bgOpacity }} />

        {/* Phase 1: Lock In */}
        <Phase style={{ opacity: phase1Opacity, scale: phase1Scale, y: phase1Y }}>
          <IntroLine style={{ marginBottom: 8 }}>
            You need
          </IntroLine>
          <IntroLine 
            isMain 
            style={{ 
              marginBottom: 8,
            }}
          >
            Lock In Coffee
          </IntroLine>
          <IntroLine>
            .
          </IntroLine>
          <KoreanText style={{ color: 'var(--black)', opacity: 0.4, marginTop: 40 }}>
            뇌가 원하는 연료
          </KoreanText>
        </Phase>

        {/* Phase 2: 서브카피 */}
        <Phase style={{ opacity: phase2Opacity, y: phase2Y }}>
          <MediumText style={{ color: 'var(--black)', opacity: 0.8 }}>
            The focus you need,
            <br />
            without the crash you don't.
          </MediumText>
          <HorizontalLine style={{ opacity: 0.2 }} />
          <KoreanText style={{ color: 'var(--black)', opacity: 0.5 }}>
            필요한 집중력은 드리고, 불필요한 크래시는 드리지 않습니다
          </KoreanText>
        </Phase>

        {/* Phase 3: 제품 오브 */}
        <Phase style={{ opacity: phase3Opacity }}>
          <SmallText style={{ color: 'var(--black)', opacity: 0.4, marginBottom: 20 }}>
            Three Blends, One Ritual
          </SmallText>
          <OrbsContainer>
            <Orb color={colors[0]} style={{ scale: orb1Scale }} />
            <Orb color={colors[1]} style={{ scale: orb2Scale }} />
            <Orb color={colors[2]} style={{ scale: orb3Scale }} />
          </OrbsContainer>
          <SmallText style={{ color: 'var(--black)', opacity: 0.3, marginTop: 32, fontSize: 10 }}>
            Signature · House · Vibrant
          </SmallText>
          <KoreanText style={{ color: 'var(--black)', opacity: 0.4, marginTop: 16 }}>
            세 가지 블렌드, 하나의 루틴이 됩니다
          </KoreanText>
        </Phase>

        {/* Phase 4: 성분 */}
        <Phase style={{ opacity: phase4Opacity }}>
          <SmallText style={{ color: 'var(--black)', opacity: 0.4, marginBottom: 20 }}>
            Powered By Nature
          </SmallText>
          <IngredientsList>
            <IngredientItem style={{ opacity: ing1Opacity }}>
              <IngredientName>{ingredients[0].en}</IngredientName>
              <IngredientKr>{ingredients[0].kr}</IngredientKr>
            </IngredientItem>
            <IngredientItem style={{ opacity: ing2Opacity }}>
              <IngredientName>{ingredients[1].en}</IngredientName>
              <IngredientKr>{ingredients[1].kr}</IngredientKr>
            </IngredientItem>
            <IngredientItem style={{ opacity: ing3Opacity }}>
              <IngredientName>{ingredients[2].en}</IngredientName>
              <IngredientKr>{ingredients[2].kr}</IngredientKr>
            </IngredientItem>
            <IngredientItem style={{ opacity: ing4Opacity }}>
              <IngredientName>{ingredients[3].en}</IngredientName>
              <IngredientKr>{ingredients[3].kr}</IngredientKr>
            </IngredientItem>
          </IngredientsList>
          <KoreanText style={{ color: 'var(--black)', opacity: 0.4, marginTop: 32 }}>
            자연에서 온 집중력입니다
          </KoreanText>
        </Phase>

        {/* Phase 5: 파이널 */}
        <Phase style={{ opacity: phase5Opacity, scale: phase5Scale }}>
          <SmallText style={{ color: 'var(--black)', opacity: 0.4, marginBottom: 32 }}>
            Silicon Valley's Choice
          </SmallText>
          <MediumText style={{ color: 'var(--black)' }}>
            Engineered for those
            <br />
            who refuse to compromise.
          </MediumText>
          <KoreanText style={{ color: 'var(--black)', opacity: 0.5, marginTop: 24 }}>
            타협하지 않는 분들을 위해 설계했습니다
          </KoreanText>
          <HorizontalLine style={{ opacity: 0.2 }} />
          <SmallText style={{ color: 'var(--black)', opacity: 0.3, marginTop: 20 }}>
            The Zone Bio · Seoul
          </SmallText>
        </Phase>

        {/* 스크롤 인디케이터 */}
        <ScrollIndicator style={{ opacity: indicatorOpacity }}>
          <ScrollTrack>
            <ScrollFill style={{ height: scrollProgress }} />
          </ScrollTrack>
          <ScrollDot
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ opacity: 0.3 }}
          />
        </ScrollIndicator>
      </Sticky>
    </Section>
  );
};
