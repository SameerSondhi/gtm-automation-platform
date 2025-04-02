// src/components/OrgSetupModal.jsx
import React, { useState } from 'react';
import useToast from '../hooks/useToast';
import CustomToast from './CustomToast';
import useCurrentUser from '../hooks/useCurrentUser';

const OrgSetupModal = ({ onComplete }) => {
  const user = useCurrentUser();
  const [step, setStep] = useState(1);
  const [isSolo, setIsSolo] = useState(null);
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async () => {
    if (!user) {
      toast({ type: 'error', message: "User not loaded yet." });
      return;
    }
    setLoading(true);

    const nameToUse = isSolo
      ? `${user.email.split('@')[0]}'s Workspace`
      : orgName;

    try {
      const res = await fetch('/api/org/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          name: nameToUse
        })
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || 'Failed to create organization');

      toast({ type: 'success', message: "✅ Organization created!" });
      onComplete();
    } catch (err) {
      console.error(err);
      toast({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
      <div className="bg-slate-900 rounded-lg p-6 max-w-md w-full text-white">
        <h2 className="text-xl font-bold mb-4 neon-text">🏢 Organization Setup</h2>

        {step === 1 && (
          <div className="space-y-4">
            <p className="text-lg">Are you using StackPilot solo or with a team?</p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setIsSolo(true);
                  handleSubmit();
                }}
                className="btn-neon px-4 py-2"
                disabled={loading}
              >
                🤓 Just Me
              </button>
              <button
                onClick={() => {
                  setIsSolo(false);
                  setStep(2);
                }}
                className="btn-neon px-4 py-2"
              >
                🧑‍💼 With a Team
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-lg">What’s your organization name?</p>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full p-2 rounded bg-slate-800 border border-slate-600"
              placeholder="e.g. GrowthOps Team"
            />
            <button
              onClick={handleSubmit}
              className="btn-neon px-4 py-2"
              disabled={loading || !orgName}
            >
              🚀 Create Organization
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrgSetupModal;
