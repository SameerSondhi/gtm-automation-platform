import supabaseAdmin from '../lib/supabaseAdmin.js';

export const createOrg = async (orgData) => {
  const { data, error } = await supabaseAdmin
    .from('organizations')
    .insert(orgData)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getOrgIdByUserId = async (user_id) => {
  const { data, error } = await supabaseAdmin
    .from('user_organizations')
    .select('organization_id')
    .eq('user_id', user_id)
    .single();
  if (error) throw error;
  return data.organization_id;
};