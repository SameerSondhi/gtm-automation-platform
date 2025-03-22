// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import LeadCard from '../components/LeadCard';
import Table from '../components/Table';
import Toast from '../components/Toast';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '' });

  const statuses = ['All', 'New', 'Contacted', 'Qualified', 'Converted', 'Disqualified'];

  const [selectedStatus, setSelectedStatus] = useState('All');

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

const filteredLeads = selectedStatus === 'All'
  ? leads
  : leads.filter(lead => lead.status === selectedStatus);

  useEffect(() => {
    fetch('/mock/leads.json')
      .then(res => res.json())
      .then(data => {
        const enriched = data.map(lead => ({ ...lead, synced: false }));
        setLeads(enriched);
      });
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
  <h2 className="text-xl font-bold">Recent Leads</h2>
  <select
    className="border rounded px-2 py-1 text-sm"
    value={selectedStatus}
    onChange={(e) => setSelectedStatus(e.target.value)}
  >
    {statuses.map((status) => (
      <option key={status} value={status}>{status}</option>
    ))}
  </select>
</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {filteredLeads.slice(0, 4).map((lead) => (
          <LeadCard key={lead.id} lead={lead} onSend={(msg) => showToast(msg)} />
        ))}
      </div>
      <Toast message={toast.message} show={toast.show} />

      <h3 className="text-lg font-semibold mb-2">Leads Table</h3>
      <Table leads={filteredLeads} />
    </div>
  );
};

export default Dashboard;