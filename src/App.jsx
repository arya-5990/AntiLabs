import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import VideoIntro from './components/VideoIntro';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustedBy from './components/TrustedBy';
import Services from './components/Services';

import WhyUs from './components/WhyUs';
import Process from './components/Process';
import Testimonials from './components/Testimonials';
import Team from './components/Team';
import CTABanner from './components/CTABanner';
import Footer from './components/Footer';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import CareersPage from './pages/CareersPage';
import ContactPage from './pages/ContactPage';
import TestimonialsPage from './pages/TestimonialsPage';
import TermsPage from './pages/TermsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

function HomePage() {
  // Persist across re-mounts: video plays only once per browser session
  const [introDone, setIntroDone] = useState(
    () => sessionStorage.getItem('introSeen') === 'true'
  );

  const handleIntroDone = () => {
    sessionStorage.setItem('introSeen', 'true');
    setIntroDone(true);
  };

  return (
    <>
      {!introDone && <VideoIntro onDone={handleIntroDone} />}
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <Services />

        <WhyUs />
        <Process />
        <Testimonials />
        <Team />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </>
  );
}
