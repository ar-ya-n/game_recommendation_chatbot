/**
 * 🎮 MessageBubble Component
 * Renders individual user/assistant messages with avatars and timestamps.
 */

import React from "react";
import ReactMarkdown from "react-markdown";

function formatTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MessageBubble({ role, content, timestamp }) {
  const isUser = role === "user";
  return (
    <div className={`message-bubble message-bubble--${role}`}>
      <div className="message-bubble__avatar">
        {isUser ? "👤" : "🎮"}
      </div>
      <div>
        <div className="message-bubble__content">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        <div className="message-bubble__time">{formatTime(timestamp)}</div>
      </div>
    </div>
  );
}
