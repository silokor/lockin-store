export interface Product {
  id: string;
  name: string;
  nameKr: string;
  flavor: string;
  price: number;
  tastingNotes: string[];
  description: string;
  descriptionKr: string;
  color: string;
  badge?: string;
  isKit?: boolean;
  includes?: string[];
}

export const products: Product[] = [
  {
    id: 'decaf',
    name: 'Signature',
    nameKr: '시그니처 디카페인',
    flavor: 'Decaffeinated · Dark Roast',
    price: 39000,
    tastingNotes: ['Wine', 'Caramel', 'Walnut'],
    description: 'For the night owl who refuses to compromise. Full-bodied focus without the caffeine — because great ideas don\'t keep business hours.',
    descriptionKr: '타협하지 않는 밤의 집중을 위해 만들었습니다. 카페인 없이도 깊은 몰입을 경험할 수 있습니다. 좋은 아이디어는 시간을 가리지 않으니까요.',
    color: '#A71B1B',
    badge: 'CAFFEINE FREE'
  },
  {
    id: 'house',
    name: 'House',
    nameKr: '하우스 블렌드',
    flavor: 'Medium Roast · Balanced',
    price: 36000,
    tastingNotes: ['Dark Chocolate', 'Brown Sugar', 'Smooth'],
    description: 'The everyday essential. Engineered for sustained clarity — wake up sharp, stay sharp, no crash. Ever.',
    descriptionKr: '매일의 필수품입니다. 지속되는 명료함을 위해 설계했습니다. 깔끔하게 깨어나고, 끝까지 날카롭게, 크래시는 없습니다.',
    color: '#37385A',
    badge: 'BEST SELLER'
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    nameKr: '바이브런트 스페셜티',
    flavor: 'Light Roast · Specialty Grade',
    price: 42000,
    tastingNotes: ['Black Tea', 'Floral', 'Stone Fruit'],
    description: 'For mornings that matter. Bright, complex, alive — a specialty-grade awakening that reminds you why you started.',
    descriptionKr: '중요한 아침을 위해 만들었습니다. 밝고, 복합적이고, 생생합니다. 왜 시작했는지 다시 떠올리게 해주는 스페셜티 등급의 각성입니다.',
    color: '#ED6427',
    badge: 'SPECIALTY'
  },
  {
    id: 'tasting-kit',
    name: 'Tasting Kit',
    nameKr: '테이스팅 패키지',
    flavor: '3 Blends × 100ml · Discovery Set',
    price: 29000,
    tastingNotes: ['Signature', 'House', 'Vibrant'],
    description: 'Your first step into focus. Three blends, 100ml each — discover your ritual before you commit. The perfect introduction, or the perfect gift.',
    descriptionKr: '집중으로 가는 첫걸음입니다. 세 가지 블렌드, 각 100ml — 나만의 루틴을 찾아보세요. 입문용으로도, 선물용으로도 완벽합니다.',
    color: '#ED6427',
    badge: 'STARTER',
    isKit: true,
    includes: ['선물 포장', '테이스팅 가이드', '락인 피규어', '14일 플래너']
  }
];
