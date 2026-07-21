// src/hooks/useProviderLocation.js
import { useState, useEffect, useCallback } from 'react';
import { usePolling }        from './usePolling';
import { getMissionDetails } from '../services/clientService';

const POLL_INTERVAL_MS = 10_000; // 10s — position non critique, pas besoin de plus

/**
 * Suit la position du prestataire pendant une mission active.
 * Côté CLIENT uniquement — lecture seule.
 *
 * - Charge la position initiale au mount.
 * - Poll GET /client/missions/:id toutes les 10s.
 * - Arrête le polling si mission.status !== 'en_cours'.
 * - Met en pause si l'onglet est masqué (Visibility API via usePolling).
 *
 * @param {string|null} missionId
 *
 * @returns {{
 *   providerLocation: { lat: number, lng: number, label: string, sublabel: string } | null,
 *   missionStatus:    string | null,
 *   loading:          boolean,
 *   error:            string | null,
 * }}
 */
export function useProviderLocation(missionId) {
  const [providerLocation, setProviderLocation] = useState(null);
  const [missionStatus,    setMissionStatus]    = useState(null);
  const [loading,          setLoading]          = useState(true);
  const [error,            setError]            = useState(null);

  // ── Chargement initial ──────────────────────────────────────────────────
  useEffect(() => {
    if (!missionId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getMissionDetails(missionId)
      .then(mission => {
        if (cancelled) return;
        setProviderLocation(mission.providerLocation ?? null);
        setMissionStatus(mission.status);
      })
      .catch(err => {
        if (cancelled) return;
        console.error('[useProviderLocation] chargement:', err);
        setError('Impossible de charger la localisation du prestataire.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [missionId]);

  // ── Polling ─────────────────────────────────────────────────────────────
  const poll = useCallback(async () => {
    if (!missionId) return;
    try {
      const mission = await getMissionDetails(missionId);
      setProviderLocation(mission.providerLocation ?? null);
      setMissionStatus(mission.status);
    } catch {
      // Échec silencieux — la dernière position connue reste affichée
    }
  }, [missionId]);

  // Polling actif seulement si la mission est en cours
  usePolling(poll, POLL_INTERVAL_MS, {
    enabled:         !loading && !!missionId && missionStatus === 'en_cours',
    pauseWhenHidden: true,
  });

  return { providerLocation, missionStatus, loading, error };
}