/**
 * 🎮 Chat Context
 * React context for conversations, messages, loading states.
 */

import React, { createContext, useContext, useState, useCallback } from "react";
import * as api from "../services/api";

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const loadConversations = useCallback(async () => {
    try {
      const data = await api.getConversations();
      setConversations(data.conversations || []);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    }
  }, []);

  const loadConversation = useCallback(async (id) => {
    setLoading(true);
    try {
      const data = await api.getConversation(id);
      setMessages(data.messages || []);
      setActiveConversationId(id);
    } catch (err) {
      console.error("Failed to load conversation:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (message) => {
    setSending(true);
    // Optimistic user message
    const userMsg = { role: "user", content: message, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const data = await api.sendMessage(message, activeConversationId);
      if (data.isNewConversation) {
        setActiveConversationId(data.conversationId);
        loadConversations();
      }
      setMessages((prev) => [...prev, data.message]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Sorry, something went wrong. Please try again.", timestamp: new Date().toISOString() }]);
      console.error("Send failed:", err);
    } finally {
      setSending(false);
    }
  }, [activeConversationId, loadConversations]);

  const startNewChat = useCallback(() => {
    setActiveConversationId(null);
    setMessages([]);
  }, []);

  const removeConversation = useCallback(async (id) => {
    try {
      await api.deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConversationId === id) {
        setActiveConversationId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }, [activeConversationId]);

  return (
    <ChatContext.Provider value={{
      conversations, activeConversationId, messages, loading, sending,
      loadConversations, loadConversation, sendMessage, startNewChat, removeConversation,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be inside ChatProvider");
  return ctx;
}
