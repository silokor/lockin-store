import styled from '@emotion/styled';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef } from 'react';

/* ─── Styled Components ─── */

const Section = styled.section`
  height: 700vh;
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
  perspective: 1200px;
  perspective-origin: 50% 50%;
`;

const Background = styled(motion.div)`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

const RadialWipe = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: var(--black);
  pointer-events: none;
`;

const Phase = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  transform-style: preserve-3d;
`;

/* ─── Phase 1 ─── */

const TitleRow = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  transform-style: preserve-3d;
`;

const Letter = styled(motion.span)`
  font-family: 'EB Garamond', serif;
  font-size: clamp(64px, 14vw, 200px);
  font-weight: 400;
  font-style: italic;
  line-height: 0.95;
  color: var(--black);
  display: inline-block;
  will-change: transform;
`;

const SubLine = styled(motion.p)`
  font-family: 'Space Mono', monospace;
  font-size: clamp(14px, 2.5vw, 24px);
  font-weight: 400;
  text-align: center;
  color: var(--black);
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const MassiveLine = styled(motion.div)`
  height: 1px;
  background: var(--black);
  margin-top: 48px;
  will-change: transform;
`;

/* ─── Phase 2 ─── */

const MediumText = styled(motion.p)`
  font-family: 'EB Garamond', serif;
  font-size: clamp(24px, 4vw, 48px);
  font-weight: 400;
  text-align: center;
  line-height: 1.4;
  max-width: 800px;
  will-change: transform, filter;
`;

const KoreanText = styled(motion.p)`
  font-family: 'Space Mono', monospace;
  font-size: clamp(14px, 2vw, 18px);
  letter-spacing: 0.05em;
  text-align: center;
`;

const ThinLine = styled(motion.div)`
  width: 80px;
  height: 1px;
  background: var(--black);
  margin: 40px 0;
`;

/* ─── Phase 3 ─── */

const SmallText = styled(motion.p)`
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  text-align: center;
  width: 100%;
`;

const OrbsRing = styled(motion.div)`
  position: relative;
  width: clamp(200px, 35vw, 360px);
  height: clamp(200px, 35vw, 360px);
  transform-style: preserve-3d;
`;

const OrbWrapper = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform-style: preserve-3d;
`;

const Orb = styled(motion.div)<{ color: string }>`
  width: clamp(60px, 10vw, 100px);
  height: clamp(60px, 10vw, 100px);
  border-radius: 50%;
  background: ${({ color }) => `radial-gradient(circle at 35% 35%, ${color}dd, ${color})`};
  box-shadow: 0 20px 60px ${({ color }) => color}40,
    inset 0 -4px 12px rgba(0, 0, 0, 0.25);
  position: relative;
  transform: translate(-50%, -50%);

  &::after {
    content: '';
    position: absolute;
    top: 14%;
    left: 22%;
    width: 36%;
    height: 28%;
    border-radius: 50%;
    background: radial-gradient(
      ellipse at center,
      rgba(255, 255, 255, 0.55) 0%,
      rgba(255, 255, 255, 0) 70%
    );
    transform: rotate(-25deg);
    pointer-events: none;
  }
`;

/* ─── Phase 4 ─── */

const IngredientsWrap = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  position: relative;
  transform-style: preserve-3d;
`;

const VerticalConnector = styled(motion.div)`
  width: 1px;
  background: var(--black);
  position: absolute;
  left: 50%;
  top: 0;
  transform-origin: top center;
`;

const IngredientItem = styled(motion.div)`
  text-align: center;
  padding: 18px 0;
  transform-style: preserve-3d;
  will-change: transform;
`;

const IngredientName = styled.span`
  font-family: 'EB Garamond', serif;
  font-size: clamp(22px, 3.5vw, 36px);
  font-style: italic;
  display: block;
`;

const IngredientKr = styled.span`
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.15em;
  opacity: 0.5;
`;

/* ─── Phase 5 ─── */

const FinalText = styled(motion.p)`
  font-family: 'EB Garamond', serif;
  font-size: clamp(24px, 4vw, 48px);
  font-weight: 400;
  text-align: center;
  line-height: 1.4;
  max-width: 800px;
  will-change: transform;
`;

/* ─── Scroll Indicator ─── */

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

const ScrollTrack = styled.div`
  width: 1px;
  height: 40px;
  background: rgba(0, 0, 0, 0.1);
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

const ScrollDot = styled(motion.div)`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--black);
`;

/* ─── Data ─── */

const colors = ['#A71B1B', '#37385A', '#ED6427'];

const ingredients = [
  { en: "Lion's Mane", kr: '노루궁뎅이버섯' },
  { en: 'Cordyceps', kr: '동충하초' },
  { en: 'Red Ginseng', kr: '홍삼' },
  { en: 'L-Theanine', kr: '테아닌' },
];

const titleText = 'Lock In Coffee';
const letterOffsets = titleText.split('').map((_, i) => i * 0.012);

/* ─── Helper: useTransformMulti ─── */

function useBlur(progress: MotionValue<number>, input: number[], output: number[]) {
  return useTransform(progress, input, output.map((v) => `blur(${v}px)`));
}

/* ─── Component ─── */

export const Intro = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  /* ========== PHASE 1: Brand Title (0 – 0.18) ========== */
  const p1Opacity = useTransform(scrollYProgress, [0, 0.12, 0.16, 0.2], [1, 1, 0.8, 0]);
  const p1RotateX = useTransform(scrollYProgress, [0, 0.14], [15, 0]);
  const p1TranslateZ = useTransform(scrollYProgress, [0, 0.14], [-500, 0]);
  const p1Y = useTransform(scrollYProgress, [0.14, 0.2], [0, -120]);

  // individual letter parallax offsets
  const letterTranslateZArr = titleText.split('').map((_, i) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTransform(
      scrollYProgress,
      [0, 0.14],
      [-500 - i * 40, 0]
    )
  );
  const letterOpacityArr = titleText.split('').map((_, i) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTransform(
      scrollYProgress,
      [letterOffsets[i], letterOffsets[i] + 0.06],
      [0, 1]
    )
  );

  // massive horizontal line
  const lineScaleX = useTransform(scrollYProgress, [0.04, 0.13], [0, 1]);
  const lineOpacity = useTransform(scrollYProgress, [0.04, 0.08, 0.16, 0.2], [0, 0.25, 0.25, 0]);

  // sub-lines
  const subLineOpacity = useTransform(scrollYProgress, [0.01, 0.05], [0, 0.5]);

  /* ========== PHASE 2: Subcopy (0.17 – 0.35) ========== */
  const p2Opacity = useTransform(scrollYProgress, [0.17, 0.22, 0.3, 0.35], [0, 1, 1, 0]);
  const p2TranslateZ = useTransform(scrollYProgress, [0.17, 0.24], [200, 0]);
  const p2Blur = useBlur(scrollYProgress, [0.17, 0.24], [8, 0]);
  const p2Y = useTransform(scrollYProgress, [0.3, 0.35], [0, -60]);

  /* ========== PHASE 3: Product Orbs (0.32 – 0.52) ========== */
  const p3Opacity = useTransform(scrollYProgress, [0.32, 0.37, 0.48, 0.52], [0, 1, 1, 0]);
  const p3RotateY = useTransform(scrollYProgress, [0.32, 0.37], [-15, 0]);

  // orbit angle driven by scroll
  const orbitAngle = useTransform(scrollYProgress, [0.32, 0.52], [0, 360]);
  // individual orb radius for scale-in
  const orbScale0 = useTransform(scrollYProgress, [0.33, 0.38], [0, 1]);
  const orbScale1 = useTransform(scrollYProgress, [0.35, 0.40], [0, 1]);
  const orbScale2 = useTransform(scrollYProgress, [0.37, 0.42], [0, 1]);
  const orbScales = [orbScale0, orbScale1, orbScale2];

  /* ========== PHASE 4: Ingredients (0.48 – 0.72) ========== */
  const p4Opacity = useTransform(scrollYProgress, [0.48, 0.53, 0.67, 0.72], [0, 1, 1, 0]);

  const ingAnimations = ingredients.map((_, i) => {
    const start = 0.51 + i * 0.04;
    return {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      opacity: useTransform(scrollYProgress, [start, start + 0.035], [0, 1]),
      // eslint-disable-next-line react-hooks/rules-of-hooks
      translateZ: useTransform(scrollYProgress, [start, start + 0.04], [150 + i * 60, 0]),
      // eslint-disable-next-line react-hooks/rules-of-hooks
      rotateX: useTransform(scrollYProgress, [start, start + 0.04], [20 * (i % 2 === 0 ? 1 : -1), 0]),
      // eslint-disable-next-line react-hooks/rules-of-hooks
      rotateY: useTransform(scrollYProgress, [start, start + 0.04], [15 * (i % 2 === 0 ? -1 : 1), 0]),
    };
  });

  // vertical connector line
  const connectorHeight = useTransform(scrollYProgress, [0.51, 0.66], ['0%', '100%']);
  const connectorOpacity = useTransform(scrollYProgress, [0.51, 0.54, 0.67, 0.72], [0, 0.15, 0.15, 0]);

  /* ========== PHASE 5: Final Punch (0.68 – 0.88) ========== */
  const p5Opacity = useTransform(scrollYProgress, [0.68, 0.74, 0.84, 0.9], [0, 1, 1, 0]);
  // punch: scale from 0.5 -> 1.5 -> 1.0
  const p5Scale = useTransform(scrollYProgress, [0.68, 0.74, 0.78], [0.5, 1.5, 1.0]);
  const p5RotateX = useTransform(scrollYProgress, [0.68, 0.76], [8, 0]);

  /* ========== Background radial wipe (0.86 – 1) ========== */
  const wipeScale = useTransform(scrollYProgress, [0.86, 0.98], [0, 3.5]);
  const wipeOpacity = useTransform(scrollYProgress, [0.86, 0.92], [0, 1]);

  /* ========== Scroll Indicator ========== */
  const scrollProgress = useTransform(scrollYProgress, [0, 0.88], ['0%', '100%']);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.02, 0.82, 0.88], [0, 1, 1, 0]);

  return (
    <Section ref={ref}>
      <Sticky>
        {/* Radial wipe background */}
        <RadialWipe
          style={{
            opacity: wipeOpacity,
            scale: wipeScale,
            borderRadius: '50%',
            background: 'var(--black)',
          }}
        />

        {/* ── Phase 1: Brand Title ── */}
        <Phase
          style={{
            opacity: p1Opacity,
            rotateX: p1RotateX,
            translateZ: p1TranslateZ,
            y: p1Y,
          }}
        >
          <SubLine style={{ opacity: subLineOpacity, marginBottom: 12 }}>
            You need
          </SubLine>

          <TitleRow>
            {titleText.split('').map((char, i) => (
              <Letter
                key={i}
                style={{
                  translateZ: letterTranslateZArr[i],
                  opacity: letterOpacityArr[i],
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </Letter>
            ))}
          </TitleRow>

          <SubLine style={{ opacity: subLineOpacity, marginTop: 12 }}>
            .
          </SubLine>

          <KoreanText style={{ color: 'var(--black)', opacity: 0.4, marginTop: 40 }}>
            뇌가 원하는 연료
          </KoreanText>

          <MassiveLine
            style={{
              scaleX: lineScaleX,
              opacity: lineOpacity,
              width: '80vw',
              transformOrigin: 'center',
            }}
          />
        </Phase>

        {/* ── Phase 2: Subcopy ── */}
        <Phase
          style={{
            opacity: p2Opacity,
            translateZ: p2TranslateZ,
            y: p2Y,
          }}
        >
          <MediumText style={{ color: 'var(--black)', opacity: 0.8, filter: p2Blur }}>
            The focus you need,
            <br />
            without the crash you don't.
          </MediumText>
          <ThinLine style={{ opacity: 0.2 }} />
          <KoreanText style={{ color: 'var(--black)', opacity: 0.5, filter: p2Blur }}>
            필요한 집중력은 드리고, 불필요한 크래시는 드리지 않습니다
          </KoreanText>
        </Phase>

        {/* ── Phase 3: Product Orbs ── */}
        <Phase
          style={{
            opacity: p3Opacity,
            rotateY: p3RotateY,
          }}
        >
          <SmallText style={{ color: 'var(--black)', opacity: 0.4, marginBottom: 24 }}>
            Three Blends, One Ritual
          </SmallText>

          <OrbsRing>
            {colors.map((color, i) => {
              const baseAngle = (360 / 3) * i;
              return (
                <OrbWrapperAnimated
                  key={i}
                  orbitAngle={orbitAngle}
                  baseAngle={baseAngle}
                  radius={typeof window !== 'undefined' ? Math.min(window.innerWidth * 0.12, 120) : 120}
                  scale={orbScales[i]}
                  color={color}
                />
              );
            })}
          </OrbsRing>

          <SmallText
            style={{
              color: 'var(--black)',
              opacity: 0.3,
              marginTop: 24,
              fontSize: 10,
              letterSpacing: '0.15em',
            }}
          >
            Signature · House · Vibrant
          </SmallText>
          <KoreanText style={{ color: 'var(--black)', opacity: 0.4, marginTop: 12 }}>
            세 가지 블렌드, 하나의 루틴이 됩니다
          </KoreanText>
        </Phase>

        {/* ── Phase 4: Ingredients ── */}
        <Phase style={{ opacity: p4Opacity }}>
          <SmallText style={{ color: 'var(--black)', opacity: 0.4, marginBottom: 20 }}>
            Powered By Nature
          </SmallText>

          <IngredientsWrap>
            <VerticalConnector
              style={{
                height: connectorHeight,
                opacity: connectorOpacity,
              }}
            />
            {ingredients.map((ing, i) => (
              <IngredientItem
                key={i}
                style={{
                  opacity: ingAnimations[i].opacity,
                  translateZ: ingAnimations[i].translateZ,
                  rotateX: ingAnimations[i].rotateX,
                  rotateY: ingAnimations[i].rotateY,
                }}
              >
                <IngredientName>{ing.en}</IngredientName>
                <IngredientKr>{ing.kr}</IngredientKr>
              </IngredientItem>
            ))}
          </IngredientsWrap>

          <KoreanText style={{ color: 'var(--black)', opacity: 0.4, marginTop: 32 }}>
            자연에서 온 집중력입니다
          </KoreanText>
        </Phase>

        {/* ── Phase 5: Final Punch ── */}
        <Phase
          style={{
            opacity: p5Opacity,
            scale: p5Scale,
            rotateX: p5RotateX,
          }}
        >
          <SmallText style={{ color: 'var(--black)', opacity: 0.4, marginBottom: 32 }}>
            Silicon Valley's Choice
          </SmallText>
          <FinalText style={{ color: 'var(--black)' }}>
            Engineered for those
            <br />
            who refuse to compromise.
          </FinalText>
          <KoreanText style={{ color: 'var(--black)', opacity: 0.5, marginTop: 24 }}>
            타협하지 않는 분들을 위해 설계했습니다
          </KoreanText>
          <ThinLine style={{ opacity: 0.2 }} />
          <SmallText style={{ color: 'var(--black)', opacity: 0.3, marginTop: 20 }}>
            The Zone Bio · Seoul
          </SmallText>
        </Phase>

        {/* ── Scroll Indicator ── */}
        <ScrollIndicator style={{ opacity: indicatorOpacity }}>
          <ScrollTrack>
            <ScrollFill style={{ height: scrollProgress }} />
          </ScrollTrack>
          <ScrollDot
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ opacity: 0.3 }}
          />
        </ScrollIndicator>
      </Sticky>
    </Section>
  );
};

/* ─── Orb Orbit Sub-component ─── */

interface OrbWrapperAnimatedProps {
  orbitAngle: MotionValue<number>;
  baseAngle: number;
  radius: number;
  scale: MotionValue<number>;
  color: string;
}

function OrbWrapperAnimated({
  orbitAngle,
  baseAngle,
  radius,
  scale,
  color,
}: OrbWrapperAnimatedProps) {
  const x = useTransform(orbitAngle, (angle) => {
    const rad = ((angle + baseAngle) * Math.PI) / 180;
    return Math.cos(rad) * radius;
  });
  const y = useTransform(orbitAngle, (angle) => {
    const rad = ((angle + baseAngle) * Math.PI) / 180;
    return Math.sin(rad) * radius * 0.35; // elliptical orbit for 3D look
  });
  const z = useTransform(orbitAngle, (angle) => {
    const rad = ((angle + baseAngle) * Math.PI) / 180;
    return Math.sin(rad) * 60; // subtle z-depth in orbit
  });

  return (
    <OrbWrapper style={{ x, y, translateZ: z, scale }}>
      <Orb color={color} />
    </OrbWrapper>
  );
}
