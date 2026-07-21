// src/hooks/useGeolocation.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { reverseGeocode } from '../utils/geocoder';

/**
 * Hook de géolocalisation navigateur.
 *
 * @param {object}  options
 * @param {boolean} options.autoRequest    - Demande la position au mount (défaut: false)
 * @param {boolean} options.withAddress    - Reverse geocode après obtention (défaut: false)
 * @param {object}  options.fallback       - Coords si permission refusée ({ lat, lng })
 *                                           Défaut : Bafoussam { lat: 5.4764, lng: 10.4176 }
 *
 * @returns {{
 *   lat:     number | null,
 *   lng:     number | null,
 *   address: string | null,
 *   loading: boolean,
 *   error:   'PERMISSION_DENIED' | 'NOT_SUPPORTED' | 'TIMEOUT' | null,
 *   request: function,
 * }}
 */
export function useGeolocation({
  autoRequest = false,
  withAddress = false,
  fallback    = { lat: 5.4764, lng: 10.4176 },
} = {}) {
  const [lat,     setLat]     = useState(null);
  const [lng,     setLng]     = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  // Évite les setState après unmount
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const request = useCallback(async () => {
    if (!navigator.geolocation) {
      if (mountedRef.current) {
        setError('NOT_SUPPORTED');
        if (fallback) { setLat(fallback.lat); setLng(fallback.lng); }
      }
      return;
    }

    if (mountedRef.current) { setLoading(true); setError(null); }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (!mountedRef.current) return;
        const { latitude, longitude } = pos.coords;
        setLat(latitude);
        setLng(longitude);

        if (withAddress) {
          const addr = await reverseGeocode(latitude, longitude);
          if (mountedRef.current) setAddress(addr);
        }

        if (mountedRef.current) setLoading(false);
      },
      (err) => {
        if (!mountedRef.current) return;
        const code =
          err.code === err.PERMISSION_DENIED ? 'PERMISSION_DENIED' :
          err.code === err.TIMEOUT           ? 'TIMEOUT'           :
                                               'NOT_SUPPORTED';
        setError(code);
        if (fallback) { setLat(fallback.lat); setLng(fallback.lng); }
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
    );
  }, [withAddress, fallback]);

  useEffect(() => {
    if (autoRequest) request();
  }, [autoRequest, request]);

  return { lat, lng, address, loading, error, request };
}