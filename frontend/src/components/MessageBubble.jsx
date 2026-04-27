/**
 * 🎮 MessageBubble Component
 * Renders individual user/assistant messages with avatars and timestamps.
 */

import React from "react";

function formatTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Simple markdown-like rendering (bold, lists, line breaks)
function renderContent(text) {
  if (!text) return null;
  // Split by double newline for paragraphs
  const paragraphs = text.split(/\n\n+/);
  return paragraphs.map((p, i) => {
    // Handle bullet points
    if (p.match(/^[\s]*[\-\*•]/m)) {
      const items = p.split(/\n/).filter(Boolean);
      return (
        <ul key={i}>
          {items.map((item, j) => (
            <li key={j}>{formatInline(item.replace(/^[\s]*[\-\*•]\s*/, ""))}</li>
          ))}
        </ul>
      );
    }
    // Handle numbered lists
    if (p.match(/^[\s]*\d+\./m)) {
      const items = p.split(/\n/).filter(Boolean);
      return (
        <ol key={i}>
          {items.map((item, j) => (
            <li key={j}>{formatInline(item.replace(/^[\s]*\d+\.\s*/, ""))}</li>
          ))}
        </ol>
      );
    }
    // Regular paragraph
    const lines = p.split("\n");
    return (
      <p key={i}>
        {lines.map((line, j) => (
          <React.Fragment key={j}>
            {formatInline(line)}
            {j < lines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    );
  });
}

function formatInline(text) {
  // Bold: **text** or __text__
  const parts = text.split(/(\*\*[^*]+\*\*|__[^_]+__)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("__") && part.endsWith("__")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
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
          {renderContent(content)}
        </div>
        <div className="message-bubble__time">{formatTime(timestamp)}</div>
      </div>
    </div>
  );
}
