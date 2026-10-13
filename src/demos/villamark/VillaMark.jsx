import { useState } from 'react';
import { Link } from 'react-router-dom';
import DemoBar from '../../components/DemoBar.jsx';
import '../plotmark/PlotMark.css';
import './VillaMark.css';
import {
  VILLA_PROJECT,
  VILLA_TYPES,
  FLOOR_PLANS,
  AMENITIES,
  GALLERY_ITEMS,
  LOCATION_HIGHLIGHTS,
  ABOUT_PROJECT,
} from './villaMarkData.js';
import VillaFloorPlan from './VillaFloorPlan.jsx';

const PAGES = ['Home', 'About', 'Villa Types', 'Floor Plans', 'Amenities', 'Gallery', 'Location', 'Contact'];

export default function VillaMarkDemo() {
  const [activePage, setActivePage] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('page');
      if (p && PAGES.includes(p)) return p;
    }
    return 'Home';
  });

  const [activeType, setActiveType] = useState('3bhk');
  const [activePlan, setActivePlan] = useState('ground');
  const [galleryFilter, setGalleryFilter] = useState('All');
  const [lightboxData, setLightboxData] = useState(null); // { type: 'img' | 'svg', src, title, caption, component }

  // Contact form states
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    villaType: 'Gated Community Villa',
    visitDate: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const villa = VILLA_TYPES.find(v => v.id === activeType) || VILLA_TYPES[1];

  // Home page interactive EMI / Investment calculator state
  const [calcBudget, setCalcBudget] = useState(11500000); // Default ₹1.15 Cr (3 BHK)
  const [calcTenure, setCalcTenure] = useState(20); // 20 years
  const calcDownPayment = Math.round(calcBudget * 0.2); // 20%
  const calcLoanAmount = calcBudget - calcDownPayment;
  const calcMonthlyRate = 0.085 / 12; // 8.5% interest
  const calcTotalMonths = calcTenure * 12;
  const calcEstimatedEmi = Math.round(
    (calcLoanAmount * calcMonthlyRate * Math.pow(1 + calcMonthlyRate, calcTotalMonths)) /
    (Math.pow(1 + calcMonthlyRate, calcTotalMonths) - 1)
  );

  const formatInr = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakhs`;
    return `₹${val.toLocaleString()}`;
  };

  const handleSelectVilla = (villaId, targetPage = 'Villa Types') => {
    setActiveType(villaId);
    setActivePlan('ground');
    setContactForm(prev => ({
      ...prev,
      villaType: VILLA_TYPES.find(v => v.id === villaId)?.label || prev.villaType,
    }));
    setActivePage(targetPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnquireVilla = (selectedVilla) => {
    setContactForm(prev => ({
      ...prev,
      villaType: selectedVilla?.label || prev.villaType,
    }));
    setActivePage('Contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmittedData({ ...contactForm });
    }, 800);
  };

  const resetContactForm = () => {
    setSubmittedData(null);
    setContactForm({
      name: '',
      phone: '',
      email: '',
      villaType: villa.label,
      visitDate: '',
      notes: '',
    });
  };

  // WhatsApp click handler
  const waUrl = (customText) => {
    const text = customText || `Hello VillaMark, I would like to enquire about the ${villa.fullName} (${villa.price}) and schedule a private site visit.`;
    return `https://wa.me/${VILLA_PROJECT.whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  const filteredGallery = galleryFilter === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === galleryFilter);

  return (
    <div className="pm-demo">
      <DemoBar
        templateSlug="villamark"
        templateName="VillaMark"
        label="🏡 VillaMark — Luxury Villa Live Demo"
      />

      {/* ── Navigation ──────────────────────────────────────────────────────── */}
      <nav className="pm-nav" aria-label="VillaMark navigation">
        <div
          className="pm-nav__logo vm-logo"
          onClick={() => setActivePage('Home')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <span style={{ fontSize: '1.4rem' }}>🏡</span>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
            <span style={{ fontFamily: 'var(--font-display, serif)', fontWeight: 800, fontSize: '1.35rem', letterSpacing: '-0.02em', color: 'var(--vm-navy-text)' }}>
              Villa<span style={{ color: 'var(--vm-gold, #b47506)' }}>Mark</span>
            </span>
            <span style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--vm-gold)', textTransform: 'uppercase' }}>
              Luxury Villas &amp; Estates
            </span>
          </div>
        </div>

        <ul className="pm-nav__links">
          {PAGES.map(p => (
            <li key={p}>
              <button
                className={activePage === p ? 'active' : ''}
                onClick={() => {
                  setActivePage(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                {p}
              </button>
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            className="vm-btn-free-visit"
            onClick={() => {
              setActivePage('Contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            title="Book a Complimentary Villa Tour with Chauffeur Pickup"
          >
            <span className="vm-btn-free-visit__icon">🚗</span>
            <span>Free Site Visit</span>
            <span className="vm-btn-free-visit__tag">FREE</span>
          </button>
        </div>
      </nav>

      {/* ── Main Content Router ─────────────────────────────────────────────── */}
      <main className="pm-main">
        {/* 1. HOME PAGE */}
        {activePage === 'Home' && (
          <div>
            {/* Enhanced Hero Section with realistic architectural photography */}
            <section className="vm-hero">
              <div className="vm-hero__overlay" />
              <div className="container vm-hero__grid">
                <div className="vm-hero__content">
                  <div className="vm-hero-badge">
                    🏡 25-Acre Gated Villa Sanctuary · Hyderabad Airport Corridor
                  </div>
                  <h1 className="vm-hero__title">
                    Private Luxury Villas.<br />
                    <span className="gradient-text">Crafted for Generations.</span>
                  </h1>
                  <p className="vm-hero__sub">
                    Bespoke 2, 3 &amp; 4 BHK contemporary duplex &amp; triplex residences crafted on freehold land with 13-ft volumetric ceilings, private garden lawns, rooftop sky terraces, and an iconic 25,000 sq.ft resort clubhouse. Starting ₹85 Lakhs.
                  </p>

                  <div className="pm-hero__actions" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                      className="btn btn-primary btn-lg"
                      onClick={() => {
                        setActivePage('Villa Types');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      Explore 3 Villa Types →
                    </button>
                    <button
                      className="btn btn-outline btn-lg"
                      style={{ borderColor: 'rgba(255, 255, 255, 0.45)', color: '#ffffff' }}
                      onClick={() => {
                        setActivePage('Floor Plans');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      View Floor Plans
                    </button>
                    <a
                      href={waUrl()}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-ghost btn-lg"
                      style={{ border: '1px solid rgba(180, 117, 6, 0.45)', color: '#ffffff', background: 'rgba(15, 23, 42, 0.4)' }}
                    >
                      💬 WhatsApp Enquiry
                    </a>
                  </div>

                  {/* Key Project Metrics */}
                  <div className="vm-hero-stats-row">
                    <div className="vm-hero-stat-card">
                      <span className="vm-hero-stat-val">25 Acres</span>
                      <span className="vm-hero-stat-lbl">Gated Sanctuary</span>
                    </div>
                    <div className="vm-hero-stat-card">
                      <span className="vm-hero-stat-val">13 Ft</span>
                      <span className="vm-hero-stat-lbl">Ceiling Clearance</span>
                    </div>
                    <div className="vm-hero-stat-card">
                      <span className="vm-hero-stat-val">Zero</span>
                      <span className="vm-hero-stat-lbl">Shared Walls</span>
                    </div>
                    <div className="vm-hero-stat-card">
                      <span className="vm-hero-stat-val">₹85 L*</span>
                      <span className="vm-hero-stat-lbl">Starting Price</span>
                    </div>
                  </div>
                </div>

                {/* Hero Side Privilege Card */}
                <div className="vm-hero__side-card">
                  <div className="vm-hero-privilege-card">
                    <div className="vm-privilege-badge">
                      ★ LIMITED RELEASE · PHASE 1
                    </div>
                    <h3 className="vm-privilege-title">Book a Private Villa Walkthrough</h3>
                    <p className="vm-privilege-desc">
                      Experience our finished sample villa and tour the 25,000 sq.ft resort clubhouse with our chief architectural concierge.
                    </p>

                    <div className="vm-privilege-options">
                      {VILLA_TYPES.map(v => (
                        <div
                          key={v.id}
                          className={`vm-privilege-opt ${activeType === v.id ? 'active' : ''}`}
                          onClick={() => handleSelectVilla(v.id, 'Villa Types')}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong style={{ fontSize: '0.9rem' }}>{v.bhk} Villa</strong>
                            <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 700 }}>{v.startingPrice}</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', opacity: 0.85, marginTop: '2px' }}>
                            {v.builtUpArea} · {v.plotArea} Plot
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      className="btn btn-primary"
                      style={{ width: '100%', marginTop: '1.25rem', padding: '12px', fontWeight: 700 }}
                      onClick={() => {
                        setActivePage('Contact');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      Schedule VIP Site Visit →
                    </button>

                    <div className="vm-privilege-guarantee">
                      <span>✓ RERA Approved</span>
                      <span>✓ 100% Vaastu</span>
                      <span>✓ Freehold Titles</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Choose Your Villa Section with Professional Villa Images */}
            <section className="pm-section container">
              <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem' }}>
                <span className="vm-hero-badge" style={{ marginBottom: '0.75rem' }}>
                  Exquisite Residences
                </span>
                <h2 className="pm-section__title" style={{ margin: '0 0 0.75rem' }}>
                  Choose Your Villa
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  Select from our thoughtfully configured 2, 3, and 4 BHK luxury residences, each engineered for privacy, abundant natural light, and bespoke outdoor living.
                </p>
              </div>

              <div className="vm-type-grid">
                {VILLA_TYPES.map(v => (
                  <div
                    key={v.id}
                    className={`vm-type-card-pro ${activeType === v.id ? 'vm-type-card-pro--active' : ''}`}
                    onClick={() => handleSelectVilla(v.id, 'Villa Types')}
                  >
                    <div className="vm-type-card__media">
                      <img src={v.image} alt={v.label} className="vm-type-card__img" loading="lazy" />
                      <span className={`vm-type-card__badge-top ${v.badge === 'Most Popular' ? 'popular' : ''}`}>
                        {v.badge || v.type}
                      </span>
                      <span className="vm-type-card__status-pill">
                        ● {v.available} Available
                      </span>
                    </div>

                    <div className="vm-type-card__body">
                      <div className="vm-type-card__title-row">
                        <h3 className="vm-type-card__title">{v.label}</h3>
                        <span className="vm-type-card__price-tag">{v.price}</span>
                      </div>

                      <div className="vm-type-card__specs-row">
                        <span>📐 {v.area}</span>
                        <span>🛏️ {v.beds} Beds</span>
                        <span>🚿 {v.baths} Baths</span>
                        <span>🚗 {v.parking.split(' ')[0]} Car</span>
                      </div>

                      <ul className="vm-type-card__features-list">
                        {v.features.slice(0, 3).map((feat, idx) => (
                          <li key={idx}>
                            <span style={{ color: '#22c55e', fontWeight: 'bold' }}>✓</span> {feat}
                          </li>
                        ))}
                      </ul>

                      <div className="vm-type-card__footer">
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ flex: 1, justifyContent: 'center' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectVilla(v.id, 'Villa Types');
                          }}
                        >
                          View Details →
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectVilla(v.id, 'Floor Plans');
                          }}
                        >
                          Floor Plan
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Section 2: The Art of Villa Living (Distinctive Architectural Pillars) ── */}
            <section className="pm-section container">
              <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
                <span className="vm-hero-badge" style={{ marginBottom: '0.75rem' }}>
                  Architectural Distinction
                </span>
                <h2 className="pm-section__title" style={{ margin: '0 0 0.75rem' }}>
                  The Art of Villa Living
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  Unlike congested high-rise apartments or vacant plotted lands, VillaMark offers complete individual land ownership with volumetric 13ft ceilings, private garden lawns, and an elite 25-acre sanctuary.
                </p>
              </div>

              <div className="vm-lifestyle-grid">
                <div className="vm-lifestyle-card">
                  <div className="vm-lifestyle-icon">🏛️</div>
                  <h3>13 Ft Ceiling Clearance</h3>
                  <p>
                    Soaring vertical clearance on the ground floor provides unmatched architectural volume, superior natural illumination, and cooler ambient indoor temperatures.
                  </p>
                  <div className="vm-lifestyle-metric">Volumetric Living Luxury</div>
                </div>

                <div className="vm-lifestyle-card">
                  <div className="vm-lifestyle-icon">🌿</div>
                  <h3>Private Garden &amp; Sit-Out</h3>
                  <p>
                    Every villa includes your own freehold soil with landscaped front and backyard lawns, timber-finished sit-out decks, and private barbecue courtyards.
                  </p>
                  <div className="vm-lifestyle-metric">100% Freehold Land Ownership</div>
                </div>

                <div className="vm-lifestyle-card">
                  <div className="vm-lifestyle-icon">🚗</div>
                  <h3>Double Porch &amp; EV Ready</h3>
                  <p>
                    Wide covered portico accommodating up to two luxury SUVs, pre-wired with Level-2 high-speed electric vehicle charging conduit infrastructure.
                  </p>
                  <div className="vm-lifestyle-metric">Pre-Wired EV Charging Infrastructure</div>
                </div>

                <div className="vm-lifestyle-card">
                  <div className="vm-lifestyle-icon">✨</div>
                  <h3>Rooftop Sky Lounge &amp; Deck</h3>
                  <p>
                    Expansive open-sky party terrace with wooden pergola, outdoor bar counter, and unobstructed 360-degree sunset views across green canopies.
                  </p>
                  <div className="vm-lifestyle-metric">Private Penthouse Stargazing</div>
                </div>

                <div className="vm-lifestyle-card">
                  <div className="vm-lifestyle-icon">🧭</div>
                  <h3>100% Vaastu Compliant</h3>
                  <p>
                    Master-planned according to classical architectural energy principles with auspicious East and North entrances, Agni-corner modular kitchens, and master bedrooms.
                  </p>
                  <div className="vm-lifestyle-metric">Certified Energy Harmonization</div>
                </div>

                <div className="vm-lifestyle-card">
                  <div className="vm-lifestyle-icon">🛡️</div>
                  <h3>25-Acre Gated Sanctuary</h3>
                  <p>
                    Zero shared walls, underground electrical cabling, 40-ft wide concrete internal boulevards, RFID vehicle access control, and 24/7 security patrols.
                  </p>
                  <div className="vm-lifestyle-metric">65% Open Greenery &amp; Boulevards</div>
                </div>
              </div>
            </section>

            {/* ── Section 3: The Grand Clubhouse & Resort Sanctuary Spotlight ── */}
            <section className="pm-section container">
              <div className="vm-spotlight-box">
                <div className="vm-spotlight-media">
                  <img
                    src={VILLA_PROJECT.clubhouseImage}
                    alt="VillaMark Grand Resort Clubhouse"
                    className="vm-spotlight-img"
                    loading="lazy"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      background: 'rgba(15, 23, 42, 0.85)',
                      padding: '6px 14px',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#fbbf24',
                      border: '1px solid rgba(180, 117, 6, 0.35)',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    🏛️ The Grand Clubhouse Sanctuary
                  </div>
                </div>

                <div className="vm-spotlight-content">
                  <span className="vm-hero-badge" style={{ alignSelf: 'flex-start', marginBottom: '0.75rem' }}>
                    Resort-Grade Amenities
                  </span>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.75rem', color: 'var(--vm-navy-text)' }}>
                    Where Wellness Meets Unrivaled Grandeur
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7', margin: '0 0 1rem' }}>
                    Spanning 25,000 square feet across two levels, the VillaMark Clubhouse is crafted as an elite social and athletic retreat with half-Olympic temperature-controlled infinity pools, wellness spas, and private entertainment suites.
                  </p>

                  <div className="vm-spotlight-pills">
                    <span className="vm-spotlight-pill">🏊 Infinity Swimming Pool</span>
                    <span className="vm-spotlight-pill">🧖 Luxury Spa &amp; Steam</span>
                    <span className="vm-spotlight-pill">🏸 Badminton &amp; Squash</span>
                    <span className="vm-spotlight-pill">🍿 30-Seat Screening Room</span>
                    <span className="vm-spotlight-pill">🏋️ Technogym Fitness Suite</span>
                    <span className="vm-spotlight-pill">☕ Sunset Coffee Lounge</span>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setActivePage('Amenities');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      Explore All 9 Amenities →
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() => {
                        setActivePage('Contact');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      Book Clubhouse Tour
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Section 4: Interactive Floor Plans Preview (Bridge Epsilon Inspired) ── */}
            <section className="pm-section container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <span className="vm-hero-badge" style={{ marginBottom: '0.5rem' }}>
                    Architectural Precision
                  </span>
                  <h2 className="pm-section__title" style={{ margin: '0 0 0.25rem' }}>
                    Floor Plans at a Glance
                  </h2>
                  <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>
                    Select a villa configuration below to preview ground and upper level blueprints.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {VILLA_TYPES.map(v => (
                    <button
                      key={v.id}
                      className={`chip ${activeType === v.id ? 'active' : ''}`}
                      onClick={() => {
                        setActiveType(v.id);
                        setActivePlan('ground');
                      }}
                    >
                      {v.label}
                    </button>
                  ))}
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      setActivePage('Floor Plans');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    View Full Blueprints →
                  </button>
                </div>
              </div>

              <VillaFloorPlan
                villa={villa}
                activePlan={activePlan}
                onEnquire={handleEnquireVilla}
                onOpenLightbox={setLightboxData}
              />
            </section>

            {/* ── Section 5: Strategic Airport Growth Corridor Connectivity ── */}
            <section className="pm-section container">
              <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 2.5rem' }}>
                <span className="vm-hero-badge" style={{ marginBottom: '0.75rem' }}>
                  High-Growth Epicenter
                </span>
                <h2 className="pm-section__title" style={{ margin: '0 0 0.75rem' }}>
                  Minutes from Rajiv Gandhi Int'l Airport &amp; ORR
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  Nestled in the prime Tukkuguda investment corridor with immediate, signal-free 8-lane expressway access to Hyderabad's global tech and aerospace hubs.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                {LOCATION_HIGHLIGHTS.landmarks.slice(0, 4).map((lm, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: '14px',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      📍 Distance: {lm.dist}
                    </span>
                    <h4 style={{ margin: '0.25rem 0', fontSize: '1.05rem', color: 'var(--vm-navy-text)' }}>
                      {lm.place}
                    </h4>
                    <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--vm-gold)', marginTop: 'auto', paddingTop: '0.5rem' }}>
                      ⚡ {lm.time} Drive
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setActivePage('Location');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Explore All Landmarks &amp; Route Maps →
                </button>
              </div>
            </section>

            {/* ── Section 6: Villa Investment & Interactive EMI Calculator ── */}
            <section className="pm-section container">
              <div className="vm-calculator-card">
                <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 1.5rem' }}>
                  <span className="vm-hero-badge" style={{ marginBottom: '0.75rem' }}>
                    Transparent Ownership
                  </span>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem', color: 'var(--vm-navy-text)' }}>
                    📐 Villa Investment &amp; EMI Estimator
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Calculate your estimated down payment and monthly home loan outgo based on current bank approval terms (8.5% interest rate).
                  </p>
                </div>

                <div className="vm-calc-grid">
                  <div>
                    {/* Budget Slider */}
                    <div style={{ marginBottom: '1.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 700 }}>
                        <span>Target Villa Value:</span>
                        <span style={{ color: 'var(--vm-gold)', fontSize: '1.15rem' }}>
                          {formatInr(calcBudget)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="8500000"
                        max="16500000"
                        step="500000"
                        value={calcBudget}
                        onChange={e => setCalcBudget(Number(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--vm-gold)' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        <span>₹85 Lakhs (2 BHK)</span>
                        <span>₹1.15 Cr (3 BHK)</span>
                        <span>₹1.65 Cr (4 BHK)</span>
                      </div>
                    </div>

                    {/* Tenure Slider */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 700 }}>
                        <span>Loan Tenure:</span>
                        <span style={{ color: 'var(--vm-gold)', fontSize: '1.15rem' }}>
                          {calcTenure} Years
                        </span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="30"
                        step="5"
                        value={calcTenure}
                        onChange={e => setCalcTenure(Number(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--vm-gold)' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        <span>10 Years</span>
                        <span>20 Years (Standard)</span>
                        <span>30 Years</span>
                      </div>
                    </div>

                    <div style={{ background: 'rgba(180, 117, 6, 0.05)', borderRadius: '10px', padding: '1rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      <strong>✓ Pre-Approved Banking Partners:</strong> HDFC Bank, State Bank of India (SBI), ICICI Bank, Axis Bank with up to 80% funding.
                    </div>
                  </div>

                  {/* Result Box */}
                  <div className="vm-calc-result-box">
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Estimated Monthly EMI
                    </span>
                    <div className="vm-calc-emi-val">
                      ₹{calcEstimatedEmi.toLocaleString()}
                      <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>/mo*</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', margin: '1.25rem 0', textAlign: 'left', fontSize: '0.85rem' }}>
                      <div style={{ background: 'var(--bg-card)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Down Payment (20%)</span>
                        <strong>{formatInr(calcDownPayment)}</strong>
                      </div>
                      <div style={{ background: 'var(--bg-card)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Bank Loan (80%)</span>
                        <strong>{formatInr(calcLoanAmount)}</strong>
                      </div>
                    </div>

                    <a
                      href={waUrl(`Hi VillaMark, I would like to receive the complete price sheet, stamp duty estimation, and payment schedule for a ${formatInr(calcBudget)} villa.`)}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      💬 WhatsApp Detailed Cost Sheet
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Section 7: VIP Chauffeur & Site Visit Experience Banner ── */}
            <section className="pm-section container">
              <div className="vm-vip-banner">
                <div className="vm-vip-banner__content">
                  <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
                    Exclusive Private Tour
                  </span>
                  <h3 className="vm-vip-banner__title">
                    Experience VillaMark in Person
                  </h3>
                  <p style={{ margin: 0, opacity: 0.88, lineHeight: '1.7', fontSize: '0.95rem' }}>
                    Reserve your private villa preview with our senior luxury property advisor. We provide complimentary sanitized chauffeur pickup from Rajiv Gandhi Int'l Airport or the Financial District.
                  </p>

                  <div className="vm-vip-perks">
                    <span className="vm-vip-perk-item">🚗 Complimentary Luxury Chauffeur</span>
                    <span className="vm-vip-perk-item">🏡 Walkthrough of Model Villas</span>
                    <span className="vm-vip-perk-item">☕ Private Lounge Refreshments</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => {
                      setActivePage('Contact');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Schedule Private Visit →
                  </button>
                  <a
                    href={waUrl("Hello! I would like to schedule a VIP chauffeur site visit to VillaMark.")}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline btn-lg"
                    style={{ background: 'rgba(255,255,255,0.1)' }}
                  >
                    💬 Chat with Concierge
                  </a>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* 2. VILLA TYPES PAGE */}
        {activePage === 'Villa Types' && (
          <section className="pm-section container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <h2 className="pm-section__title" style={{ margin: 0 }}>Villa Residences</h2>
                <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
                  Explore floor configurations, architectural specifications, and availability.
                </p>
              </div>
              <div className="vm-tab-bar" style={{ margin: 0 }}>
                {VILLA_TYPES.map(v => (
                  <button
                    key={v.id}
                    className={`chip ${activeType === v.id ? 'active' : ''}`}
                    onClick={() => setActiveType(v.id)}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="vm-detail-pro">
              {/* Left Column: Visual Villa Imagery & Full Size View */}
              <div>
                <div className="vm-detail__gallery-frame">
                  <img
                    src={villa.image}
                    alt={villa.fullName}
                    className="vm-detail__gallery-img"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      right: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'rgba(15, 23, 42, 0.85)',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      backdropFilter: 'blur(6px)',
                      color: '#ffffff',
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{villa.fullName}</span>
                    <button
                      className="vm-btn-icon-label"
                      onClick={() => setLightboxData({
                        type: 'img',
                        src: villa.image,
                        title: villa.fullName,
                        caption: villa.description,
                      })}
                    >
                      🔍 Enlarge Photo
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: '1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem', color: 'var(--vm-gold)' }}>Architectural Overview</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.7', margin: 0 }}>
                    {villa.description}
                  </p>
                </div>
              </div>

              {/* Right Column: Detailed Specifications */}
              <div className="vm-detail__quick-info">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-gold">{villa.type}</span>
                  <span style={{ color: '#22c55e', fontWeight: 700, fontSize: '0.85rem' }}>
                    ● {villa.statusText}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.65rem', margin: '0.75rem 0 0.25rem', color: 'var(--vm-navy-text)' }}>
                  {villa.fullName}
                </h3>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--vm-gold)', marginBottom: '1.25rem' }}>
                  {villa.price}
                </div>

                <div className="vm-detail__specs-grid">
                  <div className="td-spec">
                    <span>Built-Up Area</span>
                    <strong>{villa.area}</strong>
                  </div>
                  <div className="td-spec">
                    <span>Carpet Area</span>
                    <strong>{villa.carpetArea}</strong>
                  </div>
                  <div className="td-spec">
                    <span>Plot Dimension</span>
                    <strong>{villa.plotArea}</strong>
                  </div>
                  <div className="td-spec">
                    <span>Bedrooms</span>
                    <strong>{villa.beds} En-Suite Beds</strong>
                  </div>
                  <div className="td-spec">
                    <span>Bathrooms</span>
                    <strong>{villa.baths} Luxury Baths</strong>
                  </div>
                  <div className="td-spec">
                    <span>Car Parking</span>
                    <strong>{villa.parking}</strong>
                  </div>
                  <div className="td-spec">
                    <span>Facing</span>
                    <strong>{villa.facing}</strong>
                  </div>
                  <div className="td-spec">
                    <span>Ceiling Height</span>
                    <strong>{villa.height}</strong>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h5 style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
                    Signature Inclusions:
                  </h5>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.875rem' }}>
                    {villa.features.map((f, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#22c55e', fontWeight: 'bold' }}>✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="vm-detail__actions">
                  <button
                    className="btn btn-primary"
                    style={{ flex: 1, justifyContent: 'center' }}
                    onClick={() => {
                      setActivePage('Floor Plans');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    View Floor Plans →
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => handleEnquireVilla(villa)}
                  >
                    Schedule Visit
                  </button>
                  <a
                    href={waUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost"
                    style={{ border: '1px solid rgba(180, 117, 6, 0.4)' }}
                  >
                    💬 WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 3. FLOOR PLANS PAGE (Bridge Epsilon Inspired) */}
        {activePage === 'Floor Plans' && (
          <section className="pm-section container">
            <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 2rem' }}>
              <span className="vm-hero-badge" style={{ marginBottom: '0.75rem' }}>
                Architectural Layouts
              </span>
              <h2 className="pm-section__title" style={{ margin: '0 0 0.75rem' }}>
                Floor Plans — {villa.fullName}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Explore authentic floor-by-floor architectural blueprints designed with 100% Vaastu orientation, optimal cross-ventilation, and generous spatial proportions.
              </p>
            </div>

            {/* Villa Configuration Tabs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              {VILLA_TYPES.map(v => (
                <button
                  key={v.id}
                  className={`chip ${activeType === v.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveType(v.id);
                    setActivePlan('ground');
                  }}
                >
                  {v.label} ({v.area})
                </button>
              ))}
            </div>

            {/* Floor Selector Pills */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '2rem', flexWrap: 'wrap' }}>
              {villa.floors.map(fl => (
                <button
                  key={fl}
                  className={`chip ${activePlan === fl ? 'active' : ''}`}
                  style={{
                    borderRadius: '8px',
                    padding: '8px 18px',
                    fontWeight: 700,
                  }}
                  onClick={() => setActivePlan(fl)}
                >
                  {fl === 'ground' ? '🏢 Ground Floor' : fl === 'first' ? '🛏️ First Floor' : '✨ Terrace / Sky Garden'}
                </button>
              ))}
            </div>

            {/* Architectural Layout Visualizer */}
            <VillaFloorPlan
              villa={villa}
              activePlan={activePlan}
              onEnquire={handleEnquireVilla}
              onOpenLightbox={setLightboxData}
            />
          </section>
        )}

        {/* 4. AMENITIES PAGE */}
        {activePage === 'Amenities' && (
          <section className="pm-section container">
            <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 2.5rem' }}>
              <span className="vm-hero-badge" style={{ marginBottom: '0.75rem' }}>
                Resort Living
              </span>
              <h2 className="pm-section__title" style={{ margin: '0 0 0.75rem' }}>
                World-Class Township Amenities
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Designed for active wellness, community celebrations, and serene privacy across 25 acres of gated luxury.
              </p>
            </div>

            <div className="vm-amenities-grid">
              {AMENITIES.map(amenity => (
                <div key={amenity.id} className="vm-amenity-card">
                  <div className="vm-amenity-card__media">
                    <img src={amenity.image} alt={amenity.title} className="vm-amenity-card__img" loading="lazy" />
                    <div className="vm-amenity-card__icon-badge">{amenity.icon}</div>
                  </div>
                  <div className="vm-amenity-card__body">
                    <h3 className="vm-amenity-card__title">{amenity.title}</h3>
                    <span className="vm-amenity-card__sub">{amenity.subtitle}</span>
                    <p className="vm-amenity-card__desc">{amenity.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. GALLERY PAGE */}
        {activePage === 'Gallery' && (
          <section className="pm-section container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <h2 className="pm-section__title" style={{ margin: 0 }}>Visual Showcase</h2>
                <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
                  Explore villa exteriors, double-height interiors, landscaped boulevards, and clubhouse sanctuaries.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['All', 'Exterior', 'Interior', 'Amenities'].map(cat => (
                  <button
                    key={cat}
                    className={`chip ${galleryFilter === cat ? 'active' : ''}`}
                    onClick={() => setGalleryFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="vm-gallery-grid">
              {filteredGallery.map(item => (
                <div
                  key={item.id}
                  className="vm-gallery-card"
                  onClick={() => setLightboxData({
                    type: 'img',
                    src: item.image,
                    title: item.title,
                    caption: item.desc,
                  })}
                >
                  <img src={item.image} alt={item.title} className="vm-gallery-card__img" loading="lazy" />
                  <div className="vm-gallery-card__overlay">
                    <span className="vm-gallery-card__tag">{item.category}</span>
                    <h4 className="vm-gallery-card__title">{item.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. LOCATION PAGE */}
        {activePage === 'Location' && (
          <section className="pm-section container">
            <div style={{ maxWidth: '680px', marginBottom: '2rem' }}>
              <span className="vm-hero-badge" style={{ marginBottom: '0.75rem' }}>
                Strategic Connectivity
              </span>
              <h2 className="pm-section__title" style={{ margin: '0 0 0.75rem' }}>
                Prime Growth Corridor Location
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Strategically positioned in the high-growth Tukkuguda / Airport corridor with direct signal-free access to Nehru Outer Ring Road (ORR Exit 14), international schools, and prime employment zones.
              </p>
            </div>

            <div className="vm-location-grid">
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--vm-navy-text)' }}>
                  📍 Key Landmarks &amp; Driving Times
                </h3>
                {LOCATION_HIGHLIGHTS.landmarks.map((lm, idx) => (
                  <div key={idx} className="vm-landmark-card">
                    <span className="vm-landmark-place">{lm.place}</span>
                    <div className="vm-landmark-meta">
                      <span className="vm-landmark-dist">{lm.dist}</span>
                      <span className="vm-landmark-time">{lm.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="vm-map-container">
                <div>
                  <h3 style={{ fontSize: '1.25rem', margin: '0 0 0.5rem', color: 'var(--vm-navy-text)' }}>
                    🗺️ Location Map &amp; Directions
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                    {LOCATION_HIGHLIGHTS.address}
                  </p>

                  <div
                    style={{
                      height: '240px',
                      background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      gap: '8px',
                      border: '1px solid rgba(180, 117, 6, 0.3)',
                      marginBottom: '1.5rem',
                      textAlign: 'center',
                      padding: '1.5rem',
                    }}
                  >
                    <div style={{ fontSize: '2.5rem' }}>📍</div>
                    <strong style={{ fontSize: '1.1rem' }}>VillaMark Luxury Gated Community</strong>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Near ORR Exit 14 · Airport Corridor, Hyderabad</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <a
                    href={LOCATION_HIGHLIGHTS.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    Open in Google Maps →
                  </a>
                  <button
                    className="btn btn-outline"
                    onClick={() => setActivePage('Contact')}
                  >
                    Schedule Chauffeur Visit
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 7. ABOUT PAGE */}
        {activePage === 'About' && (
          <div className="pm-section container">
            <div style={{ maxWidth: '780px', margin: '0 auto 2.5rem', textAlign: 'center' }}>
              <span className="vm-hero-badge" style={{ marginBottom: '0.75rem' }}>
                Vision &amp; Craftsmanship
              </span>
              <h2 className="pm-section__title" style={{ margin: '0 0 0.75rem' }}>
                {ABOUT_PROJECT.title}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.8' }}>
                {ABOUT_PROJECT.intro}
              </p>
            </div>

            {/* Architectural Highlights Row */}
            <div className="vm-about-stats-grid">
              {ABOUT_PROJECT.highlights.map((hl, idx) => (
                <div key={idx} className="vm-about-stat-card">
                  <div className="vm-about-stat-num">{hl.num}</div>
                  <div className="vm-about-stat-title">{hl.label}</div>
                  <div className="vm-about-stat-desc">{hl.desc}</div>
                </div>
              ))}
            </div>

            {/* Technical Construction Specifications */}
            <div style={{ marginTop: '3.5rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.6rem', color: 'var(--vm-navy-text)', margin: '0 0 0.5rem' }}>
                  Premium Construction Specifications
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Engineered with top-tier materials, smart home provisions, and sustainable green building standards.
                </p>
              </div>

              <div className="vm-specs-table">
                {ABOUT_PROJECT.specifications.map((spec, i) => (
                  <div key={i} className="vm-spec-item">
                    <h4><span>🏛️</span> {spec.title}</h4>
                    <p>{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 8. CONTACT PAGE */}
        {activePage === 'Contact' && (
          <div className="pm-section container" style={{ maxWidth: '640px' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span className="vm-hero-badge" style={{ marginBottom: '0.75rem' }}>
                Personalized Tour
              </span>
              <h2 className="pm-section__title" style={{ margin: '0 0 0.5rem' }}>
                Schedule a Private Site Visit
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Experience the manicured landscaping, model villa interiors, and resort clubhouse in person. Chauffeur pickup available upon request.
              </p>
            </div>

            {submittedData ? (
              <div
                className="contact-success"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '2.5rem',
                  textAlign: 'center',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                <h3 style={{ margin: '0 0 0.5rem', color: 'var(--vm-navy-text)' }}>
                  Visit Successfully Requested!
                </h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 1.5rem', lineHeight: '1.6' }}>
                  Thank you, <strong>{submittedData.name}</strong>. Our senior villa specialist will connect with you at <strong>{submittedData.phone}</strong> within 2 hours to confirm your private preview for the <strong>{submittedData.villaType}</strong>.
                </p>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button className="btn btn-outline" onClick={resetContactForm}>
                    Submit Another Inquiry
                  </button>
                  <a
                    href={waUrl(`Hi VillaMark, I just submitted a visit request for ${submittedData.name} (${submittedData.villaType}). Please share the route map.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                  >
                    💬 Chat on WhatsApp Now
                  </a>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleContactSubmit}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '2rem',
                  boxShadow: '0 6px 25px rgba(0, 0, 0, 0.04)',
                }}
              >
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 650, fontSize: '0.85rem' }}>
                    Full Name *
                  </label>
                  <input
                    className="input"
                    placeholder="e.g. Ramesh Varma"
                    required
                    value={contactForm.name}
                    onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 650, fontSize: '0.85rem' }}>
                      Mobile Number *
                    </label>
                    <input
                      className="input"
                      placeholder="+91 98765 43210"
                      type="tel"
                      required
                      value={contactForm.phone}
                      onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 650, fontSize: '0.85rem' }}>
                      Email Address (Optional)
                    </label>
                    <input
                      className="input"
                      placeholder="name@example.com"
                      type="email"
                      value={contactForm.email}
                      onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 650, fontSize: '0.85rem' }}>
                      Preferred Villa Configuration
                    </label>
                    <select
                      className="input"
                      value={contactForm.villaType}
                      onChange={e => setContactForm({ ...contactForm, villaType: e.target.value })}
                    >
                      {VILLA_TYPES.map(v => (
                        <option key={v.id} value={v.label}>
                          {v.label} ({v.area} · {v.price})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 650, fontSize: '0.85rem' }}>
                      Preferred Visit Date
                    </label>
                    <input
                      className="input"
                      type="date"
                      value={contactForm.visitDate}
                      onChange={e => setContactForm({ ...contactForm, visitDate: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 650, fontSize: '0.85rem' }}>
                    Special Requests or Questions
                  </label>
                  <textarea
                    className="input"
                    rows="3"
                    placeholder="Let us know if you need chauffeur pickup or specific plot facing details..."
                    value={contactForm.notes}
                    onChange={e => setContactForm({ ...contactForm, notes: e.target.value })}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={submitting}
                  style={{ justifyContent: 'center', marginTop: '0.5rem' }}
                >
                  {submitting ? 'Confirming Schedule...' : 'Schedule Site Visit →'}
                </button>
              </form>
            )}
          </div>
        )}
      </main>

      {/* ── Lightbox Modal for Gallery & Architectural Plans ─────────────────── */}
      {lightboxData && (
        <div
          className="vm-lightbox"
          onClick={() => setLightboxData(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="vm-lightbox__content" onClick={e => e.stopPropagation()}>
            <button
              className="vm-lightbox__close"
              onClick={() => setLightboxData(null)}
              aria-label="Close"
            >
              ✕
            </button>

            <div className="vm-lightbox__viewport">
              {lightboxData.type === 'svg' && lightboxData.component ? (
                <div style={{ width: '100%', maxWidth: '800px', padding: '1rem' }}>
                  {lightboxData.component()}
                </div>
              ) : (
                <img
                  src={lightboxData.src}
                  alt={lightboxData.title}
                />
              )}
            </div>

            <div className="vm-lightbox__caption">
              <h4>{lightboxData.title}</h4>
              <p>{lightboxData.caption || 'VillaMark — Luxury Villa Live Demo'}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Floating WhatsApp Button ─────────────────────────────────────────── */}
      <a
        href={waUrl()}
        target="_blank"
        rel="noreferrer"
        className="vm-whatsapp-float"
        aria-label="Chat on WhatsApp"
        title="Chat with Luxury Villa Concierge"
      >
        <span className="vm-whatsapp-pulse" />
        <span>💬</span>
      </a>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="vm-footer" role="contentinfo">
        <div className="vm-footer__container">
          {/* Col 1: Brand & About */}
          <div>
            <div className="vm-footer__brand-wrap">
              <div className="vm-footer__brand-icon">VM</div>
              <div className="vm-footer__brand-name">
                Villa<span>Mark</span>
              </div>
            </div>
            <p className="vm-footer__desc">
              Ultra-luxury contemporary gated villa community. 13ft high ceilings, private garden lawns, and high appreciation airport growth corridor.
            </p>
            <div>
              <a
                href={waUrl()}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary btn-sm"
                style={{ fontSize: '0.8125rem', padding: '0.55rem 1.15rem' }}
              >
                💬 Chat with Sales Advisor
              </a>
            </div>
          </div>

          {/* Col 2: Quick Navigation */}
          <div>
            <h4 className="vm-footer__col-title">Quick Navigation</h4>
            <ul className="vm-footer__links">
              {[
                { id: 'Home', label: 'Home' },
                { id: 'About', label: 'About Us' },
                { id: 'Villa Types', label: 'Villa Residences' },
                { id: 'Floor Plans', label: 'Project Floor Plans' },
                { id: 'Amenities', label: 'Township Amenities' },
                { id: 'Gallery', label: 'Photo Gallery' },
                { id: 'Location', label: 'Location Advantages' },
              ].map(link => (
                <li key={link.id}>
                  <button
                    className="vm-footer__link"
                    onClick={() => {
                      setActivePage(link.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Villa Residences */}
          <div>
            <h4 className="vm-footer__col-title">Our Villas</h4>
            <ul className="vm-footer__links">
              {VILLA_TYPES.map(v => (
                <li key={v.id}>
                  <button
                    className="vm-footer__link"
                    onClick={() => handleSelectVilla(v.id, 'Villa Types')}
                  >
                    {v.fullName} ({v.area})
                  </button>
                </li>
              ))}
              <li>
                <button
                  className="vm-footer__link"
                  onClick={() => {
                    setActivePage('Floor Plans');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Architectural Blueprints
                </button>
              </li>
              <li>
                <button
                  className="vm-footer__link"
                  onClick={() => {
                    setActivePage('Contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Schedule Site Visit
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Office & Contacts */}
          <div>
            <h4 className="vm-footer__col-title">Office &amp; Contacts</h4>
            <p className="vm-footer__contact-item">
              📍 Tukkuguda, Airport Growth Corridor, Hyderabad, Telangana
            </p>
            <p className="vm-footer__contact-item">
              📞 Phone: <strong>{VILLA_PROJECT.contactPhone}</strong>
            </p>
            <p className="vm-footer__contact-item">
              💬 WhatsApp: <strong>+{VILLA_PROJECT.whatsappNumber}</strong>
            </p>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Working Hours: 9:00 AM – 7:30 PM (All 7 Days)
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="vm-footer__bottom">
          <div>
            © 2026 VillaMark — Luxury Villas · Gated Community. Developed as a showcase template for <Link to="/" style={{ color: 'var(--vm-gold)', textDecoration: 'underline' }}>DeccanIDentity</Link>.
          </div>
          <div style={{ fontSize: '0.75rem' }}>
            RERA: {VILLA_PROJECT.reraNumber}. All layouts adhere to local town planning approvals. Details &amp; sanction letters available on request.
          </div>
        </div>
      </footer>
    </div>
  );
}
