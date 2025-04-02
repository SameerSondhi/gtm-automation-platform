// File: src/pages/CollaborativeHub.jsx
import React, { useState } from 'react';
import KanbanBoard from '../components/KanbanBoard';
import TagPresetsManager from '../components/TagPresetsManager';
import MessageBoard from './MessageBoard';

const CollaborativeHub = () => {
  const [activeTab, setActiveTab] = useState('kanban');

  const tabs = [
    { key: 'kanban', label: '📌 Kanban Board' },
    { key: 'tags', label: '🏷️ Tag Presets' },
    { key: 'messages', label: '💬 Message Board' },
  ];

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6 neon-text">🤝 Collaborative Hub</h1>

      <div className="flex gap-3 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-primary text-black neon-glow border-primary'
                : 'bg-slate-800 text-muted border-border hover:bg-border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === 'kanban' && <KanbanBoard />}
        {activeTab === 'tags' && <TagPresetsManager />}
        {activeTab === 'messages' && <MessageBoard />}
      </div>
    </div>
  );
};

export default CollaborativeHub;