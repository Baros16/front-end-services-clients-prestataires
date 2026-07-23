// src/hooks/useAvailableDemands.js
import { useState, useEffect, useCallback } from 'react';
import { useToast } from './useToast';
import { getAvailableDemands, applyToDemand } from '../services/providerService';
import { getDistanceKm, PRIORITY_ZONE_KM } from '../utils/geo';

/**
 * @param {number|null} providerLat - Latitude du prestataire (depuis useGeolocation)
 * @param {number|null} providerLng - Longitude du prestataire (depuis useGeolocation)
 *
 * distanceKm/zone sont dérivées ici depuis location.lat/lng (seul format fourni
 * par le contrat DemandResponse) — jamais lues depuis un champ brut de l'API/mock.
 */
export function useAvailableDemands(providerLat = null, providerLng = null) {
  const [demands,    setDemands]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [applyingId, setApplyingId] = useState(null);

  const { toast, showToast, dismissToast } = useToast();

  const enrichWithDistance = useCallback((raw) => {
    return raw.map((d) => {
      const distanceKm = getDistanceKm(providerLat, providerLng, d.location?.lat, d.location?.lng);
      const zone = distanceKm != null && distanceKm <= PRIORITY_ZONE_KM ? 'priority' : 'extended';
      return { ...d, distanceKm, zone };
    });
  }, [providerLat, providerLng]);

  // ── Chargement initial ─────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    getAvailableDemands()
      .then((res) => {
        if (!cancelled) {
          const raw = Array.isArray(res) ? res : res.data ?? [];
          setDemands(enrichWithDistance(raw));
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError('Impossible de charger les demandes. Veuillez réessayer.');
          console.error('[useAvailableDemands] fetch:', err);
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [enrichWithDistance]);

  // ── Refetch manuel (bouton Rafraîchir) ────────────────────────────────
  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAvailableDemands();
      const raw = Array.isArray(res) ? res : res.data ?? [];
      setDemands(enrichWithDistance(raw));
    } catch (err) {
      console.error('[useAvailableDemands] refetch:', err);
      setError('Impossible de charger les demandes. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }, [enrichWithDistance]);

  // ── Candidature — retrait optimiste après confirmation ─────────────────
  // Retourne { type, message } pour que la page puisse afficher le feedback
  // par carte. Les erreurs d'action remontent aussi via toast (aligné useChat).
  const apply = useCallback(async (demandId) => {
    if (applyingId) return null;
    setApplyingId(demandId);

    try {
      const res = await applyToDemand(demandId);
      // Retrait différé : laisse la page afficher le feedback de succès 1,8s
      setTimeout(() => {
        setDemands((prev) => prev.filter((d) => d.id !== demandId));
      }, 1800);
      return {
        type: 'success',
        message: res?.message ?? 'Candidature envoyée avec succès ! Le client sera notifié.',
      };
    } catch (err) {
      console.error('[useAvailableDemands] apply:', err);
      showToast('error', 'Erreur lors de la postulation. Veuillez réessayer.');
      return {
        type: 'error',
        message: 'Erreur lors de la postulation. Veuillez réessayer.',
      };
    } finally {
      setApplyingId(null);
    }
  }, [applyingId, showToast]);

  return {
    demands,
    loading,
    error,
    applyingId,
    refetch,
    apply,
    toast,
    dismissToast,
  };
}