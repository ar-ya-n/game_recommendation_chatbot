/**
 * 🎮 ChatWindow Component
 * Main chat display with messages, typing indicator, and empty state.
 */

import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { useChat } from "../context/ChatContext";

const SUGGESTIONS = [
  "I'm new to gaming, what should I play?",
  "Best story-driven RPGs?",
  "Free games to play right now",
  "I have 2 hours, what should I play?",
  "Hidden gem indie games?",
  "Best multiplayer games for friends",
];

export default function ChatWindow({ onSendSuggestion }) {
  const { messages, sending, loading } = useChat();
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  if (loading) {
    return (
      <div className="chat-messages">
        <div className="chat-messages__empty">
          <div className="typing-indicator">
            <div className="typing-indicator__dot" />
            <div className="typing-indicator__dot" />
            <div className="typing-indicator__dot" />
          </div>
          <div className="chat-messages__empty-sub">Loading conversation...</div>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="chat-messages">
        <div className="chat-messages__empty">
          <div className="chat-messages__empty-icon">🎮</div>
          <div className="chat-messages__empty-title">Welcome to GameGuide AI</div>
          <div className="chat-messages__empty-sub">
            Your personal AI game recommendation specialist. Tell me about your gaming preferences, 
            and I'll suggest the perfect games for you!
          </div>
          <div className="chat-messages__suggestions">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                className="chat-messages__suggestion-chip"
                onClick={() => onSendSuggestion(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-messages">
      {messages.map((msg, i) => (
        <MessageBubble key={i} role={msg.role} content={msg.content} timestamp={msg.timestamp} />
      ))}
      {sending && (
        <div className="message-bubble message-bubble--assistant">
          <div className="message-bubble__avatar">🎮</div>
          <div className="message-bubble__content">
            <div className="typing-indicator">
              <div className="typing-indicator__dot" />
              <div className="typing-indicator__dot" />
              <div className="typing-indicator__dot" />
            </div>
          </div>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}
