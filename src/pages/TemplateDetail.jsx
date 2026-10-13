import { useParams, useNavigate, Link } from 'react-router-dom';
import templates from '../data/templates.js';
import packages from '../data/packages.js';
import siteConfig from '../data/site.config.js';
import { useTheme } from '../context/ThemeContext.jsx';
import './TemplateDetail.css';

export default function TemplateDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const template = templates.find(t => t.slug === slug);

  if (!template) {
    return (
      <div className="page-content" style={{ textAlign: 'center', paddingTop: '20vh' }}>
        <h1>Template not found</h1>
        <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => navigate('/templates')}>Browse Templates</button>
      </div>
    );
  }

  const pkg = packages.find(p => p.id === template.packageId) || packages[0];
  const waMsgRaw = `Hi! I'm interested in the ${template.name} template (${template.tagline}). Please share more details.`;
  const waMsg = encodeURIComponent(waMsgRaw);
  const waUrl = `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}?text=${waMsg}`;

  return (
    <main className="page-content">
      {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
      <nav className="td-breadcrumb container" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true">›</span>
        <Link to="/templates">Templates</Link>
        <span aria-hidden="true">›</span>
        <Link to={`/industries/${template.industry}`}>{template.industryLabel}</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">{template.name}</span>
      </nav>

      <div className="container td-layout">
        {/* ── Left: Main content ─────────────────────────────────────────── */}
        <div className="td-main">

          {/* Preview Controls Bar */}
          <div className="td-preview-header">
            <span className="td-preview-header__label">
              Interactive Preview · {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </span>
            <button
              type="button"
              className="td-theme-pill-btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch template preview to light mode' : 'Switch template preview to dark mode'}
              title={theme === 'dark' ? 'Switch template preview to light mode' : 'Switch template preview to dark mode'}
            >
              <span className="td-theme-pill-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
              <span>{theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
            </button>
          </div>

          {/* Preview */}
          <div
            className={`td-preview td-preview--${theme}`}
            style={{ '--accent': template.color }}
            role="img"
            aria-label={`${template.name} template preview in ${theme} mode`}
          >
            <div className="td-preview__mockup">
              <div className="td-preview__bar">
                <span /><span /><span />
                <div className="td-preview__url">{siteConfig.domain}/demo/{template.slug}</div>
                <button
                  type="button"
                  className="td-mockup-theme-toggle"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleTheme(); }}
                  title={`Toggle theme (${theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'})`}
                  aria-label="Toggle theme in preview"
                >
                  {theme === 'dark' ? '☀️' : '🌙'}
                </button>
              </div>
              <div className="td-preview__body" style={template.thumbnail ? { padding: 0, overflow: 'hidden' } : {}}>
                {template.thumbnail ? (
                  <img src={template.thumbnail} alt={template.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <>
                    <div className="td-preview__hero" />
                    <div className="td-preview__content">
                      <div className="td-preview__line td-preview__line--wide" />
                      <div className="td-preview__line td-preview__line--med" />
                      <div className="td-preview__cards">
                        <span /><span /><span />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <Link to={template.demoPath} className="td-preview__overlay" aria-label={`Open ${template.name} live demo`}>
              <div className="td-preview__play">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                Open Live Demo
              </div>
            </Link>
          </div>

          {/* Template Name & Meta */}
          <div className="td-meta">
            <div className="td-meta__tags">
              <span className="badge badge-gold">{template.industryLabel}</span>
              <span className="badge" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>{template.type}</span>
              <span className="badge" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>{template.style}</span>
            </div>
            <h1 className="td-name">{template.name}</h1>
            <p className="td-tagline">{template.tagline}</p>
          </div>

          {/* Ideal For */}
          <div className="td-section">
            <h2 className="td-section__title">Ideal For</h2>
            <p className="td-section__body">{template.idealFor}</p>
          </div>

          {/* Pages */}
          <div className="td-section">
            <h2 className="td-section__title">Pages Included ({template.pageCount})</h2>
            <div className="td-pages">
              {template.pages.map(pg => (
                <span key={pg} className="td-page-tag">{pg}</span>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="td-section">
            <h2 className="td-section__title">Features & Interactive Elements</h2>
            <ul className="td-features">
              <li>
                <span className="td-feature-icon">✓</span>
                <strong>☀️ Light Mode & 🌙 Dark Mode</strong> (Iconic Switcher Built-in)
              </li>
              {template.features.map(f => (
                <li key={f}>
                  <span className="td-feature-icon">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Specs row */}
          <div className="td-specs-row">
            <div className="td-spec"><span>Pages</span><strong>{template.pageCount}</strong></div>
            <div className="td-spec"><span>Theme Support</span><strong>☀️ Light & 🌙 Dark</strong></div>
            <div className="td-spec"><span>Responsive</span><strong>Yes (Mobile First)</strong></div>
            <div className="td-spec"><span>Technology</span><strong>HTML / CSS / JS</strong></div>
            <div className="td-spec"><span>Industry</span><strong>{template.industryLabel}</strong></div>
            <div className="td-spec"><span>Type</span><strong>{template.type}</strong></div>
          </div>

          {/* Live Demo CTA */}
          <div className="td-demo-cta">
            <Link to={template.demoPath} className="btn btn-outline btn-lg" style={{ flex: 1, justifyContent: 'center' }}>
              ▶ Open Full Live Demo
            </Link>
          </div>

        </div>

        {/* ── Right: Sticky action sidebar ──────────────────────────────── */}
        <aside className="td-sidebar">
          <div className="td-sidebar__card">
            <div className="td-sidebar__price-label">Starting Price</div>
            <div className="td-sidebar__price">{template.startingPrice}</div>
            <div className="td-sidebar__package">
              <span className="badge badge-gold">{pkg.name} Package</span>
            </div>
            <p className="td-sidebar__pkg-desc">{pkg.description}</p>

            <div className="td-sidebar__actions">
              <a href={waUrl} className="btn btn-whatsapp" target="_blank" rel="noreferrer" style={{ width: '100%', justifyContent: 'center' }}>
                💬 Get This Template
              </a>
              <Link to={template.demoPath} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                ▶ Live Demo
              </Link>
              <a href={`mailto:${siteConfig.email}?subject=Enquiry: ${template.name} Template`} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
                ✉ Email Enquiry
              </a>
            </div>

            <div className="td-sidebar__includes">
              <div className="td-sidebar__inc-title">Package Includes</div>
              {pkg.features.map(f => (
                <div key={f} className="td-sidebar__inc-item">
                  <span style={{ color: 'var(--brand-gold)' }}>✓</span> {f}
                </div>
              ))}
            </div>

            <Link to="/pricing" className="td-sidebar__pricing-link">
              Compare all pricing packages →
            </Link>
          </div>

          {/* Other templates */}
          <div className="td-sidebar__other">
            <div className="td-sidebar__other-title">Other Real Estate Templates</div>
            {templates.filter(t => t.slug !== slug && t.industry === template.industry).map(t => (
              <Link key={t.slug} to={`/templates/${t.slug}`} className="td-mini-card">
                <div className="td-mini-card__dot" style={{ background: t.color }} />
                <div>
                  <div className="td-mini-card__name">{t.name}</div>
                  <div className="td-mini-card__type">{t.type}</div>
                </div>
                <span className="td-mini-card__price">{t.startingPrice}</span>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
