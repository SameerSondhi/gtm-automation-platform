import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

router.get('/integrations/:user_id', async (req, res) => {
    const { user_id } = req.params;
    const { data, error } = await supabase
      .from('user_integrations')
      .select('*')
      .eq('user_id', user_id);
  
    if (error) return res.status(500).json({ error: error.message });
    res.json({ integrations: data });
  });
  
  router.delete('/integrations/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('user_integrations').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

export default router;