export interface Product {
  id: string;
  name: string;
  nameKr: string;
  flavor: string;
  price: number;
  originalPrice?: number;
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
    nameKr: 'Signature Decaf',
    flavor: 'Decaffeinated · Dark Roast',
    price: 39000,
    originalPrice: 70000,
    tastingNotes: ['Wine', 'Caramel', 'Walnut'],
    description: 'For the night owl who refuses to compromise. Full-bodied focus without the caffeine — because great ideas don\'t keep business hours.',
    descriptionKr: 'Deep immersion without caffeine. Great ideas don\'t follow a schedule.',
    color: '#A71B1B',
    badge: 'CAFFEINE FREE'
  },
  {
    id: 'house',
    name: 'House',
    nameKr: 'House Blend',
    flavor: 'Medium Roast · Balanced',
    price: 36000,
    originalPrice: 60000,
    tastingNotes: ['Dark Chocolate', 'Brown Sugar', 'Smooth'],
    description: 'The everyday essential. Engineered for sustained clarity — wake up sharp, stay sharp, no crash. Ever.',
    descriptionKr: 'Start sharp, stay sharp. Zero crash, all day clarity.',
    color: '#37385A',
    badge: 'BEST SELLER'
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    nameKr: 'Vibrant Specialty',
    flavor: 'Light Roast · Specialty Grade',
    price: 42000,
    originalPrice: 80000,
    tastingNotes: ['Black Tea', 'Floral', 'Stone Fruit'],
    description: 'For mornings that matter. Bright, complex, alive — a specialty-grade awakening that reminds you why you started.',
    descriptionKr: 'Bright, complex, alive. A specialty-grade awakening.',
    color: '#ED6427',
    badge: 'SPECIALTY'
  },
  {
    id: 'tasting-kit',
    name: 'Tasting Kit',
    nameKr: 'Discovery Set',
    flavor: '3 Blends × 100ml · Discovery Set',
    price: 29000,
    tastingNotes: ['Signature', 'House', 'Vibrant'],
    description: 'Your first step into focus. Three blends, 100ml each — discover your ritual before you commit. The perfect introduction, or the perfect gift.',
    descriptionKr: 'Three blends, 100ml each. Find your ritual.',
    color: '#ED6427',
    badge: 'STARTER',
    isKit: true,
    includes: ['Gift Box', 'Tasting Guide', 'Lock In Figure', '14-Day Planner']
  }
];
