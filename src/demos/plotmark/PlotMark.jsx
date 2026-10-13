import { useState, useMemo, useEffect } from 'react';
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

// ─── Brochure Download Modal ──────────────────────────────────────────────────
function BrochureModal({ project, onClose }) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [downloaded, setDownloaded] = useState(false);

  function handleDownload(e) {
    e.preventDefault();
    if (!name || !mobile) return;

    // Trigger mock brochure file download
    const projName = project?.name || 'PlotMark-County';
    const blobContent = `=====================================================
${projName.toUpperCase()} — OFFICIAL OPEN PLOT BROCHURE
=====================================================
Developer: PlotMark Developers Pvt. Ltd.
Location: ${project?.location || 'Hyderabad Growth Corridor'}
Approvals: ${project?.approvalDetails || 'HMDA & RERA Approved'}
Plot Sizes: ${project?.plotSizeRange || '150 - 500 Sq.Yds'}
Starting Price: ${project?.startingPrice || '₹35 Lakhs'}

KEY HIGHLIGHTS:
- 100% Vaastu Compliant Layout
- 40 Ft & 30 Ft Wide Blacktop Roads with Kerb Stones
- Underground Drainage (UGD) & Electricity with Transformers
- 24x7 Gated Security with CC Cameras
- Bank Loan Approved by SBI, HDFC, ICICI (Up to 75%)
- Immediate Spot Registration with Clear Title

CONTACT SALES:
Phone: ${siteConfig.phone}
WhatsApp: ${siteConfig.whatsapp}
Website: https://deccanidentity.com/demo/plotmark
=====================================================`;

    const blob = new Blob([blobContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${projName.replace(/\s+/g, '-')}-Brochure.txt`;
    link.click();

    setDownloaded(true);
  }

  return (
    <div className="plot-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="brochure-title">
      <div className="plot-modal" onClick={e => e.stopPropagation()}>
        <button className="plot-modal__close" onClick={onClose} aria-label="Close">×</button>
        <h3 id="brochure-title" style={{ marginBottom: 'var(--space-2)' }}>Download Brochure</h3>
        <p style={{ color: 'var(--brand-gold)', fontSize: '0.875rem', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
          {project ? project.name : 'PlotMark Open Plot Ventures'}
        </p>

        {downloaded ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-4) 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📄✅</div>
            <h4 style={{ color: '#16a34a', marginBottom: '8px' }}>Brochure Downloaded!</h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Your official project brochure has been downloaded to your device. We have also queued the details for WhatsApp delivery.
            </p>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleDownload} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', margin: 0 }}>
              Enter your details to instantly download the master layout plan and verified approval documents.
            </p>
            <input
              className="input"
              placeholder="Your Full Name"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              aria-label="Name"
            />
            <input
              className="input"
              placeholder="10-Digit Mobile / WhatsApp Number"
              type="tel"
              required
              pattern="[0-9]{10}"
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              aria-label="WhatsApp number"
            />
            <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', marginTop: 4 }}>
              📥 Download Official Brochure
            </button>
          </form>
        )}
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
function ProjectCard({ project, onSelectProject, onOpenLayout, onOpenBrochure, onOpenVisit }) {
  return (
    <article className="pm-project-card">
      <div className="pm-project-card__img-wrap">
        <img src={project.coverImage} alt={project.name} className="pm-project-card__img" loading="lazy" />
        <div className="pm-project-card__status-badge">
          {project.statusBadge}
        </div>
        <div className="pm-project-card__avail-badge">
          🟢 {project.availablePlots} Plots Available
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
          <button
            className="btn btn-outline"
            onClick={() => onOpenVisit(project)}
            aria-label={`Schedule site visit for ${project.name}`}
          >
            🚗 Site Visit
          </button>
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
function HomePage({ setActivePage, onSelectProject, onOpenLayout, onOpenBrochure, onOpenVisit, plots }) {
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
              onClick={() => onOpenBrochure(PLOT_PROJECTS[0])}
            >
              📥 Download Brochure
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
            View All 4 Projects →
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
function ProjectsPage({ onSelectProject, onOpenLayout, onOpenBrochure, onOpenVisit }) {
  const [filterLoc, setFilterLoc] = useState('all');
  const [filterBudget, setFilterBudget] = useState('all');
  const [filterSize, setFilterSize] = useState('all');
  const [filterApproval, setFilterApproval] = useState('all');

  const filtered = useMemo(() => {
    return PLOT_PROJECTS.filter(p => {
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
  }, [filterLoc, filterBudget, filterSize, filterApproval]);

  return (
    <div className="pm-section container">
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 className="pm-section__title" style={{ marginBottom: 8 }}>Open Plot Project Listings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Browse verified residential plotted developments with transparent plot sizes, pricing, and live availability.
        </p>
      </div>

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
          <p style={{ marginTop: 4 }}>Try clearing or adjusting your budget or location filters.</p>
          <button
            className="btn btn-outline"
            style={{ marginTop: 12 }}
            onClick={() => {
              setFilterLoc('all');
              setFilterBudget('all');
              setFilterSize('all');
              setFilterApproval('all');
            }}
          >
            Reset Filters
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
}) {
  const project = activeProject || PLOT_PROJECTS[0];
  const config = PROJECT_LAYOUT_CONFIG[project.id] || PROJECT_LAYOUT_CONFIG['pm-shankarpally'];

  const [selected, setSelected] = useState(() => plots.find(p => p.status === 'available') || plots[0] || null);
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [facingFilter, setFacingFilter] = useState('all');
  const [cornerOnly, setCornerOnly] = useState(false);
  const [zoom, setZoom] = useState(1);

  // Automatically reset selected plot and filters when switching project
  useEffect(() => {
    const firstAvail = plots.find(p => p.status === 'available') || plots[0] || null;
    setSelected(firstAvail);
    setSearchQuery('');
    setStatusFilter('all');
    setSectorFilter('all');
    setFacingFilter('all');
    setCornerOnly(false);
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
            {project.name} — Interactive Plot Map
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
            {project.approvalDetails} · 100% Vaastu Compliant Layout
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            onClick={() => onBookVisit(project, selected)}
          >
            🚗 Schedule Layout Site Visit
          </button>
          <button
            className="btn btn-outline"
            onClick={() => onOpenBrochure(project)}
          >
            📥 Download Master Plan PDF
          </button>
        </div>
      </div>

      {/* ── 2. Controls & Search Toolbar ─────────────────────────────────────── */}
      <div className="pm-layout-controls">
        {/* View Switcher Tabs */}
        <div className="pm-layout-view-tabs" role="tablist">
          <button
            className={`pm-layout-tab-btn ${viewMode === 'map' ? 'active' : ''}`}
            onClick={() => setViewMode('map')}
            role="tab"
            aria-selected={viewMode === 'map'}
          >
            🗺️ Masterplan Map View
          </button>
          <button
            className={`pm-layout-tab-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
            role="tab"
            aria-selected={viewMode === 'table'}
          >
            📋 Plot Directory Table ({filteredPlots.length})
          </button>
        </div>

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

        {/* Zoom Controls (Map Mode) */}
        {viewMode === 'map' && (
          <div className="plot-map-zoom-btns">
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Zoom:</span>
            <button
              className="plot-map-zoom-btn"
              onClick={() => setZoom(z => Math.min(z + 0.15, 1.75))}
              title="Zoom In"
              aria-label="Zoom In"
            >
              +
            </button>
            <button
              className="plot-map-zoom-btn"
              onClick={() => setZoom(z => Math.max(z - 0.15, 0.85))}
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              −
            </button>
            <button
              className="plot-map-zoom-btn"
              style={{ width: 'auto', padding: '0 8px', fontSize: '0.75rem' }}
              onClick={() => setZoom(1)}
              title="Reset Zoom"
              aria-label="Reset Zoom"
            >
              ↺ Reset
            </button>
          </div>
        )}
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

          {viewMode === 'map' ? (
            /* ── Interactive Masterplan SVG Canvas ── */
            <div className="plot-map-wrap" style={{ overflow: 'auto', position: 'relative' }}>
              <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', transition: 'transform 0.2s ease', minWidth: '760px' }}>
                <svg className="plot-map" viewBox="0 0 760 425" aria-label={`${project.name} layout map`}>
                  {/* Outer Gated Compound Boundary */}
                  <rect x="8" y="8" width="744" height="408" fill="none" stroke="rgba(200,134,10,0.35)" strokeWidth="2" strokeDasharray="6 4" rx="10" />

                  {/* Solar Fencing Posts & Wall Labels */}
                  <text x="380" y="24" fill="rgba(200,134,10,0.7)" fontSize="8" textAnchor="middle" letterSpacing="0.1em" fontFamily="Inter" fontWeight="600">
                    {project.name.toUpperCase()} · PRECAST COMPOUND WALL WITH SOLAR SECURITY FENCING & BUFFER ZONE
                  </text>

                  {/* ── Grand Entrance Gatehouse at South-West ── */}
                  <g transform="translate(22, 348)">
                    <rect x="0" y="0" width="78" height="52" fill="rgba(200,134,10,0.22)" rx="4" stroke="rgba(200,134,10,0.6)" strokeWidth="1.2" />
                    <text x="39" y="19" fill="var(--brand-gold)" fontSize="10" textAnchor="middle">🏛️</text>
                    <text x="39" y="31" fill="#ffffff" fontSize="7" textAnchor="middle" fontWeight="800">MAIN GATE</text>
                    <text x="39" y="42" fill="rgba(255,255,255,0.75)" fontSize="6" textAnchor="middle">24x7 Security</text>
                  </g>
                  <text x="110" y="415" fill="var(--brand-gold)" fontSize="7.5" fontWeight="700" fontFamily="Inter">
                    ← {config.gateLabel}
                  </text>

                  {/* ── Roads Network ── */}
                  {/* Road 1 */}
                  <rect x="20" y="114" width="720" height="28" fill="rgba(200,134,10,0.22)" rx="2" />
                  <line x1="25" y1="128" x2="735" y2="128" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="8 6" />
                  <text x="380" y="132" fill="rgba(200,134,10,0.95)" fontSize="8.5" textAnchor="middle" fontWeight="700" fontFamily="Inter">
                    {config.road1}
                  </text>

                  {/* Road 2 */}
                  <rect x="20" y="214" width="720" height="26" fill="rgba(200,134,10,0.18)" rx="2" />
                  <line x1="25" y1="227" x2="735" y2="227" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="6 6" />
                  <text x="380" y="231" fill="rgba(200,134,10,0.85)" fontSize="8" textAnchor="middle" fontWeight="600" fontFamily="Inter">
                    {config.road2}
                  </text>

                  {/* Road 3 */}
                  <rect x="20" y="312" width="720" height="26" fill="rgba(200,134,10,0.18)" rx="2" />
                  <line x1="25" y1="325" x2="735" y2="325" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="6 6" />
                  <text x="420" y="329" fill="rgba(200,134,10,0.85)" fontSize="8" textAnchor="middle" fontWeight="600" fontFamily="Inter">
                    {config.road3}
                  </text>

                  {/* ── Central Amenity Zone (Row 1) ── */}
                  <g transform="translate(342, 48)">
                    <rect x="0" y="0" width="76" height="58" fill={config.centralAmenity.bg} stroke={config.centralAmenity.stroke} strokeWidth="1.5" rx="6" />
                    <text x="38" y="20" fill={config.centralAmenity.textFill} fontSize="11" textAnchor="middle">{config.centralAmenity.emoji}</text>
                    <text x="38" y="34" fill={config.centralAmenity.textFill} fontSize="7.5" textAnchor="middle" fontWeight="800">{config.centralAmenity.title}</text>
                    <text x="38" y="45" fill={config.centralAmenity.textFill} fontSize="7" textAnchor="middle" fontWeight="700">{config.centralAmenity.subtitle}</text>
                  </g>

                  {/* ── Central Plaza Zone (Row 2) ── */}
                  <g transform="translate(342, 148)">
                    <rect x="0" y="0" width="76" height="58" fill={config.centralPlaza.bg} stroke={config.centralPlaza.stroke} strokeWidth="1.5" rx="6" />
                    <text x="38" y="20" fill={config.centralPlaza.textFill} fontSize="11" textAnchor="middle">{config.centralPlaza.emoji}</text>
                    <text x="38" y="34" fill={config.centralPlaza.textFill} fontSize="7.5" textAnchor="middle" fontWeight="800">{config.centralPlaza.title}</text>
                    <text x="38" y="45" fill={config.centralPlaza.textFill} fontSize="7" textAnchor="middle" fontWeight="700">{config.centralPlaza.subtitle}</text>
                  </g>

                  {/* ── Utility Yard (Row 3 Right) ── */}
                  <g transform="translate(680, 250)">
                    <rect x="0" y="0" width="64" height="52" fill={config.utilityYard.bg} stroke={config.utilityYard.stroke} strokeWidth="1.2" rx="4" />
                    <text x="32" y="18" fill={config.utilityYard.textFill} fontSize="10" textAnchor="middle">{config.utilityYard.emoji}</text>
                    <text x="32" y="31" fill={config.utilityYard.textFill} fontSize="7" textAnchor="middle" fontWeight="700">{config.utilityYard.title}</text>
                    <text x="32" y="42" fill={config.utilityYard.textFill} fontSize="6" textAnchor="middle">{config.utilityYard.subtitle}</text>
                  </g>

                  {/* ── Plots Rendering ── */}
                  {plots.map(p => {
                    const isSelected = selected?.id === p.id;
                    const isFilteredOut =
                      (statusFilter !== 'all' && p.status !== statusFilter) ||
                      (sectorFilter !== 'all' && p.sector !== sectorFilter) ||
                      (facingFilter !== 'all' && p.facing !== facingFilter) ||
                      (cornerOnly && !p.corner) ||
                      (searchQuery.trim() && !p.label.toLowerCase().includes(searchQuery.toLowerCase().replace('#', '').trim()));

                    return (
                      <g
                        key={p.id}
                        className="plot-cell"
                        onClick={() => setSelected(p)}
                        role="button"
                        aria-label={`Plot ${p.label} – ${p.status} – ${p.area} Sq.Yds`}
                        tabIndex={0}
                        onKeyDown={e => e.key === 'Enter' && setSelected(p)}
                        opacity={isFilteredOut ? 0.18 : 1}
                      >
                        {/* Glow indicator for selected plot */}
                        {isSelected && (
                          <rect
                            x={p.x - 3}
                            y={p.y - 3}
                            width={p.w + 6}
                            height={p.h + 6}
                            fill="none"
                            stroke="var(--brand-gold)"
                            strokeWidth="2.5"
                            rx="6"
                            strokeDasharray="4 2"
                          />
                        )}

                        {/* Plot Base Box */}
                        <rect
                          x={p.x}
                          y={p.y}
                          width={p.w}
                          height={p.h}
                          fill={`${STATUS_COLORS[p.status]}28`}
                          stroke={isSelected ? '#ffffff' : STATUS_COLORS[p.status]}
                          strokeWidth={isSelected ? 2.5 : 1.5}
                          rx="4"
                        />

                        {/* Plot Number */}
                        <text
                          x={p.x + p.w / 2}
                          y={p.y + p.h / 2 - 7}
                          fill={isSelected ? '#ffffff' : STATUS_COLORS[p.status]}
                          fontSize="10"
                          textAnchor="middle"
                          fontWeight="800"
                          fontFamily="Inter"
                        >
                          {p.label}
                        </text>

                        {/* Area in Sq.Yds */}
                        <text
                          className="plot-cell-area"
                          x={p.x + p.w / 2}
                          y={p.y + p.h / 2 + 6}
                          fill="rgba(255,255,255,0.75)"
                          fontSize="7.5"
                          textAnchor="middle"
                          fontFamily="Inter"
                          fontWeight="600"
                        >
                          {p.area} Yd
                        </text>

                        {/* Dimensions sub-text */}
                        <text
                          x={p.x + p.w / 2}
                          y={p.y + p.h / 2 + 16}
                          fill="rgba(255,255,255,0.4)"
                          fontSize="6"
                          textAnchor="middle"
                          fontFamily="Inter"
                        >
                          {p.facing[0]}·{p.dimensions.split(' ')[0]}
                        </text>

                        {/* Corner plot star */}
                        {p.corner && (
                          <text
                            x={p.x + p.w - 4}
                            y={p.y + 11}
                            fill="#f59e0b"
                            fontSize="8"
                            textAnchor="end"
                          >
                            ⭐
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* Compass / North Arrow */}
                  <g transform="translate(710, 36)" className="plot-north-arrow">
                    <circle r="14" fill="rgba(0,0,0,0.7)" stroke="rgba(200,134,10,0.5)" strokeWidth="1.5" />
                    <text x="0" y="5" fill="var(--brand-gold)" fontSize="12" textAnchor="middle" fontWeight="800" fontFamily="Inter">
                      N
                    </text>
                  </g>
                </svg>
              </div>
            </div>
          ) : (
            /* ── Plot Directory Table View ── */
            <div className="pm-table-container">
              <table className="pm-plot-table">
                <thead>
                  <tr>
                    <th>Plot #</th>
                    <th>Sector</th>
                    <th>Area (Sq.Yds)</th>
                    <th>Dimensions</th>
                    <th>Facing</th>
                    <th>Road Width</th>
                    <th>Corner</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlots.map(p => (
                    <tr
                      key={p.id}
                      style={{
                        background: selected?.id === p.id ? 'rgba(200, 134, 10, 0.12)' : 'transparent',
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelected(p)}
                    >
                      <td><strong>#{p.label}</strong></td>
                      <td>{p.sector}</td>
                      <td><strong>{p.area} Sq.Yds</strong> <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>({p.sqft} sft)</span></td>
                      <td>{p.dimensions}</td>
                      <td>{p.facing}</td>
                      <td>{p.road}</td>
                      <td>{p.corner ? '⭐ Yes' : '—'}</td>
                      <td><strong style={{ color: 'var(--brand-gold)' }}>₹{p.price} Lakhs</strong></td>
                      <td>
                        <span
                          style={{
                            background: `${STATUS_COLORS[p.status]}22`,
                            color: STATUS_COLORS[p.status],
                            border: `1px solid ${STATUS_COLORS[p.status]}55`,
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                          }}
                        >
                          {STATUS_LABELS[p.status]}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected(p);
                            setViewMode('map');
                          }}
                        >
                          View Map
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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

        <div className="pm-map-placeholder" aria-label="Location map visual" style={{ backgroundImage: `url('/images/plotmark-hero-aerial.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
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
    { src: '/images/plotmark-hero-aerial.jpg', label: 'Aerial View of Plotted Layout', cat: 'aerial', type: 'Site Photography' },
    { src: '/images/plotmark-avenue-layout.jpg', label: '40 Ft Main Avenue Blacktop Road', cat: 'roads', type: 'Actual Road Work' },
    { src: '/images/plotmark-entrance-arch.jpg', label: 'Grand Gated Entrance Archway', cat: 'gate', type: 'Completed Entrance' },
    { src: '/images/plotmark-hero-aerial.jpg', label: 'Central Community Park & Gazebo', cat: 'park', type: 'Landscape Work' },
    { src: '/images/plotmark-avenue-layout.jpg', label: 'Underground Utilities & Kerb Stones', cat: 'roads', type: 'Infrastructure' },
    { src: '/images/plotmark-entrance-arch.jpg', label: 'Security Post & Boom Barrier', cat: 'gate', type: 'Security Setup' },
  ];

  const filtered = cat === 'all' ? photos : photos.filter(p => p.cat === cat);

  return (
    <div className="pm-section container">
      {selectedImg && (
        <div className="plot-modal-overlay" onClick={() => setSelectedImg(null)}>
          <div style={{ maxWidth: 800, width: '100%', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button className="plot-modal__close" onClick={() => setSelectedImg(null)}>×</button>
            <img src={selectedImg.src} alt={selectedImg.label} style={{ width: '100%', borderRadius: 'var(--radius-lg)' }} />
            <div style={{ marginTop: 8, color: '#ffffff', fontWeight: 600 }}>{selectedImg.label}</div>
          </div>
        </div>
      )}

      <h1 className="pm-section__title">Project Gallery</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
        Authentic site photographs and drone perspectives showing real development progress.
      </p>

      {/* Category chips */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
        {[
          ['all', 'All Photos'],
          ['aerial', 'Drone Aerial Views'],
          ['roads', 'Avenue Roads & Kerbs'],
          ['gate', 'Entrance Gate & Arch'],
          ['park', 'Parks & Landscaping'],
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
            <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{p.label}</span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--brand-gold)', textTransform: 'uppercase' }}>
                {p.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Contact / Site Visit Page ────────────────────────────────────────────────
function ContactPage({ onOpenVisit }) {
  return (
    <div className="pm-section container" style={{ maxWidth: 680 }}>
      <h1 className="pm-section__title" style={{ textAlign: 'center' }}>Book Your Free Site Visit</h1>
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        Experience the layout in person. We provide complimentary pickup and drop from your location in Hyderabad.
      </p>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)' }}>
        <button
          className="btn btn-primary btn-lg"
          style={{ width: '100%', justifyContent: 'center', marginBottom: 'var(--space-4)' }}
          onClick={() => onOpenVisit(PLOT_PROJECTS[0])}
        >
          🚗 Schedule Site Visit with Free Cab
        </button>

        <div style={{ textAlign: 'center', margin: 'var(--space-4) 0', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
          — OR CONNECT DIRECTLY VIA WHATSAPP —
        </div>

        <a
          href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
            "Hi! I want to visit PlotMark open plots this week. Please share available slots."
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-whatsapp btn-lg"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          💬 Chat with Sales Advisor on WhatsApp
        </a>

        <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          <div>📞 Direct Call: <strong>{siteConfig.phone}</strong></div>
          <div>✉️ Email: <strong>info@deccanidentity.com</strong></div>
          <div>🕒 Hours: <strong>9:00 AM – 7:00 PM (All 7 Days)</strong></div>
          <div>📍 Office: <strong>Banjara Hills, Hyderabad</strong></div>
        </div>
      </div>
    </div>
  );
}

// ─── Main PlotMark Component ──────────────────────────────────────────────────
export default function PlotMarkDemo() {
  const [activePage, setActivePage] = useState('home');
  const [selectedProject, setSelectedProject] = useState(PLOT_PROJECTS[0]);
  const [plotsByProject, setPlotsByProject] = useState(() => ({
    'pm-shankarpally': generateProjectPlots('pm-shankarpally'),
    'pm-shamshabad': generateProjectPlots('pm-shamshabad'),
    'pm-pharmacity': generateProjectPlots('pm-pharmacity'),
    'pm-ghatkesar': generateProjectPlots('pm-ghatkesar'),
  }));
  const [brochureProject, setBrochureProject] = useState(null);
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
    { id: 'projects', label: 'Open Plot Projects' },
    { id: 'layout', label: 'Layout Map' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'location', label: 'Location' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Book Site Visit' },
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
          {PAGES.map(p => (
            <li key={p.id}>
              <button
                className={activePage === p.id ? 'active' : ''}
                onClick={() => {
                  setActivePage(p.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                aria-current={activePage === p.id ? 'page' : undefined}
              >
                {p.label}
              </button>
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => handleOpenVisit(selectedProject || PLOT_PROJECTS[0])}
          >
            🚗 Site Visit
          </button>
        </div>
      </nav>

      {/* Main Content Router */}
      <main className="pm-main">
        {activePage === 'home' && (
          <HomePage
            setActivePage={setActivePage}
            onSelectProject={handleSelectProject}
            onOpenLayout={handleOpenLayout}
            onOpenBrochure={handleOpenBrochure}
            onOpenVisit={handleOpenVisit}
            plots={currentProjectPlots}
          />
        )}
        {activePage === 'projects' && (
          <ProjectsPage
            onSelectProject={handleSelectProject}
            onOpenLayout={handleOpenLayout}
            onOpenBrochure={handleOpenBrochure}
            onOpenVisit={handleOpenVisit}
          />
        )}
        {activePage === 'project-detail' && (
          <ProjectDetailPage
            project={selectedProject}
            onBack={() => setActivePage('projects')}
            onOpenLayout={handleOpenLayout}
            onOpenBrochure={handleOpenBrochure}
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
          />
        )}
        {activePage === 'amenities' && <AmenitiesPage onOpenVisit={handleOpenVisit} />}
        {activePage === 'location' && <LocationPage onOpenVisit={handleOpenVisit} />}
        {activePage === 'gallery' && <GalleryPage />}
        {activePage === 'contact' && <ContactPage onOpenVisit={handleOpenVisit} />}
      </main>

      {/* Modals */}
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

      {/* Footer */}
      <footer className="pm-footer">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)', padding: 'var(--space-6) 0' }}>
          <div>
            <div className="pm-nav__logo" style={{ marginBottom: 4 }}>
              🌳 PlotMark — Plotted Developments
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              HMDA & RERA Approved Residential Open Plots · Hyderabad Corridors
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.75rem' }}
              onClick={() => setShowAdmin(true)}
            >
              ⚙️ Plot Data Manager
            </button>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Demo template by <Link to="/" style={{ color: 'var(--brand-gold)' }}>DeccanIDentity</Link>.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
