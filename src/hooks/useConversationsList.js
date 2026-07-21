// src/hooks/useConversationsList.js
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getConversations, getProviderConversations } from "../services/chatService";

export function useConversationsList(role = "client") {
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFn = role === "provider" ? getProviderConversations : getConversations;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFn();
      setConversations(data);
    } catch (err) {
      console.error("[useConversationsList] chargement:", err);
      setError("Impossible de charger les conversations.");
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    load();
  }, [load]);

  const openConversation = useCallback((conversationId) => {
    navigate(`/${role}/chat/${conversationId}`);
  }, [navigate, role]);

  return {
    conversations,
    loading,
    error,
    reload: load,
    openConversation,
  };
}