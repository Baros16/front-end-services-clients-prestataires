import React, { useState } from "react";

import ChatHeader from "../../components/ChatHeader";
import ChatMessages from "../../components/ChatMessages";
import ChatInput from "../../components/ChatInput";
import initialMessages from "../../data/messages";

const ChatPrestataire = () => {
  const [messages, setMessages] = useState(initialMessages);

  const formatTime = (date) =>
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  // 📩 TEXT MESSAGE
  const handleSend = (message) => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      type: "sent",
      text: message.trim(),
      time: formatTime(new Date()),
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  // 📎 FILE UPLOAD
  const handleAttach = (event) => {
    const file = event.target?.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");

    const newMessage = {
      id: Date.now(),
      type: "sent",
      time: formatTime(new Date()),
      fileName: file.name,
      fileType: file.type,
      fileUrl: isImage ? URL.createObjectURL(file) : null,
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  // 📷 CAMERA
  const handleCamera = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";

    input.onchange = handleAttach;
    input.click();
  };

  const handleFinalizeQuote = () => {
    console.log("Finalize quote");
  };

  const handleOpenMenu = () => {
    console.log("Open menu");
  };

  return (
    <div className="h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">

      {/* Decorative background shapes */}
      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-teal-300/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-80px] right-[-80px] w-72 h-72 bg-indigo-300/30 rounded-full blur-3xl"></div>

      {/* CHAT CONTAINER */}
      <div className="relative w-full max-w-6xl h-[95vh] bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-white/40">

        {/* HEADER */}
        <ChatHeader
          name="Sarah Jenkins"
          status="Online now"
          avatar="/images/sarah.jpg"
          onFinalizeQuote={handleFinalizeQuote}
          onOpenMenu={handleOpenMenu}
        />

        {/* MESSAGES */}
        <main className="flex-1 overflow-hidden bg-gradient-to-b from-white to-slate-50">
          <ChatMessages
            messages={messages}
            dayLabel="Today"
            showQuoteDraft={true}
          />
        </main>

        {/* INPUT */}
        <ChatInput
          onSend={handleSend}
          onAttach={() => {
            document.getElementById("file-upload")?.click();
          }}
          onCamera={handleCamera}
        />

        {/* hidden file input */}
        <input
          id="file-upload"
          type="file"
          accept="image/*,.pdf,.doc,.docx"
          className="hidden"
          onChange={handleAttach}
        />

      </div>
    </div>
  );
};

export default ChatPrestataire;