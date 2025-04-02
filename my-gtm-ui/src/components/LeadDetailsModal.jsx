import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Tags, NotebookPen, Sparkles, Trash2, Pencil, Check, XCircle, Plus, Minus } from 'lucide-react';
import useCurrentUser from '../hooks/useCurrentUser';
import useActiveOrg from '../hooks/useActiveOrg';
import useToast from '../hooks/useToast';

const LeadDetailsModal = ({ lead, onClose, refreshLeads }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ ...lead });
  const [saving, setSaving] = useState(false);
  const [allTags, setAllTags] = useState([]);
  const [localTags, setLocalTags] = useState(lead.tags || []);
  const user = useCurrentUser();
  const { orgId } = useActiveOrg();
  const toast = useToast();

  useEffect(() => {
    if (!orgId) return;
    const fetchTags = async () => {
      const res = await fetch(`/api/tags?organization_id=${orgId}`);
      const result = await res.json();
      if (res.ok) {
        setAllTags(result.tags);
      }
    };
    fetchTags();
  }, [orgId]);

  useEffect(() => {
    setFormData({ ...lead });
    setLocalTags(lead.tags || []);
  }, [lead]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, user_id: user.id, organization_id: orgId }),
      });
      const result = await res.json();
      if (res.ok) {
        toast({ type: 'success', message: "✅ Lead updated" });
        refreshLeads?.();
        setEditing(false);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      toast({ type: 'error', message: "❌ Update failed" });
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete ${lead.name}?`)) return;

    try {
      const res = await fetch(`/api/leads/${lead.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast({ type: 'success', message: "🗑️ Lead deleted" });
        refreshLeads?.();
        onClose();
      } else {
        const result = await res.json();
        toast({ type: 'error', message: result.error || '❌ Failed to delete' });
      }
    } catch (err) {
      console.error(err);
      toast({ type: 'error', message: "❌ Error deleting lead" });
    }
  };

  const assignTag = async (tag) => {
    setLocalTags((prev) => [...new Set([...prev, tag.id])]);

    const res = await fetch('/api/tags/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lead_id: lead.id,
        tag_id: tag.id,
        label: tag.label,
        user_id: user.id,
        organization_id: orgId
      }),
    });

    if (!res.ok) {
      toast({ type: 'error', message: `❌ Failed to add ${tag.label}` });
      setLocalTags((prev) => prev.filter((id) => id !== tag.id));
    } else {
      toast({ type: 'success', message: `🏷️ Added ${tag.label}` });
    }
  };

  const removeTag = async (tagId) => {
    const tag = allTags.find(t => t.id === tagId);
    if (!tag) return;

    setLocalTags((prev) => prev.filter((id) => id !== tag.id));

    const res = await fetch('/api/tags/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lead_id: lead.id,
        tag: tag.label,
        user_id: user.id,
        organization_id: orgId
      }),
    });

    if (!res.ok) {
      toast({ type: 'error', message: `❌ Failed to remove ${tag.label}` });
      setLocalTags((prev) => [...prev, tag.id]);
    } else {
      toast({ type: 'success', message: `🚫 Removed ${tag.label}` });
    }
  };

  if (!lead) return null;

  return (
    <Dialog open={!!lead} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-60" aria-hidden="true" />
      <Dialog.Panel className="z-50 bg-slate-900 border border-border text-white max-w-2xl w-full rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold neon-text">Lead Details</h2>
          <div className="flex items-center gap-2">
            {editing ? (
              <>
                <button onClick={handleSave} disabled={saving} className="text-green-400 hover:text-white">
                  <Check size={20} />
                </button>
                <button onClick={() => setEditing(false)} className="text-slate-400 hover:text-white">
                  <XCircle size={20} />
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setEditing(true)} className="text-yellow-400 hover:text-white">
                  <Pencil size={20} />
                </button>
                <button onClick={handleDelete} className="text-red-400 hover:text-white">
                  <Trash2 size={20} />
                </button>
              </>
            )}
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Lead Info */}
        <div className="space-y-4">
          {['name', 'email', 'title', 'company'].map((field) => (
            <div key={field}>
              <p className="text-sm text-muted capitalize">{field}</p>
              {editing ? (
                <input
                  name={field}
                  value={formData[field] || ''}
                  onChange={handleChange}
                  className="w-full p-2 text-sm bg-slate-800 border border-border rounded"
                />
              ) : (
                <p className="text-base font-medium">{lead[field]}</p>
              )}
            </div>
          ))}

          {/* Enrichment */}
          <div className="pt-4 border-t border-border">
            <h4 className="flex items-center gap-2 font-semibold text-green-400 text-sm mb-2">
              <Sparkles size={16} /> Enriched Insights
            </h4>
            <p className="text-sm mb-1"><strong>Persona:</strong> {lead.persona_summary || 'Not enriched'}</p>
            <p className="text-sm mb-1"><strong>Lead Score:</strong> {lead.lead_score || 'N/A'}</p>
            <p className="text-sm mb-1"><strong>Tone:</strong> {lead.outreach_tone || 'N/A'}</p>
          </div>

          {/* Notes */}
          <div className="pt-4 border-t border-border">
            <h4 className="flex items-center gap-2 font-semibold text-sky-400 text-sm mb-2">
              <NotebookPen size={16} /> Notes
            </h4>
            {editing ? (
              <textarea
                name="notes"
                value={formData.notes || ''}
                onChange={handleChange}
                rows={3}
                className="w-full bg-slate-800 border border-border text-sm p-2 rounded"
              />
            ) : (
              <p className="text-sm whitespace-pre-line bg-slate-800 rounded p-2 border border-slate-700">
                {lead.notes || 'No notes yet.'}
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <h4 className="flex items-center gap-2 font-semibold text-yellow-400 text-sm mt-4 mb-1">
              <Tags size={16} /> Tags
            </h4>
            {localTags?.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-3">
                {localTags.map((tagId, idx) => {
                  const tag = allTags.find(t => t.id === tagId);
                  return (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-slate-700 text-white rounded-full border border-slate-600 flex items-center gap-1"
                      style={{
                        backgroundColor: tag?.color || '#334155',
                        borderColor: tag?.color || '#475569',
                        color: 'white'
                      }}
                    >
                      {tag?.label || 'Unknown'}
                      <button
                        onClick={() => removeTag(tagId)}
                        className="ml-1 text-red-400 hover:text-white"
                      >
                        <Minus size={12} />
                      </button>
                    </span>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm italic text-muted">No tags assigned.</p>
            )}

            {/* Available tags to assign */}
            <div className="flex flex-wrap gap-2 mt-2">
              {allTags
                .filter(t => !localTags.includes(t.id))
                .map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => assignTag(tag)}
                    className="text-xs px-2 py-1 rounded-full bg-slate-800 border border-slate-600 text-primary hover:bg-slate-700 flex items-center gap-1"
                    style={{
                      backgroundColor: tag?.color || '#334155',
                      borderColor: tag?.color || '#475569',
                      color: 'white'
                    }}
                  >
                    <Plus size={12} /> {tag.label}
                  </button>
              ))}
            </div>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default LeadDetailsModal;
