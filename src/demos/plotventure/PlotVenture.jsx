import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DemoBar from '../../components/DemoBar.jsx';
import siteConfig from '../../data/site.config.js';
import {
  COMPANY_INFO,
  PROJECTS,
  AMENITIES,
  GALLERY_ITEMS,
  LOCATION_HIGHLIGHTS,
  FAQS,
} from './plotVentureData.js';
import './PlotVenture.css';

export default function PlotVentureDemo() {
  const [activePage, setActivePage] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('page');
      if (p) return p;
    }
    return 'home';
  });

  const [selectedProjectId, setSelectedProjectId] = useState(PROJECTS[0].id);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active project data
  const currentProject = useMemo(() => {
    return PROJECTS.find(p => p.id === selectedProjectId) || PROJECTS[0];
  }, [selectedProjectId]);

  const navToPage = (pageId, projId = null) => {
    setActivePage(pageId);
    if (projId) setSelectedProjectId(projId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const waContactNumber = siteConfig.whatsapp.replace(/\D/g, '');
  const waDirectUrl = (msg) =>
    `https://wa.me/${waContactNumber}?text=${encodeURIComponent(msg || "Hi PlotVenture! I'm interested in booking a site visit for residential plots.")}`;

  return (
    <div className="pv-demo">
      {/* ── Demo Bar for Theme Toggle & DeccanIDentity Navigation ── */}
      <DemoBar
        templateSlug="plotventure"
        templateName="PlotVenture"
        label="📐 PlotVenture — Modern Plotted Development Website"
      />

      {/* ── Main PlotVenture Header ── */}
      <header className="pv-nav" role="banner">
        <div className="pv-nav__container">
          <button
            className="pv-brand"
            onClick={() => navToPage('home')}
            aria-label="PlotVenture Home"
          >
            <div className="pv-brand__logo-icon">PV</div>
            <div className="pv-brand__text">
              <span className="pv-brand__name">
                Plot<span>Venture</span>
              </span>
              <span className="pv-brand__sub">Plotted Developments</span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav aria-label="Main Navigation">
            <ul className="pv-nav__links">
              {[
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'About Us' },
                { id: 'projects', label: 'Projects' },
                { id: 'details', label: 'Project Details' },
                { id: 'amenities', label: 'Amenities' },
                { id: 'gallery', label: 'Gallery' },
                { id: 'location', label: 'Location' },
                { id: 'contact', label: 'Contact Us' },
              ].map(item => (
                <li key={item.id}>
                  <button
                    className={`pv-nav__link-btn ${activePage === item.id ? 'active' : ''}`}
                    onClick={() => navToPage(item.id)}
                    aria-current={activePage === item.id ? 'page' : undefined}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Header Action Buttons */}
          <div className="pv-nav__actions">
            <a
              href={waDirectUrl("Hello! I want to enquire about PlotVenture's plots.")}
              target="_blank"
              rel="noreferrer"
              className="pv-btn-gold pv-nav__cta-desktop"
              aria-label="WhatsApp Enquiry"
            >
              <span>💬</span> WhatsApp
            </a>
            <button
              className="pv-nav__toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="pv-mobile-drawer" onClick={() => setMobileMenuOpen(false)}>
          <div className="pv-mobile-drawer__panel" onClick={e => e.stopPropagation()}>
            <button
              className="pv-mobile-drawer__close"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
            <div className="pv-brand" style={{ marginBottom: '1rem' }}>
              <div className="pv-brand__logo-icon">PV</div>
              <div className="pv-brand__name">
                Plot<span>Venture</span>
              </div>
            </div>
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'About Us' },
              { id: 'projects', label: 'Projects' },
              { id: 'details', label: 'Project Details' },
              { id: 'amenities', label: 'Amenities' },
              { id: 'gallery', label: 'Gallery' },
              { id: 'location', label: 'Location' },
              { id: 'contact', label: 'Contact Us' },
            ].map(item => (
              <button
                key={item.id}
                className={`pv-mobile-drawer__btn ${activePage === item.id ? 'active' : ''}`}
                onClick={() => navToPage(item.id)}
              >
                {item.label}
              </button>
            ))}
            <a
              href={waDirectUrl()}
              target="_blank"
              rel="noreferrer"
              className="pv-btn-gold"
              style={{ marginTop: 'auto', textAlign: 'center', justifyContent: 'center' }}
            >
              💬 WhatsApp Enquiry
            </a>
          </div>
        </div>
      )}

      {/* ── Active Page View ── */}
      <main className="pv-content-area" id="pv-main-content">
        {activePage === 'home' && (
          <HomePage
            navToPage={navToPage}
            waDirectUrl={waDirectUrl}
            onSelectProject={id => navToPage('details', id)}
            onOpenLightbox={setLightboxImg}
          />
        )}

        {activePage === 'projects' && (
          <ProjectsPage
            onSelectProject={id => navToPage('details', id)}
            navToPage={navToPage}
          />
        )}

        {activePage === 'details' && (
          <ProjectDetailsPage
            project={currentProject}
            allProjects={PROJECTS}
            onSelectProject={setSelectedProjectId}
            waDirectUrl={waDirectUrl}
            navToPage={navToPage}
          />
        )}

        {activePage === 'about' && (
          <AboutPage navToPage={navToPage} waDirectUrl={waDirectUrl} />
        )}

        {activePage === 'amenities' && (
          <AmenitiesPage navToPage={navToPage} waDirectUrl={waDirectUrl} />
        )}

        {activePage === 'gallery' && (
          <GalleryPage onOpenLightbox={setLightboxImg} />
        )}

        {activePage === 'location' && (
          <LocationPage navToPage={navToPage} waDirectUrl={waDirectUrl} />
        )}

        {activePage === 'contact' && (
          <ContactPage
            waDirectUrl={waDirectUrl}
            currentProject={currentProject}
          />
        )}
      </main>

      {/* ── Lightbox Modal for Gallery & Photos ── */}
      {lightboxImg && (
        <div
          className="pv-lightbox"
          onClick={() => setLightboxImg(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="pv-lightbox__content" onClick={e => e.stopPropagation()}>
            <button
              className="pv-lightbox__close"
              onClick={() => setLightboxImg(null)}
              aria-label="Close lightbox"
            >
              ×
            </button>
            <img
              src={lightboxImg.src}
              alt={lightboxImg.title}
              className="pv-lightbox__img"
            />
            <div className="pv-lightbox__caption">
              <h4>{lightboxImg.title}</h4>
              <p>{lightboxImg.caption || lightboxImg.category}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="pv-footer" role="contentinfo">
        <div className="pv-footer__container">
          <div>
            <div className="pv-brand" style={{ marginBottom: '1rem' }}>
              <div className="pv-brand__logo-icon">PV</div>
              <div className="pv-brand__name">
                Plot<span>Venture</span>
              </div>
            </div>
            <p style={{ color: 'var(--pv-text-muted)', fontSize: '0.875rem', lineHeight: '1.6', maxWidth: '320px' }}>
              Modern plotted development and gated residential communities. Clear title, spot registration, and high appreciation investment corridors.
            </p>
            <div style={{ marginTop: '1.25rem' }}>
              <a
                href={waDirectUrl('Hi PlotVenture, please share current plotted township brochures.')}
                target="_blank"
                rel="noreferrer"
                className="pv-btn-gold"
                style={{ fontSize: '0.8125rem', padding: '0.45rem 0.9rem' }}
              >
                💬 Chat with Sales Advisor
              </a>
            </div>
          </div>

          <div>
            <h4 className="pv-footer__col-title">Quick Navigation</h4>
            <ul className="pv-footer__links">
              {[
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'About Us' },
                { id: 'projects', label: 'Plotted Projects' },
                { id: 'details', label: 'Project Master Plans' },
                { id: 'amenities', label: 'Township Amenities' },
                { id: 'gallery', label: 'Photo Gallery' },
                { id: 'location', label: 'Location Advantages' },
              ].map(link => (
                <li key={link.id}>
                  <button
                    className="pv-footer__link"
                    onClick={() => navToPage(link.id)}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="pv-footer__col-title">Our Projects</h4>
            <ul className="pv-footer__links">
              {PROJECTS.map(p => (
                <li key={p.id}>
                  <button
                    className="pv-footer__link"
                    onClick={() => navToPage('details', p.id)}
                  >
                    {p.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  className="pv-footer__link"
                  onClick={() => navToPage('contact')}
                >
                  Schedule Site Visit
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="pv-footer__col-title">Office & Contacts</h4>
            <p style={{ color: 'var(--pv-text-muted)', fontSize: '0.85rem', lineHeight: '1.6', margin: '0 0 0.75rem' }}>
              📍 {siteConfig.registeredOffice.addressLine}, {siteConfig.registeredOffice.city}, {siteConfig.registeredOffice.state}
            </p>
            <p style={{ color: 'var(--pv-text-muted)', fontSize: '0.85rem', margin: '0 0 0.5rem' }}>
              📞 Phone: <strong>{siteConfig.phone}</strong>
            </p>
            <p style={{ color: 'var(--pv-text-muted)', fontSize: '0.85rem', margin: '0 0 1rem' }}>
              💬 WhatsApp: <strong>{siteConfig.whatsapp}</strong>
            </p>
            <div style={{ fontSize: '0.75rem', color: 'var(--pv-text-muted)' }}>
              Working Hours: 9:00 AM – 7:30 PM (All 7 Days)
            </div>
          </div>
        </div>

        <div className="pv-footer__bottom">
          <div>
            © 2026 PlotVenture — Modern Plotted Development. Developed as a showcase template for <Link to="/" style={{ color: 'var(--pv-gold)', textDecoration: 'underline' }}>DeccanIDentity</Link>.
          </div>
          <div style={{ fontSize: '0.75rem' }}>
            {COMPANY_INFO.reraNotice}
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── 1. Home Page Component ──────────────────────────────────────────────────
function HomePage({ navToPage, waDirectUrl, onSelectProject, onOpenLightbox }) {
  const [formDone, setFormDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lead, setLead] = useState({ name: '', phone: '', project: 'Green County Elite' });

  const handleHeroSubmit = (e) => {
    e.preventDefault();
    if (!lead.name || lead.phone.length < 10) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFormDone(true);
    }, 600);
  };

  return (
    <>
      {/* ── Premium Hero Section ── */}
      <section className="pv-hero" aria-labelledby="hero-heading">
        <div className="pv-hero__bg">
          <img
            src="/images/plotventure-hero.jpg"
            alt="PlotVenture Master Plotted Community"
            className="pv-hero__bg-img"
          />
          <div className="pv-hero__overlay" />
        </div>

        <div className="pv-hero__container">
          <div className="pv-hero__text">
            <div className="pv-hero__badge">
              <span>★</span> RERA &amp; DTCP Approved Plotted Developments
            </div>
            <h1 id="hero-heading" className="pv-hero__title">
              Find Your Perfect Plot.{' '}
              <span className="pv-hero__title-accent">Build Your Future.</span>
            </h1>
            <p className="pv-hero__copy">
              Explore meticulously engineered residential and commercial plotted developments in booming growth corridors. Experience 100% clear titles, blacktop avenue roads, designer clubhouses, and unmatched long-term appreciation.
            </p>
            <div className="pv-hero__actions">
              <button
                className="pv-btn-gold"
                onClick={() => navToPage('projects')}
                id="explore-projects-cta"
              >
                <span>🔍</span> Explore Projects
              </button>
              <button
                className="pv-btn-outline"
                onClick={() => navToPage('contact')}
              >
                📅 Schedule Free Site Visit
              </button>
            </div>

            <div className="pv-hero__stats">
              <div className="pv-stat">
                <div className="pv-stat__num">100%</div>
                <div className="pv-stat__label">Clear Title &amp; Spot Registration</div>
              </div>
              <div className="pv-stat">
                <div className="pv-stat__num">450+</div>
                <div className="pv-stat__label">Acres of Layouts Delivered</div>
              </div>
              <div className="pv-stat">
                <div className="pv-stat__num">4,200+</div>
                <div className="pv-stat__label">Happy Plot Investors</div>
              </div>
            </div>
          </div>

          {/* Quick Lead Capture Card */}
          <div className="pv-hero__card">
            <h3 className="pv-hero__card-title">Book a Free Site Visit</h3>
            <p className="pv-hero__card-sub">
              Free pick-up and drop facility available across Hyderabad.
            </p>

            {formDone ? (
              <div className="pv-alert pv-alert--success">
                <div>
                  <strong>Site Visit Requested!</strong>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem' }}>
                    Our relationship manager will call you shortly to confirm timings.
                  </p>
                  <a
                    href={waDirectUrl(`Hi, I just requested a site visit for ${lead.project}. My name is ${lead.name}.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="pv-btn-gold"
                    style={{ marginTop: '0.85rem', fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                  >
                    💬 Confirm on WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <form className="pv-form" onSubmit={handleHeroSubmit}>
                <div className="pv-form-group">
                  <label htmlFor="hero-name">Full Name *</label>
                  <input
                    id="hero-name"
                    className="pv-input"
                    placeholder="Enter your name"
                    value={lead.name}
                    onChange={e => setLead({ ...lead, name: e.target.value })}
                    required
                  />
                </div>
                <div className="pv-form-group">
                  <label htmlFor="hero-phone">Phone / WhatsApp Number *</label>
                  <input
                    id="hero-phone"
                    className="pv-input"
                    type="tel"
                    placeholder="10-digit mobile number"
                    pattern="[0-9]{10}"
                    value={lead.phone}
                    onChange={e => setLead({ ...lead, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="pv-form-group">
                  <label htmlFor="hero-project">Preferred Project</label>
                  <select
                    id="hero-project"
                    className="pv-select"
                    value={lead.project}
                    onChange={e => setLead({ ...lead, project: e.target.value })}
                  >
                    {PROJECTS.map(p => (
                      <option key={p.id} value={p.name}>
                        {p.name} ({p.minPrice})
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="pv-btn-gold"
                  style={{ justifyContent: 'center', marginTop: '0.5rem' }}
                  disabled={loading}
                >
                  {loading ? 'Submitting Request...' : 'Confirm Free Site Visit →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Featured Projects Section ── */}
      <section className="pv-section" aria-labelledby="featured-heading">
        <div className="pv-section-header">
          <span className="pv-tag">Featured Layouts</span>
          <h2 id="featured-heading" className="pv-title">
            Prime Plotted Developments
          </h2>
          <p className="pv-sub">
            Hand-picked, high-growth townships featuring broad avenue roads, modern underground infrastructure, and clear legal sanctions.
          </p>
        </div>

        <div className="pv-projects-grid">
          {PROJECTS.map(p => (
            <article key={p.id} className="pv-pcard">
              <div className="pv-pcard__media">
                <img src={p.image} alt={p.name} className="pv-pcard__img" />
                <span className="pv-pcard__status">{p.status}</span>
                <span className="pv-pcard__cat">{p.category}</span>
              </div>
              <div className="pv-pcard__body">
                <div className="pv-pcard__loc">
                  <span>📍</span> {p.location}
                </div>
                <h3 className="pv-pcard__name">{p.name}</h3>
                <p className="pv-pcard__tagline">{p.tagline}</p>

                <div className="pv-pcard__specs">
                  <div className="pv-spec-item">
                    <span>Layout Area</span>
                    <span>{p.totalAcres}</span>
                  </div>
                  <div className="pv-spec-item">
                    <span>Plot Sizes</span>
                    <span>{p.plotSizes}</span>
                  </div>
                  <div className="pv-spec-item">
                    <span>Approval</span>
                    <span style={{ fontSize: '0.78rem' }}>{p.approval}</span>
                  </div>
                  <div className="pv-spec-item">
                    <span>Available</span>
                    <span>{p.availablePlots} Plots Left</span>
                  </div>
                </div>

                <div className="pv-pcard__footer">
                  <div className="pv-pcard__price">
                    <span>Starting From</span>
                    <strong>{p.minPrice}</strong>
                  </div>
                  <button
                    className="pv-btn-gold"
                    onClick={() => onSelectProject(p.id)}
                    aria-label={`View details for ${p.name}`}
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Amenities & Infrastructure Highlights ── */}
      <section className="pv-section" style={{ paddingTop: '2rem' }}>
        <div className="pv-section-header">
          <span className="pv-tag">World-Class Infrastructure</span>
          <h2 className="pv-title">Township Features &amp; Amenities</h2>
          <p className="pv-sub">
            Engineered for longevity and supreme quality of life with contemporary recreational and utility facilities.
          </p>
        </div>

        <div className="pv-amenities-grid">
          {AMENITIES.slice(0, 6).map(a => (
            <div key={a.id} className="pv-acard">
              <div className="pv-acard__icon">{a.icon}</div>
              <div className="pv-acard__cat">{a.category}</div>
              <h3 className="pv-acard__title">{a.title}</h3>
              <p className="pv-acard__desc">{a.description}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <button
            className="pv-btn-outline"
            onClick={() => navToPage('amenities')}
          >
            Explore All 8+ Township Amenities →
          </button>
        </div>
      </section>

      {/* ── Location Advantages ── */}
      <section className="pv-section" style={{ paddingTop: '2rem' }}>
        <div className="pv-section-header">
          <span className="pv-tag">Strategic Connectivity</span>
          <h2 className="pv-title">Location Advantages</h2>
          <p className="pv-sub">
            Positioned along rapid-transit expressways, IT corridors, international airports, and established commercial centers.
          </p>
        </div>

        <div className="pv-loc-grid">
          <div className="pv-loc-cards">
            {LOCATION_HIGHLIGHTS.slice(0, 6).map((item, idx) => (
              <div key={idx} className="pv-loc-card">
                <div className="pv-loc-card__icon">{item.icon}</div>
                <div>
                  <div className="pv-loc-card__dest">{item.destination}</div>
                  <div className="pv-loc-card__dist">{item.distance}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="pv-map-box">
            <div className="pv-map-box__canvas" />
            <div className="pv-map-pin">📍</div>
            <h3 style={{ fontSize: '1.25rem', margin: '0 0 0.5rem', color: 'var(--pv-text-main)' }}>
              PlotVenture Growth Hub
            </h3>
            <p style={{ color: 'var(--pv-text-muted)', fontSize: '0.85rem', maxWidth: '320px', margin: '0 0 1.25rem' }}>
              Strategic access to Outer Ring Road (ORR), Rajiv Gandhi International Airport &amp; Aerospace SEZ.
            </p>
            <button
              className="pv-btn-gold"
              onClick={() => navToPage('location')}
            >
              View Route Map &amp; Distances →
            </button>
          </div>
        </div>
      </section>

      {/* ── Gallery Preview ── */}
      <section className="pv-section" style={{ paddingTop: '2rem' }}>
        <div className="pv-section-header">
          <span className="pv-tag">Visual Tour</span>
          <h2 className="pv-title">Township Gallery Preview</h2>
          <p className="pv-sub">
            Real photos of finished roads, demarcated plots, clubhouse facilities, and green avenues.
          </p>
        </div>

        <div className="pv-gallery-grid">
          {GALLERY_ITEMS.slice(0, 3).map(item => (
            <div
              key={item.id}
              className="pv-gitem"
              onClick={() => onOpenLightbox(item)}
            >
              <img src={item.src} alt={item.title} className="pv-gitem__img" />
              <div className="pv-gitem__overlay">
                <h4 className="pv-gitem__title">{item.title}</h4>
                <span className="pv-gitem__cat">{item.category} (Click to Zoom)</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <button
            className="pv-btn-outline"
            onClick={() => navToPage('gallery')}
          >
            View Complete Gallery ({GALLERY_ITEMS.length} Photos) →
          </button>
        </div>
      </section>
    </>
  );
}

// ─── 2. Projects Page Component ──────────────────────────────────────────────
function ProjectsPage({ onSelectProject, navToPage }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sizeFilter, setSizeFilter] = useState('All');

  const categories = ['All', 'Gated Layouts', 'Highway Enclaves', 'Luxury Farm Plots'];

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter(p => {
      const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
      const matchSearch =
        !searchTerm ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSize =
        sizeFilter === 'All' ||
        (sizeFilter === 'Small' && p.plotSizes.includes('165')) ||
        (sizeFilter === 'Medium' && p.plotSizes.includes('200')) ||
        (sizeFilter === 'Large' && (p.plotSizes.includes('400') || p.plotSizes.includes('500') || p.plotSizes.includes('1000')));

      return matchCat && matchSearch && matchSize;
    });
  }, [categoryFilter, searchTerm, sizeFilter]);

  return (
    <div className="pv-section">
      <div className="pv-section-header">
        <span className="pv-tag">Portfolio</span>
        <h1 className="pv-title">Our Plotted Developments</h1>
        <p className="pv-sub">
          Search and filter our premium gated plotted layouts by location, category, and plot dimensions.
        </p>
      </div>

      {/* Filters Bar */}
      <div
        style={{
          background: 'var(--pv-navy-card)',
          border: '1px solid var(--pv-navy-border)',
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '2.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', flex: '1', minWidth: '240px', position: 'relative' }}>
          <input
            className="pv-input"
            style={{ width: '100%' }}
            placeholder="🔍 Search projects by name or location..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            className="pv-select"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            {categories.map(c => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>

          <select
            className="pv-select"
            value={sizeFilter}
            onChange={e => setSizeFilter(e.target.value)}
          >
            <option value="All">All Plot Sizes</option>
            <option value="Small">165 - 200 Sq.Yds</option>
            <option value="Medium">200 - 300 Sq.Yds</option>
            <option value="Large">400+ Sq.Yds</option>
          </select>

          {(searchTerm || categoryFilter !== 'All' || sizeFilter !== 'All') && (
            <button
              className="pv-btn-outline"
              style={{ padding: '0.55rem 0.9rem', fontSize: '0.8125rem' }}
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('All');
                setSizeFilter('All');
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Results Grid */}
      {filteredProjects.length > 0 ? (
        <div className="pv-projects-grid">
          {filteredProjects.map(p => (
            <article key={p.id} className="pv-pcard">
              <div className="pv-pcard__media">
                <img src={p.image} alt={p.name} className="pv-pcard__img" />
                <span className="pv-pcard__status">{p.status}</span>
                <span className="pv-pcard__cat">{p.category}</span>
              </div>
              <div className="pv-pcard__body">
                <div className="pv-pcard__loc">
                  <span>📍</span> {p.location}
                </div>
                <h3 className="pv-pcard__name">{p.name}</h3>
                <p className="pv-pcard__tagline">{p.tagline}</p>

                <div className="pv-pcard__specs">
                  <div className="pv-spec-item">
                    <span>Layout Area</span>
                    <span>{p.totalAcres}</span>
                  </div>
                  <div className="pv-spec-item">
                    <span>Plot Sizes</span>
                    <span>{p.plotSizes}</span>
                  </div>
                  <div className="pv-spec-item">
                    <span>Approval</span>
                    <span style={{ fontSize: '0.78rem' }}>{p.approval}</span>
                  </div>
                  <div className="pv-spec-item">
                    <span>Rate / Sq.Yd</span>
                    <span>₹{p.ratePerSqYd.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pv-pcard__footer">
                  <div className="pv-pcard__price">
                    <span>Indicative Price</span>
                    <strong>{p.minPrice}</strong>
                  </div>
                  <button
                    className="pv-btn-gold"
                    onClick={() => onSelectProject(p.id)}
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 1.5rem', background: 'var(--pv-navy-card)', borderRadius: '12px' }}>
          <h3>No matching projects found</h3>
          <p style={{ color: 'var(--pv-text-muted)' }}>Try resetting your search query or filters.</p>
        </div>
      )}

      {/* Bottom CTA */}
      <div style={{ marginTop: '4rem', background: 'var(--pv-navy-card)', border: '1px solid var(--pv-navy-border)', borderRadius: '14px', padding: '2.5rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem', color: 'var(--pv-text-main)' }}>
          Looking for a custom plot size or custom commercial frontage?
        </h3>
        <p style={{ color: 'var(--pv-text-muted)', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
          Contact our land acquisition and layout planners to explore bespoke plot configurations and commercial plots.
        </p>
        <button className="pv-btn-gold" onClick={() => navToPage('contact')}>
          Contact Land Specialist →
        </button>
      </div>
    </div>
  );
}

// ─── 3. Project Details Page Component ───────────────────────────────────────
function ProjectDetailsPage({ project, allProjects, onSelectProject, waDirectUrl, navToPage }) {
  const [calcSqYds, setCalcSqYds] = useState(200);
  const [brochureRequested, setBrochureRequested] = useState(false);

  const estimatedCost = useMemo(() => {
    return (calcSqYds * project.ratePerSqYd).toLocaleString();
  }, [calcSqYds, project.ratePerSqYd]);

  return (
    <div>
      {/* Details Top Hero */}
      <div className="pv-details-hero">
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
            <button
              className="pv-btn-outline"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              onClick={() => navToPage('projects')}
            >
              ← Back to Projects
            </button>
            <span style={{ color: 'var(--pv-text-muted)', fontSize: '0.875rem', margin: '0 0.25rem' }}>/</span>
            <span style={{ color: 'var(--pv-gold)', fontSize: '0.875rem', fontWeight: '600' }}>{project.category}</span>
          </div>

          <div className="pv-details-hero__grid">
            <div>
              <span className="pv-pcard__status" style={{ position: 'static', display: 'inline-block', marginBottom: '0.5rem' }}>
                {project.status}
              </span>
              <h1 className="pv-title" style={{ margin: '0 0 0.5rem' }}>{project.name}</h1>
              <p style={{ color: 'var(--pv-gold)', fontWeight: '600', margin: '0 0 0.5rem' }}>
                📍 {project.location}
              </p>
              <p style={{ color: 'var(--pv-text-muted)', maxWidth: '650px', lineHeight: '1.6' }}>
                {project.description}
              </p>
            </div>

            <div style={{ background: 'var(--pv-navy-elevated)', border: '1px solid var(--pv-navy-border)', padding: '1.5rem', borderRadius: '12px', minWidth: '240px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--pv-text-muted)' }}>Indicative Price Range</div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--pv-gold)' }}>
                {project.minPrice}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--pv-text-muted)', marginBottom: '1rem' }}>
                Rate: <strong>₹{project.ratePerSqYd.toLocaleString()}</strong> / Sq.Yd*
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <a
                  href={waDirectUrl(`Hi PlotVenture, please share price sheet & availability for ${project.name}.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="pv-btn-gold"
                  style={{ textAlign: 'center', justifyContent: 'center' }}
                >
                  💬 WhatsApp Price Sheet
                </a>
                <button
                  className="pv-btn-outline"
                  onClick={() => navToPage('contact')}
                >
                  Book Site Visit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pv-section">
        {/* Switch project dropdown / pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: '700', fontSize: '0.875rem' }}>Switch Project:</span>
          {allProjects.map(p => (
            <button
              key={p.id}
              className={`pv-filter-chip ${p.id === project.id ? 'active' : ''}`}
              onClick={() => {
                onSelectProject(p.id);
              }}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Plot Budget Calculator & Specifications */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Calculator */}
          <div style={{ background: 'var(--pv-navy-card)', border: '1px solid var(--pv-navy-border)', borderRadius: '12px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', margin: '0 0 1rem' }}>📐 Plot Budget Calculator</h3>
            <p style={{ color: 'var(--pv-text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Slide to adjust plot size and calculate estimated base value at current layout pricing.
            </p>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: '700' }}>
                <span>Plot Area:</span>
                <span style={{ color: 'var(--pv-gold)' }}>{calcSqYds} Sq.Yards</span>
              </div>
              <input
                type="range"
                min="150"
                max="1000"
                step="25"
                value={calcSqYds}
                onChange={e => setCalcSqYds(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--pv-gold)' }}
              />
            </div>

            <div style={{ background: 'var(--pv-navy-elevated)', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--pv-text-muted)' }}>Estimated Base Land Value</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--pv-gold)' }}>
                ₹{estimatedCost}*
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--pv-text-muted)', marginTop: '0.25rem' }}>
                @ ₹{project.ratePerSqYd.toLocaleString()} / Sq.Yd (Govt registration &amp; GST applicable as per norms)
              </div>
            </div>

            <button
              className="pv-btn-gold"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => navToPage('contact')}
            >
              Get Detailed Payment Schedule →
            </button>
          </div>

          {/* Highlights & Approvals */}
          <div style={{ background: 'var(--pv-navy-card)', border: '1px solid var(--pv-navy-border)', borderRadius: '12px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', margin: '0 0 1rem' }}>✅ Key Highlights &amp; Approvals</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {project.highlights.map((h, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--pv-gold)', fontWeight: 'bold' }}>✓</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--pv-navy-border)' }}>
              {brochureRequested ? (
                <div className="pv-alert pv-alert--success" style={{ fontSize: '0.8rem' }}>
                  ✓ Brochure download link sent to your WhatsApp!
                </div>
              ) : (
                <button
                  className="pv-btn-outline"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => setBrochureRequested(true)}
                >
                  📥 Download Sanctioned Layout Brochure (PDF)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 4. About Us Page Component ──────────────────────────────────────────────
function AboutPage({ navToPage, waDirectUrl }) {
  return (
    <div className="pv-section">
      <div className="pv-section-header">
        <span className="pv-tag">Our Legacy</span>
        <h1 className="pv-title">About PlotVenture</h1>
        <p className="pv-sub">
          Redefining plotted developments with transparent documentation, prime connectivity, and meticulous on-ground execution.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center', marginBottom: '4rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', margin: '0 0 1.25rem', color: 'var(--pv-text-main)' }}>
            We don't just sell plots; we establish future-ready communities.
          </h2>
          <p style={{ color: 'var(--pv-text-muted)', lineHeight: '1.8', marginBottom: '1.25rem' }}>
            PlotVenture was founded on a simple core principle: home buyers and investors deserve absolute peace of mind when acquiring land. Every acre in our portfolio undergoes stringent title due-diligence, government master plan verification, and town planning sanctions prior to launch.
          </p>
          <p style={{ color: 'var(--pv-text-muted)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
            With over 16 years of expertise across Andhra Pradesh and Telangana, we have established high-appreciation layouts equipped with wide asphalt avenues, underground utilities, rainwater harvesting systems, and gated safety.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="pv-btn-gold" onClick={() => navToPage('projects')}>
              View Current Townships
            </button>
            <a
              href={waDirectUrl('Hello PlotVenture team, I would like to consult with your land advisors.')}
              target="_blank"
              rel="noreferrer"
              className="pv-btn-outline"
            >
              💬 Speak to Leadership
            </a>
          </div>
        </div>

        <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--pv-navy-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
          <img
            src="/images/plotventure-avenue.jpg"
            alt="PlotVenture Avenue Infrastructure"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {[
          { icon: '📜', title: '100% Clear Title', desc: 'Legally certified documentation with 30-year encumbrance search and direct spot registration.' },
          { icon: '🏛️', title: 'Approved Sanctions', desc: 'Compliant with HMDA / DTCP layout norms and verified RERA registrations.' },
          { icon: '🏦', title: 'Major Bank Approvals', desc: 'Pre-vetted by SBI, HDFC, and ICICI for hassle-free land loan sanction.' },
          { icon: '🚀', title: 'High ROI Corridors', desc: 'Strategically located along planned highways, SEZs, and urban expansion hubs.' },
        ].map((pillar, idx) => (
          <div key={idx} className="pv-acard">
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{pillar.icon}</div>
            <h3 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem', color: 'var(--pv-text-main)' }}>{pillar.title}</h3>
            <p style={{ color: 'var(--pv-text-muted)', fontSize: '0.85rem', lineHeight: '1.55', margin: 0 }}>{pillar.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 5. Amenities Page Component ─────────────────────────────────────────────
function AmenitiesPage({ navToPage, waDirectUrl }) {
  const [filterCat, setFilterCat] = useState('All');
  const categories = ['All', 'Infrastructure & Safety', 'Lifestyle & Leisure', 'Health & Sports', 'Greenery & Nature'];

  const filteredAmenities = useMemo(() => {
    if (filterCat === 'All') return AMENITIES;
    return AMENITIES.filter(a => a.category === filterCat);
  }, [filterCat]);

  return (
    <div className="pv-section">
      <div className="pv-section-header">
        <span className="pv-tag">Master Features</span>
        <h1 className="pv-title">Township Amenities</h1>
        <p className="pv-sub">
          Every PlotVenture development is fully equipped with premier recreational, utility, and safety features.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="pv-gallery-filters">
        {categories.map(c => (
          <button
            key={c}
            className={`pv-filter-chip ${filterCat === c ? 'active' : ''}`}
            onClick={() => setFilterCat(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="pv-amenities-grid">
        {filteredAmenities.map(a => (
          <div key={a.id} className="pv-acard">
            <div className="pv-acard__icon">{a.icon}</div>
            <div className="pv-acard__cat">{a.category}</div>
            <h3 className="pv-acard__title">{a.title}</h3>
            <p className="pv-acard__desc">{a.description}</p>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '4rem', background: 'var(--pv-navy-card)', padding: '2.5rem', borderRadius: '14px', border: '1px solid var(--pv-navy-border)' }}>
        <h3 style={{ fontSize: '1.35rem', margin: '0 0 0.5rem' }}>Want to inspect our clubhouse &amp; avenue infrastructure in person?</h3>
        <p style={{ color: 'var(--pv-text-muted)', marginBottom: '1.5rem' }}>Join our weekend guided site visit with complimentary transportation.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="pv-btn-gold" onClick={() => navToPage('contact')}>
            Book Weekend Site Visit →
          </button>
          <a
            href={waDirectUrl('Hi, I want to book a weekend site visit to inspect PlotVenture amenities.')}
            target="_blank"
            rel="noreferrer"
            className="pv-btn-outline"
          >
            💬 Enquire on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── 6. Gallery Page Component ───────────────────────────────────────────────
function GalleryPage({ onOpenLightbox }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Layout Views', 'Clubhouse & Leisure', 'Avenue & Parks'];

  const filteredGallery = useMemo(() => {
    if (activeCategory === 'All') return GALLERY_ITEMS;
    return GALLERY_ITEMS.filter(g => g.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="pv-section">
      <div className="pv-section-header">
        <span className="pv-tag">Visual Portfolio</span>
        <h1 className="pv-title">Township Photo Gallery</h1>
        <p className="pv-sub">
          High-resolution photography showcasing finished infrastructure, green parks, and recreational clubhouses.
        </p>
      </div>

      <div className="pv-gallery-filters">
        {categories.map(c => (
          <button
            key={c}
            className={`pv-filter-chip ${activeCategory === c ? 'active' : ''}`}
            onClick={() => setActiveCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="pv-gallery-grid">
        {filteredGallery.map(item => (
          <div
            key={item.id}
            className="pv-gitem"
            onClick={() => onOpenLightbox(item)}
          >
            <img src={item.src} alt={item.title} className="pv-gitem__img" loading="lazy" />
            <div className="pv-gitem__overlay">
              <h4 className="pv-gitem__title">{item.title}</h4>
              <span className="pv-gitem__cat">{item.category} · Click to Enlarge</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 7. Location Page Component ──────────────────────────────────────────────
function LocationPage({ navToPage, waDirectUrl }) {
  return (
    <div className="pv-section">
      <div className="pv-section-header">
        <span className="pv-tag">Connectivity</span>
        <h1 className="pv-title">Prime Location Advantages</h1>
        <p className="pv-sub">
          Strategically situated in high-appreciation development corridors with rapid arterial access.
        </p>
      </div>

      <div className="pv-loc-grid" style={{ marginBottom: '4rem' }}>
        <div className="pv-loc-cards">
          {LOCATION_HIGHLIGHTS.map((item, idx) => (
            <div key={idx} className="pv-loc-card">
              <div className="pv-loc-card__icon">{item.icon}</div>
              <div>
                <div className="pv-loc-card__dest">{item.destination}</div>
                <div className="pv-loc-card__dist">{item.distance} Drive</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--pv-text-muted)' }}>{item.type}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="pv-map-box">
          <div className="pv-map-box__canvas" />
          <div className="pv-map-pin">📍</div>
          <h3 style={{ fontSize: '1.35rem', margin: '0 0 0.5rem', color: 'var(--pv-text-main)' }}>
            Growth Corridor Junction
          </h3>
          <p style={{ color: 'var(--pv-text-muted)', fontSize: '0.85rem', maxWidth: '340px', margin: '0 0 1.25rem' }}>
            Situated right off the Outer Ring Road (ORR) connecting to Airport, Aerospace Park, and Gachibowli Financial District.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', width: '100%', maxWidth: '340px' }}>
            <a
              href={waDirectUrl('Hi PlotVenture, please share exact Google Maps location pin for site visit.')}
              target="_blank"
              rel="noreferrer"
              className="pv-btn-gold"
              style={{ justifyContent: 'center' }}
            >
              🗺️ Request Google Maps Pin on WhatsApp
            </a>
            <button
              className="pv-btn-outline"
              onClick={() => navToPage('projects')}
              style={{ justifyContent: 'center' }}
            >
              Explore Nearby Layouts →
            </button>
          </div>
        </div>
      </div>

      {/* Travel Highlights Table */}
      <div style={{ background: 'var(--pv-navy-card)', border: '1px solid var(--pv-navy-border)', borderRadius: '14px', padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', margin: '0 0 1.25rem' }}>Surrounding Infrastructure Highlights</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          <div>
            <h4 style={{ color: 'var(--pv-gold)', margin: '0 0 0.5rem' }}>🎓 Top Educational Hubs</h4>
            <p style={{ color: 'var(--pv-text-muted)', fontSize: '0.85rem', lineHeight: '1.6', margin: 0 }}>
              Delhi Public School, Aga Khan Academy, and international universities located within 10 to 15 minutes.
            </p>
          </div>
          <div>
            <h4 style={{ color: 'var(--pv-gold)', margin: '0 0 0.5rem' }}>🏢 Employment Centers</h4>
            <p style={{ color: 'var(--pv-text-muted)', fontSize: '0.85rem', lineHeight: '1.6', margin: 0 }}>
              TCS Adibatla, Tata Boeing Aerospace SEZ, and upcoming hardware park within 12 minutes.
            </p>
          </div>
          <div>
            <h4 style={{ color: 'var(--pv-gold)', margin: '0 0 0.5rem' }}>✈️ Transit &amp; Airports</h4>
            <p style={{ color: 'var(--pv-text-muted)', fontSize: '0.85rem', lineHeight: '1.6', margin: 0 }}>
              Rajiv Gandhi International Airport (RGIA) accessible via signal-free ORR express drive in 20 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 8. Contact Us Page Component ────────────────────────────────────────────
function ContactPage({ waDirectUrl, currentProject }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    project: currentProject?.name || 'Green County Elite',
    plotSize: '200 Sq.Yds',
    date: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [openFaq, setOpenFaq] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <div className="pv-section">
      <div className="pv-section-header">
        <span className="pv-tag">Get In Touch</span>
        <h1 className="pv-title">Contact PlotVenture</h1>
        <p className="pv-sub">
          Reach our layout advisors for sanctioned layout brochures, plot availability, and personalized site visits.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem', alignItems: 'start', marginBottom: '4rem' }}>
        {/* Contact Form */}
        <div style={{ background: 'var(--pv-navy-card)', border: '1px solid var(--pv-navy-border)', borderRadius: '16px', padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', margin: '0 0 0.5rem', color: 'var(--pv-text-main)' }}>
            Schedule an Inspection or Request Enquiry
          </h2>
          <p style={{ color: 'var(--pv-text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Fill in your details below and our land specialist will contact you within 30 minutes.
          </p>

          {submitted ? (
            <div className="pv-alert pv-alert--success" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>✓ Enquiry Received Successfully!</div>
              <p style={{ margin: '0.5rem 0 1rem', fontSize: '0.85rem', lineHeight: '1.5' }}>
                Thank you, <strong>{formData.name}</strong>. Our senior property advisor will reach out to you at <strong>{formData.phone}</strong>.
              </p>
              <a
                href={waDirectUrl(`Hi PlotVenture, I submitted an enquiry for ${formData.project} (${formData.plotSize}). My name is ${formData.name}.`)}
                target="_blank"
                rel="noreferrer"
                className="pv-btn-gold"
              >
                💬 Open WhatsApp Chat Direct
              </a>
            </div>
          ) : (
            <form className="pv-form" onSubmit={handleSubmit} noValidate>
              {formError && (
                <div className="pv-alert pv-alert--error">{formError}</div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="pv-form-group">
                  <label htmlFor="ct-name">Full Name *</label>
                  <input
                    id="ct-name"
                    className="pv-input"
                    placeholder="e.g. Rajesh Kumar"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="pv-form-group">
                  <label htmlFor="ct-phone">Mobile / WhatsApp Number *</label>
                  <input
                    id="ct-phone"
                    className="pv-input"
                    type="tel"
                    placeholder="10-digit number"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="pv-form-group">
                  <label htmlFor="ct-email">Email Address</label>
                  <input
                    id="ct-email"
                    type="email"
                    className="pv-input"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="pv-form-group">
                  <label htmlFor="ct-project">Interested Project</label>
                  <select
                    id="ct-project"
                    className="pv-select"
                    value={formData.project}
                    onChange={e => setFormData({ ...formData, project: e.target.value })}
                  >
                    {PROJECTS.map(p => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="pv-form-group">
                  <label htmlFor="ct-size">Preferred Plot Size</label>
                  <select
                    id="ct-size"
                    className="pv-select"
                    value={formData.plotSize}
                    onChange={e => setFormData({ ...formData, plotSize: e.target.value })}
                  >
                    <option value="165 Sq.Yds">165 Sq.Yds (~₹32 Lakhs*)</option>
                    <option value="200 Sq.Yds">200 Sq.Yds (~₹39 Lakhs*)</option>
                    <option value="267 Sq.Yds">267 Sq.Yds (~₹52 Lakhs*)</option>
                    <option value="400 Sq.Yds">400 Sq.Yds (~₹78 Lakhs*)</option>
                    <option value="500+ Sq.Yds">500+ Sq.Yds (Large Estate)</option>
                  </select>
                </div>
                <div className="pv-form-group">
                  <label htmlFor="ct-date">Preferred Site Visit Date</label>
                  <input
                    id="ct-date"
                    type="date"
                    className="pv-input"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>

              <div className="pv-form-group">
                <label htmlFor="ct-message">Specific Requirements / Queries</label>
                <textarea
                  id="ct-message"
                  className="pv-textarea"
                  rows="3"
                  placeholder="Tell us if you prefer East facing, corner plots, or need bank loan assistance..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="pv-btn-gold"
                style={{ justifyContent: 'center', padding: '0.85rem 1.5rem', fontSize: '1rem' }}
                disabled={loading}
              >
                {loading ? 'Submitting Form...' : 'Submit Booking Request →'}
              </button>
            </form>
          )}
        </div>

        {/* Contact Info Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: 'var(--pv-navy-card)', border: '1px solid var(--pv-navy-border)', borderRadius: '14px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--pv-gold)', margin: '0 0 1rem' }}>
              Direct Sales Hotlines
            </h3>
            <p style={{ margin: '0 0 0.5rem', color: 'var(--pv-text-muted)' }}>
              Main Sales Desk:
            </p>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--pv-text-main)', marginBottom: '1rem' }}>
              {siteConfig.phone}
            </div>

            <p style={{ margin: '0 0 0.5rem', color: 'var(--pv-text-muted)' }}>
              WhatsApp Instant Desk:
            </p>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#22c55e', marginBottom: '1.25rem' }}>
              {siteConfig.whatsapp}
            </div>

            <a
              href={waDirectUrl()}
              target="_blank"
              rel="noreferrer"
              className="pv-btn-gold"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              💬 WhatsApp Chat Now
            </a>
          </div>

          <div style={{ background: 'var(--pv-navy-card)', border: '1px solid var(--pv-navy-border)', borderRadius: '14px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--pv-gold)', margin: '0 0 0.75rem' }}>
              Corporate &amp; Site Offices
            </h3>
            <p style={{ color: 'var(--pv-text-muted)', fontSize: '0.85rem', lineHeight: '1.6', margin: '0 0 0.75rem' }}>
              <strong>Hyderabad Office:</strong> {siteConfig.registeredOffice.fullAddress}
            </p>
            <p style={{ color: 'var(--pv-text-muted)', fontSize: '0.85rem', lineHeight: '1.6', margin: 0 }}>
              <strong>Site Visit Timings:</strong> Monday to Sunday, 9:00 AM – 6:30 PM
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div style={{ marginTop: '2rem' }}>
        <div className="pv-section-header">
          <span className="pv-tag">Clear Answers</span>
          <h2 className="pv-title">Frequently Asked Questions</h2>
          <p className="pv-sub">
            Learn more about approvals, registration, and bank loans for plotted layouts.
          </p>
        </div>

        <div className="pv-faq-list">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="pv-faq-item">
              <button
                className="pv-faq-q"
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                aria-expanded={openFaq === idx}
              >
                <span>{faq.q}</span>
                <span style={{ color: 'var(--pv-gold)', fontSize: '1.2rem' }}>
                  {openFaq === idx ? '−' : '+'}
                </span>
              </button>
              {openFaq === idx && (
                <div className="pv-faq-a">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
