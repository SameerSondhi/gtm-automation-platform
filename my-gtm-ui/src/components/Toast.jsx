// src/components/Toast.jsx
import React from 'react';

const Toast = ({ message, show }) => {
  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in-out">
      {message}
    </div>
  );
};

export default Toast;