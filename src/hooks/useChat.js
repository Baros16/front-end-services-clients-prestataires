// src/hooks/useChat.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { usePolling }     from './usePolling';
import { useToast }       from './useToast';
import {
  getMessages,
  sendMessage,
  getProviderMessages,
  sendProviderMessage,
  deleteClientMessage,
  deleteProviderMessage,
} from '../services/chatService';

function getCurrentUserId() {
  try {
    const token = localStorage.getItem('serviloc_access');
    if (!token) return 'b2adb724-8bd7-46b3-b527-b564f5c05a59';
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId ?? payload.sub ?? null;
  } catch {
    return 'b2adb724-8bd7-46b3-b527-b564f5c05a59';
  }
}

function getServiceFns(role) {
  if (role === 'provider') {
    return {
      fetchFn:  getProviderMessages,
      sendFn:   sendProviderMessage,
      deleteFn: deleteProviderMessage,
    };
  }
  return {
    fetchFn:  getMessages,
    sendFn:   sendMessage,
    deleteFn: deleteClientMessage,
  };
}

export function useChat(conversationId, role = 'client') {
  const [messages,   setMessages]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [sending,    setSending]    = useState(false);
  const [error,      setError]      = useState(null);
  const [deletedIds, setDeletedIds] = useState(() => new Set());

  const { toast, showToast, dismissToast } = useToast();
  const { fetchFn, sendFn, deleteFn }      = getServiceFns(role);
  const currentUserId                      = getCurrentUserId();
  const pendingIds                         = useRef(new Set());

  // ── Reset sur changement de conversation ──────────────────────────────────
  useEffect(() => {
    setDeletedIds(new Set());
  }, [conversationId]);

  // ── Chargement initial ────────────────────────────────────────────────────
  useEffect(() => {
    if (!conversationId) return;
    let cancelled = false;

    setLoading(true);
    setMessages([]);
    setError(null);

    fetchFn(conversationId)
      .then(msgs  => { if (!cancelled) setMessages(msgs); })
      .catch(err  => { if (!cancelled) setError('Impossible de charger les messages.'); console.error(err); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [conversationId, role]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Polling ───────────────────────────────────────────────────────────────
  const poll = useCallback(async () => {
  if (!conversationId) return;
  try {
    const fresh     = await fetchFn(conversationId);
    const serverIds = new Set(fresh.map(m => m.id));

    setMessages(prev => {
      const existingNonPending = prev.filter(m => !pendingIds.current.has(m.id));
      const existingIds        = new Set(existingNonPending.map(m => m.id));
      const trulyNew           = fresh.filter(m => !existingIds.has(m.id));
      const stillPending       = prev.filter(
        m => pendingIds.current.has(m.id) && !serverIds.has(m.id),
      );

      const merged = [...existingNonPending, ...trulyNew, ...stillPending];
      // Dédoublonnage défensif par id — garde la dernière occurrence
      const byId = new Map(merged.map(m => [m.id, m]));
      return [...byId.values()].sort(
        (a, b) => new Date(a.sentAt) - new Date(b.sentAt),
      );
    });
  } catch {
    // Échec silencieux
  }
}, [conversationId, fetchFn]);
  usePolling(poll, 3_000, {
    enabled:         !loading && !!conversationId,
    pauseWhenHidden: true,
  });

  // ── Envoi ─────────────────────────────────────────────────────────────────
  const send = useCallback(async (content, imageId = null, imageUrl = null) => {
    const trimmed = content?.trim() ?? '';
    if (!trimmed && !imageId) return;

    const optimisticId = `pending_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    pendingIds.current.add(optimisticId);

    const optimistic = {
      id:             optimisticId,
      conversationId,
      senderId:       currentUserId,
      senderRole:     role,
      content:        trimmed,
      imageId:        imageId  ?? null,
      imageUrl:       imageUrl ?? null,
      read:           false,
      sentAt:         new Date().toISOString(),
      _pending:       true,
    };

    setMessages(prev => [...prev, optimistic]);
    setSending(true);

    try {
      // FIX : currentUserId transmis pour que le mock retourne le bon senderId
      const confirmed = await sendFn(conversationId, trimmed, imageId, currentUserId);
      pendingIds.current.delete(optimisticId);
      setMessages(prev =>
        prev.map(m =>
          m.id === optimisticId
            ? { ...confirmed, imageUrl: confirmed.imageUrl ?? imageUrl ?? null, _pending: false }
            : m,
        ),
      );
    } catch (err) {
      console.error('[useChat] envoi:', err);
      pendingIds.current.delete(optimisticId);
      setMessages(prev => prev.filter(m => m.id !== optimisticId));
      showToast('error', "Impossible d'envoyer le message. Réessayez.");
    } finally {
      setSending(false);
    }
  }, [conversationId, role, currentUserId, sendFn, showToast]);

  // ── Suppression ───────────────────────────────────────────────────────────
  const deleteMessage = useCallback(async (messageId) => {
    setDeletedIds(prev => new Set([...prev, messageId]));

    try {
      // FIX : deleteFn résout la bonne route selon le rôle (client ou provider)
      await deleteFn(conversationId, messageId);
    } catch (err) {
      console.error('[useChat] deleteMessage:', err);
      setDeletedIds(prev => {
        const next = new Set(prev);
        next.delete(messageId);
        return next;
      });
      showToast('error', 'Impossible de supprimer ce message. Réessayez.');
    }
  }, [conversationId, deleteFn, showToast]);

  // ── Messages enrichis ─────────────────────────────────────────────────────
  const enrichedMessages = messages.map(m => ({
    ...m,
    deleted: deletedIds.has(m.id) || m.deleted === true,
  }));

  return {
    messages:     enrichedMessages,
    loading,
    sending,
    error,
    currentUserId,
    send,
    deleteMessage,
    toast,
    dismissToast,
  };
}