import React, { useState } from "react";

const ChatInput = ({ onSend, onAttach, onCamera }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    onSend(text.trim());
    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-4 px-8 py-4 border-t bg-white"
    >
      {/* 📎 Attach file */}
      <button
        type="button"
        onClick={onAttach}
        className="text-gray-500 text-xl hover:text-gray-700 transition"
        aria-label="Attach file"
      >
        📎
      </button>

      {/* 📷 Camera */}
      <button
        type="button"
        onClick={onCamera}
        className="text-gray-500 text-xl hover:text-gray-700 transition"
        aria-label="Open camera"
      >
        📷
      </button>

      {/* Input */}
      <input
        className="flex-1 border rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-teal-500"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* Send button */}
      <button
        type="submit"
        className="bg-teal-900 text-white w-12 h-12 rounded-xl hover:bg-teal-800 transition"
        aria-label="Send message"
      >
        ➤
      </button>
    </form>
  );
};

export default ChatInput;