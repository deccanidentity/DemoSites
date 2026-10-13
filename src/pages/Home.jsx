import { useNavigate } from 'react-router-dom';
import industries from '../data/industries.js';
import templates from '../data/templates.js';
import packages from '../data/packages.js';
import siteConfig from '../data/site.config.js';
import { clientStats } from '../data/testimonials.js';
import TemplateCard from '../components/TemplateCard.jsx';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const featuredTemplates = templates.filter(t => t.featured);

  return (
    <main className="page-content">

      {/* ── Vertical Unified Hero & Industry Panorama (Single Viewport Fit) ──────────── */}
      <section className="hero hero--vertical-fit" aria-labelledby="hero-title">
        <div className="hero__bg">
          <div className="hero__grid-lines" aria-hidden="true" />
          <div className="hero__glow" aria-hidden="true" />
        </div>

        <div className="container hero__vertical-layout">
          {/* Top Section: Centered Value Proposition & CTAs */}
          <div className="hero__header-block">
            <div className="hero__eyebrow-slug">
              <span className="hero__eyebrow-dot" aria-hidden="true" />
              Your Business. Your Website. Your Way.
            </div>

            <h1 id="hero-title" className="hero__title hero__title--vertical">
              Industry-Ready Websites.{' '}
              <span className="gradient-text">Designed for Your Success.</span>
            </h1>

            <p className="hero__subtitle hero__subtitle--vertical">
              Discover industry-ready website templates, explore live demos and customize your perfect design to bring your brand to life.
            </p>

            <div className="hero__actions hero__actions--vertical">
              <button className="btn btn-primary" onClick={() => navigate('/templates')}>
                Browse All Templates ({templates.length}) →
              </button>
              <button className="btn btn-outline" onClick={() => navigate('/contact')}>
                Contact Our Team
              </button>

              <div className="hero__stats-inline" role="list">
                <div className="hero__stat-inline-item" role="listitem">
                  <span className="hero__stat-inline-icon" aria-hidden="true">💼</span>
                  <strong>9+</strong>
                  <span>Industries</span>
                </div>
                <span className="hero__stat-inline-dot" aria-hidden="true">•</span>
                <div className="hero__stat-inline-item" role="listitem">
                  <span className="hero__stat-inline-icon" aria-hidden="true">🚀</span>
                  <strong>{templates.length}</strong>
                  <span>Live Demo Sites</span>
                </div>
                <span className="hero__stat-inline-dot" aria-hidden="true">•</span>
                <div className="hero__stat-inline-item hero__stat-inline-item--price" role="listitem">
                  <span className="hero__stat-inline-icon" aria-hidden="true">👉</span>
                  <strong>₹4,999</strong>
                  <span>Starting ✨</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Full-Width Industry Panorama Deck */}
          <div className="hero__industry-deck" aria-labelledby="industry-deck-title">
            <div className="hero__deck-header">
              <div className="hero__deck-header-left">
                <span className="hero__deck-tag">
                  <span className="hero__deck-tag-dot" aria-hidden="true" />
                  FIND YOUR INDUSTRY
                </span>
                <h2 id="industry-deck-title" className="hero__deck-title">
                  What kind of website do you need?
                </h2>
              </div>
              <span className="hero__deck-hint">
                Click any category to preview live websites ↗
              </span>
            </div>

            <div className="hero__deck-grid">
              {industries.map(ind => {
                const count = templates.filter(t => t.industry === ind.id).length;
                return (
                  <div
                    key={ind.id}
                    className="hero__deck-card"
                    style={{ '--ind-color': ind.color }}
                    onClick={() => navigate(`/industries/${ind.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && navigate(`/industries/${ind.id}`)}
                    aria-label={`${ind.name} industry templates (${count > 0 ? `${count} live demos` : 'explore'})`}
                  >
                    <div className="hero__deck-card-glow" aria-hidden="true" />
                    <div className="hero__deck-icon-wrap">
                      <span className="hero__deck-emoji" aria-hidden="true">{ind.emoji}</span>
                    </div>

                    <div className="hero__deck-details">
                      <div className="hero__deck-name">{ind.name}</div>
                      <div className="hero__deck-sub">
                        {ind.subtitle?.split('•').slice(0, 3).join(' • ') || ind.name}
                      </div>
                    </div>

                    <div className="hero__deck-action">
                      <span className={`hero__deck-badge ${count > 0 ? 'is-live' : 'is-explore'}`}>
                        {count > 0 ? (
                          <>
                            <span className="hero__live-dot" aria-hidden="true" />
                            {count} Live
                          </>
                        ) : (
                          'Explore'
                        )}
                      </span>
                      <span className="hero__deck-arrow-btn" aria-hidden="true">
                        <span className="hero__deck-arrow">→</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Ready to Launch Banner (Above Featured Industry Websites) ── */}
      <section className="launch-cta-section" aria-label="Ready to Launch">
        <div className="container">
          <div className="launch-cta-box">
            <div className="launch-cta-box__left">
              <div className="launch-cta-box__tags-row">
                <span className="launch-cta-box__tag">
                  <span className="launch-cta-box__tag-dot" aria-hidden="true" />
                  Ready to Launch?
                </span>
                <span
                  className="launch-cta-box__offer-pill"
                  title="View Flat 30% Off Website Packages"
                >
                  <span className="launch-cta-box__offer-dot" aria-hidden="true" />
                  FLAT 30% OFFER
                </span>
              </div>
              <h2 className="launch-cta-box__title">
                Ready to build your business website?
              </h2>
              <p className="launch-cta-box__desc">
                Pick an industry template, test every interactive button live, and launch your custom site starting at ₹4,999 with <strong>Flat 30% Off</strong> and 100% code ownership.
              </p>
            </div>
            <div className="launch-cta-box__buttons">
              <button className="btn btn-primary launch-cta-box__btn" onClick={() => navigate('/pricing')}>
                Starting at ₹4,999 →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Templates ────────────────────────────────────────── */}
      <section className="section featured-section" aria-labelledby="featured-title">
        <div className="container">
          <div className="featured-header">
            <div>
              <div className="section-label">Interactive Showcase</div>
              <h2 id="featured-title" className="section-title">Featured Industry Website Templates</h2>
              <p className="section-sub">Experience real interactive layouts with booking modals, pricing calculators, live menus, and floor plan explorers.</p>
            </div>
            <button className="btn btn-outline" onClick={() => navigate('/templates')}>
              View all Templates ({templates.length}) →
            </button>
          </div>
          <div className="templates-grid">
            {featuredTemplates.map(t => (
              <TemplateCard key={t.slug} template={t} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Real Client Results Summary (Minimal info with direct navigation to Clients Page) ── */}
      <section className="section testimonials-section" aria-labelledby="testimonials-title">
        <div className="container">
          <div className="testimonials-header">
            <div className="testimonials-header__content">
              <div className="section-label">Real Client Results</div>
              <h2 id="testimonials-title" className="section-title testimonials-title">
                Trusted by Businesses Across <span className="gradient-text">Telangana, AP, Pan-India &amp; Worldwide</span>
              </h2>
              <p className="section-sub">
                See how real builders, clinics, academies, and business owners launched high-converting websites with DeccanIDentity.
              </p>
            </div>
          </div>

          {/* Proof Stats Strip */}
          <div className="testimonials-stats-strip">
            {clientStats.map(stat => (
              <div key={stat.label} className="tstat-card">
                <span className="tstat-card__icon" aria-hidden="true">{stat.icon}</span>
                <div className="tstat-card__text">
                  <div className="tstat-card__val">{stat.value}</div>
                  <div className="tstat-card__lbl">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Minimal Navigation Callout to Clients Page */}
          <div className="testimonials-min-bar">
            <div className="testimonials-min-bar__left">
              <span className="testimonials-min-bar__badge">Verified Feedback</span>
              <p className="testimonials-min-bar__desc">
                Read authentic reviews, project metrics, and client feedback from over 50+ launched businesses.
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/clients')}>
              Explore All Client Stories & Reviews →
            </button>
          </div>
        </div>
      </section>

      {/* ── Competitive Advantage ─────────────────────────────────────── */}
      <section className="section competitive-section" aria-labelledby="comp-title">
        <div className="container">
          <div className="section-label">Why Choose Us</div>
          <h2 id="comp-title" className="section-title">
            The DeccanIDentity <span className="gradient-text">Advantage</span>
          </h2>
          <p className="section-sub">
            Purpose-engineered for performance, sub-second speed, and 100% code & domain ownership.
          </p>

          <div className="comp-grid">
            {/* DeccanIDentity Card */}
            <div className="comp-card comp-card--featured">
              <div className="comp-card__badge">⭐ Recommended Choice</div>
              <div className="comp-card__header-group">
                <h3 className="comp-card__title">DeccanIDentity Templates</h3>
                <p className="comp-card__desc">Modern frontend architecture built by enterprise engineers at {siteConfig.companyLegalName}.</p>
              </div>
              <ul className="comp-card__list">
                <li><span className="comp-card__icon-bullet">⚡</span> <div><strong>Sub-Second Loading:</strong> Ultra-clean code with zero bloated plugins or slow scripts.</div></li>
                <li><span className="comp-card__icon-bullet">🎯</span> <div><strong>100% Live Prototypes:</strong> Try real interactive maps, tabs, and filters before you invest.</div></li>
                <li><span className="comp-card__icon-bullet">🛡️</span> <div><strong>Enterprise Grade Security:</strong> Clean code standards backed by corporate software expertise.</div></li>
                <li><span className="comp-card__icon-bullet">💼</span> <div><strong>Clear Code Ownership:</strong> Your domain, your content, and fully customizable design.</div></li>
                <li><span className="comp-card__icon-bullet">📞</span> <div><strong>Direct Technical Support:</strong> Direct support desks with Hyderabad HQ and branch offices.</div></li>
              </ul>
              <div className="comp-card__cta-wrap">
                <button className="btn btn-primary comp-card__btn" onClick={() => navigate('/templates')}>
                  Browse Live Demos →
                </button>
              </div>
            </div>

            {/* Generic WordPress */}
            <div className="comp-card">
              <div className="comp-card__label">⚠️ Traditional Alternative</div>
              <div className="comp-card__header-group">
                <h3 className="comp-card__title">Generic WordPress Themes</h3>
                <p className="comp-card__desc">Multi-purpose themes loaded with third-party builder plugins.</p>
              </div>
              <ul className="comp-card__list comp-card__list--alt">
                <li><span className="comp-card__icon-bullet warn">⚠️</span> <div>30+ plugins slowing down mobile load times to 4–7 seconds.</div></li>
                <li><span className="comp-card__icon-bullet warn">⚠️</span> <div>Frequent plugin vulnerabilities and form spam attacks.</div></li>
                <li><span className="comp-card__icon-bullet warn">⚠️</span> <div>Complex dashboards that require constant maintenance.</div></li>
                <li><span className="comp-card__icon-bullet warn">⚠️</span> <div>Recurring costs for premium plugins and updates.</div></li>
                <li><span className="comp-card__icon-bullet warn">⚠️</span> <div>Hard to customize without developer licensing fees.</div></li>
              </ul>
            </div>

            {/* Freelancers */}
            <div className="comp-card">
              <div className="comp-card__label">⚠️ Traditional Alternative</div>
              <div className="comp-card__header-group">
                <h3 className="comp-card__title">Unverified Freelance Projects</h3>
                <p className="comp-card__desc">Ad-hoc website builds without corporate accountability.</p>
              </div>
              <ul className="comp-card__list comp-card__list--alt">
                <li><span className="comp-card__icon-bullet warn">⚠️</span> <div>Inconsistent code quality and unpredictable delivery timelines.</div></li>
                <li><span className="comp-card__icon-bullet warn">⚠️</span> <div>Extra charges for small revisions and basic configurations.</div></li>
                <li><span className="comp-card__icon-bullet warn">⚠️</span> <div>No long-term maintenance or post-delivery guarantees.</div></li>
                <li><span className="comp-card__icon-bullet warn">⚠️</span> <div>Lack of industry-specific functional requirements.</div></li>
                <li><span className="comp-card__icon-bullet warn">⚠️</span> <div>Single point of failure if the developer is unavailable.</div></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────── */}
      <section className="section how-section" aria-labelledby="how-title">
        <div className="container">
          <div className="section-label">Simple Process</div>
          <h2 id="how-title" className="section-title">
            How It Works: <span className="gradient-text">4 Straightforward Steps</span>
          </h2>
          <p className="section-sub">From interactive prototype testing to live deployment in an average of 4 business days.</p>

          <div className="how-grid">
            {[
              { step: '01', icon: '🔍', title: 'Pick Your Template', desc: 'Browse templates by industry. Test every button, form, and layout map live in your browser.' },
              { step: '02', icon: '📝', title: 'Share Your Details', desc: 'Send us your company logo, project details, images, and content via WhatsApp or form.' },
              { step: '03', icon: '⚡', title: 'We Customize & Style', desc: 'We tailor the layout to match your branding, colors, and specific business workflow.' },
              { step: '04', icon: '🚀', title: 'Launch on Your Domain', desc: 'We handle deployment, connect your custom domain, and hand over your ready-to-use site.' },
            ].map(item => (
              <div key={item.step} className="how-card">
                <div className="how-card__top">
                  <span className="how-card__step-pill">Step {item.step}</span>
                  <div className="how-card__watermark" aria-hidden="true">{item.step}</div>
                </div>
                <div className="how-card__icon-wrap">
                  <span className="how-card__icon" aria-hidden="true">{item.icon}</span>
                </div>
                <h3 className="how-card__title">{item.title}</h3>
                <p className="how-card__desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Transparent Pricing Strip ─────────────────────────────────── */}
      <section className="section pricing-strip-section" aria-labelledby="pricing-strip-title">
        <div className="container">
          <div className="section-label">Transparent Packages</div>
          <h2 id="pricing-strip-title" className="section-title">
            One Clear Pricing System. <span className="gradient-text">Zero Hidden Costs.</span>
          </h2>
          <p className="section-sub">Same transparent tiers apply across all industries with no setup surprises or recurring builder lock-ins.</p>

          {/* Promotional Offer Callout Bar */}
          <div
            className="pricing-strip__offer-bar"
            onClick={() => navigate('/pricing')}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && navigate('/pricing')}
            title="Click to view pricing & discount"
          >
            <div className="pricing-strip__offer-left">
              <span className="pricing-strip__offer-pill">
                <span className="pricing-strip__offer-dot" aria-hidden="true" />
                FLAT 30% OFFER
              </span>
              <span className="pricing-strip__offer-text">
                Limited Time Offer: <strong>Flat 30% Off</strong> on all website development packages!
              </span>
            </div>
            <button
              className="btn btn-primary pricing-strip__offer-btn"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/pricing');
              }}
            >
              Explore All Packages & Inclusions →
            </button>
          </div>

          <div className="pricing-strip">
            {packages.map(pkg => (
              <div
                key={pkg.id}
                className={`price-chip ${pkg.highlight ? 'price-chip--active' : ''}`}
                onClick={() => navigate('/pricing')}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && navigate('/pricing')}
                title={`View ${pkg.name} Package Details`}
              >
                {pkg.badge && <span className="price-chip__badge">{pkg.badge}</span>}
                <div className="price-chip__name">{pkg.name}</div>
                <div className="price-chip__price">{pkg.priceLabel}</div>
                {pkg.pages && <div className="price-chip__pages">{pkg.pages} Pages</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
