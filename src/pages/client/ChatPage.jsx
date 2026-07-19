// src/pages/client/ChatPage.jsx

import { useState, useEffect, useRef } from 'react';
import { useParams }                   from 'react-router-dom';

import { MessageBubble }  from '../../components/client/chat/MessageBubble';
import { MessageSkeleton } from '../../components/client/chat/MessageSkeleton';
import { MessageInput }   from '../../components/client/chat/MessageInput';
import { MissionPanel }   from '../../components/client/chat/MissionPanel';

import {
  PageHeader,
  Avatar,
  Button,
  StatusBadge,
  Toast,
  Phone,
  Info,
} from '../../components/commons';

import { useChat }                from '../../hooks/useChat';
import { getConversationContext } from '../../services/chatService';

// ─── Header squelette ─────────────────────────────────────────────────────────
function HeaderSkeleton() {
  return (
    <div className="flex items-center gap-3 px-6 py-5 border-b"
      style={{ borderColor: 'var(--color-sl-200)', background: '#ffffff' }}>
      <div className="w-9 h-9 rounded-full shrink-0 sl-animate-shimmer"
        style={{ background: 'var(--color-sl-200)' }} />
      <div className="space-y-2 flex-1">
        <div className="h-3 w-36 rounded sl-animate-shimmer"
          style={{ background: 'var(--color-sl-200)' }} />
        <div className="h-2 w-24 rounded sl-animate-shimmer"
          style={{ background: 'var(--color-sl-100)' }} />
      </div>
    </div>
  );
}

// ─── Animation message ────────────────────────────────────────────────────────
const MSG_ANIM = `
  @keyframes slMsgIn {
    from { opacity: 0; transform: translateY(5px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

// ─── ChatPage ─────────────────────────────────────────────────────────────────
export default function ChatPage() {
  const { conversationId: paramId } = useParams();
  const activeId = paramId ?? 'conv_001';

  // ── Chat : messages, polling, envoi, optimistic update ──────────────────
  const {
    messages,
    loading:      messagesLoading,
    sending,
    currentUserId,
    send,
    toast,
    dismissToast,
    deleteMessage,
  } = useChat(activeId, 'client');

  // ── Contexte mission + prestataire (panel droit) ─────────────────────────
  const [context,        setContext]        = useState(null);
  const [contextLoading, setContextLoading] = useState(true);
  const [panelOpen,      setPanelOpen]      = useState(false);

  useEffect(() => {
    setContext(null);
    setContextLoading(true);
    getConversationContext(activeId)
      .then(setContext)
      .catch(console.error)
      .finally(() => setContextLoading(false));
  }, [activeId]);

  // Scroll automatique au dernier message
  const threadRef = useRef(null);
  useEffect(() => {
  if (!messagesLoading && messages.length > 0) {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }
}, [messagesLoading]);
  const prevLengthRef = useRef(0);
  useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    const hasNew     = messages.length > prevLengthRef.current;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 150;
    if (hasNew && isNearBottom) {
      el.scrollTop = el.scrollHeight;
    }

    prevLengthRef.current = messages.length;
  }, [messages.length]);

  const handleAppel = () => {
    if (context?.provider?.phone) {
      window.location.href = `tel:${context.provider.phone}`;
    }
  };

  // ── Loading combiné ──────────────────────────────────────────────────────
  const headerLoading = contextLoading || (!context && messagesLoading);

  // ── Titre du header ──────────────────────────────────────────────────────
  const headerTitle = headerLoading || !context?.provider ? (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full shrink-0 sl-animate-shimmer"
        style={{ background: 'var(--color-sl-200)' }} />
      <div className="h-3 w-28 rounded sl-animate-shimmer"
        style={{ background: 'var(--color-sl-200)' }} />
    </div>
  ) : (
    <div className="flex items-center gap-2 min-w-0">
      <Avatar
        initial={context.provider.avatarInitial}
        size="sm"
        isOnline={context.provider.isOnline}
      />
      <div className="min-w-0">
        <p className="text-[15px] font-semibold truncate leading-tight"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-sl-900)' }}>
          {context.provider.fullName}
        </p>
        <p className="text-xs leading-tight"
          style={{ color: 'var(--color-sl-400)', fontFamily: 'var(--font-body)' }}>
          {context.provider.isOnline
            ? <span style={{ color: 'var(--color-success)' }}>En ligne</span>
            : 'Hors ligne'
          }
          {' · '}{context.provider.category}
        </p>
      </div>
    </div>
  );

  // ── Actions header ───────────────────────────────────────────────────────
  const headerActions = (
    <div className="flex items-center gap-1.5 shrink-0">
      <Button variant="ghost" size="sm"
        onClick={() => setPanelOpen(true)}
        className="md:hidden">
        <Info size={15} />
        <span className="text-xs">Mission</span>
      </Button>

      <Button variant="ghost" size="sm" onClick={handleAppel}
        disabled={!context?.provider?.phone}>
        <Phone size={15} />
      </Button>

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
      <Toast toast={toast} onDismiss={dismissToast} />

      <div className="flex h-full min-h-0">

        {/* ── Zone chat ─────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden"
          style={{ background: '#ffffff' }}>

          {/* Header */}
          {headerLoading
            ? <HeaderSkeleton />
            : (
              <PageHeader
                title={headerTitle}
                actions={headerActions}
                className="py-3 px-4"
              />
            )
          }

          {/* Thread scrollable */}
          <div
            ref={threadRef}
            className="flex-1 overflow-y-auto py-4"
            style={{ background: 'var(--color-sl-50)' }}
          >
            {messagesLoading ? (
              <MessageSkeleton />
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm"
                  style={{ color: 'var(--color-sl-400)', fontFamily: 'var(--font-body)' }}>
                  Aucun message pour l'instant.
                </p>
              </div>
            ) : (
              messages.map(msg => {
                const isOwn = msg.senderRole === "client"
                return(
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    isOwn={msg.senderRole === "client"}
                    pending={msg._pending === true}
                    onDelete={
                      isOwn && !msg._pending && !msg.deleted
                        ? () => deleteMessage(msg.id)
                        : undefined
                    }
                  />
              )})
            )}
          </div>

          {/* Saisie */}
          <MessageInput
            onSend={send}
            disabled={messagesLoading || sending}
          />
        </div>

        {/* ── Panel mission ─────────────────────────────────────────────── */}
        <MissionPanel
          context={context}
          loading={contextLoading}
          isOpen={panelOpen}
          onClose={() => setPanelOpen(false)}
        />
      </div>
    </>
  );
}