// src/pages/LandingPage.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import HeaderMarketing from '../components/HeaderMarketing';
import { ArrowRight } from "lucide-react";
import FeatureSection from '../components/FeatureSection';
import Solutions from '../components/Solutions';
import Pricing from '../components/Pricing';
import Contact from '../components/Contact';
import Integrations from '../components/Integrations';
import Footer from '../components/Footer';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = async () => {
    await supabase.auth.signOut();
    navigate('/signup');
  };

  return (
    <div>
      <HeaderMarketing />
      <div className="w-full flex flex-col justify-center bg-background text-white overflow-hidden scroll-smooth">
        {/* Hero Section */}
        <section id="hero" className="min-h-screen flex flex-col justify-center items-center p-8 text-center max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-7xl font-extrabold text-primary drop-shadow tracking-tight leading-tight">
            Orchestrate Your GTM Workflow
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted max-w-2xl mx-auto">
            Capture leads, enrich with AI, manage outreach, and track performance — all in one elegant platform.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={handleGetStarted}
              className="bg-primary text-black font-medium px-6 py-2 rounded shadow hover:bg-green-400 transition flex items-center gap-2"
            >
              <span>Get started for free</span> <ArrowRight strokeWidth={2} />
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section id="product" className="min-h-screen flex flex-col justify-center p-6 md:p-16 bg-background border-t border-border">
          <Integrations />
        </section>

        <section id="solutions" className="min-h-screen flex flex-col justify-center p-6 md:p-16 bg-background border-t border-border">
          <Solutions />
        </section>

        <section id="pricing" className="min-h-screen flex flex-col justify-center p-6 md:p-16 bg-background border-t border-border">
          <Pricing />
        </section>

        <section id="contact" className="min-h-screen flex flex-col justify-center p-6 md:p-16 bg-background border-t border-border">
          <Contact />
        </section>

  <Footer />

      </div>
    </div>
  );
};

export default LandingPage;