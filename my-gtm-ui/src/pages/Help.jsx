// src/pages/Help.jsx
import React from 'react';
import { FaRobot, FaSyncAlt, FaTable, FaUserCog, FaInfoCircle } from 'react-icons/fa';

const Help = () => {
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold neon-text mb-6">🧠 Help & Onboarding Guide</h1>

      <div className="space-y-6">
        <section className="card-surface p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
            <FaInfoCircle className="text-blue-400" /> What is LaunchTime?
          </h2>
          <p className="text-gray-300 text-sm">
            LaunchTime is a GTM automation platform that helps you collect, sync, and manage leads across tools like HubSpot. 
            With built-in enrichment, integrations, and dashboard tracking — LaunchTime streamlines your go-to-market workflow.
          </p>
        </section>

        <section className="card-surface p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
            <FaUserCog className="text-green-400" /> Step 1: Customize Your Preferences
          </h2>
          <p className="text-gray-300 text-sm mb-2">
            Head to <strong>Personalization</strong> to set your role, goals, and interface theme. This improves your experience and adapts the platform to your needs.
          </p>
        </section>

        <section className="card-surface p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
            <FaSyncAlt className="text-yellow-400" /> Step 2: Connect Your Integrations
          </h2>
          <p className="text-gray-300 text-sm mb-2">
            Go to the <strong>Integrations</strong> tab to connect to tools like HubSpot. More integrations are coming soon (Slack, Salesforce, Clearbit, etc).
          </p>
        </section>

        <section className="card-surface p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
            <FaTable className="text-pink-400" /> Step 3: Add or Upload Leads
          </h2>
          <p className="text-gray-300 text-sm mb-2">
            Use the <strong>Leads</strong> page to add single leads, upload CSVs, or manage your existing pipeline.
            Leads can be synced to your connected CRM and reviewed in table or card format.
          </p>
        </section>

        <section className="card-surface p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
            <FaRobot className="text-purple-400" /> Bonus: AI Features (Coming Soon)
          </h2>
          <p className="text-gray-300 text-sm mb-2">
            LaunchTime will soon include AI-based enrichment, outreach generation, and scoring. Stay tuned!
          </p>
        </section>
      </div>
    </div>
  );
};

export default Help;