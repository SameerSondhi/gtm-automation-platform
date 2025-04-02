import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { logActivity } from '../utils/logActivity.js';

const router = express.Router();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ✅ Get all messages for an org
router.get('/', async (req, res) => {
  const { organization_id } = req.query;
  if (!organization_id) return res.status(400).json({ error: 'Missing organization_id' });

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('organization_id', organization_id)
    .order('created_at', { descending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.json({ messages: data });
});

// ✅ Post a new message
router.post('/', async (req, res) => {
  const { user_id, organization_id, content, type = 'general', username = 'Anonymous' } = req.body;
  if (!user_id || !organization_id || !content) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const { data, error } = await supabase
    .from('messages')
    .insert([{ user_id, organization_id, content, type, username }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  await logActivity({
    user_id,
    organization_id,
    type: 'message-posted',
    message: `💬 ${username} posted: "${content.slice(0, 40)}..."`,
  });

  res.status(201).json({ message: data });
});

// ✅ Mark a message as read
router.patch('/:id/read', async (req, res) => {
  const { id } = req.params;
  const { user_id, organization_id } = req.body;

  const { data: msgData, error: fetchErr } = await supabase
    .from('messages')
    .select('read_by')
    .eq('id', id)
    .single();

  if (fetchErr) return res.status(500).json({ error: fetchErr.message });

  const updatedReadBy = Array.from(new Set([...(msgData.read_by || []), user_id]));

  const { error: updateErr } = await supabase
    .from('messages')
    .update({ read_by: updatedReadBy })
    .eq('id', id);

  if (updateErr) return res.status(500).json({ error: updateErr.message });

  await logActivity({
    user_id,
    organization_id,
    type: 'message-read',
    message: `📖 Marked message ${id} as read`,
  });

  res.json({ success: true });
});

export default router;