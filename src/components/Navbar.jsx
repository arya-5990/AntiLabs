import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const navItems = [
    { label: 'Home', route: '/' },
    { label: 'About', route: '/about' },
    { label: 'Services', route: '/services' },
    { label: 'Careers', route: '/careers' },
    { label: 'Testimonials', route: '/testimonials' },
];

const Logo = () => (
    <NavLink to="/" className="navbar__logo">
        <img src="/logo.png" alt="AntiLabs" className="navbar__logo-img" />
    </NavLink>
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
                    {navItems.map(item => (
                        <li key={item.label}>
                            <NavLink
                                to={item.route}
                                end={item.route === '/'}
                                className={({ isActive }) =>
                                    `navbar__link${isActive ? ' navbar__link--active' : ''}`
                                }
                                onClick={() => setMenuOpen(false)}
                            >
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                <div className="navbar__actions">
                    <NavLink to="/contact" className="btn btn-secondary navbar__btn-contact">Contact Us</NavLink>
                    <NavLink to="/#get-started" className="btn btn-primary navbar__btn-cta">Get Started</NavLink>
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

