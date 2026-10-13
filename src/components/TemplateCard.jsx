import { Link } from 'react-router-dom';
import './TemplateCard.css';

// Colour map for industry accent
const INDUSTRY_COLORS = {
  'real-estate': '#C8860A',
  healthcare: '#0EA5E9',
  education: '#7C3AED',
  business: '#059669',
  hospitality: '#EF4444',
  industrial: '#64748B',
  professional: '#D97706',
  retail: '#EC4899',
  other: '#0284C7',
  technology: '#0284C7',
};

export default function TemplateCard({ template, index, cardNumber }) {
  const accentColor = INDUSTRY_COLORS[template.industry] || '#C8860A';

  // Generate card number dynamically starting at #01
  const displayNum = cardNumber != null
    ? (typeof cardNumber === 'number' ? String(cardNumber).padStart(2, '0') : String(cardNumber))
    : index != null
      ? String(index + 1).padStart(2, '0')
      : (template.templateNumber ? String(template.templateNumber).padStart(2, '0') : '01');

  return (
    <article
      className="tcard"
      style={{ '--accent': accentColor }}
      aria-label={`${template.name} – ${template.tagline}`}
    >
      {/* Preview area */}
      <Link to={template.demoPath} className="tcard__preview" aria-label={`Open ${template.name} live demo`}>
        {template.thumbnail ? (
          <div className="tcard__thumbnail-wrapper">
            <img src={template.thumbnail} alt={template.name} className="tcard__thumbnail-img" loading="lazy" />
            <div className="tcard__thumbnail-badge">Plotted Development</div>
          </div>
        ) : (
          <div className="tcard__preview-bg">
            <div className="tcard__preview-mockup">
              <div className="tcard__mockup-bar">
                <span /><span /><span />
              </div>
              <div className="tcard__mockup-content">
                <div className="tcard__mockup-hero" />
                <div className="tcard__mockup-lines">
                  <span /><span /><span />
                </div>
                <div className="tcard__mockup-grid">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="tcard__preview-overlay">
          <span className="tcard__preview-cta">Open Live Demo →</span>
        </div>
        <div className="tcard__num">#{displayNum}</div>
      </Link>

      {/* Card body */}
      <div className="tcard__body">
        <div className="tcard__meta">
          <span className="tcard__industry">{template.industryLabel}</span>
          <span className="tcard__type">{template.type}</span>
          <span className="tcard__theme-badge" title="Iconic Light & Dark mode support built-in">☀️ / 🌙</span>
        </div>

        <h3 className="tcard__name">{template.name}</h3>
        <p className="tcard__tagline">{template.tagline}</p>

        <div className="tcard__specs">
          <span>{template.pageCount} Pages</span>
          <span>·</span>
          <span title="Iconic Light & Dark mode support built-in">☀️/🌙 Dual Theme</span>
          <span>·</span>
          <span>Responsive</span>
        </div>

        <div className="tcard__price">
          Starting <strong>{template.startingPrice}</strong>
        </div>

        <div className="tcard__actions">
          <Link to={template.demoPath} className="btn btn-outline btn-sm" aria-label={`Live demo for ${template.name}`}>
            ▶ Live Demo
          </Link>
          <Link to={`/templates/${template.slug}`} className="btn btn-primary btn-sm" aria-label={`Get ${template.name} template`}>
            Get This Template
          </Link>
        </div>
      </div>
    </article>
  );
}
