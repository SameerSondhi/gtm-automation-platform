import React from 'react';
import { FiCheckCircle, FiXCircle, FiInfo } from 'react-icons/fi';

const CustomToast = ({ type = 'success', message }) => {
  const iconMap = {
    success: <FiCheckCircle className="text-green-400 text-xl" />,
    error: <FiXCircle className="text-red-400 text-xl" />,
    info: <FiInfo className="text-blue-400 text-xl" />,
  };

  const ringColor = {
    success: 'ring-green-400',
    error: 'ring-red-400',
    info: 'ring-blue-400',
  };

  const borderColor = {
    success: 'border-green-400',
    error: 'border-red-400',
    info: 'border-blue-400',
  };

  return (
    <div className={`bg-[#1a1a1a] w-full text-white p-4 rounded-xl shadow-lg flex items-center gap-3 border ${borderColor[type]} ring-1 ${ringColor[type]}`}>
      {iconMap[type]}
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default CustomToast;