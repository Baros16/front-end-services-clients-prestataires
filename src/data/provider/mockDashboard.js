// src/data/provider/mockDashboard.js
// Fallback mock — réponse de GET /provider/dashboard
// Format exact : API_CONTRACT §7

import { mockUserProvider } from "../auth/mockUsers.js";

export const mockProviderDashboard = {
  success: true,
  data: {
    profile: mockUserProvider,

    stats: {
      activeMissions: 1,
      pendingQuotes: 2,
      completedThisMonth: 8,
      monthlyEarnings: 185000,
    },

    activeMissions: [
      {
        id: "msn_001",
        demandId: "dem_xyz789",
        quoteId: "quote_001",
        clientId: "usr_abc123",
        providerId: "usr_jcm456",
        category: "Plomberie",
        title: "Fuite cuisine — Madeleine K.",
        status: "en_cours",
        totalAmount: 23000,
        sequesteredAmount: 23000,
        paymentStatus: "sequestre",
        startedAt: "2026-05-21T09:32:00+01:00",
        estimatedDurationHours: 2,
        completedAt: null,
        steps: [
          { id: "step_001", label: "Coupure eau principale vérifiée",        completed: true,  order: 1 },
          { id: "step_002", label: "Démontage siphon fissuré",               completed: true,  order: 2 },
          { id: "step_003", label: "Remplacement joint silicone ×2",         completed: true,  order: 3 },
          { id: "step_004", label: "Installation siphon PVC neuf",           completed: true,  order: 4 },
          { id: "step_005", label: "Test d'étanchéité (5 min eau courante)", completed: false, order: 5 },
          { id: "step_006", label: "Nettoyage zone d'intervention",          completed: false, order: 6 },
        ],
        location: {
          address: "Bafoussam, Quartier Commercial",
          lat: 5.4764,
          lng: 10.4207,
        },
      },
    ],

    recentEarnings: [
      {
        id: "txn_890",
        reference: "#T-890",
        missionId: "msn_099",
        clientName: "Sylvie T.",
        category: "Plomberie",
        amount: 35000,
        commission: 2800,
        providerPayout: 32200,
        paymentMethod: "mtn_momo",
        status: "libere",
        createdAt: "2026-05-18T16:00:00+01:00",
      },
      {
        id: "txn_875",
        reference: "#T-875",
        missionId: "msn_098",
        clientName: "François N.",
        category: "Plomberie",
        amount: 28000,
        commission: 2240,
        providerPayout: 25760,
        paymentMethod: "orange_money",
        status: "libere",
        createdAt: "2026-05-15T11:00:00+01:00",
      },
    ],

    unreadMessages: 1,
  },
};
