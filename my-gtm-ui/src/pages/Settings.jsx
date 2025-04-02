import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import useToast from '../hooks/useToast';
import OrgSetupModal from '../components/OrgSetupModal';

const Settings = () => {
  const [authUserId, setAuthUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchAuthUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error retrieving auth user:', error);
        toast({ type: 'error', message: 'Failed to get current user' });
        setLoading(false);
        return;
      }
      if (data?.user) {
        setAuthUserId(data.user.id);

        // Org guard check
        const res = await fetch(`/api/org/check/${data.user.id}`);
        const result = await res.json();
        if (!result.inOrg) setShowSetupModal(true);
      } else {
        setLoading(false);
      }
    };
    fetchAuthUser();
  }, []);

  const fetchUserRow = async (userId) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Failed to load user settings:', error);
      toast({ type: 'error', message: '⚠️ Could not find user row' });
    } else {
      setUserData(data);
      setDarkMode(data?.theme === 'dark');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authUserId) {
      fetchUserRow(authUserId);
    }
  }, [authUserId]);

  const handleToggleTheme = async () => {
    if (!authUserId) return;

    const newTheme = darkMode ? 'light' : 'dark';
    setDarkMode(!darkMode);

    const { error } = await supabase
      .from('users')
      .update({ theme: newTheme })
      .eq('id', authUserId);

    if (error) {
      toast({ type: 'error', message: 'Failed to update theme' });
    } else {
      toast({ type: 'success', message: `Theme set to ${newTheme}` });
      fetchUserRow(authUserId);
    }
  };

  if (loading) return <p className="p-6 text-muted">Loading settings...</p>;
  if (!authUserId) {
    return (
      <p className="p-6 text-muted">
        No authenticated user. Please <a href="/login" className="text-primary underline">log in</a>.
      </p>
    );
  }
  if (!userData) return <p className="p-6 text-muted">No user record found in the database.</p>;

  return (
    <div className="p-6 text-white">
      {showSetupModal && <OrgSetupModal onClose={() => setShowSetupModal(false)} />}

      <h1 className="text-2xl font-bold neon-text mb-4">⚙️ Settings</h1>
      <div className="card-surface p-6 rounded-xl shadow-md space-y-4">
        <div>
          <label className="block text-sm font-medium muted mb-1">Email</label>
          <p className="text-sm font-semibold">{userData.email}</p>
        </div>
        <div>
          <label className="block text-sm font-medium muted mb-1">Account Status</label>
          <p className="text-green-400 font-medium text-sm">Active</p>
        </div>
        <div>
          <label className="block text-sm font-medium muted mb-1">Created At</label>
          <p className="text-sm">{new Date(userData.created_at).toLocaleString()}</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-medium muted">Dark Mode</label>
          <button
            onClick={handleToggleTheme}
            className={`text-sm px-3 py-1 rounded font-medium transition ${
              darkMode
                ? 'bg-slate-800 text-white hover:bg-slate-700'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {darkMode ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;