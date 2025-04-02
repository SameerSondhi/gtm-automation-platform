import React, { useEffect, useState } from 'react';
import useToast from '../hooks/useToast';
import useActiveOrg from '../hooks/useActiveOrg';
import OrgSetupModal from '../components/OrgSetupModal';
import { useAuth } from '../context/AuthContext';

const Outreach = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedLeadId, setExpandedLeadId] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [editedMessages, setEditedMessages] = useState({});
  const [updatingId, setUpdatingId] = useState(null);
  const [view, setView] = useState('pending');
  const [filterTag, setFilterTag] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [showSetupModal, setShowSetupModal] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  const { orgId, loading: orgLoading } = useActiveOrg();

  // ⛔ Block usage if not in an org
  useEffect(() => {
    const checkOrg = async () => {
      if (!user) return;
      try {
        const res = await fetch(`/api/org/check/${user.id}`);
        const result = await res.json();
        if (!result.inOrg) setShowSetupModal(true);
      } catch (err) {
        console.error('Error checking organization status:', err);
      }
    };
    checkOrg();
  }, [user]);

  useEffect(() => {
    const fetchLeads = async () => {
      if (!orgId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/leads?organization_id=${orgId}`);
        const result = await res.json();
        if (!res.ok) throw new Error(result.error);
        setLeads(result.leads);
      } catch (error) {
        console.error('Error fetching leads:', error);
        toast({ type: 'error', message: 'Failed to load outreach leads' });
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [orgId]);

  useEffect(() => {
    const initialEdited = {};
    leads.forEach((lead) => {
      if (lead.outreach_message) {
        initialEdited[lead.id] = lead.outreach_message;
      }
    });
    setEditedMessages(initialEdited);
  }, [leads]);

  const handleGenerateOutreach = async (lead, regenerate = false) => {
    if (!regenerate && lead.outreach_message) return;
    setLoadingId(lead.id);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to generate outreach message');
      }
      toast({ type: 'success', message: regenerate ? 'Message regenerated!' : 'Outreach message generated!' });
      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, outreach_message: result.outreach_message } : l))
      );
    } catch (error) {
      toast({ type: 'error', message: 'Failed to generate outreach message' });
    } finally {
      setLoadingId(null);
    }
  };

  const handleSaveMessage = async (leadId) => {
    const message = editedMessages[leadId];
    if (!message) return;
    setUpdatingId(leadId);
    try {
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, outreach_message: message })
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error);
      }

      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, outreach_message: message } : l))
      );
      toast({ type: 'success', message: 'Message saved' });
    } catch (err) {
      toast({ type: 'error', message: 'Failed to save message' });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleSent = async (lead) => {
    const newSentStatus = !lead.sent;
    try {
      const response = await fetch('/api/sent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lead.id, sent: newSentStatus })
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error);
      }

      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, sent: newSentStatus } : l))
      );
    } catch (err) {
      toast({ type: 'error', message: 'Failed to update sent status' });
    }
  };

  const handleCopy = (message) => {
    navigator.clipboard.writeText(message);
    toast({ type: 'success', message: 'Copied to clipboard!' });
  };

  const enrichedLeads = leads.filter(
    (lead) => lead.persona_summary && lead.outreach_tone
  );

  const filteredLeads = enrichedLeads.filter((lead) =>
    filterTag ? lead.tags?.includes(filterTag) : true
  );

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (sortBy === 'score-high') return (b.lead_score || 0) - (a.lead_score || 0);
    if (sortBy === 'score-low') return (a.lead_score || 0) - (b.lead_score || 0);
    if (sortBy === 'recent') return new Date(b.synced_at) - new Date(a.synced_at);
    return 0;
  });

  const pendingLeads = sortedLeads.filter((lead) => !lead.sent);
  const sentLeads = sortedLeads.filter((lead) => lead.sent);
  const leadsToShow = view === 'pending' ? pendingLeads : sentLeads;

  const uniqueTags = [...new Set(enrichedLeads.flatMap((lead) => lead.tags || []))];

  return (
    <div className="p-6 text-white">
      {showSetupModal && <OrgSetupModal onClose={() => setShowSetupModal(false)} />}

      <h2 className="text-2xl font-bold mb-6 neon-text">📬 Outreach Inbox</h2>

      {/* Toolbar */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <button
          onClick={() => setView('pending')}
          className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
            view === 'pending' ? 'bg-[#0ff] text-black border-[#0ff]' : 'bg-gray-800 text-slate-300 border-slate-600'
          }`}
        >
          ✉️ Pending ({pendingLeads.length})
        </button>

        <button
          onClick={() => setView('sent')}
          className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
            view === 'sent' ? 'bg-green-400 text-black border-green-400' : 'bg-gray-800 text-slate-300 border-slate-600'
          }`}
        >
          ✅ Sent ({sentLeads.length})
        </button>

        <select
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          className="text-sm px-3 py-1 rounded bg-gray-800 border border-slate-600 text-white"
        >
          <option value="">Filter by tag</option>
          {uniqueTags.map((tag) => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-sm px-3 py-1 rounded bg-gray-800 border border-slate-600 text-white"
        >
          <option value="">Sort by</option>
          <option value="score-high">Lead Score (High → Low)</option>
          <option value="score-low">Lead Score (Low → High)</option>
          <option value="recent">Most Recently Synced</option>
        </select>
      </div>

      {leadsToShow.length === 0 ? (
        <div className="text-center text-slate-400 italic py-8 animate-fade-in">
          {view === 'pending'
            ? 'No pending leads. You’re all caught up! 🎉'
            : 'No sent leads yet. Start sending some outreach! 🚀'}
        </div>
      ) : (
        leadsToShow.map((lead) => (
          <div
            key={lead.id}
            className="bg-surface p-4 mb-4 rounded-xl shadow border border-border cursor-pointer hover:bg-slate-800"
            onClick={(e) => {
              if (["TEXTAREA", "INPUT", "BUTTON", "A", "LABEL"].includes(e.target.tagName)) return;
              setExpandedLeadId(expandedLeadId === lead.id ? null : lead.id);
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-white">{lead.name}</h3>
                <p className="text-sm text-muted">{lead.email}</p>
                <p className="text-sm text-muted">{lead.title} @ {lead.company}</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {lead.tags?.map(tag => (
                    <span key={tag} className="text-xs bg-slate-700 text-white px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                  {lead.lead_score && (
                    <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">Score: {lead.lead_score}</span>
                  )}
                  {lead.persona_summary && (
                    <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">Persona</span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 items-center">
                {lead.sent && (
                  <span className="text-green-400 text-xs font-medium">✓ Sent</span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGenerateOutreach(lead, !!lead.outreach_message);
                  }}
                  className="btn-neon text-xs"
                  disabled={loadingId === lead.id}
                >
                  {loadingId === lead.id ? (lead.outreach_message ? 'Regenerating...' : 'Generating...') : (lead.outreach_message ? 'Regenerate' : '✨ Generate')}
                </button>
              </div>
            </div>

            {expandedLeadId === lead.id && (
              <div className="mt-4 p-3 bg-[#1e293b] rounded-md border border-border">
                {lead.outreach_message ? (
                  <>
                    <textarea
                      value={editedMessages[lead.id] ?? lead.outreach_message}
                      onChange={(e) =>
                        setEditedMessages((prev) => ({
                          ...prev,
                          [lead.id]: e.target.value,
                        }))
                      }
                      className="w-full text-sm p-2 bg-slate-800 rounded text-white border border-slate-600"
                      rows={5}
                    />
                    <div className="flex gap-3 mt-3 flex-wrap items-center">
                      <button
                        onClick={() => handleSaveMessage(lead.id)}
                        disabled={updatingId === lead.id}
                        className="bg-slate-700 text-white px-3 py-1 text-xs rounded hover:bg-slate-600"
                      >
                        💾 {updatingId === lead.id ? 'Saving...' : 'Save Message'}
                      </button>
                      <button
                        onClick={() => handleCopy(lead.outreach_message)}
                        className="bg-slate-700 text-white px-3 py-1 text-xs rounded hover:bg-slate-600"
                      >
                        📋 Copy Message
                      </button>
                      <a
                        href={`mailto:${lead.email}?subject=Let's Connect&body=${encodeURIComponent(
                          lead.outreach_message
                        )}`}
                        className="bg-slate-700 text-white px-3 py-1 text-xs rounded hover:bg-slate-600"
                      >
                        ✉️ Email Lead
                      </a>
                      <label className="flex items-center text-xs gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={lead.sent || false}
                          onChange={() => handleToggleSent(lead)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        Mark as Sent
                      </label>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted italic">
                    No message yet. Tap ✨ Generate to create one.
                  </p>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Outreach;