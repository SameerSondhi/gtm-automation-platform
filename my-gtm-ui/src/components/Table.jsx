// src/components/Table.jsx
import React from 'react';

const Table = ({ leads }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Synced</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-t">
              <td className="px-4 py-2">{lead.name}</td>
              <td className="px-4 py-2">{lead.email}</td>
              <td className="px-4 py-2 text-blue-600">{lead.status}</td>
              <td className="px-4 py-2">
  <span className={lead.synced ? 'text-green-600' : 'text-red-500'}>
    {lead.synced ? 'Yes' : 'No'}
  </span>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;