import React, { useEffect, useRef } from 'react';
import './Hero.css';

const stats = [
    { value: '150+', label: 'Projects' },
    { value: '40+', label: 'Enterprise Clients' },
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '24/7', label: 'NOC Support' },
];

// Animated SVG circuit grid overlay
const CircuitGrid = () => (
    <svg
        className="hero__circuit"
        viewBox="0 0 1440 900"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
    >
        <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(0,200,255,0.3)" strokeWidth="0.5" />
            </pattern>
            <pattern id="circuit" width="120" height="120" patternUnits="userSpaceOnUse">
                <circle cx="0" cy="0" r="2" fill="rgba(0,200,255,0.4)" />
                <circle cx="120" cy="0" r="2" fill="rgba(0,200,255,0.4)" />
                <circle cx="0" cy="120" r="2" fill="rgba(0,200,255,0.4)" />
                <circle cx="60" cy="60" r="1.5" fill="rgba(0,200,255,0.3)" />
                <path d="M0 0 L30 0 L30 30 M60 60 L90 60 L90 90 L120 90" fill="none" stroke="rgba(0,200,255,0.25)" strokeWidth="0.8" />
                <path d="M120 0 L90 0 L90 30 M0 120 L30 120 L30 90" fill="none" stroke="rgba(0,200,255,0.2)" strokeWidth="0.8" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#circuit)" />
    </svg>
);

export default function Hero() {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => { });
        }
    }, []);

    return (
        <section id="home" className="hero">
            {/* Background Video */}
            <video
                ref={videoRef}
                className="hero__video"
                autoPlay
                muted
                loop
                playsInline
                poster="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=80"
            >
                {/* Annotate: Use a dark cinematic data center / network traffic video here */}
                <source src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-futuristic-devices-99786-large.mp4" type="video/mp4" />
            </video>

            {/* Overlay layers */}
            <div className="hero__overlay-navy" />
            <CircuitGrid />

            {/* Content */}
            <div className="hero__content container">
                <div className="hero__text">
                    <span className="section-eyebrow hero__eyebrow">Next-Gen IT Solutions</span>

                    <h1 className="hero__h1">
                        We Engineer<br />
                        The Digital<br />
                        Infrastructure<br />
                        <span className="hero__h1--accent">Of Tomorrow.</span>
                    </h1>

                    <p className="hero__sub">
                        AntiLabs delivers enterprise-grade cybersecurity, cloud architecture, and custom software — built to scale with your ambitions.
                    </p>

                    <div className="hero__ctas">
                        <a href="#services" className="btn btn-primary btn-lg">
                            Start a Project <span>→</span>
                        </a>
                        <a href="#case-studies" className="btn btn-secondary btn-lg">
                            View Case Studies
                        </a>
                    </div>

                    {/* Micro stats */}
                    <div className="hero__stats">
                        {stats.map((s, i) => (
                            <React.Fragment key={s.label}>
                                <div className="hero__stat">
                                    <span className="hero__stat-value">{s.value}</span>
                                    <span className="hero__stat-label">{s.label}</span>
                                </div>
                                {i < stats.length - 1 && <div className="hero__stat-divider" />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="hero__scroll">
                <svg className="hero__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                </svg>
                <span className="hero__scroll-text">Scroll to explore</span>
            </div>

            {/* Bottom cyan gradient line */}
            <div className="hero__bottom-line" />
        </section>
    );
}
