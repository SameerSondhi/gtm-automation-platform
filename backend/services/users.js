// File: server/services/users.js
import supabaseAdmin from '../lib/supabaseAdmin.js';

// 🔍 Get user row from `users` table
export const getUserById = async (user_id) => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', user_id)
    .single();
  return { data, error };
};

// 📥 Update theme or other metadata
export const updateUserSettings = async (user_id, updates) => {
  const { error } = await supabaseAdmin
    .from('users')
    .update(updates)
    .eq('id', user_id);
  return { success: !error, error };
};

// 🎯 Get preferences from `user_preferences`
export const getUserPreferences = async (user_id) => {
  const { data, error } = await supabaseAdmin
    .from('user_preferences')
    .select('*')
    .eq('user_id', user_id)
    .single();
  return { data, error };
};

// 💾 Save or update preferences
export const saveUserPreferences = async (user_id, preferences) => {
  const { error } = await supabaseAdmin
    .from('user_preferences')
    .upsert({ user_id, ...preferences });
  return { success: !error, error };
};