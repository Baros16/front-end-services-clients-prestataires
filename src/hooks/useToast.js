// src/hooks/useToast.js
import { useState, useCallback, useRef } from 'react';

export function useToast() {
  const [toast,    setToast]  = useState(null);
  const timerRef              = useRef(null);

  const showToast = useCallback((type, message, duration = 3000) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ type, message, duration });
    timerRef.current = setTimeout(() => setToast(null), duration);
  }, []);

  const dismissToast = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast(null);
  }, []);

  return { toast, showToast, dismissToast };
}