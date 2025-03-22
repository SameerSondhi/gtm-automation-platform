// src/components/Sidebar.jsx
import React from 'react';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-md p-4 hidden sm:block">
      <h2 className="text-xl font-bold mb-4">GTM Dashboard</h2>
      <ul className="space-y-2">
        <li className="text-gray-700 hover:text-blue-600 cursor-pointer">Dashboard</li>
        <li className="text-gray-700 hover:text-blue-600 cursor-pointer">Leads</li>
        <li className="text-gray-700 hover:text-blue-600 cursor-pointer">API Logs</li>
      </ul>
    </div>
  );
};

export default Sidebar;