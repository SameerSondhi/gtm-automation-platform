import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

router.get('/preferences/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', id)
      .single();
  
    if (error && error.code !== 'PGRST116') return res.status(500).json({ error: error.message });
    res.json({ preferences: data || null });
  });
  
  router.post('/preferences', async (req, res) => {
    const { user_id, ...prefs } = req.body;
    if (!user_id) return res.status(400).json({ error: 'Missing user_id' });
  
    const { error } = await supabase.from('user_preferences').upsert({ user_id, ...prefs });
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  export default router;