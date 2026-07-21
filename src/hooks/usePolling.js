// src/hooks/usePolling.js

import { useEffect, useRef, useCallback } from 'react';

export function usePolling(fn, interval = 3_000, {
  enabled         = true,
  pauseWhenHidden = true,
} = {}) {
  // Ref sur fn : permet de changer la fonction sans relancer l'intervalle
  const fnRef    = useRef(fn);
  const timerRef = useRef(null);

  useEffect(() => { fnRef.current = fn; }, [fn]);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    stop();
    timerRef.current = setInterval(() => {
      // Ne pas appeler si onglet masqué
      if (pauseWhenHidden && document.visibilityState === 'hidden') return;
      fnRef.current();
    }, interval);
  }, [interval, pauseWhenHidden, stop]);

  // Démarrer / arrêter selon enabled
  useEffect(() => {
    if (!enabled) { stop(); return; }
    start();
    return stop;
  }, [enabled, start, stop]);

  // Appel immédiat quand l'onglet redevient visible (rattrapage des messages manqués)
  useEffect(() => {
    if (!pauseWhenHidden) return;

    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && enabled) {
        fnRef.current();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [pauseWhenHidden, enabled]);
}