import { useParams, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import industries from '../data/industries.js';
import templates from '../data/templates.js';
import TemplateCard from '../components/TemplateCard.jsx';
import './IndustryPage.css';

export default function IndustryPage() {
  const { industry } = useParams();
  const navigate = useNavigate();
  const ind = industries.find(i => i.id === industry || (industry === 'technology' && i.id === 'other'));
  const [activeType, setActiveType] = useState('All');

  const industryTemplates = useMemo(
    () => {
      const list = templates.filter(t => t.industry === industry || (industry === 'technology' && t.industry === 'other'));
      return [...list].sort((a, b) => parseInt(a.templateNumber || '99', 10) - parseInt(b.templateNumber || '99', 10));
    },
    [industry]
  );

  const filtered = useMemo(() => {
    if (activeType === 'All') return industryTemplates;
    return industryTemplates.filter(t => t.type === activeType);
  }, [industryTemplates, activeType]);

  if (!ind) {
    return (
      <div className="page-content" style={{ textAlign: 'center', paddingTop: '15vh' }}>
        <h1>Industry not found</h1>
        <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  const isComingSoon = ind.status === 'coming-soon';

  return (
    <main className="page-content">
      {/* ── Industry Hero ──────────────────────────────────────────────── */}
      <section
        className="ind-hero"
        style={{ '--ind-color': ind.color, '--ind-gradient': ind.gradient }}
        aria-labelledby="ind-title"
      >
        <div className="ind-hero__bg" aria-hidden="true">
          <div className="ind-hero__glow" />
        </div>
        <div className="container ind-hero__inner">
          <button className="ind-hero__back btn btn-ghost btn-sm" onClick={() => navigate('/')}>
            ← Back
          </button>
          <div className="ind-hero__emoji" aria-hidden="true">{ind.emoji}</div>
          <h1 id="ind-title" className="ind-hero__title">{ind.name} Website Templates</h1>
          <p className="ind-hero__sub">{ind.subtitle}</p>
          {isComingSoon && (
            <div className="ind-hero__soon">
              <span>🔔</span>
              <span>Templates for this industry are coming soon. Notify us and we'll let you know when they're ready.</span>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/contact')}>
                Notify Me
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Sub-Type Chips ─────────────────────────────────────────────── */}
      {!isComingSoon && (
        <div className="ind-chips-bar">
          <div className="container">
            <div className="ind-chips">
              {ind.subTypes.map(st => (
                <button
                  key={st}
                  className={`chip ${activeType === st ? 'active' : ''}`}
                  onClick={() => setActiveType(st)}
                  aria-pressed={activeType === st}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Template Grid or Coming Soon ───────────────────────────────── */}
      <section className="section" aria-labelledby="templates-title">
        <div className="container">
          {isComingSoon ? (
            <div className="ind-coming-soon">
              <div className="ind-coming-soon__emoji">🔜</div>
              <h2 id="templates-title">Coming Soon</h2>
              <p>We're building specialized {ind.name} templates with industry-specific features, design patterns, and live demos.</p>
              <p style={{ marginTop: 8, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                In the meantime, explore our <button className="ind-coming-soon__link" onClick={() => navigate('/industries/real-estate')}>Real Estate templates</button> to see the quality and detail we put into every template.
              </p>
              <div className="ind-coming-soon__actions">
                <button className="btn btn-primary" onClick={() => navigate('/contact')}>
                  💬 Request This Industry
                </button>
                <button className="btn btn-outline" onClick={() => navigate('/industries/real-estate')}>
                  View Real Estate Templates
                </button>
              </div>
            </div>
          ) : filtered.length > 0 ? (
            <>
              <h2 id="templates-title" className="ind-results-label">
                {activeType === 'All' ? `${industryTemplates.length} Templates` : `${filtered.length} ${activeType} Templates`}
              </h2>
              <div className="templates-grid-4">
                {filtered.map((t, idx) => (
                  <TemplateCard key={t.slug} template={t} index={idx} />
                ))}
              </div>
            </>
          ) : (
            <div className="ind-empty">
              <p>No templates found for "{activeType}". <button className="ind-coming-soon__link" onClick={() => setActiveType('All')}>Show all</button></p>
            </div>
          )}
        </div>
      </section>

      {/* ── Other Industries ───────────────────────────────────────────── */}
      <section className="section" aria-labelledby="other-ind-title" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-label">Explore More</div>
          <h2 id="other-ind-title" className="section-title" style={{ fontSize: '1.5rem' }}>Other Industries</h2>
          <div className="ind-others">
            {industries.filter(i => i.id !== industry).map(i => (
              <button
                key={i.id}
                className="ind-other-chip"
                onClick={() => { navigate(`/industries/${i.id}`); setActiveType('All'); }}
              >
                {i.emoji} {i.name}
                {i.status === 'coming-soon' && <span className="footer__soon">Soon</span>}
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
