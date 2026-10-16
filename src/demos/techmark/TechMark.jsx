import { useState } from 'react';
import { Link } from 'react-router-dom';
import siteConfig from '../../data/site.config.js';
import DemoBar from '../../components/DemoBar.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import '../plotmark/PlotMark.css';

export default function TechMarkDemo() {
  const [activeTab, setActiveTab] = useState('home');
  const [annualBilling, setAnnualBilling] = useState(true);
  const [demoModal, setDemoModal] = useState(false);
  const [demoSent, setDemoSent] = useState(false);
  const { theme } = useTheme();

  return (
    <div className="pm-demo" style={{ background: theme === 'light' ? '#f8fafc' : '#030712', color: theme === 'light' ? '#0f172a' : '#f8fafc' }}>
      <DemoBar templateSlug="techmark" templateName="TechMark" label="💻 TechMark — SaaS & Cloud Enterprise Demo" />

      {/* Nav */}
      <nav className="pm-nav" style={{ background: theme === 'light' ? 'rgba(255,255,255,0.95)' : 'rgba(3, 7, 18, 0.95)', borderBottom: `1px solid ${theme === 'light' ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.25)'}` }}>
        <div className="pm-nav__logo" style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>⚡</span> TECHMARK.IO
        </div>
        <ul className="pm-nav__links">
          {['home', 'features', 'pricing', 'api', 'contact'].map(p => (
            <li key={p}>
              <button
                className={activeTab === p ? 'active' : ''}
                onClick={() => setActiveTab(p)}
                style={activeTab === p ? { color: '#3b82f6', background: 'rgba(59,130,246,0.1)' } : {}}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="btn btn-sm" style={{ background: '#3b82f6', color: '#fff', borderRadius: 'var(--radius-pill)', fontWeight: 600 }} onClick={() => setDemoModal(true)}>
            Request Demo
          </button>
        </div>
      </nav>

      <main className="pm-main" style={{ paddingTop: '124px' }}>
        {activeTab === 'home' && (
          <div>
            {/* Hero */}
            <section style={{ minHeight: '78vh', display: 'flex', alignItems: 'center', background: theme === 'light' ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #f8fafc 100%)' : 'radial-gradient(ellipse at 70% 30%, rgba(59,130,246,0.2), transparent 70%), linear-gradient(180deg, #030712 0%, #080e21 100%)', position: 'relative' }}>
              <div className="container" style={{ padding: 'var(--space-10) var(--space-6)' }}>
                <div className="badge" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.35)', marginBottom: 'var(--space-4)', display: 'inline-flex', padding: '6px 14px', borderRadius: 'var(--radius-pill)', fontSize: '0.75rem', fontWeight: 700 }}>
                  🚀 NEXT-GEN ENTERPRISE CLOUD PLATFORM
                </div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: 'var(--space-4)', color: theme === 'light' ? '#0f172a' : '#f8fafc' }}>
                  Intelligent Identity.<br />
                  <span style={{ color: '#3b82f6' }}>Engineered for Scale.</span>
                </h1>
                <p style={{ fontSize: '1.15rem', color: theme === 'light' ? '#475569' : '#cbd5e1', maxWidth: 560, marginBottom: 'var(--space-8)', lineHeight: 1.7 }}>
                  Autonomous identity orchestration, zero-trust security architecture, and unified API gateways built for high-throughput engineering teams.
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                  <button className="btn btn-lg" style={{ background: '#3b82f6', color: '#fff', borderRadius: 'var(--radius-pill)', fontWeight: 700 }} onClick={() => setDemoModal(true)}>
                    Schedule 15-Min Live Demo
                  </button>
                  <button
                    className="btn btn-outline btn-lg"
                    style={{ color: theme === 'light' ? '#0f172a' : '#f8fafc', borderColor: theme === 'light' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.25)', background: theme === 'light' ? 'transparent' : 'rgba(255,255,255,0.05)' }}
                    onClick={() => setActiveTab('pricing')}
                  >
                    View Pricing Plans
                  </button>
                </div>
              </div>
            </section>

            {/* Performance Metrics */}
            <section className="container" style={{ margin: '-20px auto var(--space-10)', position: 'relative', zIndex: 10 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                {[
                  { n: '99.99%', l: 'Guaranteed SLA Uptime' },
                  { n: '18ms', l: 'Global Edge Latency' },
                  { n: '100M+', l: 'Daily Authentications' },
                  { n: 'SOC-2', l: 'Type II & ISO 27001' },
                ].map(m => (
                  <div key={m.l} style={{ background: theme === 'light' ? '#ffffff' : '#0f172a', border: `1px solid ${theme === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)'}`, borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#3b82f6', fontFamily: 'var(--font-display)' }}>{m.n}</div>
                    <div style={{ fontSize: '0.8125rem', color: theme === 'light' ? '#64748b' : '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{m.l}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* FEATURES VIEW */}
        {activeTab === 'features' && (
          <section className="pm-section container">
            <h2 className="pm-section__title">Enterprise Cloud Architecture</h2>
            <div className="pm-grid-3">
              {[
                { icon: '🛡️', title: 'Zero-Trust IAM', desc: 'Context-aware access controls with continuous biometrics and passwordless authentication.' },
                { icon: '⚡', title: 'Edge Compute API', desc: 'Deploy microservices globally across 280+ edge nodes with sub-20ms execution times.' },
                { icon: '🤖', title: 'AI Anomaly Detection', desc: 'Real-time neural threat engine detecting credential stuffing, bots, and token hijacking.' },
                { icon: '📊', title: 'Telemetry & Audit', desc: 'Granular SIEM streaming with real-time audit logs compliant with HIPAA, GDPR, and DPDP.' },
                { icon: '🔄', title: 'Seamless Webhooks', desc: 'Instant event pub/sub system with automatic exponential backoff and guaranteed delivery.' },
                { icon: '☁️', title: 'Multi-Cloud Native', desc: 'Deploy natively on AWS, Google Cloud, Azure, or on-premise Kubernetes clusters.' },
              ].map(f => (
                <div key={f.title} className="pm-highlight-card" style={{ background: theme === 'light' ? '#ffffff' : 'rgba(255,255,255,0.03)', borderColor: theme === 'light' ? 'rgba(0,0,0,0.08)' : undefined }}>
                  <div style={{ fontSize: '2rem', marginBottom: 10 }}>{f.icon}</div>
                  <h3 style={{ fontSize: '1.15rem', color: theme === 'light' ? '#0f172a' : '#fff', marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ color: theme === 'light' ? '#475569' : '#94a3b8' }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PRICING VIEW */}
        {activeTab === 'pricing' && (
          <section className="pm-section container">
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
              <h2 className="pm-section__title" style={{ marginBottom: 8 }}>Predictable, Transparent Pricing</h2>
              <p style={{ color: theme === 'light' ? '#64748b' : '#94a3b8' }}>Start free, scale on demand with no hidden egress fees.</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: theme === 'light' ? '#e2e8f0' : 'rgba(255,255,255,0.06)', padding: '6px 14px', borderRadius: 'var(--radius-pill)', marginTop: 14 }}>
                <span style={{ fontSize: '0.875rem', fontWeight: !annualBilling ? 700 : 400 }}>Monthly</span>
                <button
                  type="button"
                  onClick={() => setAnnualBilling(!annualBilling)}
                  style={{ width: 44, height: 24, borderRadius: 12, background: '#3b82f6', border: 'none', position: 'relative', cursor: 'pointer', padding: 2 }}
                >
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', transform: annualBilling ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 0.2s ease' }} />
                </button>
                <span style={{ fontSize: '0.875rem', fontWeight: annualBilling ? 700 : 400 }}>
                  Annual Billing <strong style={{ color: '#16a34a' }}>(Save 20%)</strong>
                </span>
              </div>
            </div>

            <div className="pm-grid-3">
              {[
                { name: 'Developer', monthly: '₹1,999', annual: '₹1,599', users: 'Up to 5,000 MAUs', feat: ['Standard JWT auth', '5 Edge regions', 'Community support', '99.9% SLA'] },
                { name: 'Growth', monthly: '₹6,999', annual: '₹5,599', users: 'Up to 50,000 MAUs', popular: true, feat: ['Custom domains & branding', 'Unlimited edge locations', 'Automated SSO & SAML', 'Priority 24/7 Slack'] },
                { name: 'Enterprise', monthly: '₹19,999', annual: '₹15,999', users: 'Unlimited MAUs', feat: ['Dedicated VPC peering', 'Custom SLA (99.99%)', 'Dedicated technical TAM', 'On-premise deployment'] },
              ].map(plan => (
                <div key={plan.name} className="pm-highlight-card" style={{ background: theme === 'light' ? '#ffffff' : 'rgba(255,255,255,0.03)', borderColor: plan.popular ? '#3b82f6' : (theme === 'light' ? 'rgba(0,0,0,0.08)' : undefined), position: 'relative' }}>
                  {plan.popular && (
                    <div style={{ position: 'absolute', top: -12, right: 20, background: '#3b82f6', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 'var(--radius-pill)', textTransform: 'uppercase' }}>
                      Most Popular
                    </div>
                  )}
                  <h3 style={{ fontSize: '1.25rem', color: theme === 'light' ? '#0f172a' : '#fff', marginBottom: 4 }}>{plan.name}</h3>
                  <div style={{ fontSize: '0.8125rem', color: theme === 'light' ? '#64748b' : '#94a3b8', marginBottom: 14 }}>{plan.users}</div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#3b82f6', marginBottom: 4, fontFamily: 'var(--font-display)' }}>
                    {annualBilling ? plan.annual : plan.monthly}
                    <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-muted)' }}> / month</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.875rem' }}>
                    {plan.feat.map(f => (
                      <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', background: '#3b82f6', borderColor: '#3b82f6' }} onClick={() => setDemoModal(true)}>
                    Get Started with {plan.name}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* API VIEW */}
        {activeTab === 'api' && (
          <section className="pm-section container">
            <h2 className="pm-section__title">Developer Quickstart in 3 Lines of Code</h2>
            <div style={{ background: '#0b1120', color: '#e2e8f0', padding: 24, borderRadius: 'var(--radius-lg)', fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 1.7, border: '1px solid rgba(59,130,246,0.3)', overflowX: 'auto' }}>
              <div style={{ color: '#64748b' }}>// 1. Initialize the client</div>
              <div><span style={{ color: '#38bdf8' }}>import</span> &#123; createClient &#125; <span style={{ color: '#38bdf8' }}>from</span> <span style={{ color: '#a7f3d0' }}>'@techmark/auth-sdk'</span>;</div>
              <br />
              <div style={{ color: '#64748b' }}>// 2. Authenticate session with zero-trust token</div>
              <div><span style={{ color: '#38bdf8' }}>const</span> client = <span style={{ color: '#fbbf24' }}>createClient</span>(&#123; apiKey: process.env.<span style={{ color: '#f472b6' }}>TECHMARK_API_KEY</span> &#125;);</div>
              <div><span style={{ color: '#38bdf8' }}>const</span> session = <span style={{ color: '#38bdf8' }}>await</span> client.sessions.<span style={{ color: '#fbbf24' }}>verifyToken</span>(token);</div>
              <br />
              <div style={{ color: '#4ade80' }}>// ✅ Response: Status 200 OK (Latency: 14ms)</div>
            </div>
          </section>
        )}

        {/* CONTACT VIEW */}
        {activeTab === 'contact' && (
          <div className="pm-section container" style={{ maxWidth: 600 }}>
            <h2 className="pm-section__title">Contact Sales & Enterprise Engineering</h2>
            <div className="pm-highlight-card" style={{ background: theme === 'light' ? '#ffffff' : 'rgba(255,255,255,0.03)' }}>
              <p>🏢 <strong>Global Tech HQ:</strong> TechMark Labs, HITEC City Phase 2, Hyderabad</p>
              <p>📞 <strong>Enterprise Sales:</strong> {siteConfig.phone}</p>
              <p>✉ <strong>Developer Relations:</strong> api@techmark.demo</p>
            </div>
          </div>
        )}
      </main>

      {/* Demo Modal */}
      {demoModal && (
        <div className="plot-modal-overlay" onClick={() => setDemoModal(false)}>
          <div className="plot-modal" onClick={e => e.stopPropagation()} style={{ background: theme === 'light' ? '#ffffff' : '#0f172a', color: theme === 'light' ? '#0f172a' : '#fff' }}>
            <button className="plot-modal__close" onClick={() => setDemoModal(false)}>×</button>
            {demoSent ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: 10 }}>🚀</div>
                <h3>Demo Request Received!</h3>
                <p style={{ color: theme === 'light' ? '#64748b' : '#94a3b8' }}>Our Solutions Architect will email you calendar slots within 2 hours.</p>
                <button className="btn btn-primary" style={{ marginTop: 16, background: '#3b82f6' }} onClick={() => { setDemoSent(false); setDemoModal(false); }}>Close</button>
              </div>
            ) : (
              <div>
                <h3>Schedule TechMark Enterprise Demo</h3>
                <p style={{ fontSize: '0.85rem', color: theme === 'light' ? '#64748b' : '#94a3b8', marginBottom: 16 }}>Speak with our technical engineering team for custom integration.</p>
                <form onSubmit={e => { e.preventDefault(); setDemoSent(true); }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <input className="input" placeholder="Work Email" type="email" required />
                  <input className="input" placeholder="Company Name" required />
                  <input className="input" placeholder="Your Name" required />
                  <select className="input">
                    <option>Monthly Active Users: 10k - 50k</option>
                    <option>Monthly Active Users: 50k - 200k</option>
                    <option>Monthly Active Users: 200k+</option>
                  </select>
                  <button type="submit" className="btn btn-primary" style={{ background: '#3b82f6', borderColor: '#3b82f6', justifyContent: 'center' }}>
                    Request Architecture Review
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="pm-footer" style={{ background: theme === 'light' ? '#ffffff' : '#030712', borderTopColor: theme === 'light' ? 'rgba(0,0,0,0.08)' : undefined }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: '#3b82f6' }}>TechMark Platform</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enterprise Identity & Edge Orchestration</div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Demo Template by <Link to="/" style={{ color: 'var(--brand-gold)' }}>DeccanIDentity</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
