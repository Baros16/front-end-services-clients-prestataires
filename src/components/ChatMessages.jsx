import React, { useEffect, useRef } from "react";

import MessageBubble from "./MessageBubble";
import ImageMessage from "./ImageMessage";
import QuoteDraftCard from "./QuoteDraftCard";

const ChatMessages = ({
  messages,
  dayLabel = "Today",
  showQuoteDraft = true,
}) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="h-full overflow-y-auto bg-[#f5f7fb] px-6 py-6 scroll-smooth">
      <div className="max-w-4xl mx-auto">

        <div className="flex justify-center mb-6">
          <span className="bg-white shadow-sm border border-gray-200 px-4 py-1 rounded-full text-xs text-gray-500">
            {dayLabel}
          </span>
        </div>

        <div className="space-y-4">
          {messages.map((message) => {
            if (message.type === "image") {
              return (
                <ImageMessage
                  key={message.id}
                  message={message}
                />
              );
            }

            return (
              <MessageBubble
                key={message.id}
                message={message}
              />
            );
          })}

          {showQuoteDraft && <QuoteDraftCard />}

          <div ref={endRef} />
        </div>

      </div>
    </div>
  );
};

export default ChatMessages;