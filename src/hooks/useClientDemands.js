import { useState, useEffect } from 'react';
import { getClientDemands } from '../services/clientService';


export function useClientDemands(status = '') {
  const [demands, setDemands] = useState([]);
  const [meta, setMeta]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getClientDemands(status ? { status } : {})
      .then(({ data, meta }) => {
        if (cancelled) return;
        setDemands(data);
        setMeta(meta);
      })
      .catch(() => {
        if (cancelled) return;
        setError('Impossible de charger vos demandes.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [status]);

  return { demands, meta, loading, error };
}