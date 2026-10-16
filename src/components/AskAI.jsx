import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import siteConfig from '../data/site.config.js';
import './AskAI.css';

// ─── Interactive Vector Robot Head with Waving Hand ───────────────────────────
function RobotHeadWithHand({ size = 56, showHand = true, isHappy = false }) {
  return (
    <div className="ask-ai-robo-character" style={{ width: size, height: size }}>
      <svg
        className="ask-ai-robo-svg"
        viewBox="0 0 100 92"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <filter id="robo-glow-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="robo-head-metallic" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <linearGradient id="robo-screen-glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0b1329" />
            <stop offset="100%" stopColor="#030712" />
          </linearGradient>
          <linearGradient id="robo-hand-metallic" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
        </defs>

        {/* ── Antenna with Signal Waves ── */}
        <g className="ask-ai-robo-antenna">
          <line x1="42" y1="23" x2="42" y2="12" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
          <circle cx="42" cy="10" r="5" fill="#38bdf8" filter="url(#robo-glow-filter)" className="ask-ai-antenna-orb" />
          <circle cx="42" cy="10" r="9" stroke="#38bdf8" strokeWidth="1.5" className="ask-ai-antenna-wave" />
        </g>

        {/* ── Ears / Audio Pods ── */}
        <rect x="9" y="39" width="7" height="17" rx="3.5" fill="#64748b" />
        <circle cx="12.5" cy="47.5" r="2.2" fill="#38bdf8" />
        <rect x="68" y="39" width="7" height="17" rx="3.5" fill="#64748b" />
        <circle cx="71.5" cy="47.5" r="2.2" fill="#38bdf8" />

        {/* ── Robot Head Outer Shell ── */}
        <rect
          x="14"
          y="23"
          width="56"
          height="49"
          rx="18"
          fill="url(#robo-head-metallic)"
          stroke="#cbd5e1"
          strokeWidth="1.5"
        />
        {/* Head Top Specular Highlight */}
        <path
          d="M 23 27 Q 42 24 61 27"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* ── Dark Visor Screen ── */}
        <rect
          x="21"
          y="31"
          width="42"
          height="33"
          rx="11"
          fill="url(#robo-screen-glass)"
          stroke="#1e293b"
          strokeWidth="1"
        />
        {/* Visor Glass Reflection */}
        <path d="M 24 34 L 35 34 L 29 60 L 24 60 Z" fill="rgba(255,255,255,0.08)" />

        {/* ── Normal Round Glowing Eyes ── */}
        <g className={`ask-ai-eyes-normal ${isHappy ? 'hidden' : ''}`}>
          <circle cx="33" cy="45" r="4.3" fill="#38bdf8" filter="url(#robo-glow-filter)" />
          <circle cx="34.5" cy="43.5" r="1.5" fill="#ffffff" />
          <circle cx="51" cy="45" r="4.3" fill="#38bdf8" filter="url(#robo-glow-filter)" />
          <circle cx="52.5" cy="43.5" r="1.5" fill="#ffffff" />
        </g>

        {/* ── Happy Squint Eyes (Active on Hover) ── */}
        <g className={`ask-ai-eyes-happy ${isHappy ? 'visible' : ''}`}>
          <path d="M 29 47 Q 33 41 37 47" stroke="#38bdf8" strokeWidth="2.8" strokeLinecap="round" fill="none" filter="url(#robo-glow-filter)" />
          <path d="M 47 47 Q 51 41 55 47" stroke="#38bdf8" strokeWidth="2.8" strokeLinecap="round" fill="none" filter="url(#robo-glow-filter)" />
        </g>

        {/* ── Digital Smile ── */}
        <path d="M 38 54 Q 42 58 46 54" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" fill="none" filter="url(#robo-glow-filter)" />

        {/* ── Cute Cheeks Blush on Hover ── */}
        <ellipse cx="28" cy="52" rx="3" ry="2" fill="rgba(244, 114, 182, 0.65)" className="ask-ai-cheeks" />
        <ellipse cx="56" cy="52" rx="3" ry="2" fill="rgba(244, 114, 182, 0.65)" className="ask-ai-cheeks" />

        {/* ── Robot Waving Hand (Arm + Palm + Fingers) ── */}
        {showHand && (
          <g className="ask-ai-robo-hand-assembly">
            {/* Arm Stem */}
            <path d="M 68 56 Q 77 53 80 43" stroke="#94a3b8" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            {/* Hand Palm */}
            <ellipse cx="81" cy="38" rx="6.5" ry="7.5" fill="url(#robo-hand-metallic)" stroke="#cbd5e1" strokeWidth="1.2" />
            {/* Glowing Palm Center Node */}
            <circle cx="81" cy="38" r="2.2" fill="#38bdf8" filter="url(#robo-glow-filter)" />
            {/* Fingers waving */}
            <path d="M 76 39 C 73 37 74 34 77 33" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 79 32 C 79 27 82 26 83 29" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 83 31 C 84 26 87 26 87 29" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 87 33 C 89 29 91 30 90 34" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>
        )}
      </svg>
    </div>
  );
}

// Complete dictionary of all 14 templates
const TEMPLATES_INFO = {
  plotmark: {
    slug: 'plotmark',
    name: 'PlotMark',
    badge: 'Plotted Township',
    category: 'Real Estate',
    summary: 'Flagship Open Plot & Plotted Township demo with an interactive SVG masterplan, plot size & budget filters, RERA sanction badges, instant PDF brochure download, and VIP site visit bookings.',
    demoUrl: '/demo/plotmark',
    features: ['Interactive SVG Masterplan', 'Plot Inventory & Budget Filter', 'RERA Sanction Details', 'Instant PDF Brochure Download', 'VIP Site Visit Booking Flow'],
  },
  plotventure: {
    slug: 'plotventure',
    name: 'PlotVenture',
    badge: 'Plotted Venture',
    category: 'Real Estate',
    summary: 'Modern commercial and plotted land venture template with phase-wise development tracking, master layout, investor ROI highlights, and WhatsApp enquiry.',
    demoUrl: '/demo/plotventure',
    features: ['Phase Development Roadmap', 'Plot Matrix & Availability', 'Investor ROI Highlights', '1-Click WhatsApp Enquiry'],
  },
  villamark: {
    slug: 'villamark',
    name: 'VillaMark',
    badge: 'Luxury Villas',
    category: 'Real Estate',
    summary: 'Luxury gated villa community showcase with 2/3/4 BHK duplex configurations, 100% Vaastu compliance diagrams, interactive EMI estimators, virtual video tours, and chauffeur pickup scheduling.',
    demoUrl: '/demo/villamark',
    features: ['Duplex Villa Layouts', 'Vaastu Diagrams & Floor Plans', 'Interactive EMI Estimator', 'Virtual Video Tours', 'VIP Chauffeur Pickup'],
  },
  flatmark: {
    slug: 'flatmark',
    name: 'FlatMark',
    badge: 'High-Rise Apartments',
    category: 'Real Estate',
    summary: 'High-rise apartment towers and multi-story residential developments with interactive floor plans, tower inventory breakdowns, clubhouse amenity galleries, and automated brochure delivery.',
    demoUrl: '/demo/flatmark',
    features: ['Interactive Floor Plans', 'Tower Inventory Breakdown', 'Clubhouse Amenity Showcase', 'Instant Automated Brochure Delivery'],
  },
  developer: {
    slug: 'developer',
    name: 'DevMark',
    badge: 'Builder Portfolio',
    category: 'Real Estate',
    summary: 'Corporate portfolio template for real estate developers and builders featuring completed, ongoing, and upcoming project showcases with construction milestones.',
    demoUrl: '/demo/developer',
    features: ['Project Milestones & Timeline', 'Corporate Leadership Profiles', 'Investor Relations', 'Interactive Project Filter'],
  },
  projectlaunch: {
    slug: 'projectlaunch',
    name: 'LaunchMark',
    badge: 'Project Launch',
    category: 'Real Estate',
    summary: 'High-energy launch pad and countdown teaser for mega real estate project pre-launches, early-bird VIP token bookings, and webinar registrations.',
    demoUrl: '/demo/projectlaunch',
    features: ['Countdown Launch Timer', 'VIP Early-Bird Tokens', 'Dynamic Video Backgrounds', 'Instant WhatsApp Brokering'],
  },
  portal: {
    slug: 'portal',
    name: 'PortalMark',
    badge: 'Property Portal',
    category: 'Real Estate',
    summary: 'Turnkey multi-listing digital portal designed for property brokers, real estate agencies, and regional aggregators with filtering, comparison engines, and lead distribution.',
    demoUrl: '/demo/portal',
    features: ['Multi-Listing Search Engine', 'Agent Lead Distribution', 'Comparison Matrix', 'Interactive Map Locator'],
  },
  caremark: {
    slug: 'caremark',
    name: 'CareMark',
    badge: 'Healthcare & Clinics',
    category: 'Healthcare',
    summary: 'Healthcare template designed for hospitals, diagnostic centers, and clinics with doctor profile directories, OPD schedules, emergency hotline, and patient appointments.',
    demoUrl: '/demo/caremark',
    features: ['Doctor & Specialist Directory', 'OPD Timetable & Schedules', 'Online Appointment Booking', 'Emergency 24x7 Hotline Flow'],
  },
  edumark: {
    slug: 'edumark',
    name: 'EduMark',
    badge: 'Education & Schools',
    category: 'Education',
    summary: 'Modern education portal for schools, colleges, and higher-ed academies with academic curriculum guides, online admissions applications, and campus life galleries.',
    demoUrl: '/demo/edumark',
    features: ['Course & Curriculum Explorer', 'Admissions Application Flow', 'Faculty Directory', 'Campus Virtual Tour'],
  },
  techmark: {
    slug: 'techmark',
    name: 'TechMark',
    badge: 'SaaS & AI Tech',
    category: 'Technology',
    summary: 'High-converting software, SaaS, and AI tech landing page with interactive pricing tiers, API documentation preview, and developer-first design.',
    demoUrl: '/demo/techmark',
    features: ['Feature Breakdown Grid', 'Interactive Pricing Calculator', 'API Code Sandbox Preview', 'Sub-second Lightning Performance'],
  },
  corpmark: {
    slug: 'corpmark',
    name: 'CorpMark',
    badge: 'Corporate Services',
    category: 'Business',
    summary: 'Executive website for consulting firms, corporate agencies, and financial advisory practices with client case studies, leadership bios, and RFP inquiries.',
    demoUrl: '/demo/corpmark',
    features: ['Client Case Studies', 'Executive Leadership Bios', 'RFP Submission Form', 'Global Office Locations'],
  },
  dinemark: {
    slug: 'dinemark',
    name: 'DineMark',
    badge: 'Restaurants & Dining',
    category: 'Hospitality',
    summary: 'Appetizing dining template for upscale restaurants, cafes, and cloud kitchens featuring responsive digital menus, chef specials, table reservations, and WhatsApp ordering.',
    demoUrl: '/demo/dinemark',
    features: ['Interactive Digital Menu', 'Online Table Reservation', 'Chef Specials Showcase', 'WhatsApp Direct Food Ordering'],
  },
  indumark: {
    slug: 'indumark',
    name: 'InduMark',
    badge: 'Industrial & Manufacturing',
    category: 'Industrial',
    summary: 'B2B enterprise website for manufacturing plants, heavy machinery producers, and logistics providers with equipment catalogs and quotation requests.',
    demoUrl: '/demo/indumark',
    features: ['Machinery & Product Catalog', 'ISO & Quality Certifications', 'B2B Quote Request Form', 'Factory Video Showcase'],
  },
  shopmark: {
    slug: 'shopmark',
    name: 'ShopMark',
    badge: 'Retail & E-Commerce',
    category: 'Retail',
    summary: 'Modern direct-to-consumer (D2C) e-commerce storefront with product collections, instant filtering, and frictionless 1-click WhatsApp checkout.',
    demoUrl: '/demo/shopmark',
    features: ['Product Showcase & Filters', '1-Click WhatsApp Cart Checkout', 'Customer Reviews Carousel', 'Mobile-First Shopping Experience'],
  },
};

export default function AskAI() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Detect which template the user is currently viewing (if any)
  const currentTemplateSlug = Object.keys(TEMPLATES_INFO).find(slug =>
    location.pathname.includes(`/${slug}`)
  );
  const currentTemplate = currentTemplateSlug ? TEMPLATES_INFO[currentTemplateSlug] : null;

  // Dynamic initial message based on active template
  const initialWelcome = currentTemplate
    ? {
      id: 1,
      sender: 'assistant',
      text: `Hello! 👋 I'm your AI Assistant for **${currentTemplate.name}** (${currentTemplate.badge} • ${currentTemplate.category}). Ask me anything about this template's key features, customization, pricing, or tech stack!`,
      links: [
        { label: `🔍 ${currentTemplate.name} Highlights`, to: currentTemplate.demoUrl },
        { label: '🌟 All 14 Templates', to: '/templates' },
        { label: '💰 View Pricing', to: '/pricing' },
      ],
    }
    : {
      id: 1,
      sender: 'assistant',
      text: "Hello! 👋 I'm your **DeccanIDentity AI Assistant**. Ask me anything about our 14+ live website templates, custom software engineering, pricing packages, or tech stack!",
      links: [
        { label: '🌟 Explore Templates', to: '/templates' },
        { label: '📍 PlotMark Demo', to: '/demo/plotmark' },
        { label: '💰 View Pricing', to: '/pricing' },
      ],
    };

  const [messages, setMessages] = useState([initialWelcome]);

  // Update welcome message if route changes
  useEffect(() => {
    setMessages([initialWelcome]);
  }, [location.pathname]);

  // Dynamic suggestion prompt chips
  const suggestions = currentTemplate
    ? [
      `What features are in ${currentTemplate.name}?`,
      `How much does ${currentTemplate.name} cost?`,
      `Can I customize ${currentTemplate.name}?`,
      'Explore all 14 templates',
      'Talk to human on WhatsApp',
    ]
    : [
      'What templates do you offer?',
      'Tell me about PlotMark',
      'Tell me about VillaMark & FlatMark',
      'TechMark for SaaS & Startups',
      'How much do templates cost?',
      'Talk to human on WhatsApp',
    ];

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Handle ESC key to close & custom open-ask-ai event
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    const handleOpenEvent = () => setIsOpen(true);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-ask-ai', handleOpenEvent);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-ask-ai', handleOpenEvent);
    };
  }, [isOpen]);

  // Answer matching engine
  const getAIResponse = (userQuery) => {
    const q = userQuery.toLowerCase().trim();

    // Contextual query about the currently active template
    if (currentTemplate && (q.includes('this template') || q.includes('this demo') || q.includes('this website') || q.includes('here'))) {
      return {
        text: `You're currently viewing **${currentTemplate.name}** (${currentTemplate.badge}):\n${currentTemplate.summary}\n\n**Key Included Features:**\n• ${currentTemplate.features.join('\n• ')}`,
        links: [
          { label: `🚀 Explore ${currentTemplate.name}`, to: currentTemplate.demoUrl },
          { label: '💬 Get Custom Setup Quote', href: siteConfig.whatsappLink },
        ],
      };
    }

    // Match individual templates by name or keyword
    for (const [key, t] of Object.entries(TEMPLATES_INFO)) {
      if (q.includes(key) || q.includes(t.name.toLowerCase())) {
        return {
          text: `**${t.name}** (${t.badge} • ${t.category}):\n${t.summary}\n\n**Highlights:**\n• ${t.features.join('\n• ')}`,
          links: [
            { label: `🚀 Open ${t.name} Live Demo`, to: t.demoUrl },
            { label: '💬 WhatsApp Inquiry', href: siteConfig.whatsappLink },
          ],
        };
      }
    }

    // Real estate category
    if (q.includes('real estate') || q.includes('property') || q.includes('builder') || q.includes('plot') || q.includes('villa') || q.includes('apartment')) {
      return {
        text: "We offer 7 dedicated **Real Estate templates**:\n• **PlotMark:** Open plot layouts & interactive SVG masterplan\n• **PlotVenture:** Commercial & plotted land development\n• **VillaMark:** Luxury duplex villas with 3D floor plans\n• **FlatMark:** High-rise towers with inventory matrix\n• **DevMark:** Builder corporate portfolio & timelines\n• **LaunchMark:** High-converting project pre-launch teaser\n• **PortalMark:** Multi-broker property listing aggregator",
        links: [
          { label: '🌳 PlotMark Demo', to: '/demo/plotmark' },
          { label: '🏡 VillaMark Demo', to: '/demo/villamark' },
          { label: '🏢 FlatMark Demo', to: '/demo/flatmark' },
        ],
      };
    }

    // Tech / SaaS category
    if (q.includes('tech') || q.includes('saas') || q.includes('software') || q.includes('ai') || q.includes('startup')) {
      return {
        text: "**TechMark** is designed specifically for SaaS, AI tools, and technology platforms. It features sub-second page performance, interactive pricing calculators, feature grid highlights, code sandbox snippets, and developer documentation previews.",
        links: [
          { label: '⚡ Open TechMark Demo', to: '/demo/techmark' },
          { label: '💼 CorpMark Business Demo', to: '/demo/corpmark' },
        ],
      };
    }

    // Healthcare category
    if (q.includes('health') || q.includes('doctor') || q.includes('hospital') || q.includes('clinic') || q.includes('medical') || q.includes('caremark')) {
      return {
        text: "**CareMark** is engineered for hospitals, multi-specialty clinics, and wellness providers. Features include interactive doctor directories, department schedules, appointment request forms, and 24x7 emergency contacts.",
        links: [
          { label: '🏥 Open CareMark Demo', to: '/demo/caremark' },
        ],
      };
    }

    // Education category
    if (q.includes('education') || q.includes('school') || q.includes('college') || q.includes('university') || q.includes('course') || q.includes('edumark')) {
      return {
        text: "**EduMark** is built for academic academies, K-12 schools, and university campuses. Highlights include course catalogs, virtual campus tours, admissions application flows, and faculty profiles.",
        links: [
          { label: '🎓 Open EduMark Demo', to: '/demo/edumark' },
        ],
      };
    }

    // Hospitality & Dining category
    if (q.includes('food') || q.includes('restaurant') || q.includes('dine') || q.includes('dining') || q.includes('menu') || q.includes('dinemark')) {
      return {
        text: "**DineMark** is our upscale restaurant and cloud kitchen template with interactive categorized digital menus, chef specials highlights, table reservations, and 1-click WhatsApp food ordering.",
        links: [
          { label: '🍽️ Open DineMark Demo', to: '/demo/dinemark' },
        ],
      };
    }

    // Manufacturing & B2B
    if (q.includes('industry') || q.includes('manufacturing') || q.includes('factory') || q.includes('machinery') || q.includes('indumark')) {
      return {
        text: "**InduMark** is designed for heavy manufacturing, factory operations, and engineering B2B suppliers with machine catalogs, ISO compliance badges, and quotation inquiry desks.",
        links: [
          { label: '🏭 Open InduMark Demo', to: '/demo/indumark' },
        ],
      };
    }

    // E-Commerce & Retail
    if (q.includes('shop') || q.includes('store') || q.includes('ecommerce') || q.includes('cart') || q.includes('retail') || q.includes('shopmark')) {
      return {
        text: "**ShopMark** is a sleek direct-to-consumer (D2C) e-commerce storefront with product filters, customer reviews carousel, and direct WhatsApp 1-click cart checkout without complex payment gateway hurdles.",
        links: [
          { label: '🛍️ Open ShopMark Demo', to: '/demo/shopmark' },
        ],
      };
    }

    // Pricing & Cost
    if (q.includes('price') || q.includes('cost') || q.includes('pricing') || q.includes('plan') || q.includes('rate') || q.includes('package') || q.includes('fee')) {
      return {
        text: "We offer transparent, upfront packages:\n• **Starter Template (₹4,999 - ₹14,999):** Complete source code, responsive layouts, dark/light modes & SEO setup.\n• **Professional (₹29,999):** Full custom branding, WhatsApp CRM integration, contact workflows & cloud deployment.\n• **Enterprise:** Bespoke custom full-stack software, portals, and mobile wrappers.",
        links: [
          { label: '💳 View Pricing Page', to: '/pricing' },
          { label: '💬 Get Custom Quote', href: siteConfig.whatsappLink },
        ],
      };
    }

    // Customization & Branding
    if (q.includes('custom') || q.includes('brand') || q.includes('change') || q.includes('edit') || q.includes('modify')) {
      return {
        text: "Every template is 100% customizable! We can adapt colors, typography, logos, layouts, imagery, and integrate custom APIs or WhatsApp lead routing within 48 to 72 hours.",
        links: [
          { label: '💬 Discuss Customization on WhatsApp', href: siteConfig.whatsappLink },
          { label: '📂 Browse All Templates', to: '/templates' },
        ],
      };
    }

    // All templates list
    if (q.includes('template') || q.includes('all') || q.includes('list') || q.includes('offer')) {
      return {
        text: "We offer 14 live templates across multiple industries:\n• **Real Estate:** PlotMark, PlotVenture, VillaMark, FlatMark, DevMark, LaunchMark, PortalMark\n• **Technology & SaaS:** TechMark, CorpMark\n• **Healthcare:** CareMark\n• **Education:** EduMark\n• **Dining & Hospitality:** DineMark\n• **Manufacturing & Retail:** InduMark, ShopMark",
        links: [
          { label: '📂 Browse All 14 Templates', to: '/templates' },
          { label: '⚡ TechMark SaaS Demo', to: '/demo/techmark' },
        ],
      };
    }

    // WhatsApp / Contact
    if (q.includes('whatsapp') || q.includes('contact') || q.includes('human') || q.includes('call') || q.includes('phone') || q.includes('sales') || q.includes('talk')) {
      return {
        text: `You can reach our engineering & solutions team directly on WhatsApp at **${siteConfig.whatsapp}** or phone **${siteConfig.phone}**. We typically respond within 15 minutes!`,
        links: [
          { label: '💬 Chat on WhatsApp Direct', href: siteConfig.whatsappLink },
          { label: '📞 Contact Page', to: '/contact' },
        ],
      };
    }

    // Tech Stack
    if (q.includes('react') || q.includes('vite') || q.includes('stack') || q.includes('code') || q.includes('built')) {
      return {
        text: "Our templates are engineered with **React 18 + Vite**, using pure vanilla CSS tokens (no heavy bloated libraries) with sub-second page loads, responsive design across mobile/tablet/desktop, and SEO meta tags ready for production deployment.",
        links: [
          { label: '✨ View Templates', to: '/templates' },
        ],
      };
    }

    // Intelligent default fallback
    return {
      text: "Thanks for asking! We build production-ready website templates and customized software solutions. You can explore all our interactive live demos or chat directly with our team on WhatsApp.",
      links: [
        { label: '🌟 Explore Templates', to: '/templates' },
        { label: '💬 Message on WhatsApp', href: siteConfig.whatsappLink },
      ],
    };
  };

  const handleSend = (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Natural assistant thinking delay
    setTimeout(() => {
      const response = getAIResponse(query);
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: response.text,
        links: response.links,
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <>
      {/* ── 1. Floating Action Button: Robot Head with Waving Hand ── */}
      <button
        type="button"
        className="ask-ai-fab"
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={`Open AI Assistant for ${currentTemplate ? currentTemplate.name : 'DeccanIDentity'}`}
        title="🤖 Ask AI — Click to chat"
        aria-expanded={isOpen}
      >
        {/* Subtle continuous pulse wave behind circle */}
        <span className="ask-ai-fab__pulse" aria-hidden="true" />

        {/* Vector Robot Head with Animated Waving Hand */}
        <RobotHeadWithHand size={56} showHand={true} />

        {/* Online Status Signal Dot */}
        <span className="ask-ai-fab__signal-dot" aria-hidden="true" />

        {/* "Ask AI" Speech Bubble Tooltip appearing smoothly on hover */}
        <span className="ask-ai-fab__tooltip">
          <span className="ask-ai-fab__tooltip-dot" />
          <span className="ask-ai-fab__tooltip-text">Ask AI</span>
          {currentTemplate && (
            <span className="ask-ai-fab__tooltip-badge">{currentTemplate.name}</span>
          )}
        </span>
      </button>

      {/* ── 2. Interactive AI Assistant Window ────────────────────────────── */}
      <div
        className={`ask-ai-modal-overlay ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      >
        <div
          className="ask-ai-window"
          onClick={e => e.stopPropagation()}
          role="dialog"
          aria-label="DeccanIDentity AI Assistant"
        >
          {/* Header */}
          <div className="ask-ai-header">
            <div className="ask-ai-header__brand">
              <div className="ask-ai-header__avatar">
                <RobotHeadWithHand size={32} showHand={false} isHappy={true} />
              </div>
              <div className="ask-ai-header__info">
                <div className="ask-ai-header__title">
                  {currentTemplate ? `${currentTemplate.name} AI` : 'DeccanIDentity AI'}
                  <span className="ask-ai-header__badge">● Online</span>
                </div>
                <div className="ask-ai-header__sub">
                  {currentTemplate ? `${currentTemplate.badge} Assistant` : 'Template & Engineering Assistant'}
                </div>
              </div>
            </div>
            <button
              type="button"
              className="ask-ai-header__close"
              onClick={() => setIsOpen(false)}
              aria-label="Close Ask AI window"
            >
              ✕
            </button>
          </div>

          {/* Messages Body */}
          <div className="ask-ai-body">
            {messages.map(msg => (
              <div key={msg.id} className={`ask-ai-msg ${msg.sender}`}>
                {msg.sender === 'assistant' && (
                  <div className="ask-ai-msg__avatar">
                    <RobotHeadWithHand size={24} showHand={false} />
                  </div>
                )}
                <div className="ask-ai-msg__bubble">
                  {msg.text.split('\n').map((para, i) => (
                    <p key={i} style={{ margin: i > 0 ? '6px 0 0' : 0 }}>
                      {para.replace(/\*\*(.*?)\*\*/g, '$1')}
                    </p>
                  ))}

                  {/* Interactive Action Links */}
                  {msg.links && msg.links.length > 0 && (
                    <div className="ask-ai-msg__links">
                      {msg.links.map((link, idx) => (
                        link.to ? (
                          <Link
                            key={idx}
                            to={link.to}
                            className="ask-ai-msg__link-btn"
                            onClick={() => setIsOpen(false)}
                          >
                            <span>{link.label}</span>
                            <span>→</span>
                          </Link>
                        ) : (
                          <a
                            key={idx}
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="ask-ai-msg__link-btn"
                          >
                            <span>{link.label}</span>
                            <span>↗</span>
                          </a>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="ask-ai-msg assistant">
                <div className="ask-ai-msg__avatar">
                  <RobotHeadWithHand size={24} showHand={false} />
                </div>
                <div className="ask-ai-msg__bubble ask-ai-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompt Chips */}
          <div className="ask-ai-suggestions">
            {suggestions.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                className="ask-ai-chip"
                onClick={() => handleSend(chip)}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form className="ask-ai-footer" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              className="ask-ai-input"
              placeholder={currentTemplate ? `Ask about ${currentTemplate.name}, features, pricing...` : "Ask about templates, pricing, demos..."}
              value={input}
              onChange={e => setInput(e.target.value)}
              aria-label="Your question for AI"
            />
            <button
              type="submit"
              className="ask-ai-send-btn"
              disabled={!input.trim()}
              aria-label="Send message"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
