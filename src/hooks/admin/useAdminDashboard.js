// src/hooks/admin/useAdminDashboard.js

import { useState, useEffect, useCallback } from "react";
import {
  getAdminDashboard,
  validateProvider,
  rejectProvider,
} from "../../services/adminService";

/**
 * useAdminDashboard
 *
 * Gère le fetch du dashboard admin et les actions inline sur les dossiers
 * (approbation / rejet) avec mise à jour optimiste de la liste.
 *
 * @returns {{
 *   data: import('./types').AdminDashboardData | null,
 *   isLoading: boolean,
 *   error: Error | null,
 *   handleApprove: (providerId: string) => Promise<void>,
 *   handleReject:  (providerId: string) => Promise<void>,
 * }}
 */
export function useAdminDashboard() {
  const [data,      setData]      = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getAdminDashboard();
      setData(result);
    } catch (err) {
      console.error("[useAdminDashboard] fetch error:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  /**
   * Valide un prestataire et le retire optimistement de la liste.
   */
  const handleApprove = useCallback(async (providerId) => {
    await validateProvider(providerId);
    setData((prev) => ({
      ...prev,
      pendingProviders: prev.pendingProviders.filter((p) => p.id !== providerId),
    }));
  }, []);

  /**
   * Rejette un dossier et le retire optimistement de la liste.
   */
  const handleReject = useCallback(async (providerId) => {
    await rejectProvider(providerId);
    setData((prev) => ({
      ...prev,
      pendingProviders: prev.pendingProviders.filter((p) => p.id !== providerId),
    }));
  }, []);

  return { data, isLoading, error, handleApprove, handleReject };
}
