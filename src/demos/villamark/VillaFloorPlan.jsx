import { useState } from 'react';

/**
 * Architectural Floor Plan visualizer for VillaMark
 * Inspired by Bridge Epsilon's architectural layout presentation.
 */
export default function VillaFloorPlan({ villa, activePlan, onEnquire, onOpenLightbox }) {
  const [hoveredRoom, setHoveredRoom] = useState(null);

  // SVG drawings based on villa id and floor
  const renderSvgPlan = () => {
    if (villa.id === '2bhk') {
      if (activePlan === 'ground') {
        return (
          <svg viewBox="0 0 600 420" className="vm-arch-svg" aria-label="2 BHK Ground Floor Plan">
            {/* Grid background */}
            <defs>
              <pattern id="archGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(167,138,90,0.08)" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="600" height="420" fill="url(#archGrid)" rx="8" />

            {/* Boundary dimension marks */}
            <text x="300" y="22" textAnchor="middle" className="vm-svg-dim">◀ 30' 0" ROAD FRONTAGE ▶</text>
            <text x="18" y="210" textAnchor="middle" transform="rotate(-90 18 210)" className="vm-svg-dim">◀ 54' 0" PLOT DEPTH ▶</text>

            {/* Main Outer Wall */}
            <rect x="50" y="35" width="500" height="350" fill="none" stroke="var(--pv-gold, #b47506)" strokeWidth="3" rx="4" />

            {/* Car Porch / Portico */}
            <g
              className={`vm-svg-room ${hoveredRoom === 'Entrance Foyer & Portico' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredRoom('Entrance Foyer & Portico')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect x="55" y="40" width="160" height="150" fill="rgba(180,117,6,0.06)" stroke="#b47506" strokeWidth="1.5" strokeDasharray="4 2" />
              {/* Car Icon Schematic */}
              <rect x="85" y="70" width="90" height="60" rx="8" fill="none" stroke="#a78a5a" strokeWidth="1.5" />
              <circle cx="100" cy="135" r="5" fill="#a78a5a" />
              <circle cx="160" cy="135" r="5" fill="#a78a5a" />
              <text x="135" y="105" textAnchor="middle" className="vm-svg-room-name">CAR PORCH</text>
              <text x="135" y="120" textAnchor="middle" className="vm-svg-room-dim">12'0" × 16'0"</text>
            </g>

            {/* Foyer & Main Door */}
            <g>
              <rect x="215" y="40" width="100" height="70" fill="rgba(255,255,255,0.04)" stroke="#b47506" strokeWidth="1.5" />
              {/* Door swing arc */}
              <path d="M 235 40 A 25 25 0 0 1 260 65" fill="none" stroke="#22c55e" strokeWidth="1.5" />
              <line x1="235" y1="40" x2="235" y2="65" stroke="#22c55e" strokeWidth="1.5" />
              <text x="265" y="80" textAnchor="middle" className="vm-svg-room-name">FOYER</text>
            </g>

            {/* Living Room */}
            <g
              className={`vm-svg-room ${hoveredRoom === 'Formal Living Room' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredRoom('Formal Living Room')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect x="215" y="110" width="190" height="150" fill="rgba(180,117,6,0.04)" stroke="#b47506" strokeWidth="1.5" />
              {/* Sofa schematic */}
              <rect x="235" y="130" width="20" height="80" rx="4" fill="none" stroke="rgba(167,138,90,0.4)" strokeWidth="1.2" />
              <rect x="260" y="155" width="45" height="30" rx="3" fill="none" stroke="rgba(167,138,90,0.4)" strokeWidth="1.2" />
              <text x="310" y="195" textAnchor="middle" className="vm-svg-room-name">LIVING ROOM</text>
              <text x="310" y="210" textAnchor="middle" className="vm-svg-room-dim">16'6" × 14'0"</text>
            </g>

            {/* Dining Room */}
            <g
              className={`vm-svg-room ${hoveredRoom === 'Dining Room' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredRoom('Dining Room')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect x="215" y="260" width="190" height="120" fill="rgba(180,117,6,0.03)" stroke="#b47506" strokeWidth="1.5" />
              {/* Dining table schematic */}
              <rect x="270" y="295" width="80" height="45" rx="6" fill="none" stroke="rgba(167,138,90,0.4)" strokeWidth="1.2" />
              <circle cx="285" cy="285" r="4" fill="#a78a5a" />
              <circle cx="310" cy="285" r="4" fill="#a78a5a" />
              <circle cx="335" cy="285" r="4" fill="#a78a5a" />
              <circle cx="285" cy="350" r="4" fill="#a78a5a" />
              <circle cx="310" cy="350" r="4" fill="#a78a5a" />
              <circle cx="335" cy="350" r="4" fill="#a78a5a" />
              <text x="310" y="322" textAnchor="middle" className="vm-svg-room-name">DINING</text>
              <text x="310" y="337" textAnchor="middle" className="vm-svg-room-dim">12'0" × 11'6"</text>
            </g>

            {/* Modular Kitchen */}
            <g
              className={`vm-svg-room ${hoveredRoom === 'Modular Kitchen & Utility' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredRoom('Modular Kitchen & Utility')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect x="315" y="40" width="230" height="130" fill="rgba(180,117,6,0.06)" stroke="#b47506" strokeWidth="1.5" />
              {/* Countertop */}
              <path d="M 320 45 L 535 45 L 535 120" fill="none" stroke="#a78a5a" strokeWidth="2" strokeDasharray="3 3" />
              <text x="430" y="90" textAnchor="middle" className="vm-svg-room-name">MODULAR KITCHEN</text>
              <text x="430" y="105" textAnchor="middle" className="vm-svg-room-dim">10'0" × 9'6"</text>
              <text x="430" y="125" textAnchor="middle" className="vm-svg-tag">South-East Vaastu</text>
            </g>

            {/* Guest Bedroom */}
            <g
              className={`vm-svg-room ${hoveredRoom === 'Guest Bedroom' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredRoom('Guest Bedroom')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect x="405" y="170" width="140" height="140" fill="rgba(180,117,6,0.05)" stroke="#b47506" strokeWidth="1.5" />
              {/* Bed schematic */}
              <rect x="440" y="195" width="70" height="60" rx="4" fill="none" stroke="rgba(167,138,90,0.4)" strokeWidth="1.2" />
              <rect x="445" y="188" width="25" height="10" rx="2" fill="none" stroke="#a78a5a" />
              <rect x="480" y="188" width="25" height="10" rx="2" fill="none" stroke="#a78a5a" />
              <text x="475" y="275" textAnchor="middle" className="vm-svg-room-name">GUEST BED</text>
              <text x="475" y="290" textAnchor="middle" className="vm-svg-room-dim">13'0" × 12'0"</text>
            </g>

            {/* Attached Bath */}
            <g
              className={`vm-svg-room ${hoveredRoom === 'Attached Bathroom' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredRoom('Attached Bathroom')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect x="405" y="310" width="140" height="70" fill="rgba(180,117,6,0.03)" stroke="#b47506" strokeWidth="1.5" />
              <text x="475" y="345" textAnchor="middle" className="vm-svg-room-name">TOILET</text>
              <text x="475" y="360" textAnchor="middle" className="vm-svg-room-dim">8'0" × 5'6"</text>
            </g>

            {/* Private Garden Lawn */}
            <g
              className={`vm-svg-room ${hoveredRoom === 'Private Garden Lawn' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredRoom('Private Garden Lawn')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect x="55" y="190" width="160" height="190" fill="rgba(34,197,94,0.08)" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="135" y="280" textAnchor="middle" fill="#15803d" className="vm-svg-room-name">PRIVATE LAWN</text>
              <text x="135" y="295" textAnchor="middle" fill="#15803d" className="vm-svg-room-dim">18'0" × 8'0"</text>
              <text x="135" y="315" textAnchor="middle" fill="#16a34a" style={{ fontSize: '10px' }}>🌿 Garden Patio</text>
            </g>

            {/* Compass */}
            <g transform="translate(540, 350)">
              <circle cx="0" cy="0" r="18" fill="none" stroke="#b47506" strokeWidth="1.2" />
              <polygon points="0,-14 4,-2 0,0 -4,-2" fill="#b47506" />
              <polygon points="0,14 4,2 0,0 -4,2" fill="rgba(180,117,6,0.3)" />
              <text x="0" y="-17" textAnchor="middle" fill="#b47506" style={{ fontSize: '9px', fontWeight: 'bold' }}>N</text>
              <text x="0" y="26" textAnchor="middle" fill="#b47506" style={{ fontSize: '8px' }}>EAST FACING</text>
            </g>
          </svg>
        );
      } else {
        // 2 BHK First floor
        return (
          <svg viewBox="0 0 600 420" className="vm-arch-svg" aria-label="2 BHK First Floor Plan">
            <defs>
              <pattern id="archGrid2" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(167,138,90,0.08)" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="600" height="420" fill="url(#archGrid2)" rx="8" />

            <text x="300" y="22" textAnchor="middle" className="vm-svg-dim">FIRST FLOOR BUILT-UP: 780 SQ.FT</text>
            <rect x="50" y="35" width="500" height="350" fill="none" stroke="var(--pv-gold, #b47506)" strokeWidth="3" rx="4" />

            {/* Master Bedroom Suite */}
            <g
              className={`vm-svg-room ${hoveredRoom === 'Master Bedroom' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredRoom('Master Bedroom')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect x="60" y="45" width="260" height="210" fill="rgba(180,117,6,0.06)" stroke="#b47506" strokeWidth="1.5" />
              {/* King Bed */}
              <rect x="130" y="80" width="110" height="85" rx="6" fill="none" stroke="rgba(167,138,90,0.5)" strokeWidth="1.5" />
              <rect x="140" y="65" width="40" height="15" rx="3" fill="none" stroke="#a78a5a" />
              <rect x="190" y="65" width="40" height="15" rx="3" fill="none" stroke="#a78a5a" />
              <text x="185" y="195" textAnchor="middle" className="vm-svg-room-name">MASTER BEDROOM</text>
              <text x="185" y="210" textAnchor="middle" className="vm-svg-room-dim">16'0" × 13'6"</text>
            </g>

            {/* Master Bath & Dressing */}
            <g
              className={`vm-svg-room ${hoveredRoom === 'Master Bath & Dressing' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredRoom('Master Bath & Dressing')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect x="320" y="45" width="140" height="130" fill="rgba(180,117,6,0.04)" stroke="#b47506" strokeWidth="1.5" />
              <text x="390" y="105" textAnchor="middle" className="vm-svg-room-name">WALK-IN & BATH</text>
              <text x="390" y="120" textAnchor="middle" className="vm-svg-room-dim">8'6" × 6'6"</text>
            </g>

            {/* Sit-Out Balcony */}
            <g
              className={`vm-svg-room ${hoveredRoom === 'Private Sit-Out Balcony' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredRoom('Private Sit-Out Balcony')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect x="60" y="255" width="260" height="80" fill="rgba(245,158,11,0.06)" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2" />
              <text x="190" y="295" textAnchor="middle" className="vm-svg-room-name">PRIVATE BALCONY</text>
              <text x="190" y="310" textAnchor="middle" className="vm-svg-room-dim">14'0" × 5'0"</text>
            </g>

            {/* Study Corner */}
            <g
              className={`vm-svg-room ${hoveredRoom === 'Study / Home Office Nook' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredRoom('Study / Home Office Nook')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect x="320" y="175" width="140" height="120" fill="rgba(180,117,6,0.03)" stroke="#b47506" strokeWidth="1.5" />
              <text x="390" y="235" textAnchor="middle" className="vm-svg-room-name">STUDY NOOK</text>
              <text x="390" y="250" textAnchor="middle" className="vm-svg-room-dim">8'6" × 7'0"</text>
            </g>

            {/* Open Terrace Deck */}
            <g
              className={`vm-svg-room ${hoveredRoom === 'Open Terrace Deck' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredRoom('Open Terrace Deck')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect x="60" y="335" width="480" height="45" fill="rgba(34,197,94,0.06)" stroke="#22c55e" strokeWidth="1.2" strokeDasharray="2 2" />
              <text x="300" y="362" textAnchor="middle" className="vm-svg-room-name">CUT-OUT / TERRACE VOID</text>
            </g>
          </svg>
        );
      }
    }

    // 3 BHK or 4 BHK Layouts
    if (villa.id === '3bhk') {
      if (activePlan === 'ground') {
        return (
          <svg viewBox="0 0 600 420" className="vm-arch-svg" aria-label="3 BHK Ground Floor Plan">
            <defs>
              <pattern id="archGrid3" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(167,138,90,0.08)" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="600" height="420" fill="url(#archGrid3)" rx="8" />

            <text x="300" y="22" textAnchor="middle" className="vm-svg-dim">◀ 36' 0" ROAD FRONTAGE · 13 FT CEILING HEIGHT ▶</text>
            <rect x="40" y="32" width="520" height="355" fill="none" stroke="var(--pv-gold, #b47506)" strokeWidth="3" rx="4" />

            {/* Double Car Porch */}
            <g
              className={`vm-svg-room ${hoveredRoom === 'Double Car Porch' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredRoom('Double Car Porch')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect x="45" y="37" width="210" height="150" fill="rgba(180,117,6,0.07)" stroke="#b47506" strokeWidth="1.5" strokeDasharray="4 2" />
              {/* Two Cars */}
              <rect x="60" y="60" width="75" height="55" rx="6" fill="none" stroke="#a78a5a" strokeWidth="1.2" />
              <rect x="150" y="60" width="75" height="55" rx="6" fill="none" stroke="#a78a5a" strokeWidth="1.2" />
              <text x="145" y="145" textAnchor="middle" className="vm-svg-room-name">DOUBLE CAR PORCH</text>
              <text x="145" y="160" textAnchor="middle" className="vm-svg-room-dim">18'0" × 16'6"</text>
            </g>

            {/* Grand Foyer */}
            <g
              className={`vm-svg-room ${hoveredRoom === 'Grand Entrance Foyer' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredRoom('Grand Entrance Foyer')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect x="255" y="37" width="95" height="85" fill="rgba(255,255,255,0.04)" stroke="#b47506" strokeWidth="1.5" />
              {/* Grand Main Door */}
              <path d="M 270 37 A 30 30 0 0 1 300 67" fill="none" stroke="#22c55e" strokeWidth="2" />
              <line x1="270" y1="37" x2="270" y2="67" stroke="#22c55e" strokeWidth="2" />
              <text x="300" y="90" textAnchor="middle" className="vm-svg-room-name">FOYER</text>
              <text x="300" y="103" textAnchor="middle" className="vm-svg-tag">Main Entry</text>
            </g>

            {/* Double Height Living Room */}
            <g
              className={`vm-svg-room ${hoveredRoom === 'Double-Height Living Hall' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredRoom('Double-Height Living Hall')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect x="255" y="122" width="185" height="155" fill="rgba(180,117,6,0.05)" stroke="#b47506" strokeWidth="1.5" />
              <rect x="275" y="145" width="22" height="90" rx="4" fill="none" stroke="rgba(167,138,90,0.5)" strokeWidth="1.2" />
              <rect x="305" y="170" width="50" height="35" rx="3" fill="none" stroke="rgba(167,138,90,0.5)" strokeWidth="1.2" />
              <text x="350" y="225" textAnchor="middle" className="vm-svg-room-name">DOUBLE HEIGHT LIVING</text>
              <text x="350" y="240" textAnchor="middle" className="vm-svg-room-dim">20'0" × 15'0" (13ft H)</text>
            </g>

            {/* Dining Room */}
            <g
              className={`vm-svg-room ${hoveredRoom === 'Family Dining Space' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredRoom('Family Dining Space')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect x="255" y="277" width="185" height="105" fill="rgba(180,117,6,0.03)" stroke="#b47506" strokeWidth="1.5" />
              <rect x="300" y="305" width="90" height="45" rx="6" fill="none" stroke="rgba(167,138,90,0.4)" strokeWidth="1.2" />
              <text x="345" y="332" textAnchor="middle" className="vm-svg-room-name">DINING HALL</text>
              <text x="345" y="347" textAnchor="middle" className="vm-svg-room-dim">14'0" × 12'6"</text>
            </g>

            {/* Kitchen & Pantry */}
            <g
              className={`vm-svg-room ${hoveredRoom === 'Chef\'s Kitchen & Pantry' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredRoom('Chef\'s Kitchen & Pantry')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect x="350" y="37" width="205" height="120" fill="rgba(180,117,6,0.06)" stroke="#b47506" strokeWidth="1.5" />
              <path d="M 355 42 L 550 42 L 550 115" fill="none" stroke="#a78a5a" strokeWidth="2" strokeDasharray="3 3" />
              <text x="450" y="80" textAnchor="middle" className="vm-svg-room-name">KITCHEN & PANTRY</text>
              <text x="450" y="95" textAnchor="middle" className="vm-svg-room-dim">12'0" × 11'0"</text>
              <text x="450" y="115" textAnchor="middle" className="vm-svg-tag">Agni Corner · Vaastu</text>
            </g>

            {/* Guest Suite */}
            <g
              className={`vm-svg-room ${hoveredRoom === 'Guest Suite (Bed 1)' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredRoom('Guest Suite (Bed 1)')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect x="440" y="157" width="115" height="145" fill="rgba(180,117,6,0.04)" stroke="#b47506" strokeWidth="1.5" />
              <rect x="460" y="180" width="70" height="65" rx="4" fill="none" stroke="rgba(167,138,90,0.5)" strokeWidth="1.2" />
              <text x="495" y="265" textAnchor="middle" className="vm-svg-room-name">GUEST SUITE</text>
              <text x="495" y="278" textAnchor="middle" className="vm-svg-room-dim">14'0" × 13'0"</text>
            </g>

            {/* Toilet */}
            <g
              className={`vm-svg-room ${hoveredRoom === 'Powder Room / Bath' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredRoom('Powder Room / Bath')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect x="440" y="302" width="115" height="80" fill="rgba(180,117,6,0.03)" stroke="#b47506" strokeWidth="1.5" />
              <text x="495" y="340" textAnchor="middle" className="vm-svg-room-name">BATH / POWDER</text>
              <text x="495" y="355" textAnchor="middle" className="vm-svg-room-dim">8'0" × 5'6"</text>
            </g>

            {/* Backyard Lawn */}
            <g
              className={`vm-svg-room ${hoveredRoom === 'Private Backyard Lawn' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredRoom('Private Backyard Lawn')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect x="45" y="187" width="210" height="195" fill="rgba(34,197,94,0.08)" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="150" y="280" textAnchor="middle" fill="#15803d" className="vm-svg-room-name">BACKYARD LAWN & DECK</text>
              <text x="150" y="295" textAnchor="middle" fill="#15803d" className="vm-svg-room-dim">22'0" × 10'0"</text>
              <text x="150" y="315" textAnchor="middle" fill="#16a34a" style={{ fontSize: '10px' }}>🌿 Private Sitout / BBQ</text>
            </g>

            {/* Compass */}
            <g transform="translate(525, 345)">
              <circle cx="0" cy="0" r="16" fill="none" stroke="#b47506" strokeWidth="1.2" />
              <polygon points="0,-12 3,-2 0,0 -3,-2" fill="#b47506" />
              <polygon points="0,12 3,2 0,0 -3,2" fill="rgba(180,117,6,0.3)" />
              <text x="0" y="-15" textAnchor="middle" fill="#b47506" style={{ fontSize: '9px', fontWeight: 'bold' }}>N</text>
            </g>
          </svg>
        );
      } else if (activePlan === 'first') {
        return (
          <svg viewBox="0 0 600 420" className="vm-arch-svg" aria-label="3 BHK First Floor Plan">
            <defs>
              <pattern id="archGrid3f" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(167,138,90,0.08)" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="600" height="420" fill="url(#archGrid3f)" rx="8" />

            <text x="300" y="22" textAnchor="middle" className="vm-svg-dim">FIRST FLOOR · 2 EN-SUITE BEDROOMS + FAMILY LOUNGE</text>
            <rect x="40" y="32" width="520" height="355" fill="none" stroke="var(--pv-gold, #b47506)" strokeWidth="3" rx="4" />

            {/* Master Bedroom Suite */}
            <g
              className={`vm-svg-room ${hoveredRoom === 'Master Bedroom Suite' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredRoom('Master Bedroom Suite')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect x="45" y="37" width="250" height="200" fill="rgba(180,117,6,0.07)" stroke="#b47506" strokeWidth="1.5" />
              <rect x="110" y="70" width="115" height="90" rx="6" fill="none" stroke="rgba(167,138,90,0.5)" strokeWidth="1.5" />
              <text x="170" y="190" textAnchor="middle" className="vm-svg-room-name">MASTER BEDROOM SUITE</text>
              <text x="170" y="205" textAnchor="middle" className="vm-svg-room-dim">17'6" × 14'6"</text>
            </g>

            {/* Walk-in & Luxury Bath */}
            <g
              className={`vm-svg-room ${hoveredRoom === 'Walk-in Wardrobe' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredRoom('Walk-in Wardrobe')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect x="45" y="237" width="125" height="145" fill="rgba(180,117,6,0.04)" stroke="#b47506" strokeWidth="1.5" />
              <text x="107" y="300" textAnchor="middle" className="vm-svg-room-name">DRESSING</text>
              <text x="107" y="315" textAnchor="middle" className="vm-svg-room-dim">8'6" × 6'6"</text>
            </g>
            <g
              className={`vm-svg-room ${hoveredRoom === 'Luxury 4-Fixture Bath' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredRoom('Luxury 4-Fixture Bath')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect x="170" y="237" width="125" height="145" fill="rgba(180,117,6,0.04)" stroke="#b47506" strokeWidth="1.5" />
              <text x="232" y="300" textAnchor="middle" className="vm-svg-room-name">MASTER BATH</text>
              <text x="232" y="315" textAnchor="middle" className="vm-svg-room-dim">9'0" × 7'0"</text>
            </g>

            {/* Central Family Lounge */}
            <g
              className={`vm-svg-room ${hoveredRoom === 'Family TV Lounge' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredRoom('Family TV Lounge')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect x="295" y="37" width="130" height="180" fill="rgba(180,117,6,0.03)" stroke="#b47506" strokeWidth="1.5" />
              <text x="360" y="120" textAnchor="middle" className="vm-svg-room-name">FAMILY LOUNGE</text>
              <text x="360" y="135" textAnchor="middle" className="vm-svg-room-dim">13'6" × 11'0"</text>
            </g>

            {/* Viewing Balcony */}
            <g
              className={`vm-svg-room ${hoveredRoom === 'Wide Viewing Balcony' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredRoom('Wide Viewing Balcony')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect x="295" y="217" width="130" height="165" fill="rgba(245,158,11,0.06)" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2" />
              <text x="360" y="295" textAnchor="middle" className="vm-svg-room-name">VIEWING BALCONY</text>
              <text x="360" y="310" textAnchor="middle" className="vm-svg-room-dim">16'0" × 5'6"</text>
            </g>

            {/* Bed 2 */}
            <g
              className={`vm-svg-room ${hoveredRoom === 'Children\'s Bedroom (Bed 2)' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredRoom('Children\'s Bedroom (Bed 2)')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect x="425" y="37" width="130" height="230" fill="rgba(180,117,6,0.06)" stroke="#b47506" strokeWidth="1.5" />
              <rect x="450" y="80" width="80" height="70" rx="4" fill="none" stroke="rgba(167,138,90,0.5)" strokeWidth="1.2" />
              <text x="490" y="185" textAnchor="middle" className="vm-svg-room-name">BEDROOM 2</text>
              <text x="490" y="200" textAnchor="middle" className="vm-svg-room-dim">14'0" × 13'0"</text>
            </g>

            {/* Attached Bath 2 */}
            <g
              className={`vm-svg-room ${hoveredRoom === 'En-Suite Bathroom' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredRoom('En-Suite Bathroom')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect x="425" y="267" width="130" height="115" fill="rgba(180,117,6,0.03)" stroke="#b47506" strokeWidth="1.5" />
              <text x="490" y="320" textAnchor="middle" className="vm-svg-room-name">BATHROOM 2</text>
              <text x="490" y="335" textAnchor="middle" className="vm-svg-room-dim">8'0" × 5'6"</text>
            </g>
          </svg>
        );
      } else {
        // Terrace Plan
        return (
          <svg viewBox="0 0 600 420" className="vm-arch-svg" aria-label="3 BHK Terrace Plan">
            <defs>
              <pattern id="archGrid3t" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(167,138,90,0.08)" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="600" height="420" fill="url(#archGrid3t)" rx="8" />

            <text x="300" y="22" textAnchor="middle" className="vm-svg-dim">TERRACE &amp; SKY ENTERTAINMENT DECK</text>
            <rect x="40" y="32" width="520" height="355" fill="none" stroke="var(--pv-gold, #b47506)" strokeWidth="3" rx="4" />

            {/* Covered Gazebo */}
            <g
              className={`vm-svg-room ${hoveredRoom === 'Covered Gazebo & Bar Lounge' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredRoom('Covered Gazebo & Bar Lounge')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect x="50" y="45" width="230" height="180" fill="rgba(180,117,6,0.08)" stroke="#b47506" strokeWidth="1.5" />
              <text x="165" y="130" textAnchor="middle" className="vm-svg-room-name">COVERED GAZEBO &amp; BAR</text>
              <text x="165" y="145" textAnchor="middle" className="vm-svg-room-dim">14'0" × 12'0"</text>
            </g>

            {/* Open Sky Party Terrace */}
            <g
              className={`vm-svg-room ${hoveredRoom === 'Open Sky Party Terrace' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredRoom('Open Sky Party Terrace')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect x="280" y="45" width="270" height="335" fill="rgba(34,197,94,0.06)" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="415" y="200" textAnchor="middle" fill="#15803d" className="vm-svg-room-name">OPEN SKY PARTY TERRACE</text>
              <text x="415" y="215" textAnchor="middle" fill="#15803d" className="vm-svg-room-dim">24'0" × 16'0" (650 Sq.Ft)</text>
              <text x="415" y="235" textAnchor="middle" fill="#16a34a" style={{ fontSize: '11px' }}>✨ Barbecue Counter &amp; Star Deck</text>
            </g>

            {/* Solar water heater bay */}
            <g
              className={`vm-svg-room ${hoveredRoom === 'Solar Water Heater Bay' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredRoom('Solar Water Heater Bay')}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <rect x="50" y="225" width="230" height="155" fill="rgba(180,117,6,0.03)" stroke="#b47506" strokeWidth="1.5" />
              <text x="165" y="300" textAnchor="middle" className="vm-svg-room-name">SOLAR UTILITY BAY</text>
              <text x="165" y="315" textAnchor="middle" className="vm-svg-room-dim">10'0" × 8'0"</text>
            </g>
          </svg>
        );
      }
    }

    // Default: 4 BHK
    return (
      <svg viewBox="0 0 600 420" className="vm-arch-svg" aria-label="4 BHK Mansion Floor Plan">
        <defs>
          <pattern id="archGrid4" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(167,138,90,0.08)" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="600" height="420" fill="url(#archGrid4)" rx="8" />

        <text x="300" y="22" textAnchor="middle" className="vm-svg-dim">4 BHK PALATIAL MANSION · 3,200 SQ.FT · PRIVATE PLUNGE POOL</text>
        <rect x="35" y="32" width="530" height="355" fill="none" stroke="var(--pv-gold, #b47506)" strokeWidth="3" rx="4" />

        <rect x="42" y="39" width="180" height="150" fill="rgba(180,117,6,0.07)" stroke="#b47506" strokeWidth="1.5" strokeDasharray="4 2" />
        <text x="132" y="115" textAnchor="middle" className="vm-svg-room-name">DOUBLE SUV PORCH</text>
        <text x="132" y="130" textAnchor="middle" className="vm-svg-room-dim">20'0" × 18'0"</text>

        <rect x="222" y="39" width="170" height="170" fill="rgba(180,117,6,0.06)" stroke="#b47506" strokeWidth="1.5" />
        <text x="307" y="125" textAnchor="middle" className="vm-svg-room-name">GRAND SALON &amp; LIVING</text>
        <text x="307" y="140" textAnchor="middle" className="vm-svg-room-dim">22'0" × 17'0" (13ft H)</text>

        <rect x="392" y="39" width="166" height="170" fill="rgba(180,117,6,0.04)" stroke="#b47506" strokeWidth="1.5" />
        <text x="475" y="125" textAnchor="middle" className="vm-svg-room-name">SHOW KITCHEN &amp; WET</text>
        <text x="475" y="140" textAnchor="middle" className="vm-svg-room-dim">14'0" × 12'0"</text>

        <rect x="42" y="189" width="180" height="191" fill="rgba(6,182,212,0.09)" stroke="#0891b2" strokeWidth="1.5" strokeDasharray="3 3" />
        <text x="132" y="280" textAnchor="middle" fill="#0e7490" className="vm-svg-room-name">PLUNGE POOL &amp; DECK</text>
        <text x="132" y="295" textAnchor="middle" fill="#0e7490" className="vm-svg-room-dim">18'0" × 10'0"</text>

        <rect x="222" y="209" width="170" height="171" fill="rgba(180,117,6,0.03)" stroke="#b47506" strokeWidth="1.5" />
        <text x="307" y="290" textAnchor="middle" className="vm-svg-room-name">10-SEATER DINING</text>
        <text x="307" y="305" textAnchor="middle" className="vm-svg-room-dim">16'0" × 14'0"</text>

        <rect x="392" y="209" width="166" height="171" fill="rgba(180,117,6,0.05)" stroke="#b47506" strokeWidth="1.5" />
        <text x="475" y="290" textAnchor="middle" className="vm-svg-room-name">GUEST MASTER SUITE</text>
        <text x="475" y="305" textAnchor="middle" className="vm-svg-room-dim">15'6" × 14'0"</text>
      </svg>
    );
  };

  return (
    <div className="vm-floorplan-container">
      {/* Visual interactive plan viewport */}
      <div className="vm-floorplan-viewport">
        <div className="vm-floorplan-meta-header">
          <div className="vm-floorplan-badge">
            📐 Architectural Layout · {villa.label}
          </div>
          <div className="vm-floorplan-tools">
            <button
              className="vm-btn-icon-label"
              onClick={() => onOpenLightbox({
                type: 'svg',
                title: `${villa.fullName} — ${activePlan.toUpperCase()} FLOOR PLAN`,
                component: renderSvgPlan,
              })}
              title="Enlarge Floor Plan"
            >
              🔍 Enlarge Plan
            </button>
          </div>
        </div>

        <div className="vm-floorplan-svg-wrap">
          {renderSvgPlan()}
        </div>

        <div className="vm-floorplan-caption">
          <span>*Authentic architectural dimensions. Minor structural adjustments permissible within RERA boundaries.</span>
          <span style={{ color: '#22c55e', fontWeight: 600 }}>✓ 100% Vaastu Verified</span>
        </div>
      </div>

      {/* Room dimensions & floor breakdown table */}
      <div className="vm-floorplan-table-panel">
        <div className="vm-floorplan-table-header">
          <h4>Room Dimensions &amp; Specifications</h4>
          <span className="vm-plan-area-badge">
            {villa.area} Built-Up
          </span>
        </div>

        <div className="vm-room-list">
          {villa.features?.slice(0, 5).map((f, i) => (
            <div key={i} className="vm-room-feature-item">
              <span className="vm-room-check">✓</span>
              <span>{f}</span>
            </div>
          ))}
        </div>

        <div className="vm-plan-highlights-box">
          <div className="vm-plan-hl-title">🌟 Key Architectural Highlights:</div>
          <ul>
            <li>{villa.height} providing grand volumetric feel and natural ventilation</li>
            <li>{villa.parking} with pre-wired EV charging station conduit</li>
            <li>{villa.facing} with auspicious orientation</li>
          </ul>
        </div>

        <div className="vm-floorplan-action-row">
          <button
            className="btn btn-primary"
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => onEnquire(villa)}
          >
            Schedule Villa Tour
          </button>
          <button
            className="btn btn-outline"
            onClick={() => onOpenLightbox({
              type: 'svg',
              title: `${villa.fullName} — Architectural Layout`,
              component: renderSvgPlan,
            })}
          >
            View Full Plan
          </button>
        </div>
      </div>
    </div>
  );
}
