import React, { useState, useEffect } from 'react';
import './Navbar.css';

const navLinks = ['Home', 'Services', 'Solutions', 'Case Studies', 'About', 'Blog'];

const Logo = () => (
    <a href="#home" className="navbar__logo">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="7" fill="#0A0F2C" stroke="rgba(0,200,255,0.3)" strokeWidth="1" />
            {/* A shape */}
            <path d="M8 26 L14 10 L18 20" stroke="#00C8FF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Shared diagonal stroke */}
            <path d="M14 10 L28 26" stroke="#00C8FF" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            {/* L horizontal */}
            <path d="M19 26 L28 26" stroke="#00C8FF" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            {/* A crossbar */}
            <path d="M10.5 20 L16 20" stroke="#00C8FF" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
        <span className="navbar__wordmark">AntiLabs</span>
    </a>
);

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', handler, { passive: true });
        return () => window.removeEventListener('scroll', handler);
    }, []);

    return (
        <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
            <div className="navbar__inner">
                <Logo />

                <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
                    {navLinks.map(link => (
                        <li key={link}>
                            <a
                                href={`#${link.toLowerCase().replace(' ', '-')}`}
                                className="navbar__link"
                                onClick={() => setMenuOpen(false)}
                            >
                                {link}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="navbar__actions">
                    <a href="#contact" className="btn btn-secondary navbar__btn-contact">Contact Us</a>
                    <a href="#get-started" className="btn btn-primary navbar__btn-cta">Get Started</a>
                </div>

                <button
                    className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span /><span /><span />
                </button>
            </div>
        </nav>
    );
}
