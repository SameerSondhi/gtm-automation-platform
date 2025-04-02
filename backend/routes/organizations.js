import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ✅ Check if user is in an org
router.get('/org/check/:user_id', async (req, res) => {
  const { user_id } = req.params;

  const { data, error } = await supabase
    .from('user_organizations')
    .select('organization_id')
    .eq('user_id', user_id)
    .maybeSingle();

  if (error || !data) return res.json({ inOrg: false });

  res.json({ inOrg: true, orgId: data.organization_id });
});

// ✅ Create a new org and add user as admin
router.post('/org/create', async (req, res) => {
  const { user_id, name } = req.body;
  if (!user_id || !name) return res.status(400).json({ error: 'Missing fields' });

  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .insert({ name, created_by: user_id })
    .select()
    .single();

  if (orgError || !org) return res.status(500).json({ error: orgError.message });

  const { error: membershipError } = await supabase
    .from('user_organizations')
    .insert({ user_id, organization_id: org.id, role: 'admin' });

  if (membershipError) return res.status(500).json({ error: membershipError.message });

  res.status(201).json({ success: true, org });
});

// ✅ Get users (and their usernames) in an org
// GET /api/org/users?organization_id=xxx
// ✅ Updated GET /api/org/users
router.get('/org/users', async (req, res) => {
  const { organization_id } = req.query;
  if (!organization_id) return res.status(400).json({ error: 'Missing org id' });

  const { data, error } = await supabase
    .from('user_organizations')
    .select(`
      user_id,
      users (
        username
      )
    `)
    .eq('organization_id', organization_id);

  if (error) return res.status(500).json({ error: error.message });

  // Flatten response for frontend:
  const users = data.map((entry) => ({
    user_id: entry.user_id,
    username: entry.users?.username || 'Anonymous',
  }));

  res.json({ users });
});

export default router;