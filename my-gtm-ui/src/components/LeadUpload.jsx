import React, { useState } from 'react';
import Papa from 'papaparse';
import useActiveOrg from '../hooks/useActiveOrg';
import useToast from '../hooks/useToast';
import CustomToast from './CustomToast';
import useCurrentUser from '../hooks/useCurrentUser';

const LeadUpload = ({ refreshLeads }) => {
  const [parsedLeads, setParsedLeads] = useState([]);
  const [importStatus, setImportStatus] = useState({});
  const user = useCurrentUser();
  const { orgId, loading: orgLoading } = useActiveOrg();
  const toast = useToast();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setParsedLeads(results.data);
        toast({ type: 'success', message: "✅ Leads parsed successfully!" });
      },
      error: (err) => {
        console.error("CSV parse error:", err);
        toast({ type: 'error', message: "❌ Failed to parse CSV" });
      }
    });
  };

  const importLead = async (lead, index) => {
    if (!user || !orgId) {
      toast({ type: 'error', message: "Missing user or organization context." });
      return;
    }

    const { name, email, title, company } = lead;

    if (!name || !email) {
      toast({ type: 'error', message: `Missing name or email on row ${index + 1}` });
      setImportStatus((prev) => ({ ...prev, [index]: 'error' }));
      return;
    }

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          title,
          company,
          user_id: user.id,
          organization_id: orgId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Import failed');
      }

      setImportStatus((prev) => ({ ...prev, [index]: 'success' }));
      toast({ type: 'success', message: `✅ Imported ${name}` });
      refreshLeads();
    } catch (err) {
      console.error(err);
      setImportStatus((prev) => ({ ...prev, [index]: 'error' }));
      toast({ type: 'error', message: `❌ Failed to import ${name}` });
    }
  };

  const importAll = () => {
    parsedLeads.forEach((lead, index) => importLead(lead, index));
  };

  if (orgLoading) return null;

  return (
    <div className="card-surface p-6 space-y-4">
      <h2 className="text-xl font-semibold neon-text">📤 Upload CSV of Leads</h2>

      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="block w-full text-sm text-white file:bg-surface file:text-white file:border-border file:rounded file:px-4 file:py-2 cursor-pointer"
      />

      {parsedLeads.length > 0 && (
        <>
          <button onClick={importAll} className="btn-neon">
            ⬆️ Import All
          </button>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-md mt-4">
              <thead className="bg-surface border-b border-border">
                <tr className="text-muted text-left uppercase text-xs">
                  <th className="border px-3 py-2">Name</th>
                  <th className="border px-3 py-2">Email</th>
                  <th className="border px-3 py-2">Title</th>
                  <th className="border px-3 py-2">Company</th>
                  <th className="border px-3 py-2 text-center">Status</th>
                  <th className="border px-3 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {parsedLeads.map((lead, index) => (
                  <tr key={index} className="hover:bg-[#1f2937] border-b border-border">
                    <td className="px-3 py-2">{lead.name}</td>
                    <td className="px-3 py-2">{lead.email}</td>
                    <td className="px-3 py-2">{lead.title || '-'}</td>
                    <td className="px-3 py-2">{lead.company || '-'}</td>
                    <td className="text-center px-3 py-2">
                      {importStatus[index] === 'success' && '✅'}
                      {importStatus[index] === 'error' && '❌'}
                    </td>
                    <td className="text-center px-3 py-2">
                      <button
                        onClick={() => importLead(lead, index)}
                        className="text-xs btn-neon px-3 py-1"
                      >
                        Import
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default LeadUpload;