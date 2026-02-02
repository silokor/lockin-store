export interface Product {
  id: string;
  name: string;
  nameKr: string;
  flavor: string;
  price: number;
  tastingNotes: string[];
  description: string;
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
    color: '#ED6427',
    badge: 'STARTER',
    isKit: true,
    includes: ['선물 포장', '테이스팅 가이드', '락인 피규어', '14일 플래너']
  }
];
