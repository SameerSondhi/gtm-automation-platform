import React, { useEffect, useState } from 'react';
import useActiveOrg from '../hooks/useActiveOrg';
import useToast from '../hooks/useToast';
import { useAuth } from '../context/AuthContext';

const TagPresetsManager = () => {
  const { orgId, loading } = useActiveOrg();
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState({ label: '', color: '#0ea5e9' });
  const [editingTagId, setEditingTagId] = useState(null);
  const [editedTag, setEditedTag] = useState({ label: '', color: '#0ea5e9' });
  const { session } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (!orgId) return; // ✅ already used in some places
    const fetchTags = async () => {
      if (!orgId) return;
      const res = await fetch(`/api/tags?organization_id=${orgId}`);
      const result = await res.json();
      if (res.ok) {
        setTags(result.tags);
      } else {
        toast({ type: 'error', message: 'Failed to load tags' });
      }
    };

    fetchTags();
  }, [orgId]);

  const handleAddTag = async () => {
    if (!newTag.label.trim()) return;
    const res = await fetch('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: newTag.label, color: newTag.color, organization_id: orgId, user_id: session.user.id }),
    });

    const result = await res.json();
    if (res.ok) {
      setTags((prev) => [...prev, result.tag]);
      setNewTag({ label: '', color: '#0ea5e9' });
      toast({ type: 'success', message: 'Tag added' });
    } else {
      toast({ type: 'error', message: result.error || 'Error adding tag' });
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/tags/${id}`, { method: 'DELETE', body: JSON.stringify({ user_id: session.user.id, organization_id: orgId }),
    headers: { 'Content-Type': 'application/json' } })
    if (res.ok) {
      setTags((prev) => prev.filter((tag) => tag.id !== id));
      toast({ type: 'success', message: 'Tag deleted' });
    } else {
      toast({ type: 'error', message: 'Failed to delete tag' });
    }
  };

  const handleEdit = async (id) => {
    if (!editedTag.label.trim()) return;

    const res = await fetch(`/api/tags/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: editedTag.label, color: editedTag.color, organization_id: orgId, user_id: session.user.id }),
    });

    if (res.ok) {
      setTags((prev) =>
        prev.map((tag) =>
          tag.id === id ? { ...tag, label: editedTag.label, color: editedTag.color } : tag
        )
      );
      setEditingTagId(null);
      setEditedTag({ label: '', color: '#0ea5e9' });
      toast({ type: 'success', message: 'Tag updated' });
    } else {
      toast({ type: 'error', message: 'Failed to update tag' });
    }
  };

  if (loading) return null;

  return (
    <div className="card-surface p-6 rounded-lg border border-border text-white">
      <h2 className="text-xl font-bold mb-4 neon-text">🏷️ Tag Presets</h2>

      {/* Add New */}
      <div className="flex gap-2 mb-6 flex-wrap items-center">
        <input
          type="text"
          value={newTag.label}
          onChange={(e) => setNewTag((t) => ({ ...t, label: e.target.value }))}
          placeholder="New tag label"
          className="bg-slate-700 border border-border rounded px-3 py-2 text-sm w-48"
        />
        <input
          type="color"
          value={newTag.color}
          onChange={(e) => setNewTag((t) => ({ ...t, color: e.target.value }))}
          className="w-10 h-10 p-1 rounded border border-border bg-slate-700"
        />
        <button onClick={handleAddTag} className="btn-neon text-sm px-4 py-2">➕ Add</button>
      </div>

      {/* Tag List */}
      <ul className="space-y-2">
        {tags.map((tag) => (
          <li
            key={tag.id}
            className="flex items-center justify-between bg-slate-800 p-3 rounded border border-slate-600"
          >
            {editingTagId === tag.id ? (
              <div className="flex gap-2 items-center w-full">
                <input
                  type="text"
                  value={editedTag.label}
                  onChange={(e) => setEditedTag((t) => ({ ...t, label: e.target.value }))}
                  className="bg-slate-700 border border-border rounded px-3 py-1 text-sm w-full"
                />
                <input
                  type="color"
                  value={editedTag.color}
                  onChange={(e) => setEditedTag((t) => ({ ...t, color: e.target.value }))}
                  className="w-10 h-10 p-1 rounded border border-border bg-slate-700"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span
                  className="text-sm font-medium px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: tag.color || '#334155',
                    color: 'white',
                    border: '1px solid #475569',
                  }}
                >
                  {tag.label}
                </span>
              </div>
            )}

            <div className="flex gap-2">
              {editingTagId === tag.id ? (
                <>
                  <button onClick={() => handleEdit(tag.id)} className="text-green-400 text-xs">💾 Save</button>
                  <button onClick={() => setEditingTagId(null)} className="text-slate-400 text-xs">Cancel</button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditingTagId(tag.id);
                      setEditedTag({ label: tag.label, color: tag.color });
                    }}
                    className="text-yellow-400 text-xs"
                  >
                    ✏️ Edit
                  </button>
                  <button onClick={() => handleDelete(tag.id)} className="text-red-400 text-xs">🗑️ Delete</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TagPresetsManager;