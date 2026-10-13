import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import templates from '../data/templates.js';
import industries from '../data/industries.js';
import packages from '../data/packages.js';
import TemplateCard from '../components/TemplateCard.jsx';
import './TemplatesPage.css';

const SEARCH_EXAMPLES = ['hospital', 'villa', 'school', 'restaurant', 'IT company', 'college', 'plots', 'apartment'];

const STYLES = ['All Styles', 'Luxury', 'Modern', 'Corporate', 'Conversion', 'Platform'];

export default function TemplatesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [filterIndustry, setFilterIndustry] = useState(searchParams.get('industry') || 'all');
  const [filterType, setFilterType] = useState(searchParams.get('type') || 'all');
  const [filterStyle, setFilterStyle] = useState('All Styles');
  const [filterPackage, setFilterPackage] = useState('all');
  const [exampleIdx, setExampleIdx] = useState(0);

  // Rotate search placeholder examples
  useEffect(() => {
    const t = setInterval(() => setExampleIdx(i => (i + 1) % SEARCH_EXAMPLES.length), 2500);
    return () => clearInterval(t);
  }, []);

  // Sync URL
  useEffect(() => {
    const params = {};
    if (query) params.q = query;
    if (filterIndustry !== 'all') params.industry = filterIndustry;
    if (filterType !== 'all') params.type = filterType;
    setSearchParams(params, { replace: true });
  }, [query, filterIndustry, filterType, setSearchParams]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return templates.filter(t => {
      const matchQuery = !q || [t.name, t.tagline, t.type, t.industry, t.idealFor, ...(t.tags || [])].some(s => s.toLowerCase().includes(q));
      const matchInd = filterIndustry === 'all' || t.industry === filterIndustry;
      const matchType = filterType === 'all' || t.type === filterType;
      const matchStyle = filterStyle === 'All Styles' || t.style === filterStyle;
      const matchPkg = filterPackage === 'all' || t.packageId === filterPackage;
      return matchQuery && matchInd && matchType && matchStyle && matchPkg;
    });
  }, [query, filterIndustry, filterType, filterStyle, filterPackage]);

  const allTypes = useMemo(() => {
    const types = [...new Set(templates.map(t => t.type))];
    return types;
  }, []);

  function clearFilters() {
    setQuery('');
    setFilterIndustry('all');
    setFilterType('all');
    setFilterStyle('All Styles');
    setFilterPackage('all');
  }

  const hasFilters = query || filterIndustry !== 'all' || filterType !== 'all' || filterStyle !== 'All Styles' || filterPackage !== 'all';

  return (
    <main className="page-content">
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <section className="tmpl-header" aria-labelledby="tmpl-title">
        <div className="container">
          <div className="section-label">Template Catalogue</div>
          <h1 id="tmpl-title" className="section-title">All Templates</h1>
          <p className="section-sub">Browse, filter, search, and open live demos — all from one place.</p>

          {/* Search */}
          <div className="tmpl-search-wrap">
            <div className="tmpl-search">
              <svg className="tmpl-search__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input
                id="template-search"
                type="search"
                className="tmpl-search__input"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={`Try "${SEARCH_EXAMPLES[exampleIdx]}"`}
                aria-label="Search templates"
              />
              {query && (
                <button className="tmpl-search__clear" onClick={() => setQuery('')} aria-label="Clear search">×</button>
              )}
            </div>
            <div className="tmpl-search__examples" aria-label="Search suggestions">
              <span>Try:</span>
              {SEARCH_EXAMPLES.slice(0, 6).map(ex => (
                <button key={ex} className="chip chip-sm" onClick={() => setQuery(ex)}>"{ex}"</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container tmpl-layout">
        {/* ── Sidebar Filters ──────────────────────────────────────────── */}
        <aside className="tmpl-sidebar" aria-label="Filters">
          <div className="tmpl-sidebar__header">
            <h2>Filters</h2>
            {hasFilters && (
              <button className="tmpl-clear-btn" onClick={clearFilters}>Clear all</button>
            )}
          </div>

          {/* Industry */}
          <div className="filter-group">
            <label className="filter-group__label" htmlFor="filter-industry">Industry</label>
            <select id="filter-industry" className="input" value={filterIndustry} onChange={e => setFilterIndustry(e.target.value)}>
              <option value="all">All Industries</option>
              {industries.map(i => (
                <option key={i.id} value={i.id}>{i.emoji} {i.name}</option>
              ))}
            </select>
          </div>

          {/* Property / Business Type */}
          <div className="filter-group">
            <label className="filter-group__label" htmlFor="filter-type">Type</label>
            <select id="filter-type" className="input" value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              {allTypes.map(tp => (
                <option key={tp} value={tp}>{tp}</option>
              ))}
            </select>
          </div>

          {/* Design Style */}
          <div className="filter-group">
            <label className="filter-group__label">Design Style</label>
            <div className="filter-chips">
              {STYLES.map(s => (
                <button
                  key={s}
                  className={`chip chip-sm ${filterStyle === s ? 'active' : ''}`}
                  onClick={() => setFilterStyle(s)}
                  aria-pressed={filterStyle === s}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="filter-group">
            <label className="filter-group__label">Price</label>
            <div className="filter-price-list" role="radiogroup" aria-label="Price filter">
              <label className="filter-radio">
                <input type="radio" name="price" checked={filterPackage === 'all'} onChange={() => setFilterPackage('all')} />
                <span>All</span>
              </label>
              {packages.map(pkg => (
                <label key={pkg.id} className="filter-radio">
                  <input type="radio" name="price" checked={filterPackage === pkg.id} onChange={() => setFilterPackage(pkg.id)} />
                  <span>{pkg.priceLabel} — {pkg.name}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Results ──────────────────────────────────────────────────── */}
        <div className="tmpl-results">
          <div className="tmpl-results__bar">
            <p className="tmpl-results__count">
              {filtered.length === 0 ? 'No templates found' : `${filtered.length} template${filtered.length === 1 ? '' : 's'}`}
              {hasFilters && ' matching your filters'}
            </p>
          </div>

          {filtered.length > 0 ? (
            <div className="templates-grid-results">
              {filtered.map((t, idx) => (
                <TemplateCard key={t.slug} template={t} index={idx} />
              ))}
            </div>
          ) : (
            <div className="tmpl-empty">
              <div className="tmpl-empty__icon">🔍</div>
              <h3>No templates found</h3>
              <p>Try different search terms or <button className="ind-coming-soon__link" onClick={clearFilters}>clear all filters</button>.</p>
              <p style={{ marginTop: 8, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                More templates from Healthcare, Education, and other sectors are coming soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
