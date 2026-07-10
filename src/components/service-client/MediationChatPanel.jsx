// src/components/service-client/MediationChatPanel.jsx
import { useState } from "react";
import { Card, Button } from "../commons";
import { MessageCircle } from "lucide-react";

export default function MediationChatPanel({
  clientMessages,
  providerMessages,
  activeParty,
  onPartyChange,
  onSend,
  agentId,
  clientName,
  providerName,
}) {
  const [inputValue, setInputValue] = useState("");
  const messages = activeParty === "client" ? clientMessages : providerMessages;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onSend(inputValue);
    setInputValue("");
  };

  return (
    <Card title="Contact avec les parties" noPadding>
      <div className="flex flex-col p-5 gap-3" style={{ minHeight: "480px" }}>
        <div className="flex gap-2">
          <Button
            variant={activeParty === "client" ? "primary" : "ghost"}
            size="sm"
            onClick={() => onPartyChange("client")}
            className={`flex-1 ${activeParty === "client" ? "bg-sl-900 hover:bg-sl-800" : ""}`}
          >
            <span className="flex flex-col items-center leading-tight">
              <span className="flex items-center gap-1">
                <MessageCircle size={14} />
                Client
              </span>
              <span className="text-xs opacity-80">({clientName})</span>
            </span>
          </Button>
          <Button
            variant={activeParty === "provider" ? "primary" : "ghost"}
            size="sm"
            onClick={() => onPartyChange("provider")}
            className={`flex-1 ${activeParty === "provider" ? "bg-sl-900 hover:bg-sl-800" : ""}`}
          >
            <span className="flex flex-col items-center leading-tight">
              <span className="flex items-center gap-1">
                <MessageCircle size={14} />
                Prestataire
              </span>
              <span className="text-xs opacity-80">({providerName})</span>
            </span>
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3">
          {messages.map((msg) => {
            const isAgent = msg.senderId === agentId;
            return (
              <div
                key={msg.id}
                className={`p-3 rounded-[var(--radius-md)] max-w-[85%] ${
                  isAgent ? "bg-sl-900 text-white ml-auto" : "bg-sl-100 text-sl-800"
                }`}
              >
                <p className={`text-xs font-semibold mb-1 ${isAgent ? "text-white opacity-75" : "text-sl-500"}`}>
                  {msg.senderName}
                </p>
                <p className="text-sm">{msg.content}</p>
                {msg.attachmentUrl && (
                  <span
                    onClick={() => window.open(msg.attachmentUrl, "_blank")}
                    className={`text-xs underline mt-1 block cursor-pointer ${isAgent ? "text-white opacity-75" : "text-brand"}`}
                  >
                    Voir la piece jointe
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Votre message a la partie..."
            className="flex-1 border border-sl-200 rounded-[var(--radius-md)] px-3 py-2 text-sm outline-none focus:border-brand"
          />
          <Button type="submit" size="md" className="bg-sl-900 hover:bg-sl-800">
            Envoyer
          </Button>
        </form>
      </div>
    </Card>
  );
}
