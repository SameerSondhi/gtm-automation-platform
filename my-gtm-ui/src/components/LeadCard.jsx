// src/components/LeadCard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useActiveOrg from '../hooks/useActiveOrg';
import CustomToast from './CustomToast';
import '../css/LeadCard.css'; // rotation CSS
import useCurrentUser from '../hooks/useCurrentUser';
import useToast from '../hooks/useToast';

const LeadCard = ({ lead, onSend, refreshLeads }) => {
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [enriched, setEnriched] = useState(
    lead.enriched_at !== null
  );
  const toast = useToast();


  const user = useCurrentUser();
  const { orgId } = useActiveOrg();

  const handleSubmit = async () => {
    if (!user || !orgId) {
      toast({type:"error", message:"Missing user/org context"});
      return;
    }

    try {
      const response = await fetch('/api/leads/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: lead.id,
          name: lead.name,
          email: lead.email,
          title: lead.title,
          company: lead.company,
          user_id: user.id,
          organization_id: orgId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({ type: 'success', message: `✅ Sent ${lead.name} to HubSpot` });
      } else {
        toast({ type: 'error', message: `❌ Sync failed: ${result.error || 'Unknown error'}` });
      }

      onSend?.();
      refreshLeads?.();
    } catch (err) {
      console.error(err);
      toast({ type: 'error', message: "❌ Sync error" });
    }
  };

  const handleEnrich = async (e) => {
    e.stopPropagation();
    if (enriched) return;
    if (!user || !orgId) return;

    setLoading(true);
    try {
      const response = await fetch('/api/enrich-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...lead, user_id: user.id, organization_id: orgId }),
      });

      const result = await response.json();

      if (result.success) {
        toast({ type: 'success', message: "🧠 Lead enriched!" });
        setEnriched(true);
        refreshLeads?.();
      } else {
        throw new Error(result.error || 'Enrichment failed');
      }
    } catch (err) {
      console.error(err);
      toast({ type: 'error', message: "❌ Enrichment failed" });
    }
    setLoading(false);
  };

  return (
    <motion.div
      className="lead-card-wrapper"
      onClick={() => !loading && setFlipped(!flipped)}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`lead-card ${flipped ? 'flipped' : ''}`}>
        {/* FRONT */}
        <div className="card-side front">
          <h4 className="text-lg font-semibold neon-text">{lead.name}</h4>
          <p className="text-sm text-muted">{lead.email}</p>
          <p className="text-sm text-muted">{lead.title} @ {lead.company}</p>
          <p className="text-sm">
            Status:{' '}
            <span className={`font-semibold ${
              lead.status === 'synced' ? 'text-green-400' :
              lead.status === 'failed' ? 'text-red-400' :
              'text-yellow-400'
            }`}>
              {lead.status}
            </span>
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={handleEnrich}
              disabled={loading || enriched}
              className={`text-xs font-medium px-3 py-1 rounded transition ${
                enriched ? 'bg-green-700 text-white' :
                loading ? 'bg-gray-700 text-muted cursor-wait' :
                'btn-neon hover:bg-green-300'
              }`}
            >
              {loading ? 'Enriching...' : enriched ? '✅ Enriched' : '✨ Enrich AI'}
            </button>
          </div>
        </div>

        {/* BACK */}
        <div className="card-side back">
          <h4 className="text-md font-semibold mb-1">🧠 Enriched Insights</h4>
          <p className="text-sm mb-2"><strong>Persona:</strong> {lead.persona_summary || 'No summary'}</p>
          <p className="text-sm mb-2"><strong>Score:</strong> {lead.lead_score || 'N/A'}</p>
          <p className="text-sm"><strong>Tone:</strong> {lead.outreach_tone || 'N/A'}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default LeadCard;