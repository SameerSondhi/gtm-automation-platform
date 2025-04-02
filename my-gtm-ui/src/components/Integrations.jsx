import React from 'react';
import { motion } from 'framer-motion';
import { FiZap, FiCpu, FiMessageCircle, FiEdit3, FiBarChart2, FiBookOpen } from 'react-icons/fi';

const defaultIntegrations = [
  {
    name: 'Built-in CRM',
    key: 'hubspot',
    description: 'Track, organize, and manage leads in one streamlined interface.',
    icon: <FiZap size={28} className="text-primary" />, 
  },
  {
    name: 'Enrich with AI',
    key: 'salesforce',
    description: 'Auto-fill missing data and generate persona insights with GenAI.',
    icon: <FiCpu size={28} className="text-primary" />, 
  },
  {
    name: 'Message in Real-Time',
    key: 'slack',
    description: 'Send and receive updates instantly across your GTM stack.',
    icon: <FiMessageCircle size={28} className="text-primary" />, 
  },
  {
    name: 'Generate Outreach',
    key: 'sheets',
    description: 'Use AI to draft smart, stage-based outreach messages.',
    icon: <FiEdit3 size={28} className="text-primary" />, 
  },
  {
    name: 'Analytics & Insights',
    key: 'clearbit',
    description: 'Visualize sync performance, lead engagement, and outcomes.',
    icon: <FiBarChart2 size={28} className="text-primary" />, 
  },
  {
    name: 'Transparent Logging',
    key: 'mixtral',
    description: 'Track every action taken — enrichment, syncs, and more.',
    icon: <FiBookOpen size={28} className="text-primary" />, 
  },
];

const Integrations = () => {
  return (
    <div className="p-6 mx-auto">
      <h1 className="text-4xl font-bold neon-text mb-12 text-center">Pilot Your Productivity.</h1>

      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        {defaultIntegrations.map((integration, index) => (
          <motion.div
            key={index}
            className="card-surface p-6 rounded-lg shadow-xl border border-border hover:ring-1 hover:ring-primary transition flex gap-4 items-start"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="pt-1">{integration.icon}</div>
            <div className="flex-1">
              <p className="text-white font-semibold text-lg mb-1">{integration.name}</p>
              <p className="text-sm text-muted mb-2">{integration.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Integrations;
