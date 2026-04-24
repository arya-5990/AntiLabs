import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useScrollReveal } from '../hooks/useScrollReveal';
import SEO from '../components/SEO';
import './AboutPage.css';

/* ── Values ─────────────────────────────────── */
const values = [
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 4L4 12v10c0 8 6.4 14.4 16 18 9.6-3.6 16-10 16-18V12L20 4z" />
                <path d="M14 20l4 4 8-8" />
            </svg>
        ),
        title: 'Integrity First',
        desc: 'We say what we mean and deliver what we promise. No overselling, no hidden scope — just honest work.',
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="20" cy="20" r="16" />
                <path d="M20 12v8l6 3" />
            </svg>
        ),
        title: 'Speed with Quality',
        desc: 'We move fast without cutting corners — automated tests, code reviews, and CI/CD are non-negotiable.',
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 20h28M20 6l14 14-14 14" />
            </svg>
        ),
        title: 'Client Obsession',
        desc: 'Every architectural decision maps back to a client outcome. We measure success by the value we create, not hours billed.',
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="14" width="28" height="18" rx="3" />
                <path d="M14 14v-4a6 6 0 0112 0v4" />
            </svg>
        ),
        title: 'Security by Design',
        desc: 'Security is not a checklist item — it is woven into every layer of every system we build or audit.',
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="14" cy="14" r="6" />
                <circle cx="28" cy="28" r="6" />
                <path d="M18 18l4 4" />
            </svg>
        ),
        title: 'Continuous Learning',
        desc: 'Technology changes daily. We dedicate real time to research, certifications, and staying at the frontier.',
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 20c0-6.6 5.4-12 12-12s12 5.4 12 12" />
                <path d="M6 30c2-4 8-6 14-6s12 2 14 6" />
            </svg>
        ),
        title: 'People Over Process',
        desc: 'We build relationships, not just software. Our team is small enough to care and experienced enough to deliver.',
    },
];

const stats = [
    { value: '2+', label: 'Years Building' },
    { value: '150+', label: 'Projects Shipped' },
    { value: '40+', label: 'Happy Clients' },
    { value: '99%', label: 'Retention Rate' },
];

/* ── Section component ───────────────────────── */
function RevealSection({ children, className = '' }) {
    const { ref, visible } = useScrollReveal({ threshold: 0.08 });
    return (
        <div ref={ref} className={`ap__reveal ${visible ? 'ap__reveal--in' : ''} ${className}`}>
            {children}
        </div>
    );
}

/* ── Page ────────────────────────────────────── */
export default function AboutPage() {
    const hero = useScrollReveal({ threshold: 0.01 });

    return (
        <>
            <SEO 
                title="About Us" 
                description="Learn about AntiLabs, a premium IT services firm founded by engineers who build digital infrastructure that enterprises trust."
                canonicalUrl="/about"
            />
            <Navbar />
            <main className="ap">

                {/* ── Hero ── */}
                <section className="ap__hero">
                    <div className="ap__hero-bg" />
                    <div
                        ref={hero.ref}
                        className={`ap__hero-content container ${hero.visible ? 'ap__hero-content--in' : ''}`}
                    >
                        <span className="section-eyebrow">Who We Are</span>
                        <h1 className="ap__hero-h1">
                            We Build Digital Infrastructure<br />
                            <span className="gradient-text">That Enterprises Trust.</span>
                        </h1>
                        <p className="ap__hero-sub">
                            AntiLabs is a premium IT services firm founded by engineers who were tired of mediocre delivery.
                            We combine deep technical expertise with a founder's sense of ownership — your success is our reputation.
                        </p>
                    </div>
                </section>

                {/* ── Story ── */}
                <section className="ap__story section-py">
                    <div className="container ap__story-grid">
                        <RevealSection className="ap__story-text">
                            <span className="section-eyebrow">Our Story</span>
                            <h2 className="ap__section-h2">Built from Frustration.<br />Driven by Standards.</h2>
                            <p>
                                AntiLabs was founded when its founders kept seeing the same pattern: enterprises paying premium
                                prices for outsourced development and getting slow timelines, junior engineers, and code that broke
                                in production.
                            </p>
                            <p>
                                We set out to build something different — a firm where senior engineers own every engagement,
                                where quality is non-negotiable, and where clients actually understand what they're getting.
                            </p>
                            <p>
                                Today we work with startups shipping their first product and enterprises managing mission-critical
                                infrastructure across multiple clouds. The commitment is always the same.
                            </p>
                            <Link to="/services" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '8px' }}>
                                See Our Services →
                            </Link>
                        </RevealSection>

                        <RevealSection className="ap__stats-grid">
                            {stats.map(s => (
                                <div className="ap__stat-card" key={s.label}>
                                    <span className="ap__stat-value">{s.value}</span>
                                    <span className="ap__stat-label">{s.label}</span>
                                </div>
                            ))}
                        </RevealSection>
                    </div>
                </section>

                {/* ── Mission / Vision ── */}
                <section className="ap__mv section-py">
                    <div className="container ap__mv-grid">
                        <RevealSection>
                            <div className="ap__mv-card ap__mv-card--mission">
                                <span className="ap__mv-label">Mission</span>
                                <h3 className="ap__mv-h3">Democratise access to world-class IT delivery.</h3>
                                <p className="ap__mv-desc">
                                    Every company — regardless of size — deserves software that works, infrastructure that scales,
                                    and security that holds. We make that accessible.
                                </p>
                            </div>
                        </RevealSection>
                        <RevealSection>
                            <div className="ap__mv-card ap__mv-card--vision">
                                <span className="ap__mv-label">Vision</span>
                                <h3 className="ap__mv-h3">Be the most trusted name in technical partnership.</h3>
                                <p className="ap__mv-desc">
                                    Not the largest firm, not the cheapest — the most trusted. Known for candour, craft,
                                    and client outcomes that speak for themselves.
                                </p>
                            </div>
                        </RevealSection>
                    </div>
                </section>

                {/* ── Values ── */}
                <section className="ap__values section-py">
                    <div className="container">
                        <RevealSection>
                            <div className="ap__values-header">
                                <span className="section-eyebrow">What Drives Us</span>
                                <h2 className="ap__section-h2">Six Values We Never Compromise On</h2>
                            </div>
                        </RevealSection>
                        <div className="ap__values-grid">
                            {values.map((v, i) => (
                                <RevealSection key={v.title}>
                                    <div className="ap__value-card glass-card" style={{ animationDelay: `${i * 0.07}s` }}>
                                        <div className="ap__value-icon">{v.icon}</div>
                                        <h4 className="ap__value-title">{v.title}</h4>
                                        <p className="ap__value-desc">{v.desc}</p>
                                    </div>
                                </RevealSection>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── CTA ── */}
                <section className="ap__cta-strip">
                    <div className="container ap__cta-inner">
                        <h2 className="ap__cta-h2">Ready to work with a team that actually cares?</h2>
                        <p className="ap__cta-sub">Let's start with a free 30-minute discovery call — no commitment, full candour.</p>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <Link to="/contact" className="btn btn-primary btn-lg">Get in Touch →</Link>
                            <Link to="/careers" className="btn btn-secondary btn-lg" style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}>Join Our Team</Link>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}
