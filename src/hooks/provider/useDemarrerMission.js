// src/hooks/useDemarrerMission.js
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../useToast";
import {
  getMissionById,
  addMissionSteps,
  startMission,
  updateStep,
  completeMission,
  getQuoteById,
} from "../../services/providerService";
import { getUserById } from "../../services/authService";

export function useDemarrerMission(missionId) {
  const navigate = useNavigate();
  const { toast, showToast, dismissToast } = useToast();

  const [mission, setMission] = useState(null);
  const [client, setClient]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [quote, setQuote]           = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError]     = useState(null);

  const [planningLoading, setPlanningLoading] = useState(false);
  const [planningError, setPlanningError]     = useState(null);

  const [startLoading, setStartLoading] = useState(false);
  const [startError, setStartError]     = useState(null);

  const [updatingStepId, setUpdatingStepId] = useState(null);

  const [completeLoading, setCompleteLoading] = useState(false);
  const [completeError, setCompleteError]     = useState(null);

  // ── Chargement mission + client ───────────────────────────────────────────
  const loadMission = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await getMissionById(missionId);
      if (!data) {
        setLoadError("not_found");
        return;
      }
      setMission(data);
      if (data.clientId) {
        const clientData = await getUserById(data.clientId);
        setClient(clientData);
      }
    } catch (err) {
      console.error("[useDemarrerMission] chargement:", err);
      setLoadError("fetch_error");
    } finally {
      setLoading(false);
    }
  }, [missionId]);

  useEffect(() => {
    loadMission();
  }, [loadMission]);

  // ── Chargement devis — dépend de mission.quoteId, chaîné séparément ──────
  useEffect(() => {
    if (!mission?.quoteId) return;
    let cancelled = false;

    setQuoteLoading(true);
    setQuoteError(null);

    getQuoteById(mission.quoteId)
      .then(data => { if (!cancelled) setQuote(data); })
      .catch(err => {
        console.error("[useDemarrerMission] devis:", err);
        if (!cancelled) setQuoteError("Impossible de charger le devis.");
      })
      .finally(() => { if (!cancelled) setQuoteLoading(false); });

    return () => { cancelled = true; };
  }, [mission?.quoteId]);

  // ── Planification (VUE A) ─────────────────────────────────────────────────
  const submitPlanning = useCallback(async ({ estimatedDurationHours, steps }) => {
    setPlanningLoading(true);
    setPlanningError(null);
    try {
      const result = await addMissionSteps(missionId, { estimatedDurationHours, steps });
      setMission(prev => ({
        ...prev,
        estimatedDurationHours: result.estimatedDurationHours,
        steps: result.steps,
      }));
    } catch (err) {
      console.error("[useDemarrerMission] planification:", err);
      setPlanningError(
        err?.response?.data?.error?.message ??
          "Impossible d'enregistrer la planification. Réessaie."
      );
    } finally {
      setPlanningLoading(false);
    }
  }, [missionId]);

  // ── Démarrage (VUE B) ─────────────────────────────────────────────────────
  const start = useCallback(async () => {
    setStartLoading(true);
    setStartError(null);
    try {
      const result = await startMission(missionId);
      setMission(prev => ({ ...prev, status: result.status, startedAt: result.startedAt }));
    } catch (err) {
      console.error("[useDemarrerMission] démarrage:", err);
      setStartError(
        err?.response?.data?.error?.message ??
          "Impossible de démarrer la mission. Vérifie ta connexion et réessaie."
      );
    } finally {
      setStartLoading(false);
    }
  }, [missionId]);

  // ── Cochage d'étape (VUE C) — optimistic + rollback via toast ─────────────
  const toggleStep = useCallback(async (stepId, completed) => {
    setUpdatingStepId(stepId);
    setMission(prev => ({
      ...prev,
      steps: prev.steps.map(s => (s.id === stepId ? { ...s, completed } : s)),
    }));
    try {
      await updateStep(missionId, stepId, completed);
    } catch (err) {
      console.error("[useDemarrerMission] step:", err);
      setMission(prev => ({
        ...prev,
        steps: prev.steps.map(s => (s.id === stepId ? { ...s, completed: !completed } : s)),
      }));
      showToast("error", "Impossible de mettre à jour cette étape. Réessaie.");
    } finally {
      setUpdatingStepId(null);
    }
  }, [missionId, showToast]);

  // ── Fin de mission (VUE C) ────────────────────────────────────────────────
  const complete = useCallback(async () => {
    setCompleteLoading(true);
    setCompleteError(null);
    try {
      await completeMission(missionId);
      navigate(`/provider/missions/${missionId}/termine`);
    } catch (err) {
      console.error("[useDemarrerMission] fin:", err);
      setCompleteError(
        err?.response?.data?.error?.message ??
          "Impossible de terminer la mission. Réessaie."
      );
    } finally {
      setCompleteLoading(false);
    }
  }, [missionId, navigate]);

  // ── Contact client (route provisoire, voir décision précédente) ──────────
  const contactClient = useCallback(() => {
    if (!mission?.demandId) {
      console.warn("[useDemarrerMission] Pas de conversation associée à cette mission");
      return;
    }
    navigate(`/provider/chat/${mission.demandId}`);
  }, [mission, navigate]);

  return {
    mission,
    client,
    loading,
    loadError,
    reload: loadMission,

    quote,
    quoteLoading,
    quoteError,

    planningLoading,
    planningError,
    submitPlanning,

    startLoading,
    startError,
    start,

    updatingStepId,
    toggleStep,

    completeLoading,
    completeError,
    complete,

    contactClient,

    toast,
    dismissToast,
  };
}