// src/pages/Pricing.jsx
import React from 'react';
import HeaderMarketing from './HeaderMarketing';

const Pricing = () => {
  return (
    <>
      <section className="p-10 max-w-3xl mx-auto text-white text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Pricing</h1>
        <p className="text-lg text-muted mb-6">Free during open beta. No credit card required.</p>
        <div className="bg-surface p-6 rounded shadow inline-block">
          <h2 className="text-2xl font-semibold text-white mb-2">Starter</h2>
          <p className="text-muted mb-4">Everything you need to launch your GTM workflows.</p>
          <div className="text-3xl font-bold text-primary mb-2">$0</div>
          <p className="text-sm text-muted">Unlimited leads • AI features included • Realtime logs</p>
        </div>
      </section>
    </>
  );
};

export default Pricing;