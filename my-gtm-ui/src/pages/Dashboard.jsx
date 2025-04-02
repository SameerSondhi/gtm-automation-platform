import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement
} from 'chart.js';
import { Doughnut, Bar, Line, Pie } from 'react-chartjs-2';
import { useAuth } from '../context/AuthContext';
import { darkChartOptions } from '../utils/chartOptions';
import useActiveOrg from '../hooks/useActiveOrg';
import OrgSetupModal from '../components/OrgSetupModal';
import { Dialog } from '@headlessui/react';
import ChartDialog from '../components/ChartDialog'; // ✅ Import dialog
import useToast from '../hooks/useToast';

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement
);

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [time, setTime] = useState(new Date());
  const { user } = useAuth();
  const { orgId, loading } = useActiveOrg();
  const [preferences, setPreferences] = useState(null);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showChartDialog, setShowChartDialog] = useState(null);
  const [messagesCount, setMessagesCount] = useState(0);
  const [showSyncDialog, setShowSyncDialog] = useState(false);
  const [summary, setSummary] = useState('');
const [summaryCached, setSummaryCached] = useState(false);
const [loadingSummary, setLoadingSummary] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchLeads = async () => {
      if (!orgId) return;
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('organization_id', orgId);
      if (!error && data) {
        setLeads(data);
        setActivityLog(
          data.slice(-5).reverse().map((lead) => ({
            message:
              lead.status === 'synced'
                ? `✅ Synced ${lead.name}`
                : lead.status === 'failed'
                ? `❌ Failed to sync ${lead.name}`
                : `🆕 Added ${lead.name}`,
            timestamp: lead.synced_at || lead.created_at
          }))
        );
      }
    };

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('organization_id', orgId);

      if (!error && data) {
        setMessagesCount(
          data.filter((msg) => !msg.read_by?.includes(user?.id)).length
        );
      }
    };

    fetchLeads();
    fetchMessages();
  }, [orgId]);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const statusCounts = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  const totalLeads = leads.length;
  const leadsThisMonth = leads.filter((lead) => {
    const now = new Date();
    const created = new Date(lead.created_at);
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;

  const synced = statusCounts['synced'] || 0;
  const failed = statusCounts['failed'] || 0;
  const syncRate = synced + failed > 0 ? Math.round((synced / (synced + failed)) * 100) : 0;

  const doughnutData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: 'Lead Status',
        data: Object.values(statusCounts),
        backgroundColor: ['#22ff88', '#3B82F6', '#F59E0B', '#EF4444', '#6B7280'],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: 'Leads by Status',
        data: Object.values(statusCounts),
        backgroundColor: '#22ff88',
      },
    ],
  };

  const monthlyData = leads.reduce((acc, lead) => {
    const month = new Date(lead.created_at).toLocaleString('default', { month: 'short', year: 'numeric' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const lineData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: 'Monthly Leads Created',
        data: Object.values(monthlyData),
        borderColor: '#22ff88',
        fill: false,
        tension: 0.4
      },
    ],
  };

  const pieData = {
    labels: ['Synced', 'Failed'],
    datasets: [
      {
        label: 'Sync Results',
        data: [synced, failed],
        backgroundColor: ['#22ff88', '#EF4444']
      },
    ],
  };

  useEffect(() => {
    const fetchPrefs = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!error && data) {
        setPreferences(data);
      }
    };

    fetchPrefs();
  }, [user]);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!orgId) return;
      setLoadingSummary(true);
      try {
        const res = await fetch('/api/summary/daily', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ organization_id: orgId })
        });
  
        const result = await res.json();
        if (res.ok) {
          setSummary(result.summary);
          setSummaryCached(result.cached);
        } else {
          console.error('Summary fetch error:', result.error);
        }
      } catch (err) {
        console.error('Error fetching summary:', err);
      } finally {
        setLoadingSummary(false);
      }
    };
  
    fetchSummary();
  }, [orgId]);

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

  if (loading) {
    return <div className="p-6 text-white">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 bg-background text-white min-h-screen relative">
      {showSetupModal && <OrgSetupModal onClose={() => setShowSetupModal(false)} />}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">📊 StackPilot Dashboard</h1>
          <p className="text-sm text-white">Welcome back,{' '}
            <span className="neon-text">
              {preferences?.role || (user?.email?.split('@')[0]) || 'friend'}!
            </span></p>
        </div>
        <div className="text-right">
          <p className="text-xl font-mono font-bold text-primary">{time.toLocaleTimeString()}</p>
          <p className="text-sm text-white">{time.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

     {/* 📊 Stat Cards with Dialog Triggers */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
  {[
    {
      label: 'Total Leads',
      value: totalLeads,
      chart: {
        label: 'Lead Status Overview',
        type: Doughnut,
        data: doughnutData,
      },
    },
    {
      label: 'Leads This Month',
      value: leadsThisMonth,
      chart: {
        label: 'Monthly Leads',
        type: Line,
        data: lineData,
      },
    },
    {
      label: 'Sync Success Rate',
      value: `${syncRate}%`,
      chart: {
        label: 'Sync Success vs Failure',
        type: Pie,
        data: pieData,
      },
    },
    {
      label: 'Unread Messages',
      value: messagesCount,
      highlight: true,
      chart: {
        label: 'Unread vs Read Messages',
        type: Bar,
        data: {
          labels: ['Unread', 'Read'],
          datasets: [
            {
              label: 'Messages',
              data: [messagesCount, Math.max(0, (messagesCount && messagesCount < 50 ? 50 : 100) - messagesCount)],
              backgroundColor: ['#facc15', '#10b981'],
            },
          ],
        },
      },
    },
  ].map((item, idx) => (
    <div
      key={idx}
      onClick={() => setShowChartDialog(item.chart)}
      className={`bg-surface border ${item.highlight ? 'border-yellow-400' : 'border-primary'} 
      p-4 rounded-xl shadow text-center cursor-pointer hover:border-white transition`}
    >
      <h3 className="text-sm text-white">{item.label}</h3>
      <p className={`text-2xl font-bold ${item.highlight ? 'text-yellow-400' : 'text-primary'}`}>
        {item.value}
      </p>
      <p className="text-xs text-slate-400 mt-1">Click to explore</p>
    </div>
  ))}
</div>

      {/* Dialog */}
      <Dialog open={!!showChartDialog} onClose={() => setShowChartDialog(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-surface border border-border p-6 rounded-lg max-w-xl w-full text-white">
            <Dialog.Title className="text-xl font-bold mb-2">
              {showChartDialog?.label}
            </Dialog.Title>
            {showChartDialog && <showChartDialog.type data={showChartDialog.data} options={darkChartOptions} />}
            <div className="mt-4 text-right">
              <button onClick={() => setShowChartDialog(null)} className="btn-neon px-4 py-1 text-sm">
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
{/* 🤖 AI Summary (Placeholder) */}
{/* AI Summary */}
<div className="bg-surface border border-blue-500 p-4 rounded-xl shadow mb-6">
  <div className="flex items-center justify-between mb-2">
    <h2 className="text-lg font-bold text-blue-400">🧠 AI GTM Summary</h2>
    {summary && (
  <p className="text-xs text-slate-400 mt-2">
    Last generated at {new Date().toLocaleTimeString()}
  </p>
)}
  </div>
  {loadingSummary ? (
    <p className="text-sm text-muted">Generating summary...</p>
  ) : (
    <p className="text-sm text-white">{summary}</p>
  )}
</div>

<div className="mt-10 bg-slate-800 border border-border p-6 rounded-xl shadow space-y-4">
  <h2 className="text-xl font-semibold mb-2">🧠 Today’s Suggestions</h2>
  
  <div className="flex items-start gap-3 bg-slate-700 rounded-lg p-3">
    <span className="text-yellow-400">📨</span>
    <p className="text-sm">
      You have <span className="font-bold text-yellow-300">{messagesCount}</span> unread message(s).
      <a href="/messages" className="text-primary underline ml-1">Go to Message Board →</a>
    </p>
  </div>

  <div className="flex items-start gap-3 bg-slate-700 rounded-lg p-3">
    <span className="text-red-400">❗</span>
    <p className="text-sm">
      <span className="font-bold text-red-400">{failed}</span> lead(s) failed to sync.
      <a href="/outreach" className="text-primary underline ml-1">Review in Outreach →</a>
    </p>
  </div>

  <div className="flex items-start gap-3 bg-slate-700 rounded-lg p-3">
    <span className="text-blue-400">📈</span>
    <p className="text-sm">
      <span className="font-bold text-blue-300">{leadsThisMonth}</span> new lead(s) this month.
      <a href="/crm" className="text-primary underline ml-1">Enrich and tag them →</a>
    </p>
  </div>

  <div className="flex items-start gap-3 bg-slate-700 rounded-lg p-3">
    <span className="text-green-400">🏷️</span>
    <p className="text-sm">
      Organize your leads with tags to unlock filtering superpowers.
      <a href="/crm" className="text-primary underline ml-1">Manage Tags →</a>
    </p>
  </div>
</div>
    </div>
  );
};

export default Dashboard;