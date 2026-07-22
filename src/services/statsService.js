// src/services/statsService.js

import { getMock } from './mockSwitch.js';
import mockStats   from '../data/admin/mock_stats.json';
import apiClient   from './apiClient.js';

/**
 * Génère 23 points journaliers synthétiques pour Mai 2026.
 * Utilisés par MissionChart — le mock ne fournit que des agrégats mensuels.
 */
function generateDailyPoints(totalCompleted) {
  const base  = Math.floor(totalCompleted / 23);
  const noise = [1.2,0.8,1.1,0.9,1.3,1.0,0.7,1.4,1.1,0.9,
                 1.2,1.0,0.8,1.3,1.1,0.9,1.2,1.0,1.4,1.1,
                 0.8,1.3,1.0];
  return Array.from({ length: 23 }, (_, i) => ({
    day:   i + 1,
    label: String(i + 1).padStart(2, '0'),
    value: Math.round(base * noise[i]),
  }));
}

/**
 * Données complètes de StatisticsPage.
 * En S2 : mock enrichi avec valeurs statiques.
 * En S3 : GET /admin/stats?period=2026-05
 */
export async function getStats() {
  const raw = await getMock(
    mockStats.data,
    () => apiClient.get('/admin/stats'),
  );

  return {
    ...raw,
    // Valeurs S2 statiques absentes du mock
    satisfaction:      { value: 4.6,  trend: +0.2 },
    providers:         { active: 89,  total: 134 },
    disputeRate:       { value: 4.2,  target: 5.0 },
    avgResolutionDays: 1.8,
    kpiTrends: {
      revenue:        +31,
      commission:     +31,
      completionRate: +3,
    },
    dailyPoints: generateDailyPoints(raw.missions.completed),
  };
}