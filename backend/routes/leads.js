// File: server/routes/leads.js
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { logActivity } from '../utils/logActivity.js';

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET /api/leads?organization_id=xxx
router.get('/leads', async (req, res) => {
  const { organization_id } = req.query;
  if (!organization_id) return res.status(400).json({ error: 'Missing org ID' });

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('organization_id', organization_id)
    .order('synced_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  return res.json({ leads: data });
});

// POST /api/leads
// POST /api/leads
router.post('/leads', async (req, res) => {
    const {
      name,
      email,
      title,
      company,
      user_id,
      organization_id,
      tags = [],
      notes = ''
    } = req.body;
  
    if (!name || !email || !organization_id || !user_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    try {
      const { data: insertedLead, error: insertError } = await supabase
        .from('leads')
        .insert([
          {
            name,
            email,
            title,
            company,
            status: 'new',
            synced_at: null,
            user_id,
            organization_id,
            tags,
            notes
          }
        ])
        .select()
        .single();
  
      if (insertError) {
        console.error('❌ Insert lead failed:', insertError.message);
        return res.status(500).json({ error: insertError.message });
      }
  
      // Use your reusable activity logger
      await logActivity({
        user_id,
        organization_id,
        type: 'lead-added',
        message: `➕ Added lead "${name}" (${email})`
      });
  
      return res.status(201).json({ success: true, lead: insertedLead });
    } catch (err) {
      console.error('🔥 Unexpected error adding lead:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

// PUT /api/leads/:id
// PUT /api/leads/:id
router.put('/leads/:id', async (req, res) => {
    const { id } = req.params;
    const {
      name,
      email,
      title,
      company,
      tags = [],
      notes = '',
      stage, // ✅ NEW: stage field
      user_id,
      organization_id
    } = req.body;
  
    const updateFields = { name, email, title, company, tags, notes };
    if (stage) updateFields.stage = stage; // Only add stage if provided
  
    const { error } = await supabase
      .from('leads')
      .update(updateFields)
      .eq('id', id);
  
    if (error) return res.status(500).json({ error: error.message });
  
    await logActivity({
      user_id,
      organization_id,
      type: 'lead-updated',
      message: `✏️ Updated lead "${name}" (${email})`
    });
  
    return res.json({ success: true });
  });

  // PATCH /api/leads/:id — Match frontend
router.patch('/leads/:id', async (req, res) => {
    const { id } = req.params;
    const {
      name,
      email,
      title,
      company,
      tags = [],
      notes = '',
      stage,
      user_id,
      organization_id
    } = req.body;
  
    const updateFields = { name, email, title, company, tags, notes };
    if (stage) updateFields.stage = stage;
  
    const { error } = await supabase
      .from('leads')
      .update(updateFields)
      .eq('id', id);
  
    if (error) return res.status(500).json({ error: error.message });
  
    await logActivity({
      user_id,
      organization_id,
      type: 'lead-updated',
      message: `✏️ Updated lead "${name}" (${email})`
    });
  
    return res.json({ success: true });
  });
  
// DELETE /api/leads/:id
router.delete('/leads/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id, organization_id } = req.body;

  const { error } = await supabase.from('leads').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });

  await logActivity({
    user_id,
    organization_id,
    type: 'lead-deleted',
    message: `🗑️ Deleted lead ID ${id}`
  });

  return res.json({ success: true });
});

// POST /api/leads/sync
router.post('/leads/sync', async (req, res) => {
  const { id, name, email, title, company, user_id, organization_id } = req.body;

  try {
    const result = await sendToHubspot({ name, email, title, company });

    const status = result.success ? 'synced' : 'failed';
    await supabase
      .from('leads')
      .update({ status, synced_at: new Date().toISOString() })
      .eq('id', id);

    await logActivity({
      user_id,
      organization_id,
      type: result.success ? 'hubspot-sync' : 'hubspot-sync-failed',
      message: `${result.success ? '✅' : '❌'} ${result.success ? 'Synced' : 'Failed to sync'} lead "${name}" (${email})`,
      metadata: result.success ? null : { error: result.error }
    });

    return res.json({ success: result.success, error: result.error || null });
  } catch (err) {
    console.error('Sync error:', err.message);

    await logActivity({
      user_id,
      organization_id,
      type: 'hubspot-sync-error',
      message: `❌ Exception while syncing lead "${name}"`,
      metadata: { error: err.message }
    });

    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;