// ✅ ActivityLog.jsx Enhancements
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import OrgSetupModal from '../components/OrgSetupModal';

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showSetupModal, setShowSetupModal] = useState(false);
  const { session } = useAuth();

  const user = session?.user;

  useEffect(() => {
    const fetchLogs = async () => {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error) {
        setLogs(data);
        setFiltered(data);
      }
    };
    if (user) fetchLogs();
  }, [user]);

  useEffect(() => {
    let filteredLogs = logs;
    if (filterType !== 'all') {
      filteredLogs = filteredLogs.filter((log) => log.type === filterType);
    }
    if (search) {
      filteredLogs = filteredLogs.filter((log) =>
        log.message.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(filteredLogs);
  }, [filterType, search, logs]);

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

  return (
    <div className="p-6 relative">
      {showSetupModal && <OrgSetupModal onClose={() => setShowSetupModal(false)} />}

      <h1 className="text-2xl font-bold mb-4 neon-text">🕓 Activity Timeline</h1>
      <div className="flex gap-4 mb-4">
      <select
  value={filterType}
  onChange={(e) => setFilterType(e.target.value)}
  className="text-sm p-2 rounded bg-slate-700 border border-slate-500"
>
  <option value="all">All</option>
  <option value="lead-added">➕ Lead Added</option>
  <option value="lead-updated">✏️ Lead Updated</option>
  <option value="ai-enrichment">🧠 AI Enrichment</option>
  <option value="tag-created">🏷️ Tag Created</option>
  <option value="tag-updated">✏️ Tag Updated</option>
  <option value="tag-deleted">🗑️ Tag Deleted</option>
</select>

        <input
          type="text"
          placeholder="Search activities..."
          className="text-sm p-2 rounded bg-slate-700 border border-slate-500 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ul className="space-y-4">
        {filtered.map((log) => (
          <li key={log.id} className="p-4 bg-slate-800 rounded-lg border border-slate-600">
            <p className="text-sm text-white">{log.message}</p>
            <p className="text-xs text-slate-400 mt-1">
              {log.user_id === user.id ? 'You' : log.user_id} — {new Date(log.created_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityLog;
