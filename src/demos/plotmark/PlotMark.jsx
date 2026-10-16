import { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import siteConfig from '../../data/site.config.js';
import DemoBar from '../../components/DemoBar.jsx';
import {
  DEFAULT_PLOTS,
  STATUS_COLORS,
  STATUS_LABELS,
  PLOT_PROJECTS,
  PROJECT_LAYOUT_CONFIG,
  generateProjectPlots,
} from './plotmarkData.js';
import './PlotMark.css';

// ─── Plot Details Modal ────────────────────────────────────────────────────────
function PlotModal({ plot, onClose, onEnquire, onBookVisit, onStatusChange }) {
  if (!plot) return null;
  const isAvailable = plot.status === 'available';

  return (
    <div className="plot-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="plot-modal-title">
      <div className="plot-modal" onClick={e => e.stopPropagation()}>
        <button className="plot-modal__close" onClick={onClose} aria-label="Close">×</button>
        
        <div className="plot-modal__header">
          <div>
            <h3 id="plot-modal-title">Plot {plot.label}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PlotMark County · Phase 1</span>
          </div>
          <span
            className="plot-modal__status"
            style={{
              background: `${STATUS_COLORS[plot.status]}22`,
              color: STATUS_COLORS[plot.status],
              border: `1px solid ${STATUS_COLORS[plot.status]}55`,
            }}
          >
            {STATUS_LABELS[plot.status]}
          </span>
        </div>

        <div className="plot-modal__details">
          <div className="plot-modal__detail">
            <span>Plot Area</span>
            <strong>{plot.area} Sq.Yds</strong>
          </div>
          <div className="plot-modal__detail">
            <span>Dimensions</span>
            <strong>{plot.dimensions || "30' x 45'"}</strong>
          </div>
          <div className="plot-modal__detail">
            <span>Facing</span>
            <strong>{plot.facing} Facing</strong>
          </div>
          <div className="plot-modal__detail">
            <span>Road Width</span>
            <strong>{plot.road}</strong>
          </div>
          <div className="plot-modal__detail">
            <span>Total Price</span>
            <strong>₹{plot.price} Lakhs*</strong>
          </div>
          <div className="plot-modal__detail">
            <span>Corner Plot</span>
            <strong>{plot.corner ? '⭐ Yes (Prime)' : 'No'}</strong>
          </div>
        </div>

        <p className="plot-modal__note">
          * Price indicative. Clear title with immediate spot registration and bank loan approval.
        </p>

        {/* Booking & Enquiry Controls */}
        <div className="plot-modal__actions" style={{ flexDirection: 'column', gap: '8px' }}>
          {isAvailable ? (
            <>
              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => onEnquire(plot)}
              >
                💬 Enquire About Plot {plot.label}
              </button>
              <button
                className="btn btn-outline"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => onBookVisit(plot)}
              >
                📅 Schedule Site Visit for Plot {plot.label}
              </button>
            </>
          ) : (
            <div style={{
              background: 'rgba(220, 38, 38, 0.1)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '10px',
              textAlign: 'center',
              fontSize: '0.8125rem',
              color: '#ef4444'
            }}>
              ⚠️ <strong>Plot {plot.label} is currently {STATUS_LABELS[plot.status]}.</strong>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 4 }}>
                Online booking is disabled for this plot. Please explore other available plots.
              </div>
            </div>
          )}

          {/* Quick demonstrator status toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Demo Status:</span>
            <select
              value={plot.status}
              onChange={(e) => onStatusChange(plot.id, e.target.value)}
              className="pm-filter-select"
              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
            >
              <option value="available">Available (🟢)</option>
              <option value="booked">Booked (🟡)</option>
              <option value="sold">Sold (🔴)</option>
              <option value="blocked">Blocked / Held (🟣)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Brochure Download Function (Direct & Unrestricted) ───────────────────────
function downloadProjectBrochure(project) {
  const proj = project || PLOT_PROJECTS[0];
  const projName = proj?.name || 'PlotMark-County';
  const blobContent = `========================================================================
${projName.toUpperCase()} — OFFICIAL PROJECT BROCHURE & MASTERPLAN
========================================================================
Developer: PlotMark Developers Pvt. Ltd. (DeccanIDentity Real Estate)
Corridor: ${proj?.location || 'Hyderabad Growth Corridor'}
Government Approval: ${proj?.approvalDetails || 'HMDA & RERA Approved'}
Project Stage: ${proj?.stageLabel || 'Approved Residential Township'}
Plot Size Range: ${proj?.plotSizeRange || '150 – 500 Sq.Yds'}
Starting Price: ${proj?.startingPrice || '₹35.25 Lakhs'} (Rate: ${proj?.ratePerYd || '₹23,500/Sq.Yd'})
Live Availability: ${proj?.availablePlots || 'Available'} Plots Ready for Registration

------------------------------------------------------------------------
1. PROJECT HIGHLIGHTS & TOWNSHIP SPECIFICATIONS
------------------------------------------------------------------------
${(proj?.highlights || [
  '100% Vaastu Compliant Layout',
  '40 Ft & 30 Ft BT Roads with Footpaths',
  'Underground Drainage (UGD) & Electricity Lines',
  'Landscaped Central Park & Children Play Zone',
  'Pre-Approved Bank Loans (SBI, HDFC, ICICI, Axis Bank)',
]).map(h => `• ${h}`).join('\n')}

------------------------------------------------------------------------
2. ROADS & INFRASTRUCTURE
------------------------------------------------------------------------
Road Network: ${proj?.roads || '40 Ft Main Road & 30 Ft Internal BT Roads'}
Utilities: ${proj?.utilities || 'Underground Drainage, Overhead Water Tank, Power Cabling, LED Streetlights'}

Completed Facilities:
${(proj?.completedFacilities || [
  'Grand Entrance Arch with 24x7 Security Cabin & Boom Barrier',
  '40 Ft & 30 Ft BT Roads with Kerb Stones & Stormwater Drains',
  'Solar-Fenced Outer Compound Wall with Guard Posts',
  'Underground Drainage & Water Pipeline Network',
]).map(f => `  [✓] ${f}`).join('\n')}

------------------------------------------------------------------------
3. STRATEGIC LOCATION CONNECTIVITY
------------------------------------------------------------------------
${(proj?.locationAdvantages || [
  { landmark: 'Outer Ring Road (ORR) Junction', dist: '5 mins' },
  { landmark: 'RGIA International Airport', dist: '20 mins' },
  { landmark: 'Financial District & IT SEZ', dist: '25 mins' },
]).map(loc => `• ${loc.landmark}: ${loc.dist}`).join('\n')}

------------------------------------------------------------------------
4. VERIFIED LEGAL TITLES & SPOT REGISTRATION
------------------------------------------------------------------------
• 100% Clear Title Free of All Encumbrances
• Immediate Spot Sub-Registrar Registration Available
• Pre-Approved Bank Loan Facility (Up to 75% Funding Available)

Direct Sales Advisory:
Phone: ${siteConfig.phone}
WhatsApp: ${siteConfig.whatsapp}
Website: https://deccanidentity.com/demo/plotmark
========================================================================`;

  const blob = new Blob([blobContent], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${projName.replace(/\s+/g, '-')}-Official-Brochure.txt`;
  link.click();
}

// ─── Single Project Brochure Modal (Instant View & Direct Download) ────────────
function BrochureModal({ project, onClose }) {
  const [downloaded, setDownloaded] = useState(false);
  const proj = project || PLOT_PROJECTS[0];

  function handleDirectDownload() {
    downloadProjectBrochure(proj);
    setDownloaded(true);
  }

  return (
    <div className="plot-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="brochure-title">
      <div className="plot-modal pm-brochure-modal" onClick={e => e.stopPropagation()}>
        <button className="plot-modal__close" onClick={onClose} aria-label="Close">×</button>

        <div className="pm-bmodal-header">
          <div className="badge badge-gold" style={{ marginBottom: 4 }}>Official Project Document</div>
          <h2 id="brochure-title" style={{ fontSize: '1.4rem', margin: '4px 0 6px' }}>{proj.name}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
            📍 {proj.location} · <strong style={{ color: 'var(--brand-gold)' }}>{proj.approvalDetails}</strong>
          </p>
        </div>

        {downloaded && (
          <div className="pm-bmodal-alert success">
            <span>✅ Official brochure file downloaded directly to your device!</span>
          </div>
        )}

        {/* Brochure Preview Card */}
        <div className="pm-bmodal-body">
          <div className="pm-bmodal-preview-grid">
            <div className="pm-bmodal-cover-wrap">
              <img src={proj.coverImage} alt={proj.name} className="pm-bmodal-cover-img" />
              <div className="pm-bmodal-badge">{proj.stageLabel}</div>
            </div>
            <div className="pm-bmodal-specs">
              <div className="pm-bmodal-spec-row">
                <span>Plot Area:</span>
                <strong>{proj.plotSizeRange}</strong>
              </div>
              <div className="pm-bmodal-spec-row">
                <span>Base Rate:</span>
                <strong>{proj.ratePerYd || '₹23,500/Yd'}</strong>
              </div>
              <div className="pm-bmodal-spec-row">
                <span>Starting Cost:</span>
                <strong style={{ color: 'var(--brand-gold)' }}>{proj.startingPrice}</strong>
              </div>
              <div className="pm-bmodal-spec-row">
                <span>Registration:</span>
                <strong style={{ color: '#16a34a' }}>Spot Sub-Registrar</strong>
              </div>
              <div className="pm-bmodal-spec-row">
                <span>Bank Loan:</span>
                <strong>Up to 75% Pre-Approved</strong>
              </div>
            </div>
          </div>

          <div className="pm-bmodal-highlights">
            <h4 style={{ fontSize: '0.875rem', marginBottom: 8, color: 'var(--text-primary)' }}>Key Township Features:</h4>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {(proj.highlights || []).slice(0, 4).map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons: Direct Download & WhatsApp */}
        <div className="pm-bmodal-actions">
          <button
            className="btn btn-primary btn-lg"
            onClick={handleDirectDownload}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            📥 Download Official Brochure (Instant)
          </button>
          <a
            href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
              `Hi! Please send me the official PDF brochure and price list for ${proj.name} (${proj.location}).`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp btn-lg"
            style={{ justifyContent: 'center' }}
          >
            💬 Get on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Multi-Project Brochures List Modal (All Available Brochures) ─────────────
function BrochuresListModal({ onClose, onViewBrochure }) {
  const [filterStage, setFilterStage] = useState('all');
  const [search, setSearch] = useState('');
  const [downloadSuccessId, setDownloadSuccessId] = useState(null);

  const filteredBrochures = useMemo(() => {
    return PLOT_PROJECTS.filter(proj => {
      if (filterStage !== 'all' && proj.stage !== filterStage) return false;
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        return proj.name.toLowerCase().includes(q) || proj.location.toLowerCase().includes(q);
      }
      return true;
    });
  }, [filterStage, search]);

  function handleDownloadBrochure(proj) {
    downloadProjectBrochure(proj);
    setDownloadSuccessId(proj.id);
    setTimeout(() => setDownloadSuccessId(null), 4000);
  }

  return (
    <div className="plot-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="brochures-list-title">
      <div className="plot-modal pm-brochures-list-modal" onClick={e => e.stopPropagation()}>
        <button className="plot-modal__close" onClick={onClose} aria-label="Close">×</button>

        <div className="pm-blist-header">
          <div className="badge badge-gold" style={{ marginBottom: 4 }}>Unrestricted Direct Access</div>
          <h2 id="brochures-list-title" style={{ fontSize: '1.5rem', margin: '4px 0 6px' }}>
            Official Project Brochures & Masterplans
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
            Download verified layout blueprints, approval documents, and pricing sheets directly — no contact details or signup required.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="pm-blist-toolbar">
          <div
            className="pm-stage-tabs"
            role="tablist"
            style={{ margin: 0 }}
            onWheel={(e) => {
              if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && e.currentTarget.scrollWidth > e.currentTarget.clientWidth) {
                e.currentTarget.scrollLeft += e.deltaY;
              }
            }}
          >
            {[
              ['all', 'All Brochures (6)'],
              ['ongoing', 'Ongoing (2)'],
              ['completed', 'Completed (2)'],
              ['upcoming', 'Upcoming (2)'],
            ].map(([val, label]) => (
              <button
                key={val}
                className={`pm-stage-tab ${filterStage === val ? 'active' : ''}`}
                onClick={(e) => {
                  setFilterStage(val);
                  e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                }}
                role="tab"
                aria-selected={filterStage === val}
              >
                {label}
              </button>
            ))}
          </div>

          <input
            className="pm-plot-search-input"
            placeholder="🔍 Search project name or corridor..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 260 }}
            aria-label="Search brochures"
          />
        </div>

        {downloadSuccessId && (
          <div className="pm-bmodal-alert success" style={{ margin: '12px 0 0' }}>
            <span>✅ Official brochure document downloaded directly to your device!</span>
          </div>
        )}

        {/* Brochures Grid List */}
        <div className="pm-blist-grid">
          {filteredBrochures.map(proj => (
            <div key={proj.id} className="pm-blist-card">
              <div className="pm-blist-card__thumb">
                <img src={proj.coverImage} alt={proj.name} />
                <span className={`pm-nav__thumb-badge ${proj.stage}`}>{proj.stage}</span>
              </div>
              <div className="pm-blist-card__content">
                <h3 className="pm-blist-card__title">{proj.name}</h3>
                <div className="pm-blist-card__loc">📍 {proj.location}</div>
                <div className="pm-blist-card__specs">
                  <span>📐 {proj.plotSizeRange}</span>
                  <span style={{ color: 'var(--brand-gold)', fontWeight: 700 }}>💰 From {proj.startingPrice}</span>
                  <span>🛡️ {proj.approvalType}</span>
                </div>
                <div className="pm-blist-card__approval">
                  {proj.approvalDetails}
                </div>
              </div>
              <div className="pm-blist-card__actions">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    onClose();
                    onViewBrochure(proj);
                  }}
                  title="View Brochure Details"
                >
                  👁️ View
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleDownloadBrochure(proj)}
                  title="Direct Download Brochure Document"
                >
                  📥 Download
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="pm-blist-footer">
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            All documents are verified with HMDA & Telangana RERA sanction records.
          </span>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Site Visit Booking Modal / Form ──────────────────────────────────────────
function SiteVisitModal({ project, defaultPlot, onClose, onBookingSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    projectId: project ? project.id : PLOT_PROJECTS[0].id,
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    timeSlot: 'Morning (10:00 AM – 01:00 PM)',
    message: defaultPlot ? `Interested in visiting Plot #${defaultPlot.label} (${defaultPlot.area} Sq.Yds)` : '',
  });
  const [loading, setLoading] = useState(false);
  const [bookingRef, setBookingRef] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const refId = `PM-VISIT-${Math.floor(100000 + Math.random() * 900000)}`;
      setBookingRef(refId);
      setLoading(false);
      if (onBookingSuccess) {
        onBookingSuccess({
          refId,
          ...formData,
          createdAt: new Date().toLocaleTimeString(),
        });
      }
    }, 700);
  }

  const selectedProj = PLOT_PROJECTS.find(p => p.id === formData.projectId) || PLOT_PROJECTS[0];

  return (
    <div className="plot-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="visit-modal-title">
      <div className="plot-modal" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
        <button className="plot-modal__close" onClick={onClose} aria-label="Close">×</button>
        
        <h3 id="visit-modal-title" style={{ marginBottom: 4 }}>Schedule a Site Visit</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: 'var(--space-4)' }}>
          Free AC cab pickup and site walkthrough with our project advisors.
        </p>

        {bookingRef ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-3) 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🚗✅</div>
            <h4 style={{ color: '#16a34a', fontSize: '1.125rem', marginBottom: '6px' }}>Site Visit Scheduled!</h4>
            <div style={{
              background: 'rgba(200, 134, 10, 0.1)',
              border: '1px solid rgba(200, 134, 10, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '10px',
              margin: '12px 0',
              fontSize: '0.8125rem'
            }}>
              <div>Booking Reference: <strong style={{ color: 'var(--brand-gold)' }}>{bookingRef}</strong></div>
              <div style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
                Project: <strong>{selectedProj.name}</strong> · Date: <strong>{formData.date}</strong>
              </div>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
              Our relationship manager will contact you at <strong>{formData.phone}</strong> to coordinate pick-up.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn btn-whatsapp"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => {
                  window.open(
                    `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Hi! I have scheduled a site visit for ${selectedProj.name} on ${formData.date} (${formData.timeSlot}). Booking Ref: ${bookingRef}. Please confirm.`
                    )}`,
                    '_blank'
                  );
                }}
              >
                💬 WhatsApp Details
              </button>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                SELECT OPEN PLOT PROJECT *
              </label>
              <select
                className="pm-filter-select"
                style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
                value={formData.projectId}
                onChange={e => setFormData({ ...formData, projectId: e.target.value })}
              >
                {PLOT_PROJECTS.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.location} ({p.startingPrice})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                YOUR NAME *
              </label>
              <input
                className="input"
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                PHONE NUMBER *
              </label>
              <input
                className="input"
                placeholder="10-Digit Mobile Number"
                type="tel"
                required
                pattern="[0-9]{10}"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  VISIT DATE *
                </label>
                <input
                  className="input"
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  PREFERRED TIME *
                </label>
                <select
                  className="pm-filter-select"
                  style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
                  value={formData.timeSlot}
                  onChange={e => setFormData({ ...formData, timeSlot: e.target.value })}
                >
                  <option value="Morning (10:00 AM – 01:00 PM)">10 AM – 1 PM</option>
                  <option value="Afternoon (02:00 PM – 05:00 PM)">2 PM – 5 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                SPECIAL REQUIREMENTS (OPTIONAL)
              </label>
              <input
                className="input"
                placeholder="E.g., Require cab pickup, specific plot query"
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ justifyContent: 'center', marginTop: 4 }}
            >
              {loading ? 'Confirming Site Visit...' : '🚗 Confirm Free Site Visit'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Admin / Plot Data & Lead Manager ──────────────────────────────────────────
function AdminModal({ activeProject, onSelectProject, plots, onStatusChange, siteVisits, onClose }) {
  const [tab, setTab] = useState('plots');

  return (
    <div className="plot-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="admin-title">
      <div className="pm-admin-modal" onClick={e => e.stopPropagation()}>
        <button className="plot-modal__close" onClick={onClose} aria-label="Close">×</button>
        <h3 id="admin-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>⚙️</span> PlotMark Live Data Manager
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: 'var(--space-3)' }}>
          Manage real-time plot availability, review customer site-visit leads, and verify system synchronization.
        </p>

        {/* Project Selector for Admin */}
        {onSelectProject && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-3)', background: 'var(--bg-elevated)', padding: '8px 12px', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-gold)' }}>PROJECT:</span>
            <select
              value={activeProject?.id || PLOT_PROJECTS[0].id}
              onChange={e => {
                const found = PLOT_PROJECTS.find(p => p.id === e.target.value);
                if (found) onSelectProject(found);
              }}
              className="pm-filter-select"
              style={{ padding: '4px 10px', fontSize: '0.8125rem', fontWeight: 600 }}
            >
              {PLOT_PROJECTS.map(proj => (
                <option key={proj.id} value={proj.id}>
                  {proj.name} ({proj.city})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Tab buttons */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
          <button
            className={`btn btn-sm ${tab === 'plots' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setTab('plots')}
          >
            🗺️ Live Plot Status ({plots.length})
          </button>
          <button
            className={`btn btn-sm ${tab === 'leads' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setTab('leads')}
          >
            📋 Customer Site Visits ({siteVisits.length})
          </button>
        </div>

        {tab === 'plots' ? (
          <div>
            <table className="pm-admin-table">
              <thead>
                <tr>
                  <th>Plot #</th>
                  <th>Area</th>
                  <th>Price</th>
                  <th>Facing</th>
                  <th>Current Status</th>
                  <th>Update Availability</th>
                </tr>
              </thead>
              <tbody>
                {plots.map(p => (
                  <tr key={p.id}>
                    <td><strong>#{p.label}</strong></td>
                    <td>{p.area} Sq.Yd</td>
                    <td>₹{p.price} L</td>
                    <td>{p.facing}</td>
                    <td>
                      <span style={{ color: STATUS_COLORS[p.status], fontWeight: 700 }}>
                        {STATUS_LABELS[p.status]}
                      </span>
                    </td>
                    <td>
                      <select
                        value={p.status}
                        onChange={e => onStatusChange(p.id, e.target.value)}
                        className="pm-filter-select"
                        style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                      >
                        <option value="available">Available (🟢)</option>
                        <option value="booked">Booked (🟡)</option>
                        <option value="sold">Sold (🔴)</option>
                        <option value="blocked">Held / Blocked (🟣)</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            {siteVisits.length === 0 ? (
              <div style={{ padding: 'var(--space-8) 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                No site visit requests submitted in this session yet. Submit a visit request through the website to test!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 12 }}>
                {siteVisits.map(lead => (
                  <div
                    key={lead.refId}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.8125rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <strong style={{ color: 'var(--brand-gold)' }}>Ref: {lead.refId}</strong>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{lead.createdAt}</span>
                    </div>
                    <div>Customer: <strong>{lead.name}</strong> · Phone: <strong>{lead.phone}</strong></div>
                    <div style={{ color: 'var(--text-secondary)', marginTop: 2 }}>
                      Date: <strong>{lead.date}</strong> · Slot: <strong>{lead.timeSlot}</strong>
                    </div>
                    {lead.message && (
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 4, fontStyle: 'italic' }}>
                        Note: "{lead.message}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Single Project Card Component ────────────────────────────────────────────
function ProjectCard({ project, onSelectProject, onOpenLayout, onOpenBrochure, onOpenVisit, showVisit = true }) {
  const stageBadges = {
    ongoing: { text: '🚧 Ongoing Development', class: 'ongoing' },
    completed: { text: '🏆 Completed · Delivered', class: 'completed' },
    upcoming: { text: '🚀 Upcoming · Pre-Launch', class: 'upcoming' },
  };
  const stageInfo = stageBadges[project.stage] || { text: project.statusBadge, class: '' };

  return (
    <article className="pm-project-card">
      <div className="pm-project-card__img-wrap">
        <img src={project.coverImage} alt={project.name} className="pm-project-card__img" loading="lazy" />
        <div className={`pm-project-card__stage-tag ${stageInfo.class}`}>
          {stageInfo.text}
        </div>
        <div className="pm-project-card__avail-badge">
          {project.stage === 'upcoming' ? '⚡ Priority Tokens Open' : `🟢 ${project.availablePlots} Plots Available`}
        </div>
      </div>

      <div className="pm-project-card__body">
        <h3 className="pm-project-card__title">{project.name}</h3>
        <div className="pm-project-card__loc">
          <span>📍</span>
          <span>{project.location}</span>
        </div>

        <div className="pm-project-card__specs-row">
          <div className="pm-project-card__spec-item">
            <span>Plot Sizes</span>
            <strong>{project.plotSizeRange}</strong>
          </div>
          <div className="pm-project-card__spec-item">
            <span>Starting Price</span>
            <strong style={{ color: 'var(--brand-gold)' }}>{project.startingPrice}</strong>
          </div>
          <div className="pm-project-card__spec-item">
            <span>Approval</span>
            <strong>{project.approvalType}</strong>
          </div>
          <div className="pm-project-card__spec-item">
            <span>Status</span>
            <strong style={{ color: '#16a34a' }}>{project.developmentStatus}</strong>
          </div>
        </div>

        <div className="pm-project-card__approval">
          <span>🛡️</span>
          <span>{project.approvalDetails}</span>
        </div>

        <div className="pm-project-card__actions">
          <button
            className="btn btn-primary"
            onClick={() => onSelectProject(project)}
            aria-label={`View details for ${project.name}`}
          >
            Project Details →
          </button>
          <button
            className="btn btn-outline"
            onClick={() => onOpenLayout(project)}
            aria-label={`View interactive layout for ${project.name}`}
          >
            🗺️ View Layout
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => onOpenBrochure(project)}
            aria-label={`Download brochure for ${project.name}`}
          >
            📥 Brochure
          </button>
          {showVisit && onOpenVisit && (
            <button
              className="btn btn-outline"
              onClick={() => onOpenVisit(project)}
              aria-label={`Schedule site visit for ${project.name}`}
            >
              🚗 Site Visit
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

// ─── Project Detail View ──────────────────────────────────────────────────────
function ProjectDetailPage({ project, onBack, onOpenLayout, onOpenBrochure, onOpenVisit }) {
  const [activeFaq, setActiveFaq] = useState(null);

  if (!project) return null;

  return (
    <div className="pm-pdetail container">
      {/* Breadcrumb */}
      <div className="pm-pdetail__breadcrumbs">
        <button onClick={onBack}>← Back to Projects</button>
        <span>›</span>
        <span>{project.city}</span>
        <span>›</span>
        <strong style={{ color: 'var(--text-primary)' }}>{project.name}</strong>
      </div>

      {/* Hero Banner */}
      <div className="pm-pdetail__hero" style={{ backgroundImage: `url(${project.coverImage})` }}>
        <div className="pm-pdetail__hero-overlay" />
        <div className="pm-pdetail__hero-content">
          <div className="badge badge-gold" style={{ marginBottom: 12 }}>
            🏗️ {project.developmentStatus}
          </div>
          <h1 className="pm-pdetail__title">{project.name}</h1>
          <div className="pm-pdetail__loc">📍 {project.location}</div>
          <div className="pm-pdetail__hero-meta">
            <span className="pm-pdetail__meta-badge">📐 {project.plotSizeRange}</span>
            <span className="pm-pdetail__meta-badge">💰 Starting {project.startingPrice}</span>
            <span className="pm-pdetail__meta-badge">🛡️ {project.approvalType}</span>
            <span className="pm-pdetail__meta-badge" style={{ background: 'rgba(22, 163, 74, 0.25)', borderColor: '#16a34a' }}>
              🟢 {project.availablePlots} of {project.totalPlots} Plots Available
            </span>
          </div>
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="pm-pdetail__action-bar">
        <div className="pm-pdetail__action-bar-left">
          <span className="pm-pdetail__action-bar-price">Starting {project.startingPrice}</span>
          <span className="pm-pdetail__action-bar-sub">{project.plotSizeRange} · Clear Title & Bank Loans</span>
        </div>
        <div className="pm-pdetail__action-bar-btns">
          <button className="btn btn-primary" onClick={() => onOpenVisit(project)}>
            🚗 Schedule Site Visit
          </button>
          <button className="btn btn-outline" onClick={() => onOpenBrochure(project)}>
            📥 Download Brochure
          </button>
          <button className="btn btn-ghost" onClick={() => onOpenLayout(project)}>
            🗺️ Interactive Layout Map
          </button>
          <a
            href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
              `Hi! I'm interested in ${project.name} open plots (${project.location}). Please share more details.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
          >
            💬 WhatsApp
          </a>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="pm-pdetail__grid">
        {/* Left Column */}
        <div>
          {/* Overview & Highlights */}
          <div className="pm-pdetail__card">
            <h2 className="pm-pdetail__card-title">Project Overview & Highlights</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-4)' }}>
              {project.name} is a premier gated residential plotted community situated in the high-growth corridor of {project.location}. Designed strictly according to 100% Vaastu guidelines with wide blacktop avenues, underground drainage, and round-the-clock water systems, it offers secure, high-yield land investment and ideal home-building plots.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
              {project.highlights.map(h => (
                <div key={h} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                  <span style={{ color: 'var(--brand-gold)' }}>✓</span>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Approvals Box */}
          <div className="pm-pdetail__card" style={{ borderLeft: '4px solid var(--brand-gold)' }}>
            <h2 className="pm-pdetail__card-title">🛡️ Verified Approvals & Legal Transparency</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: 'var(--bg-elevated)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--brand-gold)', fontWeight: 700, textTransform: 'uppercase' }}>
                  GOVERNMENT PERMITS & REGISTRATION
                </div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>
                  {project.approvalDetails}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8125rem' }}>
                <div style={{ padding: '8px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
                  ✅ <strong>Clear Title:</strong> 100% Legal Scrutiny Complete
                </div>
                <div style={{ padding: '8px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
                  ✅ <strong>Vaastu:</strong> 100% Vaastu Compliant Layout
                </div>
                <div style={{ padding: '8px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
                  ✅ <strong>Bank Loans:</strong> SBI, HDFC, ICICI Pre-Approved
                </div>
                <div style={{ padding: '8px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
                  ✅ <strong>Registration:</strong> Immediate Spot Registration
                </div>
              </div>
            </div>
          </div>

          {/* Infrastructure & Amenities: Distinguishing Completed vs Planned */}
          <div className="pm-pdetail__card">
            <h2 className="pm-pdetail__card-title">Infrastructure & Amenities</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
              We maintain full transparency by clearly distinguishing completed on-ground infrastructure from ongoing/planned development.
            </p>

            <div className="pm-facilities-split">
              <div className="pm-facility-col completed">
                <h4>✅ Completed Facilities</h4>
                <ul className="pm-facility-list">
                  {project.completedFacilities.map(f => (
                    <li key={f}>
                      <span style={{ color: '#16a34a' }}>●</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pm-facility-col planned">
                <h4>🚧 Under Development / Planned</h4>
                <ul className="pm-facility-list">
                  {project.plannedFacilities.map(f => (
                    <li key={f}>
                      <span style={{ color: 'var(--brand-gold)' }}>●</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Roads & Utilities */}
          <div className="pm-pdetail__card">
            <h2 className="pm-pdetail__card-title">Road Specifications & Utilities</h2>
            <div className="pm-spec-table">
              <div className="pm-spec-box">
                <strong>🛣️ Road Network</strong>
                <p>{project.roads}</p>
              </div>
              <div className="pm-spec-box">
                <strong>💧 Drainage & Water</strong>
                <p>Underground Drainage (UGD) connected with STP, overhead water reservoir with pipe to each plot.</p>
              </div>
              <div className="pm-spec-box">
                <strong>⚡ Electricity & Lighting</strong>
                <p>Dedicated transformers, underground cabling, and modular LED street lighting poles.</p>
              </div>
              <div className="pm-spec-box">
                <strong>🌳 Green Landscape</strong>
                <p>Curated avenue plantations, footpaths with pavers, and central community garden.</p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="pm-pdetail__card">
            <h2 className="pm-pdetail__card-title">Frequently Asked Questions</h2>
            <div className="pm-faq-list">
              {project.faqs.map((faq, idx) => (
                <div key={faq.q} className="pm-faq-item">
                  <button
                    className="pm-faq-question"
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    aria-expanded={activeFaq === idx}
                  >
                    <span>{faq.q}</span>
                    <span>{activeFaq === idx ? '−' : '+'}</span>
                  </button>
                  {activeFaq === idx && (
                    <div className="pm-faq-answer">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div>
          {/* Quick Site Visit Card */}
          <div className="pm-pdetail__card" style={{ borderColor: 'var(--border-gold)' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: 6 }}>
              🚗 Book a Free Site Visit
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: 'var(--space-4)' }}>
              Visit <strong>{project.name}</strong> this weekend. We provide complimentary pickup and drop services.
            </p>
            <button
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginBottom: 8 }}
              onClick={() => onOpenVisit(project)}
            >
              Book Site Visit Now
            </button>
            <button
              className="btn btn-outline"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => onOpenBrochure(project)}
            >
              📥 Get Price Sheet & Brochure
            </button>
          </div>

          {/* Location Advantages */}
          <div className="pm-pdetail__card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: 'var(--space-3)' }}>
              📍 Connectivity & Proximity
            </h3>
            <ul className="pm-location-list">
              {project.locationAdvantages.map(item => (
                <li key={item.landmark}>
                  <span className="pm-location-place">{item.landmark}</span>
                  <span className="pm-location-dist">{item.dist}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Interactive Layout CTA */}
          <div className="pm-pdetail__card" style={{ background: 'linear-gradient(135deg, rgba(200, 134, 10, 0.12) 0%, rgba(10, 8, 4, 0.9) 100%)' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: 8, color: 'var(--brand-gold)' }}>
              🗺️ Interactive Layout Map
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
              Explore individual plots, check live availability, corner options, and book your plot number online.
            </p>
            <button
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => onOpenLayout(project)}
            >
              Open Interactive Layout Map →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Homepage Component ───────────────────────────────────────────────────────
function HomePage({ setActivePage, onSelectProject, onOpenLayout, onOpenBrochure, onOpenBrochuresList, onOpenVisit, plots }) {
  const counts = useMemo(() => {
    return {
      available: plots.filter(p => p.status === 'available').length,
      total: plots.length,
    };
  }, [plots]);

  return (
    <div>
      {/* ── 1. Hero Section ─────────────────────────────────────────────────── */}
      <section className="pm-hero" aria-label="Hero Section">
        <div className="pm-hero__overlay" />
        <div className="pm-hero__content container">
          <div className="badge badge-gold pm-hero__badge">
            🏗️ Hyderabad's Leading Plotted Development Specialists
          </div>
          <h1 className="pm-hero__title">
            Find Your Perfect Open Plot
          </h1>
          <p className="pm-hero__sub">
            Discover well-planned residential plots with transparent project details and convenient site visits.
          </p>

          <div className="pm-hero__actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => setActivePage('projects')}
            >
              Explore Available Plots →
            </button>
            <button
              className="btn btn-outline btn-lg"
              onClick={() => onOpenBrochuresList ? onOpenBrochuresList() : onOpenBrochure(PLOT_PROJECTS[0])}
            >
              📥 All Brochures
            </button>
            <button
              className="btn btn-ghost btn-lg"
              onClick={() => setActivePage('layout')}
            >
              🗺️ View Layout Map
            </button>
          </div>

          {/* Project Quick Overview Strip on Hero */}
          <div className="pm-hero__quick-specs">
            <div className="pm-hero__spec-item">
              <span className="pm-hero__spec-label">Prime Locations</span>
              <span className="pm-hero__spec-val">Shankarpally · Shamshabad · Pharma City</span>
            </div>
            <div className="pm-hero__spec-item">
              <span className="pm-hero__spec-label">Plot Sizes</span>
              <span className="pm-hero__spec-val">150 – 500 Sq.Yds</span>
            </div>
            <div className="pm-hero__spec-item">
              <span className="pm-hero__spec-label">Starting Price</span>
              <span className="pm-hero__spec-val" style={{ color: 'var(--brand-gold)' }}>From ₹24 Lakhs</span>
            </div>
            <div className="pm-hero__spec-item">
              <span className="pm-hero__spec-label">Approvals</span>
              <span className="pm-hero__spec-val">HMDA, DTCP & RERA</span>
            </div>
            <div className="pm-hero__spec-item">
              <span className="pm-hero__spec-label">Live Availability</span>
              <span className="pm-hero__spec-val" style={{ color: '#16a34a' }}>219 Plots Available</span>
            </div>
          </div>

          {/* Project Statistics (Dynamic from Real Data) */}
          <div className="pm-hero__stats" style={{ marginTop: 'var(--space-8)' }}>
            <div>
              <strong>890+</strong>
              <span>Total Developed Plots</span>
            </div>
            <div>
              <strong style={{ color: '#16a34a' }}>219</strong>
              <span>Plots Available to Buy</span>
            </div>
            <div>
              <strong>150–500</strong>
              <span>Sq.Yds Plot Sizes</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>HMDA / DTCP & RERA</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Featured Open Plot Projects ─────────────────────────────────── */}
      <section className="pm-section container" aria-labelledby="featured-projects-title">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          <div>
            <div className="badge badge-gold" style={{ marginBottom: 6 }}>Plotted Communities</div>
            <h2 id="featured-projects-title" className="pm-section__title" style={{ marginBottom: 0 }}>
              Featured Open Plot Projects
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: 6, fontSize: '0.9375rem' }}>
              Handpicked clear-title residential layouts in Hyderabad's highest appreciating growth corridors.
            </p>
          </div>
          <button className="btn btn-outline" onClick={() => setActivePage('projects')}>
            View All {PLOT_PROJECTS.length} Projects →
          </button>
        </div>

        <div className="pm-projects-grid">
          {PLOT_PROJECTS.map(proj => (
            <ProjectCard
              key={proj.id}
              project={proj}
              onSelectProject={onSelectProject}
              onOpenLayout={onOpenLayout}
              onOpenBrochure={onOpenBrochure}
              onOpenVisit={onOpenVisit}
              showVisit={false}
            />
          ))}
        </div>
      </section>

      {/* ── 3. Why Invest in PlotMark Open Plots ────────────────────────────── */}
      <section className="pm-section container">
        <h2 className="pm-section__title">Why Choose PlotMark Open Plots</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-8)' }}>
          Designed exclusively for residential open plots with zero compromise on legal approvals and quality execution.
        </p>
        <div className="pm-grid-3">
          {[
            { icon: '📋', title: '100% HMDA & DTCP Clear Title', desc: 'Legally vetted documents with full government sanction and individual RERA registration.' },
            { icon: '🧭', title: '100% Vaastu Compliance', desc: 'Every plot is surveyed and aligned strictly according to authentic Vaastu Shastra.' },
            { icon: '🛣️', title: '40 Ft & 30 Ft Wide BT Roads', desc: 'Durable blacktop roads with curb stones, storm drainage, and landscaped footpaths.' },
            { icon: '🏦', title: 'Up to 75% Bank Loan Approved', desc: 'Pre-approved home and plot loan facility from leading banks like SBI, HDFC, and ICICI.' },
            { icon: '💧', title: 'Underground Drainage & Water', desc: 'Modern concealed underground sewage lines and dedicated water tap connection per plot.' },
            { icon: '🛡️', title: 'Gated Security & Solar Fence', desc: 'Perimeter compound wall with 24x7 security personnel and surveillance system.' },
          ].map(h => (
            <div key={h.title} className="pm-highlight-card">
              <div className="pm-highlight-card__icon">{h.icon}</div>
              <h3>{h.title}</h3>
              <p>{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. Interactive Layout Preview Strip ─────────────────────────────── */}
      <section className="pm-section container" style={{ paddingTop: 0 }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(200, 134, 10, 0.15) 0%, rgba(10, 8, 4, 0.95) 100%)',
          border: '1px solid var(--border-gold)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-8)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-6)'
        }}>
          <div>
            <div className="badge badge-gold" style={{ marginBottom: 8 }}>Interactive Feature</div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 8 }}>
              Explore the Interactive Plot Map
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 520, margin: 0, lineHeight: 1.6 }}>
              Select individual plots, check exact dimensions, road widths, facing, corner availability, and book your plot number online.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button className="btn btn-primary btn-lg" onClick={() => setActivePage('layout')}>
              Open Layout Map ({counts.available} Available) →
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => onOpenVisit(PLOT_PROJECTS[0])}>
              Book Site Visit
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Open Plot Projects Listings Page ─────────────────────────────────────────
function ProjectsPage({
  initialStage = 'all',
  onStageChange,
  onSelectProject,
  onOpenLayout,
  onOpenBrochure,
  onOpenVisit,
}) {
  const [stageFilter, setStageFilter] = useState(initialStage);
  const [filterLoc, setFilterLoc] = useState('all');
  const [filterBudget, setFilterBudget] = useState('all');
  const [filterSize, setFilterSize] = useState('all');
  const [filterApproval, setFilterApproval] = useState('all');

  useEffect(() => {
    if (initialStage) {
      setStageFilter(initialStage);
    }
  }, [initialStage]);

  const handleStageSelect = (stage) => {
    setStageFilter(stage);
    if (onStageChange) {
      onStageChange(stage);
    }
  };

  const stageCounts = useMemo(() => {
    return {
      all: PLOT_PROJECTS.length,
      ongoing: PLOT_PROJECTS.filter(p => p.stage === 'ongoing').length,
      completed: PLOT_PROJECTS.filter(p => p.stage === 'completed').length,
      upcoming: PLOT_PROJECTS.filter(p => p.stage === 'upcoming').length,
    };
  }, []);

  const filtered = useMemo(() => {
    return PLOT_PROJECTS.filter(p => {
      // Stage filter
      if (stageFilter !== 'all' && p.stage !== stageFilter) {
        return false;
      }
      // Location filter
      if (filterLoc !== 'all' && !p.location.toLowerCase().includes(filterLoc.toLowerCase())) {
        return false;
      }
      // Budget filter
      if (filterBudget === 'under30' && p.priceValue >= 30) return false;
      if (filterBudget === '30to45' && (p.priceValue < 30 || p.priceValue > 45)) return false;
      if (filterBudget === 'above45' && p.priceValue <= 45) return false;
      // Plot size filter
      if (filterSize === '150to200' && (p.minSize > 200 || p.maxSize < 150)) return false;
      if (filterSize === '200to350' && (p.minSize > 350 || p.maxSize < 200)) return false;
      if (filterSize === 'above350' && p.maxSize < 350) return false;
      // Approval filter
      if (filterApproval !== 'all' && p.approvalStatusKey !== filterApproval) return false;

      return true;
    });
  }, [stageFilter, filterLoc, filterBudget, filterSize, filterApproval]);

  return (
    <div className="pm-section container">
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 className="pm-section__title" style={{ marginBottom: 8 }}>Open Plot Project Listings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Browse verified residential plotted developments with transparent plot sizes, pricing, and live availability.
        </p>
      </div>

      {/* Stage Status Tabs: All, Ongoing, Completed, Upcoming */}
      <div
        className="pm-stage-tabs"
        role="tablist"
        aria-label="Filter by project stage"
        onWheel={(e) => {
          if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && e.currentTarget.scrollWidth > e.currentTarget.clientWidth) {
            e.currentTarget.scrollLeft += e.deltaY;
          }
        }}
      >
        <button
          className={`pm-stage-tab ${stageFilter === 'all' ? 'active' : ''}`}
          onClick={(e) => {
            handleStageSelect('all');
            e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          }}
          role="tab"
          aria-selected={stageFilter === 'all'}
        >
          <span className="pm-stage-tab__icon">🌟</span>
          <span className="pm-stage-tab__label">All Projects</span>
          <span className="pm-stage-tab__badge">{stageCounts.all}</span>
        </button>

        <button
          className={`pm-stage-tab ${stageFilter === 'ongoing' ? 'active' : ''}`}
          onClick={(e) => {
            handleStageSelect('ongoing');
            e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          }}
          role="tab"
          aria-selected={stageFilter === 'ongoing'}
        >
          <span className="pm-stage-tab__icon">🚧</span>
          <span className="pm-stage-tab__label">Ongoing Projects</span>
          <span className="pm-stage-tab__badge ongoing">{stageCounts.ongoing}</span>
        </button>

        <button
          className={`pm-stage-tab ${stageFilter === 'completed' ? 'active' : ''}`}
          onClick={(e) => {
            handleStageSelect('completed');
            e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          }}
          role="tab"
          aria-selected={stageFilter === 'completed'}
        >
          <span className="pm-stage-tab__icon">🏆</span>
          <span className="pm-stage-tab__label">Completed Projects</span>
          <span className="pm-stage-tab__badge completed">{stageCounts.completed}</span>
        </button>

        <button
          className={`pm-stage-tab ${stageFilter === 'upcoming' ? 'active' : ''}`}
          onClick={(e) => {
            handleStageSelect('upcoming');
            e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          }}
          role="tab"
          aria-selected={stageFilter === 'upcoming'}
        >
          <span className="pm-stage-tab__icon">🚀</span>
          <span className="pm-stage-tab__label">Upcoming Projects</span>
          <span className="pm-stage-tab__badge upcoming">{stageCounts.upcoming}</span>
        </button>
      </div>

      {/* Stage Status Context Banner */}
      {stageFilter === 'ongoing' && (
        <div className="pm-stage-banner ongoing">
          <span style={{ fontSize: '1.25rem' }}>🚧</span>
          <div>
            <strong>Active Site Construction:</strong> These developments are under active execution with completed underground drainage, water pipelines, and on-schedule BT road laying.
          </div>
        </div>
      )}
      {stageFilter === 'completed' && (
        <div className="pm-stage-banner completed">
          <span style={{ fontSize: '1.25rem' }}>🏆</span>
          <div>
            <strong>100% Delivered & Handed Over:</strong> All infrastructure, clubhouse facilities, landscaped parks, and perimeter security are fully commissioned. Ready for immediate villa construction.
          </div>
        </div>
      )}
      {stageFilter === 'upcoming' && (
        <div className="pm-stage-banner upcoming">
          <span style={{ fontSize: '1.25rem' }}>🚀</span>
          <div>
            <strong>Pre-Launch Priority Allotment:</strong> Inaugural booking prices with highest expected appreciation upon final RERA clearance. Priority token bookings now open.
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="pm-filter-bar">
        <div className="pm-filter-groups">
          {/* Location */}
          <select
            className="pm-filter-select"
            value={filterLoc}
            onChange={e => setFilterLoc(e.target.value)}
            aria-label="Filter by Location"
          >
            <option value="all">📍 All Locations</option>
            <option value="shankarpally">Shankarpally / Mokila</option>
            <option value="shamshabad">Shamshabad / Airport</option>
            <option value="srisailam">Pharma City / Srisailam Hwy</option>
            <option value="ghatkesar">Ghatkesar / Warangal Hwy</option>
            <option value="kollur">Kollur / ORR Growth Belt</option>
            <option value="sadashivpet">Sadashivpet / Mumbai Hwy</option>
          </select>

          {/* Budget */}
          <select
            className="pm-filter-select"
            value={filterBudget}
            onChange={e => setFilterBudget(e.target.value)}
            aria-label="Filter by Budget"
          >
            <option value="all">💰 All Budgets</option>
            <option value="under30">Under ₹30 Lakhs</option>
            <option value="30to45">₹30 Lakhs – ₹45 Lakhs</option>
            <option value="above45">Above ₹45 Lakhs</option>
          </select>

          {/* Size */}
          <select
            className="pm-filter-select"
            value={filterSize}
            onChange={e => setFilterSize(e.target.value)}
            aria-label="Filter by Plot Size"
          >
            <option value="all">📐 All Plot Sizes</option>
            <option value="150to200">150 – 200 Sq.Yds</option>
            <option value="200to350">200 – 350 Sq.Yds</option>
            <option value="above350">350+ Sq.Yds (Villa Plots)</option>
          </select>

          {/* Approval */}
          <select
            className="pm-filter-select"
            value={filterApproval}
            onChange={e => setFilterApproval(e.target.value)}
            aria-label="Filter by Approval Status"
          >
            <option value="all">🛡️ All Approvals</option>
            <option value="hmda">HMDA Approved</option>
            <option value="dtcp">DTCP Approved</option>
          </select>
        </div>

        <div className="pm-filter-count">
          Showing {filtered.length} of {PLOT_PROJECTS.length} Projects
        </div>
      </div>

      {/* Projects Grid */}
      {filtered.length > 0 ? (
        <div className="pm-projects-grid">
          {filtered.map(proj => (
            <ProjectCard
              key={proj.id}
              project={proj}
              onSelectProject={onSelectProject}
              onOpenLayout={onOpenLayout}
              onOpenBrochure={onOpenBrochure}
              onOpenVisit={onOpenVisit}
            />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: 'var(--space-12) 0', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🔍</div>
          <h3>No projects found matching selected filters</h3>
          <p style={{ marginTop: 4 }}>Try clearing or adjusting your stage, budget or location filters.</p>
          <button
            className="btn btn-outline"
            style={{ marginTop: 12 }}
            onClick={() => {
              handleStageSelect('all');
              setFilterLoc('all');
              setFilterBudget('all');
              setFilterSize('all');
              setFilterApproval('all');
            }}
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Interactive Plot Layout Map Page ─────────────────────────────────────────
// ─── Interactive Plot Layout Map Page ─────────────────────────────────────────
function LayoutPage({
  activeProject,
  onSelectProject,
  plots,
  onStatusChange,
  onBookVisit,
  onOpenBrochure,
  onOpenBrochuresList,
}) {
  const project = activeProject || PLOT_PROJECTS[0];
  const config = PROJECT_LAYOUT_CONFIG[project.id] || PROJECT_LAYOUT_CONFIG['pm-shankarpally'];

  const [selected, setSelected] = useState(() => plots.find(p => p.status === 'available') || plots[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [facingFilter, setFacingFilter] = useState('all');
  const [cornerOnly, setCornerOnly] = useState(false);

  // Layout Plan Switcher & Pan/Zoom Controls
  const [activePlanType, setActivePlanType] = useState('blueprint'); // 'blueprint' | 'masterplan'
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchStartDist, setTouchStartDist] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const viewportRef = useRef(null);

  // Automatically reset selected plot and filters when switching project
  useEffect(() => {
    const firstAvail = plots.find(p => p.status === 'available') || plots[0] || null;
    setSelected(firstAvail);
    setSearchQuery('');
    setStatusFilter('all');
    setSectorFilter('all');
    setFacingFilter('all');
    setCornerOnly(false);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
  }, [project.id, plots]);

  const counts = useMemo(() => {
    return {
      available: plots.filter(p => p.status === 'available').length,
      booked: plots.filter(p => p.status === 'booked').length,
      sold: plots.filter(p => p.status === 'sold').length,
      blocked: plots.filter(p => p.status === 'blocked').length,
      total: plots.length,
    };
  }, [plots]);

  const filteredPlots = useMemo(() => {
    return plots.filter(p => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim().replace('#', '');
        if (!p.label.toLowerCase().includes(q) && !(p.sector || '').toLowerCase().includes(q)) {
          return false;
        }
      }
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (sectorFilter !== 'all' && p.sector !== sectorFilter) return false;
      if (facingFilter !== 'all' && p.facing !== facingFilter) return false;
      if (cornerOnly && !p.corner) return false;
      return true;
    });
  }, [plots, searchQuery, statusFilter, sectorFilter, facingFilter, cornerOnly]);

  function handleEnquire(plot) {
    if (!plot) return;
    window.open(
      `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
        `Hi! I'm interested in Plot #${plot.label} (${plot.area} Sq.Yds, ₹${plot.price} Lakhs, ${plot.facing} facing) in ${project.name} (${project.location}). Please confirm availability.`
      )}`,
      '_blank'
    );
  }

  function handleDownloadPlotSheet(plot) {
    if (!plot) return;
    const content = `=====================================================
${project.name.toUpperCase()} — PLOT SPECIFICATION SHEET
=====================================================
Project: ${project.name} (${project.location})
Plot Number: #${plot.label}
Sector: ${plot.sector || config.sectors[0]}
Dimensions: ${plot.dimensions}
Plot Area: ${plot.area} Sq.Yards (${plot.sqft || plot.area * 9} Sq.Feet)
Facing: ${plot.facing} Facing (100% Vaastu Compliant)
Road Frontage: ${plot.road}
Corner Status: ${plot.corner ? 'Prime Corner Plot' : 'Standard Avenue Plot'}
Current Status: ${STATUS_LABELS[plot.status]}

PRICING DETAILS:
Base Rate: ₹${(plot.pricePerYd || config.basePricePerYd).toLocaleString('en-IN')} per Sq.Yd
Total Indicative Cost: ₹${plot.price} Lakhs*
Estimated 75% Bank Loan: ₹${(plot.price * 0.75).toFixed(2)} Lakhs
Approved Lenders: State Bank of India (SBI), HDFC Bank, ICICI Bank, Axis Bank

GOVERNMENT APPROVALS:
Approval: ${project.approvalDetails}
Registration: Spot Sub-Registrar Registration Available

Contact: ${siteConfig.phone} | WhatsApp: ${siteConfig.whatsapp}
Website: https://deccanidentity.com/demo/plotmark
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${project.slug}-Plot-${plot.label}-Specifications.txt`;
    link.click();
  }

  // ── Pan and Zoom Handlers ──
  function handleZoomIn() {
    setZoom(z => Math.min(Number((z + 0.25).toFixed(2)), 3.5));
  }

  function handleZoomOut() {
    setZoom(z => Math.max(Number((z - 0.25).toFixed(2)), 0.75));
  }

  function handleResetView() {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }

  function handleMouseDown(e) {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }

  function handleMouseMove(e) {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }

  function handleMouseUp() {
    setIsDragging(false);
  }

  function handleWheel(e) {
    if (e.ctrlKey || Math.abs(e.deltaY) > 0) {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.15 : -0.15;
      setZoom(z => Math.min(Math.max(Number((z + delta).toFixed(2)), 0.75), 3.5));
    }
  }

  function handleTouchStart(e) {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setTouchStartDist(dist);
    }
  }

  function handleTouchMove(e) {
    if (e.touches.length === 1 && isDragging) {
      setPan({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    } else if (e.touches.length === 2 && touchStartDist) {
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = currentDist / touchStartDist;
      if (Math.abs(ratio - 1) > 0.05) {
        setZoom(z => Math.min(Math.max(Number((z * (ratio > 1 ? 1.05 : 0.95)).toFixed(2)), 0.75), 3.5));
        setTouchStartDist(currentDist);
      }
    }
  }

  function handleTouchEnd() {
    setIsDragging(false);
    setTouchStartDist(null);
  }

  // Authentic Gallery-sourced layout drawing assets:
  // Primary: /images/actual-site-layout.png (Verified Cadastral Survey & Master Layout Blueprint)
  // Secondary: /images/plotmark-masterplan.jpg (Bird's Eye 3D Architectural Township Masterplan)
  const blueprintSrc = '/images/actual-site-layout.png';
  const masterplanSrc = '/images/plotmark-masterplan.jpg';
  const activePlanImage = activePlanType === 'blueprint' ? blueprintSrc : masterplanSrc;

  return (
    <div className="pm-section container">
      {/* ── 0. Project Selector Bar (Updates Layout According to Selected Project) ── */}
      <div className="pm-layout-project-selector">
        <span className="pm-layout-project-label">Select Project Layout:</span>
        <div className="pm-layout-project-pills" role="tablist">
          {PLOT_PROJECTS.map(proj => {
            const isCurrent = project.id === proj.id;
            return (
              <button
                key={proj.id}
                className={`pm-proj-pill ${isCurrent ? 'active' : ''}`}
                onClick={() => onSelectProject(proj)}
                role="tab"
                aria-selected={isCurrent}
              >
                <span className="pm-proj-pill__title">
                  {proj.name}
                  {isCurrent && <span style={{ color: 'var(--brand-gold)' }}>✓</span>}
                </span>
                <span className="pm-proj-pill__meta">
                  {proj.location.split('(')[0].split('—')[0].trim()} · {proj.approvalType.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 1. Top Header Box & Project Information ──────────────────────────── */}
      <div className="pm-layout-header-box">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: 6 }}>
            <span className="badge badge-gold">Interactive Masterplan</span>
            <span style={{ fontSize: '0.8125rem', color: '#16a34a', fontWeight: 600 }}>
              ● Live Synchronized Availability
            </span>
            <span className="badge" style={{ background: 'rgba(200, 134, 10, 0.15)', color: 'var(--brand-gold)' }}>
              Rate: {project.ratePerYd || `₹${(config.basePricePerYd).toLocaleString('en-IN')}/Yd`}
            </span>
          </div>
          <h1 className="pm-section__title" style={{ fontSize: '1.75rem', marginBottom: 4 }}>
            {project.name} — Authentic Site Layout Plan
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
            {project.approvalDetails} · 100% Vaastu Compliant Surveyed Drawing
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            className="btn btn-outline pm-layout-brochures-btn"
            onClick={() => onOpenBrochuresList ? onOpenBrochuresList() : onOpenBrochure(project)}
            aria-label="View and download project brochures"
          >
            📥 All Brochures (6)
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onBookVisit(project, selected)}
            aria-label="Schedule a site visit"
          >
            🚗 Book a Visit
          </button>
        </div>
      </div>

      {/* ── 2. Controls & Search Toolbar ─────────────────────────────────────── */}
      <div className="pm-layout-controls">
        {/* Quick Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <input
            className="pm-plot-search-input"
            placeholder="🔍 Search Plot # (e.g. 101)"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              const found = plots.find(p => p.label.toLowerCase() === e.target.value.toLowerCase().replace('#', '').trim());
              if (found) setSelected(found);
            }}
            aria-label="Search plot number"
          />

          {/* Status Filter */}
          <select
            className="pm-filter-select"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            aria-label="Filter by status"
          >
            <option value="all">All Statuses ({counts.total})</option>
            <option value="available">🟢 Available ({counts.available})</option>
            <option value="booked">🟡 Booked ({counts.booked})</option>
            <option value="sold">🔴 Sold ({counts.sold})</option>
            <option value="blocked">🟣 Held ({counts.blocked})</option>
          </select>

          {/* Sector Filter */}
          <select
            className="pm-filter-select"
            value={sectorFilter}
            onChange={e => setSectorFilter(e.target.value)}
            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            aria-label="Filter by sector"
          >
            <option value="all">All Sectors</option>
            {config.sectors.map(sec => (
              <option key={sec} value={sec}>{sec}</option>
            ))}
          </select>

          {/* Facing Filter */}
          <select
            className="pm-filter-select"
            value={facingFilter}
            onChange={e => setFacingFilter(e.target.value)}
            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            aria-label="Filter by facing"
          >
            <option value="all">All Facings</option>
            <option value="East">East Facing</option>
            <option value="West">West Facing</option>
            <option value="North">North Facing</option>
          </select>

          {/* Corner Toggle */}
          <button
            className={`btn btn-sm ${cornerOnly ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            onClick={() => setCornerOnly(!cornerOnly)}
            title="Show only corner plots"
          >
            ⭐ Corner Only
          </button>
        </div>
      </div>

      {/* ── 3. Split Layout: Canvas / Table on Left, Live Inspector on Right ──── */}
      <div className="pm-layout-split">
        {/* Left Area */}
        <div>
          {/* Legend Strip */}
          <div className="plot-legend" style={{ marginBottom: 12 }}>
            <div className="plot-legend__item">
              <span style={{ background: STATUS_COLORS.available }} />
              <span>Available ({counts.available})</span>
            </div>
            <div className="plot-legend__item">
              <span style={{ background: STATUS_COLORS.booked }} />
              <span>Booked ({counts.booked})</span>
            </div>
            <div className="plot-legend__item">
              <span style={{ background: STATUS_COLORS.sold }} />
              <span>Sold ({counts.sold})</span>
            </div>
            <div className="plot-legend__item">
              <span style={{ background: STATUS_COLORS.blocked }} />
              <span>Held / Blocked ({counts.blocked})</span>
            </div>
            <div className="plot-legend__item" style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ⭐ Corner Plot Indicator
            </div>
          </div>

          {/* ── Original Project Layout Map (Sourced Directly from Gallery) ── */}
          <div className="pm-original-map-container">
              {/* Drawing Switcher and Zoom Toolbar */}
              <div className="pm-plan-switcher-bar">
                <div className="pm-plan-type-tabs" role="tablist" aria-label="Select layout drawing format">
                  <button
                    className={`pm-plan-type-btn ${activePlanType === 'blueprint' ? 'active' : ''}`}
                    onClick={() => { setActivePlanType('blueprint'); handleResetView(); }}
                    role="tab"
                    aria-selected={activePlanType === 'blueprint'}
                  >
                    📐 Sanctioned Survey Blueprint (Plots 1–61)
                  </button>
                  <button
                    className={`pm-plan-type-btn ${activePlanType === 'masterplan' ? 'active' : ''}`}
                    onClick={() => { setActivePlanType('masterplan'); handleResetView(); }}
                    role="tab"
                    aria-selected={activePlanType === 'masterplan'}
                  >
                    🌿 3D Architectural Masterplan Render
                  </button>
                </div>

                {/* Zoom & Inspection Controls */}
                <div className="pm-plan-zoom-toolbar">
                  <button
                    className="pm-zoom-btn"
                    onClick={handleZoomIn}
                    title="Zoom In (+25%)"
                    aria-label="Zoom In"
                  >
                    ➕
                  </button>
                  <span className="pm-zoom-indicator">{Math.round(zoom * 100)}%</span>
                  <button
                    className="pm-zoom-btn"
                    onClick={handleZoomOut}
                    title="Zoom Out (-25%)"
                    aria-label="Zoom Out"
                  >
                    ➖
                  </button>
                  <button
                    className="pm-zoom-btn"
                    onClick={handleResetView}
                    title="Reset Zoom & Pan"
                    aria-label="Reset View"
                  >
                    ↺ Reset
                  </button>
                  <button
                    className={`pm-zoom-btn ${isFullscreen ? 'active' : ''}`}
                    onClick={() => setIsFullscreen(f => !f)}
                    title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen (⛶)'}
                    aria-label="Toggle Fullscreen"
                  >
                    {isFullscreen ? '✕ Exit' : '⛶ Fullscreen'}
                  </button>
                </div>
              </div>

              {/* Interactive Pan & Zoom Viewport */}
              <div
                ref={viewportRef}
                className={`pm-original-map-viewport ${isDragging ? 'is-dragging' : ''} ${isFullscreen ? 'is-fullscreen' : ''}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onWheel={handleWheel}
                role="region"
                aria-label={`${project.name} Original Layout Drawing with pan and zoom`}
                tabIndex={0}
              >
                {/* Orientation & Compass Badge */}
                <div className="pm-map-compass-badge" aria-label="Layout orientation">
                  <span className="pm-map-compass-arrow">🧭</span>
                  <div>
                    <div className="pm-map-compass-heading">NORTH-EAST</div>
                    <div className="pm-map-compass-sub">Grand Entrance 100' Rd</div>
                  </div>
                </div>

                {/* Sanction Stamp Badge */}
                <div className="pm-map-sanction-badge">
                  <span className="pm-map-sanction-dot">●</span>
                  <span>{activePlanType === 'blueprint' ? 'Official Sanctioned Survey Blueprint' : '3D Township Masterplan Render'} · Gallery Asset</span>
                </div>

                {/* Plan Canvas Image with Pan & Zoom Transform */}
                <div
                  className="pm-original-map-canvas"
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transformOrigin: 'center center',
                  }}
                >
                  <img
                    src={activePlanImage}
                    alt={`${project.name} Original Sanctioned Master Layout Plan`}
                    className="pm-original-layout-img"
                    draggable={false}
                  />
                </div>

                {/* Interactive Helper Hint */}
                <div className="pm-map-help-hint">
                  <span>🖐️ Drag or swipe to pan</span>
                  <span>·</span>
                  <span>🔍 Use + / − or scroll to zoom</span>
                  <span>·</span>
                  <span className="pm-map-zoom-pill">{Math.round(zoom * 100)}%</span>
                </div>
              </div>

              {/* Authentic Blueprint Specification Strip */}
              <div className="pm-layout-specs-strip">
                <div className="pm-lstrip-item">
                  <span className="pm-lstrip-label">Official Sanction</span>
                  <strong className="pm-lstrip-val">{project.approvalDetails}</strong>
                </div>
                <div className="pm-lstrip-item">
                  <span className="pm-lstrip-label">Sanctioned Plots</span>
                  <strong className="pm-lstrip-val">Plots #1 to #61 Clearly Numbered</strong>
                </div>
                <div className="pm-lstrip-item">
                  <span className="pm-lstrip-label">Road Network</span>
                  <strong className="pm-lstrip-val">100' Approach · 40' Avenues · 33' & 30' Roads</strong>
                </div>
                <div className="pm-lstrip-item">
                  <span className="pm-lstrip-label">Open Spaces & Parks</span>
                  <strong className="pm-lstrip-val">Central Gazebo Park · Children Play Arena</strong>
                </div>
              </div>
            </div>
        </div>

        {/* ── 4. Right Area: Live Plot Inspector Card ─────────────────────────── */}
        <div>
          {selected ? (
            <div className="pm-layout-inspector">
              {/* Header */}
              <div className="pm-inspector-header">
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--brand-gold)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {selected.sector || config.sectors[0]} · {project.name}
                  </span>
                  <h3 className="pm-inspector-title">Plot #{selected.label}</h3>
                </div>
                <span
                  style={{
                    background: `${STATUS_COLORS[selected.status]}24`,
                    color: STATUS_COLORS[selected.status],
                    border: `1px solid ${STATUS_COLORS[selected.status]}66`,
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  {STATUS_LABELS[selected.status]}
                </span>
              </div>

              {/* Grid of Key Plot Specifications */}
              <div className="pm-inspector-grid">
                <div className="pm-inspector-item">
                  <span>Plot Area</span>
                  <strong>{selected.area} Sq.Yds</strong>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>({selected.sqft || selected.area * 9} Sq.Ft)</span>
                </div>
                <div className="pm-inspector-item">
                  <span>Dimensions</span>
                  <strong>{selected.dimensions}</strong>
                </div>
                <div className="pm-inspector-item">
                  <span>Facing</span>
                  <strong>{selected.facing} Facing</strong>
                  <span style={{ fontSize: '0.6875rem', color: '#16a34a' }}>100% Vaastu</span>
                </div>
                <div className="pm-inspector-item">
                  <span>Road Width</span>
                  <strong>{selected.road}</strong>
                </div>
                <div className="pm-inspector-item">
                  <span>Corner Plot</span>
                  <strong>{selected.corner ? '⭐ Yes (Prime Corner)' : 'Standard Plot'}</strong>
                </div>
                <div className="pm-inspector-item">
                  <span>Rate / Sq.Yd</span>
                  <strong>₹{(selected.pricePerYd || config.basePricePerYd).toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {/* Pricing & Loan Box */}
              <div className="pm-inspector-price-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    TOTAL INDICATIVE PRICE
                  </span>
                  <strong style={{ fontSize: '1.25rem', color: 'var(--brand-gold)' }}>
                    ₹{selected.price} Lakhs*
                  </strong>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  🏦 Bank Loan Eligible: Up to ₹{(selected.price * 0.75).toFixed(2)} Lakhs (75%)
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  Estimated EMI: ~₹{Math.round((selected.price * 0.75 * 100000 * 0.0085)).toLocaleString('en-IN')}/mo
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pm-inspector-actions">
                {selected.status === 'available' ? (
                  <>
                    <button
                      className="btn btn-primary"
                      style={{ justifyContent: 'center' }}
                      onClick={() => handleEnquire(selected)}
                    >
                      💬 Hold / Enquire via WhatsApp
                    </button>
                    <button
                      className="btn btn-outline"
                      style={{ justifyContent: 'center' }}
                      onClick={() => onBookVisit(project, selected)}
                    >
                      🚗 Schedule Site Visit for Plot #{selected.label}
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ justifyContent: 'center' }}
                      onClick={() => handleDownloadPlotSheet(selected)}
                    >
                      📥 Download Plot #{selected.label} Spec Sheet
                    </button>
                  </>
                ) : (
                  <div style={{
                    background: 'rgba(220, 38, 38, 0.1)',
                    border: '1px solid rgba(220, 38, 38, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                    fontSize: '0.8125rem',
                    textAlign: 'center',
                    color: '#ef4444'
                  }}>
                    <div>⚠️ <strong>Plot #{selected.label} is {STATUS_LABELS[selected.status]}</strong></div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: 4 }}>
                      Online booking is unavailable for this plot.
                    </div>
                    <button
                      className="btn btn-outline btn-sm"
                      style={{ marginTop: 8, width: '100%', justifyContent: 'center' }}
                      onClick={() => {
                        const firstAvail = plots.find(p => p.status === 'available');
                        if (firstAvail) setSelected(firstAvail);
                      }}
                    >
                      Explore Available Plots (🟢)
                    </button>
                  </div>
                )}

                {/* Quick Status Toggle for Demonstration */}
                <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Demo Status:</span>
                  <select
                    value={selected.status}
                    onChange={(e) => {
                      onStatusChange(selected.id, e.target.value);
                      setSelected(prev => ({ ...prev, status: e.target.value }));
                    }}
                    className="pm-filter-select"
                    style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                  >
                    <option value="available">Available (🟢)</option>
                    <option value="booked">Booked (🟡)</option>
                    <option value="sold">Sold (🔴)</option>
                    <option value="blocked">Held / Blocked (🟣)</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="pm-layout-inspector" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🗺️</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Select a Plot on the Map</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', lineHeight: 1.6 }}>
                Click any plot number on the masterplan layout to view dimensions, facing, road width, pricing, and book your plot online.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── 5. Layout Engineering Standards & Approvals Section ───────────────── */}
      <div style={{ marginTop: 'var(--space-12)' }}>
        <h2 className="pm-section__title" style={{ fontSize: '1.375rem', marginBottom: 8 }}>
          Layout Engineering Standards & Infrastructure
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-6)' }}>
          Every square yard developed with certified high-grade infrastructure and verified government statutory approvals.
        </p>

        <div className="pm-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
          <div className="pm-spec-box">
            <strong>🛣️ 40 Ft & 33 Ft BT Roads</strong>
            <p>Designed with heavy-duty wet mix macadam sub-base and machine-laid asphalt with precast kerb stones.</p>
          </div>
          <div className="pm-spec-box">
            <strong>💧 Underground Drainage & Water</strong>
            <p>Concealed UGD pipes with manholes, connected to STP. Overhead water tank with individual plot tap.</p>
          </div>
          <div className="pm-spec-box">
            <strong>⚡ Concealed Electrical Grid</strong>
            <p>Underground cabling, dedicated transformers, and designer warm-white LED street poles.</p>
          </div>
          <div className="pm-spec-box">
            <strong>🛡️ Gated Compound & Solar Fence</strong>
            <p>6-foot precast concrete boundary wall with solar security fencing and 24x7 security surveillance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── Amenities & Infrastructure Page ──────────────────────────────────────────
function AmenitiesPage({ onOpenVisit }) {
  return (
    <div className="pm-section container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 className="pm-section__title" style={{ marginBottom: 4 }}>Infrastructure & Amenities</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Engineered for longevity with master-planned roads, underground cabling, and lush green open spaces.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => onOpenVisit(PLOT_PROJECTS[0])}>
          Schedule a Site Visit
        </button>
      </div>

      <div className="pm-grid-3">
        {[
          { icon: '🚪', name: 'Grand Entrance Archway', desc: 'Majestic gated entry with separate ingress and egress lanes and security post.' },
          { icon: '🛡️', name: '24x7 Security & CCTV', desc: 'Continuous manned security, solar-powered perimeter fencing, and cameras.' },
          { icon: '🛣️', name: '40 Ft & 30 Ft BT Roads', desc: 'Heavy-duty blacktop roads designed for durability with precast kerb stones.' },
          { icon: '💧', name: 'Continuous Water Pipeline', desc: 'Overhead water tank connecting tap points to each individual plot boundary.' },
          { icon: '🔌', name: 'Concealed Underground EB', desc: 'Underground electricity network with transformers, leaving clean tree-lined vistas.' },
          { icon: '🚿', name: 'Underground Drainage (UGD)', desc: 'Well-engineered sewage pipeline network connected to modern treatment points.' },
          { icon: '🌳', name: 'Landscaped Parks & Lawns', desc: 'Avenue plantations with shaded trees, flowering plants, and sitting gazebos.' },
          { icon: '💡', name: 'Designer LED Streetlights', desc: 'Energy-efficient LED street light poles lighting all internal roads and avenues.' },
          { icon: '🏃', name: 'Jogging Track & Play Area', desc: 'Dedicated fitness pathways and safe rubber-matted play stations for children.' },
        ].map(a => (
          <div key={a.name} className="pm-highlight-card">
            <div className="pm-highlight-card__icon">{a.icon}</div>
            <h3 style={{ fontSize: '1.05rem', marginBottom: 6 }}>{a.name}</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{a.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Location & Connectivity Page ─────────────────────────────────────────────
function LocationPage({ onOpenVisit }) {
  return (
    <div className="pm-section container">
      <h1 className="pm-section__title">Strategic Location & Connectivity</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-8)' }}>
        Our plotted developments are positioned right along Hyderabad's fastest expanding economic, transit, and IT arterial corridors.
      </p>

      <div className="pm-grid-2">
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 'var(--space-3)' }}>
            Growth Corridor Advantages
          </h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-4)' }}>
            With the rapid growth of the Outer Ring Road (ORR), Regional Ring Road (RRR), and government mega-infrastructure projects like Neopolis Kokapet, Hardware Park, and Pharma City, land values in these corridors have consistently grown 15%–22% year-on-year.
          </p>

          <ul className="pm-location-list">
            {[
              ['Outer Ring Road (ORR) Junction', '2.5 km (4 mins)'],
              ['RGIA International Airport', '18 km (18 mins)'],
              ['Neopolis & Financial District', '16 km (20 mins)'],
              ['Reputed International Schools', '1.5 km (3 mins)'],
              ['Multi-Specialty Hospitals', '3.0 km (5 mins)'],
              ['Proposed Regional Ring Road (RRR)', '6.0 km (8 mins)'],
            ].map(([place, dist]) => (
              <li key={place}>
                <span className="pm-location-place">{place}</span>
                <span className="pm-location-dist">{dist}</span>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: 'var(--space-6)' }}>
            <button className="btn btn-primary" onClick={() => onOpenVisit(PLOT_PROJECTS[0])}>
              🚗 Book a Free Site Visit Pickup
            </button>
          </div>
        </div>

        <div className="pm-map-placeholder" aria-label="Location map visual" style={{ backgroundImage: `url('/images/actual-site-layout.png')`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(10, 8, 4, 0.75)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>📍</div>
            <h4 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
              PlotMark County · Shankarpally
            </h4>
            <div style={{ fontSize: '0.875rem', color: 'var(--brand-gold)', marginTop: 4 }}>
              Survey Nos. 102 & 104, Mokila Corridor, Hyderabad
            </div>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              style={{ marginTop: 16 }}
            >
              Open in Google Maps ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Gallery Page ─────────────────────────────────────────────────────────────
function GalleryPage() {
  const [selectedImg, setSelectedImg] = useState(null);
  const [cat, setCat] = useState('all');

  const photos = [
    {
      src: '/images/plot-clubhouse-pool.jpg',
      label: 'Grand Resort Clubhouse & Swimming Pool',
      cat: 'amenities',
      type: 'Completed Amenity',
      desc: 'Finished Olympic-size swimming pool with luxury deck loungers and designer clubhouse facade.',
    },
    {
      src: '/images/plot-infra-work.jpg',
      label: '40 Ft Main Avenue BT Road Work & Kerbs',
      cat: 'infra',
      type: 'Site Development',
      desc: 'Active site infrastructure laying with heavy-duty asphalt paving, kerbstones, and demarcation pillars.',
    },
    {
      src: '/images/plotmark-entrance-arch.jpg',
      label: 'Signature Grand Entrance Archway & RFID Gate',
      cat: 'gate',
      type: 'Security Portal',
      desc: 'Monumental 60-ft wide entrance arch with 24x7 security cabin, CCTV, and automated boom barrier.',
    },
    {
      src: '/images/actual-site-layout.png',
      label: 'Verified Cadastral Survey & Master Layout Blueprint',
      cat: 'plans',
      type: 'Sanctioned Blueprint',
      desc: 'Official HMDA/DTCP sanctioned layout grid displaying individual numbered plots and green buffers.',
    },
    {
      src: '/images/plotventure-avenue.jpg',
      label: 'Tree-Lined 60-Ft Avenue & LED Streetlights',
      cat: 'infra',
      type: 'Avenue Plantation',
      desc: 'Finished internal boulevard featuring lush flowering avenue trees, walkways, and underground electrical lines.',
    },
    {
      src: '/images/plotmark-masterplan.jpg',
      label: 'Bird’s Eye 3D Architectural Township Masterplan',
      cat: 'plans',
      type: 'Architectural Render',
      desc: 'High-resolution 3D masterplan rendering showing central parks, recreational zones, and commercial strips.',
    },
  ];

  const filtered = cat === 'all' ? photos : photos.filter(p => p.cat === cat);

  return (
    <div className="pm-section container">
      {selectedImg && (
        <div className="plot-modal-overlay" onClick={() => setSelectedImg(null)}>
          <div style={{ maxWidth: 800, width: '100%', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button className="plot-modal__close" onClick={() => setSelectedImg(null)}>×</button>
            <img src={selectedImg.src} alt={selectedImg.label} style={{ width: '100%', borderRadius: 'var(--radius-lg)' }} />
            <div style={{ marginTop: 12, color: '#ffffff', fontWeight: 700, fontSize: '1.1rem' }}>{selectedImg.label}</div>
            <div style={{ marginTop: 4, color: 'var(--brand-gold)', fontSize: '0.85rem' }}>{selectedImg.desc}</div>
          </div>
        </div>
      )}

      <h1 className="pm-section__title">Project Gallery</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
        Authentic site photography, completed township infrastructure, and architectural layouts.
      </p>

      {/* Category chips */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
        {[
          ['all', 'All Photos (6)'],
          ['amenities', 'Clubhouse & Pool'],
          ['infra', 'Avenue Roads & Kerbs'],
          ['gate', 'Entrance Gateways'],
          ['plans', 'Layout Plans & Blueprint'],
        ].map(([key, label]) => (
          <button
            key={key}
            className={`btn btn-sm ${cat === key ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setCat(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="pm-grid-3">
        {filtered.map((p, idx) => (
          <div
            key={idx}
            className="pm-project-card"
            style={{ cursor: 'pointer' }}
            onClick={() => setSelectedImg(p)}
          >
            <div style={{ height: 220, overflow: 'hidden' }}>
              <img src={p.src} alt={p.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>{p.label}</span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--brand-gold)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {p.type}
                </span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                {p.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Contact / Site Visit Page ────────────────────────────────────────────────
function ContactPage({ onOpenVisit, initialProject, onSelectProject, setActivePage }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    project: initialProject?.id || 'pm-shankarpally',
    plotSize: '150 – 200 Sq.Yds',
    visitDate: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const selectedProj = useMemo(() => {
    return PLOT_PROJECTS.find(p => p.id === formData.project) || PLOT_PROJECTS[0];
  }, [formData.project]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 500);
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      project: initialProject?.id || 'pm-shankarpally',
      plotSize: '150 – 200 Sq.Yds',
      visitDate: '',
      message: '',
    });
    setSubmitted(false);
  };

  const FAQS = [
    {
      q: 'How does the free site visit pickup and drop service work?',
      a: 'We provide complimentary doorstep air-conditioned cab pickup and drop from anywhere in Hyderabad (Home or Office) for you and your family. Our dedicated executive coordinates timing, handles travel, and guides you on-site through the layout without any obligation.',
    },
    {
      q: 'Are all PlotMark layouts 100% HMDA/DTCP approved and RERA registered?',
      a: 'Yes, absolutely. Every project showcased on PlotMark has received final technical sanction (HMDA/DTCP LP Number) and valid TS-RERA registration. Legal title documents, link documents, and sanction orders are open for verification before token booking.',
    },
    {
      q: 'What bank loan options are available for open plots in PlotMark?',
      a: 'All our projects are pre-approved for up to 70%–75% plot purchase loans and composite plot+construction loans by top nationalised and private banks including SBI, HDFC Bank, ICICI Bank, Axis Bank, and LIC Housing Finance.',
    },
    {
      q: 'What township amenities and infrastructure are included?',
      a: 'All townships feature 100% underground cabling, blacktop 40ft/33ft BT avenue roads with kerb stones, dedicated underground drainage and storm water lines, overhead water tanks with individual plot tap points, compound walls with 24/7 security, designer clubhouse, and lush parks.',
    },
    {
      q: 'Can I choose my plot number and make a token reservation online?',
      a: 'Yes! You can explore the Interactive Layout Map, filter available East/West/Corner plots, view dimensions and exact facing, and place an instant token booking with spot registration assistance at the Sub-Registrar Office.',
    },
  ];

  const waLeadUrl = `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Hi PlotMark! I would like to schedule a site visit for ${selectedProj.name} (${selectedProj.location}) for ${formData.plotSize}. Name: ${formData.name || 'Investor'}.`
  )}`;

  return (
    <div className="pm-contact-page">
      {/* ── Page Header ── */}
      <div className="pm-contact-hero">
        <span className="badge" style={{ marginBottom: '0.75rem', background: 'rgba(200,134,10,0.15)', color: 'var(--brand-gold)' }}>
          🏷️ Direct Developer Desk &amp; Site Visit Assistance
        </span>
        <h1 className="pm-contact-title">
          Contact Us &amp; Schedule Site Visit
        </h1>
        <p className="pm-contact-sub">
          Have queries about plot dimensions, current pricing, or RERA approvals? Connect directly with our plotted township advisors or schedule a free cab pickup across Hyderabad.
        </p>
      </div>

      <div className="container pm-contact-container">
        <div className="pm-contact-grid">
          {/* ── Left Column: Form Card ── */}
          <div className="pm-contact-card pm-contact-form-card">
            <div className="pm-contact-card-header">
              <h2 style={{ fontSize: '1.35rem', margin: '0 0 6px', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                {submitted ? 'Booking Request Confirmed' : 'Book a Complimentary Site Visit'}
              </h2>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {submitted
                  ? 'Our relationship manager will contact you within 15 minutes.'
                  : 'Free AC cab pickup & drop from your doorstep across Hyderabad.'}
              </p>
            </div>

            {submitted ? (
              <div className="pm-contact-success-box">
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✅</div>
                <h3 style={{ fontSize: '1.25rem', color: '#10b981', margin: '0 0 8px' }}>
                  Request Received, {formData.name}!
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                  Your site visit enquiry for <strong>{selectedProj.name}</strong> ({selectedProj.location}) has been logged in our priority queue.
                </p>

                <div className="pm-contact-success-details">
                  <div><span>Project:</span> <strong>{selectedProj.name}</strong></div>
                  <div><span>Phone:</span> <strong>{formData.phone}</strong></div>
                  <div><span>Preferred Size:</span> <strong>{formData.plotSize}</strong></div>
                  {formData.visitDate && <div><span>Visit Date:</span> <strong>{formData.visitDate}</strong></div>}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '1.5rem' }}>
                  <a
                    href={waLeadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-whatsapp"
                    style={{ justifyContent: 'center', width: '100%', padding: '12px' }}
                  >
                    <span>💬</span> Confirm Pickup on WhatsApp Immediately
                  </a>

                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleResetForm}
                    style={{ justifyContent: 'center', width: '100%' }}
                  >
                    Book Another Visit / Submit Another Query
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="pm-contact-form">
                <div className="pm-form-row-2">
                  <div className="pm-form-group">
                    <label htmlFor="pm-ct-name">Full Name *</label>
                    <input
                      id="pm-ct-name"
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      className="pm-input"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="pm-form-group">
                    <label htmlFor="pm-ct-phone">Mobile / WhatsApp Number *</label>
                    <input
                      id="pm-ct-phone"
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      className="pm-input"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="pm-form-row-2">
                  <div className="pm-form-group">
                    <label htmlFor="pm-ct-email">Email Address (Optional)</label>
                    <input
                      id="pm-ct-email"
                      type="email"
                      placeholder="ramesh@example.com"
                      className="pm-input"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="pm-form-group">
                    <label htmlFor="pm-ct-project">Select Plotted Township *</label>
                    <select
                      id="pm-ct-project"
                      className="pm-select"
                      value={formData.project}
                      onChange={e => setFormData({ ...formData, project: e.target.value })}
                    >
                      {PLOT_PROJECTS.map(proj => (
                        <option key={proj.id} value={proj.id}>
                          {proj.name} — {proj.location} (from {proj.price})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pm-form-row-2">
                  <div className="pm-form-group">
                    <label htmlFor="pm-ct-size">Preferred Plot Size</label>
                    <select
                      id="pm-ct-size"
                      className="pm-select"
                      value={formData.plotSize}
                      onChange={e => setFormData({ ...formData, plotSize: e.target.value })}
                    >
                      <option value="150 – 200 Sq.Yds">150 – 200 Sq.Yds (Standard Villa Plot)</option>
                      <option value="200 – 300 Sq.Yds">200 – 300 Sq.Yds (Premium Residential)</option>
                      <option value="300 – 500 Sq.Yds">300 – 500 Sq.Yds (Grand Luxury Estate)</option>
                      <option value="500+ Sq.Yds">500+ Sq.Yds (Corner / Commercial Road)</option>
                    </select>
                  </div>
                  <div className="pm-form-group">
                    <label htmlFor="pm-ct-date">Preferred Site Visit Date</label>
                    <input
                      id="pm-ct-date"
                      type="date"
                      className="pm-input"
                      value={formData.visitDate}
                      onChange={e => setFormData({ ...formData, visitDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="pm-form-group">
                  <label htmlFor="pm-ct-message">Specific Requirements / Notes</label>
                  <textarea
                    id="pm-ct-message"
                    rows="3"
                    className="pm-textarea"
                    placeholder="Tell us if you prefer East/North facing, corner plots, bank loan pre-check, or need pickup from a specific Hyderabad location..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                >
                  {loading ? 'Submitting Request...' : '🚗 Request Free Site Visit Cab →'}
                </button>

                <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  🔒 No spam guarantee. Your contact details are kept strictly confidential under TS-RERA privacy standards.
                </div>
              </form>
            )}
          </div>

          {/* ── Right Column: Info Cards ── */}
          <div className="pm-contact-info-col">
            {/* Sales Hotlines */}
            <div className="pm-contact-side-card">
              <h3 className="pm-side-card-title">
                📞 Direct Developer Hotlines
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 1rem' }}>
                Instant assistance for plot availability, pricing sheets, and master layout verification.
              </p>

              <div className="pm-contact-contact-row">
                <span className="pm-contact-icon-badge">📞</span>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sales Desk (Direct):</div>
                  <a href={`tel:${siteConfig.phone}`} style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {siteConfig.phone}
                  </a>
                </div>
              </div>

              <div className="pm-contact-contact-row">
                <span className="pm-contact-icon-badge" style={{ background: 'rgba(37,211,102,0.15)', color: '#25D366' }}>💬</span>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>WhatsApp Instant Desk:</div>
                  <a href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#25D366' }}>
                    {siteConfig.whatsapp}
                  </a>
                </div>
              </div>

              <div className="pm-contact-contact-row">
                <span className="pm-contact-icon-badge">✉️</span>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email Assistance:</div>
                  <a href={`mailto:${siteConfig.email}`} style={{ fontSize: '0.9rem', color: 'var(--brand-gold)' }}>
                    {siteConfig.email}
                  </a>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem' }}>
                <a
                  href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                    "Hello! I am looking for residential plots in Hyderabad through PlotMark. Please share current availability."
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-whatsapp"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <span>💬</span> WhatsApp Live Chat
                </a>
              </div>
            </div>

            {/* Corporate & Site Offices */}
            <div className="pm-contact-side-card">
              <h3 className="pm-side-card-title">
                🏢 Registered Office &amp; Cab Hub
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6', margin: '0 0 0.85rem' }}>
                <strong>Central Office:</strong> {siteConfig.registeredOffice.fullAddress}
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6', margin: '0 0 0.85rem' }}>
                <strong>Doorstep Cab Pickups:</strong> Complimentary pickup hubs cover Gachibowli, Financial District, Miyapur, Kukatpally, Secunderabad, LB Nagar, and Shamshabad.
              </p>
              <div style={{ fontSize: '0.8rem', color: 'var(--brand-gold)', fontWeight: 600 }}>
                🕒 Office &amp; Site Visits: 9:00 AM – 7:30 PM (All 7 Days Open)
              </div>
            </div>

            {/* Legal & Banking Trust Badges */}
            <div className="pm-contact-side-card" style={{ borderColor: 'rgba(200,134,10,0.35)', background: 'rgba(200,134,10,0.04)' }}>
              <h3 className="pm-side-card-title" style={{ color: 'var(--brand-gold)' }}>
                🛡️ 100% Legal &amp; Bank Loan Guarantee
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span>
                  <span>100% HMDA / DTCP Final LP Sanctioned Numbers</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span>
                  <span>Valid TS-RERA Registered Townships</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span>
                  <span>Clear Marketable Title &amp; Immediate Spot Registration</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span>
                  <span>Pre-Sanctioned Loans from SBI, HDFC, ICICI &amp; LIC HFL</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── FAQ Section ── */}
        <div className="pm-contact-faq-section">
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 2.5rem' }}>
            <span className="badge" style={{ marginBottom: '0.5rem', background: 'rgba(200,134,10,0.15)', color: 'var(--brand-gold)' }}>
              Got Questions?
            </span>
            <h2 style={{ fontSize: '1.75rem', margin: '0.25rem 0 0.5rem', fontFamily: 'var(--font-display)' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              Everything you need to know about booking site visits, approvals, and plot registrations with PlotMark.
            </p>
          </div>

          <div className="pm-faq-list">
            {FAQS.map((faq, idx) => (
              <div key={idx} className={`pm-faq-item ${openFaq === idx ? 'open' : ''}`}>
                <button
                  type="button"
                  className="pm-faq-question"
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  aria-expanded={openFaq === idx}
                >
                  <span>{faq.q}</span>
                  <span className="pm-faq-icon">{openFaq === idx ? '−' : '+'}</span>
                </button>
                {openFaq === idx && (
                  <div className="pm-faq-answer">
                    <p style={{ margin: 0, lineHeight: '1.65', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main PlotMark Component ──────────────────────────────────────────────────
export default function PlotMarkDemo() {
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
  const [selectedProject, setSelectedProject] = useState(PLOT_PROJECTS[0]);
  const [projectStageFilter, setProjectStageFilter] = useState('all');
  const [navDropdownOpen, setNavDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navDropdownRef = useRef(null);
  const dropdownCloseTimeoutRef = useRef(null);

  const handleDropdownEnter = () => {
    if (dropdownCloseTimeoutRef.current) {
      clearTimeout(dropdownCloseTimeoutRef.current);
      dropdownCloseTimeoutRef.current = null;
    }
    setNavDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    if (dropdownCloseTimeoutRef.current) {
      clearTimeout(dropdownCloseTimeoutRef.current);
    }
    dropdownCloseTimeoutRef.current = setTimeout(() => {
      setNavDropdownOpen(false);
    }, 200);
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (navDropdownRef.current && !navDropdownRef.current.contains(e.target)) {
        if (dropdownCloseTimeoutRef.current) {
          clearTimeout(dropdownCloseTimeoutRef.current);
          dropdownCloseTimeoutRef.current = null;
        }
        setNavDropdownOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        if (dropdownCloseTimeoutRef.current) {
          clearTimeout(dropdownCloseTimeoutRef.current);
          dropdownCloseTimeoutRef.current = null;
        }
        setNavDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      if (dropdownCloseTimeoutRef.current) {
        clearTimeout(dropdownCloseTimeoutRef.current);
      }
    };
  }, []);
  const [plotsByProject, setPlotsByProject] = useState(() => ({
    'pm-shankarpally': generateProjectPlots('pm-shankarpally'),
    'pm-shamshabad': generateProjectPlots('pm-shamshabad'),
    'pm-pharmacity': generateProjectPlots('pm-pharmacity'),
    'pm-ghatkesar': generateProjectPlots('pm-ghatkesar'),
    'pm-kollur': generateProjectPlots('pm-kollur'),
    'pm-sadashivpet': generateProjectPlots('pm-sadashivpet'),
  }));
  const [brochureProject, setBrochureProject] = useState(null);
  const [showBrochuresListModal, setShowBrochuresListModal] = useState(false);
  const [visitProject, setVisitProject] = useState(null);
  const [visitDefaultPlot, setVisitDefaultPlot] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [siteVisits, setSiteVisits] = useState([]);

  const currentProjectPlots = plotsByProject[selectedProject?.id] || generateProjectPlots(selectedProject?.id || 'pm-shankarpally');

  function handleStatusChange(plotId, newStatus) {
    setPlotsByProject(prev => {
      const projId = selectedProject.id;
      const list = prev[projId] || generateProjectPlots(projId);
      const updated = list.map(p => (p.id === plotId ? { ...p, status: newStatus } : p));
      return { ...prev, [projId]: updated };
    });
  }

  function handleBookingSuccess(newVisit) {
    setSiteVisits(prev => [newVisit, ...prev]);
  }

  function handleSelectProject(proj) {
    setSelectedProject(proj);
    setActivePage('project-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleOpenLayout(proj) {
    if (proj) {
      setSelectedProject(proj);
    }
    setActivePage('layout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleOpenBrochure(proj) {
    setBrochureProject(proj || selectedProject || PLOT_PROJECTS[0]);
  }

  function handleOpenVisit(proj, plot = null) {
    setVisitProject(proj || selectedProject || PLOT_PROJECTS[0]);
    setVisitDefaultPlot(plot);
  }

  const PAGES = [
    { id: 'home', label: 'Home' },
    { id: 'projects', label: 'Open Plots' },
    { id: 'layout', label: 'Layout Map' },
    { id: 'highlights', label: 'Highlights' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact Us' },
  ];

  return (
    <div className="pm-demo">
      <DemoBar
        templateSlug="plotmark"
        templateName="PlotMark"
        label="📍 PlotMark — Premium Open Plot & Plotted Development Sales Website"
      />

      {/* Navigation */}
      <nav className="pm-nav" aria-label="PlotMark navigation">
        <div
          className="pm-nav__logo"
          onClick={() => setActivePage('home')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <span>🌳</span>
          <span>PlotMark</span>
        </div>

        <ul className="pm-nav__links">
          {PAGES.map(p => {
            if (p.id === 'projects') {
              return (
                <li
                  key={p.id}
                  ref={navDropdownRef}
                  className="pm-nav__item-dropdown"
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    className={`pm-nav__dropdown-trigger ${activePage === 'projects' ? 'active' : ''}`}
                    onClick={() => {
                      if (dropdownCloseTimeoutRef.current) {
                        clearTimeout(dropdownCloseTimeoutRef.current);
                        dropdownCloseTimeoutRef.current = null;
                      }
                      setProjectStageFilter('all');
                      setActivePage('projects');
                      setNavDropdownOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    aria-expanded={navDropdownOpen}
                    aria-haspopup="true"
                  >
                    <span>{p.label}</span>
                    <span className={`pm-nav__caret ${navDropdownOpen ? 'open' : ''}`}>▾</span>
                  </button>

                  {/* Dropdown Menu for Open Plot Projects: Ongoing, Completed, Upcoming */}
                  <div
                    className={`pm-nav__dropdown-menu ${navDropdownOpen ? 'show' : ''}`}
                    role="menu"
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <div className="pm-nav__dropdown-header">
                      <span className="pm-nav__dropdown-title">Explore by Project Status</span>
                      <span className="pm-nav__dropdown-sub">6 Masterplanned Townships</span>
                    </div>

                    <div className="pm-nav__dropdown-items">
                      <button
                        className={`pm-nav__dropdown-item ${activePage === 'projects' && projectStageFilter === 'all' ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (dropdownCloseTimeoutRef.current) {
                            clearTimeout(dropdownCloseTimeoutRef.current);
                            dropdownCloseTimeoutRef.current = null;
                          }
                          setProjectStageFilter('all');
                          setActivePage('projects');
                          setNavDropdownOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        role="menuitem"
                      >
                        <div className="pm-nav__item-icon">🌟</div>
                        <div className="pm-nav__item-content">
                          <div className="pm-nav__item-title">
                            All Projects
                            <span className="pm-nav__item-pill">6 Total</span>
                          </div>
                          <div className="pm-nav__item-desc">Browse all 6 plotted townships across Hyderabad</div>
                        </div>
                      </button>

                      <button
                        className={`pm-nav__dropdown-item ${activePage === 'projects' && projectStageFilter === 'ongoing' ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (dropdownCloseTimeoutRef.current) {
                            clearTimeout(dropdownCloseTimeoutRef.current);
                            dropdownCloseTimeoutRef.current = null;
                          }
                          setProjectStageFilter('ongoing');
                          setActivePage('projects');
                          setNavDropdownOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        role="menuitem"
                      >
                        <div className="pm-nav__item-thumb">
                          <img src="/images/plotmark-hero-aerial.jpg" alt="Ongoing Projects" />
                          <span className="pm-nav__thumb-badge ongoing">Ongoing</span>
                        </div>
                        <div className="pm-nav__item-content">
                          <div className="pm-nav__item-title">
                            Ongoing Projects
                            <span className="pm-nav__item-pill ongoing">2 Active</span>
                          </div>
                          <div className="pm-nav__item-desc">Under active development in Shankarpally & Shamshabad</div>
                        </div>
                      </button>

                      <button
                        className={`pm-nav__dropdown-item ${activePage === 'projects' && projectStageFilter === 'completed' ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (dropdownCloseTimeoutRef.current) {
                            clearTimeout(dropdownCloseTimeoutRef.current);
                            dropdownCloseTimeoutRef.current = null;
                          }
                          setProjectStageFilter('completed');
                          setActivePage('projects');
                          setNavDropdownOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        role="menuitem"
                      >
                        <div className="pm-nav__item-thumb">
                          <img src="/images/plot-completed-park.jpg" alt="Completed Projects" />
                          <span className="pm-nav__thumb-badge completed">Delivered</span>
                        </div>
                        <div className="pm-nav__item-content">
                          <div className="pm-nav__item-title">
                            Completed Projects
                            <span className="pm-nav__item-pill completed">2 Delivered</span>
                          </div>
                          <div className="pm-nav__item-desc">100% finished gated layouts ready for house construction</div>
                        </div>
                      </button>

                      <button
                        className={`pm-nav__dropdown-item ${activePage === 'projects' && projectStageFilter === 'upcoming' ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (dropdownCloseTimeoutRef.current) {
                            clearTimeout(dropdownCloseTimeoutRef.current);
                            dropdownCloseTimeoutRef.current = null;
                          }
                          setProjectStageFilter('upcoming');
                          setActivePage('projects');
                          setNavDropdownOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        role="menuitem"
                      >
                        <div className="pm-nav__item-thumb">
                          <img src="/images/plot-upcoming-master.jpg" alt="Upcoming Projects" />
                          <span className="pm-nav__thumb-badge upcoming">Pre-Launch</span>
                        </div>
                        <div className="pm-nav__item-content">
                          <div className="pm-nav__item-title">
                            Upcoming Projects
                            <span className="pm-nav__item-pill upcoming">2 Pre-Launch</span>
                          </div>
                          <div className="pm-nav__item-desc">Inaugural investor pricing & priority token bookings</div>
                        </div>
                      </button>
                    </div>

                    <div
                      className="pm-nav__dropdown-footer"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (dropdownCloseTimeoutRef.current) {
                          clearTimeout(dropdownCloseTimeoutRef.current);
                          dropdownCloseTimeoutRef.current = null;
                        }
                        setProjectStageFilter('all');
                        setActivePage('projects');
                        setNavDropdownOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <span>🚀 Pre-Launch Token Booking starting at ₹21.50 Lakhs</span>
                      <span className="pm-nav__dropdown-link">View All →</span>
                    </div>
                  </div>
                </li>
              );
            }

            return (
              <li key={p.id}>
                <button
                  className={activePage === p.id ? 'active' : ''}
                  onClick={() => {
                    setActivePage(p.id);
                    setNavDropdownOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  aria-current={activePage === p.id ? 'page' : undefined}
                >
                  {p.label}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="pm-nav__actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className="btn btn-primary btn-sm pm-nav__visit-btn"
            onClick={() => handleOpenVisit(selectedProject || PLOT_PROJECTS[0])}
            aria-label="Book a site visit"
          >
            🚗 Book a Visit
          </button>
          {/* Three Horizontal Lines Hamburger Button for Mobile & Tab */}
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

      {/* Mobile & Tablet Responsive Navigation Drawer */}
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
              className="pm-nav__logo"
              onClick={() => {
                setActivePage('home');
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <span>🌳</span>
              <span>PlotMark</span>
            </div>
            <button
              className="pm-mobile-drawer__close"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
            >
              ✕
            </button>
          </div>

          <nav className="pm-mobile-drawer__nav">
            <div className="pm-mobile-nav__group">
              <span className="pm-mobile-nav__label">Navigation Menu</span>

              <button
                className={`pm-mobile-nav__item ${activePage === 'home' ? 'active' : ''}`}
                onClick={() => {
                  setActivePage('home');
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <span className="pm-mobile-nav__icon">🏠</span>
                <span className="pm-mobile-nav__text">Home</span>
                {activePage === 'home' && <span className="pm-mobile-nav__dot">●</span>}
              </button>

              <div className="pm-mobile-nav__section">
                <button
                  className={`pm-mobile-nav__item ${activePage === 'projects' ? 'active' : ''}`}
                  onClick={() => {
                    setProjectStageFilter('all');
                    setActivePage('projects');
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <span className="pm-mobile-nav__icon">🏷️</span>
                  <span className="pm-mobile-nav__text">Open Plots</span>
                  <span className="pm-nav__item-pill">6 Total</span>
                </button>

                <div className="pm-mobile-nav__sublinks">
                  <button
                    className={`pm-mobile-nav__sublink ${activePage === 'projects' && projectStageFilter === 'ongoing' ? 'active' : ''}`}
                    onClick={() => {
                      setProjectStageFilter('ongoing');
                      setActivePage('projects');
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <span>⚡ Ongoing Projects</span>
                    <span className="pm-nav__thumb-badge-inline ongoing">2 Active</span>
                  </button>
                  <button
                    className={`pm-mobile-nav__sublink ${activePage === 'projects' && projectStageFilter === 'completed' ? 'active' : ''}`}
                    onClick={() => {
                      setProjectStageFilter('completed');
                      setActivePage('projects');
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <span>✅ Completed Projects</span>
                    <span className="pm-nav__thumb-badge-inline completed">2 Delivered</span>
                  </button>
                  <button
                    className={`pm-mobile-nav__sublink ${activePage === 'projects' && projectStageFilter === 'upcoming' ? 'active' : ''}`}
                    onClick={() => {
                      setProjectStageFilter('upcoming');
                      setActivePage('projects');
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <span>🚀 Upcoming Projects</span>
                    <span className="pm-nav__thumb-badge-inline upcoming">2 Pre-Launch</span>
                  </button>
                </div>
              </div>

              <button
                className={`pm-mobile-nav__item ${activePage === 'layout' ? 'active' : ''}`}
                onClick={() => {
                  setActivePage('layout');
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <span className="pm-mobile-nav__icon">🗺️</span>
                <span className="pm-mobile-nav__text">Layout Map</span>
                {activePage === 'layout' && <span className="pm-mobile-nav__dot">●</span>}
              </button>

              <button
                className={`pm-mobile-nav__item ${activePage === 'highlights' ? 'active' : ''}`}
                onClick={() => {
                  setActivePage('highlights');
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <span className="pm-mobile-nav__icon">✨</span>
                <span className="pm-mobile-nav__text">Highlights</span>
                {activePage === 'highlights' && <span className="pm-mobile-nav__dot">●</span>}
              </button>

              <button
                className={`pm-mobile-nav__item ${activePage === 'gallery' ? 'active' : ''}`}
                onClick={() => {
                  setActivePage('gallery');
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <span className="pm-mobile-nav__icon">🖼️</span>
                <span className="pm-mobile-nav__text">Gallery</span>
                {activePage === 'gallery' && <span className="pm-mobile-nav__dot">●</span>}
              </button>

              <button
                className={`pm-mobile-nav__item ${activePage === 'contact' ? 'active' : ''}`}
                onClick={() => {
                  setActivePage('contact');
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <span className="pm-mobile-nav__icon">📞</span>
                <span className="pm-mobile-nav__text">Contact Us &amp; Site Visits</span>
                {activePage === 'contact' && <span className="pm-mobile-nav__dot">●</span>}
              </button>
            </div>
          </nav>

          <div className="pm-mobile-drawer__footer">
            <button
              className="btn btn-outline pm-mobile-drawer__btn"
              onClick={() => {
                setMobileMenuOpen(false);
                setShowBrochuresListModal(true);
              }}
            >
              <span>📥</span>
              <span>Download Project Brochures</span>
            </button>
            <button
              className="btn btn-primary pm-mobile-drawer__btn"
              onClick={() => {
                setMobileMenuOpen(false);
                handleOpenVisit(selectedProject || PLOT_PROJECTS[0]);
              }}
            >
              <span>🚗</span>
              <span>Book Free Site Visit</span>
            </button>

            <div className="pm-mobile-drawer__contact">
              <a
                href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                  "Hello PlotMark! I would like to enquire about open plot townships."
                )}`}
                target="_blank"
                rel="noreferrer"
                className="pm-mobile-whatsapp-link"
              >
                <span>💬</span> Chat on WhatsApp
              </a>
              <a href={`tel:${siteConfig.phone}`} className="pm-mobile-phone" style={{ color: 'inherit', textDecoration: 'none' }}>
                📞 {siteConfig.phone}
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* Main Content Router */}
      <main className="pm-main">
        {activePage === 'home' && (
          <HomePage
            setActivePage={setActivePage}
            onSelectProject={handleSelectProject}
            onOpenLayout={handleOpenLayout}
            onOpenBrochure={handleOpenBrochure}
            onOpenBrochuresList={() => setShowBrochuresListModal(true)}
            onOpenVisit={handleOpenVisit}
            plots={currentProjectPlots}
          />
        )}
        {activePage === 'projects' && (
          <ProjectsPage
            initialStage={projectStageFilter}
            onStageChange={setProjectStageFilter}
            onSelectProject={handleSelectProject}
            onOpenLayout={handleOpenLayout}
            onOpenBrochure={handleOpenBrochure}
            onOpenBrochuresList={() => setShowBrochuresListModal(true)}
            onOpenVisit={handleOpenVisit}
          />
        )}
        {activePage === 'project-detail' && (
          <ProjectDetailPage
            project={selectedProject}
            onBack={() => setActivePage('projects')}
            onOpenLayout={handleOpenLayout}
            onOpenBrochure={handleOpenBrochure}
            onOpenBrochuresList={() => setShowBrochuresListModal(true)}
            onOpenVisit={handleOpenVisit}
          />
        )}
        {activePage === 'layout' && (
          <LayoutPage
            activeProject={selectedProject}
            onSelectProject={setSelectedProject}
            plots={currentProjectPlots}
            onStatusChange={handleStatusChange}
            onBookVisit={handleOpenVisit}
            onOpenBrochure={handleOpenBrochure}
            onOpenBrochuresList={() => setShowBrochuresListModal(true)}
          />
        )}
        {(activePage === 'highlights' || activePage === 'amenities' || activePage === 'location') && (
          <div className="pm-highlights-merged">
            <div style={{ textAlign: 'center', maxWidth: '720px', margin: '3rem auto 1rem', padding: '0 1rem' }}>
              <span className="badge" style={{ marginBottom: '0.75rem' }}>
                🌟 Amenities & Strategic Location
              </span>
              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', margin: '0.5rem 0', fontFamily: 'var(--font-display)' }}>
                Highlights
              </h1>
              <p style={{ color: 'var(--text-muted)', margin: '0 auto' }}>
                Comprehensive township infrastructure, completed clubhouse amenities, and high-yield strategic connectivity.
              </p>
            </div>
            <AmenitiesPage onOpenVisit={handleOpenVisit} />
            <LocationPage onOpenVisit={handleOpenVisit} />
          </div>
        )}
        {activePage === 'gallery' && <GalleryPage />}
        {activePage === 'contact' && (
          <ContactPage
            onOpenVisit={handleOpenVisit}
            initialProject={selectedProject}
            onSelectProject={handleSelectProject}
            setActivePage={setActivePage}
          />
        )}
      </main>

      {/* Modals */}
      {showBrochuresListModal && (
        <BrochuresListModal
          onClose={() => setShowBrochuresListModal(false)}
          onViewBrochure={(proj) => {
            setShowBrochuresListModal(false);
            setBrochureProject(proj);
          }}
        />
      )}

      {brochureProject && (
        <BrochureModal
          project={brochureProject}
          onClose={() => setBrochureProject(null)}
        />
      )}

      {visitProject && (
        <SiteVisitModal
          project={visitProject}
          defaultPlot={visitDefaultPlot}
          onClose={() => {
            setVisitProject(null);
            setVisitDefaultPlot(null);
          }}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {showAdmin && (
        <AdminModal
          activeProject={selectedProject}
          onSelectProject={setSelectedProject}
          plots={currentProjectPlots}
          onStatusChange={handleStatusChange}
          siteVisits={siteVisits}
          onClose={() => setShowAdmin(false)}
        />
      )}

      {/* ── Rich Multi-Column Footer ── */}
      <footer className="pm-footer" role="contentinfo">
        <div className="container pm-footer__container">
          {/* Column 1: Brand & Overview */}
          <div className="pm-footer__brand-col">
            <div
              className="pm-nav__logo"
              onClick={() => {
                setActivePage('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginBottom: '0.85rem' }}
            >
              <span>🌳</span>
              <span>PlotMark — Plotted Developments</span>
            </div>
            <p className="pm-footer__brand-desc">
              Hyderabad’s premier open plot &amp; gated residential township showcase. 100% verified clear marketable titles, final HMDA/DTCP technical sanctions, spot registration, and pre-approved bank loans.
            </p>
            <div style={{ marginTop: '1.25rem' }}>
              <a
                href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                  "Hello PlotMark! I would like to talk to a property sales advisor regarding available plotted layouts."
                )}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-whatsapp btn-sm"
              >
                <span>💬</span> Chat with Sales Advisor
              </a>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div>
            <h4 className="pm-footer__col-title">Quick Navigation</h4>
            <ul className="pm-footer__links">
              <li>
                <button
                  type="button"
                  className="pm-footer__link"
                  onClick={() => {
                    setActivePage('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="pm-footer__link"
                  onClick={() => {
                    setProjectStageFilter('all');
                    setActivePage('projects');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  All Plotted Townships (6)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="pm-footer__link"
                  onClick={() => {
                    setActivePage('layout');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Interactive Layout Map
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="pm-footer__link"
                  onClick={() => {
                    setActivePage('highlights');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Highlights
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="pm-footer__link"
                  onClick={() => {
                    setActivePage('gallery');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Photo Gallery
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="pm-footer__link"
                  style={{ color: 'var(--brand-gold)', fontWeight: 600 }}
                  onClick={() => {
                    setActivePage('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Contact Us &amp; Site Visits
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Our Townships */}
          <div>
            <h4 className="pm-footer__col-title">Our Townships</h4>
            <ul className="pm-footer__links">
              {PLOT_PROJECTS.map(proj => (
                <li key={proj.id}>
                  <button
                    type="button"
                    className="pm-footer__link"
                    onClick={() => {
                      setSelectedProject(proj);
                      setActivePage('project-detail');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    {proj.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  className="pm-footer__link"
                  style={{ color: '#10b981', fontWeight: 600 }}
                  onClick={() => {
                    handleOpenVisit(selectedProject || PLOT_PROJECTS[0]);
                  }}
                >
                  🚗 Schedule Free Cab Visit →
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Office & Sales Desk */}
          <div>
            <h4 className="pm-footer__col-title">Office &amp; Contacts</h4>
            <p className="pm-footer__info-item">
              📍 <strong>Central Office:</strong> {siteConfig.registeredOffice.fullAddress}
            </p>
            <p className="pm-footer__info-item">
              📞 <strong>Sales Desk:</strong> <a href={`tel:${siteConfig.phone}`}>{siteConfig.phone}</a>
            </p>
            <p className="pm-footer__info-item">
              💬 <strong>WhatsApp:</strong> <a href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ color: '#25D366' }}>{siteConfig.whatsapp}</a>
            </p>
            <p className="pm-footer__info-item">
              ✉️ <strong>Email:</strong> <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </p>
            <div className="pm-footer__hours">
              🕒 <strong>Timings:</strong> 9:00 AM – 7:30 PM (All 7 Days Open)
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="container pm-footer__bottom">
          <div className="pm-footer__copyright">
            © 2026 <strong>PlotMark — Plotted Developments</strong>. Showcase template developed for <Link to="/" style={{ color: 'var(--brand-gold)', textDecoration: 'underline' }}>DeccanIDentity</Link>.
          </div>
          <div className="pm-footer__bottom-actions">
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              TS-RERA Registered &amp; Final HMDA Sanctions
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
