// src/pages/client/ChatPage.jsx

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { ChatHeader }     from '../../components/client/chat/ChatHeader';
import { MessageBubble }  from '../../components/client/chat/MessageBubble';
import { MessageSkeleton }from '../../components/client/chat/MessageSkeleton';
import { MessageInput }   from '../../components/client/chat/MessageInput';
import { MissionPanel }   from '../../components/client/chat/MissionPanel';
import { getMessages, getConversationContext } from '../../services/chatService';

const CURRENT_USER_ID = 'usr_abc123'; // S2 mock — remplacé par JWT en S3

export default function ChatPage() {
  const { conversationId: paramId } = useParams();
  const activeId = paramId ?? 'conv_001';

  const [messages, setMessages] = useState([]);
  const [context,  setContext]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const threadRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setMessages([]);
    setContext(null);

    Promise.all([
      getMessages(activeId),
      getConversationContext(activeId),
    ])
      .then(([msgs, ctx]) => {
        setMessages(msgs);
        setContext(ctx);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeId]);

  // Auto-scroll bas à chaque nouveau message
  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const handleSend = useCallback((content) => {
    setMessages(prev => [...prev, {
      id:             `msg_local_${Date.now()}`,
      conversationId: activeId,
      senderId:       CURRENT_USER_ID,
      senderRole:     'client',
      content,
      imageUrl:       null,
      sentAt:         new Date().toISOString(),
      read:           false,
    }]);
  }, [activeId]);

  return (
    <>
      <style>{`
        @keyframes slMsgIn {
          from { opacity: 0; transform: translateY(5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="flex h-full min-h-0">

        <div className="flex-1 flex flex-col min-h-0 bg-white">
          <ChatHeader provider={context?.provider} loading={loading} />

          <div ref={threadRef} className="flex-1 overflow-y-auto py-4"
            style={{ background: 'var(--color-sl-50)' }}>
            {loading
              ? <MessageSkeleton />
              : messages.map(msg => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    isOwn={msg.senderId === CURRENT_USER_ID}
                  />
                ))
            }
          </div>

          <MessageInput onSend={handleSend} disabled={loading} />
        </div>

        <MissionPanel context={context} loading={loading} />
      </div>
    </>
  );
}