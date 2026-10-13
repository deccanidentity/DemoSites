import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import FloatingWhatsApp from './components/FloatingWhatsApp.jsx';
import Home from './pages/Home.jsx';
import TemplatesPage from './pages/TemplatesPage.jsx';
import IndustryPage from './pages/IndustryPage.jsx';
import TemplateDetail from './pages/TemplateDetail.jsx';
import PricingPage from './pages/PricingPage.jsx';
import ClientsPage from './pages/ClientsPage.jsx';
import ContactPage from './pages/ContactPage.jsx';

// Real Estate Live Demos
import PlotMarkDemo from './demos/plotmark/PlotMark.jsx';
import PlotVentureDemo from './demos/plotventure/PlotVenture.jsx';
import VillaMarkDemo from './demos/villamark/VillaMark.jsx';
import FlatMarkDemo from './demos/flatmark/FlatMark.jsx';
import DevMarkDemo from './demos/developer/DevMark.jsx';
import LaunchMarkDemo from './demos/projectlaunch/LaunchMark.jsx';
import PortalMarkDemo from './demos/portal/PortalMark.jsx';

// Multi-Industry Live Demos
import CareMarkDemo from './demos/caremark/CareMark.jsx';
import EduMarkDemo from './demos/edumark/EduMark.jsx';
import TechMarkDemo from './demos/techmark/TechMark.jsx';
import CorpMarkDemo from './demos/corpmark/CorpMark.jsx';
import DineMarkDemo from './demos/dinemark/DineMark.jsx';
import InduMarkDemo from './demos/indumark/InduMark.jsx';
import ShopMarkDemo from './demos/shopmark/ShopMark.jsx';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Something went wrong</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: 480 }}>
            An unexpected error occurred while loading this view.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Reload Page
            </button>
            <Link to="/" className="btn btn-outline" onClick={() => this.setState({ hasError: false })}>
              Return Home
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const location = useLocation();
  const isDemo = location.pathname.startsWith('/demo') || location.pathname.endsWith('/demo');

  return (
    <ErrorBoundary>
      <div className="app-container">
        <ScrollToTop />
        {!isDemo && <Nav />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/industries/:industry" element={<IndustryPage />} />
          <Route path="/templates/:slug" element={<TemplateDetail />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Live Demos - Real Estate */}
          <Route path="/demo/plotmark" element={<PlotMarkDemo />} />
          <Route path="/demo/plotventure" element={<PlotVentureDemo />} />
          <Route path="/templates/plotventure/demo" element={<PlotVentureDemo />} />
          <Route path="/demo/villamark" element={<VillaMarkDemo />} />
          <Route path="/demo/flatmark" element={<FlatMarkDemo />} />
          <Route path="/demo/developer" element={<DevMarkDemo />} />
          <Route path="/demo/projectlaunch" element={<LaunchMarkDemo />} />
          <Route path="/demo/portal" element={<PortalMarkDemo />} />

          {/* Live Demos - Multi-Domain / Industries */}
          <Route path="/demo/caremark" element={<CareMarkDemo />} />
          <Route path="/demo/edumark" element={<EduMarkDemo />} />
          <Route path="/demo/techmark" element={<TechMarkDemo />} />
          <Route path="/demo/corpmark" element={<CorpMarkDemo />} />
          <Route path="/demo/dinemark" element={<DineMarkDemo />} />
          <Route path="/demo/indumark" element={<InduMarkDemo />} />
          <Route path="/demo/shopmark" element={<ShopMarkDemo />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
        {!isDemo && <Footer />}
        <FloatingWhatsApp />
      </div>
    </ErrorBoundary>
  );
}
