// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="p-6 flex flex-col items-center text-white">
      <h2 className="text-3xl font-bold mb-4">404 — Page Not Found</h2>
      <p className="mb-4">Oops! The page you are looking for doesn't exist.</p>
      <Link to="/dashboard" className="btn-neon px-4 py-2">Go to Dashboard</Link>
    </div>
  );
};

export default NotFound;