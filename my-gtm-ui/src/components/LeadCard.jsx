// src/components/LeadCard.jsx
import React from 'react';
import { sendToHubspot } from '../utils/sendToHubspot';

const LeadCard = ({ lead, onSend }) => {
    const [leads, setLeads] = React.useState([]);
    const handleSend = async () => {
        const result = await sendToHubspot(lead);
    if (result.success) {
      onSend(`✅ Sent ${lead.name} to HubSpot`);
    } else {
      onSend(`❌ Failed to send ${lead.name}: ${result.error}`);
    }
      };
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h4 className="font-semibold">{lead.name}</h4>
      <p className="text-sm text-gray-500">{lead.email}</p>
      <p className="text-sm mt-1">Status: <span className="font-medium text-blue-600">{lead.status}</span></p>
      <button
        onClick={handleSend}
        className="mt-2 text-xs text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
      >
        Send to CRM
      </button>
    </div>
  );
};

export default LeadCard;