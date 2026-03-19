import styled from '@emotion/styled';
import { Global } from '@emotion/react';
import { globalStyles } from '../styles/global';
import { Footer } from '../components/Footer';
import { Link } from 'react-router-dom';

const Page = styled.div`
  background: var(--warm);
  min-height: 100vh;
`;

const Header = styled.header`
  padding: 40px 24px;
  text-align: center;
  border-bottom: 1px solid rgba(0,0,0,0.06);
`;

const BackLink = styled(Link)`
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--black);
  opacity: 0.4;
  text-decoration: none;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

const Content = styled.main`
  max-width: 720px;
  margin: 0 auto;
  padding: 80px 24px 120px;
`;

const Title = styled.h1`
  font-family: 'EB Garamond', serif;
  font-size: clamp(32px, 6vw, 48px);
  font-weight: 400;
  font-style: italic;
  text-align: center;
  margin-bottom: 64px;
`;

const Section = styled.section`
  margin-bottom: 48px;
`;

const SectionTitle = styled.h2`
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 20px;
  opacity: 0.6;
`;

const Text = styled.p`
  font-family: 'Pretendard', -apple-system, sans-serif;
  font-size: 14px;
  line-height: 2;
  color: var(--black);
  opacity: 0.7;
  word-break: keep-all;
`;

const List = styled.ul`
  font-family: 'Pretendard', -apple-system, sans-serif;
  font-size: 14px;
  line-height: 2;
  color: var(--black);
  opacity: 0.7;
  padding-left: 20px;
  word-break: keep-all;
`;

export const RefundPolicy = () => {
  return (
    <Page>
      <Global styles={globalStyles} />
      <Header>
        <BackLink to="/">← LOCK IN</BackLink>
      </Header>
      <Content>
        <Title>환불 · 교환 · 반품 정책</Title>

        <Section>
          <SectionTitle>교환 및 반품 안내</SectionTitle>
          <Text>
            제품 수령 후 7일 이내에 교환 및 반품 신청이 가능합니다.
            단, 아래의 경우에는 교환 및 반품이 제한될 수 있습니다.
          </Text>
        </Section>

        <Section>
          <SectionTitle>교환 · 반품이 불가능한 경우</SectionTitle>
          <List>
            <li>고객의 책임 있는 사유로 상품이 멸실 또는 훼손된 경우</li>
            <li>포장을 개봉하였거나 포장이 훼손되어 상품 가치가 현저히 상실된 경우</li>
            <li>고객의 사용 또는 일부 소비로 상품의 가치가 현저히 감소한 경우</li>
            <li>시간의 경과에 의하여 재판매가 곤란할 정도로 상품의 가치가 현저히 감소한 경우</li>
            <li>복제가 가능한 상품의 포장을 훼손한 경우</li>
          </List>
        </Section>

        <Section>
          <SectionTitle>환불 절차</SectionTitle>
          <Text>
            반품 접수 후 제품 확인이 완료되면 영업일 기준 3~5일 이내에
            결제 수단으로 환불이 진행됩니다. 카드 결제의 경우 카드사
            사정에 따라 환불 기간이 다소 지연될 수 있습니다.
          </Text>
        </Section>

        <Section>
          <SectionTitle>배송비 안내</SectionTitle>
          <Text>
            단순 변심에 의한 교환 및 반품 시 왕복 배송비는 고객 부담입니다.
            제품 불량 또는 오배송의 경우 배송비는 당사에서 부담합니다.
          </Text>
        </Section>

        <Section>
          <SectionTitle>교환 · 반품 신청 방법</SectionTitle>
          <Text>
            이메일(me@thezonebio.com) 또는 고객센터로 연락하여
            교환·반품 사유와 주문번호를 알려주시면 빠르게 처리해드립니다.
          </Text>
        </Section>
      </Content>
      <Footer />
    </Page>
  );
};
