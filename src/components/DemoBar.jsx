import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import siteConfig from '../data/site.config.js';

export default function DemoBar({
  templateSlug,
  templateName,
  label,
  previewMode = 'web',
  onPreviewModeChange,
  backUrl,
}) {
  const { theme, toggleTheme } = useTheme();
  const [internalMode, setInternalMode] = useState(() => {
    try {
      if (typeof document !== 'undefined') {
        const attr = document.documentElement.getAttribute('data-preview-mode');
        if (attr === 'web' || attr === 'tab' || attr === 'mobile') return attr;
      }
      const saved = localStorage.getItem('demo-preview-mode');
      if (saved === 'web' || saved === 'tab' || saved === 'mobile') return saved;
    } catch {}
    return 'web';
  });

  const currentMode = onPreviewModeChange ? (previewMode || internalMode) : internalMode;

  const handleModeChange = (mode) => {
    setInternalMode(mode);
    if (onPreviewModeChange) {
      onPreviewModeChange(mode);
    }
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-preview-mode', mode);
      try {
        localStorage.setItem('demo-preview-mode', mode);
      } catch {}
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-preview-mode', currentMode);
    }
    return () => {
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/demo')) {
        document.documentElement.removeAttribute('data-preview-mode');
      }
    };
  }, [currentMode]);

  return (
    <header className="demo-bar" role="banner" aria-label="Template Preview Toolbar">
      {/* ── Prominent Highlighted Back to Template Button (Top-Left) ── */}
      <Link
        to={backUrl || `/templates/${templateSlug || ''}`}
        className="demo-bar__back"
        title="Back to Template Selection"
        aria-label="Back to Template Selection"
      >
        <svg
          className="demo-bar__back-icon"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        <span className="demo-bar__back-text">Back to Template</span>
      </Link>

      {/* ── Center: Template Label ── */}
      <div className="demo-bar__label">
        {label || `${templateName} — Live Demo (Demo Data Only)`}
      </div>

      {/* ── Right: Preview Section (Web, Tab, Mobile) beside Dark Mode Toggle ── */}
      <div className="demo-bar__actions">
        <div
          className="demo-preview-toolbar"
          role="group"
          aria-label="Device Preview Modes"
        >
          <button
            type="button"
            id="demo-btn-web"
            className={`demo-preview-btn ${currentMode === 'web' || currentMode === 'desktop' ? 'active' : ''}`}
            onClick={() => handleModeChange('web')}
            aria-pressed={currentMode === 'web' || currentMode === 'desktop'}
            title="Desktop / Web View"
            aria-label="Web View"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <span className="demo-preview-btn__label">Web</span>
          </button>

          <button
            type="button"
            id="demo-btn-tab"
            className={`demo-preview-btn ${currentMode === 'tab' || currentMode === 'tablet' ? 'active' : ''}`}
            onClick={() => handleModeChange('tab')}
            aria-pressed={currentMode === 'tab' || currentMode === 'tablet'}
            title="Tablet View"
            aria-label="Tab View"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
            <span className="demo-preview-btn__label">Tab</span>
          </button>

          <button
            type="button"
            id="demo-btn-mobile"
            className={`demo-preview-btn ${currentMode === 'mobile' ? 'active' : ''}`}
            onClick={() => handleModeChange('mobile')}
            aria-pressed={currentMode === 'mobile'}
            title="Mobile View"
            aria-label="Mobile View"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
            <span className="demo-preview-btn__label">Mobile</span>
          </button>
        </div>

        {/* ── Dark Mode Toggle ── */}
        <button
          type="button"
          className="demo-theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch template to light mode' : 'Switch template to dark mode'}
          title={theme === 'dark' ? 'Switch template to light mode' : 'Switch template to dark mode'}
        >
          {theme === 'dark' ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {/* ── Get This Template CTA ── */}
        <a
          href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi DeccanIDentity! I'm interested in the ${templateName} template.`)}`}
          className="btn btn-primary btn-sm demo-bar__cta"
          target="_blank"
          rel="noreferrer"
        >
          Get This Template
        </a>
      </div>
    </header>
  );
}
