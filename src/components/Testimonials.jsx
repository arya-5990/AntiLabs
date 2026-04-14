import React, { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './Testimonials.css';

const testimonials = [
    {
        quote: "AntiLabs didn't just migrate our infrastructure — they completely reimagined our DevOps culture. Our deployment frequency went from bi-monthly to 12 times a day. That's not a vendor relationship, that's a transformation.",
        author: 'Priya Mehta',
        title: 'CTO',
        company: 'ClearPay Financial',
        initials: 'PM',
        color: '#00C8FF',
    },
    {
        quote: "After two failed security audits with other firms, AntiLabs came in, identified 47 critical vulnerabilities, patched them in 6 weeks, and got us to ISO 27001 certification. They're the real deal.",
        author: 'Marcus Chen',
        title: 'VP of Engineering',
        company: 'HealthBridge Systems',
        initials: 'MC',
        color: '#818CF8',
    },
    {
        quote: "We needed a custom data platform to process 10TB of patient data daily with sub-second query response. AntiLabs built it in 12 weeks. Our data science team called it 'the best infrastructure they've ever worked on.'",
        author: 'Arunima Rao',
        title: 'Head of Data Science',
        company: 'Genova Analytics',
        initials: 'AR',
        color: '#34D399',
    },
];

const QuoteIcon = ({ color }) => (
    <svg width="36" height="28" viewBox="0 0 36 28" fill="none">
        <path d="M0 28V16.8C0 11.2 1.96 6.72 5.88 3.36 9.8 1.12 14.28 0 19.32 0v5.6c-3.36 0-6.16.84-8.4 2.52-2.24 1.68-3.36 4.2-3.36 7.56V17.36H16.24V28H0zm20 0V16.8c0-5.6 1.96-10.08 5.88-13.44C29.8 1.12 34.28 0 39.32 0v5.6c-3.36 0-6.16.84-8.4 2.52-2.24 1.68-3.36 4.2-3.36 7.56V17.36H36.24V28H20z" fill={color} fillOpacity="0.35" />
    </svg>
);

export default function Testimonials() {
    const [active, setActive] = useState(1);
    const { ref, visible } = useScrollReveal();

    return (
        <section id="testimonials" className="testimonials section-py">
            <div className="container" ref={ref}>
                <div className={`testimonials__header ${visible ? 'animate-fade-up' : ''}`}>
                    <span className="section-eyebrow">Client Voices</span>
                    <h2 className="section-title">What Our Clients Say</h2>
                </div>

                <div className="testimonials__grid">
                    {testimonials.map((t, i) => (
                        <div
                            key={t.author}
                            className={`glass-card testimonials__card ${active === i ? 'testimonials__card--active' : ''} ${visible ? 'animate-fade-up' : ''}`}
                            style={{ animationDelay: `${0.1 + i * 0.12}s`, '--t-color': t.color }}
                            onClick={() => setActive(i)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={e => e.key === 'Enter' && setActive(i)}
                        >
                            <QuoteIcon color={t.color} />
                            <p className="testimonials__quote">"{t.quote}"</p>
                            <div className="testimonials__author">
                                <div className="testimonials__avatar" style={{ borderColor: t.color }}>
                                    <span style={{ color: t.color }}>{t.initials}</span>
                                </div>
                                <div className="testimonials__author-info">
                                    <div className="testimonials__name">{t.author}</div>
                                    <div className="testimonials__role">{t.title} · <span className="testimonials__company">{t.company}</span></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
