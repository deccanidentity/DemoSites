import { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import siteConfig from '../../data/site.config.js';
import DemoBar from '../../components/DemoBar.jsx';
import '../plotmark/PlotMark.css';
import './FlatMark.css';
import {
  PROJECT_INFO,
  TOWERS,
  FLOOR_PLANS,
  AMENITIES,
  GALLERY_ITEMS,
} from './flatMarkData.js';

export default function FlatMarkDemo() {
  const [activePage, setActivePage] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('page');
      if (p) {
        if (p === 'amenities' || p === 'location') return 'highlights';
        return p;
      }
    }
    return 'home';
  });

  // Preview mode: 'web' | 'tab' | 'mobile'
  const [previewMode, setPreviewMode] = useState('web');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const screenRef = useRef(null);

  // Selected tower for filtering floor plans or viewing tower details
  const [selectedTower, setSelectedTower] = useState(TOWERS[0]);

  // Floor plan tab
  const [activePlanId, setActivePlanId] = useState('2bhk');

  // Gallery filter
  const [galleryFilter, setGalleryFilter] = useState('all');
  const [lightboxData, setLightboxData] = useState(null);

  // Modals
  const [showBrochureModal, setShowBrochureModal] = useState(false);
  const [brochureForm, setBrochureForm] = useState({ name: '', phone: '' });
  const [brochureDone, setBrochureDone] = useState(false);

  // Contact / Visit form
  const [visitForm, setVisitForm] = useState({
    name: '',
    phone: '',
    tower: 'Tower A — The Azure',
    bhk: '2 BHK',
    date: '',
    timeSlot: 'Morning (10:00 AM - 1:00 PM)',
    notes: '',
  });
  const [visitLoading, setVisitLoading] = useState(false);
  const [visitDone, setVisitDone] = useState(false);

  // WhatsApp Link Helper
  const getWhatsAppUrl = (customText) => {
    const phone = siteConfig.whatsapp.replace(/\D/g, '');
    const defaultMsg = `Hi FlatMark team, I am interested in FlatMark Skyline Residences. Please share the pricing, tower brochures, and floor plans.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(customText || defaultMsg)}`;
  };

  // Active Floor Plan object
  const activePlan = useMemo(() => {
    return FLOOR_PLANS.find(p => p.id === activePlanId) || FLOOR_PLANS[0];
  }, [activePlanId]);

  // Gallery filtered items
  const filteredGallery = useMemo(() => {
    if (galleryFilter === 'all') return GALLERY_ITEMS;
    return GALLERY_ITEMS.filter(item => item.category === galleryFilter);
  }, [galleryFilter]);

  // Handle Brochure download
  const handleBrochureDownload = (e) => {
    e.preventDefault();
    if (!brochureForm.name || brochureForm.phone.length < 10) return;

    const content = `=====================================================================
${PROJECT_INFO.name.toUpperCase()} — OFFICIAL RESIDENTIAL BROCHURE
=====================================================================
Tagline: ${PROJECT_INFO.tagline}
RERA Registration: ${PROJECT_INFO.rera}
Location: ${PROJECT_INFO.location}
Possession Target: ${PROJECT_INFO.possession}

TOWERS OVERVIEW:
- Tower A (The Azure): 10 Floors (2 BHK & 3 BHK)
- Tower B (The Apex): 12 Floors (2 BHK, 3 BHK & 4 BHK Sky Penthouses)
- Tower C (The Aria): 8 Floors (2 BHK Boutique Residences)

KEY CONFIGURATIONS & PRICING:
- 2 BHK Smart Luxury: 1,150 Sq.Ft | Carpet: 860 Sq.Ft | Starting ₹65.5 Lakhs*
- 3 BHK Royal Residence: 1,680 Sq.Ft | Carpet: 1,260 Sq.Ft | Starting ₹95.8 Lakhs*
- 4 BHK Sky Penthouse: 2,450 Sq.Ft | Carpet: 1,890 Sq.Ft | Starting ₹1.48 Cr*

CLUBHOUSE & RECREATIONAL AMENITIES:
- Half-Olympic Temperature Controlled Swimming Pool
- 25,000 Sq.Ft Grand Recreational Clubhouse
- Technogym Certified Fitness Studio & Aerobics Room
- 78% Landscaped Vehicular-Free Podium Deck
- 3-Level Basement Parking with EV Charging Conduits
- 3-Tier Security with RFID Access & 24/7 CCTV

SALES & SITE OFFICE:
Phone: ${siteConfig.phone}
WhatsApp: ${siteConfig.whatsapp}
Website: https://deccanidentity.com/demo/flatmark
=====================================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FlatMark-Skyline-Residences-Brochure.txt`;
    link.click();

    setBrochureDone(true);
  };

  // Handle Visit form submission
  const handleVisitSubmit = (e) => {
    e.preventDefault();
    if (!visitForm.name || visitForm.phone.length < 10) return;
    setVisitLoading(true);
    setTimeout(() => {
      setVisitLoading(false);
      setVisitDone(true);
    }, 700);
  };

  // Scroll helpers
  const scrollToTop = () => {
    if (screenRef.current) {
      screenRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id) => {
    const doScroll = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    if (activePage !== 'home') {
      setActivePage('home');
      setTimeout(doScroll, 100);
    } else {
      doScroll();
    }
  };

  return (
    <div className={`pm-demo fm-theme fm-preview-shell fm-preview-shell--${previewMode}`}>
      <DemoBar
        templateSlug="flatmark"
        templateName="FlatMark"
        label="🏢 FlatMark — Premium Apartment Demo"
        previewMode={previewMode}
        onPreviewModeChange={setPreviewMode}
      />

      <div className={`fm-preview-stage fm-preview-stage--${previewMode} ${previewMode !== 'web' ? 'fm-preview-stage--framed' : ''}`}>
        <div className={`fm-device-frame fm-device-frame--${previewMode}`}>
          {previewMode === 'mobile' && (
            <div className="fm-device-notch" aria-hidden="true">
              <span className="fm-device-camera" />
              <span className="fm-device-speaker" />
            </div>
          )}
          {previewMode === 'tab' && (
            <div className="fm-device-tablet-cam" aria-hidden="true">
              <span className="fm-device-camera" />
            </div>
          )}
          <div className="fm-device-screen" ref={screenRef}>
            {/* ── Navigation ──────────────────────────────────────────────────────── */}
            <nav className="pm-nav fm-nav" aria-label="FlatMark navigation">
              <div
                className="pm-nav__logo fm-nav__logo"
                onClick={() => { setActivePage('home'); scrollToTop(); }}
                role="button"
                tabIndex={0}
              >
          <span className="fm-nav__logo-icon">🏢</span>
          <div className="fm-nav__logo-text">
            <span className="fm-nav__logo-title">
              Flat<span>Mark</span>
            </span>
            <span className="fm-nav__logo-sub">
              Skyline Residences
            </span>
          </div>
        </div>

        <ul className="pm-nav__links fm-nav__links">
          {[
            { id: 'home', label: 'Home' },
            { id: 'about', label: 'About' },
            { id: 'towers', label: 'Towers' },
            { id: 'floorplans', label: 'Floor Plans' },
            { id: 'highlights', label: 'Project Highlights' },
            { id: 'gallery', label: 'Gallery' },
            { id: 'contact', label: 'Contact' },
          ].map(p => {
            const isActive = activePage === p.id || (p.id === 'highlights' && (activePage === 'amenities' || activePage === 'location'));
            return (
              <li key={p.id}>
                <button
                  className={`fm-nav__btn ${isActive ? 'fm-nav__btn--active' : ''}`}
                  onClick={() => {
                    setActivePage(p.id);
                    scrollToTop();
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {p.label}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="fm-nav__actions">
          <button
            className="fm-nav__brochure-btn"
            onClick={() => setShowBrochureModal(true)}
          >
            📥 Brochure
          </button>
          <button
            className="fm-btn-free-visit"
            onClick={() => {
              setActivePage('contact');
              scrollToTop();
            }}
            title="Book a Complimentary Site Visit with Pickup"
          >
            <span className="fm-btn-free-visit__icon">🚗</span>
            <span>Free Site Visit</span>
            <span className="fm-btn-free-visit__tag">FREE</span>
          </button>

          <button
            className={`pm-nav__hamburger ${mobileMenuOpen ? 'open' : ''}`}
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            <span className="pm-hamburger-bar"></span>
            <span className="pm-hamburger-bar"></span>
            <span className="pm-hamburger-bar"></span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`pm-mobile-drawer-overlay ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden={!mobileMenuOpen}
      >
        <aside
          className="pm-mobile-drawer"
          onClick={e => e.stopPropagation()}
          role="dialog"
          aria-label="Mobile Navigation Menu"
        >
          <div className="pm-mobile-drawer__header">
            <div
              className="pm-nav__logo fm-nav__logo"
              onClick={() => {
                setActivePage('home');
                scrollToTop();
                setMobileMenuOpen(false);
              }}
              style={{ cursor: 'pointer' }}
            >
              <span className="fm-nav__logo-icon">🏢</span>
              <div className="fm-nav__logo-text">
                <span className="fm-nav__logo-title">Flat<span>Mark</span></span>
                <span className="fm-nav__logo-sub">Skyline Residences</span>
              </div>
            </div>
            <button
              className="pm-mobile-drawer__close"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <nav className="pm-mobile-drawer__nav">
            <div className="pm-mobile-nav__group">
              <div className="pm-mobile-nav__label">Navigation Menu</div>
              {[
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'About' },
                { id: 'towers', label: 'Towers' },
                { id: 'floorplans', label: 'Floor Plans' },
                { id: 'highlights', label: 'Project Highlights' },
                { id: 'gallery', label: 'Gallery' },
                { id: 'contact', label: 'Contact' },
              ].map(p => (
                <button
                  key={p.id}
                  className={`pm-mobile-nav__item ${activePage === p.id ? 'active' : ''}`}
                  onClick={() => {
                    setActivePage(p.id);
                    scrollToTop();
                    setMobileMenuOpen(false);
                  }}
                >
                  <span className="pm-mobile-nav__text">{p.label}</span>
                  {activePage === p.id && <span className="pm-mobile-nav__dot">●</span>}
                </button>
              ))}
            </div>
          </nav>

          <div className="pm-mobile-drawer__footer">
            <button
              className="btn btn-outline pm-mobile-drawer__btn"
              onClick={() => {
                setShowBrochureModal(true);
                setMobileMenuOpen(false);
              }}
            >
              📥 Download Brochure
            </button>
            <button
              className="btn btn-primary pm-mobile-drawer__btn"
              onClick={() => {
                setActivePage('contact');
                scrollToTop();
                setMobileMenuOpen(false);
              }}
            >
              🚗 Book Free Site Visit
            </button>
          </div>
        </aside>
      </div>

      {/* ── Main Router ─────────────────────────────────────────────────────── */}
      <main className="pm-main">
        {/* 1. HOME VIEW */}
        {activePage === 'home' && (
          <div>
            {/* Enhanced Hero Section with photorealistic apartment photography */}
            <section className="fm-hero">
              <div className="fm-hero__overlay" />
              <div className="container fm-hero__content">
                <div className="badge fm-badge">
                  🏢 6.5-Acre Gated Community · Hyderabad Financial District
                </div>
                <h1 className="fm-hero__title">
                  Elevated Living.<br />
                  <span className="gradient-text">Above the Ordinary.</span>
                </h1>
                <p className="fm-hero__sub">
                  2, 3 &amp; 4 BHK contemporary luxury residences across 3 iconic high-rise towers with panoramic balconies, an elevated resort podium, and a 25,000 sq.ft grand clubhouse. Starting ₹65 Lakhs*.
                </p>

                <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
                  <button
                    className="btn btn-lg"
                    style={{ background: '#2563EB', color: '#fff', borderRadius: 'var(--radius-pill)', padding: '14px 28px', fontWeight: 700 }}
                    onClick={() => {
                      setActivePage('floorplans');
                      scrollToTop();
                    }}
                  >
                    Explore Floor Plans →
                  </button>
                  <button
                    className="fm-btn-free-visit fm-btn-free-visit--lg"
                    onClick={() => {
                      setActivePage('contact');
                      scrollToTop();
                    }}
                  >
                    <span className="fm-btn-free-visit__icon">🚗</span>
                    <span>Book Free Site Visit</span>
                    <span className="fm-btn-free-visit__tag">FREE</span>
                  </button>
                  <button
                    className="btn btn-outline btn-lg"
                    style={{ borderColor: 'rgba(96,165,250,0.5)', color: '#ffffff', background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(6px)' }}
                    onClick={() => setShowBrochureModal(true)}
                  >
                    📥 Download Brochure
                  </button>
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost btn-lg"
                    style={{ border: '1px solid rgba(96,165,250,0.5)', color: '#93c5fd', background: 'rgba(37,99,235,0.15)', backdropFilter: 'blur(6px)' }}
                  >
                    💬 WhatsApp Enquiry
                  </a>
                </div>

                {/* Key Metrics Row */}
                <div className="fm-hero-stats-row">
                  <div className="fm-hero-stat-card">
                    <span className="fm-hero-stat-val">3 Towers</span>
                    <span className="fm-hero-stat-lbl">G+12 High-Rise</span>
                  </div>
                  <div className="fm-hero-stat-card">
                    <span className="fm-hero-stat-val">78%</span>
                    <span className="fm-hero-stat-lbl">Open Podium Deck</span>
                  </div>
                  <div className="fm-hero-stat-card">
                    <span className="fm-hero-stat-val">25,000 SFT</span>
                    <span className="fm-hero-stat-lbl">Grand Clubhouse</span>
                  </div>
                  <div className="fm-hero-stat-card">
                    <span className="fm-hero-stat-val">₹65 L*</span>
                    <span className="fm-hero-stat-lbl">Starting Price</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Choose Your Tower Section */}
            <section className="pm-section container" id="towers">
              <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem' }}>
                <span className="fm-badge" style={{ marginBottom: '0.75rem' }}>
                  Architectural Masterpieces
                </span>
                <h2 className="pm-section__title" style={{ margin: '0 0 0.75rem' }}>
                  Choose Your Tower
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  Three distinctly engineered residential towers, oriented for maximum cross-ventilation, abundant sunlight, and unobstructed skyline vistas.
                </p>
              </div>

              <div className="fm-tower-grid">
                {TOWERS.map(t => (
                  <div
                    key={t.id}
                    className={`fm-tower-card ${selectedTower.id === t.id ? 'fm-tower-card--active' : ''}`}
                    onClick={() => {
                      setSelectedTower(t);
                      setActivePage('floorplans');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <div className="fm-tower-card__media">
                      <img src={t.image} alt={t.name} className="fm-tower-card__img" loading="lazy" />
                      <div className="fm-tower-card__badge-top">{t.badge}</div>
                      <div className="fm-tower-card__status-pill">● {t.status}</div>
                    </div>
                    <div className="fm-tower-card__body">
                      <h3 className="fm-tower-card__title">{t.name}</h3>
                      <p className="fm-tower-card__desc">{t.description}</p>

                      <div className="fm-tower-card__configs">
                        {t.units.map(u => (
                          <span key={u} className="fm-tower-card__config-pill">{u}</span>
                        ))}
                      </div>

                      <ul className="fm-tower-card__highlights">
                        {t.highlights.map((h, i) => (
                          <li key={i} className="fm-tower-card__highlight-item">
                            <span style={{ color: '#2563EB', fontWeight: 700 }}>✓</span> {h}
                          </li>
                        ))}
                      </ul>

                      <div className="fm-tower-card__footer">
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Starting from</div>
                          <strong style={{ color: '#2563EB', fontSize: '1.1rem' }}>{t.startingPrice}</strong>
                        </div>
                        <button
                          className="btn btn-sm"
                          style={{
                            background: selectedTower.id === t.id ? '#2563EB' : 'rgba(37,99,235,0.1)',
                            color: selectedTower.id === t.id ? '#ffffff' : '#2563EB',
                            borderRadius: 'var(--radius-pill)',
                            fontWeight: 700,
                          }}
                        >
                          View Floor Plans →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Interactive Floor Plan Preview */}
            <section className="pm-section container" style={{ paddingTop: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <span className="fm-badge" style={{ marginBottom: '0.5rem' }}>
                    Spacious Blueprints
                  </span>
                  <h2 className="pm-section__title" style={{ margin: '0 0 0.25rem' }}>
                    Floor Plans at a Glance
                  </h2>
                  <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>
                    Select an apartment configuration below to preview ground and upper-level layouts.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {FLOOR_PLANS.map(p => (
                    <button
                      key={p.id}
                      className={`chip ${activePlanId === p.id ? 'active' : ''}`}
                      onClick={() => setActivePlanId(p.id)}
                    >
                      {p.bhk}
                    </button>
                  ))}
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ borderColor: 'rgba(37,99,235,0.4)', color: '#2563EB' }}
                    onClick={() => {
                      setActivePage('floorplans');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    View All Blueprints →
                  </button>
                </div>
              </div>

              {/* Split Floor Plan Card */}
              <div className="fm-plan-split">
                <div
                  className="fm-plan-stage"
                  onClick={() => setLightboxData({ src: activePlan.image, title: `${activePlan.name} (${activePlan.sft})` })}
                >
                  <img src={activePlan.image} alt={activePlan.name} className="fm-plan-img" />
                  <div className="fm-plan-zoom-badge">
                    🔍 Click to Enlarge Blueprint
                  </div>
                </div>

                <div className="fm-plan-info">
                  <span className="fm-badge" style={{ alignSelf: 'flex-start', marginBottom: '0.75rem' }}>
                    {activePlan.tag}
                  </span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>
                    {activePlan.name}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', margin: '0 0 1rem' }}>
                    {activePlan.description}
                  </p>

                  <table className="fm-plan-specs-table">
                    <tbody>
                      <tr>
                        <td>Super Built-Up Area</td>
                        <td>{activePlan.sft}</td>
                      </tr>
                      <tr>
                        <td>Carpet Area (RERA)</td>
                        <td>{activePlan.carpet}</td>
                      </tr>
                      <tr>
                        <td>Bedrooms / Bathrooms</td>
                        <td>{activePlan.bed} Beds · {activePlan.bath} Baths</td>
                      </tr>
                      <tr>
                        <td>Balconies</td>
                        <td>{activePlan.balcony} Panoramic Balconies</td>
                      </tr>
                      <tr>
                        <td>Indicative Price</td>
                        <td style={{ color: '#2563EB' }}>{activePlan.price}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '1rem' }}>
                    <a
                      href={getWhatsAppUrl(`Hi, I'm interested in the ${activePlan.name} (${activePlan.sft}, ${activePlan.price}). Please share the cost sheet.`)}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary"
                      style={{ background: '#2563EB', borderColor: '#2563EB', borderRadius: 'var(--radius-pill)', padding: '10px 22px' }}
                    >
                      💬 Enquire for Cost Sheet
                    </a>
                    <button
                      className="btn btn-outline"
                      onClick={() => setShowBrochureModal(true)}
                    >
                      📥 Download Plan PDF
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* VIP Site Visit Booking Banner */}
            <section className="pm-section container">
              <div
                style={{
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
                  borderRadius: '20px',
                  padding: '3rem',
                  color: '#ffffff',
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)',
                  gap: '2.5rem',
                  alignItems: 'center',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
                }}
              >
                <div>
                  <span className="fm-badge" style={{ background: 'rgba(255,255,255,0.15)', color: '#93c5fd', borderColor: 'rgba(255,255,255,0.25)', marginBottom: '0.75rem' }}>
                    ⭐ Exclusive Experience
                  </span>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.75rem', color: '#ffffff' }}>
                    Experience the Finished Sample Flat
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: '1.7', margin: '0 0 1.5rem' }}>
                    Walk through our fully furnished 3 BHK show home and experience the 11-foot ceiling clearances, soundproof German UPVC sliding balconies, and central podium landscape.
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button
                      className="fm-btn-free-visit fm-btn-free-visit--lg"
                      onClick={() => {
                        setActivePage('contact');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <span className="fm-btn-free-visit__icon">🚗</span>
                      <span>Schedule Free Site Visit Tour →</span>
                      <span className="fm-btn-free-visit__tag">FREE</span>
                    </button>
                    <a
                      href={getWhatsAppUrl('Hi, I would like to schedule a private visit to the FlatMark sample flat this weekend.')}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline btn-lg"
                      style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#ffffff' }}
                    >
                      💬 Quick WhatsApp Booking
                    </a>
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '2rem',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 1rem', color: '#ffffff' }}>
                    Site Visit Privileges
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)' }}>
                    <li>✓ Dedicated Senior Relationship Manager</li>
                    <li>✓ Detailed Printed Cost &amp; Payment Schedule</li>
                    <li>✓ Instant Loan Pre-Approval Assistance (SBI / HDFC)</li>
                    <li>✓ Complimentary Pickup &amp; Drop (Selected Hubs)</li>
                  </ul>
                  <div style={{ fontSize: '0.8rem', color: '#93c5fd' }}>
                    📍 Site Open 9:00 AM – 7:00 PM (All 7 Days)
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* 2. TOWERS PAGE */}
        {activePage === 'towers' && (
          <section className="pm-section container">
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem' }}>
              <span className="fm-badge" style={{ marginBottom: '0.75rem' }}>
                Residential Towers
              </span>
              <h2 className="pm-section__title" style={{ margin: '0 0 0.75rem' }}>
                Three Iconic High-Rise Towers
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Explore tower-specific floor counts, unit configurations, and architectural elevations. Select any tower to view real-time flat availability.
              </p>
            </div>

            <div className="fm-tower-grid">
              {TOWERS.map(t => (
                <div
                  key={t.id}
                  className={`fm-tower-card ${selectedTower.id === t.id ? 'fm-tower-card--active' : ''}`}
                  onClick={() => {
                    setSelectedTower(t);
                    setActivePage('floorplans');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <div className="fm-tower-card__media">
                    <img src={t.image} alt={t.name} className="fm-tower-card__img" loading="lazy" />
                    <div className="fm-tower-card__badge-top">{t.badge}</div>
                    <div className="fm-tower-card__status-pill">● {t.status}</div>
                  </div>
                  <div className="fm-tower-card__body">
                    <h3 className="fm-tower-card__title">{t.name}</h3>
                    <p className="fm-tower-card__desc">{t.description}</p>

                    <div className="fm-tower-card__configs">
                      {t.units.map(u => (
                        <span key={u} className="fm-tower-card__config-pill">{u}</span>
                      ))}
                    </div>

                    <ul className="fm-tower-card__highlights">
                      {t.highlights.map((h, i) => (
                        <li key={i} className="fm-tower-card__highlight-item">
                          <span style={{ color: '#2563EB', fontWeight: 700 }}>✓</span> {h}
                        </li>
                      ))}
                    </ul>

                    <div className="fm-tower-card__footer">
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Starting from</div>
                        <strong style={{ color: '#2563EB', fontSize: '1.1rem' }}>{t.startingPrice}</strong>
                      </div>
                      <button
                        className="btn btn-sm"
                        style={{
                          background: selectedTower.id === t.id ? '#2563EB' : 'rgba(37,99,235,0.1)',
                          color: selectedTower.id === t.id ? '#ffffff' : '#2563EB',
                          borderRadius: 'var(--radius-pill)',
                          fontWeight: 700,
                        }}
                      >
                        View Floor Plans →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. FLOOR PLANS PAGE */}
        {activePage === 'floorplans' && (
          <section className="pm-section container">
            <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 2.5rem' }}>
              <span className="fm-badge" style={{ marginBottom: '0.75rem' }}>
                Architectural Blueprints
              </span>
              <h2 className="pm-section__title" style={{ margin: '0 0 0.75rem' }}>
                Master-Crafted Floor Plans
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Ergonomically engineered for optimal daylight, privacy, and zero wasted corridors. Switch configurations below to inspect dimensioned room layouts.
              </p>
            </div>

            {/* Plan Switcher Chips */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
              {FLOOR_PLANS.map(p => (
                <button
                  key={p.id}
                  className={`chip ${activePlanId === p.id ? 'active' : ''}`}
                  style={{ padding: '8px 20px', fontSize: '0.95rem', fontWeight: 700 }}
                  onClick={() => setActivePlanId(p.id)}
                >
                  {p.name}
                </button>
              ))}
            </div>

            {/* Detailed Floor Plan View */}
            <div className="fm-plan-split">
              <div
                className="fm-plan-stage"
                onClick={() => setLightboxData({ src: activePlan.image, title: `${activePlan.name} (${activePlan.sft})` })}
              >
                <img src={activePlan.image} alt={activePlan.name} className="fm-plan-img" />
                <div className="fm-plan-zoom-badge">
                  🔍 Click to Enlarge Blueprint
                </div>
              </div>

              <div className="fm-plan-info">
                <span className="fm-badge" style={{ alignSelf: 'flex-start', marginBottom: '0.75rem' }}>
                  {activePlan.tag}
                </span>
                <h3 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>
                  {activePlan.name}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', margin: '0 0 1.25rem' }}>
                  {activePlan.description}
                </p>

                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.5rem', color: '#2563EB' }}>
                  Room Dimensions &amp; Layout
                </h4>
                <table className="fm-plan-specs-table">
                  <tbody>
                    {activePlan.rooms.map((rm, idx) => (
                      <tr key={idx}>
                        <td>{rm.name}</td>
                        <td>{rm.size}</td>
                      </tr>
                    ))}
                    <tr>
                      <td>Super Built-Up Area</td>
                      <td style={{ color: '#2563EB' }}>{activePlan.sft}</td>
                    </tr>
                    <tr>
                      <td>Carpet Area (RERA)</td>
                      <td>{activePlan.carpet}</td>
                    </tr>
                    <tr>
                      <td>Starting Base Price</td>
                      <td style={{ color: '#2563EB', fontWeight: 800 }}>{activePlan.price}</td>
                    </tr>
                  </tbody>
                </table>

                <div style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Key Architectural Features:
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {activePlan.features.map((f, i) => (
                      <span key={i} style={{ fontSize: '0.75rem', background: 'rgba(37,99,235,0.08)', color: '#2563EB', border: '1px solid rgba(37,99,235,0.2)', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <a
                    href={getWhatsAppUrl(`Hi, I'm interested in the ${activePlan.name} (${activePlan.sft}). Please share availability and payment plan.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                    style={{ background: '#2563EB', borderColor: '#2563EB', borderRadius: 'var(--radius-pill)', padding: '10px 22px', fontWeight: 700 }}
                  >
                    💬 Enquire for Floor Plan
                  </a>
                  <button
                    className="btn btn-outline"
                    onClick={() => setShowBrochureModal(true)}
                  >
                    📥 Download Blueprint PDF
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 5. PROJECT HIGHLIGHTS PAGE (Merged Amenities & Strategic Location Connectivity) */}
        {(activePage === 'highlights' || activePage === 'amenities' || activePage === 'location') && (
          <div className="pm-section container">
            {/* Main Header */}
            <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
              <span className="fm-badge" style={{ marginBottom: '0.75rem' }}>
                🌟 Signature Living &amp; Strategic Connectivity
              </span>
              <h2 className="pm-section__title" style={{ margin: '0 0 0.75rem' }}>
                Project Highlights
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6' }}>
                Experience resort-grade clubhouse amenities, lush elevated podium deck, and immediate signal-free connectivity to Hyderabad's Financial District growth corridor.
              </p>
            </div>

            {/* PART 1: Clubhouse & Podium Amenities */}
            <div style={{ marginBottom: '4.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '2px solid rgba(37, 99, 235, 0.12)' }}>
                <div>
                  <span className="fm-badge" style={{ marginBottom: '0.4rem' }}>Resort-Grade Living</span>
                  <h3 style={{ fontSize: '1.65rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    Clubhouse &amp; Podium Amenities
                  </h3>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>
                  25+ Curated Lifestyle Facilities
                </div>
              </div>

              <div className="fm-amenity-grid">
                {AMENITIES.map((am, i) => (
                  <div key={i} className="fm-amenity-card">
                    <div className="fm-amenity-icon">{am.icon}</div>
                    <div className="fm-amenity-category">{am.category}</div>
                    <h3 className="fm-amenity-title">{am.title}</h3>
                    <p className="fm-amenity-desc">{am.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* PART 2: Strategic Location & Growth Corridor */}
            <div style={{ marginBottom: '3.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '2px solid rgba(37, 99, 235, 0.12)' }}>
                <div>
                  <span className="fm-badge" style={{ marginBottom: '0.4rem' }}>Strategic Connectivity</span>
                  <h3 style={{ fontSize: '1.65rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    Location &amp; Growth Corridor
                  </h3>
                </div>
                <div style={{ color: '#2563EB', fontSize: '0.875rem', fontWeight: 700 }}>
                  📍 Financial District, Hyderabad
                </div>
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.75rem', maxWidth: '700px', lineHeight: '1.6' }}>
                Immediate signal-free expressway access to Hyderabad's premier IT towers, multi-specialty healthcare networks, top-tier international educational institutions, and airport transit corridors.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
                {[
                  { place: 'Financial District & Wipro Circle', dist: '3.5 Km', time: '8 Mins', tag: 'IT & Global Tech' },
                  { place: 'Continental & Care Hospitals', dist: '2.8 Km', time: '6 Mins', tag: 'Healthcare Hub' },
                  { place: 'Oakridge & Delhi Public School', dist: '4.2 Km', time: '10 Mins', tag: 'Top International Schools' },
                  { place: 'Inorbit Mall & Nexus Mall', dist: '8.0 Km', time: '15 Mins', tag: 'Retail & Dining' },
                  { place: 'Rajiv Gandhi Int’l Airport', dist: '28 Km', time: '25 Mins', tag: 'Signal-Free via ORR' },
                ].map((loc, idx) => (
                  <div key={idx} className="fm-amenity-card" style={{ padding: '1.5rem' }}>
                    <span style={{ fontSize: '0.7rem', color: '#2563EB', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {loc.tag}
                    </span>
                    <h4 style={{ margin: '0.25rem 0', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                      {loc.place}
                    </h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📍 {loc.dist}</span>
                      <strong style={{ fontSize: '1.2rem', color: '#2563EB' }}>⚡ {loc.time}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Combined Action Banner */}
            <div style={{ textAlign: 'center', background: 'rgba(37, 99, 235, 0.05)', border: '1.5px dashed rgba(37, 99, 235, 0.25)', borderRadius: '20px', padding: '2.5rem 1.5rem' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.5rem', color: 'var(--text-primary)' }}>
                Experience FlatMark Skyline Residences in Person
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', maxWidth: '540px', margin: '0 auto 1.5rem', lineHeight: '1.6' }}>
                Book a personalized tour of our 25,000 sq.ft clubhouse, podium leisure amenities, and model show-homes with complimentary door-to-door vehicle pickup.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary"
                  style={{ background: '#2563EB', borderColor: '#2563EB', borderRadius: 'var(--radius-pill)', padding: '12px 28px', fontWeight: 700 }}
                  onClick={() => {
                    setActivePage('contact');
                    scrollToTop();
                  }}
                >
                  Schedule Site Visit &amp; Tour →
                </button>
                <button
                  className="btn btn-outline"
                  style={{ borderRadius: 'var(--radius-pill)', padding: '12px 24px', fontWeight: 700 }}
                  onClick={() => setShowBrochureModal(true)}
                >
                  📥 Download Full Highlights Brochure
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 6. GALLERY PAGE */}
        {activePage === 'gallery' && (
          <section className="pm-section container">
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem' }}>
              <span className="fm-badge" style={{ marginBottom: '0.75rem' }}>
                Visual Experience
              </span>
              <h2 className="pm-section__title" style={{ margin: '0 0 0.75rem' }}>
                Project Gallery &amp; Architecture
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Real architectural photography of the podium elevations, double-height entrance lobbies, panoramic show flats, and recreational zones.
              </p>
            </div>

            {/* Category Filter Chips */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '2rem', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'All Photos' },
                { id: 'architecture', label: 'Architecture & Towers' },
                { id: 'lobby', label: 'Grand Lobby' },
                { id: 'interiors', label: 'Show Flat Interiors' },
              ].map(cat => (
                <button
                  key={cat.id}
                  className={`chip ${galleryFilter === cat.id ? 'active' : ''}`}
                  onClick={() => setGalleryFilter(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="fm-gallery-grid">
              {filteredGallery.map(item => (
                <div
                  key={item.id}
                  className="fm-gallery-card"
                  onClick={() => setLightboxData(item)}
                >
                  <img src={item.src} alt={item.title} className="fm-gallery-img" loading="lazy" />
                  <div className="fm-gallery-overlay">
                    <span className="fm-gallery-badge">{item.categoryLabel}</span>
                    <h4 className="fm-gallery-title">{item.title}</h4>
                    <span style={{ fontSize: '0.75rem', opacity: 0.85, marginTop: '4px' }}>🔍 Click to view full image</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ABOUT PAGE */}
        {activePage === 'about' && (
          <section className="pm-section container">
            <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 2.5rem' }}>
              <span className="fm-badge" style={{ marginBottom: '0.75rem' }}>
                Engineering Excellence
              </span>
              <h2 className="pm-section__title" style={{ margin: '0 0 0.75rem' }}>
                About FlatMark Skyline Residences
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Conceived as a benchmark for contemporary vertical living, FlatMark combines architectural elegance, sustainable green construction, and expansive podium leisure across 6.5 prime acres.
              </p>
            </div>

            {/* Split Story Card */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)', gap: '2.5rem', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden', marginBottom: '3rem', boxShadow: '0 8px 30px rgba(0,0,0,0.05)' }}>
              <div style={{ height: '100%', minHeight: '380px' }}>
                <img src="/images/flatmark-lobby.jpg" alt="FlatMark Grand Lobby" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ padding: '2.5rem' }}>
                <span className="fm-badge" style={{ marginBottom: '0.5rem' }}>
                  Grand Architecture
                </span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 1rem' }}>
                  Designed for Discerning Families
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7', margin: '0 0 1.25rem' }}>
                  FlatMark Skyline Residences offers a rare combination of high-density convenience and low-density tranquility. With over 78% open space dedicated to an elevated vehicular-free landscaped podium, children and senior citizens can move with complete safety and serenity.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
                  <div>
                    <strong style={{ fontSize: '1.25rem', color: '#2563EB', display: 'block' }}>6.5 Acres</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Gated Podium Campus</span>
                  </div>
                  <div>
                    <strong style={{ fontSize: '1.25rem', color: '#2563EB', display: 'block' }}>IGBC Gold</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Green Building Certified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Pillars Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              <div className="fm-amenity-card">
                <div style={{ fontSize: '2rem' }}>🏗️</div>
                <h4 style={{ fontSize: '1.1rem', margin: '0.5rem 0', color: 'var(--text-primary)' }}>100% Shear Wall RCC</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>Monolithic aluminum formwork construction providing earthquake resistance, superior acoustic insulation, and seamless crack-free finishes.</p>
              </div>
              <div className="fm-amenity-card">
                <div style={{ fontSize: '2rem' }}>🌿</div>
                <h4 style={{ fontSize: '1.1rem', margin: '0.5rem 0', color: 'var(--text-primary)' }}>Vehicular-Free Podium</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>All vehicle movement and parking are directed to the 3-level basement, leaving the surface podium 100% pedestrian-safe with lush landscaped decks.</p>
              </div>
              <div className="fm-amenity-card">
                <div style={{ fontSize: '2rem' }}>⚡</div>
                <h4 style={{ fontSize: '1.1rem', margin: '0.5rem 0', color: 'var(--text-primary)' }}>100% Power &amp; Water</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>Full dual-feed DG power backup for entire residences (including ACs), centralized water treatment plant, and solar lighting for common areas.</p>
              </div>
              <div className="fm-amenity-card">
                <div style={{ fontSize: '2rem' }}>📜</div>
                <h4 style={{ fontSize: '1.1rem', margin: '0.5rem 0', color: 'var(--text-primary)' }}>Clear RERA Approvals</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>Fully licensed under TG-RERA Registration No. P02400008432 with complete bank project approvals from SBI, HDFC, ICICI, and Axis Bank.</p>
              </div>
            </div>
          </section>
        )}


        {/* 7. CONTACT / SITE VISIT PAGE */}
        {activePage === 'contact' && (
          <section className="pm-section container" style={{ maxWidth: 720 }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span className="fm-badge" style={{ marginBottom: '0.75rem' }}>
                Book Your Preview
              </span>
              <h2 className="pm-section__title" style={{ margin: '0 0 0.5rem' }}>
                Schedule a VIP Site Visit
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Tour our completed show flat, walk through the 25,000 sq.ft clubhouse, and receive customized payment plans from our senior relationship team.
              </p>
            </div>

            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                padding: '2.5rem',
                boxShadow: '0 12px 36px rgba(0, 0, 0, 0.06)',
              }}
            >
              {visitDone ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>✅</div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#2563EB' }}>
                    Site Visit Confirmed!
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', maxWidth: 460, margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
                    Thank you, <strong>{visitForm.name}</strong>. Your private tour for <strong>{visitForm.tower} ({visitForm.bhk})</strong> has been scheduled. Our relationship manager will call you within 2 hours to confirm pickup or directions.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <a
                      href={getWhatsAppUrl(`Hi, I just submitted a site visit request for ${visitForm.name} (${visitForm.phone}).`)}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-whatsapp"
                    >
                      💬 WhatsApp Confirmation
                    </a>
                    <button
                      className="btn btn-outline"
                      onClick={() => {
                        setVisitDone(false);
                        setVisitForm({
                          name: '',
                          phone: '',
                          tower: 'Tower A — The Azure',
                          bhk: '2 BHK',
                          date: '',
                          timeSlot: 'Morning (10:00 AM - 1:00 PM)',
                          notes: '',
                        });
                      }}
                    >
                      Book Another Visit
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleVisitSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8125rem', fontWeight: 700, marginBottom: '6px', display: 'block' }}>
                        Your Full Name *
                      </label>
                      <input
                        className="input"
                        placeholder="e.g. Rajesh Kumar"
                        required
                        value={visitForm.name}
                        onChange={e => setVisitForm({ ...visitForm, name: e.target.value })}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8125rem', fontWeight: 700, marginBottom: '6px', display: 'block' }}>
                        Mobile / WhatsApp *
                      </label>
                      <input
                        className="input"
                        placeholder="10-digit mobile"
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        title="Please enter a valid 10-digit mobile number"
                        value={visitForm.phone}
                        onChange={e => setVisitForm({ ...visitForm, phone: e.target.value })}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8125rem', fontWeight: 700, marginBottom: '6px', display: 'block' }}>
                        Preferred Tower
                      </label>
                      <select
                        className="input"
                        value={visitForm.tower}
                        onChange={e => setVisitForm({ ...visitForm, tower: e.target.value })}
                        style={{ width: '100%' }}
                      >
                        {TOWERS.map(t => (
                          <option key={t.id} value={t.name}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8125rem', fontWeight: 700, marginBottom: '6px', display: 'block' }}>
                        BHK Configuration
                      </label>
                      <select
                        className="input"
                        value={visitForm.bhk}
                        onChange={e => setVisitForm({ ...visitForm, bhk: e.target.value })}
                        style={{ width: '100%' }}
                      >
                        <option value="2 BHK">2 BHK (1,150 Sq.Ft)</option>
                        <option value="3 BHK">3 BHK (1,680 Sq.Ft)</option>
                        <option value="4 BHK">4 BHK Penthouse (2,450 Sq.Ft)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8125rem', fontWeight: 700, marginBottom: '6px', display: 'block' }}>
                        Preferred Date
                      </label>
                      <input
                        className="input"
                        type="date"
                        value={visitForm.date}
                        onChange={e => setVisitForm({ ...visitForm, date: e.target.value })}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8125rem', fontWeight: 700, marginBottom: '6px', display: 'block' }}>
                        Preferred Time Slot
                      </label>
                      <select
                        className="input"
                        value={visitForm.timeSlot}
                        onChange={e => setVisitForm({ ...visitForm, timeSlot: e.target.value })}
                        style={{ width: '100%' }}
                      >
                        <option>Morning (10:00 AM - 1:00 PM)</option>
                        <option>Afternoon (1:00 PM - 4:00 PM)</option>
                        <option>Evening (4:00 PM - 7:00 PM)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 700, marginBottom: '6px', display: 'block' }}>
                      Special Requirements or Queries
                    </label>
                    <textarea
                      className="input"
                      rows={3}
                      placeholder="e.g. Interested in high floor facing pool, need home loan details..."
                      value={visitForm.notes}
                      onChange={e => setVisitForm({ ...visitForm, notes: e.target.value })}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-lg"
                    disabled={visitLoading}
                    style={{
                      background: '#2563EB',
                      color: '#ffffff',
                      borderRadius: 'var(--radius-pill)',
                      padding: '14px',
                      fontWeight: 700,
                      justifyContent: 'center',
                      marginTop: '0.5rem',
                    }}
                  >
                    {visitLoading ? 'Confirming Site Visit...' : 'Confirm Site Visit Schedule →'}
                  </button>
                </form>
              )}
            </div>
          </section>
        )}
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="pm-footer" role="contentinfo">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.35rem', color: '#2563EB', marginBottom: '0.75rem' }}>
              FlatMark
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.6', margin: '0 0 1rem' }}>
              Premium high-rise gated community featuring 224 residences across 3 towers. Developed as a showcase template for DeccanIDentity.
            </p>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {PROJECT_INFO.rera}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <li><button onClick={() => { setActivePage('home'); scrollToTop(); }} style={{ color: 'inherit' }}>Home Overview</button></li>
              <li><button onClick={() => { setActivePage('towers'); scrollToTop(); }} style={{ color: 'inherit' }}>Three Towers</button></li>
              <li><button onClick={() => { setActivePage('floorplans'); scrollToTop(); }} style={{ color: 'inherit' }}>Floor Plans &amp; Blueprints</button></li>
              <li><button onClick={() => { setActivePage('highlights'); scrollToTop(); }} style={{ color: 'inherit' }}>Project Highlights</button></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Apartment Towers
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <li>Tower A — The Azure (10 Floors · 2 &amp; 3 BHK)</li>
              <li>Tower B — The Apex (12 Floors · 2, 3 &amp; 4 BHK)</li>
              <li>Tower C — The Aria (8 Floors · 2 BHK Boutique)</li>
              <li>Podium Deck — 45,000 Sq.Ft Greenery</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Sales &amp; Site Gallery
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 0.5rem' }}>
              📍 {PROJECT_INFO.location}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 0.5rem' }}>
              📞 Phone: <strong>{siteConfig.phone}</strong>
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 1rem' }}>
              💬 WhatsApp: <strong>{siteConfig.whatsapp}</strong>
            </p>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Working Hours: 9:00 AM – 7:30 PM (All 7 Days)
            </div>
          </div>
        </div>

        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          <div>© 2026 FlatMark Skyline Residences. All rights reserved.</div>
          <div>Showcase Template by <Link to="/" style={{ color: '#2563EB', fontWeight: 600 }}>DeccanIDentity</Link></div>
        </div>
      </footer>

    </div>
  </div>
</div>

      {/* ── Brochure Modal ──────────────────────────────────────────────────── */}
      {showBrochureModal && (
        <div className="plot-modal-overlay" onClick={() => setShowBrochureModal(false)} role="dialog" aria-modal="true">
          <div className="plot-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 460 }}>
            <button className="plot-modal__close" onClick={() => setShowBrochureModal(false)}>×</button>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '2.5rem' }}>📥</span>
              <h3 style={{ margin: '0.5rem 0 0.25rem' }}>Download Project Brochure</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Complete tower layouts, floor plans, specifications, and club amenities catalog.
              </p>
            </div>

            {brochureDone ? (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✅</div>
                <h4 style={{ margin: '0 0 0.5rem', color: '#2563EB' }}>Download Initiated!</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                  The official specification brochure has been downloaded to your device.
                </p>
                <button
                  className="btn btn-primary"
                  style={{ background: '#2563EB', borderColor: '#2563EB', width: '100%', borderRadius: 'var(--radius-pill)' }}
                  onClick={() => {
                    setShowBrochureModal(false);
                    setBrochureDone(false);
                  }}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleBrochureDownload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 700, marginBottom: '4px', display: 'block' }}>
                    Full Name *
                  </label>
                  <input
                    className="input"
                    placeholder="Enter your name"
                    required
                    value={brochureForm.name}
                    onChange={e => setBrochureForm({ ...brochureForm, name: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 700, marginBottom: '4px', display: 'block' }}>
                    Mobile Number *
                  </label>
                  <input
                    className="input"
                    placeholder="10-digit mobile"
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={brochureForm.phone}
                    onChange={e => setBrochureForm({ ...brochureForm, phone: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ background: '#2563EB', borderColor: '#2563EB', borderRadius: 'var(--radius-pill)', padding: '12px', fontWeight: 700, justifyContent: 'center' }}
                >
                  Download Brochure Now →
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── Lightbox Modal for Gallery and Floor Plans ─────────────────────── */}
      {lightboxData && (
        <div className="fm-lightbox" onClick={() => setLightboxData(null)} role="dialog" aria-modal="true">
          <div className="fm-lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="fm-lightbox-close" onClick={() => setLightboxData(null)}>×</button>
            <img src={lightboxData.src} alt={lightboxData.title} className="fm-lightbox-img" />
            <div className="fm-lightbox-info">
              <h4 style={{ margin: '0 0 4px', fontSize: '1.15rem' }}>{lightboxData.title}</h4>
              {lightboxData.desc && (
                <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.8 }}>{lightboxData.desc}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
