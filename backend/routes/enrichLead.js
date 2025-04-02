import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import {logActivity} from '../utils/logActivity.js';
const router = express.Router();

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

router.post('/enrich-lead', async (req, res) => {
  const {
    name,
    email,
    company,
    title,
    user_id,
    organization_id
  } = req.body;

  if (!name || !email || !company) {
    return res.status(400).json({ error: 'Missing required lead fields' });
  }

  const prompt = `You are a lead enrichment expert. Given the following data:

- Name: ${name}
- Email: ${email}
- Company: ${company}
${title ? `- Title: ${title}` : ''}

Generate:
1. A 1-sentence persona summary.
2. A lead score (1-100) based on intent.
3. A suggested outreach tone.

Respond only in JSON format. Example:
{
  "persona_summary": "...",
  "lead_score": 87,
  "outreach_tone": "Professional and concise"
}
`;

  try {
    const response = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const message = response.data.choices[0]?.message?.content;

    const jsonMatch = message.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON block found in AI response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    await supabase
  .from('leads')
  .update({
    persona_summary: parsed.persona_summary,
    lead_score: parsed.lead_score,
    outreach_tone: parsed.outreach_tone,
    enriched_at: new Date().toISOString()
  })
  .eq('id', req.body.id) 

    // ✅ Log successful enrichment
    await logActivity({
      user_id,
      organization_id,
      type: 'ai-enrichment',
      message: `Enriched lead "${name}" (${email})`,
      metadata: { lead_score: parsed.lead_score, outreach_tone: parsed.outreach_tone }
    });

    return res.status(200).json({ success: true, enrichment: parsed });
  } catch (err) {
    console.error('[Enrich Error]', err.message);

    // 🔴 Log failure
    await logActivity({
      user_id,
      organization_id,
      type: 'ai-error',
      message: `Failed to enrich lead "${name}" (${email})`,
      metadata: { error: err.message }
    });

    return res.status(500).json({ error: 'Failed to enrich lead', details: err.message });
  }
});

export default router;