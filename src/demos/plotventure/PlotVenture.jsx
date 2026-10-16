import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  STATUS_COLORS,
  STATUS_LABELS,
  PV_LAYOUT_CONFIG,
  generateVenturePlots,
} from './plotVentureData.js';
import './PlotVenture.css';

// ─── Brochure Download Function (Direct & Unrestricted) ───────────────────────
export function downloadProjectBrochure(project) {
  const proj = project || PROJECTS[0];
  const projName = proj?.name || 'Green-County-Elite';
  const blobContent = `========================================================================
${projName.toUpperCase()} — OFFICIAL TOWNSHIP BROCHURE & MASTERPLAN
========================================================================
Developer: PlotVenture Plotted Developments (DeccanIDentity Real Estate)
Corridor: ${proj?.location || 'Hyderabad Growth Corridor'}
Government Approval: ${proj?.approvalDetails || proj?.approval || 'HMDA & RERA Approved'}
Project Category: ${proj?.category || 'Gated Layouts'}
Project Stage: ${proj?.stageLabel || 'Ongoing Development'}
Total Township Area: ${proj?.totalAcres || '42 Acres'}
Plot Size Range: ${proj?.plotSizes || '165 – 400 Sq.Yds'}
Starting Price: ${proj?.minPrice || '₹32 Lakhs*'} (Rate: ₹${(proj?.ratePerSqYd || 19500).toLocaleString('en-IN')}/Sq.Yd)
Live Availability: ${proj?.availablePlots || 'Available'} Sanctioned Plots Ready for Registration

------------------------------------------------------------------------
1. PROJECT HIGHLIGHTS & TOWNSHIP SPECIFICATIONS
------------------------------------------------------------------------
${(proj?.highlights || [
  '100% Vaastu Compliant Layout',
  '40-ft & 30-ft Wide Blacktop Roads with Kerb Stones',
  'Underground Electrical Cabling & Concealed Drainage',
  'Grand Entrance Arch with 24/7 Security Cabin',
  'Overhead Water Tank with 24/7 Water Supply',
  'Pre-Approved Bank Loans (SBI, HDFC, ICICI, Axis Bank)',
]).map(h => `• ${h}`).join('\n')}

------------------------------------------------------------------------
2. ROADS & INFRASTRUCTURE
------------------------------------------------------------------------
Road Network: ${proj?.roads || '40-ft Main Boulevard & 30-ft Internal BT Roads'}
Utilities: ${proj?.utilities || 'Underground Drainage, Concealed Power Grid, Overhead Water Tank & STP'}

Completed Facilities:
${(proj?.completedFacilities || [
  'Grand Entrance Gateway with 24x7 Security Cabin & Smart Boom Barrier',
  'Asphalt Blacktop Roads with Kerb Stones & Stormwater Drains',
  'Solar-Fenced Outer Compound Wall with Guard Posts',
  'Underground Drainage & Water Distribution Network',
]).map(f => `  [✓] ${f}`).join('\n')}

------------------------------------------------------------------------
3. STRATEGIC LOCATION CONNECTIVITY
------------------------------------------------------------------------
${(proj?.locationAdvantages || [
  { landmark: 'Outer Ring Road (ORR) Exit', dist: '5 mins' },
  { landmark: 'Rajiv Gandhi International Airport (RGIA)', dist: '18 mins' },
  { landmark: 'HITEC City & Financial District', dist: '30 mins' },
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
Website: https://deccanidentity.com/demo/plotventure
========================================================================`;

  const blob = new Blob([blobContent], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${projName.replace(/\s+/g, '-')}-Official-Brochure.txt`;
  link.click();
}

// ─── Single Plot Details Modal ────────────────────────────────────────────────
function PlotModal({ plot, project, onClose, onEnquire, onBookVisit, onStatusChange }) {
  if (!plot) return null;
  const isAvailable = plot.status === 'available';

  return (
    <div className="pv-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="plot-modal-title">
      <div className="pv-modal" onClick={e => e.stopPropagation()}>
        <button className="pv-modal__close" onClick={onClose} aria-label="Close">×</button>
        
        <div className="pv-modal__header">
          <div>
            <h3 id="plot-modal-title" style={{ margin: 0, fontSize: '1.3rem' }}>Plot #{plot.label}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--pv-text-muted)' }}>
              {project?.name || 'PlotVenture Township'} · {plot.sector}
            </span>
          </div>
          <span
            className="pv-status-badge"
            style={{
              background: `${STATUS_COLORS[plot.status]}22`,
              color: STATUS_COLORS[plot.status],
              border: `1px solid ${STATUS_COLORS[plot.status]}55`,
            }}
          >
            {STATUS_LABELS[plot.status]}
          </span>
        </div>

        <div className="pv-modal__details-grid">
          <div className="pv-modal__detail-item">
            <span>Plot Area</span>
            <strong>{plot.area} Sq.Yds</strong>
          </div>
          <div className="pv-modal__detail-item">
            <span>Dimensions</span>
            <strong>{plot.dimensions || "30' x 45'"}</strong>
          </div>
          <div className="pv-modal__detail-item">
            <span>Facing</span>
            <strong>{plot.facing} Facing</strong>
          </div>
          <div className="pv-modal__detail-item">
            <span>Road Width</span>
            <strong>{plot.road}</strong>
          </div>
          <div className="pv-modal__detail-item">
            <span>Total Price</span>
            <strong style={{ color: 'var(--pv-gold)' }}>₹{plot.price} Lakhs*</strong>
          </div>
          <div className="pv-modal__detail-item">
            <span>Corner Plot</span>
            <strong>{plot.corner ? '⭐ Yes (Prime Corner)' : 'Standard Plot'}</strong>
          </div>
        </div>

        <p style={{ fontSize: '0.75rem', color: 'var(--pv-text-muted)', margin: '12px 0' }}>
          * Price indicative. Clear title with immediate spot registration and bank loan approvals (up to 75%).
        </p>

        <div className="pv-modal__actions">
          {isAvailable ? (
            <>
              <button
                className="pv-btn-gold"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => onEnquire(plot)}
              >
                💬 Enquire About Plot #{plot.label}
              </button>
              <button
                className="pv-btn-outline"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => onBookVisit(project, plot)}
              >
                🚗 Schedule Free Site Visit
              </button>
            </>
          ) : (
            <div style={{
              background: 'rgba(220, 38, 38, 0.1)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'center',
              fontSize: '0.8125rem',
              color: '#ef4444'
            }}>
              ⚠️ <strong>Plot #{plot.label} is currently {STATUS_LABELS[plot.status]}.</strong>
              <div style={{ color: 'var(--pv-text-muted)', fontSize: '0.75rem', marginTop: 4 }}>
                Online booking is disabled for this plot. Please explore other available plots.
              </div>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--pv-navy-border)', fontSize: '0.75rem', color: 'var(--pv-text-muted)' }}>
            <span>Demo Status:</span>
            <select
              value={plot.status}
              onChange={(e) => onStatusChange(plot.id, e.target.value)}
              className="pv-filter-select"
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

// ─── Single Project Brochure Modal (Instant View & Direct Download) ────────────
function BrochureModal({ project, onClose }) {
  const [downloaded, setDownloaded] = useState(false);
  const proj = project || PROJECTS[0];

  function handleDirectDownload() {
    downloadProjectBrochure(proj);
    setDownloaded(true);
  }

  return (
    <div className="pv-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="brochure-title">
      <div className="pv-modal pv-brochure-modal" onClick={e => e.stopPropagation()}>
        <button className="pv-modal__close" onClick={onClose} aria-label="Close">×</button>

        <div className="pv-bmodal-header">
          <div className="pv-badge" style={{ marginBottom: 6 }}>Official Township Document</div>
          <h2 id="brochure-title" style={{ fontSize: '1.35rem', margin: '4px 0 6px' }}>{proj.name}</h2>
          <p style={{ color: 'var(--pv-text-muted)', fontSize: '0.875rem', margin: 0 }}>
            📍 {proj.location} · <strong style={{ color: 'var(--pv-gold)' }}>{proj.approvalDetails || proj.approval}</strong>
          </p>
        </div>

        {downloaded && (
          <div className="pv-alert pv-alert--success" style={{ margin: '12px 0 0' }}>
            <span>✅ Official brochure file downloaded directly to your device!</span>
          </div>
        )}

        <div className="pv-bmodal-body">
          <div className="pv-bmodal-preview-grid">
            <div className="pv-bmodal-cover-wrap">
              <img src={proj.image} alt={proj.name} className="pv-bmodal-cover-img" />
              <div className="pv-bmodal-badge">{proj.stageLabel || proj.category}</div>
            </div>
            <div className="pv-bmodal-specs">
              <div className="pv-bmodal-spec-row">
                <span>Plot Area:</span>
                <strong>{proj.plotSizes}</strong>
              </div>
              <div className="pv-bmodal-spec-row">
                <span>Base Rate:</span>
                <strong>₹{(proj.ratePerSqYd || 19500).toLocaleString('en-IN')}/Sq.Yd</strong>
              </div>
              <div className="pv-bmodal-spec-row">
                <span>Starting Cost:</span>
                <strong style={{ color: 'var(--pv-gold)' }}>{proj.minPrice}</strong>
              </div>
              <div className="pv-bmodal-spec-row">
                <span>Registration:</span>
                <strong style={{ color: '#16a34a' }}>Spot Sub-Registrar</strong>
              </div>
              <div className="pv-bmodal-spec-row">
                <span>Bank Loan:</span>
                <strong>Up to 75% Pre-Approved</strong>
              </div>
            </div>
          </div>

          <div className="pv-bmodal-highlights">
            <h4 style={{ fontSize: '0.875rem', marginBottom: 8, color: 'var(--pv-text-main)' }}>Key Township Features:</h4>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.8125rem', color: 'var(--pv-text-muted)', lineHeight: 1.6 }}>
              {(proj.highlights || []).slice(0, 4).map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pv-bmodal-actions">
          <button
            className="pv-btn-gold"
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
            className="pv-btn-outline"
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
    return PROJECTS.filter(proj => {
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
    <div className="pv-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="brochures-list-title">
      <div className="pv-modal pv-brochures-list-modal" onClick={e => e.stopPropagation()}>
        <button className="pv-modal__close" onClick={onClose} aria-label="Close">×</button>

        <div className="pv-blist-header">
          <div className="pv-badge" style={{ marginBottom: 4 }}>Unrestricted Direct Access</div>
          <h2 id="brochures-list-title" style={{ fontSize: '1.4rem', margin: '4px 0 6px' }}>
            Official Plotted Township Brochures
          </h2>
          <p style={{ color: 'var(--pv-text-muted)', fontSize: '0.85rem', margin: 0 }}>
            Download verified layout masterplans, approval documents, and pricing sheets directly — no contact details or signup required.
          </p>
        </div>

        <div className="pv-blist-toolbar">
          <div className="pv-stage-tabs" role="tablist">
            {[
              ['all', `All Ventures (${PROJECTS.length})`],
              ['ongoing', 'Ongoing (1)'],
              ['completed', 'Ready / Completed (1)'],
              ['upcoming', 'New Launch (1)'],
            ].map(([val, label]) => (
              <button
                key={val}
                className={`pv-stage-tab ${filterStage === val ? 'active' : ''}`}
                onClick={() => setFilterStage(val)}
                role="tab"
                aria-selected={filterStage === val}
              >
                {label}
              </button>
            ))}
          </div>

          <input
            className="pv-plot-search-input"
            placeholder="🔍 Search venture or corridor..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 220 }}
            aria-label="Search brochures"
          />
        </div>

        {downloadSuccessId && (
          <div className="pv-alert pv-alert--success" style={{ margin: '12px 0 0' }}>
            <span>✅ Official brochure document downloaded directly to your device!</span>
          </div>
        )}

        <div className="pv-blist-grid">
          {filteredBrochures.map(proj => (
            <div key={proj.id} className="pv-blist-card">
              <div className="pv-blist-card__thumb">
                <img src={proj.image} alt={proj.name} />
                <span className={`pv-stage-pill ${proj.stage}`}>{proj.stage}</span>
              </div>
              <div className="pv-blist-card__content">
                <h3 className="pv-blist-card__title">{proj.name}</h3>
                <div className="pv-blist-card__loc">📍 {proj.location}</div>
                <div className="pv-blist-card__specs">
                  <span>📐 {proj.plotSizes}</span>
                  <span style={{ color: 'var(--pv-gold)', fontWeight: 700 }}>💰 From {proj.minPrice}</span>
                  <span>🛡️ {proj.approval}</span>
                </div>
                <div className="pv-blist-card__approval">
                  {proj.approvalDetails}
                </div>
              </div>
              <div className="pv-blist-card__actions">
                <button
                  className="pv-btn-outline pv-btn-sm"
                  onClick={() => {
                    onClose();
                    onViewBrochure(proj);
                  }}
                  title="View Brochure Details"
                >
                  👁️ View
                </button>
                <button
                  className="pv-btn-gold pv-btn-sm"
                  onClick={() => handleDownloadBrochure(proj)}
                  title="Direct Download Brochure Document"
                >
                  📥 Download
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="pv-blist-footer">
          <span style={{ color: 'var(--pv-text-muted)', fontSize: '0.8125rem' }}>
            All documents are verified with HMDA, DTCP & Telangana RERA sanction records.
          </span>
          <button className="pv-btn-outline pv-btn-sm" onClick={onClose}>
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
    projectId: project ? project.id : PROJECTS[0].id,
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    timeSlot: 'Morning (10:00 AM – 01:00 PM)',
    message: defaultPlot ? `Interested in inspecting Plot #${defaultPlot.label} (${defaultPlot.area} Sq.Yds)` : '',
  });
  const [loading, setLoading] = useState(false);
  const [bookingRef, setBookingRef] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const refId = `PV-VISIT-${Math.floor(100000 + Math.random() * 900000)}`;
      setBookingRef(refId);
      setLoading(false);
      if (onBookingSuccess) {
        onBookingSuccess({
          refId,
          ...formData,
          createdAt: new Date().toLocaleTimeString(),
        });
      }
    }, 600);
  }

  const selectedProj = PROJECTS.find(p => p.id === formData.projectId) || PROJECTS[0];

  return (
    <div className="pv-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="visit-modal-title">
      <div className="pv-modal" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
        <button className="pv-modal__close" onClick={onClose} aria-label="Close">×</button>
        
        <h3 id="visit-modal-title" style={{ margin: '0 0 4px', fontSize: '1.25rem' }}>Schedule a Site Visit</h3>
        <p style={{ color: 'var(--pv-text-muted)', fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
          Complimentary AC cab pickup & guided plot walkthrough with our senior project advisors.
        </p>

        {bookingRef ? (
          <div style={{ textAlign: 'center', padding: '0.75rem 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🚗✅</div>
            <h4 style={{ color: '#16a34a', fontSize: '1.15rem', marginBottom: '6px' }}>Site Visit Scheduled!</h4>
            <div style={{
              background: 'var(--pv-gold-dim)',
              border: '1px solid var(--pv-gold-glow)',
              borderRadius: '8px',
              padding: '12px',
              margin: '12px 0',
              fontSize: '0.8125rem'
            }}>
              <div>Booking Reference: <strong style={{ color: 'var(--pv-gold)' }}>{bookingRef}</strong></div>
              <div style={{ color: 'var(--pv-text-muted)', marginTop: 4 }}>
                Venture: <strong>{selectedProj.name}</strong> · Date: <strong>{formData.date}</strong>
              </div>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--pv-text-muted)', marginBottom: 16 }}>
              Our relationship manager will contact you at <strong>{formData.phone}</strong> to coordinate pickup.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="pv-btn-gold"
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
                💬 WhatsApp Confirmation
              </button>
              <button className="pv-btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--pv-text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                SELECT PLOTTED VENTURE *
              </label>
              <select
                className="pv-filter-select"
                style={{ width: '100%' }}
                value={formData.projectId}
                onChange={e => setFormData({ ...formData, projectId: e.target.value })}
              >
                {PROJECTS.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.location.split(',')[0]} ({p.minPrice})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--pv-text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                YOUR FULL NAME *
              </label>
              <input
                className="pv-input"
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--pv-text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                PHONE NUMBER *
              </label>
              <input
                className="pv-input"
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
                <label style={{ fontSize: '0.75rem', color: 'var(--pv-text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  VISIT DATE *
                </label>
                <input
                  className="pv-input"
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--pv-text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  TIME SLOT *
                </label>
                <select
                  className="pv-filter-select"
                  style={{ width: '100%' }}
                  value={formData.timeSlot}
                  onChange={e => setFormData({ ...formData, timeSlot: e.target.value })}
                >
                  <option value="Morning (10:00 AM – 01:00 PM)">10 AM – 1 PM</option>
                  <option value="Afternoon (02:00 PM – 05:00 PM)">2 PM – 5 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--pv-text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                SPECIAL NOTES (OPTIONAL)
              </label>
              <input
                className="pv-input"
                placeholder="E.g., Require cab pickup, specific plot query"
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="pv-btn-gold"
              disabled={loading}
              style={{ justifyContent: 'center', marginTop: 4, width: '100%' }}
            >
              {loading ? 'Confirming Site Visit...' : '🚗 Confirm Free Site Visit'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Interactive Layout Masterplan Page Component ─────────────────────────────
function LayoutPage({
  activeProject,
  onSelectProject,
  plots,
  onStatusChange,
  onBookVisit,
  onOpenBrochure,
  onOpenBrochuresList,
  onSelectPlotModal,
}) {
  const project = activeProject || PROJECTS[0];
  const config = PV_LAYOUT_CONFIG[project.id] || PV_LAYOUT_CONFIG['green-county-elite'];

  const [selected, setSelected] = useState(() => plots.find(p => p.status === 'available') || plots[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [facingFilter, setFacingFilter] = useState('all');
  const [cornerOnly, setCornerOnly] = useState(false);

  // Layout Plan Switcher & Pan/Zoom Controls
  const [activePlanType, setActivePlanType] = useState('interactive'); // 'interactive' | 'blueprint' | 'masterplan'
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchStartDist, setTouchStartDist] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const viewportRef = useRef(null);

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
Approval: ${project.approvalDetails || project.approval}
Registration: Spot Sub-Registrar Registration Available

Contact: ${siteConfig.phone} | WhatsApp: ${siteConfig.whatsapp}
Website: https://deccanidentity.com/demo/plotventure
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${project.id}-Plot-${plot.label}-Specifications.txt`;
    link.click();
  }

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

  const blueprintSrc = '/images/actual-site-layout.png';
  const masterplanSrc = project.image || '/images/plotventure-hero.jpg';

  return (
    <div className="pv-layout-page pv-section" style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem' }}>
      {/* ── 0. Project Selector Bar ── */}
      <div className="pv-layout-project-selector">
        <span className="pv-layout-project-label">Select Plotted Venture:</span>
        <div className="pv-layout-project-pills" role="tablist">
          {PROJECTS.map(proj => {
            const isCurrent = project.id === proj.id;
            return (
              <button
                key={proj.id}
                className={`pv-proj-pill ${isCurrent ? 'active' : ''}`}
                onClick={() => onSelectProject(proj.id)}
                role="tab"
                aria-selected={isCurrent}
              >
                <span className="pv-proj-pill__title">
                  {proj.name}
                  {isCurrent && <span style={{ color: 'var(--pv-gold)', marginLeft: 4 }}>✓</span>}
                </span>
                <span className="pv-proj-pill__meta">
                  {proj.location.split(',')[0]} · {proj.approval.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 1. Top Header Box ── */}
      <div className="pv-layout-header-box">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: 6 }}>
            <span className="pv-badge">Interactive Masterplan</span>
            <span style={{ fontSize: '0.8125rem', color: '#16a34a', fontWeight: 600 }}>
              ● Live Synchronized Availability
            </span>
            <span className="pv-badge" style={{ background: 'var(--pv-gold-dim)', color: 'var(--pv-gold)' }}>
              Rate: ₹{(config.basePricePerYd).toLocaleString('en-IN')}/Sq.Yd
            </span>
          </div>
          <h1 className="pv-title" style={{ fontSize: '1.75rem', margin: '4px 0' }}>
            {project.name} — Interactive Layout Masterplan
          </h1>
          <p style={{ color: 'var(--pv-text-muted)', fontSize: '0.875rem', margin: 0 }}>
            {project.approvalDetails || project.approval} · 100% Vaastu Compliant Sanctioned Plotted Township
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            className="pv-btn-outline pv-btn-sm"
            onClick={() => onOpenBrochuresList ? onOpenBrochuresList() : onOpenBrochure(project)}
            aria-label="View and download project brochures"
          >
            📥 All Brochures ({PROJECTS.length})
          </button>
          <button
            className="pv-btn-gold pv-btn-sm"
            onClick={() => onBookVisit(project, selected)}
            aria-label="Schedule a site visit"
          >
            🚗 Book a Visit
          </button>
        </div>
      </div>

      {/* ── 2. Controls & Search Toolbar ── */}
      <div className="pv-layout-controls">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <input
            className="pv-plot-search-input"
            placeholder="🔍 Search Plot # (e.g. 101)"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              const found = plots.find(p => p.label.toLowerCase() === e.target.value.toLowerCase().replace('#', '').trim());
              if (found) setSelected(found);
            }}
            aria-label="Search plot number"
          />

          <select
            className="pv-filter-select"
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

          <select
            className="pv-filter-select"
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

          <select
            className="pv-filter-select"
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

          <button
            className={`pv-btn-sm ${cornerOnly ? 'pv-btn-gold' : 'pv-btn-outline'}`}
            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            onClick={() => setCornerOnly(!cornerOnly)}
            title="Show only corner plots"
          >
            ⭐ Corner Only
          </button>
        </div>
      </div>

      {/* ── 3. Split Layout: Canvas / Interactive SVG on Left, Inspector on Right ── */}
      <div className="pv-layout-split">
        {/* Left Side */}
        <div>
          {/* Legend Strip */}
          <div className="pv-plot-legend" style={{ marginBottom: 12 }}>
            <div className="pv-legend-item">
              <span style={{ background: STATUS_COLORS.available }} />
              <span>Available ({counts.available})</span>
            </div>
            <div className="pv-legend-item">
              <span style={{ background: STATUS_COLORS.booked }} />
              <span>Booked ({counts.booked})</span>
            </div>
            <div className="pv-legend-item">
              <span style={{ background: STATUS_COLORS.sold }} />
              <span>Sold ({counts.sold})</span>
            </div>
            <div className="pv-legend-item">
              <span style={{ background: STATUS_COLORS.blocked }} />
              <span>Held / Blocked ({counts.blocked})</span>
            </div>
            <div className="pv-legend-item" style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--pv-text-muted)' }}>
              ⭐ Corner Plot Indicator
            </div>
          </div>

          {/* Masterplan Map Container */}
          <div className="pv-original-map-container">
            {/* View Mode Switcher and Zoom Toolbar */}
            <div className="pv-plan-switcher-bar">
              <div className="pv-plan-type-tabs" role="tablist" aria-label="Select layout drawing format">
                <button
                  className={`pv-plan-type-btn ${activePlanType === 'interactive' ? 'active' : ''}`}
                  onClick={() => { setActivePlanType('interactive'); handleResetView(); }}
                  role="tab"
                  aria-selected={activePlanType === 'interactive'}
                >
                  🗺️ Interactive SVG Layout Canvas (Clickable Plots)
                </button>
                <button
                  className={`pv-plan-type-btn ${activePlanType === 'blueprint' ? 'active' : ''}`}
                  onClick={() => { setActivePlanType('blueprint'); handleResetView(); }}
                  role="tab"
                  aria-selected={activePlanType === 'blueprint'}
                >
                  📐 Sanctioned Survey Blueprint
                </button>
                <button
                  className={`pv-plan-type-btn ${activePlanType === 'masterplan' ? 'active' : ''}`}
                  onClick={() => { setActivePlanType('masterplan'); handleResetView(); }}
                  role="tab"
                  aria-selected={activePlanType === 'masterplan'}
                >
                  🌿 3D Architectural Masterplan
                </button>
              </div>

              {/* Zoom & Inspection Controls */}
              <div className="pv-plan-zoom-toolbar">
                <button className="pv-zoom-btn" onClick={handleZoomIn} title="Zoom In (+25%)" aria-label="Zoom In">
                  ➕
                </button>
                <span className="pv-zoom-indicator">{Math.round(zoom * 100)}%</span>
                <button className="pv-zoom-btn" onClick={handleZoomOut} title="Zoom Out (-25%)" aria-label="Zoom Out">
                  ➖
                </button>
                <button className="pv-zoom-btn" onClick={handleResetView} title="Reset Zoom & Pan" aria-label="Reset View">
                  ↺ Reset
                </button>
                <button
                  className={`pv-zoom-btn ${isFullscreen ? 'active' : ''}`}
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
              className={`pv-original-map-viewport ${isDragging ? 'is-dragging' : ''} ${isFullscreen ? 'is-fullscreen' : ''}`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onWheel={handleWheel}
              role="region"
              aria-label={`${project.name} Layout Drawing`}
              tabIndex={0}
            >
              {/* Orientation Compass Badge */}
              <div className="pv-map-compass-badge" aria-label="Layout orientation">
                <span className="pv-map-compass-arrow">🧭</span>
                <div>
                  <div className="pv-map-compass-heading">NORTH-EAST</div>
                  <div className="pv-map-compass-sub">Grand Entrance 60' Rd</div>
                </div>
              </div>

              {/* Sanction Stamp Badge */}
              <div className="pv-map-sanction-badge">
                <span className="pv-map-sanction-dot">●</span>
                <span>
                  {activePlanType === 'interactive'
                    ? 'Interactive Sanctioned Cadastral Map · Live Status'
                    : activePlanType === 'blueprint'
                    ? 'Official Sanctioned Survey Blueprint'
                    : '3D Township Masterplan Render'}
                </span>
              </div>

              {/* Plan Canvas */}
              <div
                className="pv-original-map-canvas"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: 'center center',
                }}
              >
                {activePlanType === 'interactive' ? (
                  /* Interactive SVG Canvas with 32 Clickable Plots */
                  <svg
                    viewBox="0 0 760 440"
                    className="pv-svg-masterplan"
                    style={{ width: '100%', maxWidth: '760px', height: 'auto', display: 'block' }}
                  >
                    {/* Background Township Plot Boundary */}
                    <rect x="15" y="15" width="730" height="410" rx="14" fill="#0b192e" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="2" />

                    {/* Road Network Overlays */}
                    {/* Road 1: Main Boulevard between Row 1 and Row 2 (y: 108, h: 40) */}
                    <rect x="25" y="108" width="710" height="38" fill="rgba(15, 34, 61, 0.95)" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="1" rx="4" />
                    <line x1="30" y1="127" x2="730" y2="127" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="2" strokeDasharray="8 6" />
                    <text x="380" y="131" textAnchor="middle" fill="var(--pv-gold)" fontSize="9" fontWeight="700" letterSpacing="1">
                      {config.road1}
                    </text>

                    {/* Road 2: Avenue Road between Row 2 and Row 3 (y: 208, h: 36) */}
                    <rect x="25" y="208" width="710" height="36" fill="rgba(15, 34, 61, 0.95)" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="1" rx="4" />
                    <line x1="30" y1="226" x2="730" y2="226" stroke="rgba(245, 158, 11, 0.35)" strokeWidth="1.5" strokeDasharray="6 6" />
                    <text x="380" y="230" textAnchor="middle" fill="#94a3b8" fontSize="8.5" fontWeight="600" letterSpacing="0.8">
                      {config.road2}
                    </text>

                    {/* Road 3: Cross Street between Row 3 and Row 4 (y: 306, h: 36) */}
                    <rect x="25" y="306" width="710" height="36" fill="rgba(15, 34, 61, 0.95)" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="1" rx="4" />
                    <line x1="30" y1="324" x2="730" y2="324" stroke="rgba(245, 158, 11, 0.35)" strokeWidth="1.5" strokeDasharray="6 6" />
                    <text x="380" y="328" textAnchor="middle" fill="#94a3b8" fontSize="8.5" fontWeight="600" letterSpacing="0.8">
                      {config.road3}
                    </text>

                    {/* Central Amenity: Park (Row 1, x: 335, y: 48, w: 85, h: 56) */}
                    <g className="pv-svg-amenity">
                      <rect x="335" y="48" width="85" height="56" rx="8" fill={config.centralAmenity.bg} stroke={config.centralAmenity.stroke} strokeWidth="1.5" />
                      <text x="377" y="68" textAnchor="middle" fontSize="16">{config.centralAmenity.emoji}</text>
                      <text x="377" y="82" textAnchor="middle" fill={config.centralAmenity.textFill} fontSize="7.5" fontWeight="800">
                        {config.centralAmenity.title}
                      </text>
                      <text x="377" y="93" textAnchor="middle" fill={config.centralAmenity.textFill} fontSize="7" fontWeight="600">
                        {config.centralAmenity.subtitle}
                      </text>
                    </g>

                    {/* Central Plaza (Row 2, x: 335, y: 148, w: 85, h: 56) */}
                    <g className="pv-svg-amenity">
                      <rect x="335" y="148" width="85" height="56" rx="8" fill={config.centralPlaza.bg} stroke={config.centralPlaza.stroke} strokeWidth="1.5" />
                      <text x="377" y="168" textAnchor="middle" fontSize="16">{config.centralPlaza.emoji}</text>
                      <text x="377" y="182" textAnchor="middle" fill={config.centralPlaza.textFill} fontSize="7.5" fontWeight="800">
                        {config.centralPlaza.title}
                      </text>
                      <text x="377" y="193" textAnchor="middle" fill={config.centralPlaza.textFill} fontSize="7" fontWeight="600">
                        {config.centralPlaza.subtitle}
                      </text>
                    </g>

                    {/* Utility Yard (Row 3, x: 675, y: 246, w: 60, h: 56) */}
                    <g className="pv-svg-amenity">
                      <rect x="675" y="246" width="60" height="56" rx="8" fill={config.utilityYard.bg} stroke={config.utilityYard.stroke} strokeWidth="1.5" />
                      <text x="705" y="266" textAnchor="middle" fontSize="14">{config.utilityYard.emoji}</text>
                      <text x="705" y="280" textAnchor="middle" fill={config.utilityYard.textFill} fontSize="6.5" fontWeight="800">
                        {config.utilityYard.title}
                      </text>
                      <text x="705" y="291" textAnchor="middle" fill={config.utilityYard.textFill} fontSize="6" fontWeight="600">
                        {config.utilityYard.subtitle}
                      </text>
                    </g>

                    {/* Grand Entrance Arch (Row 4, x: 25, y: 344, w: 80, h: 56) */}
                    <g className="pv-svg-amenity">
                      <rect x="25" y="344" width="80" height="56" rx="8" fill="rgba(245, 158, 11, 0.15)" stroke="rgba(245, 158, 11, 0.5)" strokeWidth="1.5" />
                      <text x="65" y="364" textAnchor="middle" fontSize="16">🏛️</text>
                      <text x="65" y="378" textAnchor="middle" fill="var(--pv-gold)" fontSize="7" fontWeight="800">
                        GRAND ARCH
                      </text>
                      <text x="65" y="389" textAnchor="middle" fill="var(--pv-text-muted)" fontSize="6" fontWeight="600">
                        24x7 Security
                      </text>
                    </g>

                    {/* Render Interactive Clickable Plots */}
                    {plots.map(plot => {
                      const isSelected = selected && selected.id === plot.id;
                      const isMatch = filteredPlots.some(fp => fp.id === plot.id);
                      const baseColor = STATUS_COLORS[plot.status] || '#16a34a';

                      return (
                        <g
                          key={plot.id}
                          className={`pv-plot-cell ${isSelected ? 'is-selected' : ''} ${!isMatch ? 'is-dimmed' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected(plot);
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            setSelected(plot);
                            if (onSelectPlotModal) onSelectPlotModal(plot);
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          {/* Plot Boundary Rectangle */}
                          <rect
                            x={plot.x}
                            y={plot.y}
                            width={plot.w}
                            height={plot.h}
                            rx="5"
                            fill={isSelected ? 'rgba(245, 158, 11, 0.35)' : `${baseColor}1a`}
                            stroke={isSelected ? '#f59e0b' : baseColor}
                            strokeWidth={isSelected ? '2.5' : '1.2'}
                            strokeDasharray={plot.status === 'blocked' ? '3 3' : 'none'}
                          />

                          {/* Corner Plot Indicator */}
                          {plot.corner && (
                            <text x={plot.x + 6} y={plot.y + 11} fill="#fbbf24" fontSize="8" fontWeight="bold">
                              ★
                            </text>
                          )}

                          {/* Plot Number */}
                          <text
                            x={plot.x + plot.w / 2}
                            y={plot.y + (plot.h / 2) - 3}
                            textAnchor="middle"
                            fill="#f8fafc"
                            fontSize="10"
                            fontWeight="800"
                          >
                            #{plot.label}
                          </text>

                          {/* Area in Sq.Yds */}
                          <text
                            x={plot.x + plot.w / 2}
                            y={plot.y + (plot.h / 2) + 9}
                            textAnchor="middle"
                            fill={baseColor}
                            fontSize="7.5"
                            fontWeight="700"
                          >
                            {plot.area} Yd
                          </text>

                          {/* Facing */}
                          <text
                            x={plot.x + plot.w / 2}
                            y={plot.y + (plot.h / 2) + 19}
                            textAnchor="middle"
                            fill="rgba(248, 250, 252, 0.65)"
                            fontSize="6"
                            fontWeight="500"
                          >
                            {plot.facing.split(' ')[0]}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                ) : (
                  <img
                    src={activePlanType === 'blueprint' ? blueprintSrc : masterplanSrc}
                    alt={`${project.name} Masterplan`}
                    className="pv-original-layout-img"
                    draggable={false}
                  />
                )}
              </div>

              {/* Helper Hint */}
              <div className="pv-map-help-hint">
                <span>🖐️ Drag to pan</span>
                <span>·</span>
                <span>🔍 + / − or wheel to zoom</span>
                <span>·</span>
                <span>👆 Click plot to inspect</span>
                <span>·</span>
                <span className="pv-map-zoom-pill">{Math.round(zoom * 100)}%</span>
              </div>
            </div>

            {/* Layout Specs Strip */}
            <div className="pv-layout-specs-strip">
              <div className="pv-lstrip-item">
                <span className="pv-lstrip-label">Official Sanction</span>
                <strong className="pv-lstrip-val">{project.approvalDetails || project.approval}</strong>
              </div>
              <div className="pv-lstrip-item">
                <span className="pv-lstrip-label">Sanctioned Plots</span>
                <strong className="pv-lstrip-val">Plots #101 to #132 Surveyed</strong>
              </div>
              <div className="pv-lstrip-item">
                <span className="pv-lstrip-label">Road Network</span>
                <strong className="pv-lstrip-val">{project.roads}</strong>
              </div>
              <div className="pv-lstrip-item">
                <span className="pv-lstrip-label">Township Utilities</span>
                <strong className="pv-lstrip-val">{project.utilities}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Live Plot Inspector Card */}
        <div>
          {selected ? (
            <div className="pv-layout-inspector">
              <div className="pv-inspector-header">
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--pv-gold)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {selected.sector || config.sectors[0]} · {project.name}
                  </span>
                  <h3 className="pv-inspector-title">Plot #{selected.label}</h3>
                </div>
                <span
                  className="pv-status-badge"
                  style={{
                    background: `${STATUS_COLORS[selected.status]}24`,
                    color: STATUS_COLORS[selected.status],
                    border: `1px solid ${STATUS_COLORS[selected.status]}66`,
                  }}
                >
                  {STATUS_LABELS[selected.status]}
                </span>
              </div>

              {/* Specifications */}
              <div className="pv-inspector-grid">
                <div className="pv-inspector-item">
                  <span>Plot Area</span>
                  <strong>{selected.area} Sq.Yds</strong>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--pv-text-muted)' }}>({selected.sqft || selected.area * 9} Sq.Ft)</span>
                </div>
                <div className="pv-inspector-item">
                  <span>Dimensions</span>
                  <strong>{selected.dimensions}</strong>
                </div>
                <div className="pv-inspector-item">
                  <span>Facing</span>
                  <strong>{selected.facing} Facing</strong>
                  <span style={{ fontSize: '0.6875rem', color: '#16a34a' }}>100% Vaastu</span>
                </div>
                <div className="pv-inspector-item">
                  <span>Road Width</span>
                  <strong>{selected.road.split('(')[0].trim()}</strong>
                </div>
                <div className="pv-inspector-item">
                  <span>Corner Plot</span>
                  <strong>{selected.corner ? '⭐ Prime Corner' : 'Standard Plot'}</strong>
                </div>
                <div className="pv-inspector-item">
                  <span>Rate / Sq.Yd</span>
                  <strong>₹{(selected.pricePerYd || config.basePricePerYd).toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {/* Pricing Box */}
              <div className="pv-inspector-price-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--pv-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    TOTAL INDICATIVE PRICE
                  </span>
                  <strong style={{ fontSize: '1.3rem', color: 'var(--pv-gold)' }}>
                    ₹{selected.price} Lakhs*
                  </strong>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--pv-text-muted)' }}>
                  🏦 Bank Loan Eligible: Up to ₹{(selected.price * 0.75).toFixed(2)} Lakhs (75%)
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--pv-text-muted)', marginTop: 4 }}>
                  Estimated EMI: ~₹{Math.round(selected.price * 0.75 * 100000 * 0.0085).toLocaleString('en-IN')}/mo
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pv-inspector-actions" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selected.status === 'available' ? (
                  <>
                    <button
                      className="pv-btn-gold"
                      style={{ justifyContent: 'center' }}
                      onClick={() => handleEnquire(selected)}
                    >
                      💬 Hold / Enquire via WhatsApp
                    </button>
                    <button
                      className="pv-btn-outline"
                      style={{ justifyContent: 'center' }}
                      onClick={() => onBookVisit(project, selected)}
                    >
                      🚗 Schedule Site Visit for Plot #{selected.label}
                    </button>
                    <button
                      className="pv-btn-outline pv-btn-sm"
                      style={{ justifyContent: 'center' }}
                      onClick={() => handleDownloadPlotSheet(selected)}
                    >
                      📥 Download Plot #{selected.label} Spec Sheet
                    </button>
                    {onSelectPlotModal && (
                      <button
                        className="pv-btn-outline pv-btn-sm"
                        style={{ justifyContent: 'center' }}
                        onClick={() => onSelectPlotModal(selected)}
                      >
                        🔍 Open Plot #{selected.label} Detailed Modal
                      </button>
                    )}
                  </>
                ) : (
                  <div style={{
                    background: 'rgba(220, 38, 38, 0.1)',
                    border: '1px solid rgba(220, 38, 38, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '0.8125rem',
                    textAlign: 'center',
                    color: '#ef4444'
                  }}>
                    <div>⚠️ <strong>Plot #{selected.label} is {STATUS_LABELS[selected.status]}</strong></div>
                    <div style={{ color: 'var(--pv-text-muted)', fontSize: '0.75rem', marginTop: 4 }}>
                      Online booking is unavailable for this plot.
                    </div>
                    <button
                      className="pv-btn-outline pv-btn-sm"
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

                {/* Demo Status changer */}
                <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--pv-navy-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--pv-text-muted)' }}>
                  <span>Demo Status:</span>
                  <select
                    value={selected.status}
                    onChange={(e) => {
                      onStatusChange(selected.id, e.target.value);
                      setSelected(prev => ({ ...prev, status: e.target.value }));
                    }}
                    className="pv-filter-select"
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
            <div className="pv-layout-inspector" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🗺️</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Select a Plot on the Map</h3>
              <p style={{ color: 'var(--pv-text-muted)', fontSize: '0.8125rem', lineHeight: 1.6 }}>
                Click any plot number on the masterplan layout to view dimensions, facing, road width, pricing, and book online.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── 5. Layout Engineering Standards ── */}
      <div style={{ marginTop: '3rem' }}>
        <h2 className="pv-title" style={{ fontSize: '1.4rem', marginBottom: 8 }}>
          Layout Engineering Standards & Infrastructure
        </h2>
        <p style={{ color: 'var(--pv-text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Every square yard developed with certified high-grade infrastructure and verified statutory government approvals.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div className="pv-spec-box">
            <strong>🛣️ 40ft & 33ft BT Roads</strong>
            <p>Designed with heavy-duty wet mix macadam sub-base and machine-laid asphalt with precast kerb stones.</p>
          </div>
          <div className="pv-spec-box">
            <strong>💧 Underground Drainage & Water</strong>
            <p>Concealed UGD pipes with manholes, connected to STP. Overhead water tank with individual plot tap.</p>
          </div>
          <div className="pv-spec-box">
            <strong>⚡ Concealed Electrical Grid</strong>
            <p>Underground cabling, dedicated transformers, and designer warm-white LED street poles.</p>
          </div>
          <div className="pv-spec-box">
            <strong>🛡️ Gated Compound & Solar Fence</strong>
            <p>6-foot precast concrete boundary wall with solar security fencing and 24x7 security surveillance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main PlotVenture Demo Application ────────────────────────────────────────
export default function PlotVentureDemo() {
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

  const [selectedProjectId, setSelectedProjectId] = useState(PROJECTS[0].id);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [previewMode, setPreviewMode] = useState('web');
  const screenRef = useRef(null);

  // Real-time dynamic plots per project
  const [plotsByProject, setPlotsByProject] = useState(() => ({
    'green-county-elite': generateVenturePlots('green-county-elite'),
    'royal-palms-boulevard': generateVenturePlots('royal-palms-boulevard'),
    'serene-valley-county': generateVenturePlots('serene-valley-county'),
  }));

  // Modals state
  const [brochureProject, setBrochureProject] = useState(null);
  const [showBrochuresListModal, setShowBrochuresListModal] = useState(false);
  const [visitProject, setVisitProject] = useState(null);
  const [visitDefaultPlot, setVisitDefaultPlot] = useState(null);
  const [selectedPlotForModal, setSelectedPlotForModal] = useState(null);
  const [siteVisits, setSiteVisits] = useState([]);

  // Active project data
  const currentProject = useMemo(() => {
    return PROJECTS.find(p => p.id === selectedProjectId) || PROJECTS[0];
  }, [selectedProjectId]);

  const currentProjectPlots = plotsByProject[selectedProjectId] || generateVenturePlots(selectedProjectId);

  const navToPage = (pageId, projId = null) => {
    setActivePage(pageId);
    if (projId) setSelectedProjectId(projId);
    setMobileMenuOpen(false);
    if (previewMode !== 'web' && screenRef.current) {
      screenRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  function handleStatusChange(plotId, newStatus) {
    setPlotsByProject(prev => {
      const projId = selectedProjectId;
      const list = prev[projId] || generateVenturePlots(projId);
      const updated = list.map(p => (p.id === plotId ? { ...p, status: newStatus } : p));
      return { ...prev, [projId]: updated };
    });
  }

  function handleBookingSuccess(newVisit) {
    setSiteVisits(prev => [newVisit, ...prev]);
  }

  function handleOpenBrochure(proj) {
    setBrochureProject(proj || currentProject || PROJECTS[0]);
  }

  function handleOpenVisit(proj, plot = null) {
    setVisitProject(proj || currentProject || PROJECTS[0]);
    setVisitDefaultPlot(plot);
  }

  function handleOpenLayout(projId) {
    if (projId) setSelectedProjectId(projId);
    navToPage('layout', projId);
  }

  const waContactNumber = siteConfig.whatsapp.replace(/\D/g, '');
  const waDirectUrl = (msg) =>
    `https://wa.me/${waContactNumber}?text=${encodeURIComponent(msg || "Hi PlotVenture! I'm interested in booking a site visit for residential plots.")}`;

  const NAV_ITEMS = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'projects', label: 'Projects' },
    { id: 'layout', label: 'Layout Map' },
    { id: 'details', label: 'Project Details' },
    { id: 'highlights', label: 'Highlights' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact Us' },
  ];

  return (
    <div className={`pv-preview-shell pv-preview-shell--${previewMode}`}>
      {/* ── Demo Bar for Theme Toggle & DeccanIDentity Navigation (Fixed Across Full Width) ── */}
      <DemoBar
        templateSlug="plotventure"
        templateName="PlotVenture"
        label="📐 PlotVenture — Modern Plotted Development Website"
        previewMode={previewMode}
        onPreviewModeChange={setPreviewMode}
      />

      <div className={`pv-preview-stage pv-preview-stage--${previewMode} ${previewMode !== 'web' ? 'pv-preview-stage--framed' : ''}`}>
        <div className={`pv-device-frame pv-device-frame--${previewMode}`}>
          {previewMode === 'mobile' && (
            <div className="pv-device-notch" aria-hidden="true">
              <span className="pv-device-camera" />
              <span className="pv-device-speaker" />
            </div>
          )}
          {previewMode === 'tab' && (
            <div className="pv-device-tablet-cam" aria-hidden="true">
              <span className="pv-device-camera" />
            </div>
          )}
          <div className="pv-device-screen" ref={screenRef}>
            <div className="pv-demo">
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
              {NAV_ITEMS.map(item => (
                <li key={item.id}>
                  <button
                    className={`pv-nav__link-btn ${activePage === item.id || (item.id === 'highlights' && (activePage === 'amenities' || activePage === 'location')) ? 'active' : ''}`}
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
          <div className="pv-nav__actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              className="pv-btn-gold pv-nav__btn-sm pv-nav__visit-btn"
              onClick={() => handleOpenVisit(currentProject)}
              aria-label="Schedule a site visit"
            >
              🚗 Book a Visit
            </button>
            <a
              href={waDirectUrl("Hello! I want to enquire about PlotVenture's plots.")}
              target="_blank"
              rel="noreferrer"
              className="pv-btn-gold pv-nav__btn-sm pv-nav__cta-desktop"
              aria-label="WhatsApp Enquiry"
            >
              <span>💬</span> WhatsApp
            </a>
            {/* Three Horizontal Lines Hamburger Button for Responsive Screens */}
            <button
              className={`pv-nav__hamburger ${mobileMenuOpen ? 'open' : ''}`}
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              <span className="pv-hamburger-bar"></span>
              <span className="pv-hamburger-bar"></span>
              <span className="pv-hamburger-bar"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile & Tablet Responsive Navigation Drawer Overlay */}
      <div
        className={`pv-mobile-drawer-overlay ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="pv-mobile-drawer" onClick={e => e.stopPropagation()}>
          <div className="pv-mobile-drawer__header">
            <div className="pv-brand">
              <div className="pv-brand__logo-icon">PV</div>
              <div className="pv-brand__text">
                <span className="pv-brand__name">
                  Plot<span>Venture</span>
                </span>
                <span className="pv-brand__sub">Plotted Developments</span>
              </div>
            </div>
            <button
              className="pv-mobile-drawer__close"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
            >
              ✕
            </button>
          </div>

          <nav className="pv-mobile-drawer__nav" aria-label="Mobile Navigation">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                className={`pv-mobile-drawer__btn ${activePage === item.id || (item.id === 'highlights' && (activePage === 'amenities' || activePage === 'location')) ? 'active' : ''}`}
                onClick={() => navToPage(item.id)}
              >
                <span>{item.label}</span>
                <span>→</span>
              </button>
            ))}
          </nav>

          <div className="pv-mobile-drawer__footer" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              className="pv-btn-outline"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => {
                setMobileMenuOpen(false);
                setShowBrochuresListModal(true);
              }}
            >
              📥 All Venture Brochures
            </button>
            <button
              className="pv-btn-gold"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => {
                setMobileMenuOpen(false);
                handleOpenVisit(currentProject);
              }}
            >
              🚗 Schedule Free Site Visit
            </button>
            <a
              href={waDirectUrl()}
              target="_blank"
              rel="noreferrer"
              className="pv-btn-outline"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              💬 WhatsApp Enquiry
            </a>
          </div>
        </div>
      </div>

      {/* ── Active Page View ── */}
      <main className="pv-content-area" id="pv-main-content">
        {activePage === 'home' && (
          <HomePage
            navToPage={navToPage}
            waDirectUrl={waDirectUrl}
            onSelectProject={id => navToPage('details', id)}
            onOpenLayout={handleOpenLayout}
            onOpenBrochure={handleOpenBrochure}
            onOpenVisit={handleOpenVisit}
            onOpenLightbox={setLightboxImg}
          />
        )}

        {activePage === 'projects' && (
          <ProjectsPage
            onSelectProject={id => navToPage('details', id)}
            onOpenLayout={handleOpenLayout}
            onOpenBrochure={handleOpenBrochure}
            onOpenVisit={handleOpenVisit}
            navToPage={navToPage}
          />
        )}

        {activePage === 'layout' && (
          <LayoutPage
            activeProject={currentProject}
            onSelectProject={id => setSelectedProjectId(id)}
            plots={currentProjectPlots}
            onStatusChange={handleStatusChange}
            onBookVisit={handleOpenVisit}
            onOpenBrochure={handleOpenBrochure}
            onOpenBrochuresList={() => setShowBrochuresListModal(true)}
            onSelectPlotModal={setSelectedPlotForModal}
          />
        )}

        {activePage === 'details' && (
          <ProjectDetailsPage
            project={currentProject}
            allProjects={PROJECTS}
            onSelectProject={setSelectedProjectId}
            onOpenLayout={handleOpenLayout}
            onOpenBrochure={handleOpenBrochure}
            onOpenVisit={handleOpenVisit}
            waDirectUrl={waDirectUrl}
            navToPage={navToPage}
          />
        )}

        {activePage === 'about' && (
          <AboutPage navToPage={navToPage} waDirectUrl={waDirectUrl} />
        )}

        {(activePage === 'highlights' || activePage === 'amenities' || activePage === 'location') && (
          <div>
            <div style={{ textAlign: 'center', maxWidth: '720px', margin: '3rem auto 1rem', padding: '0 1rem' }}>
              <span className="pv-badge" style={{ marginBottom: '0.75rem' }}>
                🌟 Signature Living &amp; Strategic Connectivity
              </span>
              <h1 className="pv-title" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', margin: '0.5rem 0' }}>
                Highlights
              </h1>
              <p className="pv-subtitle" style={{ margin: '0 auto' }}>
                Complete township infrastructure, clubhouse amenities, and high-growth strategic connectivity advantages.
              </p>
            </div>
            <AmenitiesPage navToPage={navToPage} waDirectUrl={waDirectUrl} />
            <LocationPage navToPage={navToPage} waDirectUrl={waDirectUrl} />
          </div>
        )}

        {activePage === 'gallery' && (
          <GalleryPage onOpenLightbox={setLightboxImg} />
        )}

        {activePage === 'contact' && (
          <ContactPage
            waDirectUrl={waDirectUrl}
            currentProject={currentProject}
          />
        )}
      </main>

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
                { id: 'layout', label: 'Layout Map' },
                { id: 'details', label: 'Project Master Plans' },
                { id: 'highlights', label: 'Highlights' },
                { id: 'gallery', label: 'Photo Gallery' },
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
          <div>
            <span style={{ fontSize: '0.75rem' }}>{COMPANY_INFO.reraNotice}</span>
          </div>
        </div>
      </footer>
            </div>{/* .pv-demo */}
          </div>{/* .pv-device-screen */}
        </div>{/* .pv-device-frame */}
      </div>{/* .pv-preview-stage */}

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

      {/* ── Modals: Brochures, Site Visit, Plot Details, Admin Manager ── */}
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

      {selectedPlotForModal && (
        <PlotModal
          plot={selectedPlotForModal}
          project={currentProject}
          onClose={() => setSelectedPlotForModal(null)}
          onEnquire={(p) => {
            const text = `Hi, I am interested in Plot #${p.id} (${p.sqYards} Sq.Yds, ${p.facing} facing) at ${currentProject.name}.`;
            window.open(waDirectUrl(text), '_blank');
          }}
          onBookVisit={(p) => handleOpenVisit(currentProject, p)}
          onStatusChange={handleStatusChange}
        />
      )}


    </div>
  );
}

// ─── 1. Home Page Component ──────────────────────────────────────────────────
function HomePage({
  navToPage,
  waDirectUrl,
  onSelectProject,
  onOpenLayout,
  onOpenBrochure,
  onOpenVisit,
  onOpenLightbox,
}) {
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
                onClick={() => (onOpenVisit ? onOpenVisit() : navToPage('contact'))}
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

                <div className="pv-pcard__footer" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', alignItems: 'stretch' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="pv-pcard__price">
                      <span>Starting From</span>
                      <strong>{p.minPrice}</strong>
                    </div>
                    <button
                      className="pv-btn-gold"
                      onClick={() => onSelectProject(p.id)}
                      aria-label={`View details for ${p.name}`}
                      style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
                    >
                      View Details →
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <button
                      className="pv-btn-outline"
                      style={{ padding: '0.4rem', fontSize: '0.78rem', justifyContent: 'center' }}
                      onClick={() => (onOpenLayout ? onOpenLayout(p.id) : navToPage('layout', p.id))}
                    >
                      🗺️ Masterplan
                    </button>
                    <button
                      className="pv-btn-outline"
                      style={{ padding: '0.4rem', fontSize: '0.78rem', justifyContent: 'center' }}
                      onClick={() => (onOpenBrochure ? onOpenBrochure(p) : downloadProjectBrochure(p))}
                    >
                      📥 Brochure
                    </button>
                  </div>
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
            onClick={() => navToPage('highlights')}
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
              onClick={() => navToPage('highlights')}
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
function ProjectsPage({ onSelectProject, onOpenLayout, onOpenBrochure, onOpenVisit, navToPage }) {
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

                <div className="pv-pcard__footer" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', alignItems: 'stretch' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="pv-pcard__price">
                      <span>Indicative Price</span>
                      <strong>{p.minPrice}</strong>
                    </div>
                    <button
                      className="pv-btn-gold"
                      onClick={() => onSelectProject(p.id)}
                      style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
                    >
                      View Details →
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <button
                      className="pv-btn-outline"
                      style={{ padding: '0.4rem', fontSize: '0.78rem', justifyContent: 'center' }}
                      onClick={() => (onOpenLayout ? onOpenLayout(p.id) : navToPage('layout', p.id))}
                    >
                      🗺️ Layout Map
                    </button>
                    <button
                      className="pv-btn-outline"
                      style={{ padding: '0.4rem', fontSize: '0.78rem', justifyContent: 'center' }}
                      onClick={() => (onOpenBrochure ? onOpenBrochure(p) : downloadProjectBrochure(p))}
                    >
                      📥 Brochure
                    </button>
                  </div>
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
        <button className="pv-btn-gold" onClick={() => (onOpenVisit ? onOpenVisit() : navToPage('contact'))}>
          Contact Land Specialist →
        </button>
      </div>
    </div>
  );
}

// ─── 3. Project Details Page Component ───────────────────────────────────────
function ProjectDetailsPage({
  project,
  allProjects,
  onSelectProject,
  onOpenLayout,
  onOpenBrochure,
  onOpenVisit,
  waDirectUrl,
  navToPage,
}) {
  const [calcSqYds, setCalcSqYds] = useState(200);

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
                <button
                  className="pv-btn-gold"
                  style={{ textAlign: 'center', justifyContent: 'center' }}
                  onClick={() => (onOpenLayout ? onOpenLayout(project.id) : navToPage('layout', project.id))}
                >
                  🗺️ Interactive Masterplan
                </button>
                <button
                  className="pv-btn-outline"
                  onClick={() => (onOpenVisit ? onOpenVisit(project) : navToPage('contact'))}
                >
                  🚗 Schedule Free Site Visit
                </button>
                <a
                  href={waDirectUrl(`Hi PlotVenture, please share price sheet & availability for ${project.name}.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="pv-btn-outline"
                  style={{ textAlign: 'center', justifyContent: 'center' }}
                >
                  💬 WhatsApp Price Sheet
                </a>
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
              onClick={() => (onOpenVisit ? onOpenVisit(project) : navToPage('contact'))}
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

            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--pv-navy-border)', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button
                className="pv-btn-gold"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => (onOpenLayout ? onOpenLayout(project.id) : navToPage('layout', project.id))}
              >
                🗺️ Explore Interactive Plot Masterplan
              </button>
              <button
                className="pv-btn-outline"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => (onOpenBrochure ? onOpenBrochure(project) : downloadProjectBrochure(project))}
              >
                📥 Download Sanctioned Layout Brochure (Instant)
              </button>
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
