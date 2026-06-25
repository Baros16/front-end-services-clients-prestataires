// src/components/service-client/MediationChatPanel.jsx
import { useState } from 'react';

export default function MediationChatPanel({
  clientMessages,
  providerMessages,
  activeParty,
  onPartyChange,
  onSend,
  agentId,
}) {
  const [inputValue, setInputValue] = useState('');

  const messages = activeParty === 'client' ? clientMessages : providerMessages;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onSend(inputValue);
    setInputValue('');
  };

  return (
    <div className="border rounded-lg p-4 bg-white flex flex-col h-full">
      <h3 className="font-bold text-lg mb-2">Médiation</h3>

      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => onPartyChange('client')}
          className={`px-3 py-1 rounded ${activeParty === 'client' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
        >
          Client
        </button>
        <button
          type="button"
          onClick={() => onPartyChange('provider')}
          className={`px-3 py-1 rounded ${activeParty === 'provider' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
        >
          Prestataire
        </button>
      </div>

      <div className="flex-1 overflow-y-auto mb-3 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded max-w-[80%] ${
              msg.senderId === agentId ? 'bg-blue-50 ml-auto' : 'bg-gray-100'
            }`}
          >
            <p className="text-xs font-semibold mb-1">{msg.senderName}</p>
            <p className="text-sm">{msg.content}</p>
            {msg.attachmentUrl && (
              <a href={msg.attachmentUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline">
                Voir la pièce jointe
              </a>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Écrire un message..."
          className="flex-1 border rounded px-2 py-1"
        />
        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">
          Envoyer
        </button>
      </form>
    </div>
  );
}
