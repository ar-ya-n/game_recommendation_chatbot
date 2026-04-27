/**
 * 🎮 Chat Page
 * Main page combining Sidebar + ChatWindow + MessageInput.
 */

import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import ProfilePage from "./ProfilePage";
import { useChat } from "../context/ChatContext";

export default function ChatPage() {
  const { sendMessage, sending } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState("chat"); // "chat" or "profile"

  function handleSend(msg) {
    sendMessage(msg);
  }

  if (view === "profile") {
    return (
      <div className="app-layout">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onNavigate={setView} />
        <ProfilePage onBack={() => setView("chat")} />
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onNavigate={setView} />
      <div className="chat-area">
        <div className="chat-area__header">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
              ☰
            </button>
            <h1 className="chat-area__title">GameGuide AI</h1>
          </div>
          <div className="chat-area__status">
            <div className="chat-area__status-dot" />
            Online
          </div>
        </div>
        <ChatWindow onSendSuggestion={handleSend} />
        <MessageInput onSend={handleSend} disabled={sending} />
      </div>
    </div>
  );
}
