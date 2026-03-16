import React from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import StatsBar from '../components/landing/StatsBar';
import HowItWorks from '../components/landing/HowItWorks';
import Calculator from '../components/landing/Calculator';
import Corridors from '../components/landing/Corridors';
import WhyPolkadot from '../components/landing/WhyPolkadot';
import TrustSecurity from '../components/landing/TrustSecurity';
import Pricing from '../components/landing/Pricing';
import ComparisonTable from '../components/landing/ComparisonTable';
import FAQ from '../components/landing/FAQ';
import AppDownload from '../components/landing/AppDownload';
import Footer from '../components/landing/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0D0D1A] overflow-x-hidden">
      <Navbar />
      <Hero />
      <StatsBar />
      <HowItWorks />
      <Calculator />
      <Corridors />
      <WhyPolkadot />
      <TrustSecurity />
      <Pricing />
      <ComparisonTable />
      <FAQ />
      <AppDownload />
      <Footer />
    </div>
  );
}
