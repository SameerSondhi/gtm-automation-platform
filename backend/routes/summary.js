import express from 'express';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import { logActivity } from '../utils/logActivity.js';

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// POST /api/summary/daily
router.post('/daily', async (req, res) => {
  const { organization_id } = req.body;
  if (!organization_id) {
    return res.status(400).json({ error: 'Missing organization_id' });
  }

  // 1. Check if summary exists and is recent
  const { data: existing, error: fetchErr } = await supabase
    .from('daily_summaries')
    .select('*')
    .eq('organization_id', organization_id)
    .order('generated_at', { ascending: false })
    .limit(1)
    .single();

  const now = new Date();
  const shouldRegenerate =
    !existing ||
    !existing.generated_at ||
    new Date(existing.generated_at).getTime() < now.getTime() - 4 * 60 * 60 * 1000;

  if (!shouldRegenerate) {
    return res.json({ summary: existing.summary, cached: true });
  }

  // 2. Fetch org messages and leads
  const [msgRes, leadRes] = await Promise.all([
    supabase.from('messages').select('*').eq('organization_id', organization_id),
    supabase.from('leads').select('*').eq('organization_id', organization_id),
  ]);

  if (msgRes.error || leadRes.error) {
    return res.status(500).json({ error: 'Failed to fetch org data' });
  }

  const unreadCount = msgRes.data.filter((m) => !(m.read_by || []).length).length;
  const syncedCount = leadRes.data.filter((l) => l.status === 'synced').length;
  const failedCount = leadRes.data.filter((l) => l.status === 'failed').length;
  const newLeads = leadRes.data.slice(-5).map((l) => l.name).join(', ') || 'None';

  // 3. Prompt generation
  const prompt = `
You are an AI GTM Assistant. Summarize recent org activity in under 3 sentences.

Data:
- Unread messages: ${unreadCount}
- Leads synced: ${syncedCount}
- Leads failed: ${failedCount}
- New leads: ${newLeads}
`;

  // 4. Use Together API via Axios
  try {
    const response = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        messages: [
          {
            role: 'system',
            content: 'You summarize GTM performance and collaboration updates for teams.',
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 120,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const message = response.data.choices?.[0]?.message?.content?.trim();
    if (!message) throw new Error('Empty summary response from model');

    // 5. Store summary
    await supabase
      .from('daily_summaries')
      .upsert([
        {
          organization_id,
          summary: message,
          generated_at: new Date().toISOString(),
        },
      ]);

    // 6. Log
    await logActivity({
      user_id: null,
      organization_id,
      type: 'summary-generated',
      message: '🧠 AI summary generated for org.',
    });

    return res.status(200).json({ summary: message, cached: false });
  } catch (err) {
    console.error('[Summary AI Error]', err?.response?.data || err.message);
    return res.status(500).json({ error: 'Failed to generate summary' });
  }
});

export default router;