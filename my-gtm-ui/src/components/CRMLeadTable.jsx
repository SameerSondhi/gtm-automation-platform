import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import useActiveOrg from '../hooks/useActiveOrg';
import LeadDetailsModal from './LeadDetailsModal';
import {
  CircleDot,
  CheckCircle,
  XCircle,
  Ban,
  Clock
} from 'lucide-react';

const statusIconMap = {
  new: <CircleDot size={18} className="text-yellow-400" />,
  synced: <CheckCircle size={18} className="text-green-400" />,
  failed: <XCircle size={18} className="text-red-400" />,
  disqualified: <Ban size={18} className="text-gray-400" />,
  pending: <Clock size={18} className="text-blue-400" />
};

const CRMLeadTable = () => {
  const { orgId } = useActiveOrg();
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);

  const fetchLeads = async () => {
    if (!orgId) return;
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('organization_id', orgId);
    if (!error) setLeads(data);
  };

  useEffect(() => {
    fetchLeads();
  }, [orgId]);

  return (
    <div className="card-surface p-4 rounded-xl">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted border-b border-border">
              <th className="text-left py-2">Name</th>
              <th className="text-left py-2">Email</th>
              <th className="text-left py-2">Status</th>
              <th className="text-left py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="border-b border-border hover:bg-slate-800 cursor-pointer"
                onClick={() => setSelectedLead(lead)}
              >
                <td className="py-2 font-medium">{lead.name}</td>
                <td className="py-2">{lead.email}</td>
                <td className="py-2">{statusIconMap[lead.status] || lead.status}</td>
                <td className="py-2 text-xs text-blue-400 underline">View</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="bg-surface border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer"
            onClick={() => setSelectedLead(lead)}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-white">{lead.name}</h3>
              <span>{statusIconMap[lead.status]}</span>
            </div>
            <p className="text-sm text-muted truncate">{lead.email}</p>
            <p className="text-xs mt-2 text-blue-400 underline">Tap to view details</p>
          </div>
        ))}
      </div>

      {/* Lead Modal */}
      {selectedLead && (
        <LeadDetailsModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          refreshLeads={fetchLeads}
        />
      )}
    </div>
  );
};

export default CRMLeadTable;