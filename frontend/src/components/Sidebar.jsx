/**
 * 🎮 Sidebar Component
 * Conversation list with new chat, delete, and navigation.
 */

import React, { useEffect } from "react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ isOpen, onClose, onNavigate }) {
  const { conversations, activeConversationId, loadConversations, loadConversation, startNewChat, removeConversation } = useChat();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user) loadConversations();
  }, [user, loadConversations]);

  function handleSelectConversation(id) {
    loadConversation(id);
    onClose?.();
  }

  function handleNewChat() {
    startNewChat();
    onClose?.();
  }

  function handleDelete(e, id) {
    e.stopPropagation();
    removeConversation(id);
  }

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? "sidebar-overlay--visible" : ""}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
        <div className="sidebar__header">
          <span className="sidebar__logo-icon">🎮</span>
          <span className="sidebar__logo">GameGuide AI</span>
        </div>

        <button className="sidebar__new-chat" onClick={handleNewChat} id="new-chat-btn">
          ＋ New Chat
        </button>

        <div className="sidebar__conversations">
          {conversations.length === 0 && (
            <div style={{ padding: "20px 14px", color: "var(--text-muted)", fontSize: "0.8rem", textAlign: "center" }}>
              No conversations yet
            </div>
          )}
          {conversations.map((conv) => (
            <button
              key={conv.id}
              className={`sidebar__conv-item ${activeConversationId === conv.id ? "sidebar__conv-item--active" : ""}`}
              onClick={() => handleSelectConversation(conv.id)}
            >
              <span style={{ fontSize: "0.9rem" }}>💬</span>
              <span className="sidebar__conv-title">{conv.title || "Untitled"}</span>
              <button className="sidebar__conv-delete" onClick={(e) => handleDelete(e, conv.id)} aria-label="Delete conversation">
                ✕
              </button>
            </button>
          ))}
        </div>

        <div className="sidebar__footer">
          <button className="sidebar__footer-btn" onClick={() => onNavigate?.("profile")} id="profile-btn">
            ⚙️ Profile
          </button>
          <button className="sidebar__footer-btn" onClick={logout} id="logout-btn">
            🚪 Logout
          </button>
        </div>
      </aside>
    </>
  );
}
