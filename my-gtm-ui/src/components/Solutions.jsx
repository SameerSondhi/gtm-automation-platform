// src/pages/Solutions.jsx
import React from 'react';
import { motion } from 'framer-motion';

const useCases = [
  {
    title: 'For RevOps Teams',
    description: 'Connect lead data to GTM systems, track outreach, and sync with CRMs — fast.',
    icon: '🧩',
  },
  {
    title: 'For GTM Engineers',
    description: 'Build AI-powered workflows and test strategies without waiting for integrations.',
    icon: '⚙️',
  },
  {
    title: 'For Founders',
    description: 'Capture leads, enrich them instantly, and act on insights — all in one UI.',
    icon: '🚀',
  },
];

const Solutions = () => {
  return (
    <section id="solutions" className="p-10 max-w-5xl mx-auto text-white">
      <motion.h1
        className="text-4xl font-bold text-primary mb-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        Trusted by fast-moving GTM teams, founders, and RevOps leaders across industries.
      </motion.h1>

      <div className="grid gap-8 md:grid-cols-3">
        {useCases.map((useCase, idx) => (
          <motion.div
            key={idx}
            className="bg-surface p-6 rounded-lg shadow-xl border border-border hover:ring-1 hover:ring-primary transition text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.2 }}
            viewport={{ once: true }}
          >
            <div className="text-4xl mb-2">{useCase.icon}</div>
            <h2 className="text-xl font-semibold text-white mb-1">{useCase.title}</h2>
            <p className="text-sm text-muted">{useCase.description}</p>
          </motion.div>
        ))}
      </div>
      {/* <div className='flex justify-center items-center pt-12'>
          <h2 className="text-sm font-semibold text-center px-12 py-8 text-primary uppercase">
      Trusted by fast-moving GTM teams, founders, and RevOps leaders across industries.
    </h2>
    </div> */}
    </section>
  );
};

export default Solutions;
