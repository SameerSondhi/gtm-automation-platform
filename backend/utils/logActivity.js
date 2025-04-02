import supabase from '../lib/supabaseAdmin.js'; // your service role instance

export const logActivity = async ({
  user_id,
  organization_id,
  type,
  message,
  metadata = {}
}) => {
  const { error } = await supabase.from('activity_logs').insert([
    {
      user_id,
      organization_id,
      type,
      message,
      metadata
    }
  ]);

  if (error) {
    console.error('🔴 Error logging activity:', error.message);
  }
};