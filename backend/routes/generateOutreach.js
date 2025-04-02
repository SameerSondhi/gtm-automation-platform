// File: server/routes/generateOutreach.js
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { logActivity } from '../utils/logActivity.js';
const router = express.Router();

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// POST /api/outreach/generate
router.post('/generate', async (req, res) => {
  const {
    id,
    name,
    email,
    company,
    title,
    persona_summary,
    outreach_tone,
    user_id,
    organization_id
  } = req.body;

  if (!name || !email || !company || !persona_summary || !outreach_tone) {
    return res.status(400).json({ error: 'Missing required fields for outreach generation' });
  }

  const prompt = `You are an expert GTM strategist. Craft a personalized cold outreach message based on the following lead data:

Name: ${name}
Title: ${title || 'N/A'}
Company: ${company}
Email: ${email}
Persona Summary: ${persona_summary}
Tone: ${outreach_tone}

Keep it concise, persuasive, and professional. Return ONLY the email body as plain text.`;

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
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const message = response.data.choices[0]?.message?.content?.trim();
    if (!message) throw new Error('Empty response from model');

    // ✅ Save outreach message to Supabase
    const { error: updateError } = await supabase
      .from('leads')
      .update({ outreach_message: message })
      .eq('id', id);

    if (updateError) {
      throw new Error(`Supabase update failed: ${updateError.message}`);
    }

    // ✅ Log AI message generation
    await logActivity({
      user_id,
      organization_id,
      type: 'ai-outreach',
      message: `Generated outreach message for "${name}" (${email})`,
      metadata: { company, title, outreach_tone }
    });

    return res.status(200).json({ success: true, outreach_message: message });
  } catch (err) {
    console.error('[Outreach Error]', err?.response?.data || err.message);

    // 🔴 Log error
    await logActivity({
      user_id,
      organization_id,
      type: 'ai-error',
      message: `Failed to generate outreach for "${name}" (${email})`,
      metadata: { error: err.message }
    });

    return res.status(500).json({ error: 'Failed to generate outreach message' });
  }
});

// POST /api/outreach/save
router.post('/save', async (req, res) => {
  const { id, message } = req.body;
  try {
    const { error } = await supabase
      .from('leads')
      .update({ outreach_message: message })
      .eq('id', id);

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/outreach/sent
router.post('/sent', async (req, res) => {
  const { id, sent } = req.body;
  try {
    const { error } = await supabase
      .from('leads')
      .update({ sent })
      .eq('id', id);

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;