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
      </Routes>
    </>
  );
}
