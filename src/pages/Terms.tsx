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

export const Terms = () => {
  return (
    <Page>
      <Global styles={globalStyles} />
      <Header>
        <BackLink to="/">← LOCK IN</BackLink>
      </Header>
      <Content>
        <Title>이용약관</Title>

        <Section>
          <SectionTitle>제1조 (목적)</SectionTitle>
          <Text>
            본 약관은 더존바이오(이하 "회사")가 운영하는 온라인 쇼핑몰
            Lock In(이하 "몰")에서 제공하는 인터넷 관련 서비스를 이용함에
            있어 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
          </Text>
        </Section>

        <Section>
          <SectionTitle>제2조 (정의)</SectionTitle>
          <Text>
            "몰"이란 회사가 재화 또는 용역을 이용자에게 제공하기 위하여
            컴퓨터 등 정보통신설비를 이용하여 재화 또는 용역을 거래할 수
            있도록 설정한 가상의 영업장을 말하며, 아울러 사이버몰을 운영하는
            사업자의 의미로도 사용합니다. "이용자"란 "몰"에 접속하여 이 약관에
            따라 "몰"이 제공하는 서비스를 받는 회원 및 비회원을 말합니다.
          </Text>
        </Section>

        <Section>
          <SectionTitle>제3조 (약관의 게시와 개정)</SectionTitle>
          <Text>
            회사는 이 약관의 내용과 상호 및 대표자 성명, 영업소 소재지 주소,
            전화번호, 전자우편주소, 사업자등록번호, 통신판매업 신고번호 등을
            이용자가 쉽게 알 수 있도록 몰의 초기 서비스 화면에 게시합니다.
            약관의 내용은 이용자가 연결화면을 통하여 볼 수 있도록 할 수 있습니다.
          </Text>
        </Section>

        <Section>
          <SectionTitle>제4조 (서비스의 제공 및 변경)</SectionTitle>
          <Text>
            회사는 다음과 같은 업무를 수행합니다: 재화 또는 용역에 대한 정보 제공
            및 구매계약의 체결, 구매계약이 체결된 재화 또는 용역의 배송, 기타 회사가
            정하는 업무. 회사는 재화 또는 용역의 품절 또는 기술적 사양의 변경 등의
            경우에는 장차 체결되는 계약에 의해 제공할 재화 또는 용역의 내용을
            변경할 수 있습니다.
          </Text>
        </Section>

        <Section>
          <SectionTitle>제5조 (구매신청)</SectionTitle>
          <Text>
            이용자는 몰에서 다음의 방법에 의하여 구매를 신청합니다:
            성명, 주소, 전화번호, 전자우편주소 입력; 재화 또는 용역의 선택;
            결제방법의 선택. 회사는 이용자의 구매신청에 대하여 구매신청확인의
            통지를 합니다.
          </Text>
        </Section>

        <Section>
          <SectionTitle>제6조 (결제방법)</SectionTitle>
          <Text>
            몰에서 구매한 재화 또는 용역에 대한 대금지급방법은 다음 각 호의
            방법 중 가용한 방법으로 할 수 있습니다: 신용카드 결제, 계좌이체,
            무통장입금, 기타 전자적 지급방법에 의한 대금 지급 등.
          </Text>
        </Section>

        <Section>
          <SectionTitle>제7조 (개인정보보호)</SectionTitle>
          <Text>
            회사는 이용자의 개인정보 수집 시 서비스 제공을 위하여 필요한
            범위에서 최소한의 개인정보를 수집합니다. 회사는 이용자의 개인정보를
            수집·이용하는 때에는 당해 이용자에게 그 목적을 고지하고 동의를
            받습니다. 수집된 개인정보는 목적 외의 용도로 이용할 수 없으며,
            새로운 이용 목적이 발생한 경우 또는 제3자에게 제공하는 경우에는
            이용·제공단계에서 당해 이용자에게 그 목적을 고지하고 동의를 받습니다.
          </Text>
        </Section>

        <Section>
          <SectionTitle>제8조 (회사의 의무)</SectionTitle>
          <Text>
            회사는 법령과 이 약관이 금지하거나 공서양속에 반하는 행위를 하지
            않으며 이 약관이 정하는 바에 따라 지속적이고 안정적으로 재화 또는
            용역을 제공하는 데 최선을 다하여야 합니다.
          </Text>
        </Section>

        <Section>
          <SectionTitle>제9조 (분쟁해결)</SectionTitle>
          <Text>
            회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를
            보상처리하기 위하여 피해보상처리기구를 설치·운영합니다. 회사와
            이용자 간에 발생한 전자상거래 분쟁에 관하여는 이용자의 피해구제신청에
            의하여 공정거래위원회 또는 시·도지사가 의뢰하는 분쟁조정기관의
            조정에 따를 수 있습니다.
          </Text>
        </Section>
      </Content>
      <Footer />
    </Page>
  );
};
