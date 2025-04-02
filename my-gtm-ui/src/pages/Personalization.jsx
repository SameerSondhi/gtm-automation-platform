import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import useToast from '../hooks/useToast';
import OrgSetupModal from '../components/OrgSetupModal';

const Personalization = () => {
  const [authUserId, setAuthUserId] = useState(null);
  const [formData, setFormData] = useState({
    goal: '',
    company_type: '',
    role: '',
    theme: '',
    display_mode: ''
  });
  const [showSetupModal, setShowSetupModal] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const getAuthUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error retrieving auth user:', error);
        toast({ type: 'error', message: 'Failed to get current user' });
        return;
      }
      if (data?.user) {
        setAuthUserId(data.user.id);

        // Check for org membership
        const res = await fetch(`/api/org/check/${data.user.id}`);
        const result = await res.json();
        if (!result.inOrg) setShowSetupModal(true);
      }
    };

    getAuthUser();
  }, []);

  useEffect(() => {
    if (!authUserId) return;

    const fetchPreferences = async () => {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', authUserId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Fetch error:', error);
        toast({ type: 'error', message: 'Failed to fetch preferences' });
      } else if (data) {
        setFormData(data);
      }
    };

    fetchPreferences();
  }, [authUserId]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    if (!authUserId) return;

    const { error } = await supabase
      .from('user_preferences')
      .upsert({ ...formData, user_id: authUserId });

    if (error) {
      console.error('Save error:', error);
      toast({ type: 'error', message: '❌ Failed to save preferences' });
    } else {
      toast({ type: 'success', message: '✅ Preferences saved' });
    }
  };

  return (
    <div className="p-4 md:p-8">
      {showSetupModal && <OrgSetupModal onClose={() => setShowSetupModal(false)} />}

      <div className="card-surface p-6 md:p-10 max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold neon-text mb-6">🎯 Personalize Your Experience</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium muted mb-1">Your Primary Goal</label>
            <input
              name="goal"
              placeholder="e.g. Automate lead intake, sync with CRM..."
              value={formData.goal}
              onChange={handleChange}
              className="w-full p-2 bg-slate-800 border border-slate-600 rounded text-sm text-white placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium muted mb-1">Company Type</label>
            <input
              name="company_type"
              placeholder="e.g. SaaS, Agency, B2B, B2C"
              value={formData.company_type}
              onChange={handleChange}
              className="w-full p-2 bg-slate-800 border border-slate-600 rounded text-sm text-white placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium muted mb-1">Your Role</label>
            <input
              name="role"
              placeholder="e.g. Founder, RevOps, GTM Manager"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 bg-slate-800 border border-slate-600 rounded text-sm text-white placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium muted mb-1">Theme</label>
            <select
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              className="w-full p-2 bg-slate-800 border border-slate-600 rounded text-sm text-white"
            >
              <option value="">Choose theme</option>
              <option value="light">🌞 Light</option>
              <option value="dark">🌙 Dark</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium muted mb-1">Display Mode</label>
            <select
              name="display_mode"
              value={formData.display_mode}
              onChange={handleChange}
              className="w-full p-2 bg-slate-800 border border-slate-600 rounded text-sm text-white"
            >
              <option value="">Choose display style</option>
              <option value="simple">🧘 Simple</option>
              <option value="advanced">💻 Advanced</option>
            </select>
          </div>
        </div>

        <button onClick={handleSave} className="btn-neon mt-8">
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default Personalization;