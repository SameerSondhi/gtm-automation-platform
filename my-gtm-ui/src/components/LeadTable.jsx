// src/components/LeadTable.jsx
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { sendToHubspot } from '../utils/sendToHubspot';
import { toast } from 'react-toastify';
import { FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import CustomToast from './CustomToast';
import { useUser } from '@supabase/auth-helpers-react';
import useActiveOrg from '../hooks/useActiveOrg';

const LeadTable = ({ leads = [], refreshLeads, loading = false }) => {
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const user = useUser();
  const { orgId } = useActiveOrg();

  const handleSync = async (lead) => {
    if (!user || !orgId) return;

    const result = await sendToHubspot({
      lead,
      user_id: user.id,
      organization_id: orgId
    });

    if (!result.success) {
      toast({ type: 'error', message: `❌ Failed: ${result.error}` });
    } else {
      toast({ type: 'success', message: `✅ Synced ${lead.name}` });
    }

    refreshLeads();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (error) {
        toast({ type: 'error', message: "Error deleting lead" });
      } else {
        toast({ type: 'success', message: "Lead deleted" });
        refreshLeads();
      }
    }
  };

  const handleEdit = (lead) => {
    setEditId(lead.id);
    setEditData(lead);
  };

  const handleUpdate = async () => {
    const { id, name, email, title, company } = editData;
    const { error } = await supabase
      .from('leads')
      .update({ name, email, title, company })
      .eq('id', id);

    if (error) {
      toast({ type: 'error', message: "Update failed" });
    } else {
      toast({ type: 'success', message: "Lead updated" });
      setEditId(null);
      refreshLeads();
    }
  };

  const exportCsv = () => {
    const filteredLeads = leads.filter((lead) => {
      const matchesSearch =
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' || lead.status === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });

    if (filteredLeads.length === 0) {
      toast.warning('No leads to export.');
      return;
    }

    try {
      const headers = ['name', 'email', 'title', 'company', 'status'];
      let csvContent = headers.join(',') + '\n';

      filteredLeads.forEach((lead) => {
        const row = [
          lead.name,
          lead.email || '',
          lead.title || '',
          lead.company || '',
          lead.status || ''
        ].map((field) => `"${(field || '').replace(/"/g, '""')}"`);
        csvContent += row.join(',') + '\n';
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'leads_export.csv';
      a.click();
      URL.revokeObjectURL(url);

      toast({ type: 'success', message: 'CSV exported successfully' });
    } catch (err) {
      console.error('CSV export error:', err);
      toast({ type: 'error', message: 'Failed to export CSV' });
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.email || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || lead.status === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="card-surface mt-6 p-6">
      <div className="mb-4 flex flex-col sm:flex-row justify-between gap-3">
        <h2 className="text-xl font-semibold neon-text">📄 Manage Leads</h2>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-800 text-white border border-border rounded px-3 py-2 text-sm w-full sm:w-44"
          />
          <select
            className="bg-slate-800 text-white border border-border rounded px-3 py-2 text-sm sm:w-36"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="new">New</option>
            <option value="synced">Synced</option>
            <option value="failed">Failed</option>
          </select>
          <button onClick={exportCsv} className="btn-neon text-xs px-3 py-2">
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <p className="muted">Loading leads...</p>
        ) : filteredLeads.length === 0 ? (
          <p className="italic text-sm muted">No leads match your search/filter.</p>
        ) : (
          <table className="min-w-full text-sm border border-border rounded-md overflow-hidden">
            <thead className="bg-surface border-b border-border">
              <tr className="text-left text-muted uppercase text-xs tracking-wider">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Company</th>
                <th className="px-3 py-2 text-center">Status</th>
                <th className="px-3 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-[#1f2937] border-b border-border transition"
                >
                  {editId === lead.id ? (
                    <>
                      {['name', 'email', 'title', 'company'].map((field) => (
                        <td key={field} className="px-3 py-2">
                          <input
                            className="w-full bg-surface text-white border border-border rounded px-2 py-1 text-sm"
                            value={editData[field] || ''}
                            onChange={(e) =>
                              setEditData({ ...editData, [field]: e.target.value })
                            }
                          />
                        </td>
                      ))}
                      <td className="text-center px-3 py-2">
                        <span className="muted">{lead.status}</span>
                      </td>
                      <td className="text-center px-3 py-2 space-x-2">
                        <button
                          onClick={handleUpdate}
                          className="btn-neon text-xs px-3 py-1"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="bg-gray-600 text-white text-xs px-3 py-1 rounded hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-3 py-2">{lead.name}</td>
                      <td className="px-3 py-2">{lead.email}</td>
                      <td className="px-3 py-2">{lead.title || '-'}</td>
                      <td className="px-3 py-2">{lead.company || '-'}</td>
                      <td className="text-center px-3 py-2">
                        {lead.status === 'synced' ? (
                          <FiCheckCircle className="text-green-400 inline" />
                        ) : lead.status === 'failed' ? (
                          <FiXCircle className="text-red-400 inline" />
                        ) : (
                          <FiClock className="text-yellow-400 inline" />
                        )}
                      </td>
                      <td className="text-center px-3 py-2 space-x-2">
                        {(lead.status === 'new' || lead.status === 'failed') && (
                          <button
                            onClick={() => handleSync(lead)}
                            className="text-xs px-3 py-1 btn-neon"
                          >
                            Sync
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(lead)}
                          className="text-xs bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LeadTable;