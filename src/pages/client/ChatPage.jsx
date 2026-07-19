// src/pages/client/ChatPage.jsx

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { MessageBubble }  from '../../components/client/chat/MessageBubble';
import { MessageSkeleton }from '../../components/client/chat/MessageSkeleton';
import { MessageInput }   from '../../components/client/chat/MessageInput';
import { MissionPanel }   from '../../components/client/chat/MissionPanel';
import { getMessages, getConversationContext } from '../../services/chatService';

import {
  PageHeader,
  Avatar,
  Button,
  StatusBadge,
  SkeletonLoader,
  Phone,
  Info,
} from '../../components/commons';



const CURRENT_USER_ID = 'usr_abc123'; // S2 mock — remplacé par JWT en S3

// ─── Keyframe bulle ───────────────────────────────────────────────────────────
const MSG_ANIM = `
  @keyframes slMsgIn {
    from { opacity: 0; transform: translateY(5px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

// ─── Header squelette ─────────────────────────────────────────────────────────
function HeaderSkeleton() {
  return (
    <div
      className="flex items-center gap-3 px-6 py-5 border-b bg-white"
      style={{ borderColor: 'var(--color-sl-200)' }}
    >
      <div
        className="w-9 h-9 rounded-full shrink-0 sl-animate-shimmer"
        style={{ background: 'var(--color-sl-200)' }}
      />
      <div className="space-y-2 flex-1">
        <div
          className="h-3 w-36 rounded sl-animate-shimmer"
          style={{ background: 'var(--color-sl-200)' }}
        />
        <div
          className="h-2 w-24 rounded sl-animate-shimmer"
          style={{ background: 'var(--color-sl-100)' }}
        />
      </div>
    </div>
  );
}

// ─── ChatPage ─────────────────────────────────────────────────────────────────
export default function ChatPage() {
  const { conversationId: paramId } = useParams();
  const activeId = paramId ?? 'conv_001';

  const [messages,  setMessages]  = useState([]);
  const [context,   setContext]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
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

  const handleAppel = useCallback(() => {
    if (context?.provider?.phone) {
      window.location.href = `tel:${context.provider.phone}`;
    }
  }, [context]);

  // ── Title compact — override le h1 de PageHeader via text-[15px] sur le span ──
  const headerTitle = loading || !context?.provider ? (
    <div className="flex items-center gap-2">
      <div
        className="w-8 h-8 rounded-full shrink-0 sl-animate-shimmer"
        style={{ background: 'var(--color-sl-200)' }}
      />
      <div
        className="h-3 w-28 rounded sl-animate-shimmer"
        style={{ background: 'var(--color-sl-200)' }}
      />
    </div>
  ) : (
    <div className="flex items-center gap-2 min-w-0">
      <Avatar
        initial={context.provider.avatarInitial}
        size="sm"
        isOnline={context.provider.isOnline}
      />
      <div className="min-w-0">
        {/*
          text-[15px] sur ce span override le font-size hérité du h1 (20px),
          ce qui évite le wrap sur 3 lignes en mobile.
        */}
        <p
          className="text-[15px] font-semibold truncate leading-tight"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-sl-900)' }}
        >
          {context.provider.fullName}
        </p>
        <p
          className="text-xs leading-tight"
          style={{ color: 'var(--color-sl-400)', fontFamily: 'var(--font-body)' }}
        >
          {context.provider.isOnline
            ? <span style={{ color: 'var(--color-success)' }}>En ligne</span>
            : 'Hors ligne'
          }
          {' · '}{context.provider.category}
        </p>
      </div>
    </div>
  );

  // ── Actions — badge masqué sur très petit écran pour éviter la troncature ──
  const headerActions = (
    <div className="flex items-center gap-1.5 shrink-0">
      {/* Bouton Mission — mobile uniquement */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setPanelOpen(true)}
        className="md:hidden"
      >
        <Info size={15} />
        <span className="text-xs">Mission</span>
      </Button>

      {/* Appeler */}
      <Button variant="ghost" size="sm" onClick={handleAppel}>
        <Phone size={15} />
      </Button>

      {/* Badge statut — masqué sur mobile si pas de place */}
      {context?.mission && (
        <div className="hidden sm:block">
          <StatusBadge label="Mission en cours" variant="en_cours" />
        </div>
      )}
    </div>
  );

  return (
    <>
      <style>{MSG_ANIM}</style>

      <div className="flex h-full min-h-0">

        {/* ── Zone chat ───────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-h-0 bg-white overflow-hidden">

          <PageHeader
            title={headerTitle}
            actions={headerActions}
            className="py-3 px-4"
          />

          {/* Thread scrollable */}
          <div
            ref={threadRef}
            className="flex-1 overflow-y-auto py-4"
            style={{ background: 'var(--color-sl-50)' }}
          >
            {loading
              ? <MessageSkeleton />
              : messages.length === 0
                ? (
                  <div className="flex items-center justify-center h-full">
                    <p
                      className="text-sm"
                      style={{ color: 'var(--color-sl-400)', fontFamily: 'var(--font-body)' }}
                    >
                      Aucun message pour l'instant.
                    </p>
                  </div>
                )
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

        {/* ── Panel mission ────────────────────────────────────────────── */}
        <MissionPanel
          context={context}
          loading={loading}
          isOpen={panelOpen}
          onClose={() => setPanelOpen(false)}
        />
      </div>
    </>
  );
}