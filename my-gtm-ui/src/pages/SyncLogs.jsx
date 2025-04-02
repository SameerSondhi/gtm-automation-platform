import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'react-toastify';

const SyncLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('sync_logs')
        .select(`
          id,
          event_type,
          status,
          error_msg,
          created_at,
          leads (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching sync logs:', error);
        toast({ type: 'error', message: 'Failed to load sync logs' });
      } else {
        setLogs(data);
      }
      setLoading(false);
    };

    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const leadName = log.leads?.name?.toLowerCase() || '';
    const leadEmail = log.leads?.email?.toLowerCase() || '';
    const query = searchTerm.toLowerCase();

    return (
      leadName.includes(query) ||
      leadEmail.includes(query) ||
      log.status.toLowerCase().includes(query)
    );
  });

  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-bold mb-4">Sync Logs</h2>

      {/* Search bar (always visible) */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by lead name, email, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-slate-800 text-white border border-border rounded px-3 py-2 text-sm w-full max-w-sm"
        />
      </div>

      {loading ? (
        <p className="text-gray-400">Loading sync logs...</p>
      ) : filteredLogs.length === 0 ? (
        <p className="muted">No logs match your search.</p>
      ) : (
        <div className="card-surface p-4 rounded-xl shadow mt-2 overflow-x-auto">
          <table className="min-w-full text-sm border border-border rounded-md overflow-hidden">
            <thead className="bg-surface border-b border-border">
              <tr className="text-left text-muted uppercase text-xs tracking-wider">
                <th className="px-3 py-2">Lead Name</th>
                <th className="px-3 py-2">Lead Email</th>
                <th className="px-3 py-2">Event Type</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Error Msg</th>
                <th className="px-3 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#1f2937] border-b border-border">
                  <td className="px-3 py-2">{log.leads?.name || '-'}</td>
                  <td className="px-3 py-2">{log.leads?.email || '-'}</td>
                  <td className="px-3 py-2">{log.event_type}</td>
                  <td className="px-3 py-2">
                    {log.status === 'success' ? (
                      <span className="text-green-400">Success</span>
                    ) : (
                      <span className="text-red-400">Failed</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-xs">{log.error_msg || ''}</td>
                  <td className="px-3 py-2 text-xs">{new Date(log.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SyncLogs;