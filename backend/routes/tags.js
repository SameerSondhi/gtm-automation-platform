import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { logActivity } from '../utils/logActivity.js';

const router = express.Router();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ✅ GET: All tags for an organization
router.get('/tags', async (req, res) => {
  const { organization_id } = req.query;
  if (!organization_id) return res.status(400).json({ error: 'Missing organization_id' });

  const { data, error } = await supabase
    .from('tag_presets')
    .select('*')
    .eq('organization_id', organization_id)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.json({ tags: data });
});

// ✅ POST: Create new tag
router.post('/tags', async (req, res) => {
  const { label, color, organization_id, user_id } = req.body;
  if (!label || !color || !organization_id || !user_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { data, error } = await supabase
    .from('tag_presets')
    .insert([{ label, color, organization_id }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  await logActivity({
    user_id,
    organization_id,
    type: 'tag-created',
    message: `🏷️ Created tag "${label}"`,
    metadata: { color }
  });

  res.status(201).json({ tag: data });
});

// ✅ PATCH: Edit tag name/color
router.patch('/tags/:id', async (req, res) => {
  const { id } = req.params;
  const { label, color, user_id, organization_id } = req.body;

  if (!label || !user_id || !organization_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { error } = await supabase
    .from('tag_presets')
    .update({ label, color })
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });

  await logActivity({
    user_id,
    organization_id,
    type: 'tag-updated',
    message: `✏️ Updated tag "${label}"`,
    metadata: { color }
  });

  res.json({ success: true });
});

// ✅ DELETE: Remove tag by ID
router.delete('/tags/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id, organization_id, label } = req.body;

  if (!user_id || !organization_id || !label) {
    return res.status(400).json({ error: 'Missing required fields for deletion log' });
  }

  const { error } = await supabase
    .from('tag_presets')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });

  await logActivity({
    user_id,
    organization_id,
    type: 'tag-deleted',
    message: `🗑️ Deleted tag "${label}"`,
  });

  res.json({ success: true });
});

// ✅ POST: Assign a tag to a lead
router.post('/tags/assign', async (req, res) => {
  const { lead_id, tag_id, user_id, organization_id, label } = req.body;
  if (!lead_id || !tag_id || !user_id || !organization_id || !label) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { data: leadData, error: fetchError } = await supabase
    .from('leads')
    .select('tags')
    .eq('id', lead_id)
    .single();

  if (fetchError) return res.status(500).json({ error: fetchError.message });

  const currentTags = leadData.tags || [];
  const updatedTags = [...new Set([...currentTags, tag_id])];

  const { error: updateError } = await supabase
    .from('leads')
    .update({ tags: updatedTags })
    .eq('id', lead_id);

  if (updateError) return res.status(500).json({ error: updateError.message });

  await logActivity({
    user_id,
    organization_id,
    type: 'tag-assigned',
    message: `🏷️ Assigned tag "${label}"`,
  });

  res.json({ success: true });
});


// ✅ POST: Remove a tag from a lead
router.post('/tags/remove', async (req, res) => {
  const { lead_id, tag, user_id, organization_id } = req.body;
  if (!lead_id || !tag || !user_id || !organization_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { data: leadData, error: fetchError } = await supabase
    .from('leads')
    .select('tags')
    .eq('id', lead_id)
    .single();

  if (fetchError) return res.status(500).json({ error: fetchError.message });

  const updatedTags = (leadData.tags || []).filter((t) => t !== tag);

  const { error: updateError } = await supabase
    .from('leads')
    .update({ tags: updatedTags })
    .eq('id', lead_id);

  if (updateError) return res.status(500).json({ error: updateError.message });

  await logActivity({
    user_id,
    organization_id,
    type: 'tag-removed',
    message: `🚫 Removed tag "${tag}"`,
  });

  res.json({ success: true });
});

export default router;