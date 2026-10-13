// ─── FlatMark Apartment Project Data ──────────────────────────────────────────

export const PROJECT_INFO = {
  name: 'FlatMark Skyline Residences',
  shortName: 'FlatMark',
  tagline: 'Elevated Living. Above the Ordinary.',
  subTagline: '2, 3 & 4 BHK Luxury Residences in a 6.5-Acre Gated Podium Community',
  location: 'Financial District - ORR Growth Corridor, Hyderabad',
  rera: 'P02400008432 (Approved by TG-RERA & GHMC)',
  possession: 'December 2026 (Under Rapid Construction)',
  startingPrice: '₹65 Lakhs*',
  totalTowers: 3,
  totalFloors: 'G + 12 Floors',
  totalUnits: '224 Exclusive Residences',
  openSpace: '78% Open Greenery & Podium Deck',
  heroImage: '/images/flatmark-hero.jpg',
};

export const TOWERS = [
  {
    id: 'A',
    name: 'Tower A — The Azure',
    shortName: 'Tower A',
    floors: 10,
    flatsPerFloor: 4,
    units: ['2 BHK', '3 BHK'],
    image: '/images/flatmark-tower-a.png',
    badge: '10 Floors · G+10',
    status: 'Ready for Fitouts',
    description: '10-storey contemporary residence overlooking central landscaped podium gardens and infinity swimming pool.',
    highlights: [
      '2 High-Speed Otis Elevators',
      'East & North Facing Units',
      '100% Vaastu Compliant Layout',
      'Panoramic Podium Garden Views',
    ],
    startingPrice: '₹65 Lakhs*',
    availableCount: 18,
  },
  {
    id: 'B',
    name: 'Tower B — The Apex',
    shortName: 'Tower B',
    floors: 12,
    flatsPerFloor: 4,
    units: ['2 BHK', '3 BHK', '4 BHK'],
    image: '/images/flatmark-tower-b.png',
    badge: '12 Floors · High-Rise',
    status: 'Roof Slab Completed',
    description: '12-storey signature high-rise tower featuring luxury 3 BHK & 4 BHK sky penthouses with panoramic sunset vistas.',
    highlights: [
      'Rooftop Sky Lounge & Observatory',
      'Wrap-Around Cantilever Balconies',
      'Dedicated Service Lift & Stretcher Lift',
      'Double-Height Glass Foyer',
    ],
    startingPrice: '₹85 Lakhs*',
    availableCount: 26,
  },
  {
    id: 'C',
    name: 'Tower C — The Aria',
    shortName: 'Tower C',
    floors: 8,
    flatsPerFloor: 3,
    units: ['2 BHK'],
    image: '/images/flatmark-tower-c.png',
    badge: '8 Floors · Boutique',
    status: 'Finishing Works',
    description: '8-storey boutique enclave dedicated to thoughtfully engineered 2 BHK smart residences with vertical green balconies.',
    highlights: [
      'Low-Density Boutique Living',
      'Cascading Green Planter Balconies',
      'Direct Podium Access',
      'Children Play Zone Adjacent',
    ],
    startingPrice: '₹65 Lakhs*',
    availableCount: 12,
  },
];

export const STATUS_META = {
  available: { label: 'Available', color: '#16a34a', bg: 'rgba(22, 163, 74, 0.12)', border: 'rgba(22, 163, 74, 0.35)', icon: '🟢' },
  hold:      { label: 'On Hold',   color: '#ca8a04', bg: 'rgba(202, 138, 4, 0.12)', border: 'rgba(202, 138, 4, 0.35)', icon: '🟡' },
  booked:    { label: 'Booked',    color: '#9333ea', bg: 'rgba(147, 51, 234, 0.12)', border: 'rgba(147, 51, 234, 0.35)', icon: '🟣' },
  sold:      { label: 'Sold',      color: '#dc2626', bg: 'rgba(220, 38, 38, 0.12)', border: 'rgba(220, 38, 38, 0.35)', icon: '🔴' },
};

// Deterministic flat generator for consistent availability demo
export function generateApartmentInventory() {
  const units = [];
  const statusCycle = [
    'available', 'available', 'booked', 'available', 'hold', 'available', 'sold', 'available',
    'booked', 'available', 'available', 'hold', 'available', 'sold', 'available', 'available'
  ];

  TOWERS.forEach(tower => {
    for (let floor = 1; floor <= tower.floors; floor++) {
      for (let unitIdx = 1; unitIdx <= tower.flatsPerFloor; unitIdx++) {
        const flatNo = `${tower.id}-${floor}${unitIdx < 10 ? '0' + unitIdx : unitIdx}`;
        const configIndex = (floor + unitIdx) % tower.units.length;
        const bhk = tower.units[configIndex];

        let area = '1,150 Sq.Ft';
        let carpet = '860 Sq.Ft';
        let price = '₹65.5 Lakhs';
        let bed = 2;
        let bath = 2;
        let facing = unitIdx % 2 === 0 ? 'East' : 'North';

        if (bhk === '3 BHK') {
          area = '1,680 Sq.Ft';
          carpet = '1,260 Sq.Ft';
          price = '₹95.8 Lakhs';
          bed = 3;
          bath = 3;
          facing = unitIdx % 2 === 0 ? 'North' : 'East';
        } else if (bhk === '4 BHK') {
          area = '2,450 Sq.Ft';
          carpet = '1,890 Sq.Ft';
          price = '₹1.48 Cr';
          bed = 4;
          bath = 4;
          facing = 'Corner Panoramic';
        }

        const statusIndex = (tower.id.charCodeAt(0) * 11 + floor * 7 + unitIdx * 13) % statusCycle.length;
        const status = statusCycle[statusIndex];

        units.push({
          id: `${tower.id}-${floor}-${unitIdx}`,
          label: flatNo,
          towerId: tower.id,
          towerName: tower.name,
          floor,
          unitIdx,
          bhk,
          area,
          carpet,
          price,
          facing,
          bed,
          bath,
          balcony: bhk === '4 BHK' ? 3 : 2,
          status,
          view: floor > 7 ? 'Skyline & Lake View' : 'Central Podium Pool View',
        });
      }
    }
  });

  return units;
}

export const FLOOR_PLANS = [
  {
    id: '2bhk',
    bhk: '2 BHK',
    name: '2 BHK Smart Luxury Residence',
    tag: 'Popular for Families & Young Professionals',
    sft: '1,150 Sq.Ft',
    carpet: '860 Sq.Ft',
    bed: 2,
    bath: 2,
    balcony: 2,
    price: 'Starting ₹65.5 Lakhs*',
    image: '/images/flatmark-plan-2bhk.jpg',
    description: 'An ergonomically optimized two-bedroom layout with separate dining alcove, dry/wet kitchen counter, master bedroom ensuite, and cross-ventilation balcony.',
    rooms: [
      { name: 'Master Bedroom', size: '16′-0″ × 12′-0″ (with attached bath)' },
      { name: 'Bedroom 2', size: '12′-6″ × 11′-0″' },
      { name: 'Living & Dining Salon', size: '20′-0″ × 15′-0″' },
      { name: 'Kitchen & Utility', size: '13′-0″ × 10′-0″' },
      { name: 'Sunken Balcony', size: '15′-0″ × 6′-0″' },
    ],
    features: ['100% Vaastu Compliant', 'Zero Dead Space', 'Wide Glazed Balcony', 'Fibre-Optic Internet Ready'],
  },
  {
    id: '3bhk',
    bhk: '3 BHK',
    name: '3 BHK Royal Residence',
    tag: 'Signature Spacious Living',
    sft: '1,680 Sq.Ft',
    carpet: '1,260 Sq.Ft',
    bed: 3,
    bath: 3,
    balcony: 2,
    price: 'Starting ₹95.8 Lakhs*',
    image: '/images/flatmark-plan-3bhk.jpg',
    description: 'Grand three-bedroom apartment with expansive 38-foot living salon, walk-in dressing wardrobe in master suite, breakfast counter island, and deep covered sit-out deck.',
    rooms: [
      { name: 'Master Presidential Suite', size: '24′-0″ × 16′-0″ (walk-in closet)' },
      { name: 'Bedroom 2 (Guest Suite)', size: '16′-0″ × 14′-0″' },
      { name: 'Bedroom 3 (Kids/Study)', size: '16′-0″ × 14′-0″' },
      { name: 'Grand Living & Dining', size: '38′-0″ × 22′-0″' },
      { name: 'Gourmet Kitchen Island', size: '20′-0″ × 14′-0″' },
      { name: 'Wide Deck Balcony', size: '48′-0″ × 8′-0″' },
    ],
    features: ['Private Foyer Entry', 'Walk-in Wardrobe', 'Piped Gas Connection', 'Acoustic Sound-Dampened Windows'],
  },
  {
    id: '4bhk',
    bhk: '4 BHK',
    name: '4 BHK Sky Penthouse',
    tag: 'Limited Edition · 12th Floor Apex',
    sft: '2,450 Sq.Ft',
    carpet: '1,890 Sq.Ft',
    bed: 4,
    bath: 4,
    balcony: 3,
    price: 'Starting ₹1.48 Cr*',
    image: '/images/flatmark-plan-4bhk.jpg',
    description: 'Palatial 4 BHK corner residence with wraparound private sky terrace, family lounge, servant room with private washroom, and 270-degree skyline views.',
    rooms: [
      { name: 'Presidential Master Suite', size: '42′-0″ × 28′-0″ (spa bath & dressing)' },
      { name: 'Junior Suite', size: '26′-0″ × 18′-0″' },
      { name: 'Bedrooms 3 & 4', size: '18′-0″ × 16′-0″ each' },
      { name: 'Formal Living Room', size: '38′-0″ × 24′-0″' },
      { name: 'Family Lounge', size: '24′-0″ × 20′-0″' },
      { name: 'Servant Quarters & Utility', size: '10′-0″ × 8′-0″' },
      { name: 'Wraparound Sky Terrace', size: 'Full Perimeter Deck' },
    ],
    features: ['Exclusive Lift Access Code', 'Double Balcony Decks', 'Separate Maid Entrance', 'Automated Smart Lighting'],
  },
];

export const AMENITIES = [
  {
    icon: '🏊',
    title: 'Infinity Swimming Pool',
    category: 'Wellness',
    desc: 'Half-Olympic temperature-controlled swimming pool with dedicated kids splash pool, submerged loungers, and timber sundeck.',
  },
  {
    icon: '🏛️',
    title: '25,000 Sq.Ft Clubhouse',
    category: 'Leisure',
    desc: 'Multi-level recreational clubhouse featuring banqueting hall, indoor squash court, billiards room, and cafe lounge.',
  },
  {
    icon: '🏋️',
    title: 'Technogym Fitness Studio',
    category: 'Fitness',
    desc: 'State-of-the-art cardiovascular and strength training equipment with certified trainers, yoga studio, and steam rooms.',
  },
  {
    icon: '🌳',
    title: 'Landscaped Podium Gardens',
    category: 'Nature',
    desc: 'Vehicular-free elevated podium with manicured lawns, aroma gardens, timber pergolas, and serene meditation pavilion.',
  },
  {
    icon: '🧒',
    title: 'Children’s Play Arena',
    category: 'Family',
    desc: 'Safe, rubberized EPDM play ground with climbing frames, slides, sensory sandpits, and child-safe perimeter fencing.',
  },
  {
    icon: '🏃',
    title: '500m Reflexology Track',
    category: 'Health',
    desc: 'Continuous jogging loop through dense foliage with acupressure walking path and shaded outdoor fitness stations.',
  },
  {
    icon: '🚗',
    title: '3-Level Basement Parking',
    category: 'Convenience',
    desc: 'Designated covered multi-level car parking bays with high-speed automated boom barriers and EV charging conduit pre-wired.',
  },
  {
    icon: '🛡️',
    title: '3-Tier 24/7 Security',
    category: 'Safety',
    desc: 'RFID vehicle access control, high-definition CCTV coverage across all common lobbies, and video door phone intercom in every flat.',
  },
];

export const GALLERY_ITEMS = [
  {
    id: 1,
    title: 'Skyline Podium & Residential Towers',
    category: 'architecture',
    categoryLabel: 'Architecture',
    src: '/images/flatmark-hero.jpg',
    desc: 'Three modern high-rise towers rising above a 6.5-acre landscaped elevated podium.',
  },
  {
    id: 2,
    title: 'Grand Double-Height Entrance Lobby',
    category: 'lobby',
    categoryLabel: 'Lobby',
    src: '/images/flatmark-lobby.jpg',
    desc: 'Italian marble reception foyer with bespoke geometric chandelier and concierge desk.',
  },
  {
    id: 3,
    title: 'Panoramic Living Room & Balcony',
    category: 'interiors',
    categoryLabel: 'Interiors',
    src: '/images/flatmark-living.jpg',
    desc: 'Open-concept living and dining salon with floor-to-ceiling glass sliding doors.',
  },
  {
    id: 4,
    title: 'Tower A — The Azure Elevation',
    category: 'architecture',
    categoryLabel: 'Architecture',
    src: '/images/flatmark-tower-a.png',
    desc: 'Contemporary standalone elevation with full-perimeter glazed balconies.',
  },
  {
    id: 5,
    title: 'Tower B — Star Residency',
    category: 'architecture',
    categoryLabel: 'Architecture',
    src: '/images/flatmark-tower-b.png',
    desc: 'Signature contemporary apartment elevation with wrap-around balconies and stilt parking.',
  },
  {
    id: 6,
    title: 'Tower C — Medha Infra',
    category: 'architecture',
    categoryLabel: 'Architecture',
    src: '/images/flatmark-tower-c.png',
    desc: 'Boutique apartment residence with contemporary facade framing and designer finish.',
  },
];
