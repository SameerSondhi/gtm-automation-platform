import supabaseAdmin from '../lib/supabaseAdmin.js';

export const logActivity = async ({ user_id, organization_id, type, message, metadata = {} }) => {
  const { error } = await supabaseAdmin.from('activity_logs').insert({
    user_id,
    organization_id,
    type,
    message,
    metadata
  });
  if (error) console.error('[ActivityLog Error]', error.message);
};