/**
 * 🎮 MessageInput Component
 * Text input with send button and auto-resize.
 */

import React, { useState, useRef } from "react";

export default function MessageInput({ onSend, disabled }) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    const msg = text.trim();
    if (!msg || disabled) return;
    onSend(msg);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  function handleInput(e) {
    setText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  }

  return (
    <div className="message-input">
      <form className="message-input__form" onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          className="message-input__field"
          placeholder="Ask for game recommendations..."
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={disabled}
          id="message-input-field"
        />
        <button
          type="submit"
          className="message-input__send"
          disabled={disabled || !text.trim()}
          id="send-message-btn"
          aria-label="Send message"
        >
          ➤
        </button>
      </form>
    </div>
  );
}
