import React, { useState, useEffect } from 'react';
import CRMLeadTable from '../components/CRMLeadTable';
import OrgSetupModal from '../components/OrgSetupModal';
import NewLeadForm from '../components/NewLeadForm';
import LeadUpload from '../components/LeadUpload';
import LeadEnrichmentCards from '../components/LeadEnrichmentCards';
import useOrgGuard from '../hooks/useOrgGuard';
import useActiveOrg from '../hooks/useActiveOrg';
import TagPresetsManager from '../components/TagPresetsManager';

const CRM = () => {
  const [activeTab, setActiveTab] = useState('leads');
  const { orgId, loading: loadingGuard } = useOrgGuard();
  const { orgId: activeOrgId } = useActiveOrg();
  const [leads, setLeads] = useState([]);

  const fetchLeads = async () => {
    if (!activeOrgId) return;
    const res = await fetch(`/api/leads?organization_id=${activeOrgId}`);
    const result = await res.json();
    if (res.ok) setLeads(result.leads || []);
    else console.error(result.error);
  };

  useEffect(() => {
    fetchLeads();
  }, [activeOrgId]);

  const refreshLeads = () => fetchLeads();

  if (loadingGuard) return <p className="text-white p-6">Checking organization status...</p>;

  return (
    <div className="p-6 text-white relative">
      {!orgId && <OrgSetupModal />}

      {orgId && (
        <>
          <h1 className="text-2xl font-bold neon-text mb-4">📋 CRM Dashboard</h1>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 flex-wrap">
            {[
              { key: 'addSingle', label: '➕ Add Single Lead' },
              { key: 'uploadCSV', label: '📤 Upload CSV' },
              { key: 'leads', label: '📋 Lead Table' },
              { key: 'enrichment', label: '🧠 Enrichment' },
              { key: 'tags', label: '🏷️ Tag Presets' },
            //   { key: 'tags', label: '🏷️ Tag Hub' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                  activeTab === key
                    ? 'bg-primary text-black shadow'
                    : 'bg-slate-800 text-white border-slate-600 hover:bg-slate-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'addSingle' && <NewLeadForm refreshLeads={refreshLeads} />}
          {activeTab === 'uploadCSV' && <LeadUpload refreshLeads={refreshLeads} />}
          {activeTab === 'leads' && <CRMLeadTable leads={leads} refreshLeads={refreshLeads} />}
          {activeTab === 'enrichment' && <LeadEnrichmentCards leads={leads} refreshLeads={refreshLeads} />}
          {activeTab === 'tags' && <TagPresetsManager />}
        </>
      )}
    </div>
  );
};

export default CRM;