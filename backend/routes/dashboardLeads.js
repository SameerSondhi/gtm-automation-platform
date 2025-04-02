import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

router.get('/dashboard/leads', async (req, res) => {
    const { org_id } = req.query;
    if (!org_id) return res.status(400).json({ error: 'Missing org_id' });
  
    const { data, error } = await supabase.from('leads').select('*').eq('organization_id', org_id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ leads: data });
  });

export default router;