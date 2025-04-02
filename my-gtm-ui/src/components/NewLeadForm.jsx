import React, { useState } from 'react';
import useToast from '../hooks/useToast';
import CustomToast from './CustomToast';
import useActiveOrg from '../hooks/useActiveOrg';
import useCurrentUser from '../hooks/useCurrentUser';

const NewLeadForm = ({ refreshLeads }) => {
  const user = useCurrentUser();
  const { orgId, loading: orgLoading } = useActiveOrg();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    company: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, title, company } = formData;

    if (!name || !email) {
      toast({type:"error", message:"Name and email are required!"});
      return;
    }

    if (!user || !orgId) {
      toast({ type: 'error', message: "Missing user/org context." });
      return;
    }

    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        title,
        company,
        user_id: user.id,
        organization_id: orgId
      })
    });

    const result = await response.json();

    if (!response.ok) {
      toast({ type: 'error', message: `Failed to add lead: ${result.error}` });
    } else {
      toast({ type: 'success', message: `✅ ${name} added as 'new'` });
      setFormData({ name: '', email: '', title: '', company: '' });
      refreshLeads();
    }
  };

  if (orgLoading) return null;

  return (
    <form onSubmit={handleSubmit} className="card-surface p-6 space-y-4 mb-6">
      <h2 className="text-xl font-semibold neon-text">➕ Add Single Lead</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {['name', 'email', 'title', 'company'].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field[0].toUpperCase() + field.slice(1)}
            value={formData[field]}
            onChange={handleChange}
            className="w-full bg-surface text-white border border-border px-3 py-2 rounded text-sm placeholder-gray-400"
          />
        ))}
      </div>

      <button type="submit" className="btn-neon">
        ➕ Add Lead
      </button>
    </form>
  );
};

export default NewLeadForm;