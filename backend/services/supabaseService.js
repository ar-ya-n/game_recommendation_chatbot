/**
 * 🎮 Supabase Database Service
 * Handles all database operations for users, conversations, messages, and profiles.
 */

const { createClient } = require("@supabase/supabase-js");
const logger = require("../utils/logger");

let supabase = null;

/**
 * Initialize Supabase client
 */
function initSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key || url === "your_supabase_url_here") {
    logger.warn("Supabase credentials not configured. Database features will be disabled.");
    return null;
  }

  supabase = createClient(url, key);
  logger.success("Supabase client initialized");
  return supabase;
}

/**
 * Get the Supabase client instance
 */
function getClient() {
  return supabase;
}

// ============================================
// USER OPERATIONS
// ============================================

async function createUser(email, username, passwordHash) {
  const { data, error } = await supabase
    .from("users")
    .insert({ email, username, password_hash: passwordHash })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function getUserByEmail(email) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

async function getUserById(userId) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// CONVERSATION OPERATIONS
// ============================================

async function createConversation(userId, title = "New Conversation") {
  const { data, error } = await supabase
    .from("conversations")
    .insert({ user_id: userId, title })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function getConversationsByUser(userId) {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

async function getConversationById(conversationId) {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", conversationId)
    .single();

  if (error) throw error;
  return data;
}

async function updateConversationTitle(conversationId, title) {
  const { data, error } = await supabase
    .from("conversations")
    .update({ title })
    .eq("id", conversationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function deleteConversation(conversationId) {
  const { error } = await supabase
    .from("conversations")
    .update({ is_active: false })
    .eq("id", conversationId);

  if (error) throw error;
  return true;
}

// ============================================
// MESSAGE OPERATIONS
// ============================================

async function saveMessage(conversationId, role, content, metadata = {}) {
  const { data, error } = await supabase
    .from("messages")
    .insert({ conversation_id: conversationId, role, content, metadata })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function getMessagesByConversation(conversationId, limit = 50) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("timestamp", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// ============================================
// USER PROFILE OPERATIONS
// ============================================

async function getOrCreateProfile(userId) {
  // Try to get existing profile
  let { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code === "PGRST116") {
    // Profile doesn't exist, create one
    const result = await supabase
      .from("user_profiles")
      .insert({ user_id: userId })
      .select()
      .single();

    if (result.error) throw result.error;
    return result.data;
  }

  if (error) throw error;
  return data;
}

async function updateProfile(userId, profileData) {
  const { data, error } = await supabase
    .from("user_profiles")
    .update(profileData)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

module.exports = {
  initSupabase,
  getClient,
  // Users
  createUser,
  getUserByEmail,
  getUserById,
  // Conversations
  createConversation,
  getConversationsByUser,
  getConversationById,
  updateConversationTitle,
  deleteConversation,
  // Messages
  saveMessage,
  getMessagesByConversation,
  // Profiles
  getOrCreateProfile,
  updateProfile,
};
