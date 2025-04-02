import React, { useEffect, useState } from 'react';
import LeadCard from '../components/LeadCard';
import Toast from '../components/Toast';
import NewLeadForm from '../components/NewLeadForm';
import LeadUpload from '../components/LeadUpload';
import LeadTable from '../components/LeadTable';
import useActiveOrg from '../hooks/useActiveOrg';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [toast, setToast] = useState({ show: false, message: '' });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('form');
  const [visibleCount, setVisibleCount] = useState(6);
  const { orgId, loading: orgLoading } = useActiveOrg();

  const statuses = ['All', 'new', 'failed', 'synced', 'disqualified'];

  const fetchLeads = async () => {
    if (!orgId) return;
    setLoading(true);
  
    try {
      const res = await fetch(`/api/leads?organization_id=${orgId}`);
      const result = await res.json();
  
      if (res.ok) {
        setLeads(result.leads || []);
      } else {
        console.error("❌ Failed to fetch leads:", result.error);
      }
    } catch (err) {
      console.error("❌ Network error:", err);
    }
  
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, [orgId]);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const refreshLeads = async () => {
    await fetchLeads();
  };

  const filteredLeads = selectedStatus === 'All'
    ? leads
    : leads.filter((lead) => lead.status === selectedStatus);

  if (orgLoading) return <div className="p-6 text-white">Loading organization data...</div>;

  return (
    <div className="p-6 bg-background text-white min-h-screen">
      <Toast message={toast.message} show={toast.show} />

      {/* Tab Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'form', label: '+ Add Single Lead' },
          { key: 'csv', label: '📤 Upload CSV' },
          { key: 'table', label: '📄 Manage Leads' },
          { key: 'enrichment', label: '🧠 Enrichment Hub' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition border ${
              activeTab === tab.key
                ? 'bg-primary text-black neon-glow border-primary'
                : 'bg-surface text-muted border-border hover:bg-border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'form' && <NewLeadForm refreshLeads={refreshLeads} />}

      {activeTab === 'csv' && <LeadUpload refreshLeads={refreshLeads} />}

      {activeTab === 'table' && (
        <LeadTable
          leads={leads}
          refreshLeads={refreshLeads}
          loading={loading}
        />
      )}

      {activeTab === 'enrichment' && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold neon-text">AI-Enriched Leads</h2>
            <select
              className="bg-surface text-white border surface-border rounded px-2 py-1 text-sm"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {filteredLeads.length === 0 ? (
            <p className="text-sm italic text-gray-400">
              No leads found for this category.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {filteredLeads.slice(0, visibleCount).map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    refreshLeads={refreshLeads}
                    onSend={showToast}
                  />
                ))}
              </div>
              {visibleCount < filteredLeads.length && (
                <div className="text-center">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                    className="btn-neon px-4 py-2 text-sm"
                  >
                    Show More
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Leads;