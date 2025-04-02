// File: src/components/ChartDialog.jsx
import React from 'react';
import { Dialog } from '@headlessui/react';
import { Pie } from 'react-chartjs-2';
import { X } from 'lucide-react';
import { darkChartOptions } from '../utils/chartOptions';

const ChartDialog = ({ isOpen, onClose, title, chartData }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-slate-900 p-6 border border-border shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-white text-lg font-semibold">{title}</Dialog.Title>
            <button onClick={onClose}>
              <X className="text-slate-400 hover:text-white" size={20} />
            </button>
          </div>
          <Pie data={chartData} options={darkChartOptions} />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ChartDialog;