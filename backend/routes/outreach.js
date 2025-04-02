// // File: server/routes/outreach.js
// import express from 'express';
// import { createClient } from '@supabase/supabase-js';

// const router = express.Router();
// const supabase = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_SERVICE_ROLE_KEY
// );

// // POST /api/outreach/generate
// router.post('/generate', async (req, res) => {
//   const lead = req.body;
//   try {
//     const response = await fetch('http://localhost:4000/api/generate-outreach', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(lead),
//     });

//     const result = await response.json();

//     if (!result.success) {
//       return res.status(400).json({ success: false, error: result.error });
//     }

//     const { error } = await supabase
//       .from('leads')
//       .update({ outreach_message: result.outreach_message })
//       .eq('id', lead.id);

//     if (error) {
//       return res.status(500).json({ success: false, error: error.message });
//     }

//     return res.json({ success: true, outreach_message: result.outreach_message });
//   } catch (err) {
//     return res.status(500).json({ success: false, error: err.message });
//   }
// });



// export default router;
