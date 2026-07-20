// src/hooks/useLocationBroadcast.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { updateMissionLocation } from '../services/providerService';

// ─── Constantes de throttle ───────────────────────────────────────────────────
const MIN_DISTANCE_M  = 50;     // Envoyer si déplacement > 50m
const MIN_INTERVAL_MS = 15_000; // Ou si > 15s sans envoi

// ─── Haversine — distance en mètres entre deux points GPS ────────────────────
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R  = 6_371_000; // Rayon Terre en mètres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;
  const a  = Math.sin(Δφ / 2) ** 2
           + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Broadcast de position GPS pendant une mission active.
 * Côté PRESTATAIRE uniquement — écriture.
 *
 * ⚠️ Dépend de : PATCH /provider/missions/:id/location (v2.2)
 *    En mode mock, la position est simulée sans appel réseau.
 *
 * Throttle :
 *   - N'envoie que si déplacement > 50m par rapport à la dernière position envoyée
 *   - OU si plus de 15s se sont écoulées sans envoi
 *
 * @param {string|null} missionId - ID de la mission active
 *
 * @returns {{
 *   broadcasting: boolean,
 *   lastSent:     string | null,   — ISO timestamp du dernier envoi réussi
 *   error:        'PERMISSION_DENIED' | 'NOT_SUPPORTED' | null,
 *   start:        function,
 *   stop:         function,
 * }}
 */
export function useLocationBroadcast(missionId) {
  const [broadcasting, setBroadcasting] = useState(false);
  const [lastSent,     setLastSent]     = useState(null);
  const [error,        setError]        = useState(null);

  // Refs — pas de re-render souhaité sur ces valeurs internes
  const watchIdRef      = useRef(null);  // ID du watchPosition actif
  const lastPositionRef = useRef(null);  // { lat, lng } du dernier envoi
  const lastSentTimeRef = useRef(null);  // Timestamp ms du dernier envoi

  // ── Stop ──────────────────────────────────────────────────────────────────
  const stop = useCallback(() => {
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setBroadcasting(false);
  }, []);

  // ── Start ─────────────────────────────────────────────────────────────────
  const start = useCallback(() => {
    if (!missionId) return;

    if (!navigator.geolocation) {
      setError('NOT_SUPPORTED');
      return;
    }

    // Ne pas démarrer deux watches simultanément
    if (watchIdRef.current != null) return;

    setError(null);
    setBroadcasting(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      async ({ coords }) => {
        const { latitude: lat, longitude: lng } = coords;
        const now  = Date.now();
        const last = lastPositionRef.current;
        const lastTime = lastSentTimeRef.current;

        // ── Décision d'envoi (throttle) ──────────────────────────────────
        const movedEnough = last
          ? haversineDistance(last.lat, last.lng, lat, lng) > MIN_DISTANCE_M
          : true;

        const enoughTimeElapsed = lastTime
          ? (now - lastTime) >= MIN_INTERVAL_MS
          : true;

        if (!movedEnough && !enoughTimeElapsed) return;

        // ── Envoi ─────────────────────────────────────────────────────────
        try {
          await updateMissionLocation(missionId, lat, lng);
          lastPositionRef.current = { lat, lng };
          lastSentTimeRef.current = now;
          setLastSent(new Date(now).toISOString());
        } catch (err) {
          // Échec silencieux — on réessaiera au prochain tick watchPosition
          console.error('[useLocationBroadcast] envoi:', err);
        }
      },
      (posErr) => {
        const code = posErr.code === posErr.PERMISSION_DENIED
          ? 'PERMISSION_DENIED'
          : 'NOT_SUPPORTED';
        setError(code);
        setBroadcasting(false);
        watchIdRef.current = null;
      },
      {
        enableHighAccuracy: true,
        timeout:            10_000,
        maximumAge:         5_000,  // Accepter une position < 5s pour économiser la batterie
      },
    );
  }, [missionId]);

  // ── Cleanup au unmount ou changement de missionId ─────────────────────────
  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { broadcasting, lastSent, error, start, stop };
}