/**
 * 🎮 API Service
 * Axios-based API client for backend calls.
 */

const API_BASE = "";

async function request(method, path, body = null) {
  const userId = localStorage.getItem("userId");
  const headers = { "Content-Type": "application/json" };
  if (userId) headers["x-user-id"] = userId;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE}${path}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// Auth
export async function signup(email, username, password) {
  return request("POST", "/auth/signup", { email, username, password });
}

export async function login(email, password) {
  return request("POST", "/auth/login", { email, password });
}

export async function logout() {
  return request("POST", "/auth/logout");
}

// Chat
export async function sendMessage(message, conversationId = null) {
  return request("POST", "/chat/message", { message, conversationId });
}

export async function getConversations() {
  return request("GET", "/chat/conversations");
}

export async function getConversation(id) {
  return request("GET", `/chat/conversation/${id}`);
}

export async function deleteConversation(id) {
  return request("DELETE", `/chat/conversation/${id}`);
}

// User
export async function getProfile() {
  return request("GET", "/user/profile");
}

export async function updateProfile(data) {
  return request("PUT", "/user/profile", data);
}
