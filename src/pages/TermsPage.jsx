import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './TermsPage.css';

export default function TermsPage() {
    return (
        <>
            <Navbar />
            <main className="terms-page">
                <div className="container terms-container">
                    <h1 className="terms-title">Terms and Conditions – AntiLabs</h1>
                    <p className="terms-effective"><strong>Effective Date:</strong> 15 April 2026</p>

                    <p className="terms-intro">Welcome to AntiLabs. By accessing our website, services, or training programs, you agree to comply with and be bound by the following Terms and Conditions.</p>

                    <section className="terms-section">
                        <h2>1. Services</h2>
                        <p>AntiLabs provides IT services including but not limited to:</p>
                        <ul>
                            <li>Cybersecurity & Zero Trust</li>
                            <li>Cloud Infrastructure & DevOps</li>
                            <li>Custom Software Development</li>
                            <li>IT Consulting & Strategy</li>
                            <li>Managed IT Services</li>
                            <li>Data Engineering & Analytics</li>
                            <li>Training and Internship Programs</li>
                        </ul>
                        <p>We reserve the right to modify, suspend, or discontinue any service at any time without prior notice.</p>
                    </section>

                    <hr />

                    <section className="terms-section">
                        <h2>2. User Responsibilities</h2>
                        <p>By using our services, you agree:</p>
                        <ul>
                            <li>To provide accurate and complete information</li>
                            <li>Not to misuse or attempt to disrupt our systems</li>
                            <li>Not to engage in unlawful or fraudulent activities</li>
                        </ul>
                    </section>

                    <hr />

                    <section className="terms-section">
                        <h2>3. Payments</h2>
                        <ul>
                            <li>All payments must be made in full before service delivery or program access.</li>
                            <li>Fees are non-transferable unless explicitly stated.</li>
                        </ul>
                    </section>

                    <hr />

                    <section className="terms-section">
                        <h2>4. Training & Internship Programs</h2>
                        <ul>
                            <li>Enrollment in training programs does not guarantee employment.</li>
                            <li>Certificates and Letters of Recommendation (LOR) are awarded based on performance and completion criteria.</li>
                            <li>Interview opportunities may be provided but are not guaranteed.</li>
                        </ul>
                    </section>

                    <hr />

                    <section className="terms-section">
                        <h2>5. Intellectual Property</h2>
                        <p>All content, code, materials, and intellectual property developed by AntiLabs remain the property of AntiLabs unless otherwise agreed in writing.</p>
                    </section>

                    <hr />

                    <section className="terms-section">
                        <h2>6. Limitation of Liability</h2>
                        <p>AntiLabs shall not be liable for:</p>
                        <ul>
                            <li>Any indirect, incidental, or consequential damages</li>
                            <li>Loss of data, revenue, or business interruption</li>
                        </ul>
                    </section>

                    <hr />

                    <section className="terms-section">
                        <h2>7. Termination</h2>
                        <p>We reserve the right to terminate access to services or programs if:</p>
                        <ul>
                            <li>Terms are violated</li>
                            <li>Fraudulent or abusive behavior is detected</li>
                        </ul>
                    </section>

                    <hr />

                    <section className="terms-section">
                        <h2>8. Changes to Terms</h2>
                        <p>AntiLabs may update these Terms at any time. Continued use of services implies acceptance of updated terms.</p>
                    </section>

                    <hr />

                    <section className="terms-section">
                        <h2>9. Governing Law</h2>
                        <p>These Terms shall be governed by the laws of India.</p>
                    </section>

                    <hr />

                    <section className="terms-section">
                        <h2>10. Contact Information</h2>
                        <p>For any questions, contact us at: <a href="mailto:hello.antilabs@gmail.com">hello.antilabs@gmail.com</a></p>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}
