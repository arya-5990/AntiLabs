import React from 'react';
import './TrustedBy.css';

const logos = [
    { name: 'Stripe', letter: 'S' },
    { name: 'Notion', letter: 'N' },
    { name: 'Figma', letter: 'F' },
    { name: 'Vercel', letter: 'V' },
    { name: 'Shopify', letter: 'SH' },
    { name: 'Airbnb', letter: 'A' },
    { name: 'GitHub', letter: 'GH' },
    { name: 'Atlassian', letter: 'AT' },
];

const LogoItem = ({ name, letter }) => (
    <div className="trusted__logo">
        <div className="trusted__logo-icon">{letter}</div>
        <span className="trusted__logo-name">{name}</span>
    </div>
);

export default function TrustedBy() {
    const doubled = [...logos, ...logos]; // For seamless marquee loop

    return (
        <section className="trusted">
            <div className="trusted__headline">
                <span className="trusted__label">Trusted by industry leaders</span>
            </div>

            <div className="trusted__marquee-wrap">
                {/* Fade masks */}
                <div className="trusted__fade trusted__fade--left" />
                <div className="trusted__fade trusted__fade--right" />

                {/* Scrolling track */}
                <div className="trusted__track">
                    {doubled.map((logo, i) => (
                        <LogoItem key={`${logo.name}-${i}`} {...logo} />
                    ))}
                </div>
            </div>
        </section>
    );
}
