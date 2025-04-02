import supabaseAdmin from '../lib/supabaseAdmin.js';

export const getLeadsByOrg = async (orgId) => {
  const { data, error } = await supabaseAdmin
    .from('leads')
    .select('*')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const insertLeads = async (lead) => {
  const { data, error } = await supabaseAdmin
    .from('leads')
    .insert(lead);
  if (error) throw error;
  return data;
};

export const getLeadsByUserId = async (user_id) => {
    const { data, error } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });
  
    return { data, error };
  };